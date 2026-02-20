'use client';

import React from 'react';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle, Loader } from 'lucide-react';
import type { OperatorPermitStatistics } from '@/data/operator/permits';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  loading: boolean;
}

function StatCard({ icon, label, value, colorClass, loading }: StatCardProps) {
  return (
    <div className={`${colorClass} rounded-xl shadow-sm border-2 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-white/60">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-12 bg-white/60 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface PermitStatsCardsProps {
  stats: OperatorPermitStatistics | null;
  loading?: boolean;
}

export function PermitStatsCards({ stats, loading = false }: PermitStatsCardsProps) {
  const safeStats: OperatorPermitStatistics = stats ?? {
    totalPermits: 0,
    activePermits: 0,
    inactivePermits: 0,
    pendingPermits: 0,
    expiredPermits: 0,
    expiringSoonPermits: 0,
  };

  const cards = [
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      label: 'Total Permits',
      value: safeStats.totalPermits,
      colorClass: 'bg-blue-50 border-blue-200',
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'Active',
      value: safeStats.activePermits,
      colorClass: 'bg-green-50 border-green-200',
    },
    {
      icon: <XCircle className="w-5 h-5 text-gray-500" />,
      label: 'Inactive',
      value: safeStats.inactivePermits,
      colorClass: 'bg-gray-50 border-gray-200',
    },
    {
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      label: 'Pending',
      value: safeStats.pendingPermits,
      colorClass: 'bg-yellow-50 border-yellow-200',
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      label: 'Expired',
      value: safeStats.expiredPermits,
      colorClass: 'bg-red-50 border-red-200',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      label: 'Expiring Soon',
      value: safeStats.expiringSoonPermits,
      colorClass: 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} loading={loading} />
      ))}
    </div>
  );
}
