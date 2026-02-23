'use client';

import {
    Eye,
    Send,
    Clock,
    AlertTriangle,
    CheckCircle,
    Info,
    Wrench,
    XCircle,
    Users,
} from 'lucide-react';
import type { Notification } from '@/data/admin/types';
import { DataTable, DataTableColumn, SortState } from '@/components/shared/DataTable';

interface ReceivedNotificationTableProps {
    notifications: Notification[];
    loading?: boolean;
    onView: (id: string) => void;
    currentSort: SortState;
    onSort: (field: string) => void;
}

const typeStyles: Record<string, { cls: string; label: string }> = {
    info: { cls: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Info' },
    warning: { cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200', label: 'Warning' },
    critical: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'Critical' },
    success: { cls: 'bg-green-50 text-green-700 border border-green-200', label: 'Success' },
    maintenance: { cls: 'bg-purple-50 text-purple-700 border border-purple-200', label: 'Maintenance' },
    error: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'Error' },
};

const priorityStyles: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-orange-50 text-orange-700',
    critical: 'bg-red-50 text-red-700',
};

export function ReceivedNotificationTable({
    notifications,
    loading,
    onView,
    currentSort,
    onSort,
}: ReceivedNotificationTableProps) {
    const columns: DataTableColumn<Notification>[] = [
        {
            key: 'title',
            header: 'Notification',
            sortable: true,
            render: (n) => (
                <div
                    className="cursor-pointer"
                    onClick={() => onView(n.id)}
                >
                    <p className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{n.body}</p>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            render: (n) => {
                const style = typeStyles[n.type] || typeStyles.info;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.cls}`}>
                        {style.label}
                    </span>
                );
            },
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (n) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[n.priority] || 'bg-gray-100 text-gray-600'}`}>
                    {n.priority}
                </span>
            ),
        },
        {
            key: 'targetAudience',
            header: 'Audience',
            render: (n) => (
                <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700 capitalize">
                        {n.targetAudience.replace('_', ' ')}
                    </span>
                </div>
            ),
        },
        {
            key: 'createdAt',
            header: 'Date',
            sortable: true,
            render: (n) => (
                <span className="text-sm text-gray-600">
                    {new Date(n.createdAt).toLocaleDateString('en-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (n) => (
                <button
                    onClick={() => onView(n.id)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
            ),
        },
    ];

    return (
        <DataTable<Notification>
            columns={columns}
            data={notifications}
            loading={loading}
            currentSort={currentSort}
            onSort={(sort) => onSort(sort.field)}
            rowKey={(n) => n.id}
            emptyState={{
                icon: '🔔',
                title: 'No notifications',
                description: 'No notifications match your current filters.',
            }}
        />
    );
}
