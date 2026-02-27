import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, isTokenExpired } from '@/lib/utils/jwtHandler';

// Dummy proxy function to satisfy Next.js requirement
// export async function proxy(){}

export async function proxy(request: NextRequest) {
  console.log('Proxy triggered for:', request.nextUrl.pathname);
  
  // Get token from cookies or headers
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('Authorization')?.split(' ')[1];

  console.log('Token in proxy:', token ? 'Present' : 'Missing');
  
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Skip proxy for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // This catches image files, CSS, JS, etc.
  ) {
    return NextResponse.next();
  }

  // Validate JWT
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Check if token is expired
    const expired = isTokenExpired(token);
    if (expired === null) {
      console.log('Invalid token format');
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (expired) {
      console.log('Token expired');
      // Check if refresh token exists
      const refreshToken = request.cookies.get('refresh_token')?.value;
      if (refreshToken) {
        // Allow the request to continue so the client can handle token refresh
        console.log('Token expired but refresh token exists, allowing request to continue');
        return NextResponse.next();
      } else {
        console.log('No refresh token found, redirecting to login');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Get user information from token
    const user = getUserFromToken(token);
    
    if (!user || !user.role) {
      console.log('Invalid token payload or missing user role');
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('User role from token:', user.role);

    // Role-based route protection
    const roleRoutes = {
      'Mot': '/mot',
      'FleetOperator': '/operator',
      'Timekeeper': '/timekeeper',
      'SystemAdmin': '/admin',
      'Admin': '/admin',
    };

    const allowedBasePath = roleRoutes[user.role as keyof typeof roleRoutes];
    
    if (!allowedBasePath) {
      console.log('Unknown role:', user.role);
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (!pathname.startsWith(allowedBasePath)) {
      console.log(`Role ${user.role} not allowed for path ${pathname}, redirecting to ${allowedBasePath}/dashboard`);
      return NextResponse.redirect(new URL(`${allowedBasePath}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT processing error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|css|js|woff|woff2|ttf|eot)).*)',
  ],
};