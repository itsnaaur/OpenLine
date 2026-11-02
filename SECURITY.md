# Security

OpenLine handles whistleblower reports, so reporter anonymity and report confidentiality come first.

## Security model

### Reports (Firestore)
- Each report is stored under the **SHA-256 hash of its access code** as the document ID.
- Anyone can `get` a single report, but only by knowing its 12-character access code (~61 bits of entropy).
- **Listing or querying the `reports` collection is admin-only.** Nobody else can enumerate or bulk-download reports.
- Reporters can only **append one new message** (sender `reporter`) at a time. They cannot edit or delete earlier messages, post as `admin`, or change status, category or urgency.
- New reports are validated: known category and urgency, status `New`, size limits, document ID matching the access code hash, and evidence URLs pointing only at this project's Firebase Storage `evidence/` folder.
- Admins (custom claim `admin: true`) can update status, category, urgency, messages and AI analysis, and can delete reports. They cannot change `accessCode` or `createdAt`.

### Evidence (Storage)
- Uploads are limited to `evidence/<random-uuid>.<jpg|png|pdf>`, under 5MB, with a content type that matches the extension. SVG/HTML uploads are rejected.
- Existing files cannot be overwritten.
- Files are not publicly listable. After a 15-minute upload window, files can only be opened through the tokenized URL saved on the report.
- The browser strips photo metadata (EXIF/GPS) by re-encoding images, and drops the original file name.
- **PDF metadata is not stripped.** Reporters are told to check PDFs before uploading.

### AI check
- `runAiCheck` is a server action, so it can be called over HTTP by anyone. It verifies the caller's Firebase ID token and requires the `admin` claim before using the Gemini key.
- Report text is sent to the model as delimited untrusted data, and the model's output is validated against known categories and urgency levels.

### Headers
Strict CSP (no `unsafe-eval` in production; images only from Firebase Storage), `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, HSTS, and `X-Powered-By` disabled. See `next.config.ts`.

## Deployment checklist

Do these steps in order.

1. **Migrate existing reports to hashed IDs** (one time). The old app keeps working after this step.
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/outside/repo/key.json node scripts/migrate-report-ids.mjs          # dry run
   GOOGLE_APPLICATION_CREDENTIALS=/path/outside/repo/key.json node scripts/migrate-report-ids.mjs --apply
   ```
2. **Deploy the new app** to Vercel.
3. **Deploy the rules**:
   ```bash
   npx firebase-tools deploy --only firestore:rules,storage --project <your-project-id>
   ```
4. **Enable retention**: In Google Cloud Console → Firestore → Time-to-live, create a TTL policy on collection group `reports`, field `expireAt`. Resolved reports are then deleted about 30 days after resolution.
   Evidence files are not covered by the TTL policy. Add a Cloud Storage lifecycle rule on the `evidence/` prefix (for example, delete objects older than 180 days), or delete them when a report is removed.
5. **Rotate secrets** if they were ever shared or committed: `GEMINI_API_KEY`, admin passwords, and any service account key.

## Secrets and files that must never be committed
- `.env*` files (except a template), `serviceAccountKey.json`, `firebase-adminsdk-*.json`, `*.pem`, `*.key`
- `node_modules/` and build output (`.next/`, `functions/lib/`)

These are covered by `.gitignore` and `.vercelignore`.

## Reporting a vulnerability
Please report security issues privately to the project owner instead of opening a public issue.
