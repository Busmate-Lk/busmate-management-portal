/**
 * Centralized API Proxy Route
 * 
 * This catch-all route proxies all API requests to backend services,
 * automatically attaching the Asgardeo access token from the server-side session.
 * 
 * Usage:
 * - /api/proxy/user-management/* → http://54.91.217.117:8081/*
 * - /api/proxy/route-management/* → http://18.140.161.237:8080/*
 * - /api/proxy/notification-management/* → http://13.51.177.104:8080/*
 * - /api/proxy/ticketing-management/* → (configure URL)
 * - /api/proxy/location-tracking/* → (configure URL)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
 * Get access token from the Asgardeo session cookie
 */
async function getAccessTokenFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ASGARDEO_SESSION_COOKIE);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const payload = decodeJwtPayload<{ accessToken: string; exp: number }>(sessionCookie.value);
    
    if (!payload) {
      return null;
    }

    // Check if session is expired
    const now = Date.now() / 1000;
    if (payload.exp < now) {
      console.log('[Proxy] Session expired');
      return null;
    }

    return payload.accessToken || null;
  } catch (error) {
    console.error('[Proxy] Failed to get access token from cookie:', error);
    return null;
  }
}

/**
 * Backend service URL mapping
 * Configure these via environment variables in production
 */
const SERVICE_URLS: Record<string, string> = {
  'user-management': process.env.USER_MANAGEMENT_API_URL || 'http://54.91.217.117:8081',
  'route-management': process.env.ROUTE_MANAGEMENT_API_URL || 'http://18.140.161.237:8080',
  'notification-management': process.env.NOTIFICATION_MANAGEMENT_API_URL || 'http://13.51.177.104:8080',
  'ticketing-management': process.env.TICKETING_MANAGEMENT_API_URL || 'http://localhost:8082',
  'location-tracking': process.env.LOCATION_TRACKING_API_URL || 'http://localhost:8083',
};

/**
 * Handle all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 */
async function handleRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path: pathParts } = await params;
  
  if (!pathParts || pathParts.length === 0) {
    return NextResponse.json(
      { error: 'Invalid proxy path' },
      { status: 400 }
    );
  }

  // Extract service name and remaining path
  const [serviceName, ...remainingPath] = pathParts;
  const serviceUrl = SERVICE_URLS[serviceName];

  if (!serviceUrl) {
    return NextResponse.json(
      { error: `Unknown service: ${serviceName}` },
      { status: 404 }
    );
  }

  // Build the target URL
  const targetPath = remainingPath.join('/');
  const targetUrl = new URL(targetPath, serviceUrl);
  
  // Preserve query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  try {
    // Get the access token from the session cookie
    const accessToken = await getAccessTokenFromCookie();
    
    if (!accessToken) {
      console.log('[Proxy] No access token, proceeding without auth');
    }

    // Prepare headers for the backend request
    const headers = new Headers();
    
    // Forward relevant headers from the original request
    const forwardHeaders = [
      'content-type',
      'accept',
      'accept-language',
      'user-agent',
      'x-request-id',
      'x-correlation-id',
    ];
    
    forwardHeaders.forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    });

    // Attach the access token if available
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Prepare the request body for non-GET requests
    let body: BodyInit | null = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        body = await request.text();
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.blob();
      }
    }

    // Make the request to the backend service
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
      // Don't follow redirects, let the client handle them
      redirect: 'manual',
    });

    // Forward the response back to the client
    const responseHeaders = new Headers();
    
    // Forward relevant response headers
    const responseForwardHeaders = [
      'content-type',
      'content-length',
      'cache-control',
      'etag',
      'last-modified',
      'x-request-id',
      'x-correlation-id',
    ];
    
    responseForwardHeaders.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
        headers: responseHeaders,
      });
    }
    
    // For non-JSON responses, stream the response
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy error for ${serviceName}:`, error);
    
    return NextResponse.json(
      { 
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params);
}
