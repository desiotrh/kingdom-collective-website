import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Modal,
    Alert,
    FlatList,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';

interface Invoice {
    id: string;
    clientName: string;
    sessionType: string;
    amount: number;
    isPaid: boolean;
    dateSent: string;
    services: Service[];
    tax: number;
    notes: string;
    blessing?: string;
}

interface Service {
    id: string;
    description: string;
    price: number;
}

export default function InvoiceManagerScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [newInvoice, setNewInvoice] = useState({
        clientName: '',
        sessionType: '',
        services: [{ id: '1', description: '', price: 0 }],
        tax: 0,
        notes: '',
        blessing: '',
    });

    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: '1',
            clientName: 'Sarah Johnson',
            sessionType: 'Portrait Session',
            amount: 250,
            isPaid: true,
            dateSent: '2024-12-01',
            services: [
                { id: '1', description: '1-hour portrait session', price: 200 },
                { id: '2', description: '10 edited photos', price: 50 },
            ],
            tax: 15,
            notes: faithMode
                ? 'Beautiful session capturing God\'s light in Sarah\'s smile'
                : 'Professional portrait session with natural lighting',
            blessing: faithMode ? 'May this work be fruitful and multiply' : undefined,
        },
        {
            id: '2',
            clientName: 'Mike Chen',
            sessionType: 'Wedding Photography',
            amount: 1200,
            isPaid: false,
            dateSent: '2024-12-05',
            services: [
                { id: '1', description: 'Full day wedding coverage', price: 1000 },
                { id: '2', description: 'Wedding album design', price: 200 },
            ],
            tax: 72,
            notes: faithMode
                ? 'Capturing the sacred covenant of marriage'
                : 'Comprehensive wedding photography package',
            blessing: faithMode ? 'Blessed to witness and capture this holy union' : undefined,
        },
        {
            id: '3',
            clientName: 'Emily Rodriguez',
            sessionType: 'Family Session',
            amount: 350,
            isPaid: true,
            dateSent: '2024-11-28',
            services: [
                { id: '1', description: 'Family portrait session', price: 250 },
                { id: '2', description: '15 edited photos', price: 100 },
            ],
            tax: 21,
            notes: faithMode
                ? 'Family bonds strengthened through shared memories'
                : 'Warm family session with natural poses',
            blessing: faithMode ? 'Family legacy preserved through photography' : undefined,
        },
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Invoice Manager for His Glory';
        } else if (encouragementMode) {
            return 'Invoice Manager for Growth';
        }
        return 'Invoice Manager';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Manage your business with purpose';
        } else if (encouragementMode) {
            return 'This is more than a gig — it\'s legacy';
        }
        return 'Professional invoice management';
    };

    const handleCreateInvoice = () => {
        if (!newInvoice.clientName || !newInvoice.sessionType) {
            Alert.alert('Missing Info', 'Please fill in client name and session type');
            return;
        }

        const totalAmount = newInvoice.services.reduce((sum, service) => sum + service.price, 0);
        const taxAmount = (totalAmount * newInvoice.tax) / 100;
        const finalAmount = totalAmount + taxAmount;

        const invoice: Invoice = {
            id: Date.now().toString(),
            clientName: newInvoice.clientName,
            sessionType: newInvoice.sessionType,
            amount: finalAmount,
            isPaid: false,
            dateSent: new Date().toISOString().split('T')[0],
            services: newInvoice.services,
            tax: newInvoice.tax,
            notes: newInvoice.notes,
            blessing: faithMode ? newInvoice.blessing : undefined,
        };

        setInvoices(prev => [invoice, ...prev]);
        setNewInvoice({
            clientName: '',
            sessionType: '',
            services: [{ id: '1', description: '', price: 0 }],
            tax: 0,
            notes: '',
            blessing: '',
        });
        setShowCreateModal(false);
        Alert.alert('Invoice Created', 'Your invoice has been created successfully!');
    };

    const handleAddService = () => {
        const newServiceId = (newInvoice.services.length + 1).toString();
        setNewInvoice(prev => ({
            ...prev,
            services: [...prev.services, { id: newServiceId, description: '', price: 0 }]
        }));
    };

    const handleUpdateService = (serviceId: string, field: 'description' | 'price', value: string | number) => {
        setNewInvoice(prev => ({
            ...prev,
            services: prev.services.map(service =>
                service.id === serviceId
                    ? { ...service, [field]: field === 'price' ? Number(value) : value }
                    : service
            )
        }));
    };

    const handleRemoveService = (serviceId: string) => {
        if (newInvoice.services.length > 1) {
            setNewInvoice(prev => ({
                ...prev,
                services: prev.services.filter(service => service.id !== serviceId)
            }));
        }
    };

    const handleSendInvoice = (invoiceId: string) => {
        Alert.alert('Invoice Sent', 'Invoice link has been sent to the client!');
    };

    const renderInvoiceCard = (invoice: Invoice) => (
        <TouchableOpacity
            key={invoice.id}
            style={[styles.invoiceCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => setSelectedInvoice(invoice)}
        >
            <View style={styles.invoiceHeader}>
                <Text style={[styles.clientName, { color: theme.colors.text }]}>
                    {invoice.clientName}
                </Text>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: invoice.isPaid ? theme.colors.success : theme.colors.warning }
                ]}>
                    <Text style={[styles.statusText, { color: theme.colors.surface }]}>
                        {invoice.isPaid ? 'Paid' : 'Pending'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.sessionType, { color: theme.colors.textSecondary }]}>
                {invoice.sessionType}
            </Text>

            <View style={styles.invoiceDetails}>
                <Text style={[styles.amount, { color: theme.colors.text }]}>
                    ${invoice.amount.toFixed(2)}
                </Text>
                <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                    Sent: {invoice.dateSent}
                </Text>
            </View>

            {invoice.blessing && (
                <Text style={[styles.blessingText, { color: theme.colors.primary }]}>
                    ✝️ {invoice.blessing}
                </Text>
            )}

            <View style={styles.invoiceActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleSendInvoice(invoice.id)}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.surface }]}>
                        Send Invoice
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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

                {/* Faith Mode Message */}
                {faithMode && (
                    <View style={[styles.faithMessage, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.faithMessageText, { color: theme.colors.primary }]}>
                            "May this work be fruitful and multiply"
                        </Text>
                    </View>
                )}

                {/* Encouragement Mode Message */}
                {encouragementMode && (
                    <View style={[styles.encouragementMessage, { backgroundColor: theme.colors.secondary + '20' }]}>
                        <Text style={[styles.encouragementMessageText, { color: theme.colors.secondary }]}>
                            "Your purpose is valuable"
                        </Text>
                    </View>
                )}

                {/* Invoice List */}
                <View style={styles.invoicesSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Invoices
                    </Text>
                    {invoices.map(renderInvoiceCard)}
                </View>

                {/* Create Invoice Button */}
                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setShowCreateModal(true)}
                >
                    <Text style={[styles.createButtonText, { color: theme.colors.surface }]}>
                        Create New Invoice
                    </Text>
                </TouchableOpacity>

                {/* Create Invoice Modal */}
                <Modal
                    visible={showCreateModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                                Create Invoice
                            </Text>
                            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Client Name *
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={newInvoice.clientName}
                                    onChangeText={(text) => setNewInvoice(prev => ({ ...prev, clientName: text }))}
                                    placeholder="Enter client name"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Session Type *
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={newInvoice.sessionType}
                                    onChangeText={(text) => setNewInvoice(prev => ({ ...prev, sessionType: text }))}
                                    placeholder="e.g., Portrait Session, Wedding Photography"
                                />
                            </View>

                            <View style={styles.servicesSection}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Services
                                </Text>
                                {newInvoice.services.map((service) => (
                                    <View key={service.id} style={styles.serviceRow}>
                                        <View style={styles.serviceInputs}>
                                            <TextInput
                                                style={[styles.serviceInput, {
                                                    backgroundColor: theme.colors.surface,
                                                    color: theme.colors.text,
                                                    borderColor: theme.colors.border
                                                }]}
                                                value={service.description}
                                                onChangeText={(text) => handleUpdateService(service.id, 'description', text)}
                                                placeholder="Service description"
                                            />
                                            <TextInput
                                                style={[styles.priceInput, {
                                                    backgroundColor: theme.colors.surface,
                                                    color: theme.colors.text,
                                                    borderColor: theme.colors.border
                                                }]}
                                                value={service.price.toString()}
                                                onChangeText={(text) => handleUpdateService(service.id, 'price', text)}
                                                placeholder="0"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {newInvoice.services.length > 1 && (
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveService(service.id)}
                                            >
                                                <Text style={[styles.removeButtonText, { color: theme.colors.error }]}>
                                                    ✕
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                <TouchableOpacity
                                    style={[styles.addServiceButton, { backgroundColor: theme.colors.secondary }]}
                                    onPress={handleAddService}
                                >
                                    <Text style={[styles.addServiceText, { color: theme.colors.surface }]}>
                                        + Add Service
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Tax Rate (%)
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={newInvoice.tax.toString()}
                                    onChangeText={(text) => setNewInvoice(prev => ({ ...prev, tax: Number(text) || 0 }))}
                                    placeholder="0"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                    Notes
                                </Text>
                                <TextInput
                                    style={[styles.textArea, {
                                        backgroundColor: theme.colors.surface,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border
                                    }]}
                                    value={newInvoice.notes}
                                    onChangeText={(text) => setNewInvoice(prev => ({ ...prev, notes: text }))}
                                    placeholder="Add notes about the session..."
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            {faithMode && (
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                                        Invoice Blessing
                                    </Text>
                                    <TextInput
                                        style={[styles.textArea, {
                                            backgroundColor: theme.colors.surface,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.border
                                        }]}
                                        value={newInvoice.blessing}
                                        onChangeText={(text) => setNewInvoice(prev => ({ ...prev, blessing: text }))}
                                        placeholder="Optional blessing for the invoice..."
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleCreateInvoice}
                            >
                                <Text style={[styles.saveButtonText, { color: theme.colors.surface }]}>
                                    Create Invoice
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
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
        fontSize: 20,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'EB Garamond, serif',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    faithMessage: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    faithMessageText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'EB Garamond, serif',
    },
    encouragementMessage: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    encouragementMessageText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'Sora, sans-serif',
    },
    invoicesSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'EB Garamond, serif',
    },
    invoiceCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'EB Garamond, serif',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    sessionType: {
        fontSize: 14,
        marginBottom: 12,
        fontFamily: 'Sora, sans-serif',
    },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Sora, sans-serif',
    },
    date: {
        fontSize: 12,
        fontFamily: 'Sora, sans-serif',
    },
    blessingText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 12,
        fontFamily: 'EB Garamond, serif',
    },
    invoiceActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    createButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'EB Garamond, serif',
    },
    closeButton: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        fontFamily: 'Sora, sans-serif',
    },
    textInput: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
    },
    textArea: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    servicesSection: {
        marginBottom: 16,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceInputs: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 8,
    },
    serviceInput: {
        flex: 2,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
        marginRight: 8,
    },
    priceInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Sora, sans-serif',
    },
    removeButton: {
        padding: 8,
    },
    removeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addServiceButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    addServiceText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Sora, sans-serif',
    },
}); 