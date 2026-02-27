'use client';

import React from 'react';
import { Bus, CheckCircle, XCircle, Wrench, Users, Gauge } from 'lucide-react';
import type { FleetStatistics } from '@/data/operator/buses';

interface FleetStatsCardsProps {
  stats: FleetStatistics;
  loading?: boolean;
}

function StatCard({
  icon,
  label,
  value,
  colorClass,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
  loading?: boolean;
}) {
  return (
    <div className={`rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${colorClass}`}>
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center bg-white/60">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
          {loading ? (
            <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FleetStatsCards({ stats, loading = false }: FleetStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        icon={<Bus className="w-5 h-5 text-blue-600" />}
        label="Total Buses"
        value={stats.totalBuses}
        colorClass="bg-blue-50 border-blue-200"
        loading={loading}
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        label="Active"
        value={stats.activeBuses}
        colorClass="bg-green-50 border-green-200"
        loading={loading}
      />
      <StatCard
        icon={<XCircle className="w-5 h-5 text-orange-600" />}
        label="Inactive"
        value={stats.inactiveBuses}
        colorClass="bg-orange-50 border-orange-200"
        loading={loading}
      />
      <StatCard
        icon={<Wrench className="w-5 h-5 text-yellow-600" />}
        label="Maintenance"
        value={stats.maintenanceBuses}
        colorClass="bg-yellow-50 border-yellow-200"
        loading={loading}
      />
      <StatCard
        icon={<Gauge className="w-5 h-5 text-purple-600" />}
        label="Avg. Capacity"
        value={`${stats.averageCapacity} seats`}
        colorClass="bg-purple-50 border-purple-200"
        loading={loading}
      />
      <StatCard
        icon={<Users className="w-5 h-5 text-teal-600" />}
        label="Total Seats"
        value={stats.totalCapacity}
        colorClass="bg-teal-50 border-teal-200"
        loading={loading}
      />
    </div>
  );
}
