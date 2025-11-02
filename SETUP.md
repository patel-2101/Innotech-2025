# Setup Guide - Smart Complaint Management System

## Quick Start Steps

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- Prisma & @prisma/client
- Firebase & firebase-admin
- TensorFlow.js
- Zod (validation)

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/complaint_system"

# Firebase Client (Get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin (Get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS (via Homebrew)
brew install postgresql

# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
psql postgres
CREATE DATABASE complaint_system;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE complaint_system TO your_user;
\q
```

**Option B: Cloud Database (Recommended for Production)**
- Use services like Supabase, Neon, or Railway
- They provide free PostgreSQL hosting
- Copy the connection string to your `.env`

### 4. Set Up Firebase

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Enter project name and follow the wizard

2. **Enable Phone Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Phone" provider
   - Add your domain to authorized domains

3. **Enable Firebase Storage**
   - Go to Storage
   - Click "Get Started"
   - Choose security rules (start in test mode)

4. **Get Web App Credentials**
   - Go to Project Settings > General
   - Scroll to "Your apps"
   - Click web icon (</>) to add web app
   - Copy the configuration object

5. **Generate Service Account Key**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download JSON file
   - Copy values to `.env`:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY`

### 5. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# This will prompt for migration name, e.g., "init"
```

### 6. Create Initial Admin User (Optional)

You can use Prisma Studio to create an admin user:

```bash
npm run prisma:studio
```

This opens a browser interface where you can:
1. Click on "User" table
2. Click "Add record"
3. Fill in:
   - phoneNumber: "+1234567890"
   - name: "Admin User"
   - role: "ADMIN"
   - isActive: true
4. Save

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Application

### 1. Login Flow (Citizens)
1. Go to `/login`
2. Enter phone number with country code (e.g., +1234567890)
3. Click "Send OTP"
4. Enter the OTP received
5. System creates a CITIZEN account automatically

### 2. Test Different Roles

To test different roles, you need to create users with different roles using Prisma Studio:

```bash
npm run prisma:studio
```

Create test users:
- **Worker**: role = "WORKER"
- **Officer**: role = "OFFICER"
- **Admin**: role = "ADMIN"

Make sure to set `firebaseUid` to null for manual testing, or link to Firebase users.

### 3. Test Workflows

**Citizen Workflow:**
1. Login as CITIZEN
2. Click "New Complaint"
3. Fill form and submit
4. AI automatically categorizes the complaint
5. View complaint status

**Officer Workflow:**
1. Login as OFFICER
2. View dashboard with all complaints
3. Click on pending complaint
4. Assign a worker
5. Track progress

**Worker Workflow:**
1. Login as WORKER
2. View assigned complaints
3. Click on assignment
4. Upload before photos
5. Complete work and upload after photos

**Admin Workflow:**
1. Login as ADMIN
2. View system-wide dashboard
3. Manage users (create/edit/delete)
4. Oversee all complaints

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env`
   - Deploy

3. **Update Firebase**
   - Add your Vercel domain to Firebase authorized domains
   - Update `NEXT_PUBLIC_APP_URL` in environment variables

### Database Considerations

For production, use:
- **Supabase**: Free PostgreSQL with great integration
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple PostgreSQL hosting
- **Vercel Postgres**: Integrated with Vercel

## Troubleshooting

### Firebase OTP Not Sending
- Check Firebase Console > Authentication settings
- Ensure phone provider is enabled
- Check authorized domains list
- For development, use localhost:3000

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists
- Check firewall/security group settings

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Customize Categories**: Edit `lib/ml/complaint-categorizer.ts` to add more categories
2. **Improve ML Model**: Integrate advanced NLP models
3. **Add Notifications**: Implement push notifications for status updates
4. **Add Email**: Send email notifications to users
5. **Add Analytics**: Integrate analytics tools
6. **Add Maps**: Show complaints on a map view
7. **Add Reports**: Generate PDF reports for complaints

## Support

For issues or questions:
- Check the main README.md
- Review Prisma documentation: [prisma.io/docs](https://prisma.io/docs)
- Check Firebase documentation: [firebase.google.com/docs](https://firebase.google.com/docs)
- Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
