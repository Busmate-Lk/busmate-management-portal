'use client';

import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
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
  Edit,
  Trash2,
  Eye,
  Play,
  Square,
  MoreVertical
} from 'lucide-react';
import { TripResponse } from '../../../../generated/api-clients/route-management';

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
  onSelectAll
}: TripsTableProps) {
  const getSortIcon = (field: string) => {
    if (currentSort.field !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return currentSort.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const handleSort = (field: string) => {
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const formatDate = (dateString?: string) => {
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
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    try {
      // Handle time format (HH:mm:ss or HH:mm)
      const timePart = timeString.includes('T') ? timeString.split('T')[1] : timeString;
      const [hours, minutes] = timePart.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return 'Invalid time';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
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
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'delayed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'boarding':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'departed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const canStart = (status?: string) => {
    return status?.toLowerCase() === 'pending';
  };

  const canComplete = (status?: string) => {
    return ['active', 'in_transit', 'departed'].includes(status?.toLowerCase() || '');
  };

  const canCancel = (status?: string) => {
    return !['completed', 'cancelled'].includes(status?.toLowerCase() || '');
  };

  const canEdit = (status?: string) => {
    return status?.toLowerCase() === 'pending';
  };

  if (loading && trips.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(activeFilters).length > 0
              ? "No trips match your current filters. Try adjusting your search criteria."
              : "No trips have been created yet. Create your first trip to get started."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Checkbox for select all */}
              {onSelectAll && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTrips.length === trips.length && trips.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}

              {/* Trip Date */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('tripDate')}
              >
                <div className="flex items-center gap-1">
                  Trip Date
                  {getSortIcon('tripDate')}
                </div>
              </th>

              {/* Route */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('routeName')}
              >
                <div className="flex items-center gap-1">
                  Route
                  {getSortIcon('routeName')}
                </div>
              </th>

              {/* Schedule */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('scheduleName')}
              >
                <div className="flex items-center gap-1">
                  Schedule
                  {getSortIcon('scheduleName')}
                </div>
              </th>

              {/* Operator */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operator
              </th>

              {/* Time */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure Time
              </th>

              {/* Assignments */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignments
              </th>

              {/* Status */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>

              {/* Actions */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50">
                {/* Checkbox */}
                {onSelectTrip && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTrips.includes(trip.id || '')}
                      onChange={() => onSelectTrip(trip.id || '')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}

                {/* Trip Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(trip.tripDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Trip #{trip.id?.slice(-8)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Route */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {trip.routeName || 'N/A'}
                    </div>
                    {trip.routeGroupName && (
                      <div className="text-xs text-gray-500">
                        {trip.routeGroupName}
                      </div>
                    )}
                  </div>
                </td>

                {/* Schedule */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trip.scheduleName || 'N/A'}
                  </div>
                </td>

                {/* Operator */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trip.operatorName || 'N/A'}
                  </div>
                </td>

                {/* Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(trip.scheduledDepartureTime)}
                    </div>
                    {trip.actualDepartureTime && (
                      <div className="text-xs text-gray-500">
                        Actual: {formatTime(trip.actualDepartureTime)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Assignments */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-3 h-3 ${trip.passengerServicePermitId ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={`text-xs ${trip.passengerServicePermitId ? 'text-green-800' : 'text-gray-500'}`}>
                        {trip.passengerServicePermitId ? trip.passengerServicePermitNumber || 'PSP' : 'No PSP'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bus className={`w-3 h-3 ${trip.busId ? 'text-blue-600' : 'text-gray-300'}`} />
                      <span className={`text-xs ${trip.busId ? 'text-blue-800' : 'text-gray-500'}`}>
                        {trip.busId ? trip.busPlateNumber || 'Bus' : 'No Bus'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`w-3 h-3 ${trip.driverId ? 'text-indigo-600' : 'text-gray-300'}`} />
                      <span className={`text-xs ${trip.driverId ? 'text-indigo-800' : 'text-gray-500'}`}>
                        {trip.driverId ? 'Driver' : 'No Driver'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trip.status)}`}>
                    {getStatusIcon(trip.status)}
                    {getStatusLabel(trip.status)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <button
                      onClick={() => onView(trip.id || '')}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Trip"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit (only for pending trips)
                    {canEdit(trip.status) && (
                      <button
                        onClick={() => onEdit(trip.id || '')}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit Trip"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )} */}

                    {/* Start Trip
                    {canStart(trip.status) && (
                      <button
                        onClick={() => onStart(trip.id || '')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Start Trip"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )} */}

                    {/* Complete Trip
                    {canComplete(trip.status) && (
                      <button
                        onClick={() => onComplete(trip.id || '')}
                        className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50"
                        title="Complete Trip"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )} */}

                    {/* Assign PSP (only if no PSP assigned) */}
                    {/* {!trip.passengerServicePermitId && (
                      <button
                        onClick={() => onAssignPsp(trip.id || '')}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Assign PSP"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )} */}

                    {/* Cancel Trip
                    {canCancel(trip.status) && (
                      <button
                        onClick={() => onCancel(trip.id || '')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Cancel Trip"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )} */}

                    {/* Delete (only for pending/cancelled trips) */}
                    {['pending', 'cancelled'].includes(trip.status?.toLowerCase() || '') && (
                      <button
                        onClick={() => onDelete(trip.id || '', `${trip.routeName} - ${formatDate(trip.tripDate)}`)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {loading && trips.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Loading more trips...</span>
          </div>
        </div>
      )}
    </div>
  );
}