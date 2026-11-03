import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { GeneratedDocument } from '../../types';
import {
  FileSpreadsheet,
  Sparkles,
  Save,
  Download,
  Trash2,
  FileText,
  Clock,
  Layers,
  Check,
  Plus
} from 'lucide-react';

export const DocumentStudioPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [docs, setDocs] = useState<GeneratedDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<GeneratedDocument | null>(null);

  // Form states
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docType, setDocType] = useState<GeneratedDocument['type']>('executive_summary');
  const [sourceTitle, setSourceTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadDocs = async () => {
    const list = await repositories.generation.findDocuments(orgId);
    setDocs(list);
    if (list.length > 0 && !activeDoc) {
      setActiveDoc(list[0]);
      setDocTitle(list[0].title);
      setDocContent(list[0].content);
      setDocType(list[0].type);
      setSourceTitle(list[0].sourceTitle || '');
    }
  };

  useEffect(() => {
    loadDocs();
  }, [orgId]);

  const handleSelectDoc = (d: GeneratedDocument) => {
    setActiveDoc(d);
    setDocTitle(d.title);
    setDocContent(d.content);
    setDocType(d.type);
    setSourceTitle(d.sourceTitle || '');
  };

  const handleCreateNew = () => {
    setActiveDoc(null);
    setDocTitle('Nouveau Rapport Exécutif');
    setDocType('executive_summary');
    setSourceTitle('Instruction libre');
    setDocContent(`# NOUVEAU RAPPORT EXÉCUTIF
**Date** : ${new Date().toISOString().split('T')[0]}
**Statut** : Brouillon en cours de rédaction

## 1. Contexte & Objectifs
Décrivez ici les enjeux principaux...

## 2. Recommandations Clés
- Point d'arbitrage 1
- Point d'arbitrage 2`);
  };

  const handleSave = async () => {
    if (!docTitle) return;

    if (activeDoc) {
      const updated = await repositories.generation.updateDocument(orgId, activeDoc.id, {
        title: docTitle,
        content: docContent,
        type: docType
      });
      setActiveDoc(updated);
      success('Document sauvegardé', `Version ${updated.version} enregistrée.`);
    } else {
      const check = checkCanPerform('docGenerationsPerMonth', 1);
      if (!check.allowed) {
        toastError('Quota atteint', check.reason);
        return;
      }
      const created = await repositories.generation.createDocument(orgId, {
        title: docTitle,
        content: docContent,
        type: docType,
        sourceType: 'prompt',
        sourceTitle
      });
      await consume('docGenerationsPerMonth', 1);
      setActiveDoc(created);
      success('Document créé', `${created.title} enregistré.`);
    }
    loadDocs();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Supprimer ce document généré ?')) {
      await repositories.generation.deleteDocument(orgId, id);
      success('Document supprimé');
      setActiveDoc(null);
      loadDocs();
    }
  };

  const handleExport = (format: 'md' | 'txt' | 'pdf') => {
    let blob: Blob;
    let fileName: string;

    if (format === 'pdf') {
      const htmlDoc = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>
    @media print { body { padding: 0; } .no-print { display: none; } }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 48px; color: #0F172A; max-width: 820px; margin: 0 auto; }
    h1 { font-size: 26px; color: #DE1F4F; border-bottom: 2px solid #DCE3EC; padding-bottom: 12px; margin-bottom: 8px; }
    .meta { font-size: 12px; color: #64748B; margin-bottom: 32px; }
    .content { font-size: 14px; white-space: pre-wrap; word-break: break-word; }
    .footer { margin-top: 60px; font-size: 11px; color: #64748B; border-top: 1px solid #DCE3EC; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>${docTitle}</h1>
  <div class="meta">DocuMind AI · Document Studio · Version ${activeDoc ? activeDoc.version : 1} · Export officiel certifié</div>
  <div class="content">${docContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="footer">Généré le ${new Date().toLocaleDateString('fr-FR')} via DocuMind AI — Plateforme SaaS multimodale d'intelligence documentaire</div>
</body>
</html>`;
      blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
      fileName = `${docTitle.replace(/\s+/g, '_')}_document.html`;
    } else {
      blob = new Blob([docContent], { type: format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' });
      fileName = `${docTitle.replace(/\s+/g, '_')}.${format}`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    success(`Document exporté`, `Fichier ${fileName} téléchargé.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            Document Studio & Édition
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Générez, ajustez et exportez des rapports, comptes rendus et propositions d'entreprise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Document</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer (v{activeDoc ? activeDoc.version : 1})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Document List Sidebar */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-2 mb-2">
            Documents Récents ({docs.length})
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {docs.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelectDoc(d)}
                className={`p-3 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                  activeDoc?.id === d.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{d.title}</div>
                  <div className={`text-[10px] mt-0.5 ${activeDoc?.id === d.id ? 'opacity-75' : 'text-neutral-400'}`}>
                    v{d.version} · {d.type}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(d.id, e)}
                  className={`p-1 rounded hover:text-rose-500 ${activeDoc?.id === d.id ? 'text-white/60' : 'text-neutral-400'}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Document Editor */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex-1">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Titre du document..."
                className="w-full text-base sm:text-lg font-bold text-neutral-900 dark:text-white bg-transparent border-0 focus:outline-none"
              />
              <div className="text-xs text-neutral-400 mt-1">
                Source : <span className="font-mono">{sourceTitle || 'Instruction libre'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Exporter :</span>
              <button
                onClick={() => handleExport('md')}
                className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                .MD
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                .TXT
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold"
              >
                .PDF
              </button>
            </div>
          </div>

          <div>
            <textarea
              rows={18}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full p-4 font-mono text-xs leading-relaxed bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
