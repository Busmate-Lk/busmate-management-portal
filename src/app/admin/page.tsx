'use client';

import { RefreshCw, Radio } from 'lucide-react';
import { useSetPageMetadata } from '@/context/PageMetadata';
import { useDashboard } from '@/hooks/useDashboard';
import {
  DashboardKPICards,
  DashboardTrendsChart,
  DashboardSystemHealth,
  DashboardAlertsWidget,
  DashboardUserStats,
  DashboardActivityFeed,
  DashboardQuickActions,
  DashboardServiceStatus,
} from '@/components/admin/dashboard';

export default function AdminDashboardPage() {
  useSetPageMetadata({
    title: 'System Dashboard',
    description: 'Real-time overview of system performance, user activity, and key metrics',
    activeItem: 'dashboard',
  });

  const {
    kpis,
    trendHistory,
    activity,
    services,
    userDistribution,
    activeAlerts,
    loading,
    lastRefresh,
    isLive,
    refresh,
    toggleLive,
  } = useDashboard({ refreshInterval: 5000 });

  return (
    <div className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Last updated:{' '}
            <span className="font-medium">
              {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <button
            onClick={toggleLive}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isLive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>

          {/* Manual refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Row 1: KPI Cards ─────────────────────────────────────── */}
      <DashboardKPICards kpis={kpis} loading={loading} />

      {/* ── Row 2: Trends chart + System health ─────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardTrendsChart trendHistory={trendHistory} loading={loading} />
        </div>
        <div className="xl:col-span-1">
          <DashboardSystemHealth services={services} loading={loading} />
        </div>
      </div>

      {/* ── Row 3: Alerts + Service status + User distribution ───── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardAlertsWidget alerts={activeAlerts} loading={loading} />
        <DashboardServiceStatus services={services} loading={loading} />
        <DashboardUserStats userDistribution={userDistribution} loading={loading} />
      </div>

      {/* ── Row 4: Activity feed + Quick actions ─────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardActivityFeed activity={activity} loading={loading} />
        </div>
        <div className="xl:col-span-1">
          <DashboardQuickActions />
        </div>
      </div>
    </div>
  );
}
