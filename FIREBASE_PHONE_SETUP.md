# 📱 Firebase Phone Authentication Setup Guide

## ✅ Configuration Complete

Your Firebase credentials have been configured:
- **Project**: ai-smart-complaint--system
- **API Key**: Configured ✓
- **Auth Domain**: ai-smart-complaint--system.firebaseapp.com ✓

## 🔥 Firebase Console Setup Required

Before phone authentication works, you need to complete these steps in Firebase Console:

### Step 1: Enable Phone Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **ai-smart-complaint--system**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Click **Enable**
6. Save changes

### Step 2: Configure Authorized Domains

1. In Authentication → **Settings** → **Authorized domains**
2. Make sure these domains are added:
   - `localhost` (for development)
   - Your production domain (when deploying)

### Step 3: Enable Google Sign-in (Optional)

1. In **Sign-in method** tab
2. Click on **Google** provider
3. Click **Enable**
4. Enter project support email
5. Save changes

### Step 4: Test Phone Verification

For testing without using real phone numbers:

1. Go to Authentication → **Sign-in method**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers and OTP codes:
   ```
   Phone: +91 1234567890
   OTP: 123456
   ```
4. These will work without sending real SMS

## 🧪 Testing the Implementation

### Test Phone OTP Flow

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Open Citizen Login**
   ```
   http://localhost:3000/login/citizen
   ```

3. **Select "Phone OTP" method**

4. **Enter test phone number**
   ```
   +91 1234567890
   ```
   (Use a test number you configured in Firebase Console)

5. **Check for OTP**
   - If using test numbers: Enter the OTP you configured (e.g., 123456)
   - If using real numbers: Check your SMS for the 6-digit code

6. **Enter OTP and verify**

7. **Success!** You should be redirected to `/citizen` dashboard

### Test Google Sign-in Flow

1. **Open Citizen Login**
   ```
   http://localhost:3000/login/citizen
   ```

2. **Select "Gmail" method**

3. **Click "Continue with Google"**

4. **Select your Google account**

5. **Success!** You should be redirected to `/citizen` dashboard

## 🐛 Troubleshooting

### Error: "auth/invalid-phone-number"
**Solution**: Make sure phone number includes country code (e.g., +91 for India)

### Error: "auth/too-many-requests"
**Solution**: You've made too many attempts. Wait a few minutes or use test phone numbers.

### Error: "auth/quota-exceeded"
**Solution**: SMS quota exceeded. Options:
1. Use test phone numbers (no SMS sent)
2. Upgrade Firebase plan for more SMS quota
3. Wait for quota to reset

### Error: "Popup blocked"
**Solution**: Allow popups for localhost in your browser settings

### Error: "This domain is not authorized"
**Solution**: Add your domain to Authorized domains in Firebase Console

### Recaptcha Issues
**Solution**: 
1. Make sure you're using HTTPS in production
2. Check that your domain is authorized
3. Clear browser cache and try again

## 📱 Phone Number Format

Always include country code:

✅ **Correct**:
- `+91 9876543210` (India)
- `+1 5551234567` (USA)
- `+44 7911123456` (UK)

❌ **Incorrect**:
- `9876543210` (missing country code)
- `91 9876543210` (missing + symbol)

## 🔐 Security Features

### Built-in Security
- ✅ Recaptcha verification (prevents bots)
- ✅ Rate limiting (prevents abuse)
- ✅ OTP expiration (codes expire after ~5 minutes)
- ✅ Secure token exchange
- ✅ JWT-based sessions (7-day expiration)

### Best Practices
- Never expose Firebase config in public repos
- Use environment variables for sensitive data
- Enable App Check in production
- Monitor authentication logs in Firebase Console

## 🚀 Production Deployment

### Before Going Live

1. **Update Authorized Domains**
   - Add your production domain
   - Add your staging domain (if any)

2. **Enable App Check** (Recommended)
   ```
   Firebase Console → App Check → Get Started
   ```

3. **Monitor Usage**
   - Check Authentication usage in Firebase Console
   - Set up billing alerts
   - Monitor SMS quota usage

4. **Environment Variables**
   - Never commit `.env.local` to git
   - Set environment variables in your hosting platform:
     - Vercel: Project Settings → Environment Variables
     - Netlify: Site Settings → Environment Variables

## 📊 Current Implementation

### Features
- ✅ Phone OTP authentication
- ✅ Google Sign-in
- ✅ Error handling with user-friendly messages
- ✅ Loading states
- ✅ Resend OTP functionality
- ✅ Backend user registration
- ✅ JWT token generation
- ✅ Automatic dashboard redirect

### Flow
```
1. User enters phone number
   ↓
2. Recaptcha verification (invisible)
   ↓
3. Firebase sends OTP via SMS
   ↓
4. User enters 6-digit OTP
   ↓
5. Firebase verifies OTP
   ↓
6. Backend creates/updates user in database
   ↓
7. Backend generates JWT token
   ↓
8. Token stored in HTTP-only cookie
   ↓
9. User redirected to /citizen dashboard
```

## 🎯 Next Steps

1. **Enable Phone Auth in Firebase Console** (Step 1 above)
2. **Add test phone numbers** for development
3. **Test the flow** with your phone number
4. **Enable Google Sign-in** (optional)
5. **Deploy to production** when ready

## 📞 Support

### Firebase Resources
- [Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Troubleshooting Guide](https://firebase.google.com/docs/auth/admin/errors)
- [Firebase Support](https://firebase.google.com/support)

### Common Questions

**Q: How many SMS can I send for free?**
A: Firebase Spark (free) plan includes limited SMS. Check current limits in Firebase Console.

**Q: Can I use phone auth without SMS?**
A: Yes! Use test phone numbers in Firebase Console for development.

**Q: How do I add more test numbers?**
A: Authentication → Sign-in method → Phone numbers for testing

**Q: What if I need more SMS quota?**
A: Upgrade to Firebase Blaze (pay-as-you-go) plan.

---

**Status**: ✅ Configuration Complete - Ready for Firebase Console Setup  
**Last Updated**: November 2025
