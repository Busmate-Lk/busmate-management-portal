/**
 * Asgardeo Next.js SDK Configuration
 * 
 * This file contains the configuration for Asgardeo authentication.
 * Environment variables are used to configure the SDK securely.
 */

/**
 * Asgardeo configuration for the Next.js application
 * 
 * Required environment variables:
 * - ASGARDEO_BASE_URL: The base URL of your Asgardeo organization (e.g., https://api.asgardeo.io/t/{org_name})
 * - ASGARDEO_CLIENT_ID: The client ID of your Asgardeo application
 * - ASGARDEO_CLIENT_SECRET: The client secret of your Asgardeo application (for confidential clients)
 * 
 * Optional environment variables:
 * - NEXT_PUBLIC_APP_URL: The base URL of your application (defaults to http://localhost:3000)
 */

// Validate required environment variables
if (!process.env.ASGARDEO_BASE_URL) {
  console.error('❌ ASGARDEO_BASE_URL is not set. Please copy .env.example to .env.local and configure it.');
}
if (!process.env.ASGARDEO_CLIENT_ID) {
  console.error('❌ ASGARDEO_CLIENT_ID is not set. Please copy .env.example to .env.local and configure it.');
}
if (!process.env.ASGARDEO_CLIENT_SECRET) {
  console.error('❌ ASGARDEO_CLIENT_SECRET is not set. Please copy .env.example to .env.local and configure it.');
}

export const asgardeoConfig = {
  // Asgardeo organization base URL
  baseUrl: process.env.ASGARDEO_BASE_URL,
  
  // Application credentials
  clientId: process.env.ASGARDEO_CLIENT_ID,
  clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
  
  // Redirect URLs
  afterSignInUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`,
  afterSignOutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
  
  // OAuth scopes - include necessary scopes for user profile and role
  scopes: "openid email profile groups roles internal_login internal_organization_create internal_organization_view internal_organization_update internal_organization_delete",
  
  // Sign-in URL for redirect (using Asgardeo's default sign-in page)
  signInUrl: '/api/auth/signin',
};

/**
 * Role to route mapping for role-based access control
 * Maps Asgardeo roles to their corresponding application routes
 */
export const roleRoutes: Record<string, string> = {
  'Mot': '/mot',
  'FleetOperator': '/operator',
  'Operator': '/operator',
  'Timekeeper': '/timekeeper',
  'SystemAdmin': '/admin',
  'Admin': '/admin',
};

/**
 * Get the dashboard route for a given user role
 */
export function getDashboardRoute(role: string): string {
  const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  const baseRoute = roleRoutes[normalizedRole] || roleRoutes[role];
  return baseRoute ? `${baseRoute}/dashboard` : '/';
}

/**
 * Check if a user role has access to a given path
 */
export function hasRoleAccess(role: string, path: string): boolean {
  const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  const allowedBasePath = roleRoutes[normalizedRole] || roleRoutes[role];
  
  if (!allowedBasePath) {
    return false;
  }
  
  return path.startsWith(allowedBasePath);
}

export default asgardeoConfig;
