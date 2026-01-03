# Security Guide for OpenLine

## 🔒 Security Assessment

### Current Security Status: ⚠️ **NEEDS IMPROVEMENT FOR PRODUCTION**

While the basic security is in place, there are **critical vulnerabilities** that must be addressed before production deployment, especially for a whistleblowing platform where anonymity is paramount.

---

## 🚨 Critical Security Issues

### 1. **CRITICAL: Public Report Access** ⚠️
**Issue**: Firestore rules currently allow `allow read: if true`, meaning anyone can query and read ALL reports, not just ones with the correct access code.

**Risk**: 
- Complete anonymity breach
- Attackers can enumerate all reports
- Access codes become meaningless if reports can be accessed without them

**Current Mitigation**: 
- Access code validation happens client-side only
- This is NOT sufficient for production

**Recommended Fix**: 
- Use Cloud Functions to validate access codes server-side
- OR restrict reads to authenticated admins only (see rules file)
- See "Production Security Hardening" section below

### 2. **CRITICAL: Public Evidence Access** ⚠️
**Issue**: Storage rules allow public reads of evidence files.

**Risk**: 
- Evidence files are publicly accessible via direct URL
- Anyone with the URL can access evidence without authentication

**Recommended Fix**: 
- Use signed URLs via Cloud Functions
- OR restrict to admin-only access (see storage.rules)

### 3. **HIGH: No Admin Role Verification** ⚠️
**Issue**: Any authenticated Firebase user can update/delete reports, not just admins.

**Risk**: 
- Unauthorized users could gain admin access if they create an account
- No distinction between regular users and admins

**Recommended Fix**: 
- Implement Firebase Custom Claims (see setup instructions below)

### 4. **MEDIUM: Client-Side Access Code Validation** ⚠️
**Issue**: Access codes are validated only on the client side.

**Risk**: 
- Malicious users could bypass validation
- Reports could be accessed without proper authorization

**Recommended Fix**: 
- Implement server-side validation via Cloud Functions

### 5. **MEDIUM: No Rate Limiting** ⚠️
**Issue**: No protection against spam or DoS attacks.

**Risk**: 
- Attackers could flood the system with fake reports
- Storage could be filled with malicious files

**Recommended Fix**: 
- Implement rate limiting via Cloud Functions or Firebase App Check

---

## 📋 Firestore Security Rules

### Current Rules (Updated with Validation)

The updated Firestore rules include:
- ✅ Field validation on report creation
- ✅ Admin verification function (requires Custom Claims)
- ⚠️ Public reads (MUST be changed for production - see below)

**To Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

### Production Hardening Options

#### Option 1: Admin-Only Reads (RECOMMENDED)
In `firestore.rules`, change:
```javascript
// Change this:
allow read: if true;

// To this:
allow read: if isAdmin();
```

**Pros**: Maximum security, prevents enumeration attacks
**Cons**: Reporters cannot track their own reports (requires Cloud Function workaround)

#### Option 2: Cloud Function Validation (BEST)
Create a Cloud Function that validates access codes server-side:
- Reports can only be read via the function
- Function validates access code before returning data
- Maintains anonymity while securing access

---

## 📦 Firebase Storage Rules

### Current Rules (Created)

Storage rules have been created in `storage.rules` with:
- ✅ File size limits (5MB)
- ✅ File type restrictions (images/PDF only)
- ⚠️ Public reads (MUST be changed for production)

**To Deploy Rules:**
```bash
firebase deploy --only storage
```

### Production Hardening

In `storage.rules`, change:
```javascript
// Change this:
allow read: if true;

// To this:
allow read: if request.auth != null && request.auth.token.admin == true;
```

**Alternative**: Use signed URLs via Cloud Functions for time-limited access.

---

## 👤 Firebase Custom Claims (Admin Verification)

### Why Custom Claims?
Custom Claims allow you to mark specific users as admins, preventing unauthorized access.

### Setup Instructions

1. **Install Firebase Admin SDK** (for server-side setup):
```bash
npm install firebase-admin
```

2. **Create Admin Setup Script** (`scripts/setup-admin.js`):
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Set admin claim for a user
async function setAdminClaim(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${email}`);
}

// Usage: node scripts/setup-admin.js user@example.com
setAdminClaim(process.argv[2]);
```

3. **Get Service Account Key**:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` (add to `.gitignore`!)

4. **Run Setup**:
```bash
node scripts/setup-admin.js admin@yourdomain.com
```

5. **Update Firestore Rules** (already done - uses `isAdmin()` function)

---

## 🔐 Additional Security Measures

### 1. Environment Variables
- ✅ All secrets in `.env.local` (not committed)
- ✅ `.env.local` in `.gitignore`
- ✅ Never commit API keys

### 2. Authentication Security
- ✅ Firebase Auth handles password hashing
- ✅ Session management by Firebase
- ⚠️ Add 2FA for admin accounts (recommended)

### 3. Data Protection
- ✅ No IP addresses collected
- ✅ No user tracking
- ✅ No personal information required
- ✅ Access codes are randomly generated

### 4. Error Handling
- ⚠️ Console errors may leak information
- **Fix**: Remove or sanitize `console.error()` statements in production
- Use error tracking service (Sentry, etc.) instead

### 5. Rate Limiting
**Recommended Implementation**:
- Use Firebase App Check to prevent abuse
- Implement Cloud Functions with rate limiting
- Set up Firebase quotas and alerts

### 6. Monitoring & Alerts
**Set Up**:
1. Firebase Console → Monitoring
2. Enable alerts for:
   - Unusual read/write patterns
   - Storage quota warnings
   - Authentication failures
   - Function errors

---

## 🚀 Production Deployment Checklist

Before deploying to production:

### Critical (MUST DO)
- [ ] Deploy updated Firestore rules
- [ ] Deploy Storage rules
- [ ] Set up Firebase Custom Claims for admins
- [ ] Change Firestore reads to admin-only OR implement Cloud Function validation
- [ ] Change Storage reads to admin-only OR use signed URLs
- [ ] Remove/sanitize console.error statements
- [ ] Set up Firebase monitoring and alerts

### High Priority (SHOULD DO)
- [ ] Implement rate limiting (App Check or Cloud Functions)
- [ ] Set up automated backups
- [ ] Enable 2FA for admin accounts
- [ ] Review and test all security rules
- [ ] Set up error tracking (Sentry, etc.)

### Medium Priority (RECOMMENDED)
- [ ] Implement Cloud Function for access code validation
- [ ] Add security headers (CSP, HSTS, etc.)
- [ ] Set up regular security audits
- [ ] Document incident response procedures
- [ ] Create admin access logs

### Low Priority (NICE TO HAVE)
- [ ] Implement IP-based rate limiting
- [ ] Add CAPTCHA for report submission
- [ ] Set up automated security scanning
- [ ] Create security documentation for admins

---

## 🛡️ Anonymity Protection

### What We Protect
- ✅ No user accounts required for reporters
- ✅ No IP address collection
- ✅ No tracking cookies or analytics
- ✅ No personal information required
- ✅ Access codes are the only identifier

### What We DON'T Collect
- ❌ IP addresses
- ❌ Browser fingerprints
- ❌ Location data
- ❌ Device information
- ❌ Email addresses (for reporters)
- ❌ Phone numbers
- ❌ Names or personal identifiers

### Additional Recommendations
1. **Use VPN/TOR**: Encourage users to use VPN or TOR for extra anonymity
2. **No Analytics**: Don't add Google Analytics or similar tracking
3. **HTTPS Only**: Ensure all connections are HTTPS
4. **No Logging**: Minimize server-side logging of user actions

---

## 📞 Security Incident Response

If you discover a security breach:

1. **Immediately**: 
   - Change all admin passwords
   - Review Firebase access logs
   - Check for unauthorized data access

2. **Within 24 hours**:
   - Notify affected users (if applicable)
   - Document the incident
   - Implement fixes

3. **Follow-up**:
   - Review security measures
   - Update security documentation
   - Consider security audit

---

## 🔍 Regular Security Maintenance

### Weekly
- Review Firebase Console logs
- Check for unusual activity
- Monitor storage usage

### Monthly
- Review security rules
- Update dependencies (`npm audit`)
- Review admin access list

### Quarterly
- Full security audit
- Review and update security documentation
- Test backup/restore procedures

---

## 📚 Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase Custom Claims Guide](https://firebase.google.com/docs/auth/admin/custom-claims)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/database/security)

---

## ⚠️ IMPORTANT NOTES

1. **Current Configuration is for Development**: The current rules allow public reads for ease of development. **MUST be changed before production**.

2. **Anonymity is Critical**: This is a whistleblowing platform. Any security breach could have serious consequences for reporters.

3. **Test Thoroughly**: After changing security rules, thoroughly test all functionality to ensure nothing breaks.

4. **Monitor Continuously**: Set up alerts and monitor the system regularly for suspicious activity.

5. **Keep Updated**: Security is an ongoing process. Regularly review and update security measures.

---

**Last Updated**: See git history for latest changes
**Security Level**: ⚠️ Development Ready / 🔒 Production Ready (after implementing recommendations)
