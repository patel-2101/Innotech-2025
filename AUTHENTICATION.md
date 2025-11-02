# Multi-Login Authentication System

## Overview

This Smart Complaint System implements a comprehensive multi-login authentication system with different authentication methods for different user roles:

- **Citizens**: Firebase Authentication (Phone OTP or Google Sign-in)
- **Officers**: Prisma Database (Employee ID + Password)
- **Workers**: Prisma Database (Employee ID + Password)
- **Admins**: Prisma Database (Employee ID + Password)

## Folder Structure

```
app/
├── login/
│   ├── citizen/
│   │   └── page.tsx          # Firebase Phone OTP & Gmail login
│   ├── officer/
│   │   └── page.tsx          # Prisma-based Officer login
│   ├── worker/
│   │   └── page.tsx          # Prisma-based Worker login
│   └── admin/
│       └── page.tsx          # Prisma-based Admin login
├── api/
│   └── auth/
│       ├── citizen/
│       │   └── route.ts      # Citizen authentication endpoint
│       ├── officer/
│       │   └── route.ts      # Officer authentication endpoint
│       ├── worker/
│       │   └── route.ts      # Worker authentication endpoint
│       └── admin/
│           └── route.ts      # Admin authentication endpoint
├── citizen/                  # Protected citizen routes
├── officer/                  # Protected officer routes
├── worker/                   # Protected worker routes
└── admin/                    # Protected admin routes

lib/
├── firebase.ts               # Firebase initialization
├── jwt.ts                    # JWT token generation & verification
├── password.ts               # Password hashing utilities
└── prisma-mock.ts            # Mock Prisma client (dev mode)

middleware.ts                 # Route protection middleware

prisma/
└── schema.prisma             # Updated with auth fields
```

## Authentication Flow

### 1. Citizen Login (Firebase)

**Methods:**
- **Phone OTP**: User enters phone number → Receives OTP → Verifies OTP → Authenticated
- **Google Sign-in**: User clicks Google button → Google OAuth flow → Authenticated

**Flow:**
1. User selects login method (Phone/Gmail)
2. Firebase handles authentication
3. Frontend gets Firebase user + ID token
4. Backend verifies token (optional in production)
5. Backend creates/updates user in database
6. Backend generates JWT token
7. Token stored in HTTP-only cookie
8. User redirected to `/citizen` dashboard

**API Endpoint:** `POST /api/auth/citizen`

**Request Body:**
```json
{
  "firebaseUid": "string",
  "phoneNumber": "string" | null,
  "email": "string" | null,
  "displayName": "string" | null,
  "photoURL": "string" | null,
  "idToken": "string"
}
```

### 2. Officer/Worker/Admin Login (Prisma)

**Flow:**
1. User enters Employee ID and Password
2. Backend queries database by employeeId and role
3. Backend verifies password hash
4. Backend generates JWT token
5. Token stored in HTTP-only cookie
6. User redirected to respective dashboard

**API Endpoints:**
- `POST /api/auth/officer`
- `POST /api/auth/worker`
- `POST /api/auth/admin`

**Request Body:**
```json
{
  "employeeId": "string",
  "password": "string"
}
```

**Response (All endpoints):**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CITIZEN|OFFICER|WORKER|ADMIN"
  }
}
```

## JWT Token Structure

```typescript
{
  userId: string;
  role: 'CITIZEN' | 'OFFICER' | 'WORKER' | 'ADMIN';
  email?: string;
  phoneNumber?: string;
  employeeId?: string;
  iat: number;        // Issued at
  exp: number;        // Expires at (7 days)
}
```

## Route Protection (Middleware)

The `middleware.ts` file protects authenticated routes:

```typescript
Protected Routes:
- /citizen/*  → Requires CITIZEN role
- /officer/*  → Requires OFFICER role
- /worker/*   → Requires WORKER role
- /admin/*    → Requires ADMIN role
```

**How it works:**
1. Extract JWT token from cookie or Authorization header
2. Verify token signature and expiration
3. Check if user has required role
4. If valid: Allow access + inject user info in headers
5. If invalid: Redirect to appropriate login page

## Database Schema (Prisma)

### User Model

```prisma
model User {
  id            String      @id @default(cuid())
  phoneNumber   String?     @unique
  name          String?
  email         String?     @unique
  role          UserRole    @default(CITIZEN)
  
  // Firebase Authentication (Citizens only)
  firebaseUid   String?     @unique
  
  // Prisma-based Authentication (Officers, Workers, Admins)
  employeeId    String?     @unique
  password      String?     // Hashed with bcrypt
  
  photoURL      String?
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install jose bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication → Phone and Google providers
3. Get your Firebase config
4. Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=file:./prisma/dev.db
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed demo users
npx prisma db seed
```

### 4. Create Demo Users

Run the seed script or manually create users with hashed passwords:

```typescript
import { hashPassword } from './lib/password';

const hashedPassword = await hashPassword('your-password');
```

### 5. Run Development Server

```bash
npm run dev
```

## Demo Credentials

### Officer Login
- **Office ID**: `OFF12345`
- **Password**: `officer123`
- **Dashboard**: `/officer`

### Worker Login
- **Worker ID**: `WRK12345`
- **Password**: `worker123`
- **Dashboard**: `/worker`

### Admin Login
- **Admin ID**: `ADM12345`
- **Password**: `admin123`
- **Dashboard**: `/admin`

### Citizen Login
- **Method 1**: Phone OTP (requires Firebase setup)
  - Enter phone with country code: `+91 9876543210`
  - Enter OTP received via SMS
  
- **Method 2**: Google Sign-in (requires Firebase setup)
  - Click "Continue with Google"
  - Select Google account

## Security Features

### 1. Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Secure comparison using bcrypt.compare()

### 2. JWT Security
- Signed with HS256 algorithm
- 7-day expiration
- Stored in HTTP-only cookies (prevents XSS)
- Verified on every protected route

### 3. Firebase Security
- Firebase ID tokens verified (optional in production)
- User data synced with local database
- Secure OAuth flows

### 4. Middleware Protection
- All dashboard routes protected
- Role-based access control
- Automatic redirect on unauthorized access

## API Usage Examples

### Citizen Login (Phone OTP)

```typescript
// Step 1: Send OTP
const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

// Step 2: Verify OTP
const result = await confirmation.confirm(otp);
const idToken = await result.user.getIdToken();

// Step 3: Backend authentication
const response = await fetch('/api/auth/citizen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firebaseUid: result.user.uid,
    phoneNumber: result.user.phoneNumber,
    idToken
  })
});

const { token, user } = await response.json();
// Token automatically set in cookie
```

### Officer/Worker/Admin Login

```typescript
const response = await fetch('/api/auth/officer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employeeId: 'OFF12345',
    password: 'officer123'
  })
});

const { success, token, user } = await response.json();

if (success) {
  // Token automatically set in cookie
  router.push('/officer');
}
```

### Protected API Routes

```typescript
// In your API routes, access user info from headers
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  
  // Use userId and userRole for authorization
}
```

## Troubleshooting

### Firebase Issues

**Problem**: "Firebase not initialized"
- **Solution**: Ensure all Firebase env variables are set in `.env.local`

**Problem**: "Recaptcha verification failed"
- **Solution**: 
  1. Add your domain to Firebase Console → Authentication → Settings
  2. In development, use `localhost` or `127.0.0.1`

### Authentication Issues

**Problem**: "Invalid credentials"
- **Solution**: Verify employee ID matches exactly (case-sensitive)
- **Solution**: Ensure password is correct

**Problem**: "Token expired"
- **Solution**: Log in again (tokens expire after 7 days)

**Problem**: "Unauthorized access"
- **Solution**: Ensure you're accessing the correct dashboard for your role

## Production Deployment

### 1. Environment Variables

Set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment

### 2. Firebase Admin SDK

For production, implement server-side Firebase token verification:

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const adminApp = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

// Verify token
const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
```

### 3. Database Migration

Replace `prisma-mock.ts` with actual Prisma client:

```typescript
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

### 4. Security Checklist

- [ ] Strong JWT_SECRET (minimum 32 characters)
- [ ] HTTPS enabled
- [ ] Firebase domains whitelisted
- [ ] Rate limiting on auth endpoints
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database connection secured

## Future Enhancements

- [ ] Forgot password functionality
- [ ] Email verification for new accounts
- [ ] Two-factor authentication (2FA)
- [ ] Session management (logout all devices)
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Audit logs for authentication events
- [ ] Refresh token implementation

## Support

For issues or questions:
1. Check troubleshooting section
2. Review Firebase console logs
3. Check browser console for errors
4. Verify database connections

---

**Last Updated**: November 2025
**Version**: 1.0.0
