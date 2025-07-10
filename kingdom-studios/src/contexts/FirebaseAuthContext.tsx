import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { databaseService } from '../services/databaseService';
import { Environment } from '../config/environment';
import type { UserDocument } from '../services/database/collections';

/**
 * 🔐 ENHANCED AUTH CONTEXT - FIREBASE INTEGRATION
 * Production-ready authentication with Firestore user management
 */

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  tier: 'seed' | 'rooted' | 'commissioned' | 'mantled_pro' | 'kingdom_enterprise';
  role: 'user' | 'team_admin' | 'super_admin';
  isFounder?: boolean;
  organizationId?: string;
  faithMode: boolean;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  // User state
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string, faithMode?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // User management
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Admin functions
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFounder: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Load user profile from Firestore
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load user profile from Firestore
  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      let userDoc = await databaseService.getUser(firebaseUser.uid);
      
      // If user doesn't exist in Firestore, create them
      if (!userDoc) {
        userDoc = await createUserProfile(firebaseUser);
      } else {
        // Update last login
        await databaseService.updateLastLogin(firebaseUser.uid);
      }
      
      if (userDoc) {
        setUser({
          uid: userDoc.uid,
          email: userDoc.email,
          displayName: userDoc.displayName,
          photoURL: userDoc.photoURL,
          tier: userDoc.tier,
          role: userDoc.role,
          isFounder: userDoc.isFounder,
          organizationId: userDoc.organizationId,
          faithMode: userDoc.faithMode,
          onboardingCompleted: userDoc.onboardingCompleted
        });
      }
    } catch (error) {
      console.error('[Auth] Error loading user profile:', error);
    }
  };

  // Create new user profile in Firestore
  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<UserDocument | null> => {
    try {
      // Check if this is the first user (founder)
      const isFirstUser = await checkIfFirstUser();
      
      const userData: Omit<UserDocument, 'createdAt' | 'updatedAt' | 'lastLoginAt'> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        tier: 'seed',
        role: isFirstUser ? 'super_admin' : 'user',
        isFounder: isFirstUser,
        faithMode: true, // Default to faith mode
        onboardingCompleted: false
      };

      await databaseService.createUser(userData);
      
      // Return the created user data
      return {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };
    } catch (error) {
      console.error('[Auth] Error creating user profile:', error);
      return null;
    }
  };

  // Check if this is the first user (for founder status)
  const checkIfFirstUser = async (): Promise<boolean> => {
    try {
      // Check if there are any users in the database
      const users = await databaseService.query('USERS', []);
      return users.length === 0;
    } catch (error) {
      console.error('[Auth] Error checking first user:', error);
      return false;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Use mock mode if Firebase is not configured
      if (!Environment.isFirebaseConfigured() && Environment.areMocksEnabled()) {
        // Mock login for development
        const mockUser: User = {
          uid: 'mock-user-id',
          email: email,
          displayName: 'Mock User',
          tier: 'commissioned',
          role: 'super_admin',
          isFounder: true,
          faithMode: true,
          onboardingCompleted: true
        };
        setUser(mockUser);
        setIsLoading(false);
        return { success: true };
      }

      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      setIsLoading(false);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Register new user
  const register = async (
    email: string, 
    password: string, 
    displayName: string, 
    faithMode: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Use mock mode if Firebase is not configured
      if (!Environment.isFirebaseConfigured() && Environment.areMocksEnabled()) {
        // Mock registration for development
        const mockUser: User = {
          uid: 'mock-user-id',
          email: email,
          displayName: displayName,
          tier: 'seed',
          role: 'user',
          faithMode: faithMode,
          onboardingCompleted: false
        };
        setUser(mockUser);
        setIsLoading(false);
        return { success: true };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // The user profile will be created automatically by the auth state listener
      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);
      setIsLoading(false);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      if (Environment.isFirebaseConfigured()) {
        await firebaseSignOut(auth);
      } else {
        // Mock logout
        setUser(null);
        setFirebaseUser(null);
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      await databaseService.updateUser(user.uid, data);
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('[Auth] Error updating profile:', error);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (firebaseUser) {
      await loadUserProfile(firebaseUser);
    }
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'team_admin' || user?.role === 'super_admin' || !!user?.isFounder;
  const isSuperAdmin = user?.role === 'super_admin' || !!user?.isFounder;
  const isFounder = !!user?.isFounder;

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAdmin,
    isSuperAdmin,
    isFounder
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
