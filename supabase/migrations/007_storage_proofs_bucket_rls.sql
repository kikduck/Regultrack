-- Bucket Storage « proofs » + RLS sur storage.objects
-- Sans politiques INSERT, l’upload client échoue avec :
-- « new row violates row-level security policy » (voir page upload preuve).

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do update set public = excluded.public;

-- Lecture : URLs publiques /object/public/proofs/... (sans session)
drop policy if exists "proofs_public_read" on storage.objects;
create policy "proofs_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'proofs');

-- Upload : chemin imposé par l’app = {auth.uid()}/{obligation_id}/...
-- + obligation dans l’organisation du profil (org_id non null)
drop policy if exists "proofs_authenticated_insert" on storage.objects;
create policy "proofs_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'proofs'
    and coalesce((string_to_array(name, '/'))[1], '') = auth.uid()::text
    and exists (
      select 1
      from public.obligations o
      join public.profiles p on p.org_id = o.org_id and p.id = auth.uid()
      where o.id = (string_to_array(name, '/'))[2]::uuid
    )
  );

-- Mise à jour / remplacement de fichier (même chemin ou upsert futur)
drop policy if exists "proofs_authenticated_update" on storage.objects;
create policy "proofs_authenticated_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'proofs'
    and coalesce((string_to_array(name, '/'))[1], '') = auth.uid()::text
    and exists (
      select 1
      from public.obligations o
      join public.profiles p on p.org_id = o.org_id and p.id = auth.uid()
      where o.id = (string_to_array(name, '/'))[2]::uuid
    )
  )
  with check (
    bucket_id = 'proofs'
    and coalesce((string_to_array(name, '/'))[1], '') = auth.uid()::text
    and exists (
      select 1
      from public.obligations o
      join public.profiles p on p.org_id = o.org_id and p.id = auth.uid()
      where o.id = (string_to_array(name, '/'))[2]::uuid
    )
  );
