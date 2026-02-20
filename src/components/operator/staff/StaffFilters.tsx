'use client';

import { Search, X, Filter } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { StaffStatus, ShiftStatus } from '@/data/operator/staff';

interface StaffFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  shiftFilter: string;
  setShiftFilter: (v: string) => void;
  totalCount: number;
  filteredCount: number;
  onClearAll?: () => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',       label: 'All Statuses' },
  { value: 'ACTIVE',    label: 'Active' },
  { value: 'INACTIVE',  label: 'Inactive' },
  { value: 'ON_LEAVE',  label: 'On Leave' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const SHIFT_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',       label: 'All Shifts' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED',  label: 'Assigned' },
  { value: 'OFF_DUTY',  label: 'Off Duty' },
];

export function StaffFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  shiftFilter,
  setShiftFilter,
  totalCount,
  filteredCount,
  onClearAll,
}: StaffFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchTerm) setSearchTerm(localSearch);
    }, 350);
    return () => clearTimeout(handler);
  }, [localSearch, searchTerm, setSearchTerm]);

  // Keep local state in sync when parent resets
  useEffect(() => {
    if (searchTerm !== localSearch) setLocalSearch(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const hasActiveFilters =
    !!searchTerm || statusFilter !== 'all' || shiftFilter !== 'all';

  const handleClearAll = useCallback(() => {
    setLocalSearch('');
    setStatusFilter('all');
    setShiftFilter('all');
    onClearAll?.();
  }, [setStatusFilter, setShiftFilter, onClearAll]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                {[searchTerm, statusFilter !== 'all', shiftFilter !== 'all'].filter(Boolean).length}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredCount}</span> of{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> staff members
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, NIC or phone…"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localSearch && (
              <button
                onClick={() => { setLocalSearch(''); setSearchTerm(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Shift filter */}
          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {SHIFT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
