'use client';

import { Calendar, CheckCircle, Clock, XCircle, AlertTriangle, Navigation, Zap } from 'lucide-react';
import type { OperatorTripStatistics } from '@/data/operator/trips';

interface OperatorTripStatsCardsProps {
  stats: OperatorTripStatistics;
}

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

function StatCard({ label, count, icon, bgColor, borderColor, iconBg }: StatCardProps) {
  return (
    <div
      className={`${bgColor} ${borderColor} rounded-xl shadow-sm border-2 p-5 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${iconBg} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-gray-800 leading-none">{count}</p>
          <p className="text-xs font-medium text-gray-500 mt-1 leading-tight">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function OperatorTripStatsCards({ stats }: OperatorTripStatsCardsProps) {
  const cards: StatCardProps[] = [
    {
      label: 'Total Trips',
      count: stats.totalTrips,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      label: "Today's Trips",
      count: stats.todaysTrips,
      icon: <Zap className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
    },
    {
      label: 'In Transit',
      count: stats.inTransitTrips,
      icon: <Navigation className="w-5 h-5 text-orange-600" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
    },
    {
      label: 'Pending',
      count: stats.pendingTrips,
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
    },
    {
      label: 'Active',
      count: stats.activeTrips,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Completed',
      count: stats.completedTrips,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Delayed',
      count: stats.delayedTrips,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Cancelled',
      count: stats.cancelledTrips,
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
