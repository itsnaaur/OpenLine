# 🔒 Security Quick Start Guide

## Current Security Status: ⚠️ **DEVELOPMENT MODE**

Your OpenLine platform currently has **critical security vulnerabilities** that MUST be fixed before production deployment.

## 🚨 Critical Issues (Fix Before Production!)

### 1. **Public Report Access** - CRITICAL
- **Problem**: Anyone can read ALL reports, not just ones with access codes
- **Risk**: Complete anonymity breach
- **Fix**: See "Production Hardening" below

### 2. **Public Evidence Files** - CRITICAL  
- **Problem**: Evidence files are publicly accessible via URL
- **Risk**: Sensitive evidence can be accessed without authentication
- **Fix**: See "Production Hardening" below

### 3. **No Admin Verification** - HIGH
- **Problem**: Any authenticated user can act as admin
- **Risk**: Unauthorized access to admin functions
- **Fix**: Set up Firebase Custom Claims (see below)

## ✅ What's Already Secure

- ✅ Anonymous report submission (no accounts required)
- ✅ No IP address collection
- ✅ No user tracking
- ✅ Access codes are randomly generated
- ✅ Environment variables are protected
- ✅ Admin authentication uses Firebase Auth

## 🚀 Quick Fixes for Production

### Step 1: Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage
```

### Step 2: Set Up Admin Custom Claims

1. **Install Firebase Admin SDK**:
```bash
npm install firebase-admin
```

2. **Get Service Account Key**:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in project root
   - **IMPORTANT**: Add to `.gitignore`!

3. **Run Admin Setup**:
```bash
node scripts/setup-admin.js admin@yourdomain.com
```

4. **User must sign out and sign in again** for changes to take effect

### Step 3: Harden Security Rules (Choose One)

#### Option A: Admin-Only Access (Maximum Security)

**In `firestore.rules`**, change:
```javascript
// FROM:
allow read: if true;

// TO:
allow read: if isAdmin();
```

**In `storage.rules`**, change:
```javascript
// FROM:
allow read: if true;

// TO:
allow read: if request.auth != null && request.auth.token.admin == true;
```

**Pros**: Maximum security, prevents enumeration attacks
**Cons**: Reporters cannot track reports (requires Cloud Function workaround)

#### Option B: Cloud Function Validation (Best Solution)

Create a Cloud Function that:
- Validates access codes server-side
- Returns report data only if access code matches
- Maintains anonymity while securing access

**This is the recommended approach for production.**

### Step 4: Remove Console Errors

Replace `console.error()` with proper error handling:
- Use error tracking service (Sentry, etc.)
- Or sanitize error messages before logging

### Step 5: Enable Monitoring

1. Firebase Console → Monitoring
2. Set up alerts for:
   - Unusual read/write patterns
   - Storage quota warnings
   - Authentication failures

## 📋 Production Checklist

Before going live:

- [ ] Deploy updated Firestore rules
- [ ] Deploy Storage rules
- [ ] Set up Firebase Custom Claims for admins
- [ ] Harden security rules (admin-only OR Cloud Functions)
- [ ] Remove/sanitize console errors
- [ ] Set up Firebase monitoring
- [ ] Test all functionality after rule changes
- [ ] Enable 2FA for admin accounts (recommended)
- [ ] Set up automated backups

## 📚 Full Documentation

See [SECURITY.md](./SECURITY.md) for comprehensive security documentation.

## ⚠️ IMPORTANT

**DO NOT deploy to production with current security rules!** The public read access is a critical vulnerability for a whistleblowing platform.

---

**Questions?** Review SECURITY.md for detailed explanations and alternatives.

