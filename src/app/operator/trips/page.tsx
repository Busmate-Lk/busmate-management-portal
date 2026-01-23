'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    BusOperatorOperationsService,
    TripManagementService,
    TripResponse,
    PageTripResponse,
} from '../../../../generated/api-clients/route-management';

// Import operator-specific components
import { OperatorTripStatsCards } from '@/components/operator/trips/OperatorTripStatsCards';
import { OperatorTripAdvancedFilters } from '@/components/operator/trips/OperatorTripAdvancedFilters';
import { OperatorTripActionButtons } from '@/components/operator/trips/OperatorTripActionButtons';
import { OperatorTripsTable } from '@/components/operator/trips/OperatorTripsTable';

// Import shared UI components
import Pagination from '@/components/shared/Pagination';
import { Header } from '@/components/operator/header';

// Mock operator ID - In real implementation, this would come from auth context
const MOCK_OPERATOR_ID = "8e886a71-445c-4e3a-8bc5-a17b5b2dad24";

interface QueryParams {
    page: number;
    size: number;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    search: string;
    status?: 'pending' | 'active' | 'completed' | 'cancelled' | 'delayed' | 'in_transit' | 'boarding' | 'departed';
    routeId?: string;
    routeGroupId?: string;
    scheduleId?: string;
    busId?: string;
    passengerServicePermitId?: string;
    fromDate?: string;
    toDate?: string;
}

interface FilterOptions {
    statuses: Array<'pending' | 'active' | 'completed' | 'cancelled' | 'delayed' | 'in_transit' | 'boarding' | 'departed'>;
    routes: Array<{ id: string; name: string; routeGroup?: string }>;
    routeGroups: Array<{ id: string; name: string }>;
    schedules: Array<{ id: string; name: string }>;
    buses: Array<{ id: string; registrationNumber: string }>;
    passengerServicePermits: Array<{ id: string; permitNumber: string }>;
}

export default function OperatorTripsPage() {
    const router = useRouter();
    const [trips, setTrips] = useState<TripResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to format dates
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

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [routeFilter, setRouteFilter] = useState('all');
    const [routeGroupFilter, setRouteGroupFilter] = useState('all');
    const [scheduleFilter, setScheduleFilter] = useState('all');
    const [busFilter, setBusFilter] = useState('all');
    const [pspFilter, setPspFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Filter options from API
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        statuses: [],
        routes: [],
        routeGroups: [],
        schedules: [],
        buses: [],
        passengerServicePermits: []
    });
    const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

    const [queryParams, setQueryParams] = useState<QueryParams>({
        page: 0,
        size: 10,
        sortBy: 'tripDate',
        sortDir: 'desc',
        search: '',
    });

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
    });

    // Statistics state
    const [stats, setStats] = useState({
        totalTrips: { count: 0 },
        activeTrips: { count: 0 },
        completedTrips: { count: 0 },
        pendingTrips: { count: 0 },
        cancelledTrips: { count: 0 },
        tripsWithPsp: { count: 0 },
        tripsWithBus: { count: 0 },
        inTransitTrips: { count: 0 },
        todaysTrips: { count: 0 }
    });

    // Selection state for bulk operations
    const [selectedTrips, setSelectedTrips] = useState<string[]>([]);

    // State for modals
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [tripToCancel, setTripToCancel] = useState<TripResponse | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    // Load filter options from operator-specific data
    const loadFilterOptions = useCallback(async () => {
        try {
            setFilterOptionsLoading(true);

            // Load operator's routes
            const routesResponse = await BusOperatorOperationsService.getOperatorRoutes(
                MOCK_OPERATOR_ID,
                0,
                100, // Get all routes for filtering
                'name',
                'asc'
            );

            // Load operator's schedules
            const schedulesResponse = await BusOperatorOperationsService.getOperatorSchedules(
                MOCK_OPERATOR_ID,
                0,
                100, // Get all schedules for filtering
                'name',
                'asc'
            );

            // Load operator's buses
            const busesResponse = await BusOperatorOperationsService.getOperatorBuses(
                MOCK_OPERATOR_ID,
                0,
                100, // Get all buses for filtering
                'ntcRegistrationNumber',
                'asc'
            );

            // Load operator's permits
            const permitsResponse = await BusOperatorOperationsService.getOperatorPermits(
                MOCK_OPERATOR_ID,
                0,
                100, // Get all permits for filtering
                'permitNumber',
                'asc'
            );

            // Extract unique route groups
            const routeGroups = Array.from(
                new Map(
                    routesResponse.content
                        ?.filter(route => route.routeGroupId)
                        .map(route => [route.routeGroupId, {
                            id: route.routeGroupId!,
                            name: route.routeGroupName || 'Unknown'
                        }]) || []
                ).values()
            );

            setFilterOptions({
                statuses: ['pending', 'active', 'completed', 'cancelled', 'delayed', 'in_transit', 'boarding', 'departed'],
                routes: routesResponse.content?.map(route => ({
                    id: route.id || '',
                    name: route.name || '',
                    routeGroup: route.routeGroupName
                })) || [],
                routeGroups,
                schedules: schedulesResponse.content?.map(schedule => ({
                    id: schedule.id || '',
                    name: schedule.name || ''
                })) || [],
                buses: busesResponse.content?.map(bus => ({
                    id: bus.id || '',
                    registrationNumber: bus.ntcRegistrationNumber || bus.plateNumber || ''
                })) || [],
                passengerServicePermits: permitsResponse.content?.map(permit => ({
                    id: permit.id || '',
                    permitNumber: permit.permitNumber || ''
                })) || []
            });
        } catch (error) {
            console.error('Error loading filter options:', error);
        } finally {
            setFilterOptionsLoading(false);
        }
    }, []);

    // Load statistics from operator's trips
    const loadStatistics = useCallback(async () => {
        try {
            // Get today's trips
            const todaysTrips = await BusOperatorOperationsService.getTodaysTrips(MOCK_OPERATOR_ID);

            // Get all trips with different statuses to calculate stats
            const allTripsResponse = await BusOperatorOperationsService.getOperatorTrips(
                MOCK_OPERATOR_ID,
                0,
                1000, // Get a large number to calculate stats
                'tripDate',
                'desc'
            );

            const allTrips = allTripsResponse.content || [];

            setStats({
                totalTrips: { count: allTripsResponse.totalElements || 0 },
                activeTrips: { count: allTrips.filter(trip => trip.status === 'active').length },
                completedTrips: { count: allTrips.filter(trip => trip.status === 'completed').length },
                pendingTrips: { count: allTrips.filter(trip => trip.status === 'pending').length },
                cancelledTrips: { count: allTrips.filter(trip => trip.status === 'cancelled').length },
                inTransitTrips: { count: allTrips.filter(trip => trip.status === 'in_transit').length },
                tripsWithPsp: { count: allTrips.filter(trip => trip.passengerServicePermitId).length },
                tripsWithBus: { count: allTrips.filter(trip => trip.busId).length },
                todaysTrips: { count: todaysTrips.length }
            });
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }, []);

    // Load trips from operator-specific API
    const loadTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response: PageTripResponse = await BusOperatorOperationsService.getOperatorTrips(
                MOCK_OPERATOR_ID,
                queryParams.page,
                queryParams.size,
                queryParams.sortBy,
                queryParams.sortDir,
                queryParams.status,
                queryParams.fromDate,
                queryParams.toDate,
                queryParams.routeGroupId,
                queryParams.routeId,
                queryParams.scheduleId,
                queryParams.passengerServicePermitId,
                queryParams.busId,
                queryParams.search
            );

            setTrips(response.content || []);
            setPagination({
                currentPage: response.number || 0,
                totalPages: response.totalPages || 0,
                totalElements: response.totalElements || 0,
                pageSize: response.size || 10,
            });
        } catch (error) {
            console.error('Error loading trips:', error);
            setError('Failed to load trips. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        loadFilterOptions();
        loadStatistics();
    }, [loadFilterOptions, loadStatistics]);

    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    // Update query params with filters
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            page: 0, // Reset to first page when filters change
            search: searchTerm,
            status: statusFilter !== 'all' ? statusFilter as any : undefined,
            routeId: routeFilter !== 'all' ? routeFilter : undefined,
            routeGroupId: routeGroupFilter !== 'all' ? routeGroupFilter : undefined,
            scheduleId: scheduleFilter !== 'all' ? scheduleFilter : undefined,
            busId: busFilter !== 'all' ? busFilter : undefined,
            passengerServicePermitId: pspFilter !== 'all' ? pspFilter : undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined
        }));
    }, [searchTerm, statusFilter, routeFilter, routeGroupFilter, scheduleFilter, busFilter, pspFilter, fromDate, toDate]);

    // Event handlers
    const handlePageChange = useCallback((page: number) => {
        setQueryParams(prev => ({ ...prev, page }));
    }, []);

    const handlePageSizeChange = useCallback((size: number) => {
        setQueryParams(prev => ({ ...prev, size, page: 0 }));
    }, []);

    const handleSort = useCallback((sortBy: string, sortDir: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortBy, sortDir, page: 0 }));
    }, []);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('all');
        setRouteFilter('all');
        setRouteGroupFilter('all');
        setScheduleFilter('all');
        setBusFilter('all');
        setPspFilter('all');
        setFromDate('');
        setToDate('');
    }, []);

    const handleView = useCallback((tripId: string) => {
        router.push(`/operator/trips/${tripId}`);
    }, [router]);

    const handleEdit = useCallback((tripId: string) => {
        router.push(`/operator/trips/${tripId}/edit`);
    }, [router]);

    const handleStart = useCallback(async (tripId: string) => {
        try {
            // Use TripManagementService for trip operations
            await TripManagementService.startTrip(tripId);
            loadTrips();
            loadStatistics();
        } catch (error) {
            console.error('Error starting trip:', error);
        }
    }, [loadTrips, loadStatistics]);

    const handleComplete = useCallback(async (tripId: string) => {
        try {
            await TripManagementService.completeTrip(tripId);
            loadTrips();
            loadStatistics();
        } catch (error) {
            console.error('Error completing trip:', error);
        }
    }, [loadTrips, loadStatistics]);

    const handleCancel = useCallback((tripId: string) => {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            setTripToCancel(trip);
            setShowCancelModal(true);
        }
    }, [trips]);

    const handleCancelConfirm = useCallback(async () => {
        if (!tripToCancel) return;

        try {
            setIsCancelling(true);
            await TripManagementService.cancelTrip(tripToCancel.id!, cancelReason || 'Cancelled by operator');
            loadTrips();
            loadStatistics();
            setShowCancelModal(false);
            setTripToCancel(null);
            setCancelReason('');
        } catch (error) {
            console.error('Error cancelling trip:', error);
        } finally {
            setIsCancelling(false);
        }
    }, [tripToCancel, cancelReason, loadTrips, loadStatistics]);

    const handleCancelCancel = useCallback(() => {
        setShowCancelModal(false);
        setTripToCancel(null);
        setCancelReason('');
    }, []);

    const handleAssignPsp = useCallback(async (tripId: string) => {
        router.push(`/operator/trips/${tripId}/assign-psp`);
    }, [router]);

    const handleSelectTrip = useCallback((tripId: string) => {
        setSelectedTrips(prev => 
            prev.includes(tripId) 
                ? prev.filter(id => id !== tripId)
                : [...prev, tripId]
        );
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedTrips.length === trips.length) {
            setSelectedTrips([]);
        } else {
            setSelectedTrips(trips.map(trip => trip.id!));
        }
    }, [selectedTrips.length, trips]);

    const handleExportAll = useCallback(async () => {
        try {
            // Implementation for exporting operator trips
            console.log('Exporting all operator trips...');
        } catch (error) {
            console.error('Error exporting trips:', error);
        }
    }, []);

    const handleBulkCancel = useCallback(async () => {
        try {
            // Implementation for bulk cancelling trips
            console.log('Bulk cancelling trips:', selectedTrips);
        } catch (error) {
            console.error('Error bulk cancelling trips:', error);
        }
    }, [selectedTrips]);

    const hasActiveFilters = useMemo(() => {
        return searchTerm ||
            statusFilter !== 'all' ||
            routeFilter !== 'all' ||
            routeGroupFilter !== 'all' ||
            scheduleFilter !== 'all' ||
            busFilter !== 'all' ||
            pspFilter !== 'all' ||
            fromDate ||
            toDate;
    }, [searchTerm, statusFilter, routeFilter, routeGroupFilter, scheduleFilter, busFilter, pspFilter, fromDate, toDate]);

    if (isLoading && trips.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header 
                    pageTitle="Trip Management" 
                    pageDescription="Manage and monitor your bus trips, schedules, and assignments" 
                />
                <div className="p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading trips...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && trips.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header 
                    pageTitle="Trip Management" 
                    pageDescription="Manage and monitor your bus trips, schedules, and assignments" 
                />
                <div className="p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="text-red-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-medium mb-2">Failed to load trips</p>
                            <p className="text-gray-500 mb-4">{error}</p>
                            <button
                                onClick={() => {
                                    setIsLoading(true);
                                    loadTrips();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                pageTitle="Trip Management" 
                pageDescription="Manage and monitor your bus trips, schedules, and assignments" 
            />
            
            <div className="p-6 space-y-6">
                {/* Statistics Cards */}
                <OperatorTripStatsCards stats={stats} />

                {/* Action Buttons */}
                <OperatorTripActionButtons
                    onExportAll={handleExportAll}
                    onBulkCancel={selectedTrips.length > 0 ? handleBulkCancel : undefined}
                    isLoading={isLoading}
                    selectedCount={selectedTrips.length}
                />

                {/* Filters */}
                <OperatorTripAdvancedFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    routeFilter={routeFilter}
                    setRouteFilter={setRouteFilter}
                    routeGroupFilter={routeGroupFilter}
                    setRouteGroupFilter={setRouteGroupFilter}
                    scheduleFilter={scheduleFilter}
                    setScheduleFilter={setScheduleFilter}
                    busFilter={busFilter}
                    setBusFilter={setBusFilter}
                    pspFilter={pspFilter}
                    setPspFilter={setPspFilter}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                    filterOptions={filterOptions}
                    loading={filterOptionsLoading}
                    totalCount={pagination.totalElements}
                    filteredCount={pagination.totalElements}
                    onClearAll={handleClearAllFilters}
                    onSearch={handleSearch}
                />

                <div className="bg-white shadow-sm">
                    {/* Trips Table */}
                    <OperatorTripsTable
                        trips={trips}
                        onView={handleView}
                        onEdit={handleEdit}
                        onStart={handleStart}
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                        onAssignPsp={handleAssignPsp}
                        onSort={handleSort}
                        loading={isLoading}
                        currentSort={{ field: queryParams.sortBy, direction: queryParams.sortDir }}
                        selectedTrips={selectedTrips}
                        onSelectTrip={handleSelectTrip}
                        onSelectAll={handleSelectAll}
                    />
                    
                    {/* Pagination */}
                    {pagination.totalElements > 0 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalElements={pagination.totalElements}
                            pageSize={pagination.pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            searchActive={!!searchTerm}
                            filterCount={hasActiveFilters ? 1 : 0}
                        />
                    )}
                </div>

                {/* Cancel Trip Modal */}
                {showCancelModal && tripToCancel && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Trip</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to cancel this trip? Please provide a reason:
                            </p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Cancellation reason (optional)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCancelCancel}
                                    disabled={isCancelling}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Keep Trip
                                </button>
                                <button
                                    onClick={handleCancelConfirm}
                                    disabled={isCancelling}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Cancel Trip'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
