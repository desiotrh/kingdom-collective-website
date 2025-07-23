import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, Switch } from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';
import VoiceStudioTab from '../components/kingdom-voice/VoiceStudioTab';
import FaithToolsTab from '../components/kingdom-voice/FaithToolsTab';
import PodcastStudioTab from '../components/kingdom-voice/PodcastStudioTab';
import CollaborationTab from '../components/kingdom-voice/CollaborationTab';
import MonetizationTab from '../components/kingdom-voice/MonetizationTab';
import AnalyticsTab from '../components/kingdom-voice/AnalyticsTab';

const { width } = Dimensions.get('window');

const TABS = [
    { id: 'voice-studio', label: 'Voice Studio', icon: '🎙️' },
    { id: 'faith-tools', label: 'Faith Tools', icon: '📖' },
    { id: 'podcast-studio', label: 'Podcast Studio', icon: '🎬' },
    { id: 'collaboration', label: 'Collab', icon: '🤝' },
    { id: 'monetization', label: 'Monetize', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
];

const KingdomVoiceScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('voice-studio');
    const [faithMode, setFaithMode] = useState(true);
    const [encouragementMode, setEncouragementMode] = useState(false);
    const [testMode, setTestMode] = useState(false);

    const renderTabContent = () => {
        const tabProps = { faithMode, encouragementMode, testMode };
        switch (activeTab) {
            case 'voice-studio':
                return <VoiceStudioTab {...tabProps} />;
            case 'faith-tools':
                return <FaithToolsTab {...tabProps} />;
            case 'podcast-studio':
                return <PodcastStudioTab {...tabProps} />;
            case 'collaboration':
                return <CollaborationTab {...tabProps} />;
            case 'monetization':
                return <MonetizationTab {...tabProps} />;
            case 'analytics':
                return <AnalyticsTab {...tabProps} />;
            default:
                return <VoiceStudioTab {...tabProps} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kingdom Voice</Text>
                <Text style={styles.subtitle}>Record. Proclaim. Transform.</Text>
                <View style={styles.modeToggles}>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Faith Mode</Text>
                        <Switch
                            value={faithMode}
                            onValueChange={setFaithMode}
                            thumbColor={faithMode ? KingdomColors.primary : KingdomColors.gray}
                        />
                    </View>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Encouragement Mode</Text>
                        <Switch
                            value={encouragementMode}
                            onValueChange={setEncouragementMode}
                            thumbColor={encouragementMode ? KingdomColors.primary : KingdomColors.gray}
                        />
                    </View>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Test Mode</Text>
                        <Switch
                            value={testMode}
                            onValueChange={setTestMode}
                            thumbColor={testMode ? KingdomColors.warning : KingdomColors.gray}
                        />
                    </View>
                </View>
                {testMode && (
                    <View style={styles.testModeBanner}>
                        <Text style={styles.testModeText}>TEST MODE ENABLED</Text>
                    </View>
                )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={styles.tabIcon}>{tab.icon}</Text>
                        <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KingdomColors.background,
    },
    header: {
        padding: 20,
        backgroundColor: KingdomColors.primary,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.white,
    },
    subtitle: {
        fontSize: 16,
        color: KingdomColors.white,
        marginTop: 5,
        marginBottom: 10,
    },
    modeToggles: {
        flexDirection: 'row',
        marginTop: 10,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    toggleLabel: {
        color: KingdomColors.white,
        fontSize: 14,
        marginRight: 8,
    },
    tabBar: {
        backgroundColor: KingdomColors.white,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.lightGray,
    },
    tab: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: KingdomColors.lightGray,
    },
    activeTab: {
        backgroundColor: KingdomColors.primary,
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 2,
        color: KingdomColors.darkGray,
    },
    tabLabel: {
        fontSize: 12,
        color: KingdomColors.darkGray,
        fontWeight: '600',
    },
    activeTabLabel: {
        color: KingdomColors.white,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    testModeBanner: {
        marginTop: 10,
        backgroundColor: KingdomColors.warning,
        padding: 6,
        borderRadius: 8,
    },
    testModeText: {
        color: KingdomColors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default KingdomVoiceScreen; 