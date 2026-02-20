'use client';

import { DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { FareStatistics } from '@/data/mot/fares';

interface FareStatsCardsProps {
    stats: FareStatistics | null;
    loading?: boolean;
}

export function FareStatsCards({ stats, loading }: FareStatsCardsProps) {
    const cards = [
        {
            label: 'Total Fare Structures',
            value: stats?.totalFares ?? 0,
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            subtitle: 'All routes covered',
        },
        {
            label: 'Active Fares',
            value: stats?.activeFares ?? 0,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
            subtitle: 'Currently in effect',
        },
        {
            label: 'Expired Fares',
            value: stats?.expiredFares ?? 0,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            subtitle: 'No longer valid',
        },
        {
            label: 'Pending Approval',
            value: stats?.pendingFares ?? 0,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            subtitle: 'Awaiting review',
        },
        {
            label: 'Average Rate',
            value: stats ? `Rs. ${stats.averagePerKmRate.toFixed(2)}` : 'Rs. 0.00',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            subtitle: 'Per kilometer',
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
                    <p className={`text-xs mt-1 ${card.color} opacity-75`}>{card.subtitle}</p>
                </div>
            ))}
        </div>
    );
}
