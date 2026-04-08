-- Activer le choix du secteur à la création d’organisation (page /setup).
-- Codes alignés sur obligation_templates.sector et src/lib/sectors.ts.
-- Secteurs listés : ceux pour lesquels des seeds standards existent (pas « pharmacies » tant qu’il n’y a pas de seed).

update public.saas_settings
set
  show_sector_onboarding = true,
  onboarding_sector_codes = array[
    'securite_privee',
    'creches',
    'ehpad',
    'ambulances'
  ]::text[],
  updated_at = now()
where id = 1;
