'use client';

import React from 'react';
import {
  Eye, Bus, CheckCircle, XCircle, Clock, AlertCircle, Wrench,
  ChevronUp, ChevronDown, MapPin, User,
} from 'lucide-react';
import type { OperatorBus } from '@/data/operator/buses';

interface FleetTableProps {
  buses: OperatorBus[];
  onView: (busId: string) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  currentSort: { field: string; direction: 'asc' | 'desc' };
  loading: boolean;
  hasActiveFilters: boolean;
}

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  ACTIVE:      { label: 'Active',      icon: <CheckCircle className="w-3.5 h-3.5" />, classes: 'bg-green-100 text-green-800 border-green-200' },
  INACTIVE:    { label: 'Inactive',    icon: <XCircle     className="w-3.5 h-3.5" />, classes: 'bg-orange-100 text-orange-800 border-orange-200' },
  MAINTENANCE: { label: 'Maintenance', icon: <Wrench      className="w-3.5 h-3.5" />, classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  RETIRED:     { label: 'Retired',     icon: <AlertCircle className="w-3.5 h-3.5" />, classes: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  SL:          'SL',
  SL_AC:       'SL A/C',
  SEMI_LUXURY: 'Semi-Luxury',
  LUXURY:      'Luxury',
  EXPRESS:     'Express',
};

const COLS = [
  { key: 'plateNumber',           label: 'Plate / Reg.',    sortable: true  },
  { key: 'model',                 label: 'Model',           sortable: true  },
  { key: 'serviceType',           label: 'Service Type',    sortable: true  },
  { key: 'year',                  label: 'Year',            sortable: true  },
  { key: 'seatingCapacity',       label: 'Seats',           sortable: true  },
  { key: 'status',                label: 'Status',          sortable: true  },
  { key: 'driver',                label: 'Driver',          sortable: false },
  { key: 'route',                 label: 'Route',           sortable: false },
  { key: '',                      label: '',                sortable: false },
];

export function FleetTable({
  buses,
  onView,
  onSort,
  currentSort,
  loading,
  hasActiveFilters,
}: FleetTableProps) {
  const handleSort = (field: string) => {
    if (!field) return;
    const dir = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, dir);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (currentSort.field !== field) return <ChevronUp className="w-3.5 h-3.5 text-gray-300" />;
    return currentSort.direction === 'asc'
      ? <ChevronUp   className="w-3.5 h-3.5 text-blue-600" />
      : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  if (loading && buses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading fleet…</p>
      </div>
    );
  }

  if (buses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Bus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {hasActiveFilters ? 'No buses match your filters' : 'No buses in fleet'}
        </h3>
        <p className="text-sm text-gray-500">
          {hasActiveFilters
            ? 'Try adjusting your search or filters.'
            : 'No buses have been registered in this fleet yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key || col.label || 'actions'}
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                  } ${col.key === '' ? 'text-right' : 'text-left'}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {buses.map(bus => {
              const status = STATUS_META[bus.status] ?? STATUS_META.RETIRED;
              return (
                <tr
                  key={bus.id}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  onClick={() => onView(bus.id)}
                >
                  {/* Plate / Reg */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {bus.plateNumber}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{bus.ntcRegistrationNumber}</div>
                  </td>

                  {/* Model */}
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{bus.model}</div>
                    <div className="text-xs text-gray-400">{bus.manufacturer}</div>
                  </td>

                  {/* Service type */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {SERVICE_TYPE_LABELS[bus.serviceType] ?? bus.serviceType}
                    </span>
                  </td>

                  {/* Year */}
                  <td className="px-4 py-3 text-gray-600">{bus.year}</td>

                  {/* Seats */}
                  <td className="px-4 py-3 text-gray-600">{bus.seatingCapacity}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.classes}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>

                  {/* Driver */}
                  <td className="px-4 py-3">
                    {bus.driver ? (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate max-w-[130px]">{bus.driver.driverName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Unassigned</span>
                    )}
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    {bus.routeAssignments[0] ? (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate max-w-[160px]">
                          {bus.routeAssignments[0].routeName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">No route</span>
                    )}
                  </td>

                  {/* View action */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); onView(bus.id); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading && buses.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
          <span className="text-xs text-blue-700">Refreshing…</span>
        </div>
      )}
    </div>
  );
}
