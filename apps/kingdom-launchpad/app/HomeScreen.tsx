import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { affirmations } from '../../../packages/constants/affirmations';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Affirmation = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 20px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const FeatureGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const FeatureCard = styled.TouchableOpacity`
  width: 48%;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.silverGray};
  align-items: center;
`;

const FeatureIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.sapphireBlue};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FeatureTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FeatureDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  text-align: center;
  line-height: 16px;
`;

const EncouragementBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const EncouragementText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  text-align: center;
  font-weight: bold;
`;

const QuickStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StatCard = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.silverGray + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: 0 ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const StatValue = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 20px;
  font-weight: bold;
`;

const StatLabel = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  text-align: center;
`;

export default function HomeScreen() {
    const { faithMode } = useFaithMode();
    const [affirmation, setAffirmation] = useState(affirmations[0]);
    const [glowAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        // Rotate affirmation every 5 seconds
        const interval = setInterval(() => {
            setAffirmation(
                affirmations[Math.floor(Math.random() * affirmations.length)]
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (faithMode) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1.2,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [faithMode]);

    const features = [
        {
            title: 'Content Calendar',
            description: 'Plan and schedule your content across all platforms',
            icon: 'calendar',
            route: '/ContentCalendarScreen'
        },
        {
            title: 'Post Automation',
            description: 'Automate posting to multiple platforms simultaneously',
            icon: 'share-social',
            route: '/PostAutomationScreen'
        },
        {
            title: 'Creator Analytics',
            description: 'Track your growth and Kingdom impact metrics',
            icon: 'analytics',
            route: '/CreatorAnalyticsScreen'
        },
        {
            title: 'Product Builder',
            description: 'Create and launch your digital products',
            icon: 'rocket',
            route: '/ProductBuilderScreen'
        }
    ];

    const getEncouragementMessage = () => {
        const messages = [
            "You're building a Kingdom legacy one post at a time.",
            "Your obedience creates ripples of change in the digital world.",
            "Every piece of content is a seed planted for eternity.",
            "You're showing up for your calling. Keep going!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
        <Container>
            <Header>Welcome to Kingdom Launchpad</Header>

            {faithMode && (
                <EncouragementBanner>
                    <EncouragementText>{getEncouragementMessage()}</EncouragementText>
                </EncouragementBanner>
            )}

            <Card>
                <Affirmation>{affirmation}</Affirmation>
            </Card>

            <QuickStats>
                <StatCard>
                    <StatValue>12</StatValue>
                    <StatLabel>Posts This Week</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>2.4K</StatValue>
                    <StatLabel>Total Views</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>156</StatValue>
                    <StatLabel>Lives Touched</StatLabel>
                </StatCard>
            </QuickStats>

            <Header>Quick Actions</Header>
            <FeatureGrid>
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        onPress={() => router.push(feature.route)}
                    >
                        <FeatureIcon>
                            <Ionicons name={feature.icon as any} size={24} color="white" />
                        </FeatureIcon>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureDescription>{feature.description}</FeatureDescription>
                    </FeatureCard>
                ))}
            </FeatureGrid>
        </Container>
    );
} 