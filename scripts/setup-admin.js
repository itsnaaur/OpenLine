/**
 * Firebase Admin Setup Script
 * 
 * This script sets up Firebase Custom Claims for admin users.
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Get service account key from Firebase Console
 * 3. Save as serviceAccountKey.json in project root (add to .gitignore!)
 * 
 * Usage:
 * node scripts/setup-admin.js user@example.com
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Check if service account key exists
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.error('📋 To get your service account key:');
  console.error('   1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('   2. Click "Generate New Private Key"');
  console.error('   3. Save as serviceAccountKey.json in project root');
  console.error('   4. Add serviceAccountKey.json to .gitignore!');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = require(serviceAccountPath);
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Email address required');
  console.error('📋 Usage: node scripts/setup-admin.js user@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

// Set admin claim
async function setAdminClaim() {
  try {
    console.log(`🔍 Looking up user: ${email}...`);
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    console.log(`✅ User found: ${user.email} (UID: ${user.uid})`);
    console.log(`🔐 Setting admin claim...`);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Admin claim set successfully!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. User must sign out and sign in again for changes to take effect`);
    console.log(`   2. Test admin access in the dashboard`);
    console.log(`   3. Verify Firestore rules are using isAdmin() function`);
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: User with email ${email} not found`);
      console.error(`📋 Make sure the user has created an account in Firebase Authentication first`);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the function
setAdminClaim();

