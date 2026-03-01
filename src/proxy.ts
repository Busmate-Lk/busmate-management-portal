import { asgardeoMiddleware, createRouteMatcher } from '@asgardeo/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/mot/**',
  '/operator/**',
  '/timekeeper/**',
  '/admin/**',
]);

export default asgardeoMiddleware(async (asgardeo, req) => {
  if (isProtectedRoute(req)) {
    try {
      const protectionResult = await asgardeo.protectRoute();
      if (protectionResult) {
        return protectionResult;
      }
    } catch (error) {
      console.error('Authentication error in middleware:', error);
      
      // Clear invalid session and redirect to home
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.delete('__asgardeo__session');
      return response;
    }
  }
});

// Apply middleware to ALL routes except internals
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};