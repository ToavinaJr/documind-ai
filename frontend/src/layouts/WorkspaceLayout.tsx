import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, NavLink, useLocation } from 'react-router-dom';
import { DemoToolbar } from '../components/common/DemoToolbar';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import {
  LayoutDashboard,
  FileText,
  ScanText,
  Mic,
  Video,
  FileSpreadsheet,
  Presentation,
  Clapperboard,
  Sparkles,
  GitBranch,
  BookTemplate,
  History,
  Users,
  ShieldCheck,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Building2,
  FolderGit2,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Activity
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const WorkspaceLayout: React.FC = () => {
  const { currentUser, currentOrganization, currentRole, logout, availableOrganizations, switchOrganization } = useAuth();
  const { plan, quotaStatuses } = useQuota();
  const location = useLocation();

  // Sidebar collapse states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previouslyFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const getFocusableElements = () => Array.from(
      mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    getFocusableElements()[0]?.focus();

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.removeEventListener('keydown', handleDialogKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [mobileMenuOpen]);

  // Group accordion states (default open for active route's group)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    intelligence: true,
    creation: true,
    automation: false,
    organization: false
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  id: string;
  title?: string;
  type: 'direct' | 'collapsible';
  items: NavItem[];
}

  // Functional navigation structure (§4)
  const navSections: NavSection[] = [
    {
      id: 'main',
      type: 'direct',
      items: [
        { label: 'Vue d’ensemble', path: '/workspace/dashboard', icon: LayoutDashboard },
        { label: 'Projets récents', path: '/workspace/projects', icon: FolderGit2 }
      ]
    },
    {
      id: 'intelligence',
      title: 'INTELLIGENCE',
      type: 'collapsible',
      items: [
        { label: 'Documents', path: '/workspace/documents', icon: FileText, badge: 'OCR' },
        { label: 'Audio & Voix', path: '/workspace/audio', icon: Mic, badge: 'Diarisé' },
        { label: 'Analyse Vidéo', path: '/workspace/video', icon: Video },
        { label: 'OCR & Extraction', path: '/workspace/ocr', icon: ScanText },
        { label: 'Historique', path: '/workspace/history', icon: History }
      ]
    },
    {
      id: 'creation',
      title: 'CRÉATION',
      type: 'collapsible',
      items: [
        { label: 'Document Studio', path: '/workspace/document-studio', icon: FileSpreadsheet },
        { label: 'Présentations', path: '/workspace/presentations', icon: Presentation },
        { label: 'Studio Vidéo', path: '/workspace/video-studio', icon: Clapperboard, badge: 'Nouveau' },
        { label: 'Contenu Marketing', path: '/workspace/content-studio', icon: Sparkles },
        { label: 'Templates', path: '/workspace/templates', icon: BookTemplate }
      ]
    },
    {
      id: 'automation',
      title: 'AUTOMATISATION',
      type: 'collapsible',
      items: [
        { label: 'Workflows', path: '/workspace/workflows', icon: GitBranch },
        { label: 'Exécutions', path: '/workspace/history', icon: Activity }
      ]
    },
    {
      id: 'organization',
      title: 'ORGANISATION & COMPTE',
      type: 'collapsible',
      items: [
        { label: 'Membres & Équipe', path: '/workspace/members', icon: Users },
        { label: 'Rôles & Accès', path: '/workspace/roles', icon: ShieldCheck },
        { label: 'Quotas & Limites', path: '/workspace/usage', icon: BarChart3 },
        { label: 'Facturation & Plans', path: '/workspace/billing', icon: CreditCard },
        { label: 'Paramètres', path: '/workspace/settings', icon: Settings }
      ]
    }
  ];

  const getCurrentBreadcrumb = () => {
    for (const sec of navSections) {
      for (const it of sec.items) {
        if (location.pathname === it.path || location.pathname.startsWith(it.path + '/')) {
          return { section: sec.title || 'Workspace', item: it.label };
        }
      }
    }
    return { section: 'Workspace', item: 'Tableau de bord' };
  };

  const currentBc = getCurrentBreadcrumb();

  return (
    <div className="dm-app min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#09090B] text-[#0F172A] dark:text-[#F2F2F5] transition-colors">
      <DemoToolbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Magnific & Linear inspired) */}
        <aside
          className={`hidden lg:flex flex-col bg-[#F8FAFD] dark:bg-[#0F0F13] border-r border-[#DCE3EC] dark:border-[#303038] shrink-0 select-none ${
            isSidebarCollapsed ? 'w-18' : 'w-64'
          }`}
        >
          {/* ZONE 1 — BRANDING & WORKSPACE */}
          <div className="p-3.5 border-b border-[#DCE3EC] dark:border-[#303038]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  D
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-1.5">
                      <span>DocuMind</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] rounded font-semibold">
                        AI
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] truncate mt-0.5">
                      {currentOrganization?.name || 'Acme Innovation Corp'}
                    </div>
                  </div>
                )}
              </div>

              {/* Collapse/Expand Toggle Button */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] transition-colors shrink-0"
                title={isSidebarCollapsed ? 'Agrandir la sidebar' : 'Réduire la sidebar'}
                aria-label={isSidebarCollapsed ? 'Agrandir la navigation' : 'Réduire la navigation'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-[#DE1F4F]" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* NAVIGATION GROUPS (ZONES 2 - 6) */}
          <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
            {navSections.map((sec) => {
              if (sec.type === 'direct') {
                return (
                  <div key={sec.id} className="space-y-0.5">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          title={isSidebarCollapsed ? item.label : undefined}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg transition-colors ${
                              isActive
                                ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                                : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]'
                            } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`
                          }
                        >
                          <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                          {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                      );
                    })}
                  </div>
                );
              }

              const isOpen = openGroups[sec.id] !== false;

              return (
                <div key={sec.id} className="space-y-1">
                  {/* Group Header with Accordion Toggle */}
                  {!isSidebarCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(sec.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isOpen ? 'rotate-0' : '-rotate-90'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <div className="h-px bg-[#DCE3EC] dark:bg-[#303038] my-2" />
                  )}

                  {/* Group Items (expanded or icon rail) */}
                  {(isOpen || isSidebarCollapsed) && (
                    <div className="space-y-0.5">
                      {sec.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={({ isActive }) =>
                              `flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]'
                              } ${isSidebarCollapsed ? 'justify-center px-0 py-2' : ''}`
                            }
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                            </div>

                            {!isSidebarCollapsed && item.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#EEF2F7] dark:bg-[#26262D] text-[#64748B] dark:text-[#A1A1AA] rounded">
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* COMPACT FOOTER: Quota & User Profile */}
          <div className="p-3 border-t border-[#DCE3EC] dark:border-[#303038] space-y-2 bg-[#F5F8FC]/60 dark:bg-[#09090B]/40">
            {!isSidebarCollapsed && (
              <div className="bg-white dark:bg-[#1A1A1F] p-2.5 rounded-xl border border-[#DCE3EC] dark:border-[#303038] text-xs">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#64748B] dark:text-[#A1A1AA]">Quota Documents</span>
                  <span className="font-mono font-semibold tabular-nums text-[#0F172A] dark:text-[#F2F2F5]">
                    {quotaStatuses.documentsPerMonth?.used} / {quotaStatuses.documentsPerMonth?.limit}
                  </span>
                </div>
                <div className="w-full bg-[#EEF2F7] dark:bg-[#26262D] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] bg-[#DE1F4F]"
                    style={{ width: `${Math.min(100, quotaStatuses.documentsPerMonth?.percentage || 0)}%` }}
                  />
                </div>
              </div>
            )}

            <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-[#DE1F4F] to-[#E65B7D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.firstName.charAt(0)}
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-[#0F172A] dark:text-[#F2F2F5]">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] font-mono truncate">
                      {currentRole} · Plan {plan.name}
                    </div>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={logout}
                  title="Déconnexion"
                  aria-label="Se déconnecter"
                  className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <button
              type="button"
              className="fixed inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
              tabIndex={-1}
            />
            <aside
              ref={mobileNavigationRef}
              id="workspace-mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation workspace"
              className="relative w-72 max-w-[85%] bg-[#F8FAFD] dark:bg-[#0F0F13] h-full flex flex-col p-4 z-10 border-r border-[#DCE3EC] dark:border-[#303038]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EC] dark:border-[#303038]">
                <div className="font-bold text-sm text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-2">
                  <div aria-hidden="true" className="w-6 h-6 rounded-lg bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <span>DocuMind AI</span>
                </div>
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-[#64748B]" aria-label="Fermer la navigation">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {navSections.map((sec) => (
                  <div key={sec.id}>
                    {sec.title && (
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2 px-2">
                        {sec.title}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      {sec.items.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg ${
                              isActive
                                ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                                : 'text-[#64748B] dark:text-[#A1A1AA]'
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4" aria-hidden="true" />
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar with Context Breadcrumb & Quick Action */}
          <header className="h-14 bg-white/95 dark:bg-[#1A1A1F]/95 backdrop-blur-md border-b border-[#DCE3EC] dark:border-[#303038] px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 -ml-2 text-[#64748B] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] rounded-lg"
                aria-label="Ouvrir la navigation workspace"
                aria-expanded={mobileMenuOpen}
                aria-controls="workspace-mobile-navigation"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-[#64748B] dark:text-[#A1A1AA]">
                  {currentOrganization?.name || 'Workspace'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B] hidden sm:inline" aria-hidden="true" />
                <span className="font-semibold text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DE1F4F]" aria-hidden="true" />
                  {currentBc.item}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/workspace/documents"
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#DE1F4F] hover:bg-[#C21843] text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>+ Nouveau Traitement</span>
              </Link>
            </div>
          </header>

          {/* Page Body Container */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
