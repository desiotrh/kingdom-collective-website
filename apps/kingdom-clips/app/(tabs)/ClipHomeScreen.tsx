import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';

export default function ClipHomeScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Kingdom Clips</Text>
            <Text style={styles.motivation}>
                {faithMode
                    ? 'Let your story shine for Jesus.'
                    : 'Your story is powerful. This clip could reach the one who needs it!'}
            </Text>
            <Button title="Upload Video" onPress={() => { }} />
            {faithMode && (
                <View style={styles.faithOverlay}>
                    <Text style={styles.faithText}>Jesus Changed My Life</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 38,
        color: Colors.dark.crimson,
        marginBottom: 16,
        letterSpacing: 1,
    },
    motivation: {
        fontFamily: 'Urbanist',
        fontSize: 20,
        color: Colors.dark.gold,
        marginBottom: 32,
        textAlign: 'center',
    },
    faithOverlay: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(176,0,32,0.8)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.6,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    faithText: {
        fontFamily: 'BebasNeue',
        fontSize: 22,
        color: Colors.dark.gold,
        letterSpacing: 2,
    },
}); 