import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { mockStorage } from '../../mocks/storage';
import { useToast } from '../../context/ToastContext';
import { SupportTicket } from '../../types';
import { HelpCircle, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const { success } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadTickets = async () => {
    const list = await repositories.admin.getSupportTickets();
    setTickets(list);
    if (list.length > 0 && !activeTicket) {
      setActiveTicket(list[0]);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText) return;

    const updated = await repositories.admin.replyTicket(activeTicket.id, replyText);
    setActiveTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
    success('Réponse transmise au client', `Ticket ${updated.ticketNumber} actualisé.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Support Client & Tickets</h1>
        <p className="mt-1 text-xs text-slate-400">
          Traitez les demandes des utilisateurs relatives aux quotas, facturations et fonctionnalités.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tickets List */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Tickets en cours ({tickets.length})
          </div>
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeTicket?.id === t.id
                    ? 'border-amber-500 bg-slate-800 text-white'
                    : 'border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-mono text-amber-400">{t.ticketNumber}</span>
                  <span className="capitalize">{t.status.replace('_', ' ')}</span>
                </div>
                <div className="font-semibold text-xs leading-tight truncate">{t.subject}</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.organizationName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View (2 cols) */}
        {activeTicket && (
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-amber-400">{activeTicket.ticketNumber}</span>
                <span className="text-slate-400">Demandeur : {activeTicket.requesterEmail}</span>
              </div>
              <h2 className="text-base font-bold text-white">{activeTicket.subject}</h2>
              <div className="text-xs text-slate-400 mt-0.5">Organisation : {activeTicket.organizationName}</div>
            </div>

            {/* Messages Thread */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {activeTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl text-xs space-y-1.5 ${
                    m.sender === 'support'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-slate-200 ml-6'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className={m.sender === 'support' ? 'text-amber-300' : 'text-white'}>
                      {m.senderName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {m.timestamp.replace('T', ' ').slice(0, 16)}
                    </span>
                  </div>
                  <p className="leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Rédiger une réponse officielle du support..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la réponse</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
