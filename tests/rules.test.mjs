import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, getDocs, collection, arrayUnion, deleteDoc, Timestamp, query, where } from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Security rules tests. Run with `npm run test:rules`, which starts the
// Firestore and Storage emulators (ports from firebase.json) around this script.
const rulesFile = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const env = await initializeTestEnvironment({
  projectId: "demo-openline",
  firestore: { rules: rulesFile("firestore.rules"), host: "127.0.0.1", port: 8080 },
  storage: { rules: rulesFile("storage.rules"), host: "127.0.0.1", port: 9199 },
});

const sha = (s) => createHash("sha256").update(s).digest("hex");
const CODE = "8X2K-99BM-7ZQN";
const ID = sha(CODE);
const now = Date.now();
const EVIDENCE_URL = "https://firebasestorage.googleapis.com/v0/b/demo.appspot.com/o/evidence%2F3f1c2a4e-1111-4222-8333-944455556666.jpg?alt=media&token=abcd-1234";
const base = () => ({
  accessCode: CODE, category: "Financial Misconduct", urgency: "High", description: "desc",
  status: "New", createdAt: now, lastUpdated: now,
  messages: [{ sender: "reporter", text: "desc", timestamp: now }],
});

const anon = env.unauthenticatedContext().firestore();
const admin = env.authenticatedContext("admin1", { admin: true }).firestore();
const user = env.authenticatedContext("u1", {}).firestore();

let pass = 0, fail = 0;
async function t(name, p) {
  try { await p; pass++; console.log("  ok  ", name); }
  catch (e) { fail++; console.log("  FAIL", name, "-", e.message.split("\n")[0]); }
}

console.log("Firestore");
await t("anon creates valid report at hash ID", assertSucceeds(setDoc(doc(anon, "reports", ID), { ...base(), evidenceUrl: [EVIDENCE_URL] })));
await t("anon create at wrong ID denied", assertFails(setDoc(doc(anon, "reports", "random123"), base())));
await t("create with status Resolved denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCC")), { ...base(), accessCode: "AAAA-BBBB-CCCC", status: "Resolved" })));
await t("create with aiAnalysis injected denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCD")), { ...base(), accessCode: "AAAA-BBBB-CCCD", aiAnalysis: { match: true } })));
await t("create with javascript: evidence denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCE")), { ...base(), accessCode: "AAAA-BBBB-CCCE", evidenceUrl: ["javascript:alert(1)"] })));
await t("create with admin-sender message denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCF")), { ...base(), accessCode: "AAAA-BBBB-CCCF", messages: [{ sender: "admin", text: "x", timestamp: now }] })));
await t("create with bad category denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCG")), { ...base(), accessCode: "AAAA-BBBB-CCCG", category: "Other" })));
await t("create with huge description denied", assertFails(setDoc(doc(anon, "reports", sha("AAAA-BBBB-CCCH")), { ...base(), accessCode: "AAAA-BBBB-CCCH", description: "x".repeat(5001) })));
await t("overwrite existing report via create denied", assertFails(setDoc(doc(anon, "reports", ID), base())));

await t("anon get by hash ID allowed", assertSucceeds(getDoc(doc(anon, "reports", ID))));
await t("anon list all reports DENIED", assertFails(getDocs(collection(anon, "reports"))));
await t("anon query by accessCode DENIED", assertFails(getDocs(query(collection(anon, "reports"), where("accessCode", "==", CODE)))));
await t("signed-in non-admin list DENIED", assertFails(getDocs(collection(user, "reports"))));
await t("admin list allowed", assertSucceeds(getDocs(collection(admin, "reports"))));

await t("anon appends reporter message", assertSucceeds(updateDoc(doc(anon, "reports", ID), { messages: arrayUnion({ sender: "reporter", text: "hi", timestamp: now + 1 }), lastUpdated: now + 1 })));
await t("anon impersonates admin message denied", assertFails(updateDoc(doc(anon, "reports", ID), { messages: arrayUnion({ sender: "admin", text: "fake", timestamp: now + 2 }), lastUpdated: now + 2 })));
await t("anon rewrites history denied", assertFails(updateDoc(doc(anon, "reports", ID), { messages: [{ sender: "reporter", text: "edited", timestamp: now }, { sender: "reporter", text: "hi", timestamp: now + 1 }, { sender: "reporter", text: "new", timestamp: now + 3 }], lastUpdated: now + 3 })));
await t("anon wipes messages denied", assertFails(updateDoc(doc(anon, "reports", ID), { messages: [], lastUpdated: now + 4 })));
await t("anon changes status denied", assertFails(updateDoc(doc(anon, "reports", ID), { status: "Resolved", lastUpdated: now + 5 })));
await t("anon deletes denied", assertFails(deleteDoc(doc(anon, "reports", ID))));
await t("signed-in non-admin changes status denied", assertFails(updateDoc(doc(user, "reports", ID), { status: "Resolved", lastUpdated: now + 6 })));

await t("admin resolves with expireAt", assertSucceeds(updateDoc(doc(admin, "reports", ID), { status: "Resolved", expireAt: Timestamp.fromMillis(now + 1e9), lastUpdated: now + 10 })));
await t("admin appends admin message", assertSucceeds(updateDoc(doc(admin, "reports", ID), { messages: arrayUnion({ sender: "admin", text: "reply", timestamp: now + 11 }), lastUpdated: now + 11 })));
await t("admin saves aiAnalysis", assertSucceeds(updateDoc(doc(admin, "reports", ID), { aiAnalysis: { match: true }, lastUpdated: now + 12 })));
await t("admin cannot change accessCode", assertFails(updateDoc(doc(admin, "reports", ID), { accessCode: "ZZZZ-ZZZZ-ZZZZ", lastUpdated: now + 13 })));
await t("anon can still message resolved report", assertSucceeds(updateDoc(doc(anon, "reports", ID), { messages: arrayUnion({ sender: "reporter", text: "thanks", timestamp: now + 14 }), lastUpdated: now + 14 })));
await t("other collections denied", assertFails(getDoc(doc(anon, "secrets", "x"))));
await t("admin delete allowed", assertSucceeds(deleteDoc(doc(admin, "reports", ID))));

console.log("Storage");
const sAnon = env.unauthenticatedContext().storage();
const sAdmin = env.authenticatedContext("admin1", { admin: true }).storage();
const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
const name = "evidence/3f1c2a4e-1111-4222-8333-944455556666.jpg";
await t("anon uploads jpg", assertSucceeds(uploadBytes(ref(sAnon, name), jpg, { contentType: "image/jpeg" })));
await t("anon reads fresh upload (for download URL)", assertSucceeds(getBytes(ref(sAnon, name))));
await t("anon overwrite existing denied", assertFails(uploadBytes(ref(sAnon, name), jpg, { contentType: "image/jpeg" })));
const pdf = new TextEncoder().encode("%PDF-1.7\n%%EOF");
await t("anon uploads pdf", assertSucceeds(uploadBytes(ref(sAnon, "evidence/5a1c2a4e-1111-4222-8333-944455556666.pdf"), pdf, { contentType: "application/pdf" })));
await t("pdf name with image type denied", assertFails(uploadBytes(ref(sAnon, "evidence/6b1c2a4e-1111-4222-8333-944455556666.pdf"), pdf, { contentType: "image/jpeg" })));
await t("svg disguised as png denied", assertFails(uploadBytes(ref(sAnon, "evidence/abc.png"), jpg, { contentType: "image/svg+xml" })));
await t("html upload denied", assertFails(uploadBytes(ref(sAnon, "evidence/abc.html"), jpg, { contentType: "text/html" })));
await t("other path denied", assertFails(uploadBytes(ref(sAnon, "public/abc.jpg"), jpg, { contentType: "image/jpeg" })));
await t("admin reads evidence", assertSucceeds(getBytes(ref(sAdmin, name))));

await env.cleanup();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
