import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Building2, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchUser, allUsers, resetPassword } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/workspace/dashboard';

  const [email, setEmail] = useState('demo@documind.ai');
  const [password, setPassword] = useState('Demo@DocuMind2026!');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        success('Connexion réussie', `Bienvenue sur votre espace DocuMind AI.`);
        navigate(redirectTarget);
      } else {
        toastError('Échec de connexion', res.error || 'Identifiants invalides.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId: string, targetPath = '/workspace/dashboard') => {
    switchUser(userId);
    const u = allUsers.find((user) => user.id === userId);
    success('Connexion instantanée', `Connecté en tant que ${u?.firstName} ${u?.lastName}`);
    navigate(targetPath);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !newPassword) return;
    setIsResetting(true);
    try {
      const res = await resetPassword(forgotEmail, newPassword);
      if (res.success) {
        success('Mot de passe réinitialisé', `Vous pouvez désormais vous connecter avec votre nouveau mot de passe.`);
        setEmail(forgotEmail);
        setPassword(newPassword);
        setIsForgotModalOpen(false);
      } else {
        toastError('Erreur de réinitialisation', res.error || 'Email non trouvé.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="py-16 px-6 max-w-xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#DE1F4F] to-[#3986A8] text-white flex items-center justify-center font-extrabold text-base shadow-sm shadow-[#DE1F4F]/30 mx-auto mb-3">
          D
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F2F2F5] tracking-tight">
          Connexion à DocuMind AI
        </h1>
        <p className="mt-2 text-xs text-[#64748B] dark:text-[#A1A1AA]">
          Accédez à votre espace sécurisé d'intelligence documentaire et de génération multimodale.
        </p>
      </div>

      {/* Demo Selector Box */}
      <div className="mb-8 p-5 bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038] rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-[#F2F2F5] uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4 text-[#DE1F4F]" />
          <span>Comptes de Démonstration (1-Clic)</span>
        </div>
        <p className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] mb-4">
          Testez instantanément les différents rôles, permissions et l’isolation multi-tenant :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('user-sarah')}
            className="p-2.5 text-left border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F] rounded-xl transition-all bg-[#F8FAFD] dark:bg-[#26262D]"
          >
            <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5]">Sarah Connor</div>
            <div className="text-[10px] text-[#DE1F4F] font-medium">CEO · Acme Corp (Pro)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('user-david')}
            className="p-2.5 text-left border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F] rounded-xl transition-all bg-[#F8FAFD] dark:bg-[#26262D]"
          >
            <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5]">David Miller</div>
            <div className="text-[10px] text-[#3986A8] font-medium">Manager · Acme Corp</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('user-elena')}
            className="p-2.5 text-left border border-[#DCE3EC] dark:border-[#303038] hover:border-[#DE1F4F] rounded-xl transition-all bg-[#F8FAFD] dark:bg-[#26262D]"
          >
            <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5]">Elena Rostova</div>
            <div className="text-[10px] text-[#64748B] font-medium">Viewer · Lecture seule</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('user-sophie')}
            className="p-2.5 text-left border border-[#DCE3EC] dark:border-[#303038] hover:border-[#3986A8] rounded-xl transition-all bg-[#F8FAFD] dark:bg-[#26262D]"
          >
            <div className="font-semibold text-[#0F172A] dark:text-[#F2F2F5]">Dr. Sophie Laurent</div>
            <div className="text-[10px] text-[#3986A8] font-medium">Beta Health · Tenant Isolé</div>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8EDF4] dark:border-[#303038]">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('user-admin', '/admin/dashboard')}
            className="w-full p-2.5 text-left border border-[#D99A35]/40 bg-[#D99A35]/10 hover:bg-[#D99A35]/20 text-[#D99A35] rounded-xl text-xs transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-[#D99A35]">Alexandre Dubois (Platform Admin)</div>
              <div className="text-[10px] text-[#D99A35]/80">Accès Backoffice · Rôles globaux & supervision</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D99A35]" />
          </button>
        </div>
      </div>

      {/* Standard Credentials Form with Real Password Checking (SEC-01) */}
      <div className="p-6 bg-white dark:bg-[#1A1A1F] border border-[#DCE3EC] dark:border-[#303038] rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Adresse email professionnelle
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5]">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotModalOpen(true);
                }}
                className="text-[11px] text-[#DE1F4F] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
              />
            </div>
            <div className="mt-1 text-[11px] text-[#64748B]">
              Mot de passe de démonstration : <code className="font-mono text-[#DE1F4F]">Demo@DocuMind2026!</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] hover:opacity-95 rounded-xl shadow-sm shadow-[#DE1F4F]/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{isLoading ? 'Authentification sécurisée...' : 'Se connecter'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E8EDF4] dark:border-[#303038] text-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold text-[#DE1F4F] hover:underline">
            Créer une organisation
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Réinitialiser votre mot de passe"
        description="Saisissez votre email et définissez un nouveau mot de passe pour votre compte."
      >
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Email du compte
            </label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="demo@documind.ai"
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F2F2F5] mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] dark:bg-[#26262D] border border-[#DCE3EC] dark:border-[#303038] rounded-xl text-[#0F172A] dark:text-[#F2F2F5] focus:outline-none focus:border-[#DE1F4F]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isResetting}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#DE1F4F] to-[#C21843] rounded-xl shadow-sm transition-all"
            >
              {isResetting ? 'Réinitialisation...' : 'Valider le mot de passe'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
