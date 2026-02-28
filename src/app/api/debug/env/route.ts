/**
 * Debug endpoint to check if environment variables are loaded
 * This is for development/debugging only - remove in production
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    // Check if environment variables are set (boolean)
    hasBaseUrl: !!process.env.ASGARDEO_BASE_URL,
    hasClientId: !!process.env.ASGARDEO_CLIENT_ID,
    hasClientSecret: !!process.env.ASGARDEO_CLIENT_SECRET,
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    
    // Partial values for verification (don't expose full secrets)
    baseUrlPrefix: process.env.ASGARDEO_BASE_URL?.substring(0, 35) + '...',
    clientIdPrefix: process.env.ASGARDEO_CLIENT_ID?.substring(0, 10) + '...',
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    
    // Backend service URLs
    hasUserManagementUrl: !!process.env.USER_MANAGEMENT_API_URL,
    hasRouteManagementUrl: !!process.env.ROUTE_MANAGEMENT_API_URL,
    hasNotificationManagementUrl: !!process.env.NOTIFICATION_MANAGEMENT_API_URL,
  });
}
