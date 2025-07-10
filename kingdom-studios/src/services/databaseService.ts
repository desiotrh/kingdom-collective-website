import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  DocumentReference,
  Query,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS, type CollectionName } from './database/collections';
import type { 
  UserDocument, 
  SubscriptionDocument, 
  TierUsageDocument, 
  ProductDocument,
  ContentPostDocument,
  AIGenerationDocument,
  CommunityPostDocument,
  NotificationDocument
} from './database/collections';

/**
 * 🏛️ KINGDOM STUDIOS - DATABASE SERVICE
 * Production-ready Firestore operations with type safety
 */

class DatabaseService {
  
  // ===============================
  // 🔧 CORE OPERATIONS
  // ===============================
  
  /**
   * Create a new document
   */
  async create<T extends Record<string, any>>(
    collectionName: CollectionName, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS[collectionName]), docData);
      return docRef.id;
    } catch (error) {
      console.error(`[DatabaseService] Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Create document with custom ID
   */
  async createWithId<T extends Record<string, any>>(
    collectionName: CollectionName,
    id: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
      };
      
      await setDoc(doc(db, COLLECTIONS[collectionName], id), docData);
    } catch (error) {
      console.error(`[DatabaseService] Error creating document with ID in ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a single document by ID
   */
  async get<T>(collectionName: CollectionName, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, COLLECTIONS[collectionName], id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`[DatabaseService] Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a document
   */
  async update<T extends Record<string, any>>(
    collectionName: CollectionName,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS[collectionName], id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`[DatabaseService] Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a document
   */
  async delete(collectionName: CollectionName, id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS[collectionName], id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`[DatabaseService] Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Query documents with filters
   */
  async query<T>(
    collectionName: CollectionName,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const collectionRef = collection(db, COLLECTIONS[collectionName]);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`[DatabaseService] Error querying ${collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Real-time listener for a document
   */
  subscribeToDocument<T>(
    collectionName: CollectionName,
    id: string,
    callback: (data: T | null) => void
  ): () => void {
    const docRef = doc(db, COLLECTIONS[collectionName], id);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as T);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error(`[DatabaseService] Error in document subscription for ${collectionName}:`, error);
    });
  }
  
  /**
   * Real-time listener for a collection query
   */
  subscribeToQuery<T>(
    collectionName: CollectionName,
    constraints: QueryConstraint[],
    callback: (data: T[]) => void
  ): () => void {
    const collectionRef = collection(db, COLLECTIONS[collectionName]);
    const q = query(collectionRef, ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(data);
    }, (error) => {
      console.error(`[DatabaseService] Error in query subscription for ${collectionName}:`, error);
    });
  }
  
  // ===============================
  // 👤 USER OPERATIONS
  // ===============================
  
  async createUser(userData: Omit<UserDocument, 'createdAt' | 'updatedAt' | 'lastLoginAt'>): Promise<void> {
    const now = Timestamp.now();
    return this.createWithId<UserDocument>('USERS', userData.uid, {
      ...userData,
      lastLoginAt: now.toDate()
    });
  }
  
  async getUser(uid: string): Promise<UserDocument | null> {
    return this.get<UserDocument>('USERS', uid);
  }
  
  async updateUser(uid: string, data: Partial<UserDocument>): Promise<void> {
    return this.update<UserDocument>('USERS', uid, data);
  }
  
  async updateLastLogin(uid: string): Promise<void> {
    return this.update<UserDocument>('USERS', uid, {
      lastLoginAt: Timestamp.now().toDate()
    });
  }
  
  // ===============================
  // 💳 SUBSCRIPTION OPERATIONS
  // ===============================
  
  async createSubscription(data: Omit<SubscriptionDocument, 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<SubscriptionDocument>('SUBSCRIPTIONS', data);
  }
  
  async getUserSubscription(userId: string): Promise<SubscriptionDocument | null> {
    const subscriptions = await this.query<SubscriptionDocument>('SUBSCRIPTIONS', [
      where('userId', '==', userId),
      where('status', 'in', ['active', 'trial']),
      orderBy('createdAt', 'desc'),
      limit(1)
    ]);
    
    return subscriptions[0] || null;
  }
  
  async updateSubscription(subscriptionId: string, data: Partial<SubscriptionDocument>): Promise<void> {
    return this.update<SubscriptionDocument>('SUBSCRIPTIONS', subscriptionId, data);
  }
  
  // ===============================
  // 📊 USAGE TRACKING
  // ===============================
  
  async getTierUsage(userId: string, month: string): Promise<TierUsageDocument | null> {
    const usage = await this.query<TierUsageDocument>('TIER_USAGE', [
      where('userId', '==', userId),
      where('month', '==', month),
      limit(1)
    ]);
    
    return usage[0] || null;
  }
  
  async updateTierUsage(userId: string, month: string, usageData: Partial<TierUsageDocument>): Promise<void> {
    const existingUsage = await this.getTierUsage(userId, month);
    
    if (existingUsage && existingUsage.id) {
      await this.update<TierUsageDocument>('TIER_USAGE', existingUsage.id, usageData);
    } else {
      await this.create<TierUsageDocument>('TIER_USAGE', {
        userId,
        month,
        ...usageData
      } as Omit<TierUsageDocument, 'id' | 'createdAt' | 'updatedAt'>);
    }
  }
  
  // ===============================
  // 📦 PRODUCT OPERATIONS
  // ===============================
  
  async createProduct(data: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<ProductDocument>('PRODUCTS', data);
  }
  
  async getUserProducts(userId: string): Promise<ProductDocument[]> {
    return this.query<ProductDocument>('PRODUCTS', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }
  
  async updateProduct(productId: string, data: Partial<ProductDocument>): Promise<void> {
    return this.update<ProductDocument>('PRODUCTS', productId, data);
  }
  
  // ===============================
  // 📝 CONTENT OPERATIONS
  // ===============================
  
  async createContentPost(data: Omit<ContentPostDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<ContentPostDocument>('CONTENT_POSTS', data);
  }
  
  async getUserContentPosts(userId: string): Promise<ContentPostDocument[]> {
    return this.query<ContentPostDocument>('CONTENT_POSTS', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }
  
  // ===============================
  // 🤖 AI OPERATIONS
  // ===============================
  
  async logAIGeneration(data: Omit<AIGenerationDocument, 'id' | 'createdAt'>): Promise<string> {
    return this.create<AIGenerationDocument>('AI_GENERATIONS', data);
  }
  
  async getUserAIGenerations(userId: string, limitCount: number = 50): Promise<AIGenerationDocument[]> {
    return this.query<AIGenerationDocument>('AI_GENERATIONS', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ]);
  }
  
  // ===============================
  // 👥 COMMUNITY OPERATIONS
  // ===============================
  
  async createCommunityPost(data: Omit<CommunityPostDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<CommunityPostDocument>('COMMUNITY_POSTS', data);
  }
  
  async getCommunityPosts(faithMode: boolean, limitCount: number = 50): Promise<CommunityPostDocument[]> {
    return this.query<CommunityPostDocument>('COMMUNITY_POSTS', [
      where('faithMode', '==', faithMode),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ]);
  }
  
  // ===============================
  // 🔔 NOTIFICATION OPERATIONS
  // ===============================
  
  async createNotification(data: Omit<NotificationDocument, 'id' | 'createdAt'>): Promise<string> {
    return this.create<NotificationDocument>('NOTIFICATIONS', data);
  }
  
  async getUserNotifications(userId: string): Promise<NotificationDocument[]> {
    return this.query<NotificationDocument>('NOTIFICATIONS', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    ]);
  }
  
  async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.update<NotificationDocument>('NOTIFICATIONS', notificationId, {
      read: true
    });
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
