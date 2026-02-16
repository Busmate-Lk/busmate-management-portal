"use client";

interface AnalyticsFiltersProps {
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedOperator: string;
  setSelectedOperator: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
}

export function AnalyticsFilters({
  selectedRegion,
  setSelectedRegion,
  selectedOperator,
  setSelectedOperator,
  selectedPeriod,
  setSelectedPeriod,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="all">All Regions</option>
        <option value="western">Western Province</option>
        <option value="central">Central Province</option>
        <option value="southern">Southern Province</option>
        <option value="northern">Northern Province</option>
      </select>

      <select
        value={selectedOperator}
        onChange={(e) => setSelectedOperator(e.target.value)}
        className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="all">All Operators</option>
        <option value="sltb">SLTB</option>
        <option value="private">Private</option>
      </select>

      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last 3 Months</option>
        <option value="365">Last Year</option>
      </select>
    </div>
  );
}
