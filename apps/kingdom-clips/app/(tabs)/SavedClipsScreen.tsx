import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { useClipsSync } from '../../hooks/useClipsSync';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function SavedClipsScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const {
        clips,
        loading,
        syncing,
        deleteClip,
        markAsSharedTestimony,
        unsyncedCount,
        faithClips,
        sharedTestimonies
    } = useClipsSync();
    const [addVerseOverlay, setAddVerseOverlay] = useState(faithMode);

    const handleDelete = (id: string) => {
        Alert.alert('Delete Clip', 'Are you sure you want to delete this clip?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    deleteClip(id);
                }
            }
        ]);
    };

    const handleShare = (clip: any) => {
        Alert.alert('Share', `Pretend to share: ${clip.title}`);
    };

    const handleView = (clip: any) => {
        Alert.alert('View', `Pretend to view: ${clip.title}`);
    };

    const handleSaveToDevice = async (clip: any) => {
        try {
            const fileUri = clip.fileName;
            const exists = await FileSystem.getInfoAsync(fileUri);
            if (!exists.exists) {
                Alert.alert('File not found', 'This is a mock file. In a real app, the file would be saved here.');
                return;
            }
            await Sharing.shareAsync(fileUri, { dialogTitle: `Share ${clip.title}` });
        } catch (e) {
            Alert.alert('Error', 'Could not share file.');
        }
    };

    const handleCopyLink = (clip: any) => {
        Alert.alert('Copy Link', 'This feature will be available when clips are hosted online.');
    };

    const handleShareTikTok = (clip: any) => {
        Alert.alert('Share to TikTok', 'This feature will be available in a future update.');
    };

    const handleShareInstagram = (clip: any) => {
        Alert.alert('Share to Instagram', 'This feature will be available in a future update.');
    };

    const handleToggleSharedTestimony = (clipId: string, currentValue: boolean) => {
        markAsSharedTestimony(clipId, !currentValue);
    };

    const renderClip = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.thumbnailBox}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                {item.faithMode && (
                    <View style={styles.watermark}><Text style={styles.watermarkText}>✝️</Text></View>
                )}
                {!item.synced && (
                    <View style={styles.syncIndicator}><Text style={styles.syncIndicatorText}>⏳</Text></View>
                )}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.duration}>{item.stats?.views || 0} views</Text>
            <Text style={styles.timestamp}>{new Date(item.dateCreated).toLocaleDateString()} {new Date(item.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            {item.faithMode && (
                <View style={styles.faithBadgeRow}>
                    <Text style={styles.faithBadge}>✝️</Text>
                    <Text style={styles.faithLabel}>Faith Clip</Text>
                </View>
            )}
            {item.faithMode && (
                <View style={styles.sharedTestimonyRow}>
                    <Text style={styles.sharedTestimonyLabel}>Shared Testimony</Text>
                    <Switch
                        value={item.sharedTestimony || false}
                        onValueChange={(value) => handleToggleSharedTestimony(item.id, value)}
                        thumbColor={item.sharedTestimony ? Colors.dark.gold : Colors.dark.crimson}
                        trackColor={{ true: Colors.dark.crimson, false: Colors.dark.gold }}
                    />
                </View>
            )}
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handleView(item)} style={styles.actionBtn}><Text style={styles.actionBtnText}>View</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionBtn}><Text style={styles.actionBtnText}>Share</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}><Text style={styles.actionBtnText}>Delete</Text></TouchableOpacity>
            </View>
            <View style={styles.exportRow}>
                <TouchableOpacity onPress={() => handleSaveToDevice(item)} style={styles.exportBtn}><Text style={styles.exportBtnText}>Save to device</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleShareTikTok(item)} style={styles.exportBtn}><Text style={styles.exportBtnText}>TikTok</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleShareInstagram(item)} style={styles.exportBtn}><Text style={styles.exportBtnText}>Instagram</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleCopyLink(item)} style={styles.exportBtn}><Text style={styles.exportBtnText}>Copy Link</Text></TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Saved Clips</Text>
                <Text style={styles.loadingText}>Loading your clips...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Saved Clips</Text>
            {encouragementMode && (
                <Text style={styles.encouragement}>Your voice won't be lost. It's stored and secure.</Text>
            )}
            {unsyncedCount > 0 && (
                <Text style={styles.syncStatus}>{unsyncedCount} clips pending sync</Text>
            )}
            {syncing && (
                <Text style={styles.syncStatus}>Syncing to cloud...</Text>
            )}
            {faithMode && (
                <View style={styles.faithToggleRow}>
                    <Text style={styles.faithToggleLabel}>Add final verse overlay before export</Text>
                    <Switch value={addVerseOverlay} onValueChange={setAddVerseOverlay} />
                </View>
            )}
            <FlatList
                data={clips}
                renderItem={renderClip}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
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
        marginBottom: 12,
        letterSpacing: 1,
        textAlign: 'center',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 16,
        flex: 1,
    },
    duration: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 14,
        marginLeft: 8,
    },
    timestamp: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 12,
        marginBottom: 2,
        textAlign: 'center',
    },
    faithBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    faithBadge: {
        fontSize: 18,
        marginRight: 4,
    },
    faithLabel: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 13,
        letterSpacing: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    actionBtn: {
        backgroundColor: Colors.dark.gold,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginHorizontal: 2,
    },
    actionBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 14,
    },
    thumbnailBox: {
        position: 'relative',
    },
    watermark: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(246,226,127,0.7)',
        borderRadius: 8,
        padding: 2,
    },
    watermarkText: {
        fontSize: 16,
        color: Colors.dark.crimson,
        fontFamily: 'BebasNeue',
    },
    exportRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 6,
    },
    exportBtn: {
        backgroundColor: Colors.dark.accent,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        margin: 2,
    },
    exportBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 13,
    },
    faithToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'center',
    },
    faithToggleLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginRight: 10,
    },
});

const additionalStyles = StyleSheet.create({
    syncIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(249,211,66,0.8)',
        borderRadius: 8,
        padding: 2,
    },
    syncIndicatorText: {
        fontSize: 12,
        color: Colors.dark.black,
    },
    syncStatus: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
    },
    loadingText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    sharedTestimonyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
        paddingHorizontal: 8,
    },
    sharedTestimonyLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 12,
    },
}); 