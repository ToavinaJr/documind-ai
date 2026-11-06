# Dossier de conception DocuMind AI

Statut : **dossier de conception cible avec audit d'existant actualisé au 6 novembre 2026**. Le socle technique NestJS/Prisma existe; les fonctionnalités métier restent à implémenter. Voir l'état vérifié dans [00 — Vision et audit](./00-project-overview-and-audit.md).

## Documents

1. [Vision et audit de l'existant](./00-project-overview-and-audit.md)
2. [Spécifications fonctionnelles et règles métier](./01-functional-specifications-and-business-rules.md)
3. [Architecture cible](./02-target-architecture.md)
4. [Conception des données](./03-database-design.md)
5. [Contrats API](./04-api-specifications.md)
6. [Plan de sécurité](./05-security-plan.md)
7. [Stratégie de tests et critères d'acceptation](./06-testing-and-acceptance.md)
8. [DevOps et infrastructure](./07-devops-infrastructure.md)
9. [Feuille de route et backlog](./08-roadmap-and-backlog.md)
10. [Décisions ouvertes, risques et glossaire](./09-decisions-risks-glossary.md)

## Légende de maturité

- **Fonctionnel localement** : comportement exécuté dans le navigateur et persisté en `localStorage`.
- **Simulé** : résultat prédéfini ou temporisé, sans service réel.
- **Partiel** : parcours présent mais contrat, validation ou résultat incomplet.
- **Absent** : aucun code opérationnel.
- **Cible** : conception proposée, soumise aux décisions ouvertes.

## Sources analysées

- Application React, routes, pages, contextes, repositories et mocks du frontend.
- Documentation existante d'architecture et de quotas.
- Dépôt backend, actuellement sans code applicatif.
- Configuration, scripts, dépendances et variables d'environnement déclarées.

