'use client';

import React from 'react';
import { LayoutList, Map } from 'lucide-react';

export type ViewType = 'table' | 'map';

interface ViewTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  tableCount?: number;
  mapCount?: number;
}

const TABS = [
  {
    id: 'table' as ViewType,
    label: 'List View',
    Icon: LayoutList,
  },
  {
    id: 'map' as ViewType,
    label: 'Map View',
    Icon: Map,
  },
];

export function ViewTabs({
  activeView,
  onViewChange,
  tableCount = 0,
  mapCount = 0,
}: ViewTabsProps) {
  const counts: Record<ViewType, number> = {
    table: tableCount,
    map: mapCount,
  };

  return (
    <div className="flex items-center">
      {/* Pill container */}
      <div
        className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-xl"
        role="tablist"
        aria-label="View switcher"
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeView === id;
          const count = counts[id];

          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onViewChange(id)}
              className={[
                'relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                isActive
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/[0.06]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/60',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-4 w-4 shrink-0 transition-colors duration-200',
                  isActive ? 'text-blue-600' : 'text-gray-400',
                ].join(' ')}
                aria-hidden="true"
              />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={[
                    'inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full text-[11px] font-semibold transition-colors duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300',
                  ].join(' ')}
                >
                  {count.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}