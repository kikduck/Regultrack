import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resolveSectorForNewOrganization } from "@/lib/sectors";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await request.json()) as { orgName?: unknown; fullName?: unknown; sector?: unknown };
  const orgName = typeof body.orgName === "string" ? body.orgName.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";

  if (!orgName || !fullName) {
    return NextResponse.json({ error: "Nom complet et nom d’entreprise requis" }, { status: 400 });
  }

  const { data: saasRow } = await supabase
    .from("saas_settings")
    .select("show_sector_onboarding, onboarding_sector_codes")
    .eq("id", 1)
    .maybeSingle();

  const showSector = saasRow?.show_sector_onboarding ?? false;
  const allowedCodes = Array.isArray(saasRow?.onboarding_sector_codes)
    ? (saasRow!.onboarding_sector_codes as string[])
    : ["securite_privee"];

  const resolved = resolveSectorForNewOrganization(showSector, allowedCodes, body.sector);
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }
  const sector = resolved.sector;

  const admin = createAdminClient();

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, sector })
    .select()
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: orgError?.message || "Erreur création org" }, { status: 500 });
  }

  const { data: updatedProfiles, error: profileError } = await admin
    .from("profiles")
    .update({ org_id: org.id, full_name: fullName })
    .eq("id", user.id)
    .select("id");

  if (profileError || !updatedProfiles?.length) {
    await admin.from("organizations").delete().eq("id", org.id);
    return NextResponse.json(
      {
        error:
          profileError?.message ||
          "Impossible de lier votre profil à l’organisation (profil introuvable). Déconnectez-vous puis reconnectez-vous.",
      },
      { status: 500 }
    );
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
      const { error: obError } = await admin.from("obligations").insert(toInsert);
      if (obError) {
        console.error("[setup-org] obligations insert:", obError.message);
      }
    }
  }

  // Habilitations perso (schéma optionnel selon migrations) : ne pas faire échouer tout le setup
  const { data: customTemplates, error: customFetchError } = await admin
    .from("custom_obligation_templates")
    .select("id")
    .eq("org_id", org.id)
    .eq("applies_to", "organization")
    .eq("active", true);

  if (customFetchError) {
    console.error("[setup-org] custom_obligation_templates:", customFetchError.message);
  } else if (customTemplates && customTemplates.length > 0) {
    const { data: existingCustom } = await admin
      .from("obligations")
      .select("custom_template_id")
      .eq("org_id", org.id)
      .is("site_id", null)
      .is("employee_id", null);

    const existingCustomIds = new Set(
      existingCustom?.map((e) => e.custom_template_id) || []
    );
    const customToInsert = customTemplates
      .filter((t) => !existingCustomIds.has(t.id))
      .map((t) => ({
        org_id: org.id,
        custom_template_id: t.id,
        status: "missing" as const,
      }));

    if (customToInsert.length > 0) {
      const { error: cErr } = await admin.from("obligations").insert(customToInsert);
      if (cErr) {
        console.error("[setup-org] custom obligations insert:", cErr.message);
      }
    }
  }

  return NextResponse.json({ orgId: org.id });
}
