import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    Switch,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface WebsiteSection {
    id: string;
    type: 'about' | 'portfolio' | 'contact' | 'booking' | 'reviews' | 'socials';
    title: string;
    content: string;
    enabled: boolean;
}

interface Website {
    id: string;
    username: string;
    customDomain?: string;
    sections: WebsiteSection[];
    theme: 'faith' | 'encouragement' | 'professional';
    analytics: boolean;
    reelsEnabled: boolean;
    digitalStore: boolean;
    createdAt: Date;
}

const WebsiteBuilderScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [currentWebsite, setCurrentWebsite] = useState<Partial<Website>>({
        username: '',
        customDomain: '',
        sections: [
            {
                id: '1',
                type: 'about',
                title: 'About Me',
                content: '',
                enabled: true,
            },
            {
                id: '2',
                type: 'portfolio',
                title: 'Portfolio',
                content: '',
                enabled: true,
            },
            {
                id: '3',
                type: 'contact',
                title: 'Contact',
                content: '',
                enabled: true,
            },
            {
                id: '4',
                type: 'booking',
                title: 'Book Session',
                content: '',
                enabled: true,
            },
            {
                id: '5',
                type: 'reviews',
                title: 'Client Reviews',
                content: '',
                enabled: true,
            },
            {
                id: '6',
                type: 'socials',
                title: 'Social Media',
                content: '',
                enabled: true,
            },
        ],
        theme: isFaithMode ? 'faith' : 'encouragement',
        analytics: true,
        reelsEnabled: false,
        digitalStore: false,
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
    const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);

    const themes = [
        { id: 'faith', name: 'Faith Mode', description: 'Spiritual and inspiring design' },
        { id: 'encouragement', name: 'Encouragement Mode', description: 'Uplifting and positive design' },
        { id: 'professional', name: 'Professional Mode', description: 'Clean and business-focused design' },
    ];

    const createWebsite = () => {
        if (!currentWebsite.username) {
            Alert.alert('Missing Information', 'Please enter a username for your website.');
            return;
        }

        const website: Website = {
            id: Date.now().toString(),
            username: currentWebsite.username || '',
            customDomain: currentWebsite.customDomain,
            sections: currentWebsite.sections || [],
            theme: currentWebsite.theme || 'professional',
            analytics: currentWebsite.analytics || false,
            reelsEnabled: currentWebsite.reelsEnabled || false,
            digitalStore: currentWebsite.digitalStore || false,
            createdAt: new Date(),
        };

        setWebsites([website, ...websites]);
        setCurrentWebsite({
            username: '',
            customDomain: '',
            sections: [
                {
                    id: '1',
                    type: 'about',
                    title: 'About Me',
                    content: '',
                    enabled: true,
                },
                {
                    id: '2',
                    type: 'portfolio',
                    title: 'Portfolio',
                    content: '',
                    enabled: true,
                },
                {
                    id: '3',
                    type: 'contact',
                    title: 'Contact',
                    content: '',
                    enabled: true,
                },
                {
                    id: '4',
                    type: 'booking',
                    title: 'Book Session',
                    content: '',
                    enabled: true,
                },
                {
                    id: '5',
                    type: 'reviews',
                    title: 'Client Reviews',
                    content: '',
                    enabled: true,
                },
                {
                    id: '6',
                    type: 'socials',
                    title: 'Social Media',
                    content: '',
                    enabled: true,
                },
            ],
            theme: isFaithMode ? 'faith' : 'encouragement',
            analytics: true,
            reelsEnabled: false,
            digitalStore: false,
        });
        setShowCreateModal(false);

        Alert.alert(
            'Website Created',
            isFaithMode
                ? 'Your website has been blessed and is ready to share God\'s light with the world.'
                : 'Website created successfully! Ready to showcase your work.'
        );
    };

    const editSection = (section: WebsiteSection) => {
        setEditingSection(section);
        setShowEditModal(true);
    };

    const saveSection = () => {
        if (!editingSection) return;

        setCurrentWebsite({
            ...currentWebsite,
            sections: currentWebsite.sections?.map(section =>
                section.id === editingSection.id ? editingSection : section
            ),
        });
        setShowEditModal(false);
        setEditingSection(null);
    };

    const toggleSection = (sectionId: string) => {
        setCurrentWebsite({
            ...currentWebsite,
            sections: currentWebsite.sections?.map(section =>
                section.id === sectionId ? { ...section, enabled: !section.enabled } : section
            ),
        });
    };

    const getWebsiteUrl = (website: Website) => {
        if (website.customDomain) {
            return `https://${website.customDomain}`;
        }
        return `https://lens.kingdomstudios.app/${website.username}`;
    };

    const CreateWebsiteModal = () => (
        <Modal
            visible={showCreateModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Create Blessed Website' : 'Create New Website'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={currentWebsite.username}
                            onChangeText={(text) => setCurrentWebsite({ ...currentWebsite, username: text })}
                            placeholder="yourname"
                        />
                        <Text style={styles.urlPreview}>
                            URL: lens.kingdomstudios.app/{currentWebsite.username || 'yourname'}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Custom Domain (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={currentWebsite.customDomain}
                            onChangeText={(text) => setCurrentWebsite({ ...currentWebsite, customDomain: text })}
                            placeholder="yourdomain.com"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Theme</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {themes.map((theme) => (
                                <TouchableOpacity
                                    key={theme.id}
                                    style={[
                                        styles.themeButton,
                                        currentWebsite.theme === theme.id && styles.selectedTheme
                                    ]}
                                    onPress={() => setCurrentWebsite({ ...currentWebsite, theme: theme.id as any })}
                                >
                                    <Text style={[
                                        styles.themeText,
                                        currentWebsite.theme === theme.id && styles.selectedThemeText
                                    ]}>
                                        {theme.name}
                                    </Text>
                                    <Text style={[
                                        styles.themeDescription,
                                        currentWebsite.theme === theme.id && styles.selectedThemeDescription
                                    ]}>
                                        {theme.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.optionsContainer}>
                        <Text style={styles.optionsTitle}>Website Features</Text>

                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Site Analytics</Text>
                            <Switch
                                value={currentWebsite.analytics}
                                onValueChange={(value) => setCurrentWebsite({ ...currentWebsite, analytics: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>

                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Reels/Videos</Text>
                            <Switch
                                value={currentWebsite.reelsEnabled}
                                onValueChange={(value) => setCurrentWebsite({ ...currentWebsite, reelsEnabled: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>

                        <View style={styles.optionRow}>
                            <Text style={styles.optionLabel}>Digital Store</Text>
                            <Switch
                                value={currentWebsite.digitalStore}
                                onValueChange={(value) => setCurrentWebsite({ ...currentWebsite, digitalStore: value })}
                                trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                thumbColor={KingdomColors.softWhite}
                            />
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowCreateModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={createWebsite}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>
                                {isFaithMode ? 'Create & Bless' : 'Create Website'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const EditSectionModal = () => (
        <Modal
            visible={showEditModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Section</Text>

                    {editingSection && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Section Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingSection.title}
                                    onChangeText={(text) => setEditingSection({ ...editingSection, title: text })}
                                    placeholder="Enter section title"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Content</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editingSection.content}
                                    onChangeText={(text) => setEditingSection({ ...editingSection, content: text })}
                                    placeholder={isFaithMode
                                        ? "Share your story and God's work in your life..."
                                        : "Enter section content..."
                                    }
                                    multiline
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowEditModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.primaryButton]}
                                    onPress={saveSection}
                                >
                                    <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Website Builder - Faith Mode' : 'Website Builder'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Create websites that share God\'s light and your gifts'
                        : 'Build professional websites to showcase your photography'
                    }
                </Text>
            </View>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateModal(true)}
            >
                <Ionicons name="add-circle" size={24} color={KingdomColors.softWhite} />
                <Text style={styles.createButtonText}>
                    {isFaithMode ? 'Create Blessed Website' : 'Create New Website'}
                </Text>
            </TouchableOpacity>

            {websites.length > 0 && (
                <View style={styles.websitesSection}>
                    <Text style={styles.sectionTitle}>Your Websites</Text>
                    {websites.map((website) => (
                        <View key={website.id} style={styles.websiteCard}>
                            <View style={styles.websiteHeader}>
                                <Text style={styles.websiteTitle}>{website.username}</Text>
                                <View style={styles.websiteIcons}>
                                    {website.analytics && (
                                        <Ionicons name="analytics" size={16} color={KingdomColors.bronze} />
                                    )}
                                    {website.reelsEnabled && (
                                        <Ionicons name="videocam" size={16} color={KingdomColors.bronze} />
                                    )}
                                    {website.digitalStore && (
                                        <Ionicons name="cart" size={16} color={KingdomColors.bronze} />
                                    )}
                                </View>
                            </View>

                            <Text style={styles.websiteUrl}>{getWebsiteUrl(website)}</Text>
                            <Text style={styles.websiteTheme}>Theme: {themes.find(t => t.id === website.theme)?.name}</Text>
                            <Text style={styles.websiteCreated}>
                                Created: {website.createdAt.toLocaleDateString()}
                            </Text>

                            <View style={styles.websiteActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => Alert.alert('View Website', `Opening ${getWebsiteUrl(website)}`)}
                                >
                                    <Ionicons name="eye" size={16} color={KingdomColors.softWhite} />
                                    <Text style={styles.actionButtonText}>View</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => Alert.alert('Edit Website', 'Website editor opened')}
                                >
                                    <Ionicons name="create" size={16} color={KingdomColors.softWhite} />
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {currentWebsite.sections && currentWebsite.sections.length > 0 && (
                <View style={styles.sectionsSection}>
                    <Text style={styles.sectionTitle}>Website Sections</Text>
                    {currentWebsite.sections.map((section) => (
                        <View key={section.id} style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionInfo}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <Text style={styles.sectionType}>{section.type}</Text>
                                </View>
                                <Switch
                                    value={section.enabled}
                                    onValueChange={() => toggleSection(section.id)}
                                    trackColor={{ false: KingdomColors.dustGold, true: KingdomColors.bronze }}
                                    thumbColor={KingdomColors.softWhite}
                                />
                            </View>

                            {section.content && (
                                <Text style={styles.sectionContent} numberOfLines={2}>
                                    {section.content}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={styles.editSectionButton}
                                onPress={() => editSection(section)}
                            >
                                <Ionicons name="create" size={16} color={KingdomColors.bronze} />
                                <Text style={styles.editSectionButtonText}>Edit Content</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <CreateWebsiteModal />
            <EditSectionModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.matteBlack,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.bronze,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    createButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    createButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    websitesSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    websiteCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    websiteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    websiteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    websiteIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    websiteUrl: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    websiteTheme: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    websiteCreated: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        opacity: 0.8,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    websiteActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
        flex: 1,
        justifyContent: 'center',
    },
    actionButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    sectionsSection: {
        padding: 20,
    },
    sectionCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionInfo: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    sectionType: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        opacity: 0.8,
        fontFamily: 'Sora',
    },
    sectionContent: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    editSectionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    editSectionButtonText: {
        fontSize: 12,
        color: KingdomColors.bronze,
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    input: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    textInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    urlPreview: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    themeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    selectedTheme: {
        backgroundColor: KingdomColors.bronze,
    },
    themeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    selectedThemeText: {
        color: KingdomColors.softWhite,
    },
    themeDescription: {
        fontSize: 10,
        color: KingdomColors.bronze,
        textAlign: 'center',
        marginTop: 3,
        fontFamily: 'Sora',
    },
    selectedThemeDescription: {
        color: KingdomColors.softWhite,
    },
    optionsContainer: {
        marginBottom: 15,
    },
    optionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionLabel: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.bronze,
        fontFamily: 'Sora',
    },
    primaryButton: {
        backgroundColor: KingdomColors.bronze,
    },
    primaryButtonText: {
        color: KingdomColors.softWhite,
    },
});

export default WebsiteBuilderScreen; 