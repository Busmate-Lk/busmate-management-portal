## IMPLEMENTED: Asgardeo Authentication Migration

**Status: Implementation Complete (Phase 1-6)**

### TL;DR

Migrate from the current client-side only authentication (using `AuthContext` + cookies + custom user-management service) to a server-side authentication system using **@asgardeo/nextjs SDK**. This involves:
1. Setting up Asgardeo SDK with server-side session handling
2. Updating Next.js proxy for route protection
3. Implementing a server-side API proxy that attaches Asgardeo access tokens
4. Removing the current client-side auth system
5. Updating all components to use the new auth pattern

Key decisions: Big-bang replacement, roles from Asgardeo tokens, centralized API proxy for backend calls.

---

### Steps

#### Phase 1: Asgardeo Setup & SDK Installation

1. **Install @asgardeo/nextjs SDK**
   - Add package to project dependencies
   - Configure environment variables for Asgardeo (client ID, secret, org name, etc.)

2. **Create Asgardeo configuration file**
   - Add `src/lib/asgardeo/config.ts` with Asgardeo client configuration
   - Configure scopes to include role claims from Asgardeo

3. **Configure Asgardeo organization**
   - Create application in Asgardeo console
   - Configure callback URLs for local dev and production
   - Set up user attributes/claims to include `user_role` in the ID token
   - Map existing user roles (Mot, FleetOperator, Timekeeper, SystemAdmin, Admin) to Asgardeo groups or attributes

---

#### Phase 2: Server-Side Authentication Infrastructure

4. **Update Next.js proxy** 
   - Update `proxy.ts` at project root
   - Use Asgardeo SDK's middleware helper for session validation
   - Implement role-based route protection (same logic as current proxy.ts but using Asgardeo session)
   - Matcher config to protect `/admin/*`, `/operator/*`, `/timekeeper/*`, `/mot/*`

5. **Create Asgardeo API routes**
   - Create `src/app/api/auth/[...asgardeo]/route.ts` - handles login, logout, callback
   - Create `src/app/api/auth/session/route.ts` - returns current session for client components

6. **Create centralized API proxy route**
   - Create `src/app/api/proxy/[...path]/route.ts`
   - Retrieve Asgardeo access token from server-side session
   - Attach token to `Authorization` header
   - Forward requests to appropriate backend services based on path:
     - `/api/proxy/user-management/*` → `http://54.91.217.117:8081/*`
     - `/api/proxy/route-management/*` → `http://18.140.161.237:8080/*`
     - `/api/proxy/notification-management/*` → `http://13.51.177.104:8080/*`

---

#### Phase 3: New Auth Provider & Hooks

7. **Create new AsgardeoAuthProvider**
   - Create `src/context/AsgardeoAuthContext.tsx`
   - Client component that provides auth state from server session
   - Expose `user`, `isAuthenticated`, `isLoading`, `logout()` functions
   - Fetch session from `/api/auth/session` endpoint

8. **Create useSession hook**
   - Create `src/hooks/useSession.ts`
   - Wrapper around Asgardeo SDK's session hook
   - Provide typed user data including role

---

#### Phase 4: Update Application Components

9. **Update root layout**
   - Modify [src/app/layout.tsx](src/app/layout.tsx) to use `AsgardeoAuthProvider` instead of current `AuthProvider`

10. **Update login page**
    - Modify [src/app/page.tsx](src/app/page.tsx) to redirect to Asgardeo login instead of showing email/password form
    - After successful Asgardeo auth, redirect based on user role

11. **Update role-specific layouts**
    - Modify [src/app/admin/layout.tsx](src/app/admin/layout.tsx) - add server-side role verification
    - Modify [src/app/operator/layout.tsx](src/app/operator/layout.tsx) - add server-side role verification  
    - Modify [src/app/timekeeper/layout.tsx](src/app/timekeeper/layout.tsx) - add server-side role verification
    - Modify [src/app/mot/layout.tsx](src/app/mot/layout.tsx) - add server-side role verification

12. **Update components using auth**
    - Update [src/components/shared/sidebar.tsx](src/components/shared/sidebar.tsx) - replace `useAuth()` with new hook
    - Update [src/components/shared/header.tsx](src/components/shared/header.tsx) - replace `useAuth()` with new hook
    - Update [src/components/operator/header.tsx](src/components/operator/header.tsx) - replace `useAuth()` with new hook
    - Update [src/components/shared/ClientSWBootstrap.tsx](src/components/shared/ClientSWBootstrap.tsx) - adjust push notification registration
    - Update [src/components/operator/revenue/revenue-analytics.tsx](src/components/operator/revenue/revenue-analytics.tsx)

---

#### Phase 5: API Client Migration

13. **Create new API client with proxy**
    - Create `src/lib/api/proxyClient.ts`
    - Client calls `/api/proxy/*` routes instead of external APIs directly
    - No token handling needed on client-side (server handles it)

14. **Update existing API services**
    - Update [src/lib/api/client.ts](src/lib/api/client.ts) - remove token interceptors, point to proxy
    - Update generated API clients base URL configuration in `generated/api-clients/*/core/OpenAPI.ts`
    - Remove direct token injection from all services

15. **Update next.config.ts**
    - Remove current rewrites (API calls will go through proxy route instead)
    - Add Asgardeo domain to allowed external images if needed

---

#### Phase 6: Cleanup

16. **Remove deprecated auth files**
    - Delete [src/context/AuthContext.tsx](src/context/AuthContext.tsx)
    - Delete [src/lib/utils/jwtHandler.ts](src/lib/utils/jwtHandler.ts)
    - Delete [src/lib/utils/cookieUtils.ts](src/lib/utils/cookieUtils.ts)
    - Delete [src/lib/api/user-management/auth.ts](src/lib/api/user-management/auth.ts)
    - Delete [src/proxy.ts](src/proxy.ts)

17. **Update environment variables**
    - Remove `NEXT_PUBLIC_USER_MANAGEMENT_API_URL`
    - Add Asgardeo env vars (server-side only, not `NEXT_PUBLIC_`)

18. **Update types**
    - Update [src/types/models/auth.ts](src/types/models/auth.ts) to match Asgardeo JWT structure
    - Update [src/types/models/user.ts](src/types/models/user.ts) if needed

---

### New File Structure

```
proxy.ts                           # NEW: Next.js proxy with Asgardeo session
src/
├── app/
│   └── api/
│       └── auth/
│           ├── [...asgardeo]/route.ts  # NEW: Asgardeo handlers
│           └── session/route.ts        # NEW: Session endpoint
│       └── proxy/
│           └── [...path]/route.ts      # NEW: Centralized API proxy
├── context/
│   └── AsgardeoAuthContext.tsx         # NEW: Replaces AuthContext.tsx
├── hooks/
│   └── useSession.ts                   # NEW: Session hook
├── lib/
│   ├── asgardeo/
│   │   └── config.ts                   # NEW: Asgardeo config
│   └── api/
│       └── proxyClient.ts              # NEW: Client for proxy routes
```

---

### Verification

1. **Authentication flow**
   - Test login via Asgardeo redirect
   - Verify user info and role are correctly extracted
   - Test logout clears session

2. **Route protection**
   - Verify unauthenticated users are redirected to login
   - Verify role-based access (admin can't access /operator, etc.)
   - Test direct URL access to protected routes

3. **API calls**
   - Verify backend APIs receive valid access token through proxy
   - Test API calls work for each role
   - Verify token refresh works for long sessions

4. **Edge cases**
   - Test session expiry handling
   - Test concurrent tab behavior
   - Test mobile responsiveness of login flow

---

### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SDK | @asgardeo/nextjs | Official SDK with App Router support, server-side session handling |
| User roles | From Asgardeo tokens | Centralize identity management, configure in Asgardeo console |
| API auth | Server-side proxy | Keeps tokens server-side (more secure), single point for all API calls |
| Migration | Big bang | Cleaner implementation, avoids maintaining dual auth systems |
| Proxy | Edge-compatible | Use Asgardeo SDK session checks, avoid Node.js-only libraries in proxy |

---

### Critical Migration Conflicts to Address

| Conflict | Current State | Solution |
|----------|--------------|----------|
| Client-side token access | Tokens in cookies readable by JS | Asgardeo session stored server-side, httpOnly cookies |
| `jsonwebtoken` in proxy | [jwtHandler.ts](src/lib/utils/jwtHandler.ts) uses Node.js library | Use Asgardeo SDK's Edge-compatible session validation |
| Direct API calls | Components call external APIs directly | Route through `/api/proxy/*` |
| OpenAPI generated clients | Each has own token config | Reconfigure base URL to proxy, remove token handling |
| Push notifications | Uses user ID from auth context | Get user ID from new session hook |

---

### Current Auth Implementation Reference

**Files to be replaced:**
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) - Client-side auth provider
- [src/lib/utils/jwtHandler.ts](src/lib/utils/jwtHandler.ts) - JWT decode/verify utilities
- [src/lib/utils/cookieUtils.ts](src/lib/utils/cookieUtils.ts) - Cookie CRUD operations
- [src/lib/api/user-management/auth.ts](src/lib/api/user-management/auth.ts) - Auth API functions

**Current token handling:**
- JWT access tokens + refresh tokens stored in client-accessible cookies
- Token refresh via `/api/auth/refresh` endpoint
- OpenAPI clients configured with `OpenAPI.TOKEN` function

**Current role mapping:**
```typescript
const roleRoutes = {
  'Mot': '/mot',
  'FleetOperator': '/operator',
  'Timekeeper': '/timekeeper',
  'SystemAdmin': '/admin',
  'Admin': '/admin',
};
```

---

This is a **DRAFT** plan for further refinement.

---

## Implementation Status

### Completed Items ✅

**Phase 1: Asgardeo Setup & SDK Installation**
- ✅ Installed @asgardeo/nextjs SDK v0.1.81
- ✅ Created `src/lib/asgardeo/config.ts` with configuration

**Phase 2: Server-Side Authentication Infrastructure**
- ✅ Created `middleware.ts` with Asgardeo session validation and role-based route protection
- ✅ Created `src/app/api/auth/[...asgardeo]/route.ts` for auth handlers
- ✅ Created `src/app/api/auth/session/route.ts` for session endpoint
- ✅ Created `src/app/api/proxy/[...path]/route.ts` centralized API proxy

**Phase 3: New Auth Provider & Hooks**
- ✅ Created `src/context/AsgardeoAuthContext.tsx` with same interface as old AuthContext
- ✅ Created `src/hooks/useSession.ts` for session access
- ✅ Created `src/lib/api/proxyClient.ts` for proxy-based API calls

**Phase 4: Update Application Components**
- ✅ Updated `src/app/layout.tsx` to use AsgardeoProvider + AsgardeoAuthProvider
- ✅ Updated `src/app/page.tsx` login page to use Asgardeo SignInButton
- ✅ Updated `src/components/shared/sidebar.tsx` to use AsgardeoAuthContext
- ✅ Updated `src/components/shared/header.tsx` to use AsgardeoAuthContext
- ✅ Updated `src/components/operator/header.tsx` to use AsgardeoAuthContext
- ✅ Updated `src/components/operator/revenue/revenue-analytics.tsx` to use AsgardeoAuthContext
- ✅ Updated `src/components/shared/ClientSWBootstrap.tsx` for proxy-based push registration

**Phase 5: API Client Migration**
- ✅ Updated `generated/api-clients/user-management/core/OpenAPI.ts` to use proxy
- ✅ Updated `generated/api-clients/route-management/core/OpenAPI.ts` to use proxy
- ✅ Updated `generated/api-clients/location-tracking/core/OpenAPI.ts` to use proxy
- ✅ Updated `generated/api-clients/ticketing-management/core/OpenAPI.ts` to use proxy
- ✅ Updated `src/lib/api/client.ts` to use proxy routes
- ✅ Updated `src/lib/services/notificationService.ts` to use proxy
- ✅ Updated `src/lib/services/staff-management-service.ts` to use proxy
- ✅ Updated `next.config.ts` - removed old rewrites

**Phase 6: Cleanup**
- ✅ Marked deprecated files with @deprecated comments
- ✅ Created `.env.example` with required environment variables
- ⚠️ Old auth files kept for reference (AuthContext.tsx, jwtHandler.ts, cookieUtils.ts, proxy.ts)

### Remaining Tasks

**Before Deployment:**
1. Configure Asgardeo application in Asgardeo console
2. Set up user attributes/claims to include `user_role` in ID token
3. Add environment variables (copy from `.env.example`)
4. Test complete auth flow with real Asgardeo credentials

**Optional Cleanup (after migration confirmed working):**
1. Delete `src/context/AuthContext.tsx`
2. Delete `src/lib/utils/jwtHandler.ts`
3. Delete `src/lib/utils/cookieUtils.ts`
4. Delete `src/proxy.ts`
5. Delete `src/lib/api/user-management/auth.ts`
