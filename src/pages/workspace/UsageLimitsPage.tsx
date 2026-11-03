import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuota } from '../../context/QuotaContext';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const UsageLimitsPage: React.FC = () => {
  const { plan, quotaStatuses, overrides } = useQuota();
  const { currentOrganization } = useAuth();
  const navigate = useNavigate();

  const statusesList = Object.values(quotaStatuses);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Consommation & Limites de Quotas
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Organisation : {currentOrganization?.name} · Forfait actif : <span className="capitalize font-semibold text-neutral-900 dark:text-white">Plan {plan.name}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/workspace/billing')}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Mettre à niveau le plan</span>
        </button>
      </div>

      {/* Quota Overrides Banner if present */}
      {overrides.length > 0 && (
        <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-xs flex items-start gap-3 text-sky-800 dark:text-sky-300">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Dérogations de quotas accordées par l'administration plateforme :</div>
            <ul className="mt-1 space-y-0.5 text-[11px]">
              {overrides.map((ov) => (
                <li key={ov.id}>
                  · <strong>{ov.resourceKey}</strong> porté à {ov.overrideValue} ({ov.reason})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Resource Quota Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusesList.map((st) => (
          <div
            key={st.key}
            className={`p-5 bg-white dark:bg-neutral-900 rounded-2xl border transition-all ${
              st.isOverLimit
                ? 'border-rose-300 dark:border-rose-900/60 shadow-sm'
                : st.isWarning
                ? 'border-amber-300 dark:border-amber-900/60 shadow-sm'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-neutral-900 dark:text-white">{st.label}</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  st.isOverLimit
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : st.isWarning
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {st.percentage}%
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-3 mb-2 text-xs">
              <span className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white font-mono tabular-nums">
                {st.used} <span className="text-xs font-normal text-neutral-500">{st.unit}</span>
              </span>
              <span className="text-neutral-400 font-mono text-[11px] tabular-nums">
                Plafond : {st.limit} {st.unit}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#EEF2F7] dark:bg-[#26262D] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  st.isOverLimit
                    ? 'bg-[#DC3545]'
                    : st.isWarning
                    ? 'bg-[#D99A35]'
                    : 'bg-[#DE1F4F]'
                }`}
                style={{ width: `${Math.min(100, st.percentage)}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Réinitialisation le 1er du mois</span>
              {st.isOverLimit && (
                <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Limite atteinte
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
