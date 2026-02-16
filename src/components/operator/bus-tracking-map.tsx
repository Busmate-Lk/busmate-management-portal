"use client"

import { useState } from "react"
import { Plus, Minus, RotateCcw } from "lucide-react"

interface BusTrackingMapProps {
  selectedBus: string | null
}

export function BusTrackingMap({ selectedBus }: BusTrackingMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  const busLocations = [
    { id: "A101", x: 15, y: 25, status: "On Time" },
    { id: "B205", x: 25, y: 35, status: "Delayed" },
    { id: "C312", x: 45, y: 20, status: "On Time" },
    { id: "D418", x: 35, y: 45, status: "Delayed" },
    { id: "E521", x: 55, y: 30, status: "On Time" },
    { id: "F622", x: 65, y: 40, status: "On Time" },
    { id: "G723", x: 40, y: 60, status: "Delayed" },
    { id: "H824", x: 70, y: 55, status: "On Time" },
    { id: "I925", x: 20, y: 70, status: "On Time" },
  ]

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
  }

  return (
    <div className="relative w-full h-full bg-linear-to-br from-blue-100 to-blue-200 overflow-hidden">
      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          transform: `scale(${zoomLevel})`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' strokeWidth='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
        }}
      >
        {/* Water Bodies */}
        <div className="absolute top-0 left-0 w-1/3 h-2/3 bg-blue-300 opacity-60 rounded-br-3xl"></div>
        <div className="absolute bottom-0 right-0 w-2/5 h-1/2 bg-blue-300 opacity-60 rounded-tl-3xl"></div>

        {/* Land Areas */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-green-200 opacity-70 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-green-200 opacity-70 rounded-lg"></div>
        <div className="absolute bottom-1/3 left-1/2 w-24 h-16 bg-green-200 opacity-70 rounded-xl"></div>
        <div className="absolute top-1/2 left-1/6 w-12 h-12 bg-green-200 opacity-70 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-18 h-18 bg-green-200 opacity-70 rounded-lg"></div>

        {/* Roads */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-yellow-400 opacity-80 transform -rotate-12"></div>
        <div className="absolute top-1/3 left-0 w-3/4 h-1 bg-yellow-300 opacity-70 transform rotate-6"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2/3 h-1 bg-yellow-300 opacity-70 transform -rotate-3"></div>

        {/* City Labels */}
        <div className="absolute top-16 left-1/4 text-xs font-medium text-gray-700">Soly</div>
        <div className="absolute top-1/4 left-1/2 text-xs font-medium text-gray-700">Macusalt</div>
        <div className="absolute top-1/3 left-1/6 text-xs font-medium text-gray-700">Milth Equare</div>
        <div className="absolute top-1/2 right-1/3 text-xs font-medium text-gray-700">Nanine</div>
        <div className="absolute top-2/3 left-1/3 text-xs font-medium text-gray-700">Kegit</div>
        <div className="absolute bottom-1/4 right-1/6 text-xs font-medium text-gray-700">Vail</div>
        <div className="absolute bottom-1/3 left-1/2 text-xs font-medium text-gray-700">Narch</div>
        <div className="absolute bottom-1/6 left-1/3 text-xs font-medium text-gray-700">Fosille</div>
        <div className="absolute bottom-1/4 left-1/4 text-xs font-medium text-gray-700">Treveloove</div>
        <div className="absolute bottom-1/6 left-1/6 text-xs font-medium text-gray-700">Hoiple</div>
        <div className="absolute bottom-1/4 right-1/3 text-xs font-medium text-gray-700">Sperien</div>
        <div className="absolute bottom-1/6 right-1/4 text-xs font-medium text-gray-700">Garsing</div>

        {/* Bus Markers */}
        {busLocations.map((bus) => (
          <div
            key={bus.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
              selectedBus === bus.id ? "scale-125 z-20" : "hover:scale-110 z-10"
            }`}
            style={{ left: `${bus.x}%`, top: `${bus.y}%` }}
          >
            <div className={`relative ${selectedBus === bus.id ? "animate-bounce" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                  bus.status === "On Time" ? "bg-pink-500" : "bg-red-600"
                }`}
              >
                🚌
              </div>
              {selectedBus === bus.id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  Bus #{bus.id}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
