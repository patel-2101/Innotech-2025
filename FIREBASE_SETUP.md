# 🔥 Firebase Setup Guide

## Current Issue
**Error:** `Firebase: Error (auth/invalid-api-key)`

**Cause:** Missing or invalid Firebase configuration in `.env.local`

---

## ✅ Quick Fix (3 Steps)

### **Step 1: Get Firebase Credentials**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click **⚙️ Settings** → **Project Settings**
4. Scroll to **"Your apps"** section
5. Click the **Web app** icon `</>` (or add a new web app)
6. Copy the `firebaseConfig` object

### **Step 2: Add Client SDK Config**

Open `.env.local` and replace these values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### **Step 3: Get Admin SDK Credentials**

1. In Firebase Console → **⚙️ Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. Open the JSON and copy these values to `.env.local`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Important:** Keep the quotes and `\n` in the private key!

---

## 🔐 Enable Firebase Authentication

1. In Firebase Console → **Authentication**
2. Click **"Get Started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Phone"** authentication
5. Add your domain to authorized domains

---

## 🗄️ Database Configuration

Also add your PostgreSQL connection:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/complaint_system"
```

---

## 🚀 Restart Your Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Verify Setup

After restarting, you should see:
- ✅ No Firebase errors
- ✅ Can access login page: http://localhost:3000/login
- ✅ Can send OTP for authentication

---

## 🆘 Still Not Working?

**Check these:**

1. **API Key Format:**
   - Should start with `AIza`
   - No quotes around values in `.env.local`
   - No spaces before/after `=`

2. **Private Key Format:**
   ```bash
   # WRONG ❌
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
   
   # CORRECT ✅
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"
   ```

3. **Restart Required:**
   - Changes to `.env.local` require server restart
   - Run `npm run dev` again

4. **Firebase Console:**
   - Make sure billing is enabled (required for phone auth)
   - Check quotas and limits

---

## 📝 Current `.env.local` Template

Your `.env.local` file has been created with placeholders. 

**Replace all `your_xxx_here` values with actual Firebase credentials!**

---

## 🎯 Quick Commands

```bash
# View your env file
cat .env.local

# Edit env file
nano .env.local
# or
code .env.local

# Restart server
npm run dev
```

---

**Once you add real Firebase credentials, your authentication will work!** 🎉
