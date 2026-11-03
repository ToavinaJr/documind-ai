import {
  DocumentEntity,
  AudioEntity,
  VideoEntity,
  GeneratedDocument,
  PresentationEntity,
  AdVideoEntity,
  ContentSnippet,
  WorkflowEntity,
  SubscriptionPlan,
  Subscription,
  Organization,
  User,
  Invoice,
  SupportTicket,
  AuditLogItem,
  ProcessingJob,
  QuotaOverride,
  OrganizationUsage,
  Project
} from '../types';
import { mockStorage } from '../mocks/storage';

export interface DocumentFilters {
  search?: string;
  format?: string;
  status?: string;
  tag?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 1. Document Repository Interface
export interface DocumentRepository {
  findAll(orgId: string, filters?: DocumentFilters): Promise<PaginatedResult<DocumentEntity>>;
  findById(orgId: string, id: string): Promise<DocumentEntity | null>;
  create(orgId: string, doc: Partial<DocumentEntity>): Promise<DocumentEntity>;
  update(orgId: string, id: string, patch: Partial<DocumentEntity>): Promise<DocumentEntity>;
  delete(orgId: string, id: string): Promise<void>;
  processOcr(orgId: string, id: string): Promise<DocumentEntity>;
}

// 2. Audio Repository Interface
export interface AudioRepository {
  findAll(orgId: string): Promise<AudioEntity[]>;
  findById(orgId: string, id: string): Promise<AudioEntity | null>;
  create(orgId: string, audio: Partial<AudioEntity>): Promise<AudioEntity>;
  transcribe(orgId: string, id: string): Promise<AudioEntity>;
  delete(orgId: string, id: string): Promise<void>;
}

// 3. Video Repository Interface
export interface VideoRepository {
  findAll(orgId: string): Promise<VideoEntity[]>;
  findById(orgId: string, id: string): Promise<VideoEntity | null>;
  create(orgId: string, video: Partial<VideoEntity>): Promise<VideoEntity>;
  analyze(orgId: string, id: string): Promise<VideoEntity>;
  delete(orgId: string, id: string): Promise<void>;
}

// 4. Generation Repository Interface
export interface GenerationRepository {
  findDocuments(orgId: string): Promise<GeneratedDocument[]>;
  createDocument(orgId: string, doc: Partial<GeneratedDocument>): Promise<GeneratedDocument>;
  updateDocument(orgId: string, id: string, patch: Partial<GeneratedDocument>): Promise<GeneratedDocument>;
  deleteDocument(orgId: string, id: string): Promise<void>;

  findPresentations(orgId: string): Promise<PresentationEntity[]>;
  createPresentation(orgId: string, pres: Partial<PresentationEntity>): Promise<PresentationEntity>;
  updatePresentation(orgId: string, id: string, patch: Partial<PresentationEntity>): Promise<PresentationEntity>;
  deletePresentation(orgId: string, id: string): Promise<void>;

  findAdVideos(orgId: string): Promise<AdVideoEntity[]>;
  createAdVideo(orgId: string, adVideo: Partial<AdVideoEntity>): Promise<AdVideoEntity>;
  updateAdVideo(orgId: string, id: string, patch: Partial<AdVideoEntity>): Promise<AdVideoEntity>;

  findContentSnippets(orgId: string): Promise<ContentSnippet[]>;
  createContentSnippet(orgId: string, snippet: Partial<ContentSnippet>): Promise<ContentSnippet>;
}

// 5. Workflow Repository Interface
export interface WorkflowRepository {
  findAll(orgId: string): Promise<WorkflowEntity[]>;
  findById(orgId: string, id: string): Promise<WorkflowEntity | null>;
  save(orgId: string, workflow: Partial<WorkflowEntity>): Promise<WorkflowEntity>;
  delete(orgId: string, id: string): Promise<void>;
  execute(orgId: string, id: string): Promise<{ success: boolean; executionId: string; logs: string[] }>;
}

// 6. Organization & Billing Repository Interface
export interface OrganizationRepository {
  findAll(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  update(id: string, patch: Partial<Organization>): Promise<Organization>;
  getMembers(orgId: string): Promise<User[]>;
  inviteMember(orgId: string, email: string, role: string): Promise<User>;
  removeMember(orgId: string, userId: string): Promise<void>;
  updateMemberRole(orgId: string, userId: string, newRole: string): Promise<void>;
}

export interface BillingRepository {
  getSubscription(orgId: string): Promise<Subscription | null>;
  updateSubscription(orgId: string, planId: string, interval: 'monthly' | 'annual'): Promise<Subscription>;
  cancelSubscription(orgId: string): Promise<Subscription>;
  getInvoices(orgId: string): Promise<Invoice[]>;
  getPlans(): Promise<SubscriptionPlan[]>;
  getUsage(orgId: string): Promise<OrganizationUsage>;
  consumeQuota(orgId: string, key: keyof OrganizationUsage, amount: number): Promise<void>;
}

export interface AdminRepository {
  getStats(): Promise<{
    totalUsers: number;
    totalOrgs: number;
    activeSubscriptions: number;
    mrr: number;
    arr: number;
    churnRate: number;
    totalStorageBytes: number;
  }>;
  getAllUsers(): Promise<User[]>;
  setUserStatus(userId: string, active: boolean): Promise<void>;
  getAllOrganizations(): Promise<Organization[]>;
  setOrgStatus(orgId: string, status: Organization['status']): Promise<void>;
  updatePlans(plans: SubscriptionPlan[]): Promise<void>;
  getAuditLogs(): Promise<AuditLogItem[]>;
  getSupportTickets(): Promise<SupportTicket[]>;
  replyTicket(ticketId: string, message: string): Promise<SupportTicket>;
  grantQuotaOverride(override: Partial<QuotaOverride>): Promise<QuotaOverride>;
}

// --- MOCK IMPLEMENTATIONS ---

class MockDocumentRepository implements DocumentRepository {
  async findAll(orgId: string, filters?: DocumentFilters): Promise<PaginatedResult<DocumentEntity>> {
    let items = mockStorage.getDocuments().filter((d) => d.organizationId === orgId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((d) => d.title.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filters?.format && filters.format !== 'all') {
      items = items.filter((d) => d.format === filters.format);
    }
    if (filters?.status && filters.status !== 'all') {
      items = items.filter((d) => d.status === filters.status);
    }
    return { items, total: items.length, page: 1, pageSize: 50 };
  }

  async findById(orgId: string, id: string): Promise<DocumentEntity | null> {
    const doc = mockStorage.getDocuments().find((d) => d.id === id && d.organizationId === orgId);
    return doc || null;
  }

  async create(orgId: string, input: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const docs = mockStorage.getDocuments();
    const newDoc: DocumentEntity = {
      id: 'doc-' + Date.now().toString(36),
      organizationId: orgId,
      workspaceId: 'ws-main',
      title: input.title || 'Nouveau_Document.pdf',
      originalFileName: input.originalFileName || 'fichier.pdf',
      fileSize: input.fileSize || 1024000,
      mimeType: input.mimeType || 'application/pdf',
      format: (input.format as any) || 'PDF',
      tags: input.tags || ['Nouveau'],
      status: 'pending',
      pageCount: input.pageCount || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    };
    mockStorage.saveDocuments([newDoc, ...docs]);

    // Record audit
    const logs = mockStorage.getAuditLogs();
    mockStorage.saveAuditLogs([
      {
        id: 'aud-' + Date.now(),
        organizationId: orgId,
        actorEmail: 'current.user@documind.ai',
        actorRole: 'EDITOR',
        action: 'document.create',
        resource: newDoc.title,
        timestamp: new Date().toISOString(),
        status: 'success',
        ipAddress: '127.0.0.1',
        details: `Importation du document ${newDoc.title} (${Math.round(newDoc.fileSize / 1024)} Ko)`
      },
      ...logs
    ]);

    return newDoc;
  }

  async update(orgId: string, id: string, patch: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const docs = mockStorage.getDocuments();
    const index = docs.findIndex((d) => d.id === id && d.organizationId === orgId);
    if (index === -1) throw new Error('Document introuvable');
    const updated = { ...docs[index], ...patch, updatedAt: new Date().toISOString() };
    docs[index] = updated;
    mockStorage.saveDocuments(docs);
    return updated;
  }

  async delete(orgId: string, id: string): Promise<void> {
    const docs = mockStorage.getDocuments().filter((d) => !(d.id === id && d.organizationId === orgId));
    mockStorage.saveDocuments(docs);
  }

  async processOcr(orgId: string, id: string): Promise<DocumentEntity> {
    await this.update(orgId, id, { status: 'processing' });
    // Simulate OCR extraction with structured fields
    await new Promise((r) => setTimeout(r, 1200));

    const updated = await this.update(orgId, id, {
      status: 'processed',
      ocrConfidence: 0.985,
      extractedText:
        'EXTRACTION DOCUMENTAIRE AUTOMATISÉE PAR DOCUMIND OCR\nRéférence document: ' +
        id +
        '\nDétection de sections tabulaires et métadonnées juridico-financières.\nStatut de conformité: Validé sans anomalie bloquante.',
      extractedFields: {
        documentType: { value: 'Facture / Contrat structuré', confidence: 0.99, verified: true },
        extractionDate: { value: new Date().toISOString().split('T')[0], confidence: 0.98, verified: true },
        language: { value: 'Français (FR-99%)', confidence: 0.99, verified: true }
      }
    });

    // Add to processing jobs
    const jobs = mockStorage.getJobs();
    mockStorage.saveJobs([
      {
        id: 'job-' + Date.now(),
        organizationId: orgId,
        jobType: 'ocr',
        itemTitle: updated.title,
        status: 'completed',
        progress: 100,
        startedAt: new Date(Date.now() - 1500).toISOString(),
        completedAt: new Date().toISOString()
      },
      ...jobs
    ]);

    return updated;
  }
}

class MockAudioRepository implements AudioRepository {
  async findAll(orgId: string): Promise<AudioEntity[]> {
    return mockStorage.getAudios().filter((a) => a.organizationId === orgId);
  }
  async findById(orgId: string, id: string): Promise<AudioEntity | null> {
    return mockStorage.getAudios().find((a) => a.id === id && a.organizationId === orgId) || null;
  }
  async create(orgId: string, audio: Partial<AudioEntity>): Promise<AudioEntity> {
    const list = mockStorage.getAudios();
    const newAudio: AudioEntity = {
      id: 'aud-' + Date.now().toString(36),
      organizationId: orgId,
      title: audio.title || 'Enregistrement_Reunion.mp3',
      fileName: audio.fileName || 'audio.mp3',
      durationSeconds: audio.durationSeconds || 1800,
      status: 'queued',
      speakers: [
        { id: 'spk-1', name: 'Intervenant 1', color: 'blue' },
        { id: 'spk-2', name: 'Intervenant 2', color: 'emerald' }
      ],
      transcriptSegments: [],
      createdAt: new Date().toISOString(),
      ...audio
    };
    mockStorage.saveAudios([newAudio, ...list]);
    return newAudio;
  }
  async transcribe(orgId: string, id: string): Promise<AudioEntity> {
    const list = mockStorage.getAudios();
    const idx = list.findIndex((a) => a.id === id && a.organizationId === orgId);
    if (idx === -1) throw new Error('Audio introuvable');
    list[idx].status = 'transcribing';
    mockStorage.saveAudios(list);

    await new Promise((r) => setTimeout(r, 1400));
    list[idx].status = 'completed';
    list[idx].transcriptSegments = [
      {
        id: 'seg-auto-1',
        speakerId: 'spk-1',
        startTime: 0,
        endTime: 25,
        text: 'Bonjour à tous. Nous ouvrons la session pour passer en revue les résultats de performance et valider les prochaines étapes de déploiement.'
      },
      {
        id: 'seg-auto-2',
        speakerId: 'spk-2',
        startTime: 26,
        endTime: 58,
        text: 'Tous les jalons prévus ont été atteints. Nous constatons un gain moyen de productivité de 3.5 heures par collaborateur par semaine.'
      }
    ];
    list[idx].summary = 'Réunion de synthèse validant les indicateurs clés de performance et l’efficacité opérationnelle constatée.';
    list[idx].decisions = ['Poursuite du déploiement global', 'Validation du rapport de synthèse'];
    list[idx].actionItems = [
      { task: 'Diffuser le compte-rendu aux équipes', assignee: 'Intervenant 1', deadline: '2026-11-10', status: 'todo' }
    ];
    mockStorage.saveAudios(list);
    return list[idx];
  }
  async delete(orgId: string, id: string): Promise<void> {
    mockStorage.saveAudios(mockStorage.getAudios().filter((a) => !(a.id === id && a.organizationId === orgId)));
  }
}

class MockVideoRepository implements VideoRepository {
  async findAll(orgId: string): Promise<VideoEntity[]> {
    return mockStorage.getVideos().filter((v) => v.organizationId === orgId);
  }
  async findById(orgId: string, id: string): Promise<VideoEntity | null> {
    return mockStorage.getVideos().find((v) => v.id === id && v.organizationId === orgId) || null;
  }
  async create(orgId: string, video: Partial<VideoEntity>): Promise<VideoEntity> {
    const list = mockStorage.getVideos();
    const newVideo: VideoEntity = {
      id: 'vid-' + Date.now().toString(36),
      organizationId: orgId,
      title: video.title || 'Video_Source.mp4',
      fileName: video.fileName || 'source.mp4',
      durationSeconds: video.durationSeconds || 600,
      status: 'queued',
      chapters: [],
      keyMoments: [],
      createdAt: new Date().toISOString(),
      ...video
    };
    mockStorage.saveVideos([newVideo, ...list]);
    return newVideo;
  }
  async analyze(orgId: string, id: string): Promise<VideoEntity> {
    const list = mockStorage.getVideos();
    const idx = list.findIndex((v) => v.id === id && v.organizationId === orgId);
    if (idx === -1) throw new Error('Vidéo introuvable');
    list[idx].status = 'analyzing';
    mockStorage.saveVideos(list);

    await new Promise((r) => setTimeout(r, 1500));
    list[idx].status = 'completed';
    list[idx].subtitlesGenerated = true;
    list[idx].chapters = [
      { title: 'Partie 1: Vue d’ensemble et contexte', startTime: 0, endTime: 120, summary: 'Présentation des enjeux' },
      { title: 'Partie 2: Démonstration et analyse', startTime: 121, endTime: 360, summary: 'Cas d’usage concrets' },
      { title: 'Partie 3: Conclusion et plan d’action', startTime: 361, endTime: list[idx].durationSeconds, summary: 'Synthèse finale' }
    ];
    list[idx].keyMoments = [
      { timestamp: 45, label: 'Présentation de la problématique', insight: 'Temps moyen de traitement identifié comme point de friction' },
      { timestamp: 180, label: 'Validation des gains d’efficacité', insight: 'Mesure de performance validée en séance' }
    ];
    mockStorage.saveVideos(list);
    return list[idx];
  }
  async delete(orgId: string, id: string): Promise<void> {
    mockStorage.saveVideos(mockStorage.getVideos().filter((v) => !(v.id === id && v.organizationId === orgId)));
  }
}

class MockGenerationRepository implements GenerationRepository {
  async findDocuments(orgId: string): Promise<GeneratedDocument[]> {
    return mockStorage.getGeneratedDocs().filter((g) => g.organizationId === orgId);
  }
  async createDocument(orgId: string, doc: Partial<GeneratedDocument>): Promise<GeneratedDocument> {
    const list = mockStorage.getGeneratedDocs();
    const newDoc: GeneratedDocument = {
      id: 'gen-' + Date.now().toString(36),
      organizationId: orgId,
      title: doc.title || 'Nouveau Document Généré',
      type: doc.type || 'executive_summary',
      sourceType: doc.sourceType || 'prompt',
      sourceId: doc.sourceId,
      sourceTitle: doc.sourceTitle,
      content: doc.content || '# Document\nContenu généré...',
      version: 1,
      format: doc.format || 'markdown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockStorage.saveGeneratedDocs([newDoc, ...list]);
    return newDoc;
  }
  async updateDocument(orgId: string, id: string, patch: Partial<GeneratedDocument>): Promise<GeneratedDocument> {
    const list = mockStorage.getGeneratedDocs();
    const idx = list.findIndex((d) => d.id === id && d.organizationId === orgId);
    if (idx === -1) throw new Error('Document généré introuvable');
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString(), version: (list[idx].version || 1) + 1 };
    mockStorage.saveGeneratedDocs(list);
    return list[idx];
  }
  async deleteDocument(orgId: string, id: string): Promise<void> {
    mockStorage.saveGeneratedDocs(mockStorage.getGeneratedDocs().filter((d) => !(d.id === id && d.organizationId === orgId)));
  }

  async findPresentations(orgId: string): Promise<PresentationEntity[]> {
    return mockStorage.getPresentations().filter((p) => p.organizationId === orgId);
  }
  async createPresentation(orgId: string, pres: Partial<PresentationEntity>): Promise<PresentationEntity> {
    const list = mockStorage.getPresentations();
    const newPres: PresentationEntity = {
      id: 'pres-' + Date.now().toString(36),
      organizationId: orgId,
      title: pres.title || 'Nouvelle Présentation',
      theme: pres.theme || 'corporate',
      sourceTitle: pres.sourceTitle,
      slides: pres.slides || [
        {
          id: 'sl-1',
          slideNumber: 1,
          title: 'Titre de la présentation',
          kicker: 'Sous-titre introductif',
          bullets: ['Point clé numéro un', 'Point clé numéro deux', 'Point clé numéro trois'],
          speakerNotes: 'Notes du présentateur'
        }
      ],
      createdAt: new Date().toISOString()
    };
    mockStorage.savePresentations([newPres, ...list]);
    return newPres;
  }
  async updatePresentation(orgId: string, id: string, patch: Partial<PresentationEntity>): Promise<PresentationEntity> {
    const list = mockStorage.getPresentations();
    const idx = list.findIndex((p) => p.id === id && p.organizationId === orgId);
    if (idx === -1) throw new Error('Présentation introuvable');
    list[idx] = { ...list[idx], ...patch };
    mockStorage.savePresentations(list);
    return list[idx];
  }
  async deletePresentation(orgId: string, id: string): Promise<void> {
    mockStorage.savePresentations(mockStorage.getPresentations().filter((p) => !(p.id === id && p.organizationId === orgId)));
  }

  async findAdVideos(orgId: string): Promise<AdVideoEntity[]> {
    return mockStorage.getAdVideos().filter((v) => v.organizationId === orgId);
  }
  async createAdVideo(orgId: string, adVideo: Partial<AdVideoEntity>): Promise<AdVideoEntity> {
    const list = mockStorage.getAdVideos();
    const newVid: AdVideoEntity = {
      id: 'adv-' + Date.now().toString(36),
      organizationId: orgId,
      title: adVideo.title || 'Vidéo Promotionnelle',
      targetAudience: adVideo.targetAudience || 'Décideurs et professionnels',
      aspectRatio: adVideo.aspectRatio || '16:9',
      voiceStyle: adVideo.voiceStyle || 'Professionnel chaleureux',
      musicMood: adVideo.musicMood || 'Moderne et rythmé',
      status: 'storyboarding',
      progressPercent: 30,
      scriptHook: adVideo.scriptHook || '',
      scriptProblem: adVideo.scriptProblem || '',
      scriptSolution: adVideo.scriptSolution || '',
      scriptCta: adVideo.scriptCta || '',
      scenes: adVideo.scenes || [],
      createdAt: new Date().toISOString()
    };
    mockStorage.saveAdVideos([newVid, ...list]);
    return newVid;
  }
  async updateAdVideo(orgId: string, id: string, patch: Partial<AdVideoEntity>): Promise<AdVideoEntity> {
    const list = mockStorage.getAdVideos();
    const idx = list.findIndex((v) => v.id === id && v.organizationId === orgId);
    if (idx === -1) throw new Error('Vidéo introuvable');
    list[idx] = { ...list[idx], ...patch };
    mockStorage.saveAdVideos(list);
    return list[idx];
  }

  async findContentSnippets(orgId: string): Promise<ContentSnippet[]> {
    return mockStorage.getContentSnippets().filter((c) => c.organizationId === orgId);
  }
  async createContentSnippet(orgId: string, snippet: Partial<ContentSnippet>): Promise<ContentSnippet> {
    const list = mockStorage.getContentSnippets();
    const newSnippet: ContentSnippet = {
      id: 'cnt-' + Date.now().toString(36),
      organizationId: orgId,
      title: snippet.title || 'Contenu Rédactionnel',
      channel: snippet.channel || 'linkedin',
      tone: snippet.tone || 'professional',
      content: snippet.content || '',
      createdAt: new Date().toISOString()
    };
    mockStorage.saveContentSnippets([newSnippet, ...list]);
    return newSnippet;
  }
}

class MockWorkflowRepository implements WorkflowRepository {
  async findAll(orgId: string): Promise<WorkflowEntity[]> {
    return mockStorage.getWorkflows().filter((w) => w.organizationId === orgId);
  }
  async findById(orgId: string, id: string): Promise<WorkflowEntity | null> {
    return mockStorage.getWorkflows().find((w) => w.id === id && w.organizationId === orgId) || null;
  }
  async save(orgId: string, workflow: Partial<WorkflowEntity>): Promise<WorkflowEntity> {
    const list = mockStorage.getWorkflows();
    const existingIdx = list.findIndex((w) => w.id === workflow.id && w.organizationId === orgId);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...workflow } as WorkflowEntity;
      mockStorage.saveWorkflows(list);
      return list[existingIdx];
    } else {
      const newWf: WorkflowEntity = {
        id: 'wf-' + Date.now().toString(36),
        organizationId: orgId,
        title: workflow.title || 'Nouveau Workflow',
        description: workflow.description || '',
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        executionCount: 0,
        createdAt: new Date().toISOString()
      };
      mockStorage.saveWorkflows([newWf, ...list]);
      return newWf;
    }
  }
  async delete(orgId: string, id: string): Promise<void> {
    mockStorage.saveWorkflows(mockStorage.getWorkflows().filter((w) => !(w.id === id && w.organizationId === orgId)));
  }
  async execute(orgId: string, id: string): Promise<{ success: boolean; executionId: string; logs: string[] }> {
    const wf = await this.findById(orgId, id);
    if (!wf) throw new Error('Workflow introuvable');
    wf.lastExecutedAt = new Date().toISOString();
    wf.executionCount = (wf.executionCount || 0) + 1;
    await this.save(orgId, wf);
    return {
      success: true,
      executionId: 'exec-' + Date.now().toString(36),
      logs: [
        'Démarrage de l’exécution du workflow "' + wf.title + '"',
        'Ingestion des documents sources validée',
        'Module OCR & Extraction tabulaire exécuté en 1.4s',
        'Validation des règles métier : 0 anomalie bloquante',
        'Workflow complété avec succès.'
      ]
    };
  }
}

class MockOrganizationRepository implements OrganizationRepository {
  async findAll(): Promise<Organization[]> {
    return mockStorage.getOrganizations();
  }
  async findById(id: string): Promise<Organization | null> {
    return mockStorage.getOrganizations().find((o) => o.id === id) || null;
  }
  async update(id: string, patch: Partial<Organization>): Promise<Organization> {
    const orgs = mockStorage.getOrganizations();
    const idx = orgs.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Organisation introuvable');
    orgs[idx] = { ...orgs[idx], ...patch };
    mockStorage.saveOrganizations(orgs);
    return orgs[idx];
  }
  async getMembers(orgId: string): Promise<User[]> {
    return mockStorage.getUsers().filter((u) => u.organizationMemberships.some((m) => m.organizationId === orgId));
  }
  async inviteMember(orgId: string, email: string, role: string): Promise<User> {
    const users = mockStorage.getUsers();
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (!existing.organizationMemberships.some((m) => m.organizationId === orgId)) {
        existing.organizationMemberships.push({
          organizationId: orgId,
          role: role as any,
          joinedAt: new Date().toISOString()
        });
        mockStorage.saveUsers(users);
      }
      return existing;
    }
    const [firstName] = email.split('@');
    const newUser: User = {
      id: 'user-' + Date.now().toString(36),
      email,
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: 'Membre',
      organizationMemberships: [
        {
          organizationId: orgId,
          role: role as any,
          joinedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };
    mockStorage.saveUsers([...users, newUser]);
    return newUser;
  }
  async removeMember(orgId: string, userId: string): Promise<void> {
    const users = mockStorage.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.organizationMemberships = user.organizationMemberships.filter((m) => m.organizationId !== orgId);
      mockStorage.saveUsers(users);
    }
  }
  async updateMemberRole(orgId: string, userId: string, newRole: string): Promise<void> {
    const users = mockStorage.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      const membership = user.organizationMemberships.find((m) => m.organizationId === orgId);
      if (membership) {
        membership.role = newRole as any;
        mockStorage.saveUsers(users);
      }
    }
  }
}

class MockBillingRepository implements BillingRepository {
  async getSubscription(orgId: string): Promise<Subscription | null> {
    const subs = mockStorage.getSubscriptions();
    return subs[orgId] || null;
  }
  async updateSubscription(orgId: string, planId: string, interval: 'monthly' | 'annual'): Promise<Subscription> {
    const subs = mockStorage.getSubscriptions();
    const plans = mockStorage.getPlans();
    const plan = plans.find((p) => p.id === planId);
    if (!plan) throw new Error('Plan introuvable');

    const updatedSub: Subscription = {
      id: 'sub-' + Date.now().toString(36),
      organizationId: orgId,
      planId: planId as any,
      status: 'active',
      billingInterval: interval,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + (interval === 'annual' ? 365 : 30) * 86400000).toISOString(),
      cancelAtPeriodEnd: false
    };
    subs[orgId] = updatedSub;
    mockStorage.saveSubscriptions(subs);

    // Create invoice
    const amountHt = interval === 'annual' ? plan.priceAnnual : plan.priceMonthly;
    if (amountHt > 0) {
      const invs = mockStorage.getInvoices();
      const newInvoice: Invoice = {
        id: 'inv-' + Date.now(),
        invoiceNumber: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
        organizationId: orgId,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        period: interval === 'annual' ? 'Abonnement 1 an' : 'Abonnement 1 mois',
        planName: `${plan.name} (${interval === 'annual' ? 'Annuel' : 'Mensuel'})`,
        amountHt,
        taxRate: 20,
        amountTtc: Math.round(amountHt * 1.2 * 100) / 100,
        currency: 'EUR',
        status: 'paid'
      };
      mockStorage.saveInvoices([newInvoice, ...invs]);
    }

    return updatedSub;
  }
  async cancelSubscription(orgId: string): Promise<Subscription> {
    const subs = mockStorage.getSubscriptions();
    if (subs[orgId]) {
      subs[orgId].cancelAtPeriodEnd = true;
      mockStorage.saveSubscriptions(subs);
      return subs[orgId];
    }
    throw new Error('Abonnement introuvable');
  }
  async getInvoices(orgId: string): Promise<Invoice[]> {
    return mockStorage.getInvoices().filter((i) => i.organizationId === orgId);
  }
  async getPlans(): Promise<SubscriptionPlan[]> {
    return mockStorage.getPlans();
  }
  async getUsage(orgId: string): Promise<OrganizationUsage> {
    const usages = mockStorage.getUsages();
    return (
      usages[orgId] || {
        storageUsedBytes: 0,
        documentsCount: 0,
        ocrPagesCount: 0,
        audioMinutesUsed: 0,
        videoMinutesUsed: 0,
        docGenerationsCount: 0,
        presentationsCount: 0,
        videoGenerationsMinutes: 0,
        activeWorkflowsCount: 0,
        workflowExecutionsCount: 0,
        membersCount: 1
      }
    );
  }
  async consumeQuota(orgId: string, key: keyof OrganizationUsage, amount: number): Promise<void> {
    const usages = mockStorage.getUsages();
    if (!usages[orgId]) {
      usages[orgId] = {
        storageUsedBytes: 0,
        documentsCount: 0,
        ocrPagesCount: 0,
        audioMinutesUsed: 0,
        videoMinutesUsed: 0,
        docGenerationsCount: 0,
        presentationsCount: 0,
        videoGenerationsMinutes: 0,
        activeWorkflowsCount: 0,
        workflowExecutionsCount: 0,
        membersCount: 1
      };
    }
    usages[orgId][key] = (usages[orgId][key] || 0) + amount;
    mockStorage.saveUsages(usages);
  }
}

class MockAdminRepository implements AdminRepository {
  async getStats() {
    const users = mockStorage.getUsers();
    const orgs = mockStorage.getOrganizations();
    const subs = Object.values(mockStorage.getSubscriptions());
    const plans = mockStorage.getPlans();

    let mrr = 0;
    subs.forEach((s) => {
      if (s.status === 'active') {
        const p = plans.find((plan) => plan.id === s.planId);
        if (p) {
          mrr += s.billingInterval === 'annual' ? p.priceAnnual / 12 : p.priceMonthly;
        }
      }
    });

    const totalStorageBytes = Object.values(mockStorage.getUsages()).reduce((acc, u) => acc + (u.storageUsedBytes || 0), 0);

    return {
      totalUsers: users.length,
      totalOrgs: orgs.length,
      activeSubscriptions: subs.filter((s) => s.status === 'active').length,
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      churnRate: 1.8,
      totalStorageBytes
    };
  }
  async getAllUsers(): Promise<User[]> {
    return mockStorage.getUsers();
  }
  async setUserStatus(userId: string, active: boolean): Promise<void> {
    const users = mockStorage.getUsers();
    const u = users.find((user) => user.id === userId);
    if (u) {
      (u as any).suspended = !active;
      mockStorage.saveUsers(users);
    }
  }
  async getAllOrganizations(): Promise<Organization[]> {
    return mockStorage.getOrganizations();
  }
  async setOrgStatus(orgId: string, status: Organization['status']): Promise<void> {
    const orgs = mockStorage.getOrganizations();
    const o = orgs.find((org) => org.id === orgId);
    if (o) {
      o.status = status;
      mockStorage.saveOrganizations(orgs);
    }
  }
  async updatePlans(plans: SubscriptionPlan[]): Promise<void> {
    mockStorage.savePlans(plans);
  }
  async getAuditLogs(): Promise<AuditLogItem[]> {
    return mockStorage.getAuditLogs();
  }
  async getSupportTickets(): Promise<SupportTicket[]> {
    return mockStorage.getTickets();
  }
  async replyTicket(ticketId: string, message: string): Promise<SupportTicket> {
    const tickets = mockStorage.getTickets();
    const t = tickets.find((ticket) => ticket.id === ticketId);
    if (!t) throw new Error('Ticket introuvable');
    t.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'support',
      senderName: 'Équipe Support DocuMind',
      body: message,
      timestamp: new Date().toISOString()
    });
    t.status = 'waiting_customer';
    t.updatedAt = new Date().toISOString();
    mockStorage.saveTickets(tickets);
    return t;
  }
  async grantQuotaOverride(override: Partial<QuotaOverride>): Promise<QuotaOverride> {
    const overrides = mockStorage.getQuotaOverrides();
    const newOverride: QuotaOverride = {
      id: 'qov-' + Date.now().toString(36),
      organizationId: override.organizationId || 'org-acme',
      resourceKey: override.resourceKey || 'audioMinutesPerMonth',
      overrideValue: override.overrideValue || 100,
      reason: override.reason || 'Dérogation administrative',
      grantedBy: override.grantedBy || 'Platform Admin',
      createdAt: new Date().toISOString()
    };
    mockStorage.saveQuotaOverrides([newOverride, ...overrides]);
    return newOverride;
  }
}

// 9. Project Repository (Fix ORG-01)
export interface ProjectRepository {
  findAll(orgId: string): Promise<Project[]>;
  findById(orgId: string, id: string): Promise<Project | null>;
  create(orgId: string, project: Partial<Project>): Promise<Project>;
  update(orgId: string, id: string, patch: Partial<Project>): Promise<Project>;
  delete(orgId: string, id: string): Promise<void>;
}

export class MockProjectRepository implements ProjectRepository {
  async findAll(orgId: string): Promise<Project[]> {
    return mockStorage.getProjects().filter((p) => p.organizationId === orgId);
  }
  async findById(orgId: string, id: string): Promise<Project | null> {
    const list = mockStorage.getProjects();
    return list.find((p) => p.organizationId === orgId && p.id === id) || null;
  }
  async create(orgId: string, data: Partial<Project>): Promise<Project> {
    const list = mockStorage.getProjects();
    const newPrj: Project = {
      id: 'prj-' + Date.now().toString(36),
      organizationId: orgId,
      title: data.title || 'Nouveau Dossier Projet',
      description: data.description || '',
      documentCount: data.documentCount || 0,
      lastActive: new Date().toISOString().split('T')[0],
      color: data.color || 'indigo',
      createdAt: new Date().toISOString()
    };
    mockStorage.saveProjects([newPrj, ...list]);
    return newPrj;
  }
  async update(orgId: string, id: string, patch: Partial<Project>): Promise<Project> {
    const list = mockStorage.getProjects();
    const idx = list.findIndex((p) => p.organizationId === orgId && p.id === id);
    if (idx === -1) throw new Error('Projet non trouvé');
    const updated = { ...list[idx], ...patch };
    list[idx] = updated;
    mockStorage.saveProjects(list);
    return updated;
  }
  async delete(orgId: string, id: string): Promise<void> {
    const list = mockStorage.getProjects().filter((p) => !(p.organizationId === orgId && p.id === id));
    mockStorage.saveProjects(list);
  }
}

// Factory instantiation
export const repositories = {
  document: new MockDocumentRepository(),
  audio: new MockAudioRepository(),
  video: new MockVideoRepository(),
  generation: new MockGenerationRepository(),
  workflow: new MockWorkflowRepository(),
  organization: new MockOrganizationRepository(),
  billing: new MockBillingRepository(),
  admin: new MockAdminRepository(),
  project: new MockProjectRepository()
};
