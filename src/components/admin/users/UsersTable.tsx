'use client';

import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  USER_TYPE_CONFIG,
  USER_STATUS_CONFIG,
  getUserDisplayName,
  timeAgo,
} from '@/data/admin/users';
import type { SystemUser } from '@/data/admin/users';

interface UsersTableProps {
  users: SystemUser[];
  loading?: boolean;
  currentSort: { sortBy: string; sortOrder: 'asc' | 'desc' };
  onSort: (field: string) => void;
  onView: (user: SystemUser) => void;
  onEdit: (user: SystemUser) => void;
  onToggleStatus: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
}

export function UsersTable({
  users,
  loading,
  currentSort,
  onSort,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  const handleSort = (field: string) => {
    onSort(field);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (currentSort.sortBy !== field) {
      return <ChevronUp className="w-3.5 h-3.5 text-gray-300" />;
    }
    return currentSort.sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-gray-500 text-sm">No users found matching your criteria.</p>
        <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  const sortableHeaders = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'userType', label: 'Type' },
    { field: 'status', label: 'Status' },
    { field: 'lastLogin', label: 'Last Login' },
    { field: 'createdAt', label: 'Created' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {sortableHeaders.map((header) => (
              <th
                key={header.field}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                onClick={() => handleSort(header.field)}
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  <SortIcon field={header.field} />
                </div>
              </th>
            ))}
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const typeConfig = USER_TYPE_CONFIG[user.userType];
            const statusConfig = USER_STATUS_CONFIG[user.status];
            const displayName = getUserDisplayName(user);
            const isActive = user.status === 'active';

            return (
              <tr
                key={user.id}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                onClick={() => onView(user)}
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400">{user.id}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">
                  {user.email}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeConfig.bgColor} ${typeConfig.color} ${typeConfig.borderColor}`}
                  >
                    {typeConfig.label}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                    {statusConfig.label}
                  </span>
                </td>

                {/* Last Login */}
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {timeAgo(user.lastLogin)}
                </td>

                {/* Created */}
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {timeAgo(user.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onView(user)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={isActive ? 'Deactivate User' : 'Reactivate User'}
                    >
                      {isActive ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loading && users.length > 0 && (
        <div className="flex items-center justify-center py-4 bg-blue-50/30">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  );
}
