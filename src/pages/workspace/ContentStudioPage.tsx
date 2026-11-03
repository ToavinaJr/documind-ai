import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { ContentSnippet } from '../../types';
import {
  Sparkles,
  Share2,
  Copy,
  Plus,
  Trash2,
  Check,
  Send,
  Linkedin,
  Mail,
  FileText
} from 'lucide-react';

export const ContentStudioPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { success } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [snippets, setSnippets] = useState<ContentSnippet[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<ContentSnippet | null>(null);

  // Form states
  const [channel, setChannel] = useState<ContentSnippet['channel']>('linkedin');
  const [tone, setTone] = useState<ContentSnippet['tone']>('professional');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [promptTopic, setPromptTopic] = useState('Analyse des gains de productivité liés à l’automatisation');

  const loadSnippets = async () => {
    const list = await repositories.generation.findContentSnippets(orgId);
    setSnippets(list);
    if (list.length > 0 && !activeSnippet) {
      setActiveSnippet(list[0]);
      setTitle(list[0].title);
      setContent(list[0].content);
      setChannel(list[0].channel);
      setTone(list[0].tone);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, [orgId]);

  const handleGenerate = async () => {
    let generatedText = '';
    const orgName = currentOrganization?.name || 'Notre organisation';

    if (channel === 'linkedin') {
      generatedText = `🚀 ${promptTopic}

Au sein de ${orgName}, l'optimisation de nos processus documentaires et décisionnels repose sur trois principes fondamentaux :
• Traçabilité complète entre chaque livrable et sa source certifiée
• Synthèse objective des échanges en comités et comités de direction
• Automatisation des contrôles de conformité et des vérifications budgétaires

[Indicateur clé : Temps de traitement optimisé de façon mesurable]

Quelles initiatives déployez-vous pour libérer le potentiel opérationnel de vos équipes ?

#IntelligenceArtificielle #Efficience #Organisation #Gouvernance`;
    } else if (channel === 'newsletter') {
      generatedText = `Objet : Point d'étape opérationnel — ${promptTopic}

Bonjour à tous,

Dans le cadre du suivi de nos projets chez ${orgName}, voici les éléments marquants concernant « ${promptTopic} » :

1. Synthèse des arbitrages récents :
Les analyses documentaires et les réunions de cadrage ont permis de consolider les priorités pour les semaines à venir.

2. Actions concrètes en cours :
• Structuration des livrables et rapprochement des sources
• Traitement asynchrone des flux administratifs
• Revue des engagements contractuels

Retrouvez le dossier complet et les documents sources directement sur notre espace de travail.

Bien cordialement,
L'équipe de direction`;
    } else {
      generatedText = `COMMUNIQUÉ D'ENTREPRISE — ${promptTopic.toUpperCase()}

${orgName} annonce le déploiement d'un nouveau standard de traitement documentaire et d'automatisation des flux professionnels.

Face à la complexité croissante des volumes d'information, ce dispositif garantit la traçabilité rigoureuse des données sources, la fiabilité des extractions tabulaires et la célérité des prises de décision stratégiques.

Toutes les données traitées respectent les critères stricts d'isolation multi-tenant et de gouvernance des accès d'entreprise.`;
    }

    const newSnip = await repositories.generation.createContentSnippet(orgId, {
      title: promptTopic,
      channel,
      tone,
      content: generatedText
    });

    setActiveSnippet(newSnip);
    setTitle(newSnip.title);
    setContent(newSnip.content);
    success('Contenu généré !', 'Le texte est prêt pour relecture et diffusion.');
    loadSnippets();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    success('Copié dans le presse-papier !');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Content Studio & Rédaction
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Générez des posts LinkedIn, newsletters et communiqués alignés sur vos analyses d’entreprise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Generator Controls (1 col) */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Paramètres de Rédaction</h2>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Canal de diffusion
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="linkedin">Post LinkedIn B2B</option>
              <option value="newsletter">Newsletter Collaborateurs</option>
              <option value="blog">Article d’expertise / Blog</option>
              <option value="press_release">Communiqué de Presse</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tonalité
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            >
              <option value="professional">Professionnel & Mesuré</option>
              <option value="authoritative">Expert & Décisionnel</option>
              <option value="conversational">Engageant & Conversationnel</option>
              <option value="inspiring">Inspirant & Visionnaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Sujet ou conclusion à valoriser
            </label>
            <textarea
              rows={3}
              value={promptTopic}
              onChange={(e) => setPromptTopic(e.target.value)}
              className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Générer le contenu</span>
          </button>
        </div>

        {/* Live Content Editor & Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
              {title || 'Texte éditorial prêt à l’emploi'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 text-xs leading-relaxed bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
