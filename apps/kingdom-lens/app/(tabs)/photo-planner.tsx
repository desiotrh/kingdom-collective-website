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
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

export default function PhotoPlannerScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const planningPrompts = faithMode ? [
        'What story does this location tell?',
        'How can you capture God\'s light here?',
        'What emotions should this photo evoke?',
    ] : encouragementMode ? [
        'What makes this location special to you?',
        'How can you show your unique perspective?',
        'What story do you want to tell?',
    ] : [
        'What\'s the main subject of this shoot?',
        'What mood are you going for?',
        'Any specific technical requirements?',
    ];

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Plan for His Glory';
        } else if (encouragementMode) {
            return 'Plan with Purpose';
        }
        return 'Photo Planner';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Plan shoots that reflect His beauty';
        } else if (encouragementMode) {
            return 'Your vision, your story';
        }
        return 'Professional shoot planning tools';
    };

    const handleSavePlan = () => {
        if (!selectedDate || !location) {
            Alert.alert('Missing Info', 'Please fill in date and location');
            return;
        }
        Alert.alert('Plan Saved', 'Your photo shoot plan has been saved!');
    };

    const handleClearPlan = () => {
        setSelectedDate('');
        setSelectedTime('');
        setLocation('');
        setNotes('');
        Alert.alert('Plan Cleared', 'All fields have been cleared');
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

                {/* Planning Form */}
                <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                        Shoot Details
                    </Text>

                    {/* Date Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Date
                        </Text>
                        <TextInput
                            style={[styles.textInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Select date (e.g., Dec 15, 2024)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={selectedDate}
                            onChangeText={setSelectedDate}
                        />
                    </View>

                    {/* Time Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Time
                        </Text>
                        <TextInput
                            style={[styles.textInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Select time (e.g., 3:00 PM)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={selectedTime}
                            onChangeText={setSelectedTime}
                        />
                    </View>

                    {/* Location Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Location
                        </Text>
                        <TextInput
                            style={[styles.textInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Enter location"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>

                    {/* Notes Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                            Notes
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Add notes about the shoot..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Planning Prompts */}
                <View style={[styles.promptsContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.promptsTitle, { color: theme.colors.text }]}>
                        Planning Prompts
                    </Text>
                    {planningPrompts.map((prompt, index) => (
                        <View key={index} style={styles.promptItem}>
                            <Text style={[styles.promptText, { color: theme.colors.textSecondary }]}>
                                {prompt}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSavePlan}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Save Plan
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                        onPress={handleClearPlan}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Clear Plan
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Faith Mode Overlay */}
                {faithMode && (
                    <View style={[styles.faithOverlay, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.faithOverlayText, { color: theme.colors.primary }]}>
                            {faithTheme.overlayText}
                        </Text>
                    </View>
                )}
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
    formContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'EB Garamond, serif',
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
    promptsContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    promptsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'EB Garamond, serif',
    },
    promptItem: {
        marginBottom: 12,
    },
    promptText: {
        fontSize: 14,
        fontStyle: 'italic',
        fontFamily: 'Sora, sans-serif',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    faithOverlay: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    faithOverlayText: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'EB Garamond, serif',
    },
}); 