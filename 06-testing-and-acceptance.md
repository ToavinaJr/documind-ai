# 06 — Stratégie de tests et critères d'acceptation

## 1. Pyramide et environnements

- Unitaires : règles métier pures, rapides, sans réseau.
- Intégration : module NestJS + vraie PostgreSQL éphémère; adapters fournisseurs simulés aux frontières.
- API : application complète, auth, validation, permissions, transactions.
- Frontend : composants/formulaires puis parcours avec API contrôlée.
- E2E : petit nombre de parcours critiques sur environnement proche production.
- Sécurité/charge/résilience : suites dédiées avant release.

Les tests ne partagent pas la base de développement. Les fixtures utilisent des tenants distincts et aucun secret réel.

## 2. Matrice de traçabilité

| Fonctionnalité | Règle | Endpoint | Unit | Intégration/API | E2E/manuel |
|---|---|---|---|---|---|
| Connexion | BR-AUTH-01 | `/auth/login` | hash/policy | session, rate limit | login/logout/expiration |
| Invitation | BR-OWN-01 | `/invitations` | rôle assignable | tenant, expiration | invitation→acceptation |
| Upload | BR-FILE-01 | `/uploads` | type/taille | présignature, scan | progression/erreurs |
| OCR | BR-JOB-01, BR-QUO-01 | `/ocr-jobs` | état/quota | transaction, idempotence | upload→validation→export |
| RBAC | BR-AUTH-01 | tous sensibles | policies | BOLA tous rôles | UI masquée + refus API |
| Workflow | BR-JOB-02 | `/executions` | graphe | version/idempotence | publier/exécuter/observer |
| Billing | BR-SUB-01 | subscription/webhook | transitions | signature/ordre | changement plan |
| Suppression | BR-DEL-01 | `DELETE` | rétention | purge/audit | disparition/restauration |

## 3. Cas obligatoires par endpoint

Nominal, payload invalide, non authentifié, permission insuffisante, ressource inexistante, autre tenant, conflit/idempotence, limite, dépendance externe indisponible et erreur interne avec `requestId`.

## 4. Parcours E2E prioritaires

1. Inscription → vérification → organisation → première connexion.
2. Invitation → acceptation → rôle Viewer → refus d'écriture.
3. Projet → upload document → OCR → progression → correction → validation → export réel.
4. Quota presque atteint → alerte → dépassement refusé sans débit.
5. Changement de plan → webhook → nouveaux entitlements.
6. Admin accorde une dérogation motivée → audit → expiration automatique.
7. Tenant A tente d'accéder à chaque ressource du tenant B → refus uniforme.

Audio, vidéo et génération entrent dans l'E2E seulement lorsqu'ils deviennent un lot actif.

## 5. Tests frontend

- Navigation et guards; états loading/empty/error/forbidden.
- Formulaires : requis, format, serveur indisponible, double soumission.
- Upload : progression, annulation, reprise, taille/type refusés.
- Permissions par rôle et changement d'organisation.
- Responsive : 360, 768, 1280 px; clavier, focus, contraste et lecteurs d'écran.
- Visuel : captures stables des pages critiques, sans masquer les diffs arbitrairement.

## 6. Critères d'acceptation transversaux

- AC-01 : `lint`, typecheck, unit, intégration et build sont verts dans CI.
- AC-02 : aucun `any` nouveau et TypeScript strict activé selon plan progressif.
- AC-03 : toute mutation sensible vérifie permission et tenant côté serveur.
- AC-04 : toute opération asynchrone retourne un job observable et une erreur exploitable.
- AC-05 : quota, ressource et job sont cohérents malgré requêtes concurrentes.
- AC-06 : l'UI distingue succès, attente, erreur, vide et interdit.
- AC-07 : le format annoncé est réellement produit et ouvrable.
- AC-08 : documentation/OpenAPI et implémentation ne divergent pas.
- AC-09 : aucun secret/PII sensible dans client, logs ou fixtures.
- AC-10 : guide manuel exécuté et résultats consignés avant validation humaine.

## 7. Gates de release

- PR : lint/typecheck/unitaires/contract/build/scans.
- Merge main : intégration PostgreSQL et API.
- Staging : migrations, E2E, visuel, sécurité ciblée, smoke.
- Production : approbation, sauvegarde/restauration récente, rollback, monitoring et migration vérifiée.

## 8. État actuel des tests

Aucune suite automatisée n'existe. Lors de l'audit, `npm.cmd run build` a réussi avec un avertissement de gros chunk; `npm.cmd run lint` (en réalité `tsc --noEmit`) a échoué sur `VideoStudioPage.tsx` concernant `durationSeconds`. Ces résultats ne valident pas les futurs lots.

