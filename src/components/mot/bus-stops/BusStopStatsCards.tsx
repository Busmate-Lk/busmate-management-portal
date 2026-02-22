'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Minus, MapPin, Accessibility, AlertCircle, Map, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Mini sparkline ────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80, H = 28;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={W} height={H} className="overflow-visible opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// ── Trend icon ────────────────────────────────────────────────────

function TrendIcon({ trend, positive }: { trend: 'up' | 'down' | 'stable'; positive: boolean }) {
  if (trend === 'stable') return <Minus className="h-3 w-3 text-gray-400" />;
  const isGood = (trend === 'up') === positive;
  const cls = isGood ? 'text-green-600' : 'text-red-600';
  return trend === 'up'
    ? <ArrowUp className={`h-3 w-3 ${cls}`} />
    : <ArrowDown className={`h-3 w-3 ${cls}`} />;
}

// ── Color maps ────────────────────────────────────────────────────

type CardColor = 'blue' | 'teal' | 'green' | 'red' | 'purple';

const BG: Record<CardColor, string> = {
  blue:   'bg-blue-50   border-blue-200',
  teal:   'bg-teal-50   border-teal-200',
  green:  'bg-green-50  border-green-200',
  red:    'bg-red-50    border-red-200',
  purple: 'bg-purple-50 border-purple-200',
};

const ICON_BG: Record<CardColor, string> = {
  blue:   'bg-blue-100   text-blue-600',
  teal:   'bg-teal-100   text-teal-600',
  green:  'bg-green-100  text-green-600',
  red:    'bg-red-100    text-red-600',
  purple: 'bg-purple-100 text-purple-600',
};

const SPARK_COLOR: Record<CardColor, string> = {
  blue:   '#3b82f6',
  teal:   '#14b8a6',
  green:  '#22c55e',
  red:    '#ef4444',
  purple: '#a855f7',
};

// ── Card ──────────────────────────────────────────────────────────

function KPICard({ label, value, trend, trendValue, trendPositiveIsGood, color, sparkData, Icon }: {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  trendPositiveIsGood: boolean;
  color: CardColor;
  sparkData: number[];
  Icon: LucideIcon;
}) {
  const trendColor =
    trend === 'stable'
      ? 'text-gray-500'
      : (trend === 'up') === trendPositiveIsGood
      ? 'text-green-600'
      : 'text-red-600';

  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${BG[color]}`}
    >
      {/* Header row: icon pill + label on left, sparkline on right */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg ${ICON_BG[color]}`}>
            <Icon className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-gray-600 leading-tight">{label}</p>
        </div>
        <Sparkline data={sparkData} color={SPARK_COLOR[color]} />
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>

      {/* Trend */}
      {trendValue && trendValue !== 'No change' ? (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon trend={trend} positive={trendPositiveIsGood} />
          <span>{trendValue}</span>
        </div>
      ) : null}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────

function KPICardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-7 bg-gray-100 rounded w-20" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-32 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-28" />
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────

interface BusStopStatsCardsProps {
  stats: {
    totalStops: { count: number; change?: string };
    accessibleStops: { count: number; change?: string };
    nonAccessibleStops: { count: number; change?: string };
    totalStates: { count: number; change?: string };
    totalCities: { count: number; change?: string };
  };
  loading?: boolean;
}

// ── Main component ────────────────────────────────────────────────

export function BusStopStatsCards({ stats, loading = false }: BusStopStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
    );
  }

  const parseTrend = (change?: string): { trend: 'up' | 'down' | 'stable'; trendValue: string } => {
    if (!change) return { trend: 'stable', trendValue: 'No change' };
    if (change.startsWith('+')) return { trend: 'up', trendValue: change };
    if (change.startsWith('-')) return { trend: 'down', trendValue: change };
    return { trend: 'stable', trendValue: change };
  };

  const kpis: Array<{
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    trendPositiveIsGood: boolean;
    color: CardColor;
    sparkData: number[];
    Icon: LucideIcon;
  }> = [
    {
      label: 'Total Bus Stops',
      value: stats.totalStops.count.toLocaleString(),
      ...parseTrend(stats.totalStops.change),
      trendPositiveIsGood: true,
      color: 'blue',
      sparkData: [],
      Icon: MapPin,
    },
    {
      label: 'Accessible',
      value: stats.accessibleStops.count.toLocaleString(),
      ...parseTrend(stats.accessibleStops.change),
      trendPositiveIsGood: true,
      color: 'green',
      sparkData: [],
      Icon: Accessibility,
    },
    {
      label: 'Non-Accessible',
      value: stats.nonAccessibleStops.count.toLocaleString(),
      ...parseTrend(stats.nonAccessibleStops.change),
      trendPositiveIsGood: false,
      color: 'red',
      sparkData: [],
      Icon: AlertCircle,
    },
    {
      label: 'States',
      value: stats.totalStates.count.toLocaleString(),
      ...parseTrend(stats.totalStates.change),
      trendPositiveIsGood: true,
      color: 'purple',
      sparkData: [],
      Icon: Map,
    },
    {
      label: 'Cities',
      value: stats.totalCities.count.toLocaleString(),
      ...parseTrend(stats.totalCities.change),
      trendPositiveIsGood: true,
      color: 'teal',
      sparkData: [],
      Icon: Building2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}
