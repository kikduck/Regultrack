-- Demo data: fictional security company "Sécurité Plus SARL"
-- Run AFTER seed_securite_privee.sql (needs obligation_templates to exist)
-- Replace 'OWNER_USER_ID' with the actual auth.users id after signup

-- Organization
INSERT INTO public.organizations (id, name, sector)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sécurité Plus SARL (Démo)', 'securite_privee');

-- Sites
INSERT INTO public.sites (id, org_id, name, address, manager_email)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Agence Paris Nord', '45 avenue de Flandre, 75019 Paris', 'paris@securiteplus-demo.fr'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Agence Lyon Part-Dieu', '12 rue de Bonnel, 69003 Lyon', 'lyon@securiteplus-demo.fr'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Agence Marseille Vieux-Port', '8 quai du Port, 13002 Marseille', 'marseille@securiteplus-demo.fr');

-- Employees (30 agents across 3 sites)
INSERT INTO public.employees (id, org_id, site_id, full_name, email, job_title)
VALUES
  -- Paris (12 agents)
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Antoine Duval', 'a.duval@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Marie Leblanc', 'm.leblanc@securiteplus-demo.fr', 'agent_ssiap'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Karim Benali', 'k.benali@securiteplus-demo.fr', 'chef_poste'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Sophie Martin', 's.martin@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Thomas Bernard', 't.bernard@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Fatima Ouahbi', 'f.ouahbi@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lucas Petit', 'l.petit@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Nadia Chabane', 'n.chabane@securiteplus-demo.fr', 'agent_ssiap'),
  ('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pierre Moreau', 'p.moreau@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Camille Robert', 'c.robert@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Youssef Amrani', 'y.amrani@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Léa Dupuis', 'l.dupuis@securiteplus-demo.fr', 'responsable'),
  -- Lyon (10 agents)
  ('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Julien Faure', 'j.faure@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Amina Khelifi', 'a.khelifi@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Romain Leroy', 'r.leroy@securiteplus-demo.fr', 'chef_poste'),
  ('20000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Claire Bonnet', 'c.bonnet@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Moussa Diallo', 'm.diallo@securiteplus-demo.fr', 'agent_ssiap'),
  ('20000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Isabelle Fournier', 'i.fournier@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Mehdi Bouzid', 'm.bouzid@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Charlotte Mercier', 'c.mercier@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Alexandre Simon', 'a.simon@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Sarah Laurent', 's.laurent@securiteplus-demo.fr', 'responsable'),
  -- Marseille (8 agents)
  ('20000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Nicolas Girard', 'n.girard@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Rachid Hammami', 'r.hammami@securiteplus-demo.fr', 'chef_poste'),
  ('20000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Élodie Rousseau', 'e.rousseau@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'David Lambert', 'd.lambert@securiteplus-demo.fr', 'agent_ssiap'),
  ('20000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Samira Belkacem', 's.belkacem@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Maxime Garnier', 'm.garnier@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Aïcha Mebarki', 'a.mebarki@securiteplus-demo.fr', 'agent'),
  ('20000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Franck Boyer', 'f.boyer@securiteplus-demo.fr', 'responsable');

-- Obligations with realistic mixed statuses
-- Uses template IDs from seed_securite_privee.sql (will need actual UUIDs after insert)
-- This is a placeholder structure — run after templates are seeded

-- Helper: create obligations for CNAPS for all agents
-- In practice, run a function or script that:
-- 1. Fetches template IDs
-- 2. For each employee, creates obligation instances with varied statuses/dates
-- See the app's auto-creation logic in employees/new/page.tsx

-- For demo purposes, obligations are created by the app when employees are added
-- This seed just provides the org/sites/employees structure
