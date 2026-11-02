/**
 * One-time migration: move each report to a document whose ID is the SHA-256
 * hash of its access code, and store evidenceUrl as an array.
 *
 * The new Firestore rules only let reporters fetch reports by that ID, so run
 * this BEFORE deploying the new rules. The old app keeps working afterwards
 * because it looks reports up by the accessCode field, which is unchanged.
 *
 * Usage:
 *   node scripts/migrate-report-ids.mjs           # dry run, changes nothing
 *   node scripts/migrate-report-ids.mjs --apply   # perform the migration
 */
import { createHash } from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "./admin-app.mjs";

const apply = process.argv.includes("--apply");
initAdminApp();
const db = getFirestore();

const ACCESS_CODE_PATTERN = /^[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}$/;

const snapshot = await db.collection("reports").get();
const existingIds = new Set(snapshot.docs.map((d) => d.id));
const seenIds = new Set();
let moved = 0;
let skipped = 0;
let oldFormat = 0;

for (const docSnap of snapshot.docs) {
  const data = docSnap.data();
  if (typeof data.accessCode !== "string") {
    console.warn(`⚠️  ${docSnap.id}: no accessCode, skipped`);
    skipped++;
    continue;
  }

  const newId = createHash("sha256").update(data.accessCode).digest("hex");
  if (seenIds.has(newId)) {
    console.warn(`⚠️  ${docSnap.id}: another report has the same access code, skipped`);
    skipped++;
    continue;
  }
  seenIds.add(newId);
  if (docSnap.id !== newId && existingIds.has(newId)) {
    console.warn(`⚠️  ${docSnap.id}: target ${newId} already exists, skipped`);
    skipped++;
    continue;
  }
  // Codes from before the XXXX-XXXX-XXXX format can't be entered on the new track page
  if (!ACCESS_CODE_PATTERN.test(data.accessCode)) {
    console.warn(`⚠️  ${docSnap.id}: access code is in an old format; reporter can't track it, admins still can`);
    oldFormat++;
  }
  const evidenceUrl = typeof data.evidenceUrl === "string" ? [data.evidenceUrl] : data.evidenceUrl;
  const needsMove = docSnap.id !== newId;
  const needsArray = typeof data.evidenceUrl === "string";

  if (!needsMove && !needsArray) {
    skipped++;
    continue;
  }

  console.log(`${apply ? "→" : "(dry run)"} ${docSnap.id} → ${newId}`);
  if (apply) {
    const newData = { ...data, ...(evidenceUrl ? { evidenceUrl } : {}) };
    const batch = db.batch();
    batch.set(db.collection("reports").doc(newId), newData);
    if (needsMove) batch.delete(docSnap.ref);
    await batch.commit();
  }
  moved++;
}

console.log(`\n${apply ? "Migrated" : "Would migrate"} ${moved} report(s); ${skipped} already up to date or skipped.`);
if (oldFormat > 0) console.log(`${oldFormat} report(s) use an old access code format.`);
if (!apply && moved > 0) console.log("Run again with --apply to make the changes.");
