// System monitoring mock data for admin portal
// Replace these functions with API calls when backend is ready

import { ApiEndpoint, MicroserviceStatus, ResourceUsage } from './types';

// Mock API endpoints data
const mockApiEndpoints: ApiEndpoint[] = [
  {
    id: 'API-001',
    name: 'User Authentication API',
    endpoint: '/api/v1/auth',
    status: 'healthy',
    responseTime: '45ms',
    lastChecked: '2 mins ago',
    uptime: '99.98%',
    requests24h: '15,847',
  },
  {
    id: 'API-002',
    name: 'Bus Routes API',
    endpoint: '/api/v1/routes',
    status: 'healthy',
    responseTime: '123ms',
    lastChecked: '1 min ago',
    uptime: '99.95%',
    requests24h: '28,593',
  },
  {
    id: 'API-003',
    name: 'Payment Processing API',
    endpoint: '/api/v1/payments',
    status: 'warning',
    responseTime: '890ms',
    lastChecked: '3 mins ago',
    uptime: '99.12%',
    requests24h: '8,247',
  },
  {
    id: 'API-004',
    name: 'Notification Service API',
    endpoint: '/api/v1/notifications',
    status: 'healthy',
    responseTime: '67ms',
    lastChecked: '1 min ago',
    uptime: '99.87%',
    requests24h: '12,094',
  },
  {
    id: 'API-005',
    name: 'Location Tracking API',
    endpoint: '/api/v1/tracking',
    status: 'error',
    responseTime: 'timeout',
    lastChecked: '5 mins ago',
    uptime: '97.84%',
    requests24h: '45,693',
  },
  {
    id: 'API-006',
    name: 'Analytics API',
    endpoint: '/api/v1/analytics',
    status: 'healthy',
    responseTime: '234ms',
    lastChecked: '2 mins ago',
    uptime: '99.76%',
    requests24h: '6,432',
  },
  {
    id: 'API-007',
    name: 'Ticketing API',
    endpoint: '/api/v1/tickets',
    status: 'healthy',
    responseTime: '156ms',
    lastChecked: '1 min ago',
    uptime: '99.92%',
    requests24h: '35,891',
  },
  {
    id: 'API-008',
    name: 'Schedule Management API',
    endpoint: '/api/v1/schedules',
    status: 'healthy',
    responseTime: '189ms',
    lastChecked: '2 mins ago',
    uptime: '99.89%',
    requests24h: '18,234',
  },
];

// Mock microservice status data
const mockMicroservices: MicroserviceStatus[] = [
  {
    id: 'SVC-001',
    name: 'User Service',
    status: 'running',
    cpu: 23,
    memory: 45,
    uptime: '45 days',
    version: '2.3.1',
    lastRestart: '2024-02-05 03:00:00',
  },
  {
    id: 'SVC-002',
    name: 'Route Service',
    status: 'running',
    cpu: 35,
    memory: 52,
    uptime: '30 days',
    version: '1.8.4',
    lastRestart: '2024-02-20 04:00:00',
  },
  {
    id: 'SVC-003',
    name: 'Payment Service',
    status: 'degraded',
    cpu: 78,
    memory: 85,
    uptime: '15 days',
    version: '3.1.0',
    lastRestart: '2024-03-06 02:30:00',
  },
  {
    id: 'SVC-004',
    name: 'Notification Service',
    status: 'running',
    cpu: 18,
    memory: 32,
    uptime: '60 days',
    version: '1.5.2',
    lastRestart: '2024-01-21 05:00:00',
  },
  {
    id: 'SVC-005',
    name: 'Location Service',
    status: 'down',
    cpu: 0,
    memory: 0,
    uptime: '0 days',
    version: '2.0.3',
    lastRestart: '2024-03-21 10:45:00',
  },
  {
    id: 'SVC-006',
    name: 'Analytics Service',
    status: 'running',
    cpu: 42,
    memory: 68,
    uptime: '25 days',
    version: '1.2.1',
    lastRestart: '2024-02-25 03:15:00',
  },
  {
    id: 'SVC-007',
    name: 'Ticketing Service',
    status: 'running',
    cpu: 28,
    memory: 41,
    uptime: '40 days',
    version: '2.5.0',
    lastRestart: '2024-02-10 04:30:00',
  },
  {
    id: 'SVC-008',
    name: 'Schedule Service',
    status: 'running',
    cpu: 31,
    memory: 48,
    uptime: '35 days',
    version: '1.9.2',
    lastRestart: '2024-02-15 03:45:00',
  },
];

// Mock resource usage data (last 24 hours, hourly)
const mockResourceUsage: ResourceUsage[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
  cpu: Math.floor(Math.random() * 40) + 30,
  memory: Math.floor(Math.random() * 30) + 50,
  disk: Math.floor(Math.random() * 10) + 60,
  network: Math.floor(Math.random() * 50) + 20,
}));

// Monitoring stats
export interface MonitoringStats {
  healthyApis: number;
  warningApis: number;
  errorApis: number;
  totalApis: number;
  runningServices: number;
  degradedServices: number;
  downServices: number;
  totalServices: number;
  avgCpu: number;
  avgMemory: number;
  avgDisk: number;
}

function calculateMonitoringStats(): MonitoringStats {
  return {
    healthyApis: mockApiEndpoints.filter(a => a.status === 'healthy').length,
    warningApis: mockApiEndpoints.filter(a => a.status === 'warning').length,
    errorApis: mockApiEndpoints.filter(a => a.status === 'error').length,
    totalApis: mockApiEndpoints.length,
    runningServices: mockMicroservices.filter(s => s.status === 'running').length,
    degradedServices: mockMicroservices.filter(s => s.status === 'degraded').length,
    downServices: mockMicroservices.filter(s => s.status === 'down').length,
    totalServices: mockMicroservices.length,
    avgCpu: Math.round(mockMicroservices.reduce((sum, s) => sum + s.cpu, 0) / mockMicroservices.length),
    avgMemory: Math.round(mockMicroservices.reduce((sum, s) => sum + s.memory, 0) / mockMicroservices.length),
    avgDisk: 65,
  };
}

// API functions (to be replaced with real API calls)
export function getApiEndpoints(): ApiEndpoint[] {
  // TODO: Replace with API call
  // return await api.get('/admin/monitoring/api-health');
  return mockApiEndpoints;
}

export function getApiEndpointById(id: string): ApiEndpoint | undefined {
  // TODO: Replace with API call
  return mockApiEndpoints.find(a => a.id === id);
}

export function getMicroservices(): MicroserviceStatus[] {
  // TODO: Replace with API call
  // return await api.get('/admin/monitoring/microservices');
  return mockMicroservices;
}

export function getMicroserviceById(id: string): MicroserviceStatus | undefined {
  // TODO: Replace with API call
  return mockMicroservices.find(s => s.id === id);
}

export function getResourceUsage(hours: number = 24): ResourceUsage[] {
  // TODO: Replace with API call
  // return await api.get('/admin/monitoring/resources', { params: { hours } });
  return mockResourceUsage.slice(-hours);
}

export function getMonitoringStats(): MonitoringStats {
  // TODO: Replace with API call
  // return await api.get('/admin/monitoring/stats');
  return calculateMonitoringStats();
}

export async function restartService(id: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.post(`/admin/monitoring/services/${id}/restart`);
  console.log(`Restarting service ${id}`);
  return true;
}

export async function refreshApiHealth(): Promise<ApiEndpoint[]> {
  // TODO: Replace with API call
  // return await api.post('/admin/monitoring/api-health/refresh');
  return mockApiEndpoints;
}

// Export mock data for direct access if needed
export const mockData = {
  apiEndpoints: mockApiEndpoints,
  microservices: mockMicroservices,
  resourceUsage: mockResourceUsage,
};
