import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const alertDays = [90, 60, 30, 7];
  const alertsSent: { email: string; obligation: string; days: number }[] = [];

  for (const days of alertDays) {
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { data: obligations } = await supabase
      .from("obligations")
      .select(
        `
        id, due_date, status,
        obligation_templates(name, alert_days),
        employees(full_name, email),
        sites(name, manager_email),
        organizations(name)
      `
      )
      .eq("due_date", targetDate)
      .in("status", ["valid", "expiring_soon"]);

    if (!obligations) continue;

    for (const obligation of obligations) {
      const template = obligation.obligation_templates as unknown as {
        name: string;
        alert_days: number[];
      } | null;

      if (!template?.alert_days?.includes(days)) continue;

      const employee = obligation.employees as unknown as {
        full_name: string;
        email: string | null;
      } | null;
      const site = obligation.sites as unknown as {
        name: string;
        manager_email: string | null;
      } | null;

      const recipientEmail = employee?.email || site?.manager_email;

      if (!recipientEmail) continue;

      // TODO: Integrate Resend for actual email delivery
      alertsSent.push({
        email: recipientEmail,
        obligation: template.name,
        days,
      });
    }
  }

  return NextResponse.json({
    alerts_sent: alertsSent.length,
    details: alertsSent,
  });
}
