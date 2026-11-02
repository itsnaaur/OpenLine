// Shared Firebase Admin setup for the scripts in this folder.
// Credentials come from GOOGLE_APPLICATION_CREDENTIALS (path to a service account
// key stored OUTSIDE the repo) or from a local serviceAccountKey.json (git-ignored).
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const localKeyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "serviceAccountKey.json");

export function initAdminApp() {
  // Local Firebase emulators don't need credentials
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.GCLOUD_PROJECT || "demo-openline" });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault() });
  }
  if (existsSync(localKeyPath)) {
    return initializeApp({ credential: cert(JSON.parse(readFileSync(localKeyPath, "utf8"))) });
  }
  console.error("❌ No Firebase credentials found.");
  console.error("   Set GOOGLE_APPLICATION_CREDENTIALS=/path/outside/repo/key.json");
  console.error("   (Firebase Console → Project Settings → Service Accounts → Generate New Private Key)");
  process.exit(1);
}
