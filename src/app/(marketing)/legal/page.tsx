import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
  { id: "mentions", title: "Mentions légales" },
  { id: "cgu", title: "Conditions générales d'utilisation" },
  { id: "confidentialite", title: "Politique de confidentialité" },
  { id: "rgpd", title: "Données personnelles (RGPD)" },
] as const;

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-semibold text-gray-900">Regultrack</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mentions légales et confidentialité
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Document d&apos;information pour les utilisateurs du service. Les
          mentions définitives (raison sociale, siège, RCS, hébergeur) seront
          complétées avant commercialisation large ; en cas de doute, contactez
          nous à{" "}
          <a
            href="mailto:contact@regultrack.fr"
            className="font-medium text-primary hover:underline"
          >
            contact@regultrack.fr
          </a>
          .
        </p>

        <nav
          className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm"
          aria-label="Sommaire"
        >
          <p className="font-semibold text-gray-900">Sommaire</p>
          <ul className="mt-2 space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-primary hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="mt-10 space-y-12 text-sm leading-relaxed text-gray-700">
          <section id="mentions" className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Mentions légales
            </h2>
            <p className="mt-3">
              <strong className="text-gray-900">Éditeur du site et du service</strong>{" "}
              : société exploitant Regultrack (dénomination, forme juridique,
              capital, siège social et numéro RCS à compléter).
            </p>
            <p className="mt-3">
              <strong className="text-gray-900">Directeur de la publication</strong>{" "}
              : à compléter.
            </p>
            <p className="mt-3">
              <strong className="text-gray-900">Hébergement</strong> : les
              données applicatives sont hébergées via des prestataires conformes
              aux usages du cloud (emplacement et société précisés dans le
              registre des traitements et les contrats clients).
            </p>
            <p className="mt-3">
              <strong className="text-gray-900">Contact</strong> :{" "}
              <a
                href="mailto:contact@regultrack.fr"
                className="text-primary hover:underline"
              >
                contact@regultrack.fr
              </a>
            </p>
          </section>

          <section id="cgu" className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Conditions générales d&apos;utilisation
            </h2>
            <p className="mt-3">
              L&apos;utilisation de Regultrack implique l&apos;acceptation des
              conditions contractuelles en vigueur entre votre organisation et
              l&apos;éditeur (offre d&apos;essai, abonnement ou convention
              cadre). Les CGU complètes seront publiées ici et communiquées lors
              de la souscription.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Le service permet de suivre des obligations de conformité et des
                preuves associées ; il ne remplace pas un conseil juridique ou
                réglementaire.
              </li>
              <li>
                Vous restez responsable de l&apos;exactitude des informations
                saisies et des documents déposés.
              </li>
              <li>
                Les comptes sont strictement professionnels ; toute utilisation
                contraire aux lois ou aux droits des tiers peut entraîner la
                suspension de l&apos;accès.
              </li>
            </ul>
          </section>

          <section id="confidentialite" className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Politique de confidentialité
            </h2>
            <p className="mt-3">
              Regultrack traite des données dans le seul cadre de la fourniture
              du service : compte utilisateur, organisation, sites, employés
              suivis dans le registre de conformité, obligations, preuves
              (fichiers) et journaux techniques nécessaires à la sécurité.
            </p>
            <p className="mt-3">
              Les finalités principales sont : exécution du contrat, alertes et
              notifications liées aux échéances, amélioration du produit,
              respect des obligations légales (comptabilité, réponse aux
              autorités lorsque requis).
            </p>
            <p className="mt-3">
              Les sous-traitants (hébergement, envoi d&apos;emails, etc.) sont
              choisis avec des garanties adaptées ; la liste actualisée peut être
              communiquée sur demande.
            </p>
            <p className="mt-3">
              Les durées de conservation suivent la logique métier : données de
              compte pendant la relation contractuelle puis selon les délais
              légaux ; preuves et historique conformément aux besoins d&apos;audit
              et aux engagements fixés avec le client.
            </p>
          </section>

          <section id="rgpd" className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Données personnelles (RGPD)
            </h2>
            <p className="mt-3">
              Conformément au Règlement (UE) 2016/679 et à la loi « Informatique
              et libertés », les personnes concernées disposent notamment d&apos;un
              droit d&apos;accès, de rectification, d&apos;effacement, de
              limitation, d&apos;opposition et de portabilité lorsque applicable,
              ainsi que du droit d&apos;introduire une réclamation auprès de la
              CNIL (
              <a
                href="https://www.cnil.fr"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                cnil.fr
              </a>
              ).
            </p>
            <p className="mt-3">
              Pour exercer vos droits ou pour toute question relative aux données
              personnelles :{" "}
              <a
                href="mailto:contact@regultrack.fr"
                className="text-primary hover:underline"
              >
                contact@regultrack.fr
              </a>
              . Un point de contact dédié (DPO ou référent) sera indiqué ici si la
              réglementation l&apos;exige pour votre cas.
            </p>
          </section>
        </article>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-3xl px-6 text-center text-xs text-gray-500">
          <Link href="/landing" className="hover:text-gray-700">
            Accueil Regultrack
          </Link>
        </div>
      </footer>
    </div>
  );
}
