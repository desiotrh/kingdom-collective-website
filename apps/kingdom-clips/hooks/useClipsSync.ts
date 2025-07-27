import { useState, useEffect, useCallback } from 'react';
import { firestoreService, ClipData } from '../services/firestoreService';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

export const useClipsSync = () => {
    const [clips, setClips] = useState<ClipData[]>([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const { faithMode } = useFaithMode();

    // Load clips on mount and when user changes
    useEffect(() => {
        loadClips();
    }, []);

    const loadClips = async () => {
        setLoading(true);
        try {
            const mergedClips = await firestoreService.mergeClipsFromCloud();
            setClips(mergedClips);
        } catch (error) {
            console.error('Error loading clips:', error);
            // Fallback to local only
            const localClips = await firestoreService.getClipsFromLocal();
            setClips(localClips);
        } finally {
            setLoading(false);
        }
    };

    const saveClip = useCallback(async (clipData: Omit<ClipData, 'id' | 'dateCreated' | 'lastModified' | 'synced'>) => {
        const newClip: ClipData = {
            ...clipData,
            id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            synced: false,
        };

        try {
            // Save locally first
            await firestoreService.saveClipLocally(newClip);
            setClips(prev => [...prev, newClip]);

            // Try to sync to cloud
            setSyncing(true);
            try {
                await firestoreService.saveClipToCloud(newClip);
                setClips(prev => prev.map(c => c.id === newClip.id ? { ...c, synced: true } : c));
            } catch (error) {
                console.log('Cloud sync failed, clip saved locally only');
            } finally {
                setSyncing(false);
            }
        } catch (error) {
            console.error('Error saving clip:', error);
            throw error;
        }
    }, []);

    const updateClip = useCallback(async (clipId: string, updates: Partial<ClipData>) => {
        try {
            const updatedClips = clips.map(clip =>
                clip.id === clipId
                    ? { ...clip, ...updates, synced: false, lastModified: new Date().toISOString() }
                    : clip
            );
            setClips(updatedClips);

            // Save locally
            await firestoreService.saveClipLocally(updatedClips.find(c => c.id === clipId)!);

            // Try to sync to cloud
            setSyncing(true);
            try {
                await firestoreService.updateClipInCloud(updatedClips.find(c => c.id === clipId)!);
                setClips(prev => prev.map(c => c.id === clipId ? { ...c, synced: true } : c));
            } catch (error) {
                console.log('Cloud sync failed, clip updated locally only');
            } finally {
                setSyncing(false);
            }
        } catch (error) {
            console.error('Error updating clip:', error);
            throw error;
        }
    }, [clips]);

    const deleteClip = useCallback(async (clipId: string) => {
        try {
            setClips(prev => prev.filter(c => c.id !== clipId));

            // Try to delete from cloud
            setSyncing(true);
            try {
                await firestoreService.deleteClipFromCloud(clipId);
            } catch (error) {
                console.log('Cloud delete failed, clip removed locally only');
            } finally {
                setSyncing(false);
            }
        } catch (error) {
            console.error('Error deleting clip:', error);
            throw error;
        }
    }, []);

    const syncToCloud = useCallback(async () => {
        setSyncing(true);
        try {
            await firestoreService.syncUnsyncedClips();
            await loadClips(); // Reload to get updated sync status
        } catch (error) {
            console.error('Error syncing to cloud:', error);
        } finally {
            setSyncing(false);
        }
    }, []);

    const updateClipStats = useCallback(async (clipId: string, stats: Partial<ClipData['stats']>) => {
        try {
            await firestoreService.updateClipStats(clipId, stats);
            setClips(prev => prev.map(clip =>
                clip.id === clipId
                    ? { ...clip, stats: { ...clip.stats, ...stats }, synced: false }
                    : clip
            ));
        } catch (error) {
            console.error('Error updating clip stats:', error);
            throw error;
        }
    }, []);

    const markAsSharedTestimony = useCallback(async (clipId: string, shared: boolean) => {
        try {
            await firestoreService.markAsSharedTestimony(clipId, shared);
            setClips(prev => prev.map(clip =>
                clip.id === clipId
                    ? { ...clip, sharedTestimony: shared, synced: false }
                    : clip
            ));
        } catch (error) {
            console.error('Error marking as shared testimony:', error);
            throw error;
        }
    }, []);

    const setCurrentUser = useCallback((uid: string) => {
        firestoreService.setCurrentUser(uid);
        // Sync any unsynced clips when user logs in
        syncToCloud();
    }, [syncToCloud]);

    // Get faith-related clips
    const faithClips = clips.filter(clip => clip.faithMode);
    const sharedTestimonies = clips.filter(clip => clip.sharedTestimony);

    // Get unsynced clips count
    const unsyncedCount = clips.filter(clip => !clip.synced).length;

    return {
        clips,
        loading,
        syncing,
        saveClip,
        updateClip,
        deleteClip,
        syncToCloud,
        updateClipStats,
        markAsSharedTestimony,
        setCurrentUser,
        faithClips,
        sharedTestimonies,
        unsyncedCount,
    };
}; 