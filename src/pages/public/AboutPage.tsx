import React from 'react';
import { Shield, Lock, Eye, Award, Sparkles, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 px-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Notre Mission
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Libérer les équipes des corvées de saisie, de relecture et de synthèse manuelle en bâtissant la plateforme d'intelligence documentaire la plus sobre, rigoureuse et puissante du marché.
        </p>
      </div>

      <div className="space-y-12">
        <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Direction Artistique : Clarté, Déférence et Sobriété
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Inspirée par les Human Interface Guidelines d'Apple et la rigueur typographique de Vercel Geist, l'interface de DocuMind AI refuse les artifices visuels superflus. Pas de gradients saturés ni de dashboards surchargés : nous privilégions la lisibilité absolue, les chiffres tabulaires précis et une ergonomie conçue pour les professionnels qui traitent des milliers de documents critiques chaque mois.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Shield className="w-8 h-8 text-neutral-900 dark:text-white mb-3" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Souveraineté des Données</h3>
            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
              Hébergement européen certifié, conformité stricte au RGPD et rétention paramétrable par chaque organisation.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Lock className="w-8 h-8 text-neutral-900 dark:text-white mb-3" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Chiffrement de Bout en Bout</h3>
            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
              Chiffrement au repos (AES-256) et en transit (TLS 1.3). Vos documents ne sont jamais utilisés pour entraîner des modèles publics.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Eye className="w-8 h-8 text-neutral-900 dark:text-white mb-3" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Traçabilité Intégrale</h3>
            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
              Chaque chiffre, décision ou livrable généré est relié à son extrait source d'origine pour un audit infaillible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
