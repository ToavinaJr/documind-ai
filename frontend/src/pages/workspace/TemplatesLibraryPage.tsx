import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookTemplate, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const TemplatesLibraryPage: React.FC = () => {
  const navigate = useNavigate();

  const templates = [
    {
      title: 'Compte Rendu Exécutif Codir',
      category: 'Réunion & Stratégie',
      desc: 'Synthèse décisionnelle, arbitrages validés et plan d’action avec dates limites.',
      format: 'DOCX / Markdown'
    },
    {
      title: 'Procès-Verbal d’Assemblée Générale',
      category: 'Gouvernance & Juridique',
      desc: 'Quorum, vote des résolutions, signatures et mentions légales obligatoires.',
      format: 'PDF Certifié'
    },
    {
      title: 'Audit Contractuel & Fiche de Risques',
      category: 'Conformité & Risques',
      desc: 'Analyse synthétique des clauses critiques, obligations financières et pénalités de rupture.',
      format: 'PDF / PPTX'
    },
    {
      title: 'Spot Publicitaire B2B',
      category: 'Vidéo & Marketing',
      desc: 'Script publicitaire 4 étapes et storyboard scène par scène.',
      format: 'Vidéo Studio'
    },
    {
      title: 'Cahier des Charges & Backlog Agile',
      category: 'Produit & Tech',
      desc: 'Transformation des besoins en spécifications fonctionnelles et User Stories.',
      format: 'DOCX / Markdown'
    },
    {
      title: 'Présentation Stratégique Conseil d’Administration',
      category: 'Présentation PPTX',
      desc: 'Diaporama épuré : bilan financier, KPI clés et feuille de route.',
      format: 'PowerPoint PPTX'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Bibliothèque de Modèles du Workspace
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Utilisez ces trames standardisées pour accélérer vos synthèses et vos présentations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tmpl, idx) => (
          <div
            key={idx}
            className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2 text-neutral-400">
                <span className="font-semibold text-neutral-500">{tmpl.category}</span>
                <span className="font-mono">{tmpl.format}</span>
              </div>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">{tmpl.title}</h2>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {tmpl.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => navigate('/workspace/document-studio')}
                className="w-full py-2 px-3 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Utiliser ce modèle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
