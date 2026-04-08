-- Plateforme : paramètres SaaS (lecture par utilisateurs authentifiés, édition via SQL / service role).
-- Permet d'activer le choix du secteur à l'onboarding quand plusieurs registres sont prêts.

create table public.saas_settings (
  id smallint primary key default 1,
  constraint saas_settings_single_row check (id = 1),
  show_sector_onboarding boolean not null default false,
  -- Codes alignés sur organizations.sector / obligation_templates.sector (snake_case).
  onboarding_sector_codes text[] not null default array['securite_privee']::text[],
  updated_at timestamptz not null default now()
);

comment on table public.saas_settings is 'Singleton (id=1). Contrôle l’affichage du choix secteur au setup et la liste proposée.';
comment on column public.saas_settings.show_sector_onboarding is 'Si true, le parcours /setup propose un secteur parmi onboarding_sector_codes.';
comment on column public.saas_settings.onboarding_sector_codes is 'Secteurs affichés à l’inscription quand show_sector_onboarding vaut true.';

insert into public.saas_settings (id, show_sector_onboarding, onboarding_sector_codes)
values (1, false, array['securite_privee']::text[]);

alter table public.saas_settings enable row level security;

create policy "Authenticated users can read saas_settings"
  on public.saas_settings
  for select
  to authenticated
  using (true);

create trigger saas_settings_updated_at
  before update on public.saas_settings
  for each row execute procedure public.update_updated_at();
