import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ScanText,
  Mic,
  Video,
  Presentation,
  Clapperboard,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ScanText,
      badge: 'Document Intelligence',
      title: 'OCR Haute Précision & Extraction Tabulaire',
      description:
        'Analysez n’importe quelle facture, reçu ou contrat. Notre pipeline détecte les zones textuelles et les tableaux avec une précision supérieure à 98.9%.',
      bullets: [
        'Extraction structurée des montants HT/TVA/TTC, dates et références',
        'Détection automatique des anomalies et dépassements budgétaires',
        'Validation humaine intégrée avec interface de correction champ par champ',
        'Export direct aux formats CSV, Excel normalisé et JSON'
      ]
    },
    {
      icon: Mic,
      badge: 'Audio Intelligence',
      title: 'Transcription Multimodale & Diarisation Locuteurs',
      description:
        'Transformez vos enregistrements de réunions en véritables mines d’or décisionnelles avec identification automatique des intervenants.',
      bullets: [
        'Diarisation précise par couleur et étiquettes nominatives',
        'Détection automatique des décisions fermes et liste de risques',
        'Tableau d’action items avec attribution et dates d’échéances',
        'Génération simultanée de 10 livrables à partir d’un seul enregistrement'
      ]
    },
    {
      icon: Presentation,
      badge: 'Content & Presentation Studio',
      title: 'Génération de Présentations & Documents Exécutifs',
      description:
        'Passez de la note brute ou de l’enregistrement audio à un support de présentation PowerPoint structuré par diapositives en quelques clics.',
      bullets: [
        'Génération de diapositives professionnelles avec kicker, puces et notes orateur',
        'Thèmes soignés : Corporate, Minimaliste, Tech et Exécutif',
        'Éditeur visuel de slides (réorganisation, ajout, suppression)',
        'Export PowerPoint (.pptx) et document PDF certifié'
      ]
    },
    {
      icon: Clapperboard,
      badge: 'Media Creation',
      title: 'Studio Vidéo Publicitaire & Storyboard',
      description:
        'Concevez des spots publicitaires engageants pour vos produits ou services à partir d’un simple document commercial ou d’un cahier des charges.',
      bullets: [
        'Analyse sémantique de la proposition de valeur et arguments clés',
        'Génération du script en 4 temps : Accroche, Problème, Solution, CTA',
        'Storyboard scène par scène avec durées, voix off et mouvements caméra',
        'Adaptation multiformat : 16:9 (YouTube), 9:16 (TikTok/Reels), 1:1 (LinkedIn)'
      ]
    },
    {
      icon: GitBranch,
      badge: 'Automation',
      title: 'Workflow Builder Visuel Connecté',
      description:
        'Enchaînez sans code des pipelines complexes combinant ingestion, OCR, classification, synthèse, validation humaine et export comptable.',
      bullets: [
        'Éditeur visuel de nœuds interactif',
        'Nœud de contrôle humain avec routage par rôle RBAC',
        'Exécution asynchrone traçable avec journalisation étape par étape',
        'Historique complet des exécutions pour audit'
      ]
    }
  ];

  return (
    <div className="py-16 px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Capacités de la Plateforme
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          L'arsenal multimodal complet pour les professionnels
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Chaque outil a été conçu pour respecter les flux de travail réels des entreprises sans gadgets superflus.
        </p>
      </div>

      <div className="space-y-12">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
            >
              <div className="md:col-span-1">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{feat.badge}</div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{feat.title}</h2>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                  Fonctionnalités clés incluses :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feat.bullets.map((b, bi) => (
                    <div key={bi} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate('/workspace/dashboard')}
          className="px-6 py-3 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <span>Tester ces fonctionnalités en démo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
