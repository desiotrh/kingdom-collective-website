import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { KingdomColors } from '../../kingdom-studios/src/constants/KingdomColors';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProjects: 12,
        activeProjects: 3,
        totalPhotos: 847,
        totalRevenue: 2847.50,
        propheticPhotos: 23,
        clientSatisfaction: 4.8,
    });

    const [recentProjects, setRecentProjects] = useState([
        {
            id: '1',
            title: 'Sarah\'s Wedding',
            status: 'Active',
            photos: 156,
            date: '2024-01-15',
            type: 'Wedding',
        },
        {
            id: '2',
            title: 'Prophetic Portrait Session',
            status: 'Delivered',
            photos: 23,
            date: '2024-01-10',
            type: 'Prophetic',
        },
        {
            id: '3',
            title: 'Family Session - Johnson',
            status: 'Editing',
            photos: 89,
            date: '2024-01-08',
            type: 'Family',
        },
    ]);

    const quickActions = [
        {
            id: 'new-project',
            title: 'New Project',
            icon: '📸',
            color: KingdomColors.primary,
            route: '/projects',
        },
        {
            id: 'capture',
            title: 'Capture Photo',
            icon: '🎨',
            color: '#E91E63',
            route: '/studio',
        },
        {
            id: 'prophetic',
            title: 'Prophetic Mode',
            icon: '🙏',
            color: '#9C27B0',
            route: '/prophetic',
        },
        {
            id: 'contract',
            title: 'New Contract',
            icon: '📋',
            color: '#FF9800',
            route: '/workflow',
        },
    ];

    const handleQuickAction = (route: string) => {
        router.push(route as any);
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={styles.header}
            >
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.dateText}>January 16, 2024</Text>
            </LinearGradient>

            <View style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.totalProjects}</Text>
                            <Text style={styles.statLabel}>Total Projects</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.activeProjects}</Text>
                            <Text style={styles.statLabel}>Active Projects</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.totalPhotos}</Text>
                            <Text style={styles.statLabel}>Total Photos</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>${stats.totalRevenue}</Text>
                            <Text style={styles.statLabel}>Revenue</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.propheticPhotos}</Text>
                            <Text style={styles.statLabel}>Prophetic Photos</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.clientSatisfaction}</Text>
                            <Text style={styles.statLabel}>Client Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[styles.actionCard, { borderLeftColor: action.color }]}
                                onPress={() => handleQuickAction(action.route)}
                            >
                                <Text style={styles.actionIcon}>{action.icon}</Text>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Projects */}
                <View style={styles.recentProjectsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Projects</Text>
                        <TouchableOpacity onPress={() => router.push('/projects' as any)}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentProjects.map((project) => (
                        <TouchableOpacity
                            key={project.id}
                            style={styles.projectCard}
                            onPress={() => router.push(`/projects/${project.id}` as any)}
                        >
                            <View style={styles.projectInfo}>
                                <Text style={styles.projectTitle}>{project.title}</Text>
                                <Text style={styles.projectType}>{project.type}</Text>
                                <Text style={styles.projectDate}>{project.date}</Text>
                            </View>
                            <View style={styles.projectStats}>
                                <Text style={styles.projectPhotos}>{project.photos} photos</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                                    <Text style={styles.statusText}>{project.status}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Faith Mode Highlights */}
                <View style={styles.faithSection}>
                    <Text style={styles.sectionTitle}>Faith Mode Highlights</Text>
                    <View style={styles.faithCard}>
                        <Text style={styles.faithIcon}>🙏</Text>
                        <Text style={styles.faithTitle}>Prophetic Photo Challenge</Text>
                        <Text style={styles.faithDescription}>
                            This month's challenge: "Capture moments of breakthrough and restoration"
                        </Text>
                        <TouchableOpacity style={styles.faithButton}>
                            <Text style={styles.faithButtonText}>Join Challenge</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return '#4CAF50';
        case 'Delivered':
            return '#2196F3';
        case 'Editing':
            return '#FF9800';
        default:
            return '#9E9E9E';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 16,
        color: '#cccccc',
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
    statsSection: {
        marginBottom: 30,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 60) / 3,
        backgroundColor: '#2a2a3e',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: KingdomColors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#cccccc',
        textAlign: 'center',
    },
    quickActionsSection: {
        marginBottom: 30,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - 60) / 2,
        backgroundColor: '#2a2a3e',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    recentProjectsSection: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllText: {
        fontSize: 14,
        color: KingdomColors.primary,
    },
    projectCard: {
        backgroundColor: '#2a2a3e',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    projectType: {
        fontSize: 12,
        color: '#cccccc',
        marginBottom: 4,
    },
    projectDate: {
        fontSize: 12,
        color: '#999999',
    },
    projectStats: {
        alignItems: 'flex-end',
    },
    projectPhotos: {
        fontSize: 12,
        color: '#cccccc',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    faithSection: {
        marginBottom: 30,
    },
    faithCard: {
        backgroundColor: '#2a2a3e',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    faithIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    faithTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    faithDescription: {
        fontSize: 14,
        color: '#cccccc',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    faithButton: {
        backgroundColor: KingdomColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    faithButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default DashboardScreen; 