import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!resend) {
    console.warn("Resend API key is missing. Skipping email alerts.");
  }

  const supabase = createAdminClient();
  const alertThresholds = [90, 60, 30, 7]; // Thresholds to check
  const alertsSent: { email: string; obligation: string; days: number }[] = [];

  for (const days of alertThresholds) {
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Find obligations due on targetDate that haven't been alerted for this threshold yet
    const { data: obligations, error } = await supabase
      .from("obligations")
      .select(`
        id, org_id, due_date, status,
        obligation_templates(name, alert_days, alert_message_template, renewal_process, required_documents),
        custom_obligation_templates(name, alert_days, alert_message_template, renewal_process, required_documents),
        employees(full_name, email),
        sites(name, manager_email),
        organizations(name)
      `)
      .eq("due_date", targetDate)
      .in("status", ["valid", "expiring_soon"]);

    if (error || !obligations) continue;

    for (const obligation of obligations) {
      const template = (obligation.obligation_templates || obligation.custom_obligation_templates) as any;
      if (!template) continue;

      // Check if this specific threshold is configured for this template
      if (!template.alert_days?.includes(days)) continue;

      // Check if alert already sent for this obligation and threshold
      const { data: existingLog } = await supabase
        .from("alert_logs")
        .select("id")
        .eq("obligation_id", obligation.id)
        .eq("alert_type", `J-${days}`)
        .limit(1)
        .single();

      if (existingLog) continue;

      const employee = obligation.employees as any;
      const site = obligation.sites as any;
      const org = obligation.organizations as any;

      const recipientEmail = employee?.email || site?.manager_email;
      if (!recipientEmail) continue;

      const entityName = employee?.full_name || site?.name || "votre organisation";
      const subject = `⚠️ Rappel : Expiration de l'obligation "${template.name}" pour ${entityName}`;
      
      const body = template.alert_message_template || `
        Bonjour,
        
        Ceci est un rappel automatique concernant l'obligation : **${template.name}** pour **${entityName}**.
        
        Cette obligation arrive à échéance le **${new Date(obligation.due_date as string).toLocaleDateString("fr-FR")}** (dans ${days} jours).
        
        **Procédure de renouvellement :**
        ${template.renewal_process || "Non renseignée."}
        
        **Pièces requises :**
        ${template.required_documents || "Non renseignées."}
        
        Merci de mettre à jour cette preuve sur votre tableau de bord Regultrack dès que possible.
        
        Cordialement,
        L'équipe Regultrack
      `;

      if (resend) {
        try {
          await resend.emails.send({
            from: 'Regultrack <alerte@regultrack.com>', // User needs to verify domain in Resend
            to: recipientEmail,
            subject: subject,
            html: body.replace(/\n/g, '<br>'),
          });

          // Log the alert
          await supabase.from("alert_logs").insert({
            org_id: obligation.org_id,
            obligation_id: obligation.id,
            recipient_email: recipientEmail,
            alert_type: `J-${days}`
          });

          alertsSent.push({
            email: recipientEmail,
            obligation: template.name,
            days,
          });
        } catch (err) {
          console.error(`Failed to send email to ${recipientEmail}:`, err);
        }
      } else {
        // Simulation mode
        alertsSent.push({
          email: recipientEmail,
          obligation: template.name,
          days,
        });
      }
    }
  }

  return NextResponse.json({
    alerts_sent: alertsSent.length,
    details: alertsSent,
    simulated: !resend
  });
}
