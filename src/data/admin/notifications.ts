// Notifications mock data for admin portal
// Replace these functions with API calls when backend is ready

import { Notification, NotificationStats } from './types';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'System Maintenance Notice',
    body: 'Scheduled maintenance on March 25, 2024 from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.',
    type: 'maintenance',
    targetAudience: 'all',
    status: 'sent',
    createdAt: '2024-03-20T10:00:00Z',
    sentAt: '2024-03-20T10:01:00Z',
    readCount: 15420,
    totalRecipients: 25000,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  },
  {
    id: 'NOT-002',
    title: 'New Fare Structure Update',
    body: 'Updated fare structure for all routes effective from April 1, 2024. Please refer to the fare management section for details.',
    type: 'info',
    targetAudience: 'passengers',
    status: 'sent',
    createdAt: '2024-03-18T14:30:00Z',
    sentAt: '2024-03-18T14:31:00Z',
    readCount: 8500,
    totalRecipients: 12500,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  },
  {
    id: 'NOT-003',
    title: 'Critical: Route Disruption Alert',
    body: 'Route BC-138 (Colombo-Kandy) is experiencing delays due to road maintenance. Please plan accordingly.',
    type: 'warning',
    targetAudience: 'all',
    status: 'sent',
    createdAt: '2024-03-19T08:00:00Z',
    sentAt: '2024-03-19T08:00:30Z',
    readCount: 22000,
    totalRecipients: 25000,
    senderId: 'MOT-002',
    senderName: 'Traffic Control',
  },
  {
    id: 'NOT-004',
    title: 'Monthly Report Available',
    body: 'Your monthly performance report for February 2024 is now available. Please check the analytics section.',
    type: 'info',
    targetAudience: 'fleet_operators',
    status: 'sent',
    createdAt: '2024-03-01T09:00:00Z',
    sentAt: '2024-03-01T09:01:00Z',
    readCount: 150,
    totalRecipients: 180,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  },
  {
    id: 'NOT-005',
    title: 'New Training Module Released',
    body: 'A new training module on customer service is now available. Please complete within the next 2 weeks.',
    type: 'info',
    targetAudience: 'conductors',
    status: 'scheduled',
    createdAt: '2024-03-20T16:00:00Z',
    scheduledFor: '2024-03-25T08:00:00Z',
    readCount: 0,
    totalRecipients: 450,
    senderId: 'ADM-001',
    senderName: 'HR Admin',
  },
  {
    id: 'NOT-006',
    title: 'Emergency: System Critical Alert',
    body: 'Payment processing system is experiencing issues. Technical team is working on resolution.',
    type: 'critical',
    targetAudience: 'all',
    status: 'sent',
    createdAt: '2024-03-21T11:00:00Z',
    sentAt: '2024-03-21T11:00:10Z',
    readCount: 18000,
    totalRecipients: 25000,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  },
  {
    id: 'NOT-007',
    title: 'Weekend Schedule Changes',
    body: 'Special weekend schedule will be in effect from March 23-24. Check your assigned routes.',
    type: 'info',
    targetAudience: 'timekeepers',
    status: 'draft',
    createdAt: '2024-03-20T15:00:00Z',
    readCount: 0,
    totalRecipients: 120,
    senderId: 'MOT-001',
    senderName: 'Schedule Manager',
  },
];

// Mock notification stats
const mockNotificationStats: NotificationStats = {
  totalSent: 145,
  totalScheduled: 12,
  totalDraft: 5,
  averageReadRate: 78.5,
};

// API functions (to be replaced with real API calls)
export function getNotifications(limit?: number): Notification[] {
  // TODO: Replace with API call
  // return await api.get('/admin/notifications', { params: { limit } });
  return limit ? mockNotifications.slice(0, limit) : mockNotifications;
}

export function getNotificationById(id: string): Notification | undefined {
  // TODO: Replace with API call
  // return await api.get(`/admin/notifications/${id}`);
  return mockNotifications.find(n => n.id === id);
}

export function getNotificationStats(): NotificationStats {
  // TODO: Replace with API call
  // return await api.get('/admin/notifications/stats');
  return mockNotificationStats;
}

export function getSentNotifications(): Notification[] {
  // TODO: Replace with API call
  return mockNotifications.filter(n => n.status === 'sent');
}

export function getScheduledNotifications(): Notification[] {
  // TODO: Replace with API call
  return mockNotifications.filter(n => n.status === 'scheduled');
}

export function getDraftNotifications(): Notification[] {
  // TODO: Replace with API call
  return mockNotifications.filter(n => n.status === 'draft');
}

export function getReceivedNotifications(): Notification[] {
  // TODO: Replace with API call
  // For admin, received notifications are those not sent by admin
  return mockNotifications.filter(n => n.senderId !== 'ADM-001');
}

export async function sendNotification(data: Partial<Notification>): Promise<Notification> {
  // TODO: Replace with API call
  // return await api.post('/admin/notifications', data);
  console.log('Sending notification:', data);
  return {
    id: `NOT-${Date.now()}`,
    title: data.title || '',
    body: data.body || '',
    type: data.type || 'info',
    targetAudience: data.targetAudience || 'all',
    status: 'sent',
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    readCount: 0,
    totalRecipients: 25000,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  };
}

export async function scheduleNotification(data: Partial<Notification>, scheduledFor: string): Promise<Notification> {
  // TODO: Replace with API call
  console.log('Scheduling notification:', data, 'for:', scheduledFor);
  return {
    ...data,
    id: `NOT-${Date.now()}`,
    status: 'scheduled',
    scheduledFor,
    createdAt: new Date().toISOString(),
    readCount: 0,
    totalRecipients: 25000,
    senderId: 'ADM-001',
    senderName: 'System Admin',
  } as Notification;
}

export async function deleteNotification(id: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.delete(`/admin/notifications/${id}`);
  console.log(`Deleting notification ${id}`);
  return true;
}

// Export mock data for direct access if needed
export const mockData = {
  notifications: mockNotifications,
  notificationStats: mockNotificationStats,
};
