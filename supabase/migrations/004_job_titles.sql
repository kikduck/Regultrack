-- Migration: Phase 1.4 — Postes personnalisables
-- Create job_titles table and link to employees

CREATE TABLE IF NOT EXISTS public.job_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, name)
);

-- Add job_title_id to employees
ALTER TABLE public.employees ADD COLUMN job_title_id UUID REFERENCES public.job_titles(id) ON DELETE SET NULL;

-- Enable RLS on job_titles
ALTER TABLE public.job_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view job titles of their organization" 
ON public.job_titles FOR SELECT 
USING (org_id IN (
    SELECT org_id FROM public.profiles WHERE id = auth.uid()
));

CREATE POLICY "Admins can manage job titles of their organization" 
ON public.job_titles FOR ALL 
USING (org_id IN (
    SELECT org_id FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
));

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_job_titles_org_id ON public.job_titles(org_id);
CREATE INDEX IF NOT EXISTS idx_employees_job_title_id ON public.employees(job_title_id);
