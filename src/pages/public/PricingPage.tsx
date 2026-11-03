import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PLANS } from '../../mocks/initial-data';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('annual');
  const navigate = useNavigate();

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Tarification claire, sans surprise.
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Choisissez l'offre adaptée à la taille de votre organisation. Changez ou résiliez à tout moment sans engagement.
        </p>

        {/* Billing interval switch */}
        <div className="mt-8 inline-flex items-center p-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              interval === 'monthly'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Facturation mensuelle
          </button>
          <button
            onClick={() => setInterval('annual')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              interval === 'annual'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Facturation annuelle</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch mb-20">
        {INITIAL_PLANS.map((p) => {
          const price = interval === 'annual' ? Math.round(p.priceAnnual / 12) : p.priceMonthly;
          const isPro = p.id === 'pro';

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                isPro
                  ? 'bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white shadow-xl relative'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Recommandé Entreprise
                </div>
              )}

              <div>
                <div className="font-bold text-lg text-neutral-900 dark:text-neutral-100">{p.name}</div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px] leading-relaxed">
                  {p.tagline}
                </p>

                <div className="mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums font-mono">
                      {price} €
                    </span>
                    <span className="text-xs text-neutral-500">/ mois</span>
                  </div>
                  {interval === 'annual' && p.priceAnnual > 0 && (
                    <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                      Facturé {p.priceAnnual} € / an
                    </div>
                  )}
                  {p.priceMonthly === 0 && (
                    <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">Gratuit à vie</div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Fonctionnalités :</div>
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => navigate('/workspace/billing')}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isPro
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100'
                  }`}
                >
                  <span>Choisir ce plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 mb-20 overflow-x-auto">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          Tableau comparatif détaillé des quotas
        </h2>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
              <th className="py-3 px-4 font-semibold">Ressource / Quota mensuel</th>
              <th className="py-3 px-4 font-semibold">Free</th>
              <th className="py-3 px-4 font-semibold">Starter</th>
              <th className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Professional</th>
              <th className="py-3 px-4 font-semibold">Business</th>
              <th className="py-3 px-4 font-semibold">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Stockage cloud</td>
              <td className="py-3 px-4">500 Mo</td>
              <td className="py-3 px-4">10 Go</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">50 Go</td>
              <td className="py-3 px-4">250 Go</td>
              <td className="py-3 px-4">1 To+ sur mesure</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Documents traités</td>
              <td className="py-3 px-4">20 / mois</td>
              <td className="py-3 px-4">100 / mois</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">500 / mois</td>
              <td className="py-3 px-4">2 500 / mois</td>
              <td className="py-3 px-4">Illimité</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Pages OCR & Tables</td>
              <td className="py-3 px-4">50 pages</td>
              <td className="py-3 px-4">300 pages</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">1 500 pages</td>
              <td className="py-3 px-4">8 000 pages</td>
              <td className="py-3 px-4">30 000+ pages</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Transcription audio</td>
              <td className="py-3 px-4">15 min</td>
              <td className="py-3 px-4">90 min</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">300 min</td>
              <td className="py-3 px-4">1 200 min</td>
              <td className="py-3 px-4">5 000 min</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Génération vidéo pub</td>
              <td className="py-3 px-4">—</td>
              <td className="py-3 px-4">2 min</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">5 min</td>
              <td className="py-3 px-4">20 min</td>
              <td className="py-3 px-4">60 min+</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Workflows actifs</td>
              <td className="py-3 px-4">1</td>
              <td className="py-3 px-4">3</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">10</td>
              <td className="py-3 px-4">30</td>
              <td className="py-3 px-4">100</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-sans font-medium text-neutral-900 dark:text-neutral-100">Membres inclus</td>
              <td className="py-3 px-4">1</td>
              <td className="py-3 px-4">3</td>
              <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">10</td>
              <td className="py-3 px-4">30</td>
              <td className="py-3 px-4">Illimité</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
          Questions fréquentes sur les abonnements
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Que se passe-t-il si j'atteins la limite d'un de mes quotas ?
            </div>
            <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              DocuMind vous avertit à 85% de consommation. Si le quota est atteint, l'opération est bloquée pour éviter tout surcoût imprévu. Vous pouvez à tout instant upgrader votre abonnement ou solliciter un quota personnalisé auprès du support.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Mes données et documents sont-ils isolés des autres entreprises ?
            </div>
            <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Oui, chaque organisation possède son propre identifiant unique et une isolation stricte des bases de données et espaces de stockage. Aucun utilisateur extérieur ne peut accéder à vos documents.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Puis-je changer de plan en cours d'année ?
            </div>
            <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Absolument. En cas de mise à niveau, le calcul s'effectue au prorata temporis et vos nouveaux plafonds de quotas sont immédiatement débloqués.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
