"use client"

import { useState } from "react"
import { Header } from "@/components/operator/header"
import { RevenueAnalytics, SalaryManagement } from "@/components/operator/revenue"
import { Tabs } from "@/components/operator/tabs"

export default function RevenueManagement() {
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        pageTitle="Revenue Management" 
        pageDescription="Analyze bus revenue, ticket sales, and manage staff salaries"
      />
      
      <div className="p-6">
        <Tabs tabs={tabs} defaultValue="revenue" onValueChange={setActiveTab} />
      </div>
    </div>
  )
}
