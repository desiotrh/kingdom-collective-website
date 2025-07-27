import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

const SUPPORTED_FORMATS = ['mp4', 'mov', 'm4v'];

function validateVideoUrl(url: string) {
    // Returns { valid: boolean, type: string | null, id: string | null }
    try {
        const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
        if (yt) return { valid: true, type: 'YouTube', id: yt[1] };
        const tiktok = url.match(/tiktok\.com\/.+\/video\/(\d+)/);
        if (tiktok) return { valid: true, type: 'TikTok', id: tiktok[1] };
        const zoom = url.match(/zoom\.us\/rec\/share\/(\w+)/);
        if (zoom) return { valid: true, type: 'Zoom', id: zoom[1] };
        return { valid: false, type: null, id: null };
    } catch {
        return { valid: false, type: null, id: null };
    }
}

export default function UploadVideoScreen() {
    const { faithMode } = useFaithMode();
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [urlMeta, setUrlMeta] = useState<{ valid: boolean; type: string | null; id: string | null } | null>(null);
    const [autoFaithOverlay, setAutoFaithOverlay] = useState(faithMode);
    const [error, setError] = useState('');

    const pickVideo = async () => {
        setError('');
        const res = await DocumentPicker.getDocumentAsync({
            type: 'video/*',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (res.canceled) return;
        const picked = res.assets[0];
        const ext = picked.name.split('.').pop()?.toLowerCase();
        if (!ext || !SUPPORTED_FORMATS.includes(ext)) {
            setError('Unsupported file type. Please select an MP4, MOV, or M4V video.');
            return;
        }
        setFile(picked);
        setVideoUrl('');
        setUrlMeta(null);
    };

    const handleUrlChange = (text: string) => {
        setVideoUrl(text);
        setFile(null);
        if (text.length > 6) {
            const meta = validateVideoUrl(text);
            setUrlMeta(meta);
            setError(meta.valid ? '' : 'Invalid or unsupported video link.');
        } else {
            setUrlMeta(null);
            setError('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Upload Video</Text>
            <View style={styles.uploadBox}>
                <Button title="Upload from Device" onPress={pickVideo} />
                {file && (
                    <Text style={styles.fileName}>Selected: {file.name}</Text>
                )}
                <Text style={styles.orText}>OR</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Paste YouTube, TikTok, or Zoom link"
                    placeholderTextColor={Colors.dark.gold}
                    value={videoUrl}
                    onChangeText={handleUrlChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {videoUrl.length > 0 && (
                    <Text style={styles.urlPreview}>
                        {urlMeta?.valid
                            ? `Parsed: ${urlMeta.type} (${urlMeta.id})`
                            : 'Invalid or unsupported link.'}
                    </Text>
                )}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.overlayBox}>
                <Text style={styles.encouragement}>
                    {faithMode
                        ? 'This story might deliver someone.'
                        : 'Your story has impact. This could reach someone at the right time.'}
                </Text>
                {faithMode && (
                    <View style={styles.faithToggleRow}>
                        <Text style={styles.faithToggleLabel}>Auto-add faith overlay after clipping</Text>
                        <Switch
                            value={autoFaithOverlay}
                            onValueChange={setAutoFaithOverlay}
                            thumbColor={autoFaithOverlay ? Colors.dark.gold : Colors.dark.crimson}
                            trackColor={{ true: Colors.dark.crimson, false: Colors.dark.gold }}
                        />
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
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 24,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 24,
        letterSpacing: 1,
        marginTop: Platform.OS === 'ios' ? 60 : 30,
    },
    uploadBox: {
        width: '100%',
        backgroundColor: Colors.dark.black,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    fileName: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 4,
    },
    orText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 18,
        marginVertical: 12,
        letterSpacing: 2,
    },
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        borderRadius: 10,
        padding: 12,
        color: Colors.dark.gold,
        fontFamily: 'Urbanist',
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
        backgroundColor: Colors.dark.background,
    },
    urlPreview: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginTop: 6,
    },
    error: {
        color: Colors.dark.crimson,
        fontFamily: 'Urbanist',
        fontSize: 15,
        marginTop: 8,
        marginBottom: 4,
    },
    overlayBox: {
        marginTop: 12,
        alignItems: 'center',
        width: '100%',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },
    faithToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    faithToggleLabel: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginRight: 12,
    },
}); 