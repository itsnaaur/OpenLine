# 🚀 Production Deployment Guide for OpenLine

## Pre-Deployment Checklist

Before deploying to Vercel, ensure you've completed all security hardening steps.

### ✅ Security Hardening (MUST DO)

- [x] Cloud Functions created for secure access code validation
- [x] Firestore rules updated (admin-only reads)
- [x] Storage rules updated (admin-only reads)
- [ ] Firebase Custom Claims set up for admin users
- [ ] Cloud Functions deployed
- [ ] Environment variables configured
- [ ] Security headers enabled (already in next.config.ts)

---

## Step 1: Set Up Firebase Custom Claims

### 1.1 Install Firebase Admin SDK

```bash
npm install firebase-admin
```

### 1.2 Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in your project root
6. **IMPORTANT**: This file is already in `.gitignore` - DO NOT commit it!

### 1.3 Set Admin Claims

```bash
node scripts/setup-admin.js admin@yourdomain.com
```

Replace `admin@yourdomain.com` with your admin email address.

**Note**: The user must sign out and sign in again for the admin claim to take effect.

---

## Step 2: Deploy Cloud Functions

### 2.1 Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- ✅ Functions
- ✅ Firestore
- ✅ Storage

### 2.4 Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 2.5 Deploy Functions

```bash
firebase deploy --only functions
```

**Note the Function URL** - it will look like:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

### 2.6 Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage
```

---

## Step 3: Configure Environment Variables

### 3.1 Get Your Functions URL

After deploying functions, you'll get a URL like:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

### 3.2 Update `.env.local`

Add the Functions URL:

```env
# Existing Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloud Functions URL (REQUIRED for production)
NEXT_PUBLIC_FUNCTIONS_URL=https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api

# Or use this alternative name
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api

# AI (if using)
GEMINI_API_KEY=your_gemini_key
```

### 3.3 Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables from `.env.local` (except `GEMINI_API_KEY` if it's server-only)
4. Make sure to add them for **Production**, **Preview**, and **Development** environments

**Important Variables for Vercel:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FUNCTIONS_URL` ⭐ **CRITICAL**
- `GEMINI_API_KEY` (if using AI features)

---

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 4.2 Deploy

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 4.3 Verify Deployment

1. Visit your Vercel deployment URL
2. Test report submission
3. Test report tracking with access code
4. Test admin login
5. Verify Cloud Functions are working

---

## Step 5: Post-Deployment Verification

### 5.1 Test Report Submission

1. Go to `/submit`
2. Submit a test report
3. Verify you receive an access code
4. Verify the report appears in admin dashboard

### 5.2 Test Report Tracking

1. Use the access code from step 5.1
2. Go to `/track/[access-code]`
3. Verify the report loads correctly
4. Verify you can send messages

### 5.3 Test Admin Access

1. Go to `/admin/login`
2. Login with admin account
3. Verify you can access the dashboard
4. Verify you can view reports
5. Verify you can update report status
6. Verify you can send messages

### 5.4 Test Security

1. Try accessing `/admin/dashboard` without login (should redirect)
2. Try accessing a report with invalid access code (should fail)
3. Try accessing a report with valid access code (should work)
4. Verify Firestore rules prevent public reads (use Firebase Console to test)

---

## Step 6: Set Up Monitoring

### 6.1 Firebase Monitoring

1. Go to Firebase Console → **Monitoring**
2. Set up alerts for:
   - Unusual read/write patterns
   - Storage quota warnings
   - Authentication failures
   - Function errors

### 6.2 Vercel Monitoring

1. Go to Vercel Dashboard → **Analytics**
2. Enable Web Analytics (optional)
3. Monitor function execution times
4. Set up error alerts

### 6.3 Error Tracking (Recommended)

Consider setting up:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** (only if you need it - consider privacy implications)

---

## Troubleshooting

### Issue: Cloud Functions not working

**Solution:**
1. Verify Functions URL in environment variables
2. Check Firebase Console → Functions for errors
3. Verify Functions are deployed: `firebase functions:list`
4. Check CORS settings in Functions code

### Issue: Admin access denied

**Solution:**
1. Verify Custom Claims are set: `node scripts/setup-admin.js admin@email.com`
2. User must sign out and sign in again
3. Check Firestore rules use `isAdmin()` function
4. Verify token includes admin claim in browser DevTools

### Issue: Reports not loading

**Solution:**
1. Verify Firestore rules are deployed
2. Check Functions logs: `firebase functions:log`
3. Verify access code format is correct
4. Check browser console for errors

### Issue: Evidence files not loading

**Solution:**
1. Verify Storage rules are deployed
2. Check Functions logs for evidence endpoint
3. Verify file URLs are correct
4. Check CORS settings

---

## Security Reminders

⚠️ **CRITICAL**: Before going live, ensure:

1. ✅ Firestore rules restrict public reads (admin-only)
2. ✅ Storage rules restrict public reads (admin-only)
3. ✅ Cloud Functions are deployed and working
4. ✅ Admin Custom Claims are set up
5. ✅ Environment variables are configured in Vercel
6. ✅ Functions URL is in environment variables
7. ✅ Security headers are enabled (already done)
8. ✅ Monitoring is set up

---

## Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Functions API**: `https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api`

---

## Next Steps

1. ✅ Deploy Cloud Functions
2. ✅ Set up admin Custom Claims
3. ✅ Configure Vercel environment variables
4. ✅ Deploy to Vercel
5. ✅ Test all functionality
6. ✅ Set up monitoring
7. ✅ Go live! 🎉

---

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Check Vercel deployment logs
3. Review SECURITY.md for security best practices
4. Review SECURITY_QUICK_START.md for quick fixes

---

**Last Updated**: See git history
**Status**: ✅ Production Ready (after completing all steps)

