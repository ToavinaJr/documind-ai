import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { mockStorage } from '../../mocks/storage';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { Users2, Search, Shield, Ban, CheckCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { success } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    const list = await repositories.admin.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    const isSuspended = (user as any).suspended;
    await repositories.admin.setUserStatus(user.id, !!isSuspended);
    success('Statut utilisateur mis à jour', `${user.firstName} ${user.lastName} est ${isSuspended ? 'réactivé' : 'suspendu'}.`);
    loadUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
        <p className="mt-1 text-xs text-slate-400">
          Supervisez tous les comptes utilisateurs, leurs rôles et activez/suspendez les accès.
        </p>
      </div>

      <div className="flex bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <th className="py-3 px-4 font-semibold">Utilisateur</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Statut Plateforme</th>
              <th className="py-3 px-4 font-semibold">Organisations rattachées</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((u) => {
              const isSuspended = (u as any).suspended;

              return (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.firstName.charAt(0)}
                      </div>
                      <div className="font-semibold text-white">
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">{u.email}</td>

                  <td className="py-3 px-4">
                    {u.isPlatformAdmin ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {u.platformRole || 'PLATFORM_ADMIN'}
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isSuspended
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isSuspended ? 'Suspendu' : 'Actif'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {u.organizationMemberships.length > 0
                      ? u.organizationMemberships.map((m) => `${m.organizationId} (${m.role})`).join(', ')
                      : 'Console globale (Admin)'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {!u.isPlatformAdmin && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                          isSuspended
                            ? 'border-emerald-800 bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                            : 'border-rose-800 bg-rose-950 text-rose-300 hover:bg-rose-900'
                        }`}
                      >
                        {isSuspended ? 'Réactiver' : 'Suspendre'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
