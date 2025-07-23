import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface SavedContentItem {
    id: string;
    content: string;
    templateName?: string;
    dateCreated: string;
    faithMode: boolean;
    tags?: string[];
    source: 'manual' | 'generated';
    tone?: 'motivational' | 'biblical' | 'tactical';
}

const STORAGE_KEY = 'kingdom_launchpad_saved_content';

export function useSavedContent() {
    const [items, setItems] = useState<SavedContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                setItems(JSON.parse(raw));
            } else {
                setItems([]);
            }
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveItem = useCallback(async (item: Omit<SavedContentItem, 'id' | 'dateCreated'>) => {
        const newItem: SavedContentItem = {
            ...item,
            id: uuidv4(),
            dateCreated: new Date().toISOString(),
        };
        const updated = [newItem, ...items];
        setItems(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // TODO: Add Firestore integration for cloud sync
        return newItem;
    }, [items]);

    const deleteItem = useCallback(async (id: string) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // TODO: Remove from Firestore if integrated
    }, [items]);

    return {
        items,
        loading,
        saveItem,
        deleteItem,
        reload: loadItems,
    };
} 