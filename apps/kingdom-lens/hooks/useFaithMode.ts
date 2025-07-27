import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FaithModeState {
    faithMode: boolean;
    encouragementMode: boolean;
    toggleFaithMode: () => void;
    toggleEncouragementMode: () => void;
    setFaithMode: (enabled: boolean) => void;
    setEncouragementMode: (enabled: boolean) => void;
}

const FAITH_MODE_KEY = '@kingdom_lens_faith_mode';
const ENCOURAGEMENT_MODE_KEY = '@kingdom_lens_encouragement_mode';

export const useFaithMode = (): FaithModeState => {
    const [faithMode, setFaithModeState] = useState(false);
    const [encouragementMode, setEncouragementModeState] = useState(false);

    useEffect(() => {
        loadFaithModeSettings();
    }, []);

    const loadFaithModeSettings = async () => {
        try {
            const [faithModeStored, encouragementModeStored] = await Promise.all([
                AsyncStorage.getItem(FAITH_MODE_KEY),
                AsyncStorage.getItem(ENCOURAGEMENT_MODE_KEY),
            ]);

            if (faithModeStored !== null) {
                setFaithModeState(JSON.parse(faithModeStored));
            }

            if (encouragementModeStored !== null) {
                setEncouragementModeState(JSON.parse(encouragementModeStored));
            }
        } catch (error) {
            console.error('Error loading faith mode settings:', error);
        }
    };

    const setFaithMode = async (enabled: boolean) => {
        try {
            setFaithModeState(enabled);
            await AsyncStorage.setItem(FAITH_MODE_KEY, JSON.stringify(enabled));

            // If faith mode is enabled, disable encouragement mode
            if (enabled && encouragementMode) {
                setEncouragementModeState(false);
                await AsyncStorage.setItem(ENCOURAGEMENT_MODE_KEY, JSON.stringify(false));
            }
        } catch (error) {
            console.error('Error saving faith mode setting:', error);
        }
    };

    const setEncouragementMode = async (enabled: boolean) => {
        try {
            setEncouragementModeState(enabled);
            await AsyncStorage.setItem(ENCOURAGEMENT_MODE_KEY, JSON.stringify(enabled));

            // If encouragement mode is enabled, disable faith mode
            if (enabled && faithMode) {
                setFaithModeState(false);
                await AsyncStorage.setItem(FAITH_MODE_KEY, JSON.stringify(false));
            }
        } catch (error) {
            console.error('Error saving encouragement mode setting:', error);
        }
    };

    const toggleFaithMode = () => {
        setFaithMode(!faithMode);
    };

    const toggleEncouragementMode = () => {
        setEncouragementMode(!encouragementMode);
    };

    return {
        faithMode,
        encouragementMode,
        toggleFaithMode,
        toggleEncouragementMode,
        setFaithMode,
        setEncouragementMode,
    };
}; 