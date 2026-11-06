import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-[#0F0F13] border-b border-[#DCE3EC] dark:border-[#303038] transition-colors sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand logo mark and wordmark */}
        <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div aria-hidden="true" className="w-7 h-7 rounded bg-[#DE1F4F] text-white flex items-center justify-center font-bold text-xs">
            D
          </div>
          <span className="text-base font-bold tracking-tight text-[#0F172A] dark:text-[#F2F2F5] flex items-center gap-1.5">
            <span>DocuMind</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#FCE8EE] dark:bg-[#DE1F4F]/20 text-[#DE1F4F] dark:text-[#F04470] rounded font-semibold">
              AI
            </span>
          </span>
        </Link>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#64748B] dark:text-[#A1A1AA]">
          <Link to="/features" className="hover:text-[#DE1F4F] dark:hover:text-[#F04470] transition-colors whitespace-nowrap shrink-0">
            Fonctionnalités
          </Link>
          <Link to="/solutions" className="hover:text-[#DE1F4F] dark:hover:text-[#F04470] transition-colors whitespace-nowrap shrink-0">
            Solutions
          </Link>
          <Link to="/pricing" className="hover:text-[#DE1F4F] dark:hover:text-[#F04470] transition-colors whitespace-nowrap shrink-0">
            Tarification
          </Link>
          <Link to="/templates" className="hover:text-[#DE1F4F] dark:hover:text-[#F04470] transition-colors whitespace-nowrap shrink-0">
            Modèles
          </Link>
          <Link to="/about" className="hover:text-[#DE1F4F] dark:hover:text-[#F04470] transition-colors whitespace-nowrap shrink-0">
            À propos
          </Link>
        </nav>

        {/* Primary workspace action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/workspace/dashboard"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#DE1F4F] hover:bg-[#C21843] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Accéder au Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
};
