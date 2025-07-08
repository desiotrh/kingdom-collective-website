import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Product } from '../contexts/ProductContext';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  faithMode: boolean;
  subscriptionTier: 'free' | 'pro' | 'sponsored';
  onboardingCompleted: boolean;
  preferences: {
    defaultPlatforms: string[];
    contentStyle: string;
    autoGenerateHashtags: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentPost {
  id?: string;
  userId: string;
  title: string;
  content: string;
  platform: string;
  scheduled?: Date;
  published?: boolean;
  publishedAt?: Date;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id?: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  sections: CourseSection[];
  thumbnailUrl?: string;
  published: boolean;
  students: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
  order: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  documentUrls?: string[];
  order: number;
  completed?: boolean;
}

export interface LeadMagnet {
  id?: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  landingPageUrl?: string;
  subscribers: string[];
  createdAt: Date;
  updatedAt: Date;
}

class FirebaseService {
  private static instance: FirebaseService;

  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // User Profile Management
  async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date();
      await addDoc(collection(db, 'users'), {
        ...profile,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...updates,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Products Management
  async saveProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      return docRef.id;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('userId', '==', userId),
        orderBy('lastSync', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting user products:', error);
      return [];
    }
  }

  // Content Posts Management
  async saveContentPost(post: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'contentPosts'), {
        ...post,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving content post:', error);
      throw error;
    }
  }

  async getUserContentPosts(userId: string): Promise<ContentPost[]> {
    try {
      const q = query(
        collection(db, 'contentPosts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          scheduled: data.scheduled ? data.scheduled.toDate() : undefined,
          publishedAt: data.publishedAt ? data.publishedAt.toDate() : undefined,
        };
      }) as ContentPost[];
    } catch (error) {
      console.error('Error getting user content posts:', error);
      return [];
    }
  }

  // Courses Management
  async saveCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'courses'), {
        ...course,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving course:', error);
      throw error;
    }
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    try {
      const q = query(
        collection(db, 'courses'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      }) as Course[];
    } catch (error) {
      console.error('Error getting user courses:', error);
      return [];
    }
  }

  // Lead Magnets Management
  async saveLeadMagnet(leadMagnet: Omit<LeadMagnet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'leadMagnets'), {
        ...leadMagnet,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving lead magnet:', error);
      throw error;
    }
  }

  // File Upload Management
  async uploadFile(uri: string, path: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToUserProducts(userId: string, callback: (products: Product[]) => void): () => void {
    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      orderBy('lastSync', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      callback(products);
    });
  }
}

export default FirebaseService.getInstance();
