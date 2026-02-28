/**
 * Session API Route
 * 
 * Returns the current user's session data for client components.
 * This endpoint is used by the AsgardeoAuthProvider to get the initial
 * authentication state.
 * 
 * Note: We read the __asgardeo__session cookie directly because the SDK's
 * getSessionId() function may not work properly in all cases.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ASGARDEO_SESSION_COOKIE = '__asgardeo__session';

/**
 * Interface for the decoded session cookie payload
 */
interface SessionCookiePayload {
  accessToken: string;
  scopes: string;
  sessionId: string;
  type: string;
  sub: string;
  iat: number;
  exp: number;
}

/**
 * Decode a JWT token without verification (for reading session data)
 * The cookie is already validated by being HttpOnly and set by our server
 */
function decodeJwtPayload<T>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload) as T;
  } catch (error) {
    console.error('[Session API] Failed to decode JWT:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Session API] Checking session...');
    
    // Read the Asgardeo session cookie directly
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ASGARDEO_SESSION_COOKIE);
    
    console.log('[Session API] Session cookie:', sessionCookie ? 'Found' : 'Not found');
    
    if (!sessionCookie?.value) {
      console.log('[Session API] No session cookie, user not authenticated');
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    // Decode the session cookie JWT
    const sessionData = decodeJwtPayload<SessionCookiePayload>(sessionCookie.value);
    
    if (!sessionData) {
      console.log('[Session API] Failed to decode session cookie');
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    console.log('[Session API] Session data:', {
      sessionId: sessionData.sessionId,
      sub: sessionData.sub,
      scopes: sessionData.scopes,
      hasAccessToken: !!sessionData.accessToken,
      exp: new Date(sessionData.exp * 1000).toISOString(),
    });

    // Check if session is expired
    const now = Date.now() / 1000;
    if (sessionData.exp < now) {
      console.log('[Session API] Session expired');
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        error: 'Session expired',
      });
    }

    // Now we need to get user info. We can either:
    // 1. Call the userinfo endpoint with the access token
    // 2. Use the access token if it's a JWT and contains user claims
    
    // First, try to decode the access token if it's a JWT
    const accessToken = sessionData.accessToken;
    let userInfo: any = null;

    // Check if accessToken is a JWT (has 3 parts separated by dots)
    if (accessToken && accessToken.includes('.')) {
      const accessTokenPayload = decodeJwtPayload<any>(accessToken);
      if (accessTokenPayload) {
        console.log('[Session API] Access token payload:', JSON.stringify(accessTokenPayload, null, 2));
        userInfo = accessTokenPayload;
      }
    }

    // If access token is not a JWT (it's an opaque token), call userinfo endpoint
    if (!userInfo) {
      console.log('[Session API] Access token is opaque, calling userinfo endpoint...');
      try {
        const userinfoResponse = await fetch(
          `${process.env.ASGARDEO_BASE_URL}/oauth2/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (userinfoResponse.ok) {
          userInfo = await userinfoResponse.json();
          console.log('[Session API] Userinfo response:', JSON.stringify(userInfo, null, 2));
        } else {
          console.error('[Session API] Userinfo request failed:', userinfoResponse.status);
        }
      } catch (error) {
        console.error('[Session API] Failed to fetch userinfo:', error);
      }
    }

    // Extract user role
    const role = userInfo?.user_role || 
                 userInfo?.groups?.[0] || 
                 extractRoleFromGroups(userInfo?.groups) ||
                 'User';

    console.log('[Session API] Extracted role:', role);

    const userData = {
      isAuthenticated: true,
      user: {
        id: sessionData.sub,
        email: userInfo?.email || userInfo?.username || userInfo?.sub,
        name: userInfo?.name || userInfo?.given_name || userInfo?.email || 'User',
        role: role,
        emailVerified: userInfo?.email_verified,
      },
      sessionId: sessionData.sessionId,
    };

    console.log('[Session API] Returning user data:', JSON.stringify(userData, null, 2));
    return NextResponse.json(userData);

  } catch (error) {
    console.error('[Session API] Session check error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
      error: 'Failed to check session',
    });
  }
}

/**
 * Extract user role from groups array
 */
function extractRoleFromGroups(groups: string[] | undefined): string | undefined {
  if (!groups || groups.length === 0) {
    return undefined;
  }
  
  // Define known role groups
  const roleGroups = ['Mot', 'FleetOperator', 'Operator', 'Timekeeper', 'SystemAdmin', 'Admin'];
  
  for (const group of groups) {
    const matchedRole = roleGroups.find(
      role => group.toLowerCase() === role.toLowerCase() || group.toLowerCase().includes(role.toLowerCase())
    );
    if (matchedRole) {
      return matchedRole;
    }
  }
  
  return groups[0];
}
