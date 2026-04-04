-- Seed: Obligation templates for Sécurité Privée sector
-- These form the core "moat" — sector knowledge encoded in the product

INSERT INTO public.obligation_templates (sector, name, description, renewal_months, applies_to, proof_type, alert_days)
VALUES
  (
    'securite_privee',
    'Carte professionnelle CNAPS',
    'Carte délivrée par le CNAPS, obligatoire pour exercer une activité de sécurité privée. Sans elle, l''agent ne peut pas travailler.',
    60,
    'employee',
    'pdf',
    '{90,60,30,7}'
  ),
  (
    'securite_privee',
    'Recyclage aptitude professionnelle',
    'Formation de recyclage obligatoire à chaque renouvellement de la carte CNAPS. Valide la capacité de l''agent à poursuivre son activité.',
    60,
    'employee',
    'pdf',
    '{90,30,7}'
  ),
  (
    'securite_privee',
    'SSIAP (Service de Sécurité Incendie)',
    'Certification obligatoire pour les agents affectés dans un ERP (Établissement Recevant du Public). Recyclage tous les 3 ans.',
    36,
    'employee',
    'pdf',
    '{90,30,7}'
  ),
  (
    'securite_privee',
    'SST (Sauveteur Secouriste du Travail)',
    'Formation premiers secours au travail. Recyclage tous les 2 ans (MAC SST).',
    24,
    'employee',
    'pdf',
    '{60,30,7}'
  ),
  (
    'securite_privee',
    'Habilitation électrique',
    'Habilitation requise pour les agents intervenant à proximité d''installations électriques. Recyclage tous les 3 ans.',
    36,
    'employee',
    'pdf',
    '{90,30,7}'
  ),
  (
    'securite_privee',
    'Autorisation d''exercer (préfectorale)',
    'Autorisation délivrée par la préfecture pour l''entreprise de sécurité privée. Obligatoire pour exercer l''activité.',
    60,
    'organization',
    'pdf',
    '{180,90,30,7}'
  ),
  (
    'securite_privee',
    'Assurance RC Professionnelle',
    'Assurance responsabilité civile professionnelle. Renouvellement annuel obligatoire.',
    12,
    'organization',
    'pdf',
    '{60,30,7}'
  ),
  (
    'securite_privee',
    'DUERP (Document Unique d''Évaluation des Risques)',
    'Document obligatoire mis à jour au moins une fois par an ou lors de tout changement significatif.',
    12,
    'site',
    'pdf',
    '{60,30,7}'
  ),
  (
    'securite_privee',
    'Registre de sécurité du site',
    'Registre de sécurité tenu à jour sur chaque site, incluant vérifications périodiques et exercices.',
    12,
    'site',
    'pdf',
    '{30,7}'
  );
