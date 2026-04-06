-- Preuves : empreinte SHA-256 (intégrité type « LuVu light ») + FK vers profiles pour jointure uploader

alter table public.proofs
  add column if not exists file_hash text;

comment on column public.proofs.file_hash is 'SHA-256 hex (64 caractères) du fichier au moment de l''upload ; null pour les lignes historiques.';

alter table public.proofs
  drop constraint if exists proofs_uploaded_by_fkey;

alter table public.proofs
  add constraint proofs_uploaded_by_fkey
  foreign key (uploaded_by) references public.profiles(id) on delete restrict;

alter table public.proofs
  drop constraint if exists proofs_file_hash_format_chk;

alter table public.proofs
  add constraint proofs_file_hash_format_chk
  check (file_hash is null or file_hash ~ '^[a-f0-9]{64}$');

-- Affichage du nom sur les preuves (jointure proofs → profiles) : politique RLS sans récursion
-- → migration `006_profiles_rls_no_recursion.sql` (fonction security definer + policy « collègues »).

-- Append-only : aucune politique UPDATE sur proofs → refus par défaut (RLS).
-- Pas de politique DELETE non plus pour les sessions client : pas de suppression de preuve depuis l’app.
