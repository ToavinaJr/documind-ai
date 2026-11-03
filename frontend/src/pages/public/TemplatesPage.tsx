import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookTemplate, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'documents' | 'reunions' | 'marketing' | 'juridique'>('all');

  const templates = [
    {
      id: 'tmpl-1',
      title: 'Compte Rendu Exécutif Codir',
      category: 'reunions',
      badge: 'Réunion & Stratégie',
      desc: 'Structure en 3 volets : synthèse décisionnelle, matrice des arbitrages et calendrier d’actions nominatives.',
      format: 'DOCX / Markdown'
    },
    {
      id: 'tmpl-2',
      title: 'Procès-Verbal d’Assemblée Générale',
      category: 'juridique',
      badge: 'Gouvernance & Juridique',
      desc: 'Modèle certifié comprenant quorum, vote des résolutions, signatures et mentions légales obligatoires.',
      format: 'PDF Certifié'
    },
    {
      id: 'tmpl-3',
      title: 'Audit Contractuel & Fiche de Risques',
      category: 'juridique',
      badge: 'Conformité & Risques',
      desc: 'Analyse synthétique des clauses critiques, obligations financières et pénalités de rupture.',
      format: 'PDF / PPTX'
    },
    {
      id: 'tmpl-4',
      title: 'Spot Publicitaire Produit B2B',
      category: 'marketing',
      badge: 'Vidéo & Marketing',
      desc: 'Script publicitaire 4 étapes (Accroche, Douleur, Solution, CTA) et storyboard 16:9 / 9:16.',
      format: 'Vidéo Studio'
    },
    {
      id: 'tmpl-5',
      title: 'Cahier des Charges & Backlog Agile',
      category: 'documents',
      badge: 'Produit & Tech',
      desc: 'Transformation des besoins métiers en spécifications fonctionnelles, critères d’acceptation et User Stories.',
      format: 'DOCX / Markdown'
    },
    {
      id: 'tmpl-6',
      title: 'Présentation Stratégique Conseil d’Administration',
      category: 'documents',
      badge: 'Présentation PPTX',
      desc: 'Diaporama épuré style exécutif : bilan financier, KPI clés et feuille de route opérationnelle.',
      format: 'PowerPoint PPTX'
    }
  ];

  const filtered = filter === 'all' ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="py-16 px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Bibliothèque de Modèles Certifiés
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Démarrez instantanément avec des trames éprouvées, prêtes à être alimentées par vos fichiers ou vos audios.
        </p>

        {/* Filter buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg max-w-fit mx-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Tous les modèles
          </button>
          <button
            onClick={() => setFilter('reunions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'reunions'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Réunions & PV
          </button>
          <button
            onClick={() => setFilter('juridique')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'juridique'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Juridique & Audit
          </button>
          <button
            onClick={() => setFilter('marketing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'marketing'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Vidéo & Marketing
          </button>
          <button
            onClick={() => setFilter('documents')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'documents'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Spécifications & Slides
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2 text-neutral-400">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">{tmpl.badge}</span>
                <span className="font-mono">{tmpl.format}</span>
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">{tmpl.title}</h3>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
