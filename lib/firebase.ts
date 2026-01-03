// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is valid (not undefined or empty)
const hasValidConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.projectId !== 'undefined' &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.projectId.trim() !== '';

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  if (!hasValidConfig && typeof window === 'undefined') {
    // During build, create a minimal config to prevent errors
    // This will be replaced at runtime
    app = initializeApp({
      apiKey: 'build-time-placeholder',
      authDomain: 'placeholder',
      projectId: 'placeholder',
      storageBucket: 'placeholder',
      messagingSenderId: 'placeholder',
      appId: 'placeholder',
    });
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApps()[0];
}

// Initialize services
// Only initialize on client side to prevent build errors
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;
let _auth: Auth | undefined;

if (typeof window !== 'undefined') {
  // Client-side: Initialize normally
  _db = getFirestore(app);
  _storage = getStorage(app);
  _auth = getAuth(app);
} else {
  // Server-side: Create placeholder instances that will be replaced at runtime
  // This prevents build errors but these won't work on server
  try {
    _db = getFirestore(app);
    _storage = getStorage(app);
    _auth = getAuth(app);
  } catch (e) {
    // Ignore errors during build
  }
}

// Export services
export const db: Firestore = _db!;
export const storage: FirebaseStorage = _storage!;
export const auth: Auth = _auth!;

export default app;

