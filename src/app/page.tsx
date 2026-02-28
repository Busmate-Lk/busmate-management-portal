'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AsgardeoAuthContext';
import { SignInButton, SignedIn, SignedOut } from '@asgardeo/nextjs';

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[Landing Page] Auth state:', { isLoading, isAuthenticated, user: user?.email, role: user?.user_role });
    
    if (!isLoading && isAuthenticated && user) {
      console.log('[Landing Page] Redirecting to dashboard for role:', user.user_role);
      // User is already logged in, redirect to appropriate dashboard
      const getRedirectPath = (userRole: string) => {
        switch (userRole?.toLowerCase()) {
          case 'mot':
            return '/mot/dashboard';
          case 'fleetoperator':
          case 'operator':
            return '/operator/dashboard';
          case 'timekeeper':
            return '/timekeeper/dashboard';
          case 'admin':
          case 'systemadmin':
          case 'system-admin':
            return '/admin/dashboard';
          default:
            return '/operator/dashboard';
        }
      };
      router.push(getRedirectPath(user.user_role));
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-end p-4 relative overflow-hidden">
      {/* Background image with low transparency */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 "
          style={{
            backgroundImage: 'url(/images/background/landing-page-background.png)',
          }}
        ></div>

        {/* Enhanced overlay for better contrast on the right side */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-gray-900/70"></div>
      </div>

      {/* Login Form - positioned on the right with enhanced visibility */}
      <div className="relative z-10 p-8 w-full max-w-md mr-20 lg:mr-40 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-2">
          <Image
            src="/images/logo/busmate-icon-old.svg"
            alt="Busmate LK"
            width={32}
            height={32}
            className="w-35 h-20 text-white"
          />
        </div>

        {/* Welcome text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white mb-2 drop-shadow-2xl">
            Welcome to the Smart Bus Transport Management System{' '}
          </h2>
          <p className="text-white text-sm drop-shadow-lg">
            Sign in to the System Management Portal
          </p>
        </div>

        {/* Asgardeo Sign In */}
        <SignedOut>
          <LoginForm />
        </SignedOut>

        {/* Show loading state when signed in (will redirect) */}
        <SignedIn>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-sm">Redirecting to dashboard...</p>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign In Button using Asgardeo */}
      <SignInButton 
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Signing In...' : 'Sign In with Asgardeo'}
        {!isLoading && (
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </SignInButton>

      {/* Alternative: Custom sign-in button */}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Continue with Single Sign-On'}
      </button>

      {/* Help text */}
      <p className="text-center text-white/70 text-sm">
        Use your organization credentials to sign in
      </p>
    </div>
  );
}
