'use client';

import {
  Users,
  Shield,
  Truck,
  Clock,
  UserCheck,
  CircleDot,
  Car,
  UserX,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';
import type { UserStatsData } from '@/data/admin/users';

interface UserStatsCardsProps {
  stats: UserStatsData | null;
  loading?: boolean;
}

export function UserStatsCards({ stats, loading = false }: UserStatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border-2 p-5 animate-pulse bg-gray-50 border-gray-200"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-7 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats.total,
      icon: Users,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: UserCheck,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon: UserX,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-600',
    },
    {
      label: 'Suspended',
      value: stats.suspended,
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-600',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: UserPlus,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-600',
    },
    {
      label: 'MOT Officers',
      value: stats.byType.mot,
      icon: Shield,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-600',
    },
    {
      label: 'Timekeepers',
      value: stats.byType.timekeeper,
      icon: Clock,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-600',
    },
    {
      label: 'Operators',
      value: stats.byType.operator,
      icon: Truck,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600',
    },
    {
      label: 'Conductors',
      value: stats.byType.conductor,
      icon: CircleDot,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
    {
      label: 'Drivers',
      value: stats.byType.driver,
      icon: Car,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      label: 'Passengers',
      value: stats.byType.passenger,
      icon: Users,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bgColor} ${card.borderColor} rounded-xl shadow-sm border-2 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {card.label}
            </span>
            <div className={`${card.iconBg} ${card.iconColor} p-1.5 rounded-lg`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.textColor}`}>
            {card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
