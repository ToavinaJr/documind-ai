import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Scale, Calculator, Briefcase, ArrowRight } from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: Calculator,
      title: 'Directions Financières & Comptables',
      tagline: 'Zéro saisie manuelle, rapprochement automatisé et alertes de dépassement budgétaire.',
      points: [
        'Ingestion en masse des factures PDF, PNG et scans de notes de frais',
        'Extraction instantanée des montants HT/TVA/TTC, dates et IBAN',
        'Contrôle automatique de cohérence avec les bons de commande',
        'Export direct aux formats compatibles SAP, Sage, Cegid et Excel'
      ]
    },
    {
      icon: Scale,
      title: 'Directions Juridiques & Cabinets d’Avocats',
      tagline: 'Audit contractuel accéléré et détection des clauses à risque.',
      points: [
        'Repérage immédiat des clauses de non-concurrence, pénalités et juridictions compétentes',
        'Fiches de synthèse juridiques prêtes pour les comités exécutifs',
        'Traçabilité de chaque conclusion vers le paragraphe et la page exacte du contrat',
        'Stockage chiffré AES-256 avec journalisation stricte des accès'
      ]
    },
    {
      icon: Briefcase,
      title: 'Cabinets de Conseil, ESN & Gestion de Projet',
      tagline: 'De la réunion client au plan d’action et livrable en moins de 5 minutes.',
      points: [
        'Diarisation audio des réunions et cadrages techniques',
        'Génération automatique de comptes rendus, PV et listes de décisions',
        'Transformation des spécifications en User Stories et Backlog Agile',
        'Création instantanée de présentations PowerPoint aux couleurs de la marque'
      ]
    },
    {
      icon: Building2,
      title: 'Équipes Marketing & Communication B2B',
      tagline: 'Génération de vidéos publicitaires et contenus éditoriaux à haute valeur.',
      points: [
        'Transformation d’un livre blanc ou fiche produit en storyboard vidéo',
        'Scripts en 4 temps optimisés pour la conversion et l’engagement',
        'Création de posts LinkedIn et newsletters dérivées de vos rapports d’expertise',
        'Adaptation multiformat 16:9, 9:16 et 1:1 pour tous les canaux'
      ]
    }
  ];

  return (
    <div className="py-16 px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Conçu pour les métiers à forte exigence
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Découvrez comment DocuMind AI s'intègre harmonieusement dans les pratiques quotidiennes des directions opérationnelles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {solutions.map((sol, idx) => {
          const Icon = sol.icon;
          return (
            <div
              key={idx}
              className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{sol.title}</h2>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {sol.tagline}
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                  {sol.points.map((pt, pti) => (
                    <div key={pti} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="text-neutral-400 font-bold">·</span>
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => navigate('/workspace/dashboard')}
                  className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1.5"
                >
                  <span>Explorer ce cas d'usage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
