'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Calendar, 
  Eye, 
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ScheduleManagementService } from '../../../../generated/api-clients/route-management';
import type { ScheduleResponse } from '../../../../generated/api-clients/route-management';

interface RouteSchedulesTabProps {
  routeId: string;
  routeName: string;
}

export function RouteSchedulesTab({ routeId, routeName }: RouteSchedulesTabProps) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch schedules for this specific route
      const response = await ScheduleManagementService.getSchedulesByRoute(
        routeId,
        undefined, // status - get all statuses
        0, // page
        100, // size - get more schedules
        'name', // sortBy
        'asc' // sortDir
      );

      // Sort schedules by departure time from start stop
      const sortedSchedules = (response.content || []).sort((a, b) => {
        const aDepartureTime = getFirstStopDepartureTime(a);
        const bDepartureTime = getFirstStopDepartureTime(b);
        
        if (!aDepartureTime || !bDepartureTime) return 0;
        return aDepartureTime.localeCompare(bDepartureTime);
      });

      setSchedules(sortedSchedules);
    } catch (err) {
      console.error('Error loading schedules for route:', err);
      setError('Failed to load schedules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  // Helper function to get departure time from first stop
  const getFirstStopDepartureTime = (schedule: ScheduleResponse): string | null => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return null;
    const firstStop = schedule.scheduleStops[0];
    return firstStop.departureTime || null;
  };

  // Helper function to get arrival time at last stop
  const getLastStopArrivalTime = (schedule: ScheduleResponse): string | null => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return null;
    const lastStop = schedule.scheduleStops[schedule.scheduleStops.length - 1];
    return lastStop.arrivalTime || null;
  };

  // Helper function to get first stop name
  const getFirstStopName = (schedule: ScheduleResponse): string => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return 'Unknown';
    return schedule.scheduleStops[0].stopName || 'Unknown';
  };

  // Helper function to get last stop name
  const getLastStopName = (schedule: ScheduleResponse): string => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return 'Unknown';
    return schedule.scheduleStops[schedule.scheduleStops.length - 1].stopName || 'Unknown';
  };

  // Helper function to format time (HH:MM format)
  const formatTime = (timeString?: string): string => {
    if (!timeString) return 'N/A';
    try {
      // Handle both "HH:MM:SS" and "HH:MM" formats
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
      }
      return timeString;
    } catch {
      return 'Invalid time';
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'INACTIVE':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getScheduleTypeColor = (type?: string) => {
    switch (type) {
      case 'REGULAR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SPECIAL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getDaysOfWeek = (scheduleCalendars?: any[]) => {
    if (!scheduleCalendars || scheduleCalendars.length === 0) return 'N/A';
    
    const calendar = scheduleCalendars[0];
    const days = [];
    
    if (calendar?.monday) days.push('Mon');
    if (calendar?.tuesday) days.push('Tue');
    if (calendar?.wednesday) days.push('Wed');
    if (calendar?.thursday) days.push('Thu');
    if (calendar?.friday) days.push('Fri');
    if (calendar?.saturday) days.push('Sat');
    if (calendar?.sunday) days.push('Sun');
    
    return days.length > 0 ? days.join(', ') : 'N/A';
  };

  const handleView = (scheduleId: string) => {
    router.push(`/mot/schedules/${scheduleId}`);
  };

  const handleEdit = (scheduleId: string) => {
    router.push(`/mot/schedules/${scheduleId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading schedules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Schedules</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadSchedules}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
        <p className="text-gray-600 mb-4">
          No schedules have been created for this route yet.
        </p>
        <button
          onClick={() => router.push(`/mot/schedules/add-new?routeId=${routeId}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Create First Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count and action button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Schedules for {routeName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {schedules.length} {schedules.length === 1 ? 'schedule' : 'schedules'} found
          </p>
        </div>
        <button
          onClick={() => router.push(`/mot/schedules/add-new?routeId=${routeId}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Schedules Grid */}
      <div className="grid gap-2">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            {/* Compact single-row layout with emphasized times */}
            <div className="flex items-center justify-between gap-3">
              {/* Left side: Highlighted Times (Main Focus) */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Departure Time - Large and Bold */}
                <div className="text-center">
                  <div className="text-lg font-black text-blue-600">
                    {formatTime(getFirstStopDepartureTime(schedule))}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">Depart</div>
                </div>

                {/* Arrow separator */}
                <div className="text-gray-300 font-bold text-xl">→</div>

                {/* Arrival Time - Large and Bold */}
                <div className="text-center">
                  <div className="text-lg font-black text-blue-600">
                    {formatTime(getLastStopArrivalTime(schedule))}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">Arrive</div>
                </div>
              </div>

              {/* Middle side: Schedule Name and Route Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Schedule Name */}
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {schedule.name || 'Unnamed'}
                  </h4>
                  
                  {/* Status and Type Badges - compact */}
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                      {getStatusIcon(schedule.status)}
                      {schedule.status || 'Unknown'}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getScheduleTypeColor(schedule.scheduleType)}`}>
                      <Calendar className="w-2.5 h-2.5" />
                      {schedule.scheduleType || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Route Info - From and To stops */}
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-700">
                  {/* <span className="text-gray-500">From</span> */}
                  <span className="text-gray-900 font-medium truncate max-w-xs">
                    {getFirstStopName(schedule)}
                  </span>
                    <span className="text-gray-300 font-bold">→</span>
                  {/* <span className="text-gray-500">To</span> */}
                  <span className="text-gray-900 font-medium truncate max-w-xs">
                    {getLastStopName(schedule)}
                  </span>
                </div>

                {/* Additional Info - single compact line */}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                  <span>
                    <span className="font-medium">Days:</span> {getDaysOfWeek(schedule.scheduleCalendars)}
                  </span>
                  <span>
                    <span className="font-medium">Valid from:</span> {formatDate(schedule.effectiveStartDate)}
                  </span>
                </div>
              </div>

              {/* Right side: Action Buttons - compact */}
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleView(schedule.id!)}
                  className="p-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                  title="View schedule details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(schedule.id!)}
                  className="p-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title="Edit schedule"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
