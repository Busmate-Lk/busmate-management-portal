'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Users,
  Bus,
  Route,
  User
} from 'lucide-react';

interface FilterOptions {
  statuses: Array<'pending' | 'active' | 'completed' | 'cancelled' | 'delayed' | 'in_transit' | 'boarding' | 'departed'>;
  routes: Array<{ id: string; name: string; routeGroup?: string }>;
  operators: Array<{ id: string; name: string }>;
  schedules: Array<{ id: string; name: string }>;
  buses: Array<{ id: string; registrationNumber: string }>;
  passengerServicePermits: Array<{ id: string; permitNumber: string }>;
}

interface TripAdvancedFiltersProps {
  // Search
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  // Filters
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  routeFilter: string;
  setRouteFilter: (value: string) => void;
  operatorFilter: string;
  setOperatorFilter: (value: string) => void;
  scheduleFilter: string;
  setScheduleFilter: (value: string) => void;
  busFilter: string;
  setBusFilter: (value: string) => void;
  pspFilter: string;
  setPspFilter: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  hasPsp: boolean;
  setHasPsp: (value: boolean) => void;
  hasBus: boolean;
  setHasBus: (value: boolean) => void;
  hasDriver: boolean;
  setHasDriver: (value: boolean) => void;
  hasConductor: boolean;
  setHasConductor: (value: boolean) => void;

  // Data
  filterOptions: FilterOptions;
  loading: boolean;

  // Stats for display
  totalCount?: number;
  filteredCount?: number;

  // Event handlers
  onClearAll?: () => void;
  onSearch?: (term: string) => void;
}

export default function TripAdvancedFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  routeFilter,
  setRouteFilter,
  operatorFilter,
  setOperatorFilter,
  scheduleFilter,
  setScheduleFilter,
  busFilter,
  setBusFilter,
  pspFilter,
  setPspFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  hasPsp,
  setHasPsp,
  hasBus,
  setHasBus,
  hasDriver,
  setHasDriver,
  hasConductor,
  setHasConductor,
  filterOptions,
  loading,
  totalCount = 0,
  filteredCount = 0,
  onClearAll,
  onSearch
}: TripAdvancedFiltersProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    if (searchValue !== searchTerm) {
      const handler = setTimeout(() => {
        setSearchTerm(searchValue);
        if (onSearch) {
          onSearch(searchValue);
        }
      }, 400);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchValue, searchTerm, setSearchTerm, onSearch]);

  // Update local search when prop changes (but avoid infinite loops)
  useEffect(() => {
    if (searchTerm !== searchValue) {
      setSearchValue(searchTerm);
    }
  }, [searchTerm]);

  const hasActiveFilters = Boolean(
    searchTerm ||
    statusFilter !== 'all' ||
    routeFilter !== 'all' ||
    operatorFilter !== 'all' ||
    scheduleFilter !== 'all' ||
    busFilter !== 'all' ||
    pspFilter !== 'all' ||
    fromDate ||
    toDate ||
    hasPsp ||
    hasBus ||
    hasDriver ||
    hasConductor
  );

  const activeFilterCount = [
    searchTerm && 'search',
    statusFilter !== 'all' && 'status',
    routeFilter !== 'all' && 'route',
    operatorFilter !== 'all' && 'operator',
    scheduleFilter !== 'all' && 'schedule',
    busFilter !== 'all' && 'bus',
    pspFilter !== 'all' && 'psp',
    fromDate && 'from-date',
    toDate && 'to-date',
    hasPsp && 'has-psp',
    hasBus && 'has-bus',
    hasDriver && 'has-driver',
    hasConductor && 'has-conductor'
  ].filter(Boolean).length;

  const handleClearAll = useCallback(() => {
    setSearchValue('');
    setStatusFilter('all');
    setRouteFilter('all');
    setOperatorFilter('all');
    setScheduleFilter('all');
    setBusFilter('all');
    setPspFilter('all');
    setFromDate('');
    setToDate('');
    setHasPsp(false);
    setHasBus(false);
    setHasDriver(false);
    setHasConductor(false);
    if (onClearAll) {
      onClearAll();
    }
  }, [
    setStatusFilter, setRouteFilter, setOperatorFilter, setScheduleFilter,
    setBusFilter, setPspFilter, setFromDate, setToDate, setHasPsp, setHasBus,
    setHasDriver, setHasConductor, onClearAll
  ]);

  const getStatusIcon = (value: string) => {
    switch (value) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'in_transit':
        return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'boarding':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'departed':
        return <CheckCircle className="w-4 h-4 text-indigo-600" />;
      default:
        return <Filter className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (value: string) => {
    switch (value) {
      case 'active':
        return 'Active Only';
      case 'completed':
        return 'Completed Only';
      case 'pending':
        return 'Pending Only';
      case 'cancelled':
        return 'Cancelled Only';
      case 'delayed':
        return 'Delayed Only';
      case 'in_transit':
        return 'In Transit Only';
      case 'boarding':
        return 'Boarding Only';
      case 'departed':
        return 'Departed Only';
      default:
        return 'All Statuses';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Compact Main Filter Section */}
      <div className="p-4">
        {/* Header with Results Count and Clear All */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-900">
              {filteredCount > 0 ? (
                <span>
                  {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} trips
                </span>
              ) : (
                <span>{totalCount.toLocaleString()} trips</span>
              )}
            </h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Main Filter Controls */}
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search trips by route name, operator, schedule..."
              className="block w-full pl-4 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
            />
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {getStatusIcon(statusFilter)}
              </div>
            </div>

            {/* Route Filter */}
            <div className="relative">
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Routes</option>
                {filterOptions.routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name} {route.routeGroup && `(${route.routeGroup})`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Route className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Date Range From */}
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                placeholder="From Date"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Date Range To */}
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                placeholder="To Date"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {isFilterExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Assignment Status Toggles */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={hasPsp}
                  onChange={(e) => setHasPsp(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">Has PSP</span>
              </label>

              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={hasBus}
                  onChange={(e) => setHasBus(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Bus className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600">Has Bus</span>
              </label>

              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={hasDriver}
                  onChange={(e) => setHasDriver(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Has Driver</span>
              </label>

              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={hasConductor}
                  onChange={(e) => setHasConductor(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-gray-600">Has Conductor</span>
              </label>
            </div>
          </div>

          {/* Advanced Filters Expanded Section */}
          {isFilterExpanded && (
            <div className="border-t pt-3 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Operator Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Operator
                  </label>
                  <select
                    value={operatorFilter}
                    onChange={(e) => setOperatorFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Operators</option>
                    {filterOptions.operators.map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Schedule
                  </label>
                  <select
                    value={scheduleFilter}
                    onChange={(e) => setScheduleFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Schedules</option>
                    {filterOptions.schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bus Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bus
                  </label>
                  <select
                    value={busFilter}
                    onChange={(e) => setBusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Buses</option>
                    {filterOptions.buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PSP Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Passenger Service Permit
                  </label>
                  <select
                    value={pspFilter}
                    onChange={(e) => setPspFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All PSPs</option>
                    {filterOptions.passengerServicePermits.map((psp) => (
                      <option key={psp.id} value={psp.id}>
                        {psp.permitNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Section */}
      {hasActiveFilters && (
        <div className="border-t border-gray-100">
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      <Search className="w-3 h-3" />
                      Search: "{searchTerm}"
                      <button
                        onClick={() => {
                          setSearchValue('');
                          setSearchTerm('');
                        }}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      {getStatusIcon(statusFilter)}
                      {getStatusLabel(statusFilter)}
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="ml-1 hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {routeFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                      <Route className="w-3 h-3" />
                      Route: {filterOptions.routes.find(r => r.id === routeFilter)?.name}
                      <button
                        onClick={() => setRouteFilter('all')}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {operatorFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                      <User className="w-3 h-3" />
                      Operator: {filterOptions.operators.find(o => o.id === operatorFilter)?.name}
                      <button
                        onClick={() => setOperatorFilter('all')}
                        className="ml-1 hover:text-orange-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {fromDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                      <Calendar className="w-3 h-3" />
                      From: {fromDate}
                      <button
                        onClick={() => setFromDate('')}
                        className="ml-1 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {toDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                      <Calendar className="w-3 h-3" />
                      To: {toDate}
                      <button
                        onClick={() => setToDate('')}
                        className="ml-1 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {hasPsp && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                      <Users className="w-3 h-3" />
                      Has PSP
                      <button
                        onClick={() => setHasPsp(false)}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {hasBus && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                      <Bus className="w-3 h-3" />
                      Has Bus
                      <button
                        onClick={() => setHasBus(false)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {hasDriver && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      <User className="w-3 h-3" />
                      Has Driver
                      <button
                        onClick={() => setHasDriver(false)}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {hasConductor && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                      <User className="w-3 h-3" />
                      Has Conductor
                      <button
                        onClick={() => setHasConductor(false)}
                        className="ml-1 hover:text-orange-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Filtering trips...</span>
          </div>
        </div>
      )}
    </div>
  );
}