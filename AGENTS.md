# AGENTS.md — Règles obligatoires de développement

## 1. Objectif et autorité du document

Ce document définit les règles obligatoires que tous les agents IA, assistants de programmation et contributeurs doivent respecter dans le projet DocuMind AI.

Ces règles s'appliquent à toutes les interventions :
- Analyse et audit du code.
- Conception technique et architecture.
- Développement frontend et backend.
- Création et modification des API.
- Modélisation et évolution de la base de données.
- Intégration de services externes et d'IA.
- Tests, corrections et refactorisation.
- Documentation, configuration et déploiement.

**Ces règles ne sont pas des recommandations facultatives. Elles sont obligatoires.**

Avant toute intervention, l'agent doit :
1. Lire ce fichier `AGENTS.md`.
2. Lire les éventuels fichiers `AGENTS.md` présents dans les sous-répertoires concernés.
3. Examiner le code existant et comprendre son fonctionnement.
4. Identifier les conventions déjà utilisées.
5. Respecter l'architecture et les décisions techniques existantes, sauf justification et validation d'un changement.

En cas de contradiction entre une demande ponctuelle et ces règles, l'agent doit signaler le conflit et demander une clarification avant de prendre une décision qui compromettrait les règles du projet.

---

# 2. Principes fondamentaux de développement

L'agent doit systématiquement appliquer les principes suivants :

### 2.1. Qualité du code

- KISS : privilégier les solutions simples et compréhensibles.
- DRY : éviter les duplications inutiles.
- SOLID : respecter les responsabilités et les dépendances.
- YAGNI : ne pas développer des fonctionnalités qui ne sont pas nécessaires.
- Separation of Concerns : séparer les responsabilités.
- Composition over Inheritance : privilégier la composition lorsque pertinente.
- Fail Fast : détecter et signaler rapidement les erreurs.
- Explicit over Implicit : privilégier un comportement explicite et prévisible.

### 2.2. Règles obligatoires

- Ne jamais introduire de code sans comprendre son utilité.
- Ne jamais créer une abstraction sans besoin concret.
- Ne jamais multiplier les fichiers, classes, services ou interfaces inutilement.
- Ne jamais dupliquer une logique métier déjà existante.
- Ne jamais conserver du code mort, des imports inutilisés ou des variables inutilisées.
- Ne jamais laisser de TODO sans justification ni suivi.
- Ne jamais masquer une erreur avec un fallback arbitraire.
- Ne jamais supprimer une fonctionnalité existante sans justification et validation.
- Ne jamais modifier des fichiers hors du périmètre demandé sans raison valable.
- Ne jamais faire de refactorisation massive pendant l'implémentation d'une fonctionnalité indépendante.

### 2.3. Lisibilité et maintenabilité

Chaque fichier doit avoir une responsabilité claire.

L'agent doit :
- Préférer des fonctions courtes et compréhensibles.
- Utiliser des noms explicites.
- Éviter les paramètres et dépendances inutiles.
- Limiter les effets de bord.
- Éviter les conditions complexes et les imbrications excessives.
- Factoriser uniquement les logiques réellement réutilisables.
- Maintenir une cohérence avec les conventions du projet.

Un fichier qui devient difficile à comprendre doit être réévalué et éventuellement découpé.

---

# 3. Architecture et technologies

## 3.1. Stack technique

Le projet utilise ou prévoit d'utiliser :

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Bun

### Backend
- NestJS
- TypeScript
- Bun
- Prisma ORM
- PostgreSQL

### Infrastructure
- Docker
- Docker Compose
- Variables d'environnement
- API REST
- Swagger / OpenAPI

L'agent doit vérifier les versions réellement présentes dans les fichiers de configuration avant de proposer une implémentation.

Il ne doit jamais supposer qu'une bibliothèque, une commande ou une API est disponible sans vérification.

## 3.2. Architecture générale

Privilégier une architecture modulaire et évolutive, sans surarchitecture.

Le backend doit être organisé autour de modules métier cohérents.

Les domaines envisagés comprennent notamment :
- Identity et Authentication.
- Organizations et Workspaces.
- Members et Permissions.
- Projects.
- Files et Documents.
- OCR et Extraction.
- Audio et Transcription.
- Video et Processing.
- Generations et Presentations.
- Workflows.
- Usage et Quotas.
- Billing et Subscriptions.
- Notifications.
- Audit Logs.
- Administration.

Cette liste n'impose pas de créer immédiatement tous les modules.

Chaque module doit être créé uniquement lorsqu'un besoin fonctionnel réel le justifie.

L'agent doit éviter les dépendances circulaires et préserver une séparation claire entre :
- Présentation.
- Logique applicative.
- Logique métier.
- Accès aux données.
- Services externes.

---

# 4. Compréhension métier obligatoire

L'agent ne doit jamais implémenter une fonctionnalité en se basant uniquement sur son nom ou sur une description superficielle.

Avant chaque implémentation, il doit identifier :

1. Le problème métier à résoudre.
2. Les utilisateurs concernés.
3. Le rôle de chaque utilisateur.
4. Le parcours utilisateur.
5. Les règles métier.
6. Les données nécessaires.
7. Les conditions de validation.
8. Les cas d'erreur.
9. Les restrictions et permissions.
10. Les interactions avec les fonctionnalités existantes.

Il doit également identifier les conséquences de cette fonctionnalité sur les autres modules.

### Règles métier

Chaque règle métier importante doit être explicite.

Exemples :
- Un utilisateur ne doit accéder qu'aux ressources auxquelles il est autorisé.
- Une organisation ne doit pas accéder aux données d'une autre organisation.
- Les quotas doivent être réellement appliqués côté backend.
- Une limite égale à zéro doit rester égale à zéro.
- Une opération payante doit vérifier l'état de l'abonnement.
- Une ressource expirée ne doit pas être considérée comme active.
- Une opération asynchrone doit avoir un état et une gestion des erreurs cohérents.

L'agent ne doit jamais inventer une règle métier lorsqu'une information est absente.

Il doit signaler les ambiguïtés avant l'implémentation.

---

# 5. Protocole obligatoire avant chaque implémentation

Aucune implémentation significative ne doit commencer sans une phase d'analyse et de planification.

L'agent doit présenter un plan compréhensible avant de modifier le code.

## 5.1. Analyse de l'existant

Il doit examiner :
- Les fichiers concernés.
- Les composants existants.
- Les modules backend concernés.
- Les modèles Prisma.
- Les endpoints existants.
- Les services et dépendances.
- Les tests existants.
- Les conventions du projet.
- Les fonctionnalités susceptibles d'être impactées.

Il doit réutiliser les éléments existants lorsqu'ils sont adaptés.

## 5.2. Plan d'implémentation

Le plan doit présenter :
- L'objectif.
- Les étapes d'implémentation.
- Les fichiers à créer.
- Les fichiers à modifier.
- Les responsabilités de chaque élément.
- Les dépendances nécessaires.
- Les éventuelles migrations.
- Les impacts frontend/backend.
- Les risques techniques.
- Les risques de régression.

Le plan doit être découpé en petites étapes vérifiables.

## 5.3. Contrats techniques obligatoires

Pour toute fonctionnalité impliquant une API, l'agent doit préciser :

- Méthode HTTP.
- URL.
- Authentification requise.
- Permissions nécessaires.
- Paramètres de route.
- Query parameters.
- Structure du DTO.
- Champs obligatoires et facultatifs.
- Exemple de requête.
- Exemple de réponse réussie.
- Codes HTTP possibles.
- Structure des erreurs.
- Règles de validation.
- Pagination, tri et filtres si nécessaires.

Pour toute évolution de la base de données, il doit préciser :
- Les modèles concernés.
- Les champs ajoutés, modifiés ou supprimés.
- Les relations.
- Les contraintes.
- Les index.
- Les conséquences sur les données existantes.
- La stratégie de migration.

## 5.4. Critères d'acceptation

Avant le développement, l'agent doit définir les résultats attendus.

Chaque critère doit être vérifiable et correspondre à un comportement concret.

Il doit également identifier les cas limites et les scénarios d'échec.

---

# 6. Sécurité obligatoire

La sécurité doit être intégrée dès la conception et non ajoutée après le développement.

L'agent doit appliquer les bonnes pratiques OWASP et vérifier notamment :

### Authentification
- Vérification systématique de l'identité.
- Gestion sécurisée des sessions et tokens.
- Hachage des mots de passe avec un algorithme adapté, comme Argon2id.
- Expiration et renouvellement maîtrisés des tokens.
- Protection contre les attaques par force brute.

### Autorisations
- Vérification des permissions côté backend.
- Protection contre les accès non autorisés.
- Contrôle des ressources appartenant à une organisation.
- Protection contre les vulnérabilités IDOR/BOLA.
- Vérification des rôles et permissions à chaque opération sensible.

### Multi-tenant
- Isolation stricte des données entre organisations.
- Vérification de l'appartenance des ressources.
- Ne jamais faire confiance à un `organizationId` fourni par le frontend sans contrôle.
- Éviter les requêtes sans filtre de tenant lorsque celui-ci est nécessaire.
- Tester explicitement les accès inter-organisations.

### API et données
- Validation de toutes les entrées.
- Protection contre les injections.
- Gestion sécurisée des erreurs.
- Limitation des données exposées.
- Protection contre les abus de ressources.
- Rate limiting sur les opérations sensibles.

### Fichiers
- Vérification du type réel des fichiers.
- Limitation de taille.
- Noms de fichiers sécurisés.
- Contrôle des extensions.
- Stockage sécurisé.
- Vérification des droits d'accès aux fichiers.
- Prévention des chemins de fichiers arbitraires.

### Secrets
- Aucun secret dans le code source.
- Aucun mot de passe ou token dans Git.
- Utilisation des variables d'environnement.
- Maintien d'un `.env.example` sans secret réel.
- Vérification des risques de fuite dans les logs.

L'agent doit signaler toute vulnérabilité découverte, même si elle est située en dehors du périmètre immédiat de la fonctionnalité.

Il ne doit pas corriger silencieusement une vulnérabilité nécessitant une modification importante du périmètre.

---

# 7. Qualité TypeScript et conventions

Les règles suivantes sont obligatoires :

- Utiliser le typage strict.
- Ne pas utiliser `any`.
- Éviter `unknown` lorsqu'un type précis peut être défini.
- Valider les données provenant de sources externes.
- Éviter les conversions de types non justifiées.
- Ne pas utiliser les assertions de type pour masquer un problème.
- Éviter les valeurs magiques.
- Centraliser les constantes réellement partagées.
- Ne pas dupliquer les types de contrats API.
- Respecter les conventions de nommage du projet.

Les types doivent représenter les véritables structures de données et non simplement faire disparaître les erreurs du compilateur.

---

# 8. Base de données et Prisma

Toute modification de la base de données doit être réfléchie.

L'agent doit obligatoirement :

- Utiliser Prisma pour les accès aux données.
- Définir correctement les relations.
- Ajouter les contraintes nécessaires.
- Prévoir les index utiles.
- Éviter les requêtes N+1.
- Éviter les chargements de données inutiles.
- Utiliser les transactions lorsque plusieurs opérations doivent être atomiques.
- Vérifier les conséquences des suppressions.
- Préserver l'intégrité des données.
- Prévoir les migrations de manière explicite.

Interdictions :
- Modifier directement la base sans migration contrôlée.
- Supprimer des données pour faciliter une migration.
- Utiliser `db push` comme remplacement systématique des migrations.
- Introduire des relations incohérentes.
- Faire confiance aux identifiants transmis par le client sans contrôle d'accès.

Chaque migration doit être examinée avant son application.

---

# 9. Frontend et expérience utilisateur

L'agent doit préserver la cohérence visuelle et fonctionnelle du produit.

Il doit obligatoirement :
- Examiner les composants existants avant d'en créer de nouveaux.
- Réutiliser le design system.
- Respecter les conventions UI.
- Préserver la responsivité.
- Prévoir les états de chargement.
- Prévoir les états vides.
- Prévoir les erreurs.
- Prévoir les confirmations pour les actions sensibles.
- Vérifier les formulaires et leurs validations.
- Éviter les boutons sans action.
- Éviter les liens morts.
- Éviter les interfaces qui simulent une action non réellement implémentée.

Aucune fonctionnalité ne doit être considérée comme terminée si son parcours utilisateur est incomplet.

Si une fonctionnalité nécessite une API non disponible, l'agent doit distinguer clairement :
- Ce qui est réellement implémenté.
- Ce qui est simulé.
- Ce qui reste à connecter.

---

# 10. Gestion des traitements asynchrones et IA

Les traitements lourds tels que OCR, transcription, génération de documents et traitement vidéo ne doivent pas bloquer inutilement les requêtes HTTP.

L'agent doit étudier une architecture adaptée aux traitements asynchrones.

Chaque traitement doit prévoir, selon le besoin :
- Un identifiant de tâche.
- Un état explicite.
- Une progression.
- Une date de création.
- Une date de fin.
- Une gestion des erreurs.
- Une stratégie de reprise.
- Une limitation des tentatives.
- Une gestion des doublons.
- Une politique de nettoyage.

Les états doivent être cohérents et documentés.

Les intégrations IA doivent prévoir :
- Gestion des erreurs du fournisseur.
- Timeouts.
- Limites de consommation.
- Suivi des coûts.
- Gestion des quotas.
- Validation des résultats.
- Journalisation sans exposition de données sensibles.

Ne jamais prétendre qu'un résultat a été généré ou traité si le traitement n'a pas réellement été exécuté.

---

# 11. Tests automatiques obligatoires

Aucune fonctionnalité ne doit être considérée comme terminée uniquement parce que le code compile.

L'agent doit identifier et exécuter les tests adaptés.

### Tests unitaires
Vérifier :
- Les fonctions métier.
- Les services.
- Les validations.
- Les calculs de quotas.
- Les permissions.
- Les cas limites.
- Les erreurs attendues.

### Tests d'intégration
Vérifier :
- Les interactions entre modules.
- Les repositories.
- Prisma et PostgreSQL.
- Les transactions.
- Les appels aux services externes lorsqu'ils peuvent être testés de manière contrôlée.

### Tests API / E2E
Vérifier :
- Les endpoints.
- L'authentification.
- Les permissions.
- Les validations.
- Les réponses HTTP.
- Les erreurs.
- L'isolation multi-tenant.

### Tests de régression
Avant de terminer, vérifier que les fonctionnalités existantes concernées continuent de fonctionner.

L'agent doit ajouter des tests pour les bugs corrigés afin d'éviter leur réapparition.

### Vérifications techniques
Exécuter, lorsque disponibles :
- Lint.
- Typecheck.
- Tests unitaires.
- Tests d'intégration.
- Tests E2E.
- Build frontend.
- Build backend.

**Interdiction de déclarer un test réussi sans l'avoir réellement exécuté.**

Si un test n'a pas pu être exécuté, l'agent doit le signaler explicitement et expliquer pourquoi.

---

# 12. Vérifications visuelles et manuelles obligatoires

Les tests automatiques ne remplacent pas les vérifications visuelles.

Pour toute modification frontend, l'agent doit fournir un guide de vérification manuelle.

Ce guide doit préciser :
- La page à ouvrir.
- Le compte ou le rôle nécessaire, si applicable.
- Les étapes à suivre.
- Les données à utiliser.
- Le résultat attendu.
- Les erreurs à vérifier.
- Les comportements responsives à contrôler.

Exemples :
1. Ouvrir la page de connexion.
2. Soumettre un formulaire vide.
3. Vérifier les messages de validation.
4. Se connecter avec un compte valide.
5. Vérifier la redirection.
6. Vérifier l'affichage du tableau de bord.
7. Tester les permissions avec un autre rôle.

Si un navigateur ou un outil de test visuel est disponible et autorisé, l'agent doit l'utiliser lorsque cela est pertinent.

**Ne jamais affirmer qu'un test visuel a été effectué si la page n'a pas réellement été inspectée.**

L'agent doit distinguer les tests automatiques exécutés des tests manuels que le développeur doit encore réaliser.

---

# 13. Prévention des régressions

Chaque modification doit être évaluée en fonction de ses conséquences sur le reste du système.

Avant de modifier un élément, l'agent doit rechercher :
- Ses dépendances.
- Ses consommateurs.
- Ses appels.
- Ses contrats.
- Les composants qui l'utilisent.
- Les tests associés.

Après modification, il doit vérifier :
- Que les imports restent valides.
- Que les contrats ne sont pas cassés.
- Que les fonctionnalités liées fonctionnent toujours.
- Que les permissions restent cohérentes.
- Que les données existantes restent compatibles.
- Que les tests précédents passent toujours.

Ne jamais supprimer ou remplacer une logique existante sans vérifier ses usages.

---

# 14. Documentation obligatoire

La documentation doit évoluer avec le code.

L'agent doit mettre à jour les documents concernés lorsque l'implémentation change :

- Architecture.
- Modules et responsabilités.
- Installation et démarrage.
- Variables d'environnement.
- Configuration Docker.
- Modèle de données.
- Migrations.
- Endpoints API.
- Règles métier.
- Authentification et permissions.
- Procédures de test.
- Décisions techniques importantes.

Les documentations de tests doivent préciser :
- Les prérequis.
- Les commandes.
- Les données nécessaires.
- Les étapes.
- Les résultats attendus.
- Les résultats réellement obtenus.

Ne jamais documenter une fonctionnalité comme terminée si elle est encore partielle.

Éviter les documentations redondantes ou obsolètes.

---

# 15. Git et gestion des modifications

L'agent doit travailler proprement avec Git.

Obligations :
- Vérifier la branche actuelle.
- Examiner `git status` avant toute modification.
- Respecter les changements non commités de l'utilisateur.
- Ne jamais écraser du travail existant.
- Ne jamais effectuer de reset destructif sans autorisation.
- Ne jamais créer de commit ou pousser du code sans demande explicite.
- Limiter les changements au périmètre demandé.
- Examiner le diff avant de terminer.

Les changements doivent être cohérents et faciles à examiner.

---

# 16. Protocole obligatoire pendant l'implémentation

L'agent doit travailler par petites étapes.

Pour chaque étape :
1. Expliquer brièvement ce qui va être fait.
2. Implémenter une partie cohérente.
3. Vérifier le code produit.
4. Exécuter les tests pertinents.
5. Corriger les problèmes détectés.
6. Vérifier les éventuelles régressions.
7. Mettre à jour la documentation concernée.

Ne pas implémenter plusieurs fonctionnalités indépendantes dans un seul bloc massif.

Ne pas poursuivre en ignorant une erreur importante détectée à une étape précédente.

Si une décision technique importante devient nécessaire en cours de développement, l'agent doit expliquer le problème, présenter les options et demander une décision lorsqu'elle dépasse le périmètre initial.

---

# 17. Revue indépendante obligatoire

À la fin de chaque implémentation significative, l'agent doit effectuer une revue indépendante de son propre travail.

Il doit se comporter comme un développeur senior qui examine un code écrit par quelqu'un d'autre.

Rechercher notamment :
- Bugs fonctionnels.
- Erreurs de logique métier.
- Failles de sécurité.
- Problèmes d'autorisation.
- Fuites de données.
- Problèmes de typage.
- Duplications.
- Code mort.
- Complexité inutile.
- Dépendances circulaires.
- Problèmes de performances.
- Mauvaise gestion des erreurs.
- Régressions potentielles.
- Tests manquants.

Les problèmes identifiés doivent être corrigés avant de déclarer le travail terminé, dans la limite du périmètre autorisé.

Les problèmes hors périmètre doivent être signalés séparément.

---

# 18. Rapport final obligatoire

À la fin de chaque intervention, l'agent doit obligatoirement fournir un compte rendu structuré.

## A. Résumé
- Objectif de la demande.
- Résultat obtenu.
- Fonctionnalités réellement implémentées.

## B. Modifications
- Fichiers créés.
- Fichiers modifiés.
- Fichiers supprimés.
- Rôle de chaque modification.

## C. Règles métier
- Règles appliquées.
- Cas limites gérés.
- Hypothèses retenues.
- Points nécessitant une décision.

## D. Architecture et API
- Modules concernés.
- Endpoints créés ou modifiés.
- Méthodes HTTP.
- DTO.
- Exemples de requêtes et réponses.
- Permissions nécessaires.

## E. Base de données
- Modèles Prisma modifiés.
- Migrations créées.
- Contraintes et relations.
- Commandes nécessaires.

## F. Tests automatiques
Présenter un tableau :

| Test | Commande | Résultat |
|---|---|---|
| Lint | Commande réellement exécutée | Réussi / Échec / Non exécuté |
| Typecheck | Commande réellement exécutée | Réussi / Échec / Non exécuté |
| Tests unitaires | Commande réellement exécutée | Réussi / Échec / Non exécuté |
| Tests d'intégration | Commande réellement exécutée | Réussi / Échec / Non exécuté |
| Tests E2E | Commande réellement exécutée | Réussi / Échec / Non exécuté |
| Build | Commande réellement exécutée | Réussi / Échec / Non exécuté |

Ne pas afficher de résultats fictifs.

## G. Vérifications manuelles et visuelles
- Pages à ouvrir.
- Scénarios à tester.
- Étapes à suivre.
- Résultats attendus.
- Vérifications responsives.
- Tests restant à réaliser par le développeur.

## H. Sécurité et régressions
- Contrôles effectués.
- Vulnérabilités découvertes.
- Régressions recherchées.
- Résultats de la revue indépendante.

## I. Documentation
- Documents créés.
- Documents mis à jour.
- Informations restant à documenter.

## J. Points restants
- Fonctionnalités incomplètes.
- Problèmes connus.
- Risques.
- Dette technique.
- Prochaine étape recommandée.

---

# 19. Interdictions absolues

L'agent ne doit jamais :

1. Implémenter sans analyser l'existant.
2. Inventer des règles métier.
3. Ignorer les contraintes de sécurité.
4. Introduire des données fictives dans une fonctionnalité présentée comme opérationnelle.
5. Déclarer des tests réussis sans exécution réelle.
6. Déclarer un build réussi sans l'avoir exécuté.
7. Prétendre avoir vérifié visuellement une interface sans l'avoir inspectée.
8. Supprimer du code ou des données sans justification.
9. Ignorer les erreurs de compilation ou de typage.
10. Contourner les tests pour faire passer artificiellement une implémentation.
11. Introduire des dépendances sans expliquer leur nécessité.
12. Faire une refactorisation non demandée qui augmente inutilement le risque.
13. Modifier les configurations sensibles sans examiner leurs conséquences.
14. Cacher les limitations ou les éléments non terminés.
15. Considérer une fonctionnalité comme terminée si ses critères d'acceptation ne sont pas satisfaits.

---

# 20. Règle finale : comprendre avant de produire

Le rôle de l'agent n'est pas simplement de générer du code.

Il doit agir comme un développeur expérimenté qui :
- Comprend le besoin.
- Analyse le système.
- Explique les décisions.
- Anticipe les problèmes.
- Propose une solution adaptée.
- Implémente progressivement.
- Vérifie son travail.
- Protège l'existant.
- Documente les changements.
- Rend compte honnêtement des résultats.

Le développeur humain conserve la responsabilité des décisions techniques importantes et de la validation finale.

**Principe directeur : aucun code ne doit être ajouté sans raison, aucune fonctionnalité ne doit être déclarée terminée sans vérification et aucune décision importante ne doit être prise sans être comprise.**