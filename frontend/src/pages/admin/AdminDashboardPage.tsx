import React, { useState, useEffect } from 'react';
import { repositories } from '../../repositories';
import { mockStorage } from '../../mocks/storage';
import { AuditLogItem } from '../../types';
import {
  TrendingUp,
  Building,
  Users2,
  Package,
  HardDrive,
  Activity,
  ShieldCheck,
  Receipt
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrgs: 0,
    activeSubscriptions: 0,
    mrr: 0,
    arr: 0,
    churnRate: 1.8,
    totalStorageBytes: 0
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const s = await repositories.admin.getStats();
      setStats(s);
      const logs = await repositories.admin.getAuditLogs();
      setAuditLogs(logs.slice(0, 5));
    };
    load();
    const unsub = mockStorage.subscribe(load);
    return unsub;
  }, []);

  return (
    <div className="space-y-8">
      {/* Platform Title */}
      <div>
        <div className="text-xs font-mono text-amber-400 mb-1">COMMAND CONSOLE // DOCUMIND SAAS CORE</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Supervision Globale de la Plateforme</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Métriques commerciales, santé de l'infrastructure et activité globale multi-tenant.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Revenu Récurrent (MRR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {stats.mrr} €
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            ARR estimé : {stats.arr} €
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Organisations Actives</span>
            <Building className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {stats.totalOrgs}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.activeSubscriptions} abonnements payants
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Utilisateurs Recensés</span>
            <Users2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {stats.totalUsers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tous rôles confondus</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Stockage Global Alloué</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {(stats.totalStorageBytes / 1000000000).toFixed(1)} Go
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-région UE</div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Dernières Activités Plateforme & Actions Administratives</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Journal Immuable</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{log.actorEmail}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.actorRole})</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-amber-400/90 text-[11px]">{log.action}</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5 truncate">{log.details}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-[10px] text-slate-500">
                  {log.timestamp.split('T')[1].slice(0, 8)}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">IP: {log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
