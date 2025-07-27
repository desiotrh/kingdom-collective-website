import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { TextInput } from '../../../packages/ui/TextInput';
import { Card } from '../../../packages/ui/Card';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { useProductPlans } from '../../../packages/hooks/useProductPlans';
import { View, Text, Alert } from 'react-native';
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

const Status = styled.Text`
  color: ${({ connected, theme }) => connected ? theme.colors.gold : theme.colors.silverGray};
  font-size: 14px;
  margin-bottom: 8px;
`;

export default function SellProductScreen() {
    const theme = useTheme();
    const { faithMode } = useFaithMode();
    const { plans } = useProductPlans();
    const [selected] = useState(plans[0] || null); // For now, use the first plan
    const [price, setPrice] = useState(selected?.price?.toString() || '');
    const [description, setDescription] = useState(selected?.problem || '');
    const [stripeConnected, setStripeConnected] = useState(false);
    const [checkoutLink, setCheckoutLink] = useState('');

    // Mock Stripe connect
    const handleConnectStripe = () => {
        setTimeout(() => {
            setStripeConnected(true);
            Alert.alert('Stripe Connected', 'Your Stripe account is now connected.');
        }, 1000);
    };

    // Mock create checkout link
    const handleCreateCheckout = () => {
        if (!stripeConnected) {
            Alert.alert('Connect Stripe', 'Please connect your Stripe account first.');
            return;
        }
        setTimeout(() => {
            const link = `https://buy.stripe.com/test_checkout_${Math.random().toString(36).slice(2)}`;
            setCheckoutLink(link);
            Alert.alert('Checkout Link Created', 'You can now share your checkout link.');
        }, 1000);
    };

    const handleCopy = async () => {
        if (checkoutLink) {
            await Clipboard.setStringAsync(checkoutLink);
            Alert.alert('Copied!', 'Checkout link copied to clipboard.');
        }
    };

    return (
        <Container>
            <Header>Sell Your Product</Header>
            <Section>
                <Label>Product Name</Label>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.sapphireBlue }}>{selected?.name || 'No product found'}</Text>
                <Label>Description</Label>
                <TextInput value={description} onChangeText={setDescription} multiline numberOfLines={3} style={{ minHeight: 60 }} />
                <Label>Price (USD)</Label>
                <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />
            </Section>
            <Section>
                <Label>Stripe Connection</Label>
                <Status connected={stripeConnected}>{stripeConnected ? 'Connected' : 'Not Connected'}</Status>
                <Button title={stripeConnected ? 'Connected' : 'Connect with Stripe'} onPress={handleConnectStripe} variant={stripeConnected ? 'gold' : 'primary'} />
            </Section>
            <Section>
                <Label>Checkout Link</Label>
                {checkoutLink ? (
                    <>
                        <Text style={{ color: theme.colors.sapphireBlue, marginBottom: 8 }}>{checkoutLink}</Text>
                        <Button title="Copy Link" onPress={handleCopy} />
                    </>
                ) : (
                    <Button title="Create Checkout Link" onPress={handleCreateCheckout} />
                )}
            </Section>
            {faithMode ? (
                <Text style={{ color: theme.colors.gold, fontSize: 15, marginTop: 16, textAlign: 'center' }}>
                    God is funding His vision through your hands. Your work is worthy of value and compensation.
                </Text>
            ) : (
                <Text style={{ color: theme.colors.gold, fontSize: 15, marginTop: 16, textAlign: 'center' }}>
                    Your gifts deserve to be supported. Value-driven products transform lives.
                </Text>
            )}
        </Container>
    );
} 