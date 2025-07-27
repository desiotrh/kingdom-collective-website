import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { KingdomColors } from '../../kingdom-studios/src/constants/KingdomColors';

const { width } = Dimensions.get('window');

const KingdomLensHome = () => {
    const router = useRouter();

    const features = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            subtitle: 'Overview & Quick Actions',
            icon: '📊',
            color: KingdomColors.primary,
            route: '/dashboard',
        },
        {
            id: 'projects',
            title: 'Photo Projects',
            subtitle: 'Manage shoots & albums',
            icon: '📸',
            color: '#E91E63',
            route: '/projects',
        },
        {
            id: 'prophetic',
            title: 'Prophetic Lens',
            subtitle: 'Spirit-led photography',
            icon: '🙏',
            color: '#9C27B0',
            route: '/prophetic',
        },
        {
            id: 'workflow',
            title: 'Workflow & Contracts',
            subtitle: 'Forms, contracts, automation',
            icon: '📋',
            color: '#FF9800',
            route: '/workflow',
        },
        {
            id: 'studio',
            title: 'Mobile Studio',
            subtitle: 'Capture & edit on-the-go',
            icon: '🎨',
            color: '#4CAF50',
            route: '/studio',
        },
        {
            id: 'store',
            title: 'Photo Store',
            subtitle: 'Sell prints & digital downloads',
            icon: '💰',
            color: '#2196F3',
            route: '/store',
        },
        {
            id: 'analytics',
            title: 'Analytics',
            subtitle: 'Track performance & impact',
            icon: '📈',
            color: '#607D8B',
            route: '/analytics',
        },
        {
            id: 'client-portal',
            title: 'Client Portal',
            subtitle: 'Client galleries & reviews',
            icon: '👥',
            color: '#795548',
            route: '/client-portal',
        },
        {
            id: 'community',
            title: 'Community',
            subtitle: 'Challenges & collaboration',
            icon: '🌟',
            color: '#FF5722',
            route: '/community',
        },
        {
            id: 'settings',
            title: 'Settings',
            subtitle: 'Account & preferences',
            icon: '⚙️',
            color: '#9E9E9E',
            route: '/settings',
        },
    ];

    const handleFeaturePress = (route: string) => {
        router.push(route as any);
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={styles.header}
            >
                <Text style={styles.title}>📸 Kingdom Lens</Text>
                <Text style={styles.subtitle}>
                    Faith-integrated photography for Christian creators
                </Text>
                <Text style={styles.description}>
                    Capture moments, serve clients, and share prophetic visual stories
                </Text>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Main Features</Text>

                <View style={styles.featuresGrid}>
                    {features.map((feature) => (
                        <TouchableOpacity
                            key={feature.id}
                            style={[styles.featureCard, { borderLeftColor: feature.color }]}
                            onPress={() => handleFeaturePress(feature.route)}
                        >
                            <Text style={styles.featureIcon}>{feature.icon}</Text>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: KingdomColors.primary }]}
                            onPress={() => router.push('/projects' as any)}
                        >
                            <Text style={styles.actionIcon}>📸</Text>
                            <Text style={styles.actionText}>New Project</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#E91E63' }]}
                            onPress={() => router.push('/studio' as any)}
                        >
                            <Text style={styles.actionIcon}>🎨</Text>
                            <Text style={styles.actionText}>Capture Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
                            onPress={() => router.push('/prophetic' as any)}
                        >
                            <Text style={styles.actionIcon}>🙏</Text>
                            <Text style={styles.actionText}>Prophetic Mode</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#cccccc',
        textAlign: 'center',
        lineHeight: 20,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    featureCard: {
        width: (width - 60) / 2,
        backgroundColor: '#2a2a3e',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: KingdomColors.primary,
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    featureSubtitle: {
        fontSize: 12,
        color: '#cccccc',
        lineHeight: 16,
    },
    quickActions: {
        marginTop: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        backgroundColor: KingdomColors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default KingdomLensHome; 