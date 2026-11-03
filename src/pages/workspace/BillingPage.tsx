import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { Invoice, SubscriptionPlan } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  Building
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { plan, subscription } = useQuota();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(plan.id);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>(
    subscription?.billingInterval || 'annual'
  );
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const loadData = async () => {
    const invs = await repositories.billing.getInvoices(orgId);
    const pList = await repositories.billing.getPlans();
    setInvoices(invs);
    setPlans(pList);
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  const handleSwitchPlan = async () => {
    if (!hasPermission('billing.manage')) {
      toastError('Action restreinte', "Vous n'avez pas la permission 'billing.manage'.");
      return;
    }

    await repositories.billing.updateSubscription(orgId, selectedPlanId, billingInterval);
    success('Abonnement mis à jour', `Votre organisation est désormais sur le plan ${selectedPlanId.toUpperCase()}.`);
    setIsUpgradeModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Abonnement, Facturation & Paiements
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Gérez votre formule, consultez l'historique des factures et mettez à jour votre moyen de paiement.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-extrabold text-lg text-neutral-900 dark:text-white capitalize">
              Plan {plan.name}
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded uppercase">
              {subscription?.status === 'active' ? 'Actif' : 'En essai'}
            </span>
          </div>

          <p className="text-xs text-neutral-500 max-w-md leading-relaxed">{plan.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              Prochain renouvellement : {subscription?.currentPeriodEnd ? subscription.currentPeriodEnd.split('T')[0] : '2027-01-15'}
            </span>
            <span>·</span>
            <span className="capitalize font-mono">Cycle {subscription?.billingInterval || 'Annuel'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#20A477] to-[#1A8B63] hover:opacity-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#20A477]/25 active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Changer de formule</span>
          </button>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
          Moyen de Paiement Enregistré (Simulation Sécurisée)
        </h2>

        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0">
              VISA
            </div>
            <div>
              <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                Carte bancaire terminant par 4242
              </div>
              <div className="text-[11px] text-neutral-500">Expire le 12/2028 · Paiement automatique 3D Secure</div>
            </div>
          </div>

          <span className="text-xs font-semibold text-neutral-500">Par défaut</span>
        </div>
      </div>

      {/* Invoices Ledger */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Historique des Factures</h2>
          <span className="text-xs text-neutral-400 font-mono">{invoices.length} factures enregistrées</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-400">
              <th className="py-3 px-4 font-semibold">Numéro de facture</th>
              <th className="py-3 px-4 font-semibold">Date d'émission</th>
              <th className="py-3 px-4 font-semibold">Désignation</th>
              <th className="py-3 px-4 font-semibold">Montant TTC</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold text-right">Télécharger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono tabular-nums">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white font-sans">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 px-4 text-neutral-500">{inv.date}</td>
                <td className="py-3 px-4 font-sans text-neutral-700 dark:text-neutral-300">{inv.planName}</td>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">
                  {inv.amountTtc.toFixed(2)} {inv.currency}
                </td>
                <td className="py-3 px-4 font-sans">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Payée
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setViewInvoice(inv)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade / Change Plan Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Changer de Formule d'Abonnement"
        description="Les nouveaux plafonds de quotas s'appliqueront immédiatement avec calcul au prorata."
      >
        <div className="space-y-4">
          <div className="flex justify-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg max-w-fit mx-auto mb-4">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                billingInterval === 'monthly' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                billingInterval === 'annual' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-500'
              }`}
            >
              Annuel (-20%)
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {plans.map((p) => {
              const price = billingInterval === 'annual' ? Math.round(p.priceAnnual / 12) : p.priceMonthly;
              const isSelected = selectedPlanId === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white capitalize">{p.name}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{p.tagline}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">{price} €</span>
                    <span className="text-[10px] text-neutral-400">/mois</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              onClick={handleSwitchPlan}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg"
            >
              Confirmer la modification
            </button>
          </div>
        </div>
      </Modal>

      {/* Invoice Details Dialog */}
      <Modal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        title={`Facture Officielle ${viewInvoice?.invoiceNumber}`}
        description="Duplicata certifié conforme pour justification comptable."
      >
        {viewInvoice && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Émetteur :</span>
                <span className="text-neutral-900 dark:text-white font-semibold">DocuMind AI Technologies Inc.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Client :</span>
                <span className="text-neutral-900 dark:text-white">{currentOrganization?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date d'échéance :</span>
                <span>{viewInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Période :</span>
                <span>{viewInvoice.period}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-sm font-sans">
                <span>Total TTC Réglé :</span>
                <span className="font-mono">{viewInvoice.amountTtc.toFixed(2)} {viewInvoice.currency}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  success('Téléchargement PDF terminé', `${viewInvoice.invoiceNumber}.pdf`);
                  setViewInvoice(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger le PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
