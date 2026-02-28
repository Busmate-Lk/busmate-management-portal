/**
 * useSession Hook
 * 
 * A hook to access the current user's session information.
 * This is a wrapper around the Asgardeo SDK's session management
 * that provides typed access to user data including role information.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/models/user';

/**
 * Session state returned by the hook
 */
export interface SessionState {
  /** Current user data */
  user: User | null;
  /** Whether the session is being loaded */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Session ID (if available) */
  sessionId?: string;
  /** Refresh the session data */
  refresh: () => Promise<void>;
  /** Error message if session check failed */
  error?: string;
}

/**
 * Session data from the API
 */
interface SessionResponse {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified?: boolean;
  } | null;
  sessionId?: string;
  error?: string;
}

/**
 * Hook to access the current session
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useSession();
 * 
 * if (isLoading) return <Spinner />;
 * if (!isAuthenticated) return <LoginButton />;
 * 
 * return <div>Welcome, {user?.email}</div>;
 * ```
 */
export function useSession(): SessionState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  /**
   * Fetch session from the server
   */
  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }

      const data: SessionResponse = await response.json();

      if (data.isAuthenticated && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          user_role: data.user.role,
          email_verified: data.user.emailVerified,
        });
        setIsAuthenticated(true);
        setSessionId(data.sessionId);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setSessionId(undefined);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      console.error('Session fetch error:', err);
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(undefined);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh the session data
   */
  const refresh = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user,
    isLoading,
    isAuthenticated,
    sessionId,
    refresh,
    error,
  };
}

export default useSession;
