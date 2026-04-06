import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if Firebase is configured
const isFirebaseConfigured =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Firebase configuration
const firebaseConfig = isFirebaseConfigured ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} : null;

// Initialize Firebase
let app;
let auth;
let db;
let googleProvider;
let firebaseInitialized = false;

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    firebaseInitialized = false;
  }
} else {
  console.warn('⚠️ Firebase not configured. Authentication features will be disabled.');
  console.warn('📝 To enable authentication, create a .env.local file with Firebase credentials.');
  console.warn('📚 See AUTHENTICATION_SETUP.md for instructions.');
}

export { auth, db, googleProvider, firebaseInitialized };
