'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '@/lib/services/DashboardService';
import { 
  kpiMetrics, 
  fleetDistributionData, 
  routeAnalyticsData, 
  permitStatusData, 
  operatorPerformanceData,
  monthlyTrendData,
  geographicDistributionData,
  capacityUtilizationData,
  systemAlerts, 
  liveStats, 
  quickActions,
  SystemAlert,
  LiveStat,
  DashboardKPI
} from './data';

// Import components
import { KPICards } from '@/components/mot/dashboard/KPICards';
import {
  FleetDistributionChart,
  RouteAnalyticsChart,
  PermitStatusChart,
  OperatorPerformanceChart,
  MonthlyTrendChart,
  GeographicDistributionChart,
  CapacityUtilizationChart,
} from '@/components/mot/dashboard/DashboardCharts';
import { SystemAlerts } from '@/components/mot/dashboard/SystemAlerts';
import { LiveStats } from '@/components/mot/dashboard/LiveStats';
import { QuickActions } from '@/components/mot/dashboard/QuickActions';
import { useSetPageMetadata } from '@/context/PageContext';

interface DashboardData {
  kpis: DashboardKPI[];
  alerts: SystemAlert[];
  liveStats: LiveStat[];
}

export default function AdminDashboardPage() {
  useSetPageMetadata({
    title: 'MOT Admin Dashboard',
    description: 'Comprehensive overview of the transport management system',
    activeItem: 'dashboard',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Dashboard' }],
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    kpis: kpiMetrics,
    alerts: systemAlerts,
    liveStats: liveStats
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealApi, setUseRealApi] = useState(false); // Toggle for real API vs dummy data

  // Load dashboard data from API or dummy data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useRealApi) {
        // Use real API services
        const [metricsResult, alertsResult, healthResult] = await Promise.allSettled([
          DashboardService.getDashboardMetrics(),
          DashboardService.getSystemAlerts(),
          DashboardService.getSystemHealth()
        ]);

        // Transform API data to dashboard format
        const transformedKpis: DashboardKPI[] = [];
        
        if (metricsResult.status === 'fulfilled') {
          const metrics = metricsResult.value;
          transformedKpis.push(
            {
              title: 'Total Buses',
              value: metrics.totalBuses,
              change: 5.2,
              trend: 'up',
              icon: 'bus',
              color: 'blue'
            },
            {
              title: 'Active Operators',
              value: metrics.activeOperators,
              change: 2.1,
              trend: 'up',
              icon: 'users',
              color: 'green'
            },
            {
              title: 'Total Routes',
              value: metrics.totalRoutes,
              change: -1.3,
              trend: 'down',
              icon: 'route',
              color: 'purple'
            },
            {
              title: 'Valid Permits',
              value: metrics.validPermits,
              change: 3.7,
              trend: 'up',
              icon: 'shield',
              color: 'orange'
            },
            {
              title: 'Active Schedules',
              value: metrics.activeSchedules,
              change: 1.8,
              trend: 'up',
              icon: 'calendar',
              color: 'teal'
            },
            {
              title: 'Active Trips',
              value: metrics.activeTrips,
              change: 12.4,
              trend: 'up',
              icon: 'activity',
              color: 'indigo'
            }
          );
        }

        const transformedAlerts = alertsResult.status === 'fulfilled' 
          ? alertsResult.value.map((alert: any) => ({
              ...alert,
              resolved: false // Add missing resolved property
            }))
          : systemAlerts;
        const transformedLiveStats = healthResult.status === 'fulfilled' 
          ? [
              {
                title: 'System Uptime',
                value: healthResult.value.uptime,
                unit: '%',
                status: 'healthy' as const,
                lastUpdated: new Date().toISOString()
              },
              {
                title: 'Avg Response Time',
                value: healthResult.value.responseTime,
                unit: 'ms',
                status: healthResult.value.responseTime > 500 ? 'critical' as const : 'healthy' as const,
                lastUpdated: new Date().toISOString()
              },
              ...liveStats.slice(2) // Keep other dummy stats
            ]
          : liveStats;

        setDashboardData({
          kpis: transformedKpis.length > 0 ? transformedKpis : kpiMetrics,
          alerts: transformedAlerts,
          liveStats: transformedLiveStats
        });
      } else {
        // Use dummy data with simulated loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardData({
          kpis: kpiMetrics,
          alerts: systemAlerts,
          liveStats: liveStats
        });
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
      
      // Fallback to dummy data
      setDashboardData({
        kpis: kpiMetrics,
        alerts: systemAlerts,
        liveStats: liveStats
      });
    } finally {
      setLoading(false);
    }
  }, [useRealApi]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle alert resolution
  const handleResolveAlert = useCallback((alertId: string) => {
    setDashboardData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    }));
  }, []);

  // Handle live stats refresh
  const handleRefreshStats = useCallback(async () => {
    if (useRealApi) {
      try {
        const healthResult = await DashboardService.getSystemHealth();
        setDashboardData(prev => ({
          ...prev,
          liveStats: prev.liveStats.map(stat => {
            if (stat.title === 'System Uptime') {
              return { ...stat, value: healthResult.uptime, lastUpdated: new Date().toISOString() };
            }
            if (stat.title === 'Avg Response Time') {
              return { 
                ...stat, 
                value: healthResult.responseTime, 
                status: healthResult.responseTime > 500 ? 'critical' as const : 'healthy' as const,
                lastUpdated: new Date().toISOString() 
              };
            }
            return { ...stat, lastUpdated: new Date().toISOString() };
          })
        }));
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }
    } else {
      // Simulate refresh with updated dummy data
      setDashboardData(prev => ({
        ...prev,
        liveStats: prev.liveStats.map(stat => ({
          ...stat,
          lastUpdated: new Date().toISOString(),
          // Simulate some value changes
          value: stat.title === 'Active Trips' 
            ? Math.floor(Math.random() * 20) + 70
            : stat.value
        }))
      }));
    }
  }, [useRealApi]);

  if (error && useRealApi) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={loadDashboardData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full"
              >
                Retry
              </button>
              <button
                onClick={() => setUseRealApi(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full"
              >
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                MOT Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive overview of the transport management system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={useRealApi}
                    onChange={(e) => setUseRealApi(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Use Real API</span>
                </label>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Dashboard Content */}
      <div className="mx-auto">
        {/* KPI Cards */}
        <KPICards kpiData={dashboardData.kpis} loading={loading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Fleet Distribution */}
          <FleetDistributionChart data={fleetDistributionData} />
          
          {/* Route Analytics */}
          <RouteAnalyticsChart data={routeAnalyticsData} />
          
          {/* Permit Status */}
          <PermitStatusChart data={permitStatusData} />
          
          {/* Geographic Distribution */}
          <GeographicDistributionChart data={geographicDistributionData} />
          
          {/* Capacity Utilization */}
          <CapacityUtilizationChart data={capacityUtilizationData} />
        </div>

        {/* Wide Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Operator Performance */}
          <OperatorPerformanceChart data={operatorPerformanceData} />
          
          {/* Monthly Trends */}
          <MonthlyTrendChart data={monthlyTrendData} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* System Alerts - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <SystemAlerts 
              alerts={dashboardData.alerts}
              onResolveAlert={handleResolveAlert}
              loading={loading}
            />
          </div>
          
          {/* Live Stats - Takes 1 column on xl screens */}
          <div className="xl:col-span-1">
            <LiveStats 
              stats={dashboardData.liveStats}
              onRefresh={handleRefreshStats}
              loading={loading}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} loading={loading} />

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>
              BusMate MOT Admin Dashboard • Built with Next.js & Chart.js
              {useRealApi ? ' • Connected to Live API' : ' • Using Demo Data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}    