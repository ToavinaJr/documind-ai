# 07 — DevOps et infrastructure

## 1. Environnements

| Environnement | Finalité | Données | Déploiement |
|---|---|---|---|
| Local | développement | fixtures synthétiques | Docker Compose + frontend local |
| Test CI | tests isolés | base éphémère | conteneurs jetables |
| Staging | validation release | données non production | même topologie que prod réduite |
| Production | service client | données réelles | images immuables, déploiement contrôlé |

## 2. Topologie cible

- Frontend statique servi par CDN/reverse proxy.
- API NestJS sans état local.
- Worker séparé utilisant la même image avec commande différente.
- PostgreSQL managé recommandé en production.
- Stockage objet privé.
- Queue selon décision architecture asynchrone.
- Gestionnaire de secrets, logs centralisés, métriques et traces.

## 3. Docker/Compose à implémenter ultérieurement

Services locaux : `frontend`, `api`, `worker`, `postgres`, stockage compatible S3 et éventuellement `redis`. Health checks : HTTP readiness/liveness pour API, connexion contrôlée pour DB/queue. Volumes nommés uniquement pour données locales; aucun secret dans Compose versionné.

Commandes cibles, non encore disponibles :

```bash
bun install --frozen-lockfile
docker compose up -d postgres storage
bun run db:migrate
bun run dev
bun run lint
bun run typecheck
bun run test
bun run test:integration
bun run test:e2e
bun run build
docker compose down
```

Les scripts exacts devront être créés et vérifiés dans le lot fondations; ils ne sont pas présentés comme fonctionnels aujourd'hui.

## 4. Pipeline CI/CD

1. Installation verrouillée et cache contrôlé.
2. Format/lint/typecheck.
3. Tests unitaires.
4. PostgreSQL éphémère + intégration/API.
5. Build frontend/backend et validation OpenAPI/migrations.
6. SCA, secret scan, SAST, scan images.
7. Publication d'images signées avec SHA.
8. Déploiement staging, migration, smoke/E2E.
9. Approbation production, sauvegarde, migration puis rollout.
10. Vérification métriques et rollback si seuils dépassés.

## 5. Observabilité

- Logs JSON avec `requestId`, `jobId`, `organizationId` pseudonymisé; jamais token, contenu ou secret.
- Métriques : latence/error rate API, queue depth, âge job, retries, coût IA, quota refusé, webhooks échoués.
- Traces API→queue→worker→provider.
- Alertes sur disponibilité, backlog, erreurs auth, coût anormal et échec sauvegarde.

## 6. Sauvegarde et reprise

- PostgreSQL : sauvegardes automatiques + PITR; restauration testée périodiquement.
- Stockage objet : versioning/rétention selon classification.
- RPO/RTO restent à valider; aucun objectif ne doit être inventé.
- Runbooks : restauration DB, indisponibilité fournisseur, queue bloquée, secret compromis, rollback migration.

## 7. Migrations

Migration compatible avec version N et N-1 de l'application, approche expand/migrate/contract pour changements risqués. Revue du SQL généré, test sur copie anonymisée, sauvegarde et procédure de retour documentée avant production.

