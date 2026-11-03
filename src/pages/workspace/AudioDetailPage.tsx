import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { AudioEntity } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Mic,
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Presentation,
  Download,
  CheckSquare
} from 'lucide-react';

export const AudioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [audio, setAudio] = useState<AudioEntity | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);

  // Deliverables checklist selection
  const [selectedDeliverables, setSelectedDeliverables] = useState({
    compteRendu: true,
    procesVerbal: false,
    planAction: true,
    presentationPptx: true,
    emailSuivi: true,
    cahierCharges: false,
    tableauRisques: true
  });

  const loadAudio = async () => {
    if (!id) return;
    const found = await repositories.audio.findById(orgId, id);
    setAudio(found);
  };

  useEffect(() => {
    loadAudio();
  }, [id, orgId]);

  // Audio play simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlayTime((prev) => {
          if (!audio) return prev;
          if (prev >= audio.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audio]);

  if (!audio) {
    return <div className="py-12 text-center text-xs text-neutral-400">Chargement de l’audio...</div>;
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleGenerateDeliverables = async () => {
    const check = checkCanPerform('docGenerationsPerMonth', 2);
    if (!check.allowed) {
      toastError('Quota insuffisant', check.reason);
      return;
    }

    // 1. Generate Executive Minutes document
    if (selectedDeliverables.compteRendu) {
      await repositories.generation.createDocument(orgId, {
        title: `Compte Rendu — ${audio.title}`,
        type: 'meeting_minutes',
        sourceType: 'audio',
        sourceId: audio.id,
        sourceTitle: audio.title,
        content: `# COMPTE RENDU OFFICIEL DE RÉUNION\n**Titre** : ${audio.title}\n**Intervenants** : ${audio.speakers.map((s) => s.name).join(', ')}\n\n## 1. Synthèse des Échanges\n${audio.summary}\n\n## 2. Décisions Fermes\n${audio.decisions?.map((d) => `- ${d}`).join('\n') || 'Aucune décision'}\n\n## 3. Plan d'Action\n${audio.actionItems?.map((a) => `- **${a.task}** (Attribué à ${a.assignee}, échéance : ${a.deadline})`).join('\n')}`
      });
    }

    // 2. Generate Presentation Slide Deck
    if (selectedDeliverables.presentationPptx) {
      await repositories.generation.createPresentation(orgId, {
        title: `Présentation — ${audio.title}`,
        theme: 'executive',
        sourceTitle: audio.title,
        slides: [
          {
            id: 'sl-a1',
            slideNumber: 1,
            title: audio.title,
            kicker: 'Restitution Décisionnelle',
            bullets: [
              'Synthèse validée par le comité',
              `Présents : ${audio.speakers.map((s) => s.name).join(', ')}`,
              'Traçabilité audio garantie'
            ]
          },
          {
            id: 'sl-a2',
            slideNumber: 2,
            title: 'Décisions Stratégiques',
            kicker: 'Arbitrages Validés',
            bullets: audio.decisions?.slice(0, 3) || ['Validation générale des orientations']
          },
          {
            id: 'sl-a3',
            slideNumber: 3,
            title: 'Plan d’Action & Calendrier',
            kicker: 'Exécution',
            bullets: audio.actionItems?.map((a) => `${a.task} — ${a.assignee} (${a.deadline})`) || []
          }
        ]
      });
    }

    await consume('docGenerationsPerMonth', 2);
    setIsDeliverableModalOpen(false);
    success('Livrables générés', `Les documents et présentations sont disponibles dans vos studios.`);
    navigate('/workspace/document-studio');
  };

  return (
    <div className="space-y-6">
      {/* Top back & actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/workspace/audio')}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux audios</span>
        </button>

        <button
          onClick={() => setIsDeliverableModalOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Générer les Livrables (10 options)</span>
        </button>
      </div>

      {/* Audio Player Card with Scrubber */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Enregistrement Haute Fidélité</div>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-0.5">{audio.title}</h1>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span>Durée : {formatSeconds(audio.durationSeconds)}</span>
              <span>·</span>
              <span>{audio.speakers.length} intervenants identifiés</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:scale-105 transition-all shadow-md shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
              {formatSeconds(currentPlayTime)} / {formatSeconds(audio.durationSeconds)}
            </div>
          </div>
        </div>

        {/* Simulated Waveform Scrubber */}
        <div className="mt-6">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              setCurrentPlayTime(Math.floor(ratio * audio.durationSeconds));
            }}
            className="w-full h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center px-2 cursor-pointer relative overflow-hidden"
          >
            {/* Waveform bars simulation */}
            <div className="flex items-center gap-1 w-full h-full justify-between opacity-50">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    (i / 48) * audio.durationSeconds <= currentPlayTime
                      ? 'bg-neutral-900 dark:bg-white h-5'
                      : 'bg-neutral-300 dark:bg-neutral-700 h-2.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Split: Transcript with Diarization on Left, Decisions & Action Plan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Diarized Transcript (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Transcription Synchronisée & Diarisation
            </h2>
            <div className="flex items-center gap-2">
              {audio.speakers.map((s) => (
                <span
                  key={s.id}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {audio.transcriptSegments.map((seg) => (
              <div
                key={seg.id}
                onClick={() => setCurrentPlayTime(seg.startTime)}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {audio.speakers.find((s) => s.id === seg.speakerId)?.name || 'Intervenant'}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                    {formatSeconds(seg.startTime)} - {formatSeconds(seg.endTime)}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{seg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions & Action Plan (1 col) */}
        <div className="space-y-6">
          {/* Decisions */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
              Décisions Fermes Détectées
            </h3>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {audio.decisions?.map((dec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
              Plan d'Action & Assignations
            </h3>
            <div className="space-y-2.5 text-xs">
              {audio.actionItems?.map((act, i) => (
                <div key={i} className="p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <div className="font-semibold text-neutral-900 dark:text-white leading-tight">{act.task}</div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>{act.assignee}</span>
                    <span>Échéance : {act.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          {audio.risks && audio.risks.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risques Identifiés
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                {audio.risks.map((r, i) => (
                  <li key={i} className="leading-relaxed">· {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Deliverable Generation Modal */}
      <Modal
        isOpen={isDeliverableModalOpen}
        onClose={() => setIsDeliverableModalOpen(false)}
        title="Générateur de Livrables Multiples (1 Source -> N Livrables)"
        description="Cochez les livrables à produire en synchronisation totale avec cet enregistrement audio."
      >
        <div className="space-y-4">
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDeliverables.compteRendu}
                onChange={(e) => setSelectedDeliverables({ ...selectedDeliverables, compteRendu: e.target.checked })}
                className="rounded"
              />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Compte rendu officiel & PV</div>
                <div className="text-[11px] text-neutral-500">Document structuré Markdown & DOCX avec décisions</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDeliverables.presentationPptx}
                onChange={(e) => setSelectedDeliverables({ ...selectedDeliverables, presentationPptx: e.target.checked })}
                className="rounded"
              />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Présentation PowerPoint (Diaporama)</div>
                <div className="text-[11px] text-neutral-500">Diapositives exécutives prêtes pour le conseil d'administration</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDeliverables.planAction}
                onChange={(e) => setSelectedDeliverables({ ...selectedDeliverables, planAction: e.target.checked })}
                className="rounded"
              />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Tableau du Plan d’Action</div>
                <div className="text-[11px] text-neutral-500">Extraction des tâches, responsables et jalons calendaires</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDeliverables.emailSuivi}
                onChange={(e) => setSelectedDeliverables({ ...selectedDeliverables, emailSuivi: e.target.checked })}
                className="rounded"
              />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Email de suivi & synthèse collaborateurs</div>
                <div className="text-[11px] text-neutral-500">Message concis et percutant prêt à être diffusé par email</div>
              </div>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setIsDeliverableModalOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleGenerateDeliverables}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg"
            >
              Générer les livrables sélectionnés
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
