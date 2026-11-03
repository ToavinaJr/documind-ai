import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
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

export const WorkspaceLayout: React.FC = () => {
  const { currentUser, currentOrganization, currentRole, logout, availableOrganizations, switchOrganization } = useAuth();
  const { plan, quotaStatuses } = useQuota();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar collapse states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  icon: any;
  color: string;
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
        { label: 'Vue d’ensemble', path: '/workspace/dashboard', icon: LayoutDashboard, color: '#DE1F4F' },
        { label: 'Projets récents', path: '/workspace/projects', icon: FolderGit2, color: '#3986A8' }
      ]
    },
    {
      id: 'intelligence',
      title: 'INTELLIGENCE',
      type: 'collapsible',
      items: [
        { label: 'Documents', path: '/workspace/documents', icon: FileText, color: '#DE1F4F', badge: 'OCR' },
        { label: 'Audio & Voix', path: '/workspace/audio', icon: Mic, color: '#3986A8', badge: 'Diarisé' },
        { label: 'Analyse Vidéo', path: '/workspace/video', icon: Video, color: '#E65B7D' },
        { label: 'OCR & Extraction', path: '/workspace/ocr', icon: ScanText, color: '#DE1F4F' },
        { label: 'Historique', path: '/workspace/history', icon: History, color: '#3986A8' }
      ]
    },
    {
      id: 'creation',
      title: 'CRÉATION',
      type: 'collapsible',
      items: [
        { label: 'Document Studio', path: '/workspace/document-studio', icon: FileSpreadsheet, color: '#3986A8' },
        { label: 'Présentations', path: '/workspace/presentations', icon: Presentation, color: '#3986A8' },
        { label: 'Studio Vidéo', path: '/workspace/video-studio', icon: Clapperboard, color: '#E65B7D', badge: 'Nouveau' },
        { label: 'Contenu Marketing', path: '/workspace/content-studio', icon: Sparkles, color: '#E65B7D' },
        { label: 'Templates', path: '/workspace/templates', icon: BookTemplate, color: '#DE1F4F' }
      ]
    },
    {
      id: 'automation',
      title: 'AUTOMATISATION',
      type: 'collapsible',
      items: [
        { label: 'Workflows', path: '/workspace/workflows', icon: GitBranch, color: '#DE1F4F' },
        { label: 'Exécutions', path: '/workspace/history', icon: Activity, color: '#3986A8' }
      ]
    },
    {
      id: 'organization',
      title: 'ORGANISATION & COMPTE',
      type: 'collapsible',
      items: [
        { label: 'Membres & Équipe', path: '/workspace/members', icon: Users, color: '#DE1F4F' },
        { label: 'Rôles & Accès', path: '/workspace/roles', icon: ShieldCheck, color: '#3986A8' },
        { label: 'Quotas & Limites', path: '/workspace/usage', icon: BarChart3, color: '#D99A35' },
        { label: 'Facturation & Plans', path: '/workspace/billing', icon: CreditCard, color: '#20A477' },
        { label: 'Paramètres', path: '/workspace/settings', icon: Settings, color: '#64748B' }
      ]
    }
  ];

  const getCurrentBreadcrumb = () => {
    for (const sec of navSections) {
      for (const it of sec.items) {
        if (location.pathname === it.path || location.pathname.startsWith(it.path + '/')) {
          return { section: sec.title || 'Workspace', item: it.label, color: it.color };
        }
      }
    }
    return { section: 'Workspace', item: 'Tableau de bord', color: '#DE1F4F' };
  };

  const currentBc = getCurrentBreadcrumb();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#09090B] text-[#0F172A] dark:text-[#F2F2F5] transition-colors">
      <DemoToolbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Magnific & Linear inspired) */}
        <aside
          className={`hidden lg:flex flex-col bg-[#F8FAFD] dark:bg-[#0F0F13] border-r border-[#DCE3EC] dark:border-[#303038] transition-all duration-200 shrink-0 select-none ${
            isSidebarCollapsed ? 'w-18' : 'w-64'
          }`}
        >
          {/* ZONE 1 — BRANDING & WORKSPACE */}
          <div className="p-3.5 border-b border-[#DCE3EC] dark:border-[#303038]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Brand Icon: Vibrant Violet with subtle glow */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#DE1F4F] to-[#3986A8] text-white flex items-center justify-center font-extrabold text-sm shadow-sm shadow-[#DE1F4F]/20 shrink-0">
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
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] transition-colors shrink-0"
                title={isSidebarCollapsed ? 'Agrandir la sidebar' : 'Réduire la sidebar'}
                aria-label={isSidebarCollapsed ? 'Agrandir la navigation' : 'Réduire la navigation'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-[#DE1F4F]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
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
                            `flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg transition-all ${
                              isActive
                                ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                                : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]'
                            } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`
                          }
                        >
                          <Icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
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
                      onClick={() => toggleGroup(sec.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isOpen ? 'rotate-0' : '-rotate-90'
                        }`}
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
                              `flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                                isActive
                                  ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]'
                              } ${isSidebarCollapsed ? 'justify-center px-0 py-2' : ''}`
                            }
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
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
                    className="h-full rounded-full transition-all bg-[#DE1F4F]"
                    style={{ width: `${Math.min(100, quotaStatuses.documentsPerMonth?.percentage || 0)}%` }}
                  />
                </div>
              </div>
            )}

            <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#DE1F4F] to-[#E65B7D] text-white flex items-center justify-center font-bold text-xs shrink-0">
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
                  onClick={logout}
                  title="Déconnexion"
                  className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-[85%] bg-[#F8FAFD] dark:bg-[#0F0F13] h-full flex flex-col p-4 shadow-2xl z-10 border-r border-[#DCE3EC] dark:border-[#303038]">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EC] dark:border-[#303038]">
                <div className="font-bold text-sm text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <span>DocuMind AI</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-[#64748B]">
                  <X className="w-5 h-5" />
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
                          <item.icon className="w-4 h-4" style={{ color: item.color }} />
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar with Context Breadcrumb & Quick Action */}
          <header className="h-14 bg-white/95 dark:bg-[#1A1A1F]/95 backdrop-blur-md border-b border-[#DCE3EC] dark:border-[#303038] px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 -ml-2 text-[#64748B] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D] rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-[#64748B] dark:text-[#A1A1AA]">
                  {currentOrganization?.name || 'Workspace'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B] hidden sm:inline" />
                <span className="font-semibold text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentBc.color }} />
                  {currentBc.item}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/workspace/documents')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#DE1F4F] hover:bg-[#C21843] text-white rounded-lg shadow-sm shadow-[#DE1F4F]/20 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+ Nouveau Traitement</span>
              </button>
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
