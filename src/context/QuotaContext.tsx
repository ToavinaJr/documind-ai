import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PlanLimits, OrganizationUsage, SubscriptionPlan, Subscription, QuotaOverride } from '../types';
import { mockStorage } from '../mocks/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface QuotaStatus {
  key: keyof PlanLimits;
  label: string;
  unit: string;
  used: number;
  limit: number;
  percentage: number;
  isOverLimit: boolean;
  isWarning: boolean;
}

interface QuotaContextType {
  plan: SubscriptionPlan;
  subscription: Subscription | null;
  usage: OrganizationUsage;
  quotaStatuses: Record<keyof PlanLimits, QuotaStatus>;
  overrides: QuotaOverride[];
  checkCanPerform: (resource: keyof PlanLimits, amount?: number) => { allowed: boolean; reason?: string };
  consume: (resource: keyof PlanLimits, amount?: number) => Promise<boolean>;
}

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

const RESOURCE_CONFIG: Record<keyof PlanLimits, { label: string; unit: string; usageKey: keyof OrganizationUsage; multiplier?: number }> = {
  storageGb: { label: 'Stockage Cloud', unit: 'Go', usageKey: 'storageUsedBytes', multiplier: 1 / 1000000000 },
  documentsPerMonth: { label: 'Documents Ingestés', unit: 'docs', usageKey: 'documentsCount' },
  ocrPagesPerMonth: { label: 'Pages OCR & Tabulaires', unit: 'pages', usageKey: 'ocrPagesCount' },
  audioMinutesPerMonth: { label: 'Transcription Audio', unit: 'min', usageKey: 'audioMinutesUsed' },
  videoMinutesPerMonth: { label: 'Analyse Vidéo', unit: 'min', usageKey: 'videoMinutesUsed' },
  docGenerationsPerMonth: { label: 'Générations Documentaires', unit: 'docs', usageKey: 'docGenerationsCount' },
  presentationsPerMonth: { label: 'Présentations PPTX / PDF', unit: 'présentations', usageKey: 'presentationsCount' },
  videoGenerationsMinutesPerMonth: { label: 'Génération Vidéo Pub', unit: 'min', usageKey: 'videoGenerationsMinutes' },
  activeWorkflows: { label: 'Workflows Actifs', unit: 'actifs', usageKey: 'activeWorkflowsCount' },
  workflowExecutionsPerMonth: { label: 'Exécutions de Workflows', unit: 'exécutions', usageKey: 'workflowExecutionsCount' },
  maxMembers: { label: 'Membres d’Équipe', unit: 'utilisateurs', usageKey: 'membersCount' },
  historyDays: { label: 'Rétention Historique', unit: 'jours', usageKey: 'historyDaysRetained' }
};

export const QuotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrganization } = useAuth();
  const { warning, error: toastError } = useToast();

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => mockStorage.getPlans());
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>(() => mockStorage.getSubscriptions());
  const [usages, setUsages] = useState<Record<string, OrganizationUsage>>(() => mockStorage.getUsages());
  const [overrides, setOverrides] = useState<QuotaOverride[]>(() => mockStorage.getQuotaOverrides());

  useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      setPlans(mockStorage.getPlans());
      setSubscriptions(mockStorage.getSubscriptions());
      setUsages(mockStorage.getUsages());
      setOverrides(mockStorage.getQuotaOverrides());
    });
    return unsub;
  }, []);

  const orgId = currentOrganization?.id || 'org-acme';
  const subscription = subscriptions[orgId] || null;
  const currentPlanId = subscription?.planId || 'pro';
  const plan = useMemo(() => {
    return plans.find((p) => p.id === currentPlanId) || plans[2]; // Default Pro
  }, [plans, currentPlanId]);

  const usage = useMemo(() => {
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
        membersCount: 1,
        historyDaysRetained: 30
      }
    );
  }, [usages, orgId]);

  // Fix QUOTA-03: Exclude expired overrides
  const orgOverrides = useMemo(() => {
    const now = Date.now();
    return overrides.filter((ov) => {
      if (ov.organizationId !== orgId) return false;
      if (ov.expiresAt && new Date(ov.expiresAt).getTime() < now) return false;
      return true;
    });
  }, [overrides, orgId]);

  // Fix QUOTA-02: Do not replace 0 limit by 1; handle 0 limit properly
  const quotaStatuses = useMemo(() => {
    const statuses: Partial<Record<keyof PlanLimits, QuotaStatus>> = {};

    (Object.keys(RESOURCE_CONFIG) as (keyof PlanLimits)[]).forEach((key) => {
      const cfg = RESOURCE_CONFIG[key];
      const baseLimit = plan.limits[key] !== undefined ? plan.limits[key] : 0;
      const override = orgOverrides.find((o) => o.resourceKey === key);
      const effectiveLimit = override ? override.overrideValue : baseLimit;

      const rawUsed = (usage as any)[cfg.usageKey] || 0;
      const used = cfg.multiplier ? Math.round(rawUsed * cfg.multiplier * 10) / 10 : rawUsed;
      const percentage = effectiveLimit > 0 ? Math.min(100, Math.round((used / effectiveLimit) * 100)) : (used > 0 ? 100 : 0);

      statuses[key] = {
        key,
        label: cfg.label,
        unit: cfg.unit,
        used,
        limit: effectiveLimit,
        percentage,
        isOverLimit: effectiveLimit === 0 ? true : used >= effectiveLimit,
        isWarning: effectiveLimit > 0 && percentage >= 80 && used < effectiveLimit
      };
    });

    return statuses as Record<keyof PlanLimits, QuotaStatus>;
  }, [plan, usage, orgOverrides]);

  const checkCanPerform = (resource: keyof PlanLimits, amount = 1): { allowed: boolean; reason?: string } => {
    const status = quotaStatuses[resource];
    if (!status) return { allowed: true };

    if (status.limit === 0) {
      return {
        allowed: false,
        reason: `La ressource "${status.label}" n'est pas incluse dans votre formule Plan ${plan.name}. Mettez à niveau votre abonnement pour débloquer cette capacité.`
      };
    }

    if (status.used + amount > status.limit) {
      return {
        allowed: false,
        reason: `Quota mensuel atteint pour "${status.label}" (${status.used} / ${status.limit} ${status.unit}). Mettez à niveau votre plan ou contactez le support.`
      };
    }
    return { allowed: true };
  };

  const consume = async (resource: keyof PlanLimits, amount = 1): Promise<boolean> => {
    const check = checkCanPerform(resource, amount);
    if (!check.allowed) {
      toastError('Quota insuffisant', check.reason);
      return false;
    }

    const cfg = RESOURCE_CONFIG[resource];
    const currentUsages = mockStorage.getUsages();
    if (!currentUsages[orgId]) {
      currentUsages[orgId] = { ...usage };
    }
    const rawAmount = cfg.multiplier ? Math.round(amount / cfg.multiplier) : amount;
    currentUsages[orgId][cfg.usageKey] = ((currentUsages[orgId][cfg.usageKey] as number) || 0) + rawAmount;
    mockStorage.saveUsages(currentUsages);

    // Threshold notification
    const newUsed = quotaStatuses[resource].used + amount;
    const limit = quotaStatuses[resource].limit;
    const ratio = newUsed / limit;
    if (ratio >= 0.85 && ratio < 1) {
      warning('Alerte de consommation', `Vous avez atteint ${Math.round(ratio * 100)}% de votre quota pour ${cfg.label}.`);
    }

    return true;
  };

  return (
    <QuotaContext.Provider
      value={{
        plan,
        subscription,
        usage,
        quotaStatuses,
        overrides: orgOverrides,
        checkCanPerform,
        consume
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = (): QuotaContextType => {
  const ctx = useContext(QuotaContext);
  if (!ctx) throw new Error('useQuota must be used within QuotaProvider');
  return ctx;
};
