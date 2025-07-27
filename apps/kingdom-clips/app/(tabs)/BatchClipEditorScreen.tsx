import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Switch, Platform } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

const mockBatchClips = (faithMode: boolean) => Array.from({ length: 6 }).map((_, i) => ({
    id: `clip${i + 1}`,
    start: 10 + i * 30,
    end: 30 + i * 30,
    duration: 20,
    thumbnail: `https://placehold.co/120x68/1C1C1E/${i % 2 === 0 ? 'F6E27F' : 'F9D342'}?text=Clip+${i + 1}`,
    faith: faithMode && (i % 2 === 0),
    approved: true,
    title: '',
    tag: '',
}));

const CAPTION_STYLES = [
    { key: 'center', label: 'Bold Center (Reels)' },
    { key: 'wave', label: 'Word-Highlight Wave' },
    { key: 'subtitle', label: 'Clean Subtitle' },
];

export default function BatchClipEditorScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const [clips, setClips] = useState(() => mockBatchClips(faithMode));
    const [captionStyle, setCaptionStyle] = useState(CAPTION_STYLES[0].key);
    const [faithOverlayAll, setFaithOverlayAll] = useState(faithMode);
    const [saving, setSaving] = useState(false);

    const handleApprove = (id: string, approved: boolean) => {
        setClips(prev => prev.map(c => c.id === id ? { ...c, approved } : c));
    };
    const handleTitle = (id: string, title: string) => {
        setClips(prev => prev.map(c => c.id === id ? { ...c, title } : c));
    };
    const handleTag = (id: string, tag: string) => {
        setClips(prev => prev.map(c => c.id === id ? { ...c, tag } : c));
    };
    const handleApplyCaptionStyle = (style: string) => {
        setCaptionStyle(style);
        setClips(prev => prev.map(c => ({ ...c, captionStyle: style })));
    };
    const handleFaithOverlayAll = (on: boolean) => {
        setFaithOverlayAll(on);
        setClips(prev => prev.map(c => ({ ...c, faith: on })));
    };
    const handleSaveAll = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1200);
        // Would save all approved clips to storage here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Batch Clip Editor</Text>
            {faithMode && <Text style={styles.faithMsg}>Let the Word go out through every clip.</Text>}
            {encouragementMode && <Text style={styles.encouragement}>You’re multiplying your impact.</Text>}
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {clips.map((clip, idx) => (
                    <View key={clip.id} style={[styles.card, !clip.approved && styles.cardDimmed]}>
                        <Image source={{ uri: clip.thumbnail }} style={styles.thumbnail} />
                        <View style={styles.infoRow}>
                            <Text style={styles.timestamp}>[{clip.start}s - {clip.end}s]</Text>
                            <Text style={styles.duration}>{clip.duration}s</Text>
                            {clip.faith && <Text style={styles.faithBadge}>✝️</Text>}
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => handleApprove(clip.id, !clip.approved)} style={[styles.approveBtn, clip.approved ? styles.approved : styles.discarded]}>
                                <Text style={styles.approveBtnText}>{clip.approved ? 'Approved' : 'Discarded'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor={Colors.dark.gold}
                            value={clip.title}
                            onChangeText={t => handleTitle(clip.id, t)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tag (optional)"
                            placeholderTextColor={Colors.dark.gold}
                            value={clip.tag}
                            onChangeText={t => handleTag(clip.id, t)}
                        />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bulkRow}>
                <Button title="Save All Selected" onPress={handleSaveAll} loading={saving} />
            </View>
            <View style={styles.bulkRow}>
                {CAPTION_STYLES.map(s => (
                    <TouchableOpacity key={s.key} onPress={() => handleApplyCaptionStyle(s.key)} style={[styles.styleBtn, captionStyle === s.key && styles.selectedStyleBtn]}>
                        <Text style={styles.styleBtnText}>{s.label}</Text>
                    </TouchableOpacity>
                ))}
                {faithMode && (
                    <View style={styles.faithOverlayRow}>
                        <Text style={styles.faithOverlayLabel}>Faith Overlay</Text>
                        <Switch value={faithOverlayAll} onValueChange={handleFaithOverlayAll} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: 18,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 10,
        letterSpacing: 1,
        textAlign: 'center',
    },
    faithMsg: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 8,
        textAlign: 'center',
    },
    scroll: {
        flex: 1,
        marginBottom: 10,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    card: {
        backgroundColor: Colors.dark.black,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginBottom: 14,
        alignItems: 'center',
        padding: 12,
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardDimmed: {
        opacity: 0.5,
    },
    thumbnail: {
        width: 100,
        height: 56,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 2,
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
        marginLeft: 8,
    },
    faithBadge: {
        fontSize: 18,
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    approveBtn: {
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginHorizontal: 2,
        borderWidth: 2,
    },
    approved: {
        backgroundColor: Colors.dark.gold,
        borderColor: Colors.dark.gold,
    },
    discarded: {
        backgroundColor: Colors.dark.background,
        borderColor: Colors.dark.crimson,
    },
    approveBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 14,
    },
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        borderRadius: 10,
        padding: 8,
        color: Colors.dark.gold,
        fontFamily: 'Urbanist',
        fontSize: 15,
        marginTop: 4,
        marginBottom: 2,
        backgroundColor: Colors.dark.background,
    },
    bulkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    styleBtn: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginHorizontal: 2,
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
    faithOverlayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    faithOverlayLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 14,
        marginRight: 6,
    },
}); 