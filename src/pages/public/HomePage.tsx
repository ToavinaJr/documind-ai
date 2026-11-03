import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Mic,
  Video,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
  FileCheck,
  ShieldCheck,
  Clock,
  Zap,
  Play,
  Presentation,
  ScanText
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive source demo state
  const [activeSource, setActiveSource] = useState<'audio' | 'invoice' | 'contract' | 'ad'>('audio');

  const sourceShowcases = {
    audio: {
      sourceLabel: 'Audio de Réunion (Codir Stratégique, 42 min)',
      icon: Mic,
      color: '#3986A8',
      domain: 'Audio & Voix',
      deliverables: [
        { title: 'Compte Rendu & Procès-Verbal', desc: 'Transcription intégrale avec diarisation des 3 intervenants et horodatages précis' },
        { title: 'Synthèse Exécutive Décisionnelle', desc: 'Validation de l’enveloppe de 180 000 € HT et jalons prioritaires Q4' },
        { title: 'Plan d’Action & Tableau des Tâches', desc: 'Attribution automatique avec responsables et dates d’échéance' },
        { title: 'Présentation PowerPoint (3 slides)', desc: 'Diapositives exécutives générées et prêtes pour le conseil d’administration' },
        { title: 'Email de Suivi Équipe', desc: 'Synthèse claire prête à être diffusée aux directeurs de pôles' }
      ]
    },
    invoice: {
      sourceLabel: 'Facture Fournisseur (CloudInfra SAS, 14 940,00 € TTC)',
      icon: FileText,
      color: '#DE1F4F',
      domain: 'Documents & OCR',
      deliverables: [
        { title: 'Extraction Tabulaire Structurée', desc: 'Détection du numéro, montants HT/TTC, taux de TVA 20% et IBAN avec certitude 99%' },
        { title: 'Détection Proactive d’Anomalies', desc: 'Alerte budgétaire : dépassement de +12% par rapport au devis initial' },
        { title: 'Écriture Comptable Exportable', desc: 'Fichier CSV normalisé prêt pour SAP, Sage ou Cegid' },
        { title: 'Rapprochement Bon de Commande', desc: 'Vérification automatique des lignes de prestation livrées' }
      ]
    },
    contract: {
      sourceLabel: 'Contrat Cadre Technologique (18 pages)',
      icon: FileCheck,
      color: '#3986A8',
      domain: 'Génération & Juridique',
      deliverables: [
        { title: 'Revue des Clauses à Risque', desc: 'Identification immédiate des pénalités de retard (1.5% / jour) et non-concurrence (24 mois)' },
        { title: 'Fiche Synthétique d’Engagements', desc: 'Matrice des obligations juridiques et dates d’échéance du partenariat' },
        { title: 'Résumé Exécutif pour Décideurs', desc: 'Note de 2 pages résumant les conditions commerciales négociées' }
      ]
    },
    ad: {
      sourceLabel: 'Fiche Produit / Proposition Commerciale',
      icon: Video,
      color: '#E65B7D',
      domain: 'Création & Média',
      deliverables: [
        { title: 'Script Vidéo Rythmé (4 étapes)', desc: 'Accroche, mise en lumière du problème, démonstration de la solution et appel à l’action' },
        { title: 'Storyboard Scène par Scène', desc: 'Durée, texte à l’écran, narration voix off et indications de mouvements caméra' },
        { title: 'Vidéo Publicitaire Produite', desc: 'Rendu 16:9 haute résolution avec sous-titres synchronisés' }
      ]
    }
  };

  const current = sourceShowcases[activeSource];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 border-b border-[#DCE3EC] dark:border-[#303038] bg-[#FFFFFF] dark:bg-[#0F0F13] transition-colors relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#DE1F4F]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#DE1F4F] dark:text-[#F04470] mb-6 bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 px-3 py-1.5 rounded-full border border-[#DE1F4F]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DocuMind AI 2026</span>
            <span aria-hidden="true">·</span>
            <span>Intelligence multimodale & automatisation documentaire</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F2F2F5] leading-[1.15] text-balance">
            Une seule source.{' '}
            <span className="bg-gradient-to-r from-[#DE1F4F] via-[#3986A8] to-[#3986A8] bg-clip-text text-transparent">
              Une infinité
            </span>{' '}
            de livrables professionnels.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#64748B] dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed text-balance">
            Importez vos documents, audios de réunion, vidéos ou contrats. DocuMind extrait, analyse et génère instantanément vos comptes rendus, présentations, synthèses et vidéos publicitaires.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/workspace/dashboard')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-md shadow-[#DE1F4F]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Démarrer l'essai gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] rounded-xl border border-[#DCE3EC] dark:border-[#303038] transition-colors"
            >
              Consulter la tarification
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-[#64748B] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20A477]" />
              Mode Démonstration complet préchargé
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20A477]" />
              Isolation multi-tenant stricte
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20A477]" />
              Architecture modulaire NestJS Ready
            </span>
          </div>
        </div>
      </section>

      {/* Quantitative KPI Strip with Domain Colors */}
      <section className="py-8 bg-[#F5F8FC] dark:bg-[#09090B] border-b border-[#DCE3EC] dark:border-[#303038]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038]">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#DE1F4F] dark:text-[#F04470] tabular-nums font-mono">
              +70%
            </div>
            <div className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">Temps économisé sur la revue documentaire</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038]">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#3986A8] tabular-nums font-mono">
              98.9%
            </div>
            <div className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">Précision d’extraction OCR tabulaire</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038]">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#E65B7D] tabular-nums font-mono">
              3.2s
            </div>
            <div className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">Latence moyenne de structuration</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038]">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#20A477] tabular-nums font-mono">
              800+
            </div>
            <div className="mt-1 text-xs text-[#64748B] dark:text-[#A1A1AA]">Organisations équipées en Europe</div>
          </div>
        </div>
      </section>

      {/* Interactive Fundamental Principle: 1 Source -> N Deliverables */}
      <section className="py-20 px-6 bg-[#FFFFFF] dark:bg-[#0F0F13] border-b border-[#DCE3EC] dark:border-[#303038]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F2F2F5]">
              Le principe fondamental de DocuMind AI
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA]">
              Les résultats générés restent systématiquement reliés à leur source d’origine, avec une traçabilité intégrale vers les horodatages et les passages du document.
            </p>
          </div>

          {/* Interactive Source Selector Tabs with Domain-Colored Pills */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-[#EEF2F7] dark:bg-[#26262D] rounded-xl border border-[#DCE3EC] dark:border-[#303038] gap-1">
              <button
                onClick={() => setActiveSource('audio')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeSource === 'audio'
                    ? 'bg-white dark:bg-[#1A1A1F] text-[#3986A8] shadow-sm shadow-[#3986A8]/20 font-bold'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" style={{ color: activeSource === 'audio' ? '#3986A8' : undefined }} />
                <span>Audio de Réunion</span>
              </button>
              <button
                onClick={() => setActiveSource('invoice')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeSource === 'invoice'
                    ? 'bg-white dark:bg-[#1A1A1F] text-[#DE1F4F] shadow-sm shadow-[#DE1F4F]/20 font-bold'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" style={{ color: activeSource === 'invoice' ? '#DE1F4F' : undefined }} />
                <span>Facture Fournisseur</span>
              </button>
              <button
                onClick={() => setActiveSource('contract')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeSource === 'contract'
                    ? 'bg-white dark:bg-[#1A1A1F] text-[#3986A8] shadow-sm shadow-[#3986A8]/20 font-bold'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" style={{ color: activeSource === 'contract' ? '#3986A8' : undefined }} />
                <span>Contrat Juridique</span>
              </button>
              <button
                onClick={() => setActiveSource('ad')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeSource === 'ad'
                    ? 'bg-white dark:bg-[#1A1A1F] text-[#E65B7D] shadow-sm shadow-[#E65B7D]/20 font-bold'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" style={{ color: activeSource === 'ad' ? '#E65B7D' : undefined }} />
                <span>Vidéo Publicitaire</span>
              </button>
            </div>
          </div>

          {/* Source to Deliverables Interactive Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Input Column */}
            <div className="bg-[#F8FAFD] dark:bg-[#1A1A1F] p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] mb-3">
                  <span>Fichier Source</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ backgroundColor: `${current.color}15`, color: current.color }}>
                    {current.domain}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${current.color}20`, color: current.color }}
                  >
                    <current.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#0F172A] dark:text-[#F2F2F5]">{current.sourceLabel}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5">Prêt pour analyse & structuration</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#DCE3EC] dark:border-[#303038] text-xs text-[#64748B] dark:text-[#A1A1AA]">
                Statut : <span className="text-[#20A477] font-semibold">Source indexée</span>
              </div>
            </div>

            {/* Deliverables Column */}
            <div className="md:col-span-2 bg-[#F8FAFD] dark:bg-[#1A1A1F] p-6 rounded-2xl border border-[#DCE3EC] dark:border-[#303038] flex flex-col">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] mb-3 flex items-center justify-between">
                <span>Livrables générés simultanément ({current.deliverables.length})</span>
                <span className="text-[10px] text-[#20A477] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Traçabilité 100% active
                </span>
              </div>
              <div className="space-y-2.5 flex-1">
                {current.deliverables.map((del, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-[#0F0F13] rounded-xl border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F]/40 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: `${current.color}15`, color: current.color }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0F172A] dark:text-[#F2F2F5]">{del.title}</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mt-0.5 leading-relaxed">{del.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Overview */}
      <section className="py-20 px-6 bg-[#F5F8FC] dark:bg-[#09090B]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F2F2F5]">
              Une plateforme modulaire conçue pour les équipes exigeantes
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA]">
              Trois piliers complémentaires pour couvrir l’ensemble de vos flux documentaires et créatifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Intelligence */}
            <div className="p-6 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#FCE8EE] dark:bg-[#DE1F4F]/15 text-[#DE1F4F] flex items-center justify-center mb-4">
                <ScanText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F2F2F5]">Intelligence & Ingestion</h3>
              <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
                Extraction OCR haute précision de PDF, images, audios et vidéos avec détection automatique des anomalies et réconciliation budgétaire.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#0F172A] dark:text-[#F2F2F5]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#DE1F4F]" />
                  <span>Diarisation vocale multi-locuteurs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#DE1F4F]" />
                  <span>Tableaux structurés & détection TVA</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Creation */}
            <div className="p-6 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#FDEBF0] dark:bg-[#E65B7D]/15 text-[#E65B7D] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F2F2F5]">Création & Multimodalité</h3>
              <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
                Génération assistée de présentations, documents de synthèse, emails de suivi et studio vidéo publicitaire en 6 étapes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#0F172A] dark:text-[#F2F2F5]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E65B7D]" />
                  <span>Studio vidéo publicitaire avec storyboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E65B7D]" />
                  <span>Diaporamas professionnels synchronisés</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3: Automation */}
            <div className="p-6 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DCE3EC] dark:border-[#303038] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#E6F1F6] dark:bg-[#3986A8]/15 text-[#3986A8] flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F2F2F5]">Workflows & Orchestration</h3>
              <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
                Constructeur de flux visuel avec nœuds modulaires, validation humaine en cas de doute et exports vers vos ERP & API.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#0F172A] dark:text-[#F2F2F5]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3986A8]" />
                  <span>Éditeur de flux par glisser-déposer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3986A8]" />
                  <span>Connecteurs ERP normalisés</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
