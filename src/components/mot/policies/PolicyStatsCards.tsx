'use client';

import { FileText, CheckCircle, Clock, Eye, Archive } from 'lucide-react';
import { PolicyStatistics } from '@/data/mot/policies';

interface PolicyStatsCardsProps {
    stats: PolicyStatistics | null;
    loading?: boolean;
}

export function PolicyStatsCards({ stats, loading }: PolicyStatsCardsProps) {
    const cards = [
        {
            label: 'Total Policies',
            value: stats?.totalPolicies ?? 0,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        {
            label: 'Published',
            value: stats?.publishedPolicies ?? 0,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
        },
        {
            label: 'Drafts',
            value: stats?.draftPolicies ?? 0,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
        },
        {
            label: 'Under Review',
            value: stats?.underReviewPolicies ?? 0,
            icon: Eye,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
        },
        {
            label: 'Archived',
            value: stats?.archivedPolicies ?? 0,
            icon: Archive,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                        <div className="h-8 bg-gray-200 rounded w-12" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`${card.bg} rounded-lg border ${card.border} p-4 transition-all hover:shadow-sm`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">{card.label}</span>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                </div>
            ))}
        </div>
    );
}
