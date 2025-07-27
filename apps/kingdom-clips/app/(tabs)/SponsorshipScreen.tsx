import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from 'react-native';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

interface Sponsorship {
    id: string;
    brandName: string;
    link: string;
    product: string;
    startDate: string;
    endDate: string;
    notes: string;
    associatedClips: string[];
    dateCreated: string;
}

const MOCK_SPONSORSHIPS: Sponsorship[] = [
    {
        id: 'sponsor1',
        brandName: 'Kingdom Coffee Co.',
        link: 'kingdomcoffee.com/creator',
        product: 'Organic Coffee Blend',
        startDate: '2024-06-01',
        endDate: '2024-08-01',
        notes: 'Monthly posts, 20% commission, faith-based brand',
        associatedClips: ['clip1', 'clip3'],
        dateCreated: '2024-06-01T12:00:00Z',
    },
    {
        id: 'sponsor2',
        brandName: 'Hope Books',
        link: 'hopebooks.com/DEZME',
        product: 'Christian Books & Resources',
        startDate: '2024-06-15',
        endDate: '2024-09-15',
        notes: 'Weekly book reviews, 15% commission',
        associatedClips: ['clip2'],
        dateCreated: '2024-06-15T10:00:00Z',
    },
];

export default function SponsorshipScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const [sponsorships, setSponsorships] = useState<Sponsorship[]>(MOCK_SPONSORSHIPS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSponsorship, setEditingSponsorship] = useState<Sponsorship | null>(null);
    const [formData, setFormData] = useState({
        brandName: '',
        link: '',
        product: '',
        startDate: '',
        endDate: '',
        notes: '',
    });

    const handleAddSponsorship = () => {
        if (!formData.brandName || !formData.product) {
            Alert.alert('Missing Info', 'Please fill in brand name and product.');
            return;
        }

        const newSponsorship: Sponsorship = {
            id: `sponsor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            associatedClips: [],
            dateCreated: new Date().toISOString(),
        };

        setSponsorships(prev => [...prev, newSponsorship]);
        setShowAddModal(false);
        setFormData({ brandName: '', link: '', product: '', startDate: '', endDate: '', notes: '' });
    };

    const handleEditSponsorship = (sponsorship: Sponsorship) => {
        setEditingSponsorship(sponsorship);
        setFormData({
            brandName: sponsorship.brandName,
            link: sponsorship.link,
            product: sponsorship.product,
            startDate: sponsorship.startDate,
            endDate: sponsorship.endDate,
            notes: sponsorship.notes,
        });
        setShowAddModal(true);
    };

    const handleUpdateSponsorship = () => {
        if (!editingSponsorship) return;

        const updatedSponsorships = sponsorships.map(s =>
            s.id === editingSponsorship.id
                ? { ...s, ...formData, lastModified: new Date().toISOString() }
                : s
        );
        setSponsorships(updatedSponsorships);
        setShowAddModal(false);
        setEditingSponsorship(null);
        setFormData({ brandName: '', link: '', product: '', startDate: '', endDate: '', notes: '' });
    };

    const handleDeleteSponsorship = (id: string) => {
        Alert.alert('Delete Sponsorship', 'Are you sure you want to delete this sponsorship?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    setSponsorships(prev => prev.filter(s => s.id !== id));
                }
            }
        ]);
    };

    const isActive = (sponsorship: Sponsorship) => {
        const now = new Date();
        const start = new Date(sponsorship.startDate);
        const end = new Date(sponsorship.endDate);
        return now >= start && now <= end;
    };

    const renderSponsorship = (sponsorship: Sponsorship) => (
        <View key={sponsorship.id} style={[styles.sponsorshipCard, isActive(sponsorship) && styles.activeCard]}>
            <View style={styles.cardHeader}>
                <Text style={styles.brandName}>{sponsorship.brandName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => handleEditSponsorship(sponsorship)} style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteSponsorship(sponsorship.id)} style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.productText}>{sponsorship.product}</Text>
            <Text style={styles.linkText}>{sponsorship.link}</Text>
            <Text style={styles.dateText}>
                {sponsorship.startDate} - {sponsorship.endDate}
            </Text>
            {sponsorship.notes && (
                <Text style={styles.notesText}>{sponsorship.notes}</Text>
            )}
            <Text style={styles.clipsText}>
                Associated Clips: {sponsorship.associatedClips.length}
            </Text>
            {isActive(sponsorship) && (
                <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sponsorship Manager</Text>
            {faithMode && (
                <View style={styles.faithBox}>
                    <Text style={styles.faithReminder}>Represent Kingdom excellence even in partnerships.</Text>
                    <Text style={styles.faithNote}>Promote only what aligns with God's standard.</Text>
                </View>
            )}
            {encouragementMode && (
                <Text style={styles.encouragement}>Your values attract the right sponsors.</Text>
            )}
            <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn}>
                <Text style={styles.addBtnText}>+ Add New Sponsorship</Text>
            </TouchableOpacity>
            <ScrollView style={styles.sponsorshipsList} showsVerticalScrollIndicator={false}>
                {sponsorships.map(renderSponsorship)}
            </ScrollView>
            <Modal visible={showAddModal} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {editingSponsorship ? 'Edit Sponsorship' : 'Add New Sponsorship'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Brand Name"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.brandName}
                            onChangeText={text => setFormData(prev => ({ ...prev, brandName: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Link or Code"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.link}
                            onChangeText={text => setFormData(prev => ({ ...prev, link: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Product Promoted"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.product}
                            onChangeText={text => setFormData(prev => ({ ...prev, product: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Start Date (YYYY-MM-DD)"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.startDate}
                            onChangeText={text => setFormData(prev => ({ ...prev, startDate: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="End Date (YYYY-MM-DD)"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.endDate}
                            onChangeText={text => setFormData(prev => ({ ...prev, endDate: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Notes (contract details, deliverables)"
                            placeholderTextColor={Colors.dark.gold}
                            value={formData.notes}
                            onChangeText={text => setFormData(prev => ({ ...prev, notes: text }))}
                            multiline
                            numberOfLines={3}
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title={editingSponsorship ? 'Update' : 'Add'}
                                onPress={editingSponsorship ? handleUpdateSponsorship : handleAddSponsorship}
                            />
                            <Button title="Cancel" onPress={() => {
                                setShowAddModal(false);
                                setEditingSponsorship(null);
                                setFormData({ brandName: '', link: '', product: '', startDate: '', endDate: '', notes: '' });
                            }} />
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
        padding: 18,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
    },
    heading: {
        fontFamily: 'Anton',
        fontSize: 32,
        color: Colors.dark.crimson,
        marginBottom: 10,
        letterSpacing: 1,
        textAlign: 'center',
    },
    faithBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    faithReminder: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    faithNote: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 14,
        textAlign: 'center',
    },
    encouragement: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    addBtn: {
        backgroundColor: Colors.dark.crimson,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    addBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 18,
        letterSpacing: 1,
    },
    sponsorshipsList: {
        flex: 1,
    },
    sponsorshipCard: {
        backgroundColor: Colors.dark.black,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.dark.crimson,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    activeCard: {
        borderColor: Colors.dark.accent,
        backgroundColor: Colors.dark.crimson,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    brandName: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.gold,
        fontSize: 18,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
    },
    actionBtn: {
        backgroundColor: Colors.dark.gold,
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 6,
    },
    actionBtnText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 12,
    },
    productText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 15,
        marginBottom: 4,
    },
    linkText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 14,
        marginBottom: 4,
    },
    dateText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 13,
        marginBottom: 4,
    },
    notesText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.gold,
        fontSize: 13,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    clipsText: {
        fontFamily: 'Urbanist',
        color: Colors.dark.accent,
        fontSize: 12,
        marginBottom: 4,
    },
    activeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.dark.accent,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activeBadgeText: {
        fontFamily: 'BebasNeue',
        color: Colors.dark.black,
        fontSize: 10,
    },
    modalBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalBox: {
        backgroundColor: Colors.dark.black,
        borderRadius: 20,
        padding: 25,
        width: '90%',
        maxHeight: '80%',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
    },
    modalTitle: {
        fontFamily: 'BebasNeue',
        fontSize: 24,
        color: Colors.dark.gold,
        marginBottom: 16,
        letterSpacing: 1,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.dark.gold,
        borderRadius: 10,
        padding: 12,
        color: Colors.dark.gold,
        fontFamily: 'Urbanist',
        fontSize: 15,
        marginBottom: 12,
        backgroundColor: Colors.dark.background,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
}); 