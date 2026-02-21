'use client';

import { RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { LiveStat } from '@/app/mot/(authenticated)/dashboard/data';

const STATUS_STYLE: Record<LiveStat['status'], { icon: React.ReactNode; cls: string }> = {
  healthy:  { icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,  cls: 'text-green-600' },
  warning:  { icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />, cls: 'text-amber-600' },
  critical: { icon: <XCircle className="h-3.5 w-3.5 text-red-500" />,        cls: 'text-red-600' },
};

interface LiveStatsProps {
  stats: LiveStat[];
  onRefresh: () => void;
  loading?: boolean;
}

export function LiveStats({ stats, onRefresh, loading = false }: LiveStatsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Live Stats</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map((stat) => {
            const style = STATUS_STYLE[stat.status];
            return (
              <div key={stat.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  {style.icon}
                  <span className="text-xs text-gray-700 truncate">{stat.title}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-bold ${style.cls}`}>
                    {stat.value}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">{stat.unit}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
