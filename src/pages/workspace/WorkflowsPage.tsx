import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { WorkflowEntity } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  GitBranch,
  Play,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [workflows, setWorkflows] = useState<WorkflowEntity[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadWorkflows = async () => {
    const list = await repositories.workflow.findAll(orgId);
    setWorkflows(list);
  };

  useEffect(() => {
    loadWorkflows();
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const created = await repositories.workflow.save(orgId, {
      title,
      description,
      nodes: [
        {
          id: 'node-1',
          type: 'input_document',
          title: 'Dépôt Source',
          description: 'Fichiers entrants',
          x: 60,
          y: 120,
          config: {},
          status: 'idle'
        },
        {
          id: 'node-2',
          type: 'ocr_extractor',
          title: 'Extraction OCR',
          description: 'Reconnaissance textuelle',
          x: 320,
          y: 120,
          config: {},
          status: 'idle'
        },
        {
          id: 'node-3',
          type: 'export_output',
          title: 'Export Sortie',
          description: 'Fichier structuré',
          x: 580,
          y: 120,
          config: {},
          status: 'idle'
        }
      ],
      edges: [
        { id: 'e1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'e2', fromNodeId: 'node-2', toNodeId: 'node-3' }
      ]
    });

    success('Workflow initialisé', `Modifiez les nœuds dans l'éditeur visuel.`);
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
    navigate(`/workspace/workflows/${created.id}`);
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le workflow "${name}" ?`)) {
      await repositories.workflow.delete(orgId, id);
      success('Workflow supprimé', name);
      loadWorkflows();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Workflow Builder & Automatisation
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Orchestrez des pipelines multimodaux complexes reliant ingestion, OCR, validation humaine et export.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            onClick={() => navigate(`/workspace/workflows/${wf.id}`)}
            className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{wf.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                      <span>{wf.nodes.length} nœuds connectés</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{wf.executionCount || 0} exécutions</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(wf.id, wf.title, e)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {wf.description}
              </p>

              {/* Node sequence preview pills */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                {wf.nodes.map((n, i) => (
                  <React.Fragment key={n.id}>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {n.title}
                    </span>
                    {i < wf.nodes.length - 1 && <span>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
              <span className="font-mono text-[10px] text-neutral-400">
                Dernière exécution : {wf.lastExecutedAt ? wf.lastExecutedAt.split('T')[0] : 'Jamais'}
              </span>

              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                <span>Ouvrir l'éditeur visuel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nouveau Workflow Automatisé"
        description="Définissez le nom du pipeline à construire dans l’éditeur visuel."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nom du workflow
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Analyse Contrats & Validation Juridique"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Description de l'objectif
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Récupère les contrats déposés, extrait les clauses critiques et alerte en cas d'anomalie."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg"
            >
              Créer et ouvrir l'éditeur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
