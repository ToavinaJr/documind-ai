import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { Project } from '../../types';
import { Modal } from '../../components/common/Modal';
import { FolderGit2, Plus, ArrowRight, FileText, Users, Clock, Trash2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('indigo');

  const loadProjects = async () => {
    const list = await repositories.project.findAll(orgId);
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const created = await repositories.project.create(orgId, {
        title,
        description,
        documentCount: 0,
        color
      });
      success('Dossier de projet créé', created.title);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      loadProjects();
    } catch (err: any) {
      toastError('Erreur', err.message);
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le dossier "${name}" ?`)) {
      await repositories.project.delete(orgId, id);
      success('Projet supprimé', name);
      loadProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3986A8] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3986A8]" />
            <span>Organisation : {currentOrganization?.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Projets & Espaces Thématiques
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Organisez vos sources et livrables par dossiers thématiques avec persistance multi-tenant.
          </p>
        </div>

        {hasPermission('projects.create') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm shadow-[#DE1F4F]/25 transition-all flex items-center gap-2 shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Projet</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-[#64748B] dark:text-[#A1A1AA] bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038]">
            Aucun projet créé pour le moment dans {currentOrganization?.name}. Cliquez sur "Nouveau Projet" pour commencer.
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate('/workspace/documents')}
              className="p-6 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F]/40 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  {hasPermission('projects.delete') && (
                    <button
                      onClick={(e) => handleDelete(p.id, p.title, e)}
                      className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded-lg transition-colors"
                      title="Supprimer le projet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-[#F2F2F5] group-hover:text-[#DE1F4F] transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8EDF4] dark:border-[#303038] flex items-center justify-between text-xs text-[#64748B] dark:text-[#A1A1AA]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-[#DE1F4F]" />
                    {p.documentCount} docs
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {p.lastActive}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#DE1F4F] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un nouveau projet"
        description="Associez et regroupez vos analyses documentaires et médias sous un même dossier."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Nom du projet
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Clôture Fiscale 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Description et objectif
            </label>
            <textarea
              rows={3}
              placeholder="Détaillez le périmètre des documents à analyser..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] rounded-xl shadow-sm transition-all"
            >
              Créer le dossier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
