import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { DemoToolbar } from '../components/common/DemoToolbar';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Building,
  Cog,
  FileCode2,
  Gauge,
  HelpCircle,
  LayoutGrid,
  Menu,
  PackagePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  ShieldAlert,
  SlidersHorizontal,
  Users2,
  X
} from 'lucide-react';

const adminNav = [
  { label: 'Vue d’ensemble', path: '/admin/dashboard', icon: LayoutGrid },
  { label: 'Utilisateurs', path: '/admin/users', icon: Users2 },
  { label: 'Organisations', path: '/admin/organizations', icon: Building },
  { label: 'Plans commerciaux', path: '/admin/plans', icon: PackagePlus },
  { label: 'Gestion des fonctionnalités', path: '/admin/features', icon: SlidersHorizontal },
  { label: 'Abonnements et revenus', path: '/admin/billing', icon: Receipt },
  { label: 'Quotas et dérogations', path: '/admin/usage', icon: Gauge },
  { label: 'Tickets support', path: '/admin/support', icon: HelpCircle },
  { label: 'Journal d’audit', path: '/admin/audit', icon: FileCode2 },
  { label: 'Paramètres globaux', path: '/admin/settings', icon: Cog }
];

export const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth();
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

  const renderNavigation = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-0.5">
      {adminNav.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            title={isSidebarCollapsed && !onNavigate ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] font-semibold'
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#F2F2F5] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]'
              } ${isSidebarCollapsed && !onNavigate ? 'justify-center px-0' : ''}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {(!isSidebarCollapsed || onNavigate) && <span className="truncate">{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="dm-app dm-admin min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#09090B] text-[#0F172A] dark:text-[#F2F2F5] selection:bg-[#DE1F4F] selection:text-white">
      <DemoToolbar />

      <div className="bg-white dark:bg-[#1A1A1F] border-b border-[#DCE3EC] dark:border-[#303038] text-[#64748B] dark:text-[#A1A1AA] text-xs py-2 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1 -ml-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#EEF2F7] dark:hover:text-[#F2F2F5] dark:hover:bg-[#26262D]"
            aria-label="Ouvrir la navigation d’administration"
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-navigation"
          >
            <Menu className="w-4 h-4" aria-hidden="true" />
          </button>
          <ShieldAlert className="w-3.5 h-3.5 text-[#DE1F4F] shrink-0" aria-hidden="true" />
          <span className="truncate">Console d’administration plateforme — Accès Super Administrateur</span>
        </div>
        <Link
          to="/workspace/dashboard"
          aria-label="Retour au workspace"
          className="flex items-center gap-1 text-[#DE1F4F] hover:text-[#C21843] transition-colors shrink-0"
        >
          <ArrowLeft className="w-3 h-3" aria-hidden="true" />
          <span className="hidden sm:inline">Retour au workspace</span>
        </Link>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <aside
          className={`hidden lg:flex flex-col bg-[#F8FAFD] dark:bg-[#0F0F13] border-r border-[#DCE3EC] dark:border-[#303038] transition-[width] duration-200 shrink-0 select-none ${
            isSidebarCollapsed ? 'w-18' : 'w-64'
          }`}
        >
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
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] rounded font-semibold">
                        Admin
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] truncate mt-0.5">
                      Console plateforme
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
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

          <div className="flex-1 overflow-y-auto px-2.5 py-3">
            {renderNavigation()}
          </div>

          <div className="p-3 border-t border-[#DCE3EC] dark:border-[#303038] bg-[#F5F8FC]/60 dark:bg-[#09090B]/40">
            <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.firstName.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate text-[#0F172A] dark:text-[#F2F2F5]">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] truncate">
                    {currentUser.platformRole || 'PLATFORM_OWNER'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <button
              type="button"
              className="fixed inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
              tabIndex={-1}
            />
            <aside ref={mobileNavigationRef} id="admin-mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation administration" className="relative w-72 max-w-[85%] bg-[#F8FAFD] dark:bg-[#0F0F13] h-full flex flex-col z-10 border-r border-[#DCE3EC] dark:border-[#303038]">
              <div className="p-4 border-b border-[#DCE3EC] dark:border-[#303038] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div aria-hidden="true" className="w-8 h-8 rounded bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-sm">D</div>
                  <div>
                    <div className="font-semibold text-sm text-[#0F172A] dark:text-[#F2F2F5]">DocuMind Admin</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">Console plateforme</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#64748B] hover:bg-[#EEF2F7] dark:hover:bg-[#26262D]"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2.5 py-3">
                {renderNavigation(() => setMobileMenuOpen(false))}
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
