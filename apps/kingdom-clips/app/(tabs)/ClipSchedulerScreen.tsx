import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Platform } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
const PLATFORMS = ['TikTok', 'Reels', 'Shorts'];

// Mock clips for scheduling
const MOCK_CLIPS = [
    {
        id: 'clip1',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+1',
        title: 'Breakthrough Moment',
        caption: 'This testimony will wreck you',
        faithMode: true,
    },
    {
        id: 'clip2',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F9D342?text=Clip+2',
        title: 'Viral Highlight',
        caption: 'Real. Raw. Redeemed.',
        faithMode: false,
    },
    {
        id: 'clip3',
        thumbnail: 'https://placehold.co/120x68/1C1C1E/F6E27F?text=Clip+3',
        title: 'Testimony Tool',
        caption: 'God did it again 🙌',
        faithMode: true,
    },
];

interface ScheduledPost {
    id: string;
    clipId: string;
    day: string;
    time: string;
    platform: string;
    clip: any;
}

const VERSES = [
    'Sow in season - Galatians 6:9',
    'Ask God for timing - Ecclesiastes 3:1',
    'The Lord directs our steps - Proverbs 16:9',
];

export default function ClipSchedulerScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedClip, setSelectedClip] = useState<any>(null);
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [verseIdx, setVerseIdx] = useState(0);

    // Rotate verse every 15s in Faith Mode
    React.useEffect(() => {
        if (!faithMode) return;
        const interval = setInterval(() => setVerseIdx(v => (v + 1) % VERSES.length), 15000);
        return () => clearInterval(interval);
    }, [faithMode]);

    const handleSlotPress = (day: string, time: string) => {
        setSelectedSlot({ day, time });
        setShowScheduleModal(true);
    };

    const handleSchedulePost = () => {
        if (!selectedSlot || !selectedClip) return;

        const newPost: ScheduledPost = {
            id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clipId: selectedClip.id,
            day: selectedSlot.day,
            time: selectedSlot.time,
            platform: selectedPlatform,
            clip: selectedClip,
        };

        setScheduledPosts(prev => [...prev, newPost]);
        setShowScheduleModal(false);
        setSelectedSlot(null);
        setSelectedClip(null);
    };

    const handleDeletePost = (postId: string) => {
        setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    };

    const getScheduledPost = (day: string, time: string) => {
        return scheduledPosts.find(p => p.day === day && p.time === time);
    };

    const renderTimeSlot = (day: string, time: string) => {
        const post = getScheduledPost(day, time);

        return (
            <TouchableOpacity
                key={`${day}-${time}`}
                style={[styles.timeSlot, post && styles.scheduledSlot]}
                onPress={() => handleSlotPress(day, time)}
            >
                {post ? (
                    <View style={styles.scheduledContent}>
                        <Image source={{ uri: post.clip.thumbnail }} style={styles.slotThumbnail} />
                        <Text style={styles.slotTitle}>{post.clip.title}</Text>
                        <Text style={styles.slotPlatform}>{post.platform}</Text>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleDeletePost(post.id)}
                        >
                            <Text style={styles.deleteBtnText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.emptySlotText}>{time}</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Clip Scheduler</Text>
            {faithMode && (
                <View style={styles.faithBox}>
                    <Text style={styles.faithVerse}>{VERSES[verseIdx]}</Text>
                    <Text style={styles.faithEncouragement}>Ask God for timing.</Text>
                </View>
            )}
            {encouragementMode && (
                <Text style={styles.encouragement}>Strategy is spiritual. Post with purpose.</Text>
            )}
            <ScrollView horizontal style={styles.daysScroll} showsHorizontalScrollIndicator={false}>
                {DAYS.map(day => (
                    <View key={day} style={styles.dayColumn}>
                        <Text style={styles.dayHeader}>{day}</Text>
                        {TIME_SLOTS.map(time => renderTimeSlot(day, time))}
                    </View>
                ))}
            </ScrollView>
            <Modal visible={showScheduleModal} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Schedule Post</Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedSlot?.day} at {selectedSlot?.time}
                        </Text>
                        <ScrollView horizontal style={styles.clipsRow} showsHorizontalScrollIndicator={false}>
                            {MOCK_CLIPS.map(clip => (
                                <TouchableOpacity
                                    key={clip.id}
                                    style={[styles.clipOption, selectedClip?.id === clip.id && styles.selectedClipOption]}
                                    onPress={() => setSelectedClip(clip)}
                                >
                                    <Image source={{ uri: clip.thumbnail }} style={styles.clipOptionThumb} />
                                    <Text style={styles.clipOptionTitle}>{clip.title}</Text>
                                    <Text style={styles.clipOptionCaption}>{clip.caption}</Text>
                                    {clip.faithMode && <Text style={styles.faithBadge}>✝️</Text>}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.platformRow}>
                            <Text style={styles.platformLabel}>Platform:</Text>
                            {PLATFORMS.map(platform => (
                                <TouchableOpacity
                                    key={platform}
                                    style={[styles.platformBtn, selectedPlatform === platform && styles.selectedPlatformBtn]}
                                    onPress={() => setSelectedPlatform(platform)}
                                >
                                    <Text style={styles.platformBtnText}>{platform}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalButtons}>
                            <Button title="Schedule" onPress={handleSchedulePost} />
                            <Button title="Cancel" onPress={() => setShowScheduleModal(false)} />
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
    faithBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    faithVerse: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    faithEncouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 14,
        textAlign: 'center',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    daysScroll: {
        flexGrow: 0,
        flexShrink: 0,
    },
    dayColumn: {
        width: 120,
        marginRight: 12,
        alignItems: 'center',
    },
    dayHeader: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.crimson,
        fontSize: 18,
        marginBottom: 8,
        letterSpacing: 1,
    },
    timeSlot: {
        width: 110,
        height: 80,
        backgroundColor: Colors.dark.black,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduledSlot: {
        borderColor: Colors.dark.accent,
        backgroundColor: Colors.dark.crimson,
    },
    emptySlotText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 12,
    },
    scheduledContent: {
        width: '100%',
        height: '100%',
        padding: 4,
        alignItems: 'center',
        position: 'relative',
    },
    slotThumbnail: {
        width: 40,
        height: 22,
        borderRadius: 4,
        marginBottom: 2,
    },
    slotTitle: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 10,
        textAlign: 'center',
    },
    slotPlatform: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 8,
    },
    deleteBtn: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: Colors.dark.crimson,
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtnText: {
        color: Colors.dark.gold,
        fontSize: 12,
        fontFamily: 'BebasNeue',
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
        width: '90%',
        maxHeight: '80%',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    modalTitle: {
        fontFamily: 'BebasNeue',
        fontSize: 24,
        color: Colors.dark.gold,
        marginBottom: 4,
        letterSpacing: 1,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    clipsRow: {
        flexGrow: 0,
        flexShrink: 0,
        maxHeight: 120,
        marginBottom: 16,
    },
    clipOption: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        marginRight: 12,
        alignItems: 'center',
        padding: 8,
        minWidth: 100,
        position: 'relative',
    },
    selectedClipOption: {
        borderColor: Colors.dark.accent,
        backgroundColor: Colors.dark.crimson,
    },
    clipOptionThumb: {
        width: 60,
        height: 34,
        borderRadius: 6,
        marginBottom: 4,
    },
    clipOptionTitle: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 2,
    },
    clipOptionCaption: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 10,
        textAlign: 'center',
    },
    faithBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        fontSize: 12,
    },
    platformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'center',
    },
    platformLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginRight: 8,
    },
    platformBtn: {
        backgroundColor: Colors.dark.black,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: Colors.dark.gold,
    },
    selectedPlatformBtn: {
        backgroundColor: Colors.dark.crimson,
        borderColor: Colors.dark.gold,
    },
    platformBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
}); 