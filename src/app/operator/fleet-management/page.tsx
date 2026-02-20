'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/operator/header';
import {
  FleetStatsCards,
  FleetFilters,
  FleetTable,
  FleetPagination,
} from '@/components/operator/fleet';
import {
  getOperatorBuses,
  getFleetStatistics,
  type OperatorBus,
  type BusStatus,
  type BusServiceType,
  type FleetStatistics,
  type PaginatedBuses,
} from '@/data/operator/buses';

export default function FleetManagementPage() {
  const router = useRouter();

  // ── Data state ────────────────────────────────────────────────────────────
  const [buses,      setBuses]      = useState<OperatorBus[]>([]);
  const [stats,      setStats]      = useState<FleetStatistics>({
    totalBuses: 0, activeBuses: 0, inactiveBuses: 0,
    maintenanceBuses: 0, totalCapacity: 0, averageCapacity: 0,
  });
  const [pagination, setPagination] = useState<Omit<PaginatedBuses, 'content'>>({
    totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 10,
  });

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isLoading,      setIsLoading]      = useState(true);
  const [statsLoading,   setStatsLoading]   = useState(true);
  const [tableLoading,   setTableLoading]   = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  // ── Filter / sort state ───────────────────────────────────────────────────
  const [search,           setSearch]           = useState('');
  const [statusFilter,     setStatusFilter]     = useState<BusStatus | 'ALL'>('ALL');
  const [serviceTypeFilter,setServiceTypeFilter] = useState<BusServiceType | 'ALL'>('ALL');
  const [currentPage,      setCurrentPage]      = useState(0);
  const [pageSize,         setPageSize]         = useState(10);
  const [sortField,        setSortField]        = useState('plateNumber');
  const [sortDir,          setSortDir]          = useState<'asc' | 'desc'>('asc');

  // ── Load statistics (once) ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    getFleetStatistics()
      .then(s => { if (!cancelled) setStats(s); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Load buses ─────────────────────────────────────────────────────────────
  const loadBuses = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setIsLoading(true); else setTableLoading(true);
    setError(null);

    try {
      const result = await getOperatorBuses({
        page: currentPage,
        size: pageSize,
        search,
        status: statusFilter,
        serviceType: serviceTypeFilter,
      });

      setBuses(result.content);
      setPagination({
        totalElements: result.totalElements,
        totalPages:    result.totalPages,
        currentPage:   result.currentPage,
        pageSize:      result.pageSize,
      });
    } catch (err) {
      console.error('Error loading fleet:', err);
      setError('Failed to load fleet data. Please try again.');
    } finally {
      setIsLoading(false);
      setTableLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, serviceTypeFilter]);

  useEffect(() => { loadBuses(isLoading); }, [loadBuses]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setCurrentPage(0);
  }, []);

  const handleStatusChange = useCallback((v: BusStatus | 'ALL') => {
    setStatusFilter(v);
    setCurrentPage(0);
  }, []);

  const handleServiceTypeChange = useCallback((v: BusServiceType | 'ALL') => {
    setServiceTypeFilter(v);
    setCurrentPage(0);
  }, []);

  const handleClearAll = useCallback(() => {
    setSearch('');
    setStatusFilter('ALL');
    setServiceTypeFilter('ALL');
    setCurrentPage(0);
  }, []);

  const handleView = useCallback((busId: string) => {
    router.push(`/operator/fleet-management/${busId}`);
  }, [router]);

  const handleSort = useCallback((field: string, dir: 'asc' | 'desc') => {
    setSortField(field);
    setSortDir(dir);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  }, []);

  const hasFilters = search !== '' || statusFilter !== 'ALL' || serviceTypeFilter !== 'ALL';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        pageTitle="Fleet Management"
        pageDescription="View and monitor your bus fleet"
      />

      <div className="p-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View details of all buses in your fleet. Contact NTC to register or update bus information.
          </p>
        </div>

        {/* Stats */}
        <FleetStatsCards stats={stats} loading={statsLoading} />

        {/* Filters */}
        <FleetFilters
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          serviceTypeFilter={serviceTypeFilter}
          onServiceTypeChange={handleServiceTypeChange}
          onClearAll={handleClearAll}
          totalCount={stats.totalBuses}
          filteredCount={pagination.totalElements}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
            <button
              onClick={() => loadBuses()}
              className="ml-auto text-red-600 underline hover:no-underline text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Full-page loading skeleton */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-10 ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Table */}
            <FleetTable
              buses={buses}
              onView={handleView}
              onSort={handleSort}
              currentSort={{ field: sortField, direction: sortDir }}
              loading={tableLoading}
              hasActiveFilters={hasFilters}
            />

            {/* Pagination */}
            {!error && pagination.totalElements > 0 && (
              <FleetPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}

        {/* Read-only notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          <strong>Read-only view:</strong> Fleet registration and modifications are managed by the National Transport Commission (NTC).
          Please contact NTC for any changes to your fleet.
        </div>
      </div>
    </div>
  );
}
