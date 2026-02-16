'use client';

import React from 'react';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface OperatorPermitStatsCardsProps {
  stats?: {
    totalPermits?: number;
    activePermits?: number;
    inactivePermits?: number;
    expiringSoonPermits?: number;
    permitsByRouteGroup?: Record<string, number>;
  } | null;
  loading?: boolean;
}

export function OperatorPermitStatsCards({ stats, loading = false }: OperatorPermitStatsCardsProps) {
  // Provide default values when stats is null/undefined
  const safeStats = stats || {
    totalPermits: 0,
    activePermits: 0,
    inactivePermits: 0,
    expiringSoonPermits: 0,
    permitsByRouteGroup: {}
  };

  // Calculate derived values
  const totalRouteGroups = Object.keys(safeStats.permitsByRouteGroup || {}).length;
  const expiringSoonCount = safeStats.expiringSoonPermits || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {/* Total Permits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-7 w-12 rounded inline-block"></span>
                ) : (
                  (safeStats.totalPermits || 0).toLocaleString()
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Total Permits</p>
          </div>
        </div>
      </div>

      {/* Active Permits */}
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
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-7 w-12 rounded inline-block"></span>
                ) : (
                  (safeStats.activePermits || 0).toLocaleString()
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
      </div>

      {/* Inactive Permits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-7 w-12 rounded inline-block"></span>
                ) : (
                  (safeStats.inactivePermits || 0).toLocaleString()
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Inactive</p>
          </div>
        </div>
      </div>

      {/* Expiring Soon */}
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
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-7 w-12 rounded inline-block"></span>
                ) : (
                  (safeStats.expiringSoonPermits || 0).toLocaleString()
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Expiring Soon</p>
          </div>
        </div>
      </div>

      {/* Route Groups Covered */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-7 w-12 rounded inline-block"></span>
                ) : (
                  totalRouteGroups.toLocaleString()
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Route Groups</p>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              expiringSoonCount > 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                expiringSoonCount > 0 ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-baseline">
              <p className={`text-lg font-semibold ${
                expiringSoonCount > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {loading ? (
                  <span className="animate-pulse bg-gray-200 h-6 w-16 rounded inline-block"></span>
                ) : (
                  expiringSoonCount > 0 ? 'Action Needed' : 'Good Standing'
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500">Compliance Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}