import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Image,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';

const { width: screenWidth } = Dimensions.get('window');

interface CommunityChallenge {
    id: string;
    title: string;
    description: string;
    duration: number;
    participants: number;
    reward: string;
    faithMode: boolean;
    category: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    userProgress?: number;
    userCompleted?: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    leaderboard?: ChallengeLeaderboardEntry[];
    requirements: string[];
    tips: string[];
}

interface ChallengeLeaderboardEntry {
    userId: string;
    username: string;
    avatar: string;
    progress: number;
    completed: boolean;
    rank: number;
}

interface UserChallengeSubmission {
    challengeId: string;
    content: string;
    mediaUrl?: string;
    timestamp: Date;
    likes: number;
    comments: number;
}

export default function CommunityChallenges() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode } = useFaithMode();

    const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
    const [userSubmissions, setUserSubmissions] = useState<UserChallengeSubmission[]>([]);
    const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for demonstration
    useEffect(() => {
        const mockChallenges: CommunityChallenge[] = [
            {
                id: '1',
                title: faithMode ? '7-Day Prayer Challenge' : '7-Day Growth Challenge',
                description: faithMode 
                    ? 'Share daily prayers and testimonies for 7 days. Connect with others in faith and build a stronger prayer life.'
                    : 'Share daily growth insights for 7 days. Document your personal development journey and inspire others.',
                duration: 7,
                participants: 1247,
                reward: faithMode ? 'Prayer Warrior Badge + $25 Bonus' : 'Growth Champion Badge + $25 Bonus',
                faithMode: true,
                category: 'Faith & Spirituality',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 3,
                userCompleted: false,
                difficulty: 'easy',
                tags: faithMode ? ['prayer', 'faith', 'testimony', 'community'] : ['growth', 'development', 'mindset', 'community'],
                requirements: [
                    'Post daily for 7 consecutive days',
                    'Share authentic content',
                    'Engage with other participants',
                    'Use challenge hashtags',
                ],
                tips: [
                    'Plan your content ahead of time',
                    'Be authentic and vulnerable',
                    'Engage with other participants',
                    'Use relevant hashtags',
                ],
                leaderboard: [
                    { userId: '1', username: 'faithful_creator', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', progress: 7, completed: true, rank: 1 },
                    { userId: '2', username: 'growth_mindset', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', progress: 6, completed: false, rank: 2 },
                    { userId: '3', username: 'authentic_life', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', progress: 5, completed: false, rank: 3 },
                ],
            },
            {
                id: '2',
                title: 'Family Connection Challenge',
                description: 'Share meaningful family moments and relationship insights. Strengthen family bonds and inspire others to prioritize family time.',
                duration: 14,
                participants: 892,
                reward: 'Family Champion Badge + $50 Bonus',
                faithMode: false,
                category: 'Family & Relationships',
                startDate: new Date(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 0,
                userCompleted: false,
                difficulty: 'medium',
                tags: ['family', 'relationships', 'love', 'connection'],
                requirements: [
                    'Post 10 times over 14 days',
                    'Share family-focused content',
                    'Include family members when possible',
                    'Engage with the community',
                ],
                tips: [
                    'Get family permission before posting',
                    'Focus on positive moments',
                    'Share both joys and challenges',
                    'Respect family privacy',
                ],
            },
            {
                id: '3',
                title: 'Truth Speaker Challenge',
                description: 'Share authentic, vulnerable content that speaks truth. Be real, be honest, and inspire others to do the same.',
                duration: 30,
                participants: 567,
                reward: 'Truth Speaker Badge + $100 Bonus',
                faithMode: false,
                category: 'Lifestyle & Personal Growth',
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 0,
                userCompleted: false,
                difficulty: 'hard',
                tags: ['authentic', 'vulnerable', 'truth', 'real'],
                requirements: [
                    'Post 20 times over 30 days',
                    'Share vulnerable content',
                    'Be completely authentic',
                    'Inspire others to be real',
                ],
                tips: [
                    'Start with small vulnerabilities',
                    'Build trust with your audience',
                    'Share both struggles and victories',
                    'Support others in their journey',
                ],
            },
            {
                id: '4',
                title: faithMode ? 'Scripture Sharing Challenge' : 'Wisdom Sharing Challenge',
                description: faithMode 
                    ? 'Share daily scripture insights and how they apply to modern life. Help others grow in their faith journey.'
                    : 'Share daily wisdom and life lessons. Help others learn from your experiences and insights.',
                duration: 21,
                participants: 743,
                reward: faithMode ? 'Scripture Teacher Badge + $75 Bonus' : 'Wisdom Keeper Badge + $75 Bonus',
                faithMode: true,
                category: 'Faith & Spirituality',
                startDate: new Date(),
                endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                isActive: true,
                userProgress: 0,
                userCompleted: false,
                difficulty: 'medium',
                tags: faithMode ? ['scripture', 'faith', 'teaching', 'wisdom'] : ['wisdom', 'life-lessons', 'teaching', 'insights'],
                requirements: [
                    'Post 15 times over 21 days',
                    'Share meaningful insights',
                    'Apply lessons to real life',
                    'Engage with learners',
                ],
                tips: [
                    'Choose relevant passages/topics',
                    'Make it practical and applicable',
                    'Share personal applications',
                    'Encourage discussion',
                ],
            },
        ];

        setChallenges(mockChallenges);
    }, [faithMode]);

    const handleJoinChallenge = (challenge: CommunityChallenge) => {
        setSelectedChallenge(challenge);
        setShowChallengeModal(true);
    };

    const handleSubmitContent = async () => {
        if (!submissionContent.trim()) {
            Alert.alert('Content Required', 'Please add some content to your submission.');
            return;
        }

        if (!selectedChallenge) return;

        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newSubmission: UserChallengeSubmission = {
                challengeId: selectedChallenge.id,
                content: submissionContent,
                timestamp: new Date(),
                likes: 0,
                comments: 0,
            };

            setUserSubmissions(prev => [...prev, newSubmission]);

            // Update challenge progress
            setChallenges(prev => prev.map(challenge => 
                challenge.id === selectedChallenge.id 
                    ? { ...challenge, userProgress: (challenge.userProgress || 0) + 1 }
                    : challenge
            ));

            setSubmissionContent('');
            setShowSubmissionModal(false);
            
            Alert.alert(
                'Submission Successful!',
                faithMode 
                    ? 'Your content has been shared. Keep up the great work!'
                    : 'Your content has been shared. Keep growing!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderChallengeCard = (challenge: CommunityChallenge) => (
        <View key={challenge.id} style={[styles.challengeCard, { backgroundColor: colors.card }]}>
            <View style={styles.challengeHeader}>
                <View style={styles.challengeTitleContainer}>
                    <Text style={[styles.challengeTitle, { color: colors.text }]}>
                        {challenge.title}
                    </Text>
                    <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: challenge.difficulty === 'easy' ? colors.emerald : challenge.difficulty === 'medium' ? colors.olive : '#ff6b6b' }
                    ]}>
                        <Text style={[styles.difficultyText, { color: colors.cream }]}>
                            {challenge.difficulty.toUpperCase()}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.challengeReward, { color: colors.emerald }]}>
                    {challenge.reward}
                </Text>
            </View>

            <Text style={[styles.challengeDescription, { color: colors.olive }]}>
                {challenge.description}
            </Text>

            <View style={styles.challengeStats}>
                <Text style={[styles.challengeStat, { color: colors.olive }]}>
                    👥 {challenge.participants} participants
                </Text>
                <Text style={[styles.challengeStat, { color: colors.olive }]}>
                    ⏱️ {challenge.duration} days
                </Text>
                <Text style={[styles.challengeStat, { color: colors.olive }]}>
                    🏷️ {challenge.category}
                </Text>
            </View>

            <View style={styles.tagsContainer}>
                {challenge.tags.map((tag, index) => (
                    <Text key={index} style={[styles.tag, { color: colors.emerald }]}>
                        #{tag}
                    </Text>
                ))}
            </View>

            {challenge.userProgress !== undefined && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: colors.text }]}>
                            Your Progress
                        </Text>
                        <Text style={[styles.progressText, { color: colors.olive }]}>
                            {challenge.userProgress}/{challenge.duration} days
                        </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.olive }]}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { 
                                    backgroundColor: colors.emerald,
                                    width: `${Math.min((challenge.userProgress / challenge.duration) * 100, 100)}%`
                                }
                            ]} 
                        />
                    </View>
                </View>
            )}

            <View style={styles.challengeActions}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.emerald }]}
                    onPress={() => handleJoinChallenge(challenge)}
                >
                    <Text style={[styles.actionButtonText, { color: colors.cream }]}>
                        {challenge.userProgress ? 'Continue Challenge' : 'Join Challenge'}
                    </Text>
                </TouchableOpacity>

                {challenge.userProgress && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.olive }]}
                        onPress={() => {
                            setSelectedChallenge(challenge);
                            setShowSubmissionModal(true);
                        }}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.olive }]}>
                            Submit Content
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.emerald }]}>
                <Text style={[styles.headerTitle, { color: colors.cream }]}>
                    🏆 Community Challenges
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.cream }]}>
                    {faithMode 
                        ? 'Join challenges to grow in faith and community'
                        : 'Join challenges to grow personally and connect with others'
                    }
                </Text>
            </View>

            {/* Challenges List */}
            <View style={styles.challengesContainer}>
                {challenges.map(renderChallengeCard)}
            </View>

            {/* Challenge Details Modal */}
            <Modal visible={showChallengeModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            {selectedChallenge && (
                                <>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                                        {selectedChallenge.title}
                                    </Text>

                                    <Text style={[styles.modalDescription, { color: colors.olive }]}>
                                        {selectedChallenge.description}
                                    </Text>

                                    <View style={styles.modalSection}>
                                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                            Requirements
                                        </Text>
                                        {selectedChallenge.requirements.map((requirement, index) => (
                                            <Text key={index} style={[styles.requirementText, { color: colors.olive }]}>
                                                • {requirement}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                            Tips for Success
                                        </Text>
                                        {selectedChallenge.tips.map((tip, index) => (
                                            <Text key={index} style={[styles.tipText, { color: colors.olive }]}>
                                                💡 {tip}
                                            </Text>
                                        ))}
                                    </View>

                                    {selectedChallenge.leaderboard && (
                                        <View style={styles.modalSection}>
                                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                                Leaderboard
                                            </Text>
                                            {selectedChallenge.leaderboard.map((entry) => (
                                                <View key={entry.userId} style={styles.leaderboardEntry}>
                                                    <Text style={[styles.rankText, { color: colors.emerald }]}>
                                                        #{entry.rank}
                                                    </Text>
                                                    <Image source={{ uri: entry.avatar }} style={styles.avatar} />
                                                    <Text style={[styles.usernameText, { color: colors.text }]}>
                                                        {entry.username}
                                                    </Text>
                                                    <Text style={[styles.progressText, { color: colors.olive }]}>
                                                        {entry.progress}/{selectedChallenge.duration}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <View style={styles.modalActions}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.cancelButton]}
                                            onPress={() => setShowChallengeModal(false)}
                                        >
                                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                                Close
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.emerald }]}
                                            onPress={() => {
                                                setShowChallengeModal(false);
                                                setShowSubmissionModal(true);
                                            }}
                                        >
                                            <Text style={[styles.confirmButtonText, { color: colors.cream }]}>
                                                Start Challenge
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Submission Modal */}
            <Modal visible={showSubmissionModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Submit Challenge Content
                        </Text>

                        <Text style={[styles.modalSubtitle, { color: colors.olive }]}>
                            Share your progress for: {selectedChallenge?.title}
                        </Text>

                        <TextInput
                            style={[styles.submissionInput, { 
                                color: colors.text,
                                borderColor: colors.olive,
                                backgroundColor: colors.background
                            }]}
                            placeholder={faithMode ? "Share your prayer, testimony, or reflection..." : "Share your growth, insight, or experience..."}
                            placeholderTextColor={colors.olive}
                            value={submissionContent}
                            onChangeText={setSubmissionContent}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowSubmissionModal(false)}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.emerald }]}
                                onPress={handleSubmitContent}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.cream} />
                                ) : (
                                    <Text style={[styles.confirmButtonText, { color: colors.cream }]}>
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    challengesContainer: {
        gap: 16,
    },
    challengeCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    challengeTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '600',
    },
    challengeReward: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
    },
    challengeDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    challengeStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    challengeStat: {
        fontSize: 12,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    tag: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '500',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    challengeActions: {
        gap: 12,
    },
    actionButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalScrollView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    tipText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    leaderboardEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 30,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    usernameText: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'transparent',
    },
    confirmButton: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    submissionInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
});
