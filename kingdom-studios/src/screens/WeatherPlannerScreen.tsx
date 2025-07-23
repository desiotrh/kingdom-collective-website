import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    Image,
} from 'react-native';
import { useDualMode } from '../contexts/DualModeContext';
import { KingdomColors } from '../constants/KingdomColors';
import { Ionicons } from '@expo/vector-icons';

interface WeatherData {
    temperature: number;
    condition: string;
    windSpeed: number;
    humidity: number;
    rainChance: number;
    stormRisk: 'low' | 'medium' | 'high';
    visibility: number;
}

interface PhotoSpot {
    id: string;
    name: string;
    distance: string;
    type: 'scenic' | 'urban' | 'natural' | 'historic';
    description: string;
    bestTime: string;
    imageUrl?: string;
}

interface SessionRisk {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
    alternateDate?: string;
}

const WeatherPlannerScreen: React.FC = () => {
    const { isFaithMode } = useDualMode();
    const [currentWeather, setCurrentWeather] = useState<WeatherData>({
        temperature: 72,
        condition: 'Partly Cloudy',
        windSpeed: 8,
        humidity: 65,
        rainChance: 20,
        stormRisk: 'low',
        visibility: 10,
    });
    const [scheduledSessions, setScheduledSessions] = useState([
        {
            id: '1',
            title: 'Wedding Ceremony',
            date: '2024-06-15',
            time: '14:00',
            location: 'Central Park',
            weatherDependent: true,
        },
        {
            id: '2',
            title: 'Family Portraits',
            date: '2024-06-20',
            time: '16:00',
            location: 'Beach Front',
            weatherDependent: true,
        },
    ]);
    const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>([
        {
            id: '1',
            name: 'Sunset Point',
            distance: '2.3 miles',
            type: 'scenic',
            description: 'Perfect for golden hour shots with city skyline',
            bestTime: 'Sunset',
        },
        {
            id: '2',
            name: 'Historic District',
            distance: '1.8 miles',
            type: 'historic',
            description: 'Classic architecture and cobblestone streets',
            bestTime: 'Morning',
        },
        {
            id: '3',
            name: 'Botanical Gardens',
            distance: '3.1 miles',
            type: 'natural',
            description: 'Lush greenery and seasonal blooms',
            bestTime: 'Afternoon',
        },
    ]);
    const [showRiskModal, setShowRiskModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [sessionRisk, setSessionRisk] = useState<SessionRisk>({
        level: 'low',
        factors: [],
        recommendations: [],
    });

    const weatherConditions = {
        'Partly Cloudy': { icon: 'partly-sunny', color: KingdomColors.bronze },
        'Sunny': { icon: 'sunny', color: KingdomColors.dustGold },
        'Rainy': { icon: 'rainy', color: KingdomColors.bronze },
        'Stormy': { icon: 'thunderstorm', color: '#8B0000' },
        'Overcast': { icon: 'cloudy', color: '#666666' },
    };

    const calculateSessionRisk = (session: any, weather: WeatherData): SessionRisk => {
        const factors = [];
        const recommendations = [];

        if (weather.rainChance > 50) {
            factors.push('High chance of rain');
            recommendations.push('Consider indoor backup location');
        }

        if (weather.windSpeed > 15) {
            factors.push('High winds');
            recommendations.push('Use wind-resistant equipment');
        }

        if (weather.stormRisk === 'high') {
            factors.push('Storm risk');
            recommendations.push('Reschedule session');
        }

        if (weather.visibility < 5) {
            factors.push('Poor visibility');
            recommendations.push('Wait for better conditions');
        }

        let level: 'low' | 'medium' | 'high' = 'low';
        if (factors.length >= 3) level = 'high';
        else if (factors.length >= 1) level = 'medium';

        return {
            level,
            factors,
            recommendations,
            alternateDate: level === 'high' ? '2024-06-22' : undefined,
        };
    };

    const handleSessionRiskCheck = (session: any) => {
        const risk = calculateSessionRisk(session, currentWeather);
        setSessionRisk(risk);
        setSelectedSession(session);
        setShowRiskModal(true);
    };

    const notifyClient = (session: any, risk: SessionRisk) => {
        Alert.alert(
            'Client Notification',
            isFaithMode
                ? `Praying for clear skies for ${session.title}. We'll keep you updated on weather conditions.`
                : `Weather alert sent to client for ${session.title}. We'll monitor conditions and update you.`
        );
    };

    const rescheduleSession = (session: any, newDate: string) => {
        Alert.alert(
            'Session Rescheduled',
            isFaithMode
                ? `Session moved to ${newDate}. Trusting in God's perfect timing for beautiful weather.`
                : `Session rescheduled to ${newDate} for better weather conditions.`
        );
    };

    const RiskModal = () => (
        <Modal
            visible={showRiskModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {selectedSession && (
                        <>
                            <Text style={styles.modalTitle}>Session Risk Assessment</Text>

                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionName}>{selectedSession.title}</Text>
                                <Text style={styles.sessionDetails}>
                                    {selectedSession.date} at {selectedSession.time}
                                </Text>
                                <Text style={styles.sessionLocation}>{selectedSession.location}</Text>
                            </View>

                            <View style={[
                                styles.riskLevel,
                                sessionRisk.level === 'high' && styles.highRisk,
                                sessionRisk.level === 'medium' && styles.mediumRisk,
                                sessionRisk.level === 'low' && styles.lowRisk,
                            ]}>
                                <Text style={styles.riskLevelText}>
                                    Risk Level: {sessionRisk.level.toUpperCase()}
                                </Text>
                            </View>

                            {sessionRisk.factors.length > 0 && (
                                <View style={styles.riskFactors}>
                                    <Text style={styles.factorsTitle}>Risk Factors:</Text>
                                    {sessionRisk.factors.map((factor, index) => (
                                        <Text key={index} style={styles.factorText}>• {factor}</Text>
                                    ))}
                                </View>
                            )}

                            {sessionRisk.recommendations.length > 0 && (
                                <View style={styles.recommendations}>
                                    <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                                    {sessionRisk.recommendations.map((rec, index) => (
                                        <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                                    ))}
                                </View>
                            )}

                            {sessionRisk.alternateDate && (
                                <View style={styles.alternateDate}>
                                    <Text style={styles.alternateTitle}>Suggested Alternate Date:</Text>
                                    <Text style={styles.alternateDateText}>{sessionRisk.alternateDate}</Text>
                                    <TouchableOpacity
                                        style={styles.rescheduleButton}
                                        onPress={() => {
                                            rescheduleSession(selectedSession, sessionRisk.alternateDate!);
                                            setShowRiskModal(false);
                                        }}
                                    >
                                        <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        notifyClient(selectedSession, sessionRisk);
                                        setShowRiskModal(false);
                                    }}
                                >
                                    <Ionicons name="notifications" size={20} color={KingdomColors.softWhite} />
                                    <Text style={styles.actionButtonText}>Notify Client</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowRiskModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isFaithMode ? 'Weather Planner - Faith Mode' : 'Weather Planner'}
                </Text>
                <Text style={styles.subtitle}>
                    {isFaithMode
                        ? 'Trust in God\'s weather while planning your sessions'
                        : 'Plan your sessions around optimal weather conditions'
                    }
                </Text>
            </View>

            <View style={styles.weatherSection}>
                <Text style={styles.sectionTitle}>Current Weather</Text>

                <View style={styles.weatherCard}>
                    <View style={styles.weatherHeader}>
                        <Ionicons
                            name={weatherConditions[currentWeather.condition as keyof typeof weatherConditions]?.icon as any}
                            size={48}
                            color={weatherConditions[currentWeather.condition as keyof typeof weatherConditions]?.color}
                        />
                        <View style={styles.weatherInfo}>
                            <Text style={styles.temperature}>{currentWeather.temperature}°F</Text>
                            <Text style={styles.condition}>{currentWeather.condition}</Text>
                        </View>
                    </View>

                    <View style={styles.weatherDetails}>
                        <View style={styles.weatherDetail}>
                            <Ionicons name="water" size={16} color={KingdomColors.bronze} />
                            <Text style={styles.detailText}>Humidity: {currentWeather.humidity}%</Text>
                        </View>
                        <View style={styles.weatherDetail}>
                            <Ionicons name="speedometer" size={16} color={KingdomColors.bronze} />
                            <Text style={styles.detailText}>Wind: {currentWeather.windSpeed} mph</Text>
                        </View>
                        <View style={styles.weatherDetail}>
                            <Ionicons name="rainy" size={16} color={KingdomColors.bronze} />
                            <Text style={styles.detailText}>Rain: {currentWeather.rainChance}%</Text>
                        </View>
                        <View style={styles.weatherDetail}>
                            <Ionicons name="eye" size={16} color={KingdomColors.bronze} />
                            <Text style={styles.detailText}>Visibility: {currentWeather.visibility} mi</Text>
                        </View>
                    </View>

                    <View style={[
                        styles.stormRisk,
                        currentWeather.stormRisk === 'high' && styles.highRisk,
                        currentWeather.stormRisk === 'medium' && styles.mediumRisk,
                        currentWeather.stormRisk === 'low' && styles.lowRisk,
                    ]}>
                        <Ionicons name="warning" size={16} color={KingdomColors.softWhite} />
                        <Text style={styles.stormRiskText}>
                            Storm Risk: {currentWeather.stormRisk.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.sessionsSection}>
                <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
                {scheduledSessions.map((session) => {
                    const risk = calculateSessionRisk(session, currentWeather);
                    return (
                        <View key={session.id} style={styles.sessionCard}>
                            <View style={styles.sessionHeader}>
                                <Text style={styles.sessionTitle}>{session.title}</Text>
                                <View style={[
                                    styles.riskIndicator,
                                    risk.level === 'high' && styles.highRisk,
                                    risk.level === 'medium' && styles.mediumRisk,
                                    risk.level === 'low' && styles.lowRisk,
                                ]}>
                                    <Text style={styles.riskIndicatorText}>{risk.level}</Text>
                                </View>
                            </View>

                            <Text style={styles.sessionDate}>{session.date} at {session.time}</Text>
                            <Text style={styles.sessionLocation}>{session.location}</Text>

                            <TouchableOpacity
                                style={styles.checkRiskButton}
                                onPress={() => handleSessionRiskCheck(session)}
                            >
                                <Ionicons name="analytics" size={16} color={KingdomColors.softWhite} />
                                <Text style={styles.checkRiskButtonText}>Check Risk</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            <View style={styles.spotsSection}>
                <Text style={styles.sectionTitle}>Local Photo Spots</Text>
                {photoSpots.map((spot) => (
                    <View key={spot.id} style={styles.spotCard}>
                        <View style={styles.spotHeader}>
                            <Text style={styles.spotName}>{spot.name}</Text>
                            <View style={styles.spotType}>
                                <Ionicons
                                    name={spot.type === 'scenic' ? 'image' : spot.type === 'urban' ? 'business' : 'leaf'}
                                    size={16}
                                    color={KingdomColors.bronze}
                                />
                                <Text style={styles.spotTypeText}>{spot.type}</Text>
                            </View>
                        </View>

                        <Text style={styles.spotDistance}>{spot.distance} away</Text>
                        <Text style={styles.spotDescription}>{spot.description}</Text>
                        <Text style={styles.spotBestTime}>Best time: {spot.bestTime}</Text>
                    </View>
                ))}
            </View>

            <RiskModal />
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
    weatherSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 15,
        fontFamily: 'EB Garamond',
    },
    weatherCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 20,
        borderRadius: 15,
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    weatherInfo: {
        marginLeft: 20,
    },
    temperature: {
        fontSize: 36,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    condition: {
        fontSize: 18,
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    weatherDetails: {
        marginBottom: 15,
    },
    weatherDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    stormRisk: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    highRisk: {
        backgroundColor: '#8B0000',
    },
    mediumRisk: {
        backgroundColor: '#FF8C00',
    },
    lowRisk: {
        backgroundColor: '#228B22',
    },
    stormRiskText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginLeft: 8,
        fontFamily: 'Sora',
    },
    sessionsSection: {
        padding: 20,
    },
    sessionCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sessionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'EB Garamond',
    },
    riskIndicator: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    riskIndicatorText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    sessionDate: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    sessionLocation: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    checkRiskButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
    },
    checkRiskButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    spotsSection: {
        padding: 20,
    },
    spotCard: {
        backgroundColor: KingdomColors.dustGold,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    spotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    spotName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.matteBlack,
        fontFamily: 'Sora',
    },
    spotType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spotTypeText: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginLeft: 4,
        fontFamily: 'Sora',
    },
    spotDistance: {
        fontSize: 12,
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    spotDescription: {
        fontSize: 14,
        color: KingdomColors.matteBlack,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    spotBestTime: {
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
    sessionInfo: {
        marginBottom: 15,
    },
    sessionName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'EB Garamond',
    },
    sessionDetails: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    sessionLocation: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    riskLevel: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    riskLevelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        fontFamily: 'Sora',
    },
    riskFactors: {
        marginBottom: 15,
    },
    factorsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    factorText: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    recommendations: {
        marginBottom: 15,
    },
    recommendationsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 8,
        fontFamily: 'Sora',
    },
    recommendationText: {
        fontSize: 14,
        color: KingdomColors.softWhite,
        marginBottom: 3,
        fontFamily: 'Sora',
    },
    alternateDate: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: KingdomColors.bronze,
        borderRadius: 8,
    },
    alternateTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: KingdomColors.softWhite,
        marginBottom: 5,
        fontFamily: 'Sora',
    },
    alternateDateText: {
        fontSize: 16,
        color: KingdomColors.softWhite,
        marginBottom: 10,
        fontFamily: 'Sora',
    },
    rescheduleButton: {
        backgroundColor: KingdomColors.dustGold,
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    rescheduleButtonText: {
        color: KingdomColors.matteBlack,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: KingdomColors.bronze,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
    },
    actionButtonText: {
        color: KingdomColors.softWhite,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        fontFamily: 'Sora',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: KingdomColors.bronze,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flex: 0.48,
    },
    cancelButtonText: {
        color: KingdomColors.bronze,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Sora',
    },
});

export default WeatherPlannerScreen; 