import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

export default function MockupCanvasScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);

    const templates = [
        { id: 'phone', name: 'Phone Mockup', icon: '📱', preview: 'https://via.placeholder.com/200x400' },
        { id: 'laptop', name: 'Laptop Mockup', icon: '💻', preview: 'https://via.placeholder.com/400x300' },
        { id: 'tablet', name: 'Tablet Mockup', icon: '📱', preview: 'https://via.placeholder.com/300x400' },
        { id: 'print', name: 'Print Layout', icon: '🖨️', preview: 'https://via.placeholder.com/400x500' },
    ];

    const overlays = [
        { id: 'text', name: 'Text Overlay', icon: '📝' },
        { id: 'logo', name: 'Logo Placement', icon: '🏷️' },
        { id: 'frame', name: 'Frame Border', icon: '🖼️' },
        { id: 'shadow', name: 'Shadow Effect', icon: '🌫️' },
    ];

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Design for His Glory';
        } else if (encouragementMode) {
            return 'Design with Confidence';
        }
        return 'Mockup Canvas';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Create mockups that reflect His beauty';
        } else if (encouragementMode) {
            return 'Your designs tell your story';
        }
        return 'Professional mockup design tools';
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        Alert.alert('Template Selected', `You selected ${templateId} template`);
    };

    const handleOverlaySelect = (overlayId: string) => {
        setSelectedOverlay(overlayId);
        Alert.alert('Overlay Selected', `You selected ${overlayId} overlay`);
    };

    const handleExport = () => {
        if (!selectedTemplate) {
            Alert.alert('No Template', 'Please select a template first');
            return;
        }
        Alert.alert('Export Mockup', 'Mockup exported successfully!');
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

                {/* Canvas Preview */}
                <View style={[styles.canvasContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.canvasTitle, { color: theme.colors.text }]}>
                        Canvas Preview
                    </Text>
                    <View style={[styles.canvas, { backgroundColor: theme.colors.background }]}>
                        {selectedTemplate ? (
                            <View style={styles.canvasContent}>
                                <Text style={[styles.canvasText, { color: theme.colors.textSecondary }]}>
                                    Template: {selectedTemplate}
                                </Text>
                                {selectedOverlay && (
                                    <Text style={[styles.canvasText, { color: theme.colors.textSecondary }]}>
                                        Overlay: {selectedOverlay}
                                    </Text>
                                )}
                                {faithMode && (
                                    <Text style={[styles.faithOverlay, { color: theme.colors.primary }]}>
                                        {faithTheme.overlayText}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text style={[styles.canvasPlaceholder, { color: theme.colors.textSecondary }]}>
                                Select a template to begin
                            </Text>
                        )}
                    </View>
                </View>

                {/* Templates Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Templates
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {templates.map((template) => (
                            <TouchableOpacity
                                key={template.id}
                                style={[
                                    styles.templateCard,
                                    { backgroundColor: theme.colors.surface },
                                    selectedTemplate === template.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                                ]}
                                onPress={() => handleTemplateSelect(template.id)}
                            >
                                <Text style={styles.templateIcon}>{template.icon}</Text>
                                <Text style={[styles.templateName, { color: theme.colors.text }]}>
                                    {template.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Overlays Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Overlays
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {overlays.map((overlay) => (
                            <TouchableOpacity
                                key={overlay.id}
                                style={[
                                    styles.overlayCard,
                                    { backgroundColor: theme.colors.surface },
                                    selectedOverlay === overlay.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                                ]}
                                onPress={() => handleOverlaySelect(overlay.id)}
                            >
                                <Text style={styles.overlayIcon}>{overlay.icon}</Text>
                                <Text style={[styles.overlayName, { color: theme.colors.text }]}>
                                    {overlay.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleExport}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Export Mockup
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                        onPress={() => Alert.alert('Save', 'Mockup saved to library')}
                    >
                        <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                            Save to Library
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
    canvasContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    canvasTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Sora, sans-serif',
    },
    canvas: {
        height: 200,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    canvasContent: {
        alignItems: 'center',
    },
    canvasText: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'Sora, sans-serif',
    },
    faithOverlay: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
        fontFamily: 'EB Garamond, serif',
    },
    canvasPlaceholder: {
        fontSize: 14,
        fontFamily: 'Sora, sans-serif',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        fontFamily: 'EB Garamond, serif',
    },
    templateCard: {
        width: 120,
        height: 100,
        marginRight: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    templateIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    templateName: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    overlayCard: {
        width: 100,
        height: 80,
        marginRight: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    overlayIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    overlayName: {
        fontSize: 10,
        textAlign: 'center',
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
}); 