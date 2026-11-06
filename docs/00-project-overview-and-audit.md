# 00 — Vision et audit de l'existant

Date de vérification : 6 novembre 2026. Cet audit distingue le comportement du prototype frontend, le socle backend réellement présent et la cible produit. Il ne suppose ni migration appliquée ni disponibilité correcte de la base de développement.

## 1. Vision produit

DocuMind AI vise une plateforme SaaS B2B multimodale où des documents, enregistrements audio et vidéos alimentent des traitements, validations humaines et livrables traçables. Les parcours visibles incluent aussi collaboration, facturation, administration de plateforme et automatisation.

## 2. État exécutif

| Surface | État observé | Preuve / limite |
|---|---|---|
| Site public | UI navigable, interactions locales | Le contact et les formulaires n'appellent aucun service métier |
| Authentification | Simulation frontend | Session, mots de passe et changement d'identité gérés localement; aucun endpoint d'authentification |
| Organisations / rôles | Simulation frontend | Les permissions et le tenant sont décidés dans React; aucune autorisation serveur |
| Documents / OCR | Simulation | Métadonnées et résultats prédéfinis; aucun fichier conservé ni OCR exécuté |
| Audio / transcription | Simulation | Pas d'upload, de décodage ni de fournisseur STT |
| Vidéo | Simulation | Chapitres/résultats mockés; pas de média, transcodage ou analyse réelle |
| Studios / exports | Partiel et simulé | CRUD local; plusieurs exports annoncés PDF/PPTX/vidéo produisent des fichiers de remplacement HTML/texte |
| Workflows | Démonstration locale | Graphe et exécution UI persistés dans le navigateur; pas de worker ni d'orchestration backend |
| Quotas / facturation | Simulation locale | Compteurs et plans dans `localStorage`; pas de ledger, paiement ni webhook |
| Administration | Simulation locale | Mutations de plans, utilisateurs, tickets, flags et quotas sans API |
| API backend | Socle technique uniquement | NestJS, configuration, PostgreSQL/Prisma, health, erreurs, validation globale, Helmet, CORS et OpenAPI |
| Endpoints métier | Absents | Seuls `GET /api/v1/health/live` et `GET /api/v1/health/ready` sont déclarés |
| Schéma de données | Ébauche partielle | `User`, `Organization`, `Membership`, `Session` dans Prisma; aucune migration métier confirmée |
| Tests / CI | Très partiels | Tests backend de configuration et health; pas de tests métier/API/DB ni pipeline CI recensés |

## 3. Surfaces et fonctionnalités frontend

Les routes sont définies dans `frontend/src/App.tsx`; les repositories et les contextes s'appuient sur `localStorage` et des données de démonstration.

### Public

Accueil, fonctionnalités, solutions, tarifs, modèles, à propos, FAQ, contact, connexion, inscription et récupération de mot de passe. La récupération change localement le mot de passe sans preuve d'identité; inscription/contact affichent un parcours local et ne créent/transmettent pas de compte ou demande serveur.

### Workspace

- Dashboard et activité; projets; documents et détail; OCR et validation de champs.
- Audio/transcription/détail; vidéo/analyse/détail.
- Studios document, présentation, contenu et vidéo; bibliothèque de modèles.
- Workflows et éditeur; historique/jobs; usage/quota; facturation.
- Membres, rôles personnalisés et paramètres.

Les écrans sont utiles comme spécification UX et fixtures, mais leur autorité d'accès, leurs résultats IA, leurs quotas et leur persistance ne sont pas réels.

### Backoffice plateforme

Dashboard, utilisateurs, organisations, plans, fonctionnalités/flags, billing/factures, tickets, audit et paramètres. Les pages et actions existent dans React; elles ne sont ni alimentées ni protégées par un service backend.

## 4. Architecture constatée

### Frontend

- React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, Bun (versions de `frontend/package.json`).
- Routes importées statiquement; contextes Auth, Quota, Theme, Toast.
- `frontend/src/repositories/index.ts` n'expose que des implémentations Mock; plusieurs pages/contextes lisent directement le stockage.
- `VITE_DATA_MODE` et `VITE_API_BASE_URL` figurent dans l'exemple d'environnement, mais aucun client HTTP ni usage de ces variables n'a été trouvé.
- Les fixtures de `frontend/src/mocks/initial-data.ts` ne doivent pas être importées comme données client en production.

### Backend

- NestJS 12, Prisma 7, PostgreSQL via `@prisma/adapter-pg`, TypeScript strict (versions dans `backend/package.json` et `backend/tsconfig.json`).
- Modules présents : Database et Health; l'AppModule installe un identifiant de requête. Le bootstrap configure préfixe `/api/v1`, Helmet, CORS, `ValidationPipe`, filtre d'erreurs et Swagger non production.
- Health live ne dépend pas de PostgreSQL; readiness fait `SELECT 1`.
- Aucun module Auth, Tenancy, Files, Documents/OCR, Jobs, Usage, Billing ou Admin n'a été trouvé.
- Prisma configure sa source depuis `DATABASE_URL`; le schéma contient identité/tenant minimal, mais l'authentification, organisations et autres domaines n'ont pas leurs services ni contrats API.

## 5. Écarts et risques prioritaires

| Priorité | Écart | Conséquence |
|---|---|---|
| P0 | Aucun auth/RBAC serveur; le frontend permet le changement local d'utilisateur/organisation | L'UI ne peut pas être considérée comme une frontière de sécurité |
| P0 | Ébauche Prisma non alignée sur le modèle cible et connexion/migrations non confirmées | Pas de base métier prête à recevoir des données |
| P0 | Aucune suite de tests métier/API/tenant | Les régressions et accès BOLA resteraient invisibles |
| P0 | Aucun stockage sécurisé, jobs durables ou OCR réel | Le parcours documentaire ne peut pas traiter des fichiers clients |
| P1 | API mode frontend absent, data access mixte mock/direct localStorage | Migration progressive et bascule difficile |
| P1 | Quota local sans transaction; règles de limite nulle/override ne sont pas opposables | Dépassement et consommation incohérente possibles |
| P1 | Exports, contact, reset, facturation et outils multimodaux simulés | Promesse produit différente du résultat réel |
| P1 | Typecheck frontend précédemment signalé en échec; la commande `lint` est `tsc --noEmit`, sans linter réel | Qualité actuelle non certifiée; le diagnostic précédent doit être réexécuté avant son lot |
| P2 | Pages importées statiquement et gros bundle déjà mesuré lors d'un audit antérieur | Temps de chargement et coût de maintenance |
| P2 | Plusieurs couleurs en dur et incohérences de contraste repérées par l'utilisateur | Cohérence visuelle / accessibilité à traiter dans un lot UI dédié |

## 6. Direction proposée

Construire un monolithe modulaire NestJS et livrer un vertical Document/OCR de bout en bout : identité Bearer côté serveur, organisation/membership, projets, upload contrôlé, jobs/usage, extraction OCR avec révision humaine, export réel, puis connecter les repositories frontend de ce vertical. Les sessions utilisent des tokens opaques aléatoires; seul leur hash est stocké. Le choix de fournisseur OCR, stockage/région, Workspace hiérarchique, rétention et facturation demeure ouvert.

La conception des domaines et l'ordre des lots sont détaillés dans [03 — Conception des données](./03-database-design.md), [04 — Contrats API](./04-api-specifications.md), [08 — Feuille de route](./08-roadmap-and-backlog.md) et [09 — Décisions ouvertes](./09-decisions-risks-glossary.md).

## 7. Limites de l'analyse

Analyse statique des routes, pages, contextes, repositories, fixtures, documentation, scripts, dépendances et code NestJS. Aucun build/test ni parcours navigateur n'a été exécuté dans cette analyse; aucun `.env` réel n'a été lu. Les erreurs de connexion PostgreSQL déjà communiquées empêchent de présumer que la base locale est authentifiée ou migrée.
