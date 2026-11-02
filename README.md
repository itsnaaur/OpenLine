<p align="center">
  <img src="public/OpenLine%20(Icon%20and%20Word%20Logo).png" alt="OpenLine" width="320" />
</p>

<p align="center">
  <strong>Anonymous whistleblowing and feedback portal</strong><br />
  <a href="https://open-line.vercel.app">open-line.vercel.app</a>
</p>

<p align="center">
  <a href="https://github.com/itsnaaur/OpenLine/actions/workflows/ci.yml"><img src="https://github.com/itsnaaur/OpenLine/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

---

OpenLine lets employees and students report misconduct, safety hazards and other concerns without revealing who they are. Reporters don't sign up or log in. Each report gets a private access code that the reporter uses to follow its progress and message the team handling it. Administrators review and respond to reports from a dashboard, with an AI check that compares each report's category and urgency against Philippine law.

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Admin accounts](#admin-accounts)
- [Scripts](#scripts)
- [Testing and CI](#testing-and-ci)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Security](#security)

## Features

### Reporters
- **Anonymous submission**: no account, no personal details.
- **Categories and urgency**: seven categories (Workplace Safety & Health, Sexual Harassment & Gender-Based Violence, Bullying & Discrimination, Data Privacy Violation, Financial Misconduct, Facility & Equipment Issue, General Suggestion/Feedback) and three urgency levels.
- **Access code**: a 12-character code (`XXXX-XXXX-XXXX`) to track the report later.
- **Anonymous two-way chat** with administrators, updated in real time.
- **Evidence upload**: up to 3 JPG, PNG or PDF files, 5 MB each.
- **Metadata removal before upload**: photos are re-encoded to drop EXIF data such as GPS location and device model. PDFs are rebuilt without author, document properties, attachments or earlier revisions. Original file names are replaced with random IDs.

### Administrators
- **Dashboard** with report counts by status and filters for status and urgency.
- **Report view** with the full report, an evidence viewer with zoom, and the conversation.
- **Status workflow**: New → In Progress → Resolved.
- **AI compliance check** using Google Gemini. It suggests the correct category and urgency, cites the relevant law (RA 11058, RA 11313, RA 10627, RA 10173 or RA 11232) and explains why.
- **Retention**: resolved reports are deleted automatically 30 days after resolution.

## How it works

```
Reporter (browser)                    Admin (browser)
   │  submit / track / chat              │  sign in, review, reply
   ▼                                     ▼
Cloud Firestore ◄──── security rules ────► Firebase Auth (admin claim)
Cloud Storage   ◄──── security rules
                                         │  AI check (server action)
                                         ▼
                                   Next.js server ──► Google Gemini
```

- **Reports are addressed by the hash of their access code.** A report is stored at `reports/<sha256(accessCode)>`. Anyone can read a single report if they know its code, but listing or querying the collection is limited to admins, so reports can't be enumerated or bulk-downloaded.
- **The access code never appears in a URL.** It's kept in `sessionStorage` for the current tab, so it doesn't end up in browser history or server logs.
- **Firestore rules validate every write.** New reports must match the expected schema. Reporters can only append one message at a time and can't edit history, post as an admin, or change status. Only admins can change status, category and urgency.
- **Storage rules** allow create-only uploads to `evidence/<uuid>.<jpg|png|pdf>` with a content type that matches the extension.
- **Admins** are Firebase Auth users with the `admin: true` custom claim. The AI check runs as a Next.js server action that verifies the caller's ID token before calling Gemini, so the API key stays on the server.

The full security model is in [SECURITY.md](./SECURITY.md).

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions), [React 19](https://react.dev), TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com), [Lucide](https://lucide.dev) icons, React Hot Toast |
| Database | Cloud Firestore (real-time listeners, TTL deletion) |
| File storage | Cloud Storage for Firebase |
| Auth | Firebase Authentication with custom claims |
| Server SDK | Firebase Admin SDK |
| AI | Google Gemini 2.5 Flash via [`@google/genai`](https://www.npmjs.com/package/@google/genai) |
| Privacy | Canvas re-encoding for images, [pdf-lib](https://pdf-lib.js.org) for PDFs, Web Crypto for SHA-256 |
| Testing | Firebase Emulator Suite, `@firebase/rules-unit-testing` |
| CI / hosting | GitHub Actions, Vercel |

## Getting started

### Prerequisites
- Node.js 20 or later
- Java 21 or later, only if you use the Firebase emulators or run the rules tests
- A Firebase project with Firestore, Storage and Authentication (email/password) enabled, unless you work only against the emulators

### Install
```bash
git clone https://github.com/itsnaaur/OpenLine.git
cd OpenLine
npm install
```

### Option A: run against your Firebase project
1. Copy the environment template and fill in the values from Firebase Console → Project settings → Your apps:
   ```bash
   cp .env.example .env.local
   ```
2. Add `GEMINI_API_KEY` if you want the AI check to work.
3. Deploy the security rules to your project (see [Deployment](#deployment)).
4. Start the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Option B: run fully locally with the Firebase emulators
No Firebase project or real data needed.

1. Start the emulators (Firestore, Storage, Auth and the emulator UI):
   ```bash
   npx firebase emulators:start --only firestore,storage,auth --project demo-openline
   ```
2. In another terminal, start the app in emulator mode:
   ```bash
   NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true \
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-openline \
   NEXT_PUBLIC_FIREBASE_API_KEY=demo-key \
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-openline.firebaseapp.com \
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-openline.appspot.com \
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1 \
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1:web:1 \
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
   npm run dev
   ```
3. To use the admin dashboard locally, create a user in the emulator UI at [http://127.0.0.1:4000/auth](http://127.0.0.1:4000/auth), then make it an admin (see [Admin accounts](#admin-accounts)).

> **Note:** the Storage emulator serves files from `http://127.0.0.1:9199`, while the Firestore rules only accept evidence links from `firebasestorage.googleapis.com`. Locally, reports without attachments work as normal; reports with attachments are refused unless you add the emulator address to `isEvidenceUrl` in a local, uncommitted copy of the rules.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6 values) | Yes | Firebase web app config. Public by design; access is controlled by the security rules. |
| `GEMINI_API_KEY` | For the AI check | Google AI Studio API key. Server only, never prefix it with `NEXT_PUBLIC_`. |
| `GEMINI_MODEL` | No | Gemini model name. Defaults to `gemini-2.5-flash`, with `gemini-2.5-flash-lite` as fallback. |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` | No | `true` connects the app to the local emulators. |
| `FIREBASE_AUTH_EMULATOR_HOST` | Emulator mode | Lets the server verify admin tokens issued by the Auth emulator. |

## Admin accounts

Admins are Firebase Auth users with the `admin` custom claim. To grant it:

1. Create the user in Firebase Console → Authentication (or in the emulator UI for local development).
2. For a real project, download a service account key (Project settings → Service accounts → Generate new private key) and keep it **outside** this repository. Delete the key when you're done.
3. Run the script:
   ```bash
   # Real project
   GOOGLE_APPLICATION_CREDENTIALS=/path/outside/repo/key.json node scripts/setup-admin.mjs admin@example.com

   # Local emulators
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node scripts/setup-admin.mjs admin@example.com
   ```
   Add `--revoke` to remove admin access. The user has to sign in again for the change to apply.

Admin accounts should only be created through Firebase. Turning off public sign-up (Authentication → Settings → User actions) and enabling multi-factor authentication for admins is recommended.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test:rules` | Firestore and Storage security rules tests against the emulators (needs Java) |
| `node scripts/setup-admin.mjs <email> [--revoke]` | Grant or remove the admin claim |
| `node scripts/migrate-report-ids.mjs [--apply]` | One-time migration of older reports to hashed IDs. Dry run unless `--apply` is passed. |

## Testing and CI

`npm run test:rules` starts the Firestore and Storage emulators, runs [`tests/rules.test.mjs`](./tests/rules.test.mjs) and shuts them down. The tests cover the access model end to end: anonymous reads and writes, attempts to list or query reports, message history tampering, admin impersonation, forged report fields, file overwrites and disguised file types.

[GitHub Actions](./.github/workflows/ci.yml) runs lint, typecheck, build and the rules tests on every push to `main` and on every pull request.

## Deployment

The web app is deployed on **Vercel**. The Firestore and Storage rules are deployed separately with the Firebase CLI.

1. **Vercel**: import the repository and add the environment variables from the table above. Pushes to `main` deploy automatically.
2. **Security rules**:
   ```bash
   npx firebase login
   npx firebase deploy --only firestore:rules,storage --project <your-project-id>
   ```
3. **Retention** (one-time setup in Google Cloud Console):
   - Firestore → Time-to-live: add a policy on collection group `reports`, field `expireAt`.
   - Cloud Storage → your bucket → Lifecycle: delete objects with prefix `evidence/` after a set age, e.g. 180 days.

See [SECURITY.md](./SECURITY.md) for the full checklist.

## Project structure

```
app/
  page.tsx                 Landing page
  submit/                  Report submission
  track/                   Access code entry
  track/view/              Report view and chat for reporters
  track/[code]/            Redirect for old links that put the code in the URL
  admin/login/             Admin sign-in
  admin/dashboard/         Report list with filters
  admin/reports/[id]/      Report detail, status, chat and AI check
  actions.ts               Server action for the AI check (admin only)
  components/              Shared UI components
lib/
  firebase.ts              Firebase client setup and emulator connection
  utils.ts                 Access codes and report ID hashing
  evidence.ts              Evidence sanitizing (EXIF, PDF metadata) and safe rendering
  trackSession.ts          Keeps the access code in sessionStorage
  ai.ts                    Gemini compliance check
  lawReferences.ts         Philippine law references shown with AI results
  organizations.ts         Multi-tenant configuration (scaffolded, not enabled)
  hooks/                   Auth and organization hooks
scripts/                   Admin and migration scripts
tests/                     Security rules tests
firestore.rules            Firestore security rules
storage.rules              Storage security rules
types.ts                   Shared TypeScript types
```

## Security

The security model, deployment checklist and files that must never be committed are documented in [SECURITY.md](./SECURITY.md). Please report vulnerabilities privately to the maintainer rather than opening a public issue.
