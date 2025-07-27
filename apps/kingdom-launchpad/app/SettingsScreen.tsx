import React from 'react';
import styled from 'styled-components/native';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Switch } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 18px;
`;

export default function SettingsScreen() {
    const { faithMode, encouragementMode, setFaithMode } = useFaithMode();

    return (
        <Container>
            <Header>Settings</Header>
            <Row>
                <Label>Faith Mode</Label>
                <Switch
                    value={faithMode}
                    onValueChange={setFaithMode}
                    thumbColor={faithMode ? '#F2C94C' : '#E0E0E0'}
                    trackColor={{ true: '#F2C94C', false: '#E0E0E0' }}
                />
            </Row>
            <Row>
                <Label>Encouragement Mode</Label>
                <Switch
                    value={encouragementMode}
                    onValueChange={() => setFaithMode(false)}
                    thumbColor={encouragementMode ? '#F2C94C' : '#E0E0E0'}
                    trackColor={{ true: '#F2C94C', false: '#E0E0E0' }}
                />
            </Row>
        </Container>
    );
} 