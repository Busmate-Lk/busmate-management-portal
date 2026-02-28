import axios from 'axios';

/**
 * API Client Configuration
 * 
 * Uses the centralized API proxy which handles authentication automatically.
 * All requests go through /api/proxy/{service}/* routes.
 * 
 * @deprecated Use the generated API clients or direct fetch with proxy URLs instead.
 * This file is kept for backward compatibility.
 */

// Base client configuration using proxy routes
const createApiClient = (proxyPath: string) => {
  const client = axios.create({
    baseURL: proxyPath,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for session-based auth
  });

  // Handle session expiry on 401 responses
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Session expired, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Create separate clients for each microservice using proxy routes
export const userManagementClient = createApiClient('/api/proxy/user-management');
export const routeManagementClient = createApiClient('/api/proxy/route-management');
export const notificationManagementClient = createApiClient('/api/proxy/notification-management');
export const ticketingManagementClient = createApiClient('/api/proxy/ticketing-management');
export const locationTrackingClient = createApiClient('/api/proxy/location-tracking');

// Keep the old export for backward compatibility (you can remove this later)
export const apiClient = userManagementClient;