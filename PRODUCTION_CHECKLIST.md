# ✅ Production Deployment Checklist

Use this checklist before deploying to Vercel.

## 🔒 Security (CRITICAL)

- [ ] **Cloud Functions deployed** (`firebase deploy --only functions`)
- [ ] **Firestore rules deployed** (`firebase deploy --only firestore:rules`)
- [ ] **Storage rules deployed** (`firebase deploy --only storage`)
- [ ] **Admin Custom Claims set up** (`node scripts/setup-admin.js admin@email.com`)
- [ ] **Functions URL added to environment variables**
- [ ] **All environment variables configured in Vercel**

## 🧪 Testing

- [ ] **Report submission works** (test at `/submit`)
- [ ] **Report tracking works** (test with access code at `/track/[code]`)
- [ ] **Admin login works** (test at `/admin/login`)
- [ ] **Admin dashboard loads reports**
- [ ] **Admin can update report status**
- [ ] **Admin can send messages**
- [ ] **Reporter can send messages**
- [ ] **Evidence files load correctly**

## 🔐 Security Testing

- [ ] **Unauthorized admin access blocked** (try accessing `/admin/dashboard` without login)
- [ ] **Invalid access codes fail** (try random access code)
- [ ] **Valid access codes work** (use real access code)
- [ ] **Public Firestore reads blocked** (verify in Firebase Console)
- [ ] **Public Storage reads blocked** (verify in Firebase Console)

## 📊 Monitoring

- [ ] **Firebase monitoring alerts set up**
- [ ] **Vercel deployment successful**
- [ ] **Error tracking configured** (optional but recommended)

## 📝 Documentation

- [ ] **Environment variables documented**
- [ ] **Admin accounts documented**
- [ ] **Deployment process documented**

## 🚀 Ready to Deploy?

Once all items are checked, you're ready to deploy to Vercel!

See [DEPLOYMENT_PRODUCTION.md](./DEPLOYMENT_PRODUCTION.md) for detailed instructions.

---

**Status**: ⬜ Not Ready / ✅ Ready

