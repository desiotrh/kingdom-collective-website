import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Switch, Modal, TouchableOpacity, Slider, TextInput, Alert, ActivityIndicator } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';
import ElevenLabsService, { ElevenLabsVoice } from '../../services/elevenLabsService';

const VoiceStudioTab = ({ faithMode, encouragementMode, testMode }) => {
    const [windGuard, setWindGuard] = useState(false);
    const [acousticMode, setAcousticMode] = useState(false);
    const [emotion, setEmotion] = useState(0.5);
    const [clarity, setClarity] = useState(0.5);
    const [consentVisible, setConsentVisible] = useState(false);
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const [elevenLabsConnected, setElevenLabsConnected] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null);
    const [generating, setGenerating] = useState(false);
    const [textToGenerate, setTextToGenerate] = useState('');

    useEffect(() => {
        checkElevenLabsStatus();
    }, []);

    const checkElevenLabsStatus = async () => {
        try {
            const consent = await ElevenLabsService.getConsent();
            if (consent) {
                const connected = await ElevenLabsService.testConnection();
                setElevenLabsConnected(connected);
                if (connected) {
                    loadVoices();
                }
            }
        } catch (error) {
            console.error('Failed to check ElevenLabs status:', error);
        }
    };

    const loadVoices = async () => {
        try {
            const availableVoices = await ElevenLabsService.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0]);
            }
        } catch (error) {
            console.error('Failed to load voices:', error);
            Alert.alert('Error', 'Failed to load available voices');
        }
    };

    const handleConnectElevenLabs = () => {
        if (!elevenLabsConnected) {
            setApiKeyVisible(true);
        }
    };

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert('Error', 'Please enter your ElevenLabs API key');
            return;
        }

        try {
            await ElevenLabsService.setApiKey(apiKey);
            const connected = await ElevenLabsService.testConnection();
            setElevenLabsConnected(connected);
            setApiKeyVisible(false);
            setApiKey('');

            if (connected) {
                loadVoices();
                Alert.alert('Success', 'Connected to ElevenLabs successfully!');
            } else {
                Alert.alert('Error', 'Failed to connect. Please check your API key.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to ElevenLabs');
        }
    };

    const handleConsent = async () => {
        await ElevenLabsService.setConsent(true);
        setConsentVisible(false);
        if (elevenLabsConnected) {
            loadVoices();
        }
    };

    const handleGenerateSpeech = async () => {
        if (!textToGenerate.trim()) {
            Alert.alert('Error', 'Please enter text to generate speech');
            return;
        }

        if (!selectedVoice) {
            Alert.alert('Error', 'Please select a voice');
            return;
        }

        setGenerating(true);
        try {
            const result = await ElevenLabsService.generateSpeech({
                text: textToGenerate,
                voice_id: selectedVoice.id,
                voice_settings: {
                    stability: clarity,
                    similarity_boost: emotion,
                    style: 0.0,
                    use_speaker_boost: true,
                },
            });

            Alert.alert('Success', 'Speech generated successfully!');
            setTextToGenerate('');
        } catch (error) {
            Alert.alert('Error', 'Failed to generate speech');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <View style={styles.container}>
            {testMode && (
                <View style={styles.testModeBanner}>
                    <Text style={styles.testModeText}>TEST MODE: Sandbox features enabled</Text>
                </View>
            )}

            <Modal visible={consentVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Consent Required</Text>
                        <Text style={styles.modalText}>
                            To use AI voice features, you must consent to our terms and confirm you have rights to all voices used. No unbiblical or unauthorized content is permitted.
                        </Text>
                        <Button title="I Consent" onPress={handleConsent} color={KingdomColors.primary} />
                    </View>
                </View>
            </Modal>

            <Modal visible={apiKeyVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Connect to ElevenLabs</Text>
                        <Text style={styles.modalText}>
                            Enter your ElevenLabs API key to enable AI voice generation.
                        </Text>
                        <TextInput
                            style={styles.apiKeyInput}
                            placeholder="Enter ElevenLabs API Key"
                            value={apiKey}
                            onChangeText={setApiKey}
                            secureTextEntry
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setApiKeyVisible(false)} color={KingdomColors.gray} />
                            <Button title="Connect" onPress={handleSaveApiKey} color={KingdomColors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>

            <Text style={styles.sectionTitle}>AI Voice Generator</Text>
            <TouchableOpacity
                style={[styles.connectButton, elevenLabsConnected && styles.connected]}
                onPress={handleConnectElevenLabs}
                disabled={elevenLabsConnected}
            >
                <Text style={styles.connectButtonText}>
                    {elevenLabsConnected ? 'Connected to ElevenLabs' : 'Connect to ElevenLabs'}
                </Text>
            </TouchableOpacity>

            {elevenLabsConnected && voices.length > 0 && (
                <View style={styles.voiceSection}>
                    <Text style={styles.subsectionTitle}>Select Voice</Text>
                    <View style={styles.voicePicker}>
                        {voices.map((voice) => (
                            <TouchableOpacity
                                key={voice.id}
                                style={[styles.voiceOption, selectedVoice?.id === voice.id && styles.selectedVoice]}
                                onPress={() => setSelectedVoice(voice)}
                            >
                                <Text style={styles.voiceName}>{voice.name}</Text>
                                <Text style={styles.voiceCategory}>{voice.category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {elevenLabsConnected && (
                <View style={styles.generationSection}>
                    <Text style={styles.subsectionTitle}>Generate Speech</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter text to generate speech..."
                        value={textToGenerate}
                        onChangeText={setTextToGenerate}
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity
                        style={[styles.generateButton, generating && styles.generatingButton]}
                        onPress={handleGenerateSpeech}
                        disabled={generating}
                    >
                        {generating ? (
                            <ActivityIndicator color={KingdomColors.white} />
                        ) : (
                            <Text style={styles.generateButtonText}>Generate Speech</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>WindGuard</Text>
                <Switch value={windGuard} onValueChange={setWindGuard} thumbColor={windGuard ? KingdomColors.primary : KingdomColors.gray} />
            </View>
            <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Acoustic Mode</Text>
                <Switch value={acousticMode} onValueChange={setAcousticMode} thumbColor={acousticMode ? KingdomColors.primary : KingdomColors.gray} />
            </View>
            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Emotion</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={emotion}
                    onValueChange={setEmotion}
                    minimumTrackTintColor={KingdomColors.primary}
                    maximumTrackTintColor={KingdomColors.gray}
                />
                <Text style={styles.sliderValue}>{Math.round(emotion * 100)}%</Text>
            </View>
            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Clarity</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={clarity}
                    onValueChange={setClarity}
                    minimumTrackTintColor={KingdomColors.primary}
                    maximumTrackTintColor={KingdomColors.gray}
                />
                <Text style={styles.sliderValue}>{Math.round(clarity * 100)}%</Text>
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.darkGray,
        marginBottom: 8,
    },
    connectButton: {
        backgroundColor: KingdomColors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    connected: {
        backgroundColor: KingdomColors.success,
    },
    connectButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    voiceSection: {
        marginBottom: 16,
    },
    voicePicker: {
        maxHeight: 120,
    },
    voiceOption: {
        padding: 8,
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 4,
        marginBottom: 4,
    },
    selectedVoice: {
        borderColor: KingdomColors.primary,
        backgroundColor: KingdomColors.lightGray,
    },
    voiceName: {
        fontWeight: 'bold',
        color: KingdomColors.darkGray,
    },
    voiceCategory: {
        fontSize: 12,
        color: KingdomColors.gray,
    },
    generationSection: {
        marginBottom: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        minHeight: 80,
        color: KingdomColors.darkGray,
    },
    generateButton: {
        backgroundColor: KingdomColors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    generatingButton: {
        backgroundColor: KingdomColors.gray,
    },
    generateButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    toggleLabel: {
        flex: 1,
        fontSize: 16,
        color: KingdomColors.darkGray,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderLabel: {
        flex: 1,
        fontSize: 16,
        color: KingdomColors.darkGray,
    },
    slider: {
        flex: 2,
        height: 40,
    },
    sliderValue: {
        width: 40,
        textAlign: 'right',
        color: KingdomColors.primary,
    },
    modeNote: {
        marginTop: 20,
        fontStyle: 'italic',
        color: KingdomColors.gray,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.white,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: KingdomColors.darkGray,
        marginBottom: 20,
        textAlign: 'center',
    },
    apiKeyInput: {
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        width: '100%',
        marginBottom: 16,
        color: KingdomColors.darkGray,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default VoiceStudioTab; 