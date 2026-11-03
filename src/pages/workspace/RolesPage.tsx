import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Permission, CustomRole } from '../../types';
import { Modal } from '../../components/common/Modal';
import { mockStorage } from '../../mocks/storage';
import { ShieldCheck, Plus, Check, Lock, Info, Trash2, Key } from 'lucide-react';

const ALL_PERMISSIONS_LIST: { category: string; perms: { id: Permission; label: string }[] }[] = [
  {
    category: 'Documents & Intelligence',
    perms: [
      { id: 'documents.read', label: 'Consulter et rechercher les documents' },
      { id: 'documents.create', label: 'Importer de nouveaux documents' },
      { id: 'documents.update', label: 'Modifier les métadonnées et tags' },
      { id: 'documents.delete', label: 'Supprimer définitivement un document' },
      { id: 'documents.download', label: 'Télécharger les fichiers sources' },
      { id: 'documents.validate', label: 'Valider et corriger les champs OCR' }
    ]
  },
  {
    category: 'Audio, Transcription & Vidéo',
    perms: [
      { id: 'audio.read', label: 'Écouter et lire les transcriptions' },
      { id: 'audio.create', label: 'Téléverser des enregistrements audio' },
      { id: 'audio.transcribe', label: 'Déclencher la diarisation et transcription' },
      { id: 'video.read', label: 'Consulter les vidéos et chapitrages' },
      { id: 'video.generate', label: 'Générer des spots vidéo publicitaires' }
    ]
  },
  {
    category: 'Générations & Présentations',
    perms: [
      { id: 'generations.create', label: 'Créer des rapports et synthèses' },
      { id: 'generations.export', label: 'Exporter au format PDF / Markdown' },
      { id: 'presentations.create', label: 'Générer des présentations PowerPoint' },
      { id: 'presentations.export', label: 'Exporter au format PPTX' }
    ]
  },
  {
    category: 'Workflows & Automatisation',
    perms: [
      { id: 'workflows.read', label: 'Consulter les workflows' },
      { id: 'workflows.create', label: 'Concevoir de nouveaux workflows' },
      { id: 'workflows.execute', label: 'Exécuter les pipelines automatisés' }
    ]
  },
  {
    category: 'Gouvernance & Facturation',
    perms: [
      { id: 'members.invite', label: 'Inviter de nouveaux collaborateurs' },
      { id: 'members.remove', label: 'Retirer un membre de l’organisation' },
      { id: 'roles.update', label: 'Attribuer ou modifier les rôles' },
      { id: 'billing.manage', label: 'Gérer les abonnements et factures' },
      { id: 'audit.read', label: 'Consulter le journal d’audit' }
    ]
  }
];

export const RolesPage: React.FC = () => {
  const { currentOrganization, customRoles, createCustomRole, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const orgCustomRoles = customRoles.filter((r) => r.organizationId === orgId);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>(['dashboard.read', 'documents.read']);

  const handleTogglePerm = (perm: Permission) => {
    if (selectedPerms.includes(perm)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== perm));
    } else {
      setSelectedPerms([...selectedPerms, perm]);
    }
  };

  const handleSaveCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;
    try {
      const created = await createCustomRole(roleName, roleDesc || 'Rôle personnalisé', selectedPerms);
      success('Rôle personnalisé créé et enregistré', `${created.name} (${selectedPerms.length} permissions).`);
      setIsCustomModalOpen(false);
      setRoleName('');
      setRoleDesc('');
      setSelectedPerms(['dashboard.read', 'documents.read']);
    } catch (err: any) {
      toastError('Erreur', err.message);
    }
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (window.confirm(`Supprimer le rôle "${name}" ?`)) {
      const updated = mockStorage.getCustomRoles().filter((r) => r.id !== id);
      mockStorage.saveCustomRoles(updated);
      success('Rôle supprimé', name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3986A8] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3986A8]" />
            <span>Sécurité & Contrôle d'Accès</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Rôles & Permissions (RBAC Granulaire)
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Contrôle d'accès strict par domaine. Les rôles personnalisés sont persistés et immédiatement actifs.
          </p>
        </div>

        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm shadow-[#DE1F4F]/25 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un rôle personnalisé</span>
        </button>
      </div>

      {/* Active Custom Roles Section (Fix RBAC-01) */}
      {orgCustomRoles.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1F] p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#DE1F4F]" />
              <span>Rôles Personnalisés Définis ({orgCustomRoles.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgCustomRoles.map((cr) => (
              <div
                key={cr.id}
                className="p-4 bg-[#F8FAFD] dark:bg-[#26262D] rounded-xl border border-[#DCE3EC] dark:border-[#303038] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5]">{cr.name}</span>
                      <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">{cr.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteRole(cr.id, cr.name)}
                      className="p-1 text-[#64748B] hover:text-[#DC3545] rounded transition-colors"
                      title="Supprimer ce rôle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cr.permissions.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E8EDF4] dark:border-[#303038] text-[10px] text-[#20A477] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Actif dans l'organisation
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Matrix */}
      <div className="space-y-6">
        {ALL_PERMISSIONS_LIST.map((group) => (
          <div
            key={group.category}
            className="bg-white dark:bg-[#1A1A1F] p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] space-y-3 shadow-sm"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">
              {group.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {group.perms.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#F8FAFD] dark:bg-[#0F0F13] rounded-xl border border-[#DCE3EC] dark:border-[#303038] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5]">{p.label}</div>
                    <div className="font-mono text-[10px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">{p.id}</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#20A477] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Role Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Créer un Rôle Personnalisé pour l'Organisation"
        description="Sélectionnez les permissions spécifiques autorisées pour ce profil."
      >
        <form onSubmit={handleSaveCustomRole} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Nom du rôle
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Auditeur Qualité Externe"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Description du périmètre
            </label>
            <input
              type="text"
              placeholder="Ex: Lecture seule factures et exports"
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Sélectionner les autorisations ({selectedPerms.length})
            </div>
            {ALL_PERMISSIONS_LIST.flatMap((g) => g.perms).map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAFD] dark:bg-[#26262D] text-xs cursor-pointer hover:bg-[#EEF2F7] dark:hover:bg-[#303038] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedPerms.includes(p.id)}
                  onChange={() => handleTogglePerm(p.id)}
                  className="rounded text-[#DE1F4F] focus:ring-[#DE1F4F]"
                />
                <span className="font-medium text-[#0F172A] dark:text-[#F2F2F5]">{p.label}</span>
              </label>
            ))}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E8EDF4] dark:border-[#303038]">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] rounded-xl shadow-sm transition-all"
            >
              Enregistrer le rôle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
