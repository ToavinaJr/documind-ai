import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { DocumentEntity } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Trash2,
  Eye,
  FileCheck2,
  AlertTriangle,
  Download,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { currentOrganization, hasPermission } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';

  const [documents, setDocuments] = useState<DocumentEntity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<'PDF' | 'DOCX' | 'XLSX' | 'PNG'>('PDF');
  const [newTags, setNewTags] = useState('Finance, Invoices');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadDocuments = async () => {
    const res = await repositories.document.findAll(orgId, {
      search,
      format: selectedFormat
    });
    setDocuments(res.items);
  };

  useEffect(() => {
    loadDocuments();
  }, [orgId, search, selectedFormat]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewTitle(file.name);
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (['PDF', 'DOCX', 'XLSX', 'CSV', 'PNG', 'JPG', 'TXT'].includes(ext || '')) {
        setNewFormat(ext as any);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Quota check
    const check = checkCanPerform('documentsPerMonth', 1);
    if (!check.allowed) {
      toastError('Quota atteint', check.reason);
      return;
    }

    setIsProcessing(true);
    try {
      const realSize = selectedFile ? selectedFile.size : Math.floor(1200000 + Math.random() * 2000000);
      const realMime = selectedFile ? selectedFile.type : (newFormat === 'PDF' ? 'application/pdf' : 'application/octet-stream');

      const created = await repositories.document.create(orgId, {
        title: newTitle.endsWith(`.${newFormat.toLowerCase()}`) ? newTitle : `${newTitle}.${newFormat.toLowerCase()}`,
        originalFileName: selectedFile ? selectedFile.name : newTitle,
        format: newFormat as any,
        tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
        fileSize: realSize,
        mimeType: realMime,
        pageCount: Math.max(1, Math.ceil(realSize / 250000))
      });

      // Consume quota
      await consume('documentsPerMonth', 1);
      success('Fichier téléversé & Ingestion OCR lancée', `${created.title} (${Math.round(realSize / 1024)} Ko).`);
      setIsUploadOpen(false);
      setNewTitle('');
      setSelectedFile(null);
      loadDocuments();
    } catch (err: any) {
      toastError('Erreur d\'import', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (docId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le document "${title}" ? Cette action est irréversible.`)) {
      await repositories.document.delete(orgId, docId);
      success('Document supprimé', title);
      loadDocuments();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DE1F4F] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#DE1F4F]" />
            <span>Domaine Documents & OCR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Documents Ingestés & Stockage
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Gérez vos factures, contrats, rapports et déclenchez l'analyse OCR intelligente.
          </p>
        </div>

        {hasPermission('documents.create') && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm shadow-[#DE1F4F]/25 transition-all flex items-center gap-2 shrink-0 active:scale-98"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importer un document</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-[#1A1A1F] p-3 rounded-2xl border border-[#DCE3EC] dark:border-[#303038]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom de fichier ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] cursor-pointer focus:outline-none focus:border-[#DE1F4F]"
          >
            <option value="all">Tous formats</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
            <option value="PNG">PNG</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCE3EC] dark:border-[#303038] bg-[#F8FAFD] dark:bg-[#0F0F13] text-[#64748B] dark:text-[#A1A1AA]">
              <th className="py-3 px-4 font-semibold">Titre du document</th>
              <th className="py-3 px-4 font-semibold">Format</th>
              <th className="py-3 px-4 font-semibold">Taille / Pages</th>
              <th className="py-3 px-4 font-semibold">Statut OCR</th>
              <th className="py-3 px-4 font-semibold">Date d'import</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF4] dark:divide-[#303038]">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#64748B] dark:text-[#A1A1AA]">
                  Aucun document trouvé correspondant à vos critères.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/workspace/documents/${doc.id}`)}
                  className="hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#DE1F4F]/20">
                        {doc.format}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5] truncate max-w-xs sm:max-w-md">
                          {doc.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
                          {doc.tags.map((t, idx) => (
                            <span key={idx}>#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium">{doc.format}</td>

                  <td className="py-3 px-4 font-mono text-[#64748B] dark:text-[#A1A1AA] tabular-nums">
                    {Math.round(doc.fileSize / 1024)} Ko · {doc.pageCount} p.
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          doc.status === 'processed'
                            ? 'bg-[#E8F8F2] text-[#20A477] dark:bg-[#20A477]/15 dark:text-[#2CD49B]'
                            : 'bg-[#FEF5E7] text-[#D99A35] dark:bg-[#D99A35]/15 dark:text-[#F5B352]'
                        }`}
                      >
                        {doc.status === 'processed' ? 'Analysé' : 'Traitement'}
                      </span>
                      {doc.anomalies && doc.anomalies.length > 0 && (
                        <span className="text-[#D99A35] flex items-center gap-1 text-[11px] font-medium" title="Anomalie détectée">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#64748B] dark:text-[#A1A1AA] font-mono">
                    {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/workspace/documents/${doc.id}`)}
                        className="p-1.5 text-[#64748B] hover:text-[#DE1F4F] rounded-lg transition-colors"
                        title="Voir l'analyse"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {hasPermission('documents.delete') && (
                        <button
                          onClick={(e) => handleDelete(doc.id, doc.title, e)}
                          className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Ingérer un nouveau document"
        description="Le moteur OCR découpera les pages, extraira le texte et détectera les anomalies."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Real File Input Dropzone (Fix FILE-01) */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1.5">
              Sélectionnez un fichier réel depuis votre appareil
            </label>
            <div className="border-2 border-dashed border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F] rounded-xl p-4 text-center cursor-pointer bg-[#F8FAFD] dark:bg-[#26262D] transition-colors relative">
              <input
                type="file"
                accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                <UploadCloud className="w-6 h-6 text-[#DE1F4F]" />
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5]">
                  {selectedFile ? selectedFile.name : 'Cliquez ou glissez un fichier ici'}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  {selectedFile
                    ? `${Math.round(selectedFile.size / 1024)} Ko · Format détecté : ${selectedFile.type || 'Fichier'}`
                    : 'PDF, DOCX, XLSX, CSV, PNG, JPG (Max 50 Mo)'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Titre du document
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Facture AWS Q3 2026"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
                Format
              </label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PNG">PNG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                placeholder="Finance, RH, Légal"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Traitement OCR...' : 'Lancer l\'ingestion'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
