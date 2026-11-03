import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { DemoToolbar } from '../components/common/DemoToolbar';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users2,
  Building,
  PackagePlus,
  SlidersHorizontal,
  Receipt,
  Gauge,
  HelpCircle,
  FileCode2,
  Cog,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, isPlatformAdmin } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { label: 'Vue d’ensemble', path: '/admin/dashboard', icon: LayoutGrid },
    { label: 'Utilisateurs', path: '/admin/users', icon: Users2 },
    { label: 'Organisations', path: '/admin/organizations', icon: Building },
    { label: 'Plans Commerciaux', path: '/admin/plans', icon: PackagePlus },
    { label: 'Features Management', path: '/admin/features', icon: SlidersHorizontal },
    { label: 'Abonnements & Revenus', path: '/admin/billing', icon: Receipt },
    { label: 'Quotas & Dérogations', path: '/admin/usage', icon: Gauge },
    { label: 'Tickets Support', path: '/admin/support', icon: HelpCircle },
    { label: 'Journal d’Audit', path: '/admin/audit', icon: FileCode2 },
    { label: 'Paramètres Globaux', path: '/admin/settings', icon: Cog }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      <DemoToolbar />

      {/* Admin Safety Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Console d'Administration Plateforme — Accès Super-Administrateur</span>
        </div>
        <button
          onClick={() => navigate('/workspace/dashboard')}
          className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Retour au Workspace Client</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500 text-black flex items-center justify-center font-bold text-sm">
              DM
            </div>
            <div>
              <div className="font-bold text-sm text-white">DocuMind Core</div>
              <div className="text-[11px] text-slate-400 font-mono">Backoffice v2.6.4</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs">
            <div className="text-[11px] text-slate-400">Connecté en tant que</div>
            <div className="font-semibold text-white truncate">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">
              {currentUser.platformRole || 'PLATFORM_OWNER'}
            </div>
          </div>
        </aside>

        {/* Admin Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
