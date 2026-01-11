# 🚀 Quick Deployment Steps (After Vercel)

Your Next.js app is deployed! Now you need to deploy the Cloud Functions and set up security.

## Step 1: Deploy Cloud Functions ⭐ **REQUIRED**

Cloud Functions provide secure access code validation. Without them, report tracking won't work.

### 1.1 Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase

```bash
firebase login
```

### 1.3 Navigate to your project

```bash
cd "c:\Users\acer\Documents\project room\OpenLine"
```

### 1.4 Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 1.5 Deploy Functions

```bash
firebase deploy --only functions
```

**Important**: After deployment, you'll see a URL like:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

**Copy this URL** - you'll need it in Step 3!

---

## Step 2: Deploy Security Rules ⭐ **REQUIRED**

This secures your Firestore and Storage.

```bash
firebase deploy --only firestore:rules,storage
```

---

## Step 3: Add Functions URL to Vercel ⭐ **REQUIRED**

Without this, report tracking won't work!

### 3.1 Get Your Functions URL

After Step 1.5, you should have a URL like:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

### 3.2 Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your OpenLine project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `NEXT_PUBLIC_FUNCTIONS_URL`
   - **Value**: `https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api` (your actual URL)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your Vercel app (or wait for next deployment)

---

## Step 4: Set Up Admin Custom Claims ⭐ **REQUIRED**

This allows admins to access the dashboard.

### 4.1 Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in your project root
6. **IMPORTANT**: This file is in `.gitignore` - never commit it!

### 4.2 Install Firebase Admin SDK

```bash
npm install firebase-admin
```

### 4.3 Set Admin Claim

```bash
node scripts/setup-admin.js admin@yourdomain.com
```

Replace `admin@yourdomain.com` with your actual admin email.

**Note**: The admin user must:
1. Already exist in Firebase Authentication
2. Sign out and sign in again after running this command

---

## Step 5: Verify Everything Works

### 5.1 Test Report Submission

1. Go to your Vercel URL: `https://your-project.vercel.app/submit`
2. Submit a test report
3. Verify you get an access code

### 5.2 Test Report Tracking

1. Use the access code from Step 5.1
2. Go to: `https://your-project.vercel.app/track/[access-code]`
3. Verify the report loads

### 5.3 Test Admin Login

1. Go to: `https://your-project.vercel.app/admin/login`
2. Login with your admin account
3. Verify you can access the dashboard

---

## 📋 Quick Checklist

- [ ] Cloud Functions deployed (`firebase deploy --only functions`)
- [ ] Security rules deployed (`firebase deploy --only firestore:rules,storage`)
- [ ] Functions URL added to Vercel environment variables
- [ ] Vercel app redeployed (after adding env var)
- [ ] Admin Custom Claims set up (`node scripts/setup-admin.js`)
- [ ] Admin user signed out and signed in again
- [ ] Tested report submission
- [ ] Tested report tracking
- [ ] Tested admin login

---

## ⚠️ Common Issues

### Issue: "Functions URL not found"

**Solution**: 
- Make sure you deployed Functions (Step 1)
- Check the URL is correct in Vercel environment variables
- Redeploy Vercel app after adding the variable

### Issue: "Admin access denied"

**Solution**:
- Make sure Custom Claims are set (Step 4)
- Admin user must sign out and sign in again
- Check Firebase Console → Authentication → Users → your user → Custom Claims

### Issue: "Report not found" when tracking

**Solution**:
- Make sure Functions are deployed
- Check Functions URL is in Vercel env vars
- Check browser console for errors
- Verify Functions are working: `firebase functions:log`

---

## 🎉 You're Done!

Once all steps are complete, your OpenLine platform is fully deployed and secure!

---

**Need Help?** Check:
- `DEPLOYMENT_PRODUCTION.md` - Full detailed guide
- `SECURITY.md` - Security documentation
- Firebase Console logs for errors

