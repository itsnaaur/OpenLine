# 🔧 Vercel Environment Variables Setup Guide

## ⚠️ CRITICAL: Add These to Vercel

Your Firebase environment variables **MUST** be in Vercel for the app to work!

### Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **openline-ad93c**
3. Click **⚙️ Settings** → **Project Settings**
4. Scroll to **Your apps** section
5. If you see a web app, click on it
6. Copy the config values

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **OpenLine** project
3. Go to **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New**

Add these **6 variables** (one at a time):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=openline-ad93c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=openline-ad93c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=openline-ad93c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important for each variable:**
- ✅ Select **ALL environments** (Production, Preview, Development)
- ✅ Click **Save**

### Step 3: Redeploy

After adding all variables:

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to finish (2-3 minutes)

### Step 4: Test

After redeploy:
1. Go to your Vercel URL
2. Try logging in
3. Check browser console (F12) for any errors

---

## 🔍 How to Check if Variables Are Set

### In Vercel:
1. Settings → Environment Variables
2. You should see all 6 Firebase variables listed

### In Browser Console (after redeploy):
Open browser console and check for Firebase errors. If you see:
- `Firebase: Error (auth/api-key-not-valid)` → API key is wrong
- `Firebase: Error (auth/invalid-api-key)` → API key is missing
- Any Firebase errors → Check all environment variables

---

## 📋 Quick Checklist

- [ ] All 6 Firebase variables added to Vercel
- [ ] All variables set for Production, Preview, Development
- [ ] Redeployed after adding variables
- [ ] Tested login after redeploy

---

## 🆘 Still Not Working?

If admin login still doesn't work after setting environment variables:

1. **Check browser console** - What errors do you see?
2. **Check Vercel logs** - Go to Deployments → Click on deployment → View Function Logs
3. **Verify admin claim** - Run: `node scripts/setup-admin.js noemibanaau@gmail.com` again
4. **Clear browser cache** - Try incognito/private mode

---

**The environment variables are CRITICAL** - without them, Firebase won't work at all!


