'use client';

import React from 'react';
import { Building, CheckCircle, XCircle, MapPin } from 'lucide-react';

interface TimekeeperStatsCardsProps {
  stats: {
    totalTimekeepers: { count: number; change?: string };
    activeTimekeepers: { count: number; change?: string };
    inactiveTimekeepers: { count: number; change?: string };
    provincesCount: { count: number; change?: string };
  };
}

export function TimekeeperStatsCards({ stats }: TimekeeperStatsCardsProps) {
  const cards = [
    {
      title: 'Total Timekeepers',
      value: stats.totalTimekeepers.count,
      change: stats.totalTimekeepers.change,
      icon: <Building className="w-7 h-7 text-blue-500" />,
      bg: 'bg-blue-50/60',
      iconBg: 'bg-blue-100',
      changeColor: 'text-green-600',
    },
    {
      title: 'Active Timekeepers',
      value: stats.activeTimekeepers.count,
      change: stats.activeTimekeepers.change,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bg: 'bg-green-50/60',
      iconBg: 'bg-green-100',
      changeColor: 'text-green-600',
    },
    {
      title: 'Inactive Timekeepers',
      value: stats.inactiveTimekeepers.count,
      change: stats.inactiveTimekeepers.change,
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bg: 'bg-purple-50/60',
      iconBg: 'bg-purple-100',
      changeColor: 'text-red-600',
    },
    {
      title: 'Provinces Covered',
      value: stats.provincesCount.count,
      change: stats.provincesCount.change,
      icon: <MapPin className="w-6 h-6 text-orange-500" />,
      bg: 'bg-orange-50/60',
      iconBg: 'bg-orange-100',
      changeColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`relative rounded-3xl ${card.bg} p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-200`}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>

            <div>
              <h3 className="text-gray-500 text-sm font-medium tracking-wide">
                {card.title}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mt-1">
                {card.value.toLocaleString()}
              </p>
              {card.change && (
                <p className={`text-sm mt-3 ${card.changeColor}`}>
                  {card.change}{' '}
                  <span className="text-gray-500 font-normal">vs last month</span>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
