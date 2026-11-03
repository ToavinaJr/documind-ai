import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { WorkflowEntity, WorkflowNode, WorkflowNodeType } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  GitBranch,
  Play,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  SlidersHorizontal,
  FileText,
  ScanText,
  UserCheck,
  Download,
  AlertCircle
} from 'lucide-react';

const NODE_DEFS: Record<WorkflowNodeType, { label: string; icon: any; color: string; desc: string }> = {
  input_document: { label: 'Dépôt Source', icon: FileText, color: 'text-sky-500 bg-sky-500/10 border-sky-500/30', desc: 'Ingestion de fichiers PDF/DOCX' },
  ocr_extractor: { label: 'OCR & Extraction', icon: ScanText, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', desc: 'Reconnaissance de zones et tables' },
  classifier: { label: 'Classification IA', icon: Layers, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', desc: 'Identification du type de document' },
  structured_extract: { label: 'Champs Structurés', icon: Sparkles, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', desc: 'Extraction schéma JSON/CSV' },
  human_validation: { label: 'Validation Humaine', icon: UserCheck, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', desc: 'Contrôle en cas d’anomalie' },
  summary_ai: { label: 'Synthèse Sémantique', icon: FileText, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', desc: 'Résumé et décisions' },
  doc_generator: { label: 'Générateur DOCX/MD', icon: FileText, color: 'text-rose-400 bg-rose-400/10 border-rose-400/30', desc: 'Création du rapport final' },
  presentation_generator: { label: 'Générateur Slides', icon: Layers, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', desc: 'Diaporama exécutif' },
  export_output: { label: 'Export ERP / API', icon: Download, color: 'text-teal-500 bg-teal-500/10 border-teal-500/30', desc: 'Transmission SAP/Sage' }
};

export const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const orgId = currentOrganization?.id || 'org-acme';
  const [workflow, setWorkflow] = useState<WorkflowEntity | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execLogs, setExecLogs] = useState<string[]>([]);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const loadWorkflow = async () => {
    if (!id) return;
    const found = await repositories.workflow.findById(orgId, id);
    setWorkflow(found);
  };

  useEffect(() => {
    loadWorkflow();
  }, [id, orgId]);

  if (!workflow) {
    return <div className="py-12 text-center text-xs text-neutral-400">Chargement du workflow...</div>;
  }

  const handleSave = async () => {
    await repositories.workflow.save(orgId, workflow);
    success('Workflow enregistré', `${workflow.title} est à jour.`);
  };

  const handleExecute = async () => {
    const check = checkCanPerform('workflowExecutionsPerMonth', 1);
    if (!check.allowed) {
      toastError('Quota atteint', check.reason);
      return;
    }

    setIsExecuting(true);
    setExecLogs(['[00:00] Initialisation du pipeline ' + workflow.title]);

    // Animate node by node
    const updatedNodes = [...workflow.nodes];

    for (let i = 0; i < updatedNodes.length; i++) {
      updatedNodes[i].status = 'running';
      setWorkflow({ ...workflow, nodes: [...updatedNodes] });
      setExecLogs((prev) => [...prev, `[00:0${i + 1}] Exécution du nœud : ${updatedNodes[i].title}`]);

      await new Promise((r) => setTimeout(r, 800));

      updatedNodes[i].status = 'success';
      setWorkflow({ ...workflow, nodes: [...updatedNodes] });
      setExecLogs((prev) => [...prev, `[00:0${i + 1}] Nœud validé avec succès (0 anomalie)`]);
    }

    await repositories.workflow.execute(orgId, workflow.id);
    await consume('workflowExecutionsPerMonth', 1);
    setIsExecuting(false);
    setExecLogs((prev) => [...prev, '[00:06] Pipeline complété. Données exportées.']);
    success('Exécution terminée avec succès !');
  };

  const handleAddNode = (type: WorkflowNodeType) => {
    const def = NODE_DEFS[type];
    const newX = 60 + (workflow.nodes.length % 4) * 260;
    const newY = 80 + Math.floor(workflow.nodes.length / 4) * 160;

    const newNode: WorkflowNode = {
      id: 'node-' + Date.now().toString(36),
      type,
      title: def.label,
      description: def.desc,
      x: newX,
      y: newY,
      config: {},
      status: 'idle'
    };

    const newNodes = [...workflow.nodes, newNode];
    let newEdges = [...workflow.edges];

    // Automatically connect to previous node if available
    if (workflow.nodes.length > 0) {
      const prevNode = workflow.nodes[workflow.nodes.length - 1];
      newEdges.push({
        id: 'edge-' + Date.now(),
        fromNodeId: prevNode.id,
        toNodeId: newNode.id
      });
    }

    setWorkflow({ ...workflow, nodes: newNodes, edges: newEdges });
    setIsAddNodeOpen(false);
    success('Nœud ajouté', def.label);
  };

  const handleDeleteNode = (nodeId: string) => {
    const newNodes = workflow.nodes.filter((n) => n.id !== nodeId);
    const newEdges = workflow.edges.filter((e) => e.fromNodeId !== nodeId && e.toNodeId !== nodeId);
    setWorkflow({ ...workflow, nodes: newNodes, edges: newEdges });
    if (selectedNode?.id === nodeId) setSelectedNode(null);
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-4 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace/workflows')}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white rounded-xl hover:bg-[#F8FAFD] dark:hover:bg-[#26262D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-[#0F172A] dark:text-[#F2F2F5]">{workflow.title}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470]">
                Actif
              </span>
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-0.5">
              {workflow.nodes.length} nœuds · {workflow.edges.length} liaisons actives
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddNodeOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F8FAFD] hover:bg-[#EEF2F7] dark:bg-[#26262D] dark:hover:bg-[#303038] text-[#0F172A] dark:text-[#F2F2F5] rounded-xl border border-[#DCE3EC] dark:border-[#303038] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#DE1F4F]" />
            <span>Ajouter un Nœud</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-semibold bg-[#F8FAFD] hover:bg-[#EEF2F7] dark:bg-[#26262D] dark:hover:bg-[#303038] text-[#0F172A] dark:text-[#F2F2F5] rounded-xl border border-[#DCE3EC] dark:border-[#303038] transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[#3986A8]" />
            <span>Sauvegarder</span>
          </button>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm shadow-[#DE1F4F]/25 transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Exécution...' : 'Lancer le Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Node Canvas */}
      <div className="relative w-full h-[540px] bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden select-none">
        {/* Dot grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Curved Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {workflow.edges.map((edge) => {
            const fromNode = workflow.nodes.find((n) => n.id === edge.fromNodeId);
            const toNode = workflow.nodes.find((n) => n.id === edge.toNodeId);
            if (!fromNode || !toNode) return null;

            const startX = fromNode.x + 220;
            const startY = fromNode.y + 40;
            const endX = toNode.x;
            const endY = toNode.y + 40;
            const deltaX = Math.abs(endX - startX) * 0.5;

            const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

            return (
              <path
                key={edge.id}
                d={pathD}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-300 dark:text-neutral-700"
              />
            );
          })}
        </svg>

        {/* Draggable / Clickable Nodes */}
        {workflow.nodes.map((node) => {
          const def = NODE_DEFS[node.type] || NODE_DEFS.input_document;
          const Icon = def.icon;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '220px'
              }}
              className={`absolute p-3 rounded-xl border bg-white dark:bg-neutral-900 shadow-md cursor-pointer transition-all ${
                selectedNode?.id === node.id
                  ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-400'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
              } ${
                node.status === 'running'
                  ? 'ring-2 ring-sky-500 animate-pulse'
                  : node.status === 'success'
                  ? 'border-emerald-500/80'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`p-1.5 rounded-lg border ${def.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1">
                  {node.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(node.id);
                    }}
                    className="text-neutral-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                {node.title}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                {node.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Logs Drawer */}
      {execLogs.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              Journal d'Exécution en Direct
            </span>
            <span className="font-mono text-[10px] text-neutral-400">
              {isExecuting ? 'En cours...' : 'Terminé'}
            </span>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800/80 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 max-h-36 overflow-y-auto">
            {execLogs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Add Node Modal */}
      <Modal
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        title="Ajouter un Nœud de Traitement au Workflow"
        description="Sélectionnez l'étape d'automatisation à insérer dans le graphe."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {Object.entries(NODE_DEFS).map(([typeKey, def]) => {
            const Icon = def.icon;
            return (
              <button
                key={typeKey}
                onClick={() => handleAddNode(typeKey as any)}
                className="p-3 text-left border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white rounded-xl transition-colors bg-neutral-50 dark:bg-neutral-800/50 flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg border shrink-0 ${def.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">{def.label}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{def.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
