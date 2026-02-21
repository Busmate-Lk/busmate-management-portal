'use client';

import { AlertTriangle, Info, XCircle, CheckCircle2, Clock } from 'lucide-react';
import type { SystemAlert } from '@/app/mot/dashboard/data';

const CONFIG = {
  critical: { icon: <XCircle className="h-4 w-4 text-red-500" />,   border: 'border-l-red-500',   bg: 'bg-red-50' },
  warning:  { icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, border: 'border-l-amber-500', bg: 'bg-amber-50' },
  info:     { icon: <Info className="h-4 w-4 text-blue-500" />,      border: 'border-l-blue-400',  bg: 'bg-blue-50' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface SystemAlertsProps {
  alerts: SystemAlert[];
  onResolveAlert: (id: string) => void;
  loading?: boolean;
}

export function SystemAlerts({ alerts, onResolveAlert, loading = false }: SystemAlertsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        {[0, 1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg mb-3" />)}
      </div>
    );
  }

  const active = alerts.filter((a) => !a.resolved);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">System Alerts</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          active.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {active.length} Active
        </span>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-400 mb-2" />
          <p className="text-sm text-gray-500">All alerts resolved</p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((alert) => {
            const cfg = CONFIG[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${cfg.border} ${cfg.bg}`}
              >
                <div className="mt-0.5 shrink-0">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{alert.title}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                    <Clock className="h-2.5 w-2.5" />
                    {timeAgo(alert.timestamp)}
                  </div>
                </div>
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="shrink-0 text-[10px] font-medium text-gray-500 hover:text-green-600 border border-gray-200 hover:border-green-300 bg-white rounded px-2 py-0.5 transition-colors"
                >
                  Resolve
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
