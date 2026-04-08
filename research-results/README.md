# Résultats de recherche réglementaire (local + outillage versionné)

## Ce qui est versionné (Git)

- `README.md` — cette convention
- `research.py` — lanceur (**Brave Search API** + Ollama local)
- `requirements.txt` — dépendances Python minimales
- `queries/*.py` — **liste des questions** par secteur (alignée sur les seeds à fiabiliser)

## Ce qui reste local (ignoré par Git)

- Les dossiers de **sortie** `securite-privee/`, `creches/`, `ehpad/`, `ambulances/` (fiches `.md` générées)
- Scripts expérimentaux type `research_direct.py` si vous en ajoutez

L’assistant / l’IDE **peuvent lire** tout le dossier sur votre disque ; seul le contrôle de version exclut les `.md` produits pour ne pas polluer le dépôt.

## Lancer la deep research (machine locale)

### Clé Brave

1. Créez une clé sur le [dashboard Brave Search API](https://api-dashboard.search.brave.com/).
2. Dans la **racine du dépôt** Regultrack, ajoutez dans `.env.local` (ou `.env`) :

   `BRAVE_API_KEY=votre_clé`

   Le script charge automatiquement ces fichiers (sans écraser les variables déjà définies dans le shell).

Documentation utile :

- [Web Search](https://api-dashboard.search.brave.com/documentation/services/web-search)
- [LLM Context](https://api-dashboard.search.brave.com/documentation/services/llm-context) (utilisé en priorité — contenu pré-extrait, sans scrape)
- [Answers](https://api-dashboard.search.brave.com/documentation/services/answers) — non utilisé ici (synthèse faite par **Ollama** local ; Answers pourrait remplacer Ollama dans une évolution payante)

### Prérequis

- Python 3.10+
- `pip install -r research-results/requirements.txt` (minimum : `requests`)
- **Ollama** démarré (`ollama serve`) avec le modèle indiqué par `OLLAMA_MODEL` (défaut `gemma4:26b`). Le script appelle `GET /api/tags` sur `OLLAMA_HOST` ou l’hôte dérivé de `OLLAMA_URL` **avant** les requêtes Brave. Si la synthèse échoue, **aucun `.md` n’est écrit** (évite les fiches contenant uniquement `[Erreur Ollama …]`).
- Variables optionnelles : `OLLAMA_URL` (défaut `http://localhost:11434/api/chat`), `OLLAMA_HOST` (ex. `http://localhost:11434`), `OLLAMA_MODEL`.

```bash
cd research-results
pip install -r requirements.txt
python research.py                     # défaut : securite-privee
python research.py creches
python research.py ehpad
python research.py ambulances
python research.py creches 01          # une seule fiche (slug commençant par 01)
python research.py securite-privee --fallback-ddg   # sans Brave : ancien DDG + scrape
```

Le script reprend les fiches **déjà présentes** (il ne réécrit pas les `.md` existants), sauf si vous passez un préfixe de slug pour forcer une cible.

**Ordre des sources** : Brave LLM Context → si vide, Brave Web Search (`extra_snippets`) → si encore vide, repli DuckDuckGo + scrape (si `duckduckgo-search` / `ddgs` et `beautifulsoup4` sont installés).

**Dépannage**

- **`OPTION_NOT_IN_PLAN` (HTTP 400)** : l’option [LLM Context](https://api-dashboard.search.brave.com/documentation/services/llm-context) n’est **pas** incluse dans votre forfait Brave. Le script **détecte ce code une fois**, affiche une note, puis n’appelle plus LLM Context pendant la session et utilise uniquement [Web Search](https://api-dashboard.search.brave.com/documentation/services/web-search). Pour forcer ce mode dès le départ : `BRAVE_WEB_SEARCH_ONLY=1` dans l’environnement ou `.env.local`.
- **Autres HTTP 400** sur LLM Context : parfois requête `q` trop longue — le script tronque automatiquement (~380 caractères / 48 mots).
- **HTTP 429** : quota ou débit — le script espace les appels (~0,55 s entre requêtes Brave) et **6 s entre chaque fiche** par défaut. Ajustez avec la variable d’environnement `BRAVE_BETWEEN_FICHES_S` (ex. `12` si besoin).
- **Repli DDG** : les requêtes sont biaisées vers `legifrance.gouv.fr`, `service-public.fr`, etc., pour limiter le hors-sujet géographique.

## Fiabiliser les seeds (workflow)

1. Générer ou mettre à jour les fiches `.md` pour le secteur concerné.
2. Ouvrir les fiches et les `supabase/seeds/seed_<secteur>_upsert.sql`.
3. Ajuster `renewal_months`, `legal_reference`, `renewal_process`, `help_text`, `last_verified_at`, `verified_by` pour coller aux sources et à la synthèse du modèle.
4. Si une fiche révèle un trou dans les requêtes, **éditer `queries/<secteur>.py`** puis relancer la recherche.

## Convention de nommage des sorties

| Élément | Règle |
|--------|--------|
| Dossier secteur | Comme `OUTPUT_SUBDIR` dans `queries/*.py` : `securite-privee`, `creches`, `ehpad`, `ambulances` |
| Fiches | `NN_theme_court.md` |
| Contenu visé | Champs du type **Applies_to**, **Renewal_months**, **Legal_reference**, etc. (pour copier vers `obligation_templates`) |

## Secteurs

- `securite-privee/` — 12 fiches historiques (générées avant le découplage `queries/`)
- `creches/`, `ehpad/`, `ambulances/` — à remplir via `python research.py …`
- `pharmacies/` — réservé (ajouter `queries/pharmacies.py` quand le registre sera prêt)

## Lien avec les seeds Supabase

- `supabase/seeds/seed_securite_privee_upsert.sql`
- `supabase/seeds/seed_creches_upsert.sql`
- `supabase/seeds/seed_ehpad_upsert.sql`
- `supabase/seeds/seed_ambulances_upsert.sql`

## Stack Docker (recherche lourde optionnelle)

Depuis `docker/` : `docker compose -f docker-compose.research.yml up -d` (voir `CHECKLIST.md`). Le script `research.py` peut fonctionner **sans** ce compose s’Ollama tourne déjà en local.
