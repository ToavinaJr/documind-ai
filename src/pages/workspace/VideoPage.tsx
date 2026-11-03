import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { VideoEntity } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Video,
  Play,
  UploadCloud,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Subtitles
} from 'lucide-react';

export const VideoPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [videos, setVideos] = useState<VideoEntity[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [durationMin, setDurationMin] = useState(10);

  const loadVideos = async () => {
    const list = await repositories.video.findAll(orgId);
    setVideos(list);
  };

  useEffect(() => {
    loadVideos();
  }, [orgId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const check = checkCanPerform('videoMinutesPerMonth', durationMin);
    if (!check.allowed) {
      toastError('Quota vidéo insuffisant', check.reason);
      return;
    }

    const newVid = await repositories.video.create(orgId, {
      title,
      fileName: `${title.replace(/\s+/g, '_')}.mp4`,
      durationSeconds: durationMin * 60
    });

    await repositories.video.analyze(orgId, newVid.id);
    await consume('videoMinutesPerMonth', durationMin);

    success('Vidéo importée et analysée', `${title} (${durationMin} min).`);
    setIsUploadOpen(false);
    setTitle('');
    loadVideos();
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer la vidéo "${name}" ?`)) {
      await repositories.video.delete(orgId, id);
      success('Vidéo supprimée', name);
      loadVideos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Analyse Vidéo & Chapitrage
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Analysez vos vidéos, webinaires et démos produits avec chapitrage automatique et détection des temps forts.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Importer une vidéo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => navigate(`/workspace/video/${vid.id}`)}
            className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{vid.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.floor(vid.durationSeconds / 60)} min
                      </span>
                      <span>·</span>
                      <span>{vid.chapters.length} chapitres</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(vid.id, vid.title, e)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Chapitres clés :</div>
                {vid.chapters.slice(0, 3).map((ch, i) => (
                  <div key={i} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-400">{ch.startTime}s</span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Subtitles className="w-3.5 h-3.5" />
                Sous-titres & Résumé prêts
              </span>

              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                <span>Consulter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Importer une vidéo pour analyse"
        description="Extraction de chapitres, détection de scènes et génération de sous-titres."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Titre de la vidéo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Démo Produit Client Q4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Durée (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              required
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg"
            >
              Analyser la vidéo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
