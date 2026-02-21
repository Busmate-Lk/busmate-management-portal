// Admin portal mock data exports
// This file provides a central export point for all admin mock data and API functions

// Type exports
export * from './types';

// Dashboard data and functions
export {
  getDashboardStats,
  getActivityFeed,
  getQuickActions,
  getUserGrowthData,
  mockData as dashboardMockData,
} from './dashboard';

// User management data and functions
export {
  getUsers,
  getUserById,
  getUserStats,
  getPassengerProfile,
  getConductorProfile,
  getFleetProfile,
  getTimekeeperProfile,
  getMOTProfile,
  updateUserStatus,
  deleteUser,
  createMOTUser,
  mockData as usersMockData,
} from './users';
export type {
  PassengerProfile,
  ConductorProfile,
  FleetProfile,
  TimekeeperProfile,
  MOTProfile,
} from './users';

// Notifications data and functions
export {
  getNotifications,
  getNotificationById,
  getNotificationStats,
  getSentNotifications,
  getScheduledNotifications,
  getDraftNotifications,
  getReceivedNotifications,
  sendNotification,
  scheduleNotification,
  deleteNotification,
  mockData as notificationsMockData,
} from './notifications';

// Monitoring data and functions
export {
  getApiEndpoints,
  getApiEndpointById,
  getMicroservices,
  getMicroserviceById,
  getResourceUsage,
  getMonitoringStats,
  restartService,
  refreshApiHealth,
  mockData as monitoringMockData,
} from './monitoring';
export type { MonitoringStats } from './monitoring';

// Logs data and functions
export {
  getUserActivityLogs,
  getSecurityLogs,
  getApplicationLogs,
  getLogStats,
  filterUserActivityLogs,
  filterSecurityLogs,
  filterApplicationLogs,
  exportLogs,
  mockData as logsMockData,
} from './logs';
export type { LogStats } from './logs';

// Analytics data and functions
export {
  getAnalyticsMetrics,
  getReports,
  getReportById,
  getUserGrowthChart,
  getRevenueChart,
  getTransactionChart,
  getUserTypeDistribution,
  getSystemStatus,
  generateReport,
  downloadReport,
  mockData as analyticsMockData,
} from './analytics';
export type { SystemStatus } from './analytics';

// Settings data and functions
export {
  getSystemSettings,
  updateSystemSettings,
  getBackupHistory,
  createBackup,
  restoreBackup,
  deleteBackup,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  enableTwoFactor,
  disableTwoFactor,
  setMaintenanceMode,
  mockData as settingsMockData,
} from './settings';
