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

// Lazy initialization - only initialize when actually accessed
let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _auth: Auth | null = null;

function getApp(): FirebaseApp {
  if (!app) {
    if (!hasValidConfig) {
      // During build, create a minimal config to prevent errors
      // This will fail at runtime if env vars are missing, which is expected
      const buildConfig = {
        apiKey: 'build-time-placeholder',
        authDomain: 'placeholder',
        projectId: 'placeholder',
        storageBucket: 'placeholder',
        messagingSenderId: 'placeholder',
        appId: 'placeholder',
      };
      app = initializeApp(buildConfig);
    } else {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
    }
  }
  return app;
}

// Lazy getters that only initialize when accessed (client-side)
function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

function getStorageInstance(): FirebaseStorage {
  if (!_storage) {
    _storage = getStorage(getApp());
  }
  return _storage;
}

function getAuthInstance(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}

// Export with getters - these will only initialize when actually used
// This prevents build-time errors when env vars are not set
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  }
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    return (getStorageInstance() as any)[prop];
  }
});

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAuthInstance() as any)[prop];
  }
});

export default getApp;

