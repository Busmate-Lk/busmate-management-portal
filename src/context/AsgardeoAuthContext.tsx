/**
 * Asgardeo Auth Context
 * 
 * This context provides authentication state and methods using Asgardeo.
 * It maintains the same interface as the original AuthContext for backward compatibility.
 */

'use client';

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { User } from '@/types/models/user';
import { useAsgardeo } from '@asgardeo/nextjs';
import { unsubscribeUserFromPush } from '@/lib/push/registerServiceWorker';

/**
 * Session data returned from the session endpoint
 */
interface SessionData {
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
 * Auth state interface - maintains compatibility with original AuthContext
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AsgardeoAuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AsgardeoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use Asgardeo SDK hook
  const asgardeo = useAsgardeo();

  /**
   * Fetch session data from the server-side session endpoint
   */
  const fetchSession = useCallback(async (): Promise<SessionData | null> => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      return null;
    }
  }, []);

  /**
   * Check authentication status by fetching session from server
   */
  const checkAuth = useCallback(async () => {
    try {
      console.log('[AsgardeoAuth] Checking authentication...');
      setIsLoading(true);

      // Fetch session from server
      const session = await fetchSession();
      console.log('[AsgardeoAuth] Session data:', session);

      if (session?.isAuthenticated && session.user) {
        console.log('[AsgardeoAuth] User authenticated:', session.user);
        // Map session user to User type
        const userData: User = {
          id: session.user.id,
          email: session.user.email,
          user_role: session.user.role,
          email_verified: session.user.emailVerified,
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('[AsgardeoAuth] User not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[AsgardeoAuth] Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('[AsgardeoAuth] Setting isLoading to false');
      setIsLoading(false);
    }
  }, [fetchSession]);

  /**
   * Initiate sign-in flow
   * Redirects to Asgardeo login page
   */
  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use Asgardeo SDK to sign in (redirects to Asgardeo)
      if (asgardeo?.signIn) {
        await asgardeo.signIn();
      } else {
        // Fallback to redirect
        window.location.href = '/api/auth/signin';
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, [asgardeo]);

  /**
   * Sign out the user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Unsubscribe from push notifications
      try {
        // For push notification unsubscribe, we need to call the API
        // The access token is now managed by the server, so we'll use the proxy
        await unsubscribePushNotifications();
      } catch (error) {
        console.warn('Failed to unsubscribe from push notifications:', error);
      }

      // Use Asgardeo SDK to sign out
      if (asgardeo?.signOut) {
        await asgardeo.signOut();
      } else {
        // Fallback to redirect
        window.location.href = '/api/auth/signout';
      }
    } catch (error) {
      console.warn('Logout failed:', error);
      // Clear local state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      // Redirect to login page
      window.location.href = '/';
    }
  }, [asgardeo]);

  /**
   * Unsubscribe from push notifications using the proxy
   */
  const unsubscribePushNotifications = async () => {
    try {
      // Get the push subscription
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          // Unsubscribe via the proxy (which will attach the auth token)
          await fetch('/api/proxy/notification-management/push/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
            }),
          });
          
          // Unsubscribe locally
          await subscription.unsubscribe();
        }
      }
    } catch (error) {
      console.warn('Push notification unsubscribe failed:', error);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthState = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AsgardeoAuthContext.Provider value={value}>
      {children}
    </AsgardeoAuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 * Maintains the same name as the original useAuth for backward compatibility
 */
export const useAuth = () => {
  const context = useContext(AsgardeoAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AsgardeoAuthProvider');
  }
  return context;
};

export default AsgardeoAuthContext;
