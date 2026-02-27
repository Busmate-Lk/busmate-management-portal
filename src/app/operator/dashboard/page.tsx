"use client"

import { useState, useCallback } from "react"
import { useSetPageMetadata } from "@/context/PageContext"
import { 
  KPICards,
  LiveFleetStatus,
  TripAnalytics,
  MaintenanceAlerts,
  RevenueOverview,
  DashboardCharts,
  LiveAlerts
} from "@/components/operator/dashboard"
import {
  operatorKPIs,
  busStatuses,
  tripSummary,
  maintenanceAlerts,
  revenueMetrics,
  liveAlerts,
  revenueChartData,
  tripAnalyticsData,
  fleetUtilizationData,
  fuelConsumptionData,
  onTimePerformanceData
} from "./data"

export default function Dashboard() {
  useSetPageMetadata({
    title: 'Operator Dashboard',
    description: 'Comprehensive overview of your fleet operations, revenue, and performance metrics',
    activeItem: 'dashboard',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Dashboard' }],
    padding: 0,
  })

  const [alerts, setAlerts] = useState(liveAlerts)

  // Handle alert resolution
  const handleResolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true } 
          : alert
      )
    )
  }, [])

  return (
    <div className="p-4 lg:p-6 space-y-6">
        {/* KPI Cards - Top Section */}
        <section>
          <KPICards kpis={operatorKPIs} />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Insights */}
          <div className="xl:col-span-2 space-y-6">
            {/* Live Fleet Status */}
            <LiveFleetStatus buses={busStatuses} />
            
            {/* Trip Analytics */}
            <TripAnalytics tripSummary={tripSummary} />
            
            {/* Charts Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Trends</h2>
              <DashboardCharts
                revenueData={revenueChartData}
                tripAnalyticsData={tripAnalyticsData}
                fleetUtilizationData={fleetUtilizationData}
                fuelConsumptionData={fuelConsumptionData}
                onTimePerformanceData={onTimePerformanceData}
              />
            </div>
          </div>

          {/* Right Column - Alerts & Revenue */}
          <div className="space-y-6">
            {/* Live Alerts */}
            <LiveAlerts 
              alerts={alerts} 
              onResolveAlert={handleResolveAlert}
            />
            
            {/* Revenue Overview */}
            <RevenueOverview revenueMetrics={revenueMetrics} />
            
            {/* Maintenance Alerts */}
            <MaintenanceAlerts alerts={maintenanceAlerts} />
          </div>
        </div>
    </div>
  )
}
