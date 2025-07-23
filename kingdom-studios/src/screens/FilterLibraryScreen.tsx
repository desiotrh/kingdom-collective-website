import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Modal,
    FlatList,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface FilterPreset {
    id: string;
    name: string;
    category: 'my-presets' | 'download-packs';
    description: string;
    scripture?: string;
    settings: {
        brightness: number;
        contrast: number;
        saturation: number;
        warmth: number;
        highlights: number;
        shadows: number;
    };
    previewImage?: string;
}

const FilterLibraryScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [presets, setPresets] = useState<FilterPreset[]>([
        {
            id: '1',
            name: 'Golden Hour',
            category: 'my-presets',
            description: 'Warm, golden tones perfect for sunset photos',
            scripture: isFaithMode ? 'The light shines in the darkness...' : undefined,
            settings: {
                brightness: 10,
                contrast: 15,
                saturation: 20,
                warmth: 25,
                highlights: -10,
                shadows: 15,
            },
        },
        {
            id: '2',
            name: 'Faithful Light',
            category: 'my-presets',
            description: 'Soft, ethereal lighting with spiritual warmth',
            scripture: 'Let your light shine before others...',
            settings: {
                brightness: 15,
                contrast: 10,
                saturation: 15,
                warmth: 20,
                highlights: 5,
                shadows: 10,
            },
        },
        {
            id: '3',
            name: 'Encouragement',
            category: 'my-presets',
            description: 'Bright, uplifting tones that inspire confidence',
            settings: {
                brightness: 20,
                contrast: 20,
                saturation: 25,
                warmth: 15,
                highlights: 10,
                shadows: 5,
            },
        },
        {
            id: '4',
            name: 'Vintage Soul',
            category: 'download-packs',
            description: 'Classic film look with modern soul',
            settings: {
                brightness: 5,
                contrast: 30,
                saturation: -10,
                warmth: 30,
                highlights: -15,
                shadows: 25,
            },
        },
        {
            id: '5',
            name: 'Divine Grace',
            category: 'my-presets',
            description: 'Elegant, graceful tones with spiritual depth',
            scripture: 'Grace and peace be multiplied to you...',
            settings: {
                brightness: 8,
                contrast: 12,
                saturation: 18,
                warmth: 22,
                highlights: -5,
                shadows: 12,
            },
        },
    ]);
    const [selectedCategory, setSelectedCategory] = useState<'my-presets' | 'download-packs'>('my-presets');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<FilterPreset | null>(null);
    const [newPreset, setNewPreset] = useState<Partial<FilterPreset>>({
        name: '',
        description: '',
        scripture: '',
        settings: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            warmth: 0,
            highlights: 0,
            shadows: 0,
        },
    });

    const categories = [
        { id: 'my-presets', name: 'My Presets', icon: 'heart' },
        { id: 'download-packs', name: 'Download Packs', icon: 'download' },
    ];

    const createPreset = () => {
        if (!newPreset.name || !newPreset.description) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const preset: FilterPreset = {
            id: Date.now().toString(),
            name: newPreset.name || '',
            category: 'my-presets',
            description: newPreset.description || '',
            scripture: newPreset.scripture,
            settings: newPreset.settings || {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                warmth: 0,
                highlights: 0,
                shadows: 0,
            },
        };

        setPresets([preset, ...presets]);
        setNewPreset({
            name: '',
            description: '',
            scripture: '',
            settings: {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                warmth: 0,
                highlights: 0,
                shadows: 0,
            },
        });
        setShowCreateModal(false);

        Alert.alert(
            'Preset Created',
            isFaithMode
                ? 'Your preset has been blessed and saved. May it bring beauty to your work.'
                : 'Preset created successfully! Ready to use on your images.'
        );
    };

    const applyPreset = (preset: FilterPreset) => {
        setSelectedPreset(preset);
        setShowApplyModal(true);
    };

    const applyToImage = () => {
        Alert.alert(
            'Apply Filter',
            isFaithMode
                ? `Applied "${selectedPreset?.name}" with love and intention.`
                : `Applied "${selectedPreset?.name}" to your image.`
        );
        setShowApplyModal(false);
    };

    const applyToGallery = () => {
        Alert.alert(
            'Apply to Gallery',
            isFaithMode
                ? `Applied "${selectedPreset?.name}" to your entire gallery with blessing.`
                : `Applied "${selectedPreset?.name}" to your entire gallery.`
        );
        setShowApplyModal(false);
    };

    const CreatePresetModal = () => (
        <Modal
            visible={showCreateModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Create Blessed Preset' : 'Create New Preset'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Preset Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newPreset.name}
                            onChangeText={(text) => setNewPreset({ ...newPreset, name: text })}
                            placeholder="Enter preset name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.textInput}
                            value={newPreset.description}
                            onChangeText={(text) => setNewPreset({ ...newPreset, description: text })}
                            placeholder="Describe your preset..."
                            multiline
                        />
                    </View>

                    {isFaithMode && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Scripture (Optional)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newPreset.scripture}
                                onChangeText={(text) => setNewPreset({ ...newPreset, scripture: text })}
                                placeholder="Add a scripture that inspires this preset..."
                                multiline
                            />
                        </View>
                    )}

                    <Text style={styles.settingsTitle}>Filter Settings</Text>

                    {Object.entries(newPreset.settings || {}).map(([key, value]) => (
                        <View key={key} style={styles.settingRow}>
                            <Text style={styles.settingLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={value.toString()}
                                onChangeText={(text) => {
                                    const numValue = parseInt(text) || 0;
                                    setNewPreset({
                                        ...newPreset,
                                        settings: {
                                            ...newPreset.settings,
                                            [key]: numValue,
                                        },
                                    });
                                }}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                    ))}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowCreateModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={createPreset}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Create & Bless' : 'Create Preset'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const ApplyPresetModal = () => (
        <Modal
            visible={showApplyModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Apply Filter</Text>
                    {selectedPreset && (
                        <>
                            <Text style={styles.presetName}>{selectedPreset.name}</Text>
                            <Text style={styles.presetDescription}>{selectedPreset.description}</Text>
                            {selectedPreset.scripture && (
                                <View style={styles.scriptureContainer}>
                                    <Text style={styles.scriptureLabel}>Scripture:</Text>
                                    <Text style={styles.scriptureText}>{selectedPreset.scripture}</Text>
                                </View>
                            )}

                            <View style={styles.settingsPreview}>
                                <Text style={styles.settingsTitle}>Settings:</Text>
                                {Object.entries(selectedPreset.settings).map(([key, value]) => (
                                    <Text key={key} style={styles.settingText}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                    </Text>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={applyToImage}
                            >
                                <Ionicons name="image" size={20} color={KingdomColors.softWhite} />
                                <Text style={styles.applyButtonText}>Apply to Image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={applyToGallery}
                            >
                                <Ionicons name="images" size={20} color={KingdomColors.softWhite} />
                                <Text style={styles.applyButtonText}>Apply to Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowApplyModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    const renderPreset = ({ item }: { item: FilterPreset }) => (
        <TouchableOpacity
            style={styles.presetCard}
            onPress={() => applyPreset(item)}
        >
            <View style={styles.presetHeader}>
                <Text style={styles.presetName}>{item.name}</Text>
                <View style={styles.presetIcons}>
                    {item.scripture && (
                        <Ionicons name="book" size={16} color={KingdomColors.bronze} />
                    )}
                    <Ionicons name="heart" size={16} color={KingdomColors.bronze} />
                </View>
            </View>

            <Text style={styles.presetDescription}>{item.description}</Text>

            {item.scripture && (
                <View style={styles.scripturePreview}>
                    <Text style={styles.scriptureLabel}>Scripture:</Text>
                    <Text style={styles.scriptureText} numberOfLines={1}>
                        {item.scripture}
                    </Text>
                </View>
            )}

            <View style={styles.settingsPreview}>
                <Text style={styles.settingsLabel}>Settings:</Text>
                <Text style={styles.settingsText}>
                    B: {item.settings.brightness} | C: {item.settings.contrast} | S: {item.settings.saturation}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Filter Library - Faith Mode' : 'Filter Library'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Create filters that honor God and enhance beauty'
                        : 'Create and apply beautiful filter presets to your images'
                    }
                </Text>
            </View>

            <View style={styles.categoryTabs}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryTab,
                            selectedCategory === category.id && styles.selectedCategory
                        ]}
                        onPress={() => setSelectedCategory(category.id as 'my-presets' | 'download-packs')}
                    >
                        <Ionicons
                            name={category.icon as any}
                            size={20}
                            color={selectedCategory === category.id ? KingdomColors.softWhite : KingdomColors.bronze}
                        />
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category.id && styles.selectedCategoryText
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateModal(true)}
            >
                <Ionicons name="add-circle" size={24} color={KingdomColors.softWhite} />
                <Text style={styles.createButtonText}>
                    {isFaithMode ? 'Create Blessed Preset' : 'Create New Preset'}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={presets.filter(preset => preset.category === selectedCategory)}
                renderItem={renderPreset}
                keyExtractor={(item) => item.id}
                style={styles.presetsList}
                scrollEnabled={false}
            />

            <CreatePresetModal />
            <ApplyPresetModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.matteBlack,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.bronze,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    categoryTabs: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: KingdomColors.dustGold,
        margin: 10,
        borderRadius: 10,
    },
    categoryTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
    selectedCategory: {
        backgroundColor: KingdomColors.bronze,
    },
    categoryText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    selectedCategoryText: {
        color: KingdomColors.softWhite,
    },
    createButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    createButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    presetsList: {
        padding: 20,
    },
    presetCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    presetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    presetName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    presetIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    presetDescription: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    scripturePreview: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: KingdomColors.bronze,
        borderRadius: 5,
    },
    scriptureLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    scriptureText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    settingsPreview: {
        marginTop: 5,
    },
    settingsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    settingsText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    input: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    textInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 60,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    settingsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'EB Garamond',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    settingLabel: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    settingInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 8,
        borderRadius: 5,
        width: 60,
        textAlign: 'center',
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    primaryButton: {
        backgroundColor: KingdomColors.bronze,
    },
    primaryButtonText: {
        color: KingdomColors.softWhite,
    },
    scriptureContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: KingdomColors.bronze,
        borderRadius: 8,
    },
    applyButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    applyButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    settingText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginBottom: 2,
        fontFamily: 'Sora',
    },
});

export default FilterLibraryScreen; 