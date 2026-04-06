-- Évite la récursion RLS sur `profiles` : une policy SELECT ne peut pas sous-requêter
-- sur la même table sans boucle infinie → 500 côté PostgREST.
-- Voir : https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

create or replace function public.get_auth_user_org_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select org_id from public.profiles where id = auth.uid() limit 1;
$$;

comment on function public.get_auth_user_org_id() is
  'Org du JWT (lecture sans ré-appliquer RLS sur profiles) — utilisé par les policies « collègues ».';

revoke all on function public.get_auth_user_org_id() from public;
grant execute on function public.get_auth_user_org_id() to authenticated;
grant execute on function public.get_auth_user_org_id() to service_role;

drop policy if exists "Users can view coworker profiles in same org" on public.profiles;

create policy "Users can view coworker profiles in same org"
  on public.profiles for select
  using (
    org_id is not null
    and org_id = public.get_auth_user_org_id()
  );
