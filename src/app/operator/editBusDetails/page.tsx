"use client"
import { Sidebar } from "@/components/operator/sidebar"
import { Header } from "@/components/shared/header"
import { EditBusDetailsForm } from "@/components/operator/edit-bus-details-form"
import { ChevronRight } from "lucide-react"

export default function EditBusDetails() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar activeItem="permits" /> */}

      <div className="flex-1">
        <Header />

        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Route Permit</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Edit Bus Details</span>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Bus Details</h1>
            <p className="text-gray-600">Update bus information for your route permit</p>
          </div>

          {/* Edit Bus Details Form */}
          <EditBusDetailsForm />
        </div>
      </div>
    </div>
  )
}
