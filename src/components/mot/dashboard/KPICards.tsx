'use client';

import Link from 'next/link';
import {
  Bus,
  Users,
  Route,
  Shield,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { DashboardKPI } from '@/app/mot/dashboard/data';

const ICON_MAP: Record<string, React.ReactNode> = {
  bus:      <Bus className="h-6 w-6" />,
  users:    <Users className="h-6 w-6" />,
  route:    <Route className="h-6 w-6" />,
  shield:   <Shield className="h-6 w-6" />,
  calendar: <Calendar className="h-6 w-6" />,
  activity: <Activity className="h-6 w-6" />,
};

const COLOR_MAP: Record<string, { card: string; icon: string }> = {
  blue:   { card: 'bg-blue-50 border-blue-200',   icon: 'bg-blue-100 text-blue-600' },
  green:  { card: 'bg-green-50 border-green-200',  icon: 'bg-green-100 text-green-600' },
  purple: { card: 'bg-purple-50 border-purple-200', icon: 'bg-purple-100 text-purple-600' },
  orange: { card: 'bg-orange-50 border-orange-200', icon: 'bg-orange-100 text-orange-600' },
  teal:   { card: 'bg-teal-50 border-teal-200',   icon: 'bg-teal-100 text-teal-600' },
  indigo: { card: 'bg-indigo-50 border-indigo-200', icon: 'bg-indigo-100 text-indigo-600' },
};

interface KPICardsProps {
  kpiData: DashboardKPI[];
  loading?: boolean;
}

export function KPICards({ kpiData, loading = false }: KPICardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-28 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      {kpiData.map((kpi) => {
        const colors = COLOR_MAP[kpi.color] ?? COLOR_MAP.blue;
        const isPositive = kpi.trend === 'up';
        const isStable   = kpi.trend === 'stable';
        const icon = ICON_MAP[kpi.icon] ?? <Activity className="h-6 w-6" />;

        return (
          <div
            key={kpi.title}
            className={`rounded-xl border p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 ${colors.card}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <div className={`p-2 rounded-lg ${colors.icon}`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              isStable ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isStable ? <Minus className="h-3 w-3" /> : isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isStable ? 'No change' : `${isPositive ? '+' : ''}${kpi.change}% vs last month`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
