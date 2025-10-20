'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RouteManagementService } from '@/lib/api-client/route-management/services/RouteManagementService';
import { TripManagementService } from '@/lib/api-client/route-management/services/TripManagementService';
import { PermitManagementService } from '@/lib/api-client/route-management/services/PermitManagementService';
import { BusStopManagementService } from '@/lib/api-client/route-management/services/BusStopManagementService';
import type { RouteGroupResponse } from '@/lib/api-client/route-management/models/RouteGroupResponse';
import type { PassengerServicePermitResponse } from '@/lib/api-client/route-management/models/PassengerServicePermitResponse';
import type { TripResponse } from '@/lib/api-client/route-management/models/TripResponse';
import type { BulkPspAssignmentRequest } from '@/lib/api-client/route-management/models/BulkPspAssignmentRequest';
import type { RouteResponse } from '@/lib/api-client/route-management/models/RouteResponse';
import type { StopResponse } from '@/lib/api-client/route-management/models/StopResponse';
import { getUserFromToken } from '@/lib/utils/jwtHandler';
import { getCookie } from '@/lib/utils/cookieUtils';
import { userManagementClient } from '@/lib/api/client';

// Workspace Sections
import { TimeKeeperTripsWorkspace } from './components/TimeKeeperTripsWorkspace';
import { TimeKeeperWorkspaceHeader } from './components/TimeKeeperWorkspaceHeader';
import { TimeKeeperWorkspaceSidebar } from './components/TimeKeeperWorkspaceSidebar';
import { TimeKeeperAssignmentPanel } from './components/TimeKeeperAssignmentPanel';

export interface TimeKeeperWorkspaceState {
  // TimeKeeper specific
  assignedBusStopId: string | null;
  assignedBusStopName: string | null;
  busStopDetails: StopResponse | null;
  userId: string | null;

  // Active selections
  selectedRouteGroup: string | null;
  selectedRoute: string | null;
  selectedDateRange: {
    startDate: Date;
    endDate: Date;
  };
  selectedTrips: string[];

  // Data
  routeGroups: RouteGroupResponse[];
  availableRoutes: RouteResponse[]; // Routes that start from assigned bus stop
  trips: TripResponse[];
  permits: PassengerServicePermitResponse[];

  // Loading states
  isLoadingRouteGroups: boolean;
  isLoadingTrips: boolean;
  isLoadingPermits: boolean;
  isAssigningPsps: boolean;
  isLoadingAssignedStop: boolean;

  // Error states
  routeGroupsError: string | null;
  tripsError: string | null;
  permitsError: string | null;
  assignmentError: string | null;
  assignedStopError: string | null;
}

export function TimeKeeperTripAssignmentWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Workspace state
  const [workspace, setWorkspace] = useState<TimeKeeperWorkspaceState>({
    assignedBusStopId: null,
    assignedBusStopName: null,
    busStopDetails: null,
    userId: null,
    selectedRouteGroup: null,
    selectedRoute: null,
    selectedDateRange: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
    },
    selectedTrips: [],
    routeGroups: [],
    availableRoutes: [],
    trips: [],
    permits: [],
    isLoadingRouteGroups: true,
    isLoadingTrips: false,
    isLoadingPermits: false,
    isAssigningPsps: false,
    isLoadingAssignedStop: true,
    routeGroupsError: null,
    tripsError: null,
    permitsError: null,
    assignmentError: null,
    assignedStopError: null,
  });

  // Workspace view mode
  const [activeSection, setActiveSection] = useState<
    'assignments' | 'monitoring'
  >('assignments');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize workspace data
  useEffect(() => {
    loadAssignedBusStop();
  }, []);

  // Load route groups after assigned bus stop is loaded
  useEffect(() => {
    if (workspace.assignedBusStopId) {
      loadRouteGroups();
    }
  }, [workspace.assignedBusStopId]);

  // Handle incoming trip ID from URL parameters
  useEffect(() => {
    const tripId = searchParams.get('tripId');
    if (tripId && workspace.availableRoutes.length > 0) {
      handleIncomingTripId(tripId);
    }
  }, [searchParams, workspace.availableRoutes]);

  // Function to handle incoming trip ID
  const handleIncomingTripId = async (tripId: string) => {
    try {
      // Fetch the trip details
      const trip = await TripManagementService.getTripById(tripId);

      if (!trip || !trip.routeId) {
        console.error('Trip not found or invalid');
        return;
      }

      // Find the route for this trip
      const route = workspace.availableRoutes.find(
        (r) => r.id === trip.routeId
      );

      if (!route) {
        console.error('Route not found in available routes');
        return;
      }

      // Select the route group
      if (route.routeGroupId) {
        handleRouteGroupSelect(route.routeGroupId);

        // Wait a bit for route group to load, then select route
        setTimeout(() => {
          handleRouteSelect(route.id!);

          // Wait for trips to load, then select the trip
          setTimeout(() => {
            handleTripSelect(tripId, false);

            // Clear the URL parameter after processing
            const newUrl = window.location.pathname;
            router.replace(newUrl);
          }, 500);
        }, 500);
      }
    } catch (error) {
      console.error('Error handling incoming trip ID:', error);
    }
  };

  // Load TimeKeeper's assigned bus stop (reused from trip page)
  const loadAssignedBusStop = async () => {
    try {
      setWorkspace((prev) => ({
        ...prev,
        isLoadingAssignedStop: true,
        assignedStopError: null,
      }));

      // Step 1: Get access token from cookies
      const accessToken = getCookie('access_token');

      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      // Step 2: Extract user ID from JWT token
      const userFromToken = getUserFromToken(accessToken);

      if (!userFromToken?.id) {
        throw new Error('Invalid access token. Please log in again.');
      }

      const extractedUserId = userFromToken.id;

      console.log('Extracted User ID from token:', extractedUserId);

      // Step 3: Fetch timekeeper profile to get assigned_stand
      const timekeeperResponse = await userManagementClient.get(
        `/api/timekeeper/profile/${extractedUserId}`
      );

      const timekeeperData = timekeeperResponse.data;

      // Extract assigned_stand from the response
      const assignedStandId = timekeeperData.assign_stand;
      console.log('Assigned Stand ID:', assignedStandId);

      if (!assignedStandId) {
        throw new Error('No bus stop assigned to this timekeeper');
      }

      // Step 4: Fetch bus stop details using the BusStopManagementService
      const busStop = await BusStopManagementService.getStopById(
        assignedStandId
      );

      setWorkspace((prev) => ({
        ...prev,
        assignedBusStopId: assignedStandId,
        assignedBusStopName: busStop.name || 'Unknown Stop',
        busStopDetails: busStop,
        userId: extractedUserId,
        isLoadingAssignedStop: false,
      }));
    } catch (error: any) {
      console.error('Error loading assigned bus stop:', error);
      setWorkspace((prev) => ({
        ...prev,
        assignedBusStopName: 'Unknown Stop',
        assignedStopError: error?.message || 'Failed to load assigned bus stop',
        isLoadingAssignedStop: false,
      }));
    }
  };

  // Load route groups (filtered by routes starting from assigned bus stop)
  const loadRouteGroups = async () => {
    try {
      setWorkspace((prev) => ({
        ...prev,
        isLoadingRouteGroups: true,
        routeGroupsError: null,
      }));

      // Get all routes to filter by starting bus stop
      const allRoutes = await RouteManagementService.getAllRoutesAsList();

      // Filter routes that pass through the timekeeper's assigned bus stop
      // Include both:
      // 1. OUTBOUND routes that START from the assigned bus stop
      // 2. INBOUND routes that END at the assigned bus stop (return routes)
      const routesStartingFromAssignedStop = allRoutes.filter(
        (route) =>
          route.startStopId === workspace.assignedBusStopId ||
          route.endStopId === workspace.assignedBusStopId
      );

      console.log(
        'Routes passing through assigned stop:',
        routesStartingFromAssignedStop
      );
      console.log(
        'OUTBOUND routes:',
        routesStartingFromAssignedStop.filter((r) => r.direction === 'OUTBOUND')
          .length
      );
      console.log(
        'INBOUND routes:',
        routesStartingFromAssignedStop.filter((r) => r.direction === 'INBOUND')
          .length
      );

      // Get unique route group IDs from filtered routes
      const routeGroupIds = new Set(
        routesStartingFromAssignedStop
          .map((route) => route.routeGroupId)
          .filter((id): id is string => id !== undefined && id !== null)
      );

      // Get all route groups
      const allRouteGroups =
        await RouteManagementService.getAllRouteGroupsAsList();

      // Filter route groups to only include those with routes starting from assigned stop
      const filteredRouteGroups = allRouteGroups.filter((group) =>
        routeGroupIds.has(group.id || '')
      );

      console.log('Filtered route groups:', filteredRouteGroups);

      setWorkspace((prev) => ({
        ...prev,
        routeGroups: filteredRouteGroups,
        availableRoutes: routesStartingFromAssignedStop,
        isLoadingRouteGroups: false,
      }));
    } catch (error) {
      console.error('Error loading route groups:', error);
      setWorkspace((prev) => ({
        ...prev,
        routeGroupsError: 'Failed to load route groups',
        isLoadingRouteGroups: false,
      }));
    }
  };

  // Load trips for selected route (routes passing through assigned bus stop)
  const loadTrips = async (routeId: string) => {
    try {
      setWorkspace((prev) => ({
        ...prev,
        isLoadingTrips: true,
        tripsError: null,
      }));

      // Verify that the selected route passes through the assigned bus stop
      const selectedRoute = workspace.availableRoutes.find(
        (route) => route.id === routeId
      );

      if (!selectedRoute) {
        throw new Error(
          'Selected route does not pass through your assigned bus stop'
        );
      }

      const response = await TripManagementService.getTripsByRoute(routeId);

      setWorkspace((prev) => ({
        ...prev,
        trips: response,
        isLoadingTrips: false,
      }));
    } catch (error: any) {
      console.error('Error loading trips:', error);
      setWorkspace((prev) => ({
        ...prev,
        tripsError: error?.message || 'Failed to load trips',
        isLoadingTrips: false,
      }));
    }
  };

  // Load permits for selected route group
  const loadPermits = async (routeGroupId: string) => {
    try {
      setWorkspace((prev) => ({
        ...prev,
        isLoadingPermits: true,
        permitsError: null,
      }));
      const response = await PermitManagementService.getPermitsByRouteGroupId(
        routeGroupId
      );
      setWorkspace((prev) => ({
        ...prev,
        permits: response,
        isLoadingPermits: false,
      }));
    } catch (error) {
      console.error('Error loading permits:', error);
      setWorkspace((prev) => ({
        ...prev,
        permitsError: 'Failed to load permits',
        isLoadingPermits: false,
      }));
    }
  };

  // Bulk assign PSPs to trips
  const bulkAssignPsps = async (assignments: BulkPspAssignmentRequest) => {
    try {
      setWorkspace((prev) => ({
        ...prev,
        isAssigningPsps: true,
        assignmentError: null,
      }));

      const response = await TripManagementService.bulkAssignPspsToTrips(
        assignments
      );

      // Refresh trips after assignment
      if (workspace.selectedRoute) {
        await loadTrips(workspace.selectedRoute);
      }

      setWorkspace((prev) => ({
        ...prev,
        isAssigningPsps: false,
        selectedTrips: [],
      }));
      return response;
    } catch (error) {
      console.error('Error assigning PSPs:', error);
      setWorkspace((prev) => ({
        ...prev,
        assignmentError: 'Failed to assign PSPs',
        isAssigningPsps: false,
      }));
      throw error;
    }
  };

  // Handle route group selection
  const handleRouteGroupSelect = (routeGroupId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      selectedRouteGroup: routeGroupId,
      selectedRoute: null,
      selectedTrips: [],
      trips: [],
    }));
    loadPermits(routeGroupId);
  };

  // Handle route selection
  const handleRouteSelect = (routeId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      selectedRoute: routeId,
      selectedTrips: [],
    }));
    loadTrips(routeId);
  };

  // Handle trip selection
  const handleTripSelect = (tripId: string, multi: boolean = false) => {
    setWorkspace((prev) => {
      const selectedTrips = multi
        ? prev.selectedTrips.includes(tripId)
          ? prev.selectedTrips.filter((id) => id !== tripId)
          : [...prev.selectedTrips, tripId]
        : [tripId];

      return { ...prev, selectedTrips };
    });
  };

  // Handle clear all selections
  const handleClearSelection = () => {
    setWorkspace((prev) => ({
      ...prev,
      selectedTrips: [],
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setWorkspace((prev) => ({
      ...prev,
      selectedDateRange: { startDate, endDate },
    }));
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-50">
      {/* Workspace Sidebar */}
      <TimeKeeperWorkspaceSidebar
        workspace={workspace}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onRouteGroupSelect={handleRouteGroupSelect}
        onRouteSelect={handleRouteSelect}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace Header */}
        <TimeKeeperWorkspaceHeader
          workspace={workspace}
          activeSection={activeSection}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Assignment Management */}
          {activeSection === 'assignments' && (
            <TimeKeeperAssignmentPanel
              workspace={workspace}
              onBulkAssign={bulkAssignPsps}
            />
          )}

          {/* Center Panel - Trips Workspace */}
          <TimeKeeperTripsWorkspace
            workspace={workspace}
            onTripSelect={handleTripSelect}
            activeSection={activeSection}
            onRefreshTrips={() =>
              workspace.selectedRoute && loadTrips(workspace.selectedRoute)
            }
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>
    </div>
  );
}
