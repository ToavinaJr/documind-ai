import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { Building, Globe, Key, Bell, Shield, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentOrganization, currentUser, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();

  const [orgName, setOrgName] = useState(currentOrganization?.name || 'Acme Innovation Corp');
  const [domain, setDomain] = useState(currentOrganization?.domain || 'acme-corp.com');
  const [timezone, setTimezone] = useState(currentOrganization?.timezone || 'Europe/Paris');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [apiKeyGenerated, setApiKeyGenerated] = useState(false);

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('organization.update')) {
      toastError('Action restreinte', "Vous n'avez pas la permission 'organization.update'.");
      return;
    }
    if (currentOrganization) {
      await repositories.organization.update(currentOrganization.id, {
        name: orgName,
        domain,
        timezone
      });
      success('Paramètres enregistrés', 'Informations de l’organisation mises à jour.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Paramètres de l'Organisation & Préférences
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Identité d'entreprise, sécurité, alertes de quotas et clés d'API développeur.
        </p>
      </div>

      {/* Organization details */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-neutral-400" />
          <span>Informations Générales</span>
        </h2>

        <form onSubmit={handleSaveOrg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Nom de l'organisation
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Domaine internet
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Fuseau horaire
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
          </div>

          {hasPermission('organization.update') && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-neutral-400" />
          <span>Préférences de Notifications</span>
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer">
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white">Alertes de Quotas Proactives (85%)</div>
              <div className="text-[11px] text-neutral-500">Avertissement avant d'atteindre le plafond d'ingestion</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-neutral-400" />
          <span>Accès Développeur & Clés d'API REST</span>
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Permet d'ingérer vos documents depuis votre ERP, CRM ou script externe.
        </p>

        {apiKeyGenerated ? (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>dm_live_89410f92bc7291a100528419</span>
            <span className="text-[10px] text-neutral-400">Actif (Mode Mock Sécurisé)</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setApiKeyGenerated(true);
              success('Clé API générée', 'Gardez cette clé confidentielle.');
            }}
            className="px-4 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors"
          >
            Générer une clé d'API
          </button>
        )}
      </div>
    </div>
  );
};
