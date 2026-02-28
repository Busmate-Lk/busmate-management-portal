/**
 * Asgardeo Auth Route Handler
 * 
 * This catch-all route handles all Asgardeo authentication flows:
 * - /api/auth/signin - Initiates sign-in flow
 * - /api/auth/callback - Handles OAuth callback
 * - /api/auth/signout - Handles sign-out
 * - /api/auth/session - Returns current session
 */

import { NextRequest, NextResponse } from 'next/server';
import { AsgardeoNext } from '@asgardeo/nextjs';
import { asgardeoConfig } from '@/lib/asgardeo/config';

// Initialize the AsgardeoNext client
const asgardeo = AsgardeoNext.getInstance();

// Initialize only once
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    await asgardeo.initialize(asgardeoConfig);
    isInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ asgardeo: string[] }> }
) {
  await ensureInitialized();
  
  const { asgardeo: pathParts } = await params;
  const action = pathParts?.[0];

  try {
    switch (action) {
      case 'signin': {
        // Initiate sign-in flow
        const user = await asgardeo.signIn();
        // If user is returned, they're already signed in
        if (user) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        // Otherwise, the SDK will handle the redirect
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      case 'callback': {
        // Handle OAuth callback
        console.log('[Auth Callback] Processing OAuth callback...');
        try {
          const user = await asgardeo.signIn();
          console.log('[Auth Callback] User from signIn:', user);
          
          if (user) {
            // User successfully authenticated, redirect to dashboard
            const role = (user as any).user_role || (user as any).groups?.[0] || 'user';
            console.log('[Auth Callback] Extracted role:', role);
            const dashboardUrl = getDashboardUrl(role);
            console.log('[Auth Callback] Redirecting to:', dashboardUrl);
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
          }
          
          console.log('[Auth Callback] No user returned, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        } catch (error) {
          console.error('[Auth Callback] Error during callback:', error);
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      case 'signout': {
        // Handle sign-out
        const signOutUrl = await asgardeo.signOut();
        return NextResponse.redirect(signOutUrl);
      }
      
      case 'session': {
        // Return current session for client components
        try {
          const isSignedIn = await asgardeo.isSignedIn();
          if (isSignedIn) {
            const user = await asgardeo.getUser();
            const accessToken = await asgardeo.getAccessToken();
            
            return NextResponse.json({
              isAuthenticated: true,
              user: {
                id: user.sub,
                email: user.email,
                name: user.name || user.email,
                role: (user as any).user_role || (user as any).groups?.[0],
              },
              // Don't expose the full access token to the client
              // Client should use the proxy routes for API calls
            });
          }
          
          return NextResponse.json({
            isAuthenticated: false,
            user: null,
          });
        } catch (error) {
          return NextResponse.json({
            isAuthenticated: false,
            user: null,
            error: 'Session check failed',
          });
        }
      }
      
      default: {
        return NextResponse.json(
          { error: 'Unknown auth action' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('Auth route error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ asgardeo: string[] }> }
) {
  await ensureInitialized();
  
  const { asgardeo: pathParts } = await params;
  const action = pathParts?.[0];

  try {
    switch (action) {
      case 'signout': {
        // Handle sign-out via POST
        const signOutUrl = await asgardeo.signOut();
        return NextResponse.json({ signOutUrl });
      }
      
      default: {
        return NextResponse.json(
          { error: 'Unknown auth action' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('Auth route error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

function getDashboardUrl(role: string): string {
  const roleRoutes: Record<string, string> = {
    'mot': '/mot/dashboard',
    'fleetoperator': '/operator/dashboard',
    'operator': '/operator/dashboard',
    'timekeeper': '/timekeeper/dashboard',
    'systemadmin': '/admin/dashboard',
    'admin': '/admin/dashboard',
  };
  
  const normalizedRole = role.toLowerCase();
  return roleRoutes[normalizedRole] || '/';
}
