import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Comment fonctionne le principe « 1 source -> plusieurs livrables » ?',
      a: 'Lorsque vous déposez un fichier (par exemple un enregistrement audio de 40 minutes), DocuMind AI effectue une analyse sémantique globale puis vous permet de cocher les livrables souhaités : compte rendu officiel, procès-verbal, plan d’action avec assignation des tâches, présentation PowerPoint ou email de synthèse. Tous ces documents sont générés en cohérence avec les horodatages de la source.'
    },
    {
      q: 'Quels formats de fichiers sont acceptés en entrée ?',
      a: 'DocuMind accepte les documents (PDF, DOCX, XLSX, CSV, TXT), les images (PNG, JPG, JPEG, WEBP), les audios (MP3, WAV, M4A, OGG) et les vidéos (MP4, MOV, WEBM).'
    },
    {
      q: 'Comment s’effectue le contrôle des quotas et des limites ?',
      a: 'Avant toute opération de traitement lourd, notre moteur vérifie le solde restant sur votre plan (pages OCR, minutes audio/vidéo, nombre de documents). Une alerte proactive est affichée à 85% de consommation pour prévenir les blocages.'
    },
    {
      q: 'Puis-je créer des rôles personnalisés pour mes collaborateurs ?',
      a: 'Oui. Les plans Professional, Business et Enterprise vous permettent de définir des Custom Roles en sélectionnant précisément les permissions parmi notre catalogue granulaire (lecture seule, droit d’exportation, validation OCR, gestion de facturation).'
    },
    {
      q: 'Puis-je exporter mes données vers notre ERP ou notre logiciel comptable ?',
      a: 'Tout à fait. Les données financières extraites par OCR sont exportables en formats CSV et Excel compatibles SAP, Sage et Cegid, ainsi qu’en JSON pour intégration par API REST.'
    }
  ];

  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Foire Aux Questions
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Toutes les réponses pour comprendre le fonctionnement technique et commercial de DocuMind AI.
        </p>

        <div className="mt-8 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-neutral-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-neutral-400" />}
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
