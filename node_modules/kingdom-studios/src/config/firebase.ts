import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Environment } from './environment';

// Get Firebase configuration from environment manager
const firebaseConfig = Environment.getFirebaseConfig();

// Validate Firebase configuration
if (!Environment.isFirebaseConfigured()) {
  if (Environment.areMocksEnabled()) {
    console.warn('[Firebase] Firebase not configured - using mock mode');
  } else {
    throw new Error(
      'Firebase configuration is incomplete. Please check your .env file and ensure all Firebase environment variables are set.'
    );
  }
}

// Initialize Firebase only if properly configured
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (Environment.isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize Auth
    auth = getAuth(app);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Initialize Storage
    storage = getStorage(app);
    
    if (Environment.isDebugEnabled()) {
      console.log('[Firebase] Successfully initialized with project:', firebaseConfig.projectId);
    }
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
} else if (Environment.areMocksEnabled()) {
  // Create mock Firebase services for development
  app = { name: 'mock-app' };
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid' } }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid' } }),
    signOut: () => Promise.resolve(),
  };
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      add: () => Promise.resolve({ id: 'mock-doc-id' }),
      where: () => ({ get: () => Promise.resolve({ docs: [] }) }),
    }),
  };
  storage = {
    ref: () => ({
      child: () => ({
        put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } }),
      }),
    }),
  };
}

export { app, auth, db, storage };
