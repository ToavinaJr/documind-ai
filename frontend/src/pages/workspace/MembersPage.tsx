import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { User, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle2 } from 'lucide-react';

export const MembersPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [members, setMembers] = useState<User[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('EDITOR');

  const loadMembers = async () => {
    const list = await repositories.organization.getMembers(orgId);
    setMembers(list);
  };

  useEffect(() => {
    loadMembers();
  }, [orgId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('members.invite')) {
      toastError('Action restreinte', "Vous n'avez pas la permission 'members.invite'.");
      return;
    }

    await repositories.organization.inviteMember(orgId, inviteEmail, inviteRole);
    success('Invitation envoyée', `Un accès ${inviteRole} a été accordé à ${inviteEmail}.`);
    setIsInviteOpen(false);
    setInviteEmail('');
    loadMembers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!hasPermission('roles.update')) {
      toastError('Action restreinte', "Vous n'avez pas la permission 'roles.update'.");
      return;
    }
    await repositories.organization.updateMemberRole(orgId, userId, newRole);
    success('Rôle mis à jour', `Nouveau rôle : ${newRole}`);
    loadMembers();
  };

  const handleRemove = async (userId: string, name: string) => {
    if (!hasPermission('members.remove')) {
      toastError('Action restreinte', "Vous n'avez pas la permission 'members.remove'.");
      return;
    }
    if (window.confirm(`Retirer ${name} de l'organisation ?`)) {
      await repositories.organization.removeMember(orgId, userId);
      success('Membre retiré', name);
      loadMembers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Membres de l'Organisation & Équipe
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Gérez les accès, rôles et attributions des collaborateurs de {currentOrganization?.name}.
          </p>
        </div>

        {hasPermission('members.invite') && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Inviter un collaborateur</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-400">
              <th className="py-3 px-4 font-semibold">Membre</th>
              <th className="py-3 px-4 font-semibold">Adresse Email</th>
              <th className="py-3 px-4 font-semibold">Rôle attribué</th>
              <th className="py-3 px-4 font-semibold">Rejoint le</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {members.map((u) => {
              const membership = u.organizationMemberships.find((m) => m.organizationId === orgId);
              const role = membership?.role || 'VIEWER';

              return (
                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.firstName.charAt(0)}
                      </div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-500">{u.email}</td>

                  <td className="py-3 px-4">
                    <select
                      value={role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={role === 'ORG_OWNER' || !hasPermission('roles.update')}
                      className="px-2 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white font-mono cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <option value="ORG_OWNER">ORG_OWNER</option>
                      <option value="ORG_ADMIN">ORG_ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                      <option value="BILLING_MANAGER">BILLING_MANAGER</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-400 text-[11px]">
                    {membership?.joinedAt ? membership.joinedAt.split('T')[0] : '2026-01-15'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {role !== 'ORG_OWNER' && hasPermission('members.remove') && (
                      <button
                        onClick={() => handleRemove(u.id, `${u.firstName} ${u.lastName}`)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Inviter un nouveau collaborateur"
        description="Une invitation sécurisée lui sera envoyée pour rejoindre votre workspace."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Adresse email professionnelle
            </label>
            <input
              type="email"
              required
              placeholder="collaborateur@mon-entreprise.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Rôle attribué
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="MANAGER">MANAGER (Gestion & Validation)</option>
              <option value="EDITOR">EDITOR (Création & Traitements)</option>
              <option value="VIEWER">VIEWER (Lecture seule)</option>
              <option value="BILLING_MANAGER">BILLING_MANAGER (Facturation)</option>
              <option value="ORG_ADMIN">ORG_ADMIN (Administration déléguée)</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg"
            >
              Envoyer l'invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
