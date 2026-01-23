'use client';

import { Eye, Edit2, Trash2, Filter, FileText, Calendar, Building2, MapPin } from 'lucide-react';
import type { PassengerServicePermitResponse } from '../../../generated/api-clients/route-management';

interface BusPermitsTableProps {
  permits: PassengerServicePermitResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onView: (permit: PassengerServicePermitResponse) => void;
  onEdit: (permit: PassengerServicePermitResponse) => void;
  onDelete: (permit: PassengerServicePermitResponse) => void;
  loading?: boolean;
  activeFilters?: {
    status?: string;
    operator?: string;
    search?: string;
  };
}

export function BusPermitsTable({
  permits,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  loading = false,
  activeFilters = {},
}: BusPermitsTableProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'suspended':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPermitTypeBadge = (permitType?: string) => {
    if (!permitType) return '';
    
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (permitType.toUpperCase()) {
      case 'REGULAR':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'EXPRESS':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'INTERCITY':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

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

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry > now && expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Passenger Service Permits</h3>
            <p className="text-sm text-gray-600 mt-1">
              {totalItems} permits found
            </p>
          </div>
          
          {/* Active Filters Indicator */}
          {Object.values(activeFilters).some(Boolean) && (
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Filters active</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center gap-2">
                  Permit Details
                  {activeFilters.search && (
                    <Filter className="h-3 w-3 text-blue-500" title="Filtered by search" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center gap-2">
                  Operator Info
                  {activeFilters.operator && (
                    <Filter className="h-3 w-3 text-blue-500" title={`Filtered by: ${activeFilters.operator}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Route & Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Validity Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center gap-2">
                  Status
                  {activeFilters.status && (
                    <Filter className="h-3 w-3 text-blue-500" title={`Filtered by: ${activeFilters.status}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-500">Loading permits...</span>
                  </div>
                </td>
              </tr>
            ) : permits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium">No permits found</div>
                    <div className="text-sm">
                      Try adjusting your search criteria or add a new permit.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              permits.map((permit) => (
                <tr key={permit.id} className="hover:bg-gray-50 transition-colors">
                  {/* Permit Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {permit.permitNumber || 'No Permit Number'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {permit.id?.slice(-8) || 'N/A'}
                      </div>
                      {permit.permitType && (
                        <span className={getPermitTypeBadge(permit.permitType)}>
                          {permit.permitType}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Operator Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {permit.operatorName || 'Unknown Operator'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {permit.operatorId?.slice(-8) || 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Route & Assignment */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {permit.routeGroupName || 'No Route Group'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Max Buses: {permit.maximumBusAssigned || 0}
                      </div>
                    </div>
                  </td>

                  {/* Validity Period */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {formatDate(permit.issueDate)} - {formatDate(permit.expiryDate)}
                          </div>
                          {permit.expiryDate && (
                            <div className={`text-xs ${
                              isExpired(permit.expiryDate) ? 'text-red-600' :
                              isExpiringSoon(permit.expiryDate) ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {isExpired(permit.expiryDate) ? 'Expired' :
                               isExpiringSoon(permit.expiryDate) ? 'Expires soon' :
                               'Valid'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(permit.status)}>
                      {permit.status?.charAt(0).toUpperCase() + (permit.status?.slice(1) || '')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(permit)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(permit)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(permit)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}