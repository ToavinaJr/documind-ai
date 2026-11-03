import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { AudioEntity } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Mic,
  Play,
  Pause,
  UploadCloud,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Trash2
} from 'lucide-react';

export const AudioPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [audios, setAudios] = useState<AudioEntity[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [durationMin, setDurationMin] = useState(30);

  const loadAudios = async () => {
    const list = await repositories.audio.findAll(orgId);
    setAudios(list);
  };

  useEffect(() => {
    loadAudios();
  }, [orgId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const check = checkCanPerform('audioMinutesPerMonth', durationMin);
    if (!check.allowed) {
      toastError('Quota audio insuffisant', check.reason);
      return;
    }

    const newAudio = await repositories.audio.create(orgId, {
      title,
      fileName: `${title.replace(/\s+/g, '_')}.mp3`,
      durationSeconds: durationMin * 60
    });

    // Automatically transcribe in demo
    await repositories.audio.transcribe(orgId, newAudio.id);
    await consume('audioMinutesPerMonth', durationMin);

    success('Audio importé et transcrit', `${title} (${durationMin} min).`);
    setIsUploadOpen(false);
    setTitle('');
    loadAudios();
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer l'enregistrement "${name}" ?`)) {
      await repositories.audio.delete(orgId, id);
      success('Audio supprimé', name);
      loadAudios();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3986A8] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3986A8]" />
            <span>Domaine Audio & Voix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Audio, Transcription & Diarisation
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Convertissez vos réunions en comptes rendus, plans d’action et présentations exécutives.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#3986A8] to-[#2E7391] hover:opacity-95 rounded-xl shadow-sm shadow-[#3986A8]/25 transition-all flex items-center gap-2 shrink-0 active:scale-98"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Importer un enregistrement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {audios.map((audio) => (
          <div
            key={audio.id}
            onClick={() => navigate(`/workspace/audio/${audio.id}`)}
            className="p-6 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#3986A8]/40 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F1F6] dark:bg-[#3986A8]/15 text-[#3986A8] flex items-center justify-center shrink-0 border border-[#3986A8]/20">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#3986A8] transition-colors">
                      {audio.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#3986A8]" />
                        {formatDuration(audio.durationSeconds)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {audio.speakers.length} intervenants
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(audio.id, audio.title, e)}
                  className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {audio.summary && (
                <p className="mt-4 text-xs text-[#64748B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                  {audio.summary}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-[#E8EDF4] dark:border-[#303038] flex items-center gap-2 flex-wrap">
                {audio.speakers.map((spk) => (
                  <span
                    key={spk.id}
                    className="text-[10px] bg-[#E6F1F6] dark:bg-[#3986A8]/15 text-[#3986A8] font-semibold px-2 py-0.5 rounded-full border border-[#3986A8]/20"
                  >
                    {spk.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-[#64748B] dark:text-[#A1A1AA]">
              <span className="text-[#20A477] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Livrables prêts
              </span>

              <span className="font-semibold text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#3986A8] flex items-center gap-1 transition-colors">
                <span>Ouvrir l'analyse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Importer un fichier audio de réunion"
        description="Notre pipeline Whisper transcrira et identifiera les locuteurs automatiquement."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Titre de la réunion / enregistrement
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Point Hebdomadaire Produit & Marketing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#3986A8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Durée estimée (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={180}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#3986A8]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#3986A8] to-[#2E7391] hover:opacity-95 rounded-xl shadow-sm transition-all"
            >
              Démarrer la transcription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
