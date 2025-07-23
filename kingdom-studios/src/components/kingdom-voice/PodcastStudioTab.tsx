import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Switch, TextInput, Alert, Modal } from 'react-native';
import { KingdomColors } from '../../constants/KingdomColors';

const PodcastStudioTab = ({ faithMode, encouragementMode, testMode }) => {
    const [recording, setRecording] = useState(false);
    const [dualStream, setDualStream] = useState(false);
    const [clipperActive, setClipperActive] = useState(false);
    const [chapterMarkers, setChapterMarkers] = useState(['']);
    const [captionStyle, setCaptionStyle] = useState('Default');
    const [platformModalVisible, setPlatformModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState('reels');

    const platforms = [
        { id: 'spotify', name: 'Spotify', icon: '🎵' },
        { id: 'apple', name: 'Apple Podcasts', icon: '🍎' },
        { id: 'google', name: 'Google Podcasts', icon: '🔍' },
        { id: 'youtube', name: 'YouTube', icon: '📺' },
    ];

    const exportFormats = [
        { id: 'reels', name: 'Instagram Reels', icon: '📱' },
        { id: 'shorts', name: 'YouTube Shorts', icon: '🎬' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    ];

    const handleStartRecording = () => setRecording(true);
    const handleStopRecording = () => setRecording(false);
    const handleAddMarker = () => setChapterMarkers([...chapterMarkers, '']);
    const handleMarkerChange = (text, idx) => {
        const updated = [...chapterMarkers];
        updated[idx] = text;
        setChapterMarkers(updated);
    };

    const handleConnectPlatform = (platformId: string) => {
        if (connectedPlatforms.includes(platformId)) {
            setConnectedPlatforms(connectedPlatforms.filter(id => id !== platformId));
            Alert.alert('Disconnected', `Disconnected from ${platforms.find(p => p.id === platformId)?.name}`);
        } else {
            setConnectedPlatforms([...connectedPlatforms, platformId]);
            Alert.alert('Connected', `Connected to ${platforms.find(p => p.id === platformId)?.name}`);
        }
    };

    const handleExportVideo = () => {
        Alert.alert('Export Started', `Exporting as ${exportFormats.find(f => f.id === exportFormat)?.name} format...`);
        setExportModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {testMode && (
                <View style={styles.testModeBanner}>
                    <Text style={styles.testModeText}>TEST MODE: Sandbox features enabled</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Dual-Stream Record Panel</Text>
            <View style={styles.toggleRow}>
                <Text style={styles.label}>Enable Dual Stream (Video+Audio)</Text>
                <Switch value={dualStream} onValueChange={setDualStream} thumbColor={dualStream ? KingdomColors.primary : KingdomColors.gray} />
            </View>
            <View style={styles.recordRow}>
                <Button
                    title={recording ? 'Stop Recording' : 'Start Recording'}
                    onPress={recording ? handleStopRecording : handleStartRecording}
                    color={recording ? KingdomColors.danger : KingdomColors.primary}
                />
                <Text style={styles.recordStatus}>{recording ? 'Recording...' : 'Idle'}</Text>
            </View>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Podcast Platform Connections</Text>
            <TouchableOpacity
                style={styles.platformButton}
                onPress={() => setPlatformModalVisible(true)}
            >
                <Text style={styles.platformButtonText}>Connect Platforms</Text>
            </TouchableOpacity>
            {connectedPlatforms.length > 0 && (
                <View style={styles.connectedPlatforms}>
                    <Text style={styles.subsectionTitle}>Connected:</Text>
                    {connectedPlatforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        return (
                            <Text key={platformId} style={styles.connectedPlatform}>
                                {platform?.icon} {platform?.name}
                            </Text>
                        );
                    })}
                </View>
            )}

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Reels/Shorts AI Clipper</Text>
            <TouchableOpacity
                style={[styles.clipperButton, clipperActive && styles.clipperActive]}
                onPress={() => setClipperActive(!clipperActive)}
            >
                <Text style={styles.clipperButtonText}>{clipperActive ? 'Clipper Active' : 'Activate Clipper'}</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Video Export</Text>
            <TouchableOpacity
                style={styles.exportButton}
                onPress={() => setExportModalVisible(true)}
            >
                <Text style={styles.exportButtonText}>Export Video</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Chapter Markers</Text>
            {chapterMarkers.map((marker, idx) => (
                <TextInput
                    key={idx}
                    style={styles.input}
                    placeholder={`Marker ${idx + 1}`}
                    value={marker}
                    onChangeText={(text) => handleMarkerChange(text, idx)}
                />
            ))}
            <Button title="Add Marker" onPress={handleAddMarker} color={KingdomColors.primary} />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Caption Styling</Text>
            <View style={styles.captionRow}>
                <TouchableOpacity onPress={() => setCaptionStyle('Default')} style={[styles.captionButton, captionStyle === 'Default' && styles.captionActive]}>
                    <Text style={styles.captionButtonText}>Default</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCaptionStyle('Large')} style={[styles.captionButton, captionStyle === 'Large' && styles.captionActive]}>
                    <Text style={styles.captionButtonText}>Large</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCaptionStyle('Bold')} style={[styles.captionButton, captionStyle === 'Bold' && styles.captionActive]}>
                    <Text style={styles.captionButtonText}>Bold</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={platformModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Connect Podcast Platforms</Text>
                        {platforms.map(platform => (
                            <TouchableOpacity
                                key={platform.id}
                                style={[styles.platformOption, connectedPlatforms.includes(platform.id) && styles.platformConnected]}
                                onPress={() => handleConnectPlatform(platform.id)}
                            >
                                <Text style={styles.platformIcon}>{platform.icon}</Text>
                                <Text style={styles.platformName}>{platform.name}</Text>
                                <Text style={styles.platformStatus}>
                                    {connectedPlatforms.includes(platform.id) ? 'Connected' : 'Connect'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Button title="Close" onPress={() => setPlatformModalVisible(false)} color={KingdomColors.primary} />
                    </View>
                </View>
            </Modal>

            <Modal visible={exportModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Export Video</Text>
                        {exportFormats.map(format => (
                            <TouchableOpacity
                                key={format.id}
                                style={[styles.exportOption, exportFormat === format.id && styles.exportSelected]}
                                onPress={() => setExportFormat(format.id)}
                            >
                                <Text style={styles.exportIcon}>{format.icon}</Text>
                                <Text style={styles.exportName}>{format.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setExportModalVisible(false)} color={KingdomColors.gray} />
                            <Button title="Export" onPress={handleExportVideo} color={KingdomColors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>

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
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: KingdomColors.darkGray,
        marginRight: 8,
    },
    recordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    recordStatus: {
        marginLeft: 12,
        color: KingdomColors.primary,
        fontWeight: 'bold',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: KingdomColors.lightGray,
        marginVertical: 16,
    },
    platformButton: {
        backgroundColor: KingdomColors.primary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    platformButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
    },
    connectedPlatforms: {
        marginBottom: 10,
    },
    connectedPlatform: {
        color: KingdomColors.success,
        marginBottom: 4,
    },
    clipperButton: {
        backgroundColor: KingdomColors.primary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    clipperActive: {
        backgroundColor: KingdomColors.success,
    },
    clipperButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
    },
    exportButton: {
        backgroundColor: KingdomColors.primary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    exportButtonText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        minHeight: 40,
        color: KingdomColors.darkGray,
    },
    captionRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    captionButton: {
        backgroundColor: KingdomColors.lightGray,
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    captionActive: {
        backgroundColor: KingdomColors.primary,
    },
    captionButtonText: {
        color: KingdomColors.darkGray,
        fontWeight: 'bold',
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
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    platformOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        marginBottom: 8,
    },
    platformConnected: {
        borderColor: KingdomColors.success,
        backgroundColor: KingdomColors.lightGray,
    },
    platformIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    platformName: {
        flex: 1,
        fontSize: 16,
        color: KingdomColors.darkGray,
    },
    platformStatus: {
        fontSize: 14,
        color: KingdomColors.primary,
    },
    exportOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: KingdomColors.gray,
        borderRadius: 8,
        marginBottom: 8,
    },
    exportSelected: {
        borderColor: KingdomColors.primary,
        backgroundColor: KingdomColors.lightGray,
    },
    exportIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    exportName: {
        fontSize: 16,
        color: KingdomColors.darkGray,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
});

export default PodcastStudioTab; 