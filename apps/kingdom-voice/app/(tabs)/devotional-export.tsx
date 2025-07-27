import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    Animated,
    Dimensions,
    Switch,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: string;
    tags: string[];
    date: string;
    faithMode: boolean;
    verse?: string;
    isDraft: boolean;
    entryType?: 'journal' | 'dream' | 'devotion';
}

interface ExportBundle {
    id: string;
    title: string;
    entries: JournalEntry[];
    format: 'pdf' | 'text';
    createdAt: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function DevotionalExportScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();

    const [devotionals, setDevotionals] = useState<JournalEntry[]>([]);
    const [selectedDevotionals, setSelectedDevotionals] = useState<string[]>([]);
    const [exportTitle, setExportTitle] = useState('');
    const [exportFormat, setExportFormat] = useState<'pdf' | 'text'>('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [prayOverFile, setPrayOverFile] = useState(false);

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimation = useRef(new Animated.Value(50)).current;

    // Animate on load
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Load devotionals on mount
    useEffect(() => {
        loadDevotionals();
    }, []);

    const loadDevotionals = async () => {
        try {
            const entriesKey = 'journal_entries';
            const storedEntries = await AsyncStorage.getItem(entriesKey);

            if (storedEntries) {
                const allEntries: JournalEntry[] = JSON.parse(storedEntries);
                // Filter for devotionals (faith mode entries with verses or prayer tags)
                const devotionalEntries = allEntries.filter(entry =>
                    !entry.isDraft && (
                        entry.faithMode ||
                        entry.verse ||
                        entry.tags.includes('Prayer') ||
                        entry.tags.includes('Devotion') ||
                        entry.entryType === 'devotion'
                    )
                );

                setDevotionals(devotionalEntries);
            }
        } catch (error) {
            console.error('Error loading devotionals:', error);
            Alert.alert('Error', 'Failed to load devotionals.');
        }
    };

    const toggleDevotionalSelection = (devotionalId: string) => {
        setSelectedDevotionals(prev =>
            prev.includes(devotionalId)
                ? prev.filter(id => id !== devotionalId)
                : [...prev, devotionalId]
        );
    };

    const selectAllDevotionals = () => {
        setSelectedDevotionals(devotionals.map(d => d.id));
    };

    const clearSelection = () => {
        setSelectedDevotionals([]);
    };

    const getSelectedDevotionals = () => {
        return devotionals.filter(d => selectedDevotionals.includes(d.id));
    };

    const generatePDF = async (devotionals: JournalEntry[], title: string) => {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
            const { width, height } = page.getSize();

            // Add fonts
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            let yPosition = height - 50;

            // Add title
            page.drawText(title || 'Devotional Collection', {
                x: 50,
                y: yPosition,
                size: 24,
                font: helveticaBold,
                color: rgb(0.2, 0.2, 0.2),
            });
            yPosition -= 40;

            // Add subtitle
            page.drawText(`Generated with Kingdom Voice`, {
                x: 50,
                y: yPosition,
                size: 12,
                font: helveticaFont,
                color: rgb(0.5, 0.5, 0.5),
            });
            yPosition -= 30;

            // Add faith mode watermark if enabled
            if (isFaithMode) {
                page.drawText('✝️', {
                    x: width - 80,
                    y: height - 50,
                    size: 20,
                    font: helveticaFont,
                    color: rgb(0.8, 0.8, 0.8),
                });
            }

            // Add devotionals
            for (let i = 0; i < devotionals.length; i++) {
                const devotional = devotionals[i];

                // Check if we need a new page
                if (yPosition < 100) {
                    page = pdfDoc.addPage([595.28, 841.89]);
                    yPosition = height - 50;
                }

                // Add devotional title
                page.drawText(devotional.title, {
                    x: 50,
                    y: yPosition,
                    size: 16,
                    font: helveticaBold,
                    color: rgb(0.2, 0.2, 0.2),
                });
                yPosition -= 25;

                // Add date
                const date = new Date(devotional.date).toLocaleDateString();
                page.drawText(date, {
                    x: 50,
                    y: yPosition,
                    size: 10,
                    font: helveticaFont,
                    color: rgb(0.5, 0.5, 0.5),
                });
                yPosition -= 20;

                // Add verse if present
                if (devotional.verse) {
                    page.drawText(`"${devotional.verse}"`, {
                        x: 50,
                        y: yPosition,
                        size: 12,
                        font: helveticaFont,
                        color: rgb(0.3, 0.3, 0.3),
                    });
                    yPosition -= 20;
                }

                // Add content (wrap text)
                const words = devotional.content.split(' ');
                let line = '';
                const maxWidth = width - 100;

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const textWidth = helveticaFont.widthOfTextAtSize(testLine, 12);

                    if (textWidth > maxWidth && line !== '') {
                        page.drawText(line, {
                            x: 50,
                            y: yPosition,
                            size: 12,
                            font: helveticaFont,
                            color: rgb(0.2, 0.2, 0.2),
                        });
                        yPosition -= 15;
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }

                // Draw remaining line
                if (line) {
                    page.drawText(line, {
                        x: 50,
                        y: yPosition,
                        size: 12,
                        font: helveticaFont,
                        color: rgb(0.2, 0.2, 0.2),
                    });
                    yPosition -= 20;
                }

                // Add separator
                if (i < devotionals.length - 1) {
                    page.drawLine({
                        start: { x: 50, y: yPosition },
                        end: { x: width - 50, y: yPosition },
                        thickness: 1,
                        color: rgb(0.8, 0.8, 0.8),
                    });
                    yPosition -= 30;
                }
            }

            // Add footer
            const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
            lastPage.drawText('Written with Kingdom Voice', {
                x: 50,
                y: 50,
                size: 10,
                font: helveticaFont,
                color: rgb(0.5, 0.5, 0.5),
            });

            const pdfBytes = await pdfDoc.save();
            return pdfBytes;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    };

    const generateText = (devotionals: JournalEntry[], title: string) => {
        let text = `${title || 'Devotional Collection'}\n`;
        text += `Generated with Kingdom Voice\n\n`;

        devotionals.forEach((devotional, index) => {
            text += `${devotional.title}\n`;
            text += `${new Date(devotional.date).toLocaleDateString()}\n\n`;

            if (devotional.verse) {
                text += `"${devotional.verse}"\n\n`;
            }

            text += `${devotional.content}\n\n`;

            if (index < devotionals.length - 1) {
                text += '─'.repeat(50) + '\n\n';
            }
        });

        text += '\nWritten with Kingdom Voice';
        return text;
    };

    const exportDevotionals = async () => {
        if (selectedDevotionals.length === 0) {
            Alert.alert('No Selection', 'Please select at least one devotional to export.');
            return;
        }

        setIsExporting(true);

        try {
            const selectedEntries = getSelectedDevotionals();
            const title = exportTitle || 'Devotional Collection';

            let fileContent: string | Uint8Array;
            let fileName: string;
            let mimeType: string;

            if (exportFormat === 'pdf') {
                fileContent = await generatePDF(selectedEntries, title);
                fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                mimeType = 'application/pdf';
            } else {
                fileContent = generateText(selectedEntries, title);
                fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                mimeType = 'text/plain';
            }

            // Save to device
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            if (exportFormat === 'pdf') {
                await FileSystem.writeAsStringAsync(fileUri, Buffer.from(fileContent as Uint8Array).toString('base64'), {
                    encoding: FileSystem.EncodingType.Base64,
                });
            } else {
                await FileSystem.writeAsStringAsync(fileUri, fileContent as string);
            }

            // Share file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType,
                    dialogTitle: `Share ${title}`,
                });
            } else {
                Alert.alert(
                    'Export Complete',
                    `Your devotional has been saved as ${fileName}`,
                    [{ text: 'OK' }]
                );
            }

            // Faith mode prayer alert
            if (prayOverFile && isFaithMode) {
                Alert.alert(
                    'Prayer Reminder',
                    'Take a moment to pray over this devotional before sharing it with others.',
                    [{ text: 'Amen' }]
                );
            }

        } catch (error) {
            console.error('Error exporting devotionals:', error);
            Alert.alert('Export Error', 'Failed to export devotionals. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const previewExport = () => {
        if (selectedDevotionals.length === 0) {
            Alert.alert('No Selection', 'Please select at least one devotional to preview.');
            return;
        }

        const selectedEntries = getSelectedDevotionals();
        const title = exportTitle || 'Devotional Collection';

        if (exportFormat === 'text') {
            const previewText = generateText(selectedEntries, title);
            setPreviewContent(previewText);
            setShowPreviewModal(true);
        } else {
            Alert.alert('Preview', 'PDF preview is not available. The file will be generated when you export.');
        }
    };

    const renderDevotionalCard = (devotional: JournalEntry) => {
        const isSelected = selectedDevotionals.includes(devotional.id);

        return (
            <TouchableOpacity
                key={devotional.id}
                style={[
                    styles.devotionalCard,
                    {
                        backgroundColor: isSelected ? colors.softGold : colors.cream,
                        borderColor: devotional.faithMode ? colors.softGold : colors.skyBlue,
                        borderWidth: devotional.faithMode ? 2 : 1,
                        opacity: fadeAnimation,
                        transform: [{ translateY: slideAnimation }]
                    }
                ]}
                onPress={() => toggleDevotionalSelection(devotional.id)}
            >
                {/* Selection indicator */}
                <View style={[styles.selectionIndicator, {
                    backgroundColor: isSelected ? colors.cream : 'transparent',
                    borderColor: colors.charcoalInk
                }]}>
                    {isSelected && (
                        <Text style={[styles.checkmark, { color: colors.charcoalInk }]}>✓</Text>
                    )}
                </View>

                {/* Faith mode watermark */}
                {devotional.faithMode && (
                    <View style={[styles.faithWatermark, { opacity: 0.1 }]}>
                        <Text style={[styles.faithWatermarkText, { color: colors.softGold }]}>✝️</Text>
                    </View>
                )}

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text style={[styles.devotionalTitle, { color: colors.charcoalInk }]} numberOfLines={2}>
                        {devotional.title}
                    </Text>

                    <Text style={[styles.devotionalDate, { color: colors.charcoalInk + '80' }]}>
                        {new Date(devotional.date).toLocaleDateString()}
                    </Text>

                    <Text style={[styles.devotionalPreview, { color: colors.charcoalInk + 'CC' }]} numberOfLines={3}>
                        {devotional.content}
                    </Text>

                    {devotional.verse && (
                        <View style={[styles.verseContainer, { backgroundColor: colors.softGold + '20' }]}>
                            <Text style={[styles.verseText, { color: colors.charcoalInk }]} numberOfLines={2}>
                                "{devotional.verse}"
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {isFaithMode ? '✝️ Export Devotionals' : 'Export Devotionals'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
                    {selectedDevotionals.length} of {devotionals.length} selected
                </Text>
            </View>

            {/* Encouragement Message */}
            {isEncouragementMode && (
                <View style={[styles.encouragementCard, { backgroundColor: colors.warmBeige }]}>
                    <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
                        💝 Share Your Light
                    </Text>
                    <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
                        Your devotionals can inspire others. Share the wisdom God has given you.
                    </Text>
                </View>
            )}

            {/* Export Settings */}
            <View style={[styles.settingsCard, { backgroundColor: colors.cream }]}>
                <Text style={[styles.settingsTitle, { color: colors.text }]}>
                    Export Settings
                </Text>

                {/* Export Title */}
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.charcoalInk }]}>
                        Bundle Title (Optional)
                    </Text>
                    <TextInput
                        style={[styles.titleInput, {
                            backgroundColor: colors.background,
                            color: colors.charcoalInk,
                            borderColor: colors.softGold
                        }]}
                        value={exportTitle}
                        onChangeText={setExportTitle}
                        placeholder="e.g., 30 Days of Peace"
                        placeholderTextColor={colors.charcoalInk + '80'}
                    />
                </View>

                {/* Export Format */}
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.charcoalInk }]}>
                        Export Format
                    </Text>
                    <View style={styles.formatOptions}>
                        <TouchableOpacity
                            style={[
                                styles.formatOption,
                                {
                                    backgroundColor: exportFormat === 'pdf' ? colors.softGold : colors.skyBlue,
                                    borderColor: colors.softGold
                                }
                            ]}
                            onPress={() => setExportFormat('pdf')}
                        >
                            <Text style={[
                                styles.formatOptionText,
                                { color: exportFormat === 'pdf' ? colors.cream : colors.charcoalInk }
                            ]}>
                                📄 PDF
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.formatOption,
                                {
                                    backgroundColor: exportFormat === 'text' ? colors.softGold : colors.skyBlue,
                                    borderColor: colors.softGold
                                }
                            ]}
                            onPress={() => setExportFormat('text')}
                        >
                            <Text style={[
                                styles.formatOptionText,
                                { color: exportFormat === 'text' ? colors.cream : colors.charcoalInk }
                            ]}>
                                📝 Text
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Faith Mode Prayer */}
                {isFaithMode && (
                    <View style={styles.settingRow}>
                        <Text style={[styles.settingLabel, { color: colors.charcoalInk }]}>
                            Pray over this file before export
                        </Text>
                        <Switch
                            value={prayOverFile}
                            onValueChange={setPrayOverFile}
                            trackColor={{ false: colors.skyBlue, true: colors.softGold }}
                            thumbColor={colors.cream}
                        />
                    </View>
                )}
            </View>

            {/* Selection Controls */}
            <View style={styles.selectionControls}>
                <TouchableOpacity
                    style={[styles.selectionButton, { backgroundColor: colors.skyBlue }]}
                    onPress={selectAllDevotionals}
                >
                    <Text style={[styles.selectionButtonText, { color: colors.charcoalInk }]}>
                        Select All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.selectionButton, { backgroundColor: colors.skyBlue }]}
                    onPress={clearSelection}
                >
                    <Text style={[styles.selectionButtonText, { color: colors.charcoalInk }]}>
                        Clear All
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Devotionals List */}
            <ScrollView style={styles.devotionalsList} showsVerticalScrollIndicator={false}>
                {devotionals.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyIcon, { color: colors.charcoalInk + '40' }]}>📚</Text>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            No Devotionals Found
                        </Text>
                        <Text style={[styles.emptyText, { color: colors.charcoalInk }]}>
                            Create faith-based entries with verses or prayer tags to see them here.
                        </Text>
                    </View>
                ) : (
                    devotionals.map(renderDevotionalCard)
                )}
            </ScrollView>

            {/* Export Actions */}
            {selectedDevotionals.length > 0 && (
                <View style={[styles.exportActions, { backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        style={[styles.previewButton, { backgroundColor: colors.skyBlue }]}
                        onPress={previewExport}
                        disabled={isExporting}
                    >
                        <Text style={[styles.previewButtonText, { color: colors.charcoalInk }]}>
                            👁️ Preview
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.exportButton, { backgroundColor: colors.softGold }]}
                        onPress={exportDevotionals}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <ActivityIndicator color={colors.cream} />
                        ) : (
                            <Text style={[styles.exportButtonText, { color: colors.cream }]}>
                                📤 Export {exportFormat.toUpperCase()}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Preview Modal */}
            <Modal
                visible={showPreviewModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPreviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Preview Export
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowPreviewModal(false)}
                            >
                                <Text style={[styles.closeButtonText, { color: colors.charcoalInk }]}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.previewContent}>
                            <Text style={[styles.previewText, { color: colors.charcoalInk }]}>
                                {previewContent}
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.softGold }]}
                            onPress={() => setShowPreviewModal(false)}
                        >
                            <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                                Close Preview
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Faith Mode Overlay */}
            {FaithModeOverlay}
            {EncouragementOverlay}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        fontFamily: 'Raleway',
    },
    encouragementCard: {
        margin: 20,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    encouragementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    encouragementText: {
        fontSize: 14,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    settingsCard: {
        margin: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    settingsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Playfair Display',
    },
    settingRow: {
        marginBottom: 16,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    titleInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Raleway',
    },
    formatOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    formatOption: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    formatOptionText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    selectionControls: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    selectionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    devotionalsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Playfair Display',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Raleway',
    },
    devotionalCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
    },
    selectionIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    faithWatermark: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    faithWatermarkText: {
        fontSize: 40,
    },
    cardContent: {
        marginLeft: 8,
    },
    devotionalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Playfair Display',
    },
    devotionalDate: {
        fontSize: 12,
        marginBottom: 8,
        fontFamily: 'Raleway',
    },
    devotionalPreview: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
        fontFamily: 'Raleway',
    },
    verseContainer: {
        padding: 8,
        borderRadius: 8,
    },
    verseText: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'Raleway',
    },
    exportActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    previewButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    previewButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    exportButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    exportButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '90%',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        fontFamily: 'Playfair Display',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    previewContent: {
        padding: 20,
        maxHeight: 400,
    },
    previewText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Raleway',
    },
    modalButton: {
        padding: 16,
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Playfair Display',
    },
}); 