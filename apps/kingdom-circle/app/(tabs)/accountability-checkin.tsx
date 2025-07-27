import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from 'packages/hooks/useFaithMode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CheckIn {
    id: string;
    date: string;
    mood: number;
    wins: string;
    workingOn: string;
    prayerRequest?: string;
    declaration?: string;
    spiritualReflection?: string;
    godSpoke?: string;
    timestamp: number;
}

interface WeekData {
    date: string;
    mood: number;
    hasCheckIn: boolean;
    emoji: string;
}

export default function AccountabilityCheckInScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { faithMode, encouragementMode } = useFaithMode();

    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null);
    const [showNewCheckInModal, setShowNewCheckInModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [newCheckIn, setNewCheckIn] = useState({
        mood: 5,
        wins: '',
        workingOn: '',
        prayerRequest: '',
        declaration: '',
        spiritualReflection: '',
        godSpoke: '',
    });
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(0));

    // Mock data for testing
    useEffect(() => {
        const mockCheckIns: CheckIn[] = [
            {
                id: '1',
                date: new Date().toISOString().split('T')[0],
                mood: 8,
                wins: 'Completed my morning routine and finished the project proposal.',
                workingOn: 'Still working on time management and reducing screen time.',
                prayerRequest: 'Praying for wisdom in my new role at work.',
                spiritualReflection: 'Spent 20 minutes in prayer and felt God\'s peace.',
                godSpoke: 'He reminded me that I am enough and He is with me.',
                timestamp: Date.now() - 86400000,
            },
            {
                id: '2',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                mood: 7,
                wins: 'Had a great conversation with my mentor and made progress on my goals.',
                workingOn: 'Need to be more consistent with my daily reading.',
                declaration: 'I am capable, strong, and worthy of success.',
                timestamp: Date.now() - 172800000,
            },
            {
                id: '3',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                mood: 6,
                wins: 'Stayed positive despite challenges and helped a colleague.',
                workingOn: 'Working on setting better boundaries and saying no.',
                prayerRequest: 'Praying for patience and understanding in relationships.',
                spiritualReflection: 'Read my devotional and felt encouraged.',
                godSpoke: 'He showed me that my struggles are temporary.',
                timestamp: Date.now() - 259200000,
            },
        ];
        setCheckIns(mockCheckIns);
        loadCheckIns();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const loadCheckIns = async () => {
        try {
            const saved = await AsyncStorage.getItem('accountabilityCheckIns');
            if (saved) {
                const loadedCheckIns = JSON.parse(saved);
                setCheckIns(loadedCheckIns);

                // Check if today's check-in exists
                const today = new Date().toISOString().split('T')[0];
                const todayCheckIn = loadedCheckIns.find((ci: CheckIn) => ci.date === today);
                setTodayCheckIn(todayCheckIn || null);
            }
        } catch (error) {
            console.log('Error loading check-ins:', error);
        }
    };

    const saveCheckIns = async (checkInsData: CheckIn[]) => {
        try {
            await AsyncStorage.setItem('accountabilityCheckIns', JSON.stringify(checkInsData));
        } catch (error) {
            console.log('Error saving check-ins:', error);
        }
    };

    const handleSubmitCheckIn = () => {
        if (!newCheckIn.wins.trim() || !newCheckIn.workingOn.trim()) {
            Alert.alert('Missing Information', 'Please fill in your wins and what you\'re working on.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const newCheckInData: CheckIn = {
            id: Date.now().toString(),
            date: today,
            mood: newCheckIn.mood,
            wins: newCheckIn.wins,
            workingOn: newCheckIn.workingOn,
            prayerRequest: newCheckIn.prayerRequest || undefined,
            declaration: newCheckIn.declaration || undefined,
            spiritualReflection: faithMode ? newCheckIn.spiritualReflection : undefined,
            godSpoke: faithMode ? newCheckIn.godSpoke : undefined,
            timestamp: Date.now(),
        };

        setCheckIns(prev => {
            const updated = [newCheckInData, ...prev];
            saveCheckIns(updated);
            return updated;
        });

        setTodayCheckIn(newCheckInData);
        setNewCheckIn({
            mood: 5,
            wins: '',
            workingOn: '',
            prayerRequest: '',
            declaration: '',
            spiritualReflection: '',
            godSpoke: '',
        });
        setShowNewCheckInModal(false);
    };

    const getMoodEmoji = (mood: number) => {
        if (mood >= 8) return '😊';
        if (mood >= 6) return '🙂';
        if (mood >= 4) return '😐';
        if (mood >= 2) return '😔';
        return '😢';
    };

    const getStreak = () => {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            const hasCheckIn = checkIns.some(ci => ci.date === dateStr);
            if (hasCheckIn) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const getWeekData = (): WeekData[] => {
        const weekData: WeekData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            const checkIn = checkIns.find(ci => ci.date === dateStr);
            weekData.push({
                date: dateStr,
                mood: checkIn?.mood || 0,
                hasCheckIn: !!checkIn,
                emoji: checkIn ? getMoodEmoji(checkIn.mood) : '⚪',
            });
        }

        return weekData;
    };

    const getAverageMood = () => {
        if (checkIns.length === 0) return 0;
        const total = checkIns.reduce((sum, ci) => sum + ci.mood, 0);
        return Math.round(total / checkIns.length);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderMoodSlider = () => (
        <View style={styles.moodContainer}>
            <Text style={[styles.moodLabel, { color: colors.text }]}>
                {faithMode ? 'How did today go?' : 'How are you feeling today?'}
            </Text>
            <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <TouchableOpacity
                        key={value}
                        style={[
                            styles.sliderDot,
                            {
                                backgroundColor: newCheckIn.mood >= value ? colors.emerald : colors.olive,
                                opacity: newCheckIn.mood >= value ? 1 : 0.3,
                            },
                        ]}
                        onPress={() => setNewCheckIn(prev => ({ ...prev, mood: value }))}
                    >
                        <Text style={[styles.sliderText, { color: colors.cream }]}>
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={[styles.moodValue, { color: colors.emerald }]}>
                {newCheckIn.mood}/10 {getMoodEmoji(newCheckIn.mood)}
            </Text>
        </View>
    );

    const renderWeekView = () => {
        const weekData = getWeekData();

        return (
            <View style={[styles.weekContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.weekTitle, { color: colors.emerald }]}>
                    This Week
                </Text>
                <View style={styles.weekGrid}>
                    {weekData.map((day, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={[styles.dayLabel, { color: colors.olive }]}>
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </Text>
                            <Text style={[styles.dayEmoji, { fontSize: 20 }]}>
                                {day.hasCheckIn ? day.emoji : '⚪'}
                            </Text>
                            {day.hasCheckIn && (
                                <Text style={[styles.dayMood, { color: colors.emerald }]}>
                                    {day.mood}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderAnalytics = () => {
        const streak = getStreak();
        const averageMood = getAverageMood();
        const totalCheckIns = checkIns.length;

        return (
            <View style={[styles.analyticsContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.analyticsTitle, { color: colors.emerald }]}>
                    Your Progress
                </Text>
                <View style={styles.analyticsGrid}>
                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsValue, { color: colors.emerald }]}>
                            {streak}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                            Day Streak
                        </Text>
                    </View>
                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsValue, { color: colors.emerald }]}>
                            {totalCheckIns}
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                            Total Check-ins
                        </Text>
                    </View>
                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsValue, { color: colors.emerald }]}>
                            {averageMood}/10
                        </Text>
                        <Text style={[styles.analyticsLabel, { color: colors.olive }]}>
                            Avg Mood
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderCheckInCard = (checkIn: CheckIn) => (
        <Animated.View
            key={checkIn.id}
            style={[
                styles.checkInCard,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.olive,
                    opacity: fadeAnim,
                },
            ]}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardDate, { color: colors.emerald }]}>
                    {formatDate(checkIn.date)}
                </Text>
                <Text style={[styles.cardMood, { color: colors.emerald }]}>
                    {checkIn.mood}/10 {getMoodEmoji(checkIn.mood)}
                </Text>
            </View>

            <View style={styles.cardSection}>
                <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                    {faithMode ? '🙌 What did you win at?' : '🎉 What did you win at?'}
                </Text>
                <Text style={[styles.sectionText, { color: colors.text }]}>
                    {checkIn.wins}
                </Text>
            </View>

            <View style={styles.cardSection}>
                <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                    {faithMode ? '🔄 What are you still working on?' : '💪 What are you still working on?'}
                </Text>
                <Text style={[styles.sectionText, { color: colors.text }]}>
                    {checkIn.workingOn}
                </Text>
            </View>

            {checkIn.prayerRequest && (
                <View style={[styles.cardSection, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                        {faithMode ? '🙏 Prayer Request' : '💭 Reflection'}
                    </Text>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        {checkIn.prayerRequest}
                    </Text>
                </View>
            )}

            {checkIn.declaration && (
                <View style={[styles.cardSection, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                        {faithMode ? '✝️ Declaration' : '💪 Declaration'}
                    </Text>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        {checkIn.declaration}
                    </Text>
                </View>
            )}

            {faithMode && checkIn.spiritualReflection && (
                <View style={[styles.cardSection, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                        ✝️ Did you seek God today?
                    </Text>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        {checkIn.spiritualReflection}
                    </Text>
                </View>
            )}

            {faithMode && checkIn.godSpoke && (
                <View style={[styles.cardSection, { backgroundColor: colors.sand }]}>
                    <Text style={[styles.sectionTitle, { color: colors.emerald }]}>
                        🕊 What did He speak?
                    </Text>
                    <Text style={[styles.sectionText, { color: colors.text }]}>
                        {checkIn.godSpoke}
                    </Text>
                </View>
            )}
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.emerald }]}>
                    {faithMode ? 'Daily Check-in' : 'Daily Reflection'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.olive }]}>
                    {faithMode
                        ? 'Reflect on your day and seek God\'s guidance.'
                        : 'Celebrate your wins and acknowledge your growth.'
                    }
                </Text>

                {todayCheckIn ? (
                    <View style={[styles.todayCheckIn, { backgroundColor: colors.sand }]}>
                        <Text style={[styles.todayText, { color: colors.emerald }]}>
                            ✅ Today's check-in completed
                        </Text>
                        <Text style={[styles.todayMood, { color: colors.olive }]}>
                            {todayCheckIn.mood}/10 {getMoodEmoji(todayCheckIn.mood)}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.newCheckInButton, { backgroundColor: colors.emerald }]}
                        onPress={() => setShowNewCheckInModal(true)}
                    >
                        <Text style={[styles.newCheckInButtonText, { color: colors.cream }]}>
                            {faithMode ? '✝️ Start Today\'s Check-in' : '🕊 Start Today\'s Reflection'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Analytics */}
                {renderAnalytics()}

                {/* Week View */}
                {renderWeekView()}

                {/* History Button */}
                <TouchableOpacity
                    style={[styles.historyButton, { backgroundColor: colors.card, borderColor: colors.olive }]}
                    onPress={() => setShowHistoryModal(true)}
                >
                    <Text style={[styles.historyButtonText, { color: colors.emerald }]}>
                        📅 View Past Reflections
                    </Text>
                </TouchableOpacity>

                {/* Recent Check-ins */}
                {checkIns.length > 0 && (
                    <View style={styles.recentContainer}>
                        <Text style={[styles.recentTitle, { color: colors.emerald }]}>
                            Recent Reflections
                        </Text>
                        {checkIns.slice(0, 3).map(renderCheckInCard)}
                    </View>
                )}
            </ScrollView>

            {/* New Check-in Modal */}
            <Modal
                visible={showNewCheckInModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            {faithMode ? 'Today\'s Check-in' : 'Today\'s Reflection'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowNewCheckInModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {/* Mood Slider */}
                        {renderMoodSlider()}

                        {/* Wins */}
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '🙌 What did you win at?' : '🎉 What did you win at?'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "Share your victories and blessings..."
                                : "Celebrate one thing you got right..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newCheckIn.wins}
                            onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, wins: text }))}
                            multiline
                            numberOfLines={3}
                        />

                        {/* Working On */}
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '🔄 What are you still working on?' : '💪 What are you still working on?'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder="Share what you're still growing in..."
                            placeholderTextColor={colors.olive}
                            value={newCheckIn.workingOn}
                            onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, workingOn: text }))}
                            multiline
                            numberOfLines={3}
                        />

                        {/* Prayer Request */}
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '🙏 Prayer Request (Optional)' : '💭 Reflection (Optional)'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder={faithMode
                                ? "Share a prayer request or spiritual need..."
                                : "Share a reflection or thought..."
                            }
                            placeholderTextColor={colors.olive}
                            value={newCheckIn.prayerRequest}
                            onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, prayerRequest: text }))}
                            multiline
                            numberOfLines={2}
                        />

                        {/* Declaration */}
                        <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                            {faithMode ? '✝️ Declaration (Optional)' : '💪 Declaration (Optional)'}
                        </Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.olive,
                            }]}
                            placeholder="Declare something positive over your life..."
                            placeholderTextColor={colors.olive}
                            value={newCheckIn.declaration}
                            onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, declaration: text }))}
                            multiline
                            numberOfLines={2}
                        />

                        {/* Faith Mode Only Fields */}
                        {faithMode && (
                            <>
                                <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                                    ✝️ Did you seek God today?
                                </Text>
                                <TextInput
                                    style={[styles.textArea, {
                                        backgroundColor: colors.card,
                                        color: colors.text,
                                        borderColor: colors.olive,
                                    }]}
                                    placeholder="Share your spiritual practices and time with God..."
                                    placeholderTextColor={colors.olive}
                                    value={newCheckIn.spiritualReflection}
                                    onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, spiritualReflection: text }))}
                                    multiline
                                    numberOfLines={2}
                                />

                                <Text style={[styles.inputLabel, { color: colors.emerald }]}>
                                    🕊 What did He speak?
                                </Text>
                                <TextInput
                                    style={[styles.textArea, {
                                        backgroundColor: colors.card,
                                        color: colors.text,
                                        borderColor: colors.olive,
                                    }]}
                                    placeholder="Share what God revealed to you today..."
                                    placeholderTextColor={colors.olive}
                                    value={newCheckIn.godSpoke}
                                    onChangeText={(text) => setNewCheckIn(prev => ({ ...prev, godSpoke: text }))}
                                    multiline
                                    numberOfLines={2}
                                />
                            </>
                        )}
                    </ScrollView>

                    <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.olive }]}
                            onPress={() => setShowNewCheckInModal(false)}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.olive }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: colors.emerald }]}
                            onPress={handleSubmitCheckIn}
                        >
                            <Text style={[styles.submitButtonText, { color: colors.cream }]}>
                                {faithMode ? 'Submit Check-in' : 'Submit Reflection'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* History Modal */}
            <Modal
                visible={showHistoryModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.emerald }]}>
                            Past Reflections
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowHistoryModal(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.olive }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {checkIns.length === 0 ? (
                            <View style={styles.emptyHistory}>
                                <Text style={[styles.emptyHistoryText, { color: colors.olive }]}>
                                    No past reflections yet. Start your first check-in!
                                </Text>
                            </View>
                        ) : (
                            checkIns.map(renderCheckInCard)
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Nunito_700SemiBold',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    todayCheckIn: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    todayText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    todayMood: {
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Quicksand_400Regular',
    },
    newCheckInButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    newCheckInButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    analyticsContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    analyticsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    analyticsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    analyticsItem: {
        alignItems: 'center',
    },
    analyticsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Nunito_700SemiBold',
    },
    analyticsLabel: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Quicksand_400Regular',
    },
    weekContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    weekTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    weekGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dayContainer: {
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Quicksand_400Regular',
    },
    dayEmoji: {
        marginBottom: 2,
    },
    dayMood: {
        fontSize: 10,
        fontFamily: 'Quicksand_400Regular',
    },
    historyButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
    },
    historyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    recentContainer: {
        marginTop: 16,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    checkInCard: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
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
        marginBottom: 12,
    },
    cardDate: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    cardMood: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    cardSection: {
        marginBottom: 12,
        padding: 8,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Nunito_600SemiBold',
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Quicksand_400Regular',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    moodContainer: {
        marginBottom: 20,
    },
    moodLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sliderDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    moodValue: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Nunito_600SemiBold',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        fontFamily: 'Nunito_600SemiBold',
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: 'Quicksand_400Regular',
        textAlignVertical: 'top',
        minHeight: 80,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    emptyHistory: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyHistoryText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Quicksand_400Regular',
    },
}); 