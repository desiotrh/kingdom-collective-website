import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Picker, TouchableOpacity, Switch } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const sampleVerses = [
    { label: 'John 3:16', value: 'For God so loved the world...' },
    { label: 'Psalm 23:1', value: 'The Lord is my shepherd...' },
    { label: 'Romans 8:28', value: 'And we know that in all things...' },
];

const FaithToolsTab = ({ faithMode, encouragementMode, testMode }) => {
    const [selectedVerse, setSelectedVerse] = useState(sampleVerses[0].value);
    const [prayerText, setPrayerText] = useState('');
    const [testimonyText, setTestimonyText] = useState('');
    const [overlayEnabled, setOverlayEnabled] = useState(false);
    const [preview, setPreview] = useState('');

    const handleVerseChange = (itemValue) => {
        setSelectedVerse(itemValue);
        setPreview(itemValue);
    };

    const handleGenerate = () => {
        setPreview(selectedVerse);
    };

    return (
        <View style={styles.container}>
            {testMode && (
                <View style={styles.testModeBanner}>
                    <Text style={styles.testModeText}>TEST MODE: Sandbox features enabled</Text>
                </View>
            )}
            <Text style={styles.sectionTitle}>Bible Verse Narration</Text>
            <View style={styles.pickerRow}>
                <Text style={styles.label}>Select Verse:</Text>
                <Picker
                    selectedValue={selectedVerse}
                    style={styles.picker}
                    onValueChange={handleVerseChange}
                >
                    {sampleVerses.map((verse) => (
                        <Picker.Item key={verse.label} label={verse.label} value={verse.value} />
                    ))}
                </Picker>
            </View>
            <Button title="Preview & Generate" onPress={handleGenerate} color={KingdomColors.primary} />
            <Text style={styles.preview}>{preview}</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Prayer & Testimony Recorder</Text>
            <TextInput
                style={styles.input}
                placeholder="Record or type your prayer..."
                value={prayerText}
                onChangeText={setPrayerText}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Record or type your testimony..."
                value={testimonyText}
                onChangeText={setTestimonyText}
                multiline
            />
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Scripture Overlay Tools</Text>
            <View style={styles.toggleRow}>
                <Text style={styles.label}>Enable Scripture Overlay</Text>
                <Switch value={overlayEnabled} onValueChange={setOverlayEnabled} thumbColor={overlayEnabled ? KingdomColors.primary : KingdomColors.gray} />
            </View>
            <Text style={styles.modeNote}>
                {faithMode ? 'Faith Mode Active' : encouragementMode ? 'Encouragement Mode Active' : 'Standard Mode'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: KingdomColors.darkGray,
        marginRight: 8,
    },
    picker: {
        flex: 1,
        height: 40,
    },
    preview: {
        marginTop: 8,
        fontStyle: 'italic',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: KingdomColors.lightGray,
        marginVertical: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
        minHeight: 40,
        color: KingdomColors.darkGray,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    modeNote: {
        marginTop: 20,
        fontStyle: 'italic',
        color: KingdomColors.gray,
        textAlign: 'center',
    },
    testModeBanner: {
        backgroundColor: KingdomColors.warning,
        padding: 6,
        borderRadius: 8,
        marginBottom: 10,
    },
    testModeText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default FaithToolsTab; 