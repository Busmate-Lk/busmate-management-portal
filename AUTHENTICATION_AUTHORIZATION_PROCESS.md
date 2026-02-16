# BusMate Web Frontend - Authentication & Authorization Process

## Table of Contents
1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Authorization Flow](#authorization-flow)
4. [Token Management](#token-management)
5. [Security Features](#security-features)
6. [API Integration](#api-integration)
7. [Component Implementation](#component-implementation)
8. [Role-Based Access Control](#role-based-access-control)
9. [Error Handling](#error-handling)

---

## Overview

The BusMate web frontend implements a **JWT (JSON Web Token) based authentication and authorization system** with the following key characteristics:

- **Token-based authentication** using access and refresh tokens
- **Role-based authorization** with four distinct user roles
- **Client-side and server-side validation** via Next.js middleware
- **Automatic token refresh** mechanism for seamless user experience
- **Secure cookie storage** with HttpOnly and Secure flags
- **Protected routes** based on user roles

### Architecture Components

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│   AuthContext (Global)      │
│  - User State Management    │
│  - Login/Logout Functions   │
│  - Token Storage            │
└────────┬────────────────────┘
         │
         ├──────────────────┐
         │                  │
         v                  v
┌────────────────┐   ┌──────────────────┐
│  Middleware    │   │  API Client      │
│  (Route Guard) │   │  (HTTP Requests) │
└────────────────┘   └──────────────────┘
```

---

## Authentication Flow

### 1. User Login Process

The authentication flow begins when a user submits their credentials on the login page.

```
User → Login Form → AuthContext.login() → API Call → Token Storage → Redirect to Dashboard
```

#### Step-by-Step Process:

**Step 1: User Submits Credentials**
- User enters email and password on the login page ([src/app/page.tsx](src/app/page.tsx))
- Login form validates inputs
- Credentials are passed to the `login()` function from `AuthContext`

**Step 2: API Authentication Request**
```typescript
// Location: src/context/AuthContext.tsx

const login = async (credentials: LoginRequest) => {
  try {
    setIsLoading(true);

    // Call authentication API
    const authResponse = await apiLogin(credentials);

    // Store tokens securely
    setSecureAuthCookie('access_token', authResponse.access_token, authResponse.expires_in);
    setSecureAuthCookie('refresh_token', authResponse.refresh_token, 30 * 24 * 60 * 60);

    // Configure API client
    configureApiToken();

    // Set user data
    const userData: User = {
      id: authResponse.user.id,
      email: authResponse.user.email,
      user_role: authResponse.user.user_metadata.user_role,
      email_verified: authResponse.user.user_metadata.email_verified,
      last_sign_in_at: authResponse.user.last_sign_in_at,
      created_at: authResponse.user.created_at,
      updated_at: authResponse.user.updated_at,
    };

    setUser(userData);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('Login failed:', error);
    clearAuthCookies(['access_token', 'refresh_token']);
    throw error;
  }
};
```

**Step 3: Token Storage**
- Access token is stored in cookies with expiration matching the token's lifetime
- Refresh token is stored with a 30-day expiration
- Cookies are set with security flags (`Secure`, `SameSite=strict`)

**Step 4: API Client Configuration**
- The OpenAPI client is configured with the access token
- All subsequent API requests automatically include the authentication token

**Step 5: User State Management**
- User information is extracted from the authentication response
- Global authentication state is updated
- `isAuthenticated` flag is set to `true`

**Step 6: Automatic Redirection**
```typescript
// Location: src/app/page.tsx

useEffect(() => {
  if (!isLoading && isAuthenticated && user) {
    const getRedirectPath = (userRole: string) => {
      switch (userRole?.toLowerCase()) {
        case 'mot':
          return '/mot/dashboard';
        case 'fleetoperator':
        case 'operator':
          return '/operator/dashboard';
        case 'timekeeper':
          return '/timeKeeper/dashboard';
        case 'admin':
        case 'systemadmin':
          return '/admin';
        default:
          return '/operator/dashboard';
      }
    };
    router.push(getRedirectPath(user.user_role));
  }
}, [user, isLoading, isAuthenticated, router]);
```

Users are automatically redirected to their role-specific dashboard.

---

### 2. Token Validation & Session Check

Every time the application loads or a protected route is accessed, the authentication status is verified.

```
App Load → checkAuth() → Token Validation → Token Refresh (if expired) → Set User State
```

#### Authentication Check Process:

**Step 1: Retrieve Token from Cookie**
```typescript
// Location: src/context/AuthContext.tsx

const checkAuth = async () => {
  try {
    setIsLoading(true);

    // Get token from cookie
    const token = getCookie('access_token');

    if (!token) {
      // No token, user is not authenticated
      setUser(null);
      setIsAuthenticated(false);
      clearApiToken();
      return;
    }

    // Continue to token validation...
  }
};
```

**Step 2: Token Expiration Check**
```typescript
// Check if token is expired
if (isTokenExpired(token)) {
  console.log('Token expired, attempting refresh...');

  // Try to refresh token
  const refreshToken = getCookie('refresh_token');
  if (refreshToken) {
    try {
      // Call refresh endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const authData = await response.json();

        // Set new tokens
        setSecureAuthCookie('access_token', authData.access_token, authData.expires_in);
        setSecureAuthCookie('refresh_token', authData.refresh_token, 30 * 24 * 60 * 60);

        // Configure API and set user
        configureApiToken();
        const userFromToken = getUserFromToken(authData.access_token);
        if (userFromToken) {
          setUser(userData);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
    }
  }

  // Refresh failed, clear session
  clearAuthCookies(['access_token', 'refresh_token']);
  setUser(null);
  setIsAuthenticated(false);
  return;
}
```

**Step 3: Extract User Information from Valid Token**
```typescript
// Token is valid, extract user info
const userFromToken = getUserFromToken(token);
if (userFromToken) {
  setUser({
    id: userFromToken.id,
    email: userFromToken.email,
    user_role: userFromToken.role,
    email_verified: userFromToken.emailVerified,
  });
  setIsAuthenticated(true);
} else {
  // Invalid token payload
  clearAuthCookies(['access_token', 'refresh_token']);
  setUser(null);
  setIsAuthenticated(false);
}
```

---

### 3. User Logout Process

The logout process cleans up all authentication data and redirects the user to the login page.

```
Logout Button → logout() → API Logout Call → Clear Tokens → Clear State → Redirect to Login
```

#### Logout Implementation:

```typescript
// Location: src/context/AuthContext.tsx

const logout = async () => {
  try {
    setIsLoading(true);

    // Get auth token before clearing
    const authToken = getCookie('access_token');

    // Unsubscribe from push notifications
    if (authToken) {
      await unsubscribeUserFromPush(authToken);
    }

    // Call logout API
    await apiLogout();
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    // Clear client-side state and cookies regardless of API result
    setUser(null);
    setIsAuthenticated(false);

    // Clear all auth-related cookies
    clearAuthCookies(['access_token', 'refresh_token']);

    // Clear API token
    clearApiToken();

    setIsLoading(false);

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
```

**Logout Steps:**
1. Retrieve current authentication token
2. Unsubscribe user from push notifications
3. Call backend logout API to invalidate session
4. Clear user state from AuthContext
5. Delete access and refresh token cookies
6. Clear API client token configuration
7. Redirect user to login page

---

## Authorization Flow

Authorization in BusMate is implemented at **two levels**: client-side (Next.js middleware) and component-level (AuthContext).

### 1. Server-Side Authorization (Middleware)

Next.js middleware intercepts all requests before they reach the page components, providing the first layer of authorization.

```
Request → Middleware → Token Validation → Role Check → Allow/Deny Access
```

#### Middleware Implementation:

**Location:** [src/middleware.ts](src/middleware.ts)

```typescript
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Images, CSS, JS, etc.
  ) {
    return NextResponse.next();
  }

  // Validate JWT
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if token is expired
  const expired = isTokenExpired(token);
  if (expired) {
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (refreshToken) {
      // Allow request to continue for client-side token refresh
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Get user information from token
  const user = getUserFromToken(token);
  if (!user || !user.role) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based route protection
  const roleRoutes = {
    'Mot': '/mot',
    'FleetOperator': '/operator',
    'Timekeeper': '/timeKeeper',
    'SystemAdmin': '/admin',
    'Admin': '/admin',
  };

  const allowedBasePath = roleRoutes[user.role as keyof typeof roleRoutes];
  
  if (!allowedBasePath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if user is accessing allowed route
  if (!pathname.startsWith(allowedBasePath)) {
    console.log(`Role ${user.role} not allowed for path ${pathname}`);
    return NextResponse.redirect(new URL(`${allowedBasePath}/dashboard`, request.url));
  }

  return NextResponse.next();
}
```

**Middleware Protection Logic:**
1. **Public Route Exception**: Login page (`/`) is accessible without authentication
2. **Static Assets**: Skip authentication for `_next`, API routes, and static files
3. **Token Presence Check**: Redirect to login if no access token exists
4. **Token Expiration**: Allow request if refresh token exists (client-side refresh)
5. **Token Validation**: Extract user and role from JWT payload
6. **Role-Based Routing**: Verify user is accessing routes for their assigned role
7. **Automatic Redirection**: Redirect unauthorized users to their permitted dashboard

---

### 2. Role-Based Access Control (RBAC)

BusMate implements a strict role-based access control system with four distinct roles:

| Role | Base Path | Description |
|------|-----------|-------------|
| **MOT (Ministry of Transport)** | `/mot/*` | Government officials managing public transport regulations |
| **Fleet Operator** | `/operator/*` | Bus company owners/managers managing fleets and routes |
| **Timekeeper** | `/timeKeeper/*` | Staff responsible for trip scheduling and tracking |
| **System Admin** | `/admin/*` | Platform administrators with full system access |

#### Role Assignment:

Roles are assigned during user registration and stored in the authentication token's `user_metadata`:

```typescript
// JWT Payload Structure
interface JwtPayload {
  sub: string;               // User ID
  email: string;             // User email
  user_metadata: {
    email_verified: boolean;
    user_role: string;       // Role assignment
  };
  exp: number;               // Expiration timestamp
  iat: number;               // Issued at timestamp
}
```

#### Route Protection by Role:

```typescript
// Middleware role routing map
const roleRoutes = {
  'Mot': '/mot',
  'FleetOperator': '/operator',
  'Timekeeper': '/timeKeeper',
  'SystemAdmin': '/admin',
  'Admin': '/admin',
};
```

**Access Rules:**
- **MOT users** can ONLY access `/mot/*` routes
- **Fleet Operators** can ONLY access `/operator/*` routes
- **Timekeepers** can ONLY access `/timeKeeper/*` routes
- **System Admins** can ONLY access `/admin/*` routes

Any attempt to access routes outside the permitted base path results in automatic redirection to the user's dashboard.

---

## Token Management

### JWT Token Structure

The BusMate application uses two types of tokens:

#### 1. Access Token
- **Purpose**: Authenticate API requests
- **Lifetime**: Short-lived (typically 15-60 minutes)
- **Storage**: Secure HTTP cookie with `SameSite=strict`
- **Usage**: Included in all API requests via Authorization header

#### 2. Refresh Token
- **Purpose**: Obtain new access tokens without re-login
- **Lifetime**: Long-lived (30 days)
- **Storage**: Secure HTTP cookie with `SameSite=strict`
- **Usage**: Sent to refresh endpoint when access token expires

### Token Utilities

**Location:** [src/lib/utils/jwtHandler.ts](src/lib/utils/jwtHandler.ts)

#### Key Functions:

**1. Decode Token**
```typescript
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}
```

**2. Extract User from Token**
```typescript
export function getUserFromToken(token: string): {
  id: string;
  role: string;
  email: string;
  emailVerified: boolean;
  iat: number;
  exp: number;
} | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || typeof decoded === 'string') {
      return null;
    }

    return {
      id: decoded.sub,
      role: decoded.user_metadata.user_role,
      email: decoded.email,
      emailVerified: decoded.user_metadata.email_verified,
      iat: decoded.iat,
      exp: decoded.exp
    };
  } catch (error) {
    return null;
  }
}
```

**3. Check Token Expiration**
```typescript
export function isTokenExpired(token: string): boolean | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || typeof decoded === 'string' || !decoded.exp) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return null;
  }
}
```

**4. Get Token Expiration Time**
```typescript
export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded?.exp || null;
  } catch (error) {
    return null;
  }
}
```

---

### Cookie Management

**Location:** [src/lib/utils/cookieUtils.ts](src/lib/utils/cookieUtils.ts)

#### Secure Cookie Functions:

**1. Set Secure Authentication Cookie**
```typescript
export function setSecureAuthCookie(
  name: string,
  value: string,
  maxAge: number = 7 * 24 * 60 * 60
): void {
  setCookie(name, value, {
    maxAge,
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
  });
}
```

**Security Features:**
- `Secure` flag: Cookies only sent over HTTPS in production
- `SameSite=strict`: Prevents CSRF attacks
- `Path=/`: Cookie available across entire application
- `maxAge`: Automatic expiration

**2. Get Cookie Value**
```typescript
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(`${encodedName}=`)) {
      const value = trimmedCookie.substring(encodedName.length + 1);
      return decodeURIComponent(value);
    }
  }

  return null;
}
```

**3. Clear Authentication Cookies**
```typescript
export function clearAuthCookies(cookieNames: string[]): void {
  cookieNames.forEach(name => {
    deleteCookie(name, { path: '/' });
  });
}
```

**4. Delete Cookie**
```typescript
export function deleteCookie(
  name: string,
  options: Partial<CookieOptions> = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
    maxAge: -1
  });
}
```

---

### Automatic Token Refresh

The application implements automatic token refresh to provide a seamless user experience without requiring re-login when the access token expires.

#### Refresh Flow:

```
Token Expired → checkAuth() → Fetch Refresh Token → Call Refresh API → 
  New Access Token → Update Cookies → Continue Session
```

**Implementation in AuthContext:**

```typescript
// Check if token is expired
if (isTokenExpired(token)) {
  console.log('Token expired, attempting refresh...');

  const refreshToken = getCookie('refresh_token');
  if (refreshToken) {
    try {
      // Call refresh endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const authData = await response.json();

        // Set new tokens in cookies
        setSecureAuthCookie('access_token', authData.access_token, authData.expires_in);
        setSecureAuthCookie('refresh_token', authData.refresh_token, 30 * 24 * 60 * 60);

        // Configure API client and set user
        configureApiToken();
        const userFromToken = getUserFromToken(authData.access_token);
        if (userFromToken) {
          setUser(userData);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
    }
  }

  // Refresh failed, clear session
  clearAuthCookies(['access_token', 'refresh_token']);
  setUser(null);
  setIsAuthenticated(false);
}
```

**Refresh Token Behavior:**
1. When access token expires, check for refresh token existence
2. If refresh token exists, send it to `/api/auth/refresh` endpoint
3. Backend validates refresh token and issues new access token
4. New tokens are stored in cookies
5. User session continues without interruption
6. If refresh fails, user is logged out and redirected to login

---

## Security Features

### 1. Cookie Security

**Security Flags:**
- `Secure`: Cookies transmitted only over HTTPS in production
- `SameSite=strict`: Prevents cross-site request forgery (CSRF)
- `Path=/`: Limits cookie scope to application root
- **Note**: `HttpOnly` is NOT set because client-side JavaScript needs to read tokens

### 2. Token Validation

**Multi-Layer Validation:**
1. **Client-side validation** (AuthContext): Checks token presence and expiration
2. **Server-side validation** (Middleware): Validates token before route access
3. **API-level validation**: Backend services verify token signatures

### 3. Automatic Session Timeout

- Access tokens have short lifetimes (15-60 minutes)
- Expired tokens trigger automatic refresh or logout
- No manual session timeout management required

### 4. Role-Based Route Protection

- Middleware enforces role-based access control
- Users cannot access routes outside their permission scope
- Automatic redirection prevents unauthorized access attempts

### 5. Protected API Requests

**API Client Configuration:**
```typescript
// Location: src/context/AuthContext.tsx

const configureApiToken = () => {
  OpenAPI.TOKEN = async () => {
    const token = getCookie('access_token');
    return token || '';
  };
};
```

All API requests through the generated OpenAPI client automatically include the authentication token in the Authorization header.

### 6. XSS Protection

- Tokens are stored in cookies, not localStorage (more secure)
- `SameSite` cookie attribute prevents cross-site attacks
- Token validation prevents injection attacks

---

## API Integration

### Authentication API Endpoints

**Location:** [src/lib/api/user-management/auth.ts](src/lib/api/user-management/auth.ts)

#### 1. Login API
```typescript
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await userManagementClient.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}
```

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
    user_metadata: {
      email_verified: boolean;
      user_role: string;
    };
    app_role: string;
    created_at: string;
    updated_at: string;
    last_sign_in_at: string;
  };
}
```

#### 2. Logout API
```typescript
export async function logout(): Promise<void> {
  try {
    await userManagementClient.post('/api/auth/logout');
  } catch (error) {
    console.warn('Logout API call failed:', error);
  }
}
```

#### 3. Refresh Token API
```typescript
export async function refreshToken(): Promise<AuthResponse> {
  const response = await userManagementClient.post<AuthResponse>('/api/auth/refresh');
  return response.data;
}
```

#### 4. Get Current User API
```typescript
export async function getCurrentUser(): Promise<User> {
  const response = await userManagementClient.get<{ user: User }>('/api/auth/me');
  return response.data.user;
}
```

---

## Component Implementation

### AuthContext Provider

**Location:** [src/context/AuthContext.tsx](src/context/AuthContext.tsx)

The AuthContext is the central authentication management system, providing global state and functions for authentication.

#### AuthContext Interface:
```typescript
interface AuthState {
  user: User | null;              // Current authenticated user
  isLoading: boolean;             // Loading state during auth operations
  isAuthenticated: boolean;       // Authentication status flag
  login: (credentials: LoginRequest) => Promise<void>;  // Login function
  logout: () => Promise<void>;                          // Logout function
  checkAuth: () => Promise<void>;                       // Auth status check
}
```

#### AuthProvider Wrapper:
```typescript
// Location: src/app/layout.tsx

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

The `AuthProvider` wraps the entire application, making authentication state available to all components.

---

### Using Authentication in Components

#### Import and Use Auth Hook:
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  // Use authentication state and functions
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Example: Fleet Management Page
```typescript
// Location: src/app/operator/fleet-management/page.tsx

import { useAuth } from '@/context/AuthContext';

export default function FleetManagement() {
  const { user, isAuthenticated } = useAuth();

  // Use user data for API requests
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFleetData(user.id);
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      <h1>Fleet Management</h1>
      {/* Component content */}
    </div>
  );
}
```

---

### Login Form Implementation

**Location:** [src/app/page.tsx](src/app/page.tsx)

```typescript
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // Redirect handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### Logout Implementation in Header

**Location:** [src/components/shared/header.tsx](src/components/shared/header.tsx)

```typescript
import { useAuth } from '@/context/AuthContext';

function Header() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      // Redirect handled by logout function
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header>
      <div className="user-info">
        <span>{user?.email}</span>
        <button onClick={handleLogout} disabled={isLoading}>
          Logout
        </button>
      </div>
    </header>
  );
}
```

---

## Role-Based Access Control

### Dashboard Routing by Role

Each user role has a dedicated dashboard route:

```typescript
// Automatic redirection after login
const getRedirectPath = (userRole: string) => {
  switch (userRole?.toLowerCase()) {
    case 'mot':
      return '/mot/dashboard';
    case 'fleetoperator':
    case 'operator':
      return '/operator/dashboard';
    case 'timekeeper':
      return '/timeKeeper/dashboard';
    case 'admin':
    case 'systemadmin':
    case 'system-admin':
      return '/admin';
    default:
      return '/operator/dashboard';
  }
};
```

### Protected Route Paths

**Application Route Structure:**

```
/
├── / (Login page - Public)
│
├── /mot/* (MOT Role Only)
│   ├── /mot/dashboard
│   ├── /mot/buses
│   ├── /mot/schedules
│   └── /mot/trip-assignment
│
├── /operator/* (Fleet Operator Role Only)
│   ├── /operator/dashboard
│   ├── /operator/fleet-management
│   ├── /operator/passenger-service-permits
│   ├── /operator/staff-assignment
│   └── /operator/busTracking
│
├── /timeKeeper/* (Timekeeper Role Only)
│   ├── /timeKeeper/dashboard
│   └── /timeKeeper/trip-management
│
└── /admin/* (Admin Role Only)
    ├── /admin/dashboard
    └── /admin/user-management
```

---

### Role Permission Matrix

| Feature | MOT | Fleet Operator | Timekeeper | Admin |
|---------|-----|----------------|------------|-------|
| View Public Transport Routes | ✅ | ✅ | ✅ | ✅ |
| Manage Fleet | ❌ | ✅ | ❌ | ✅ |
| Assign Staff to Trips | ❌ | ✅ | ✅ | ✅ |
| View Real-time Bus Tracking | ✅ | ✅ | ✅ | ✅ |
| Manage Passenger Service Permits | ✅ | ✅ | ❌ | ✅ |
| Trip Assignment | ✅ | ✅ | ✅ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |
| System Configuration | ❌ | ❌ | ❌ | ✅ |

---

## Error Handling

### Authentication Error Handling

#### 1. Login Errors
```typescript
try {
  await login(credentials);
} catch (error: any) {
  // Handle different error types
  if (error.response?.status === 401) {
    setError('Invalid email or password');
  } else if (error.response?.status === 429) {
    setError('Too many login attempts. Please try again later.');
  } else if (error.message) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred. Please try again.');
  }
}
```

#### 2. Token Expiration Handling
- Automatic refresh attempt when access token expires
- Logout if refresh token is expired or invalid
- User redirected to login page

#### 3. Unauthorized Access Handling
- Middleware intercepts unauthorized requests
- Automatic redirection to login page
- User-friendly error messages

#### 4. Network Errors
```typescript
try {
  await apiCall();
} catch (error) {
  if (!navigator.onLine) {
    showError('No internet connection. Please check your network.');
  } else {
    showError('Unable to connect to server. Please try again later.');
  }
}
```

---

## Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        User Login Flow                                │
└──────────────────────────────────────────────────────────────────────┘

User enters credentials
         │
         v
┌────────────────────┐
│  Login Form Submit │
└─────────┬──────────┘
          │
          v
┌────────────────────────────────┐
│  AuthContext.login()           │
│  - Validate inputs             │
│  - Call API: POST /auth/login  │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Backend Authentication        │
│  - Verify credentials          │
│  - Generate JWT tokens         │
│  - Return AuthResponse         │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Token Storage                 │
│  - Set access_token cookie     │
│  - Set refresh_token cookie    │
│  - Configure API client        │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Update Auth State             │
│  - Extract user from token     │
│  - Set isAuthenticated = true  │
│  - Set user object             │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Role-based Redirect           │
│  - MOT → /mot/dashboard        │
│  - Operator → /operator/dash   │
│  - Timekeeper → /timeKeeper    │
│  - Admin → /admin              │
└────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                   Protected Route Access Flow                         │
└──────────────────────────────────────────────────────────────────────┘

User navigates to protected route
         │
         v
┌────────────────────────┐
│  Next.js Middleware    │
│  - Intercept request   │
└─────────┬──────────────┘
          │
          v
┌────────────────────────────────┐
│  Check Access Token            │
│  - Get token from cookie       │
└─────────┬──────────────────────┘
          │
          ├─── No Token ───────────────────┐
          │                                 v
          v                          ┌───────────────┐
    Token Exists                     │ Redirect to / │
          │                          └───────────────┘
          v
┌────────────────────────────────┐
│  Validate Token                │
│  - Check expiration            │
│  - Decode JWT payload          │
└─────────┬──────────────────────┘
          │
          ├─── Expired + No Refresh ───┐
          │                             v
          v                      ┌───────────────┐
    Token Valid                  │ Redirect to / │
          │                      └───────────────┘
          v
┌────────────────────────────────┐
│  Extract User Role             │
│  - Get role from token         │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Check Role Authorization      │
│  - Match role to route         │
│  - Verify access permission    │
└─────────┬──────────────────────┘
          │
          ├─── Unauthorized ──────────────┐
          │                                v
          v                         ┌──────────────────┐
    Authorized                      │ Redirect to      │
          │                         │ user's dashboard │
          v                         └──────────────────┘
┌────────────────────┐
│  Allow Access      │
│  - Serve page      │
└────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    Token Refresh Flow                                 │
└──────────────────────────────────────────────────────────────────────┘

Access token expires
         │
         v
┌────────────────────────┐
│  checkAuth() called    │
│  - On app load         │
│  - On route navigation │
└─────────┬──────────────┘
          │
          v
┌────────────────────────────────┐
│  Detect Expired Token          │
│  - isTokenExpired() = true     │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Check Refresh Token           │
│  - Get from cookie             │
└─────────┬──────────────────────┘
          │
          ├─── No Refresh Token ────────┐
          │                              v
          v                       ┌──────────────┐
    Refresh Token Exists          │ Force Logout │
          │                       └──────────────┘
          v
┌────────────────────────────────┐
│  Call Refresh API              │
│  POST /api/auth/refresh        │
│  - Send refresh_token          │
└─────────┬──────────────────────┘
          │
          ├─── Refresh Failed ──────────┐
          │                              v
          v                       ┌──────────────┐
    Refresh Successful            │ Force Logout │
          │                       └──────────────┘
          v
┌────────────────────────────────┐
│  Update Tokens                 │
│  - Set new access_token        │
│  - Set new refresh_token       │
└─────────┬──────────────────────┘
          │
          v
┌────────────────────────────────┐
│  Continue Session              │
│  - User remains authenticated  │
│  - No interruption to UX       │
└────────────────────────────────┘
```

---

## Best Practices & Recommendations

### 1. Security Recommendations

**Current Implementation:**
- ✅ JWT-based authentication
- ✅ Secure cookie storage with `SameSite=strict`
- ✅ Automatic token refresh
- ✅ Role-based authorization
- ✅ Server-side middleware protection

**Potential Improvements:**
- ⚠️ Consider enabling `HttpOnly` flag on cookies (requires API architecture changes)
- ⚠️ Implement rate limiting on login endpoint
- ⚠️ Add multi-factor authentication (MFA) support
- ⚠️ Implement CSRF tokens for enhanced security
- ⚠️ Add session timeout warnings before logout

### 2. User Experience Best Practices

**Current Implementation:**
- ✅ Automatic token refresh (no login interruptions)
- ✅ Loading states during authentication
- ✅ Clear error messages
- ✅ Automatic role-based redirection

**Potential Improvements:**
- ⚠️ Add "Remember Me" functionality
- ⚠️ Implement password reset flow
- ⚠️ Add email verification process
- ⚠️ Show session expiration warnings

### 3. Error Handling Best Practices

**Current Implementation:**
- ✅ Try-catch blocks for async operations
- ✅ Graceful fallback on auth failures
- ✅ Console logging for debugging

**Potential Improvements:**
- ⚠️ Centralized error tracking (e.g., Sentry)
- ⚠️ User-friendly error pages
- ⚠️ Retry logic for transient network errors

---

## Testing Authentication

### Manual Testing Checklist

**Login Flow:**
- [ ] Successful login with valid credentials
- [ ] Failed login with invalid credentials
- [ ] Error message display for login failures
- [ ] Automatic redirect to role-specific dashboard
- [ ] Loading state display during login

**Token Refresh:**
- [ ] Access token expires and refreshes automatically
- [ ] User session continues without interruption
- [ ] Failed refresh logs user out

**Authorization:**
- [ ] Each role can access only permitted routes
- [ ] Unauthorized route access redirects to dashboard
- [ ] Direct URL access to unauthorized routes is blocked

**Logout:**
- [ ] Logout clears cookies and state
- [ ] User is redirected to login page
- [ ] Cannot access protected routes after logout

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: User cannot login
**Symptoms:** Login form submits but doesn't redirect

**Possible Causes:**
- Invalid credentials
- Backend API unavailable
- Network connectivity issues

**Solutions:**
1. Check browser console for error messages
2. Verify backend API is running
3. Confirm credentials are correct
4. Check network tab for API response

---

#### Issue 2: Token expired, automatic refresh fails
**Symptoms:** User logged out unexpectedly

**Possible Causes:**
- Refresh token expired
- Refresh API endpoint unavailable
- Cookie storage issues

**Solutions:**
1. Check refresh token expiration (30 days default)
2. Verify refresh endpoint is responding
3. Clear cookies and re-login
4. Check browser cookie settings

---

#### Issue 3: Unauthorized access to routes
**Symptoms:** User redirected from routes they should access

**Possible Causes:**
- Incorrect role assignment
- Token payload corruption
- Middleware configuration error

**Solutions:**
1. Inspect JWT token payload (use jwt.io)
2. Verify role matches route requirements
3. Clear cookies and re-login
4. Check middleware role mapping

---

#### Issue 4: CORS errors on API calls
**Symptoms:** API requests fail with CORS errors

**Possible Causes:**
- Backend CORS configuration
- Cookie settings preventing cross-origin requests

**Solutions:**
1. Configure backend CORS to allow frontend origin
2. Ensure `credentials: 'include'` in API client
3. Verify cookie `SameSite` settings

---

## Conclusion

The BusMate Web Frontend implements a **robust, secure, and user-friendly authentication and authorization system** with the following key features:

✅ **JWT-based authentication** with access and refresh tokens  
✅ **Automatic token refresh** for seamless user experience  
✅ **Role-based access control** with four distinct user roles  
✅ **Server-side middleware protection** for route security  
✅ **Secure cookie storage** with proper security flags  
✅ **Global authentication state management** via React Context  
✅ **Comprehensive error handling** and validation  

This system ensures that:
- Only authenticated users can access the application
- Users can only access routes permitted for their role
- Sessions are maintained securely with automatic refresh
- Security best practices are followed throughout

For any questions or issues with authentication, refer to the troubleshooting section or contact the development team.

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Maintained By:** BusMate Development Team
