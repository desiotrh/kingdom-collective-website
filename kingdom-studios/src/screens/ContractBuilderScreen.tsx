import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Switch,
    Modal,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface ContractTemplate {
    id: string;
    name: string;
    content: string;
    variables: string[];
}

interface Contract {
    id: string;
    title: string;
    content: string;
    clientName: string;
    date: string;
    location: string;
    signature: string;
    shootId?: string;
    createdAt: Date;
}

const ContractBuilderScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
    const [currentContract, setCurrentContract] = useState<Partial<Contract>>({
        title: '',
        content: '',
        clientName: '',
        date: '',
        location: '',
    });
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signature, setSignature] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const templates: ContractTemplate[] = [
        {
            id: '1',
            name: 'Standard Photography Agreement',
            content: `PHOTOGRAPHY SERVICES AGREEMENT

This agreement is made between [CLIENT_NAME] and Kingdom Studios Photography.

DATE: [DATE]
LOCATION: [LOCATION]

Services to be provided:
- Professional photography session
- Digital image delivery
- Print rights included

Terms and Conditions:
1. Payment: 50% deposit required
2. Delivery: 2-3 weeks after session
3. Usage: Personal use only
4. Cancellation: 48 hours notice required

${isFaithMode ? 'May this session capture the beauty of God\'s creation and the unique story He has written for you.' : 'We look forward to creating beautiful memories together.'}

Signature: _________________`,
            variables: ['CLIENT_NAME', 'DATE', 'LOCATION'],
        },
        {
            id: '2',
            name: 'Wedding Photography Contract',
            content: `WEDDING PHOTOGRAPHY AGREEMENT

Bride & Groom: [CLIENT_NAME]
Wedding Date: [DATE]
Venue: [LOCATION]

Package Includes:
- 8 hours of coverage
- Engagement session
- Wedding album
- Digital files
- Online gallery

${isFaithMode ? 'May your special day be blessed with love, joy, and the presence of the Holy Spirit. We pray that every moment captured reflects the sacred covenant you\'re entering.' : 'We\'re honored to be part of your special day and will ensure every precious moment is beautifully documented.'}

Signature: _________________`,
            variables: ['CLIENT_NAME', 'DATE', 'LOCATION'],
        },
        {
            id: '3',
            name: 'Event Photography Contract',
            content: `EVENT PHOTOGRAPHY AGREEMENT

Event: [CLIENT_NAME]
Date: [DATE]
Location: [LOCATION]

Services:
- Event coverage
- Professional editing
- Digital delivery
- Print options available

${isFaithMode ? 'May this event be filled with joy, connection, and the light of Christ shining through every interaction.' : 'We\'ll capture the energy and excitement of your special event with creativity and professionalism.'}

Signature: _________________`,
            variables: ['CLIENT_NAME', 'DATE', 'LOCATION'],
        },
    ];

    const handleTemplateSelect = (template: ContractTemplate) => {
        setSelectedTemplate(template);
        setCurrentContract({
            title: template.name,
            content: template.content,
            clientName: '',
            date: '',
            location: '',
        });
        setIsEditing(true);
    };

    const replaceVariables = (content: string, variables: Record<string, string>) => {
        let processedContent = content;
        Object.entries(variables).forEach(([key, value]) => {
            processedContent = processedContent.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
        });
        return processedContent;
    };

    const handleSaveContract = () => {
        if (!currentContract.title || !currentContract.content || !currentContract.clientName) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        const processedContent = replaceVariables(currentContract.content, {
            CLIENT_NAME: currentContract.clientName || '',
            DATE: currentContract.date || '',
            LOCATION: currentContract.location || '',
        });

        const newContract: Contract = {
            id: Date.now().toString(),
            title: currentContract.title || '',
            content: processedContent,
            clientName: currentContract.clientName || '',
            date: currentContract.date || '',
            location: currentContract.location || '',
            signature: signature,
            createdAt: new Date(),
        };

        setContracts([newContract, ...contracts]);
        setCurrentContract({
            title: '',
            content: '',
            clientName: '',
            date: '',
            location: '',
        });
        setSignature('');
        setIsEditing(false);
        setSelectedTemplate(null);

        Alert.alert(
            'Contract Saved',
            isFaithMode
                ? 'Your contract has been blessed and saved. May it serve as a foundation for beautiful collaboration.'
                : 'Contract saved successfully! Ready to share with your client.'
        );
    };

    const handleSignatureCapture = () => {
        setShowSignatureModal(true);
    };

    const SignatureModal = () => (
        <Modal
            visible={showSignatureModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {isFaithMode ? 'Sign in Faith' : 'Digital Signature'}
                    </Text>
                    <View style={styles.signatureBox}>
                        <TextInput
                            style={styles.signatureInput}
                            placeholder="Type your signature here..."
                            value={signature}
                            onChangeText={setSignature}
                            multiline
                        />
                    </View>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowSignatureModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton]}
                            onPress={() => {
                                setShowSignatureModal(false);
                                Alert.alert('Signature Captured', 'Your signature has been added to the contract.');
                            }}
                        >
                            <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Contract Builder - Faith Mode' : 'Contract Builder'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Create agreements that honor God and serve your clients'
                        : 'Build professional contracts for your photography services'
                    }
                </Text>
            </View>

            {!isEditing ? (
                <View style={styles.templateSection}>
                    <Text style={styles.sectionTitle}>
                        {isFaithMode ? 'Choose Your Contract Template' : 'Select a Template'}
                    </Text>
                    {templates.map((template) => (
                        <TouchableOpacity
                            key={template.id}
                            style={styles.templateCard}
                            onPress={() => handleTemplateSelect(template)}
                        >
                            <Text style={styles.templateName}>{template.name}</Text>
                            <Text style={styles.templatePreview} numberOfLines={3}>
                                {template.content.substring(0, 150)}...
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={[styles.templateCard, styles.customTemplate]}
                        onPress={() => {
                            setCurrentContract({
                                title: 'Custom Contract',
                                content: '',
                                clientName: '',
                                date: '',
                                location: '',
                            });
                            setIsEditing(true);
                        }}
                    >
                        <Ionicons name="add-circle" size={24} color={KingdomColors.bronze} />
                        <Text style={styles.customTemplateText}>
                            {isFaithMode ? 'Create Custom Contract' : 'Start from Scratch'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.editorSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contract Title</Text>
                        <TextInput
                            style={styles.input}
                            value={currentContract.title}
                            onChangeText={(text) => setCurrentContract({ ...currentContract, title: text })}
                            placeholder="Enter contract title"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Client Name</Text>
                        <TextInput
                            style={styles.input}
                            value={currentContract.clientName}
                            onChangeText={(text) => setCurrentContract({ ...currentContract, clientName: text })}
                            placeholder="Enter client name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date</Text>
                        <TextInput
                            style={styles.input}
                            value={currentContract.date}
                            onChangeText={(text) => setCurrentContract({ ...currentContract, date: text })}
                            placeholder="Enter date"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={currentContract.location}
                            onChangeText={(text) => setCurrentContract({ ...currentContract, location: text })}
                            placeholder="Enter location"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contract Content</Text>
                        <TextInput
                            style={[styles.input, styles.contentInput]}
                            value={currentContract.content}
                            onChangeText={(text) => setCurrentContract({ ...currentContract, content: text })}
                            placeholder="Enter contract content..."
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.signatureButton}
                        onPress={handleSignatureCapture}
                    >
                        <Ionicons name="create" size={20} color={KingdomColors.softWhite} />
                        <Text style={styles.signatureButtonText}>
                            {signature ? 'Edit Signature' : 'Add Signature'}
                        </Text>
                    </TouchableOpacity>

                    {signature && (
                        <View style={styles.signatureDisplay}>
                            <Text style={styles.signatureLabel}>Signature:</Text>
                            <Text style={styles.signatureText}>{signature}</Text>
                        </View>
                    )}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setIsEditing(false);
                                setCurrentContract({
                                    title: '',
                                    content: '',
                                    clientName: '',
                                    date: '',
                                    location: '',
                                });
                                setSignature('');
                                setSelectedTemplate(null);
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveContract}
                        >
                            <Text style={styles.saveButtonText}>
                                {isFaithMode ? 'Save & Bless' : 'Save Contract'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {contracts.length > 0 && (
                <View style={styles.contractsSection}>
                    <Text style={styles.sectionTitle}>Saved Contracts</Text>
                    {contracts.map((contract) => (
                        <View key={contract.id} style={styles.contractCard}>
                            <Text style={styles.contractTitle}>{contract.title}</Text>
                            <Text style={styles.contractClient}>Client: {contract.clientName}</Text>
                            <Text style={styles.contractDate}>Date: {contract.date}</Text>
                            <Text style={styles.contractLocation}>Location: {contract.location}</Text>
                            <Text style={styles.contractCreated}>
                                Created: {contract.createdAt.toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <SignatureModal />
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
    templateSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    templateCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    templateName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'EB Garamond',
    },
    templatePreview: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    customTemplate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        backgroundColor: 'transparent',
    },
    customTemplateText: {
        fontSize: 16,
        color: KingdomColors.bronze,
        marginLeft: 10,
        fontFamily: 'Sora',
    },
    editorSection: {
        padding: 20,
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
    contentInput: {
        height: 150,
        textAlignVertical: 'top',
    },
    signatureButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    signatureButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    signatureDisplay: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    signatureLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    signatureText: {
        fontSize: 16,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 15,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    saveButton: {
        backgroundColor: KingdomColors.bronze,
        padding: 15,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    saveButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    contractsSection: {
        padding: 20,
    },
    contractCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    contractTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'EB Garamond',
    },
    contractClient: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    contractDate: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    contractLocation: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    contractCreated: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontStyle: 'italic',
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
    signatureBox: {
        backgroundColor: KingdomColors.dustGold,
        borderRadius: 8,
        marginBottom: 20,
    },
    signatureInput: {
        padding: 15,
        fontSize: 16,
        color: KingdomColors.matteBlack,
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

export default ContractBuilderScreen; 