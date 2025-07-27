import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Modal,
    Alert,
    Switch,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    bio: string;
    kingdomCalling: string;
    role: 'member' | 'leader' | 'admin';
    joinedGroups: string[];
    joinDate: number;
    isActive: boolean;
}

interface GroupRole {
    groupId: string;
    groupName: string;
    role: 'member' | 'leader' | 'admin';
    joinedDate: number;
}

const MOCK_GROUPS = [
    { id: '1', name: 'Prophetic Activation', role: 'leader' as const },
    { id: '2', name: 'Growth Pod', role: 'member' as const },
    { id: '3', name: 'Prayer Warriors', role: 'admin' as const },
];

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    // State
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        username: 'faithbuilder',
        displayName: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'Passionate about building community and growing in faith.',
        kingdomCalling: 'To be a light in dark places and encourage others in their journey.',
        role: 'leader',
        joinedGroups: ['1', '2', '3'],
        joinDate: Date.now() - 7776000000, // 90 days ago
        isActive: true,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const saved = await AsyncStorage.getItem('userProfile');
            if (saved) {
                setProfile(JSON.parse(saved));
                setEditedProfile(JSON.parse(saved));
            }
        } catch (error) {
            console.log('Error loading profile:', error);
        }
    };

    const saveProfile = async (updatedProfile: UserProfile) => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);
        } catch (error) {
            console.log('Error saving profile:', error);
        }
    };

    const handleSave = () => {
        if (!editedProfile.displayName.trim()) {
            Alert.alert('Missing Information', 'Please enter a display name.');
            return;
        }

        saveProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return { text: '👑 Admin', color: colors.emerald };
            case 'leader':
                return { text: '⭐ Leader', color: colors.olive };
            case 'member':
                return { text: '👤 Member', color: colors.olive };
            default:
                return { text: '👤 Member', color: colors.olive };
        }
    };

    const getFaithBadge = () => {
        return faithMode
            ? { text: '✝️ Faith-Filled Builder', color: colors.emerald }
            : { text: '🕊 Growth Champion', color: colors.olive };
    };

    const formatJoinDate = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / 86400000);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        return 'Today';
    };

    const renderProfileHeader = () => (
        <View style={styles.profileHeader}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => isEditing && setShowAvatarModal(true)}
            >
                <Image
                    source={{ uri: editedProfile.avatar || 'https://randomuser.me/api/portraits/women/44.jpg' }}
                    style={styles.avatar}
                />
                {isEditing && (
                    <View style={[styles.editOverlay, { backgroundColor: colors.emerald }]}>
                        <Text style={[styles.editText, { color: colors.cream }]}>Edit</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
                <Text style={[styles.displayName, { color: colors.text }]}>
                    {editedProfile.displayName}
                </Text>
                <Text style={[styles.username, { color: colors.olive }]}>
                    @{editedProfile.username}
                </Text>

                <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: getRoleBadge(editedProfile.role).color }]}>
                        <Text style={[styles.badgeText, { color: colors.cream }]}>
                            {getRoleBadge(editedProfile.role).text}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getFaithBadge().color }]}>
                        <Text style={[styles.badgeText, { color: colors.cream }]}>
                            {getFaithBadge().text}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderBioSection = () => (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                {faithMode ? '✝️ Kingdom Calling' : '🕊 Your Mission'}
            </Text>

            {isEditing ? (
                <TextInput
                    style={[styles.textArea, {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.olive,
                    }]}
                    value={editedProfile.kingdomCalling}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, kingdomCalling: text }))}
                    placeholder={faithMode
                        ? "Share your Kingdom calling and purpose..."
                        : "Share your mission and growth goals..."
                    }
                    placeholderTextColor={colors.olive}
                    multiline
                    numberOfLines={4}
                />
            ) : (
                <Text style={[styles.bioText, { color: colors.text }]}>
                    {profile.kingdomCalling}
                </Text>
            )}
        </View>
    );

    const renderBio = () => (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                {faithMode ? '✝️ About Me' : '🕊 About Me'}
            </Text>

            {isEditing ? (
                <TextInput
                    style={[styles.textArea, {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.olive,
                    }]}
                    value={editedProfile.bio}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                    placeholder="Share a bit about yourself..."
                    placeholderTextColor={colors.olive}
                    multiline
                    numberOfLines={3}
                />
            ) : (
                <Text style={[styles.bioText, { color: colors.text }]}>
                    {profile.bio}
                </Text>
            )}
        </View>
    );

    const renderGroupsSection = () => (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                {faithMode ? '✝️ My Groups' : '🕊 My Groups'}
            </Text>

            <View style={styles.groupsList}>
                {MOCK_GROUPS.map((group) => (
                    <View key={group.id} style={[styles.groupItem, { borderColor: colors.olive }]}>
                        <View style={styles.groupInfo}>
                            <Text style={[styles.groupName, { color: colors.text }]}>
                                {group.name}
                            </Text>
                            <Text style={[styles.groupRole, { color: colors.olive }]}>
                                {getRoleBadge(group.role).text}
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.viewGroupButton, { backgroundColor: colors.emerald }]}>
                            <Text style={[styles.viewGroupButtonText, { color: colors.cream }]}>
                                View
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderStatsSection = () => (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                {faithMode ? '✝️ Kingdom Stats' : '🕊 Growth Stats'}
            </Text>

            <View style={styles.statsGrid}>
                <View style={[styles.statItem, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.statNumber, { color: colors.emerald }]}>
                        {MOCK_GROUPS.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.olive }]}>
                        Groups
                    </Text>
                </View>

                <View style={[styles.statItem, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.statNumber, { color: colors.emerald }]}>
                        {formatJoinDate(profile.joinDate)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.olive }]}>
                        Member Since
                    </Text>
                </View>

                <View style={[styles.statItem, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.statNumber, { color: colors.emerald }]}>
                        {profile.isActive ? 'Active' : 'Inactive'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.olive }]}>
                        Status
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.emerald }]}>
                        {faithMode ? 'My Profile' : 'My Profile'}
                    </Text>
                    <TouchableOpacity
                        style={[styles.editButton, { backgroundColor: colors.emerald }]}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Text style={[styles.editButtonText, { color: colors.cream }]}>
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Content */}
                {renderProfileHeader()}
                {renderBioSection()}
                {renderBio()}
                {renderGroupsSection()}
                {renderStatsSection()}

                {/* Save/Cancel Buttons */}
                {isEditing && (
                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={handleCancel}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.emerald }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.saveButtonText, { color: colors.cream }]}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Avatar Modal */}
            <Modal
                visible={showAvatarModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            Change Avatar
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowAvatarModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={[styles.modalText, { color: colors.olive }]}>
                            Avatar upload functionality coming soon...
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#2F7766',
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    editText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    profileInfo: {
        flex: 1,
    },
    displayName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Nunito_700SemiBold',
    },
    username: {
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Quicksand_400Regular',
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    section: {
        margin: 20,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Quicksand_400Regular',
        textAlignVertical: 'top',
        minHeight: 80,
    },
    bioText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    groupsList: {
        gap: 12,
    },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    groupInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    groupRole: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    viewGroupButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    viewGroupButtonText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Nunito_700SemiBold',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    editActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
}); 