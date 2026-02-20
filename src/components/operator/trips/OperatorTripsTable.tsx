'use client';

import {
  ChevronUp,
  ChevronDown,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Bus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Navigation,
} from 'lucide-react';
import type { OperatorTrip, TripStatus } from '@/data/operator/trips';

interface OperatorTripsTableProps {
  trips: OperatorTrip[];
  onView: (tripId: string) => void;
  onSort: (sortBy: keyof OperatorTrip, sortDir: 'asc' | 'desc') => void;
  loading: boolean;
  currentSort: { field: keyof OperatorTrip; direction: 'asc' | 'desc' };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

function formatTime(timeString?: string) {
  if (!timeString) return '—';
  try {
    const timePart = timeString.includes('T') ? timeString.split('T')[1] : timeString;
    const [h, m] = timePart.split(':');
    return `${h}:${m}`;
  } catch {
    return timeString;
  }
}

const STATUS_CONFIG: Record<
  TripStatus,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  PENDING: {
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  ACTIVE: {
    label: 'Active',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    badge: 'bg-green-100 text-green-800 border-green-200',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: <Navigation className="w-3.5 h-3.5" />,
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  BOARDING: {
    label: 'Boarding',
    icon: <Navigation className="w-3.5 h-3.5" />,
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  DEPARTED: {
    label: 'Departed',
    icon: <Navigation className="w-3.5 h-3.5" />,
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  COMPLETED: {
    label: 'Completed',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: <XCircle className="w-3.5 h-3.5" />,
    badge: 'bg-red-100 text-red-800 border-red-200',
  },
  DELAYED: {
    label: 'Delayed',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};

function StatusBadge({ status }: { status: TripStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    icon: <Clock className="w-3.5 h-3.5" />,
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function OperatorTripsTable({
  trips,
  onView,
  onSort,
  loading,
  currentSort,
}: OperatorTripsTableProps) {
  function SortIcon({ field }: { field: keyof OperatorTrip }) {
    if (currentSort.field !== field) return <ChevronUp className="w-4 h-4 text-gray-300" />;
    return currentSort.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  }

  function handleSort(field: keyof OperatorTrip) {
    const dir =
      currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, dir);
  }

  function SortableHeader({
    field,
    children,
    className = '',
  }: {
    field: keyof OperatorTrip;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none ${className}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <SortIcon field={field} />
        </div>
      </th>
    );
  }

  // Loading skeleton
  if (loading && trips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="animate-pulse p-8 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="w-48 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Empty state
  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No trips found</h3>
        <p className="text-sm text-gray-500">
          Try adjusting your filters or date range.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Overlay when reloading existing data */}
      {loading && trips.length > 0 && (
        <div className="h-1 bg-blue-200 overflow-hidden">
          <div className="h-full w-1/3 bg-blue-500 animate-pulse" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="tripDate">
                <Calendar className="w-3.5 h-3.5" />
                Date
              </SortableHeader>
              <SortableHeader field="tripNumber">Trip #</SortableHeader>
              <SortableHeader field="routeNumber">
                <MapPin className="w-3.5 h-3.5" />
                Route
              </SortableHeader>
              <SortableHeader field="scheduledDepartureTime">
                <Clock className="w-3.5 h-3.5" />
                Departure
              </SortableHeader>
              <SortableHeader field="scheduledArrivalTime">
                <Clock className="w-3.5 h-3.5" />
                Arrival
              </SortableHeader>
              <SortableHeader field="busRegistrationNumber">
                <Bus className="w-3.5 h-3.5" />
                Bus
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                onClick={() => onView(trip.id)}
              >
                {/* Date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(trip.tripDate)}
                    </span>
                  </div>
                </td>

                {/* Trip # */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600 font-mono">
                    {trip.tripNumber ?? trip.id}
                  </span>
                </td>

                {/* Route */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                        {trip.routeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Route {trip.routeNumber}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Departure */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {formatTime(trip.scheduledDepartureTime)}
                    </p>
                    {trip.actualDepartureTime && trip.actualDepartureTime !== trip.scheduledDepartureTime && (
                      <p className="text-xs text-amber-600">
                        Actual: {formatTime(trip.actualDepartureTime)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Arrival */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {formatTime(trip.scheduledArrivalTime)}
                    </p>
                    {trip.actualArrivalTime && (
                      <p className="text-xs text-emerald-600">
                        Actual: {formatTime(trip.actualArrivalTime)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Bus */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {trip.busRegistrationNumber ? (
                    <div className="flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {trip.busRegistrationNumber}
                        </p>
                        <p className="text-xs text-gray-500">{trip.busServiceType}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Not assigned</span>
                  )}
                </td>

                {/* Staff */}
                <td className="px-4 py-3">
                  <div>
                    {trip.driverName ? (
                      <p className="text-xs text-gray-700 truncate max-w-[140px]">
                        <span className="font-medium">D:</span> {trip.driverName}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Driver unassigned</p>
                    )}
                    {trip.conductorName ? (
                      <p className="text-xs text-gray-700 truncate max-w-[140px]">
                        <span className="font-medium">C:</span> {trip.conductorName}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Conductor unassigned</p>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={trip.status} />
                </td>

                {/* Action */}
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(trip.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
