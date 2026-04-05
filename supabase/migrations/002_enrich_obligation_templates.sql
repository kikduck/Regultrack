-- Migration 002: Enrich obligation_templates with sector knowledge

ALTER TABLE public.obligation_templates
ADD COLUMN renewal_process text,
ADD COLUMN required_documents text,
ADD COLUMN competent_authority text,
ADD COLUMN official_url text,
ADD COLUMN legal_reference text,
ADD COLUMN alert_message_template text,
ADD COLUMN inspection_order integer,
ADD COLUMN inspection_section text,
ADD COLUMN help_text text,
ADD COLUMN last_verified_at date,
ADD COLUMN verified_by text,
ADD COLUMN active boolean not null default true;
