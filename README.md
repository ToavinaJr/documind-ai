# DocuMind AI — Frontend

Plateforme SaaS multimodale d'intelligence documentaire, de génération de contenus et d'automatisation.
Une source unique (document, audio, vidéo) produit simultanément plusieurs livrables reliés et traçables.

Ce dossier contient l'application web (SPA). Elle fonctionne aujourd'hui entièrement en **mode mock** : les données sont simulées côté navigateur et persistées dans `localStorage`. Le dossier `../backend` est vide pour l'instant.

## Stack technique

- React 19 + TypeScript
- Vite 8 (`@vitejs/plugin-react`)
- Tailwind CSS v4 (`@tailwindcss/vite`), mode sombre via la classe `.dark`
- React Router 7
- `motion` (animations) et `lucide-react` (icônes)
- Gestionnaire de paquets : Bun (`bun.lock`), npm fonctionne aussi

## Démarrage rapide

Prérequis : Node.js 20+ (ou Bun).

```bash
# 1. Installer les dépendances
npm install        # ou : bun install

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer le serveur de développement
npm run dev
```

L'application est servie sur <http://localhost:3000> (hôte `0.0.0.0`).

### Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite sur le port 3000 |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build de production |
| `npm run lint` | Vérification des types (`tsc --noEmit`) |
| `npm run clean` | Supprime `dist` et `server.js` (nécessite `rm`, donc Git Bash ou WSL sous Windows) |

### Variables d'environnement

Définies dans `.env` (modèle : `.env.example`).

| Variable | Description | Valeur par défaut |
|---|---|---|
| `GEMINI_API_KEY` | Clé de l'API Gemini | `MY_GEMINI_API_KEY` |
| `APP_URL` | URL d'hébergement de l'application | `MY_APP_URL` |
| `VITE_DATA_MODE` | Moteur de données : `MOCK` (dépôts locaux) ou `API` (backend NestJS) | `MOCK` |
| `VITE_API_BASE_URL` | URL de base de l'API backend | `http://localhost:3000/api/v1` |

> Note : à ce jour, aucun code de `src/` ne lit ces variables. `VITE_DATA_MODE` et `VITE_API_BASE_URL` préparent le futur branchement du backend, et `GEMINI_API_KEY` n'est pas encore utilisée.

## Comptes de démonstration

Mot de passe commun : `Demo@DocuMind2026!`

| Email | Rôle |
|---|---|
| `demo@documind.ai` | Propriétaire de l'organisation Acme (compte pré-rempli sur `/login`) |
| `admin@documind.ai` | Super-administrateur de la plateforme (accès à `/admin`) |

Les autres utilisateurs de démonstration (membres d'Acme et de Beta Health) sont définis dans [src/mocks/initial-data.ts](src/mocks/initial-data.ts). La page de connexion permet aussi de basculer d'un utilisateur à l'autre.

## Espaces et routes

Les routes sont déclarées dans [src/App.tsx](src/App.tsx).

1. **Site public** : `/`, `/features`, `/solutions`, `/pricing`, `/templates`, `/about`, `/faq`, `/contact`, `/login`, `/register`
2. **Workspace client** (`/workspace/*`, authentification requise) :
   - Pilotage : `dashboard`, `projects`, `history`
   - Documents et OCR : `documents`, `documents/:id`, `ocr`
   - Audio et vidéo : `audio`, `audio/:id`, `video`, `video/:id`
   - Studios de génération : `document-studio`, `presentations`, `video-studio`, `content-studio`
   - Automatisation : `workflows`, `workflows/:id`, `templates`
   - Organisation : `usage`, `billing`, `members`, `roles`, `settings`
3. **Backoffice plateforme** (`/admin/*`, réservé aux administrateurs de plateforme) : `dashboard`, `users`, `organizations`, `plans`, `features`, `billing`, `support`, `audit`, `settings`

Toute route inconnue redirige vers `/`.

## Structure du projet

```
frontend/
├── docs/
│   ├── architecture/overview.md   # Vision globale, piliers, séparation des espaces
│   └── business/quotas.md         # Moteur de quotas et limites
├── public/assets/                 # Ressources statiques
└── src/
    ├── App.tsx                    # Providers et table de routage
    ├── main.tsx
    ├── index.css                  # Tailwind + design tokens (--dm-*)
    ├── components/common/         # Navbar, Footer, Modal, ProtectedRoute, AdminRoute, DemoToolbar
    ├── context/                   # Auth, Quota, Theme, Toast
    ├── layouts/                   # PublicLayout, WorkspaceLayout, AdminLayout
    ├── mocks/                     # Données initiales et stockage localStorage
    ├── pages/{public,workspace,admin}/
    ├── repositories/index.ts      # Interfaces de dépôts + implémentations Mock
    └── types/index.ts             # Entités, rôles et permissions
```

## Architecture des données

L'accès aux données passe par des **dépôts** ([src/repositories/index.ts](src/repositories/index.ts)) : chaque ressource (documents, audio, vidéo, workflows, abonnements, factures, etc.) a une interface, et une implémentation `Mock*` actuellement branchée via l'objet `repositories`.

- Les données initiales sont dans [src/mocks/initial-data.ts](src/mocks/initial-data.ts).
- La persistance se fait dans `localStorage`, avec le préfixe de clé `documind_db_v1_` ([src/mocks/storage.ts](src/mocks/storage.ts)).
- Pour réinitialiser la démo, videz les clés `documind_db_v1_*` du `localStorage` du navigateur.
- Brancher un vrai backend revient à fournir des implémentations de ces interfaces qui appellent l'API.

Les données sont **multi-tenant** : chaque appel est scopé par `orgId`. Les rôles et permissions sont décrits dans [src/types/index.ts](src/types/index.ts).

## Thème et design tokens

La palette « Crimson & Slate » est définie dans [src/index.css](src/index.css) sous forme de variables CSS `--dm-*` (`:root` pour le clair, `.dark` pour le sombre). Le bascule clair/sombre est géré par `ThemeContext`.

> Attention : la plupart des composants utilisent encore des valeurs hexadécimales en dur dans les classes Tailwind (par exemple `bg-[#DE1F4F]`) et non les variables `--dm-*`. Modifier uniquement `index.css` ne change donc pas toute l'interface : les valeurs doivent aussi être mises à jour dans les composants, ou ceux-ci migrés vers les variables.

## Documentation complémentaire

- [docs/architecture/overview.md](docs/architecture/overview.md) : vision, piliers applicatifs, séparation des espaces
- [docs/business/quotas.md](docs/business/quotas.md) : ressources mesurées, dérogations administratives
