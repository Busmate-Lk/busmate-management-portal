// Settings mock data for admin portal
// Replace these functions with API calls when backend is ready

import { SystemSettings, BackupEntry, AdminProfile } from './types';

// Mock system settings
const mockSystemSettings: SystemSettings = {
  systemName: 'BUSMATE LK Production',
  timeZone: 'Asia/Colombo',
  sessionTimeout: 60,
  passwordExpiry: 90,
  twoFactorEnabled: true,
  lockAfterFailedAttempts: true,
  rateLimitPerHour: 1000,
  apiTimeout: 30,
  apiLoggingEnabled: true,
  corsEnabled: true,
  logRetentionDays: 90,
  activityLogRetentionDays: 365,
  emailNotifications: true,
  smsAlerts: false,
  maintenanceMode: false,
};

// Mock backup history
const mockBackupHistory: BackupEntry[] = [
  {
    id: 'BKP-001',
    type: 'Full System Backup',
    date: '2024-03-21 02:00',
    size: '2.4 GB',
    status: 'Completed',
    duration: '45 min',
    location: 'AWS S3 Bucket',
  },
  {
    id: 'BKP-002',
    type: 'Database Backup',
    date: '2024-03-20 02:00',
    size: '890 MB',
    status: 'Completed',
    duration: '12 min',
    location: 'Local Storage',
  },
  {
    id: 'BKP-003',
    type: 'Configuration Backup',
    date: '2024-03-19 02:00',
    size: '45 MB',
    status: 'Failed',
    duration: '0 min',
    location: 'AWS S3 Bucket',
  },
  {
    id: 'BKP-004',
    type: 'Full System Backup',
    date: '2024-03-18 02:00',
    size: '2.3 GB',
    status: 'Completed',
    duration: '43 min',
    location: 'AWS S3 Bucket',
  },
  {
    id: 'BKP-005',
    type: 'Database Backup',
    date: '2024-03-17 02:00',
    size: '875 MB',
    status: 'Completed',
    duration: '11 min',
    location: 'Local Storage',
  },
];

// Mock admin profile
const mockAdminProfile: AdminProfile = {
  id: 'ADM-001',
  name: 'System Administrator',
  email: 'admin@busmate.lk',
  role: 'System Administrator',
  phone: '+94 11 234 5678',
  department: 'IT Operations',
  joinedDate: '2023-01-15',
  lastLogin: '2024-03-21 14:30:00',
  permissions: [
    'user_management',
    'system_settings',
    'monitoring',
    'analytics',
    'notifications',
    'backup_recovery',
    'security_logs',
  ],
};

// API functions (to be replaced with real API calls)
export function getSystemSettings(): SystemSettings {
  // TODO: Replace with API call
  // return await api.get('/admin/settings');
  return mockSystemSettings;
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  // TODO: Replace with API call
  // return await api.patch('/admin/settings', settings);
  console.log('Updating system settings:', settings);
  return { ...mockSystemSettings, ...settings };
}

export function getBackupHistory(): BackupEntry[] {
  // TODO: Replace with API call
  // return await api.get('/admin/settings/backups');
  return mockBackupHistory;
}

export async function createBackup(type: BackupEntry['type']): Promise<BackupEntry> {
  // TODO: Replace with API call
  // return await api.post('/admin/settings/backups', { type });
  console.log(`Creating ${type}`);
  return {
    id: `BKP-${Date.now()}`,
    type,
    date: new Date().toISOString(),
    size: '0 KB',
    status: 'In Progress',
    duration: '0 min',
    location: 'AWS S3 Bucket',
  };
}

export async function restoreBackup(id: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.post(`/admin/settings/backups/${id}/restore`);
  console.log(`Restoring backup ${id}`);
  return true;
}

export async function deleteBackup(id: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.delete(`/admin/settings/backups/${id}`);
  console.log(`Deleting backup ${id}`);
  return true;
}

export function getAdminProfile(): AdminProfile {
  // TODO: Replace with API call
  // return await api.get('/admin/profile');
  return mockAdminProfile;
}

export async function updateAdminProfile(data: Partial<AdminProfile>): Promise<AdminProfile> {
  // TODO: Replace with API call
  // return await api.patch('/admin/profile', data);
  console.log('Updating admin profile:', data);
  return { ...mockAdminProfile, ...data };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.post('/admin/profile/change-password', { currentPassword, newPassword });
  console.log('Changing password');
  return true;
}

export async function enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
  // TODO: Replace with API call
  // return await api.post('/admin/profile/2fa/enable');
  return {
    qrCode: 'data:image/png;base64,placeholder',
    secret: 'ABCDEFGHIJKLMNOP',
  };
}

export async function disableTwoFactor(): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.post('/admin/profile/2fa/disable');
  return true;
}

export async function setMaintenanceMode(enabled: boolean): Promise<boolean> {
  // TODO: Replace with API call
  // return await api.post('/admin/settings/maintenance', { enabled });
  console.log(`Setting maintenance mode: ${enabled}`);
  return true;
}

// Export mock data for direct access if needed
export const mockData = {
  systemSettings: mockSystemSettings,
  backupHistory: mockBackupHistory,
  adminProfile: mockAdminProfile,
};
