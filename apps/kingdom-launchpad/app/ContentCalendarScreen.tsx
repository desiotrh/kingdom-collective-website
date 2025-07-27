import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch, PanGestureHandler, State } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { TextInput as StyledTextInput } from '../../../packages/ui/TextInput';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Animated, PanResponder } from 'react-native';

// Types
interface ContentBlock {
    id: string;
    title: string;
    platforms: string[];
    caption: string;
    hashtags: string[];
    fileUrl?: string;
    scheduledDate: Date;
    status: 'draft' | 'scheduled' | 'posted';
    isAnointed?: boolean;
    template?: boolean;
    category: 'faith' | 'business' | 'personal' | 'promo';
    templateType?: 'devotional' | 'testimonial' | 'reel' | 'promotion';
    aiOptimized?: boolean;
}

interface CalendarDay {
    date: Date;
    contentBlocks: ContentBlock[];
    isCurrentMonth: boolean;
    isToday: boolean;
}

interface ContentTemplate {
    id: string;
    name: string;
    type: 'devotional' | 'testimonial' | 'reel' | 'promotion';
    caption: string;
    hashtags: string[];
    category: 'faith' | 'business' | 'personal' | 'promo';
    platforms: string[];
}

// Constants
const PLATFORMS = ['TikTok', 'Instagram', 'Facebook', 'YouTube Shorts', 'Pinterest'];
const STATUS_COLORS = {
    draft: '#6B7280',
    scheduled: '#F59E0B',
    posted: '#10B981'
};

const CATEGORY_COLORS = {
    faith: '#8B5CF6',
    business: '#3B82F6',
    personal: '#10B981',
    promo: '#F59E0B'
};

const VERSES_OF_THE_DAY = [
    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
    "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
    "I can do all things through Christ who strengthens me. - Philippians 4:13",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9",
    "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven. - Matthew 5:16"
];

const CONTENT_TEMPLATES: ContentTemplate[] = [
    {
        id: '1',
        name: 'Daily Devotional',
        type: 'devotional',
        caption: 'Today\'s reminder: {scripture_verse}\n\n{personal_reflection}\n\n#faith #devotional #dailyinspiration',
        hashtags: ['faith', 'devotional', 'dailyinspiration', 'blessed'],
        category: 'faith',
        platforms: ['Instagram', 'Facebook']
    },
    {
        id: '2',
        name: 'Testimonial Share',
        type: 'testimonial',
        caption: 'God is faithful! 🙏\n\n{testimonial_story}\n\nWhat has God done in your life recently? Share below! 👇\n\n#testimony #faithful #grateful',
        hashtags: ['testimony', 'faithful', 'grateful', 'blessed'],
        category: 'faith',
        platforms: ['Instagram', 'Facebook', 'TikTok']
    },
    {
        id: '3',
        name: 'Business Tip',
        type: 'promotion',
        caption: '💡 Business Tip: {business_insight}\n\n{how_to_apply}\n\n#entrepreneur #business #kingdombusiness',
        hashtags: ['entrepreneur', 'business', 'kingdombusiness', 'tips'],
        category: 'business',
        platforms: ['LinkedIn', 'Instagram', 'Facebook']
    },
    {
        id: '4',
        name: 'Reel Template',
        type: 'reel',
        caption: 'Quick tip for {target_audience} 👇\n\n{main_point}\n\n{call_to_action}\n\n#reel #tip #{niche}',
        hashtags: ['reel', 'tip', 'viral', 'trending'],
        category: 'promo',
        platforms: ['Instagram', 'TikTok']
    }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const CalendarHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const MonthYear = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 20px;
  font-weight: bold;
`;

const ViewToggle = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.silverGray};
  border-radius: 8px;
  padding: 2px;
`;

const ToggleButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: 6px;
  background-color: ${({ active, theme }) => active ? theme.colors.sapphireBlue : 'transparent'};
`;

const ToggleText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const CalendarGrid = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const WeekRow = styled.View`
  flex-direction: row;
  margin-bottom: 2px;
`;

const DayCell = styled.TouchableOpacity<{ isCurrentMonth: boolean; isToday: boolean; hasContent: boolean }>`
  flex: 1;
  height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.silverGray};
  padding: 4px;
  background-color: ${({ isCurrentMonth, isToday, hasContent, theme }) =>
        !isCurrentMonth ? theme.colors.silverGray + '40' :
            isToday ? theme.colors.gold + '20' :
                hasContent ? theme.colors.sapphireBlue + '10' : theme.colors.cloudWhite
    };
`;

const DayNumber = styled.Text<{ isCurrentMonth: boolean; isToday: boolean }>`
  color: ${({ isCurrentMonth, isToday, theme }) =>
        !isCurrentMonth ? theme.colors.silverGray :
            isToday ? theme.colors.gold : theme.colors.sapphireBlue
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: ${({ isToday }) => isToday ? 'bold' : 'normal'};
`;

const ContentIndicator = styled.View<{ status: string; category: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ status, category }) => {
        if (status === 'posted') return STATUS_COLORS.posted;
        if (status === 'scheduled') return STATUS_COLORS.scheduled;
        return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
    }};
  margin-top: 2px;
`;

const DraggableContentBlock = styled(Animated.View) <{ category: string }>`
  background-color: ${({ category }) => CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] + '20'};
  border: 2px solid ${({ category }) => CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]};
  border-radius: 6px;
  padding: 4px;
  margin: 2px;
`;

const TemplateCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.silverGray + '20'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TemplateName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TemplateDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const BulkActionBar = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.sapphireBlue};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const BulkActionText = styled.Text`
  color: ${({ theme }) => theme.colors.cloudWhite};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  flex: 1;
`;

const CategoryFilter = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CategoryButton = styled.TouchableOpacity<{ active: boolean; category: string }>`
  background-color: ${({ active, category, theme }) =>
        active ? CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] : theme.colors.silverGray
    };
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: 6px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const AIOptimizationBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const AIOptimizationText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export default function ContentCalendarScreen() {
    const { faithMode } = useFaithMode();
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [bulkSelection, setBulkSelection] = useState<string[]>([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [draggedBlock, setDraggedBlock] = useState<ContentBlock | null>(null);
    const [aiOptimized, setAiOptimized] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [status, setStatus] = useState<'draft' | 'scheduled' | 'posted'>('draft');
    const [isAnointed, setIsAnointed] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState<'faith' | 'business' | 'personal' | 'promo'>('faith');
    const [templateType, setTemplateType] = useState<'devotional' | 'testimonial' | 'reel' | 'promotion'>('devotional');

    // Generate calendar data
    const generateCalendarDays = (): CalendarDay[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: CalendarDay[] = [];
        const today = new Date();

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayContentBlocks = contentBlocks.filter(block => {
                const blockDate = new Date(block.scheduledDate);
                return blockDate.toDateString() === date.toDateString();
            });

            days.push({
                date,
                contentBlocks: dayContentBlocks,
                isCurrentMonth: date.getMonth() === month,
                isToday: date.toDateString() === today.toDateString()
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setScheduledDate(date);
        setShowModal(true);
    };

    const handleSaveBlock = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        if (selectedPlatforms.length === 0) {
            Alert.alert('Error', 'Please select at least one platform');
            return;
        }

        const newBlock: ContentBlock = {
            id: editingBlock?.id || Date.now().toString(),
            title: title.trim(),
            platforms: selectedPlatforms,
            caption: caption.trim(),
            hashtags: hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
            scheduledDate,
            status,
            isAnointed: faithMode ? isAnointed : false,
            category,
            templateType,
            aiOptimized
        };

        if (editingBlock) {
            setContentBlocks(blocks => blocks.map(block =>
                block.id === editingBlock.id ? newBlock : block
            ));
        } else {
            setContentBlocks(blocks => [...blocks, newBlock]);
        }

        setShowModal(false);
        resetForm();
    };

    const handleDeleteBlock = (blockId: string) => {
        Alert.alert(
            'Delete Content',
            'Are you sure you want to delete this content block?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setContentBlocks(blocks => blocks.filter(block => block.id !== blockId));
                        setShowModal(false);
                        resetForm();
                    }
                }
            ]
        );
    };

    const handleEditBlock = (block: ContentBlock) => {
        setEditingBlock(block);
        setTitle(block.title);
        setCaption(block.caption);
        setHashtags(block.hashtags.join(', '));
        setSelectedPlatforms(block.platforms);
        setScheduledDate(new Date(block.scheduledDate));
        setStatus(block.status);
        setIsAnointed(block.isAnointed || false);
        setCategory(block.category);
        setTemplateType(block.templateType || 'devotional');
        setAiOptimized(block.aiOptimized || false);
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingBlock(null);
        setTitle('');
        setCaption('');
        setHashtags('');
        setSelectedPlatforms([]);
        setScheduledDate(new Date());
        setStatus('draft');
        setIsAnointed(false);
        setCategory('faith');
        setTemplateType('devotional');
        setAiOptimized(false);
    };

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const getFilteredBlocks = () => {
        return contentBlocks.filter(block => {
            const platformMatch = selectedPlatform === 'all' || block.platforms.includes(selectedPlatform);
            const statusMatch = selectedStatus === 'all' || block.status === selectedStatus;
            const categoryMatch = selectedCategory === 'all' || block.category === selectedCategory;
            return platformMatch && statusMatch && categoryMatch;
        });
    };

    const handleBulkSelect = (blockId: string) => {
        setBulkSelection(prev =>
            prev.includes(blockId)
                ? prev.filter(id => id !== blockId)
                : [...prev, blockId]
        );
    };

    const handleBulkReschedule = () => {
        if (bulkSelection.length === 0) return;

        Alert.alert(
            'Bulk Reschedule',
            `Reschedule ${bulkSelection.length} posts to today?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reschedule',
                    onPress: () => {
                        setContentBlocks(blocks => blocks.map(block =>
                            bulkSelection.includes(block.id)
                                ? { ...block, scheduledDate: new Date() }
                                : block
                        ));
                        setBulkSelection([]);
                    }
                }
            ]
        );
    };

    const handleTemplateSelect = (template: ContentTemplate) => {
        setCaption(template.caption);
        setHashtags(template.hashtags.join(', '));
        setSelectedPlatforms(template.platforms);
        setCategory(template.category);
        setTemplateType(template.type);
        setShowTemplates(false);
    };

    const handleAIOptimization = () => {
        setAiOptimized(true);
        // Mock AI optimization
        setTimeout(() => {
            setCaption(prev => prev + '\n\n#viral #trending #fyp');
            setHashtags(prev => prev + ', viral, trending, fyp');
            Alert.alert('AI Optimization', 'Content optimized for maximum engagement!');
        }, 1000);
    };

    const getVerseOfTheDay = () => {
        const today = new Date();
        return VERSES_OF_THE_DAY[today.getDate() % VERSES_OF_THE_DAY.length];
    };

    const getEncouragementMessage = () => {
        const postedCount = contentBlocks.filter(block => block.status === 'posted').length;
        if (postedCount >= 5) {
            return "You planted 5 seeds this week! Your legacy is growing stronger every day.";
        } else if (postedCount >= 3) {
            return "You're showing up for legacy! Keep building your Kingdom impact.";
        } else {
            return "Every post is a seed planted. Your obedience creates ripples of change.";
        }
    };

    return (
        <Container>
            <Header>Content Calendar</Header>

            {bulkSelection.length > 0 && (
                <BulkActionBar>
                    <BulkActionText>{bulkSelection.length} items selected</BulkActionText>
                    <Button title="Reschedule" onPress={handleBulkReschedule} />
                    <Button title="Clear" onPress={() => setBulkSelection([])} />
                </BulkActionBar>
            )}

            <CalendarHeader>
                <MonthYear>
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </MonthYear>
                <ViewToggle>
                    <ToggleButton
                        active={viewMode === 'month'}
                        onPress={() => setViewMode('month')}
                    >
                        <ToggleText active={viewMode === 'month'}>Month</ToggleText>
                    </ToggleButton>
                    <ToggleButton
                        active={viewMode === 'week'}
                        onPress={() => setViewMode('week')}
                    >
                        <ToggleText active={viewMode === 'week'}>Week</ToggleText>
                    </ToggleButton>
                </ViewToggle>
            </CalendarHeader>

            <CategoryFilter>
                <CategoryButton
                    active={selectedCategory === 'all'}
                    category="all"
                    onPress={() => setSelectedCategory('all')}
                >
                    <CategoryText active={selectedCategory === 'all'}>All</CategoryText>
                </CategoryButton>
                {Object.keys(CATEGORY_COLORS).map(cat => (
                    <CategoryButton
                        key={cat}
                        active={selectedCategory === cat}
                        category={cat}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <CategoryText active={selectedCategory === cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</CategoryText>
                    </CategoryButton>
                ))}
            </CategoryFilter>

            <CalendarGrid>
                <WeekRow>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <View key={day} style={{ flex: 1, alignItems: 'center', padding: 8 }}>
                            <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: 'bold' }}>{day}</Text>
                        </View>
                    ))}
                </WeekRow>

                {calendarDays.map((day, index) => (
                    <WeekRow key={index}>
                        {Array.from({ length: 7 }, (_, i) => {
                            const dayData = calendarDays[index * 7 + i];
                            if (!dayData) return <View key={i} style={{ flex: 1 }} />;

                            const hasContent = dayData.contentBlocks.length > 0;
                            const isEmpty = dayData.contentBlocks.length === 0 && dayData.isCurrentMonth;

                            return (
                                <DayCell
                                    key={i}
                                    isCurrentMonth={dayData.isCurrentMonth}
                                    isToday={dayData.isToday}
                                    hasContent={hasContent}
                                    onPress={() => handleDateSelect(dayData.date)}
                                >
                                    <DayNumber
                                        isCurrentMonth={dayData.isCurrentMonth}
                                        isToday={dayData.isToday}
                                    >
                                        {dayData.date.getDate()}
                                    </DayNumber>

                                    {dayData.contentBlocks.map((block, blockIndex) => (
                                        <ContentIndicator
                                            key={blockIndex}
                                            status={block.status}
                                            category={block.category}
                                        />
                                    ))}

                                    {faithMode && isEmpty && (
                                        <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -10 }] }}>
                                            <Text style={{ color: '#F59E0B', fontSize: 10, textAlign: 'center' }}>{getVerseOfTheDay()}</Text>
                                        </View>
                                    )}
                                </DayCell>
                            );
                        })}
                    </WeekRow>
                ))}
            </CalendarGrid>

            <Button
                title="Use Template"
                onPress={() => setShowTemplates(true)}
                style={{ marginBottom: 16 }}
            />

            <Modal visible={showTemplates} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Content Templates</Header>
                            {CONTENT_TEMPLATES.map(template => (
                                <TemplateCard key={template.id} onPress={() => handleTemplateSelect(template)}>
                                    <TemplateName>{template.name}</TemplateName>
                                    <TemplateDescription>{template.caption.substring(0, 100)}...</TemplateDescription>
                                </TemplateCard>
                            ))}
                            <Button title="Close" onPress={() => setShowTemplates(false)} />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            <Modal visible={showModal} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>{editingBlock ? 'Edit Content' : 'New Content'}</Header>

                            <FormSection>
                                <Label>Title *</Label>
                                <StyledTextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter content title..."
                                />
                            </FormSection>

                            <FormSection>
                                <Label>Category</Label>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {Object.keys(CATEGORY_COLORS).map(cat => (
                                        <Button
                                            key={cat}
                                            title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            variant={category === cat ? 'gold' : 'primary'}
                                            onPress={() => setCategory(cat as any)}
                                            style={{ marginRight: 8 }}
                                        />
                                    ))}
                                </ScrollView>
                            </FormSection>

                            <FormSection>
                                <Label>Platforms *</Label>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {PLATFORMS.map(platform => (
                                        <Button
                                            key={platform}
                                            title={platform}
                                            variant={selectedPlatforms.includes(platform) ? 'gold' : 'primary'}
                                            onPress={() => togglePlatform(platform)}
                                            style={{ marginRight: 8 }}
                                        />
                                    ))}
                                </ScrollView>
                            </FormSection>

                            <FormSection>
                                <Label>Caption</Label>
                                <StyledTextInput
                                    value={caption}
                                    onChangeText={setCaption}
                                    placeholder="Write your caption..."
                                    multiline
                                    numberOfLines={4}
                                />
                            </FormSection>

                            <FormSection>
                                <Label>Hashtags</Label>
                                <StyledTextInput
                                    value={hashtags}
                                    onChangeText={setHashtags}
                                    placeholder="Enter hashtags separated by commas..."
                                />
                            </FormSection>

                            <FormSection>
                                <Label>Schedule Date</Label>
                                <Button
                                    title={scheduledDate.toLocaleDateString()}
                                    onPress={() => setShowDatePicker(true)}
                                />
                            </FormSection>

                            <FormSection>
                                <Label>Status</Label>
                                <View style={{ flexDirection: 'row' }}>
                                    {(['draft', 'scheduled', 'posted'] as const).map(statusOption => (
                                        <Button
                                            key={statusOption}
                                            title={statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                                            variant={status === statusOption ? 'gold' : 'primary'}
                                            onPress={() => setStatus(statusOption)}
                                            style={{ marginRight: 8, flex: 1 }}
                                        />
                                    ))}
                                </View>
                            </FormSection>

                            {faithMode && (
                                <AnointToggle>
                                    <AnointText>Anoint This Post</AnointText>
                                    <Switch
                                        value={isAnointed}
                                        onValueChange={setIsAnointed}
                                        trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                                        thumbColor={isAnointed ? '#F97316' : '#F3F4F6'}
                                    />
                                </AnointToggle>
                            )}

                            <AIOptimizationBanner>
                                <Ionicons name="sparkles" size={20} color="#F59E0B" />
                                <AIOptimizationText>AI Optimization Available</AIOptimizationText>
                                <Button title="Optimize" onPress={handleAIOptimization} />
                            </AIOptimizationBanner>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Button
                                    title="Save"
                                    onPress={handleSaveBlock}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                {editingBlock && (
                                    <Button
                                        title="Delete"
                                        onPress={() => handleDeleteBlock(editingBlock.id)}
                                        style={{ flex: 1, marginLeft: 8 }}
                                    />
                                )}
                            </View>

                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                style={{ marginTop: 8 }}
                            />
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={scheduledDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setScheduledDate(selectedDate);
                        }
                    }}
                />
            )}
        </Container>
    );
} 