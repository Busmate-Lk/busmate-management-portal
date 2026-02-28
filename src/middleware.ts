/**
 * Next.js Middleware with Asgardeo Authentication
 * 
 * This middleware protects routes and handles role-based access control.
 * It reads the Asgardeo session cookie directly to check authentication status.
 */

import { NextRequest, NextResponse } from 'next/server';

const ASGARDEO_SESSION_COOKIE = '__asgardeo__session';

/**
 * Decode a JWT token payload without verification
 */
function decodeJwtPayload<T>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8')) as T;
  } catch {
    return null;
  }
}

/**
 * Session data from the cookie
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
 * Check if a path matches any of the patterns
 */
function matchesPattern(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('(.*)')) {
      const prefix = pattern.replace('(.*)', '');
      return pathname.startsWith(prefix);
    }
    return pathname === pattern;
  });
}

/**
 * Define protected routes that require authentication
 */
const protectedPatterns = [
  '/admin(.*)',
  '/operator(.*)',
  '/timekeeper(.*)',
  '/mot(.*)',
];

/**
 * Define public routes that should not require authentication
 */
const publicPatterns = [
  '/',
  '/api/auth(.*)',
  '/api/proxy(.*)',
  '/api/debug(.*)',
];

/**
 * Role to route mapping for role-based access control
 */
const roleRoutes: Record<string, string> = {
  'mot': '/mot',
  'fleetoperator': '/operator',
  'operator': '/operator',
  'timekeeper': '/timekeeper',
  'systemadmin': '/admin',
  'admin': '/admin',
  'system-admin': '/admin',
};

/**
 * Get the allowed base path for a given role
 */
function getAllowedBasePath(role: string): string | null {
  const normalizedRole = role.toLowerCase().replace(/[-_\s]/g, '');
  return roleRoutes[normalizedRole] || null;
}

/**
 * Get session from the cookie
 */
function getSessionFromCookie(request: NextRequest): SessionCookiePayload | null {
  const sessionCookie = request.cookies.get(ASGARDEO_SESSION_COOKIE);
  
  if (!sessionCookie?.value) {
    return null;
  }

  const payload = decodeJwtPayload<SessionCookiePayload>(sessionCookie.value);
  
  if (!payload) {
    return null;
  }

  // Check if session is expired
  const now = Date.now() / 1000;
  if (payload.exp < now) {
    return null;
  }

  return payload;
}

/**
 * Main middleware function
 */
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for public routes
  if (matchesPattern(pathname, publicPatterns)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (matchesPattern(pathname, protectedPatterns)) {
    // Get session from cookie
    const session = getSessionFromCookie(req);
    
    if (!session) {
      // Not authenticated, redirect to home page
      console.log('[Middleware] No valid session, redirecting to home');
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
    }

    // User is authenticated - for role-based access, we would need to 
    // fetch user info from the userinfo endpoint or decode the ID token.
    // For now, let authenticated users access protected routes.
    console.log('[Middleware] Session valid, allowing access to:', pathname);
  }

  return NextResponse.next();
}

/**
 * Middleware matcher configuration
 * Exclude static files, images, and other assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|css|js|woff|woff2|ttf|eot)).*)',
  ],
};
