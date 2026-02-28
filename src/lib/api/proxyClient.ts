/**
 * Proxy API Client
 * 
 * This client sends all API requests through the server-side proxy route
 * which attaches the Asgardeo access token automatically.
 * 
 * No token handling is needed on the client side.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Create an API client that uses the server-side proxy
 * @param serviceName - The service name (user-management, route-management, etc.)
 */
const createProxyClient = (serviceName: string): AxiosInstance => {
  const client = axios.create({
    baseURL: `/api/proxy/${serviceName}`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for session authentication
  });

  // Handle 401 responses - redirect to login
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Session expired or invalid, redirect to login
        console.warn('[ProxyClient] Authentication required, redirecting to login');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Proxy client for User Management API
 */
export const userManagementProxyClient = createProxyClient('user-management');

/**
 * Proxy client for Route Management API
 */
export const routeManagementProxyClient = createProxyClient('route-management');

/**
 * Proxy client for Notification Management API
 */
export const notificationManagementProxyClient = createProxyClient('notification-management');

/**
 * Proxy client for Ticketing Management API
 */
export const ticketingManagementProxyClient = createProxyClient('ticketing-management');

/**
 * Proxy client for Location Tracking API
 */
export const locationTrackingProxyClient = createProxyClient('location-tracking');

/**
 * Generic function to call the proxy API
 */
export async function proxyFetch<T = any>(
  service: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api/proxy/${service}/${path.replace(/^\//, '')}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Authentication required');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export default {
  userManagement: userManagementProxyClient,
  routeManagement: routeManagementProxyClient,
  notificationManagement: notificationManagementProxyClient,
  ticketingManagement: ticketingManagementProxyClient,
  locationTracking: locationTrackingProxyClient,
  fetch: proxyFetch,
};
