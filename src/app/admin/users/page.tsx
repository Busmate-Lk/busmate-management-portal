'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSetPageMetadata, useSetPageActions } from '@/context/PageMetadata';
import { UserStatsCards, UserFilters, UsersTable, ConfirmDialog } from '@/components/admin/users';
import {
  getUserStatsData,
  getFilteredUsers,
  updateUserStatus,
  deleteUserById,
  getUserDisplayName,
} from '@/data/admin/users';
import type { SystemUser, UserType, UserStatus, UserFiltersState } from '@/data/admin/users';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  useSetPageMetadata({
    title: 'User Management',
    description: 'Manage users, permissions, and account settings across the platform',
    activeItem: 'users',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'User Management' }],
  });

  useSetPageActions(
    <Link
      href="/admin/users/create"
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="h-4 w-4" />
      Add User
    </Link>
  );

  const router = useRouter();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'delete' | 'toggle';
    user: SystemUser | null;
  }>({ open: false, type: 'delete', user: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Data
  const stats = useMemo(() => getUserStatsData(), []);

  const filters: UserFiltersState = useMemo(
    () => ({
      search: searchTerm,
      userType: userTypeFilter,
      status: statusFilter,
      sortBy,
      sortOrder,
    }),
    [searchTerm, userTypeFilter, statusFilter, sortBy, sortOrder]
  );

  const filteredUsers = useMemo(() => getFilteredUsers(filters), [filters]);
  const allUsers = useMemo(() => getFilteredUsers({ search: '', userType: 'all', status: 'all', sortBy: 'createdAt', sortOrder: 'desc' }), []);

  // Handlers
  const handleSort = useCallback((column: string) => {
    setSortBy((prev) => {
      if (prev === column) {
        setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortOrder('asc');
      return column;
    });
  }, []);

  const handleView = useCallback((user: SystemUser) => {
    router.push(`/admin/users/${user.id}`);
  }, [router]);

  const handleEdit = useCallback((user: SystemUser) => {
    router.push(`/admin/users/${user.id}/edit`);
  }, [router]);

  const handleToggleStatus = useCallback((user: SystemUser) => {
    setConfirmDialog({ open: true, type: 'toggle', user });
  }, []);

  const handleDelete = useCallback((user: SystemUser) => {
    setConfirmDialog({ open: true, type: 'delete', user });
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchTerm('');
    setUserTypeFilter('all');
    setStatusFilter('all');
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmDialog.user) return;
    setActionLoading(true);
    try {
      if (confirmDialog.type === 'delete') {
        await deleteUserById(confirmDialog.user.id);
      } else {
        const newStatus = confirmDialog.user.status === 'active' ? 'inactive' : 'active';
        await updateUserStatus(confirmDialog.user.id, newStatus);
      }
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, type: 'delete', user: null });
    }
  }, [confirmDialog]);

  const getDialogProps = () => {
    if (!confirmDialog.user) return { title: '', message: '' };
    const name = getUserDisplayName(confirmDialog.user);
    if (confirmDialog.type === 'delete') {
      return {
        title: 'Delete User',
        message: `Are you sure you want to permanently delete "${name}" (${confirmDialog.user.id})? This action cannot be undone.`,
        confirmLabel: 'Delete',
        variant: 'danger' as const,
      };
    }
    const willActivate = confirmDialog.user.status !== 'active';
    return {
      title: willActivate ? 'Activate User' : 'Deactivate User',
      message: willActivate
        ? `Activate "${name}"? They will be able to access the platform again.`
        : `Deactivate "${name}"? They will lose access to the platform until reactivated.`,
      confirmLabel: willActivate ? 'Activate' : 'Deactivate',
      variant: (willActivate ? 'info' : 'warning') as 'info' | 'warning',
    };
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <UserStatsCards stats={stats} />

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        userTypeFilter={userTypeFilter}
        onUserTypeChange={setUserTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClearAll={handleClearAll}
        totalCount={allUsers.length}
        filteredCount={filteredUsers.length}
      />

      {/* Table */}
      <UsersTable
        users={filteredUsers}
        currentSort={{ sortBy, sortOrder }}
        onSort={handleSort}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: 'delete', user: null })}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        {...getDialogProps()}
      />
    </div>
  );
}
