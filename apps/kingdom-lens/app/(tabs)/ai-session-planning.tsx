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
    Image,
    Dimensions,
} from 'react-native';
import { useFaithMode } from '../../hooks/useFaithMode';
import { LightTheme, FaithModeTheme, EncouragementModeTheme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface LocationRecommendation {
    id: string;
    name: string;
    address: string;
    type: 'Outdoor' | 'Indoor' | 'Studio' | 'Urban' | 'Nature';
    lighting: 'Golden Hour' | 'Blue Hour' | 'Overcast' | 'Studio' | 'Mixed';
    weather: string;
    distance: string;
    rating: number;
    images: string[];
    bestTime: string;
    notes: string;
}

interface PoseSuggestion {
    id: string;
    name: string;
    category: 'Portrait' | 'Couple' | 'Family' | 'Wedding' | 'Commercial';
    bodyType: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    image: string;
    tips: string[];
}

interface EquipmentRecommendation {
    id: string;
    lens: string;
    settings: string;
    lighting: string;
    accessories: string[];
    reasoning: string;
    estimatedCost: string;
}

interface DivineTiming {
    id: string;
    date: string;
    time: string;
    spiritualSignificance: string;
    weatherForecast: string;
    lightingConditions: string;
    prayerPrompt: string;
    scripture: string;
}

export default function AISessionPlanningScreen() {
    const { faithMode, encouragementMode } = useFaithMode();
    const theme = LightTheme;
    const faithTheme = faithMode ? FaithModeTheme : EncouragementModeTheme;

    const [activeTab, setActiveTab] = useState<'locations' | 'poses' | 'equipment' | 'timing'>('locations');
    const [selectedClient, setSelectedClient] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [clientPreferences, setClientPreferences] = useState('');

    // Mock data for AI recommendations
    const [locationRecommendations, setLocationRecommendations] = useState<LocationRecommendation[]>([
        {
            id: '1',
            name: 'Sunset Beach Park',
            address: '123 Coastal Blvd, Beach City',
            type: 'Outdoor',
            lighting: 'Golden Hour',
            weather: 'Clear, 75°F',
            distance: '2.3 miles',
            rating: 4.8,
            images: ['https://example.com/beach1.jpg'],
            bestTime: '6:00-7:30 PM',
            notes: 'Perfect for golden hour portraits with ocean backdrop'
        },
        {
            id: '2',
            name: 'Downtown Urban Walls',
            address: '456 Main St, Downtown',
            type: 'Urban',
            lighting: 'Mixed',
            weather: 'Partly Cloudy, 72°F',
            distance: '1.1 miles',
            rating: 4.5,
            images: ['https://example.com/urban1.jpg'],
            bestTime: '3:00-5:00 PM',
            notes: 'Great for edgy, modern portraits with street art'
        },
        {
            id: '3',
            name: 'Botanical Gardens',
            address: '789 Garden Ave, Nature District',
            type: 'Nature',
            lighting: 'Overcast',
            weather: 'Light Rain, 68°F',
            distance: '4.2 miles',
            rating: 4.9,
            images: ['https://example.com/garden1.jpg'],
            bestTime: '10:00 AM-2:00 PM',
            notes: 'Lush greenery with natural diffused lighting'
        }
    ]);

    const [poseSuggestions, setPoseSuggestions] = useState<PoseSuggestion[]>([
        {
            id: '1',
            name: 'Natural Walking Pose',
            category: 'Portrait',
            bodyType: ['All Types'],
            difficulty: 'Beginner',
            description: 'Casual walking pose with natural movement',
            image: 'https://example.com/pose1.jpg',
            tips: ['Have client walk naturally', 'Capture mid-stride', 'Keep hands relaxed']
        },
        {
            id: '2',
            name: 'Intimate Couple Embrace',
            category: 'Couple',
            bodyType: ['All Types'],
            difficulty: 'Intermediate',
            description: 'Close embrace with foreheads touching',
            image: 'https://example.com/pose2.jpg',
            tips: ['Guide them to close their eyes', 'Focus on connection', 'Capture genuine emotion']
        },
        {
            id: '3',
            name: 'Family Circle',
            category: 'Family',
            bodyType: ['All Types'],
            difficulty: 'Beginner',
            description: 'Family sitting in a circle formation',
            image: 'https://example.com/pose3.jpg',
            tips: ['Arrange by height', 'Include pets if present', 'Capture candid moments']
        }
    ]);

    const [equipmentRecommendations, setEquipmentRecommendations] = useState<EquipmentRecommendation[]>([
        {
            id: '1',
            lens: '85mm f/1.4',
            settings: 'f/1.4, 1/200s, ISO 100',
            lighting: 'Natural + Reflector',
            accessories: ['Reflector', 'Diffuser', 'Tripod'],
            reasoning: 'Perfect for portrait work with beautiful bokeh',
            estimatedCost: '$1,200'
        },
        {
            id: '2',
            lens: '24-70mm f/2.8',
            settings: 'f/2.8, 1/125s, ISO 200',
            lighting: 'Natural + LED Panel',
            accessories: ['LED Panel', 'Softbox', 'Remote Trigger'],
            reasoning: 'Versatile zoom for various shooting scenarios',
            estimatedCost: '$2,100'
        }
    ]);

    const [divineTiming, setDivineTiming] = useState<DivineTiming[]>([
        {
            id: '1',
            date: '2024-01-15',
            time: '6:30 PM',
            spiritualSignificance: 'Golden hour aligns with Psalm 19:1 - "The heavens declare the glory of God"',
            weatherForecast: 'Clear skies, perfect for golden hour',
            lightingConditions: 'Warm, diffused light ideal for portraits',
            prayerPrompt: 'Pray for God\'s light to shine through your lens',
            scripture: 'Psalm 19:1'
        },
        {
            id: '2',
            date: '2024-01-16',
            time: '10:00 AM',
            spiritualSignificance: 'Morning light represents new beginnings and hope',
            weatherForecast: 'Partly cloudy with soft light',
            lightingConditions: 'Soft, even lighting perfect for family sessions',
            prayerPrompt: 'Ask for wisdom to capture each family\'s unique story',
            scripture: 'Lamentations 3:23'
        }
    ]);

    const getScreenTitle = () => {
        if (faithMode) {
            return 'Divine Session Planning';
        } else if (encouragementMode) {
            return 'AI Session Planning';
        }
        return 'Smart Session Planning';
    };

    const getScreenSubtitle = () => {
        if (faithMode) {
            return 'Let AI guide your sessions with Kingdom wisdom';
        } else if (encouragementMode) {
            return 'AI-powered planning for perfect sessions';
        }
        return 'Intelligent session planning with AI assistance';
    };

    const renderLocationCard = ({ item }: { item: LocationRecommendation }) => (
        <View style={[styles.recommendationCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={styles.ratingContainer}>
                    <Text style={[styles.rating, { color: theme.colors.primary }]}>
                        ⭐ {item.rating}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                📍 {item.address}
            </Text>

            <View style={styles.tagContainer}>
                <View style={[styles.tag, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.tagText, { color: theme.colors.surface }]}>
                        {item.type}
                    </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: theme.colors.success }]}>
                    <Text style={[styles.tagText, { color: theme.colors.surface }]}>
                        {item.lighting}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                🌤️ {item.weather} • 📏 {item.distance}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                ⏰ Best Time: {item.bestTime}
            </Text>
            <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                💡 {item.notes}
            </Text>

            <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => Alert.alert('Selected', `Location: ${item.name}`)}
            >
                <Text style={[styles.selectButtonText, { color: theme.colors.surface }]}>
                    Select Location
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderPoseCard = ({ item }: { item: PoseSuggestion }) => (
        <View style={[styles.recommendationCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                    <Text style={[styles.difficultyText, { color: theme.colors.surface }]}>
                        {item.difficulty}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                📸 {item.category} • 👥 {item.bodyType.join(', ')}
            </Text>

            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
            </Text>

            <View style={styles.tipsContainer}>
                <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
                    💡 Tips:
                </Text>
                {item.tips.map((tip, index) => (
                    <Text key={index} style={[styles.tip, { color: theme.colors.textSecondary }]}>
                        • {tip}
                    </Text>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => Alert.alert('Selected', `Pose: ${item.name}`)}
            >
                <Text style={[styles.selectButtonText, { color: theme.colors.surface }]}>
                    Use This Pose
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderEquipmentCard = ({ item }: { item: EquipmentRecommendation }) => (
        <View style={[styles.recommendationCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.lens}
                </Text>
                <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                    💰 {item.estimatedCost}
                </Text>
            </View>

            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                ⚙️ Settings: {item.settings}
            </Text>
            <Text style={[styles.cardInfo, { color: theme.colors.textSecondary }]}>
                💡 Lighting: {item.lighting}
            </Text>

            <View style={styles.accessoriesContainer}>
                <Text style={[styles.accessoriesTitle, { color: theme.colors.text }]}>
                    🎒 Accessories:
                </Text>
                {item.accessories.map((accessory, index) => (
                    <Text key={index} style={[styles.accessory, { color: theme.colors.textSecondary }]}>
                        • {accessory}
                    </Text>
                ))}
            </View>

            <Text style={[styles.cardNotes, { color: theme.colors.textSecondary }]}>
                💭 {item.reasoning}
            </Text>

            <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => Alert.alert('Selected', `Equipment: ${item.lens}`)}
            >
                <Text style={[styles.selectButtonText, { color: theme.colors.surface }]}>
                    Select Equipment
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderDivineTimingCard = ({ item }: { item: DivineTiming }) => (
        <View style={[styles.recommendationCard, { backgroundColor: faithTheme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: faithTheme.colors.text }]}>
                    {item.date} at {item.time}
                </Text>
                <View style={[styles.divineBadge, { backgroundColor: faithTheme.colors.primary }]}>
                    <Text style={[styles.divineText, { color: faithTheme.colors.surface }]}>
                        ✨ Divine Timing
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardSubtitle, { color: faithTheme.colors.textSecondary }]}>
                🌟 {item.spiritualSignificance}
            </Text>

            <Text style={[styles.cardInfo, { color: faithTheme.colors.textSecondary }]}>
                🌤️ {item.weatherForecast}
            </Text>
            <Text style={[styles.cardInfo, { color: faithTheme.colors.textSecondary }]}>
                💡 {item.lightingConditions}
            </Text>

            <View style={styles.prayerContainer}>
                <Text style={[styles.prayerTitle, { color: faithTheme.colors.text }]}>
                    🙏 Prayer Prompt:
                </Text>
                <Text style={[styles.prayerText, { color: faithTheme.colors.textSecondary }]}>
                    {item.prayerPrompt}
                </Text>
            </View>

            <Text style={[styles.scriptureText, { color: faithTheme.colors.primary }]}>
                📖 {item.scripture}
            </Text>

            <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: faithTheme.colors.primary }]}
                onPress={() => Alert.alert('Selected', `Divine Timing: ${item.date} at ${item.time}`)}
            >
                <Text style={[styles.selectButtonText, { color: faithTheme.colors.surface }]}>
                    Choose This Time
                </Text>
            </TouchableOpacity>
        </View>
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return theme.colors.success;
            case 'Intermediate':
                return theme.colors.warning;
            case 'Advanced':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'locations':
                return (
                    <FlatList
                        data={locationRecommendations}
                        renderItem={renderLocationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'poses':
                return (
                    <FlatList
                        data={poseSuggestions}
                        renderItem={renderPoseCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'equipment':
                return (
                    <FlatList
                        data={equipmentRecommendations}
                        renderItem={renderEquipmentCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                );
            case 'timing':
                return faithMode ? (
                    <FlatList
                        data={divineTiming}
                        renderItem={renderDivineTimingCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                            Divine timing recommendations are available in Faith Mode
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {getScreenTitle()}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    {getScreenSubtitle()}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'locations' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('locations')}
                    >
                        <Text style={[styles.tabText, activeTab === 'locations' && { color: theme.colors.surface }]}>
                            📍 Locations
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'poses' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('poses')}
                    >
                        <Text style={[styles.tabText, activeTab === 'poses' && { color: theme.colors.surface }]}>
                            📸 Poses
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'equipment' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setActiveTab('equipment')}
                    >
                        <Text style={[styles.tabText, activeTab === 'equipment' && { color: theme.colors.surface }]}>
                            📷 Equipment
                        </Text>
                    </TouchableOpacity>
                    {faithMode && (
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'timing' && { backgroundColor: faithTheme.colors.primary }]}
                            onPress={() => setActiveTab('timing')}
                        >
                            <Text style={[styles.tabText, activeTab === 'timing' && { color: faithTheme.colors.surface }]}>
                                ✨ Divine Timing
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    recommendationCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    cardSubtitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    },
    cardInfo: {
        fontSize: 13,
        marginBottom: 5,
    },
    cardNotes: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 15,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ratingContainer: {
        alignItems: 'flex-end',
    },
    rating: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divineBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    divineText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tipsContainer: {
        marginBottom: 15,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tip: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    accessoriesContainer: {
        marginBottom: 15,
    },
    accessoriesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    accessory: {
        fontSize: 13,
        marginBottom: 3,
        paddingLeft: 10,
    },
    prayerContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
    },
    prayerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    prayerText: {
        fontSize: 13,
        lineHeight: 18,
    },
    scriptureText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    selectButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
}); 