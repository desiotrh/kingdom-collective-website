import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
    const { faithMode, setFaithMode } = useFaithMode();
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Faith Mode</Text>
                <Switch
                    value={faithMode}
                    onValueChange={setFaithMode}
                    thumbColor={faithMode ? Colors.dark.gold : Colors.dark.crimson}
                    trackColor={{ true: Colors.dark.crimson, false: Colors.dark.gold }}
                />
            </View>
            <View style={styles.previewBox}>
                <Text style={styles.previewText}>
                    {faithMode ? 'Jesus Changed My Life' : 'Your story is powerful!'}
                </Text>
            </View>
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
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 24,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    label: {
        fontFamily: 'Urbanist',
        fontSize: 18,
        color: Colors.dark.gold,
        marginRight: 16,
    },
    previewBox: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    previewText: {
        fontFamily: 'BebasNeue',
        fontSize: 20,
        color: Colors.dark.gold,
        letterSpacing: 2,
        textAlign: 'center',
    },
}); 