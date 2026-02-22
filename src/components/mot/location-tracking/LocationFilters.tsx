'use client';

import React from 'react';
import { Search, Filter, RefreshCw, Settings, Maximize2 } from 'lucide-react';

interface FilterState {
  search: string;
  status: string;
  routeId: string;
  operatorId: string;
  showOnlyActive: boolean;
  showOfflineDevices: boolean;
}

interface LocationFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filterOptions: {
    routes: Array<{ id: string; name: string }>;
  };
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  isLoading: boolean;
  filteredCount: number;
  totalCount: number;
}

export function LocationFilters({
  filters,
  onFiltersChange,
  filterOptions,
  autoRefresh,
  onAutoRefreshChange,
  refreshInterval,
  onRefreshIntervalChange,
  isLoading,
  filteredCount,
  totalCount
}: LocationFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search trips, buses, routes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="delayed">Delayed</option>
            <option value="on_time">On Time</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Route Filter */}
        <div className="lg:w-48">
          <select
            value={filters.routeId}
            onChange={(e) => handleFilterChange('routeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Routes</option>
            {filterOptions.routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters & Settings Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showOnlyActive}
              onChange={(e) => handleFilterChange('showOnlyActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Active only</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showOfflineDevices}
              onChange={(e) => handleFilterChange('showOfflineDevices', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Show offline</span>
          </label>
        </div>

        {/* Auto Refresh Settings */}
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Auto refresh</span>
          </label>

          {autoRefresh && (
            <div className="flex items-center gap-2">
              <select
                value={refreshInterval}
                onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredCount} of {totalCount} trips
        </div>
      </div>
    </div>
  );
}