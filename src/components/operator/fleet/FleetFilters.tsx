'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { BusStatus, BusServiceType } from '@/data/operator/buses';

interface FleetFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: BusStatus | 'ALL';
  onStatusChange: (v: BusStatus | 'ALL') => void;
  serviceTypeFilter: BusServiceType | 'ALL';
  onServiceTypeChange: (v: BusServiceType | 'ALL') => void;
  onClearAll: () => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { value: BusStatus | 'ALL'; label: string; dotColor: string }[] = [
  { value: 'ALL',         label: 'All Statuses',  dotColor: 'bg-gray-400' },
  { value: 'ACTIVE',      label: 'Active',        dotColor: 'bg-green-500' },
  { value: 'INACTIVE',    label: 'Inactive',      dotColor: 'bg-orange-500' },
  { value: 'MAINTENANCE', label: 'Maintenance',   dotColor: 'bg-yellow-500' },
  { value: 'RETIRED',     label: 'Retired',       dotColor: 'bg-gray-500' },
];

const SERVICE_TYPE_OPTIONS: { value: BusServiceType | 'ALL'; label: string }[] = [
  { value: 'ALL',          label: 'All Types' },
  { value: 'SL',          label: 'SL (Normal)' },
  { value: 'SL_AC',       label: 'SL A/C' },
  { value: 'SEMI_LUXURY', label: 'Semi-Luxury' },
  { value: 'LUXURY',      label: 'Luxury' },
  { value: 'EXPRESS',     label: 'Express' },
];

export function FleetFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceTypeFilter,
  onServiceTypeChange,
  onClearAll,
  totalCount,
  filteredCount,
}: FleetFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [expanded, setExpanded] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) onSearchChange(localSearch);
    }, 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  useEffect(() => {
    if (search !== localSearch) setLocalSearch(search);
  }, [search]);

  const hasFilters =
    search !== '' ||
    statusFilter !== 'ALL' ||
    serviceTypeFilter !== 'ALL';

  const activeCount = [
    search && 'search',
    statusFilter !== 'ALL' && 'status',
    serviceTypeFilter !== 'ALL' && 'service',
  ].filter(Boolean).length;

  const handleClear = useCallback(() => {
    setLocalSearch('');
    onClearAll();
  }, [onClearAll]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Top bar */}
      <div className="p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search by plate number, model, driver, route…"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value as BusStatus | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Service type filter */}
        <select
          value={serviceTypeFilter}
          onChange={e => onServiceTypeChange(e.target.value as BusServiceType | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
        >
          {SERVICE_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear / count */}
        <div className="flex items-center gap-2 shrink-0">
          {hasFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
              {activeCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs rounded-full px-1.5 py-0.5 font-medium">
                  {activeCount}
                </span>
              )}
            </button>
          )}

          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredCount === totalCount
              ? `${totalCount} bus${totalCount !== 1 ? 'es' : ''}`
              : `${filteredCount} / ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full">
              Search: "{search}"
              <button onClick={() => { setLocalSearch(''); onSearchChange(''); }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full">
              Status: {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}
              <button onClick={() => onStatusChange('ALL')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {serviceTypeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs rounded-full">
              Type: {SERVICE_TYPE_OPTIONS.find(o => o.value === serviceTypeFilter)?.label}
              <button onClick={() => onServiceTypeChange('ALL')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
