# OpenLine
Anonymous Whistleblowing & Feedback Portal

A secure, anonymous reporting system that lets employees and students report issues without fear of retaliation.

## 🏢 Third-Party Service Model

OpenLine operates as a **third-party reporting service**:

- **OpenLine Staff (Admins)**: Handle all reports and manage the system
- **Institution Clients**: Do NOT have admin access to the system
- **Report Delivery**: Reports are sent to institutions for verification (institutions don't access the system directly)
- **Anonymity Guarantee**: Since OpenLine admins don't work in client organizations, they cannot identify reporters

Multi-tenant support is scaffolded (`lib/hooks/useOrganization.ts`) but not enabled yet.

## 📋 Features

- ✅ **Anonymous Reporting** - Submit reports without creating an account
- 🔐 **Access Code System** - Track reports using a 12-character code (`XXXX-XXXX-XXXX`)
- 📸 **Evidence Upload** - Attach up to 3 photos/PDFs; photo metadata (GPS, device) is stripped in the browser before upload
- 💬 **Two-Way Communication** - Chat with administrators anonymously
- 📊 **Admin Dashboard** - Manage and respond to reports
- 🤖 **AI Compliance Verification** - Gemini checks category and urgency against Philippine laws (admin only)
- 🗑️ **Retention** - Resolved reports are deleted 30 days later (Firestore TTL)

## 🛠️ Tech Stack

Next.js 16 · React 19 · Firebase (Firestore, Storage, Auth) · Tailwind CSS 4 · TypeScript · Google Gemini

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create `.env.local` in the project root (it is git-ignored):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-only (never prefix with NEXT_PUBLIC_)
GEMINI_API_KEY=your_gemini_api_key
# Optional, defaults to gemini-2.5-flash
GEMINI_MODEL=
```

The `NEXT_PUBLIC_FIREBASE_*` values are public by design; access is controlled by the security rules. `GEMINI_API_KEY` is secret.

### 3. Run
```bash
npm run dev
```

### Local development with Firebase emulators (optional)
Runs everything locally with no real data:

```bash
npx firebase-tools emulators:start --only firestore,storage,auth --project demo-openline
```

Then start the app with `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` and `NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-openline`.

## 🔐 Admin accounts

Admins are Firebase Auth users with the `admin` custom claim.

1. Create the user in Firebase Console → Authentication.
2. Download a service account key (Project Settings → Service Accounts) and store it **outside** this repo.
3. Run:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/outside/repo/key.json node scripts/setup-admin.mjs admin@yourdomain.com
   ```
   Add `--revoke` to remove admin access.

## 🚢 Deployment

The web app deploys to Vercel. Firestore/Storage rules deploy separately with the Firebase CLI. See [SECURITY.md](./SECURITY.md) for the full checklist, including the one-time report ID migration.

## ✅ Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## 📁 Project Structure

```
app/
  submit/            Submit report page
  track/             Track report pages (lookup by access code)
  admin/             Admin login, dashboard, report detail
  actions.ts         Server action: AI check (admin-only)
lib/
  firebase.ts        Firebase client setup
  evidence.ts        Evidence upload sanitizing and safe rendering
  utils.ts           Access codes and report ID hashing
  ai.ts              Gemini compliance check
scripts/             Admin scripts (setup-admin, migrate-report-ids)
firestore.rules      Database security rules
storage.rules        File storage security rules
```
