import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface TimelineMilestone {
    id: string;
    title: string;
    date: string;
    completed: boolean;
    custom?: boolean;
}

const STORAGE_KEY = 'kingdom_launchpad_launch_timeline';

export function useLaunchTimeline(goalDate: string | null) {
    const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMilestones();
    }, [goalDate]);

    const generateDefaultTimeline = useCallback(() => {
        if (!goalDate) return [];
        const start = new Date(goalDate);
        const addDays = (d: number) => {
            const dt = new Date(start);
            dt.setDate(dt.getDate() - (14 - d));
            return dt.toISOString();
        };
        return [
            { id: uuidv4(), title: 'Finalize product name + price', date: addDays(1), completed: false },
            { id: uuidv4(), title: 'Build landing page', date: addDays(3), completed: false },
            { id: uuidv4(), title: 'Generate launch content', date: addDays(5), completed: false },
            { id: uuidv4(), title: 'Post teaser on social media', date: addDays(7), completed: false },
            { id: uuidv4(), title: 'Send launch email', date: addDays(10), completed: false },
            { id: uuidv4(), title: 'LAUNCH DAY 🎉', date: addDays(14), completed: false },
        ];
    }, [goalDate]);

    const loadMilestones = useCallback(async () => {
        setLoading(true);
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                setMilestones(JSON.parse(raw));
            } else {
                setMilestones(generateDefaultTimeline());
            }
        } catch {
            setMilestones(generateDefaultTimeline());
        } finally {
            setLoading(false);
        }
    }, [generateDefaultTimeline]);

    const saveMilestones = useCallback(async (updated: TimelineMilestone[]) => {
        setMilestones(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // TODO: Add Firestore sync
    }, []);

    const completeMilestone = useCallback(async (id: string) => {
        const updated = milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
        await saveMilestones(updated);
    }, [milestones, saveMilestones]);

    const addMilestone = useCallback(async (title: string, date: string) => {
        const newMilestone: TimelineMilestone = { id: uuidv4(), title, date, completed: false, custom: true };
        const updated = [...milestones, newMilestone];
        await saveMilestones(updated);
    }, [milestones, saveMilestones]);

    const updateMilestone = useCallback(async (id: string, updates: Partial<TimelineMilestone>) => {
        const updated = milestones.map(m => m.id === id ? { ...m, ...updates } : m);
        await saveMilestones(updated);
    }, [milestones, saveMilestones]);

    const reorderMilestones = useCallback(async (from: number, to: number) => {
        const updated = [...milestones];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        await saveMilestones(updated);
    }, [milestones, saveMilestones]);

    return {
        milestones,
        loading,
        completeMilestone,
        addMilestone,
        updateMilestone,
        reorderMilestones,
        reload: loadMilestones,
    };
} 