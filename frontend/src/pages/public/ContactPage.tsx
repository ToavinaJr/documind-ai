import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Message envoyé', 'Notre équipe commerciale et technique reviendra vers vous sous 24h.');
  };

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Contact & Support Dédié
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Une question sur nos forfaits Enterprise, une demande de démonstration personnalisée ou une question d'intégration API ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Siège Européen</div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white">DocuMind AI SAS</div>
            <div className="text-xs text-neutral-500 mt-1">24 Rue du Sentier, 75002 Paris, France</div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Email Direct</div>
            <div className="text-xs font-mono text-neutral-900 dark:text-white">contact@documind.ai</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Réponse garantie sous 4h ouvrées</div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Téléphone Enterprise</div>
            <div className="text-xs font-mono text-neutral-900 dark:text-white">+33 (0)1 89 71 22 00</div>
          </div>
        </div>

        <div className="md:col-span-2 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Merci pour votre message !</h3>
              <p className="mt-2 text-xs text-neutral-500 max-w-sm mx-auto">
                Votre demande a été enregistrée avec succès. Un conseiller va prendre contact avec vous très prochainement.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-4 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Entreprise / Organisation
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Votre besoin ou projet
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Décrivez votre volume de documents ou votre cas d'usage..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Transmettre la demande</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
