'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronDown,
} from 'lucide-react';

interface FilterOptions {
  states: string[];
  accessibilityStatuses: boolean[];
}

interface BusStopAdvancedFiltersProps {
  // Search
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  // Filters
  stateFilter: string;
  setStateFilter: (value: string) => void;
  accessibilityFilter: string;
  setAccessibilityFilter: (value: string) => void;

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

// ── Applied filter pill ───────────────────────────────────────────

interface ActivePillProps {
  label: string;
  onRemove: () => void;
  colorClass: string; // e.g. 'bg-purple-100 text-purple-700 border-purple-200'
  icon?: React.ReactNode;
}

function ActivePill({ label, onRemove, colorClass, icon }: ActivePillProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1
        rounded-full text-xs font-medium border
        ${colorClass}
        transition-all duration-150
      `}
    >
      {icon}
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="
          inline-flex items-center justify-center w-4 h-4 rounded-full
          hover:bg-black/10 transition-colors duration-100 shrink-0
        "
        aria-label="Remove filter"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

// ── Segmented control for accessibility ──────────────────────────

interface SegmentProps {
  value: string;
  current: string;
  onChange: (v: string) => void;
  label: string;
  icon?: React.ReactNode;
}

function Segment({ value, current, onChange, label, icon }: SegmentProps) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
        transition-all duration-150 whitespace-nowrap
        ${active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────

export function BusStopAdvancedFilters({
  searchTerm,
  setSearchTerm,
  stateFilter,
  setStateFilter,
  accessibilityFilter,
  setAccessibilityFilter,
  filterOptions,
  loading,
  totalCount = 0,
  filteredCount = 0,
  onClearAll,
  onSearch,
}: BusStopAdvancedFiltersProps) {
  const [searchValue, setSearchValue] = useState(searchTerm);

  // Debounced search sync → parent
  useEffect(() => {
    if (searchValue === searchTerm) return;
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      } else {
        setSearchTerm(searchValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, searchTerm, setSearchTerm, onSearch]);

  // Sync inbound prop changes (e.g. clear-all from parent)
  useEffect(() => {
    if (searchTerm !== searchValue) setSearchValue(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const hasFilterPills = stateFilter !== 'all' || accessibilityFilter !== 'all';

  const handleClearAll = useCallback(() => {
    setSearchValue('');
    setStateFilter('all');
    setAccessibilityFilter('all');
    onClearAll?.();
  }, [setStateFilter, setAccessibilityFilter, onClearAll]);

  const accessibilityLabel =
    accessibilityFilter === 'accessible' ? 'Accessible' :
    accessibilityFilter === 'non-accessible' ? 'Non-Accessible' : '';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* ── Row 1: Search input + result count ─────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-0">

        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="
            absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
            text-gray-400 group-focus-within:text-blue-500
            transition-colors duration-150 pointer-events-none
          " />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search bus stops by name, city, or state…"
            className="
              w-full pl-9 pr-8 py-2
              bg-gray-50 border border-gray-200 rounded-xl
              text-sm text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 focus:bg-white
              transition-all duration-150
            "
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="
                absolute right-2.5 top-1/2 -translate-y-1/2
                inline-flex items-center justify-center w-4 h-4
                rounded-full bg-gray-300 hover:bg-gray-400
                text-gray-600 hover:text-gray-800
                transition-colors duration-100
              "
              aria-label="Clear search"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>

        {/* Result count */}
        <div className="shrink-0 flex items-center gap-2">
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />}
          <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
            <span className="font-semibold text-gray-800">{filteredCount.toLocaleString()}</span>
            {' / '}
            <span className="font-semibold text-gray-800">{totalCount.toLocaleString()}</span>
            {' stops'}
          </span>
        </div>
      </div>

      {/* ── Row 2: Filter controls ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-2.5 pb-3.5">

        {/* State dropdown */}
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className={`
              appearance-none pl-7 pr-7 py-1.5
              text-xs font-medium rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400
              transition-all duration-150 cursor-pointer
              ${stateFilter !== 'all'
                ? 'bg-purple-50 border-purple-300 text-purple-800'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white'
              }
            `}
          >
            <option value="all">All States</option>
            {filterOptions.states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
        </div>

        {/* Accessibility segmented control */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0">
          <Segment
            value="all"
            current={accessibilityFilter}
            onChange={setAccessibilityFilter}
            label="All"
          />
          <Segment
            value="accessible"
            current={accessibilityFilter}
            onChange={setAccessibilityFilter}
            label="Accessible"
            icon={<CheckCircle2 className="h-3 w-3" />}
          />
          <Segment
            value="non-accessible"
            current={accessibilityFilter}
            onChange={setAccessibilityFilter}
            label="Non-Accessible"
            icon={<XCircle className="h-3 w-3" />}
          />
        </div>
      </div>

      {/* ── Row 3: Active filter pills (conditional) ────────────────── */}
      {hasFilterPills && (
        <div className="flex items-center gap-2 px-4 pb-3.5 border-t border-gray-100 pt-3">
          <div className="flex-1 flex flex-wrap gap-1.5">

            {stateFilter !== 'all' && (
              <ActivePill
                label={stateFilter}
                onRemove={() => setStateFilter('all')}
                colorClass="bg-purple-50 text-purple-700 border-purple-200"
                icon={<MapPin className="h-3 w-3 opacity-70" />}
              />
            )}

            {accessibilityFilter !== 'all' && (
              <ActivePill
                label={accessibilityLabel}
                onRemove={() => setAccessibilityFilter('all')}
                colorClass={
                  accessibilityFilter === 'accessible'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
                icon={
                  accessibilityFilter === 'accessible'
                    ? <CheckCircle2 className="h-3 w-3 opacity-70" />
                    : <XCircle className="h-3 w-3 opacity-70" />
                }
              />
            )}
          </div>

          {/* Clear All */}
          <button
            type="button"
            onClick={handleClearAll}
            className="
              shrink-0 inline-flex items-center gap-1
              text-xs font-medium text-gray-400 hover:text-red-500
              transition-colors duration-150
            "
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}