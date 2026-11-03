import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { DocumentEntity } from '../../types';
import {
  ScanText,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck2,
  ChevronRight,
  Eye
} from 'lucide-react';

export const OcrPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [docs, setDocs] = useState<DocumentEntity[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await repositories.document.findAll(orgId);
      setDocs(res.items);
      if (res.items.length > 0 && !selectedDocId) {
        setSelectedDocId(res.items[0].id);
      }
    };
    load();
  }, [orgId]);

  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const handleLaunchOcr = async () => {
    if (!activeDoc) return;
    const check = checkCanPerform('ocrPagesPerMonth', activeDoc.pageCount || 1);
    if (!check.allowed) {
      toastError('Quota OCR insuffisant', check.reason);
      return;
    }

    setIsProcessing(true);
    try {
      success('OCR en cours', `Analyse des zones de texte et extraction des tableaux...`);
      const updated = await repositories.document.processOcr(orgId, activeDoc.id);
      await consume('ocrPagesPerMonth', activeDoc.pageCount || 1);
      setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      success('OCR terminé', `Extraction réussie avec 98.9% de certitude.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCsv = () => {
    if (!activeDoc?.extractedFields) return;
    const rows = [['Champ', 'Valeur', 'Indice Confiance', 'Vérifié']];
    Object.entries(activeDoc.extractedFields).forEach(([k, v]) => {
      rows.push([k, String(v.value), `${Math.round(v.confidence * 100)}%`, v.verified ? 'OUI' : 'NON']);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDoc.title}_extraction.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    success('Fichier CSV généré', 'Prêt pour import SAP ou Excel.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            OCR & Intelligence Documentaire
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Extraction de structures tabulaires, classification et détection d'anomalies financières.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={!activeDoc?.extractedFields}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV comptable</span>
          </button>

          <button
            onClick={handleLaunchOcr}
            disabled={isProcessing}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Traitement...' : 'Relancer l’OCR'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Document Selector Column */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-2 mb-2">
            Documents Disponibles ({docs.length})
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {docs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDocId(d.id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between gap-3 ${
                  selectedDocId === d.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{d.title}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedDocId === d.id ? 'opacity-75' : 'text-neutral-400'}`}>
                    {d.format} · {Math.round(d.fileSize / 1024)} Ko
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* OCR Result Viewport (2 cols) */}
        {activeDoc && (
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Bounding Box Simulation Box */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ScanText className="w-4 h-4 text-sky-500" />
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">Aperçu OCR & Zones Détectées</span>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {activeDoc.pageCount} page(s) · {activeDoc.ocrConfidence ? `${Math.round(activeDoc.ocrConfidence * 100)}%` : 'Non traité'}
                </div>
              </div>

              {/* Simulated document bounding box canvas */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-950 font-mono text-xs leading-relaxed space-y-3 relative overflow-hidden">
                <div className="p-2 border border-sky-500/40 bg-sky-500/5 rounded inline-block">
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase block">[ZONE ÉMETTEUR]</span>
                  <span>Société : CloudInfra Solutions SAS — Réf Siret : 829 401 229 00021</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 rounded">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">[MONTANT HT DÉTECTÉ]</span>
                    <span className="font-extrabold text-sm text-neutral-900 dark:text-white">12 450,00 €</span>
                  </div>

                  <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 rounded">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">[TOTAL TTC DÉTECTÉ]</span>
                    <span className="font-extrabold text-sm text-neutral-900 dark:text-white">14 940,00 € (TVA 20%)</span>
                  </div>
                </div>

                <div className="p-2 border border-rose-500/40 bg-rose-500/5 rounded">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase block">[COORDONNÉES BANCAIRES VALIDÉES]</span>
                  <span>IBAN: FR76 3000 4012 3456 7890 1234 567 · BIC: BNPAFRPP</span>
                </div>
              </div>
            </div>

            {/* Structured Table Extraction */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-4">
                Champs Structurés Prêts pour Export
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {activeDoc.extractedFields ? (
                  Object.entries(activeDoc.extractedFields).map(([k, item]) => (
                    <div key={k} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="font-mono text-neutral-500 text-[11px]">{k}</div>
                      <div className="font-semibold text-neutral-900 dark:text-white text-right">
                        {String(item.value)}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {Math.round(item.confidence * 100)}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-neutral-400 text-xs">
                    Aucun champ tabulaire détecté pour ce document.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
