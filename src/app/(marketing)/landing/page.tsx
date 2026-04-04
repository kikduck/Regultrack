import Link from "next/link";
import {
  Shield,
  Building2,
  Clock,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Obligations pré-chargées",
    description:
      "Les exigences CNAPS, SSIAP, SST et RC Pro sont déjà dans le produit. Vous n'avez rien à configurer.",
  },
  {
    icon: Building2,
    title: "Vue siège consolidée",
    description:
      "Tableau de bord vert / orange / rouge pour tous vos sites. Un coup d'œil suffit pour savoir où agir.",
  },
  {
    icon: Clock,
    title: "Alertes automatiques",
    description:
      "À J-90, J-30, J-7 : la bonne personne reçoit la bonne alerte. Plus de cartes CNAPS qui expirent dans l'oubli.",
  },
  {
    icon: FileCheck,
    title: "Dossier d'inspection en 30s",
    description:
      "Un inspecteur arrive ? Vous ouvrez le dossier du site, structuré et à jour, depuis votre téléphone.",
  },
];

const painPoints = [
  "Une carte CNAPS a expiré sans que personne ne le remarque",
  "Un contrôle préfectoral a révélé des documents manquants",
  "Votre responsable RH passe 5h/semaine à chasser des attestations",
  "Vous ouvrez un nouveau site et le suivi ne tient plus",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900">Regultrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm text-amber-800 mb-6">
          <AlertTriangle className="h-4 w-4" />
          Sécurité privée — carte CNAPS, SSIAP, habilitations
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl leading-tight">
          Vos agents sont-ils en règle ?{" "}
          <span className="text-primary">Sachez-le avant l&apos;inspecteur.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
          Regultrack dit à votre réseau multi-sites ce qui est en règle, ce qui
          ne l&apos;est plus, et ce qui va expirer — avant qu&apos;un contrôle
          inopiné ou un incident révèle le problème.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
          >
            Commencer gratuitement
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="mailto:contact@regultrack.fr"
            className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Demander une démo
          </Link>
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Si l&apos;une de ces situations vous parle...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {painPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white border border-gray-200 p-5"
              >
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{point}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-base text-gray-600">
            ...alors Regultrack est fait pour vous.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
            Ce que Regultrack fait pour vous
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost comparison */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Le coût d&apos;un incident vs le coût du logiciel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="rounded-xl bg-red-50 border border-red-200 p-6">
              <p className="text-3xl font-bold text-red-700">30 000 — 200 000 €</p>
              <p className="mt-2 text-sm text-red-600">
                Coût d&apos;un retrait d&apos;agrément, d&apos;une amende CNAPS,
                ou d&apos;un contrat perdu
              </p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-6">
              <p className="text-3xl font-bold text-green-700">à partir de 300 €/mois</p>
              <p className="mt-2 text-sm text-green-600">
                Regultrack — tous vos sites, tous vos agents, toutes vos
                obligations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à reprendre le contrôle ?
          </h2>
          <p className="text-gray-600 mb-8">
            Créez votre compte, ajoutez vos sites et vos équipes. Les
            obligations de la sécurité privée sont déjà là.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
          >
            <CheckCircle2 className="h-5 w-5" />
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Regultrack</p>
          <div className="flex items-center gap-6">
            <a href="mailto:contact@regultrack.fr" className="hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
