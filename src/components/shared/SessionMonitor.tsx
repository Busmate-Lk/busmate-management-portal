'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SessionMonitorProps {
  checkInterval?: number; // in milliseconds, default 60000 (1 minute)
}

/**
 * Client-side session monitor that periodically checks if the user's session is still valid.
 * If the session becomes invalid, it redirects to the home page and clears the session.
 */
export function SessionMonitor({ checkInterval = 60000 }: SessionMonitorProps) {
  const router = useRouter();
  const isCheckingRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);

  useEffect(() => {
    const checkSession = async () => {
      // Prevent concurrent checks
      if (isCheckingRef.current) {
        return;
      }

      isCheckingRef.current = true;

      try {
        // Try to fetch the current page to see if we're still authenticated
        const response = await fetch(window.location.pathname, {
          method: 'HEAD',
          cache: 'no-store',
        });

        if (response.status === 401 || response.status === 403) {
          // Session expired or unauthorized
          handleSessionExpiry();
        } else if (response.ok) {
          // Session is valid, reset failure counter
          consecutiveFailuresRef.current = 0;
        } else if (response.status >= 500) {
          // Server error, increment failure counter
          consecutiveFailuresRef.current++;
          
          // After 3 consecutive server errors, assume session issue
          if (consecutiveFailuresRef.current >= 3) {
            handleSessionExpiry();
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        consecutiveFailuresRef.current++;
        
        // After 3 consecutive failures, assume session issue
        if (consecutiveFailuresRef.current >= 3) {
          handleSessionExpiry();
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    const handleSessionExpiry = () => {
      console.warn('Session expired, redirecting to login...');
      
      // Clear any local storage/session storage if needed
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error('Failed to clear session storage:', e);
      }

      // Call the logout API to clean up server-side session
      fetch('/api/auth/logout', { method: 'GET' })
        .catch((e) => console.error('Logout API call failed:', e))
        .finally(() => {
          // Redirect to home page which will show the login
          window.location.href = '/';
        });
    };

    // Check immediately on mount
    checkSession();

    // Set up periodic checking
    const intervalId = setInterval(checkSession, checkInterval);

    // Also check when the window regains focus
    const handleFocus = () => {
      checkSession();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkInterval, router]);

  // This component doesn't render anything
  return null;
}
