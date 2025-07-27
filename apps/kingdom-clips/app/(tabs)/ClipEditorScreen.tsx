import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, TextInput, Switch, Modal, Alert } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

// Mock AI-detected clips
const mockDetectedClips = (faithMode: boolean) => [
    {
        id: '1',
        start: 12,
        end: 38,
        duration: 26,
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+1',
        faith: faithMode && true,
        testimony: faithMode && false,
        keywords: ['breakthrough', 'hope'],
    },
    {
        id: '2',
        start: 45,
        end: 90,
        duration: 45,
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F9D342?text=Clip+2',
        faith: faithMode && false,
        testimony: faithMode && true,
        keywords: ['testimony', 'Jesus'],
    },
    {
        id: '3',
        start: 100,
        end: 150,
        duration: 50,
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+3',
        faith: faithMode && true,
        testimony: faithMode && true,
        keywords: ['faith', 'miracle'],
    },
];

function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const mockTranscript = [
    { word: 'This', start: 0, end: 0.3 },
    { word: 'is', start: 0.3, end: 0.5 },
    { word: 'a', start: 0.5, end: 0.6 },
    { word: 'breakthrough', start: 0.6, end: 1.1 },
    { word: 'moment', start: 1.1, end: 1.5 },
    { word: 'for', start: 1.5, end: 1.7 },
    { word: 'someone.', start: 1.7, end: 2.2 },
];

const CAPTION_STYLES = [
    { key: 'center', label: 'Bold Center (Reels)', style: 'center' },
    { key: 'wave', label: 'Word-Highlight Wave', style: 'wave' },
    { key: 'subtitle', label: 'Clean Subtitle', style: 'subtitle' },
];

const COLOR_SCHEMES = [
    { key: 'charcoal', label: 'Charcoal/Gold', fg: Colors.dark.gold, bg: Colors.dark.black },
    { key: 'yellow', label: 'Yellow/White', fg: Colors.dark.accent, bg: Colors.dark.gold },
];

const mockTitleGenerator = (transcript: string, faithMode: boolean) => {
    if (faithMode) {
        return [
            'This testimony will wreck you',
            'God did it again 🙌',
            'When Jesus shows up...',
            'Breakthrough moment caught on camera',
            'The enemy thought he had me',
        ];
    }
    return [
        'Real. Raw. Redeemed.',
        'This changed everything',
        'You won\'t believe what happened',
        'The moment everything shifted',
        'This is powerful',
    ];
};

const mockHashtagGenerator = (topic: string, faithMode: boolean) => {
    const base = ['#viral', '#trending', '#motivation', '#inspiration', '#success'];
    const faith = faithMode ? ['#testimony', '#jesus', '#faith', '#breakthrough', '#godisgood'] : [];
    const popular = ['#fyp', '#foryou', '#shorts', '#reels', '#viral'];
    return [...base, ...faith, ...popular];
};

const mockThumbnails = [
    'https://placehold.co/120x68/1C1C1E/F6E27F?text=Frame+1',
    'https://placehold.co/120x68/1C1C1E/F9D342?text=Frame+2',
    'https://placehold.co/120x68/1C1C1E/F6E27F?text=Frame+3',
];

export default function ClipEditorScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const [detectedClips] = useState(() => mockDetectedClips(faithMode));
    const [selectedClip, setSelectedClip] = useState(detectedClips[0]);
    const [editStart, setEditStart] = useState(selectedClip.start);
    const [editEnd, setEditEnd] = useState(selectedClip.end);
    const [saving, setSaving] = useState(false);

    // Caption overlay system state
    const [transcript, setTranscript] = useState(mockTranscript);
    const [editingTranscript, setEditingTranscript] = useState(false);
    const [captionStyle, setCaptionStyle] = useState(CAPTION_STYLES[0].key);
    const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES[0].key);
    const [showBadge, setShowBadge] = useState(faithMode);
    const [showScripture, setShowScripture] = useState(faithMode);
    const [glowText, setGlowText] = useState(faithMode);
    const [exportModal, setExportModal] = useState(false);
    const [exported, setExported] = useState(false);

    // AI Tools state
    const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
    const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [showTitleOverlay, setShowTitleOverlay] = useState(false);
    const [showTitleGenerator, setShowTitleGenerator] = useState(false);
    const [showHashtagGenerator, setShowHashtagGenerator] = useState(false);

    // Simulate saving
    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    // Simulate export
    const handleExport = (to: 'device' | 'library') => {
        setExported(true);
        setTimeout(() => {
            setExportModal(false);
            setExported(false);
        }, 1200);
    };

    // Simulate slider drag (for demo, just increment/decrement)
    const adjustStart = (delta: number) => {
        const newStart = Math.max(0, Math.min(editStart + delta, editEnd - 1));
        setEditStart(newStart);
    };
    const adjustEnd = (delta: number) => {
        const newEnd = Math.max(editStart + 1, Math.min(editEnd + delta, selectedClip.start + 60, selectedClip.end));
        setEditEnd(newEnd);
    };

    // When user selects a new clip, update edit range
    const handleSelectClip = (clip: typeof selectedClip) => {
        setSelectedClip(clip);
        setEditStart(clip.start);
        setEditEnd(clip.end);
    };

    // Transcript editing
    const transcriptText = transcript.map(t => t.word).join(' ');
    const handleTranscriptEdit = (text: string) => {
        // Simple split for demo
        const words = text.split(' ');
        setTranscript(words.map((w, i) => ({ word: w, start: i * 0.3, end: (i + 1) * 0.3 })));
    };

    // Caption rendering (mocked, not synced to real video)
    const renderCaptions = () => {
        if (captionStyle === 'center') {
            return (
                <Text style={[styles.captionCenter, { color: COLOR_SCHEMES.find(s => s.key === colorScheme)?.fg, textShadowColor: glowText ? Colors.dark.accent : 'transparent', textShadowRadius: glowText ? 8 : 0 }]}>
                    {transcriptText}
                </Text>
            );
        }
        if (captionStyle === 'wave') {
            return (
                <View style={styles.captionWaveRow}>
                    {transcript.map((t, i) => (
                        <Text key={i} style={[styles.captionWaveWord, { color: i % 2 === 0 ? COLOR_SCHEMES.find(s => s.key === colorScheme)?.fg : Colors.dark.accent, textShadowColor: glowText ? Colors.dark.accent : 'transparent', textShadowRadius: glowText ? 8 : 0 }]}>{t.word} </Text>
                    ))}
                </View>
            );
        }
        // subtitle
        return (
            <Text style={[styles.captionSubtitle, { color: COLOR_SCHEMES.find(s => s.key === colorScheme)?.fg, textShadowColor: glowText ? Colors.dark.accent : 'transparent', textShadowRadius: glowText ? 8 : 0 }]}>{transcriptText}</Text>
        );
    };

    const handleGenerateTitle = () => {
        const transcriptText = transcript.map(t => t.word).join(' ');
        const titles = mockTitleGenerator(transcriptText, faithMode);
        setGeneratedTitles(titles);
        setShowTitleGenerator(true);
    };

    const handleGenerateHashtags = () => {
        const hashtags = mockHashtagGenerator('motivation', faithMode);
        setGeneratedHashtags(hashtags);
        setShowHashtagGenerator(true);
    };

    const handleSelectTitle = (title: string) => {
        setSelectedTitle(title);
        setShowTitleGenerator(false);
    };

    const handleCopyHashtags = () => {
        // TODO: Implement clipboard copy
        Alert.alert('Copied!', 'Hashtags copied to clipboard');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Clip Editor</Text>
            <ScrollView horizontal style={styles.clipsRow} showsHorizontalScrollIndicator={false}>
                {detectedClips.map((clip) => (
                    <TouchableOpacity
                        key={clip.id}
                        style={[styles.clipCard, selectedClip.id === clip.id && styles.selectedClipCard]}
                        onPress={() => handleSelectClip(clip)}
                    >
                        <Image source={{ uri: clip.thumbnail }} style={styles.thumbnail} />
                        <Text style={styles.timestamp}>{formatTime(clip.start)} - {formatTime(clip.end)}</Text>
                        <Text style={styles.duration}>{clip.duration}s</Text>
                        {faithMode && (clip.faith || clip.testimony) && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {clip.testimony ? 'Testimony detected' : 'Faith moment'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.timelineBox}>
                <View style={styles.progressBar}>
                    {/* Markers for detected clips */}
                    {detectedClips.map((clip, i) => (
                        <View
                            key={clip.id}
                            style={[
                                styles.marker,
                                { left: `${((clip.start - detectedClips[0].start) / (detectedClips[detectedClips.length - 1].end - detectedClips[0].start)) * 100}%` },
                                clip.id === selectedClip.id && styles.selectedMarker,
                            ]}
                        />
                    ))}
                </View>
                <View style={styles.sliderRow}>
                    <TouchableOpacity onPress={() => adjustStart(-1)} style={styles.sliderBtn}><Text style={styles.sliderBtnText}>-</Text></TouchableOpacity>
                    <Text style={styles.sliderLabel}>Start: {formatTime(editStart)}</Text>
                    <TouchableOpacity onPress={() => adjustStart(1)} style={styles.sliderBtn}><Text style={styles.sliderBtnText}>+</Text></TouchableOpacity>
                    <View style={{ width: 24 }} />
                    <TouchableOpacity onPress={() => adjustEnd(-1)} style={styles.sliderBtn}><Text style={styles.sliderBtnText}>-</Text></TouchableOpacity>
                    <Text style={styles.sliderLabel}>End: {formatTime(editEnd)}</Text>
                    <TouchableOpacity onPress={() => adjustEnd(1)} style={styles.sliderBtn}><Text style={styles.sliderBtnText}>+</Text></TouchableOpacity>
                </View>
                <Text style={styles.durationText}>Duration: {editEnd - editStart}s (max 60s)</Text>
            </View>
            <View style={styles.previewBox}>
                <Image source={{ uri: selectedClip.thumbnail }} style={styles.previewThumb} />
                <View style={styles.captionOverlay}>{renderCaptions()}</View>
                {showBadge && faithMode && (
                    <View style={styles.badgeOverlay}><Text style={styles.badgeOverlayText}>Jesus Changed My Life</Text></View>
                )}
                {showScripture && faithMode && (
                    <View style={styles.scriptureOverlay}><Text style={styles.scriptureText}>“For with God nothing shall be impossible.” (Luke 1:37)</Text></View>
                )}
                <Text style={styles.previewLabel}>[Video preview with captions here]</Text>
            </View>
            <View style={styles.captionControls}>
                <TouchableOpacity onPress={() => setEditingTranscript(true)} style={styles.editTranscriptBtn}>
                    <Text style={styles.editTranscriptText}>Edit Transcript</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    {CAPTION_STYLES.map(s => (
                        <TouchableOpacity key={s.key} onPress={() => setCaptionStyle(s.key)} style={[styles.styleBtn, captionStyle === s.key && styles.selectedStyleBtn]}>
                            <Text style={styles.styleBtnText}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    {COLOR_SCHEMES.map(s => (
                        <TouchableOpacity key={s.key} onPress={() => setColorScheme(s.key)} style={[styles.styleBtn, colorScheme === s.key && styles.selectedStyleBtn]}>
                            <Text style={styles.styleBtnText}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {faithMode && (
                    <View style={styles.row}>
                        <View style={styles.toggleRow}><Text style={styles.toggleLabel}>Badge</Text><Switch value={showBadge} onValueChange={setShowBadge} /></View>
                        <View style={styles.toggleRow}><Text style={styles.toggleLabel}>Scripture</Text><Switch value={showScripture} onValueChange={setShowScripture} /></View>
                        <View style={styles.toggleRow}><Text style={styles.toggleLabel}>Glow</Text><Switch value={glowText} onValueChange={setGlowText} /></View>
                    </View>
                )}
            </View>
            {encouragementMode && (
                <Text style={styles.encouragement}>What you say matters.</Text>
            )}
            <Button title="Export" onPress={() => setExportModal(true)} />
            <Modal visible={editingTranscript} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Edit Transcript</Text>
                        <TextInput
                            style={styles.transcriptInput}
                            value={transcriptText}
                            onChangeText={handleTranscriptEdit}
                            multiline
                            autoFocus
                        />
                        <Button title="Done" onPress={() => setEditingTranscript(false)} />
                    </View>
                </View>
            </Modal>
            <Modal visible={exportModal} animationType="fade" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Export Clip</Text>
                        <Button title="Save to Device" onPress={() => handleExport('device')} loading={exported} />
                        <Button title="Save to Library" onPress={() => handleExport('library')} loading={exported} />
                        <Button title="Cancel" onPress={() => setExportModal(false)} />
                    </View>
                </View>
            </Modal>
            <Button title={saving ? 'Saving...' : 'Save Clip'} onPress={handleSave} loading={saving} />
            {faithMode && (
                <View style={styles.faithOverlay}>
                    <Text style={styles.faithText}>This is a breakthrough moment</Text>
                </View>
            )}
            <View style={styles.aiToolsBox}>
                <Text style={styles.aiToolsTitle}>AI Tools</Text>
                <View style={styles.aiButtonsRow}>
                    <TouchableOpacity onPress={handleGenerateTitle} style={styles.aiBtn}>
                        <Text style={styles.aiBtnText}>Generate Viral Title</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGenerateHashtags} style={styles.aiBtn}>
                        <Text style={styles.aiBtnText}>Generate Hashtags</Text>
                    </TouchableOpacity>
                </View>
                {selectedTitle && (
                    <View style={styles.selectedTitleBox}>
                        <Text style={styles.selectedTitleLabel}>Selected Title:</Text>
                        <Text style={styles.selectedTitle}>{selectedTitle}</Text>
                    </View>
                )}
                <View style={styles.thumbnailSection}>
                    <Text style={styles.thumbnailLabel}>Choose Thumbnail:</Text>
                    <View style={styles.thumbnailRow}>
                        {mockThumbnails.map((thumb, idx) => (
                            <TouchableOpacity key={idx} onPress={() => setSelectedThumbnail(idx)} style={[styles.thumbnailOption, selectedThumbnail === idx && styles.selectedThumbnail]}>
                                <Image source={{ uri: thumb }} style={styles.thumbnailOptionImg} />
                                {showTitleOverlay && selectedTitle && (
                                    <View style={styles.titleOverlay}>
                                        <Text style={styles.overlayTitle}>{selectedTitle}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => setShowTitleOverlay(!showTitleOverlay)} style={styles.overlayToggle}>
                        <Text style={styles.overlayToggleText}>{showTitleOverlay ? 'Hide' : 'Show'} Title Overlay</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={showTitleGenerator} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Choose Title</Text>
                        {generatedTitles.map((title, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleSelectTitle(title)} style={styles.titleOption}>
                                <Text style={styles.titleOptionText}>{title}</Text>
                            </TouchableOpacity>
                        ))}
                        <Button title="Cancel" onPress={() => setShowTitleGenerator(false)} />
                    </View>
                </View>
            </Modal>
            <Modal visible={showHashtagGenerator} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Generated Hashtags</Text>
                        <TextInput
                            style={styles.hashtagInput}
                            value={generatedHashtags.join(' ')}
                            onChangeText={text => setGeneratedHashtags(text.split(' '))}
                            multiline
                        />
                        <View style={styles.hashtagButtons}>
                            <TouchableOpacity onPress={handleCopyHashtags} style={styles.copyBtn}>
                                <Text style={styles.copyBtnText}>Copy All</Text>
                            </TouchableOpacity>
                            <Button title="Done" onPress={() => setShowHashtagGenerator(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 18,
        letterSpacing: 1,
    },
    clipsRow: {
        flexGrow: 0,
        flexShrink: 0,
        maxHeight: 120,
        marginBottom: 18,
    },
    clipCard: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginRight: 14,
        alignItems: 'center',
        padding: 8,
        minWidth: 120,
        position: 'relative',
    },
    selectedClipCard: {
        borderColor: Colors.dark.accent,
        shadowColor: Colors.dark.accent,
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    thumbnail: {
        width: 100,
        height: 56,
        borderRadius: 8,
        marginBottom: 4,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    timestamp: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 13,
    },
    duration: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 13,
        marginBottom: 2,
    },
    badge: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 2,
    },
    badgeText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 12,
        letterSpacing: 1,
    },
    timelineBox: {
        width: '100%',
        marginBottom: 18,
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.dark.black,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    marker: {
        position: 'absolute',
        top: -2,
        width: 8,
        height: 12,
        backgroundColor: Colors.dark.accent,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    selectedMarker: {
        backgroundColor: Colors.dark.crimson,
        borderColor: Colors.dark.accent,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    sliderBtn: {
        backgroundColor: Colors.dark.gold,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginHorizontal: 2,
    },
    sliderBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 18,
    },
    sliderLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginHorizontal: 4,
    },
    durationText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 14,
        marginBottom: 2,
    },
    previewBox: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    },
    previewThumb: {
        width: 220,
        height: 124,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginBottom: 6,
    },
    previewLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 14,
        marginBottom: 2,
    },
    faithOverlay: {
        marginTop: 10,
        backgroundColor: 'rgba(176,0,32,0.8)',
        borderRadius: 16,
        padding: 10,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.6,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    faithText: {
        fontFamily: 'BebasNeue',
        fontSize: 18,
        color: Colors.dark.gold,
        letterSpacing: 2,
        textAlign: 'center',
    },
    captionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    captionCenter: {
        fontFamily: 'BebasNeue',
        fontSize: 40,
        textAlign: 'center',
        lineHeight: 48,
        letterSpacing: 2,
    },
    captionWaveRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captionWaveWord: {
        fontFamily: 'BebasNeue',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 1,
    },
    captionSubtitle: {
        fontFamily: 'Urbanist',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 28,
    },
    badgeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    badgeOverlayText: {
        fontFamily: 'BebasNeue',
        fontSize: 36,
        color: Colors.dark.gold,
        textShadowColor: Colors.dark.crimson,
        textShadowRadius: 8,
        textShadowOffset: { width: 0, height: 2 },
    },
    scriptureOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 10,
        alignItems: 'center',
    },
    scriptureText: {
        fontFamily: 'BebasNeue',
        fontSize: 24,
        color: Colors.dark.gold,
        textShadowColor: Colors.dark.crimson,
        textShadowRadius: 8,
        textShadowOffset: { width: 0, height: 2 },
    },
    captionControls: {
        width: '100%',
        marginBottom: 18,
        alignItems: 'center',
    },
    editTranscriptBtn: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    editTranscriptText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    styleBtn: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    selectedStyleBtn: {
        backgroundColor: Colors.dark.crimson,
        borderColor: Colors.dark.gold,
    },
    styleBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 14,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    toggleLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginRight: 10,
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 18,
        marginBottom: 18,
        textAlign: 'center',
    },
    modalBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 20,
        padding: 25,
        width: '80%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    modalTitle: {
        fontFamily: 'BebasNeue',
        fontSize: 24,
        color: Colors.dark.gold,
        marginBottom: 20,
        letterSpacing: 1,
    },
    transcriptInput: {
        width: '100%',
        height: 150,
        backgroundColor: Colors.dark.gold,
        borderRadius: 12,
        padding: 15,
        fontFamily: 'Urbanist',
        color: Colors.dark.black,
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
});

const additionalStyles = StyleSheet.create({
    aiToolsBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        padding: 16,
        marginBottom: 18,
    },
    aiToolsTitle: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    aiButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    aiBtn: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    aiBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 14,
    },
    selectedTitleBox: {
        backgroundColor: Colors.dark.background,
        borderRadius: 10,
        padding: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.dark.gold,
    },
    selectedTitleLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 13,
        marginBottom: 2,
    },
    selectedTitle: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.accent,
        fontSize: 15,
    },
    thumbnailSection: {
        alignItems: 'center',
    },
    thumbnailLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 8,
    },
    thumbnailRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 8,
    },
    thumbnailOption: {
        position: 'relative',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    selectedThumbnail: {
        borderColor: Colors.dark.accent,
        shadowColor: Colors.dark.accent,
        shadowOpacity: 0.6,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    thumbnailOptionImg: {
        width: 80,
        height: 45,
        borderRadius: 6,
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(176,0,32,0.8)',
        padding: 2,
        borderRadius: 0,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    overlayTitle: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 10,
        textAlign: 'center',
    },
    overlayToggle: {
        backgroundColor: Colors.dark.gold,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    overlayToggleText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 12,
    },
    titleOption: {
        backgroundColor: Colors.dark.background,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.dark.gold,
    },
    titleOptionText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        textAlign: 'center',
    },
    hashtagInput: {
        width: '100%',
        height: 100,
        backgroundColor: Colors.dark.background,
        borderRadius: 10,
        padding: 12,
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 14,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginBottom: 10,
    },
    hashtagButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    copyBtn: {
        backgroundColor: Colors.dark.accent,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    copyBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 14,
    },
}); 