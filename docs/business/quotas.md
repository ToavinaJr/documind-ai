# DocuMind AI — Quota & Limits Engine

## 1. Ressources Mesurées
| Ressource | Clé Système | Unité | Paliers Typiques |
|---|---|---|---|
| Stockage Cloud | `storageGb` | Go | 500 Mo à 1 000 Go |
| Ingestion Documentaire | `documentsPerMonth` | Docs | 20 à Illimité |
| Extraction OCR Tabulaire | `ocrPagesPerMonth` | Pages | 50 à 30 000 |
| Transcription Audio | `audioMinutesPerMonth` | Min | 15 à 5 000 |
| Analyse Vidéo | `videoMinutesPerMonth` | Min | 0 à 1 000 |
| Générations Documentaires | `docGenerationsPerMonth` | Docs | 10 à 5 000 |
| Présentations PPTX | `presentationsPerMonth` | Slides | 2 à 500 |
| Vidéos Publicitaires | `videoGenerationsMinutesPerMonth` | Min | 0 à 60 |
| Workflows Actifs | `activeWorkflows` | Nb | 1 à 100 |
| Exécutions Mensuelles | `workflowExecutionsPerMonth` | Nb | 25 à 25 000 |
| Membres d'Équipe | `maxMembers` | Users | 1 à Illimité |

## 2. Dérogations Administratives (Quota Overrides)
Un administrateur de plateforme peut accorder un quota temporaire supérieur via `/admin/organizations` en spécifiant la ressource, la nouvelle valeur et le motif (ex: séminaire annuel). Cette dérogation s'applique en priorité sur les plafonds du plan d'abonnement.
