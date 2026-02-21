// Analytics mock data for admin portal
// Replace these functions with API calls when backend is ready

import { AnalyticsMetric, Report, ChartData } from './types';

// Mock analytics metrics
const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { name: 'Total Users', value: '25,694', change: '+12.5%', changeType: 'positive' },
  { name: 'Active Sessions', value: '1,247', change: '+8.3%', changeType: 'positive' },
  { name: 'Daily Transactions', value: '8,456', change: '-2.1%', changeType: 'negative' },
  { name: 'System Uptime', value: '99.9%', change: '+0.1%', changeType: 'positive' },
  { name: 'Revenue Today', value: 'Rs 2.4M', change: '+15.7%', changeType: 'positive' },
  { name: 'Error Rate', value: '0.02%', change: '-0.01%', changeType: 'positive' },
];

// Mock reports
const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Daily User Activity Report',
    type: 'User Analytics',
    lastGenerated: '2024-03-21 09:30',
    status: 'completed',
    size: '2.4 MB',
    format: 'PDF',
  },
  {
    id: 'RPT-002',
    name: 'System Performance Weekly',
    type: 'Performance',
    lastGenerated: '2024-03-20 18:45',
    status: 'completed',
    size: '1.8 MB',
    format: 'Excel',
  },
  {
    id: 'RPT-003',
    name: 'Revenue Analysis Monthly',
    type: 'Financial',
    lastGenerated: '2024-03-15 14:20',
    status: 'processing',
    size: '3.2 MB',
    format: 'PDF',
  },
  {
    id: 'RPT-004',
    name: 'Route Usage Statistics',
    type: 'Operations',
    lastGenerated: '2024-03-19 10:00',
    status: 'completed',
    size: '5.1 MB',
    format: 'Excel',
  },
  {
    id: 'RPT-005',
    name: 'Security Audit Report',
    type: 'Security',
    lastGenerated: '2024-03-18 16:30',
    status: 'completed',
    size: '890 KB',
    format: 'PDF',
  },
  {
    id: 'RPT-006',
    name: 'Fleet Performance Report',
    type: 'Operations',
    lastGenerated: '2024-03-17 11:15',
    status: 'failed',
    size: '0 KB',
    format: 'PDF',
  },
];

// Mock chart data
const mockUserGrowthChart: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'New Users',
      data: [1200, 1900, 2500, 3500, 4200, 5500, 6800, 8200, 9500, 11000, 12500, 14500],
      color: '#3B82F6',
    },
    {
      label: 'Active Users',
      data: [800, 1500, 2100, 3000, 3800, 5000, 6200, 7500, 8800, 10200, 11800, 13500],
      color: '#10B981',
    },
  ],
};

const mockRevenueChart: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue (Rs M)',
      data: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
      color: '#8B5CF6',
    },
  ],
};

const mockTransactionChart: ChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Transactions',
      data: [8500, 9200, 8800, 9500, 10200, 12500, 11000],
      color: '#F59E0B',
    },
  ],
};

const mockUserTypeDistribution: ChartData = {
  labels: ['Passengers', 'Conductors', 'Fleet Operators', 'Timekeepers', 'MOT Officers'],
  datasets: [
    {
      label: 'User Count',
      data: [12500, 450, 180, 120, 52],
      color: '#3B82F6',
    },
  ],
};

// System status data for monitoring tab
export interface SystemStatus {
  database: 'online' | 'offline' | 'degraded';
  apiResponse: string;
  serverLoad: number;
  activeSessions: number;
  systemUptime: string;
}

const mockSystemStatus: SystemStatus = {
  database: 'online',
  apiResponse: '142ms',
  serverLoad: 67,
  activeSessions: 1247,
  systemUptime: '99.9%',
};

// API functions (to be replaced with real API calls)
export function getAnalyticsMetrics(): AnalyticsMetric[] {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/metrics');
  return mockAnalyticsMetrics;
}

export function getReports(filter?: { type?: string; status?: string }): Report[] {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/reports', { params: filter });
  let filtered = [...mockReports];
  
  if (filter?.type && filter.type !== 'all') {
    filtered = filtered.filter(r => r.type === filter.type);
  }
  if (filter?.status && filter.status !== 'all') {
    filtered = filtered.filter(r => r.status === filter.status);
  }
  
  return filtered;
}

export function getReportById(id: string): Report | undefined {
  // TODO: Replace with API call
  return mockReports.find(r => r.id === id);
}

export function getUserGrowthChart(): ChartData {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/charts/user-growth');
  return mockUserGrowthChart;
}

export function getRevenueChart(): ChartData {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/charts/revenue');
  return mockRevenueChart;
}

export function getTransactionChart(): ChartData {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/charts/transactions');
  return mockTransactionChart;
}

export function getUserTypeDistribution(): ChartData {
  // TODO: Replace with API call
  // return await api.get('/admin/analytics/charts/user-types');
  return mockUserTypeDistribution;
}

export function getSystemStatus(): SystemStatus {
  // TODO: Replace with API call
  // return await api.get('/admin/monitoring/status');
  return mockSystemStatus;
}

export async function generateReport(reportType: string): Promise<Report> {
  // TODO: Replace with API call
  // return await api.post('/admin/analytics/reports/generate', { type: reportType });
  console.log(`Generating report: ${reportType}`);
  return {
    id: `RPT-${Date.now()}`,
    name: `Generated ${reportType} Report`,
    type: reportType,
    lastGenerated: new Date().toISOString(),
    status: 'processing',
    size: '0 KB',
    format: 'PDF',
  };
}

export async function downloadReport(id: string): Promise<string> {
  // TODO: Replace with API call
  // return await api.get(`/admin/analytics/reports/${id}/download`);
  console.log(`Downloading report ${id}`);
  return 'download_link_placeholder';
}

// Export mock data for direct access if needed
export const mockData = {
  analyticsMetrics: mockAnalyticsMetrics,
  reports: mockReports,
  userGrowthChart: mockUserGrowthChart,
  revenueChart: mockRevenueChart,
  transactionChart: mockTransactionChart,
  userTypeDistribution: mockUserTypeDistribution,
  systemStatus: mockSystemStatus,
};
