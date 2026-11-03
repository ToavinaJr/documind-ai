import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { mockStorage } from '../../mocks/storage';
import { FeatureFlag } from '../../types';
import { SlidersHorizontal, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const AdminFeaturesPage: React.FC = () => {
  const { success } = useToast();

  const [features, setFeatures] = useState<FeatureFlag[]>(() => mockStorage.getFeatureFlags());

  useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setFeatures(mockStorage.getFeatureFlags());
    });
    return unsub;
  }, []);

  const handleToggleStatus = (id: string, newStatus: FeatureFlag['status']) => {
    const updated = features.map((f) => (f.id === id ? { ...f, status: newStatus } : f));
    setFeatures(updated);
    mockStorage.saveFeatureFlags(updated);
    success('Fonctionnalité mise à jour', `${id} est maintenant ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Feature Management & Flags Commerciaux</h1>
        <p className="mt-1 text-xs text-slate-400">
          Activez, désactivez ou restreignez l'accès aux fonctionnalités selon les plans commerciaux.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <th className="py-3 px-4 font-semibold">Fonctionnalité</th>
              <th className="py-3 px-4 font-semibold">Identifiant Système</th>
              <th className="py-3 px-4 font-semibold">Palier Requis</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {features.map((feat) => (
              <tr key={feat.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{feat.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{feat.description}</div>
                </td>

                <td className="py-3 px-4 font-mono text-slate-400">{feat.id}</td>

                <td className="py-3 px-4">
                  <span className="font-mono text-[10px] uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Plan {feat.requiredPlan}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      feat.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : feat.status === 'beta'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {feat.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <select
                    value={feat.status}
                    onChange={(e) => handleToggleStatus(feat.id, e.target.value as any)}
                    className="px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200 cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="beta">Bêta</option>
                    <option value="disabled">Désactivée</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
