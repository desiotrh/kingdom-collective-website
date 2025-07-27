import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    FlatList,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Shoot {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    client: string;
    notes: string;
    status: 'Booked' | 'Pending' | 'Delivered';
    createdAt: string;
}

export default function ShootPlannerScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [shoots, setShoots] = useState<Shoot[]>([]);
    const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [newShoot, setNewShoot] = useState<Partial<Shoot>>({});

    useEffect(() => {
        loadShoots();
    }, []);

    const loadShoots = async () => {
        try {
            const storedShoots = await AsyncStorage.getItem('@kingdom_lens_shoots');
            if (storedShoots) {
                setShoots(JSON.parse(storedShoots));
            }
        } catch (error) {
            console.error('Error loading shoots:', error);
        }
    };

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Divine Appointments';
        } else if (encouragementMode) {
            return 'Session Planner';
        }
        return 'Shoot Planner';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Plan your sessions with His guidance';
        } else if (encouragementMode) {
            return 'Organize your creative sessions';
        }
        return 'Manage your photography sessions';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Booked':
                return theme.colors.success;
            case 'Pending':
                return theme.colors.warning;
            case 'Delivered':
                return theme.colors.info;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Booked':
                return '✅';
            case 'Pending':
                return '⏳';
            case 'Delivered':
                return '📦';
            default:
                return '📸';
        }
    };

    const handleAddShoot = async () => {
        if (!newShoot.title || !newShoot.date || !newShoot.client) {
            Alert.alert('Missing Information', 'Please fill in title, date, and client');
            return;
        }

        try {
            const shoot: Shoot = {
                id: Date.now().toString(),
                title: newShoot.title!,
                date: newShoot.date!,
                time: newShoot.time || 'TBD',
                location: newShoot.location || 'TBD',
                client: newShoot.client!,
                notes: newShoot.notes || '',
                status: (newShoot.status as 'Booked' | 'Pending' | 'Delivered') || 'Pending',
                createdAt: new Date().toISOString(),
            };

            const updatedShoots = [...shoots, shoot];
            setShoots(updatedShoots);
            await AsyncStorage.setItem('@kingdom_lens_shoots', JSON.stringify(updatedShoots));

            const successMessage = faithMode
                ? 'Session added with His blessing'
                : encouragementMode
                    ? 'Session added with intention'
                    : 'Session added successfully';

            Alert.alert('Success', successMessage);
            setShowAddModal(false);
            setNewShoot({});
        } catch (error) {
            console.error('Error adding shoot:', error);
            Alert.alert('Error', 'Failed to add session');
        }
    };

    const handleStatusChange = async (shootId: string, newStatus: 'Booked' | 'Pending' | 'Delivered') => {
        try {
            const updatedShoots = shoots.map(shoot =>
                shoot.id === shootId ? { ...shoot, status: newStatus } : shoot
            );
            setShoots(updatedShoots);
            await AsyncStorage.setItem('@kingdom_lens_shoots', JSON.stringify(updatedShoots));
        } catch (error) {
            console.error('Error updating shoot status:', error);
        }
    };

    const renderShootCard = ({ item }: { item: Shoot }) => (
        <View style={[styles.shootCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.shootHeader}>
                <Text style={[styles.shootTitle, { color: theme.colors.text }]}>
                    {item.title}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                </View>
            </View>

            <Text style={[styles.shootInfo, { color: theme.colors.textSecondary }]}>
                📅 {item.date} at {item.time}
            </Text>
            <Text style={[styles.shootInfo, { color: theme.colors.textSecondary }]}>
                👤 {item.client}
            </Text>
            <Text style={[styles.shootInfo, { color: theme.colors.textSecondary }]}>
                📍 {item.location}
            </Text>

            {item.notes && (
                <Text style={[styles.shootNotes, { color: theme.colors.textSecondary }]}>
                    📝 {item.notes}
                </Text>
            )}

            <View style={styles.statusActions}>
                <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: theme.colors.success }]}
                    onPress={() => handleStatusChange(item.id, 'Booked')}
                >
                    <Text style={[styles.statusButtonText, { color: theme.colors.surface }]}>
                        Booked
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: theme.colors.warning }]}
                    onPress={() => handleStatusChange(item.id, 'Pending')}
                >
                    <Text style={[styles.statusButtonText, { color: theme.colors.surface }]}>
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: theme.colors.info }]}
                    onPress={() => handleStatusChange(item.id, 'Delivered')}
                >
                    <Text style={[styles.statusButtonText, { color: theme.colors.surface }]}>
                        Delivered
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.watermark, { color: theme.colors.primary }]}>
                        {faithTheme.watermark}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {getScreenTitle()}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {getScreenSubtitle()}
                    </Text>
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewModeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.viewModeButton,
                            { backgroundColor: theme.colors.surface },
                            viewMode === 'Month' && { backgroundColor: theme.colors.primary }
                        ]}
                        onPress={() => setViewMode('Month')}
                    >
                        <Text style={[
                            styles.viewModeText,
                            { color: viewMode === 'Month' ? theme.colors.surface : theme.colors.text }
                        ]}>
                            Month
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.viewModeButton,
                            { backgroundColor: theme.colors.surface },
                            viewMode === 'Week' && { backgroundColor: theme.colors.primary }
                        ]}
                        onPress={() => setViewMode('Week')}
                    >
                        <Text style={[
                            styles.viewModeText,
                            { color: viewMode === 'Week' ? theme.colors.surface : theme.colors.text }
                        ]}>
                            Week
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.viewModeButton,
                            { backgroundColor: theme.colors.surface },
                            viewMode === 'Day' && { backgroundColor: theme.colors.primary }
                        ]}
                        onPress={() => setViewMode('Day')}
                    >
                        <Text style={[
                            styles.viewModeText,
                            { color: viewMode === 'Day' ? theme.colors.surface : theme.colors.text }
                        ]}>
                            Day
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Shoots List */}
                <View style={styles.shootsContainer}>
                    <View style={styles.shootsHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Sessions ({shoots.length})
                        </Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setShowAddModal(true)}
                        >
                            <Text style={[styles.addButtonText, { color: theme.colors.surface }]}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {shoots.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                                {faithMode
                                    ? 'No sessions yet. Plan your first divine appointment.'
                                    : encouragementMode
                                        ? 'No sessions yet. Plan your first creative session.'
                                        : 'No sessions yet. Add your first shoot.'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={shoots}
                            renderItem={renderShootCard}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Add Shoot Modal */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            {faithMode ? 'Add Divine Appointment' : encouragementMode ? 'Add Session' : 'Add Shoot'}
                        </Text>

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Session title"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.title}
                            onChangeText={(text) => setNewShoot({ ...newShoot, title: text })}
                        />

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Date (MM/DD/YYYY)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.date}
                            onChangeText={(text) => setNewShoot({ ...newShoot, date: text })}
                        />

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Time"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.time}
                            onChangeText={(text) => setNewShoot({ ...newShoot, time: text })}
                        />

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Location"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.location}
                            onChangeText={(text) => setNewShoot({ ...newShoot, location: text })}
                        />

                        <TextInput
                            style={[styles.modalInput, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Client name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.client}
                            onChangeText={(text) => setNewShoot({ ...newShoot, client: text })}
                        />

                        <TextInput
                            style={[styles.modalTextArea, {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                borderColor: theme.colors.border
                            }]}
                            placeholder="Notes"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newShoot.notes}
                            onChangeText={(text) => setNewShoot({ ...newShoot, notes: text })}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleAddShoot}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>
                                    {faithMode ? 'Add Appointment' : encouragementMode ? 'Add Session' : 'Add Shoot'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    watermark: {
        fontSize: 24,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    viewModeContainer: {
        flexDirection: 'row',
        marginVertical: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    shootsContainer: {
        flex: 1,
    },
    shootsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    shootCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    shootHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    shootTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusIcon: {
        fontSize: 12,
    },
    shootInfo: {
        fontSize: 14,
        marginBottom: 4,
    },
    shootNotes: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
        marginBottom: 12,
    },
    statusActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    statusButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
    },
    modalTextArea: {
        height: 80,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 