import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { AuditLogItem } from '../../types';
import { FileCode2, Search, Filter, ShieldCheck } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const list = await repositories.admin.getAuditLogs();
      setLogs(list);
    };
    load();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Journal d'Audit Immuable</h1>
        <p className="mt-1 text-xs text-slate-400">
          Traçabilité intégrale de toutes les actions sensibles, élévations de privilèges et accès aux données.
        </p>
      </div>

      <div className="flex bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par acteur, action ou ressource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
              <th className="py-3 px-4 font-semibold">Horodatage UTC</th>
              <th className="py-3 px-4 font-semibold">Acteur & Rôle</th>
              <th className="py-3 px-4 font-semibold">Action Réalisée</th>
              <th className="py-3 px-4 font-semibold">Ressource Cible</th>
              <th className="py-3 px-4 font-semibold">Adresse IP</th>
              <th className="py-3 px-4 font-semibold">Résultat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-[11px] tabular-nums">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-slate-400">
                  {log.timestamp.replace('T', ' ').slice(0, 19)}
                </td>
                <td className="py-3 px-4 font-sans text-white font-medium">
                  {log.actorEmail} <span className="text-slate-400 font-mono">({log.actorRole})</span>
                </td>
                <td className="py-3 px-4 text-amber-300 font-semibold">{log.action}</td>
                <td className="py-3 px-4 font-sans text-slate-300 truncate max-w-xs">{log.resource}</td>
                <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                <td className="py-3 px-4 font-sans">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Succès
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
