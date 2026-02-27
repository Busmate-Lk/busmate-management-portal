'use client';

import { Users, Car, UserCheck, Clock, CheckCircle, Calendar } from 'lucide-react';
import type { StaffStats } from '@/data/operator/staff';

interface StaffStatsCardsProps {
  stats: StaffStats;
}

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

export function StaffStatsCards({ stats }: StaffStatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Total Staff',
      value: stats.totalStaff,
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Drivers',
      value: stats.totalDrivers,
      icon: <Car className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Conductors',
      value: stats.totalConductors,
      icon: <UserCheck className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Active Staff',
      value: stats.activeStaff,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Assigned Now',
      value: stats.assignedNow,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: 'On Leave',
      value: stats.onLeave,
      icon: <Calendar className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
        >
          <div className="flex items-center gap-3">
            <div className={`${card.iconBg} ${card.iconColor} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs font-medium text-gray-600 leading-tight">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
