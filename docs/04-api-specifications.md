# 04 — Contrats API REST cibles

## 1. Conventions

- Base : `/api/v1`; HTTPS uniquement hors local.
- Auth : `Authorization: Bearer <opaque-token>` selon le choix déjà retenu pour le projet. Le token est aléatoire, révocable, à durée limitée; seule son empreinte cryptographique est stockée. Ne jamais placer le token dans `localStorage`; conserver côté navigateur selon le mécanisme retenu pour l'application, idéalement en mémoire avec renouvellement contrôlé. CSRF dépend du mécanisme de stockage/cookie finalement choisi.
- Identifiants UUID, dates ISO-8601 UTC, montants `{ amountMinor, currency }`.
- Pagination curseur : `?limit=20&after=<opaque>`, `limit` 1–100.
- Tri en liste blanche : `?sort=-createdAt,title`; filtres documentés par ressource.
- Mutations créatrices de jobs/paiements : en-tête `Idempotency-Key`.
- Erreur uniforme :

```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Ressource introuvable.",
    "requestId": "req_...",
    "details": [{ "field": "file", "code": "INVALID_MIME" }]
  }
}
```

Codes communs : `200/201/202/204`, `400`, `401`, `403`, `404` (également pour ressource autre tenant), `409`, `413`, `415`, `422`, `429`, `500/502/503`.

Les erreurs exposées par le backend utilisent le DTO OpenAPI `ErrorResponseDto` :
`error.code` identifie la catégorie, `error.message` reste générique pour les erreurs
serveur, `error.requestId` correspond à l'en-tête `X-Request-Id`, et `error.details`
contient les champs et contraintes rejetés par la validation. Les valeurs reçues et
les messages internes du validateur ne sont pas renvoyés. Une validation invalide
retourne `400` avec `code: "VALIDATION_FAILED"`; les erreurs HTTP connues utilisent
un code stable correspondant au statut (`UNAUTHORIZED`, `FORBIDDEN`, `CONFLICT`,
`TOO_MANY_REQUESTS`, etc.).

## 2. Catalogue minimal d'endpoints

| Module | Méthode et URL | Permission | Entrée / sortie principale |
|---|---|---|---|
| Auth | `POST /auth/register` | public | identité + organisation → session/état vérification |
| Auth | `POST /auth/login` | public | email/password → session |
| Auth | `POST /auth/refresh` | Bearer/session à renouveler | rotation et invalidation de l'ancien token |
| Auth | `POST /auth/logout` | Bearer | révocation de la session, `204` |
| Auth | `POST /auth/password/forgot` | public limité | réponse neutre |
| Auth | `POST /auth/password/reset` | token | token + nouveau password |
| Me | `GET /me` | authentifié | user, memberships, permissions |
| Orgs | `GET/POST /organizations` | user / create | organisations accessibles |
| Orgs | `GET/PATCH /organizations/{orgId}` | org.read/update | organisation |
| Members | `GET /organizations/{orgId}/members` | members.read | liste paginée |
| Members | `POST /organizations/{orgId}/invitations` | members.invite | email + roleId |
| Members | `PATCH/DELETE /organizations/{orgId}/members/{userId}` | members.update/remove | rôle/statut |
| Roles | `GET/POST /organizations/{orgId}/roles` | roles.read/create | rôles personnalisés |
| Projects | `GET/POST /organizations/{orgId}/projects` | projects.read/create | filtre/statut, projet |
| Projects | `GET/PATCH/DELETE .../projects/{id}` | action correspondante | projet |
| Uploads | `POST /organizations/{orgId}/uploads` | files.create | nom, taille, MIME déclaré, checksum |
| Uploads | `POST .../uploads/{id}/complete` | files.create | confirmation → fichier contrôlé/job scan |
| Documents | `GET/POST .../projects/{projectId}/documents` | documents.read/create | liste/création depuis fileId |
| Documents | `GET/PATCH/DELETE .../documents/{id}` | action correspondante | document |
| OCR | `POST .../documents/{id}/ocr-jobs` | documents.process | options → `202 Job` |
| Extractions | `GET .../documents/{id}/extractions` | documents.read | versions |
| Extractions | `PATCH .../extractions/{id}/fields` | documents.validate | corrections versionnées |
| Media | `GET/POST .../audio` et `/video` | media.read/create | assets depuis fileId |
| Media jobs | `POST .../audio/{id}/transcription-jobs` | audio.transcribe | `202 Job` |
| Media jobs | `POST .../video/{id}/analysis-jobs` | video.process | `202 Job` |
| Jobs | `GET /organizations/{orgId}/jobs/{id}` | resource.read | état/progression/erreur |
| Jobs | `POST .../jobs/{id}/cancel` | resource.update | annulation si possible |
| Generations | `GET/POST .../generated-assets` | generations.read/create | type, sources, template |
| Exports | `POST .../generated-assets/{id}/exports` | generations.export | format → `202 Job` |
| Workflows | `GET/POST .../workflows` | workflows.read/create | définition brouillon |
| Workflows | `POST .../workflows/{id}/publish` | workflows.update | version immuable |
| Workflows | `POST .../workflows/{id}/executions` | workflows.execute | inputs → `202` |
| Usage | `GET .../usage?period=` | usage.read | usage/limites/overrides |
| Billing | `GET .../plans` | authentifié | plans actifs |
| Billing | `GET/PATCH .../subscription` | subscriptions.read/manage | plan/intervalle |
| Billing | `GET .../invoices` | billing.read | factures |
| Webhooks | `POST /webhooks/billing/{provider}` | signature fournisseur | événement brut/idempotent |
| Admin | `GET /admin/organizations|users|audit-logs` | plateforme | listes filtrées |
| Admin | `POST /admin/organizations/{id}/quota-overrides` | platform.quota.manage | dérogation motivée |

## 3. Contrat détaillé — démarrer un OCR

`POST /api/v1/organizations/{orgId}/documents/{documentId}/ocr-jobs`

- Authentification : Bearer valide associé à une session active.
- Permission : `documents.process` et accès au document dans `orgId`.
- En-têtes : `Idempotency-Key` obligatoire.
- Préconditions : fichier confirmé, scan réussi, abonnement autorisé, quota disponible, aucun job identique actif.

```json
{
  "mode": "structured",
  "languageHints": ["fr", "en"],
  "schemaKey": "invoice-v1"
}
```

Validation : `mode` en liste blanche; 0–5 langues supportées; `schemaKey` accessible au tenant.

Réponse `202` :

```json
{
  "data": {
    "jobId": "b7d...",
    "status": "queued",
    "progress": 0,
    "resource": { "type": "document", "id": "c12..." }
  }
}
```

Erreurs spécifiques : `409 JOB_ALREADY_ACTIVE`, `413 FILE_TOO_LARGE`, `415 UNSUPPORTED_MEDIA_TYPE`, `422 FILE_NOT_READY`, `429 QUOTA_EXCEEDED`, `503 OCR_PROVIDER_UNAVAILABLE` seulement si l'acceptation du job est impossible.

Tests : nominal, idempotence, limite zéro, quota concurrent, autre tenant, document supprimé, fichier non scanné, permission absente.

## 4. Contrat détaillé — invitation

`POST /api/v1/organizations/{orgId}/invitations`

```json
{ "email": "collaborateur@example.com", "roleId": "uuid" }
```

Validation : e-mail normalisé, rôle de la même organisation, rôle assignable, absence d'invitation active/membership. Réponse `201` sans exposer de token. Les collisions retournent `409`; l'envoi d'e-mail est asynchrone et son échec n'annule pas nécessairement l'invitation, décision à confirmer.

## 5. Upload

L'API ne reçoit pas le binaire principal : elle crée une session et une URL présignée courte. La confirmation contrôle taille/checksum/type réel et déclenche le scan. Les URLs de téléchargement sont présignées après autorisation, jamais publiques par défaut.

## 6. OpenAPI

La spécification exécutable doit être générée par NestJS et validée en CI. Ce document fixe les conventions; il ne prétend pas être une OpenAPI complète tant que DTO et décisions métier ne sont pas validés.

