'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { OperatorTripFilterOptions, TripStatus } from '@/data/operator/trips';

interface OperatorTripsFiltersProps {
  // Search
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  // Filters
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  routeFilter: string;
  setRouteFilter: (value: string) => void;
  scheduleFilter: string;
  setScheduleFilter: (value: string) => void;
  busFilter: string;
  setBusFilter: (value: string) => void;
  permitFilter: string;
  setPermitFilter: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;

  // Data
  filterOptions: OperatorTripFilterOptions;

  // Counts
  totalCount: number;
  filteredCount: number;

  onClearAll?: () => void;
}

const STATUS_LABELS: Record<TripStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  IN_TRANSIT: 'In Transit',
  BOARDING: 'Boarding',
  DEPARTED: 'Departed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed',
};

const STATUS_COLORS: Record<TripStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  BOARDING: 'bg-cyan-100 text-cyan-800',
  DEPARTED: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DELAYED: 'bg-amber-100 text-amber-800',
};

export function OperatorTripsFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  routeFilter,
  setRouteFilter,
  scheduleFilter,
  setScheduleFilter,
  busFilter,
  setBusFilter,
  permitFilter,
  setPermitFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filterOptions,
  totalCount,
  filteredCount,
  onClearAll,
}: OperatorTripsFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, setSearchTerm]);

  // Sync from prop
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const hasFilters =
    Boolean(searchTerm) ||
    statusFilter !== 'all' ||
    routeFilter !== 'all' ||
    scheduleFilter !== 'all' ||
    busFilter !== 'all' ||
    permitFilter !== 'all' ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const activeCount = [
    searchTerm && 'search',
    statusFilter !== 'all' && 'status',
    routeFilter !== 'all' && 'route',
    scheduleFilter !== 'all' && 'schedule',
    busFilter !== 'all' && 'bus',
    permitFilter !== 'all' && 'permit',
    fromDate && 'from',
    toDate && 'to',
  ].filter(Boolean).length;

  const handleClearAll = useCallback(() => {
    setLocalSearch('');
    setSearchTerm('');
    setStatusFilter('all');
    setRouteFilter('all');
    setScheduleFilter('all');
    setBusFilter('all');
    setPermitFilter('all');
    setFromDate('');
    setToDate('');
    onClearAll?.();
  }, [
    setSearchTerm, setStatusFilter, setRouteFilter, setScheduleFilter,
    setBusFilter, setPermitFilter, setFromDate, setToDate, onClearAll,
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Search row + toggle */}
      <div className="p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips by route, bus, permit, driver…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            hasFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="px-4 pb-2 flex items-center gap-2 text-sm text-gray-500">
        Showing{' '}
        <span className="font-semibold text-gray-700">{filteredCount}</span>
        {hasFilters && (
          <>
            {' '}of{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span>
          </>
        )}{' '}
        trips
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {filterOptions.statuses.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Route */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Route</label>
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Routes</option>
              {filterOptions.routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeNumber} – {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Schedule</label>
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Schedules</option>
              {filterOptions.schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bus */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bus</label>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Buses</option>
              {filterOptions.buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.registrationNumber}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="border-t border-gray-100 px-4 py-2 flex flex-wrap gap-2">
          {statusFilter !== 'all' && (
            <FilterChip
              label={STATUS_LABELS[statusFilter as TripStatus] ?? statusFilter}
              className={STATUS_COLORS[statusFilter as TripStatus] ?? 'bg-gray-100 text-gray-700'}
              onRemove={() => setStatusFilter('all')}
            />
          )}
          {routeFilter !== 'all' && (
            <FilterChip
              label={filterOptions.routes.find((r) => r.id === routeFilter)?.name ?? routeFilter}
              className="bg-blue-100 text-blue-700"
              onRemove={() => setRouteFilter('all')}
            />
          )}
          {scheduleFilter !== 'all' && (
            <FilterChip
              label={filterOptions.schedules.find((s) => s.id === scheduleFilter)?.name ?? scheduleFilter}
              className="bg-purple-100 text-purple-700"
              onRemove={() => setScheduleFilter('all')}
            />
          )}
          {busFilter !== 'all' && (
            <FilterChip
              label={filterOptions.buses.find((b) => b.id === busFilter)?.registrationNumber ?? busFilter}
              className="bg-green-100 text-green-700"
              onRemove={() => setBusFilter('all')}
            />
          )}
          {fromDate && (
            <FilterChip
              label={`From: ${fromDate}`}
              className="bg-gray-100 text-gray-700"
              onRemove={() => setFromDate('')}
            />
          )}
          {toDate && (
            <FilterChip
              label={`To: ${toDate}`}
              className="bg-gray-100 text-gray-700"
              onRemove={() => setToDate('')}
            />
          )}
          {searchTerm && (
            <FilterChip
              label={`"${searchTerm}"`}
              className="bg-gray-100 text-gray-700"
              onRemove={() => { setLocalSearch(''); setSearchTerm(''); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  className,
  onRemove,
}: {
  label: string;
  className: string;
  onRemove: () => void;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-70 transition-opacity"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
