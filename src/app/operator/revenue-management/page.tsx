"use client"

import { useState } from "react"
import { useSetPageActions, useSetPageMetadata } from "@/context/PageContext"
import { RevenueAnalytics, SalaryManagement } from "@/components/operator/revenue"
import { Tabs } from "@/components/operator/tabs"
import { Download, Plus, RefreshCw } from "lucide-react"

export default function RevenueManagement() {
  useSetPageMetadata({
    title: 'Revenue Management',
    description: 'Analyze bus revenue, ticket sales, and manage staff salaries',
    activeItem: 'revenue',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Revenue Management' }],
    padding: 0,
  })

  useSetPageActions(
    <>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={'w-4 h-4'} />
        Refresh
      </button>

      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        <Download className="w-4 h-4" />
        Export
      </button>
    </>
  );

  const [activeTab, setActiveTab] = useState("revenue")

  const tabs = [
    {
      value: "revenue",
      label: "Revenue Analytics",
      content: <RevenueAnalytics />,
    },
    {
      value: "salary",
      label: "Salary Management",
      content: <SalaryManagement />,
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-full">
        <Tabs tabs={tabs} defaultValue="revenue" onValueChange={setActiveTab} />
    </div>
  )
}
