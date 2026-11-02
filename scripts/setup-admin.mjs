/**
 * Grant (or revoke) the admin custom claim for a Firebase Auth user.
 *
 * Usage:
 *   node scripts/setup-admin.mjs user@example.com
 *   node scripts/setup-admin.mjs user@example.com --revoke
 */
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "./admin-app.mjs";

const [email, flag] = process.argv.slice(2);

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("📋 Usage: node scripts/setup-admin.mjs user@example.com [--revoke]");
  process.exit(1);
}

initAdminApp();
const revoke = flag === "--revoke";

try {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, revoke ? null : { admin: true });
  // Force existing sessions to pick up the change
  await getAuth().revokeRefreshTokens(user.uid);
  console.log(`✅ Admin claim ${revoke ? "removed from" : "set for"} ${user.email}.`);
  console.log("   The user must sign in again for the change to take effect.");
} catch (error) {
  if (error.code === "auth/user-not-found") {
    console.error(`❌ No user with email ${email}. Create the account in Firebase Authentication first.`);
  } else {
    console.error("❌ Error:", error.message);
  }
  process.exit(1);
}
