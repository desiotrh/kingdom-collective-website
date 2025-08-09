import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useProductPlans } from '../../../packages/hooks/useProductPlans';
import { ContentService } from '../../../packages/api';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AIReflectModal from '../../../packages/ui/AIReflectModal';

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

const NameOption = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected, theme }) => selected ? theme.colors.gold : theme.colors.silverGray};
  padding: 10px 16px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const NameText = styled.Text<{ selected: boolean }>`
  color: ${({ selected, theme }) => selected ? theme.colors.sapphireBlue : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 17px;
`;

const DescriptionBox = styled.View`
  background-color: ${({ theme }) => theme.colors.silverGray}33;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export default function ProductNamingScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { plans, savePlan } = useProductPlans();
    const [selectedPlan] = useState(plans[0] || null); // Use first plan for now
    const [includeFaith, setIncludeFaith] = useState(faithMode);
    const [nameLoading, setNameLoading] = useState(false);
    const [descLoading, setDescLoading] = useState(false);
    const [nameOptions, setNameOptions] = useState<string[]>([]);
    const [selectedName, setSelectedName] = useState('');
    const [description, setDescription] = useState('');
  const [reflectVisible, setReflectVisible] = useState(false);

    const handleGenerateNames = async () => {
        if (!selectedPlan) return;
        setReflectVisible(true);
        // actual generation will start after reflect confirmation
    };

    const doGenerateNames = async () => {
        if (!selectedPlan) return;
        setNameLoading(true);
        setNameOptions([]);
        setSelectedName('');
        let prompt = `Give me 5 creative, professional, and relevant product names for a ${selectedPlan.type} that helps ${selectedPlan.audience} solve ${selectedPlan.problem}. Keep it clear, brandable, and purpose-driven.`;
        if (includeFaith) prompt += ' Use language inspired by God’s purpose and biblical encouragement.';
        else prompt += ' Use values-based language: purpose, transformation, vision, clarity, support.';
        try {
            const response = await ContentService.getInstance().generateContent({
                contentType: 'name',
                platform: 'general',
                prompt,
                faithMode: includeFaith,
                tone: includeFaith ? 'biblical' : 'motivational',
            });
            // Try to split into 5 names
            const names = response.data?.content?.split(/\n|\d+\.|•|-/).map(s => s.trim()).filter(Boolean).slice(0, 5) || [];
            setNameOptions(names);
        } catch (e) {
            Alert.alert('Error', 'Failed to generate names.');
        } finally {
            setNameLoading(false);
        }
    };

    const handleGenerateDescription = async () => {
        if (!selectedPlan || !selectedName) return;
        setReflectVisible(true);
        // actual generation will start after reflect confirmation
    };

    const doGenerateDescription = async () => {
        if (!selectedPlan || !selectedName) return;
        setDescLoading(true);
        let prompt = `Write a 1-paragraph product description for a ${selectedPlan.type} called ${selectedName}. The product helps ${selectedPlan.audience} with ${selectedPlan.problem} and includes features like ${selectedPlan.features.join(', ')}. Make it clear, compelling, and mission-driven.`;
        if (includeFaith) prompt += ' Use language inspired by God’s purpose and biblical encouragement.';
        else prompt += ' Use values-based language: purpose, transformation, vision, clarity, support.';
        try {
            const response = await ContentService.getInstance().generateContent({
                contentType: 'description',
                platform: 'general',
                prompt,
                faithMode: includeFaith,
                tone: includeFaith ? 'biblical' : 'motivational',
            });
            setDescription(response.data?.content || '');
        } catch (e) {
            Alert.alert('Error', 'Failed to generate description.');
        } finally {
            setDescLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'Copied to clipboard.');
    };

    const handleSaveToPlan = async () => {
        if (!selectedPlan) return;
        await savePlan({
            ...selectedPlan,
            name: selectedName || selectedPlan.name,
            description,
            faithMode: includeFaith,
        });
        Alert.alert('Saved!', 'Name and description saved to product plan.');
    };

    return (
        <Container>
            <Header>AI Product Naming & Description</Header>
            <Section>
                <Label>Faith-Forward Language</Label>
                <Button
                    title={includeFaith ? 'Faith Mode ON' : 'Faith Mode OFF'}
                    onPress={() => setIncludeFaith(f => !f)}
                    variant={includeFaith ? 'gold' : 'primary'}
                />
            </Section>
            <Section>
                <Label>Product Name Generator</Label>
                <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 8 }}>
                    Type: {selectedPlan?.type || '-'} | Audience: {selectedPlan?.audience || '-'}
                </Text>
            <Button title={nameLoading ? 'Generating...' : 'Generate Names'} onPress={handleGenerateNames} loading={nameLoading} />
                <View style={{ marginTop: 12 }}>
                    {nameOptions.map((name, idx) => (
                        <NameOption key={idx} selected={selectedName === name} onPress={() => setSelectedName(name)}>
                            <NameText selected={selectedName === name}>{name}</NameText>
                        </NameOption>
                    ))}
                </View>
                {nameOptions.length > 0 && <Button title="Regenerate" onPress={handleGenerateNames} style={{ marginTop: 8 }} />}
            </Section>
            <Section>
                <Label>Product Description Generator</Label>
                <Button title={descLoading ? 'Generating...' : 'Generate Description'} onPress={handleGenerateDescription} loading={descLoading} disabled={!selectedName} />
                {description ? (
                    <DescriptionBox>
                        <Text style={{ color: theme.colors.sapphireBlue, fontSize: 15 }}>{description}</Text>
                        <Button title="Copy" onPress={() => handleCopy(description)} style={{ marginTop: 8 }} />
                        <Button title="Save to Product Plan" onPress={handleSaveToPlan} style={{ marginTop: 8 }} />
                    </DescriptionBox>
                ) : null}
            </Section>
        <AIReflectModal
          visible={reflectVisible}
          onSkip={() => {
            setReflectVisible(false);
            if (nameLoading || descLoading) return;
            // Decide based on selection state
            if (!selectedName) doGenerateNames(); else doGenerateDescription();
          }}
          onConfirm={() => {
            setReflectVisible(false);
            if (nameLoading || descLoading) return;
            if (!selectedName) doGenerateNames(); else doGenerateDescription();
          }}
        />
        </Container>
    );
} 