import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Card } from '../../../packages/ui/Card';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useAnalyticsStats } from '../../../packages/hooks/useAnalyticsStats';
import { View, Text } from 'react-native';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StatCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const StatNumber = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 32px;
  font-family: ${({ theme }) => theme.fonts.header};
`;

const StatLabel = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Encouragement = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 15px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

export default function AnalyticsDashboardScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { stats, loading } = useAnalyticsStats();

    const faithEnc = 'He who began a good work in you… (Philippians 1:6)';
    const encouragements = [
        'Look at what you’ve built so far.',
        'You’re further than you think.',
        'Progress is worth celebrating.',
    ];
    const [encIdx, setEncIdx] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => setEncIdx(i => (i + 1) % encouragements.length), 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <Header>Analytics Dashboard</Header>
            <Card style={{ marginBottom: theme.spacing.lg }}>
                <Encouragement>
                    {faithMode ? faithEnc : encouragements[encIdx]}
                </Encouragement>
            </Card>
            <StatCard>
                <StatNumber>{loading ? '-' : stats.productPlans}</StatNumber>
                <StatLabel>Products Created</StatLabel>
            </StatCard>
            <StatCard>
                <StatNumber>{loading ? '-' : stats.launchContent}</StatNumber>
                <StatLabel>Launch Posts Generated</StatLabel>
            </StatCard>
            <StatCard>
                <StatNumber>{loading ? '-' : stats.aiGenerations}</StatNumber>
                <StatLabel>AI Generations Used</StatLabel>
            </StatCard>
            <StatCard>
                <StatNumber>{loading ? '-' : stats.checkoutLinks}</StatNumber>
                <StatLabel>Checkout Links Created</StatLabel>
            </StatCard>
        </Container>
    );
} 