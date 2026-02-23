'use client';

import React from 'react';
import { Bus, Users, Eye, Edit, Trash2, Settings } from 'lucide-react';
import { DataTable, DataTableColumn, SortState } from '@/components/shared/DataTable';

interface BusesTableProps {
  buses: any[];
  onView: (busId: string) => void;
  onEdit: (busId: string) => void;
  onDelete: (busId: string, busRegistration: string) => void;
  onAssignRoute?: (busId: string, busRegistration: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  activeFilters: Record<string, any>;
  loading: boolean;
  currentSort: { field: string; direction: 'asc' | 'desc' };
}

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

const getStatusStyle = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'INACTIVE':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export function BusesTable({
  buses,
  onView,
  onEdit,
  onDelete,
  onAssignRoute,
  onSort,
  activeFilters,
  loading,
  currentSort,
}: BusesTableProps) {
  const columns: DataTableColumn<any>[] = [
    {
      key: 'ntcRegistrationNumber',
      header: 'Registration',
      sortable: true,
      render: (bus) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Bus className="h-4 w-4 text-blue-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {bus.ntcRegistrationNumber || bus.ntc_registration_number || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'plateNumber',
      header: 'Plate Number',
      sortable: true,
      render: (bus) => (
        <span className="text-sm text-gray-900">{bus.plateNumber || bus.plate_number || 'N/A'}</span>
      ),
    },
    {
      key: 'operator.name',
      header: 'Operator',
      sortable: true,
      render: (bus) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {bus.operator?.name || bus.operatorName || 'Unknown'}
            </div>
            {(bus.operator?.operatorType || bus.operatorType) && (
              <div className="text-xs text-gray-500">
                {bus.operator?.operatorType || bus.operatorType}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'model',
      header: 'Model',
      sortable: true,
      render: (bus) => <span className="text-sm text-gray-900">{bus.model || 'N/A'}</span>,
    },
    {
      key: 'capacity',
      header: 'Capacity',
      sortable: true,
      render: (bus) => (
        <span className="text-sm font-medium text-gray-900">{bus.capacity || '0'} seats</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (bus) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(bus.status)}`}
        >
          {bus.status ? bus.status.charAt(0) + bus.status.slice(1).toLowerCase() : 'Unknown'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (bus) => (
        <span className="text-sm text-gray-500">{formatDate(bus.createdAt || bus.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (bus) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(bus.id)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(bus.id)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit Bus"
          >
            <Edit className="h-4 w-4" />
          </button>
          {onAssignRoute && (
            <button
              onClick={() =>
                onAssignRoute(bus.id, bus.ntcRegistrationNumber || bus.ntc_registration_number || 'Unknown')
              }
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Assign to Route"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() =>
              onDelete(bus.id, bus.ntcRegistrationNumber || bus.ntc_registration_number || 'Unknown')
            }
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Bus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    onSort(field, direction);
  };

  return (
    <DataTable
      columns={columns}
      data={buses}
      loading={loading}
      currentSort={currentSort as SortState}
      onSort={handleSort}
      rowKey={(bus) => bus.id}
      emptyState={
        <div className="text-center py-12 px-4">
          <Bus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
          <p className="text-gray-500">
            {Object.keys(activeFilters).some((key) => activeFilters[key])
              ? 'No buses match your current filters. Try adjusting your search criteria.'
              : 'No buses have been registered yet.'}
          </p>
        </div>
      }
      showRefreshing={loading && buses.length > 0}
    />
  );
}
