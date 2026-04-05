-- Migration 003: guardrails for rerunnable sector seeds
--
-- Why:
-- - we want to be able to sync sector knowledge without creating duplicates
-- - future sector seeds will use ON CONFLICT on (sector, name, applies_to)
-- - two legacy names are normalized here before adding the unique index

update public.obligation_templates
set name = 'Recyclage aptitude professionnelle (MAC)'
where sector = 'securite_privee'
  and applies_to = 'employee'
  and name = 'Recyclage aptitude professionnelle';

update public.obligation_templates
set name = 'Autorisation d''exercer (préfectorale / CNAPS)'
where sector = 'securite_privee'
  and applies_to = 'organization'
  and name = 'Autorisation d''exercer (préfectorale)';

with ranked_templates as (
  select
    id,
    first_value(id) over (
      partition by sector, name, applies_to
      order by created_at, id
    ) as keep_id
  from public.obligation_templates
),
duplicate_templates as (
  select id as duplicate_id, keep_id
  from ranked_templates
  where id <> keep_id
)
update public.obligations as o
set template_id = d.keep_id
from duplicate_templates as d
where o.template_id = d.duplicate_id;

with ranked_templates as (
  select
    id,
    first_value(id) over (
      partition by sector, name, applies_to
      order by created_at, id
    ) as keep_id
  from public.obligation_templates
)
delete from public.obligation_templates as ot
using ranked_templates as r
where ot.id = r.id
  and r.id <> r.keep_id;

create unique index if not exists idx_obligation_templates_sector_name_applies_to
  on public.obligation_templates (sector, name, applies_to);
