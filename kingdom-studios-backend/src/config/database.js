import mongoose from 'mongoose';
import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';

// Mock database for development when MongoDB is not available
let mockDatabase = {
  users: new Map(),
  content: new Map(),
  analytics: new Map(),
  favorites: new Map() // Map of userId -> Set of contentIds
};

let useMockMode = false;

/**
 * Database connection configuration and management
 */
export async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kingdom-studios';
    
    // If in development and MongoDB_URI contains localhost, try to connect with fallback to mock
    if (process.env.NODE_ENV === 'development' && mongoUri.includes('localhost')) {
      try {
        // Try connecting with a shorter timeout for development
        const options = {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 3000, // Shorter timeout for dev
          socketTimeoutMS: 45000,
          family: 4
        };

        logger.info('Attempting to connect to MongoDB...', { uri: mongoUri });
        
        await mongoose.connect(mongoUri, options);
        
        // Set up connection event listeners
        mongoose.connection.on('connected', () => {
          logger.info('MongoDB connected successfully');
          useMockMode = false;
        });

        mongoose.connection.on('error', (err) => {
          logger.error('MongoDB connection error:', err);
          logger.warn('Falling back to mock database mode');
          useMockMode = true;
        });

        mongoose.connection.on('disconnected', () => {
          logger.warn('MongoDB disconnected - using mock mode');
          useMockMode = true;
        });

        logger.info('MongoDB connection established successfully');
        useMockMode = false;
        return mongoose.connection;
        
      } catch (connectionError) {
        logger.warn('MongoDB not available, switching to mock database mode for development');
        logger.info('To use MongoDB: Install MongoDB locally or set MONGODB_URI to a cloud instance');
        logger.info('Mock database mode activated - all data will be stored in memory');
        useMockMode = true;
        return { readyState: 1, isMock: true }; // Mock connection object
      }
    } else {
      // Production or cloud MongoDB
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      logger.info('Connecting to MongoDB...', { uri: mongoUri });
      
      await mongoose.connect(mongoUri, options);
      
      // Set up connection event listeners
      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
        useMockMode = false;
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      useMockMode = false;
      return mongoose.connection;
    }

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Database connection failed, using mock mode:', error.message);
      logger.info('Mock database mode activated - all data will be stored in memory');
      useMockMode = true;
      return { readyState: 1, isMock: true };
    } else {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
}

/**
 * Initialize Firebase Admin SDK
 */
export async function initializeFirebase() {
  try {
    if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      logger.warn('Firebase not configured for development environment');
      return null;
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;

    if (!serviceAccount) {
      logger.warn('Firebase service account not provided');
      return null;
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      logger.info('Firebase Admin initialized successfully');
    }

    return admin;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return null;
  }
}

/**
 * Initialize external services and integrations
 */
export async function initializeServices() {
  try {
    logger.info('Initializing external services...');
    
    // Initialize analytics providers
    const analyticsProviders = [];
    
    if (process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID) {
      analyticsProviders.push('Google Analytics');
    }
    
    if (process.env.MIXPANEL_PROJECT_TOKEN) {
      analyticsProviders.push('Mixpanel');
    }
    
    if (process.env.FACEBOOK_PIXEL_ID) {
      analyticsProviders.push('Facebook Pixel');
    }
    
    if (process.env.AMPLITUDE_API_KEY) {
      analyticsProviders.push('Amplitude');
    }

    logger.info('Analytics providers configured:', analyticsProviders);

    // Validate OpenAI API key
    if (process.env.OPENAI_API_KEY) {
      logger.info('OpenAI API key configured');
    } else {
      logger.warn('OpenAI API key not configured');
    }

    // Validate other service keys
    const services = {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      sendgrid: !!process.env.SENDGRID_API_KEY,
      twillio: !!process.env.TWILIO_ACCOUNT_SID,
      cloudinary: !!process.env.CLOUDINARY_URL
    };

    logger.info('External services configuration:', services);

    return {
      analyticsProviders,
      services
    };
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    throw error;
  }
}

/**
 * Database health check
 */
export function getDatabaseStatus() {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[state] || 'unknown',
    readyState: state,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
}

/**
 * Mock database operations for development
 */
export const MockDB = {
  // User operations
  users: {
    create: (userData) => {
      const id = Date.now().toString();
      const user = { _id: id, ...userData, createdAt: new Date() };
      mockDatabase.users.set(id, user);
      return user;
    },
    findOne: (query) => {
      for (const user of mockDatabase.users.values()) {
        if (query.email && user.email === query.email) return user;
        if (query._id && user._id === query._id) return user;
      }
      return null;
    },
    findById: (id) => mockDatabase.users.get(id) || null,
    updateOne: (id, update) => {
      const user = mockDatabase.users.get(id);
      if (user) {
        Object.assign(user, update);
        mockDatabase.users.set(id, user);
        return user;
      }
      return null;
    },
    delete: (id) => mockDatabase.users.delete(id)
  },

  // Content operations
  content: {
    create: (contentData) => {
      const id = Date.now().toString();
      const content = { _id: id, ...contentData, createdAt: new Date() };
      mockDatabase.content.set(id, content);
      return content;
    },
    find: (query = {}) => {
      const results = Array.from(mockDatabase.content.values());
      if (query.userId) {
        return results.filter(item => item.userId === query.userId);
      }
      return results;
    },
    findById: (id) => mockDatabase.content.get(id) || null
  },

  // Analytics operations
  analytics: {
    track: (eventData) => {
      const id = Date.now().toString();
      const event = { _id: id, ...eventData, timestamp: new Date() };
      mockDatabase.analytics.set(id, event);
      return event;
    },
    find: (query = {}) => Array.from(mockDatabase.analytics.values())
  },

  // Favorites operations
  addFavorite: (userId, contentId) => {
    if (!mockDatabase.favorites.has(userId)) {
      mockDatabase.favorites.set(userId, new Set());
    }
    mockDatabase.favorites.get(userId).add(contentId);
    return true;
  },

  removeFavorite: (userId, contentId) => {
    if (mockDatabase.favorites.has(userId)) {
      mockDatabase.favorites.get(userId).delete(contentId);
      return true;
    }
    return false;
  },

  getFavorites: (userId) => {
    if (!mockDatabase.favorites.has(userId)) {
      return [];
    }
    const favoriteIds = Array.from(mockDatabase.favorites.get(userId));
    const favoriteContent = [];
    
    for (const contentId of favoriteIds) {
      const content = mockDatabase.content.get(contentId);
      if (content) {
        favoriteContent.push(content);
      }
    }
    
    return favoriteContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Additional content operations
  addContent: (contentData) => {
    const id = contentData.id || Date.now().toString();
    const content = { _id: id, ...contentData, createdAt: new Date() };
    mockDatabase.content.set(id, content);
    return content;
  },

  getContent: (contentId) => {
    return mockDatabase.content.get(contentId) || null;
  },

  updateContent: (contentId, updateData) => {
    const content = mockDatabase.content.get(contentId);
    if (content) {
      Object.assign(content, updateData, { updatedAt: new Date() });
      mockDatabase.content.set(contentId, content);
      return content;
    }
    return null;
  },

  deleteContent: (contentId) => {
    return mockDatabase.content.delete(contentId);
  }
};

/**
 * Check if using mock database mode
 */
export function isMockMode() {
  return useMockMode;
}

/**
 * Get database statistics (for monitoring)
 */
export function getDatabaseStats() {
  if (useMockMode) {
    return {
      mode: 'mock',
      users: mockDatabase.users.size,
      content: mockDatabase.content.size,
      analytics: mockDatabase.analytics.size,
      favorites: mockDatabase.favorites.size
    };
  }
  
  return {
    mode: 'mongodb',
    status: getDatabaseStatus()
  };
}

// Graceful shutdown setup
process.on('SIGINT', async () => {
  try {
    if (!useMockMode && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    if (!useMockMode && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});
