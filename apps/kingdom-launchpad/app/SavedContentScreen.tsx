import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { Button } from '../../../packages/ui/Button';
import { useSavedContent, SavedContentItem } from '../../../packages/hooks/useSavedContent';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { View, FlatList, Modal, Text, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const CardPreview = styled(Card) <{ faithMode: boolean }>`
  border-width: 2px;
  border-color: ${({ faithMode, theme }) =>
        faithMode ? theme.colors.gold : theme.colors.silverGray};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  box-shadow: ${({ faithMode }) =>
        faithMode ? '0 0 12px #F2C94C55' : '0 2px 8px rgba(44,62,80,0.08)'};
`;

const ContentPreview = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin-bottom: 8px;
`;

const Badge = styled.Text`
  background-color: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.header};
  padding: 2px 8px;
  border-radius: 8px;
  align-self: flex-start;
  margin-bottom: 4px;
`;

const DateText = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-size: 12px;
  margin-bottom: 4px;
`;

const TagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const Tag = styled.Text`
  background-color: ${({ theme }) => theme.colors.silverGray};
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-size: 11px;
  border-radius: 6px;
  padding: 2px 6px;
  margin-right: 4px;
  margin-bottom: 2px;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: 16px;
  margin: 40px 16px;
  flex: 1;
  justify-content: center;
`;

const Motivational = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 14px;
  margin-top: 12px;
  text-align: center;
`;

export default function SavedContentScreen() {
    const theme = useTheme();
    const { items, deleteItem, reload } = useSavedContent();
    const { faithMode } = useFaithMode();
    const [selected, setSelected] = useState<SavedContentItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCopy = async (content: string) => {
        await Clipboard.setStringAsync(content);
        Alert.alert('Copied!', 'Content copied to clipboard.');
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete', 'Are you sure you want to delete this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => { await deleteItem(id); reload(); } },
        ]);
    };

    const renderItem = ({ item }: { item: SavedContentItem }) => (
        <TouchableOpacity onPress={() => { setSelected(item); setModalVisible(true); }}>
            <CardPreview faithMode={item.faithMode}>
                {item.faithMode && <Badge>✝️ Faith</Badge>}
                <ContentPreview numberOfLines={3}>{item.content}</ContentPreview>
                {item.templateName && <Text style={{ color: theme.colors.gold, fontSize: 13 }}>Template: {item.templateName}</Text>}
                <DateText>{new Date(item.dateCreated).toLocaleString()}</DateText>
                <TagRow>
                    {item.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </TagRow>
            </CardPreview>
        </TouchableOpacity>
    );

    return (
        <Container>
            <Header>Saved Content Library</Header>
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{ color: theme.colors.silverGray, textAlign: 'center', marginTop: 40 }}>No saved content yet.</Text>}
            />
            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
                <ModalContent>
                    {selected && (
                        <>
                            {selected.faithMode && <Badge>✝️ Faith</Badge>}
                            <ContentPreview style={{ fontSize: 18 }}>{selected.content}</ContentPreview>
                            {selected.faithMode ? (
                                <Motivational>“Let your work be worship.” (Scripture overlay coming soon)</Motivational>
                            ) : (
                                <Motivational>Keep building. You’re onto something.</Motivational>
                            )}
                            <DateText>{new Date(selected.dateCreated).toLocaleString()}</DateText>
                            <TagRow>
                                {selected.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                            </TagRow>
                            <Button title="Copy to Clipboard" onPress={() => handleCopy(selected.content)} style={{ marginTop: 12 }} />
                            <Button title="Delete" variant="gold" onPress={() => handleDelete(selected.id)} style={{ marginTop: 8 }} />
                            <Button title="Close" onPress={() => setModalVisible(false)} style={{ marginTop: 8 }} />
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Container>
    );
} 