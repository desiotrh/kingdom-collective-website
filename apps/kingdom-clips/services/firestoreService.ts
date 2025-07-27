import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase config - replace with real config
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface ClipData {
    id: string;
    fileName: string;
    storageUrl?: string;
    faithMode: boolean;
    captionStyle: string;
    title: string;
    hashtags: string[];
    thumbnail: string;
    stats: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
    };
    sharedTestimony?: boolean;
    dateCreated: string;
    lastModified: string;
    synced: boolean;
}

const CLIPS_STORAGE_KEY = 'SAVED_CLIPS_LOCAL';

export class FirestoreService {
    private currentUserId: string | null = null;

    setCurrentUser(uid: string) {
        this.currentUserId = uid;
    }

    // Save clip to Firestore
    async saveClipToCloud(clipData: ClipData): Promise<void> {
        if (!this.currentUserId) {
            throw new Error('No user logged in');
        }

        try {
            const clipRef = doc(db, 'users', this.currentUserId, 'clips', clipData.id);
            const cloudData = {
                ...clipData,
                synced: true,
                lastModified: new Date().toISOString(),
            };
            await setDoc(clipRef, cloudData);
            console.log('Clip saved to Firestore:', clipData.id);
        } catch (error) {
            console.error('Error saving clip to Firestore:', error);
            throw error;
        }
    }

    // Get all clips for current user
    async getClipsFromCloud(): Promise<ClipData[]> {
        if (!this.currentUserId) {
            throw new Error('No user logged in');
        }

        try {
            const clipsRef = collection(db, 'users', this.currentUserId, 'clips');
            const snapshot = await getDocs(clipsRef);
            const clips: ClipData[] = [];
            snapshot.forEach((doc) => {
                clips.push(doc.data() as ClipData);
            });
            return clips;
        } catch (error) {
            console.error('Error getting clips from Firestore:', error);
            throw error;
        }
    }

    // Update clip in Firestore
    async updateClipInCloud(clipData: ClipData): Promise<void> {
        if (!this.currentUserId) {
            throw new Error('No user logged in');
        }

        try {
            const clipRef = doc(db, 'users', this.currentUserId, 'clips', clipData.id);
            const updateData = {
                ...clipData,
                synced: true,
                lastModified: new Date().toISOString(),
            };
            await updateDoc(clipRef, updateData);
            console.log('Clip updated in Firestore:', clipData.id);
        } catch (error) {
            console.error('Error updating clip in Firestore:', error);
            throw error;
        }
    }

    // Delete clip from Firestore
    async deleteClipFromCloud(clipId: string): Promise<void> {
        if (!this.currentUserId) {
            throw new Error('No user logged in');
        }

        try {
            const clipRef = doc(db, 'users', this.currentUserId, 'clips', clipId);
            await deleteDoc(clipRef);
            console.log('Clip deleted from Firestore:', clipId);
        } catch (error) {
            console.error('Error deleting clip from Firestore:', error);
            throw error;
        }
    }

    // Save clip locally first (offline-first approach)
    async saveClipLocally(clipData: ClipData): Promise<void> {
        try {
            const existingClips = await this.getClipsFromLocal();
            const updatedClips = existingClips.filter(c => c.id !== clipData.id);
            updatedClips.push({
                ...clipData,
                synced: false,
                lastModified: new Date().toISOString(),
            });
            await AsyncStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(updatedClips));
            console.log('Clip saved locally:', clipData.id);
        } catch (error) {
            console.error('Error saving clip locally:', error);
            throw error;
        }
    }

    // Get clips from local storage
    async getClipsFromLocal(): Promise<ClipData[]> {
        try {
            const data = await AsyncStorage.getItem(CLIPS_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting clips from local storage:', error);
            return [];
        }
    }

    // Sync unsynced clips to cloud
    async syncUnsyncedClips(): Promise<void> {
        if (!this.currentUserId) {
            console.log('No user logged in, skipping sync');
            return;
        }

        try {
            const localClips = await this.getClipsFromLocal();
            const unsyncedClips = localClips.filter(clip => !clip.synced);

            for (const clip of unsyncedClips) {
                try {
                    await this.saveClipToCloud(clip);
                    // Mark as synced in local storage
                    const updatedClips = localClips.map(c =>
                        c.id === clip.id ? { ...c, synced: true } : c
                    );
                    await AsyncStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(updatedClips));
                } catch (error) {
                    console.error(`Error syncing clip ${clip.id}:`, error);
                }
            }
            console.log(`Synced ${unsyncedClips.length} clips to cloud`);
        } catch (error) {
            console.error('Error syncing clips:', error);
            throw error;
        }
    }

    // Merge cloud and local clips (for initial load)
    async mergeClipsFromCloud(): Promise<ClipData[]> {
        try {
            const localClips = await this.getClipsFromLocal();
            const cloudClips = await this.getClipsFromCloud();

            // Create a map of cloud clips by ID
            const cloudClipsMap = new Map(cloudClips.map(clip => [clip.id, clip]));

            // Merge local and cloud clips, preferring cloud for synced clips
            const mergedClips: ClipData[] = [];
            const processedIds = new Set<string>();

            // Add cloud clips first
            for (const cloudClip of cloudClips) {
                mergedClips.push(cloudClip);
                processedIds.add(cloudClip.id);
            }

            // Add unsynced local clips
            for (const localClip of localClips) {
                if (!processedIds.has(localClip.id)) {
                    mergedClips.push(localClip);
                }
            }

            return mergedClips;
        } catch (error) {
            console.error('Error merging clips:', error);
            // Fallback to local clips if cloud sync fails
            return await this.getClipsFromLocal();
        }
    }

    // Update clip stats
    async updateClipStats(clipId: string, stats: Partial<ClipData['stats']>): Promise<void> {
        try {
            const localClips = await this.getClipsFromLocal();
            const updatedClips = localClips.map(clip =>
                clip.id === clipId
                    ? { ...clip, stats: { ...clip.stats, ...stats }, synced: false }
                    : clip
            );
            await AsyncStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(updatedClips));

            // Try to sync to cloud
            if (this.currentUserId) {
                const clipToUpdate = updatedClips.find(c => c.id === clipId);
                if (clipToUpdate) {
                    await this.updateClipInCloud(clipToUpdate);
                }
            }
        } catch (error) {
            console.error('Error updating clip stats:', error);
            throw error;
        }
    }

    // Mark clip as shared testimony
    async markAsSharedTestimony(clipId: string, shared: boolean): Promise<void> {
        try {
            const localClips = await this.getClipsFromLocal();
            const updatedClips = localClips.map(clip =>
                clip.id === clipId
                    ? { ...clip, sharedTestimony: shared, synced: false }
                    : clip
            );
            await AsyncStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(updatedClips));

            // Try to sync to cloud
            if (this.currentUserId) {
                const clipToUpdate = updatedClips.find(c => c.id === clipId);
                if (clipToUpdate) {
                    await this.updateClipInCloud(clipToUpdate);
                }
            }
        } catch (error) {
            console.error('Error marking clip as shared testimony:', error);
            throw error;
        }
    }
}

export const firestoreService = new FirestoreService(); 