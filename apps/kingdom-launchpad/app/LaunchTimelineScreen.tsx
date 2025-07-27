import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { TextInput } from '../../../packages/ui/TextInput';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useProductPlans } from '../../../packages/hooks/useProductPlans';
import { useLaunchTimeline } from '../../../packages/hooks/useLaunchTimeline';
import { View, Text, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const MilestoneRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const MilestoneText = styled.Text<{ completed: boolean }>`
  color: ${({ completed, theme }) => completed ? theme.colors.gold : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
  flex: 1;
`;

const DateText = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-size: 12px;
  margin-left: 8px;
`;

const AddRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Encouragement = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 15px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

export default function LaunchTimelineScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { plans } = useProductPlans();
    const [selectedPlan] = useState(plans[0] || null);
    const goalDate = selectedPlan?.goalDate || null;
    const {
        milestones,
        loading,
        completeMilestone,
        addMilestone,
        reorderMilestones,
        reload,
    } = useLaunchTimeline(goalDate);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [anim] = useState(new Animated.Value(0));

    const handleComplete = async (id: string) => {
        await completeMilestone(id);
        Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]).start();
        if (faithMode) Alert.alert('Amen!', 'Milestone completed!');
        else Alert.alert('Great job!', 'Milestone completed!');
    };

    const handleAdd = async () => {
        if (!newTitle || !newDate) {
            Alert.alert('Missing', 'Please enter a title and date.');
            return;
        }
        await addMilestone(newTitle, newDate);
        setNewTitle('');
        setNewDate('');
    };

    // Encouragement/verse rotation
    const faithVerses = [
        'Commit your work to the Lord… (Proverbs 16:3)',
        'Write the vision, make it plain… (Habakkuk 2:2)',
        'With God all things are possible. (Matthew 19:26)',
    ];
    const encouragements = [
        'You’re building momentum.',
        'Faith looks like action.',
        'Every step counts.',
        'Progress over perfection.',
    ];
    const [encIdx, setEncIdx] = useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => setEncIdx(i => (i + 1) % (faithMode ? faithVerses.length : encouragements.length)), 6000);
        return () => clearInterval(interval);
    }, [faithMode]);

    return (
        <Container>
            <Header>Launch Timeline</Header>
            <Section>
                <Text style={{ color: theme.colors.sapphireBlue, fontSize: 16, marginBottom: 8 }}>
                    Launch Goal Date: {goalDate ? new Date(goalDate).toDateString() : '-'}
                </Text>
                <Encouragement>
                    {faithMode ? faithVerses[encIdx] : encouragements[encIdx]}
                </Encouragement>
            </Section>
            <Section>
                <Label>Milestones</Label>
                {loading ? <Text>Loading…</Text> : (
                    <FlatList
                        data={milestones}
                        keyExtractor={m => m.id}
                        renderItem={({ item, index }) => (
                            <MilestoneRow>
                                <TouchableOpacity onPress={() => handleComplete(item.id)}>
                                    <MilestoneText completed={item.completed}>{item.title}</MilestoneText>
                                </TouchableOpacity>
                                <DateText>{new Date(item.date).toDateString()}</DateText>
                                {/* Reorder buttons (simple up/down) */}
                                <Button title="↑" onPress={() => index > 0 && reorderMilestones(index, index - 1)} style={{ marginLeft: 4 }} />
                                <Button title="↓" onPress={() => index < milestones.length - 1 && reorderMilestones(index, index + 1)} style={{ marginLeft: 4 }} />
                            </MilestoneRow>
                        )}
                    />
                )}
                <AddRow>
                    <TextInput
                        value={newTitle}
                        onChangeText={setNewTitle}
                        placeholder="Add custom task…"
                        style={{ flex: 2, marginRight: theme.spacing.sm }}
                    />
                    <TextInput
                        value={newDate}
                        onChangeText={setNewDate}
                        placeholder="YYYY-MM-DD"
                        style={{ flex: 1, marginRight: theme.spacing.sm }}
                    />
                    <Button title="Add" onPress={handleAdd} />
                </AddRow>
            </Section>
        </Container>
    );
} 