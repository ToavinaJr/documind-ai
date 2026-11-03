import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { mockStorage } from '../../mocks/storage';
import { useToast } from '../../context/ToastContext';
import { SubscriptionPlan } from '../../types';
import { Package, Edit2, Check, Save } from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const { success } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [annualPrice, setAnnualPrice] = useState(0);

  const loadPlans = async () => {
    const list = await repositories.billing.getPlans();
    setPlans(list);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleStartEdit = (p: SubscriptionPlan) => {
    setEditingPlanId(p.id);
    setMonthlyPrice(p.priceMonthly);
    setAnnualPrice(p.priceAnnual);
  };

  const handleSavePrice = async (p: SubscriptionPlan) => {
    const updated = plans.map((plan) =>
      plan.id === p.id ? { ...plan, priceMonthly: monthlyPrice, priceAnnual: annualPrice } : plan
    );
    await repositories.admin.updatePlans(updated);
    setPlans(updated);
    setEditingPlanId(null);
    success('Tarif plan mis à jour', `${p.name} : ${monthlyPrice} €/m, ${annualPrice} €/an.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Gestion des Plans Commerciaux & Quotas</h1>
        <p className="mt-1 text-xs text-slate-400">
          Ajustez les conditions tarifaires, les plafonds de quotas et la composition des offres SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isEditing = editingPlanId === p.id;

          return (
            <div
              key={p.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-white">{p.name}</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                    {p.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.tagline}</p>

                {/* Pricing Edit */}
                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  {isEditing ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-slate-400 block text-[10px]">Prix Mensuel (€ HT)</label>
                        <input
                          type="number"
                          value={monthlyPrice}
                          onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block text-[10px]">Prix Annuel (€ HT)</label>
                        <input
                          type="number"
                          value={annualPrice}
                          onChange={(e) => setAnnualPrice(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(p)}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-lg font-extrabold text-white">{p.priceMonthly} €</span>
                        <span className="text-slate-500"> / mois</span>
                        {p.priceAnnual > 0 && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.priceAnnual} € facturé / an
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        title="Modifier le prix"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Limits summary */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400 font-mono tabular-nums">
                  <div className="flex justify-between">
                    <span>Stockage :</span>
                    <span className="text-slate-200">{p.limits.storageGb} Go</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents :</span>
                    <span className="text-slate-200">{p.limits.documentsPerMonth} / mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OCR :</span>
                    <span className="text-slate-200">{p.limits.ocrPagesPerMonth} pages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transcription :</span>
                    <span className="text-slate-200">{p.limits.audioMinutesPerMonth} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Membres max :</span>
                    <span className="text-slate-200">{p.limits.maxMembers}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
