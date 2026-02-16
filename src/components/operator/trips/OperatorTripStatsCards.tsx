'use client';

import { Calendar, CheckCircle, Clock, XCircle, AlertTriangle, Bus, FileText, MapPin } from 'lucide-react';

interface OperatorTripStatsCardsProps {
  stats: {
    totalTrips: { count: number; change?: string };
    activeTrips: { count: number; change?: string };
    completedTrips: { count: number; change?: string };
    pendingTrips: { count: number; change?: string };
    cancelledTrips: { count: number; change?: string };
    tripsWithPsp: { count: number; change?: string };
    tripsWithBus: { count: number; change?: string };
    inTransitTrips: { count: number; change?: string };
    todaysTrips: { count: number; change?: string };
  };
}

export function OperatorTripStatsCards({ stats }: OperatorTripStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
      {/* Total Trips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Total Trips</p>
            {stats.totalTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.totalTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Today's Trips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.todaysTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Today Trips</p>
            {stats.todaysTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.todaysTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Trips */}
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
                {stats.activeTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Active</p>
            {stats.activeTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.activeTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* In Transit Trips */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inTransitTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">In Transit</p>
            {stats.inTransitTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.inTransitTrips.change}</p>
            )}
          </div>
        </div>
      </div> */}

      {/* Completed Trips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Completed</p>
            {stats.completedTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.completedTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Trips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Pending</p>
            {stats.pendingTrips.change && (
              <p className="text-xs text-green-600 mt-1">{stats.pendingTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cancelled Trips */}
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
                {stats.cancelledTrips.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">Cancelled</p>
            {stats.cancelledTrips.change && (
              <p className="text-xs text-red-600 mt-1">{stats.cancelledTrips.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Trips with PSP */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.tripsWithPsp.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">With PSP</p>
            {stats.tripsWithPsp.change && (
              <p className="text-xs text-green-600 mt-1">{stats.tripsWithPsp.change}</p>
            )}
          </div>
        </div>
      </div>

      {/* Trips with Bus */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.tripsWithBus.count.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">With Bus</p>
            {stats.tripsWithBus.change && (
              <p className="text-xs text-green-600 mt-1">{stats.tripsWithBus.change}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}