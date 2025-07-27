import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Button } from '../../../packages/ui/Button';
import { TextInput } from '../../../packages/ui/TextInput';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { ContentService, ContentGenerationRequest, ContentGenerationResponse } from '../../../packages/api';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { affirmations } from '../../../packages/constants/affirmations';
import { useSavedContent } from '../../../packages/hooks/useSavedContent';

const TEMPLATES = [
    { label: '5 Product Ideas', value: 'Give me 5 product ideas based on ', prompt: 'Give me 5 product ideas based on ' },
    { label: 'Launch Email', value: 'Write a launch email for my new digital course about ', prompt: 'Write a launch email for my new digital course about ' },
    { label: '3-Day Content Plan', value: 'Generate a 3-day content plan for promoting my offer', prompt: 'Generate a 3-day content plan for promoting my offer' },
    { label: 'Faith-Based Name', value: 'What should I name my faith-based ', prompt: 'What should I name my faith-based ' },
    { label: 'Motivational Post', value: 'Write a motivational post about overcoming fear in entrepreneurship', prompt: 'Write a motivational post about overcoming fear in entrepreneurship' },
];

const TONES = [
    { label: 'Professional', value: 'professional' },
    { label: 'Inspirational', value: 'inspirational' },
    { label: 'Casual', value: 'casual' },
    { label: 'Educational', value: 'educational' },
    { label: 'Promotional', value: 'promotional' },
];

const TYPES = [
    { label: 'Post', value: 'post' },
    { label: 'Email', value: 'email' },
    { label: 'Plan', value: 'plan' },
    { label: 'Name', value: 'name' },
    { label: 'Motivation', value: 'motivation' },
];

const AUDIENCES = [
    { label: 'General', value: 'general' },
    { label: 'Entrepreneurs', value: 'entrepreneurs' },
    { label: 'Faith-Based', value: 'faith' },
    { label: 'Creators', value: 'creators' },
];

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DropdownRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Dropdown = styled.Picker`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const Affirmation = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

const ResultText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export default function ContentGeneratorScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const [prompt, setPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [tone, setTone] = useState<string>('professional');
    const [type, setType] = useState<string>('post');
    const [audience, setAudience] = useState<string>('general');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [affirmation, setAffirmation] = useState(affirmations[0]);
    const { saveItem } = useSavedContent();

    useEffect(() => {
        const interval = setInterval(() => {
            setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleTemplatePick = (template: typeof TEMPLATES[0]) => {
        setPrompt(template.prompt);
        setSelectedTemplate(template.value);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult('');
        try {
            // Track analytics: content_generation_started
            // TODO: Integrate analytics tracking here
            const req: ContentGenerationRequest = {
                contentType: type,
                platform: audience,
                prompt,
                tone,
                faithMode,
            };
            const response = await ContentService.getInstance().generateContent(req);
            if (response.success && response.data?.content) {
                setResult(response.data.content);
                // Track analytics: content_generation_success
                // TODO: Integrate analytics tracking here
            } else {
                setError('Failed to generate content.');
                // Track analytics: content_generation_failed
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate content.');
            // Track analytics: content_generation_failed
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        await saveItem({
            content: result,
            templateName: selectedTemplate,
            faithMode,
            source: 'generated',
            tone,
        });
        setTimeout(() => { }, 500);
        alert('Saved!');
    };

    return (
        <Container>
            <Header>AI Content Generator</Header>
            <Section>
                <Label>Quick Templates</Label>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.md }}>
                    {TEMPLATES.map((tpl) => (
                        <Button
                            key={tpl.value}
                            title={tpl.label}
                            variant={selectedTemplate === tpl.value ? 'gold' : 'primary'}
                            onPress={() => handleTemplatePick(tpl)}
                            style={{ marginRight: theme.spacing.sm }}
                        />
                    ))}
                </ScrollView>
            </Section>
            <Section>
                <Label>Prompt</Label>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="Describe your content idea..."
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 80 }}
                />
            </Section>
            <DropdownRow>
                <Section style={{ flex: 1 }}>
                    <Label>Tone</Label>
                    <TextInput
                        value={tone}
                        onChangeText={setTone}
                        placeholder="Tone (e.g. inspirational)"
                    />
                </Section>
                <Section style={{ flex: 1 }}>
                    <Label>Type</Label>
                    <TextInput
                        value={type}
                        onChangeText={setType}
                        placeholder="Type (e.g. post)"
                    />
                </Section>
                <Section style={{ flex: 1 }}>
                    <Label>Audience</Label>
                    <TextInput
                        value={audience}
                        onChangeText={setAudience}
                        placeholder="Audience (e.g. general)"
                    />
                </Section>
            </DropdownRow>
            <Button title={loading ? 'Generating...' : 'Generate'} onPress={handleGenerate} loading={loading} />
            {error && <Affirmation style={{ color: theme.colors.gold }}>{error}</Affirmation>}
            {result ? (
                <>
                    <Card>
                        <ResultText>{result}</ResultText>
                        {faithMode ? (
                            <Affirmation>
                                God gave you this idea. Steward it with boldness.
                            </Affirmation>
                        ) : (
                            <Affirmation>
                                {affirmation}
                            </Affirmation>
                        )}
                    </Card>
                    <Button title="Save to Library" onPress={handleSave} style={{ marginTop: 12 }} />
                </>
            ) : null}
        </Container>
    );
} 