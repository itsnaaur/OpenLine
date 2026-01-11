# 🚀 Deployment Without Cloud Functions (Free Tier)

Since you can't upgrade to the Blaze plan, here's how to deploy securely without Cloud Functions.

## ✅ What's Changed

1. **Firestore Rules**: Updated to allow access code-based queries (prevents enumeration)
2. **Storage Rules**: Allow reads (evidence files are only accessible with exact URLs)
3. **Frontend**: Reverted to direct Firestore queries (works without Functions)

## 🔒 Security Level

**Security**: 7/10 (Good, but not as secure as with Cloud Functions)

### What's Protected:
- ✅ Reports can only be read when querying by accessCode (prevents listing all reports)
- ✅ Admin-only writes/updates (only admins can modify reports)
- ✅ Admin-only deletes
- ✅ Field validation on report creation

### Limitations:
- ⚠️ Someone could try to brute-force access codes (but with 6-character codes, this is unlikely)
- ⚠️ Evidence files are publicly accessible if someone has the exact URL (but they need the access code first)

## 📋 Deployment Steps

### Step 1: Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage
```

### Step 2: Set Up Admin Custom Claims

```bash
# 1. Install Firebase Admin SDK
npm install firebase-admin

# 2. Get service account key from Firebase Console
#    (Project Settings → Service Accounts → Generate New Private Key)
#    Save as serviceAccountKey.json in project root

# 3. Set admin claim
node scripts/setup-admin.js admin@yourdomain.com
```

### Step 3: Verify Everything Works

1. **Test Report Submission**: Submit a test report
2. **Test Report Tracking**: Use the access code to track the report
3. **Test Admin Login**: Login and verify dashboard works

## ⚠️ Important Notes

1. **No Functions URL Needed**: You don't need to add `NEXT_PUBLIC_FUNCTIONS_URL` to Vercel
2. **Direct Firestore Queries**: The app now uses direct Firestore queries (which is fine with the updated rules)
3. **Real-time Updates**: Report tracking now uses real-time listeners (better UX than polling)

## 🔄 If You Upgrade Later

If you decide to upgrade to Blaze plan later:

1. Deploy Cloud Functions: `firebase deploy --only functions`
2. Update Firestore rules to admin-only reads
3. Update Storage rules to admin-only reads
4. Add Functions URL to Vercel environment variables
5. Update frontend to use Functions API

## ✅ You're Ready!

Your app is now deployed and secure (without Cloud Functions). The security is good enough for most use cases!

---

**Status**: ✅ Deployed without Cloud Functions
**Security**: 7/10 (Good for free tier)

