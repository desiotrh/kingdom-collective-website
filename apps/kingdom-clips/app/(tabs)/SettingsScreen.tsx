import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Modal } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { KingdomClipsApiService } from '../../services/unifiedApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const { faithMode, setFaithMode } = useFaithMode();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const apiService = KingdomClipsApiService.getInstance();

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            // Call the unified API to delete the user
            await apiService.deleteUser();
            
            // Clear all local data
            await AsyncStorage.clear();
            
            Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted. Thank you for using Kingdom Clips.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Delete account error:', error);
            Alert.alert(
                'Error',
                'Failed to delete account. Please try again or contact support.',
                [{ text: 'OK' }]
            );
        } finally {
            setDeletingAccount(false);
            setShowDeleteModal(false);
        }
    };

    const cancelDeleteAccount = () => {
        setShowDeleteModal(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Faith Mode</Text>
                <Switch
                    value={faithMode}
                    onValueChange={setFaithMode}
                    thumbColor={faithMode ? Colors.dark.gold : Colors.dark.crimson}
                    trackColor={{ true: Colors.dark.crimson, false: Colors.dark.gold }}
                />
            </View>
            <View style={styles.previewBox}>
                <Text style={styles.previewText}>
                    {faithMode ? 'Jesus Changed My Life' : 'Your story is powerful!'}
                </Text>
            </View>
            
            {/* Delete Account Section */}
            <View style={styles.dangerZone}>
                <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
                <TouchableOpacity
                    style={[styles.deleteButton, deletingAccount && styles.deleteButtonDisabled]}
                    onPress={handleDeleteAccount}
                    disabled={deletingAccount}
                >
                    <Text style={styles.deleteButtonText}>
                        {deletingAccount ? 'Deleting Account...' : 'Delete My Account'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Delete Account Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDeleteAccount}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete My Account</Text>
                        <Text style={styles.modalBody}>
                            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be removed from our system.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={cancelDeleteAccount}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmDeleteButton}
                                onPress={confirmDeleteAccount}
                            >
                                <Text style={styles.confirmDeleteButtonText}>Yes, Delete My Account</Text>
                            </TouchableOpacity>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 24,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    label: {
        fontFamily: 'Urbanist',
        fontSize: 18,
        color: Colors.dark.gold,
        marginRight: 16,
    },
    previewBox: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    previewText: {
        fontFamily: 'BebasNeue',
        fontSize: 20,
        color: Colors.dark.gold,
        letterSpacing: 2,
        textAlign: 'center',
    },
    // Delete Account Styles
    dangerZone: {
        marginTop: 40,
        width: '100%',
        alignItems: 'center',
    },
    dangerZoneTitle: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        color: '#dc2626',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#dc2626',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        width: '100%',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteButtonText: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        color: '#dc2626',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.dark.background,
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.crimson,
    },
    modalTitle: {
        fontFamily: 'Anton',
        fontSize: 24,
        color: '#dc2626',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalBody: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        color: Colors.dark.gold,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        color: Colors.dark.gold,
        fontWeight: '600',
    },
    confirmDeleteButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#dc2626',
        backgroundColor: '#dc2626',
    },
    confirmDeleteButtonText: {
        fontFamily: 'Urbanist',
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
}); 