'use client';

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import type { ChartData } from '@/app/mot/(authenticated)/dashboard/data';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

// ── Shared chart wrapper ──────────────────────────────────────────

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ── Common options ────────────────────────────────────────────────

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', titleFont: { size: 11 }, bodyFont: { size: 11 } },
  },
};

const doughnutOptions = {
  ...baseOptions,
  cutout: '65%',
};

const barOptions = {
  ...baseOptions,
  scales: {
    x: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { display: false } },
    y: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { color: 'rgba(0,0,0,0.04)' } },
  },
};

const lineOptions = {
  ...baseOptions,
  elements: { point: { radius: 0, hoverRadius: 4 } },
  scales: {
    x: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { display: false } },
    y: { ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { color: 'rgba(0,0,0,0.04)' } },
  },
};

// ── Chart components ──────────────────────────────────────────────

export function FleetDistributionChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Fleet Distribution">
      <div className="h-48">
        <Doughnut data={data as any} options={doughnutOptions} />
      </div>
    </ChartCard>
  );
}

export function RouteAnalyticsChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Route Analytics">
      <div className="h-48">
        <Bar data={data as any} options={barOptions} />
      </div>
    </ChartCard>
  );
}

export function PermitStatusChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Permit Status">
      <div className="h-48">
        <Pie data={data as any} options={baseOptions} />
      </div>
    </ChartCard>
  );
}

export function GeographicDistributionChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Geographic Distribution">
      <div className="h-48">
        <Bar data={data as any} options={{ ...barOptions, indexAxis: 'y' as const }} />
      </div>
    </ChartCard>
  );
}

export function CapacityUtilizationChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Capacity Utilization">
      <div className="h-48">
        <Bar data={data as any} options={barOptions} />
      </div>
    </ChartCard>
  );
}

export function OperatorPerformanceChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Operator Performance">
      <div className="h-56">
        <Bar data={data as any} options={barOptions} />
      </div>
    </ChartCard>
  );
}

export function MonthlyTrendChart({ data }: { data: ChartData }) {
  return (
    <ChartCard title="Monthly Trends">
      <div className="h-56">
        <Line data={data as any} options={lineOptions} />
      </div>
    </ChartCard>
  );
}
