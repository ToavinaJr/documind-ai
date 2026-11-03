import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { mockStorage } from '../../mocks/storage';
import { DocumentEntity, AudioEntity, GeneratedDocument, ProcessingJob } from '../../types';
import {
  FileText,
  Mic,
  Video,
  Presentation,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  GitBranch,
  Layers,
  UploadCloud,
  FileCheck2,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { plan, quotaStatuses } = useQuota();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';

  const [documents, setDocuments] = useState<DocumentEntity[]>([]);
  const [audios, setAudios] = useState<AudioEntity[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);

  useEffect(() => {
    const load = () => {
      setDocuments(mockStorage.getDocuments().filter((d) => d.organizationId === orgId));
      setAudios(mockStorage.getAudios().filter((a) => a.organizationId === orgId));
      setGeneratedDocs(mockStorage.getGeneratedDocs().filter((g) => g.organizationId === orgId));
      setJobs(mockStorage.getJobs().filter((j) => j.organizationId === orgId));
    };
    load();
    const unsub = mockStorage.subscribe(load);
    return unsub;
  }, [orgId]);

  // Dynamic estimated time saved calculation
  const estimatedHoursSaved = Math.round(
    (documents.length * 0.75 + audios.length * 1.5 + generatedDocs.length * 1.2) * 10
  ) / 10;

  return (
    <div className="space-y-6">
      {/* Welcome banner with subtle brand styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA] mb-1">
            <span className="text-[#0F172A] dark:text-[#F2F2F5] font-medium">{currentOrganization?.name || 'Organisation'}</span>
            <span>·</span>
            <span className="font-mono px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470]">
              Plan {plan.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Tableau de Bord Opérationnel
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Surveillez vos flux d'ingestion, livrables multimodaux et consommation de quotas en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/workspace/documents')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm shadow-[#DE1F4F]/25 transition-all flex items-center gap-2 active:scale-98"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importer une source</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row with Domain Colors (§3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Documents (Violet) */}
        <div className="p-4 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA]">Documents Actifs</span>
            <div className="w-7 h-7 rounded-lg bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F2F2F5] tabular-nums font-mono">
            {documents.length}
          </div>
          <div className="mt-1 text-[11px] text-[#64748B] dark:text-[#A1A1AA] flex items-center gap-1">
            <span className="text-[#20A477] font-semibold">100%</span>
            <span>indexés avec traçabilité</span>
          </div>
        </div>

        {/* Metric 2: Audio (Cyan) */}
        <div className="p-4 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#3986A8]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA]">Audios & Réunions</span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F1F6] dark:bg-[#3986A8]/15 text-[#3986A8] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F2F2F5] tabular-nums font-mono">
            {audios.length}
          </div>
          <div className="mt-1 text-[11px] text-[#64748B] dark:text-[#A1A1AA]">Diarisation & PV synchronisés</div>
        </div>

        {/* Metric 3: Livrables Générés (Pink) */}
        <div className="p-4 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#E65B7D]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA]">Livrables Générés</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDEBF0] dark:bg-[#E65B7D]/15 text-[#E65B7D] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F2F2F5] tabular-nums font-mono">
            {generatedDocs.length}
          </div>
          <div className="mt-1 text-[11px] text-[#64748B] dark:text-[#A1A1AA]">Rapports, synthèses, slides</div>
        </div>

        {/* Metric 4: Saved Time (Success Green) */}
        <div className="p-4 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#20A477]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA]">Temps Économisé</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F8F2] dark:bg-[#20A477]/15 text-[#20A477] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#20A477] tabular-nums font-mono">
            {estimatedHoursSaved} h
          </div>
          <div className="mt-1 text-[11px] text-[#64748B] dark:text-[#A1A1AA]">Gain de productivité équipe</div>
        </div>
      </div>

      {/* Quota Progress Strip with Exact Functional Colors */}
      <div className="bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F2F2F5]">Consommation des Quotas du Plan</h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">Plafonds mensuels alloués à votre organisation</p>
          </div>
          <button
            onClick={() => navigate('/workspace/usage')}
            className="text-xs font-semibold text-[#DE1F4F] dark:text-[#F04470] hover:underline flex items-center gap-1"
          >
            <span>Détails & Limites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Storage (Indigo #3986A8) */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Stockage Cloud</span>
              <span className="font-mono tabular-nums text-[#0F172A] dark:text-[#F2F2F5] font-medium">
                {quotaStatuses.storageGb?.used} / {quotaStatuses.storageGb?.limit} Go
              </span>
            </div>
            <div className="w-full bg-[#EEF2F7] dark:bg-[#26262D] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${quotaStatuses.storageGb?.percentage || 0}%`,
                  backgroundColor: '#3986A8'
                }}
              />
            </div>
          </div>

          {/* OCR Pages (Violet #DE1F4F) */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Pages OCR & Tables</span>
              <span className="font-mono tabular-nums text-[#0F172A] dark:text-[#F2F2F5] font-medium">
                {quotaStatuses.ocrPagesPerMonth?.used} / {quotaStatuses.ocrPagesPerMonth?.limit} pages
              </span>
            </div>
            <div className="w-full bg-[#EEF2F7] dark:bg-[#26262D] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${quotaStatuses.ocrPagesPerMonth?.percentage || 0}%`,
                  backgroundColor: '#DE1F4F'
                }}
              />
            </div>
          </div>

          {/* Audio Transcription (Cyan #3986A8) */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">Transcription Audio</span>
              <span className="font-mono tabular-nums text-[#0F172A] dark:text-[#F2F2F5] font-medium">
                {quotaStatuses.audioMinutesPerMonth?.used} / {quotaStatuses.audioMinutesPerMonth?.limit} min
              </span>
            </div>
            <div className="w-full bg-[#EEF2F7] dark:bg-[#26262D] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${quotaStatuses.audioMinutesPerMonth?.percentage || 0}%`,
                  backgroundColor: '#3986A8'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Matrix (§3 Functional Domains) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/workspace/documents')}
          className="p-4 bg-white dark:bg-[#1A1A1F] hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F]/40 text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#DE1F4F] transition-colors">
            Explorer les Documents
          </div>
          <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1">Factures, contrats, rapports et OCR tabulaire</div>
        </button>

        <button
          onClick={() => navigate('/workspace/audio')}
          className="p-4 bg-white dark:bg-[#1A1A1F] hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#3986A8]/40 text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E6F1F6] dark:bg-[#3986A8]/15 text-[#3986A8] flex items-center justify-center mb-3">
            <Mic className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#3986A8] transition-colors">
            Studio Audio & Diarisation
          </div>
          <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1">Transcription, décisions, PV et plans d'action</div>
        </button>

        <button
          onClick={() => navigate('/workspace/video-studio')}
          className="p-4 bg-white dark:bg-[#1A1A1F] hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#E65B7D]/40 text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FDEBF0] dark:bg-[#E65B7D]/15 text-[#E65B7D] flex items-center justify-center mb-3">
            <Video className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#E65B7D] transition-colors">
            Générateur Vidéo Pub
          </div>
          <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1">Scripts, storyboards et rendus publicitaires</div>
        </button>

        <button
          onClick={() => navigate('/workspace/workflows')}
          className="p-4 bg-white dark:bg-[#1A1A1F] hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F]/40 text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center mb-3">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#DE1F4F] transition-colors">
            Workflows Automatisés
          </div>
          <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-1">Pipelines de traitement avec validation humaine</div>
        </button>
      </div>

      {/* Recent Documents & Live Jobs Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F2F2F5]">Derniers Documents Structurés</h2>
            <button
              onClick={() => navigate('/workspace/documents')}
              className="text-xs text-[#DE1F4F] dark:text-[#F04470] hover:underline"
            >
              Voir tout ({documents.length})
            </button>
          </div>

          <div className="divide-y divide-[#E8EDF4] dark:divide-[#303038]">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/workspace/documents/${doc.id}`)}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] px-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#DE1F4F]/20">
                    {doc.format}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-[#0F172A] dark:text-[#F2F2F5] truncate">{doc.title}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] flex items-center gap-2 mt-0.5">
                      <span>{Math.round(doc.fileSize / 1024)} Ko</span>
                      <span>·</span>
                      <span>{doc.pageCount} pages</span>
                      {doc.anomalies && doc.anomalies.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-[#D99A35] flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            1 anomalie
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
                    {doc.ocrConfidence ? `${Math.round(doc.ocrConfidence * 100)}% conf.` : 'En cours'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      doc.status === 'processed'
                        ? 'bg-[#E8F8F2] text-[#20A477] dark:bg-[#20A477]/15 dark:text-[#2CD49B]'
                        : 'bg-[#FEF5E7] text-[#D99A35] dark:bg-[#D99A35]/15 dark:text-[#F5B352]'
                    }`}
                  >
                    {doc.status === 'processed' ? 'Validé' : 'Traitement'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Jobs Queue (1 col) */}
        <div className="bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F2F2F5]">Tâches & Pipeline</h2>
              <button
                onClick={() => navigate('/workspace/history')}
                className="text-xs text-[#DE1F4F] dark:text-[#F04470] hover:underline"
              >
                Historique
              </button>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-[#F8FAFD] dark:bg-[#0F0F13] rounded-xl border border-[#DCE3EC] dark:border-[#303038] text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#0F172A] dark:text-[#F2F2F5] truncate max-w-[180px]">
                      {job.itemTitle}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#64748B] dark:text-[#A1A1AA]">{job.jobType}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-2">
                    <span className="flex items-center gap-1 text-[#20A477]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terminé avec succès
                    </span>
                    <span className="font-mono tabular-nums text-[#0F172A] dark:text-[#F2F2F5]">100%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8EDF4] dark:border-[#303038] text-[11px] text-[#64748B] dark:text-[#A1A1AA] text-center">
            Moteur de queues asynchrone prêt pour NestJS Worker & Redis BullMQ.
          </div>
        </div>
      </div>
    </div>
  );
};
