import axios from 'axios';

// Base client configuration
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return client;
};

// Create separate clients for each microservice
export const userManagementClient = createApiClient(process.env.NEXT_PUBLIC_USER_MANAGEMENT_API_URL!);
export const routeManagementClient = createApiClient(process.env.NEXT_PUBLIC_ROUTE_MANAGEMENT_API_URL!);

// Keep the old export for backward compatibility (you can remove this later)
export const apiClient = userManagementClient;