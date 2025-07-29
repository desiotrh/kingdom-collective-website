import { useState, useEffect, useCallback } from 'react';
import { KingdomClipsApiService, ClipData } from '../services/unifiedApiService';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

export const useClipsSync = () => {
    const [clips, setClips] = useState<ClipData[]>([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const { faithMode } = useFaithMode();
    const clipsApi = KingdomClipsApiService.getInstance();

    // Load clips on mount and when user changes
    useEffect(() => {
        loadClips();
    }, []);

    const loadClips = async () => {
        setLoading(true);
        try {
            const response = await clipsApi.getClips(1, 100); // Get first 100 clips
            setClips(response.clips);
        } catch (error) {
            console.error('Error loading clips:', error);
            // Fallback to empty array
            setClips([]);
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
            synced: true, // Unified API handles syncing automatically
        };

        try {
            setSyncing(true);
            const response = await clipsApi.saveClip(newClip);
            const savedClip = { ...newClip, id: response.id };
            setClips(prev => [...prev, savedClip]);
        } catch (error) {
            console.error('Error saving clip:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    }, []);

    const updateClip = useCallback(async (clipId: string, updates: Partial<ClipData>) => {
        try {
            setSyncing(true);
            const updatedClip = await clipsApi.updateClip(clipId, updates);
            setClips(prev => prev.map(clip => 
                clip.id === clipId ? { ...clip, ...updatedClip } : clip
            ));
        } catch (error) {
            console.error('Error updating clip:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    }, []);

    const deleteClip = useCallback(async (clipId: string) => {
        try {
            setSyncing(true);
            await clipsApi.deleteClip(clipId);
            setClips(prev => prev.filter(c => c.id !== clipId));
        } catch (error) {
            console.error('Error deleting clip:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    }, []);

    const markAsSharedTestimony = useCallback(async (clipId: string, shared: boolean) => {
        try {
            await clipsApi.markAsSharedTestimony(clipId, shared);
            setClips(prev => prev.map(clip => 
                clip.id === clipId ? { ...clip, sharedTestimony: shared } : clip
            ));
        } catch (error) {
            console.error('Error marking as shared testimony:', error);
            throw error;
        }
    }, []);

    const syncClips = useCallback(async () => {
        try {
            setSyncing(true);
            const result = await clipsApi.syncClips();
            console.log(`Synced ${result.synced} clips, ${result.errors} errors`);
            // Reload clips after sync
            await loadClips();
        } catch (error) {
            console.error('Error syncing clips:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    }, []);

    // Computed values
    const unsyncedCount = clips.filter(clip => !clip.synced).length;
    const faithClips = clips.filter(clip => clip.faithMode);
    const sharedTestimonies = clips.filter(clip => clip.sharedTestimony);

    return {
        clips,
        loading,
        syncing,
        saveClip,
        updateClip,
        deleteClip,
        markAsSharedTestimony,
        syncClips,
        unsyncedCount,
        faithClips,
        sharedTestimonies,
    };
}; 