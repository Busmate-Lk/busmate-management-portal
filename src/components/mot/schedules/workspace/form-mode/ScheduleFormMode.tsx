'use client';

import { useScheduleWorkspace } from '@/context/ScheduleWorkspace';
import { ScheduleTabs } from './ScheduleTabs';
import ScheduleMetadata from './ScheduleMetadata';
import ScheduleExceptions from './ScheduleExceptions';
import ScheduleGrid from './ScheduleGrid';

export default function ScheduleFormMode() {
    const { data, setSelectedRoute, isLoading, activeScheduleIndex } = useScheduleWorkspace();
    const { availableRoutes, selectedRouteId, selectedRouteName, selectedRouteGroupName, schedules } = data;

    const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const routeId = e.target.value;
        if (routeId) {
            setSelectedRoute(routeId);
        }
    };

    const hasActiveSchedule = activeScheduleIndex !== null && schedules.length > 0;

    return (
        <div className="space-y-4">
            {/* Route selector */}
            <div className='flex items-center gap-4'>
                <label htmlFor="route" className="text-sm font-medium whitespace-nowrap">
                    Select Route:
                </label>
                <select
                    id="route"
                    name="route"
                    value={selectedRouteId || ''}
                    onChange={handleRouteChange}
                    disabled={isLoading}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">-- Select a Route --</option>
                    {availableRoutes.map(route => (
                        <option key={route.id} value={route.id}>
                            {route.routeGroupName} - {route.name}
                            {route.direction && ` (${route.direction})`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Show selected route info */}
            {selectedRouteId && (
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    <span className="font-medium">Selected Route: </span>
                    {selectedRouteName}
                    {selectedRouteGroupName && (
                        <span className="ml-2 text-gray-500">
                            (Group: {selectedRouteGroupName})
                        </span>
                    )}
                    <span className="ml-4 text-blue-600 font-medium">
                        {schedules.length} Schedule{schedules.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Schedule Tabs - Horizontal list of all schedules */}
            {selectedRouteId && <ScheduleTabs />}

            {/* Schedule Metadata and Exceptions for Active Schedule */}
            {hasActiveSchedule && (
                <div className='flex gap-4'>
                    <ScheduleMetadata />
                    <ScheduleExceptions />
                </div>
            )}

            {/* Schedule Grid - Shows ALL schedules with stops as rows */}
            {selectedRouteId && <ScheduleGrid />}
        </div>
    );
}
