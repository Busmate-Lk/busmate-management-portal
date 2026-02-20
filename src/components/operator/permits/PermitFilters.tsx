'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { OperatorPermitFilterOptions } from '@/data/operator/permits';

interface PermitFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  permitTypeFilter: string;
  setPermitTypeFilter: (value: string) => void;
  filterOptions: OperatorPermitFilterOptions;
  loading: boolean;
  totalCount?: number;
  filteredCount?: number;
  onClearAll?: () => void;
  onRefresh?: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'text-green-700 bg-green-100' },
  INACTIVE: { label: 'Inactive', color: 'text-gray-700 bg-gray-100' },
  PENDING: { label: 'Pending', color: 'text-yellow-700 bg-yellow-100' },
  EXPIRED: { label: 'Expired', color: 'text-red-700 bg-red-100' },
};

const PERMIT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  REGULAR: { label: 'Regular', color: 'text-blue-700 bg-blue-100' },
  SPECIAL: { label: 'Special', color: 'text-purple-700 bg-purple-100' },
  TEMPORARY: { label: 'Temporary', color: 'text-orange-700 bg-orange-100' },
};

export function PermitFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  permitTypeFilter,
  setPermitTypeFilter,
  filterOptions,
  loading,
  totalCount = 0,
  filteredCount = 0,
  onClearAll,
  onRefresh,
}: PermitFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Local search state so we can debounce
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Debounce: propagate search input to parent after 350 ms
  useEffect(() => {
    if (searchInput === searchTerm) return;
    const timer = setTimeout(() => setSearchTerm(searchInput), 350);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, setSearchTerm]);

  // Sync when parent resets the search term
  useEffect(() => {
    if (searchTerm !== searchInput) setSearchInput(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const hasActiveFilters =
    !!searchTerm || statusFilter !== 'all' || permitTypeFilter !== 'all';

  const activeFilterCount = [
    searchTerm && 'search',
    statusFilter !== 'all' && 'status',
    permitTypeFilter !== 'all' && 'type',
  ].filter(Boolean).length;

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    setStatusFilter('all');
    setPermitTypeFilter('all');
    onClearAll?.();
  }, [setStatusFilter, setPermitTypeFilter, onClearAll]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* ── Primary row ── */}
      <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by permit number or route group…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            hasActiveFilters
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}

        {/* Result counts */}
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {filteredCount} / {totalCount} permits
        </span>
      </div>

      {/* ── Expanded filters ── */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                All
              </button>
              {filterOptions.statuses.map((s) => {
                const cfg = STATUS_CONFIG[s] ?? { label: s, color: '' };
                const isActive = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(isActive ? 'all' : s)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      isActive ? `${cfg.color} border-transparent font-medium` : 'border-gray-300 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permit type filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Permit Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPermitTypeFilter('all')}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  permitTypeFilter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                All
              </button>
              {filterOptions.permitTypes.map((t) => {
                const cfg = PERMIT_TYPE_CONFIG[t] ?? { label: t, color: '' };
                const isActive = permitTypeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setPermitTypeFilter(isActive ? 'all' : t)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      isActive ? `${cfg.color} border-transparent font-medium` : 'border-gray-300 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <div className="border-t border-gray-100 px-4 py-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              Search: &quot;{searchTerm}&quot;
              <button onClick={() => { setSearchInput(''); setSearchTerm(''); }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              Status: {STATUS_CONFIG[statusFilter]?.label ?? statusFilter}
              <button onClick={() => setStatusFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {permitTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              Type: {PERMIT_TYPE_CONFIG[permitTypeFilter]?.label ?? permitTypeFilter}
              <button onClick={() => setPermitTypeFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAll}
            className="text-xs text-red-600 hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Loading bar ── */}
      {loading && (
        <div className="h-1 bg-gray-100 rounded-b-lg overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-full" />
        </div>
      )}
    </div>
  );
}
