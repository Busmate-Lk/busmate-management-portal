"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, Printer } from "lucide-react"
import { BusDetailsPanel } from "@/components/operator/bus-details-panel"
import { BusSeatingMap } from "@/components/operator/bus-seating-map"
import { Header } from "@/components/shared/header"

export default function BusSeatView() {
  const [selectedBus, setSelectedBus] = useState("Bus #001")
  const [showAllSeats, setShowAllSeats] = useState(true)

  const busOptions = ["Bus #001", "Bus #002", "Bus #003", "Bus #004"]

  const handleBack = () => {
    console.log("Navigate back")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-blue-600">BUSMATE LK</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {busOptions.map((bus) => (
                  <option key={bus} value={bus}>
                    {bus}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus Details Panel */}
          <div className="lg:col-span-1">
            <BusDetailsPanel />
          </div>

          {/* Bus Seating Map */}
          <div className="lg:col-span-2">
            <BusSeatingMap showAllSeats={showAllSeats} onToggleShowAll={setShowAllSeats} />
          </div>
        </div>
      </div>
    </div>
  )
}
