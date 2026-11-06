import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, RotateCcw, Shield, Building2, UserCircle, ChevronDown } from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const { currentUser, currentOrganization, switchUser, switchOrganization, resetDemoData, availableOrganizations } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const demoPersonas = [
    {
      id: 'user-sarah',
      name: 'Sarah Connor',
      role: 'CEO / Owner',
      org: 'Acme Innovation Corp (Plan Pro)',
      orgId: 'org-acme',
      badge: 'Client Pro',
    },
    {
      id: 'user-david',
      name: 'David Miller',
      role: 'Manager',
      org: 'Acme Innovation Corp',
      orgId: 'org-acme',
      badge: 'Manager',
    },
    {
      id: 'user-elena',
      name: 'Elena Rostova',
      role: 'Viewer (Lecture seule)',
      org: 'Acme Innovation Corp',
      orgId: 'org-acme',
      badge: 'Viewer',
    },
    {
      id: 'user-marcus',
      name: 'Marcus Vance',
      role: 'Billing Manager',
      org: 'Acme Innovation Corp',
      orgId: 'org-acme',
      badge: 'Billing',
    },
    {
      id: 'user-sophie',
      name: 'Dr. Sophie Laurent',
      role: 'Owner (Organisation isolée)',
      org: 'Beta Health SAS (Plan Starter)',
      orgId: 'org-beta',
      badge: 'Isolation Tenant',
    },
    {
      id: 'user-admin',
      name: 'Alexandre Dubois',
      role: 'Platform Owner',
      org: 'DocuMind Global Backoffice',
      orgId: 'org-acme',
      badge: 'Super Admin',
    }
  ];

  const handleReset = () => {
    if (window.confirm('Réinitialiser toutes les données de démonstration à leur état initial ?')) {
      resetDemoData();
      success('Démonstration réinitialisée', 'Les données initiales ont été restaurées avec succès.');
    }
  };

  const isInAdmin = location.pathname.startsWith('/admin');
  const isInWorkspace = location.pathname.startsWith('/workspace');

  return (
    <aside aria-label="Contrôles de démonstration" className="dm-toolbar w-full bg-[#0F0F13] text-[#F2F2F5] border-b border-[#303038] text-xs py-1.5 px-4 z-40 sticky top-0 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DE1F4F]" aria-hidden="true" />
              DocuMind Démo
            </span>
            <span className="text-[#64748B]">·</span>
            <span className="font-mono text-[11px] text-[#F04470] bg-[#DE1F4F]/15 px-2 py-0.5 rounded border border-[#DE1F4F]/30">
              Mode MOCK / Prêt NestJS
            </span>
          </div>

          <div className="h-3 w-px bg-[#303038] hidden sm:block" />

          {/* Quick Org Switcher */}
          <div className="hidden md:flex items-center gap-1.5 text-[#A1A1AA]">
            <Building2 className="w-3.5 h-3.5 text-[#DE1F4F]" aria-hidden="true" />
            <select
              aria-label="Organisation active"
              value={currentOrganization?.id || ''}
              onChange={(e) => switchOrganization(e.target.value)}
              className="bg-[#26262D] text-[#F2F2F5] border border-[#3F3F48] rounded-lg px-2 py-0.5 text-xs focus:border-[#F04470] cursor-pointer"
            >
              {availableOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="min-w-0 flex flex-wrap items-center justify-end gap-2 sm:gap-4">
          {/* Persona selector dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="demo-persona-menu"
              aria-label="Changer de compte de démonstration"
              className="flex items-center gap-1.5 bg-[#26262D] hover:bg-[#303038] text-white px-2.5 py-1 rounded-lg border border-[#303038] transition-colors"
            >
              <UserCircle className="w-3.5 h-3.5 text-[#A1A1AA]" aria-hidden="true" />
              <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
                {currentUser.firstName} {currentUser.lastName} ({currentUser.isPlatformAdmin ? 'Admin' : currentOrganization?.name})
              </span>
              <ChevronDown className="w-3 h-3 text-[#A1A1AA]" aria-hidden="true" />
            </button>

            {isOpen && (
              <div id="demo-persona-menu" className="absolute right-0 mt-1 w-76 bg-[#1A1A1F] border border-[#303038] rounded-xl shadow-2xl py-1 z-50 text-[#F2F2F5] divide-y divide-[#25252D]">
                <div className="px-3 py-2 text-[11px] text-[#A1A1AA]">
                  Changer de rôle pour tester les permissions et l’isolation multi-tenant :
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {demoPersonas.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        switchUser(p.id);
                        setIsOpen(false);
                        success('Profil basculé', `Connecté en tant que ${p.name} (${p.role})`);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-[#26262D] transition-colors ${
                        currentUser.id === p.id ? 'bg-[#DE1F4F]/15 text-white font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#26262D] text-[#A1A1AA]">
                          {p.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A1A1AA]">{p.role} · {p.org}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Space Navigation */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                !isInWorkspace && !isInAdmin
                  ? 'bg-[#DE1F4F] text-white font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Site Public
            </Link>
            <Link
              to="/workspace/dashboard"
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                isInWorkspace
                  ? 'bg-[#DE1F4F] text-white font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Workspace
            </Link>
            <Link
              to="/admin/dashboard"
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                isInAdmin
                  ? 'bg-[#DE1F4F] text-white font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" aria-hidden="true" />
              <span>Backoffice</span>
            </Link>
          </div>

          {/* Theme & Reset */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#303038]">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#26262D] transition-colors"
              title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              aria-label="Basculer le thème"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" aria-hidden="true" /> : <Moon className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-lg text-[#A1A1AA] hover:text-[#EF5967] hover:bg-[#26262D] transition-colors"
              title="Réinitialiser les données de démo"
              aria-label="Réinitialiser les données"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
