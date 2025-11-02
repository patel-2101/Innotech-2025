<<<<<<< HEAD
# Innotech-2025
=======
# 🚀 AI Smart Complaint System

A modern, intelligent complaint management system built with Next.js, featuring multi-role authentication, Firebase integration, and AI-powered categorization.

## 🎯 Features

### Multi-Role Authentication System
- **Citizen Login**: Firebase Phone OTP & Google Sign-in
- **Officer Login**: Prisma-based authentication with Office ID
- **Worker Login**: Prisma-based authentication with Worker ID
- **Admin Login**: Prisma-based authentication with Admin ID

### Key Capabilities
- 🔐 JWT-based authentication with 7-day expiration
- 🛡️ Route protection middleware with role-based access control
- 📱 Firebase phone verification with SMS OTP
- 🔑 Google OAuth integration
- 💾 SQLite database with Prisma ORM
- 🎨 Modern UI with Tailwind CSS v4
- 📊 Real-time complaint tracking
- 🤖 AI-powered complaint categorization

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: Firebase Auth + JWT
- **Database**: SQLite with Prisma
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Security**: bcryptjs, jose (JWT)

## 📁 Project Structure

```
ai-smart-complaint-system/
├── app/
│   ├── login/
│   │   ├── citizen/page.tsx    # Firebase Phone OTP & Gmail
│   │   ├── officer/page.tsx    # Prisma authentication
│   │   ├── worker/page.tsx     # Prisma authentication
│   │   └── admin/page.tsx      # Prisma authentication
│   ├── api/
│   │   └── auth/
│   │       ├── citizen/route.ts
│   │       ├── officer/route.ts
│   │       ├── worker/route.ts
│   │       └── admin/route.ts
│   ├── citizen/               # Protected citizen routes
│   ├── officer/               # Protected officer routes
│   ├── worker/                # Protected worker routes
│   └── admin/                 # Protected admin routes
├── lib/
│   ├── firebase.ts            # Firebase configuration
│   ├── jwt.ts                 # JWT utilities
│   ├── password.ts            # Password hashing
│   └── prisma-mock.ts         # Mock database
├── middleware.ts              # Route protection
├── prisma/
│   └── schema.prisma          # Database schema
└── [documentation files]
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account (for citizen authentication)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/patel-2101/Innotech-2025.git
   cd ai-smart-complaint-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` file (already configured with Firebase credentials):
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCDr95PVKiJcAjjKDgknx2w4h1iteW-er8
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-smart-complaint--system.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-smart-complaint--system
   
   # JWT Secret
   JWT_SECRET=ai-smart-complaint-system-jwt-secret-key-2025
   
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   ```
   http://localhost:3000
   ```

## 🔐 Demo Credentials

### Officer Login
- **URL**: http://localhost:3000/login/officer
- **Office ID**: `OFF12345`
- **Password**: `officer123`

### Worker Login
- **URL**: http://localhost:3000/login/worker
- **Worker ID**: `WRK12345`
- **Password**: `worker123`

### Admin Login
- **URL**: http://localhost:3000/login/admin
- **Admin ID**: `ADM12345`
- **Password**: `admin123`

### Citizen Login
- **URL**: http://localhost:3000/login/citizen
- **Method 1**: Phone OTP (requires Firebase setup)
- **Method 2**: Google Sign-in (requires Firebase setup)

## 🔥 Firebase Setup

To enable citizen authentication:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **ai-smart-complaint--system**
3. Enable Authentication:
   - Phone provider
   - Google provider (optional)
4. Add test phone numbers for development

**See `FIREBASE_PHONE_SETUP.md` for detailed instructions.**

## 📖 Documentation

Comprehensive documentation available:

- **`AUTHENTICATION.md`** - Complete authentication system documentation
- **`FIREBASE_PHONE_SETUP.md`** - Firebase phone verification setup guide
- **`PHONE_VERIFICATION_READY.md`** - Quick reference for phone auth
- **`QUICKSTART.md`** - Quick start guide
- **`SUMMARY.md`** - Project overview and testing guide

## 🎨 Features Overview

### Authentication Flow

```
Citizen (Firebase) → Phone OTP/Google → JWT Token → /citizen dashboard
Officer (Prisma)   → Employee ID + Password → JWT Token → /officer dashboard
Worker (Prisma)    → Employee ID + Password → JWT Token → /worker dashboard
Admin (Prisma)     → Employee ID + Password → JWT Token → /admin dashboard
```

### Security Features

- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies (XSS protection)
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Middleware route protection
- ✅ Firebase authentication
- ✅ Invisible reCAPTCHA

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test URLs
http://localhost:3000                  # Homepage
http://localhost:3000/login/officer    # Officer login
http://localhost:3000/login/worker     # Worker login
http://localhost:3000/login/admin      # Admin login
http://localhost:3000/login/citizen    # Citizen login
```

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Database

Currently using mock Prisma client for development. To use real database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Set these in your hosting platform:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `JWT_SECRET` (use a strong secret)
- `DATABASE_URL`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes.

## 👥 Authors

- **Ravi Patel** - [GitHub](https://github.com/patel-2101)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for authentication services
- Vercel for hosting platform

---

**Built with ❤️ using Next.js and Firebase**
>>>>>>> c3d0df4 (Initial commit from Create Next App)
