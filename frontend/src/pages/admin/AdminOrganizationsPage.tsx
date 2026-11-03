import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { mockStorage } from '../../mocks/storage';
import { useToast } from '../../context/ToastContext';
import { Organization, PlanLimits, QuotaOverride } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Building, Shield, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminOrganizationsPage: React.FC = () => {
  const { success } = useToast();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideResource, setOverrideResource] = useState<keyof PlanLimits>('audioMinutesPerMonth');
  const [overrideValue, setOverrideValue] = useState(500);
  const [overrideReason, setOverrideReason] = useState('Extension commerciale séminaire client');

  const loadOrgs = async () => {
    const list = await repositories.admin.getAllOrganizations();
    setOrgs(list);
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleToggleStatus = async (org: Organization) => {
    const newStatus = org.status === 'active' ? 'suspended' : 'active';
    await repositories.admin.setOrgStatus(org.id, newStatus);
    success('Statut mis à jour', `${org.name} est désormais ${newStatus}.`);
    loadOrgs();
  };

  const handleGrantOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;

    await repositories.admin.grantQuotaOverride({
      organizationId: selectedOrg.id,
      resourceKey: overrideResource,
      overrideValue,
      reason: overrideReason,
      grantedBy: 'Super Admin Alexandre Dubois'
    });

    success('Dérogation accordée', `${selectedOrg.name} : ${overrideResource} fixé à ${overrideValue}.`);
    setIsOverrideModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Gestion des Organisations (Multi-Tenant)</h1>
        <p className="mt-1 text-xs text-slate-400">
          Supervisez l'isolation des tenants, modifiez les statuts et accordez des dérogations de quotas.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <th className="py-3 px-4 font-semibold">Organisation</th>
              <th className="py-3 px-4 font-semibold">Slug Unique</th>
              <th className="py-3 px-4 font-semibold">Pays / Devise</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold">Création</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{org.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{org.slug}</td>
                <td className="py-3 px-4 text-slate-300">
                  {org.country} ({org.currency})
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      org.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {org.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                  {org.createdAt.split('T')[0]}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setIsOverrideModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition-colors"
                    >
                      Ajuster Quota
                    </button>

                    <button
                      onClick={() => handleToggleStatus(org)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                        org.status === 'active'
                          ? 'border-rose-800 bg-rose-950/60 text-rose-300 hover:bg-rose-900'
                          : 'border-emerald-800 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
                      }`}
                    >
                      {org.status === 'active' ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quota Override Modal */}
      <Modal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        title={`Dérogation de Quota pour ${selectedOrg?.name}`}
        description="Cette limite personnalisée prévaut sur le plafond de l'abonnement en cours."
      >
        <form onSubmit={handleGrantOverride} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Ressource concernée
            </label>
            <select
              value={overrideResource}
              onChange={(e) => setOverrideResource(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="audioMinutesPerMonth">Transcription Audio (Minutes)</option>
              <option value="ocrPagesPerMonth">Pages OCR & Tabulaires</option>
              <option value="documentsPerMonth">Nombre de Documents Ingestés</option>
              <option value="videoGenerationsMinutesPerMonth">Génération Vidéo Publicitaire (Minutes)</option>
              <option value="workflowExecutionsPerMonth">Exécutions de Workflows</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nouveau plafond personnalisé
            </label>
            <input
              type="number"
              required
              value={overrideValue}
              onChange={(e) => setOverrideValue(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Motif de la dérogation
            </label>
            <input
              type="text"
              required
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsOverrideModalOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
            >
              Valider la dérogation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
