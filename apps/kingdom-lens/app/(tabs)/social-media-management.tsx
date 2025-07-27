import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Switch,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { useFaithMode } from '@/contexts/FaithModeContext';

const { width } = Dimensions.get('window');

interface SocialMediaPlatform {
    id: string;
    name: string;
    icon: string;
    color: string;
    isConnected: boolean;
    accounts: SocialMediaAccount[];
}

interface SocialMediaAccount {
    id: string;
    username: string;
    accountId: string;
    isActive: boolean;
    platformId: string;
    connectedAt: Date;
}

const SocialMediaManagementScreen: React.FC = () => {
    const { faithMode } = useFaithMode();
    const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaPlatform | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<SocialMediaAccount | null>(null);

    // Mock platforms for Kingdom Lens (photography-focused)
    const supportedPlatforms = [
        { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
        { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#BD081C' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
        { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
        { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
        { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
        { id: 'behance', name: 'Behance', icon: '🎨', color: '#1769FF' },
        { id: 'dribbble', name: 'Dribbble', icon: '🏀', color: '#EA4C89' },
        { id: '500px', name: '500px', icon: '📸', color: '#0099E5' },
    ];

    useEffect(() => {
        loadPlatforms();
    }, []);

    const loadPlatforms = async () => {
        setIsLoading(true);
        try {
            // Mock data - in real app, this would come from backend
            const mockPlatforms = supportedPlatforms.map(platform => ({
                ...platform,
                isConnected: Math.random() > 0.5, // Random connection status
                accounts: Math.random() > 0.5 ? [
                    {
                        id: `account_${platform.id}_1`,
                        username: `@lens_${platform.id}`,
                        accountId: `acc_${platform.id}_1`,
                        isActive: true,
                        platformId: platform.id,
                        connectedAt: new Date(),
                    }
                ] : []
            }));
            setPlatforms(mockPlatforms);
        } catch (error) {
            console.error('Error loading platforms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectPlatform = async (platform: SocialMediaPlatform) => {
        setSelectedPlatform(platform);
        setShowConnectModal(true);
    };

    const handleAddAccount = async (platformId: string, authData: any) => {
        try {
            const newAccount: SocialMediaAccount = {
                id: `account_${platformId}_${Date.now()}`,
                username: authData.username || `@lens_${platformId}`,
                accountId: authData.accountId || `acc_${platformId}_${Date.now()}`,
                isActive: true,
                platformId,
                connectedAt: new Date(),
            };

            setPlatforms(prev => prev.map(p =>
                p.id === platformId
                    ? { ...p, isConnected: true, accounts: [...p.accounts, newAccount] }
                    : p
            ));

            setShowConnectModal(false);
            Alert.alert('Success', `${selectedPlatform?.name} connected successfully!`);
        } catch (error) {
            Alert.alert('Error', 'Failed to connect platform');
        }
    };

    const handleRemoveAccount = async (platformId: string, accountId: string) => {
        Alert.alert(
            'Remove Account',
            'Are you sure you want to remove this account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setPlatforms(prev => prev.map(p => {
                            if (p.id === platformId) {
                                const updatedAccounts = p.accounts.filter(a => a.id !== accountId);
                                return {
                                    ...p,
                                    isConnected: updatedAccounts.length > 0,
                                    accounts: updatedAccounts,
                                };
                            }
                            return p;
                        }));
                        Alert.alert('Success', 'Account removed successfully');
                    }
                },
            ]
        );
    };

    const handleSetActiveAccount = (platformId: string, accountId: string) => {
        setPlatforms(prev => prev.map(p => {
            if (p.id === platformId) {
                return {
                    ...p,
                    accounts: p.accounts.map(a => ({
                        ...a,
                        isActive: a.id === accountId,
                    })),
                };
            }
            return p;
        }));
    };

    const renderPlatformCard = (platform: SocialMediaPlatform) => {
        const activeAccount = platform.accounts.find(a => a.isActive);

        return (
            <BlurView intensity={15} style={styles.platformCard} key={platform.id}>
                <LinearGradient
                    colors={[`${platform.color}20`, `${platform.color}10`]}
                    style={styles.platformGradient}
                >
                    <View style={styles.platformHeader}>
                        <Text style={styles.platformIcon}>{platform.icon}</Text>
                        <View style={styles.platformInfo}>
                            <Text style={styles.platformName}>{platform.name}</Text>
                            <Text style={styles.platformStatus}>
                                {platform.isConnected
                                    ? `${platform.accounts.length} account${platform.accounts.length !== 1 ? 's' : ''} connected`
                                    : 'Not connected'
                                }
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.connectButton, { backgroundColor: platform.color }]}
                            onPress={() => handleConnectPlatform(platform)}
                        >
                            <Text style={styles.connectButtonText}>
                                {platform.isConnected ? 'Manage' : 'Connect'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {platform.isConnected && platform.accounts.length > 0 && (
                        <View style={styles.accountsSection}>
                            <Text style={styles.accountsTitle}>Connected Accounts:</Text>
                            {platform.accounts.map(account => (
                                <View key={account.id} style={styles.accountItem}>
                                    <View style={styles.accountInfo}>
                                        <Text style={styles.accountUsername}>{account.username}</Text>
                                        <Text style={styles.accountStatus}>
                                            {account.isActive ? 'Active' : 'Inactive'}
                                        </Text>
                                    </View>
                                    <View style={styles.accountActions}>
                                        {!account.isActive && (
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => handleSetActiveAccount(platform.id, account.id)}
                                            >
                                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleRemoveAccount(platform.id, account.id)}
                                        >
                                            <Ionicons name="trash" size={20} color="#F44336" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </LinearGradient>
            </BlurView>
        );
    };

    const renderConnectModal = () => (
        <Modal
            visible={showConnectModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowConnectModal(false)}
        >
            <View style={styles.modalOverlay}>
                <BlurView intensity={20} style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Connect {selectedPlatform?.name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowConnectModal(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <Text style={styles.modalDescription}>
                            {faithMode
                                ? `Connect your ${selectedPlatform?.name} account to share your visual testimony and creative work with the world.`
                                : `Connect your ${selectedPlatform?.name} account to share your photography and visual content with your audience.`
                            }
                        </Text>

                        <TouchableOpacity
                            style={[styles.connectActionButton, { backgroundColor: selectedPlatform?.color }]}
                            onPress={() => {
                                // Mock connection - in real app, this would open OAuth flow
                                handleAddAccount(selectedPlatform!.id, {
                                    username: `@lens_${selectedPlatform!.id}`,
                                    accountId: `acc_${selectedPlatform!.id}_${Date.now()}`,
                                });
                            }}
                        >
                            <Text style={styles.connectActionButtonText}>
                                Connect {selectedPlatform?.name} Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </View>
        </Modal>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                    <Text style={styles.loadingText}>Loading social platforms...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {faithMode ? 'Visual Ministry Hub' : 'Social Media Hub'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {faithMode
                            ? 'Connect your platforms to share your visual testimony and creative work'
                            : 'Manage your social media accounts for visual content distribution'
                        }
                    </Text>
                </View>

                {/* Connected Platforms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Connected Platforms ({platforms.filter(p => p.isConnected).length})
                    </Text>
                    {platforms.filter(p => p.isConnected).length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="camera" size={48} color="#666" />
                            <Text style={styles.emptyStateText}>
                                No platforms connected yet. Connect a platform to start sharing your visual content!
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.platformGrid}>
                            {platforms.filter(p => p.isConnected).map(renderPlatformCard)}
                        </View>
                    )}
                </View>

                {/* Available Platforms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Platforms</Text>
                    <View style={styles.platformGrid}>
                        {platforms.filter(p => !p.isConnected).map(renderPlatformCard)}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="refresh" size={24} color="#9C27B0" />
                            <Text style={styles.quickActionText}>Refresh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Ionicons name="settings" size={24} color="#9C27B0" />
                            <Text style={styles.quickActionText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {renderConnectModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 22,
    },
    section: {
        padding: 20,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    platformGrid: {
        gap: 16,
    },
    platformCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    platformGradient: {
        padding: 20,
    },
    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    platformIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    platformStatus: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    connectButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    accountsSection: {
        marginTop: 16,
    },
    accountsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 8,
    },
    accountInfo: {
        flex: 1,
    },
    accountUsername: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    accountStatus: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    accountActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#CCCCCC',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 16,
    },
    quickActionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(156, 39, 176, 0.3)',
    },
    quickActionText: {
        fontSize: 14,
        color: '#9C27B0',
        marginTop: 8,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#CCCCCC',
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        maxHeight: '80%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 8,
    },
    modalBody: {
        padding: 20,
    },
    modalDescription: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 22,
        marginBottom: 24,
    },
    connectActionButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    connectActionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default SocialMediaManagementScreen; 