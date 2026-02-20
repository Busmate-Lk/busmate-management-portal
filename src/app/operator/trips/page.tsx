'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/operator/header';
import Pagination from '@/components/shared/Pagination';
import {
  OperatorTripStatsCards,
  OperatorTripsFilters,
  OperatorTripsTable,
} from '@/components/operator/trips';
import {
  getOperatorTrips,
  getOperatorTripStats,
  getOperatorTripFilterOptions,
} from '@/data/operator/trips';
import type {
  OperatorTrip,
  OperatorTripStatistics,
  OperatorTripFilterOptions,
  TripStatus,
  GetTripsParams,
} from '@/data/operator/trips';

const PAGE_SIZE = 10;

export default function OperatorTripsPage() {
  const router = useRouter();

  // ── Data state ───────────────────────────────────────────────────────────
  const [trips, setTrips] = useState<OperatorTrip[]>([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [stats, setStats] = useState<OperatorTripStatistics | null>(null);
  const [filterOptions, setFilterOptions] = useState<OperatorTripFilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Filter state ─────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TripStatus | ''>('');
  const [routeFilter, setRouteFilter] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [permitFilter, setPermitFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // ── Sort & pagination ────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState<keyof OperatorTrip>('tripDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Load stats & filter options once ────────────────────────────────────
  useEffect(() => {
    setStats(getOperatorTripStats());
    setFilterOptions(getOperatorTripFilterOptions());
    setGrandTotal(getOperatorTrips({ size: 9999 }).totalElements);
  }, []);

  // ── Build query params ───────────────────────────────────────────────────
  const queryParams = useMemo<GetTripsParams>(() => ({
    search: searchTerm || undefined,
    status: (statusFilter as TripStatus) || undefined,
    routeId: routeFilter || undefined,
    scheduleId: scheduleFilter || undefined,
    busId: busFilter || undefined,
    permitId: permitFilter || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy,
    sortDir,
    page: currentPage - 1, // service is 0-based
    size: PAGE_SIZE,
  }), [searchTerm, statusFilter, routeFilter, scheduleFilter, busFilter, permitFilter, fromDate, toDate, sortBy, sortDir, currentPage]);

  // ── Load trips ───────────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const result = getOperatorTrips(queryParams);
      setTrips(result.data);
      setFilteredTotal(result.totalElements);
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [queryParams]);

  // ── Reset page when filters change ───────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, routeFilter, scheduleFilter, busFilter, permitFilter, fromDate, toDate]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleView = useCallback((tripId: string) => {
    router.push(`/operator/trips/${tripId}`);
  }, [router]);

  /** Matches OperatorTripsTable.onSort signature: (sortBy, sortDir) */
  const handleSort = useCallback((newSortBy: keyof OperatorTrip, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(1);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setRouteFilter('');
    setScheduleFilter('');
    setBusFilter('');
    setPermitFilter('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        pageTitle="My Trips"
        pageDescription="View all trips operated by your fleet"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        {stats && <OperatorTripStatsCards stats={stats} />}

        {/* Filters */}
        {filterOptions && (
          <OperatorTripsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={v => setStatusFilter(v as TripStatus | '')}
            routeFilter={routeFilter}
            setRouteFilter={setRouteFilter}
            scheduleFilter={scheduleFilter}
            setScheduleFilter={setScheduleFilter}
            busFilter={busFilter}
            setBusFilter={setBusFilter}
            permitFilter={permitFilter}
            setPermitFilter={setPermitFilter}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            filterOptions={filterOptions}
            totalCount={grandTotal}
            filteredCount={filteredTotal}
            onClearAll={handleClearAllFilters}
          />
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <OperatorTripsTable
            trips={trips}
            onView={handleView}
            onSort={handleSort}
            loading={isLoading}
            currentSort={{ field: sortBy, direction: sortDir }}
          />

          {/* Pagination */}
          {!isLoading && filteredTotal > PAGE_SIZE && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={filteredTotal}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                onPageSizeChange={() => {}}
              />
            </div>
          )}

          {/* Empty state (not loading, no results) */}
          {!isLoading && trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 17v-2m3 2v-4m3 4v-6M12 3L4 9v12h16V9l-8-6z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No trips found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Result count footer */}
        {!isLoading && trips.length > 0 && (
          <p className="text-sm text-gray-500 text-center">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredTotal)} of {filteredTotal} trip
            {filteredTotal !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
