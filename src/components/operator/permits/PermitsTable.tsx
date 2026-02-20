'use client';

import { ChevronUp, ChevronDown, Eye, FileText, AlertTriangle } from 'lucide-react';
import type { OperatorPermit } from '@/data/operator/permits';

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

interface PermitsTableProps {
  permits: OperatorPermit[];
  loading: boolean;
  currentSort: SortState;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onView: (permitId: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
};

const PERMIT_TYPE_STYLES: Record<string, string> = {
  REGULAR: 'bg-blue-100 text-blue-800',
  SPECIAL: 'bg-purple-100 text-purple-800',
  TEMPORARY: 'bg-orange-100 text-orange-800',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

function isExpired(dateStr?: string) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function isExpiringSoon(dateStr?: string) {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days <= 30 && days >= 0;
}

export function PermitsTable({ permits, loading, currentSort, onSort, onView }: PermitsTableProps) {
  const handleSort = (field: string) => {
    const newDir = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, newDir);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (currentSort.field !== field) return <ChevronUp className="w-4 h-4 text-gray-300" />;
    return currentSort.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      scope="col"
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  // Loading skeleton
  if (loading && permits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading permits…</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (permits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <FileText className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No permits found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="permitNumber">Permit Number</SortableHeader>
              <SortableHeader field="routeGroupName">Route Group</SortableHeader>
              <SortableHeader field="permitType">Type</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="issueDate">Issue Date</SortableHeader>
              <SortableHeader field="expiryDate">Expiry Date</SortableHeader>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Buses
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {permits.map((permit) => {
              const expired = isExpired(permit.expiryDate);
              const expiringSoon = !expired && isExpiringSoon(permit.expiryDate);

              return (
                <tr
                  key={permit.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Permit number */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-sm font-medium text-blue-700">{permit.permitNumber}</span>
                  </td>

                  {/* Route group */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{permit.routeGroupName}</p>
                      <p className="text-xs text-gray-500">{permit.routeGroupCode}</p>
                    </div>
                  </td>

                  {/* Permit type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      PERMIT_TYPE_STYLES[permit.permitType] ?? 'bg-gray-100 text-gray-700'
                    }`}>
                      {permit.permitType.charAt(0) + permit.permitType.slice(1).toLowerCase()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[permit.status] ?? 'bg-gray-100 text-gray-700'
                    }`}>
                      {permit.status.charAt(0) + permit.status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  {/* Issue date */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(permit.issueDate)}
                  </td>

                  {/* Expiry date */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm ${expired ? 'text-red-600 font-medium' : expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                        {formatDate(permit.expiryDate)}
                      </span>
                      {expiringSoon && (
                        <span title="Expiring within 30 days">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                        </span>
                      )}
                      {expired && (
                        <span title="Expired">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                      )}
                    </div>
                    {expiringSoon && (
                      <p className="text-xs text-orange-600 mt-0.5">Expiring soon</p>
                    )}
                    {expired && (
                      <p className="text-xs text-red-600 mt-0.5">Expired</p>
                    )}
                  </td>

                  {/* Max buses */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                    {permit.maximumBusAssigned}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => onView(permit.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Loading overlay for subsequent fetches */}
      {loading && permits.length > 0 && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
