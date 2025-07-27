import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { TextInput } from '../../../packages/ui/TextInput';
import { Card } from '../../../packages/ui/Card';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useProductPlans } from '../../../packages/hooks/useProductPlans';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const PRODUCT_TYPES = [
    'eBook', 'Course', 'Template', 'Journal', 'Coaching', 'Membership', 'Workshop', 'Other'
];
const PLATFORMS = [
    'Etsy', 'TikTok Shop', 'Beacons', 'Shopify', 'Other'
];

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

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FeatureInput = styled(TextInput)`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const Tag = styled.Text`
  background-color: ${({ theme }) => theme.colors.silverGray};
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-size: 13px;
  border-radius: 6px;
  padding: 2px 8px;
  margin-right: 4px;
  margin-bottom: 2px;
`;

const BlessingBox = styled.View`
  background-color: ${({ theme }) => theme.colors.gold}22;
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export default function ProductBuilderScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { savePlan } = useProductPlans();

    const [name, setName] = useState('');
    const [type, setType] = useState(PRODUCT_TYPES[0]);
    const [audience, setAudience] = useState('');
    const [problem, setProblem] = useState('');
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState('');
    const [price, setPrice] = useState('');
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [goalDate, setGoalDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    // Smart suggestions
    const suggestPrice = () => {
        if (type === 'eBook') return 9 + features.length * 2;
        if (type === 'Course') return 49 + features.length * 10;
        if (type === 'Template') return 7 + features.length * 3;
        if (type === 'Journal') return 15 + features.length * 2;
        if (type === 'Coaching') return 99 + features.length * 20;
        return 20 + features.length * 5;
    };
    const suggestPlatforms = () => {
        if (type === 'Template') return ['Etsy', 'Beacons'];
        if (type === 'eBook') return ['Etsy', 'Shopify'];
        if (type === 'Course' || type === 'Coaching') return ['Beacons', 'Shopify'];
        return [];
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput('');
        }
    };
    const handleRemoveFeature = (idx: number) => {
        setFeatures(features.filter((_, i) => i !== idx));
    };
    const handlePlatformToggle = (platform: string) => {
        setPlatforms(platforms.includes(platform)
            ? platforms.filter(p => p !== platform)
            : [...platforms, platform]);
    };
    const handleAutoSuggest = () => {
        setPrice(suggestPrice().toString());
        setPlatforms(suggestPlatforms());
    };
    const handleSave = async () => {
        if (!name || !audience || !problem || features.length === 0 || !price) {
            Alert.alert('Missing Fields', 'Please fill out all required fields.');
            return;
        }
        await savePlan({
            name,
            type,
            audience,
            problem,
            features,
            price: parseFloat(price),
            platforms,
            goalDate: goalDate.toISOString(),
            faithMode,
        });
        Alert.alert('Saved!', 'Your product plan has been saved.');
        setName(''); setType(PRODUCT_TYPES[0]); setAudience(''); setProblem(''); setFeatures([]); setFeatureInput(''); setPrice(''); setPlatforms([]); setGoalDate(new Date());
    };

    return (
        <Container>
            <Header>Product Builder</Header>
            <Section>
                <Label>Product Name</Label>
                <TextInput value={name} onChangeText={setName} placeholder="e.g. Kingdom Journal" />
            </Section>
            <Section>
                <Label>Product Type</Label>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.sm }}>
                    {PRODUCT_TYPES.map(pt => (
                        <Button
                            key={pt}
                            title={pt}
                            variant={type === pt ? 'gold' : 'primary'}
                            onPress={() => { setType(pt); handleAutoSuggest(); }}
                            style={{ marginRight: theme.spacing.sm }}
                        />
                    ))}
                </ScrollView>
            </Section>
            <Section>
                <Label>Audience/Niche</Label>
                <TextInput value={audience} onChangeText={setAudience} placeholder="e.g. Christian entrepreneurs" />
            </Section>
            <Section>
                <Label>Problem Solved</Label>
                <TextInput value={problem} onChangeText={setProblem} placeholder="What problem does this product solve?" multiline numberOfLines={3} style={{ minHeight: 60 }} />
            </Section>
            <Section>
                <Label>Key Features</Label>
                <Row>
                    <FeatureInput value={featureInput} onChangeText={setFeatureInput} placeholder="Add a feature..." onSubmitEditing={handleAddFeature} />
                    <Button title="Add" onPress={handleAddFeature} />
                </Row>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {features.map((f, idx) => (
                        <TouchableOpacity key={idx} onPress={() => handleRemoveFeature(idx)}>
                            <Tag>{f} ✕</Tag>
                        </TouchableOpacity>
                    ))}
                </View>
            </Section>
            <Section>
                <Label>Price</Label>
                <TextInput value={price} onChangeText={setPrice} placeholder="$" keyboardType="numeric" />
                <Button title="Auto-Suggest Price" onPress={() => setPrice(suggestPrice().toString())} style={{ marginTop: theme.spacing.sm }} />
            </Section>
            <Section>
                <Label>Platform to Sell On</Label>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.sm }}>
                    {PLATFORMS.map(p => (
                        <Button
                            key={p}
                            title={p}
                            variant={platforms.includes(p) ? 'gold' : 'primary'}
                            onPress={() => handlePlatformToggle(p)}
                            style={{ marginRight: theme.spacing.sm }}
                        />
                    ))}
                </ScrollView>
                <Button title="Auto-Suggest Platforms" onPress={() => setPlatforms(suggestPlatforms())} style={{ marginTop: theme.spacing.sm }} />
            </Section>
            <Section>
                <Label>Launch Goal Date</Label>
                <Button title={goalDate.toDateString()} onPress={() => setShowDate(true)} />
                {showDate && (
                    <DateTimePicker
                        value={goalDate}
                        mode="date"
                        display="default"
                        onChange={(_, date) => { setShowDate(false); if (date) setGoalDate(date); }}
                    />
                )}
            </Section>
            {faithMode ? (
                <BlessingBox>
                    <Text style={{ color: theme.colors.sapphireBlue, fontFamily: theme.fonts.body, fontSize: 15, marginBottom: 6 }}>
                        “Write the vision, make it plain...” (Habakkuk 2:2)
                    </Text>
                    <Text style={{ color: theme.colors.gold, fontSize: 14 }}>
                        Father, bless this idea with clarity, creativity, and favor.
                    </Text>
                </BlessingBox>
            ) : (
                <BlessingBox>
                    <Text style={{ color: theme.colors.sapphireBlue, fontFamily: theme.fonts.body, fontSize: 15, marginBottom: 6 }}>
                        Bold ideas deserve bold execution.
                    </Text>
                    <Text style={{ color: theme.colors.gold, fontSize: 14 }}>
                        Clarity follows obedience.
                    </Text>
                </BlessingBox>
            )}
            <Button title="Save Product Plan" onPress={handleSave} style={{ marginTop: theme.spacing.lg }} />
        </Container>
    );
} 