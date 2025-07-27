import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FaithModeContextType {
    isFaithMode: boolean;
    isEncouragementMode: boolean;
    toggleFaithMode: () => void;
    toggleEncouragementMode: () => void;
    FaithModeOverlay: ReactNode;
    EncouragementOverlay: ReactNode;
}

const FaithModeContext = createContext<FaithModeContextType | undefined>(undefined);

export const useFaithMode = () => {
    const context = useContext(FaithModeContext);
    if (!context) {
        throw new Error('useFaithMode must be used within a FaithModeProvider');
    }
    return context;
};

interface FaithModeProviderProps {
    children: ReactNode;
}

export const FaithModeProvider: React.FC<FaithModeProviderProps> = ({ children }) => {
    const [isFaithMode, setIsFaithMode] = useState(false);
    const [isEncouragementMode, setIsEncouragementMode] = useState(true);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const toggleFaithMode = () => setIsFaithMode(!isFaithMode);
    const toggleEncouragementMode = () => setIsEncouragementMode(!isEncouragementMode);

    const FaithModeOverlay = isFaithMode ? (
        <View style={[styles.faithOverlay, { backgroundColor: colors.cream }]}>
            <Text style={[styles.faithText, { color: colors.softGold }]}>✝️</Text>
        </View>
    ) : null;

    const EncouragementOverlay = isEncouragementMode ? (
        <View style={[styles.encouragementOverlay, { backgroundColor: colors.skyBlue }]}>
            <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                Write what you needed to hear
            </Text>
        </View>
    ) : null;

    const value = {
        isFaithMode,
        isEncouragementMode,
        toggleFaithMode,
        toggleEncouragementMode,
        FaithModeOverlay,
        EncouragementOverlay,
    };

    return (
        <FaithModeContext.Provider value={value}>
            {children}
        </FaithModeContext.Provider>
    );
};

const styles = StyleSheet.create({
    faithOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.1,
        zIndex: 1000,
    },
    faithText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    encouragementOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 12,
        opacity: 0.9,
        zIndex: 1000,
    },
    encouragementText: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '300',
    },
}); 