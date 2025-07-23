import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Modal,
    FlatList,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface Message {
    id: string;
    clientId: string;
    shootId?: string;
    type: 'text' | 'image' | 'pdf' | 'voice';
    content: string;
    timestamp: Date;
    isFromPhotographer: boolean;
    status: 'sent' | 'delivered' | 'read';
}

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

interface Shoot {
    id: string;
    title: string;
    date: string;
    location: string;
}

const ClientMessagesScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [clients, setClients] = useState<Client[]>([
        { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0123' },
        { id: '2', name: 'Michael Chen', email: 'michael@email.com', phone: '+1-555-0124' },
        { id: '3', name: 'Emily Rodriguez', email: 'emily@email.com', phone: '+1-555-0125' },
    ]);
    const [shoots, setShoots] = useState<Shoot[]>([
        { id: '1', title: 'Wedding Day', date: '2024-06-15', location: 'St. Mary\'s Church' },
        { id: '2', title: 'Family Portraits', date: '2024-05-20', location: 'Central Park' },
        { id: '3', title: 'Engagement Session', date: '2024-04-10', location: 'Beach Sunset' },
    ]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedShoot, setSelectedShoot] = useState<Shoot | null>(null);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showClientModal, setShowClientModal] = useState(false);
    const [showShootModal, setShowShootModal] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const faithPrompts = [
        "May your session be filled with God's light and love.",
        "Praying for beautiful moments and divine inspiration.",
        "Blessed to capture your special moments.",
        "May this shoot reflect the beauty of God's creation.",
        "Trusting in God's perfect timing for your session.",
    ];

    const encouragementPrompts = [
        "You're going to look amazing in these photos!",
        "Your confidence and beauty will shine through.",
        "This session will capture your authentic self.",
        "You have nothing to worry about - you're going to love these!",
        "Your natural beauty will make these photos stunning.",
    ];

    const sendMessage = () => {
        if (!currentMessage.trim() || !selectedClient) {
            Alert.alert('Missing Information', 'Please select a client and enter a message.');
            return;
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            clientId: selectedClient.id,
            shootId: selectedShoot?.id,
            type: 'text',
            content: currentMessage,
            timestamp: new Date(),
            isFromPhotographer: true,
            status: 'sent',
        };

        setMessages([newMessage, ...messages]);
        setCurrentMessage('');

        // Simulate client response after 2 seconds
        setTimeout(() => {
            const clientResponse: Message = {
                id: (Date.now() + 1).toString(),
                clientId: selectedClient.id,
                shootId: selectedShoot?.id,
                type: 'text',
                content: isFaithMode
                    ? 'Thank you for the beautiful message. Looking forward to our session!'
                    : 'Thanks! I\'m excited for our session.',
                timestamp: new Date(),
                isFromPhotographer: false,
                status: 'read',
            };
            setMessages(prev => [clientResponse, ...prev]);
        }, 2000);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const newMessage: Message = {
                id: Date.now().toString(),
                clientId: selectedClient?.id || '',
                shootId: selectedShoot?.id,
                type: 'image',
                content: result.assets[0].uri,
                timestamp: new Date(),
                isFromPhotographer: true,
                status: 'sent',
            };
            setMessages([newMessage, ...messages]);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const newMessage: Message = {
                id: Date.now().toString(),
                clientId: selectedClient?.id || '',
                shootId: selectedShoot?.id,
                type: 'pdf',
                content: result.assets[0].uri,
                timestamp: new Date(),
                isFromPhotographer: true,
                status: 'sent',
            };
            setMessages([newMessage, ...messages]);
        }
    };

    const startVoiceRecording = () => {
        setIsRecording(true);
        Alert.alert('Recording', 'Voice recording started...');

        // Simulate recording for 3 seconds
        setTimeout(() => {
            setIsRecording(false);
            const newMessage: Message = {
                id: Date.now().toString(),
                clientId: selectedClient?.id || '',
                shootId: selectedShoot?.id,
                type: 'voice',
                content: 'Voice message recorded',
                timestamp: new Date(),
                isFromPhotographer: true,
                status: 'sent',
            };
            setMessages([newMessage, ...messages]);
            Alert.alert('Recording Complete', 'Voice message sent!');
        }, 3000);
    };

    const addQuickPrompt = (prompt: string) => {
        setCurrentMessage(prompt);
    };

    const ClientModal = () => (
        <Modal
            visible={showClientModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Client</Text>
                    {clients.map((client) => (
                        <TouchableOpacity
                            key={client.id}
                            style={styles.clientItem}
                            onPress={() => {
                                setSelectedClient(client);
                                setShowClientModal(false);
                            }}
                        >
                            <View style={styles.clientAvatar}>
                                <Text style={styles.clientInitial}>
                                    {client.name.charAt(0)}
                                </Text>
                            </View>
                            <View style={styles.clientInfo}>
                                <Text style={styles.clientName}>{client.name}</Text>
                                <Text style={styles.clientEmail}>{client.email}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowClientModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const ShootModal = () => (
        <Modal
            visible={showShootModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Shoot (Optional)</Text>
                    <TouchableOpacity
                        style={styles.shootItem}
                        onPress={() => {
                            setSelectedShoot(null);
                            setShowShootModal(false);
                        }}
                    >
                        <Text style={styles.shootName}>No specific shoot</Text>
                    </TouchableOpacity>
                    {shoots.map((shoot) => (
                        <TouchableOpacity
                            key={shoot.id}
                            style={styles.shootItem}
                            onPress={() => {
                                setSelectedShoot(shoot);
                                setShowShootModal(false);
                            }}
                        >
                            <Text style={styles.shootName}>{shoot.title}</Text>
                            <Text style={styles.shootDetails}>{shoot.date} • {shoot.location}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowShootModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.isFromPhotographer ? styles.sentMessage : styles.receivedMessage
        ]}>
            <View style={[
                styles.messageBubble,
                item.isFromPhotographer ? styles.sentBubble : styles.receivedBubble
            ]}>
                {item.type === 'image' ? (
                    <Image source={{ uri: item.content }} style={styles.messageImage} />
                ) : item.type === 'voice' ? (
                    <View style={styles.voiceMessage}>
                        <Ionicons name="play-circle" size={24} color={KingdomColors.bronze} />
                        <Text style={styles.voiceText}>Voice Message</Text>
                    </View>
                ) : item.type === 'pdf' ? (
                    <View style={styles.pdfMessage}>
                        <Ionicons name="document" size={24} color={KingdomColors.bronze} />
                        <Text style={styles.pdfText}>PDF Document</Text>
                    </View>
                ) : (
                    <Text style={[
                        styles.messageText,
                        item.isFromPhotographer ? styles.sentText : styles.receivedText
                    ]}>
                        {item.content}
                    </Text>
                )}
                <Text style={styles.messageTime}>
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Client Messages - Faith Mode' : 'Client Messages'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Connect with clients through love and encouragement'
                        : 'Stay connected with your clients throughout their journey'
                    }
                </Text>
            </View>

            <View style={styles.selectionBar}>
                <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={() => setShowClientModal(true)}
                >
                    <Ionicons name="person" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.selectionText}>
                        {selectedClient ? selectedClient.name : 'Select Client'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={() => setShowShootModal(true)}
                >
                    <Ionicons name="camera" size={20} color={KingdomColors.softWhite} />
                    <Text style={styles.selectionText}>
                        {selectedShoot ? selectedShoot.title : 'Select Shoot'}
                    </Text>
                </TouchableOpacity>
            </View>

            {selectedClient && (
                <View style={styles.quickPrompts}>
                    <Text style={styles.promptsTitle}>Quick Messages</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {(isFaithMode ? faithPrompts : encouragementPrompts).map((prompt, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.promptButton}
                                onPress={() => addQuickPrompt(prompt)}
                            >
                                <Text style={styles.promptText}>{prompt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <FlatList
                data={messages.filter(msg =>
                    (!selectedClient || msg.clientId === selectedClient.id) &&
                    (!selectedShoot || msg.shootId === selectedShoot.id)
                )}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                inverted
            />

            {selectedClient && (
                <View style={styles.inputContainer}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.messageInput}
                            value={currentMessage}
                            onChangeText={setCurrentMessage}
                            placeholder={isFaithMode
                                ? "Share a message of encouragement..."
                                : "Type your message..."
                            }
                            multiline
                        />
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={pickImage}
                            >
                                <Ionicons name="image" size={20} color={KingdomColors.bronze} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={pickDocument}
                            >
                                <Ionicons name="document" size={20} color={KingdomColors.bronze} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={startVoiceRecording}
                            >
                                <Ionicons
                                    name={isRecording ? "stop-circle" : "mic"}
                                    size={20}
                                    color={isRecording ? KingdomColors.bronze : KingdomColors.bronze}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={sendMessage}
                            >
                                <Ionicons name="send" size={20} color={KingdomColors.softWhite} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <ClientModal />
            <ShootModal />
        </View>
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
    selectionBar: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: KingdomColors.dustGold,
        margin: 10,
        borderRadius: 10,
    },
    selectionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    selectionText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    quickPrompts: {
        padding: 15,
    },
    promptsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    promptButton: {
        backgroundColor: KingdomColors.bronze,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    promptText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    messagesList: {
        flex: 1,
        padding: 15,
    },
    messageContainer: {
        marginVertical: 5,
    },
    sentMessage: {
        alignItems: 'flex-end',
    },
    receivedMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 15,
    },
    sentBubble: {
        backgroundColor: KingdomColors.bronze,
    },
    receivedBubble: {
        backgroundColor: KingdomColors.dustGold,
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Sora',
    },
    sentText: {
        color: KingdomColors.softWhite,
    },
    receivedText: {
        color: KingdomColors.matteBlack,
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    voiceMessage: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voiceText: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    pdfMessage: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pdfText: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    messageTime: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        marginTop: 5,
        opacity: 0.7,
        fontFamily: 'Sora',
    },
    inputContainer: {
        padding: 15,
        backgroundColor: KingdomColors.dustGold,
        margin: 10,
        borderRadius: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    messageInput: {
        flex: 1,
        backgroundColor: KingdomColors.softWhite,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 10,
        fontFamily: 'Sora',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: KingdomColors.bronze,
        padding: 10,
        borderRadius: 20,
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
    clientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    clientAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: KingdomColors.bronze,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    clientInitial: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'EB Garamond',
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    clientEmail: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        opacity: 0.8,
        fontFamily: 'Sora',
    },
    shootItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: KingdomColors.bronze,
    },
    shootName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    shootDetails: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        opacity: 0.8,
        marginTop: 3,
        fontFamily: 'Sora',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    cancelButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
});

export default ClientMessagesScreen; 