import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { mockStorage } from '../../mocks/storage';
import { PlatformSettings } from '../../types';
import { Cog, ShieldCheck, Save, Globe, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { success } = useToast();

  const [settings, setSettings] = useState<PlatformSettings>(() => mockStorage.getPlatformSettings());

  useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setSettings(mockStorage.getPlatformSettings());
    });
    return unsub;
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockStorage.savePlatformSettings(settings);
    success('Paramètres plateforme enregistrés', 'Configuration globale persistée dans le stockage administrateur.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Paramètres Globaux de la Plateforme</h1>
        <p className="mt-1 text-xs text-slate-400">
          Configuration persistée des règles d'inscription, maintenance système et quotas d'upload.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email de support officiel
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Formule par défaut à l'inscription
              </label>
              <select
                value={settings.defaultPlan}
                onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="free">Plan Free</option>
                <option value="starter">Plan Starter</option>
                <option value="pro">Plan Pro</option>
                <option value="business">Plan Business</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Taille maximale des fichiers téléversés (Mo)
            </label>
            <input
              type="number"
              min={10}
              max={500}
              value={settings.maxUploadSizeMb}
              onChange={(e) => setSettings({ ...settings, maxUploadSizeMb: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-xs">
              <div>
                <div className="font-semibold text-white">Autoriser les nouvelles inscriptions publiques</div>
                <div className="text-[11px] text-slate-400">Si désactivé, seules les invitations d'équipes sont autorisées</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={(e) => setSettings({ ...settings, allowSignups: e.target.checked })}
                className="rounded text-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-xs">
              <div>
                <div className="font-semibold text-white">Mode Maintenance Global</div>
                <div className="text-[11px] text-slate-400">Suspend temporairement les requêtes d'ingestion et d'analyse</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="rounded text-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-xs">
              <div>
                <div className="font-semibold text-white">Exiger l'authentification MFA pour les administrateurs</div>
                <div className="text-[11px] text-slate-400">Renforce la sécurité d'accès au backoffice</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enforceMfa}
                onChange={(e) => setSettings({ ...settings, enforceMfa: e.target.checked })}
                className="rounded text-amber-500"
              />
            </label>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-98"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer la configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
