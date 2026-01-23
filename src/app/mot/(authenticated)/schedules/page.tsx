'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Calendar, FileText, Clock } from 'lucide-react';
import { ScheduleResponse } from '../../../../../generated/api-clients/route-management/models/ScheduleResponse';
import { ScheduleManagementService } from '../../../../../generated/api-clients/route-management/services/ScheduleManagementService';
import { RouteManagementService } from '../../../../../generated/api-clients/route-management/services/RouteManagementService';
import ScheduleAdvancedFilters from '@/components/mot/schedules/ScheduleAdvancedFilters';
import { ScheduleActionButtons } from '@/components/mot/schedules/ScheduleActionButtons';
import { ScheduleStatsCards } from '@/components/mot/schedules/ScheduleStatsCards';
import { SchedulesTable } from '@/components/mot/schedules/SchedulesTable';
import Pagination from '@/components/shared/Pagination';
import { Layout } from '@/components/shared/layout';

interface QueryParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  search: string;
  routeId?: string;
  routeGroupId?: string;
  scheduleType?: 'REGULAR' | 'SPECIAL';
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  effectiveStartDate?: string;
  effectiveEndDate?: string;
}

interface FilterOptions {
  statuses: Array<'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED'>;
  scheduleTypes: Array<'REGULAR' | 'SPECIAL'>;
  routes: Array<{ id: string; name: string; routeGroup?: string }>;
}

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  const [effectiveStartDate, setEffectiveStartDate] = useState('');
  const [effectiveEndDate, setEffectiveEndDate] = useState('');

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    statuses: [],
    scheduleTypes: [],
    routes: []
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 0,
    size: 10,
    sortBy: 'name',
    sortDir: 'asc',
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
    totalSchedules: { count: 0 },
    activeSchedules: { count: 0 },
    inactiveSchedules: { count: 0 },
    regularSchedules: { count: 0 },
    specialSchedules: { count: 0 },
    totalRoutes: { count: 0 }
  });

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      setFilterOptionsLoading(true);
      const [statusesResponse, typesResponse, routesResponse] = await Promise.all([
        ScheduleManagementService.getDistinctStatuses(),
        ScheduleManagementService.getDistinctScheduleTypes(),
        RouteManagementService.getAllRoutesAsList()
      ]);

      setFilterOptions({
        statuses: statusesResponse || [],
        scheduleTypes: typesResponse || [],
        routes: routesResponse?.map(route => ({
          id: route.id!,
          name: route.name || 'Unnamed Route',
          routeGroup: route.routeGroupName
        })) || []
      });
    } catch (err) {
      console.error('Error loading filter options:', err);
    } finally {
      setFilterOptionsLoading(false);
    }
  }, []);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const statsResponse = await ScheduleManagementService.getScheduleStatistics();

      setStats({
        totalSchedules: { count: statsResponse.totalSchedules || 0 },
        activeSchedules: { count: statsResponse.activeSchedules || 0 },
        inactiveSchedules: { count: statsResponse.inactiveSchedules || 0 },
        regularSchedules: { count: statsResponse.regularSchedules || 0 },
        specialSchedules: { count: statsResponse.specialSchedules || 0 },
        totalRoutes: { count: statsResponse.totalRoutes || 0 }
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  }, []);

  // Load schedules from API
  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ScheduleManagementService.getSchedules(
        queryParams.page,
        queryParams.size,
        queryParams.sortBy,
        queryParams.sortDir,
        queryParams.routeId,
        queryParams.routeGroupId,
        queryParams.scheduleType,
        queryParams.status,
        queryParams.search
      );

      setSchedules(response.content || []);
      setPagination({
        currentPage: response.number || 0,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        pageSize: response.size || 10,
      });
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError('Failed to load schedules. Please try again.');
      setSchedules([]);
      setPagination({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
      });
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadFilterOptions();
    loadStatistics();
  }, [loadFilterOptions, loadStatistics]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Update query params with filters (optimized to prevent unnecessary updates)
  const updateQueryParams = useCallback((updates: Partial<QueryParams>) => {
    setQueryParams(prev => {
      const newParams = { ...prev, ...updates };

      // Handle explicit undefined values (for clearing filters)
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof QueryParams] === undefined) {
          delete newParams[key as keyof QueryParams];
        }
      });

      // Convert current filter states to API parameters (only if not explicitly overridden)
      if (!('status' in updates)) {
        if (statusFilter !== 'all') {
          newParams.status = statusFilter as 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
        } else {
          delete newParams.status;
        }
      }

      if (!('scheduleType' in updates)) {
        if (scheduleTypeFilter !== 'all') {
          newParams.scheduleType = scheduleTypeFilter as 'REGULAR' | 'SPECIAL';
        } else {
          delete newParams.scheduleType;
        }
      }

      if (!('routeId' in updates)) {
        if (routeFilter !== 'all') {
          newParams.routeId = routeFilter;
        } else {
          delete newParams.routeId;
        }
      }

      if (!('effectiveStartDate' in updates)) {
        if (effectiveStartDate) {
          newParams.effectiveStartDate = effectiveStartDate;
        } else {
          delete newParams.effectiveStartDate;
        }
      }

      if (!('effectiveEndDate' in updates)) {
        if (effectiveEndDate) {
          newParams.effectiveEndDate = effectiveEndDate;
        } else {
          delete newParams.effectiveEndDate;
        }
      }

      // Only update if something actually changed
      const hasChanges = Object.keys(newParams).some(key => {
        const typedKey = key as keyof QueryParams;
        return newParams[typedKey] !== prev[typedKey];
      }) || Object.keys(prev).some(key => {
        const typedKey = key as keyof QueryParams;
        return prev[typedKey] !== newParams[typedKey];
      });

      return hasChanges ? newParams : prev;
    });
  }, [statusFilter, scheduleTypeFilter, routeFilter, effectiveStartDate, effectiveEndDate]);

  // Apply filters when they change (with debounce for better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateQueryParams({ page: 0 });
    }, 300); // Short debounce for filter changes

    return () => clearTimeout(timer);
  }, [statusFilter, scheduleTypeFilter, routeFilter, effectiveStartDate, effectiveEndDate, updateQueryParams]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    updateQueryParams({ search: searchTerm, page: 0 });
  };

  const handleSort = (sortBy: string, sortDir: 'asc' | 'desc') => {
    updateQueryParams({ sortBy, sortDir, page: 0 });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handlePageSizeChange = (size: number) => {
    updateQueryParams({ size, page: 0 });
  };

  const handleClearAllFilters = useCallback(() => {
    // Clear all filter states
    setSearchTerm('');
    setStatusFilter('all');
    setScheduleTypeFilter('all');
    setRouteFilter('all');
    setEffectiveStartDate('');
    setEffectiveEndDate('');
    
    // Immediately update query params to clear all filters and trigger new API call
    setQueryParams(prev => {
      const newParams = {
        ...prev,
        search: '',
        page: 0
      };
      
      // Remove all filter-related parameters
      delete newParams.status;
      delete newParams.scheduleType;
      delete newParams.routeId;
      delete newParams.routeGroupId;
      delete newParams.effectiveStartDate;
      delete newParams.effectiveEndDate;
      
      return newParams;
    });
  }, []);

  const handleAddNewSchedule = () => {
    router.push('/mot/schedules/add-new');
  };

  const handleImportSchedules = () => {
    router.push('/mot/schedules/import');
  };

  const handleExportAll = async () => {
    try {
      // Get all schedules for export
      const allSchedules = await ScheduleManagementService.getAllSchedules();

      if (!allSchedules || allSchedules.length === 0) {
        toast.error('No schedules to export');
        return;
      }

      // Create CSV content
      const headers = ['Name', 'Route', 'Type', 'Status', 'Effective Start', 'Effective End', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...allSchedules.map(schedule => [
          `"${schedule.name || ''}"`,
          `"${schedule.routeName || ''}"`,
          `"${schedule.scheduleType || ''}"`,
          `"${schedule.status || ''}"`,
          `"${schedule.effectiveStartDate || ''}"`,
          `"${schedule.effectiveEndDate || ''}"`,
          `"${schedule.createdAt || ''}"`
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `schedules_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${allSchedules.length} schedules successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export schedules');
    }
  };

  const handleView = (scheduleId: string) => {
    router.push(`/mot/schedules/${scheduleId}`);
  };

  const handleEdit = (scheduleId: string) => {
    router.push(`/mot/schedules/${scheduleId}/edit`);
  };

  const handleAssignBuses = (scheduleId: string, routeName: string) => {
    router.push(`/mot/schedules/${scheduleId}/assign-buses`);
  };

  const handleDelete = (scheduleId: string, scheduleName: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      setScheduleToDelete(schedule);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete?.id) return;

    try {
      setIsDeleting(true);
      await ScheduleManagementService.deleteSchedule(scheduleToDelete.id);

      toast.success(`Schedule "${scheduleToDelete.name}" deleted successfully`);

      // Reload data
      await Promise.all([loadSchedules(), loadStatistics()]);

      handleDeleteCancel();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete schedule');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && schedules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading schedules...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout
      activeItem="schedules"
      pageTitle="Schedules"
      pageDescription="Manage route schedules with advanced filtering and search capabilities"
      role="mot"
    >
      <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="mb-8">
            <ScheduleStatsCards stats={stats} />
          </div>

          {/* Action Buttons */}
          <div className="mb-6">
            <ScheduleActionButtons
              onAddSchedule={handleAddNewSchedule}
              onImportSchedules={handleImportSchedules}
              onExportAll={handleExportAll}
              isLoading={isLoading}
            />
          </div>

          {/* Advanced Filters */}
          <div className="mb-6">
            <ScheduleAdvancedFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              scheduleTypeFilter={scheduleTypeFilter}
              setScheduleTypeFilter={setScheduleTypeFilter}
              routeFilter={routeFilter}
              setRouteFilter={setRouteFilter}
              effectiveStartDate={effectiveStartDate}
              setEffectiveStartDate={setEffectiveStartDate}
              effectiveEndDate={effectiveEndDate}
              setEffectiveEndDate={setEffectiveEndDate}
              filterOptions={filterOptions}
              loading={filterOptionsLoading}
              totalCount={pagination.totalElements}
              filteredCount={schedules.length}
              onSearch={handleSearch}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Schedules Table */}
          <div className="bg-white rounded-lg shadow">
            <SchedulesTable
              schedules={schedules}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssignBuses={handleAssignBuses}
              onSort={handleSort}
              activeFilters={{
                search: searchTerm,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                scheduleType: scheduleTypeFilter !== 'all' ? scheduleTypeFilter : undefined,
                route: routeFilter !== 'all' ? routeFilter : undefined,
                effectiveStartDate,
                effectiveEndDate
              }}
              loading={isLoading}
              currentSort={{ field: queryParams.sortBy, direction: queryParams.sortDir }}
            />

          {/* Pagination */}
          {pagination.totalElements > 0 && (
            <div className="bg-white shadow px-2 py-0">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={isLoading}
              />
            </div>
          )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        

        {/* Delete Confirmation Modal */}
        {showDeleteModal && scheduleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Schedule</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete schedule "{scheduleToDelete.name}"?
                  This will permanently remove the schedule and all associated data.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}