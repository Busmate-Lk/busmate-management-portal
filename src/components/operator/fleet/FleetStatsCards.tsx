'use client';

import React from 'react';
import { Bus, CheckCircle, XCircle, Users, Gauge, MapPin } from 'lucide-react';

interface FleetStatsCardsProps {
  stats: {
    totalBuses: { count: number; change?: string };
    activeBuses: { count: number; change?: string };
    inactiveBuses: { count: number; change?: string };
    averageCapacity: { count: number; change?: string };
    totalCapacity: { count: number; change?: string };
    pendingMaintenance: { count: number; change?: string };
  };
}

export function FleetStatsCards({ stats }: FleetStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {/* Total Buses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalBuses.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Total Buses</p>
            {stats.totalBuses.change && (
              <p className="text-xs text-green-600 mt-1">{stats.totalBuses.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Buses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeBuses.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Active</p>
            {stats.activeBuses.change && (
              <p className="text-xs text-green-600 mt-1">{stats.activeBuses.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Inactive Buses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inactiveBuses.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Inactive</p>
            {stats.inactiveBuses.change && (
              <p className="text-xs text-red-600 mt-1">{stats.inactiveBuses.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Average Capacity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gauge className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.averageCapacity.count)}
              </p>
            </div>
            <p className="text-sm text-gray-500">Avg Capacity</p>
            {stats.averageCapacity.change && (
              <p className="text-xs text-green-600 mt-1">{stats.averageCapacity.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Total Capacity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCapacity.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Total Capacity</p>
            {stats.totalCapacity.change && (
              <p className="text-xs text-green-600 mt-1">{stats.totalCapacity.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Maintenance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingMaintenance.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Maintenance Due</p>
            {stats.pendingMaintenance.change && (
              <p className="text-xs text-yellow-600 mt-1">{stats.pendingMaintenance.change}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}