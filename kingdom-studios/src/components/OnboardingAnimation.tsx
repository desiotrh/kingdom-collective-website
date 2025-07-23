/**
 * 🎬 Onboarding Animation - Updated Branding
 * Warm color scheme, no purple, no dark overload
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { KingdomColors } from '../constants/KingdomColors';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

interface OnboardingAnimationProps {
    onComplete: () => void;
    onSkip: () => void;
}

const OnboardingAnimation: React.FC<OnboardingAnimationProps> = ({
    onComplete,
    onSkip,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const currentStep = useRef(0);

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: 'Welcome to Kingdom Studios',
            description: 'Your faith-integrated content creation platform',
            icon: '🌟',
            color: KingdomColors.primary,
        },
        {
            id: 'create',
            title: 'Create Amazing Content',
            description: 'AI-powered tools for faith-based content creation',
            icon: '🎨',
            color: KingdomColors.secondary,
        },
        {
            id: 'community',
            title: 'Build Your Community',
            description: 'Connect with like-minded creators and believers',
            icon: '👥',
            color: KingdomColors.faith,
        },
        {
            id: 'grow',
            title: 'Grow Your Impact',
            description: 'Analytics and insights to maximize your reach',
            icon: '📈',
            color: KingdomColors.accent,
        },
    ];

    useEffect(() => {
        startAnimation();
    }, []);

    const startAnimation = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const nextStep = () => {
        if (currentStep.current < steps.length - 1) {
            currentStep.current++;
            animateStep();
        } else {
            onComplete();
        }
    };

    const animateStep = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            slideAnim.setValue(width);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const currentStepData = steps[currentStep.current];

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <View style={[styles.background, { backgroundColor: currentStepData.color }]} />

            {/* Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateX: slideAnim },
                            { scale: scaleAnim },
                        ],
                    },
                ]}
            >
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: KingdomColors.white }]}>
                    <Text style={styles.icon}>{currentStepData.icon}</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>{currentStepData.title}</Text>

                {/* Description */}
                <Text style={styles.description}>{currentStepData.description}</Text>

                {/* Progress Dots */}
                <View style={styles.progressContainer}>
                    {steps.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressDot,
                                index === currentStep.current && styles.progressDotActive,
                            ]}
                        />
                    ))}
                </View>
            </Animated.View>

            {/* Navigation */}
            <View style={styles.navigation}>
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: currentStepData.color }]}
                    onPress={nextStep}
                >
                    <Text style={styles.nextText}>
                        {currentStep.current === steps.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Faith Mode Indicator */}
            <View style={styles.faithIndicator}>
                <Text style={styles.faithText}>Faith-Integrated Platform</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: KingdomColors.background,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
        maxWidth: width * 0.8,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: KingdomColors.text,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: KingdomColors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: KingdomColors.border,
        marginHorizontal: 4,
    },
    progressDotActive: {
        backgroundColor: KingdomColors.primary,
        width: 24,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.8,
        paddingHorizontal: 20,
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    skipText: {
        fontSize: 16,
        color: KingdomColors.textSecondary,
        fontWeight: '500',
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    nextText: {
        fontSize: 16,
        color: KingdomColors.white,
        fontWeight: '600',
    },
    faithIndicator: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: KingdomColors.faith,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    faithText: {
        fontSize: 12,
        color: KingdomColors.white,
        fontWeight: '600',
    },
});

export default OnboardingAnimation; 