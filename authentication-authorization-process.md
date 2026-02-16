# Authentication and Authorization Process in BusMate Web Frontend

## Overview

The BusMate Web Frontend application implements a comprehensive authentication and authorization system using JWT (JSON Web Tokens) for secure user access and role-based permissions. This document outlines the complete process from user login to accessing protected resources.

## Authentication Process

### 1. Initial Application Load

When a user first visits the application:

1. **AuthProvider Initialization**: The `AuthProvider` component wraps the entire application in `src/app/layout.tsx`
2. **Token Check**: The `checkAuth()` function is called on component mount
3. **Cookie Retrieval**: Access and refresh tokens are retrieved from secure HTTP-only cookies
4. **Token Validation**: JWT tokens are validated for expiration and signature

### 2. Login Process

If no valid authentication is found:

1. **Login Page Display**: User is shown the login form at the root path `/`
2. **Credential Submission**: User enters email and password
3. **API Call**: Frontend calls `/api/auth/login` endpoint with credentials
4. **Token Storage**: On successful authentication:
   - Access token stored in secure cookie (expires based on server setting)
   - Refresh token stored in secure cookie (30 days expiration)
   - User data extracted from JWT and stored in React context
5. **Role-Based Redirect**: User is redirected to their role-specific dashboard

### 3. Token Management

#### JWT Structure
The JWT access token contains:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "user_metadata": {
    "user_role": "Admin",
    "email_verified": true
  },
  "iat": 1640995200,
  "exp": 1641081600
}
```

#### Token Refresh
- Access tokens expire after a server-defined period
- When an expired token is detected, the system attempts automatic refresh
- Refresh token is sent to `/api/auth/refresh` endpoint
- New tokens are stored, and the request continues seamlessly

#### Token Storage
- **Access Token**: Stored in HTTP-only, secure, same-site cookies
- **Refresh Token**: Stored similarly with longer expiration (30 days)
- Cookies are configured with appropriate security flags for production

### 4. Logout Process

1. **Logout Initiation**: User clicks logout or session expires
2. **API Call**: Optional call to `/api/auth/logout` for server-side cleanup
3. **Client Cleanup**:
   - Clear all authentication cookies
   - Reset user state in React context
   - Clear API client tokens
   - Unsubscribe from push notifications
4. **Redirect**: User redirected to login page

## Authorization Process

### 1. Middleware Protection

Every request is protected by Next.js middleware (`src/middleware.ts`):

1. **Public Routes**: Root path `/` is always accessible
2. **Static Assets**: CSS, JS, images bypass authentication
3. **API Routes**: Backend API calls are handled separately
4. **Token Validation**: All other routes require valid JWT

### 2. Role-Based Access Control

#### User Roles
- **Mot**: Ministry of Transport users
- **FleetOperator**: Fleet management operators
- **Timekeeper**: Schedule and time management
- **SystemAdmin**: System administrators
- **Admin**: General administrators

#### Route Protection
Each role has designated base paths:
- Mot: `/mot/*`
- FleetOperator: `/operator/*`
- Timekeeper: `/timeKeeper/*`
- SystemAdmin/Admin: `/admin/*`

#### Authorization Logic
1. **Token Extraction**: JWT decoded to extract user role
2. **Role Validation**: User role must match allowed roles for the path
3. **Path Verification**: Requested path must start with role's base path
4. **Redirection**: Unauthorized access redirects to appropriate dashboard

### 3. Client-Side Authorization

#### AuthContext Usage
Components access authentication state via `useAuth()` hook:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### Protected Components
- Authentication state determines UI rendering
- Unauthorized users see loading states or redirects
- Role-specific features are conditionally rendered

### 4. API Authorization

#### Token Injection
- All API calls automatically include JWT in Authorization header
- OpenAPI client configured with token provider function
- Tokens refreshed automatically on API calls if needed

#### Backend Integration
- Frontend sends Bearer tokens with each API request
- Backend validates tokens and enforces permissions
- Failed authentication returns 401/403 status codes

## Security Features

### 1. Token Security
- HTTP-only cookies prevent XSS attacks
- Secure flag for HTTPS-only transmission
- Same-site cookies prevent CSRF
- Short-lived access tokens minimize exposure

### 2. Session Management
- Automatic token refresh maintains seamless experience
- Secure logout clears all client-side data
- Push notification unsubscription on logout

### 3. Error Handling
- Invalid tokens trigger re-authentication
- Network errors gracefully handled
- User feedback for authentication failures

## Process Flow Diagrams

### Authentication Flow
```
User Visits App
    ↓
AuthProvider.checkAuth()
    ↓
Token in Cookies?
    ├── Yes → Validate Token
    │       ├── Valid → Extract User → Set Context → Redirect to Dashboard
    │       └── Invalid/Expired → Attempt Refresh
    │               ├── Success → Continue
    │               └── Fail → Clear Cookies → Show Login
    └── No → Show Login Form
            ↓
        User Login
            ↓
        API Call (/api/auth/login)
            ├── Success → Store Tokens → Set Context → Redirect
            └── Fail → Show Error

```

### Authorization Flow
```
Incoming Request
    ↓
Middleware Check
    ↓
Public Route?
    ├── Yes → Allow
    └── No → Token Present?
            ├── No → Redirect to /
            └── Yes → Token Valid?
                    ├── No → Redirect to /
                    └── Yes → Extract Role
                            ↓
                            Role Allowed for Path?
                            ├── Yes → Allow Request
                            └── No → Redirect to Role Dashboard

```

## Key Components

### Frontend Components
- `AuthContext.tsx`: Central authentication state management
- `middleware.ts`: Route protection and role validation
- `page.tsx`: Login form and initial redirect logic
- `jwtHandler.ts`: JWT token parsing and validation
- `cookieUtils.ts`: Secure cookie management

### API Integration
- Authentication endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`
- Automatic token injection in API client
- Error handling for authentication failures

This authentication and authorization system ensures secure, role-based access to the BusMate transportation management system while providing a seamless user experience through automatic token management and intelligent redirects.</content>
<parameter name="filePath">/media/kavinda/OS/Users/kavin/Desktop/BusMate/Busmate-Web-Frontend/authentication-authorization-process.md