/**
 * Authentication Service
 * Handles email/password and Google OAuth authentication
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, firebaseInitialized } from './firebase';

// Check if Firebase is properly initialized
const checkFirebaseInit = () => {
  if (!firebaseInitialized || !auth || !db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials in .env.local file.');
  }
};

/**
 * Create user profile in Firestore
 */
const createUserProfile = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const userData = {
      id: userId,
      email: data.email,
      full_name: data.full_name || data.displayName || 'User',
      created_at: new Date().toISOString(),
      // Stats fields
      totalTaps: 0,
      sessionsCompleted: 0,
      streak: 0,
      totalXp: 0,
      maxCombo: 0,
      mAhSaved: 0,
      lastSessionDate: null,
      lastLoginDate: new Date().toISOString(),
      dailyHistory: '[]'
    };
    
    await setDoc(userRef, userData);
    return userData;
  }
  
  // Update last login
  await updateDoc(userRef, {
    lastLoginDate: new Date().toISOString()
  });
  
  return userDoc.data();
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email, password, fullName) => {
  try {
    checkFirebaseInit();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: fullName
    });
    
    // Create user profile in Firestore
    const profile = await createUserProfile(user.uid, {
      email: user.email,
      full_name: fullName
    });
    
    return {
      success: true,
      user: {
        ...profile,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  try {
    checkFirebaseInit();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    let profile;
    if (userDoc.exists()) {
      profile = userDoc.data();
      // Update last login
      await updateDoc(userRef, {
        lastLoginDate: new Date().toISOString()
      });
    } else {
      // Create profile if it doesn't exist
      profile = await createUserProfile(user.uid, {
        email: user.email,
        full_name: user.displayName || 'User'
      });
    }
    
    return {
      success: true,
      user: {
        ...profile,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    checkFirebaseInit();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user profile
    const profile = await createUserProfile(user.uid, {
      email: user.email,
      full_name: user.displayName,
      displayName: user.displayName
    });
    
    return {
      success: true,
      user: {
        ...profile,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Sign out
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  if (!firebaseInitialized || !auth) {
    // Firebase not initialized - call callback with null immediately
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        callback({
          ...userDoc.data(),
          uid: user.uid
        });
      } else {
        callback(null);
      }
    } else {
      // User is signed out
      callback(null);
    }
  });
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return {
      ...userDoc.data(),
      uid: user.uid
    };
  }

  return null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, updates);

  return {
    success: true
  };
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
