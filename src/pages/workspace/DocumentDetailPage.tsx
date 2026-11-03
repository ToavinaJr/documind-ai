import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { DocumentEntity } from '../../types';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Presentation,
  FileSpreadsheet,
  Edit2,
  Save,
  Check
} from 'lucide-react';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [doc, setDoc] = useState<DocumentEntity | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const loadDoc = async () => {
    if (!id) return;
    const found = await repositories.document.findById(orgId, id);
    setDoc(found);
  };

  useEffect(() => {
    loadDoc();
  }, [id, orgId]);

  if (!doc) {
    return (
      <div className="py-12 text-center text-xs text-neutral-400">
        Chargement du document ou ressource introuvable...
      </div>
    );
  }

  const handleFieldSave = async (fieldKey: string) => {
    if (!doc.extractedFields) return;
    const updatedFields = {
      ...doc.extractedFields,
      [fieldKey]: {
        ...doc.extractedFields[fieldKey],
        value: editValue,
        verified: true
      }
    };
    const updated = await repositories.document.update(orgId, doc.id, {
      extractedFields: updatedFields
    });
    setDoc(updated);
    setEditingField(null);
    success('Champ mis à jour', `Valeur enregistrée et certifiée par relecture.`);
  };

  const handleToggleVerified = async (fieldKey: string) => {
    if (!doc.extractedFields) return;
    const current = doc.extractedFields[fieldKey];
    const updatedFields = {
      ...doc.extractedFields,
      [fieldKey]: {
        ...current,
        verified: !current.verified
      }
    };
    const updated = await repositories.document.update(orgId, doc.id, {
      extractedFields: updatedFields
    });
    setDoc(updated);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${doc.title}_extractions.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success('Export JSON généré', `Téléchargement de ${doc.title}_extractions.json`);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/workspace/documents')}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux documents</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => navigate('/workspace/document-studio')}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Générer Synthèse</span>
          </button>
        </div>
      </div>

      {/* Document Header Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center font-bold text-sm shrink-0">
              {doc.format}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">{doc.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span>{Math.round(doc.fileSize / 1024)} Ko</span>
                <span>·</span>
                <span>{doc.pageCount} pages</span>
                <span>·</span>
                <span>Importé le {doc.createdAt.split('T')[0]}</span>
                <span>·</span>
                <span className="font-mono">{doc.mimeType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                doc.status === 'processed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {doc.status === 'processed' ? 'OCR Validé' : 'En attente'}
            </span>
          </div>
        </div>

        {/* Anomalies alert banner */}
        {doc.anomalies && doc.anomalies.length > 0 && (
          <div className="mt-5 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs flex items-start gap-3 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Anomalie ou vigilance détectée automatiquement :</div>
              <ul className="mt-1 space-y-0.5 text-[11px] list-disc list-inside">
                {doc.anomalies.map((anom, i) => (
                  <li key={i}>{anom}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Split: Structured Fields on Left, OCR Text on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Structured Fields & Human Correction */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Champs Structurés & Validation Humaine
              </h2>
              <p className="text-xs text-neutral-500">
                Données tabulaires extraites avec indice de certitude.
              </p>
            </div>
            {doc.ocrConfidence && (
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                {Math.round(doc.ocrConfidence * 100)}% confiance globale
              </div>
            )}
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {doc.extractedFields ? (
              Object.entries(doc.extractedFields).map(([key, data]) => (
                <div key={key} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-neutral-500 text-[11px] font-mono">{key}</div>
                    {editingField === key ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="px-2 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleFieldSave(key)}
                          className="p-1 bg-neutral-900 text-white rounded hover:bg-neutral-800"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="font-semibold text-neutral-900 dark:text-white truncate mt-0.5">
                        {String(data.value)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
                      {Math.round(data.confidence * 100)}%
                    </span>

                    <button
                      onClick={() => handleToggleVerified(key)}
                      title={data.verified ? 'Marqué comme vérifié' : 'Marquer comme vérifié'}
                      className={`p-1 rounded text-xs transition-colors ${
                        data.verified
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingField(key);
                        setEditValue(String(data.value));
                      }}
                      title="Corriger la valeur"
                      className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-neutral-400 text-xs">
                Aucun champ extrait pour l'instant. Lancez le traitement OCR ci-dessus.
              </div>
            )}
          </div>
        </div>

        {/* Raw OCR Text & Emplacement preview */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Texte Intégral Extrait</h2>
            <span className="text-xs text-neutral-400 font-mono">Vue brute OCR</span>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/80 font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {doc.extractedText || 'Extraction en attente de traitement.'}
          </div>
        </div>
      </div>
    </div>
  );
};
