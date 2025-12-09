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
      icon: <Building className="w-6 h-6" />,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200',
      changeColor: 'text-green-600',
    },
    {
      title: 'Active Timekeepers',
      value: stats.activeTimekeepers.count,
      change: stats.activeTimekeepers.change,
      icon: <CheckCircle className="w-6 h-6" />,
      bg: 'bg-green-50',
      iconBg: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200',
      changeColor: 'text-green-600',
    },
    {
      title: 'Inactive Timekeepers',
      value: stats.inactiveTimekeepers.count,
      change: stats.inactiveTimekeepers.change,
      icon: <XCircle className="w-6 h-6" />,
      bg: 'bg-red-50',
      iconBg: 'bg-red-100 text-red-600',
      borderColor: 'border-red-200',
      changeColor: 'text-red-600',
    },
    {
      title: 'Provinces Covered',
      value: stats.provincesCount.count,
      change: stats.provincesCount.change,
      icon: <MapPin className="w-6 h-6" />,
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100 text-orange-600',
      borderColor: 'border-orange-200',
      changeColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-xl ${card.bg} border-2 ${card.borderColor} p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-center">
            <div
              className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}
            >
              {card.icon}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {card.value.toLocaleString()}
              </p>
              {card.change && (
                <p className={`text-sm ${card.changeColor}`}>
                  {card.change}{' '}
                  <span className="text-gray-500 font-normal">
                    vs last month
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
