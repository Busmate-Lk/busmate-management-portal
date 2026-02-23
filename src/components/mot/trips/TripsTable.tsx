'use client';

import React, { useMemo } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Users,
  Bus,
  User,
  FileText,
  Trash2,
  Eye,
} from 'lucide-react';
import { TripResponse } from '../../../../generated/api-clients/route-management';
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable';

// ── Types ─────────────────────────────────────────────────────────

interface TripsTableProps {
  trips: TripResponse[];
  onView: (tripId: string) => void;
  onEdit: (tripId: string) => void;
  onDelete: (tripId: string, tripName: string) => void;
  onStart: (tripId: string) => void;
  onComplete: (tripId: string) => void;
  onCancel: (tripId: string, reason?: string) => void;
  onAssignPsp: (tripId: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  activeFilters: Record<string, any>;
  loading: boolean;
  currentSort: { field: string; direction: 'asc' | 'desc' };
  selectedTrips?: string[];
  onSelectTrip?: (tripId: string) => void;
  onSelectAll?: () => void;
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

function formatTime(timeString?: string): string {
  if (!timeString) return '—';
  try {
    const timePart = timeString.includes('T') ? timeString.split('T')[1] : timeString;
    const [hours, minutes] = timePart.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return '—';
  }
}

function getStatusMeta(status?: string): {
  icon: React.ReactNode;
  label: string;
  colorClass: string;
} {
  const s = status?.toLowerCase();
  switch (s) {
    case 'active':
      return { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Active',     colorClass: 'bg-green-100 text-green-800 border-green-200' };
    case 'completed':
      return { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Completed',  colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'pending':
      return { icon: <Clock className="w-3.5 h-3.5" />,       label: 'Pending',    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'cancelled':
      return { icon: <XCircle className="w-3.5 h-3.5" />,     label: 'Cancelled',  colorClass: 'bg-red-100 text-red-800 border-red-200' };
    case 'delayed':
      return { icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Delayed',    colorClass: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'in_transit':
      return { icon: <MapPin className="w-3.5 h-3.5" />,      label: 'In Transit', colorClass: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'boarding':
      return { icon: <Users className="w-3.5 h-3.5" />,       label: 'Boarding',   colorClass: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'departed':
      return { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Departed',   colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    default:
      return { icon: <AlertCircle className="w-3.5 h-3.5" />, label: status ?? 'Unknown', colorClass: 'bg-gray-100 text-gray-600 border-gray-200' };
  }
}

// ── Main component ────────────────────────────────────────────────

/**
 * Trip data table.
 *
 * Delegates rendering to the shared `<DataTable>` component with
 * trip-specific column definitions and custom cell renderers.
 */
export function TripsTable({
  trips,
  onView,
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onCancel,
  onAssignPsp,
  onSort,
  activeFilters,
  loading,
  currentSort,
  selectedTrips = [],
  onSelectTrip,
  onSelectAll,
}: TripsTableProps) {
  const columns: DataTableColumn<TripResponse>[] = useMemo(
    () => [
      // ── Optional checkbox column ──────────────────────────────
      ...(onSelectAll || onSelectTrip
        ? [{
            key: 'select',
            header: '',
            headerClassName: 'w-10',
            cellClassName: 'w-10',
            render: (trip: TripResponse) => (
              <input
                type="checkbox"
                checked={selectedTrips.includes(trip.id ?? '')}
                onChange={() => onSelectTrip?.(trip.id ?? '')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            ),
          } satisfies DataTableColumn<TripResponse>]
        : []
      ),

      // ── Trip Date ─────────────────────────────────────────────
      {
        key: 'tripDate',
        header: 'Trip Date',
        sortable: true,
        minWidth: 'min-w-[140px]',
        render: (trip) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{formatDate(trip.tripDate)}</p>
              <p className="text-xs text-gray-500">#{trip.id?.slice(-8)}</p>
            </div>
          </div>
        ),
      },

      // ── Route ────────────────────────────────────────────────
      {
        key: 'routeName',
        header: 'Route',
        sortable: true,
        minWidth: 'min-w-[140px]',
        render: (trip) => (
          <div>
            <p className="text-sm font-medium text-gray-900">{trip.routeName || '—'}</p>
            {trip.routeGroupName && (
              <p className="text-xs text-gray-500">{trip.routeGroupName}</p>
            )}
          </div>
        ),
      },

      // ── Schedule ─────────────────────────────────────────────
      {
        key: 'scheduleName',
        header: 'Schedule',
        sortable: true,
        minWidth: 'min-w-[120px]',
        render: (trip) => (
          <span className="text-sm text-gray-900">{trip.scheduleName || '—'}</span>
        ),
      },

      // ── Operator ─────────────────────────────────────────────
      {
        key: 'operatorName',
        header: 'Operator',
        minWidth: 'min-w-[120px]',
        render: (trip) => (
          <span className="text-sm text-gray-900">{trip.operatorName || '—'}</span>
        ),
      },

      // ── Departure Time ────────────────────────────────────────
      {
        key: 'scheduledDepartureTime',
        header: 'Departure',
        cellClassName: 'whitespace-nowrap',
        minWidth: 'min-w-[100px]',
        render: (trip) => (
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(trip.scheduledDepartureTime)}
            </p>
            {trip.actualDepartureTime && (
              <p className="text-xs text-gray-500">
                Actual: {formatTime(trip.actualDepartureTime)}
              </p>
            )}
          </div>
        ),
      },

      // ── Assignments ───────────────────────────────────────────
      {
        key: 'assignments',
        header: 'Assignments',
        minWidth: 'min-w-[130px]',
        render: (trip) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FileText className={`w-3 h-3 shrink-0 ${trip.passengerServicePermitId ? 'text-green-600' : 'text-gray-300'}`} />
              <span className={`text-xs ${trip.passengerServicePermitId ? 'text-green-800' : 'text-gray-500'}`}>
                {trip.passengerServicePermitId ? (trip.passengerServicePermitNumber ?? 'PSP') : 'No PSP'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className={`w-3 h-3 shrink-0 ${trip.busId ? 'text-blue-600' : 'text-gray-300'}`} />
              <span className={`text-xs ${trip.busId ? 'text-blue-800' : 'text-gray-500'}`}>
                {trip.busId ? (trip.busPlateNumber ?? 'Bus') : 'No Bus'}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <User className={`w-3 h-3 shrink-0 ${trip.driverId ? 'text-indigo-600' : 'text-gray-300'}`} />
              <span className={`text-xs ${trip.driverId ? 'text-indigo-800' : 'text-gray-500'}`}>
                {trip.driverId ? 'Driver' : 'No Driver'}
              </span>
            </div> */}
          </div>
        ),
      },

      // ── Status ────────────────────────────────────────────────
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        cellClassName: 'whitespace-nowrap',
        render: (trip) => {
          const { icon, label, colorClass } = getStatusMeta(trip.status);
          return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
              {icon}
              {label}
            </span>
          );
        },
      },

      // ── Actions ───────────────────────────────────────────────
      {
        key: 'actions',
        header: 'Actions',
        headerClassName: 'text-center',
        cellClassName: 'text-center whitespace-nowrap',
        render: (trip) => (
          <div className="inline-flex items-center gap-1">
            {/* View */}
            <button
              onClick={() => onView(trip.id ?? '')}
              className="p-1.5 rounded text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
              title="View Trip"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Delete — only for pending / cancelled trips */}
            {['pending', 'cancelled'].includes(trip.status?.toLowerCase() ?? '') && (
              <button
                onClick={() => onDelete(trip.id ?? '', `${trip.routeName} - ${formatDate(trip.tripDate)}`)}
                className="p-1.5 rounded text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
                title="Delete Trip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onView, onEdit, onDelete, onStart, onComplete, onCancel, onAssignPsp, onSelectTrip, onSelectAll, selectedTrips],
  );

  return (
    <DataTable<TripResponse>
      columns={columns}
      data={trips}
      loading={loading}
      currentSort={currentSort}
      onSort={onSort}
      rowKey={(trip) => trip.id!}
      showRefreshing
      emptyState={
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-900">No trips found</p>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(activeFilters).length > 0
                ? 'No trips match your current filters. Try adjusting your search criteria.'
                : 'No trips have been created yet. Generate trips to get started.'}
            </p>
          </div>
        </div>
      }
    />
  );
}