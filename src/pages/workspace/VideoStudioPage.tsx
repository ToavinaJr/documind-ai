import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuota } from '../../context/QuotaContext';
import { useToast } from '../../context/ToastContext';
import { repositories } from '../../repositories';
import { AdVideoEntity, AdVideoScene } from '../../types';
import {
  Clapperboard,
  Sparkles,
  Play,
  Film,
  Plus,
  Trash2,
  Download,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sliders,
  Maximize2
} from 'lucide-react';

export const VideoStudioPage: React.FC = () => {
  const { currentOrganization } = useAuth();
  const { consume, checkCanPerform } = useQuota();
  const { success, error: toastError } = useToast();

  const orgId = currentOrganization?.id || 'org-acme';
  const [adVideos, setAdVideos] = useState<AdVideoEntity[]>([]);
  const [activeVid, setActiveVid] = useState<AdVideoEntity | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form states for creating / editing ad video
  const [targetAudience, setTargetAudience] = useState('Décideurs, Directeurs Financiers');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [voiceStyle, setVoiceStyle] = useState('Femme professionnelle, chaleureuse et persuasive');
  const [musicMood, setMusicMood] = useState('Corporate moderne, montée inspirante');

  // Script states
  const [scriptHook, setScriptHook] = useState(
    'Vous passez encore vos soirées à ressaisir des factures et vérifier des clauses de contrat ?'
  );
  const [scriptProblem, setScriptProblem] = useState(
    'Chaque semaine, une équipe administrative perd plus de 14 heures sur des tâches sans valeur ajoutée.'
  );
  const [scriptSolution, setScriptSolution] = useState(
    'DocuMind AI transforme instantanément tout document, audio de réunion ou vidéo en livrables d’exception prêts à l’emploi.'
  );
  const [scriptCta, setScriptCta] = useState(
    'Essayez gratuitement dès aujourd’hui et libérez le potentiel de votre équipe.'
  );

  // Scenes list
  const [scenes, setScenes] = useState<AdVideoScene[]>([
    {
      id: 'sc-1',
      sceneNumber: 1,
      durationSeconds: 4,
      headline: 'L’enfer des tâches manuelles',
      narrationVoiceover: 'Vous passez encore vos vendredis soirs à déchiffrer des factures papier et ressaisir des tableaux ?',
      visualDescription: 'Bureau encombré de classeurs et écrans d’ordinateurs avec des tableurs infinis.',
      cameraMovement: 'Lent zoom avant dramatique',
      transition: 'Fondu noir rapide'
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      durationSeconds: 5,
      headline: 'DocuMind AI prend le relais',
      narrationVoiceover: 'Découvrez DocuMind AI : l’intelligence documentaire multimodale.',
      visualDescription: 'Interface épurée montrant un contrat glissé puis instantanément structuré.',
      cameraMovement: 'Travelling latéral fluide',
      transition: 'Balayage doux'
    },
    {
      id: 'sc-3',
      sceneNumber: 3,
      durationSeconds: 5,
      headline: '1 source. 10 livrables d’élite.',
      narrationVoiceover: 'D’un simple enregistrement audio, obtenez votre compte rendu et vos présentations.',
      visualDescription: 'Arborescence graphique dynamique d’une onde sonore se ramifiant.',
      cameraMovement: 'Recul dynamique',
      transition: 'Coupure nette'
    },
    {
      id: 'sc-4',
      sceneNumber: 4,
      durationSeconds: 4,
      headline: 'Passez à la vitesse supérieure',
      narrationVoiceover: 'Rejoignez plus de 800 entreprises européennes. Démarrez votre essai.',
      visualDescription: 'Logo épuré DocuMind AI avec bouton d’action contrasté.',
      cameraMovement: 'Fixe avec reflet subtil',
      transition: 'Fondu final'
    }
  ]);

  const [renderingProgress, setRenderingProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const loadAdVideos = async () => {
    const list = await repositories.generation.findAdVideos(orgId);
    setAdVideos(list);
    if (list.length > 0 && !activeVid) {
      setActiveVid(list[0]);
    }
  };

  useEffect(() => {
    loadAdVideos();
  }, [orgId]);

  const handleAddScene = () => {
    const newSc: AdVideoScene = {
      id: 'sc-' + Date.now().toString(36),
      sceneNumber: scenes.length + 1,
      durationSeconds: 4,
      headline: 'Nouvelle Scène Visuelle',
      narrationVoiceover: 'Texte lu par la voix off...',
      visualDescription: 'Description de l’image ou animation à afficher...',
      cameraMovement: 'Travelling avant',
      transition: 'Fondu enchaîné'
    };
    setScenes([...scenes, newSc]);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) return;
    setScenes(scenes.filter((_, i) => i !== idx));
  };

  const handleLaunchProduction = async () => {
    const check = checkCanPerform('videoGenerationsMinutesPerMonth', 1);
    if (!check.allowed) {
      toastError('Quota vidéo insuffisant', check.reason);
      return;
    }

    setIsRendering(true);
    setRenderingProgress(10);
    setCurrentStep(6);

    const interval = setInterval(async () => {
      setRenderingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          consume('videoGenerationsMinutesPerMonth', 1);

          // Fix VIDEO-01: Persist video in repository
          repositories.generation
            .createAdVideo(orgId, {
              title: `Spot Publicitaire — ${targetAudience}`,
              targetAudience,
              aspectRatio,
              voiceStyle,
              musicMood,
              status: 'ready',
              durationSeconds: totalDuration,
              scenes,
              scriptSummary: `${scriptHook} ${scriptProblem} ${scriptSolution}`
            })
            .then((created) => {
              setActiveVid(created);
              loadAdVideos();
              success('Rendu vidéo terminé et enregistré !', `Spot de ${totalDuration}s prêt pour diffusion.`);
            })
            .catch((err) => {
              toastError('Erreur d\'enregistrement', err.message);
            });

          return 100;
        }
        return p + 20;
      });
    }, 600);
  };

  const handleDownloadVideoPackage = () => {
    const videoHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>DocuMind AI — Spot Publicitaire Vidéo</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #09090B; color: #F2F2F5; margin: 0; padding: 32px; display: flex; flex-direction: column; align-items: center; }
    .player-box { max-width: 800px; width: 100%; background: #1A1A1F; border: 1px solid #303038; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .screen { aspect-ratio: ${aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9'}; background: #000000; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; text-align: center; position: relative; }
    .scene-badge { position: absolute; top: 20px; left: 20px; background: rgba(230, 91, 125, 0.25); color: #E65B7D; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
    h1 { font-size: 24px; color: #FFFFFF; margin-bottom: 16px; }
    p { font-size: 14px; color: #DCE3EC; line-height: 1.6; max-width: 600px; }
    .specs { padding: 24px; border-top: 1px solid #303038; display: grid; grid-cols-2; font-size: 12px; color: #A1A1AA; }
  </style>
</head>
<body>
  <div class="player-box">
    <div class="screen">
      <div class="scene-badge">Spot Publicitaire HD (${aspectRatio})</div>
      <h1>${scriptHook}</h1>
      <p>${scriptSolution}</p>
      <p style="color: #E65B7D; font-weight: bold; margin-top: 24px;">${scriptCta}</p>
    </div>
    <div class="specs">
      <div><strong>Format :</strong> ${aspectRatio} · <strong>Durée :</strong> ${totalDuration}s · <strong>Voix :</strong> ${voiceStyle}</div>
      <div style="margin-top: 8px;"><strong>Cible :</strong> ${targetAudience} · <strong>Musique :</strong> ${musicMood}</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([videoHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spot_video_${aspectRatio.replace(':', 'x')}_documind.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    success('Téléchargement du spot publicitaire', `Fichier ${link.download} téléchargé.`);
  };

  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSeconds, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1F] p-5 sm:p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E65B7D] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E65B7D]" />
            <span>Domaine Vidéo & Médias</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5]">
            Studio Vidéo Publicitaire & Storyboard
          </h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Pipeline en 6 étapes : De la source documentaire au script, storyboard et rendu final.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA] tabular-nums px-3 py-1.5 bg-[#F8FAFD] dark:bg-[#26262D] rounded-xl border border-[#DCE3EC] dark:border-[#303038]">
            Durée totale : {totalDuration}s · {scenes.length} scènes
          </span>
        </div>
      </div>

      {/* 6-Step Stepper Header */}
      <div className="bg-white dark:bg-[#1A1A1F] p-2 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] flex items-center justify-between overflow-x-auto gap-1.5">
        {[
          { step: 1, label: '1. Source' },
          { step: 2, label: '2. Analyse' },
          { step: 3, label: '3. Script' },
          { step: 4, label: '4. Storyboard' },
          { step: 5, label: '5. Config' },
          { step: 6, label: '6. Production' }
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentStep === s.step
                ? 'bg-gradient-to-r from-[#E65B7D] to-[#C2405F] text-white shadow-sm shadow-[#E65B7D]/25 font-bold'
                : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#26262D]'
            }`}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Contents */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Étape 1 — Sélection de la Source Documentaire ou Commerciale
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Choisissez la documentation ou proposition de valeur qui servira de fondement au spot publicitaire.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 border-2 border-neutral-900 dark:border-white rounded-xl bg-neutral-50 dark:bg-neutral-800 cursor-pointer">
              <Film className="w-5 h-5 mb-2 text-neutral-900 dark:text-white" />
              <div className="font-bold text-xs">Fiche Produit DocuMind AI</div>
              <div className="text-[11px] text-neutral-500 mt-1">Plateforme multimodale pour professionnels</div>
            </div>

            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <Film className="w-5 h-5 mb-2 text-neutral-400" />
              <div className="font-bold text-xs">Cahier des charges refonte</div>
              <div className="text-[11px] text-neutral-500 mt-1">Spécifications fonctionnelles portail</div>
            </div>

            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <Film className="w-5 h-5 mb-2 text-neutral-400" />
              <div className="font-bold text-xs">Texte d'instruction libre</div>
              <div className="text-[11px] text-neutral-500 mt-1">Rédiger un brief personnalisé</div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Passer à l'analyse sémantique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Étape 2 — Analyse de l'Audience & Proposition de Valeur
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Public Cible
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tonalité de la Voix Off
              </label>
              <input
                type="text"
                value={voiceStyle}
                onChange={(e) => setVoiceStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Valider & Générer le Script</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Étape 3 — Script Publicitaire en 4 Temps
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                1. Accroche (Hook)
              </label>
              <input
                type="text"
                value={scriptHook}
                onChange={(e) => setScriptHook(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                2. Problématique & Douleur Métier
              </label>
              <input
                type="text"
                value={scriptProblem}
                onChange={(e) => setScriptProblem(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                3. Solution DocuMind AI
              </label>
              <input
                type="text"
                value={scriptSolution}
                onChange={(e) => setScriptSolution(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                4. Appel à l'action (CTA)
              </label>
              <input
                type="text"
                value={scriptCta}
                onChange={(e) => setScriptCta(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Passer au Storyboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Étape 4 — Storyboard Scène par Scène
            </h2>
            <button
              onClick={handleAddScene}
              className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une scène</span>
            </button>
          </div>

          <div className="space-y-4">
            {scenes.map((sc, i) => (
              <div
                key={sc.id}
                className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-neutral-400">Scène {i + 1}</span>
                    <span>·</span>
                    <span>{sc.headline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400">{sc.durationSeconds}s</span>
                    {scenes.length > 1 && (
                      <button
                        onClick={() => handleDeleteScene(i)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">Voix Off / Narration</span>
                    <p className="mt-0.5 text-neutral-700 dark:text-neutral-300 italic">« {sc.narrationVoiceover} »</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">Description Visuelle</span>
                    <p className="mt-0.5 text-neutral-700 dark:text-neutral-300">{sc.visualDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Configurer le format vidéo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Étape 5 — Format & Configuration de Production
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setAspectRatio('16:9')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aspectRatio === '16:9'
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 font-semibold'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <div className="font-bold text-xs">Paysage 16:9</div>
              <div className="text-[11px] text-neutral-500 mt-1">Idéal pour YouTube, Landing Pages & Webinaires</div>
            </div>

            <div
              onClick={() => setAspectRatio('9:16')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aspectRatio === '9:16'
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 font-semibold'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <div className="font-bold text-xs">Vertical 9:16</div>
              <div className="text-[11px] text-neutral-500 mt-1">Idéal pour TikTok, Instagram Reels & Shorts</div>
            </div>

            <div
              onClick={() => setAspectRatio('1:1')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aspectRatio === '1:1'
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 font-semibold'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <div className="font-bold text-xs">Carré 1:1</div>
              <div className="text-[11px] text-neutral-500 mt-1">Optimisé pour le feed LinkedIn et Twitter/X</div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={handleLaunchProduction}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lancer le Rendu & Production</span>
            </button>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center mx-auto">
            {renderingProgress === 100 ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : (
              <Film className="w-8 h-8 animate-spin" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {renderingProgress === 100 ? 'Spot Vidéo Finalisé et Prêt !' : 'Génération & Rendu Vidéo en Cours...'}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {renderingProgress === 100
                ? `Vidéo ${aspectRatio} générée avec succès (${totalDuration}s).`
                : 'Assemblage des scènes, synchronisation vocale TTS et incrustation des sous-titres...'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${renderingProgress}%` }}
            />
          </div>

          <div className="text-xs font-mono tabular-nums text-neutral-400">
            {renderingProgress}% complété
          </div>

          {renderingProgress === 100 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadVideoPackage}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#E65B7D] to-[#C2405F] hover:opacity-95 rounded-xl shadow-sm shadow-[#E65B7D]/25 flex items-center gap-1.5 transition-all active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger la Vidéo (.HTML / MP4)</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                Ajuster le storyboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
