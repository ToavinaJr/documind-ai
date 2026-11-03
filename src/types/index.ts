/**
 * DocuMind AI — Core Types and Domain Contracts
 */

export type UserRole =
  | 'PLATFORM_OWNER'
  | 'SUPER_ADMIN'
  | 'PLATFORM_SUPPORT'
  | 'ORG_OWNER'
  | 'ORG_ADMIN'
  | 'MANAGER'
  | 'EDITOR'
  | 'VIEWER'
  | 'BILLING_MANAGER'
  | 'CUSTOM';

export type Permission =
  | 'dashboard.read'
  | 'documents.read'
  | 'documents.create'
  | 'documents.update'
  | 'documents.delete'
  | 'documents.download'
  | 'documents.share'
  | 'documents.validate'
  | 'audio.read'
  | 'audio.create'
  | 'audio.transcribe'
  | 'audio.delete'
  | 'video.read'
  | 'video.create'
  | 'video.generate'
  | 'generations.read'
  | 'generations.create'
  | 'generations.update'
  | 'generations.delete'
  | 'generations.export'
  | 'presentations.read'
  | 'presentations.create'
  | 'presentations.update'
  | 'presentations.export'
  | 'workflows.read'
  | 'workflows.create'
  | 'workflows.update'
  | 'workflows.delete'
  | 'workflows.execute'
  | 'projects.read'
  | 'projects.create'
  | 'projects.update'
  | 'projects.delete'
  | 'members.read'
  | 'members.invite'
  | 'members.update'
  | 'members.remove'
  | 'roles.read'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'billing.read'
  | 'billing.manage'
  | 'subscriptions.read'
  | 'subscriptions.manage'
  | 'organization.read'
  | 'organization.update'
  | 'usage.read'
  | 'audit.read';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isPlatformAdmin?: boolean;
  platformRole?: 'PLATFORM_OWNER' | 'SUPER_ADMIN' | 'PLATFORM_SUPPORT';
  organizationMemberships: {
    organizationId: string;
    role: UserRole;
    customRoleId?: string;
    joinedAt: string;
  }[];
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  description?: string;
  address?: string;
  country: string;
  currency: 'EUR' | 'USD';
  timezone: string;
  ownerId: string;
  status: 'active' | 'pending' | 'suspended' | 'cancelled';
  createdAt: string;
}

export interface CustomRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export type PlanTier = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  storageGb: number;
  documentsPerMonth: number;
  ocrPagesPerMonth: number;
  audioMinutesPerMonth: number;
  videoMinutesPerMonth: number;
  docGenerationsPerMonth: number;
  presentationsPerMonth: number;
  videoGenerationsMinutesPerMonth: number;
  activeWorkflows: number;
  workflowExecutionsPerMonth: number;
  maxMembers: number;
  historyDays: number;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
  active: boolean;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: PlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'paused' | 'cancelled' | 'expired';
  billingInterval: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
}

export interface OrganizationUsage {
  storageUsedBytes: number;
  documentsCount: number;
  ocrPagesCount: number;
  audioMinutesUsed: number;
  videoMinutesUsed: number;
  docGenerationsCount: number;
  presentationsCount: number;
  videoGenerationsMinutes: number;
  activeWorkflowsCount: number;
  workflowExecutionsCount: number;
  membersCount: number;
  historyDaysRetained?: number;
}

export interface Project {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  documentCount: number;
  lastActive: string;
  color?: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'beta' | 'disabled';
  requiredPlan: PlanTier;
}

export interface PlatformSettings {
  allowSignups: boolean;
  maintenanceMode: boolean;
  enforceMfa: boolean;
  defaultPlan: PlanTier;
  supportEmail: string;
  maxUploadSizeMb: number;
}

export interface QuotaOverride {
  id: string;
  organizationId: string;
  resourceKey: keyof PlanLimits;
  overrideValue: number;
  reason: string;
  grantedBy: string;
  expiresAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  date: string;
  dueDate: string;
  period: string;
  planName: string;
  amountHt: number;
  taxRate: number;
  amountTtc: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  pdfUrl?: string;
}

export interface DocumentEntity {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'CSV' | 'TXT' | 'PNG' | 'JPG';
  tags: string[];
  status: 'pending' | 'processing' | 'processed' | 'failed';
  extractedText?: string;
  ocrConfidence?: number;
  pageCount?: number;
  extractedFields?: Record<string, { value: string | number; confidence: number; verified?: boolean }>;
  anomalies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AudioEntity {
  id: string;
  organizationId: string;
  title: string;
  fileName: string;
  durationSeconds: number;
  audioUrl?: string;
  status: 'queued' | 'transcribing' | 'completed' | 'failed';
  speakers: { id: string; name: string; color: string }[];
  transcriptSegments: {
    id: string;
    speakerId: string;
    startTime: number;
    endTime: number;
    text: string;
  }[];
  summary?: string;
  keyTopics?: string[];
  decisions?: string[];
  actionItems?: { task: string; assignee: string; deadline: string; status: 'todo' | 'done' }[];
  risks?: string[];
  createdAt: string;
}

export interface VideoEntity {
  id: string;
  organizationId: string;
  title: string;
  fileName: string;
  durationSeconds: number;
  status: 'queued' | 'analyzing' | 'completed' | 'failed';
  chapters: { title: string; startTime: number; endTime: number; summary: string }[];
  keyMoments: { timestamp: number; label: string; insight: string }[];
  transcriptText?: string;
  subtitlesGenerated?: boolean;
  createdAt: string;
}

export interface GeneratedDocument {
  id: string;
  organizationId: string;
  title: string;
  type:
    | 'meeting_minutes'
    | 'executive_summary'
    | 'action_plan'
    | 'specifications'
    | 'commercial_proposal'
    | 'audit_report'
    | 'contract_summary';
  sourceType: 'document' | 'audio' | 'video' | 'prompt';
  sourceId?: string;
  sourceTitle?: string;
  content: string;
  version: number;
  format: 'markdown' | 'pdf' | 'docx';
  createdAt: string;
  updatedAt: string;
}

export interface PresentationSlide {
  id: string;
  slideNumber: number;
  title: string;
  kicker?: string;
  bullets: string[];
  speakerNotes?: string;
  visualPrompt?: string;
}

export interface PresentationEntity {
  id: string;
  organizationId: string;
  title: string;
  theme: 'corporate' | 'minimalist' | 'tech' | 'executive';
  slides: PresentationSlide[];
  sourceTitle?: string;
  createdAt: string;
}

export interface AdVideoScene {
  id: string;
  sceneNumber: number;
  durationSeconds: number;
  headline: string;
  narrationVoiceover: string;
  visualDescription: string;
  cameraMovement: string;
  transition: string;
}

export interface AdVideoEntity {
  id: string;
  organizationId: string;
  title: string;
  targetAudience: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  voiceStyle: string;
  musicMood: string;
  status: 'scripting' | 'storyboarding' | 'rendering' | 'ready';
  progressPercent: number;
  scriptHook: string;
  scriptProblem: string;
  scriptSolution: string;
  scriptCta: string;
  scenes: AdVideoScene[];
  createdAt: string;
}

export interface ContentSnippet {
  id: string;
  organizationId: string;
  title: string;
  channel: 'linkedin' | 'newsletter' | 'blog' | 'product_ad' | 'press_release';
  tone: 'professional' | 'authoritative' | 'conversational' | 'inspiring';
  content: string;
  createdAt: string;
}

export type WorkflowNodeType =
  | 'input_document'
  | 'ocr_extractor'
  | 'classifier'
  | 'structured_extract'
  | 'human_validation'
  | 'summary_ai'
  | 'doc_generator'
  | 'presentation_generator'
  | 'export_output';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  x: number;
  y: number;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'failed' | 'waiting_validation';
}

export interface WorkflowEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface WorkflowEntity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastExecutedAt?: string;
  executionCount: number;
  createdAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  workflowTitle: string;
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'completed' | 'failed' | 'requires_approval';
  stepLogs: {
    nodeId: string;
    nodeTitle: string;
    timestamp: string;
    status: 'ok' | 'running' | 'error' | 'waiting';
    message: string;
  }[];
}

export interface ProcessingJob {
  id: string;
  organizationId: string;
  jobType: 'ocr' | 'audio_transcribe' | 'video_analysis' | 'doc_gen' | 'presentation' | 'video_render' | 'workflow';
  itemTitle: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  organizationId: string;
  organizationName: string;
  requesterEmail: string;
  subject: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  category: 'billing' | 'ocr_quality' | 'quota_limit' | 'bug' | 'feature_request';
  messages: {
    id: string;
    sender: 'user' | 'support';
    senderName: string;
    body: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  organizationId?: string;
  organizationName?: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failure';
  ipAddress: string;
  details: string;
}
