"use client"

import { Layout } from "@/components/shared/layout"
import { StatsCards, QuickActions, ActivityFeed } from "@/components/admin/dashboard"
import { UserGrowthTrendsChart } from "@/components/admin/dashboard/user-growth-trends-chart"

export default function AdminDashboardPage() {
  return (
    <Layout
      activeItem="dashboard"
      pageTitle="System Dashboard"
      pageDescription="Monitor system performance, user activity, and key metrics"
      role="admin"
    >
      <div className="space-y-6">
        <StatsCards />
        
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center shadow-inner">
            <div className="w-full h-full flex items-center justify-center">
              <UserGrowthTrendsChart />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </Layout>
  )
}
