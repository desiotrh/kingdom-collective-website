import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    Alert,
    Switch,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GalleryData {
    id: string;
    name: string;
    description: string;
    password?: string;
    createdAt: string;
    imageCount: number;
    isProtected: boolean;
}

export default function CreateGalleryScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [galleryName, setGalleryName] = useState('');
    const [description, setDescription] = useState('');
    const [isProtected, setIsProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Create Sacred Space';
        } else if (encouragementMode) {
            return 'Create Your Gallery';
        }
        return 'Create Gallery';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Share His light with those you trust';
        } else if (encouragementMode) {
            return 'Share your story with intention';
        }
        return 'Create a beautiful gallery to share';
    };

    const getPasswordPrompt = () => {
        if (faithMode) {
            return 'For eyes the Lord has trusted';
        } else if (encouragementMode) {
            return 'This gallery is protected to honor their story';
        }
        return 'Optional: Add password protection';
    };

    const handleCreateGallery = async () => {
        if (!galleryName.trim()) {
            Alert.alert('Missing Name', 'Please enter a gallery name');
            return;
        }

        if (isProtected && !password.trim()) {
            Alert.alert('Missing Password', 'Please enter a password for protection');
            return;
        }

        if (isProtected && password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match');
            return;
        }

        try {
            const newGallery: GalleryData = {
                id: Date.now().toString(),
                name: galleryName.trim(),
                description: description.trim(),
                password: isProtected ? password : undefined,
                createdAt: new Date().toISOString(),
                imageCount: 0,
                isProtected,
            };

            // Save to AsyncStorage
            const existingGalleries = await AsyncStorage.getItem('@kingdom_lens_galleries');
            const galleries: GalleryData[] = existingGalleries ? JSON.parse(existingGalleries) : [];
            galleries.push(newGallery);
            await AsyncStorage.setItem('@kingdom_lens_galleries', JSON.stringify(galleries));

            const successMessage = faithMode
                ? 'Gallery created with His blessing'
                : encouragementMode
                    ? 'Gallery created with intention'
                    : 'Gallery created successfully';

            Alert.alert('Success', successMessage, [
                {
                    text: 'OK',
                    onPress: () => {
                        // Reset form
                        setGalleryName('');
                        setDescription('');
                        setIsProtected(false);
                        setPassword('');
                        setConfirmPassword('');
                    }
                }
            ]);
        } catch (error) {
            console.error('Error creating gallery:', error);
            Alert.alert('Error', 'Failed to create gallery');
        }
    };

    const handlePasswordToggle = (value: boolean) => {
        setIsProtected(value);
        if (!value) {
            setPassword('');
            setConfirmPassword('');
        }
    };

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

                {/* Gallery Form */}
                <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                    {/* Gallery Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Gallery Name *
                        </Text>
                        <TextInput
                            style={[styles.textInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            value={galleryName}
                            onChangeText={setGalleryName}
                            placeholder="Enter gallery name"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Description
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe your gallery"
                            placeholderTextColor={theme.colors.textSecondary}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Password Protection */}
                    <View style={styles.protectionSection}>
                        <View style={styles.protectionHeader}>
                            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                Password Protection
                            </Text>
                            <Switch
                                value={isProtected}
                                onValueChange={handlePasswordToggle}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={isProtected ? theme.colors.surface : theme.colors.textSecondary}
                            />
                        </View>

                        {isProtected && (
                            <View style={styles.passwordContainer}>
                                <Text style={[styles.passwordPrompt, { color: theme.colors.textSecondary }]}>
                                    {getPasswordPrompt()}
                                </Text>

                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    secureTextEntry
                                />

                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm password"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    secureTextEntry
                                />
                            </View>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleCreateGallery}
                    >
                        <Text style={[styles.createButtonText, { color: theme.colors.surface }]}>
                            {faithMode ? 'Create Sacred Gallery' : encouragementMode ? 'Create with Intention' : 'Create Gallery'}
                        </Text>
                    </TouchableOpacity>
                </View>
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
        fontSize: 24,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    formContainer: {
        borderRadius: 12,
        padding: 20,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    protectionSection: {
        marginTop: 8,
    },
    protectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    passwordContainer: {
        marginTop: 12,
    },
    passwordPrompt: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 12,
        textAlign: 'center',
    },
    actions: {
        paddingVertical: 24,
    },
    createButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 