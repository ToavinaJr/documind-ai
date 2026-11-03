import {
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
  SubscriptionPlan,
  Subscription,
  Organization,
  User,
  OrganizationUsage,
  QuotaOverride,
  Invoice,
  ProcessingJob,
  Project,
  FeatureFlag,
  PlatformSettings,
  CustomRole
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_AUDIOS,
  INITIAL_VIDEOS,
  INITIAL_GENERATED_DOCS,
  INITIAL_PRESENTATIONS,
  INITIAL_AD_VIDEOS,
  INITIAL_CONTENT_SNIPPETS,
  INITIAL_WORKFLOWS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLANS,
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_USAGES,
  INITIAL_INVOICES,
  INITIAL_PROJECTS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_CUSTOM_ROLES
} from './initial-data';

const STORAGE_PREFIX = 'documind_db_v1_';

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse storage item ${key}:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save storage item ${key}:`, e);
  }
}

class MockStorage {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Reset to initial baseline
  resetAll(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    this.notify();
  }

  // --- Users & Orgs ---
  getUsers(): User[] {
    return getItem('users', INITIAL_USERS);
  }
  saveUsers(users: User[]): void {
    setItem('users', users);
    this.notify();
  }

  getOrganizations(): Organization[] {
    return getItem('organizations', INITIAL_ORGANIZATIONS);
  }
  saveOrganizations(orgs: Organization[]): void {
    setItem('organizations', orgs);
    this.notify();
  }

  // --- Plans & Subscriptions ---
  getPlans(): SubscriptionPlan[] {
    return getItem('plans', INITIAL_PLANS);
  }
  savePlans(plans: SubscriptionPlan[]): void {
    setItem('plans', plans);
    this.notify();
  }

  getSubscriptions(): Record<string, Subscription> {
    return getItem('subscriptions', INITIAL_SUBSCRIPTIONS);
  }
  saveSubscriptions(subs: Record<string, Subscription>): void {
    setItem('subscriptions', subs);
    this.notify();
  }

  // --- Usages & Overrides ---
  getUsages(): Record<string, OrganizationUsage> {
    return getItem('usages', INITIAL_USAGES);
  }
  saveUsages(usages: Record<string, OrganizationUsage>): void {
    setItem('usages', usages);
    this.notify();
  }

  getQuotaOverrides(): QuotaOverride[] {
    return getItem('quota_overrides', []);
  }
  saveQuotaOverrides(overrides: QuotaOverride[]): void {
    setItem('quota_overrides', overrides);
    this.notify();
  }

  // --- Documents ---
  getDocuments(): DocumentEntity[] {
    return getItem('documents', INITIAL_DOCUMENTS);
  }
  saveDocuments(docs: DocumentEntity[]): void {
    setItem('documents', docs);
    this.notify();
  }

  // --- Audio ---
  getAudios(): AudioEntity[] {
    return getItem('audios', INITIAL_AUDIOS);
  }
  saveAudios(audios: AudioEntity[]): void {
    setItem('audios', audios);
    this.notify();
  }

  // --- Video ---
  getVideos(): VideoEntity[] {
    return getItem('videos', INITIAL_VIDEOS);
  }
  saveVideos(videos: VideoEntity[]): void {
    setItem('videos', videos);
    this.notify();
  }

  // --- Generated Documents ---
  getGeneratedDocs(): GeneratedDocument[] {
    return getItem('generated_docs', INITIAL_GENERATED_DOCS);
  }
  saveGeneratedDocs(docs: GeneratedDocument[]): void {
    setItem('generated_docs', docs);
    this.notify();
  }

  // --- Presentations ---
  getPresentations(): PresentationEntity[] {
    return getItem('presentations', INITIAL_PRESENTATIONS);
  }
  savePresentations(pres: PresentationEntity[]): void {
    setItem('presentations', pres);
    this.notify();
  }

  // --- Ad Videos ---
  getAdVideos(): AdVideoEntity[] {
    return getItem('ad_videos', INITIAL_AD_VIDEOS);
  }
  saveAdVideos(videos: AdVideoEntity[]): void {
    setItem('ad_videos', videos);
    this.notify();
  }

  // --- Content Snippets ---
  getContentSnippets(): ContentSnippet[] {
    return getItem('content_snippets', INITIAL_CONTENT_SNIPPETS);
  }
  saveContentSnippets(snippets: ContentSnippet[]): void {
    setItem('content_snippets', snippets);
    this.notify();
  }

  // --- Workflows ---
  getWorkflows(): WorkflowEntity[] {
    return getItem('workflows', INITIAL_WORKFLOWS);
  }
  saveWorkflows(workflows: WorkflowEntity[]): void {
    setItem('workflows', workflows);
    this.notify();
  }

  // --- Invoices ---
  getInvoices(): Invoice[] {
    return getItem('invoices', INITIAL_INVOICES);
  }
  saveInvoices(invoices: Invoice[]): void {
    setItem('invoices', invoices);
    this.notify();
  }

  // --- Support Tickets ---
  getTickets(): SupportTicket[] {
    return getItem('tickets', INITIAL_TICKETS);
  }
  saveTickets(tickets: SupportTicket[]): void {
    setItem('tickets', tickets);
    this.notify();
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLogItem[] {
    return getItem('audit_logs', INITIAL_AUDIT_LOGS);
  }
  saveAuditLogs(logs: AuditLogItem[]): void {
    setItem('audit_logs', logs);
    this.notify();
  }

  // --- Processing Jobs ---
  getJobs(): ProcessingJob[] {
    return getItem('jobs', [
      {
        id: 'job-01',
        organizationId: 'org-acme',
        jobType: 'ocr',
        itemTitle: 'Facture_CloudInfra_Q3.pdf',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-01T10:15:00Z',
        completedAt: '2026-10-01T10:15:03Z'
      },
      {
        id: 'job-02',
        organizationId: 'org-acme',
        jobType: 'audio_transcribe',
        itemTitle: 'Codir_Strategie_Q4_2026.mp3',
        status: 'completed',
        progress: 100,
        startedAt: '2026-10-20T14:00:00Z',
        completedAt: '2026-10-20T14:02:15Z'
      }
    ]);
  }
  saveJobs(jobs: ProcessingJob[]): void {
    setItem('jobs', jobs);
    this.notify();
  }

  // --- Projects (Fix ORG-01) ---
  getProjects(): Project[] {
    return getItem('projects', INITIAL_PROJECTS);
  }
  saveProjects(projects: Project[]): void {
    setItem('projects', projects);
    this.notify();
  }

  // --- Feature Flags (Fix ADMIN-01) ---
  getFeatureFlags(): FeatureFlag[] {
    return getItem('feature_flags', INITIAL_FEATURE_FLAGS);
  }
  saveFeatureFlags(flags: FeatureFlag[]): void {
    setItem('feature_flags', flags);
    this.notify();
  }

  // --- Platform Settings (Fix ADMIN-02) ---
  getPlatformSettings(): PlatformSettings {
    return getItem('platform_settings', INITIAL_PLATFORM_SETTINGS);
  }
  savePlatformSettings(settings: PlatformSettings): void {
    setItem('platform_settings', settings);
    this.notify();
  }

  // --- Custom Roles (Fix RBAC-01) ---
  getCustomRoles(): CustomRole[] {
    return getItem('custom_roles', INITIAL_CUSTOM_ROLES);
  }
  saveCustomRoles(roles: CustomRole[]): void {
    setItem('custom_roles', roles);
    this.notify();
  }
}

export const mockStorage = new MockStorage();
