'use client';

import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MapPin,
  CheckCircle2,
  XCircle,
  Navigation2,
} from 'lucide-react';
import type { StopResponse } from '../../../../generated/api-clients/route-management';

interface BusStopsTableProps {
  busStops: StopResponse[];
  onView: (stopId: string) => void;
  onEdit: (stopId: string) => void;
  onDelete: (stopId: string, stopName: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  activeFilters: Record<string, any>;
  loading: boolean;
  currentSort: { field: string; direction: 'asc' | 'desc' };
}

// ── Sort icon ─────────────────────────────────────────────────────

function SortIcon({ field, currentSort }: { field: string; currentSort: { field: string; direction: 'asc' | 'desc' } }) {
  if (currentSort.field !== field) {
    return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300 shrink-0" />;
  }
  return currentSort.direction === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
}

// ── Skeleton row ──────────────────────────────────────────────────

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-3.5 bg-gray-200 rounded animate-pulse w-28" /></td>
      <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-24" /></td>
      <td className="px-4 py-3"><div className="h-3.5 bg-gray-200 rounded animate-pulse w-36" /></td>
      <td className="px-4 py-3"><div className="h-3.5 bg-gray-200 rounded animate-pulse w-20" /></td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ── Helpers ───────────────────────────────────────────────────────

function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatLocation(location?: any): { primary: string; secondary?: string } {
  if (!location) return { primary: '—' };
  const cityState = [location.city, location.state].filter(Boolean).join(', ');
  const address = location.address || '';
  if (cityState && address) return { primary: cityState, secondary: address };
  if (cityState) return { primary: cityState };
  if (address) return { primary: address };
  if (location.latitude != null && location.longitude != null) {
    return { primary: `${Number(location.latitude).toFixed(4)}, ${Number(location.longitude).toFixed(4)}` };
  }
  return { primary: '—' };
}

// ── Main component ────────────────────────────────────────────────

export function BusStopsTable({
  busStops,
  onView,
  onEdit,
  onDelete,
  onSort,
  loading,
  currentSort,
}: BusStopsTableProps) {

  const handleSort = (field: string) => {
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  // ── Skeleton loading state ──────────────────────────────────────
  if (loading && busStops.length === 0) {
    return (
      <div className="overflow-x-auto rounded-t-xl">
        <table className="min-w-full">
          <TableHeader currentSort={currentSort} onSort={handleSort} />
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (busStops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <MapPin className="w-7 h-7 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No bus stops found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-t-xl">
      <table className="min-w-full">
        <TableHeader currentSort={currentSort} onSort={handleSort} />
        <tbody>
          {busStops.map((stop, idx) => {
            const loc = formatLocation(stop.location);
            return (
              <tr
                key={stop.id}
                className={[
                  'transition-colors duration-100',
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40',
                  'hover:bg-blue-50/40',
                ].join(' ')}
              >
                {/* Stop name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center ring-1 ring-blue-200/60">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                        {stop.name || 'Unnamed Stop'}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono leading-tight mt-0.5 truncate">
                        #{stop.id?.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3 min-w-[140px]">
                  <div className="flex items-start gap-1.5">
                    <Navigation2 className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate leading-tight">{loc.primary}</p>
                      {loc.secondary && (
                        <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5" title={loc.secondary}>
                          {loc.secondary}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Accessibility */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {stop.isAccessible ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accessible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Accessible
                    </span>
                  )}
                </td>

                {/* Description */}
                <td className="px-4 py-3 max-w-[200px]">
                  {stop.description ? (
                    <p className="text-sm text-gray-600 truncate" title={stop.description}>
                      {stop.description}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-300 italic">—</span>
                  )}
                </td>

                {/* Created date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs text-gray-500 tabular-nums">{formatDate(stop.createdAt)}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onView(stop.id!)}
                      title="View details"
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors duration-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(stop.id!)}
                      title="Edit stop"
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors duration-100"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(stop.id!, stop.name || 'Unknown Stop')}
                      title="Delete stop"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Inline update indicator */}
      {loading && busStops.length > 0 && (
        <div className="px-4 py-2.5 bg-blue-50/60 border-t border-blue-100 flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-blue-600 font-medium">Refreshing…</span>
        </div>
      )}
    </div>
  );
}

// ── Extracted header (shared with skeleton) ───────────────────────

function TableHeader({
  currentSort,
  onSort,
}: {
  currentSort: { field: string; direction: 'asc' | 'desc' };
  onSort: (field: string) => void;
}) {
  const th = (
    label: string,
    field?: string,
    extraCls = '',
  ) => {
    const sortable = !!field;
    const isActive = field ? currentSort.field === field : false;
    return (
      <th
        scope="col"
        onClick={sortable ? () => onSort(field!) : undefined}
        className={[
          'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider select-none',
          sortable ? 'cursor-pointer hover:bg-gray-100/80 transition-colors duration-100' : '',
          isActive ? 'text-blue-600' : 'text-gray-500',
          extraCls,
        ].join(' ')}
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {sortable && <SortIcon field={field!} currentSort={currentSort} />}
        </div>
      </th>
    );
  };

  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        {th('Stop Name', 'name')}
        {th('Location')}
        {th('Accessibility', 'isAccessible')}
        {th('Description')}
        {th('Created', 'createdAt')}
        <th scope="col" className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
}