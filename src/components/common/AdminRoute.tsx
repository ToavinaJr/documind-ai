import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isPlatformAdmin, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#09090B] flex items-center justify-center p-6 text-[#0F172A] dark:text-[#F2F2F5]">
        <div className="max-w-md w-full p-8 bg-white dark:bg-[#1A1A1F] rounded-2xl border border-[#DC3545]/30 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DC3545]/15 text-[#DC3545] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DC3545]/15 text-[#DC3545]">
              403 Accès Refusé
            </span>
            <h1 className="text-xl font-bold mt-2">Zone d'administration restreinte</h1>
            <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA] leading-relaxed">
              Le compte <strong>{currentUser?.email}</strong> ne possède pas les privilèges administrateur de la plateforme DocuMind AI (Platform Owner / Super Admin).
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => navigate('/workspace/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au Workspace</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white rounded-xl border border-[#DCE3EC] dark:border-[#303038]"
            >
              Changer de compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
