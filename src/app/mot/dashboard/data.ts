// Dummy data for MOT Admin Dashboard
// This file contains comprehensive mock data for dashboard components
// Replace with real API calls once backend services are implemented

export interface DashboardKPI {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface LiveStat {
  title: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

// Main KPI metrics for dashboard cards
export const kpiMetrics: DashboardKPI[] = [
  {
    title: 'Total Buses',
    value: 13,
    change: 5.2,
    trend: 'up',
    icon: 'bus',
    color: 'blue'
  },
  {
    title: 'Active Operators',
    value: 20,
    change: 2.1,
    trend: 'up',
    icon: 'users',
    color: 'green'
  },
  {
    title: 'Total Routes',
    value: 18,
    change: -1.3,
    trend: 'down',
    icon: 'route',
    color: 'purple'
  },
  {
    title: 'Valid Permits',
    value: 13,
    change: 3.7,
    trend: 'up',
    icon: 'shield',
    color: 'orange'
  },
  {
    title: 'Active Schedules',
    value: 6,
    change: 1.8,
    trend: 'up',
    icon: 'calendar',
    color: 'teal'
  },
  {
    title: 'Active Trips',
    value: 87,
    change: 12.4,
    trend: 'up',
    icon: 'activity',
    color: 'indigo'
  }
];

// Fleet distribution by bus type
export const fleetDistributionData: ChartData = {
  labels: ['Normal Bus', 'Semi-Luxury', 'Luxury', 'Air Conditioned', 'Super Luxury', 'Intercity'],
  datasets: [{
    label: 'Number of Buses',
    data: [5, 3, 1, 1, 2, 2],
    backgroundColor: [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#8B5CF6', // purple
      '#EF4444', // red
      '#06B6D4'  // cyan
    ],
    borderColor: [
      '#2563EB',
      '#059669',
      '#D97706',
      '#7C3AED',
      '#DC2626',
      '#0891B2'
    ],
    borderWidth: 2
  }]
};

// Route analytics by district
export const routeAnalyticsData: ChartData = {
  labels: ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Ratnapura', 'Kurunegala'],
  datasets: [{
    label: 'Number of Routes',
    data: [28, 19, 15, 22, 18, 12, 16, 14],
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: '#3B82F6',
    borderWidth: 2,
    tension: 0.4
  }]
};

// Permit status distribution
export const permitStatusData: ChartData = {
  labels: ['Active', 'Pending', 'Expired', 'Cancelled'],
  datasets: [{
    label: 'Permits',
    data: [1089, 67, 34, 18],
    backgroundColor: [
      '#10B981', // green for active
      '#F59E0B', // amber for pending
      '#EF4444', // red for expired
      '#6B7280'  // gray for cancelled
    ],
    borderColor: [
      '#059669',
      '#D97706',
      '#DC2626',
      '#4B5563'
    ],
    borderWidth: 2
  }]
};

// Operator performance metrics
export const operatorPerformanceData: ChartData = {
  labels: ['SLTB Western', 'SLTB Central', 'Private - Metro', 'Private - Express', 'CTB Colombo', 'CTB Suburban'],
  datasets: [
    {
      label: 'Fleet Size',
      data: [245, 189, 156, 134, 98, 87],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: '#3B82F6',
      borderWidth: 1
    },
    {
      label: 'Active Routes',
      data: [34, 28, 22, 19, 15, 12],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: '#10B981',
      borderWidth: 1
    }
  ]
};

// Monthly trend data
export const monthlyTrendData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'New Registrations',
      data: [12, 19, 8, 15, 22, 17, 24, 18, 21],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3B82F6',
      borderWidth: 3,
      tension: 0.4
    },
    {
      label: 'Permit Applications',
      data: [8, 15, 12, 18, 16, 21, 19, 25, 23],
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10B981',
      borderWidth: 3,
      tension: 0.4
    }
  ]
};

// System alerts
export const systemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'High System Load',
    message: 'Database response time exceeding 2 seconds. Immediate attention required.',
    timestamp: '2025-09-25T17:45:00Z',
    resolved: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Permits Expiring Soon',
    message: '23 passenger service permits will expire within the next 30 days.',
    timestamp: '2025-09-25T16:30:00Z',
    resolved: false
  },
  {
    id: '3',
    type: 'info',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance window on Sunday 3:00 AM - 5:00 AM.',
    timestamp: '2025-09-25T15:20:00Z',
    resolved: false
  },
  {
    id: '4',
    type: 'warning',
    title: 'Operator License Review',
    message: '5 operators require license renewal review within 15 days.',
    timestamp: '2025-09-25T14:15:00Z',
    resolved: false
  },
  {
    id: '5',
    type: 'critical',
    title: 'Route Capacity Exceeded',
    message: 'Route COL-001 operating at 120% capacity during peak hours.',
    timestamp: '2025-09-25T13:45:00Z',
    resolved: true
  }
];

// Live statistics
export const liveStats: LiveStat[] = [
  {
    title: 'Active Trips',
    value: 78,
    unit: 'trips',
    status: 'healthy',
    lastUpdated: '2025-09-25T18:00:00Z'
  },
  {
    title: 'System Uptime',
    value: 99.8,
    unit: '%',
    status: 'healthy',
    lastUpdated: '2025-09-25T18:00:00Z'
  },
  {
    title: 'Fleet Utilization',
    value: 84.2,
    unit: '%',
    status: 'healthy',
    lastUpdated: '2025-09-25T18:00:00Z'
  },
  {
    title: 'Avg Response Time',
    value: 245,
    unit: 'ms',
    status: 'warning',
    lastUpdated: '2025-09-25T18:00:00Z'
  },
  {
    title: 'Pending Applications',
    value: 12,
    unit: 'items',
    status: 'warning',
    lastUpdated: '2025-09-25T18:00:00Z'
  },
  {
    title: 'Data Sync Status',
    value: 98.5,
    unit: '%',
    status: 'healthy',
    lastUpdated: '2025-09-25T18:00:00Z'
  }
];

// Quick actions for admin users
export const quickActions: QuickAction[] = [
  {
    title: 'Bus Management',
    description: 'Register, update, and manage bus fleet',
    icon: 'bus',
    href: '/mot/buses',
    color: 'blue'
  },
  {
    title: 'Operator Management',
    description: 'Manage transport operators and licenses',
    icon: 'users',
    href: '/mot/operators',
    color: 'green'
  },
  {
    title: 'Route Management',
    description: 'Create and manage bus routes',
    icon: 'route',
    href: '/mot/routes',
    color: 'purple'
  },
  {
    title: 'Permit Management',
    description: 'Issue and manage service permits',
    icon: 'shield',
    href: '/mot/permits',
    color: 'orange'
  },
  {
    title: 'Schedule Management',
    description: 'Manage bus schedules and timetables',
    icon: 'calendar',
    href: '/mot/schedules',
    color: 'teal'
  },
  {
    title: 'Trip Management',
    description: 'Monitor and manage active trips',
    icon: 'activity',
    href: '/mot/trips',
    color: 'indigo'
  },
  {
    title: 'Reports & Analytics',
    description: 'Generate system reports and analytics',
    icon: 'chart',
    href: '/mot/reports',
    color: 'pink'
  },
  {
    title: 'System Settings',
    description: 'Configure system parameters',
    icon: 'settings',
    href: '/mot/settings',
    color: 'gray'
  }
];

// Geographic distribution data
export const geographicDistributionData: ChartData = {
  labels: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province', 'Sabaragamuwa Province'],
  datasets: [{
    label: 'Registered Buses',
    data: [387, 234, 198, 145, 123, 167, 89, 76, 98],
    backgroundColor: [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899'
    ],
    borderColor: [
      '#2563EB', '#059669', '#D97706', '#7C3AED', '#DC2626',
      '#0891B2', '#65A30D', '#EA580C', '#DB2777'
    ],
    borderWidth: 2
  }]
};

// Capacity utilization by route type
export const capacityUtilizationData: ChartData = {
  labels: ['Express Routes', 'Normal Routes', 'Intercity Routes', 'Local Routes'],
  datasets: [{
    label: 'Capacity Utilization (%)',
    data: [89, 76, 92, 68],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(139, 92, 246, 0.8)'
    ],
    borderColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#8B5CF6'
    ],
    borderWidth: 2
  }]
};