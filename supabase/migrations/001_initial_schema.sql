-- Regultrack initial schema

-- Organizations (tenants)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null default 'securite_privee',
  created_at timestamptz not null default now()
);

-- Profiles (linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete set null,
  full_name text not null default '',
  role text not null default 'owner' check (role in ('owner', 'admin', 'site_manager', 'employee')),
  created_at timestamptz not null default now()
);

-- Sites
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text not null default '',
  manager_email text,
  created_at timestamptz not null default now()
);

-- Employees
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  full_name text not null,
  email text,
  job_title text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Obligation templates (the sector knowledge registry)
create table public.obligation_templates (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  name text not null,
  description text not null default '',
  renewal_months integer not null,
  applies_to text not null check (applies_to in ('employee', 'site', 'organization')),
  proof_type text not null default 'pdf',
  alert_days integer[] not null default '{90,30,7}',
  created_at timestamptz not null default now()
);

-- Obligations (instances of templates for a given entity)
create table public.obligations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  template_id uuid not null references public.obligation_templates(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  due_date date,
  status text not null default 'missing' check (status in ('valid', 'expiring_soon', 'expired', 'missing')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proofs (documents attached to obligations)
create table public.proofs (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  file_url text not null,
  file_name text not null default '',
  uploaded_by uuid not null references auth.users(id),
  valid_from date,
  valid_until date,
  uploaded_at timestamptz not null default now()
);

-- Indexes
create index idx_sites_org on public.sites(org_id);
create index idx_employees_org on public.employees(org_id);
create index idx_employees_site on public.employees(site_id);
create index idx_obligations_org on public.obligations(org_id);
create index idx_obligations_template on public.obligations(template_id);
create index idx_obligations_employee on public.obligations(employee_id);
create index idx_obligations_site on public.obligations(site_id);
create index idx_obligations_status on public.obligations(status);
create index idx_obligations_due_date on public.obligations(due_date);
create index idx_proofs_obligation on public.proofs(obligation_id);

-- Row Level Security
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.sites enable row level security;
alter table public.employees enable row level security;
alter table public.obligation_templates enable row level security;
alter table public.obligations enable row level security;
alter table public.proofs enable row level security;

-- RLS Policies: users can only see data from their organization
create policy "Users can view their own organization"
  on public.organizations for select
  using (id = (select org_id from public.profiles where id = auth.uid()));

create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can view sites in their org"
  on public.sites for select
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Admins can manage sites in their org"
  on public.sites for all
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Users can view employees in their org"
  on public.employees for select
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Admins can manage employees in their org"
  on public.employees for all
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Anyone can view obligation templates"
  on public.obligation_templates for select
  using (true);

create policy "Users can view obligations in their org"
  on public.obligations for select
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Admins can manage obligations in their org"
  on public.obligations for all
  using (org_id = (select org_id from public.profiles where id = auth.uid()));

create policy "Users can view proofs in their org"
  on public.proofs for select
  using (
    obligation_id in (
      select id from public.obligations
      where org_id = (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Users can insert proofs for their org obligations"
  on public.proofs for insert
  with check (
    obligation_id in (
      select id from public.obligations
      where org_id = (select org_id from public.profiles where id = auth.uid())
    )
  );

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'owner');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on obligations
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger obligations_updated_at
  before update on public.obligations
  for each row execute procedure public.update_updated_at();
