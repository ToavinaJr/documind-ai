import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockStorage } from '../../mocks/storage';
import { ProcessingJob } from '../../types';
import { History, Search, Filter, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { success } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadJobs = () => {
    let list = mockStorage.getJobs().filter((j) => j.organizationId === orgId);
    if (statusFilter !== 'all') {
      list = list.filter((j) => j.status === statusFilter);
    }
    if (search) {
      list = list.filter((j) => j.itemTitle.toLowerCase().includes(search.toLowerCase()) || j.jobType.includes(search));
    }
    setJobs(list);
  };

  useEffect(() => {
    loadJobs();
    const unsub = mockStorage.subscribe(loadJobs);
    return unsub;
  }, [orgId, statusFilter, search]);

  const handleRetry = (job: ProcessingJob) => {
    const allJobs = mockStorage.getJobs();
    const idx = allJobs.findIndex((j) => j.id === job.id);
    if (idx !== -1) {
      allJobs[idx] = {
        ...allJobs[idx],
        status: 'processing',
        progress: 25,
        startedAt: new Date().toISOString()
      };
      mockStorage.saveJobs([...allJobs]);
      success('Traitement relancé', `La tâche ${job.itemTitle} est en cours d'exécution dans la file.`);

      setTimeout(() => {
        const freshJobs = mockStorage.getJobs();
        const freshIdx = freshJobs.findIndex((j) => j.id === job.id);
        if (freshIdx !== -1) {
          freshJobs[freshIdx] = {
            ...freshJobs[freshIdx],
            status: 'completed',
            progress: 100,
            completedAt: new Date().toISOString()
          };
          mockStorage.saveJobs([...freshJobs]);
          success('Traitement terminé', `La tâche ${job.itemTitle} a été traitée avec succès.`);
        }
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Historique Centralisé des Traitements
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Suivi de tous les jobs asynchrones : OCR, transcription, synthèses, vidéos et workflows.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre de job ou type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
        >
          <option value="all">Tous statuts</option>
          <option value="completed">Terminé</option>
          <option value="processing">En cours</option>
          <option value="failed">Échec</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-400">
              <th className="py-3 px-4 font-semibold">Tâche / Ressource</th>
              <th className="py-3 px-4 font-semibold">Type de traitement</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold">Démarré le</th>
              <th className="py-3 px-4 font-semibold">Complété le</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">
                  Aucun traitement dans l'historique.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">
                    {job.itemTitle}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] uppercase text-neutral-500">
                    {job.jobType}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        job.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : job.status === 'processing'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {job.status === 'completed' ? 'Complété' : job.status === 'processing' ? 'En cours' : 'Échoué'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400 text-[11px]">
                    {job.startedAt.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400 text-[11px]">
                    {job.completedAt ? job.completedAt.replace('T', ' ').slice(0, 19) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRetry(job)}
                      title="Relancer"
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
