import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { 
  BusStopManagementService, 
  PageStopResponse, 
  StopRequest, 
  StopResponse 
} from '../../generated/api-clients/route-management';

interface BusStopQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

interface FilterOptions {
  states: string[];
  accessibilityStatuses: boolean[];
}

interface PaginationState {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface UseBusStopsReturn {
  // Data states
  busStops: StopResponse[];
  allBusStops: StopResponse[];
  filterOptions: FilterOptions;
  pagination: PaginationState;
  
  // Loading states
  loading: boolean;
  filterOptionsLoading: boolean;
  allBusStopsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // CRUD operations
  addBusStop: (data: StopRequest) => Promise<StopResponse | undefined>;
  updateBusStop: (id: string, data: StopRequest) => Promise<StopResponse | undefined>;
  deleteBusStop: (id: string) => Promise<boolean>;
  loadBusStopById: (id: string) => Promise<StopResponse | undefined>;
  
  // Data fetching
  refetch: (params?: BusStopQueryParams) => Promise<void>;
  loadAllBusStops: () => Promise<void>;
  loadFilteredBusStopsForMap: (params?: BusStopQueryParams) => Promise<void>;
  loadFilterOptions: () => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  resetPagination: () => void;
  
  // Filter and pagination helpers
  getCurrentParams: () => BusStopQueryParams;
  updateParams: (newParams: Partial<BusStopQueryParams>) => Promise<void>;
  
  // Computed properties
  hasData: boolean;
  hasFilters: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const useBusStops = (): UseBusStopsReturn => {
  // Data states
  const [busStops, setBusStops] = useState<StopResponse[]>([]);
  const [allBusStops, setAllBusStops] = useState<StopResponse[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    states: [],
    accessibilityStatuses: []
  });
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);
  const [allBusStopsLoading, setAllBusStopsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    numberOfElements: 0,
    first: true,
    last: true,
    empty: true,
  });

  // Use ref to store current params without causing re-renders
  const currentParamsRef = useRef<BusStopQueryParams>({
    page: 0,
    size: 10,
    sortBy: 'name',
    sortDir: 'asc',
    search: ''
  });

  // Initialize flag to prevent initial load loop
  const initialLoadRef = useRef(false);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true,
    });
  }, []);

  // Get current params
  const getCurrentParams = useCallback(() => {
    return { ...currentParamsRef.current };
  }, []);

  // Update params and fetch data
  const updateParams = useCallback(async (newParams: Partial<BusStopQueryParams>) => {
    const updatedParams = { ...currentParamsRef.current, ...newParams };
    currentParamsRef.current = updatedParams;
    await loadBusStops();
  }, []);

  // Main data loading function
  const loadBusStops = useCallback(
    async (params?: BusStopQueryParams) => {
      // Update ref without causing re-render
      if (params) {
        currentParamsRef.current = { ...currentParamsRef.current, ...params };
      }
      
      const queryParams = currentParamsRef.current;
      setLoading(true);
      setError(null);
      
      try {
        const response: PageStopResponse = await BusStopManagementService.getAllStops(
          queryParams.page,
          queryParams.size ?? 10,
          queryParams.sortBy ?? 'name',
          queryParams.sortDir ?? 'asc',
          queryParams.search
        );
        
        setBusStops(response.content ?? []);
        setPagination({
          totalElements: response.totalElements ?? 0,
          totalPages: response.totalPages ?? 0,
          currentPage: response.number ?? 0,
          pageSize: response.size ?? 10,
          numberOfElements: response.numberOfElements ?? 0,
          first: response.first ?? true,
          last: response.last ?? true,
          empty: response.empty ?? true,
        });

        // Auto-adjust page if current page is beyond available pages
        if (response.totalPages && response.totalPages > 0 && queryParams.page !== undefined && queryParams.page >= response.totalPages) {
          const newPage = Math.max(0, response.totalPages - 1);
          currentParamsRef.current = { ...currentParamsRef.current, page: newPage };
          // Recursively call with corrected page
          await loadBusStops();
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load bus stops';
        setError(errorMessage);
        console.error('Error loading bus stops:', error);
        setBusStops([]);
        resetPagination();
      } finally {
        setLoading(false);
      }
    },
    [resetPagination]
  );

  // Load all bus stops without pagination
  const loadAllBusStops = useCallback(async () => {
    setAllBusStopsLoading(true);
    setError(null);
    
    try {
      const response: StopResponse[] = await BusStopManagementService.getAllStopsAsList();
      setAllBusStops(response);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load all bus stops';
      setError(errorMessage);
      console.error('Error loading all bus stops:', error);
      setAllBusStops([]);
    } finally {
      setAllBusStopsLoading(false);
    }
  }, []);

  // Load filtered bus stops for map view with maximum page size
  const loadFilteredBusStopsForMap = useCallback(async (params?: BusStopQueryParams) => {
    setAllBusStopsLoading(true);
    setError(null);
    
    try {
      const searchParams = {
        page: 0,
        size: 100, // Maximum page size for map view
        sortBy: params?.sortBy || 'name',
        sortDir: params?.sortDir || 'asc',
        search: params?.search || ''
      };

      const response = await BusStopManagementService.getAllStops(
        searchParams.page,
        searchParams.size,
        searchParams.sortBy,
        searchParams.sortDir,
        searchParams.search
      );

      // Extract just the content array for allBusStops
      setAllBusStops(response.content || []);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load filtered bus stops for map';
      setError(errorMessage);
      console.error('Error loading filtered bus stops for map:', error);
      setAllBusStops([]);
    } finally {
      setAllBusStopsLoading(false);
    }
  }, []);

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    setFilterOptionsLoading(true);
    
    try {
      const [states, accessibilityStatuses] = await Promise.all([
        BusStopManagementService.getDistinctStates(),
        BusStopManagementService.getDistinctAccessibilityStatuses()
      ]);
      
      setFilterOptions({
        states: states ?? [],
        accessibilityStatuses: accessibilityStatuses ?? []
      });
    } catch (error: any) {
      console.error('Error loading filter options:', error);
    } finally {
      setFilterOptionsLoading(false);
    }
  }, []);

  // Load specific bus stop by ID
  const loadBusStopById = useCallback(async (id: string): Promise<StopResponse | undefined> => {
    setError(null);
    
    try {
      const response = await BusStopManagementService.getStopById(id);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to load bus stop with ID: ${id}`;
      setError(errorMessage);
      console.error('Error loading bus stop by ID:', error);
      return undefined;
    }
  }, []);

  // CRUD operations
  const addBusStop = useCallback(async (data: StopRequest): Promise<StopResponse | undefined> => {
    setError(null);
    
    try {
      const response = await BusStopManagementService.createStop(data);
      
      // Refetch current page to show the new stop
      await loadBusStops();
      
      // Also refresh filter options as new data might introduce new states
      loadFilterOptions();
      
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create bus stop';
      setError(errorMessage);
      console.error('Error creating bus stop:', error);
      return undefined;
    }
  }, [loadBusStops, loadFilterOptions]);

  const updateBusStop = useCallback(async (id: string, data: StopRequest): Promise<StopResponse | undefined> => {
    setError(null);
    
    try {
      const response = await BusStopManagementService.updateStop(id, data);
      
      // Refetch current page to show the updated stop
      await loadBusStops();
      
      // Also refresh filter options in case state changed
      loadFilterOptions();
      
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to update bus stop with ID: ${id}`;
      setError(errorMessage);
      console.error('Error updating bus stop:', error);
      return undefined;
    }
  }, [loadBusStops, loadFilterOptions]);

  const deleteBusStop = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    
    try {
      await BusStopManagementService.deleteStop(id);
      
      // Refetch current page after deletion
      await loadBusStops();
      
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to delete bus stop with ID: ${id}`;
      setError(errorMessage);
      console.error('Error deleting bus stop:', error);
      return false;
    }
  }, [loadBusStops]);

  // Computed properties
  const hasData = useMemo(() => busStops.length > 0, [busStops]);
  const hasFilters = useMemo(() => {
    const params = currentParamsRef.current;
    return Boolean(params.search && params.search.length > 0);
  }, []);
  const isFirstPage = useMemo(() => pagination.first, [pagination.first]);
  const isLastPage = useMemo(() => pagination.last, [pagination.last]);

  // Load initial data only once
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadBusStops();
      loadFilterOptions();
    }
  }, []);

  return {
    // Data states
    busStops,
    allBusStops,
    filterOptions,
    pagination,
    
    // Loading states
    loading,
    filterOptionsLoading,
    allBusStopsLoading,
    
    // Error state
    error,
    
    // CRUD operations
    addBusStop,
    updateBusStop,
    deleteBusStop,
    loadBusStopById,
    
    // Data fetching
    refetch: loadBusStops,
    loadAllBusStops,
    loadFilteredBusStopsForMap,
    loadFilterOptions,
    
    // Utility functions
    clearError,
    resetPagination,
    
    // Filter and pagination helpers
    getCurrentParams,
    updateParams,
    
    // Computed properties
    hasData,
    hasFilters,
    isFirstPage,
    isLastPage,
  };
};

export default useBusStops;
