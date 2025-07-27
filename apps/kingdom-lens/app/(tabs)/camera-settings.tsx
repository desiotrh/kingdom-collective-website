import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Modal,
    Alert,
    Switch,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

interface CameraSetting {
    id: string;
    name: string;
    tag?: string;
    iso: string;
    shutterSpeed: string;
    aperture: string;
    lens: string;
    notes: string;
    isAnointed?: boolean;
    intention?: string;
}

export default function CameraSettingsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState<CameraSetting | null>(null);
    const [customSetting, setCustomSetting] = useState({
        name: '',
        tag: '',
        iso: '',
        shutterSpeed: '',
        aperture: '',
        lens: '',
        notes: '',
        intention: '',
    });

    const [settings, setSettings] = useState<CameraSetting[]>([
        {
            id: '1',
            name: 'Golden Hour',
            tag: faithMode ? 'Prophetic Session' : 'Bold Light',
            iso: '100',
            shutterSpeed: '1/125',
            aperture: 'f/2.8',
            lens: '50mm f/1.4',
            notes: faithMode
                ? 'Try +0.7 EV for highlights. Capture His light in every frame.'
                : 'Try +0.7 EV for highlights. Perfect for warm, natural light.',
            isAnointed: faithMode,
        },
        {
            id: '2',
            name: 'Indoor Natural',
            tag: faithMode ? 'Prophetic Session' : 'Soft Beauty',
            iso: '400',
            shutterSpeed: '1/60',
            aperture: 'f/4',
            lens: '35mm f/1.8',
            notes: faithMode
                ? 'Use window light. Let your lens reflect His beauty.'
                : 'Use window light. Soft, flattering illumination.',
            isAnointed: faithMode,
        },
        {
            id: '3',
            name: 'Backlight Portrait',
            tag: faithMode ? 'Prophetic Session' : 'Legacy Look',
            iso: '200',
            shutterSpeed: '1/200',
            aperture: 'f/2.8',
            lens: '85mm f/1.4',
            notes: faithMode
                ? 'Expose for shadows. Photograph with purpose and praise.'
                : 'Expose for shadows. Creates dramatic, ethereal portraits.',
            isAnointed: faithMode,
        },
        {
            id: '4',
            name: 'Night City',
            tag: faithMode ? 'Prophetic Session' : 'Bold Light',
            iso: '800',
            shutterSpeed: '1/30',
            aperture: 'f/5.6',
            lens: '24mm f/2.8',
            notes: faithMode
                ? 'Use tripod. Capture the city lights He created.'
                : 'Use tripod. Perfect for urban night photography.',
            isAnointed: faithMode,
        },
        {
            id: '5',
            name: 'Studio Portrait',
            tag: faithMode ? 'Prophetic Session' : 'Soft Beauty',
            iso: '100',
            shutterSpeed: '1/125',
            aperture: 'f/8',
            lens: '70-200mm f/2.8',
            notes: faithMode
                ? 'Two-light setup. Create portraits that honor His creation.'
                : 'Two-light setup. Professional studio lighting.',
            isAnointed: faithMode,
        },
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Camera Settings for His Glory';
        } else if (encouragementMode) {
            return 'Camera Settings for Growth';
        }
        return 'Camera Settings';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Optimize your camera for His purpose';
        } else if (encouragementMode) {
            return 'Optimize your camera for your vision';
        }
        return 'Professional camera settings and presets';
    };

    const handleCreateSetting = () => {
        if (!customSetting.name || !customSetting.iso || !customSetting.shutterSpeed || !customSetting.aperture) {
            Alert.alert('Missing Info', 'Please fill in all required fields');
            return;
        }

        const newSetting: CameraSetting = {
            id: Date.now().toString(),
            name: customSetting.name,
            tag: customSetting.tag,
            iso: customSetting.iso,
            shutterSpeed: customSetting.shutterSpeed,
            aperture: customSetting.aperture,
            lens: customSetting.lens,
            notes: customSetting.notes,
            intention: customSetting.intention,
            isAnointed: faithMode,
        };

        setSettings(prev => [newSetting, ...prev]);
        setCustomSetting({
            name: '',
            tag: '',
            iso: '',
            shutterSpeed: '',
            aperture: '',
            lens: '',
            notes: '',
            intention: '',
        });
        setShowCreateModal(false);
        Alert.alert('Setting Created', 'Your custom camera setting has been saved!');
    };

    const handleAnointSetting = (settingId: string) => {
        setSettings(prev => prev.map(setting =>
            setting.id === settingId
                ? { ...setting, isAnointed: !setting.isAnointed }
                : setting
        ));
        Alert.alert('Setting Anointed', 'This setting has been blessed for His glory');
    };

    const renderSettingCard = (setting: CameraSetting) => (
        <TouchableOpacity
            key={setting.id}
            style={[
                styles.settingCard,
                { backgroundColor: theme.colors.surface },
                setting.isAnointed && { borderColor: theme.colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setSelectedSetting(setting)}
        >
            <View style={styles.settingHeader}>
                <Text style={[styles.settingName, { color: theme.colors.text }]}>
                    {setting.name}
                </Text>
                {setting.tag && (
                    <View style={[styles.tagContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                            {setting.tag}
                        </Text>
                    </View>
                )}
                {setting.isAnointed && (
                    <Text style={[styles.anointedIcon, { color: theme.colors.primary }]}>
                        ✝️
                    </Text>
                )}
            </View>

            <View style={styles.settingSpecs}>
                <View style={styles.specItem}>
                    <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>ISO</Text>
                    <Text style={[styles.specValue, { color: theme.colors.text }]}>{setting.iso}</Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Shutter</Text>
                    <Text style={[styles.specValue, { color: theme.colors.text }]}>{setting.shutterSpeed}</Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Aperture</Text>
                    <Text style={[styles.specValue, { color: theme.colors.text }]}>{setting.aperture}</Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Lens</Text>
                    <Text style={[styles.specValue, { color: theme.colors.text }]}>{setting.lens}</Text>
                </View>
            </View>

            <Text style={[styles.settingNotes, { color: theme.colors.textSecondary }]}>
                {setting.notes}
            </Text>

            {setting.intention && (
                <Text style={[styles.intentionText, { color: theme.colors.primary }]}>
                    Intention: {setting.intention}
                </Text>
            )}

            {faithMode && (
                <TouchableOpacity
                    style={[styles.anointButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleAnointSetting(setting.id)}
                >
                    <Text style={[styles.anointButtonText, { color: theme.colors.surface }]}>
                        {setting.isAnointed ? 'Anointed ✝️' : 'Anoint Setting'}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                        {faithTheme.watermark}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {getScreenTitle()}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {getScreenSubtitle()}
                    </Text>
                </View>

                {/* Faith Mode Prompt */}
                {faithMode && (
                    <View style={[styles.faithPrompt, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.faithPromptText, { color: theme.colors.primary }]}>
                            What atmosphere are you capturing spiritually?
                        </Text>
                    </View>
                )}

                {/* Encouragement Mode Prompt */}
                {encouragementMode && (
                    <View style={[styles.encouragementPrompt, { backgroundColor: theme.colors.secondary + '20' }]}>
                        <Text style={[styles.encouragementPromptText, { color: theme.colors.secondary }]}>
                            Capture strength / gentleness / breakthrough
                        </Text>
                    </View>
                )}

                {/* Settings Grid */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Shooting Scenarios
                    </Text>
                    {settings.map(renderSettingCard)}
                </View>

                {/* Create Custom Setting Button */}
                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setShowCreateModal(true)}
                >
                    <Text style={[styles.createButtonText, { color: theme.colors.surface }]}>
                        Create Custom Setting
                    </Text>
                </TouchableOpacity>

                {/* Create Setting Modal */}
                <Modal
                    visible={showCreateModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                                Create Custom Setting
                            </Text>
                            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Setting Name *
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={customSetting.name}
                                    onChangeText={(text) => setCustomSetting(prev => ({ ...prev, name: text }))}
                                    placeholder="e.g., Sunset Portrait"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Tag
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={customSetting.tag}
                                    onChangeText={(text) => setCustomSetting(prev => ({ ...prev, tag: text }))}
                                    placeholder={faithMode ? "Prophetic Session" : "Bold Light"}
                                />
                            </View>

                            <View style={styles.specsRow}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        ISO *
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={customSetting.iso}
                                        onChangeText={(text) => setCustomSetting(prev => ({ ...prev, iso: text }))}
                                        placeholder="100"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        Shutter Speed *
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={customSetting.shutterSpeed}
                                        onChangeText={(text) => setCustomSetting(prev => ({ ...prev, shutterSpeed: text }))}
                                        placeholder="1/125"
                                    />
                                </View>
                            </View>

                            <View style={styles.specsRow}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        Aperture *
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={customSetting.aperture}
                                        onChangeText={(text) => setCustomSetting(prev => ({ ...prev, aperture: text }))}
                                        placeholder="f/2.8"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        Lens
                                    </Text>
                                    <TextInput
                                        style={[styles.textInput, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={customSetting.lens}
                                        onChangeText={(text) => setCustomSetting(prev => ({ ...prev, lens: text }))}
                                        placeholder="50mm f/1.4"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Notes
                                </Text>
                                <TextInput
                                    style={[styles.textArea, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={customSetting.notes}
                                    onChangeText={(text) => setCustomSetting(prev => ({ ...prev, notes: text }))}
                                    placeholder="Add notes about this setting..."
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            {encouragementMode && (
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        Intention
                                    </Text>
                                    <TextInput
                                        style={[styles.textArea, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={customSetting.intention}
                                        onChangeText={(text) => setCustomSetting(prev => ({ ...prev, intention: text }))}
                                        placeholder="What feeling are you trying to capture?"
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleCreateSetting}
                            >
                                <Text style={[styles.saveButtonText, { color: theme.colors.surface }]}>
                                    Save Setting
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    watermark: {
        fontSize: 20,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'EB Garamond, serif',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    faithPrompt: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    faithPromptText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'EB Garamond, serif',
    },
    encouragementPrompt: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    encouragementPromptText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    settingsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'EB Garamond, serif',
    },
    settingCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    settingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'EB Garamond, serif',
    },
    tagContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    anointedIcon: {
        fontSize: 16,
    },
    settingSpecs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    specItem: {
        alignItems: 'center',
    },
    specLabel: {
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Sora, sans-serif',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    settingNotes: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    intentionText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    anointButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    anointButtonText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    createButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'EB Garamond, serif',
    },
    closeButton: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    textInput: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
    },
    textArea: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    specsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
}); 