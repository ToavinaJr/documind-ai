import {
  User,
  Organization,
  SubscriptionPlan,
  Subscription,
  OrganizationUsage,
  DocumentEntity,
  AudioEntity,
  VideoEntity,
  GeneratedDocument,
  PresentationEntity,
  AdVideoEntity,
  ContentSnippet,
  WorkflowEntity,
  SupportTicket,
  AuditLogItem,
  Invoice,
  Project,
  FeatureFlag,
  PlatformSettings,
  CustomRole
} from '../types';

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Pour découvrir la plateforme et tester les capacités multimodales.',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '500 Mo de stockage sécurisé',
      '20 documents traités par mois',
      '50 pages OCR standard',
      '15 min de transcription audio',
      'Génération documentaire basique',
      '1 utilisateur',
      'Support communautaire'
    ],
    limits: {
      storageGb: 0.5,
      documentsPerMonth: 20,
      ocrPagesPerMonth: 50,
      audioMinutesPerMonth: 15,
      videoMinutesPerMonth: 0,
      docGenerationsPerMonth: 10,
      presentationsPerMonth: 2,
      videoGenerationsMinutesPerMonth: 0,
      activeWorkflows: 1,
      workflowExecutionsPerMonth: 25,
      maxMembers: 1,
      historyDays: 7
    },
    active: true
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Pour les professionnels indépendants et petites équipes en croissance.',
    priceMonthly: 29,
    priceAnnual: 290,
    features: [
      '10 Go de stockage cloud',
      '100 documents / mois',
      '300 pages OCR haute précision',
      '90 min de transcription audio',
      '15 min d’analyse vidéo',
      '50 générations documentaires',
      '10 présentations professionnelles',
      'Jusqu’à 3 membres d’équipe',
      'Support par email sous 24h'
    ],
    limits: {
      storageGb: 10,
      documentsPerMonth: 100,
      ocrPagesPerMonth: 300,
      audioMinutesPerMonth: 90,
      videoMinutesPerMonth: 15,
      docGenerationsPerMonth: 50,
      presentationsPerMonth: 10,
      videoGenerationsMinutesPerMonth: 2,
      activeWorkflows: 3,
      workflowExecutionsPerMonth: 150,
      maxMembers: 3,
      historyDays: 30
    },
    active: true
  },
  {
    id: 'pro',
    name: 'Professional',
    tagline: 'Pour les entreprises recherchant puissance, vitesse et workflows complets.',
    priceMonthly: 89,
    priceAnnual: 890,
    isPopular: true,
    features: [
      '50 Go de stockage haute performance',
      '500 documents / mois',
      '1 500 pages OCR & extraction tabulaire',
      '300 min de transcription & diarisation',
      '60 min d’analyse vidéo sémantique',
      '200 générations documentaires',
      '40 présentations PPTX / PDF',
      '5 min de génération vidéo publicitaire',
      'Workflows automatisés illimités (10 actifs)',
      'Jusqu’à 10 collaborateurs',
      'Rôles personnalisés & RBAC complet',
      'Support prioritaire & SLA 4h'
    ],
    limits: {
      storageGb: 50,
      documentsPerMonth: 500,
      ocrPagesPerMonth: 1500,
      audioMinutesPerMonth: 300,
      videoMinutesPerMonth: 60,
      docGenerationsPerMonth: 200,
      presentationsPerMonth: 40,
      videoGenerationsMinutesPerMonth: 5,
      activeWorkflows: 10,
      workflowExecutionsPerMonth: 1000,
      maxMembers: 10,
      historyDays: 90
    },
    active: true
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Pour les organisations à fort volume nécessitant une gouvernance stricte.',
    priceMonthly: 249,
    priceAnnual: 2490,
    features: [
      '250 Go de stockage certifié',
      '2 500 documents / mois',
      '8 000 pages OCR structurées',
      '1 200 min de transcription & synthèse',
      '240 min d’analyse vidéo',
      '1 000 générations documentaires',
      '150 présentations exécutives',
      '20 min de vidéo publicitaire par mois',
      'Workflows avancés avec validation humaine',
      'Jusqu’à 30 collaborateurs',
      'Journal d’audit immuable & conformité RGPD',
      'Support dédié avec Account Manager'
    ],
    limits: {
      storageGb: 250,
      documentsPerMonth: 2500,
      ocrPagesPerMonth: 8000,
      audioMinutesPerMonth: 1200,
      videoMinutesPerMonth: 240,
      docGenerationsPerMonth: 1000,
      presentationsPerMonth: 150,
      videoGenerationsMinutesPerMonth: 20,
      activeWorkflows: 30,
      workflowExecutionsPerMonth: 5000,
      maxMembers: 30,
      historyDays: 365
    },
    active: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Pour les grands comptes avec intégrations sur-mesure, SSO et cloud dédié.',
    priceMonthly: 799,
    priceAnnual: 7990,
    features: [
      'Stockage sur-mesure (1 To+)',
      'Volumes documentaires illimités',
      'Modèles OCR sur-mesure entraînés',
      'Transcription & synthèse temps réel',
      'Génération vidéo illimitée en haute résolution',
      'Workflows d’entreprise & connecteurs ERP/CRM',
      'Membres illimités avec SSO SAML / Okta',
      'Hébergement dédié souverain en UE',
      'Support 24/7 avec ingénieur dédié'
    ],
    limits: {
      storageGb: 1000,
      documentsPerMonth: 10000,
      ocrPagesPerMonth: 30000,
      audioMinutesPerMonth: 5000,
      videoMinutesPerMonth: 1000,
      docGenerationsPerMonth: 5000,
      presentationsPerMonth: 500,
      videoGenerationsMinutesPerMonth: 60,
      activeWorkflows: 100,
      workflowExecutionsPerMonth: 25000,
      maxMembers: 100,
      historyDays: 1000
    },
    active: true
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-acme',
    name: 'Acme Innovation Corp',
    slug: 'acme-corp',
    domain: 'acme-corp.com',
    description: 'Société de conseil en ingénierie et transformation digitale.',
    country: 'France',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    ownerId: 'user-sarah',
    status: 'active',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'org-beta',
    name: 'Beta Health SAS',
    slug: 'beta-health',
    domain: 'betahealth.fr',
    description: 'Réseau de cliniques et centres de recherche biomédicale.',
    country: 'France',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    ownerId: 'user-sophie',
    status: 'active',
    createdAt: '2026-02-01T14:30:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-sarah',
    email: 'demo@documind.ai',
    password: 'Demo@DocuMind2026!',
    firstName: 'Sarah',
    lastName: 'Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-acme', role: 'ORG_OWNER', joinedAt: '2026-01-15T09:00:00Z' }
    ],
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-david',
    email: 'david.miller@acme-corp.com',
    password: 'Demo@DocuMind2026!',
    firstName: 'David',
    lastName: 'Miller',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-acme', role: 'MANAGER', joinedAt: '2026-01-20T10:00:00Z' }
    ],
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'user-julien',
    email: 'julien.moreau@acme-corp.com',
    password: 'Demo@DocuMind2026!',
    firstName: 'Julien',
    lastName: 'Moreau',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-acme', role: 'EDITOR', joinedAt: '2026-01-25T11:00:00Z' }
    ],
    createdAt: '2026-01-25T11:00:00Z'
  },
  {
    id: 'user-elena',
    email: 'elena.rostova@acme-corp.com',
    password: 'Demo@DocuMind2026!',
    firstName: 'Elena',
    lastName: 'Rostova',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-acme', role: 'VIEWER', joinedAt: '2026-02-05T14:00:00Z' }
    ],
    createdAt: '2026-02-05T14:00:00Z'
  },
  {
    id: 'user-marcus',
    email: 'marcus.vance@acme-corp.com',
    password: 'Demo@DocuMind2026!',
    firstName: 'Marcus',
    lastName: 'Vance',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-acme', role: 'BILLING_MANAGER', joinedAt: '2026-02-10T16:00:00Z' }
    ],
    createdAt: '2026-02-10T16:00:00Z'
  },
  {
    id: 'user-sophie',
    email: 'sophie@betahealth.fr',
    password: 'Demo@DocuMind2026!',
    firstName: 'Dr. Sophie',
    lastName: 'Laurent',
    isPlatformAdmin: false,
    organizationMemberships: [
      { organizationId: 'org-beta', role: 'ORG_OWNER', joinedAt: '2026-02-01T14:30:00Z' }
    ],
    createdAt: '2026-02-01T14:30:00Z'
  },
  {
    id: 'user-admin',
    email: 'admin@documind.ai',
    password: 'Demo@DocuMind2026!',
    firstName: 'Alexandre',
    lastName: 'Dubois',
    isPlatformAdmin: true,
    platformRole: 'PLATFORM_OWNER',
    organizationMemberships: [],
    createdAt: '2025-11-01T08:00:00Z'
  }
];

export const INITIAL_SUBSCRIPTIONS: Record<string, Subscription> = {
  'org-acme': {
    id: 'sub-acme-1',
    organizationId: 'org-acme',
    planId: 'pro',
    status: 'active',
    billingInterval: 'annual',
    currentPeriodStart: '2026-01-15T09:00:00Z',
    currentPeriodEnd: '2027-01-15T09:00:00Z',
    cancelAtPeriodEnd: false
  },
  'org-beta': {
    id: 'sub-beta-1',
    organizationId: 'org-beta',
    planId: 'starter',
    status: 'active',
    billingInterval: 'monthly',
    currentPeriodStart: '2026-02-01T14:30:00Z',
    currentPeriodEnd: '2026-03-01T14:30:00Z',
    cancelAtPeriodEnd: false
  }
};

export const INITIAL_USAGES: Record<string, OrganizationUsage> = {
  'org-acme': {
    storageUsedBytes: 18450000000, // ~18.45 Go of 50 Go (36.9%)
    documentsCount: 182, // of 500 (36.4%)
    ocrPagesCount: 620, // of 1500 (41.3%)
    audioMinutesUsed: 145, // of 300 (48.3%)
    videoMinutesUsed: 22, // of 60 (36.6%)
    docGenerationsCount: 88, // of 200 (44%)
    presentationsCount: 14, // of 40 (35%)
    videoGenerationsMinutes: 2.5, // of 5 (50%)
    activeWorkflowsCount: 4, // of 10 (40%)
    workflowExecutionsCount: 380, // of 1000 (38%)
    membersCount: 5, // of 10
    historyDaysRetained: 30
  },
  'org-beta': {
    storageUsedBytes: 2100000000, // 2.1 Go of 10 Go
    documentsCount: 42,
    ocrPagesCount: 120,
    audioMinutesUsed: 30,
    videoMinutesUsed: 5,
    docGenerationsCount: 18,
    presentationsCount: 3,
    videoGenerationsMinutes: 0.8,
    activeWorkflowsCount: 1,
    workflowExecutionsCount: 35,
    membersCount: 1,
    historyDaysRetained: 14
  }
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV-2026-0089',
    organizationId: 'org-acme',
    date: '2026-01-15',
    dueDate: '2026-01-15',
    period: '15 janv. 2026 - 14 janv. 2027',
    planName: 'Professional (Annuel)',
    amountHt: 890,
    taxRate: 20,
    amountTtc: 1068,
    currency: 'EUR',
    status: 'paid'
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'INV-2026-0042',
    organizationId: 'org-beta',
    date: '2026-02-01',
    dueDate: '2026-02-01',
    period: '01 févr. 2026 - 28 févr. 2026',
    planName: 'Starter (Mensuel)',
    amountHt: 29,
    taxRate: 20,
    amountTtc: 34.8,
    currency: 'EUR',
    status: 'paid'
  }
];

export const INITIAL_DOCUMENTS: DocumentEntity[] = [
  {
    id: 'doc-001',
    organizationId: 'org-acme',
    workspaceId: 'ws-main',
    title: 'Facture_Fournisseur_CloudInfra_Sept2026.pdf',
    originalFileName: 'Facture_CloudInfra_Q3.pdf',
    fileSize: 1420000,
    mimeType: 'application/pdf',
    format: 'PDF',
    tags: ['Finance', 'Fournisseurs', 'Cloud', 'Validation-Requise'],
    status: 'processed',
    pageCount: 3,
    ocrConfidence: 0.984,
    extractedText: 'FACTURE N° FC-2026-8841\nSociété Émettrice: CloudInfra Solutions SAS\nClient: Acme Innovation Corp\nDate de facturation: 28/09/2026\nMontant Total HT: 12 450,00 €\nTVA (20%): 2 490,00 €\nMontant Total TTC: 14 940,00 €\nConditions de règlement: Virement bancaire sous 30 jours net.',
    extractedFields: {
      invoiceNumber: { value: 'FC-2026-8841', confidence: 0.99, verified: true },
      vendorName: { value: 'CloudInfra Solutions SAS', confidence: 0.98, verified: true },
      clientName: { value: 'Acme Innovation Corp', confidence: 0.99, verified: true },
      invoiceDate: { value: '2026-09-28', confidence: 0.97, verified: true },
      amountHt: { value: 12450.0, confidence: 0.99, verified: true },
      amountTtc: { value: 14940.0, confidence: 0.99, verified: true },
      currency: { value: 'EUR', confidence: 1.0, verified: true }
    },
    anomalies: ['Plafond budgétaire mensuel dépassé de +12% par rapport au devis initial'],
    createdAt: '2026-10-01T10:15:00Z',
    updatedAt: '2026-10-01T10:20:00Z'
  },
  {
    id: 'doc-002',
    organizationId: 'org-acme',
    workspaceId: 'ws-main',
    title: 'Contrat_Cadre_Prestations_Technologiques_2026.pdf',
    originalFileName: 'Contrat_Cadre_Acme_Prestataire.pdf',
    fileSize: 4890000,
    mimeType: 'application/pdf',
    format: 'PDF',
    tags: ['Juridique', 'Contrats', 'Partenariats'],
    status: 'processed',
    pageCount: 18,
    ocrConfidence: 0.976,
    extractedText: 'CONTRAT CADRE DE PRESTATION DE SERVICES TECHNOLOGIQUES\nEntre les soussignés:\n1. Acme Innovation Corp, représentée par Sarah Connor, CEO\n2. Nexus Digital Consulting, représentée par Marc Delaunay, Directeur Général\nArticle 7 - Pénalités de retard: Tout retard de livraison non imputable au client entraînera une pénalité forfaitaire de 1,5% par jour de retard calendaire plafonnée à 20% du montant du bon de commande.\nArticle 12 - Clause de non-concurrence: 24 mois sur le territoire européen.',
    extractedFields: {
      contractType: { value: 'Contrat cadre de prestation', confidence: 0.96, verified: true },
      partyA: { value: 'Acme Innovation Corp', confidence: 0.98, verified: true },
      partyB: { value: 'Nexus Digital Consulting', confidence: 0.97, verified: true },
      effectiveDate: { value: '2026-06-01', confidence: 0.95, verified: true },
      durationMonths: { value: 36, confidence: 0.94, verified: true },
      penaltyRate: { value: '1.5% / jour (plafond 20%)', confidence: 0.92, verified: true }
    },
    anomalies: ['Clause de non-concurrence stricte de 24 mois nécessite revue juridique renforcée'],
    createdAt: '2026-09-15T14:30:00Z',
    updatedAt: '2026-09-15T15:00:00Z'
  },
  {
    id: 'doc-003',
    organizationId: 'org-acme',
    workspaceId: 'ws-main',
    title: 'Cahier_des_Charges_Refonte_Portail_Client.docx',
    originalFileName: 'CdC_Portail_Client_v3.docx',
    fileSize: 2200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'DOCX',
    tags: ['Produit', 'Spécifications', 'Agile'],
    status: 'processed',
    pageCount: 24,
    ocrConfidence: 0.992,
    extractedText: 'CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE — REFONTE PORTAIL CLIENT 2026\nObjectif: Offrir une expérience unifiée aux 15 000 utilisateurs B2B avec authentification SSO, portail de facturation en self-service et espace de ticketing synchronisé.\nExigences non négociables: Temps de chargement < 800ms, conformité WCAG 2.1 niveau AA, interopérabilité API REST.',
    extractedFields: {
      projectTitle: { value: 'Refonte Portail Client B2B', confidence: 0.99, verified: true },
      targetAudience: { value: '15 000 utilisateurs B2B', confidence: 0.95, verified: true },
      slaRequirement: { value: '< 800ms response time', confidence: 0.96, verified: true }
    },
    createdAt: '2026-10-10T08:45:00Z',
    updatedAt: '2026-10-10T08:50:00Z'
  },
  {
    id: 'doc-004',
    organizationId: 'org-beta',
    workspaceId: 'ws-beta-main',
    title: 'Rapport_Essai_Clinique_Phase2_Oncologie.pdf',
    originalFileName: 'Essai_Clinique_Phase2_BetaHealth.pdf',
    fileSize: 6100000,
    mimeType: 'application/pdf',
    format: 'PDF',
    tags: ['Santé', 'Essais-Cliniques', 'Recherche'],
    status: 'processed',
    pageCount: 32,
    ocrConfidence: 0.989,
    extractedText: 'PROTOCOLE BH-2026-ONCO-04 — RAPPORT D’ÉTAPE CLINIQUE PHASE IIa\nCohorte: 140 patients randomisés en double aveugle.\nTaux de réponse global: 68.4% versus 41.2% dans le groupe contrôle placebo.',
    extractedFields: {
      trialId: { value: 'BH-2026-ONCO-04', confidence: 0.99, verified: true },
      cohortSize: { value: 140, confidence: 0.98, verified: true },
      responseRate: { value: '68.4%', confidence: 0.97, verified: true }
    },
    createdAt: '2026-10-14T11:20:00Z',
    updatedAt: '2026-10-14T11:25:00Z'
  }
];

export const INITIAL_AUDIOS: AudioEntity[] = [
  {
    id: 'audio-001',
    organizationId: 'org-acme',
    title: 'Comité de Direction — Stratégie Q4 2026 & Expansion Internationale',
    fileName: 'Codir_Strategie_Q4_2026.mp3',
    durationSeconds: 2540, // 42 min 20 sec
    status: 'completed',
    speakers: [
      { id: 'spk-1', name: 'Sarah Connor (CEO)', color: 'blue' },
      { id: 'spk-2', name: 'David Miller (COO)', color: 'emerald' },
      { id: 'spk-3', name: 'Julien Moreau (CTO)', color: 'purple' }
    ],
    transcriptSegments: [
      {
        id: 'seg-1',
        speakerId: 'spk-1',
        startTime: 0,
        endTime: 18,
        text: 'Bonjour à tous. Merci d’être là pour ce comité stratégique de rentrée. Notre objectif prioritaire aujourd’hui est d’aligner les investissements sur le lancement européen de DocuMind AI et de valider le budget cloud associé.'
      },
      {
        id: 'seg-2',
        speakerId: 'spk-2',
        startTime: 19,
        endTime: 45,
        text: 'Sur le plan opérationnel, nous constatons une forte demande sur l’automatisation des factures et l’analyse des contrats complexes. Les clients souhaitent réduire de 70% le temps de validation juridique.'
      },
      {
        id: 'seg-3',
        speakerId: 'spk-3',
        startTime: 46,
        endTime: 82,
        text: 'Côté technique, le pipeline multimodal est opérationnel. Nous avons implémenté les quotas par palier et l’isolation stricte multi-tenant. La latence moyenne d’extraction d’un PDF de 20 pages est désormais descendue sous les 3,2 secondes.'
      },
      {
        id: 'seg-4',
        speakerId: 'spk-1',
        startTime: 83,
        endTime: 120,
        text: 'Excellente nouvelle. Je valide donc le déblocage du budget de 180 000 € pour l’infrastructure et le recrutement de deux ingénieurs DevOps supplémentaires avant le 15 novembre.'
      }
    ],
    summary:
      'Comité exécutif axé sur le déploiement commercial européen de DocuMind AI. Sarah Connor a validé une enveloppe budgétaire de 180 000 € pour la scalabilité technique et les recrutements DevOps. Accord unanime sur le positionnement documentaire à forte valeur ajoutée.',
    keyTopics: ['Budget infrastructure Cloud', 'Lancement commercial Europe', 'Automatisation juridique', 'Recrutements DevOps'],
    decisions: [
      'Validation du budget additionnel de 180 000 € pour l’infrastructure Q4',
      'Ouverture de 2 postes d’ingénieurs DevOps confirmés',
      'Priorisation du module d’analyse contractuelle pour les grands comptes'
    ],
    actionItems: [
      { task: 'Publier les offres d’emploi DevOps sur les plateformes cibles', assignee: 'David Miller', deadline: '2026-11-05', status: 'done' },
      { task: 'Finaliser le plan de reprise d’activité multi-région', assignee: 'Julien Moreau', deadline: '2026-11-15', status: 'todo' },
      { task: 'Transmettre le mémo de synthèse au conseil d’administration', assignee: 'Sarah Connor', deadline: '2026-11-08', status: 'todo' }
    ],
    risks: [
      'Tension sur le marché du recrutement d’ingénieurs cloud spécialisés',
      'Dépendance aux coûts de calcul GPU en cas d’accélération imprévue du volume'
    ],
    createdAt: '2026-10-20T14:00:00Z'
  }
];

export const INITIAL_VIDEOS: VideoEntity[] = [
  {
    id: 'video-001',
    organizationId: 'org-acme',
    title: 'Démo Produit & Guide d’Onboarding Client Entreprise',
    fileName: 'Onboarding_DocuMind_Entreprise_v2.mp4',
    durationSeconds: 480, // 8 min
    status: 'completed',
    chapters: [
      { title: '1. Introduction & Connexion Workspace', startTime: 0, endTime: 60, summary: 'Présentation de l’interface et gestion des espaces de travail.' },
      { title: '2. Import multimodal & Reconnaissance OCR', startTime: 61, endTime: 180, summary: 'Démonstration du glisser-déposer de factures et contrats.' },
      { title: '3. Générateur de livrables et workflows', startTime: 181, endTime: 360, summary: 'Création d’un workflow automatisé avec nœuds de validation.' },
      { title: '4. Gouvernance, Rôles & Export sécurisé', startTime: 361, endTime: 480, summary: 'Configuration des permissions RBAC et export PPTX/PDF.' }
    ],
    keyMoments: [
      { timestamp: 74, label: 'Extraction automatique de facture', insight: 'Détection en 1.8s avec 99% de certitude des montants HT/TTC' },
      { timestamp: 215, label: 'Génération instantanée de présentation', insight: 'Création d’un diaporama 10 slides à partir d’un audio de réunion' },
      { timestamp: 410, label: 'Paramétrage des limites de quotas', insight: 'Alerte proactive envoyée à 85% d’utilisation' }
    ],
    transcriptText: 'Bienvenue dans cette session d’accompagnement dédiée à la prise en main de DocuMind AI. Dans cette vidéo, nous allons parcourir ensemble les flux de travail les plus plébiscités par nos clients entreprises...',
    subtitlesGenerated: true,
    createdAt: '2026-10-18T09:30:00Z'
  }
];

export const INITIAL_GENERATED_DOCS: GeneratedDocument[] = [
  {
    id: 'gen-doc-001',
    organizationId: 'org-acme',
    title: 'Compte Rendu Exécutif — Codir Q4 2026',
    type: 'executive_summary',
    sourceType: 'audio',
    sourceId: 'audio-001',
    sourceTitle: 'Comité de Direction — Stratégie Q4 2026',
    content: `# COMPTE RENDU EXÉCUTIF DU COMITÉ DE DIRECTION
**Date de la séance** : 20 Octobre 2026  
**Participants** : Sarah Connor (CEO), David Miller (COO), Julien Moreau (CTO)  
**Réf. Source** : Audio Codir_Strategie_Q4_2026 (Horodatages vérifiés 00:00 - 42:20)

---

## 1. Synthèse Décisionnelle
Au terme de la séance, le comité de direction a validé à l'unanimité le plan d'expansion européen et le déblocage budgétaire associé de **180 000 € HT** affecté au quatrième trimestre 2026.

## 2. Décisions Fermes Adoptées
1. **Infrastructure Cloud** : Approbation des engagements de capacité pour absorber la hausse des traitements OCR et multimodaux.
2. **Ressources Humaines** : Ouverture immédiate de deux postes de profils DevOps seniors.
3. **Produit** : Accélération sur le module de vérification automatisée des clauses contractuelles pour les directions juridiques.

## 3. Plan d'Action & Calendrier
| Action | Responsable | Date limite | Statut |
| :--- | :--- | :--- | :--- |
| Publication des offres DevOps | David Miller | 05/11/2026 | Terminé |
| Mémo stratégique Conseil | Sarah Connor | 08/11/2026 | En cours |
| Validation PRA multi-région | Julien Moreau | 15/11/2026 | Planifié |

*Document certifié traçable généré par DocuMind AI.*`,
    version: 1,
    format: 'markdown',
    createdAt: '2026-10-20T15:10:00Z',
    updatedAt: '2026-10-20T15:10:00Z'
  }
];

export const INITIAL_PRESENTATIONS: PresentationEntity[] = [
  {
    id: 'pres-001',
    organizationId: 'org-acme',
    title: 'Présentation Stratégique Codir — Cap 2027',
    theme: 'executive',
    sourceTitle: 'Comité de Direction — Stratégie Q4 2026',
    slides: [
      {
        id: 'slide-1',
        slideNumber: 1,
        title: 'DocuMind AI : Cap 2027',
        kicker: 'Comité de Direction Stratégique',
        bullets: [
          'Validation du plan de passage à l’échelle européen',
          'Enveloppe budgétaire allouée : 180 000 € HT',
          'Alignement Produit, Opérations & Technologie'
        ],
        speakerNotes: 'Insister sur la cohérence entre les demandes clients et notre feuille de route technologique.'
      },
      {
        id: 'slide-2',
        slideNumber: 2,
        title: 'Indicateurs Clés & Adoption Marché',
        kicker: 'Performance Opérationnelle',
        bullets: [
          'Réduction mesurée de 70% du temps de revue juridique',
          'Latence d’extraction OCR moyenne < 3,2 secondes',
          'Taux de satisfaction utilisateur supérieur à 94%'
        ],
        speakerNotes: 'Rappeler que les retours clients soulignent la fiabilité des données tabulaires extraites.'
      },
      {
        id: 'slide-3',
        slideNumber: 3,
        title: 'Plan d’Action & Prochaines Échéances',
        kicker: 'Exécution Q4 2026',
        bullets: [
          '05 Nov. : Clôture des candidatures ingénieurs DevOps',
          '08 Nov. : Restitution formelle au Conseil d’Administration',
          '15 Nov. : Déploiement du cluster haute disponibilité'
        ],
        speakerNotes: 'Pointer la dépendance sur le calendrier de recrutement.'
      }
    ],
    createdAt: '2026-10-20T16:00:00Z'
  }
];

export const INITIAL_AD_VIDEOS: AdVideoEntity[] = [
  {
    id: 'adv-001',
    organizationId: 'org-acme',
    title: 'Spot Publicitaire B2B — Fini les corvées documentaires',
    targetAudience: 'Directeurs Administratifs & Financiers, Directeurs Juridiques',
    aspectRatio: '16:9',
    voiceStyle: 'Femme professionnelle, chaleureuse et persuasive',
    musicMood: 'Corporate acoustique moderne, crescendo inspirant',
    status: 'ready',
    progressPercent: 100,
    scriptHook: 'Vous passez encore vos soirées à ressaisir des factures et vérifier des clauses de contrat ?',
    scriptProblem: 'Chaque semaine, une équipe administrative perd plus de 14 heures sur des tâches sans valeur ajoutée.',
    scriptSolution: 'DocuMind AI transforme instantanément tout document, audio de réunion ou vidéo en livrables d’exception prêts à l’emploi.',
    scriptCta: 'Essayez gratuitement dès aujourd’hui et libérez le potentiel de votre équipe.',
    scenes: [
      {
        id: 'sc-1',
        sceneNumber: 1,
        durationSeconds: 4,
        headline: 'L’enfer des tâches manuelles',
        narrationVoiceover: 'Vous passez encore vos vendredis soirs à déchiffrer des factures papier et ressaisir des tableaux ?',
        visualDescription: 'Plan serré sur un bureau encombré de classeurs et d’écrans d’ordinateurs avec des tableurs infinis.',
        cameraMovement: 'Lent zoom avant dramatique',
        transition: 'Fondu noir rapide'
      },
      {
        id: 'sc-2',
        sceneNumber: 2,
        durationSeconds: 5,
        headline: 'DocuMind AI prend le relais',
        narrationVoiceover: 'Découvrez DocuMind AI : l’intelligence documentaire multimodale conçue pour les professionnels exigeants.',
        visualDescription: 'Transition lumineuse vers l’interface fluide et épurée de DocuMind AI, montrant un contrat glissé puis instantanément structuré.',
        cameraMovement: 'Travelling latéral fluide',
        transition: 'Balayage doux'
      },
      {
        id: 'sc-3',
        sceneNumber: 3,
        durationSeconds: 5,
        headline: '1 source. 10 livrables d’élite.',
        narrationVoiceover: 'D’un simple enregistrement audio, obtenez votre compte rendu, vos décisions, et votre présentation PowerPoint.',
        visualDescription: 'Arborescence graphique dynamique montrant une onde sonore se ramifiant en documents et graphiques.',
        cameraMovement: 'Recul dynamique',
        transition: 'Coupure nette'
      },
      {
        id: 'sc-4',
        sceneNumber: 4,
        durationSeconds: 4,
        headline: 'Passez à la vitesse supérieure',
        narrationVoiceover: 'Rejoignez plus de 800 entreprises européennes. Démarrez votre essai gratuit en 2 minutes.',
        visualDescription: 'Logo épuré DocuMind AI avec bouton d’action contrasté et mention des certifications de sécurité souveraines.',
        cameraMovement: 'Fixe avec reflet subtil',
        transition: 'Fondu final'
      }
    ],
    createdAt: '2026-10-22T11:00:00Z'
  }
];

export const INITIAL_CONTENT_SNIPPETS: ContentSnippet[] = [
  {
    id: 'cnt-001',
    organizationId: 'org-acme',
    title: 'Post LinkedIn — Rentrée et automatisation documentaire',
    channel: 'linkedin',
    tone: 'authoritative',
    content: `⚡️ 70% du temps passé sur les contrats est consacré à la recherche de clauses évidentes.

En 2026, obliger des juristes et directeurs financiers à faire de la saisie manuelle n'est plus seulement inefficace : c'est un risque stratégique majeur.

Chez Acme Innovation Corp, nous avons connecté nos flux à DocuMind AI. Résultat :
👉 Extraction tabulaire instantanée avec taux de confiance supérieur à 98%
👉 Diarisation des réunions de direction et plans d'action générés en 3 minutes
👉 Conformité et traçabilité de chaque chiffre vers sa page d'origine

Et vous, comment traitez-vous vos documents critiques cette année ?`,
    createdAt: '2026-10-21T08:30:00Z'
  }
];

export const INITIAL_WORKFLOWS: WorkflowEntity[] = [
  {
    id: 'wf-001',
    organizationId: 'org-acme',
    title: 'Pipeline Comptable & Contrôle Budgétaire',
    description: 'Ingestion de factures fournisseurs, extraction des montants, validation des anomalies et export structuré.',
    lastExecutedAt: '2026-10-22T17:45:00Z',
    executionCount: 24,
    nodes: [
      {
        id: 'node-1',
        type: 'input_document',
        title: 'Dépôt Facture PDF',
        description: 'Détection automatique des fichiers déposés dans le dossier Achats',
        x: 60,
        y: 140,
        config: { allowedFormats: ['PDF', 'PNG'], folder: 'Invoices' },
        status: 'success'
      },
      {
        id: 'node-2',
        type: 'ocr_extractor',
        title: 'OCR Haute Précision',
        description: 'Extraction vectorielle et reconnaissance des zones de texte',
        x: 320,
        y: 140,
        config: { engine: 'Tesseract_v5_Enhanced', language: 'fr+en' },
        status: 'success'
      },
      {
        id: 'node-3',
        type: 'structured_extract',
        title: 'Extraction Financière',
        description: 'Reconnaissance HT, TVA, TTC, IBAN et date d’échéance',
        x: 580,
        y: 140,
        config: { targetSchema: 'AccountingInvoiceV1', confidenceThreshold: 0.95 },
        status: 'success'
      },
      {
        id: 'node-4',
        type: 'human_validation',
        title: 'Contrôle Humain si Anomalie',
        description: 'Validation manuelle requise si le montant dépasse le budget',
        x: 840,
        y: 140,
        config: { assignRole: 'MANAGER', timeoutHours: 24 },
        status: 'idle'
      },
      {
        id: 'node-5',
        type: 'export_output',
        title: 'Export ERP & Notification',
        description: 'Génération du fichier comptable CSV et notification du responsable',
        x: 1100,
        y: 140,
        config: { exportFormat: 'CSV_SAP_COMPLIANT', notifyEmail: true },
        status: 'idle'
      }
    ],
    edges: [
      { id: 'edge-1-2', fromNodeId: 'node-1', toNodeId: 'node-2' },
      { id: 'edge-2-3', fromNodeId: 'node-2', toNodeId: 'node-3' },
      { id: 'edge-3-4', fromNodeId: 'node-3', toNodeId: 'node-4' },
      { id: 'edge-4-5', fromNodeId: 'node-4', toNodeId: 'node-5' }
    ],
    createdAt: '2026-09-10T11:00:00Z'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'TKT-2026-104',
    organizationId: 'org-acme',
    organizationName: 'Acme Innovation Corp',
    requesterEmail: 'david.miller@acme-corp.com',
    subject: 'Question sur l’ajustement des quotas de transcription audio',
    priority: 'normal',
    status: 'in_progress',
    category: 'quota_limit',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'David Miller',
        body: 'Bonjour l’équipe support, nous prévoyons un séminaire trimestriel avec environ 6 heures d’enregistrements la semaine prochaine. Est-il possible d’augmenter temporairement notre quota de transcription de 300 à 450 minutes ?',
        timestamp: '2026-10-22T10:15:00Z'
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Claire Valette (Support DocuMind)',
        body: 'Bonjour David, tout à fait ! Un administrateur plateforme peut appliquer un quota personnalisé d’extension temporaire directement sur votre organisation sans impacter votre abonnement annuel. Nous traitons cela dans la journée.',
        timestamp: '2026-10-22T11:30:00Z'
      }
    ],
    createdAt: '2026-10-22T10:15:00Z',
    updatedAt: '2026-10-22T11:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-001',
    organizationId: 'org-acme',
    organizationName: 'Acme Innovation Corp',
    actorEmail: 'demo@documind.ai',
    actorRole: 'ORG_OWNER',
    action: 'document.upload',
    resource: 'Facture_Fournisseur_CloudInfra_Sept2026.pdf',
    timestamp: '2026-10-01T10:15:00Z',
    status: 'success',
    ipAddress: '194.254.119.42',
    details: 'Téléversement fichier PDF (1.4 Mo), déclenchement pipeline OCR synchrone.'
  },
  {
    id: 'aud-002',
    organizationId: 'org-acme',
    organizationName: 'Acme Innovation Corp',
    actorEmail: 'demo@documind.ai',
    actorRole: 'ORG_OWNER',
    action: 'audio.transcribe',
    resource: 'Comité de Direction — Stratégie Q4 2026',
    timestamp: '2026-10-20T14:02:00Z',
    status: 'success',
    ipAddress: '194.254.119.42',
    details: 'Transcription audio terminée avec 3 locuteurs identifiés (diarisation complète).'
  },
  {
    id: 'aud-003',
    organizationId: 'org-acme',
    organizationName: 'Acme Innovation Corp',
    actorEmail: 'marcus.vance@acme-corp.com',
    actorRole: 'BILLING_MANAGER',
    action: 'billing.invoice.download',
    resource: 'INV-2026-0089',
    timestamp: '2026-10-21T09:12:00Z',
    status: 'success',
    ipAddress: '82.127.4.98',
    details: 'Téléchargement duplicata comptable facture Pro 890,00 € HT.'
  },
  {
    id: 'aud-004',
    actorEmail: 'admin@documind.ai',
    actorRole: 'PLATFORM_OWNER',
    action: 'plan.update',
    resource: 'SubscriptionPlan:pro',
    timestamp: '2026-10-22T08:00:00Z',
    status: 'success',
    ipAddress: '213.186.33.5',
    details: 'Mise à jour des plafonds de quotas OCR (1 500 pages) sur le plan Professional.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    organizationId: 'org-acme',
    title: 'Clôture Financière & Factures Fournisseurs Q3',
    description: 'Centralisation des factures Cloud, rapprochement des devis et exports comptables SAP.',
    documentCount: 14,
    lastActive: '2026-10-22',
    color: 'sky',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'prj-2',
    organizationId: 'org-acme',
    title: 'Comités Exécutifs & Direction Stratégique',
    description: 'Enregistrements audio des comités, transcriptions, procès-verbaux et présentations associées.',
    documentCount: 8,
    lastActive: '2026-10-20',
    color: 'purple',
    createdAt: '2026-09-01T14:00:00Z'
  },
  {
    id: 'prj-3',
    organizationId: 'org-acme',
    title: 'Revue Juridique des Contrats Cadres',
    description: 'Identification des pénalités de retard, obligations de conformité et audits des clauses.',
    documentCount: 6,
    lastActive: '2026-09-28',
    color: 'emerald',
    createdAt: '2026-09-10T09:00:00Z'
  },
  {
    id: 'prj-4',
    organizationId: 'org-beta',
    title: 'Protocoles Médicaux & Essais Cliniques Q4',
    description: 'Indexation des comptes rendus hospitaliers et conformité données de santé.',
    documentCount: 5,
    lastActive: '2026-10-18',
    color: 'emerald',
    createdAt: '2026-10-01T11:00:00Z'
  }
];

export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'document.ocr',
    name: 'Reconnaissance OCR & Extraction Tabulaire',
    description: 'Extraction vectorielle et reconnaissance des champs factures/contrats.',
    status: 'active',
    requiredPlan: 'free'
  },
  {
    id: 'audio.transcription',
    name: 'Transcription Multimodale & Diarisation',
    description: 'Identification des locuteurs et horodatage synchronisé.',
    status: 'active',
    requiredPlan: 'starter'
  },
  {
    id: 'video.generation',
    name: 'Génération Vidéo Publicitaire Scène par Scène',
    description: 'Studio de script et rendu publicitaire 16:9 / 9:16 / 1:1.',
    status: 'beta',
    requiredPlan: 'pro'
  },
  {
    id: 'workflow.builder',
    name: 'Workflow Builder & Nœuds d’Automatisation',
    description: 'Éditeur visuel de graphe avec validation humaine intégrée.',
    status: 'active',
    requiredPlan: 'pro'
  },
  {
    id: 'api.access',
    name: 'Accès API REST & Webhooks Externes',
    description: 'Connecteurs pour ERP SAP, Sage, Cegid et systèmes tiers.',
    status: 'active',
    requiredPlan: 'business'
  }
];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  allowSignups: true,
  maintenanceMode: false,
  enforceMfa: false,
  defaultPlan: 'pro',
  supportEmail: 'support@documind.ai',
  maxUploadSizeMb: 100
};

export const INITIAL_CUSTOM_ROLES: CustomRole[] = [
  {
    id: 'crole-auditor',
    organizationId: 'org-acme',
    name: 'Auditeur Financier',
    description: 'Accès restreint aux documents, factures et exports sans droits de modification',
    permissions: [
      'dashboard.read',
      'documents.read',
      'documents.download',
      'billing.read',
      'usage.read',
      'audit.read'
    ],
    createdAt: '2026-03-01T10:00:00Z'
  }
];
