# Asgardeo Authentication Troubleshooting Guide

## Issue: Stuck on Landing Page with "Redirecting to dashboard..."

### Root Cause
The application is stuck in loading state because **Asgardeo environment variables are not configured**.

### Quick Fix

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Asgardeo variables in `.env.local`:**
   
   You need to create an application in Asgardeo Console first, then add these values:
   
   ```env
   # Required Asgardeo Configuration
   ASGARDEO_BASE_URL=https://api.asgardeo.io/t/YOUR_ORG_NAME
   ASGARDEO_CLIENT_ID=your_actual_client_id_here
   ASGARDEO_CLIENT_SECRET=your_actual_client_secret_here
   
   # Application URL (keep as localhost for development)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Restart the development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

---

## Asgardeo Application Setup

### Step 1: Create Asgardeo Application

1. Go to [Asgardeo Console](https://console.asgardeo.io/)
2. Sign in or create an account
3. Create a new **Traditional Web Application**
4. Note down the **Client ID** and **Client Secret**

### Step 2: Configure Application Settings

**Authorized redirect URLs:**
```
http://localhost:3000/api/auth/callback
http://localhost:3000/
```

**Allowed origins:**
```
http://localhost:3000
```

**Access Token configuration:**
- Type: JWT
- Include user attributes in ID token: **Enable**

### Step 3: Configure User Attributes & Claims

**Required claims in ID token:**
- `sub` (user ID)
- `email`
- `name` or `given_name`
- `user_role` or `groups` (for role-based access control)

**Setting up roles/groups:**
1. Go to **User Management** → **Groups**
2. Create groups matching your roles:
   - `Mot`
   - `FleetOperator` or `Operator`
   - `Timekeeper`
   - `SystemAdmin` or `Admin`
3. Assign users to appropriate groups

**Mapping groups to token:**
1. Go to your application settings
2. Navigate to **Attributes** or **User Attributes**
3. Add `groups` to the ID token claims
4. Or create a custom attribute `user_role` and map it

---

## Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) and check the Console tab for logs:

```
[AsgardeoAuth] Checking authentication...
[AsgardeoAuth] Session data: {...}
[Landing Page] Auth state: {...}
```

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Look for request to `/api/auth/session`
3. Check the response:
   - Should return `{ isAuthenticated: true, user: {...} }` after login
   - Should return `{ isAuthenticated: false, user: null }` when logged out

### Step 3: Check Environment Variables

Add this temporary debug endpoint to verify env vars are loaded:

**Create:** `src/app/api/debug/env/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasBaseUrl: !!process.env.ASGARDEO_BASE_URL,
    hasClientId: !!process.env.ASGARDEO_CLIENT_ID,
    hasClientSecret: !!process.env.ASGARDEO_CLIENT_SECRET,
    baseUrl: process.env.ASGARDEO_BASE_URL?.substring(0, 30) + '...', // Partial for security
  });
}
```

Visit: `http://localhost:3000/api/debug/env`

Expected response:
```json
{
  "hasBaseUrl": true,
  "hasClientId": true,
  "hasClientSecret": true,
  "baseUrl": "https://api.asgardeo.io/t/..."
}
```

### Step 4: Test Session Endpoint

Visit: `http://localhost:3000/api/auth/session`

**When logged out:**
```json
{
  "isAuthenticated": false,
  "user": null
}
```

**When logged in:**
```json
{
  "isAuthenticated": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "Operator",
    "emailVerified": true
  },
  "sessionId": "..."
}
```

---

## Common Issues & Solutions

### 1. "Redirecting to dashboard..." stuck forever

**Cause:** Environment variables not set or Asgardeo app not configured

**Solution:**
- Verify `.env.local` exists and has correct values
- Restart dev server after changing env vars
- Check Asgardeo app configuration

### 2. Redirect loop after login

**Cause:** Role not being extracted from token, or invalid role value

**Solution:**
- Check browser console for `[Session API] Extracted role: ...`
- Verify user has a group/role assigned in Asgardeo
- Check that `groups` claim is included in ID token

### 3. "Session ID not found" in logs

**Cause:** OAuth callback not completing successfully

**Solution:**
- Check callback URL in Asgardeo matches: `http://localhost:3000/api/auth/callback`
- Verify client ID and secret are correct
- Check browser console for callback errors

### 4. User redirects to `/` instead of dashboard

**Cause:** Role extraction failing or role doesn't match expected values

**Solution:**
- Check console logs for `[Auth Callback] Extracted role: ...`
- Ensure user's group name matches one of: `Mot`, `FleetOperator`, `Operator`, `Timekeeper`, `SystemAdmin`, `Admin`
- Role matching is case-sensitive

### 5. CORS errors

**Cause:** Asgardeo allowed origins not configured

**Solution:**
- Add `http://localhost:3000` to allowed origins in Asgardeo app settings
- For production, add your production domain

---

## Test Authentication Flow

### Manual Test Steps:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser to:** `http://localhost:3000`

3. **Click "Sign In with Asgardeo"** button

4. **You should be redirected to Asgardeo login page**

5. **Enter credentials and sign in**

6. **After successful login, check:**
   - Browser console logs
   - Should redirect to appropriate dashboard based on role
   - Should NOT see loading spinner

### Expected Console Output:

```
[Auth Callback] Processing OAuth callback...
[Auth Callback] User from signIn: { ... }
[Auth Callback] Extracted role: Operator
[Auth Callback] Redirecting to: /operator/dashboard
[AsgardeoAuth] Checking authentication...
[Session API] Checking session...
[Session API] Session ID: Found
[Session API] Access token: Found
[Session API] Extracted role: Operator
[AsgardeoAuth] User authenticated: { email: '...', role: 'Operator' }
[Landing Page] Auth state: { isLoading: false, isAuthenticated: true, ... }
[Landing Page] Redirecting to dashboard for role: Operator
```

---

## Need More Help?

If issues persist after following this guide:

1. **Share console logs** - Full output from browser DevTools console
2. **Share network response** - Response from `/api/auth/session` request
3. **Verify Asgardeo setup** - Double-check all configuration matches this guide
4. **Check server logs** - Look for errors in the terminal running `npm run dev`
