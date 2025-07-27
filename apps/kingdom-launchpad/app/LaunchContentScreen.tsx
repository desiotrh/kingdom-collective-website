import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useProductPlans } from '../../../packages/hooks/useProductPlans';
import { useSavedContent } from '../../../packages/hooks/useSavedContent';
import { ContentService } from '../../../packages/api';
import { View, Text, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const OutputCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const contentTypes = [
    {
        key: 'instagram',
        label: 'Instagram Caption',
        tag: 'Instagram',
        prompt: (plan, faith) =>
            `Write an Instagram caption to promote a new ${plan.type} called ${plan.name}. It helps ${plan.audience} with ${plan.problem} by offering ${plan.features.join(', ')}. Make it compelling, clear, and include relevant hashtags.${faith ? ' Use purpose-driven language and biblical boldness. This isn’t just a product—it’s a calling.' : ' Use inspirational, purpose-based marketing.'}`,
    },
    {
        key: 'email',
        label: 'Email Announcement',
        tag: 'Email',
        prompt: (plan, faith) =>
            `Write an email announcement for a new ${plan.type} called ${plan.name}. It helps ${plan.audience} with ${plan.problem} and features ${plan.features.join(', ')}. Use a friendly tone, clear call-to-action, and ${faith ? 'include encouragement rooted in biblical purpose.' : 'inspire action with clarity and truth.'}`,
    },
    {
        key: 'launch',
        label: 'Launch Day Post',
        tag: 'Launch',
        prompt: (plan, faith) =>
            `Write a launch day social post for ${plan.name}, a ${plan.type} for ${plan.audience}. Highlight the excitement, final push, and how it solves ${plan.problem}. ${faith ? 'Let God breathe on what you’ve built.' : 'Make it bold and vision-driven.'}`,
    },
    {
        key: 'landing',
        label: 'Landing Page Copy',
        tag: 'Landing',
        prompt: (plan, faith) =>
            `Write landing page copy for ${plan.name}, a ${plan.type} for ${plan.audience}. Include a headline, feature bullets (${plan.features.join(', ')}), and a call to action. ${faith ? 'Root the copy in Kingdom values and purpose.' : 'Make it clear, compelling, and action-oriented.'}`,
    },
    {
        key: 'video',
        label: 'Video Script Intro',
        tag: 'Video',
        prompt: (plan, faith) =>
            `Write a video script intro for launching ${plan.name}, a ${plan.type} for ${plan.audience}. Mention the problem (${plan.problem}), features (${plan.features.join(', ')}), and ${faith ? 'add a faith-forward encouragement.' : 'inspire with vision and clarity.'}`,
    },
    {
        key: 'dm',
        label: 'DM Message / Promo Invite',
        tag: 'DM',
        prompt: (plan, faith) =>
            `Write a direct message to invite someone to check out ${plan.name}, a ${plan.type} for ${plan.audience}. Explain how it helps with ${plan.problem} and mention key features (${plan.features.join(', ')}). ${faith ? 'Encourage with purpose and biblical boldness.' : 'Keep it simple, shareable, and supportive.'}`,
    },
];

export default function LaunchContentScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { plans } = useProductPlans();
    const { saveItem } = useSavedContent();
    const [selectedPlan] = useState(plans[0] || null); // Use first plan for now
    const [loadingType, setLoadingType] = useState('');
    const [outputs, setOutputs] = useState({});

    const handleGenerate = async (type) => {
        if (!selectedPlan) return;
        setLoadingType(type.key);
        try {
            const prompt = type.prompt(selectedPlan, faithMode);
            const response = await ContentService.getInstance().generateContent({
                contentType: type.key,
                platform: 'general',
                prompt,
                faithMode,
                tone: faithMode ? 'biblical' : 'motivational',
            });
            setOutputs((prev) => ({ ...prev, [type.key]: response.data?.content || '' }));
        } catch (e) {
            Alert.alert('Error', 'Failed to generate content.');
        } finally {
            setLoadingType('');
        }
    };

    const handleCopy = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'Copied to clipboard.');
    };

    const handleSave = async (type, text, tag) => {
        await saveItem({
            content: text,
            templateName: selectedPlan?.name,
            faithMode,
            source: 'generated',
            tags: [tag],
            tone: faithMode ? 'biblical' : 'motivational',
        });
        Alert.alert('Saved!', 'Content saved to your library.');
    };

    return (
        <Container>
            <Header>Launch Content Generator</Header>
            <Section>
                <Label>Product Plan</Label>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 4 }}>Name: {selectedPlan?.name || '-'}</Text>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 4 }}>Type: {selectedPlan?.type || '-'}</Text>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 4 }}>Audience: {selectedPlan?.audience || '-'}</Text>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 4 }}>Features: {selectedPlan?.features?.join(', ') || '-'}</Text>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 4 }}>Goal Date: {selectedPlan?.goalDate ? new Date(selectedPlan.goalDate).toDateString() : '-'}</Text>
            </Section>
            <Section>
                <Label>Generate Launch Content</Label>
                {contentTypes.map((type) => (
                    <View key={type.key} style={{ marginBottom: theme.spacing.md }}>
                        <Button
                            title={loadingType === type.key ? 'Generating...' : type.label}
                            onPress={() => handleGenerate(type)}
                            loading={loadingType === type.key}
                        />
                        {outputs[type.key] ? (
                            <OutputCard>
                                <Text style={{ color: theme.colors.sapphireBlue, fontSize: 15 }}>{outputs[type.key]}</Text>
                                <Button title="Copy" onPress={() => handleCopy(outputs[type.key])} style={{ marginTop: 8 }} />
                                <Button title="Save" onPress={() => handleSave(type.key, outputs[type.key], type.tag)} style={{ marginTop: 8 }} />
                                <Button title="Try Again" onPress={() => handleGenerate(type)} style={{ marginTop: 8 }} />
                            </OutputCard>
                        ) : null}
                    </View>
                ))}
            </Section>
        </Container>
    );
} 