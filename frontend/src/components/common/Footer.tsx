import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">DocuMind AI</div>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
            Plateforme SaaS multimodale d’intelligence documentaire, de génération de livrables d’entreprise et d’automatisation de flux décisionnels.
          </p>
          <div className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
            Conformité RGPD · Hébergement Cloud Souverain Européen · Chiffrement AES-256
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">Produit</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Intelligence Documentaire</Link></li>
            <li><Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Transcription & Audio</Link></li>
            <li><Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Génération Vidéo Pub</Link></li>
            <li><Link to="/templates" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Workflow Builder</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">Ressources</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Plans & Tarifs</Link></li>
            <li><Link to="/templates" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Bibliothèque de modèles</Link></li>
            <li><Link to="/faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Foire aux questions</Link></li>
            <li><Link to="/contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Support & Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">Espaces</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Connexion Client</Link></li>
            <li><Link to="/workspace/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Espace Workspace</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Administration Plateforme</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
        <div>© 2026 DocuMind AI Technologies Inc. Tous droits réservés.</div>
        <div className="flex items-center gap-6">
          <span className="hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer">Conditions Générales</span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer">Confidentialité</span>
          <span className="hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer">Sécurité & SLA</span>
        </div>
      </div>
    </footer>
  );
};
