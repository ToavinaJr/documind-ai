# 09 — Décisions ouvertes, risques et glossaire

## 1. Décisions requises

| ID | Question et options | Recommandation | Conséquence du report |
|---|---|---|---|
| DEC-01 | Organization seule ou Organization→Workspaces ? | Commencer sans Workspace si aucun besoin d'isolation locale confirmé | Modèle membership/URL/API instable |
| DEC-02 | MVP : document OCR seul ou multimodal ? | Vertical document/OCR complet | Dispersion et délai avant valeur réelle |
| DEC-03 | Sessions cookies ou JWT exposé client ? | Cookie HttpOnly + session rotative | Contrats auth et CSRF indécis |
| DEC-04 | Queue PostgreSQL, BullMQ ou managée ? | PostgreSQL initial + port abstrait, mesurer | Architecture worker bloquée |
| DEC-05 | Stockage objet/fournisseur/région ? | S3-compatible privé dans région approuvée | Upload, résidence et coût indécis |
| DEC-06 | Fournisseurs OCR/STT/LLM/rendu ? | POC comparatif qualité/coût/confidentialité | Impossible de finaliser adapters/SLA |
| DEC-07 | Paiement et taxes ? | Choisir fournisseur supportant pays/devise cibles | Billing et webhooks bloqués |
| DEC-08 | Quota : compteurs, crédits ou hybride ? | Compteurs par ressource comme prototype, ledger immuable | Plans et DB instables |
| DEC-09 | Politique d'abonnement passé dû/grâce ? | Bloquer créations coûteuses, préserver lecture/export limité; à valider | Expérience et sécurité financière floues |
| DEC-10 | Rétention, purge et restauration ? | Classifier par ressource et obligations légales | Schéma, backups, coûts et conformité bloqués |
| DEC-11 | Support peut-il voir le contenu/impersoner ? | Non par défaut; accès temporaire approuvé et audité | Backoffice support non spécifiable |
| DEC-12 | RPO/RTO et SLA ? | Définir après cible commerciale/criticité | Infra et budget impossibles à dimensionner |
| DEC-13 | Internationalisation au MVP ? | Français d'abord, architecture sans textes métier côté backend | Dette UI potentielle |
| DEC-14 | Recherche : métadonnées, full-text ou sémantique ? | Métadonnées/full-text avant vecteurs | Portée document imprécise |

Chaque décision doit produire un ADR court : contexte, choix, alternatives, conséquences et date.

## 2. Registre des risques projet

| ID | Risque | Prob. | Impact | Mitigation | Propriétaire proposé |
|---|---|---:|---:|---|---|
| R-01 | Périmètre multimodal trop large | Élevée | Élevé | MVP vertical et gates | Product |
| R-02 | Divergence prototype/promesse réelle | Élevée | Élevé | statuts explicites, exports réels | Product/QA |
| R-03 | Fuite inter-tenant | Moyenne | Critique | TenantContext, BOLA CI, revue sécurité | Backend/Security |
| R-04 | Coûts IA incontrôlés | Élevée | Élevé | budgets, quotas, métriques, circuit breaker | Product/Platform |
| R-05 | Verrouillage fournisseur | Moyenne | Moyen | adapters + données portables, sans abstraction spéculative | Architecture |
| R-06 | Jobs perdus/dupliqués | Moyenne | Élevé | idempotence, retries, DLQ, reconciliation | Backend |
| R-07 | Migrations destructives | Faible | Critique | expand/contract, backup, staging, rollback | Database/DevOps |
| R-08 | Tests insuffisants | Élevée | Élevé | stratégie par lot + CI gates | QA |
| R-09 | Accessibilité/responsive non vérifiées | Moyenne | Moyen | audit et tests manuels/automatisés | Frontend/QA |
| R-10 | Données sensibles chez fournisseurs | Moyenne | Critique | DPA, région, minimisation, chiffrement | Security/Legal |
| R-11 | Deux dépôts sans orchestration claire | Moyenne | Moyen | décision mono/multi-repo et CI coordonnée | Architecture/DevOps |
| R-12 | Dépendances frontend inutiles/vulnérables | Moyenne | Moyen | inventaire, suppression justifiée, SCA | Frontend |

## 3. Glossaire

| Terme | Définition |
|---|---|
| Tenant | Frontière d'isolation d'une organisation cliente |
| Workspace | Sous-espace éventuel d'une organisation, non confirmé |
| Asset | Fichier ou livrable géré et versionné |
| Processing Job | Travail asynchrone durable avec état et tentatives |
| Entitlement | Droit effectif issu du plan, statut et overrides |
| Usage Record | Écriture immuable représentant une consommation |
| Quota Override | Dérogation bornée et auditée à une limite |
| Extraction | Données structurées dérivées d'un document |
| Validation humaine | Approbation/correction tracée d'un résultat automatique |
| Provider adapter | Interface isolant un service externe du métier |
| BOLA/IDOR | Accès à une ressource d'un autre utilisateur/tenant par identifiant |
| RPO/RTO | Perte maximale de données / délai de restauration acceptables |
| ADR | Trace d'une décision d'architecture et de ses conséquences |

## 4. Cohérence vérifiée

- Le vertical recommandé utilise les modules, entités, endpoints, règles et tests décrits dans les autres documents.
- Les permissions sont vérifiées côté serveur et reflétées côté UI.
- Les jobs, quotas et usages partagent une exigence d'idempotence/transaction.
- Les choix non vérifiables sont dans DEC-01 à DEC-14, pas présentés comme acquis.
- L'infrastructure reste adaptable tant que SLA, région et fournisseurs ne sont pas décidés.

