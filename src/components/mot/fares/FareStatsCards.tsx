'use client';

import { DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { FareStatistics } from '@/data/mot/fares';
import { StatsCardsContainer } from '@/components/shared/StatsCardsContainer';
import { StatsCardMetric } from '@/components/shared/StatsCard';

interface FareStatsCardsProps {
    stats: FareStatistics | null;
    loading?: boolean;
}

export function FareStatsCards({ stats, loading }: FareStatsCardsProps) {
    const metrics: StatsCardMetric[] = [
        {
            label: 'Total Fare Structures',
            value: String(stats?.totalFares ?? 0),
            color: 'blue',
            icon: DollarSign,
        },
        {
            label: 'Active Fares',
            value: String(stats?.activeFares ?? 0),
            color: 'green',
            icon: CheckCircle,
        },
        {
            label: 'Expired Fares',
            value: String(stats?.expiredFares ?? 0),
            color: 'red',
            icon: AlertTriangle,
        },
        {
            label: 'Pending Approval',
            value: String(stats?.pendingFares ?? 0),
            color: 'amber',
            icon: Clock,
        },
        {
            label: 'Average Rate',
            value: stats ? `Rs. ${stats.averagePerKmRate.toFixed(2)}` : 'Rs. 0.00',
            color: 'purple',
            icon: TrendingUp,
        },
    ];

    return <StatsCardsContainer metrics={metrics} columns={5} loading={loading} />;
}
