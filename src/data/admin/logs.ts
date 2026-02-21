// System logs mock data for admin portal
// Replace these functions with API calls when backend is ready

import { LogEntry, UserActivityLog, SecurityLog, ApplicationLog } from './types';

// Mock user activity logs
const mockUserActivityLogs: UserActivityLog[] = [
  {
    id: 'UAL-001',
    timestamp: '2024-03-21 14:32:45',
    userId: 'USR-12847',
    userName: 'John Doe',
    userType: 'Passenger',
    action: 'Login',
    details: 'Successful login via mobile app',
    ipAddress: '192.168.1.105',
    device: 'iPhone 14 Pro',
    location: 'Colombo, Sri Lanka',
    status: 'success',
  },
  {
    id: 'UAL-002',
    timestamp: '2024-03-21 14:30:12',
    userId: 'USR-98432',
    userName: 'Sarah Wilson',
    userType: 'Conductor',
    action: 'Route Update',
    details: 'Updated bus route BC-138 schedule',
    ipAddress: '10.0.1.23',
    device: 'Android Tablet',
    location: 'Kandy, Sri Lanka',
    status: 'success',
  },
  {
    id: 'UAL-003',
    timestamp: '2024-03-21 14:28:33',
    userId: 'USR-55621',
    userName: 'Mike Chen',
    userType: 'Passenger',
    action: 'Payment Failed',
    details: 'Credit card payment declined for ticket booking',
    ipAddress: '203.94.15.78',
    device: 'Chrome Browser',
    location: 'Galle, Sri Lanka',
    status: 'error',
  },
  {
    id: 'UAL-004',
    timestamp: '2024-03-21 14:25:17',
    userId: 'ADM-00123',
    userName: 'Admin User',
    userType: 'Administrator',
    action: 'User Management',
    details: 'Created new conductor account',
    ipAddress: '10.0.0.1',
    device: 'Windows PC',
    location: 'Colombo Office',
    status: 'success',
  },
  {
    id: 'UAL-005',
    timestamp: '2024-03-21 14:22:05',
    userId: 'USR-77394',
    userName: 'Emma Davis',
    userType: 'Passenger',
    action: 'Ticket Booking',
    details: 'Booked ticket for Route BC-245',
    ipAddress: '172.16.0.45',
    device: 'Samsung Galaxy',
    location: 'Negombo, Sri Lanka',
    status: 'success',
  },
  {
    id: 'UAL-006',
    timestamp: '2024-03-21 14:20:18',
    userId: 'USR-34521',
    userName: 'David Brown',
    userType: 'Fleet Manager',
    action: 'Bus Assignment',
    details: 'Assigned bus LM-7832 to Route BC-301',
    ipAddress: '192.168.10.12',
    device: 'iPad Pro',
    location: 'Matara Depot',
    status: 'success',
  },
  {
    id: 'UAL-007',
    timestamp: '2024-03-21 14:18:45',
    userId: 'MOT-00012',
    userName: 'Ruwan Silva',
    userType: 'MOT Officer',
    action: 'Route Approval',
    details: 'Approved new route BC-412',
    ipAddress: '10.0.0.15',
    device: 'Windows PC',
    location: 'MOT Office',
    status: 'success',
  },
  {
    id: 'UAL-008',
    timestamp: '2024-03-21 14:15:30',
    userId: 'USR-88234',
    userName: 'Priya Sharma',
    userType: 'Timekeeper',
    action: 'Bus Check-in',
    details: 'Checked in bus NB-4521 at Fort Terminal',
    ipAddress: '192.168.5.78',
    device: 'Android Phone',
    location: 'Colombo Fort',
    status: 'success',
  },
];

// Mock security logs
const mockSecurityLogs: SecurityLog[] = [
  {
    id: 'SEC-001',
    timestamp: '2024-03-21 14:45:12',
    eventType: 'login',
    userId: 'ADM-001',
    userName: 'System Admin',
    ipAddress: '10.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
    details: 'Successful admin login',
    severity: 'low',
  },
  {
    id: 'SEC-002',
    timestamp: '2024-03-21 14:40:33',
    eventType: 'failed_login',
    userId: 'USR-12345',
    userName: 'Unknown',
    ipAddress: '192.168.100.50',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
    details: 'Failed login attempt - invalid password (3rd attempt)',
    severity: 'medium',
  },
  {
    id: 'SEC-003',
    timestamp: '2024-03-21 14:35:18',
    eventType: 'suspicious_activity',
    ipAddress: '45.33.32.156',
    userAgent: 'curl/7.81.0',
    details: 'Multiple rapid API requests detected - possible DDoS attempt',
    severity: 'high',
  },
  {
    id: 'SEC-004',
    timestamp: '2024-03-21 14:30:45',
    eventType: 'permission_change',
    userId: 'MOT-002',
    userName: 'Kamal Perera',
    ipAddress: '10.0.0.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123.0',
    details: 'User granted route_management permission by ADM-001',
    severity: 'medium',
  },
  {
    id: 'SEC-005',
    timestamp: '2024-03-21 14:25:00',
    eventType: 'password_change',
    userId: 'USR-55621',
    userName: 'Mike Chen',
    ipAddress: '203.94.15.78',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
    details: 'Password changed successfully',
    severity: 'low',
  },
  {
    id: 'SEC-006',
    timestamp: '2024-03-21 14:20:15',
    eventType: 'suspicious_activity',
    ipAddress: '185.220.101.45',
    userAgent: 'python-requests/2.28.1',
    details: 'Brute force attack detected - IP blocked',
    severity: 'critical',
  },
  {
    id: 'SEC-007',
    timestamp: '2024-03-21 14:15:30',
    eventType: 'logout',
    userId: 'FLT-023',
    userName: 'Lanka Express',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/17.4',
    details: 'User logged out',
    severity: 'low',
  },
];

// Mock application logs
const mockApplicationLogs: ApplicationLog[] = [
  {
    id: 'APP-001',
    timestamp: '2024-03-21 14:32:15',
    level: 'ERROR',
    service: 'Payment Service',
    message: 'Payment gateway timeout (User: user_1247)',
    stackTrace: 'PaymentGatewayException: Connection timeout after 30s\n  at PaymentService.processPayment()\n  at PaymentController.handlePayment()',
  },
  {
    id: 'APP-002',
    timestamp: '2024-03-21 14:31:58',
    level: 'WARN',
    service: 'Server Monitor',
    message: 'High server load detected (CPU: 85%)',
  },
  {
    id: 'APP-003',
    timestamp: '2024-03-21 14:31:42',
    level: 'INFO',
    service: 'Auth Service',
    message: 'User login successful (IP: 192.168.1.100)',
  },
  {
    id: 'APP-004',
    timestamp: '2024-03-21 14:31:25',
    level: 'INFO',
    service: 'Booking Service',
    message: 'Booking created successfully (Booking ID: BK_2024_5847)',
  },
  {
    id: 'APP-005',
    timestamp: '2024-03-21 14:31:08',
    level: 'ERROR',
    service: 'Database Service',
    message: 'Database connection failed (Retry attempt 2)',
    stackTrace: 'SQLException: Connection refused\n  at DatabasePool.getConnection()\n  at QueryExecutor.execute()',
  },
  {
    id: 'APP-006',
    timestamp: '2024-03-21 14:30:55',
    level: 'INFO',
    service: 'Route Service',
    message: 'Route data synchronized',
  },
  {
    id: 'APP-007',
    timestamp: '2024-03-21 14:30:30',
    level: 'DEBUG',
    service: 'Cache Service',
    message: 'Cache invalidated for route schedules',
  },
  {
    id: 'APP-008',
    timestamp: '2024-03-21 14:30:15',
    level: 'WARN',
    service: 'Notification Service',
    message: 'Push notification delivery delayed for 150 users',
  },
];

// Log stats
export interface LogStats {
  totalUserActivities: number;
  successfulActions: number;
  failedActions: number;
  uniqueUsers: number;
  errorLogs: number;
  warningLogs: number;
  infoLogs: number;
  criticalSecurityEvents: number;
}

function calculateLogStats(): LogStats {
  return {
    totalUserActivities: mockUserActivityLogs.length,
    successfulActions: mockUserActivityLogs.filter(l => l.status === 'success').length,
    failedActions: mockUserActivityLogs.filter(l => l.status === 'error').length,
    uniqueUsers: new Set(mockUserActivityLogs.map(l => l.userId)).size,
    errorLogs: mockApplicationLogs.filter(l => l.level === 'ERROR').length,
    warningLogs: mockApplicationLogs.filter(l => l.level === 'WARN').length,
    infoLogs: mockApplicationLogs.filter(l => l.level === 'INFO').length,
    criticalSecurityEvents: mockSecurityLogs.filter(l => l.severity === 'critical').length,
  };
}

// API functions (to be replaced with real API calls)
export function getUserActivityLogs(limit?: number): UserActivityLog[] {
  // TODO: Replace with API call
  // return await api.get('/admin/logs/user-activity', { params: { limit } });
  return limit ? mockUserActivityLogs.slice(0, limit) : mockUserActivityLogs;
}

export function getSecurityLogs(limit?: number): SecurityLog[] {
  // TODO: Replace with API call
  // return await api.get('/admin/logs/security', { params: { limit } });
  return limit ? mockSecurityLogs.slice(0, limit) : mockSecurityLogs;
}

export function getApplicationLogs(limit?: number): ApplicationLog[] {
  // TODO: Replace with API call
  // return await api.get('/admin/logs/application', { params: { limit } });
  return limit ? mockApplicationLogs.slice(0, limit) : mockApplicationLogs;
}

export function getLogStats(): LogStats {
  // TODO: Replace with API call
  // return await api.get('/admin/logs/stats');
  return calculateLogStats();
}

export function filterUserActivityLogs(filters: {
  userType?: string;
  action?: string;
  status?: string;
  search?: string;
}): UserActivityLog[] {
  let filtered = [...mockUserActivityLogs];
  
  if (filters.userType && filters.userType !== 'all') {
    filtered = filtered.filter(l => l.userType === filters.userType);
  }
  if (filters.action && filters.action !== 'all') {
    filtered = filtered.filter(l => l.action === filters.action);
  }
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(l => l.status === filters.status);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(l => 
      l.userName.toLowerCase().includes(search) ||
      l.details.toLowerCase().includes(search)
    );
  }
  
  return filtered;
}

export function filterSecurityLogs(filters: {
  eventType?: string;
  severity?: string;
  search?: string;
}): SecurityLog[] {
  let filtered = [...mockSecurityLogs];
  
  if (filters.eventType && filters.eventType !== 'all') {
    filtered = filtered.filter(l => l.eventType === filters.eventType);
  }
  if (filters.severity && filters.severity !== 'all') {
    filtered = filtered.filter(l => l.severity === filters.severity);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(l => 
      l.details.toLowerCase().includes(search) ||
      (l.userName?.toLowerCase().includes(search))
    );
  }
  
  return filtered;
}

export function filterApplicationLogs(filters: {
  level?: string;
  service?: string;
  search?: string;
}): ApplicationLog[] {
  let filtered = [...mockApplicationLogs];
  
  if (filters.level && filters.level !== 'all') {
    filtered = filtered.filter(l => l.level === filters.level);
  }
  if (filters.service && filters.service !== 'all') {
    filtered = filtered.filter(l => l.service === filters.service);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(l => l.message.toLowerCase().includes(search));
  }
  
  return filtered;
}

export async function exportLogs(type: 'user-activity' | 'security' | 'application', format: 'csv' | 'json'): Promise<string> {
  // TODO: Replace with API call
  // return await api.get(`/admin/logs/${type}/export`, { params: { format } });
  console.log(`Exporting ${type} logs as ${format}`);
  return 'export_link_placeholder';
}

// Export mock data for direct access if needed
export const mockData = {
  userActivityLogs: mockUserActivityLogs,
  securityLogs: mockSecurityLogs,
  applicationLogs: mockApplicationLogs,
};
