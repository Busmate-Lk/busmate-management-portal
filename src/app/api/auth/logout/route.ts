import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asgardeo } from '@asgardeo/nextjs/server';

export async function GET(request: NextRequest) {
  const clearSessionCookies = async () => {
    const cookieName = '__asgardeo__session';
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
  }
  
  try {
    // Try to properly terminate the Asgardeo session
    try {
      // const client = await asgardeo();
      // const sessionId = await client.getSessionId();
      // if (sessionId) {
      //   await client.signOut(sessionId);
      // }
    } catch (asgardeoError) {
      // If Asgardeo session cleanup fails, continue with cookie cleanup
      console.warn("Asgardeo session cleanup failed:", asgardeoError);
    }
    
    // Always clear the session cookie
    await clearSessionCookies();
    
    return NextResponse.json({ status: 'success', message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    
    // Even if logout fails, try to clear cookies
    try {
      await clearSessionCookies();
    } catch (cookieError) {
      console.error("Failed to clear cookies:", cookieError);
    }
    
    return NextResponse.json({ status: 'error', message: 'Logout failed' }, { status: 500 });
  }
}