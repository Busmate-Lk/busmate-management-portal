'use client';

import React, { useMemo } from 'react';
import {
    Eye,
    Trash2,
    Bell,
    Send,
    Clock,
    AlertTriangle,
    CheckCircle,
    Info,
    Wrench,
    XCircle,
    Users,
    Mail,
    Smartphone,
    MessageSquare,
} from 'lucide-react';
import type { Notification } from '@/data/admin/types';
import { DataTable, type DataTableColumn, type SortState } from '@/components/shared/DataTable';

// ── Types ─────────────────────────────────────────────────────────

export type NotificationsTableMode = 'received' | 'sent';

interface NotificationsTableProps {
    notifications: Notification[];
    mode: NotificationsTableMode;
    loading?: boolean;
    onView: (id: string) => void;
    onDelete: (notification: Notification) => void;
    currentSort: SortState;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
}

// ── Style helpers ─────────────────────────────────────────────────

const typeStyles: Record<string, { cls: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = {
    info: { cls: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Info', Icon: Info },
    warning: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Warning', Icon: AlertTriangle },
    critical: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'Critical', Icon: XCircle },
    success: { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Success', Icon: CheckCircle },
    maintenance: { cls: 'bg-purple-50 text-purple-700 border border-purple-200', label: 'Maintenance', Icon: Wrench },
    error: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'Error', Icon: XCircle },
};

const priorityStyles: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600 border border-gray-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    high: 'bg-orange-50 text-orange-700 border border-orange-200',
    critical: 'bg-red-50 text-red-700 border border-red-200',
};

const statusStyles: Record<string, { cls: string; label: string }> = {
    sent: { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Sent' },
    scheduled: { cls: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Scheduled' },
    draft: { cls: 'bg-gray-100 text-gray-600 border border-gray-200', label: 'Draft' },
    failed: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'Failed' },
};

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    push: Smartphone,
    email: Mail,
    sms: MessageSquare,
    'in-app': Bell,
};

const audienceLabels: Record<string, string> = {
    all: 'Everyone',
    passengers: 'Passengers',
    conductors: 'Conductors',
    fleet_operators: 'Fleet Operators',
    mot_officers: 'MOT Officers',
    timekeepers: 'Timekeepers',
};

// ── Helpers ───────────────────────────────────────────────────────

function formatDate(dateString?: string): string {
    if (!dateString) return '—';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return '—';
    }
}

function readRatePercent(n: Notification): string {
    if (!n.totalRecipients || n.totalRecipients === 0) return '—';
    return `${Math.round((n.readCount / n.totalRecipients) * 100)}%`;
}

// ── Main component ────────────────────────────────────────────────

/**
 * Notifications data table.
 *
 * Renders different column sets for "received" vs "sent" mode.
 * Delegates rendering to the shared `<DataTable>` component.
 */
export function NotificationsTable({
    notifications,
    mode,
    loading,
    onView,
    onDelete,
    currentSort,
    onSort,
}: NotificationsTableProps) {
    const columns = useMemo<DataTableColumn<Notification>[]>(() => {
        const titleCol: DataTableColumn<Notification> = {
            key: 'title',
            header: 'Notification',
            sortable: true,
            minWidth: 'min-w-[220px]',
            render: (n) => (
                <button
                    className="text-left w-full group"
                    onClick={() => onView(n.id)}
                >
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {n.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{n.body}</p>
                </button>
            ),
        };

        const typeCol: DataTableColumn<Notification> = {
            key: 'type',
            header: 'Type',
            cellClassName: 'whitespace-nowrap',
            render: (n) => {
                const style = typeStyles[n.type] ?? typeStyles.info;
                const { Icon } = style;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.cls}`}>
                        <Icon className="h-3 w-3" />
                        {style.label}
                    </span>
                );
            },
        };

        const priorityCol: DataTableColumn<Notification> = {
            key: 'priority',
            header: 'Priority',
            cellClassName: 'whitespace-nowrap',
            render: (n) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[n.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                    {n.priority}
                </span>
            ),
        };

        const actionsCol: DataTableColumn<Notification> = {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-center',
            cellClassName: 'text-center whitespace-nowrap',
            render: (n) => (
                <div className="inline-flex items-center justify-center gap-1">
                    <button
                        onClick={() => onView(n.id)}
                        title="View"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(n)}
                        title="Delete"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        };

        if (mode === 'received') {
            return [
                titleCol,
                typeCol,
                priorityCol,
                {
                    key: 'senderName',
                    header: 'Sender',
                    cellClassName: 'whitespace-nowrap',
                    render: (n) => (
                        <span className="text-sm text-gray-700">{n.senderName}</span>
                    ),
                },
                {
                    key: 'channel',
                    header: 'Channel',
                    cellClassName: 'whitespace-nowrap',
                    render: (n) => {
                        if (!n.channel) return <span className="text-gray-400">—</span>;
                        const ChannelIcon = channelIcons[n.channel] ?? Bell;
                        return (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600 capitalize">
                                <ChannelIcon className="h-3.5 w-3.5 text-gray-400" />
                                {n.channel}
                            </span>
                        );
                    },
                },
                {
                    key: 'createdAt',
                    header: 'Received',
                    sortable: true,
                    cellClassName: 'whitespace-nowrap',
                    render: (n) => (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            {formatDate(n.sentAt ?? n.createdAt)}
                        </div>
                    ),
                },
                actionsCol,
            ];
        }

        // Sent mode
        return [
            titleCol,
            typeCol,
            priorityCol,
            {
                key: 'targetAudience',
                header: 'Audience',
                cellClassName: 'whitespace-nowrap',
                render: (n) => (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {audienceLabels[n.targetAudience] ?? n.targetAudience}
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                sortable: true,
                cellClassName: 'whitespace-nowrap',
                render: (n) => {
                    const style = statusStyles[n.status] ?? statusStyles.draft;
                    return (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.cls}`}>
                            {style.label}
                        </span>
                    );
                },
            },
            {
                key: 'sentAt',
                header: 'Sent',
                sortable: true,
                cellClassName: 'whitespace-nowrap',
                render: (n) => (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Send className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        {formatDate(n.sentAt)}
                    </div>
                ),
            },
            {
                key: 'readCount',
                header: 'Read Rate',
                cellClassName: 'whitespace-nowrap',
                render: (n) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-700">{readRatePercent(n)}</span>
                        <span className="text-xs text-gray-400">{n.readCount.toLocaleString()} / {n.totalRecipients.toLocaleString()}</span>
                    </div>
                ),
            },
            actionsCol,
        ];
    }, [mode, onView, onDelete]);

    return (
        <DataTable<Notification>
            columns={columns}
            data={notifications}
            loading={loading}
            currentSort={currentSort}
            onSort={onSort}
            rowKey={(n) => n.id}
            showRefreshing
            emptyState={
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="p-4 bg-gray-50 rounded-full">
                        <Bell className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-500">No notifications found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
            }
        />
    );
}
