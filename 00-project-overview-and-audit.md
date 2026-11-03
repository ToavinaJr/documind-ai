# 00 — Vision et audit de l'existant

## 1. Vision produit

DocuMind AI est une plateforme SaaS B2B multimodale : une source documentaire, audio ou vidéo doit pouvoir produire plusieurs livrables reliés, éditables et traçables. Les cibles visibles sont les directions financières, juridiques, conseil/ESN, gestion de projet, marketing B2B et, dans les données de démonstration, la santé.

## 2. État exécutif

Le produit est un **prototype frontend haute fidélité**. La SPA est riche et navigable, mais tout le domaine applicatif est exécuté côté navigateur. Le backend NestJS, PostgreSQL, Prisma, le stockage objet et les fournisseurs IA sont absents.

| Surface | État réel | Preuve fonctionnelle |
|---|---|---|
| Site public | Fonctionnel localement | Navigation, contenu, formulaires avec feedback local |
| Authentification | Simulée et non sécurisée | Utilisateurs/mots de passe en `localStorage` |
| Organisations/RBAC | Partiel | Modèle de rôles riche, contrôles UI incomplets |
| Documents/OCR | Simulé | Métadonnées de fichier et extraction prédéfinie |
| Audio/transcription | Simulé | Aucune lecture ni transmission du fichier |
| Vidéo/analyse | Simulé | Chapitres prédéfinis |
| Générations | Simulé/partiel | CRUD local; exports HTML/texte, pas PDF/PPTX/vidéo natifs |
| Workflows | Fonctionnel localement | Éditeur SVG, exécution animée et persistée localement |
| Quotas | Fonctionnel localement | Calcul/consommation client, non opposable côté serveur |
| Facturation | Simulée | Plans, abonnements, factures et remboursements locaux |
| Administration | Fonctionnel localement | Écrans et mutations de données mockées |
| Backend/API/BDD | Absent | Dépôt backend vide |
| Tests/CI/CD | Absent | Aucun framework ou pipeline présent |

## 3. Inventaire fonctionnel

### Public

Accueil, fonctionnalités, solutions sectorielles, tarifs, modèles, à propos, FAQ, contact, inscription, connexion et récupération de mot de passe. Le contact ne transmet rien. L'inscription crée localement une organisation, un utilisateur et un abonnement d'essai; le mot de passe du formulaire n'est pas transmis et la valeur de démonstration est utilisée.

### Workspace client

- Tableau de bord et activité.
- Projets : liste, création, suppression.
- Documents : sélection locale, métadonnées, recherche, suppression.
- OCR : lancement simulé, champs structurés, validation humaine, export CSV/JSON.
- Audio : création d'une entrée, transcription/diarisation simulées, livrables dérivés.
- Vidéo : création d'une entrée, analyse/chapitrage simulés.
- Studios : document, présentation, contenu marketing, storyboard vidéo.
- Workflows : CRUD, graphe, nœuds, exécution simulée et logs.
- Templates et historique de jobs.
- Usage, quotas, facturation, membres, rôles personnalisés, paramètres.

### Administration plateforme

Dashboard, utilisateurs, organisations, plans, feature flags, revenus/factures, dérogations de quotas, tickets support, audit et paramètres globaux.

## 4. Architecture frontend constatée

- React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7.
- Routes centralisées et imports synchrones de toutes les pages.
- État transversal par contextes Auth, Quota, Theme et Toast.
- Interfaces de repositories avec implémentations mock, mais plusieurs écrans accèdent directement au stockage.
- Persistance `localStorage` préfixée `documind_db_v1_`.
- Données initiales réalistes regroupées dans un fichier de plus de 1 000 lignes.
- Design « Crimson & Slate », avec tokens CSS mais nombreuses couleurs hexadécimales en dur.

## 5. Problèmes techniques vérifiés

| ID | Constat | Impact | Priorité |
|---|---|---|---|
| TECH-01 | Le typecheck échoue sur `durationSeconds` dans le studio vidéo | Build non garanti par le typage | P0 |
| TECH-02 | Vite produit un bundle principal d'environ 662 Ko minifié | Chargement initial et évolutivité | P1 |
| TECH-03 | Aucun mode TypeScript `strict`; plusieurs `any`/assertions | Défauts masqués | P0 |
| TECH-04 | Aucun test, ESLint, Prettier ou CI | Régressions non détectées | P0 |
| TECH-05 | Repositories, mocks et contextes monolithiques | Maintenance difficile | P1 |
| TECH-06 | Dépendances serveur/IA inutilisées dans le frontend | Surface et confusion | P2 |
| TECH-07 | Variables `VITE_DATA_MODE`/API déclarées mais non lues | Migration API non engagée | P1 |
| TECH-08 | Aucun découpage de code par route | Bundle unique | P2 |

## 6. Incohérences et parcours interrompus

- Les libellés PDF/PPTX/vidéo produisent des fichiers HTML.
- Le fichier document n'est pas conservé; audio et vidéo ne prennent pas de fichier réel.
- Le formulaire contact affiche un succès sans livraison.
- La récupération de mot de passe modifie directement la donnée locale sans preuve d'identité.
- Les permissions ne protègent pas toutes les routes/actions.
- Le quota `activeWorkflows` est affiché mais pas appliqué à la création.
- Les connecteurs ERP et intégrations IA sont annoncés mais absents.

## 7. Éléments réutilisables

- Taxonomie des domaines, entités et permissions.
- Parcours et écrans comme référence UX.
- Interfaces de repositories comme point de départ, après séparation par domaine.
- Moteur de quotas comme spécification comportementale, à réimplémenter et tester côté backend.
- Données mockées comme fixtures de tests, après suppression des mots de passe en clair.

## 8. Limites de cet audit

Aucun backend, schéma Prisma, environnement Docker ou API n'existe à auditer. Les performances runtime, l'accessibilité complète, la responsivité réelle et les parcours visuels multi-navigateurs n'ont pas été mesurés durant cette mission documentaire.

