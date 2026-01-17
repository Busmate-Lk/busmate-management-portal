'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useScheduleWorkspace } from '@/context/ScheduleWorkspace';
import { ScheduleTabs } from './ScheduleTabs';
import ScheduleMetadata from './ScheduleMetadata';
import ScheduleExceptions from './ScheduleExceptions';
import ScheduleGrid from './ScheduleGrid';
import TimeStopGraph from './TimeStopGraph';
import { Grid3X3, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'graph';

export default function ScheduleFormMode() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data, setSelectedRoute, isLoading, activeScheduleIndex } = useScheduleWorkspace();
    const { availableRoutes, selectedRouteId, selectedRouteName, selectedRouteGroupName, schedules } = data;
    
    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const routeId = e.target.value;
        if (routeId) {
            setSelectedRoute(routeId);
            // Update URL query param
            const params = new URLSearchParams(searchParams.toString());
            params.set('routeId', routeId);
            router.push(`?${params.toString()}`);
        } else {
            // Clear query param if route is deselected
            const params = new URLSearchParams(searchParams.toString());
            params.delete('routeId');
            router.push(`?${params.toString()}`);
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

            {/* Schedule Tabs - Horizontal list of all schedules */}
            {selectedRouteId && <ScheduleTabs />}

            {/* Schedule Metadata and Exceptions for Active Schedule */}
            {hasActiveSchedule && (
                <div className='flex gap-4'>
                    <ScheduleMetadata />
                    <ScheduleExceptions />
                </div>
            )}

            {/* View Toggle and Schedule Display */}
            {selectedRouteId && (
                <>
                    {/* View mode toggle */}
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-gray-600 mr-2">View:</span>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                viewMode === 'grid'
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                            title="Grid View"
                        >
                            <Grid3X3 className="h-4 w-4" />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('graph')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                viewMode === 'graph'
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                            title="Time-Stop Graph"
                        >
                            <LineChart className="h-4 w-4" />
                            Graph
                        </button>
                    </div>

                    {/* Conditional view rendering */}
                    {viewMode === 'grid' ? <ScheduleGrid /> : <TimeStopGraph />}
                </>
            )}
        </div>
    );
}
