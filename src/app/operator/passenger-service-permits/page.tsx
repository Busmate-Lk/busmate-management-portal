'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw, AlertCircle, ChevronRight, FileText } from 'lucide-react';
import { Header } from '@/components/operator/header';
import { PermitStatsCards } from '@/components/operator/permits/PermitStatsCards';
import { PermitFilters } from '@/components/operator/permits/PermitFilters';
import { PermitsTable } from '@/components/operator/permits/PermitsTable';
import { Pagination } from '@/components/mot/pagination';
import {
  getMockPermits,
  getMockPermitStatistics,
  getMockPermitFilterOptions,
  type OperatorPermit,
  type OperatorPermitStatistics,
  type OperatorPermitFilterOptions,
} from '@/data/operator/permits';

interface FiltersState {
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

// ─── Main content component (uses useSearchParams so must be wrapped in Suspense) ─

function ServicePermitsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Data ─────────────────────────────────────────────────────────────────
  const [permits, setPermits] = useState<OperatorPermit[]>([]);
  const [statistics, setStatistics] = useState<OperatorPermitStatistics | null>(null);
  const [filterOptions, setFilterOptions] = useState<OperatorPermitFilterOptions>({
    statuses: [],
    permitTypes: [],
  });

  // ── Filters (URL-synced) ──────────────────────────────────────────────────
  const [filters, setFilters] = useState<FiltersState>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    permitType: searchParams.get('permitType') || 'all',
  });

  // ── Pagination & Sort (URL-synced) ────────────────────────────────────────
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: Math.max(1, parseInt(searchParams.get('page') || '1') || 1),
    totalPages: 0,
    totalElements: 0,
    pageSize: Math.max(1, parseInt(searchParams.get('size') || '10') || 10),
  });

  const [sort, setSort] = useState<SortState>({
    field: searchParams.get('sortBy') || 'issueDate',
    direction: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  });

  // ── UI ────────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ── Sync state to URL ─────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.permitType !== 'all') params.set('permitType', filters.permitType);
    if (pagination.currentPage > 1) params.set('page', String(pagination.currentPage));
    if (pagination.pageSize !== 10) params.set('size', String(pagination.pageSize));
    if (sort.field !== 'issueDate') params.set('sortBy', sort.field);
    if (sort.direction !== 'desc') params.set('sortDir', sort.direction);

    const qs = params.toString();
    window.history.replaceState({}, '', qs ? `?${qs}` : '/operator/passenger-service-permits');
  }, [filters, pagination.currentPage, pagination.pageSize, sort]);

  // ── Load filter options & statistics (once) ───────────────────────────────
  const loadInitialData = useCallback(() => {
    setStatistics(getMockPermitStatistics());
    setFilterOptions(getMockPermitFilterOptions());
    setInitialized(true);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ── Load permits whenever filters / pagination / sort change ──────────────
  const loadPermits = useCallback(() => {
    if (!initialized) return;
    setLoading(true);

    // Simulate async (replace with real API call)
    const timer = setTimeout(() => {
      try {
        const result = getMockPermits({
          search: filters.search,
          status: filters.status,
          permitType: filters.permitType,
          sortBy: sort.field,
          sortDir: sort.direction,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        });

        setPermits(result.permits);
        setPagination((prev) => ({
          ...prev,
          totalPages: result.totalPages,
          totalElements: result.total,
        }));
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [initialized, filters, sort, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadPermits();
  }, [loadPermits]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleView = (id: string) => {
    router.push(`/operator/passenger-service-permits/${id}`);
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'all', permitType: 'all' });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleRefresh = () => {
    setStatistics(getMockPermitStatistics());
    loadPermits();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header pageTitle="Service Permits" pageDescription="View your passenger service permits issued by the Ministry of Transport" />

      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
          <span>Operator Portal</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Service Permits</span>
        </nav>

        {/* Statistics */}
        <PermitStatsCards stats={statistics} loading={loading && !initialized} />

        {/* Filters */}
        <PermitFilters
          searchTerm={filters.search}
          setSearchTerm={(v) => { setFilters((f) => ({ ...f, search: v })); setPagination((p) => ({ ...p, currentPage: 1 })); }}
          statusFilter={filters.status}
          setStatusFilter={(v) => { setFilters((f) => ({ ...f, status: v })); setPagination((p) => ({ ...p, currentPage: 1 })); }}
          permitTypeFilter={filters.permitType}
          setPermitTypeFilter={(v) => { setFilters((f) => ({ ...f, permitType: v })); setPagination((p) => ({ ...p, currentPage: 1 })); }}
          filterOptions={filterOptions}
          loading={loading}
          totalCount={statistics?.totalPermits ?? 0}
          filteredCount={pagination.totalElements}
          onClearAll={handleClearFilters}
          onRefresh={handleRefresh}
        />

        {/* Read-only info notice */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Service permits are issued and managed by the Ministry of Transport. This view is
            read-only. Contact the MOT to request changes.
          </span>
        </div>

        {/* Permits table */}
        <PermitsTable
          permits={permits}
          loading={loading}
          currentSort={sort}
          onSort={handleSort}
          onView={handleView}
        />

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalElements}
            itemsPerPage={pagination.pageSize}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
            onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }))}
          />
        )}

        {/* Empty state when no permits exist */}
        {!loading && permits.length === 0 && pagination.totalElements === 0 && !filters.search && filters.status === 'all' && filters.permitType === 'all' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No permits issued yet</h3>
            <p className="text-sm text-gray-500">
              Passenger service permits issued to your company will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Page export (wraps content in Suspense for useSearchParams) ─────────────

export default function ServicePermitsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading…</span>
          </div>
        </div>
      }
    >
      <ServicePermitsContent />
    </Suspense>
  );
}
