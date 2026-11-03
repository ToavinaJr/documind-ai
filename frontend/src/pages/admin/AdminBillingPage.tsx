import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../mocks/storage';
import { useToast } from '../../context/ToastContext';
import { Invoice } from '../../types';
import { Receipt, Download, RotateCcw, CheckCircle2, DollarSign } from 'lucide-react';

export const AdminBillingPage: React.FC = () => {
  const { success } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const loadInvoices = () => {
    setInvoices(mockStorage.getInvoices());
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleRefund = (inv: Invoice) => {
    if (window.confirm(`Simuler le remboursement de la facture ${inv.invoiceNumber} (${inv.amountTtc} €) ?`)) {
      const updated = invoices.map((i) =>
        i.id === inv.id ? { ...i, status: 'refunded' as const } : i
      );
      mockStorage.saveInvoices(updated);
      setInvoices(updated);
      success('Remboursement simulé', `Facture ${inv.invoiceNumber} remboursée.`);
    }
  };

  const totalCollected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.amountTtc, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Facturation & Flux Financiers</h1>
          <p className="mt-1 text-xs text-slate-400">
            Journal consolidé de toutes les transactions et factures générées par les organisations.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right shrink-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Total Encaissé (TTC)</div>
          <div className="font-mono font-extrabold text-lg text-emerald-400 tabular-nums">
            {totalCollected.toFixed(2)} €
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <th className="py-3 px-4 font-semibold">Numéro Facture</th>
              <th className="py-3 px-4 font-semibold">Organisation</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Formule Souscrite</th>
              <th className="py-3 px-4 font-semibold">Montant TTC</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono tabular-nums">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-white">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-slate-300 font-sans">{inv.organizationId}</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">{inv.date}</td>
                <td className="py-3 px-4 font-sans text-slate-300">{inv.planName}</td>
                <td className="py-3 px-4 font-semibold text-white">
                  {inv.amountTtc.toFixed(2)} {inv.currency}
                </td>
                <td className="py-3 px-4 font-sans">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      inv.status === 'paid'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {inv.status === 'paid' ? 'Payée' : 'Remboursée'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-sans">
                  {inv.status === 'paid' && (
                    <button
                      onClick={() => handleRefund(inv)}
                      className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded border border-rose-900 transition-colors"
                    >
                      Rembourser
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
