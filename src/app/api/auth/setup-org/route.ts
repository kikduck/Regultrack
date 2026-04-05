import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { orgName, fullName } = await request.json();

  if (!orgName || !fullName) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, sector: "securite_privee" })
    .select()
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: orgError?.message || "Erreur création org" }, { status: 500 });
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ org_id: org.id, full_name: fullName })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Auto-create organization obligations
  const { data: templates } = await admin
    .from("obligation_templates")
    .select("id")
    .eq("sector", org.sector)
    .eq("applies_to", "organization");

  if (templates && templates.length > 0) {
    // Check if they already exist (just in case of retry)
    const { data: existing } = await admin
      .from("obligations")
      .select("template_id")
      .eq("org_id", org.id)
      .is("site_id", null)
      .is("employee_id", null);
      
    const existingIds = new Set(existing?.map(e => e.template_id) || []);
    const toInsert = templates
      .filter(t => !existingIds.has(t.id))
      .map((t) => ({
        org_id: org.id,
        template_id: t.id,
        status: "missing" as const,
      }));

    if (toInsert.length > 0) {
      await admin.from("obligations").insert(toInsert);
    }
  }

  return NextResponse.json({ orgId: org.id });
}
