# 05 — Plan de sécurité

## 1. Modèle de menace

Actifs prioritaires : identités, documents confidentiels, médias, résultats IA, données de facturation, secrets fournisseurs et journaux d'audit. Frontières : navigateur/API, API/stockage, API/workers, workers/fournisseurs, webhook de paiement et interfaces d'administration.

## 2. Risques observés dans le prototype

| ID | Risque | Gravité | Probabilité | Impact | Correction cible |
|---|---|---:|---:|---|---|
| SEC-01 | Authentifié par défaut et session modifiable localement | Critique si déployé | Élevée | Prise de compte | Session serveur signée/révocable |
| SEC-02 | Mots de passe en clair dans code/localStorage | Critique | Élevée | Vol d'identifiants | Argon2id, jamais renvoyé au client |
| SEC-03 | Reset sans preuve d'identité | Critique | Élevée | Prise de compte | Jeton mono-usage court + notification |
| SEC-04 | RBAC uniquement/partiellement UI | Critique | Élevée | Accès non autorisé | Guards + policy + ownership serveur |
| SEC-05 | Tenant fourni par client et filtrage local | Critique | Élevée | BOLA inter-organisations | TenantContext, requêtes composites, tests négatifs |
| SEC-06 | Upload sans validation réelle | Élevée | Élevée | Malware, DoS, fuite | scan, quotas, MIME réel, taille, stockage isolé |
| SEC-07 | Actions admin/support non sécurisées | Élevée | Moyenne | Abus privilégié | MFA, permissions globales, audit, accès temporaire |
| SEC-08 | Absence rate limiting | Élevée | Élevée | brute force/coût IA | limites IP/user/org/opération |
| SEC-09 | Secrets fournisseur potentiellement frontend | Élevée | Moyenne | compromission/coût | secrets serveur/manager, rotation |
| SEC-10 | Sorties IA non validées | Élevée | Moyenne | injection/contenu erroné | schémas, sanitation, validation humaine |

Ces risques décrivent un mock non destiné à la production; ils deviennent bloquants avant toute exposition réelle.

## 3. Contrôles obligatoires

- Auth : Argon2id paramétré, vérification e-mail, sessions rotatives hachées, révocation, MFA admin, lockout progressif sans DoS utilisateur.
- Autorisation : refus par défaut, policy par action, contrôle tenant+ressource, même réponse 404 pour ressource autre tenant.
- API : validation globale, limites de taille, CORS explicite, headers de sécurité, CSRF si cookies, request ID, erreurs non bavardes.
- Fichiers : bucket privé, clés aléatoires, URL courte, checksum, MIME magic bytes, antivirus, quarantaine, interdiction SVG/HTML actifs selon usage.
- IA : minimisation, fournisseurs approuvés, pas d'entraînement sans accord, prompt injection traitée comme donnée hostile, sortie non fiable.
- Données : TLS, chiffrement stockage, sauvegardes chiffrées, secrets hors logs, politique de rétention/purge.
- Administration : MFA, séparation support/admin, justification des dérogations, journal append-only, alertes sur actions sensibles.
- Supply chain : lockfile unique, audit dépendances, provenance images, scans CI, mises à jour contrôlées.

## 4. Tests de sécurité

- Matrice BOLA : chaque endpoint avec ressource d'un autre tenant.
- Escalade horizontale/verticale et rôles personnalisés.
- Brute force, enumeration e-mail, rotation/rejeu de session, CSRF.
- Upload : double extension, MIME mensonger, zip bomb, fichier surdimensionné, malware de test, path traversal.
- Idempotence et concurrence sur quota, paiement et jobs.
- Webhooks invalides, anciens, dupliqués et hors ordre.
- Injection SQL/NoSQL, XSS stockée, CSV injection, prompt injection.
- Vérification restauration de sauvegarde et purge de données.

## 5. Gates avant production

Aucune production avant : threat model revu, secrets externalisés, tests BOLA automatisés, MFA admin, restauration vérifiée, scans sans critique non acceptée, politique incident/rétention approuvée et journalisation observable.

