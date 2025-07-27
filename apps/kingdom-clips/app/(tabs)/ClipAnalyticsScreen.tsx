import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

const MOCK_CLIPS = [
    {
        id: 'clip1',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+1',
        title: 'Breakthrough Moment',
        faith: true,
        tags: ['testimony'],
        analytics: { views: 120, likes: 30, comments: 5, shares: 8, notes: '' },
    },
    {
        id: 'clip2',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F9D342?text=Clip+2',
        title: 'Viral Highlight',
        faith: false,
        tags: ['encouragement'],
        analytics: { views: 80, likes: 12, comments: 2, shares: 3, notes: '' },
    },
    {
        id: 'clip3',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+3',
        title: 'Testimony Tool',
        faith: true,
        tags: ['breakthrough', 'scripture'],
        analytics: { views: 200, likes: 50, comments: 10, shares: 20, notes: '' },
    },
];

const VERSES = [
    '“The Word will not return void” – Isaiah 55:11',
    '“Let your light shine before others” – Matthew 5:16',
    '“Faith comes by hearing” – Romans 10:17',
];

export default function ClipAnalyticsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const [clips, setClips] = useState(MOCK_CLIPS);
    const [selectedClip, setSelectedClip] = useState(null);
    const [verseIdx, setVerseIdx] = useState(0);

    // Faith Engagement stat
    const faithEngagement = clips.filter(c => c.faith && (c.tags.includes('testimony') || c.tags.includes('scripture'))).length;

    // Top-performing/most shared
    const topClip = clips.reduce((a, b) => (a.analytics.views > b.analytics.views ? a : b));
    const mostShared = clips.reduce((a, b) => (a.analytics.shares > b.analytics.shares ? a : b));

    const handleOpen = (clip) => setSelectedClip(clip);
    const handleClose = () => setSelectedClip(null);
    const handleSave = () => {
        setClips(prev => prev.map(c => (c.id === selectedClip.id ? selectedClip : c)));
        setSelectedClip(null);
    };

    // Rotate verse every 10s
    React.useEffect(() => {
        if (!faithMode) return;
        const interval = setInterval(() => setVerseIdx(v => (v + 1) % VERSES.length), 10000);
        return () => clearInterval(interval);
    }, [faithMode]);

    const renderClip = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleOpen(item)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <Text style={styles.title}>{item.title}</Text>
            {item.faith && <Text style={styles.faithBadge}>✝️</Text>}
            <View style={styles.progressBarBox}>
                <View style={[styles.progressBar, { width: `${Math.min(100, item.analytics.views / (topClip.analytics.views || 1) * 100)}%` }]} />
            </View>
            <Text style={styles.metric}>Views: {item.analytics.views}</Text>
            <Text style={styles.metric}>Shares: {item.analytics.shares}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Clip Analytics</Text>
            {faithMode && (
                <View style={styles.faithRow}>
                    <Text style={styles.faithStat}>Faith Engagement: {faithEngagement}</Text>
                    <Text style={styles.verse}>{VERSES[verseIdx]}</Text>
                </View>
            )}
            {encouragementMode && (
                <Text style={styles.encouragement}>Impact isn’t always seen in numbers—but let’s track the seeds anyway.</Text>
            )}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Top-performing clip this week:</Text>
                <Text style={styles.summaryClip}>{topClip.title} ({topClip.analytics.views} views)</Text>
                <Text style={styles.summaryTitle}>Most shared testimony:</Text>
                <Text style={styles.summaryClip}>{mostShared.title} ({mostShared.analytics.shares} shares)</Text>
            </View>
            <FlatList
                data={clips}
                renderItem={renderClip}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
            <Modal visible={!!selectedClip} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Edit Analytics</Text>
                        <Text style={styles.modalLabel}>Views</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={selectedClip?.analytics.views.toString()}
                            onChangeText={v => setSelectedClip({ ...selectedClip, analytics: { ...selectedClip.analytics, views: parseInt(v) || 0 } })}
                        />
                        <Text style={styles.modalLabel}>Likes</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={selectedClip?.analytics.likes.toString()}
                            onChangeText={v => setSelectedClip({ ...selectedClip, analytics: { ...selectedClip.analytics, likes: parseInt(v) || 0 } })}
                        />
                        <Text style={styles.modalLabel}>Comments</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={selectedClip?.analytics.comments.toString()}
                            onChangeText={v => setSelectedClip({ ...selectedClip, analytics: { ...selectedClip.analytics, comments: parseInt(v) || 0 } })}
                        />
                        <Text style={styles.modalLabel}>Shares</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={selectedClip?.analytics.shares.toString()}
                            onChangeText={v => setSelectedClip({ ...selectedClip, analytics: { ...selectedClip.analytics, shares: parseInt(v) || 0 } })}
                        />
                        <Text style={styles.modalLabel}>Notes</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedClip?.analytics.notes}
                            onChangeText={v => setSelectedClip({ ...selectedClip, analytics: { ...selectedClip.analytics, notes: v } })}
                            multiline
                        />
                        <Button title="Save" onPress={handleSave} />
                        <Button title="Cancel" onPress={handleClose} />
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
    faithRow: {
        alignItems: 'center',
        marginBottom: 8,
    },
    faithStat: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 2,
    },
    verse: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 2,
        textAlign: 'center',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 8,
        textAlign: 'center',
    },
    summaryBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    summaryTitle: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 14,
        marginBottom: 2,
    },
    summaryClip: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.accent,
        fontSize: 15,
        marginBottom: 2,
    },
    grid: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.dark.black,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        margin: 8,
        flex: 1,
        minWidth: 150,
        maxWidth: '48%',
        alignItems: 'center',
        padding: 12,
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    thumbnail: {
        width: 100,
        height: 56,
        borderRadius: 8,
        marginBottom: 6,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    title: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 2,
    },
    faithBadge: {
        fontSize: 18,
        marginBottom: 2,
    },
    progressBarBox: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.dark.background,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.dark.gold,
        marginBottom: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.dark.accent,
        borderRadius: 6,
    },
    metric: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 13,
        marginBottom: 2,
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
        marginBottom: 10,
        letterSpacing: 1,
    },
    modalLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginTop: 8,
        marginBottom: 2,
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
        marginBottom: 4,
        backgroundColor: Colors.dark.background,
    },
}); 