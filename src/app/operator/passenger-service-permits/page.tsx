'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  RefreshCw,
  Download,
  AlertCircle,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Header } from '@/components/operator/header';
import { OperatorPermitStatsCards } from '@/components/operator/permits/OperatorPermitStatsCards';
import { OperatorPermitFilters } from '@/components/operator/permits/OperatorPermitFilters';
import { OperatorPermitsTable } from '@/components/operator/permits/OperatorPermitsTable';
import { Pagination } from '@/components/mot/pagination';
import {
  BusOperatorOperationsService,
  PassengerServicePermitResponse
} from '../../../../generated/api-clients/route-management';
import { useAuth } from '@/context/AuthContext';

interface PermitFilters {
  search: string;
  status: string;
  permitType: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

function OperatorPassengerServicePermitsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Data states
  const [permits, setPermits] = useState<PassengerServicePermitResponse[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<any>({
    statuses: ['ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED'],
    permitTypes: ['REGULAR', 'SPECIAL', 'TEMPORARY']
  });

  // Filter states with URL sync
  const [filters, setFilters] = useState<PermitFilters>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    permitType: searchParams.get('permitType') || 'all'
  });

  // Pagination and sort states with URL sync
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: Math.max(1, Number.parseInt(searchParams.get('page') || '1') || 1),
    totalPages: 0,
    totalElements: 0,
    pageSize: Math.max(1, Number.parseInt(searchParams.get('size') || '10') || 10)
  });

  const [sort, setSort] = useState<SortState>({
    field: searchParams.get('sortBy') || 'permitNumber',
    direction: (searchParams.get('sortDir') as 'asc' | 'desc') || 'asc'
  });

  // Only allow API-supported sort fields; fallback to 'permitNumber' if unsupported
  const allowedSortFields = useMemo(() => (
    ['permitNumber', 'issueDate', 'expiryDate', 'status', 'createdAt', 'updatedAt']
  ), []);
  const effectiveSortField = allowedSortFields.includes(sort.field) ? sort.field : 'permitNumber';

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get operator ID from authenticated user
  const operatorId = user?.id;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.permitType !== 'all') params.set('permitType', filters.permitType);
    if (pagination.currentPage > 1) params.set('page', pagination.currentPage.toString());
    if (pagination.pageSize !== 10) params.set('size', pagination.pageSize.toString());
    if (sort.field !== 'permitNumber') params.set('sortBy', sort.field);
    if (sort.direction !== 'asc') params.set('sortDir', sort.direction);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/operator/passenger-service-permits';
    window.history.replaceState({}, '', newUrl);
  }, [filters, pagination.currentPage, pagination.pageSize, sort]);

  // Load operator-specific permits statistics
  const loadStatistics = useCallback(async () => {
    if (!operatorId) return;

    try {
      // For now, we'll calculate statistics from the permits data
      // In a real implementation, there might be a dedicated statistics endpoint
      const allPermits = await BusOperatorOperationsService.getOperatorPermits(
        operatorId,
        0, // page
        100, // large size to get all permits for stats
        'permitNumber',
        'asc'
      );

      const permitsList = allPermits.content || [];

      const stats = {
        totalPermits: permitsList.length,
        activePermits: permitsList.filter(p => p.status === 'ACTIVE').length,
        inactivePermits: permitsList.filter(p => p.status === 'INACTIVE').length,
        expiringSoonPermits: permitsList.filter(p => {
          if (!p.expiryDate) return false;
          const expiry = new Date(p.expiryDate);
          const today = new Date();
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays >= 0;
        }).length,
        permitsByOperator: { [operatorId]: permitsList.length },
        permitsByRouteGroup: permitsList.reduce((acc: any, permit) => {
          const routeGroup = permit.routeGroupName || 'Unknown';
          acc[routeGroup] = (acc[routeGroup] || 0) + 1;
          return acc;
        }, {})
      };

      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setStatistics({
        totalPermits: 0,
        activePermits: 0,
        inactivePermits: 0,
        expiringSoonPermits: 0,
        permitsByOperator: {},
        permitsByRouteGroup: {}
      });
    }
  }, [operatorId]);

  // Load permits data from API with server-side filtering/pagination
  const loadPermits = useCallback(async () => {
    if (!operatorId) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare filter parameters for API call
      const statusFilter = filters.status !== 'all' ? filters.status : undefined;
      const permitTypeFilter = filters.permitType !== 'all' ? filters.permitType : undefined;
      const searchText = filters.search || undefined;

      const requestedPageIndex = Math.max(0, (pagination.currentPage || 1) - 1); // 0-based for API

      // Initial fetch
      const response = await BusOperatorOperationsService.getOperatorPermits(
        operatorId,
        requestedPageIndex,
        pagination.pageSize,
        effectiveSortField,
        sort.direction,
        statusFilter,
        permitTypeFilter,
        searchText
      );

      let totalPages = response.totalPages ?? 0;
      let totalElements = response.totalElements ?? 0;
      let content = response.content ?? [];

      // Handle stale page index: if API says there are elements but current page is empty, fetch last page
      if (totalElements > 0 && content.length === 0) {
        const lastPageIndex = Math.max(0, (totalPages || 1) - 1);
        if (requestedPageIndex !== lastPageIndex) {
          const retry = await BusOperatorOperationsService.getOperatorPermits(
            operatorId,
            lastPageIndex,
            pagination.pageSize,
            effectiveSortField,
            sort.direction,
            statusFilter,
            permitTypeFilter,
            searchText
          );

          setPermits(retry.content || []);
          setPagination(prev => ({
            ...prev,
            currentPage: Math.max(1, (retry.totalPages || totalPages || 1)), // 1-based
            totalPages: retry.totalPages ?? totalPages ?? 0,
            totalElements: retry.totalElements ?? totalElements ?? 0,
          }));
          return;
        }
      }

      // Fallback: backend post-filters after pagination can return empty pages even when permits exist.
      // If the page is empty, refetch first page with a larger size (max 100) and client-side paginate.
      if (content.length === 0) {
        const fallback = await BusOperatorOperationsService.getOperatorPermits(
          operatorId,
          0,
          100, // controller allows max 100
          effectiveSortField,
          sort.direction,
          statusFilter,
          permitTypeFilter,
          searchText
        );

        const all = fallback.content || [];
        if (all.length > 0) {
          const totalPagesCalc = Math.max(1, Math.ceil(all.length / pagination.pageSize));
          const clampedPage = Math.min(pagination.currentPage, totalPagesCalc);
          const start = (clampedPage - 1) * pagination.pageSize;
          const end = start + pagination.pageSize;
          const slice = all.slice(start, end);

          setPermits(slice);
          setPagination(prev => ({
            ...prev,
            currentPage: clampedPage,
            totalElements: all.length,
            totalPages: totalPagesCalc,
          }));
          return;
        }
      }

      // Normal path
      setPermits(content);
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalElements,
      }));

    } catch (err) {
      console.error('Error loading permits:', err);
      setPermits([]);
      setPagination(prev => ({ ...prev, totalPages: 0, totalElements: 0 }));
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load permits. The API service may not be available.');
      }
    } finally {
      setLoading(false);
    }
  }, [operatorId, filters, pagination.currentPage, pagination.pageSize, sort, effectiveSortField]);

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        loadStatistics(),
        loadPermits()
      ]);
    };

    initializeData();
  }, [loadStatistics, loadPermits]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      loadStatistics(),
      loadPermits()
    ]);
  }, [loadStatistics, loadPermits]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: Partial<PermitFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, []);

  // Sort handlers
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  // Action handlers
  const handleView = useCallback((permitId: string) => {
    router.push(`/operator/passenger-service-permits/${permitId}`);
  }, [router]);

  const handleEdit = useCallback((permitId: string) => {
    router.push(`/operator/passenger-service-permits/${permitId}/edit`);
  }, [router]);

  // Export functionality
  const handleExport = useCallback(async () => {
    try {
      const dataToExport = permits.map(permit => ({
        'Permit Number': permit.permitNumber || '',
        'Route Group': permit.routeGroupName || '',
        'Permit Type': permit.permitType || '',
        'Issue Date': permit.issueDate || '',
        'Expiry Date': permit.expiryDate || '',
        'Maximum Buses': permit.maximumBusAssigned || 0,
        'Status': permit.status || '',
        'Created At': permit.createdAt ? new Date(permit.createdAt).toLocaleDateString() : '',
        'Updated At': permit.updatedAt ? new Date(permit.updatedAt).toLocaleDateString() : '',
      }));

      if (dataToExport.length === 0) {
        alert('No data to export');
        return;
      }

      const headers = Object.keys(dataToExport[0]);
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row];
            return typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `operator-permits-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  }, [permits]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
      filters.status !== 'all' ||
      filters.permitType !== 'all';
  }, [filters]);

  const activeFiltersObject = useMemo(() => ({
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    permitType: filters.permitType !== 'all' ? filters.permitType : undefined
  }), [filters]);

  // Authentication check
  if (!user || !operatorId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          pageTitle="Passenger Service Permits"
          pageDescription="Manage your passenger service permits"
        />
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <div className="text-red-600 text-lg mb-4">
              Authentication required
            </div>
            <p className="text-gray-600 mb-4">
              Please log in to view your passenger service permits.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for initial load
  if (loading && pagination.currentPage === 1 && permits.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          pageTitle="Passenger Service Permits"
          pageDescription="Manage your passenger service permits"
        />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        pageTitle="Passenger Service Permits"
        pageDescription="View and manage your passenger service permits and compliance status"
      />

      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <OperatorPermitStatsCards stats={statistics} loading={!statistics} />

        {/* Export Action */}
        <div className="flex justify-start">
          <button
            onClick={handleExport}
            disabled={loading || permits.length === 0}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Permits</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* Operator-specific Filters */}
        <OperatorPermitFilters
          searchTerm={filters.search}
          setSearchTerm={(value: string) => handleFilterChange({ search: value })}
          statusFilter={filters.status}
          setStatusFilter={(value: string) => handleFilterChange({ status: value })}
          permitTypeFilter={filters.permitType}
          setPermitTypeFilter={(value: string) => handleFilterChange({ permitType: value })}
          filterOptions={{
            statuses: filterOptions.statuses,
            permitTypes: filterOptions.permitTypes
          }}
          loading={loading}
          totalCount={pagination.totalElements}
          filteredCount={pagination.totalElements}
          onClearAll={() => {
            setFilters({
              search: '',
              status: 'all',
              permitType: 'all'
            });
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          }}
          onRefresh={handleRefresh}
        />

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-700 font-medium">
                  {pagination.totalElements} permits found with active filters
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <OperatorPermitsTable
            permits={permits}
            onView={handleView}
            onSort={handleSort}
            activeFilters={activeFiltersObject}
            loading={loading}
            currentSort={sort}
          />

          {/* Pagination */}
          {pagination.totalElements > 0 && (
            <div className="border-t border-gray-200 px-4 pb-3">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalElements}
                itemsPerPage={pagination.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && permits.length === 0 && !error && (
            <div className="text-center py-12 px-4">
              <div className="text-gray-500">
                {!hasActiveFilters ? (
                  <div>
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <div className="text-lg font-medium mb-2">No permits found</div>
                    <div className="text-sm mb-4">No passenger service permits are currently assigned to your operator account.</div>
                  </div>
                ) : (
                  <div>
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <div className="text-lg font-medium mb-2">No permits match your search</div>
                    <div className="text-sm mb-4">Try adjusting your search criteria.</div>
                    <button
                      onClick={() => {
                        setFilters({
                          search: '',
                          status: 'all',
                          permitType: 'all'
                        });
                        setPagination(prev => ({ ...prev, currentPage: 1 }));
                      }}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OperatorPassengerServicePermitsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header
          pageTitle="Passenger Service Permits"
          pageDescription="Loading permits..."
        />
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading permits...</span>
          </div>
        </div>
      </div>
    }>
      <OperatorPassengerServicePermitsContent />
    </Suspense>
  );
}
