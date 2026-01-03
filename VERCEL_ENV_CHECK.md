# 🔍 Vercel Environment Variables Checklist

## Required Environment Variables for Vercel

Make sure these are set in your Vercel project:

### 1. Go to Vercel Dashboard
- https://vercel.com/dashboard
- Select your OpenLine project
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables (if not already added):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=openline-ad93c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important**: 
- Make sure to select **ALL environments** (Production, Preview, Development)
- After adding, **Redeploy** your app

### 3. Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **openline-ad93c**
3. Click gear icon → **Project Settings**
4. Scroll to **Your apps** section
5. Copy the config values

### 4. Verify in Vercel

After adding variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to finish

---

## Quick Test

After redeploy, check:
1. Can you access the site? (should load)
2. Can you submit a report? (should work)
3. Can you login? (might still have admin issue)

---

## If Admin Login Still Doesn't Work

The issue might be:
1. Admin claim not being read (token refresh issue)
2. Environment variables not set correctly
3. Need to check Firebase Console for the claim

Let me know what happens after checking Vercel environment variables!

