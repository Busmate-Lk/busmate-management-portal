"use client";

interface AnalyticsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AnalyticsTabs({ activeTab, setActiveTab }: AnalyticsTabsProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap space-x-1">
      <button
        onClick={() => setActiveTab("passenger")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "passenger"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Passenger Information
      </button>
      <button
        onClick={() => setActiveTab("bus")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "bus"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Bus Details
      </button>
      <button
        onClick={() => setActiveTab("journey")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "journey"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Journey Details
      </button>
      <button
        onClick={() => setActiveTab("ticket")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "ticket"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Ticket Information
      </button>
      <button
        onClick={() => setActiveTab("operational")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "operational"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Driver & Operational Insights
      </button>
      <button
        onClick={() => setActiveTab("revenue")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "revenue"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Revenue Insights
      </button>
    </div>
  );
}
