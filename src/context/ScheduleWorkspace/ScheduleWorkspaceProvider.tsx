'use client';

import { ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import { ScheduleWorkspaceContext, ScheduleWorkspaceMode } from './ScheduleWorkspaceContext';
import {
  ScheduleWorkspaceData,
  createEmptyScheduleWorkspaceData,
  createEmptyCalendar,
  createEmptySchedule,
  createScheduleForRoute,
  Schedule,
  ScheduleStop,
  ScheduleCalendar,
  ScheduleException,
  RouteReference,
  RouteStopReference,
  isScheduleValid,
  validateAllSchedules as validateAllSchedulesHelper,
  scheduleToApiRequest,
  calculateTimeOffset,
  ScheduleTypeEnum,
  ScheduleStatusEnum,
  ExceptionTypeEnum,
} from '@/types/ScheduleWorkspaceData';

interface ScheduleWorkspaceProviderProps {
  children: ReactNode;
}

// Dummy data for initial development - will be replaced with API calls
const DUMMY_ROUTES: RouteReference[] = [
  {
    id: 'route-001',
    name: 'Colombo - Kandy (Via Kegalle)',
    routeGroupId: 'rg-001',
    routeGroupName: '1 - Colombo - Kandy',
    direction: 'OUTBOUND',
    startStopName: 'Colombo Central',
    endStopName: 'Kandy',
  },
  {
    id: 'route-002',
    name: 'Kandy - Colombo (Via Kegalle)',
    routeGroupId: 'rg-001',
    routeGroupName: '1 - Colombo - Kandy',
    direction: 'INBOUND',
    startStopName: 'Kandy',
    endStopName: 'Colombo Central',
  },
  {
    id: 'route-003',
    name: 'Colombo - Galle (Expressway)',
    routeGroupId: 'rg-002',
    routeGroupName: '2 - Colombo - Galle',
    direction: 'OUTBOUND',
    startStopName: 'Colombo Central',
    endStopName: 'Galle',
  },
];

const DUMMY_ROUTE_STOPS: Record<string, RouteStopReference[]> = {
  'route-001': [
    { id: 'stop-001', name: 'Colombo Central', stopOrder: 0, distanceFromStartKm: 0 },
    { id: 'stop-002', name: 'Pettah', stopOrder: 1, distanceFromStartKm: 2 },
    { id: 'stop-003', name: 'Maradana', stopOrder: 2, distanceFromStartKm: 4 },
    { id: 'stop-004', name: 'Kelaniya', stopOrder: 3, distanceFromStartKm: 10 },
    { id: 'stop-005', name: 'Kadawatha', stopOrder: 4, distanceFromStartKm: 18 },
    { id: 'stop-006', name: 'Nittambuwa', stopOrder: 5, distanceFromStartKm: 35 },
    { id: 'stop-007', name: 'Warakapola', stopOrder: 6, distanceFromStartKm: 55 },
    { id: 'stop-008', name: 'Kegalle', stopOrder: 7, distanceFromStartKm: 75 },
    { id: 'stop-009', name: 'Mawanella', stopOrder: 8, distanceFromStartKm: 90 },
    { id: 'stop-010', name: 'Kadugannawa', stopOrder: 9, distanceFromStartKm: 100 },
    { id: 'stop-011', name: 'Peradeniya', stopOrder: 10, distanceFromStartKm: 110 },
    { id: 'stop-012', name: 'Kandy', stopOrder: 11, distanceFromStartKm: 115 },
  ],
  'route-002': [
    { id: 'stop-012', name: 'Kandy', stopOrder: 0, distanceFromStartKm: 0 },
    { id: 'stop-011', name: 'Peradeniya', stopOrder: 1, distanceFromStartKm: 5 },
    { id: 'stop-010', name: 'Kadugannawa', stopOrder: 2, distanceFromStartKm: 15 },
    { id: 'stop-009', name: 'Mawanella', stopOrder: 3, distanceFromStartKm: 25 },
    { id: 'stop-008', name: 'Kegalle', stopOrder: 4, distanceFromStartKm: 40 },
    { id: 'stop-007', name: 'Warakapola', stopOrder: 5, distanceFromStartKm: 60 },
    { id: 'stop-006', name: 'Nittambuwa', stopOrder: 6, distanceFromStartKm: 80 },
    { id: 'stop-005', name: 'Kadawatha', stopOrder: 7, distanceFromStartKm: 97 },
    { id: 'stop-004', name: 'Kelaniya', stopOrder: 8, distanceFromStartKm: 105 },
    { id: 'stop-003', name: 'Maradana', stopOrder: 9, distanceFromStartKm: 111 },
    { id: 'stop-002', name: 'Pettah', stopOrder: 10, distanceFromStartKm: 113 },
    { id: 'stop-001', name: 'Colombo Central', stopOrder: 11, distanceFromStartKm: 115 },
  ],
  'route-003': [
    { id: 'stop-020', name: 'Colombo Central', stopOrder: 0, distanceFromStartKm: 0 },
    { id: 'stop-021', name: 'Kottawa', stopOrder: 1, distanceFromStartKm: 25 },
    { id: 'stop-022', name: 'Kahathuduwa', stopOrder: 2, distanceFromStartKm: 35 },
    { id: 'stop-023', name: 'Dodangoda', stopOrder: 3, distanceFromStartKm: 55 },
    { id: 'stop-024', name: 'Welipenna', stopOrder: 4, distanceFromStartKm: 70 },
    { id: 'stop-025', name: 'Kurundugaha', stopOrder: 5, distanceFromStartKm: 85 },
    { id: 'stop-026', name: 'Baddegama', stopOrder: 6, distanceFromStartKm: 100 },
    { id: 'stop-027', name: 'Pinnaduwa', stopOrder: 7, distanceFromStartKm: 110 },
    { id: 'stop-028', name: 'Galle', stopOrder: 8, distanceFromStartKm: 120 },
  ],
};

// Helper to create dummy schedules for a route
const createDummySchedulesForRoute = (
  routeId: string,
  routeName: string,
  routeGroupId: string,
  routeGroupName: string,
  routeStops: RouteStopReference[]
): Schedule[] => {
  return [
    {
      name: 'Morning Express',
      routeId,
      routeName,
      routeGroupId,
      routeGroupName,
      scheduleType: ScheduleTypeEnum.REGULAR,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      status: ScheduleStatusEnum.ACTIVE,
      description: 'Early morning express service',
      generateTrips: true,
      scheduleStops: routeStops.map((stop, index) => ({
        stopId: stop.id,
        stopName: stop.name,
        stopOrder: stop.stopOrder,
        arrivalTime: calculateTimeOffset('06:00', index * 10),
        departureTime: calculateTimeOffset('06:00', index * 10 + 2),
      })),
      calendar: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      exceptions: [
        { id: 'exc-001', exceptionDate: '2024-04-14', exceptionType: ExceptionTypeEnum.REMOVED, description: 'New Year Holiday' },
      ],
    },
    {
      name: 'Mid-Morning Service',
      routeId,
      routeName,
      routeGroupId,
      routeGroupName,
      scheduleType: ScheduleTypeEnum.REGULAR,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      status: ScheduleStatusEnum.ACTIVE,
      description: 'Regular mid-morning service',
      generateTrips: true,
      scheduleStops: routeStops.map((stop, index) => ({
        stopId: stop.id,
        stopName: stop.name,
        stopOrder: stop.stopOrder,
        arrivalTime: calculateTimeOffset('08:30', index * 12),
        departureTime: calculateTimeOffset('08:30', index * 12 + 2),
      })),
      calendar: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      exceptions: [],
    },
    {
      name: 'Afternoon Service',
      routeId,
      routeName,
      routeGroupId,
      routeGroupName,
      scheduleType: ScheduleTypeEnum.REGULAR,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      status: ScheduleStatusEnum.ACTIVE,
      description: 'Afternoon regular service',
      generateTrips: true,
      scheduleStops: routeStops.map((stop, index) => ({
        stopId: stop.id,
        stopName: stop.name,
        stopOrder: stop.stopOrder,
        arrivalTime: calculateTimeOffset('14:00', index * 10),
        departureTime: calculateTimeOffset('14:00', index * 10 + 2),
      })),
      calendar: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
      exceptions: [],
    },
    {
      name: 'Evening Express',
      routeId,
      routeName,
      routeGroupId,
      routeGroupName,
      scheduleType: ScheduleTypeEnum.REGULAR,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      status: ScheduleStatusEnum.ACTIVE,
      description: 'Evening rush hour express',
      generateTrips: true,
      scheduleStops: routeStops.map((stop, index) => ({
        stopId: stop.id,
        stopName: stop.name,
        stopOrder: stop.stopOrder,
        arrivalTime: calculateTimeOffset('17:30', index * 8),
        departureTime: calculateTimeOffset('17:30', index * 8 + 1),
      })),
      calendar: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      exceptions: [
        { id: 'exc-002', exceptionDate: '2024-12-25', exceptionType: ExceptionTypeEnum.REMOVED, description: 'Christmas' },
      ],
    },
  ];
};

export function ScheduleWorkspaceProvider({ children }: ScheduleWorkspaceProviderProps) {
  // Mode and loading state
  const [mode, setMode] = useState<ScheduleWorkspaceMode>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize with dummy data for development (route-001 selected with schedules)
  const initialRoute = DUMMY_ROUTES[0];
  const initialRouteStops = DUMMY_ROUTE_STOPS['route-001'];
  
  const [data, setData] = useState<ScheduleWorkspaceData>(() => ({
    selectedRouteId: initialRoute.id,
    selectedRouteName: initialRoute.name,
    selectedRouteGroupId: initialRoute.routeGroupId || null,
    selectedRouteGroupName: initialRoute.routeGroupName || null,
    schedules: createDummySchedulesForRoute(
      initialRoute.id,
      initialRoute.name,
      initialRoute.routeGroupId || '',
      initialRoute.routeGroupName || '',
      initialRouteStops
    ),
    activeScheduleIndex: 0,
    highlightedScheduleIndex: null,
    availableRoutes: DUMMY_ROUTES,
    routeStops: initialRouteStops,
    selectedStopIndex: null,
    selectedExceptionIndex: null,
  }));

  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
  const [selectedExceptionIndex, setSelectedExceptionIndex] = useState<number | null>(null);

  // Clear highlight after a delay
  useEffect(() => {
    if (data.highlightedScheduleIndex !== null) {
      const timer = setTimeout(() => {
        setData(prev => ({ ...prev, highlightedScheduleIndex: null }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data.highlightedScheduleIndex]);

  // Load existing schedules for a route (placeholder - will use real API later)
  const loadSchedulesForRoute = useCallback(async (routeId: string): Promise<boolean> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      // TODO: Replace with actual API call
      console.log('Loading schedules for route:', routeId);
      setMode('edit');
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to load schedules:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load schedules');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Reset to create mode
  const resetToCreateMode = useCallback(() => {
    setMode('create');
    setLoadError(null);
    setData({
      ...createEmptyScheduleWorkspaceData(),
      availableRoutes: DUMMY_ROUTES,
    });
    setSelectedStopIndex(null);
    setSelectedExceptionIndex(null);
  }, []);

  // Set selected route and load its schedules
  const setSelectedRoute = useCallback((routeId: string) => {
    const selectedRoute = DUMMY_ROUTES.find(r => r.id === routeId);
    const routeStops = DUMMY_ROUTE_STOPS[routeId] || [];
    
    if (!selectedRoute) return;

    // Create dummy schedules for this route
    const schedules = createDummySchedulesForRoute(
      routeId,
      selectedRoute.name,
      selectedRoute.routeGroupId || '',
      selectedRoute.routeGroupName || '',
      routeStops
    );

    setData(prev => ({
      ...prev,
      selectedRouteId: routeId,
      selectedRouteName: selectedRoute.name,
      selectedRouteGroupId: selectedRoute.routeGroupId || null,
      selectedRouteGroupName: selectedRoute.routeGroupName || null,
      schedules,
      activeScheduleIndex: schedules.length > 0 ? 0 : null,
      highlightedScheduleIndex: null,
      routeStops,
    }));
  }, []);

  // Load available routes
  const loadAvailableRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      setData(prev => ({ ...prev, availableRoutes: DUMMY_ROUTES }));
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Active schedule index management
  const setActiveScheduleIndex = useCallback((index: number | null) => {
    setData(prev => ({ ...prev, activeScheduleIndex: index }));
  }, []);

  // Highlighted schedule index (for grid highlighting)
  const setHighlightedScheduleIndex = useCallback((index: number | null) => {
    setData(prev => ({ ...prev, highlightedScheduleIndex: index }));
  }, []);

  // Add new schedule
  const addNewSchedule = useCallback(() => {
    setData(prev => {
      if (!prev.selectedRouteId) return prev;
      
      const newSchedule = createScheduleForRoute(
        prev.selectedRouteId,
        prev.selectedRouteName || '',
        prev.selectedRouteGroupId || '',
        prev.selectedRouteGroupName || '',
        prev.routeStops,
        `Schedule ${prev.schedules.length + 1}`
      );
      
      const newSchedules = [...prev.schedules, newSchedule];
      return {
        ...prev,
        schedules: newSchedules,
        activeScheduleIndex: newSchedules.length - 1,
      };
    });
  }, []);

  // Remove schedule
  const removeSchedule = useCallback((scheduleIndex: number) => {
    setData(prev => {
      const newSchedules = prev.schedules.filter((_, i) => i !== scheduleIndex);
      let newActiveIndex = prev.activeScheduleIndex;
      
      if (newActiveIndex !== null) {
        if (newActiveIndex === scheduleIndex) {
          newActiveIndex = newSchedules.length > 0 ? Math.min(scheduleIndex, newSchedules.length - 1) : null;
        } else if (newActiveIndex > scheduleIndex) {
          newActiveIndex = newActiveIndex - 1;
        }
      }
      
      return {
        ...prev,
        schedules: newSchedules,
        activeScheduleIndex: newActiveIndex,
      };
    });
  }, []);

  // Duplicate schedule
  const duplicateSchedule = useCallback((scheduleIndex: number) => {
    setData(prev => {
      if (scheduleIndex < 0 || scheduleIndex >= prev.schedules.length) return prev;
      
      const original = prev.schedules[scheduleIndex];
      const duplicate: Schedule = {
        ...original,
        id: undefined, // Remove ID so it's treated as new
        name: `${original.name} (Copy)`,
        scheduleStops: original.scheduleStops.map(stop => ({ ...stop, id: undefined })),
        exceptions: original.exceptions.map(exc => ({ ...exc, id: `exc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` })),
      };
      
      const newSchedules = [...prev.schedules, duplicate];
      return {
        ...prev,
        schedules: newSchedules,
        activeScheduleIndex: newSchedules.length - 1,
      };
    });
  }, []);

  // Get active schedule
  const getActiveSchedule = useCallback((): Schedule | null => {
    if (data.activeScheduleIndex === null || data.activeScheduleIndex >= data.schedules.length) {
      return null;
    }
    return data.schedules[data.activeScheduleIndex];
  }, [data.activeScheduleIndex, data.schedules]);

  // Update active schedule metadata
  const updateActiveSchedule = useCallback((scheduleUpdate: Partial<Schedule>) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      newSchedules[prev.activeScheduleIndex] = {
        ...newSchedules[prev.activeScheduleIndex],
        ...scheduleUpdate,
      };
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  // Update schedule stop for active schedule
  const updateScheduleStop = useCallback((stopIndex: number, scheduleStopUpdate: Partial<ScheduleStop>) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      const newStops = [...schedule.scheduleStops];
      
      if (stopIndex >= 0 && stopIndex < newStops.length) {
        newStops[stopIndex] = { ...newStops[stopIndex], ...scheduleStopUpdate };
        newSchedules[prev.activeScheduleIndex] = { ...schedule, scheduleStops: newStops };
      }
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  // Update schedule stop by schedule index (for grid editing)
  const updateScheduleStopByScheduleIndex = useCallback((
    scheduleIndex: number,
    stopIndex: number,
    scheduleStopUpdate: Partial<ScheduleStop>
  ) => {
    setData(prev => {
      if (scheduleIndex < 0 || scheduleIndex >= prev.schedules.length) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[scheduleIndex];
      const newStops = [...schedule.scheduleStops];
      
      if (stopIndex >= 0 && stopIndex < newStops.length) {
        newStops[stopIndex] = { ...newStops[stopIndex], ...scheduleStopUpdate };
        newSchedules[scheduleIndex] = { ...schedule, scheduleStops: newStops };
      }
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  // Set all stop times for active schedule
  const setAllStopTimes = useCallback((baseTime: string, intervalMinutes: number) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      const newStops = schedule.scheduleStops.map((stop, index) => ({
        ...stop,
        arrivalTime: calculateTimeOffset(baseTime, index * intervalMinutes),
        departureTime: calculateTimeOffset(baseTime, index * intervalMinutes + 2),
      }));
      newSchedules[prev.activeScheduleIndex] = { ...schedule, scheduleStops: newStops };
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  // Clear all stop times for active schedule
  const clearAllStopTimes = useCallback(() => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      const newStops = schedule.scheduleStops.map(stop => ({
        ...stop,
        arrivalTime: '',
        departureTime: '',
      }));
      newSchedules[prev.activeScheduleIndex] = { ...schedule, scheduleStops: newStops };
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  // Calendar operations for active schedule
  const updateCalendar = useCallback((calendarUpdate: Partial<ScheduleCalendar>) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      newSchedules[prev.activeScheduleIndex] = {
        ...schedule,
        calendar: { ...schedule.calendar, ...calendarUpdate },
      };
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  const setAllDays = useCallback((enabled: boolean) => {
    updateCalendar({
      monday: enabled, tuesday: enabled, wednesday: enabled, thursday: enabled,
      friday: enabled, saturday: enabled, sunday: enabled,
    });
  }, [updateCalendar]);

  const setWeekdaysOnly = useCallback(() => {
    updateCalendar({
      monday: true, tuesday: true, wednesday: true, thursday: true, friday: true,
      saturday: false, sunday: false,
    });
  }, [updateCalendar]);

  const setWeekendsOnly = useCallback(() => {
    updateCalendar({
      monday: false, tuesday: false, wednesday: false, thursday: false, friday: false,
      saturday: true, sunday: true,
    });
  }, [updateCalendar]);

  // Exception operations for active schedule
  const addException = useCallback((exception: ScheduleException) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      newSchedules[prev.activeScheduleIndex] = {
        ...schedule,
        exceptions: [...schedule.exceptions, exception],
      };
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  const updateException = useCallback((exceptionIndex: number, exceptionUpdate: Partial<ScheduleException>) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      const newExceptions = [...schedule.exceptions];
      
      if (exceptionIndex >= 0 && exceptionIndex < newExceptions.length) {
        newExceptions[exceptionIndex] = { ...newExceptions[exceptionIndex], ...exceptionUpdate };
        newSchedules[prev.activeScheduleIndex] = { ...schedule, exceptions: newExceptions };
      }
      
      return { ...prev, schedules: newSchedules };
    });
  }, []);

  const removeException = useCallback((exceptionIndex: number) => {
    setData(prev => {
      if (prev.activeScheduleIndex === null) return prev;
      
      const newSchedules = [...prev.schedules];
      const schedule = newSchedules[prev.activeScheduleIndex];
      newSchedules[prev.activeScheduleIndex] = {
        ...schedule,
        exceptions: schedule.exceptions.filter((_, i) => i !== exceptionIndex),
      };
      
      return { ...prev, schedules: newSchedules };
    });
    
    if (selectedExceptionIndex === exceptionIndex) {
      setSelectedExceptionIndex(null);
    }
  }, [selectedExceptionIndex]);

  // Get all schedules
  const getAllSchedules = useCallback(() => data.schedules, [data.schedules]);

  // Validate all schedules
  const validateAllSchedules = useCallback(() => {
    return validateAllSchedulesHelper(data.schedules);
  }, [data.schedules]);

  // Submit all schedules
  const submitAllSchedules = useCallback(async () => {
    const validation = validateAllSchedulesHelper(data.schedules);
    
    if (!validation.valid) {
      console.error('Schedule validation failed:', validation.scheduleErrors);
      return;
    }

    const apiRequests = data.schedules.map(schedule => scheduleToApiRequest(schedule));
    
    console.log('='.repeat(60));
    console.log('ALL SCHEDULES SUBMISSION DATA');
    console.log('='.repeat(60));
    console.log('Mode:', mode);
    console.log('Route ID:', data.selectedRouteId);
    console.log('Route Name:', data.selectedRouteName);
    console.log('Total Schedules:', data.schedules.length);
    console.log('-'.repeat(60));
    console.log('Workspace Schedules Data:');
    console.log(JSON.stringify(data.schedules, null, 2));
    console.log('-'.repeat(60));
    console.log('API Request Format (ready to send to backend):');
    console.log(JSON.stringify(apiRequests, null, 2));
    console.log('='.repeat(60));
  }, [data.schedules, data.selectedRouteId, data.selectedRouteName, mode]);

  const contextValue = useMemo(() => ({
    mode,
    isLoading,
    loadError,
    loadSchedulesForRoute,
    resetToCreateMode,
    data,
    setSelectedRoute,
    loadAvailableRoutes,
    activeScheduleIndex: data.activeScheduleIndex,
    setActiveScheduleIndex,
    highlightedScheduleIndex: data.highlightedScheduleIndex,
    setHighlightedScheduleIndex,
    addNewSchedule,
    removeSchedule,
    duplicateSchedule,
    updateActiveSchedule,
    getActiveSchedule,
    updateScheduleStop,
    setAllStopTimes,
    clearAllStopTimes,
    updateScheduleStopByScheduleIndex,
    updateCalendar,
    setAllDays,
    setWeekdaysOnly,
    setWeekendsOnly,
    addException,
    updateException,
    removeException,
    selectedStopIndex,
    setSelectedStopIndex,
    selectedExceptionIndex,
    setSelectedExceptionIndex,
    getAllSchedules,
    validateAllSchedules,
    submitAllSchedules,
  }), [
    mode, isLoading, loadError, loadSchedulesForRoute, resetToCreateMode, data,
    setSelectedRoute, loadAvailableRoutes, setActiveScheduleIndex, setHighlightedScheduleIndex,
    addNewSchedule, removeSchedule, duplicateSchedule, updateActiveSchedule, getActiveSchedule,
    updateScheduleStop, setAllStopTimes, clearAllStopTimes, updateScheduleStopByScheduleIndex,
    updateCalendar, setAllDays, setWeekdaysOnly, setWeekendsOnly,
    addException, updateException, removeException,
    selectedStopIndex, selectedExceptionIndex, getAllSchedules, validateAllSchedules, submitAllSchedules,
  ]);

  return (
    <ScheduleWorkspaceContext.Provider value={contextValue}>
      {children}
    </ScheduleWorkspaceContext.Provider>
  );
}
