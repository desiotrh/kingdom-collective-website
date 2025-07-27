import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';

const FAITH_TOPICS = [
    'Deliverance',
    'Prophetic Activation',
    'Identity',
    'Intercession',
];
const ENCOURAGEMENT_TOPICS = [
    'Mindset Reset',
    'Breakthrough Goals',
    'Creative Circle',
    'Growth Pod',
];
const SCRIPTURE_BANNERS = [
    'Galatians 5:1 - It is for freedom that Christ has set us free.',
    'Romans 8:37 - We are more than conquerors through Him who loved us.',
    'Isaiah 43:19 - See, I am doing a new thing!',
    'Ephesians 2:10 - We are God\'s handiwork, created in Christ Jesus.',
];
const ENCOURAGEMENT_TAGLINES = [
    'Grow together. Go further.',
    'Every voice matters.',
    'Support. Stretch. Succeed.',
    'Creativity thrives in community.',
];
const GROUP_BANNER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const MOCK_MEMBERS = [
    { username: 'jordan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'leader' as const },
    { username: 'ashley', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'member' as const },
    { username: 'sam', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', role: 'admin' as const },
    { username: 'mia', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', role: 'member' as const },
];

interface DiscipleshipThread {
    id: string;
    title: string;
    teaching: string;
    question: string;
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
    responses: ThreadResponse[];
}

interface ThreadResponse {
    id: string;
    text: string;
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
}

interface GroupChallenge {
    id: string;
    title: string;
    description: string;
    videoUri?: string;
    prompt: string;
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
    responses: ChallengeResponse[];
}

interface ChallengeResponse {
    id: string;
    text?: string;
    videoUri?: string;
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
    type: 'text' | 'video';
}

// Comment & Reaction System Interfaces
interface Comment {
    id: string;
    text: string;
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
    reactions: Reaction[];
    replies?: Comment[];
    tags?: string[]; // For Faith Mode: "Word of Knowledge", "Prophetic"
}

interface Reaction {
    emoji: string;
    count: number;
    users: string[]; // Track who reacted
}

interface ContentWithComments {
    id: string;
    comments: Comment[];
    reactions: Reaction[];
}

// Reaction Emojis by Mode
const FAITH_REACTIONS = ['🙌', '🔥', '❤️', '👏', '✝️', '🙏', '💯'];
const ENCOURAGEMENT_REACTIONS = ['🔥', '🙌', '💬', '❤️', '👏', '💯', '✨'];

// Mock Comments Data
const MOCK_COMMENTS: Comment[] = [
    {
        id: '1',
        text: faithMode ? 'This really speaks to my heart. Thank you for sharing this word!' : 'This is exactly what I needed to hear today.',
        author: 'ashley',
        authorRole: 'member',
        timestamp: Date.now() - 3600000,
        reactions: [
            { emoji: '❤️', count: 3, users: ['jordan', 'sam', 'ashley'] },
            { emoji: faithMode ? '✝️' : '🔥', count: 2, users: ['jordan', 'mia'] },
        ],
        tags: faithMode ? ['Word of Knowledge'] : undefined,
    },
    {
        id: '2',
        text: faithMode ? 'I felt the Holy Spirit confirming this in my spirit.' : 'This perspective is so refreshing and encouraging.',
        author: 'sam',
        authorRole: 'admin',
        timestamp: Date.now() - 7200000,
        reactions: [
            { emoji: '🙌', count: 4, users: ['jordan', 'ashley', 'sam', 'mia'] },
            { emoji: '🔥', count: 2, users: ['jordan', 'ashley'] },
        ],
        tags: faithMode ? ['Prophetic'] : undefined,
    },
];

// Resource System Interfaces
interface GroupResource {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: 'pdf' | 'image' | 'video' | 'link';
    category: 'devotional' | 'sermon' | 'challenge' | 'tool' | 'wellness' | 'mindset' | 'productivity' | 'creative';
    author: string;
    authorRole: 'member' | 'leader' | 'admin';
    timestamp: number;
    downloads: number;
    tags?: string[]; // Scripture references for Faith Mode
}

// Resource Categories by Mode
const FAITH_RESOURCE_CATEGORIES = [
    { key: 'devotional', label: 'Devotional', icon: '📖' },
    { key: 'sermon', label: 'Sermon', icon: '✝️' },
    { key: 'challenge', label: 'Challenge', icon: '🔥' },
    { key: 'tool', label: 'Tool', icon: '🛠️' },
];

const ENCOURAGEMENT_RESOURCE_CATEGORIES = [
    { key: 'wellness', label: 'Wellness', icon: '💚' },
    { key: 'mindset', label: 'Mindset', icon: '🧠' },
    { key: 'productivity', label: 'Productivity', icon: '⚡' },
    { key: 'creative', label: 'Creative', icon: '🎨' },
];

// Mock Resources Data
const MOCK_RESOURCES: GroupResource[] = [
    {
        id: '1',
        title: faithMode ? 'Daily Devotional: Walking in Freedom' : 'Daily Wellness: Mindful Morning Routine',
        description: faithMode
            ? 'A 7-day devotional guide focusing on Galatians 5:1 and walking in the freedom Christ provides.'
            : 'A comprehensive guide to starting your day with intention and mindfulness.',
        fileUrl: 'https://example.com/devotional-guide.pdf',
        fileType: 'pdf',
        category: faithMode ? 'devotional' : 'wellness',
        author: 'jordan',
        authorRole: 'leader',
        timestamp: Date.now() - 86400000,
        downloads: 12,
        tags: faithMode ? ['Galatians 5:1', 'Freedom', 'Devotional'] : ['Wellness', 'Mindfulness'],
    },
    {
        id: '2',
        title: faithMode ? 'Sermon Notes: Identity in Christ' : 'Mindset Reset: Building Confidence',
        description: faithMode
            ? 'Key points and scriptures from Sunday\'s message on finding your identity in Christ.'
            : 'Practical strategies for building self-confidence and overcoming self-doubt.',
        fileUrl: 'https://example.com/sermon-notes.pdf',
        fileType: 'pdf',
        category: faithMode ? 'sermon' : 'mindset',
        author: 'ashley',
        authorRole: 'member',
        timestamp: Date.now() - 172800000,
        downloads: 8,
        tags: faithMode ? ['Ephesians 2:10', 'Identity', 'Sermon'] : ['Confidence', 'Self-esteem'],
    },
    {
        id: '3',
        title: faithMode ? '30-Day Prayer Challenge' : '30-Day Creative Challenge',
        description: faithMode
            ? 'A month-long challenge to deepen your prayer life with daily prompts and scripture.'
            : 'A month-long challenge to unlock your creativity with daily prompts and exercises.',
        fileUrl: 'https://example.com/prayer-challenge.pdf',
        fileType: 'pdf',
        category: 'challenge',
        author: 'sam',
        authorRole: 'admin',
        timestamp: Date.now() - 259200000,
        downloads: 15,
        tags: faithMode ? ['Prayer', 'Challenge', 'Spiritual Growth'] : ['Creativity', 'Challenge', 'Growth'],
    },
];

// Group Progress Tracker Interfaces
interface GroupActivity {
    id: string;
    type: 'checkin' | 'prayer' | 'comment' | 'challenge' | 'discipleship';
    userId: string;
    timestamp: number;
}

interface GroupProgress {
    currentStreak: number;
    lastActivityDate: number;
    weeklyActivity: number[]; // 7-day activity count
    topContributors: string[];
    milestoneReached: boolean;
}

// Mock Progress Data
const MOCK_GROUP_PROGRESS: GroupProgress = {
    currentStreak: 4,
    lastActivityDate: Date.now() - 86400000, // 1 day ago
    weeklyActivity: [2, 3, 1, 4, 2, 3, 1], // Last 7 days
    topContributors: ['jordan', 'ashley', 'sam'],
    milestoneReached: false,
};

export default function ForgeGroupScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    // State
    const [joined, setJoined] = useState(false);
    const [tab, setTab] = useState<'chat' | 'prayer' | 'checkin' | 'discipleship' | 'challenges' | 'voice' | 'resources' | 'progress'>('chat');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', user: 'jordan', text: 'Welcome to the group! 🙌', type: 'text' },
        { id: '2', user: 'ashley', text: 'Let\'s pray for breakthrough this week.', type: 'text' },
    ]);

    // Challenge State
    const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
    const [showChallengeResponseModal, setShowChallengeResponseModal] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<GroupChallenge | null>(null);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        prompt: '',
    });
    const [challengeResponse, setChallengeResponse] = useState('');
    const [challengeResponseType, setChallengeResponseType] = useState<'text' | 'video'>('text');
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const [recording, setRecording] = useState(false);
    const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
    const cameraRef = useRef<Camera>(null);

    // Discipleship Threads State
    const [showNewLessonModal, setShowNewLessonModal] = useState(false);
    const [newLesson, setNewLesson] = useState({
        title: '',
        teaching: '',
        question: '',
    });
    const [selectedThread, setSelectedThread] = useState<DiscipleshipThread | null>(null);
    const [showThreadModal, setShowThreadModal] = useState(false);
    const [threadResponse, setThreadResponse] = useState('');
    const [discipleshipThreads, setDiscipleshipThreads] = useState<DiscipleshipThread[]>([
        {
            id: '1',
            title: faithMode ? 'Walking in Freedom' : 'Breaking Through Limits',
            teaching: faithMode
                ? 'Galatians 5:1 reminds us that Christ has set us free. This freedom isn\'t just from sin, but from the bondage of performance, fear, and comparison. When we truly grasp this freedom, we can walk in confidence knowing we are loved and accepted by God.'
                : 'Limits are often self-imposed. When we recognize that our potential is greater than our current circumstances, we can break through barriers that once seemed impossible. Growth happens when we step outside our comfort zones.',
            question: faithMode
                ? 'How is this truth about freedom speaking to your current situation?'
                : 'What truth is this unlocking for you?',
            author: 'jordan',
            authorRole: 'leader',
            timestamp: Date.now() - 86400000,
            responses: [
                {
                    id: '1',
                    text: faithMode
                        ? 'This really speaks to my struggle with perfectionism. I need to remember that God accepts me as I am.'
                        : 'This reminds me that I often hold myself back more than any external factor.',
                    author: 'ashley',
                    authorRole: 'member',
                    timestamp: Date.now() - 82800000,
                },
                {
                    id: '2',
                    text: faithMode
                        ? 'I felt God speaking to me about letting go of control and trusting Him more.'
                        : 'I\'m realizing that my biggest obstacle is my own mindset about what\'s possible.',
                    author: 'sam',
                    authorRole: 'admin',
                    timestamp: Date.now() - 79200000,
                },
            ],
        },
        {
            id: '2',
            title: faithMode ? 'Identity in Christ' : 'Building Self-Confidence',
            teaching: faithMode
                ? 'Ephesians 2:10 tells us we are God\'s handiwork, created in Christ Jesus for good works. Our identity isn\'t found in our achievements, failures, or what others think of us. It\'s found in who God says we are.'
                : 'Confidence comes from understanding your unique strengths and embracing your authentic self. When you stop comparing yourself to others and focus on your own growth, you unlock your true potential.',
            question: faithMode
                ? 'How does understanding your identity in Christ change how you see yourself?'
                : 'How does this perspective on confidence change how you approach challenges?',
            author: 'ashley',
            authorRole: 'member',
            timestamp: Date.now() - 172800000,
            responses: [
                {
                    id: '3',
                    text: faithMode
                        ? 'This helps me remember that my worth isn\'t based on my performance.'
                        : 'I\'m learning to focus on my own journey instead of comparing myself to others.',
                    author: 'mia',
                    authorRole: 'member',
                    timestamp: Date.now() - 169200000,
                },
            ],
        },
    ]);

    // Mock challenges data
    const [groupChallenges, setGroupChallenges] = useState<GroupChallenge[]>([
        {
            id: '1',
            title: faithMode ? 'Share Your Testimony' : 'Share Your Breakthrough',
            description: faithMode
                ? 'Record a 60-second video sharing a testimony of breakthrough in your life.'
                : 'Record a 60-second video sharing a breakthrough moment or lesson learned.',
            prompt: faithMode
                ? 'How has God been working in your life recently? Share a specific testimony of breakthrough, healing, or answered prayer.'
                : 'What breakthrough or lesson has impacted you this week? Share a moment of growth or realization.',
            author: 'jordan',
            authorRole: 'leader',
            timestamp: Date.now() - 86400000,
            responses: [
                {
                    id: '1',
                    text: faithMode
                        ? 'God has been teaching me to trust Him more with my finances. I felt led to give more generously, and He has provided in unexpected ways.'
                        : 'I realized that my biggest breakthrough was letting go of perfectionism. I\'m learning to celebrate progress over perfection.',
                    author: 'ashley',
                    authorRole: 'member',
                    timestamp: Date.now() - 82800000,
                    type: 'text',
                },
            ],
        },
        {
            id: '2',
            title: faithMode ? 'Declare God\'s Word' : 'Share Your Truth',
            description: faithMode
                ? 'Record a 30-second video declaring what God is speaking to you this week.'
                : 'Record a 30-second video sharing a truth or principle that has been speaking to you.',
            prompt: faithMode
                ? 'What is God speaking to you this week? Declare His promises over your life and circumstances.'
                : 'What truth or principle has been resonating with you lately? Share how it\'s changing your perspective.',
            author: 'ashley',
            authorRole: 'member',
            timestamp: Date.now() - 172800000,
            responses: [],
        },
    ]);

    // Group info
    const groupName = faithMode ? 'Prophetic Activation' : 'Growth Pod';
    const groupTopic = faithMode
        ? FAITH_TOPICS[Math.floor(Math.random() * FAITH_TOPICS.length)]
        : ENCOURAGEMENT_TOPICS[Math.floor(Math.random() * ENCOURAGEMENT_TOPICS.length)];
    const scriptureBanner = SCRIPTURE_BANNERS[Math.floor(Math.random() * SCRIPTURE_BANNERS.length)];
    const encouragementTagline = ENCOURAGEMENT_TAGLINES[Math.floor(Math.random() * ENCOURAGEMENT_TAGLINES.length)];

    // Watermark
    const watermark = faithMode ? '✝️' : encouragementMode ? '🕊' : '';

    // Actions
    const handleSend = () => {
        if (!message.trim()) return;
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), user: 'you', text: message, type: 'text' },
        ]);
        setMessage('');
    };

    const handleJoinLeave = () => setJoined((j) => !j);

    const handlePostLesson = () => {
        if (!newLesson.title.trim() || !newLesson.teaching.trim() || !newLesson.question.trim()) {
            Alert.alert('Missing Information', 'Please fill in all fields.');
            return;
        }

        const newThread: DiscipleshipThread = {
            id: Date.now().toString(),
            title: newLesson.title,
            teaching: newLesson.teaching,
            question: newLesson.question,
            author: 'you',
            authorRole: 'member',
            timestamp: Date.now(),
            responses: [],
        };

        setDiscipleshipThreads(prev => [newThread, ...prev]);
        setNewLesson({ title: '', teaching: '', question: '' });
        setShowNewLessonModal(false);
    };

    const handlePostResponse = () => {
        if (!threadResponse.trim() || !selectedThread) return;

        const newResponse: ThreadResponse = {
            id: Date.now().toString(),
            text: threadResponse,
            author: 'you',
            authorRole: 'member',
            timestamp: Date.now(),
        };

        setDiscipleshipThreads(prev =>
            prev.map(thread =>
                thread.id === selectedThread.id
                    ? { ...thread, responses: [...thread.responses, newResponse] }
                    : thread
            )
        );

        setSelectedThread(prev => prev ? { ...prev, responses: [...prev.responses, newResponse] } : null);
        setThreadResponse('');
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    // Role Badge Functions
    const getRoleBadge = (role: 'member' | 'leader' | 'admin') => {
        switch (role) {
            case 'admin':
                return { text: '👑 Admin', color: colors.emerald, bgColor: colors.emerald };
            case 'leader':
                return { text: '⭐ Leader', color: colors.olive, bgColor: colors.olive };
            case 'member':
                return { text: '👤 Member', color: colors.olive, bgColor: 'transparent' };
            default:
                return { text: '👤 Member', color: colors.olive, bgColor: 'transparent' };
        }
    };

    const canPostContent = (role: 'member' | 'leader' | 'admin') => {
        return role === 'leader' || role === 'admin';
    };

    const canModerate = (role: 'member' | 'leader' | 'admin') => {
        return role === 'admin';
    };

    // Challenge Handlers
    const handlePostChallenge = () => {
        if (!newChallenge.title.trim() || !newChallenge.description.trim() || !newChallenge.prompt.trim()) {
            Alert.alert('Missing Information', 'Please fill in all fields.');
            return;
        }

        const newChallengePost: GroupChallenge = {
            id: Date.now().toString(),
            title: newChallenge.title,
            description: newChallenge.description,
            prompt: newChallenge.prompt,
            author: 'you',
            authorRole: 'member',
            timestamp: Date.now(),
            responses: [],
        };

        setGroupChallenges(prev => [newChallengePost, ...prev]);
        setNewChallenge({ title: '', description: '', prompt: '' });
        setShowNewChallengeModal(false);
    };

    const handlePostChallengeResponse = () => {
        if (!selectedChallenge) return;

        if (challengeResponseType === 'text' && !challengeResponse.trim()) {
            Alert.alert('Missing Response', 'Please enter your response.');
            return;
        }

        if (challengeResponseType === 'video' && !recordedVideoUri) {
            Alert.alert('Missing Video', 'Please record a video response.');
            return;
        }

        const newResponse: ChallengeResponse = {
            id: Date.now().toString(),
            text: challengeResponseType === 'text' ? challengeResponse : undefined,
            videoUri: challengeResponseType === 'video' ? recordedVideoUri : undefined,
            author: 'you',
            authorRole: 'member',
            timestamp: Date.now(),
            type: challengeResponseType,
        };

        setGroupChallenges(prev =>
            prev.map(challenge =>
                challenge.id === selectedChallenge.id
                    ? { ...challenge, responses: [...challenge.responses, newResponse] }
                    : challenge
            )
        );

        setSelectedChallenge(prev => prev ? { ...prev, responses: [...prev.responses, newResponse] } : null);
        setChallengeResponse('');
        setRecordedVideoUri(null);
        setChallengeResponseType('text');
    };

    const startRecording = async () => {
        if (!cameraRef.current) return;

        try {
            setRecording(true);
            const video = await cameraRef.current.recordAsync({
                maxDuration: 60,
                quality: Camera.Constants.VideoQuality['480p'],
            });
            setRecordedVideoUri(video.uri);
        } catch (error) {
            console.error('Error recording video:', error);
            Alert.alert('Recording Error', 'Failed to record video. Please try again.');
        } finally {
            setRecording(false);
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && recording) {
            cameraRef.current.stopRecording();
        }
    };

    // Scripture/Quote Board State
    const SAMPLE_SCRIPTURES = [
        {
            id: '1',
            reference: 'Isaiah 43:2',
            verse: 'When you pass through the waters, I will be with you.',
            postedBy: 'jordan',
        },
        {
            id: '2',
            reference: 'Romans 8:37',
            verse: 'In all these things we are more than conquerors through Him who loved us.',
            postedBy: 'sam',
        },
        {
            id: '3',
            reference: 'Psalm 27:1',
            verse: 'The Lord is my light and my salvation—whom shall I fear?',
            postedBy: 'ashley',
        },
    ];
    const SAMPLE_QUOTES = [
        {
            id: '1',
            reference: 'Growth Principle',
            verse: 'Progress, not perfection, is the path to greatness.',
            postedBy: 'mia',
        },
        {
            id: '2',
            reference: 'Encouragement',
            verse: 'You are stronger than you think and braver than you feel.',
            postedBy: 'sam',
        },
        {
            id: '3',
            reference: 'Motivation',
            verse: 'Every small step forward is a victory.',
            postedBy: 'ashley',
        },
    ];

    const [scriptureBoard, setScriptureBoard] = useState(SAMPLE_SCRIPTURES);
    const [quoteBoard, setQuoteBoard] = useState(SAMPLE_QUOTES);
    const [showPinModal, setShowPinModal] = useState(false);
    const [newScripture, setNewScripture] = useState({ reference: '', verse: '' });
    const flameAnim = useRef(new Animated.Value(0)).current;

    // Animation for flame highlight
    useEffect(() => {
        if (faithMode) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flameAnim, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                    Animated.timing(flameAnim, { toValue: 0, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                ])
            ).start();
        }
    }, [faithMode]);

    // Scripture Pin Board Component
    const renderScriptureBoard = () => {
        if (!faithMode) return null;
        if (!scriptureBoard.length) return null;
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scriptureBoard}>
                {scriptureBoard.map((item, idx) => (
                    <Animated.View
                        key={item.id}
                        style={[styles.scriptureCard, {
                            shadowColor: '#FFB300',
                            shadowOpacity: flameAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.5] }),
                            transform: [{ scale: flameAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) }],
                        }]}
                    >
                        <Text style={styles.scriptureReference}>{item.reference}</Text>
                        <Text style={styles.scriptureVerse}>{item.verse}</Text>
                        <Text style={styles.scripturePostedBy}>Posted by {item.postedBy}</Text>
                        {(userRole === 'leader' || userRole === 'admin') && (
                            <TouchableOpacity onPress={() => handleUnpinScripture(item.id)} style={styles.unpinButton}>
                                <Text style={styles.unpinButtonText}>Unpin</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                ))}
                {(userRole === 'leader' || userRole === 'admin') && scriptureBoard.length < 3 && (
                    <TouchableOpacity style={styles.pinNewButton} onPress={() => setShowPinModal(true)}>
                        <Text style={styles.pinNewButtonText}>+ Pin New Verse</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    };

    const renderQuoteBoard = () => {
        if (faithMode) return null;
        if (!quoteBoard.length) return null;
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scriptureBoard}>
                {quoteBoard.map((item) => (
                    <View key={item.id} style={styles.scriptureCard}>
                        <Text style={styles.scriptureReference}>{item.reference}</Text>
                        <Text style={styles.scriptureVerse}>{item.verse}</Text>
                        <Text style={styles.scripturePostedBy}>Shared by {item.postedBy}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    };

    const handlePinScripture = () => {
        if (!newScripture.reference.trim() || !newScripture.verse.trim()) return;
        setScriptureBoard(prev => [
            { id: Date.now().toString(), reference: newScripture.reference, verse: newScripture.verse, postedBy: 'you' },
            ...prev.slice(0, 2)
        ]);
        setShowPinModal(false);
        setNewScripture({ reference: '', verse: '' });
    };
    const handleUnpinScripture = (id: string) => {
        setScriptureBoard(prev => prev.filter(s => s.id !== id));
    };

    // Voice Room State
    const VOICE_ROOM_TAGS_FAITH = ['Prayer', 'Prophecy', 'Worship', 'Deliverance'];
    const VOICE_ROOM_TAGS_ENCOURAGEMENT = ['Mindset Call', 'Wellness Circle', 'Creative Sync'];
    const [voiceTabActive, setVoiceTabActive] = useState(false);
    const [voiceRoomLive, setVoiceRoomLive] = useState(false);
    const [voiceParticipants, setVoiceParticipants] = useState([
        { id: '1', name: 'jordan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isMuted: false, isSpeaking: false },
        { id: '2', name: 'ashley', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isMuted: true, isSpeaking: false },
    ]);
    const [currentUserId] = useState('1'); // Simulate current user
    const [micMuted, setMicMuted] = useState(false);
    const [isInRoom, setIsInRoom] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [roomPrompt, setRoomPrompt] = useState(faithMode ? 'Let the Spirit lead the room.' : 'Encourage, Check-In, Grow Together');
    const [roomTags, setRoomTags] = useState(faithMode ? VOICE_ROOM_TAGS_FAITH : VOICE_ROOM_TAGS_ENCOURAGEMENT);

    // TODO: Replace with scalable group voice (Agora/Twilio/WebRTC)

    // Simulate speaking animation
    useEffect(() => {
        let interval: any;
        if (isInRoom && !micMuted) {
            interval = setInterval(() => {
                setIsSpeaking((s) => !s);
                setVoiceParticipants((prev) => prev.map(p =>
                    p.id === currentUserId ? { ...p, isSpeaking: !micMuted && Math.random() > 0.5 } : p
                ));
            }, 1200);
        } else {
            setIsSpeaking(false);
            setVoiceParticipants((prev) => prev.map(p =>
                p.id === currentUserId ? { ...p, isSpeaking: false } : p
            ));
        }
        return () => clearInterval(interval);
    }, [isInRoom, micMuted]);

    const handleJoinVoiceRoom = () => {
        setIsInRoom(true);
        setVoiceRoomLive(true);
        setVoiceParticipants((prev) =>
            prev.some(p => p.id === currentUserId)
                ? prev
                : [...prev, { id: currentUserId, name: 'jordan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isMuted: false, isSpeaking: false }]
        );
    };
    const handleLeaveVoiceRoom = () => {
        setIsInRoom(false);
        setVoiceRoomLive(false);
        setVoiceParticipants((prev) => prev.filter(p => p.id !== currentUserId));
    };
    const handleToggleMic = async () => {
        setMicMuted((m) => !m);
        // Optionally use expo-av to mute/unmute local mic
        // TODO: Integrate real audio stream
    };

    const renderVoiceRoom = () => (
        <View style={styles.voiceRoomContainer}>
            <View style={styles.voiceRoomHeader}>
                <Text style={styles.voiceRoomTitle}>{faithMode ? 'Voice Room ✝️' : 'Voice Room 🕊'}</Text>
                <Text style={[styles.voiceRoomStatus, { color: voiceRoomLive ? '#2ecc40' : '#aaa' }]}>
                    {voiceRoomLive ? 'Live' : 'Idle'}
                </Text>
            </View>
            <Text style={styles.voiceRoomPrompt}>{roomPrompt}</Text>
            <View style={styles.voiceRoomTagsRow}>
                {roomTags.map(tag => (
                    <View key={tag} style={styles.voiceRoomTag}><Text style={styles.voiceRoomTagText}>{tag}</Text></View>
                ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceRoomBubblesRow}>
                {voiceParticipants.map(p => (
                    <View key={p.id} style={styles.voiceRoomBubbleContainer}>
                        <View style={[styles.voiceRoomBubble, p.isSpeaking && styles.voiceRoomBubbleSpeaking]}>
                            <Image source={{ uri: p.avatar }} style={styles.voiceRoomAvatar} />
                            {p.isMuted && <Text style={styles.voiceRoomMuted}>🔇</Text>}
                        </View>
                        <Text style={styles.voiceRoomName}>{p.name}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.voiceRoomControls}>
                {isInRoom ? (
                    <>
                        <TouchableOpacity style={styles.voiceRoomMicButton} onPress={handleToggleMic}>
                            <Text style={styles.voiceRoomMicIcon}>{micMuted ? '🎤❌' : '🎤'}</Text>
                            <Text style={styles.voiceRoomMicLabel}>{micMuted ? 'Unmute' : 'Mute'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.voiceRoomExitButton} onPress={handleLeaveVoiceRoom}>
                            <Text style={styles.voiceRoomExitText}>Exit</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.voiceRoomJoinButton} onPress={handleJoinVoiceRoom}>
                        <Text style={styles.voiceRoomJoinText}>Join Room</Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* Faith Mode: Pray Now animation if 2+ unmuted */}
            {faithMode && isInRoom && voiceParticipants.filter(p => !p.isMuted).length >= 2 && (
                <View style={styles.prayNowAnim}><Text style={styles.prayNowAnimText}>�� Pray Now! 🔥</Text></View>
            )}
            {/* Encouragement Mode: nothing extra for now */}
        </View>
    );

    // State for Comments & Reactions
    const [showComments, setShowComments] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({
        'thread-1': MOCK_COMMENTS,
        'challenge-1': [
            {
                id: '3',
                text: 'This challenge is exactly what I needed!',
                author: 'mia',
                authorRole: 'member',
                timestamp: Date.now() - 1800000,
                reactions: [
                    { emoji: '🔥', count: 2, users: ['jordan', 'ashley'] },
                ],
            },
        ],
    });

    // Reaction Functions
    const handleReaction = (contentId: string, emoji: string) => {
        const currentUser = 'jordan'; // Simulate current user

        setComments(prev => {
            const contentComments = prev[contentId] || [];
            const updatedComments = contentComments.map(comment => {
                const reaction = comment.reactions.find(r => r.emoji === emoji);
                if (reaction) {
                    if (reaction.users.includes(currentUser)) {
                        // Remove reaction
                        reaction.count--;
                        reaction.users = reaction.users.filter(u => u !== currentUser);
                    } else {
                        // Add reaction
                        reaction.count++;
                        reaction.users.push(currentUser);
                    }
                } else {
                    // Create new reaction
                    comment.reactions.push({
                        emoji,
                        count: 1,
                        users: [currentUser],
                    });
                }
                return comment;
            });

            return {
                ...prev,
                [contentId]: updatedComments,
            };
        });
    };

    const handleAddComment = (contentId: string) => {
        if (!newComment.trim()) return;

        const newCommentObj: Comment = {
            id: Date.now().toString(),
            text: newComment,
            author: 'jordan',
            authorRole: 'leader',
            timestamp: Date.now(),
            reactions: [],
            replies: replyingTo ? [] : undefined,
        };

        setComments(prev => {
            const contentComments = prev[contentId] || [];
            if (replyingTo) {
                // Add as reply
                const updatedComments = contentComments.map(comment => {
                    if (comment.id === replyingTo) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newCommentObj],
                        };
                    }
                    return comment;
                });
                return { ...prev, [contentId]: updatedComments };
            } else {
                // Add as top-level comment
                return {
                    ...prev,
                    [contentId]: [newCommentObj, ...contentComments],
                };
            }
        });

        setNewComment('');
        setReplyingTo(null);
    };

    // Render Reaction Bar
    const renderReactionBar = (contentId: string, reactions: Reaction[] = []) => {
        const availableReactions = faithMode ? FAITH_REACTIONS : ENCOURAGEMENT_REACTIONS;

        return (
            <View style={styles.reactionBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {availableReactions.map(emoji => {
                        const reaction = reactions.find(r => r.emoji === emoji);
                        const hasReacted = reaction?.users.includes('jordan');

                        return (
                            <TouchableOpacity
                                key={emoji}
                                style={[
                                    styles.reactionButton,
                                    hasReacted && styles.reactionButtonActive,
                                    { backgroundColor: hasReacted ? colors.emerald : colors.sand }
                                ]}
                                onPress={() => handleReaction(contentId, emoji)}
                            >
                                <Text style={styles.reactionEmoji}>{emoji}</Text>
                                {reaction && reaction.count > 0 && (
                                    <Text style={[styles.reactionCount, { color: hasReacted ? colors.cream : colors.olive }]}>
                                        {reaction.count}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    // Render Comments Section
    const renderCommentsSection = (contentId: string, contentComments: Comment[] = []) => {
        const renderComment = (comment: Comment, isReply = false) => (
            <View key={comment.id} style={[styles.commentCard, isReply && styles.replyCard]}>
                <View style={styles.commentHeader}>
                    <Image
                        source={{ uri: MOCK_MEMBERS.find(m => m.username === comment.author)?.avatar }}
                        style={styles.commentAvatar}
                    />
                    <View style={styles.commentInfo}>
                        <Text style={[styles.commentAuthor, { color: colors.olive }]}>
                            @{comment.author}
                        </Text>
                        <Text style={[styles.commentTime, { color: colors.olive }]}>
                            {formatTime(comment.timestamp)}
                        </Text>
                    </View>
                    {comment.tags && faithMode && (
                        <View style={[styles.commentTag, { backgroundColor: colors.emerald }]}>
                            <Text style={[styles.commentTagText, { color: colors.cream }]}>
                                {comment.tags[0]}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.commentText, { color: colors.text }]}>
                    {comment.text}
                </Text>

                {comment.reactions.length > 0 && (
                    <View style={styles.commentReactions}>
                        {comment.reactions.map(reaction => (
                            <View key={reaction.emoji} style={styles.commentReaction}>
                                <Text style={styles.commentReactionEmoji}>{reaction.emoji}</Text>
                                <Text style={[styles.commentReactionCount, { color: colors.olive }]}>
                                    {reaction.count}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {!isReply && (
                    <TouchableOpacity
                        style={styles.replyButton}
                        onPress={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                        <Text style={[styles.replyButtonText, { color: colors.olive }]}>
                            Reply
                        </Text>
                    </TouchableOpacity>
                )}

                {replyingTo === comment.id && (
                    <View style={styles.replyInputContainer}>
                        <TextInput
                            style={[styles.replyInput, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder="Write a reply..."
                            placeholderTextColor={colors.olive}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <View style={styles.replyActions}>
                            <TouchableOpacity
                                style={styles.cancelReplyButton}
                                onPress={() => {
                                    setReplyingTo(null);
                                    setNewComment('');
                                }}
                            >
                                <Text style={[styles.cancelReplyText, { color: colors.olive }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.postReplyButton, { backgroundColor: colors.emerald }]}
                                onPress={() => handleAddComment(contentId)}
                            >
                                <Text style={[styles.postReplyText, { color: colors.cream }]}>Reply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </View>
                )}
            </View>
        );

        return (
            <View style={styles.commentsSection}>
                <View style={styles.commentsHeader}>
                    <Text style={[styles.commentsTitle, { color: colors.emerald }]}>
                        Comments ({contentComments.length})
                    </Text>
                    <TouchableOpacity
                        style={styles.addCommentButton}
                        onPress={() => setShowComments(showComments === contentId ? null : contentId)}
                    >
                        <Text style={[styles.addCommentText, { color: colors.emerald }]}>
                            {showComments === contentId ? 'Hide' : 'Add Comment'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showComments === contentId && (
                    <>
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={[styles.commentInput, {
                                    backgroundColor: colors.card,
                                    color: colors.text,
                                    borderColor: colors.olive,
                                }]}
                                placeholder={faithMode ? "Share your thoughts..." : "Add your perspective..."}
                                placeholderTextColor={colors.olive}
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.postCommentButton, { backgroundColor: colors.emerald }]}
                                onPress={() => handleAddComment(contentId)}
                            >
                                <Text style={[styles.postCommentText, { color: colors.cream }]}>
                                    Post
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.commentsList}>
                            {contentComments.map(comment => renderComment(comment))}
                        </ScrollView>
                    </>
                )}
            </View>
        );
    };

    // Update existing content rendering to include reactions and comments
    const renderThreadCard = (thread: DiscipleshipThread) => (
        <TouchableOpacity
            key={thread.id}
            style={[styles.threadCard, { backgroundColor: colors.card, borderColor: colors.olive }]}
            onPress={() => {
                setSelectedThread(thread);
                setShowThreadModal(true);
            }}
        >
            <View style={styles.threadHeader}>
                <Text style={[styles.threadTitle, { color: colors.emerald }]}>
                    {faithMode && thread.title.includes('Spirit-led') ? '✝️ ' : ''}{thread.title}
                </Text>
                <Text style={[styles.threadAuthor, { color: colors.olive }]}>
                    by @{thread.author}
                </Text>
            </View>
            <Text style={[styles.threadTeaching, { color: colors.text }]} numberOfLines={3}>
                {thread.teaching}
            </Text>
            <View style={styles.threadFooter}>
                <Text style={[styles.threadQuestion, { color: colors.emerald }]}>
                    {thread.question}
                </Text>
                <Text style={[styles.threadResponses, { color: colors.olive }]}>
                    {thread.responses.length} responses • {formatTime(thread.timestamp)}
                </Text>
            </View>

            {/* Add Reaction Bar */}
            {renderReactionBar(`thread-${thread.id}`, [])}

            {/* Add Comments Section */}
            {renderCommentsSection(`thread-${thread.id}`, comments[`thread-${thread.id}`] || [])}
        </TouchableOpacity>
    );

    const renderChallengeCard = (challenge: GroupChallenge) => (
        <TouchableOpacity
            key={challenge.id}
            style={[styles.challengeCard, { backgroundColor: colors.card, borderColor: colors.olive }]}
            onPress={() => {
                setSelectedChallenge(challenge);
                setShowChallengeResponseModal(true);
            }}
        >
            <View style={styles.challengeHeader}>
                <Text style={[styles.challengeTitle, { color: colors.emerald }]}>
                    {faithMode && challenge.title.includes('Challenge') ? '✝️ ' : ''}{challenge.title}
                </Text>
                <Text style={[styles.challengeAuthor, { color: colors.olive }]}>
                    by @{challenge.author}
                </Text>
            </View>
            <Text style={[styles.challengeDescription, { color: colors.text }]}>
                {challenge.description}
            </Text>
            <View style={styles.challengeFooter}>
                <Text style={[styles.challengePrompt, { color: colors.emerald }]}>
                    {challenge.prompt}
                </Text>
                <Text style={[styles.challengeResponses, { color: colors.olive }]}>
                    {challenge.responses.length} responses • {formatTime(challenge.timestamp)}
                </Text>
            </View>

            {/* Add Reaction Bar */}
            {renderReactionBar(`challenge-${challenge.id}`, [])}

            {/* Add Comments Section */}
            {renderCommentsSection(`challenge-${challenge.id}`, comments[`challenge-${challenge.id}`] || [])}
        </TouchableOpacity>
    );

    // Resource State
    const [resources, setResources] = useState<GroupResource[]>(MOCK_RESOURCES);
    const [showNewResourceModal, setShowNewResourceModal] = useState(false);
    const [resourceViewMode, setResourceViewMode] = useState<'grid' | 'list'>('grid');
    const [resourceSortBy, setResourceSortBy] = useState<'date' | 'category' | 'downloads'>('date');
    const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>('all');
    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        fileUrl: '',
        fileType: 'pdf' as const,
        category: 'devotional' as const,
    });

    // Resource Functions
    const handlePostResource = () => {
        if (!newResource.title.trim() || !newResource.description.trim() || !newResource.fileUrl.trim()) {
            Alert.alert('Missing Information', 'Please fill in all fields.');
            return;
        }

        const newResourcePost: GroupResource = {
            id: Date.now().toString(),
            title: newResource.title,
            description: newResource.description,
            fileUrl: newResource.fileUrl,
            fileType: newResource.fileType,
            category: newResource.category,
            author: 'jordan',
            authorRole: 'leader',
            timestamp: Date.now(),
            downloads: 0,
            tags: faithMode ? ['Scripture', 'Teaching'] : ['Growth', 'Development'],
        };

        setResources(prev => [newResourcePost, ...prev]);
        setNewResource({ title: '', description: '', fileUrl: '', fileType: 'pdf', category: 'devotional' });
        setShowNewResourceModal(false);
    };

    const handleDownloadResource = (resource: GroupResource) => {
        // TODO: Implement actual file download
        Alert.alert(
            'Download Resource',
            `Would you like to download "${resource.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Download',
                    onPress: () => {
                        setResources(prev =>
                            prev.map(r =>
                                r.id === resource.id
                                    ? { ...r, downloads: r.downloads + 1 }
                                    : r
                            )
                        );
                        Alert.alert('Download Started', 'Your resource is being downloaded.');
                    }
                }
            ]
        );
    };

    const getFilteredAndSortedResources = () => {
        let filtered = resources;

        // Filter by category
        if (selectedResourceCategory !== 'all') {
            filtered = filtered.filter(r => r.category === selectedResourceCategory);
        }

        // Sort resources
        switch (resourceSortBy) {
            case 'date':
                return filtered.sort((a, b) => b.timestamp - a.timestamp);
            case 'category':
                return filtered.sort((a, b) => a.category.localeCompare(b.category));
            case 'downloads':
                return filtered.sort((a, b) => b.downloads - a.downloads);
            default:
                return filtered;
        }
    };

    const getCategoryIcon = (category: string) => {
        const allCategories = [...FAITH_RESOURCE_CATEGORIES, ...ENCOURAGEMENT_RESOURCE_CATEGORIES];
        const categoryData = allCategories.find(c => c.key === category);
        return categoryData?.icon || '📄';
    };

    const getCategoryLabel = (category: string) => {
        const allCategories = [...FAITH_RESOURCE_CATEGORIES, ...ENCOURAGEMENT_RESOURCE_CATEGORIES];
        const categoryData = allCategories.find(c => c.key === category);
        return categoryData?.label || 'Resource';
    };

    // Render Resource Tab
    const renderResourceTab = () => {
        const filteredResources = getFilteredAndSortedResources();
        const currentCategories = faithMode ? FAITH_RESOURCE_CATEGORIES : ENCOURAGEMENT_RESOURCE_CATEGORIES;

        return (
            <View style={styles.resourceTab}>
                {/* Resource Header */}
                <View style={styles.resourceHeader}>
                    <Text style={[styles.resourceTitle, { color: colors.emerald }]}>
                        {faithMode ? '✝️ Group Resources' : '🕊 Group Resources'}
                    </Text>
                    {joined && (
                        <TouchableOpacity
                            style={[styles.addResourceButton, { backgroundColor: colors.emerald }]}
                            onPress={() => setShowNewResourceModal(true)}
                        >
                            <Text style={[styles.addResourceButtonText, { color: colors.cream }]}>
                                + Add Resource
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Category Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
                    <TouchableOpacity
                        style={[
                            styles.categoryFilterButton,
                            selectedResourceCategory === 'all' && { backgroundColor: colors.emerald }
                        ]}
                        onPress={() => setSelectedResourceCategory('all')}
                    >
                        <Text style={[
                            styles.categoryFilterText,
                            selectedResourceCategory === 'all' && { color: colors.cream }
                        ]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    {currentCategories.map(category => (
                        <TouchableOpacity
                            key={category.key}
                            style={[
                                styles.categoryFilterButton,
                                selectedResourceCategory === category.key && { backgroundColor: colors.emerald }
                            ]}
                            onPress={() => setSelectedResourceCategory(category.key)}
                        >
                            <Text style={[
                                styles.categoryFilterText,
                                selectedResourceCategory === category.key && { color: colors.cream }
                            ]}>
                                {category.icon} {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Sort Options */}
                <View style={styles.sortOptions}>
                    <Text style={[styles.sortLabel, { color: colors.olive }]}>Sort by:</Text>
                    <TouchableOpacity
                        style={[styles.sortButton, resourceSortBy === 'date' && { backgroundColor: colors.olive }]}
                        onPress={() => setResourceSortBy('date')}
                    >
                        <Text style={[styles.sortButtonText, resourceSortBy === 'date' && { color: colors.cream }]}>
                            Date
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, resourceSortBy === 'category' && { backgroundColor: colors.olive }]}
                        onPress={() => setResourceSortBy('category')}
                    >
                        <Text style={[styles.sortButtonText, resourceSortBy === 'category' && { color: colors.cream }]}>
                            Category
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, resourceSortBy === 'downloads' && { backgroundColor: colors.olive }]}
                        onPress={() => setResourceSortBy('downloads')}
                    >
                        <Text style={[styles.sortButtonText, resourceSortBy === 'downloads' && { color: colors.cream }]}>
                            Popular
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewModeToggle}>
                    <TouchableOpacity
                        style={[styles.viewModeButton, resourceViewMode === 'grid' && { backgroundColor: colors.olive }]}
                        onPress={() => setResourceViewMode('grid')}
                    >
                        <Text style={[styles.viewModeText, resourceViewMode === 'grid' && { color: colors.cream }]}>
                            Grid
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.viewModeButton, resourceViewMode === 'list' && { backgroundColor: colors.olive }]}
                        onPress={() => setResourceViewMode('list')}
                    >
                        <Text style={[styles.viewModeText, resourceViewMode === 'list' && { color: colors.cream }]}>
                            List
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Resources Grid/List */}
                <ScrollView style={styles.resourcesContainer}>
                    {resourceViewMode === 'grid' ? (
                        <View style={styles.resourcesGrid}>
                            {filteredResources.map(resource => (
                                <TouchableOpacity
                                    key={resource.id}
                                    style={[styles.resourceCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleDownloadResource(resource)}
                                >
                                    <View style={styles.resourceCardHeader}>
                                        <Text style={[styles.resourceCardIcon, { color: colors.emerald }]}>
                                            {getCategoryIcon(resource.category)}
                                        </Text>
                                        <Text style={[styles.resourceCardCategory, { color: colors.olive }]}>
                                            {getCategoryLabel(resource.category)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.resourceCardTitle, { color: colors.text }]} numberOfLines={2}>
                                        {resource.title}
                                    </Text>
                                    <Text style={[styles.resourceCardDescription, { color: colors.olive }]} numberOfLines={3}>
                                        {resource.description}
                                    </Text>
                                    <View style={styles.resourceCardFooter}>
                                        <Text style={[styles.resourceCardAuthor, { color: colors.olive }]}>
                                            by @{resource.author}
                                        </Text>
                                        <Text style={[styles.resourceCardDownloads, { color: colors.olive }]}>
                                            📥 {resource.downloads}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.resourcesList}>
                            {filteredResources.map(resource => (
                                <TouchableOpacity
                                    key={resource.id}
                                    style={[styles.resourceListItem, { backgroundColor: colors.card }]}
                                    onPress={() => handleDownloadResource(resource)}
                                >
                                    <View style={styles.resourceListItemHeader}>
                                        <Text style={[styles.resourceListItemIcon, { color: colors.emerald }]}>
                                            {getCategoryIcon(resource.category)}
                                        </Text>
                                        <View style={styles.resourceListItemInfo}>
                                            <Text style={[styles.resourceListItemTitle, { color: colors.text }]}>
                                                {resource.title}
                                            </Text>
                                            <Text style={[styles.resourceListItemCategory, { color: colors.olive }]}>
                                                {getCategoryLabel(resource.category)} • by @{resource.author}
                                            </Text>
                                        </View>
                                        <Text style={[styles.resourceListItemDownloads, { color: colors.olive }]}>
                                            📥 {resource.downloads}
                                        </Text>
                                    </View>
                                    <Text style={[styles.resourceListItemDescription, { color: colors.olive }]} numberOfLines={2}>
                                        {resource.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {!joined && (
                    <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
                        <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Join Group</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Progress Tracker State
    const [groupProgress, setGroupProgress] = useState<GroupProgress>(MOCK_GROUP_PROGRESS);
    const [showMilestoneAnimation, setShowMilestoneAnimation] = useState(false);
    const [flameAnimation] = useState(new Animated.Value(1));

    // Progress Tracker Handlers
    const handleActivityRecord = (activityType: GroupActivity['type']) => {
        const now = Date.now();
        const lastActivity = groupProgress.lastActivityDate;
        const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);

        let newStreak = groupProgress.currentStreak;
        let newWeeklyActivity = [...groupProgress.weeklyActivity];

        // Reset streak if more than 48 hours have passed
        if (hoursSinceLastActivity > 48) {
            newStreak = 1;
        } else if (hoursSinceLastActivity > 24) {
            // Continue streak if within 24-48 hours
            newStreak = groupProgress.currentStreak + 1;
        }

        // Update weekly activity (shift array and add today's activity)
        newWeeklyActivity.shift();
        newWeeklyActivity.push(1);

        const newProgress: GroupProgress = {
            ...groupProgress,
            currentStreak: newStreak,
            lastActivityDate: now,
            weeklyActivity: newWeeklyActivity,
        };

        // Check for milestone (7 days)
        if (newStreak === 7 && !groupProgress.milestoneReached) {
            newProgress.milestoneReached = true;
            setShowMilestoneAnimation(true);
            // Trigger flame animation
            Animated.sequence([
                Animated.timing(flameAnimation, {
                    toValue: 1.3,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(flameAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            setTimeout(() => setShowMilestoneAnimation(false), 3000);
        }

        setGroupProgress(newProgress);
    };

    const renderProgressTab = () => {
        const getStreakMessage = () => {
            if (faithMode) {
                return groupProgress.currentStreak >= 7
                    ? "The fire is still burning! 🔥"
                    : `The fire is still burning 🔥 ${groupProgress.currentStreak} days in a row`;
            } else {
                return groupProgress.currentStreak >= 7
                    ? "This group is staying consistent! ✨"
                    : `This group is staying consistent ✨ ${groupProgress.currentStreak} days in a row`;
            }
        };

        const getEncouragementMessage = () => {
            if (faithMode) {
                return "Your circle is aligned in faith.";
            } else {
                return "You showed up — that matters.";
            }
        };

        return (
            <View style={styles.progressTab}>
                {/* Streak Display */}
                <View style={[styles.streakContainer, { backgroundColor: colors.card }]}>
                    <View style={styles.streakHeader}>
                        <Animated.Text
                            style={[
                                styles.streakIcon,
                                {
                                    color: colors.emerald,
                                    transform: [{ scale: flameAnimation }]
                                }
                            ]}
                        >
                            {faithMode ? '🔥' : '✨'}
                        </Animated.Text>
                        <Text style={[styles.streakTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Group Fire' : 'Group Momentum'}
                        </Text>
                    </View>

                    <Text style={[styles.streakMessage, { color: colors.text }]}>
                        {getStreakMessage()}
                    </Text>

                    <Text style={[styles.encouragementMessage, { color: colors.olive }]}>
                        {getEncouragementMessage()}
                    </Text>
                </View>

                {/* Weekly Activity Heatmap */}
                <View style={[styles.heatmapContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.heatmapTitle, { color: colors.emerald }]}>
                        Last 7 Days Activity
                    </Text>
                    <View style={styles.heatmapGrid}>
                        {groupProgress.weeklyActivity.map((activity, index) => {
                            const intensity = Math.min(activity / 4, 1); // Max 4 activities = full intensity
                            const daysAgo = 6 - index;
                            const dayLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

                            return (
                                <View key={index} style={styles.heatmapDay}>
                                    <View
                                        style={[
                                            styles.heatmapCell,
                                            {
                                                backgroundColor: `rgba(47, 119, 102, ${intensity * 0.3 + 0.1})`,
                                                borderColor: colors.olive,
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.heatmapCount, { color: colors.text }]}>
                                            {activity}
                                        </Text>
                                    </View>
                                    <Text style={[styles.heatmapLabel, { color: colors.olive }]}>
                                        {dayLabel}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Top Contributors */}
                <View style={[styles.contributorsContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.contributorsTitle, { color: colors.emerald }]}>
                        Top Contributors
                    </Text>
                    <View style={styles.contributorsList}>
                        {groupProgress.topContributors.map((username, index) => {
                            const member = MOCK_MEMBERS.find(m => m.username === username);
                            return (
                                <View key={username} style={styles.contributorItem}>
                                    <Image
                                        source={{ uri: member?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                        style={styles.contributorAvatar}
                                    />
                                    <Text style={[styles.contributorName, { color: colors.text }]}>
                                        @{username}
                                    </Text>
                                    {index === 0 && (
                                        <Text style={[styles.topContributorBadge, { color: colors.emerald }]}>
                                            {faithMode ? '🔥' : '⭐'}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Milestone Celebration */}
                {showMilestoneAnimation && (
                    <View style={styles.milestoneOverlay}>
                        <View style={[styles.milestoneCard, { backgroundColor: colors.card }]}>
                            <Text style={[styles.milestoneIcon, { color: colors.emerald }]}>
                                {faithMode ? '🔥' : '✨'}
                            </Text>
                            <Text style={[styles.milestoneTitle, { color: colors.emerald }]}>
                                {faithMode ? '7-Day Fire Milestone!' : '7-Day Consistency Milestone!'}
                            </Text>
                            <Text style={[styles.milestoneMessage, { color: colors.text }]}>
                                {faithMode
                                    ? 'Your group has been faithful for 7 days straight. The fire is burning bright!'
                                    : 'Your group has been consistent for 7 days straight. Keep the momentum going!'
                                }
                            </Text>
                        </View>
                    </View>
                )}

                {/* Test Activity Button */}
                {joined && (
                    <TouchableOpacity
                        style={[styles.testActivityButton, { backgroundColor: colors.emerald }]}
                        onPress={() => handleActivityRecord('checkin')}
                    >
                        <Text style={[styles.testActivityButtonText, { color: colors.cream }]}>
                            Record Test Activity
                        </Text>
                    </TouchableOpacity>
                )}

                {!joined && (
                    <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
                        <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Join Group</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Render
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Scripture Pin Board (Faith Mode) or Quote Board (Encouragement Mode) */}
            {renderScriptureBoard()}
            {renderQuoteBoard()}
            {/* Pin Modal */}
            <Modal visible={showPinModal} animationType="slide" transparent>
                <View style={styles.pinModalOverlay}>
                    <View style={styles.pinModalContent}>
                        <Text style={styles.pinModalTitle}>Pin New Scripture</Text>
                        <TextInput
                            style={styles.pinInput}
                            placeholder="Reference (e.g. John 3:16)"
                            value={newScripture.reference}
                            onChangeText={t => setNewScripture(s => ({ ...s, reference: t }))}
                        />
                        <TextInput
                            style={[styles.pinInput, { height: 60 }]}
                            placeholder="Full verse text"
                            value={newScripture.verse}
                            onChangeText={t => setNewScripture(s => ({ ...s, verse: t }))}
                            multiline
                        />
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                            <TouchableOpacity style={styles.cancelPinButton} onPress={() => setShowPinModal(false)}>
                                <Text style={styles.cancelPinButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.savePinButton} onPress={handlePinScripture}>
                                <Text style={styles.savePinButtonText}>Pin</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Banner */}
            <Image source={{ uri: GROUP_BANNER }} style={styles.banner} resizeMode="cover" />
            {/* Watermark */}
            <Text style={[styles.watermark, { color: faithMode ? colors.emerald : colors.olive }]}>{watermark}</Text>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.groupTitle, { color: colors.emerald }]}>
                    {groupName} {faithMode && <Text>✝️</Text>}
                </Text>
                <Text style={[styles.groupTopic, { color: colors.olive }]}>{groupTopic}</Text>
                {faithMode ? (
                    <Text style={[styles.bannerText, { color: colors.olive }]}>{scriptureBanner}</Text>
                ) : (
                    <Text style={[styles.bannerText, { color: colors.olive }]}>{encouragementTagline}</Text>
                )}
            </View>
            {/* Members */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersRow}>
                {MOCK_MEMBERS.map((m) => (
                    <View key={m.username} style={styles.member}>
                        <Image source={{ uri: m.avatar }} style={styles.avatar} />
                        <Text style={[styles.username, { color: colors.text }]}>@{m.username}</Text>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleBadge(m.role).bgColor }]}>
                            <Text style={[styles.roleBadgeText, { color: getRoleBadge(m.role).color }]}>
                                {getRoleBadge(m.role).text}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {/* Tabs */}
            <View style={styles.tabsRow}>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'chat' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('chat')}
                >
                    <Text style={[styles.tabText, tab === 'chat' && { color: colors.cream }]}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'prayer' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('prayer')}
                >
                    <Text style={[styles.tabText, tab === 'prayer' && { color: colors.cream }]}>Prayer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'checkin' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('checkin')}
                >
                    <Text style={[styles.tabText, tab === 'checkin' && { color: colors.cream }]}>Check-Ins</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'discipleship' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('discipleship')}
                >
                    <Text style={[styles.tabText, tab === 'discipleship' && { color: colors.cream }]}>
                        {faithMode ? 'Discipleship' : 'Growth Prompts'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'challenges' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('challenges')}
                >
                    <Text style={[styles.tabText, tab === 'challenges' && { color: colors.cream }]}>
                        Challenges
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'voice' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('voice')}
                >
                    <Text style={[styles.tabText, tab === 'voice' && { color: colors.cream }]}>Voice Room</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'resources' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('resources')}
                >
                    <Text style={[styles.tabText, tab === 'resources' && { color: colors.cream }]}>Resources</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'progress' && { backgroundColor: colors.olive }]}
                    onPress={() => setTab('progress')}
                >
                    <Text style={[styles.tabText, tab === 'progress' && { color: colors.cream }]}>Progress</Text>
                </TouchableOpacity>
            </View>
            {/* Tab Content */}
            <View style={styles.tabContent}>
                {tab === 'chat' && (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={80}
                    >
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.messageRow}>
                                    <Text style={[styles.messageUser, { color: colors.olive }]}>@{item.user}:</Text>
                                    <Text style={[styles.messageText, { color: colors.text }]}>{item.text}</Text>
                                </View>
                            )}
                            contentContainerStyle={{ paddingBottom: 16 }}
                            style={{ flex: 1 }}
                        />
                        {joined && (
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.cream, color: colors.text }]}
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Type a message... Use @username to tag."
                                    placeholderTextColor={colors.olive + '99'}
                                    onSubmitEditing={handleSend}
                                    returnKeyType="send"
                                />
                                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                    <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {!joined && (
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
                                <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Join Group</Text>
                            </TouchableOpacity>
                        )}
                    </KeyboardAvoidingView>
                )}
                {tab === 'prayer' && (
                    <View style={styles.prayerTab}>
                        <Text style={[styles.prayerText, { color: colors.olive }]}>Prayer requests and answered prayers will appear here.</Text>
                        <Text style={[styles.prayerHint, { color: colors.olive + '99' }]}>Feature coming soon: Add, pray, and encourage others.</Text>
                    </View>
                )}
                {tab === 'checkin' && (
                    <View style={styles.checkinTab}>
                        <Text style={[styles.checkinText, { color: colors.olive }]}>Weekly check-ins and progress tracking will appear here.</Text>
                        <Text style={[styles.checkinHint, { color: colors.olive + '99' }]}>Feature coming soon: Accountability, goals, and support.</Text>
                    </View>
                )}
                {tab === 'discipleship' && (
                    <View style={styles.discipleshipTab}>
                        {joined && (
                            <TouchableOpacity
                                style={[styles.newLessonButton, { backgroundColor: colors.emerald }]}
                                onPress={() => setShowNewLessonModal(true)}
                            >
                                <Text style={[styles.newLessonButtonText, { color: colors.cream }]}>
                                    {faithMode ? '✝️ New Spirit-led Lesson' : '🕊 New Growth Prompt'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <ScrollView style={styles.threadsList}>
                            {discipleshipThreads.map((thread) => (
                                renderThreadCard(thread)
                            ))}
                        </ScrollView>
                        {!joined && (
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
                                <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Join Group</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {tab === 'challenges' && (
                    <View style={styles.challengesTab}>
                        {joined && (
                            <TouchableOpacity
                                style={[styles.newChallengeButton, { backgroundColor: colors.emerald }]}
                                onPress={() => setShowNewChallengeModal(true)}
                            >
                                <Text style={[styles.newChallengeButtonText, { color: colors.cream }]}>
                                    {faithMode ? '✝️ New Challenge' : '🕊 New Challenge'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <ScrollView style={styles.challengesList}>
                            {groupChallenges.map((challenge) => (
                                renderChallengeCard(challenge)
                            ))}
                        </ScrollView>
                        {!joined && (
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
                                <Text style={{ color: colors.cream, fontWeight: 'bold' }}>Join Group</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {tab === 'voice' && renderVoiceRoom()}
                {tab === 'resources' && renderResourceTab()}
                {tab === 'progress' && renderProgressTab()}
            </View>
            {/* Leave group button */}
            {joined && (
                <TouchableOpacity style={styles.leaveButton} onPress={handleJoinLeave}>
                    <Text style={{ color: colors.olive, fontWeight: 'bold' }}>Leave Group</Text>
                </TouchableOpacity>
            )}

            {/* New Lesson Modal */}
            <Modal
                visible={showNewLessonModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'New Spirit-led Lesson' : 'New Growth Prompt'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowNewLessonModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '✝️ Lesson Title' : '🕊 Prompt Title'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "Enter your lesson title..."
                                : "Enter your growth prompt title..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newLesson.title}
                            onChangeText={(text) => setNewLesson(prev => ({ ...prev, title: text }))}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '📖 Teaching or Scripture-based Message' : '💡 Growth Message'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                                minHeight: 120,
                            }]}
                            placeholder={faithMode
                                ? "Share your teaching or scripture-based message..."
                                : "Share your growth message or insight..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newLesson.teaching}
                            onChangeText={(text) => setNewLesson(prev => ({ ...prev, teaching: text }))}
                            multiline
                            numberOfLines={6}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '🙏 Response Question' : '💭 Reflection Question'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "How is this speaking to you?"
                                : "What truth is this unlocking for you?"
                            }
                            placeholderTextColor={colors.olive}
                            value={newLesson.question}
                            onChangeText={(text) => setNewLesson(prev => ({ ...prev, question: text }))}
                        />
                    </ScrollView>

                    <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={() => setShowNewLessonModal(false)}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: colors.emerald }]}
                            onPress={handlePostLesson}
                        >
                            <Text style={[styles.postButtonText, { color: colors.cream }]}>
                                {faithMode ? 'Post Lesson' : 'Post Prompt'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Thread Response Modal */}
            <Modal
                visible={showThreadModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Spirit-led Lesson' : 'Growth Prompt'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowThreadModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {selectedThread && (
                            <>
                                <View style={styles.threadDetailHeader}>
                                    <Text style={[styles.threadDetailTitle, { color: colors.emerald }]}>
                                        {faithMode && selectedThread.title.includes('Spirit-led') ? '✝️ ' : ''}{selectedThread.title}
                                    </Text>
                                    <Text style={[styles.threadDetailAuthor, { color: colors.olive }]}>
                                        by @{selectedThread.author} • {formatTime(selectedThread.timestamp)}
                                    </Text>
                                </View>

                                <View style={[styles.threadDetailTeaching, { backgroundColor: colors.sand }]}>
                                    <Text style={[styles.threadDetailTeachingText, { color: colors.text }]}>
                                        {selectedThread.teaching}
                                    </Text>
                                </View>

                                <View style={[styles.threadDetailQuestion, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.threadDetailQuestionText, { color: colors.emerald }]}>
                                        {selectedThread.question}
                                    </Text>
                                </View>

                                <Text style={[styles.responsesTitle, { color: colors.emerald }]}>
                                    Responses ({selectedThread.responses.length})
                                </Text>

                                {selectedThread.responses.map((response) => (
                                    <View key={response.id} style={[styles.responseCard, { backgroundColor: colors.card }]}>
                                        <View style={styles.responseHeader}>
                                            <Text style={[styles.responseAuthor, { color: colors.olive }]}>
                                                @{response.author}
                                            </Text>
                                            <Text style={[styles.responseTime, { color: colors.olive }]}>
                                                {formatTime(response.timestamp)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.responseText, { color: colors.text }]}>
                                            {response.text}
                                        </Text>
                                    </View>
                                ))}

                                {joined && (
                                    <View style={styles.responseInputContainer}>
                                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                                            {faithMode ? '🙏 Your Response' : '💭 Your Reflection'}
                                        </Text>
                                        <TextInput
                                            style={[styles.textArea, {
                                                backgroundColor: colors.card,
                                                color: colors.text,
                                                borderColor: colors.olive,
                                            }]}
                                            placeholder={faithMode
                                                ? "Share how this lesson speaks to you..."
                                                : "Share what truth this unlocks for you..."
                                            }
                                            placeholderTextColor={colors.olive}
                                            value={threadResponse}
                                            onChangeText={setThreadResponse}
                                            multiline
                                            numberOfLines={3}
                                        />
                                        <TouchableOpacity
                                            style={[styles.postResponseButton, { backgroundColor: colors.emerald }]}
                                            onPress={handlePostResponse}
                                        >
                                            <Text style={[styles.postResponseButtonText, { color: colors.cream }]}>
                                                {faithMode ? 'Post Response' : 'Post Reflection'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            {/* New Challenge Modal */}
            <Modal
                visible={showNewChallengeModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'New Challenge' : 'New Challenge'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowNewChallengeModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '✝️ Challenge Title' : '🕊 Challenge Title'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "Enter your challenge title..."
                                : "Enter your challenge title..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newChallenge.title}
                            onChangeText={(text) => setNewChallenge(prev => ({ ...prev, title: text }))}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '📝 Challenge Description' : '📝 Challenge Description'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                                minHeight: 80,
                            }]}
                            placeholder={faithMode
                                ? "Describe the challenge and its purpose..."
                                : "Describe the challenge and its purpose..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newChallenge.description}
                            onChangeText={(text) => setNewChallenge(prev => ({ ...prev, description: text }))}
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '💬 Challenge Prompt' : '💬 Challenge Prompt'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                                minHeight: 100,
                            }]}
                            placeholder={faithMode
                                ? "What is the prompt for this challenge?"
                                : "What is the prompt for this challenge?"
                            }
                            placeholderTextColor={colors.olive}
                            value={newChallenge.prompt}
                            onChangeText={(text) => setNewChallenge(prev => ({ ...prev, prompt: text }))}
                            multiline
                            numberOfLines={5}
                        />
                    </ScrollView>

                    <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={() => setShowNewChallengeModal(false)}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: colors.emerald }]}
                            onPress={handlePostChallenge}
                        >
                            <Text style={[styles.postButtonText, { color: colors.cream }]}>
                                {faithMode ? 'Post Challenge' : 'Post Challenge'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Challenge Response Modal */}
            <Modal
                visible={showChallengeResponseModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Challenge Response' : 'Challenge Response'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowChallengeResponseModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {selectedChallenge && (
                            <>
                                <View style={styles.challengeDetailHeader}>
                                    <Text style={[styles.challengeDetailTitle, { color: colors.emerald }]}>
                                        {faithMode && selectedChallenge.title.includes('Challenge') ? '✝️ ' : ''}{selectedChallenge.title}
                                    </Text>
                                    <Text style={[styles.challengeDetailAuthor, { color: colors.olive }]}>
                                        by @{selectedChallenge.author} • {formatTime(selectedChallenge.timestamp)}
                                    </Text>
                                </View>

                                <View style={[styles.challengeDetailDescription, { backgroundColor: colors.sand }]}>
                                    <Text style={[styles.challengeDetailDescriptionText, { color: colors.text }]}>
                                        {selectedChallenge.description}
                                    </Text>
                                </View>

                                <View style={[styles.challengeDetailPrompt, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.challengeDetailPromptText, { color: colors.emerald }]}>
                                        {selectedChallenge.prompt}
                                    </Text>
                                </View>

                                <Text style={[styles.responsesTitle, { color: colors.emerald }]}>
                                    Responses ({selectedChallenge.responses.length})
                                </Text>

                                {selectedChallenge.responses.map((response) => (
                                    <View key={response.id} style={[styles.responseCard, { backgroundColor: colors.card }]}>
                                        <View style={styles.responseHeader}>
                                            <Text style={[styles.responseAuthor, { color: colors.olive }]}>
                                                @{response.author}
                                            </Text>
                                            <Text style={[styles.responseTime, { color: colors.olive }]}>
                                                {formatTime(response.timestamp)}
                                            </Text>
                                        </View>
                                        {response.type === 'text' ? (
                                            <Text style={[styles.responseText, { color: colors.text }]}>
                                                {response.text}
                                            </Text>
                                        ) : (
                                            <View style={styles.videoResponseContainer}>
                                                <Text style={[styles.responseText, { color: colors.text }]}>
                                                    Video Response:
                                                </Text>
                                                <TouchableOpacity onPress={() => Alert.alert('Video Response', `Video URI: ${response.videoUri}`)}>
                                                    <Text style={[styles.responseText, { color: colors.olive, textDecorationLine: 'underline' }]}>
                                                        View Video
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                ))}

                                {joined && (
                                    <View style={styles.responseInputContainer}>
                                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                                            {faithMode ? '💬 Your Response' : '💬 Your Response'}
                                        </Text>
                                        <View style={styles.responseTypeSelection}>
                                            <TouchableOpacity
                                                style={[styles.responseTypeButton, challengeResponseType === 'text' && { backgroundColor: colors.olive }]}
                                                onPress={() => setChallengeResponseType('text')}
                                            >
                                                <Text style={[styles.responseTypeButtonText, challengeResponseType === 'text' && { color: colors.cream }]}>
                                                    Text
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.responseTypeButton, challengeResponseType === 'video' && { backgroundColor: colors.olive }]}
                                                onPress={() => setChallengeResponseType('video')}
                                            >
                                                <Text style={[styles.responseTypeButtonText, challengeResponseType === 'video' && { color: colors.cream }]}>
                                                    Video
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput
                                            style={[styles.textArea, {
                                                backgroundColor: colors.card,
                                                color: colors.text,
                                                borderColor: colors.olive,
                                            }]}
                                            placeholder={faithMode
                                                ? "Share your response to this challenge..."
                                                : "Share your response to this challenge..."
                                            }
                                            placeholderTextColor={colors.olive}
                                            value={challengeResponse}
                                            onChangeText={setChallengeResponse}
                                            multiline
                                            numberOfLines={3}
                                        />
                                        <TouchableOpacity
                                            style={[styles.postResponseButton, { backgroundColor: colors.emerald }]}
                                            onPress={handlePostChallengeResponse}
                                        >
                                            <Text style={[styles.postResponseButtonText, { color: colors.cream }]}>
                                                {faithMode ? 'Post Response' : 'Post Response'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            {/* New Resource Modal */}
            <Modal
                visible={showNewResourceModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? '✝️ Add Resource' : '🕊 Add Resource'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowNewResourceModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            Resource Title
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode ? "Enter resource title..." : "Enter resource title..."}
                            placeholderTextColor={colors.olive}
                            value={newResource.title}
                            onChangeText={(text) => setNewResource(prev => ({ ...prev, title: text }))}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            Description
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                                minHeight: 80,
                            }]}
                            placeholder={faithMode ? "Describe the resource..." : "Describe the resource..."}
                            placeholderTextColor={colors.olive}
                            value={newResource.description}
                            onChangeText={(text) => setNewResource(prev => ({ ...prev, description: text }))}
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            File URL
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder="https://example.com/resource.pdf"
                            placeholderTextColor={colors.olive}
                            value={newResource.fileUrl}
                            onChangeText={(text) => setNewResource(prev => ({ ...prev, fileUrl: text }))}
                        />

                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            Category
                        </Text>
                        <View style={styles.categorySelection}>
                            {(faithMode ? FAITH_RESOURCE_CATEGORIES : ENCOURAGEMENT_RESOURCE_CATEGORIES).map(category => (
                                <TouchableOpacity
                                    key={category.key}
                                    style={[
                                        styles.categoryOption,
                                        newResource.category === category.key && { backgroundColor: colors.emerald }
                                    ]}
                                    onPress={() => setNewResource(prev => ({ ...prev, category: category.key as any }))}
                                >
                                    <Text style={[
                                        styles.categoryOptionText,
                                        newResource.category === category.key && { color: colors.cream }
                                    ]}>
                                        {category.icon} {category.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={() => setShowNewResourceModal(false)}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: colors.emerald }]}
                            onPress={handlePostResource}
                        >
                            <Text style={[styles.postButtonText, { color: colors.cream }]}>
                                Post Resource
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    banner: {
        width: '100%',
        height: 120,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    watermark: {
        position: 'absolute',
        top: 24,
        right: 24,
        fontSize: 48,
        opacity: 0.08,
        zIndex: 0,
    },
    header: {
        alignItems: 'center',
        marginTop: -40,
        marginBottom: 8,
        zIndex: 1,
    },
    groupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    groupTopic: {
        fontSize: 16,
        fontFamily: 'Quicksand_400Regular',
        marginBottom: 4,
    },
    bannerText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 8,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    membersRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
        marginTop: 4,
    },
    member: {
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 4,
    },
    username: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    roleBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 2,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    roleBadgeText: {
        fontSize: 8,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
        textAlign: 'center',
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
        paddingHorizontal: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 2,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: '#F5E6DC',
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    tabContent: {
        flex: 1,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    messageUser: {
        fontWeight: 'bold',
        marginRight: 6,
        fontFamily: 'Nunito_700SemiBold',
    },
    messageText: {
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        flexShrink: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#2F7766',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    joinButton: {
        backgroundColor: '#2F7766',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    leaveButton: {
        backgroundColor: '#F5E6DC',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        margin: 12,
    },
    prayerTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    prayerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    prayerHint: {
        fontSize: 14,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    checkinTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    checkinText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    checkinHint: {
        fontSize: 14,
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
    },
    discipleshipTab: {
        flex: 1,
    },
    newLessonButton: {
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    newLessonButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    threadsList: {
        flex: 1,
    },
    threadCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    threadHeader: {
        marginBottom: 8,
    },
    threadTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    threadAuthor: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    threadTeaching: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    threadFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: 8,
    },
    threadQuestion: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    threadResponses: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    challengesTab: {
        flex: 1,
    },
    newChallengeButton: {
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    newChallengeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    challengesList: {
        flex: 1,
    },
    challengeCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    challengeHeader: {
        marginBottom: 8,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    challengeAuthor: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    challengeDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    challengeFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: 8,
    },
    challengePrompt: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    challengeResponses: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    // Role Badge Styles
    roleBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 2,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    roleBadgeText: {
        fontSize: 8,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
        textAlign: 'center',
    },
    scriptureBoard: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 12,
        gap: 12,
    },
    scriptureCard: {
        backgroundColor: '#fffbe6',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        minWidth: 220,
        maxWidth: 260,
        shadowColor: '#FFB300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'flex-start',
    },
    scriptureReference: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#b8860b',
        marginBottom: 4,
    },
    scriptureVerse: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    scripturePostedBy: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    unpinButton: {
        alignSelf: 'flex-end',
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#ffe0b2',
        borderRadius: 8,
    },
    unpinButtonText: {
        color: '#b8860b',
        fontWeight: 'bold',
        fontSize: 12,
    },
    pinNewButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fffbe6',
        borderRadius: 12,
        padding: 16,
        minWidth: 120,
        borderWidth: 1,
        borderColor: '#ffe0b2',
    },
    pinNewButtonText: {
        color: '#b8860b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    pinModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinModalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: 320,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    pinModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#b8860b',
    },
    pinInput: {
        borderWidth: 1,
        borderColor: '#ffe0b2',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        backgroundColor: '#fffbe6',
        color: '#333',
    },
    cancelPinButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    cancelPinButtonText: {
        color: '#888',
        fontWeight: 'bold',
    },
    savePinButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#b8860b',
        alignItems: 'center',
    },
    savePinButtonText: {
        color: '#fffbe6',
        fontWeight: 'bold',
    },
    voiceRoomContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f7faff',
        borderRadius: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    voiceRoomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    voiceRoomTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2F7766',
    },
    voiceRoomStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    voiceRoomPrompt: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
        textAlign: 'center',
    },
    voiceRoomTagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    voiceRoomTag: {
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
    },
    voiceRoomTagText: {
        color: '#2F7766',
        fontWeight: 'bold',
        fontSize: 12,
    },
    voiceRoomBubblesRow: {
        flexDirection: 'row',
        marginBottom: 16,
        minHeight: 80,
    },
    voiceRoomBubbleContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    voiceRoomBubble: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#2F7766',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    voiceRoomBubbleSpeaking: {
        borderColor: '#FFB300',
        shadowColor: '#FFB300',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
    },
    voiceRoomAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    voiceRoomMuted: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        fontSize: 16,
        color: '#aaa',
    },
    voiceRoomName: {
        fontSize: 12,
        color: '#2F7766',
        textAlign: 'center',
    },
    voiceRoomControls: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
        alignItems: 'center',
    },
    voiceRoomMicButton: {
        backgroundColor: '#e0f7fa',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    voiceRoomMicIcon: {
        fontSize: 24,
        marginBottom: 2,
    },
    voiceRoomMicLabel: {
        fontSize: 12,
        color: '#2F7766',
    },
    voiceRoomExitButton: {
        backgroundColor: '#ffe0b2',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    voiceRoomExitText: {
        color: '#b8860b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    voiceRoomJoinButton: {
        backgroundColor: '#2F7766',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    voiceRoomJoinText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    prayNowAnim: {
        marginTop: 16,
        backgroundColor: '#fffbe6',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#FFB300',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    prayNowAnimText: {
        color: '#FFB300',
        fontWeight: 'bold',
        fontSize: 18,
    },
    reactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 12,
    },
    reactionButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    reactionButtonActive: {
        backgroundColor: '#2F7766',
    },
    reactionEmoji: {
        fontSize: 20,
    },
    reactionCount: {
        fontSize: 12,
        marginTop: 2,
    },
    commentsSection: {
        marginTop: 16,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    commentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    addCommentButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: '#e0f7fa',
    },
    addCommentText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    commentInput: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minHeight: 50,
    },
    postCommentButton: {
        backgroundColor: '#2F7766',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
    },
    postCommentText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentsList: {
        //
    },
    commentCard: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    replyCard: {
        marginLeft: 40, // Indent for replies
        backgroundColor: '#f0f0f0',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    commentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    commentInfo: {
        flex: 1,
    },
    commentAuthor: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Nunito_600SemiBold',
    },
    commentTime: {
        fontSize: 11,
        color: '#888',
        fontFamily: 'Quicksand_400Regular',
    },
    commentTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 8,
    },
    commentTagText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: 'Quicksand_400Regular',
    },
    commentReactions: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    commentReaction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    commentReactionEmoji: {
        fontSize: 18,
    },
    commentReactionCount: {
        fontSize: 12,
        marginLeft: 4,
    },
    replyButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#e0f7fa',
        borderRadius: 10,
    },
    replyButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    replyInputContainer: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    replyInput: {
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        minHeight: 50,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    replyActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelReplyButton: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    cancelReplyText: {
        color: '#888',
        fontWeight: 'bold',
    },
    postReplyButton: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#2F7766',
        alignItems: 'center',
    },
    postReplyText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    repliesContainer: {
        marginTop: 12,
    },
    resourceTab: {
        flex: 1,
        padding: 16,
    },
    resourceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resourceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    addResourceButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    addResourceButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    categoryFilter: {
        marginBottom: 16,
    },
    categoryFilterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    categoryFilterText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    sortOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sortLabel: {
        fontSize: 14,
        marginRight: 8,
        fontFamily: 'Quicksand_400Regular',
    },
    sortButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    sortButtonText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    viewModeToggle: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    resourcesContainer: {
        flex: 1,
    },
    resourcesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    resourceCard: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resourceCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    resourceCardIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    resourceCardCategory: {
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    resourceCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    resourceCardDescription: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 8,
        fontFamily: 'Quicksand_400Regular',
    },
    resourceCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resourceCardAuthor: {
        fontSize: 10,
        fontFamily: 'Quicksand_400Regular',
    },
    resourceCardDownloads: {
        fontSize: 10,
        fontFamily: 'Quicksand_400Regular',
    },
    resourcesList: {
        gap: 12,
    },
    resourceListItem: {
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resourceListItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    resourceListItemIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    resourceListItemInfo: {
        flex: 1,
    },
    resourceListItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
        fontFamily: 'Nunito_600SemiBold',
    },
    resourceListItemCategory: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    resourceListItemDownloads: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    resourceListItemDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    categorySelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    categoryOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    categoryOptionText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    progressTab: {
        flex: 1,
        padding: 16,
    },
    streakContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    streakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    streakIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    streakTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    streakMessage: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        fontFamily: 'Quicksand_400Regular',
    },
    encouragementMessage: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Quicksand_400Regular',
    },
    heatmapContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    heatmapTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    heatmapGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heatmapDay: {
        alignItems: 'center',
    },
    heatmapCell: {
        width: 20,
        height: 20,
        borderRadius: 4,
        marginBottom: 4,
    },
    heatmapCount: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    heatmapLabel: {
        fontSize: 10,
        color: '#888',
        fontFamily: 'Quicksand_400Regular',
    },
    contributorsContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    contributorsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    contributorsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contributorItem: {
        alignItems: 'center',
    },
    contributorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 4,
    },
    contributorName: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
    },
    topContributorBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#2F7766',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    milestoneOverlay: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fffbe6',
    },
    milestoneCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    milestoneIcon: {
        fontSize: 24,
        marginBottom: 8,
        color: '#FFB300',
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Nunito_700SemiBold',
    },
    milestoneMessage: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'Quicksand_400Regular',
    },
    testActivityButton: {
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    testActivityButtonText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
}); 