# DocuMind AI — Architecture Overview

## 1. Vision Globale
DocuMind AI est une plateforme SaaS multimodale d'intelligence documentaire, de génération de contenus et d'automatisation.
L'application repose sur le principe fondamental : **Une source unique produit simultanément N livrables reliés et traçables**.

## 2. Piliers Applicatifs
- **Document Intelligence** : Reconnaissance OCR vectorielle, extraction tabulaire financière, détection d'anomalies budgétaires, validation humaine intégrée.
- **Content & Presentation Generation** : Création de synthèses exécutives, comptes rendus de réunions, présentations PowerPoint (diapositives éditables).
- **Media & Video Generation** : Transcription Whisper avec diarisation par locuteurs, chapitrage sémantique vidéo, studio publicitaire en 6 étapes.
- **Workflow Automation** : Builder visuel de graphes (React Flow / Canvas SVG) avec nœuds de validation humaine et exports comptables ERP.

## 3. Séparation des Espaces
1. **Site Public** (`/`, `/features`, `/solutions`, `/pricing`, `/templates`, `/about`, `/faq`, `/contact`, `/login`, `/register`).
2. **Client Workspace** (`/workspace/*`) : Gestion multi-tenant isolée, studios documentaires, audio, vidéo et gestion d'équipe.
3. **Platform Backoffice** (`/admin/*`) : Super-administration, plans commerciaux, feature flags, factures globales, dérogations de quotas et journal d'audit.
