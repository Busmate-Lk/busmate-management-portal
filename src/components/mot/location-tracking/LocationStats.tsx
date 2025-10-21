'use client';

import React from 'react';
import {
  MapPin,
  Activity,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface LocationStatsProps {
  stats: {
    totalActiveTrips: number;
    onlineDevices: number;
    offlineDevices: number;
    averageSpeed: number;
    tripsOnTime: number;
    tripsDelayed: number;
  };
  lastUpdate: Date | null;
}

export function LocationStats({ stats, lastUpdate }: LocationStatsProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const getOnlinePercentage = () => {
    const total = stats.onlineDevices + stats.offlineDevices;
    if (total === 0) return 0;
    return Math.round((stats.onlineDevices / total) * 100);
  };

  const getOnTimePercentage = () => {
    const total = stats.tripsOnTime + stats.tripsDelayed;
    if (total === 0) return 0;
    return Math.round((stats.tripsOnTime / total) * 100);
  };

  const statsCards = [
    {
      title: 'Active Trips',
      value: stats.totalActiveTrips,
      icon: MapPin,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      subtitle: 'Currently tracking',
    },
    {
      title: 'Online Devices',
      value: stats.onlineDevices,
      icon: Activity,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
      subtitle: `${stats.offlineDevices} offline (${getOnlinePercentage()}%)`,
    },
    {
      title: 'Avg Speed',
      value: `${stats.averageSpeed.toFixed(1)} km/h`,
      icon: Zap,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-500',
      subtitle: 'Fleet average',
    },
    {
      title: 'On Time',
      value: stats.tripsOnTime,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
      subtitle: `${stats.tripsDelayed} delayed (${getOnTimePercentage()}%)`,
    },
    {
      title: 'Delayed',
      value: stats.tripsDelayed,
      icon: AlertTriangle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-500',
      subtitle: 'Needs attention',
    },
    {
      title: 'Last Update',
      value: formatTime(lastUpdate),
      icon: Clock,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-500',
      subtitle: lastUpdate ? 'Auto refresh' : 'Manual refresh',
    },
  ];

  const colorMapping: Record<
    string,
    { bg: string; icon: string; border: string }
  > = {
    'bg-blue-100': {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200',
    },
    'bg-green-100': {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      border: 'border-green-200',
    },
    'bg-yellow-100': {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-100 text-yellow-600',
      border: 'border-yellow-200',
    },
    'bg-orange-100': {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
      border: 'border-orange-200',
    },
    'bg-gray-100': {
      bg: 'bg-gray-50',
      icon: 'bg-gray-100 text-gray-600',
      border: 'border-gray-200',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsCards.map((stat, index) => {
        const colors =
          colorMapping[stat.bgColor] || colorMapping['bg-gray-100'];
        return (
          <div
            key={index}
            className={`${colors.bg} rounded-xl border-2 ${colors.border} p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center">
              <div
                className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
