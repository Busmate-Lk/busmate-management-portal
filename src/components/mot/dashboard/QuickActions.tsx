'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { QuickAction } from '@/app/mot/(authenticated)/dashboard/data';

const COLOR_STYLE: Record<string, string> = {
  blue:   'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100',
  green:  'bg-green-50 border-green-100 hover:border-green-300 hover:bg-green-100',
  purple: 'bg-purple-50 border-purple-100 hover:border-purple-300 hover:bg-purple-100',
  orange: 'bg-orange-50 border-orange-100 hover:border-orange-300 hover:bg-orange-100',
  red:    'bg-red-50 border-red-100 hover:border-red-300 hover:bg-red-100',
  teal:   'bg-teal-50 border-teal-100 hover:border-teal-300 hover:bg-teal-100',
};

const TEXT_COLOR: Record<string, string> = {
  blue:   'text-blue-700',
  green:  'text-green-700',
  purple: 'text-purple-700',
  orange: 'text-orange-700',
  red:    'text-red-700',
  teal:   'text-teal-700',
};

interface QuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
}

export function QuickActions({ actions, loading = false }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => {
            const cardStyle = COLOR_STYLE[action.color] ?? COLOR_STYLE.blue;
            const textStyle = TEXT_COLOR[action.color] ?? TEXT_COLOR.blue;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group flex flex-col gap-2 p-3 rounded-lg border transition-all duration-150 ${cardStyle}`}
              >
                <p className={`text-xs font-semibold ${textStyle}`}>{action.title}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{action.description}</p>
                <ArrowRight className={`h-3 w-3 ${textStyle} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
