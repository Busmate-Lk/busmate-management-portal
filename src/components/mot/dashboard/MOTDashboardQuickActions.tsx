'use client';

import Link from 'next/link';
import { Route, Bus, Users, Shield, Calendar, Activity, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { QuickAction } from '@/data/mot/dashboard';

const ICON_MAP: Record<string, LucideIcon> = {
  route: Route,
  bus: Bus,
  users: Users,
  shield: Shield,
  calendar: Calendar,
  activity: Activity,
};

const COLOR_STYLES: Record<QuickAction['color'], { bg: string; border: string; icon: string }> = {
  blue:   { bg: 'bg-blue-50', border: 'border-blue-100 hover:border-blue-300', icon: 'bg-blue-100 text-blue-600' },
  green:  { bg: 'bg-green-50', border: 'border-green-100 hover:border-green-300', icon: 'bg-green-100 text-green-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100 hover:border-purple-300', icon: 'bg-purple-100 text-purple-600' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100 hover:border-orange-300', icon: 'bg-orange-100 text-orange-600' },
  red:    { bg: 'bg-red-50', border: 'border-red-100 hover:border-red-300', icon: 'bg-red-100 text-red-600' },
  teal:   { bg: 'bg-teal-50', border: 'border-teal-100 hover:border-teal-300', icon: 'bg-teal-100 text-teal-600' },
};

interface MOTDashboardQuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
}

export function MOTDashboardQuickActions({ actions, loading = false }: MOTDashboardQuickActionsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-5 w-28 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => {
          const IconComponent = ICON_MAP[action.icon] || Activity;
          const colors = COLOR_STYLES[action.color];

          return (
            <Link
              key={action.id}
              href={action.href}
              className={`group flex flex-col items-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${colors.bg} ${colors.border}`}
            >
              <div className={`p-2.5 rounded-lg mb-2 ${colors.icon}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">{action.label}</span>
              <span className="text-[10px] text-gray-500 text-center mt-0.5 line-clamp-1">{action.description}</span>
              <ChevronRight className="h-3 w-3 text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
