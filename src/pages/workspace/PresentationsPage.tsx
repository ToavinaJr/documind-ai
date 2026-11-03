import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { PresentationEntity, PresentationSlide } from '../../types';
import {
  Presentation,
  Plus,
  Trash2,
  Download,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const PresentationsPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [presentations, setPresentations] = useState<PresentationEntity[]>([]);
  const [activePres, setActivePres] = useState<PresentationEntity | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const loadPres = async () => {
    const list = await repositories.generation.findPresentations(orgId);
    setPresentations(list);
    if (list.length > 0 && !activePres) {
      setActivePres(list[0]);
    }
  };

  useEffect(() => {
    loadPres();
  }, [orgId]);

  const activeSlide: PresentationSlide | undefined = activePres?.slides[activeSlideIdx];

  const handleUpdateSlide = async (patch: Partial<PresentationSlide>) => {
    if (!activePres || !activeSlide) return;
    const updatedSlides = [...activePres.slides];
    updatedSlides[activeSlideIdx] = { ...activeSlide, ...patch };
    const updated = await repositories.generation.updatePresentation(orgId, activePres.id, {
      slides: updatedSlides
    });
    setActivePres(updated);
    setPresentations((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddSlide = async () => {
    if (!activePres) return;
    const newSlide: PresentationSlide = {
      id: 'sl-' + Date.now().toString(36),
      slideNumber: activePres.slides.length + 1,
      title: 'Nouvelle Diapositive',
      kicker: 'Section Stratégique',
      bullets: ['Premier argument clé', 'Second point d’analyse'],
      speakerNotes: 'Notes du présentateur'
    };
    const updated = await repositories.generation.updatePresentation(orgId, activePres.id, {
      slides: [...activePres.slides, newSlide]
    });
    setActivePres(updated);
    setActiveSlideIdx(updated.slides.length - 1);
    success('Diapositive ajoutée');
  };

  const handleDeleteSlide = async (index: number) => {
    if (!activePres || activePres.slides.length <= 1) return;
    const updatedSlides = activePres.slides.filter((_, i) => i !== index);
    const updated = await repositories.generation.updatePresentation(orgId, activePres.id, {
      slides: updatedSlides
    });
    setActivePres(updated);
    setActiveSlideIdx(Math.max(0, index - 1));
    success('Diapositive supprimée');
  };

  const handleExportPptx = () => {
    if (!activePres) return;
    const slidesHtml = activePres.slides
      .map(
        (s, idx) => `
      <section class="slide">
        <div class="slide-num">Diapositive ${idx + 1} / ${activePres.slides.length}</div>
        <div class="kicker">${s.kicker || 'DocuMind AI Presentation'}</div>
        <h2>${s.title}</h2>
        <ul>
          ${s.bullets.map((b) => `<li>${b}</li>`).join('\n')}
        </ul>
        ${s.speakerNotes ? `<div class="notes"><strong>Notes du présentateur :</strong> ${s.speakerNotes}</div>` : ''}
      </section>`
      )
      .join('\n<hr class="slide-break"/>\n');

    const fullDeck = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${activePres.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #09090B; color: #F2F2F5; margin: 0; padding: 24px; }
    .slide { background: #1A1A1F; border: 1px solid #303038; border-radius: 16px; padding: 48px; max-width: 900px; margin: 0 auto 32px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-height: 480px; position: relative; }
    .slide-num { position: absolute; top: 24px; right: 24px; font-size: 11px; font-family: monospace; color: #A1A1AA; }
    .kicker { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #DE1F4F; margin-bottom: 8px; letter-spacing: 0.05em; }
    h2 { font-size: 28px; margin-top: 0; margin-bottom: 24px; color: #FFFFFF; }
    ul { font-size: 16px; line-height: 1.8; color: #DCE3EC; padding-left: 24px; }
    li { margin-bottom: 12px; }
    .notes { margin-top: 36px; padding: 12px; background: rgba(222, 31, 79, 0.1); border-left: 3px solid #DE1F4F; border-radius: 4px; font-size: 12px; color: #A1A1AA; }
    .slide-break { border: none; margin: 24px 0; }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;

    const blob = new Blob([fullDeck], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePres.title.replace(/\s+/g, '_')}_presentation.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    success('Diaporama exporté', `Fichier ${link.download} téléchargé avec succès.`);
  };

  const themeStyles = {
    executive: 'bg-neutral-900 text-white border-neutral-700',
    corporate: 'bg-white text-neutral-900 border-neutral-200',
    minimalist: 'bg-neutral-50 text-neutral-800 border-neutral-200',
    tech: 'bg-slate-950 text-slate-100 border-slate-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Studio de Présentations & Slides
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Concevez et éditez des diaporamas professionnels avec rendu fidèle par diapositive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSlide}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une slide</span>
          </button>

          <button
            onClick={handleExportPptx}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter PPTX</span>
          </button>
        </div>
      </div>

      {activePres && activeSlide && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Slides Carousel / Thumbnail List */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
              Diapositives ({activePres.slides.length})
            </div>
            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {activePres.slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeSlideIdx === idx
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span className="font-mono">Slide {idx + 1}</span>
                    {activePres.slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="hover:text-rose-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Slide Canvas & Live Editor (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Visual Slide Stage */}
            <div
              className={`p-10 rounded-2xl border shadow-lg aspect-[16/9] max-h-[440px] flex flex-col justify-between transition-colors ${
                themeStyles[activePres.theme || 'corporate']
              }`}
            >
              <div>
                {activeSlide.kicker && (
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {activeSlide.kicker}
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  {activeSlide.title}
                </h2>
              </div>

              <div className="space-y-3 max-w-xl my-4">
                {activeSlide.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="font-bold text-neutral-400">·</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-700/40">
                <span>{activePres.title}</span>
                <span className="font-mono tabular-nums">
                  {activeSlideIdx + 1} / {activePres.slides.length}
                </span>
              </div>
            </div>

            {/* Slide Inline Properties Form */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                Modifier le contenu de la slide {activeSlideIdx + 1}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kicker / Sur-titre
                  </label>
                  <input
                    type="text"
                    value={activeSlide.kicker || ''}
                    onChange={(e) => handleUpdateSlide({ kicker: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Titre principal
                  </label>
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => handleUpdateSlide({ title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Puces & Points clés (une ligne par puce)
                </label>
                <textarea
                  rows={3}
                  value={activeSlide.bullets.join('\n')}
                  onChange={(e) => handleUpdateSlide({ bullets: e.target.value.split('\n') })}
                  className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes de l'orateur
                </label>
                <input
                  type="text"
                  value={activeSlide.speakerNotes || ''}
                  onChange={(e) => handleUpdateSlide({ speakerNotes: e.target.value })}
                  placeholder="Notes privées pour la présentation..."
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
