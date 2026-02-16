"use client"

import { useState } from "react"
import { Sidebar } from "@/components/operator/sidebar"
import { Header } from "@/components/shared/header"
import { RouteDetailsForm } from "@/components/operator/route-details-form"
import { RoutePreview } from "@/components/operator/route-preview"
import { ResourceAssignment } from "@/components/operator/resource-assignment"
import { ChevronRight } from "lucide-react"

export default function EditSchedule() {
  const [routeData, setRouteData] = useState({
    routeName: "",
    startLocation: "",
    endLocation: "",
    stops: ["City Center", "Mall Plaza"],
    frequency: "Daily",
    departureTime: "",
    arrivalTime: "",
    selectedBus: "",
    selectedDriver: "",
    selectedConductor: "",
  })

  const handleSaveRoute = () => {
    console.log("Save route:", routeData)
  }

  const handleCancel = () => {
    console.log("Cancel route editing")
  }

  const updateRouteData = (field: string, value: any) => {
    setRouteData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar activeItem="schedule" /> */}

      <div className="flex-1">
        <Header />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span>Routes</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-blue-600">Add Route</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Schedule</h1>
            <p className="text-gray-600">Create a new bus route and assign resources</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Route Details - Left Side */}
            <div className="lg:col-span-2">
              <RouteDetailsForm routeData={routeData} onUpdate={updateRouteData} />
            </div>

            {/* Route Preview - Right Side */}
            <div className="lg:col-span-1">
              <RoutePreview stops={routeData.stops} />
            </div>
          </div>

          {/* Resource Assignment */}
          <ResourceAssignment routeData={routeData} onUpdate={updateRouteData} />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRoute}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Route
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
