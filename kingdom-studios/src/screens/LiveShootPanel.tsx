import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    FlatList,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface ShootMoment {
    id: string;
    timestamp: string;
    type: 'captured' | 'note' | 'voice' | 'pose';
    content: string;
    transcribed?: string;
    tags: string[];
}

interface Pose {
    id: string;
    name: string;
    category: 'portrait' | 'couple' | 'family' | 'wedding' | 'engagement';
    description: string;
    tags: string[];
    spiritualTag?: string;
    imageUrl?: string;
}

const LiveShootPanel: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [currentShoot, setCurrentShoot] = useState({
        title: 'Wedding Ceremony',
        client: 'Sarah & Michael',
        location: 'St. Mary\'s Church',
        startTime: '14:00',
        endTime: '18:00',
    });
    const [moments, setMoments] = useState<ShootMoment[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showPoseModal, setShowPoseModal] = useState(false);
    const [showFaithModal, setShowFaithModal] = useState(false);
    const [currentMoment, setCurrentMoment] = useState('');
    const [selectedPose, setSelectedPose] = useState<Pose | null>(null);

    const poses: Pose[] = [
        {
            id: '1',
            name: 'Classic Portrait',
            category: 'portrait',
            description: 'Simple, elegant pose with natural lighting',
            tags: ['elegant', 'simple'],
            spiritualTag: isFaithMode ? 'Grace' : undefined,
        },
        {
            id: '2',
            name: 'Intimate Couple',
            category: 'couple',
            description: 'Close, romantic pose for couples',
            tags: ['romantic', 'intimate'],
            spiritualTag: isFaithMode ? 'Love' : undefined,
        },
        {
            id: '3',
            name: 'Family Circle',
            category: 'family',
            description: 'Group pose with everyone connected',
            tags: ['family', 'connected'],
            spiritualTag: isFaithMode ? 'Unity' : undefined,
        },
        {
            id: '4',
            name: 'Wedding Kiss',
            category: 'wedding',
            description: 'Dramatic wedding kiss moment',
            tags: ['dramatic', 'wedding'],
            spiritualTag: isFaithMode ? 'Covenant' : undefined,
        },
        {
            id: '5',
            name: 'Engagement Ring',
            category: 'engagement',
            description: 'Close-up of ring with hands',
            tags: ['detail', 'ring'],
            spiritualTag: isFaithMode ? 'Promise' : undefined,
        },
    ];

    const faithPrompts = [
        "Pause and pray for this moment",
        "Capture the unseen beauty",
        "God's light is perfect here",
        "Bless this moment with your lens",
        "Trust in divine timing",
    ];

    const encouragementPrompts = [
        "You're creating something eternal",
        "This moment is perfect",
        "Trust your instincts",
        "You have the gift",
        "This will be beautiful",
    ];

    const addMoment = (type: ShootMoment['type'], content: string) => {
        const moment: ShootMoment = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            type,
            content,
            tags: [],
        };

        setMoments([moment, ...moments]);
        setCurrentMoment('');

        if (type === 'captured') {
            Alert.alert(
                'Moment Captured',
                isFaithMode
                    ? 'Blessed moment captured. May it bring joy and memories.'
                    : 'Perfect shot! Moment captured successfully.'
            );
        }
    };

    const startVoiceRecording = () => {
        setIsRecording(true);
        Alert.alert('Recording', 'Voice memo started...');

        // Simulate recording for 5 seconds
        setTimeout(() => {
            setIsRecording(false);
            const transcribedText = "Beautiful moment with natural light, client is very comfortable";
            addMoment('voice', 'Voice memo recorded', transcribedText);
            Alert.alert('Recording Complete', 'Voice memo transcribed and saved!');
        }, 5000);
    };

    const addPoseToFlow = (pose: Pose) => {
        addMoment('pose', `Added pose: ${pose.name}`);
        setShowPoseModal(false);
        Alert.alert('Pose Added', `${pose.name} added to today's flow!`);
    };

    const showFaithPrompt = () => {
        const prompt = faithPrompts[Math.floor(Math.random() * faithPrompts.length)];
        setShowFaithModal(true);
        setTimeout(() => setShowFaithModal(false), 3000);
    };

    const showEncouragementPrompt = () => {
        const prompt = encouragementPrompts[Math.floor(Math.random() * encouragementPrompts.length)];
        Alert.alert('Encouragement', prompt);
    };

    const PoseModal = () => (
        <Modal
            visible={showPoseModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Pose Library</Text>

                    <View style={styles.poseFilters}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Portrait</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Couple</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Family</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={poses}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.poseItem}
                                onPress={() => addPoseToFlow(item)}
                            >
                                <View style={styles.poseInfo}>
                                    <Text style={styles.poseName}>{item.name}</Text>
                                    <Text style={styles.poseCategory}>{item.category}</Text>
                                    <Text style={styles.poseDescription}>{item.description}</Text>

                                    <View style={styles.poseTags}>
                                        {item.tags.map((tag, index) => (
                                            <Text key={index} style={styles.poseTag}>{tag}</Text>
                                        ))}
                                        {item.spiritualTag && (
                                            <Text style={styles.spiritualTag}>{item.spiritualTag}</Text>
                                        )}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.addPoseButton}
                                    onPress={() => addPoseToFlow(item)}
                                >
                                    <Ionicons name="add" size={16} color={KingdomColors.softWhite} />
                                    <Text style={styles.addPoseButtonText}>Add</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                        style={styles.posesList}
                    />

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowPoseModal(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const FaithPromptModal = () => (
        <Modal
            visible={showFaithModal}
            animationType="fade"
            transparent={true}
        >
            <View style={styles.faithModalOverlay}>
                <View style={styles.faithModalContent}>
                    <Ionicons name="heart" size={48} color={KingdomColors.dustGold} />
                    <Text style={styles.faithPromptText}>
                        {faithPrompts[Math.floor(Math.random() * faithPrompts.length)]}
                    </Text>
                </View>
            </View>
        </Modal>
    );

    const renderMoment = ({ item }: { item: ShootMoment }) => (
        <View style={styles.momentCard}>
            <View style={styles.momentHeader}>
                <Text style={styles.momentTime}>{item.timestamp}</Text>
                <View style={styles.momentType}>
                    {item.type === 'captured' && (
                        <Ionicons name="camera" size={16} color={KingdomColors.bronze} />
                    )}
                    {item.type === 'note' && (
                        <Ionicons name="document-text" size={16} color={KingdomColors.bronze} />
                    )}
                    {item.type === 'voice' && (
                        <Ionicons name="mic" size={16} color={KingdomColors.bronze} />
                    )}
                    {item.type === 'pose' && (
                        <Ionicons name="body" size={16} color={KingdomColors.bronze} />
                    )}
                </View>
            </View>

            <Text style={styles.momentContent}>{item.content}</Text>

            {item.transcribed && (
                <View style={styles.transcriptionContainer}>
                    <Text style={styles.transcriptionLabel}>Transcribed:</Text>
                    <Text style={styles.transcriptionText}>{item.transcribed}</Text>
                </View>
            )}

            {item.tags.length > 0 && (
                <View style={styles.momentTags}>
                    {item.tags.map((tag, index) => (
                        <Text key={index} style={styles.momentTag}>{tag}</Text>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Live Shoot Panel - Faith Mode' : 'Live Shoot Panel'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Capture moments with divine inspiration and guidance'
                        : 'Track your shoot progress and capture important moments'
                    }
                </Text>
            </View>

            <View style={styles.shootInfo}>
                <Text style={styles.shootTitle}>{currentShoot.title}</Text>
                <Text style={styles.shootClient}>{currentShoot.client}</Text>
                <Text style={styles.shootLocation}>{currentShoot.location}</Text>
                <Text style={styles.shootTime}>{currentShoot.startTime} - {currentShoot.endTime}</Text>
            </View>

            <View style={styles.controlsSection}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => addMoment('captured', 'Moment captured')}
                >
                    <Ionicons name="camera" size={24} color={KingdomColors.softWhite} />
                    <Text style={styles.controlButtonText}>Capture</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => {
                        if (currentMoment.trim()) {
                            addMoment('note', currentMoment);
                        } else {
                            Alert.alert('Empty Note', 'Please enter a note before adding.');
                        }
                    }}
                >
                    <Ionicons name="document-text" size={24} color={KingdomColors.softWhite} />
                    <Text style={styles.controlButtonText}>Note</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={startVoiceRecording}
                    disabled={isRecording}
                >
                    <Ionicons
                        name={isRecording ? "stop-circle" : "mic"}
                        size={24}
                        color={isRecording ? KingdomColors.bronze : KingdomColors.softWhite}
                    />
                    <Text style={styles.controlButtonText}>
                        {isRecording ? 'Recording' : 'Voice'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setShowPoseModal(true)}
                >
                    <Ionicons name="body" size={24} color={KingdomColors.softWhite} />
                    <Text style={styles.controlButtonText}>Poses</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
                <TextInput
                    style={styles.momentInput}
                    value={currentMoment}
                    onChangeText={setCurrentMoment}
                    placeholder={isFaithMode
                        ? "Add a moment note or prayer request..."
                        : "Add a moment note..."
                    }
                    multiline
                />
            </View>

            <View style={styles.inspirationSection}>
                {isFaithMode ? (
                    <TouchableOpacity
                        style={styles.inspirationButton}
                        onPress={showFaithPrompt}
                    >
                        <Ionicons name="heart" size={20} color={KingdomColors.softWhite} />
                        <Text style={styles.inspirationButtonText}>Divine Inspiration</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.inspirationButton}
                        onPress={showEncouragementPrompt}
                    >
                        <Ionicons name="star" size={20} color={KingdomColors.softWhite} />
                        <Text style={styles.inspirationButtonText}>Get Encouraged</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.timelineSection}>
                <Text style={styles.sectionTitle}>Shoot Timeline</Text>
                <FlatList
                    data={moments}
                    renderItem={renderMoment}
                    keyExtractor={(item) => item.id}
                    style={styles.timelineList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <PoseModal />
            <FaithPromptModal />
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
    shootInfo: {
        padding: 20,
        backgroundColor: KingdomColors.dustGold,
        margin: 10,
        borderRadius: 10,
    },
    shootTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'EB Garamond',
    },
    shootClient: {
        fontSize: 16,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    shootLocation: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    shootTime: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    controlsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: KingdomColors.dustGold,
        margin: 10,
        borderRadius: 10,
    },
    controlButton: {
        alignItems: 'center',
        padding: 10,
    },
    controlButtonText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginTop: 5,
        fontFamily: 'Sora',
    },
    inputSection: {
        padding: 20,
    },
    momentInput: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: KingdomColors.matteBlack,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: 'Sora',
    },
    inspirationSection: {
        padding: 20,
    },
    inspirationButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
    },
    inspirationButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    timelineSection: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    timelineList: {
        flex: 1,
    },
    momentCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    momentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    momentTime: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    momentType: {
        flexDirection: 'row',
    },
    momentContent: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    transcriptionContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: KingdomColors.bronze,
        borderRadius: 6,
    },
    transcriptionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    transcriptionText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        fontStyle: 'italic',
        fontFamily: 'Sora',
    },
    momentTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    momentTag: {
        fontSize: 10,
        color: KingdomColors.matteBlack,
        backgroundColor: KingdomColors.bronze,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 3,
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'EB Garamond',
    },
    poseFilters: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    filterButton: {
        backgroundColor: KingdomColors.bronze,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
    },
    filterText: {
        fontSize: 12,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    posesList: {
        maxHeight: 300,
    },
    poseItem: {
        backgroundColor: KingdomColors.dustGold,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    poseInfo: {
        flex: 1,
    },
    poseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    poseCategory: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    poseDescription: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    poseTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    poseTag: {
        fontSize: 8,
        color: KingdomColors.matteBlack,
        backgroundColor: KingdomColors.bronze,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 8,
        marginRight: 3,
        marginBottom: 2,
        fontFamily: 'Sora',
    },
    spiritualTag: {
        fontSize: 8,
        color: KingdomColors.matteBlack,
        backgroundColor: KingdomColors.dustGold,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 8,
        marginRight: 3,
        marginBottom: 2,
        fontFamily: 'Sora',
    },
    addPoseButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderRadius: 6,
    },
    addPoseButtonText: {
        fontSize: 10,
        color: KingdomColors.softWhite,
        marginLeft: 2,
        fontFamily: 'Sora',
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: KingdomColors.bronze,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    faithModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    faithModalContent: {
        backgroundColor: KingdomColors.matteBlack,
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        maxWidth: 300,
    },
    faithPromptText: {
        fontSize: 18,
        color: KingdomColors.softWhite,
        textAlign: 'center',
        marginTop: 15,
        fontFamily: 'EB Garamond',
        fontStyle: 'italic',
    },
});

export default LiveShootPanel; 