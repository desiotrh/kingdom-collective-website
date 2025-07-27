import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

// Types
interface Creator {
    id: string;
    name: string;
    niche: string;
    followers: number;
    engagement: number;
    location: string;
    bio: string;
    avatar: string;
    isOnline: boolean;
    collaborationInterests: string[];
    faithBased: boolean;
}

interface CollaborationRequest {
    id: string;
    fromCreator: Creator;
    toCreator: Creator;
    type: 'guest_post' | 'joint_venture' | 'mentorship' | 'challenge';
    title: string;
    description: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    date: Date;
    platform: string;
}

interface CommunityChallenge {
    id: string;
    title: string;
    description: string;
    category: 'faith' | 'business' | 'personal' | 'creative';
    startDate: Date;
    endDate: Date;
    participants: number;
    maxParticipants: number;
    hashtag: string;
    prize?: string;
    isActive: boolean;
}

interface JointVenture {
    id: string;
    title: string;
    description: string;
    creators: Creator[];
    revenue: number;
    status: 'planning' | 'active' | 'completed';
    startDate: Date;
    endDate?: Date;
    platform: string;
}

interface MentorshipProgram {
    id: string;
    mentor: Creator;
    mentee: Creator;
    topic: string;
    duration: string;
    status: 'pending' | 'active' | 'completed';
    startDate: Date;
    sessions: number;
    totalSessions: number;
}

// Mock data
const mockCreators: Creator[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        niche: 'Faith-based Business',
        followers: 45000,
        engagement: 4.2,
        location: 'Nashville, TN',
        bio: 'Helping entrepreneurs build Kingdom-focused businesses',
        avatar: '👩‍💼',
        isOnline: true,
        collaborationInterests: ['guest_posts', 'joint_ventures', 'mentorship'],
        faithBased: true
    },
    {
        id: '2',
        name: 'Michael Chen',
        niche: 'Christian Lifestyle',
        followers: 32000,
        engagement: 5.1,
        location: 'Austin, TX',
        bio: 'Sharing daily faith inspiration and lifestyle tips',
        avatar: '👨‍💻',
        isOnline: false,
        collaborationInterests: ['challenges', 'guest_posts'],
        faithBased: true
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        niche: 'Kingdom Entrepreneurship',
        followers: 28000,
        engagement: 3.8,
        location: 'Miami, FL',
        bio: 'Building businesses that honor God and serve others',
        avatar: '👩‍💼',
        isOnline: true,
        collaborationInterests: ['joint_ventures', 'mentorship'],
        faithBased: true
    }
];

const mockChallenges: CommunityChallenge[] = [
    {
        id: '1',
        title: '7-Day Faith Challenge',
        description: 'Share one faith-based post daily for 7 days',
        category: 'faith',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 45,
        maxParticipants: 100,
        hashtag: '#7DayFaithChallenge',
        isActive: true
    },
    {
        id: '2',
        title: 'Kingdom Business Tips',
        description: 'Share your best business tip with faith integration',
        category: 'business',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        participants: 23,
        maxParticipants: 50,
        hashtag: '#KingdomBusinessTips',
        prize: 'Featured on our main page',
        isActive: true
    },
    {
        id: '3',
        title: 'Prayer Partner Challenge',
        description: 'Find a prayer partner and share your journey',
        category: 'faith',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        participants: 67,
        maxParticipants: 200,
        hashtag: '#PrayerPartnerChallenge',
        isActive: true
    }
];

const mockJointVentures: JointVenture[] = [
    {
        id: '1',
        title: 'Faith & Business Podcast',
        description: 'Weekly podcast discussing faith in entrepreneurship',
        creators: [mockCreators[0], mockCreators[2]],
        revenue: 2500,
        status: 'active',
        startDate: new Date('2024-01-01'),
        platform: 'Spotify & YouTube'
    },
    {
        id: '2',
        title: 'Kingdom Creator Course',
        description: 'Online course teaching faith-based content creation',
        creators: [mockCreators[1], mockCreators[0]],
        revenue: 0,
        status: 'planning',
        startDate: new Date('2024-02-01'),
        platform: 'Teachable'
    }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const CreatorCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const CreatorAvatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.gold + '20'};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const CreatorInfo = styled.View`
  flex: 1;
`;

const CreatorName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const CreatorNiche = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  margin-bottom: 4px;
`;

const CreatorStats = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const OnlineIndicator = styled.View<{ isOnline: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ isOnline }) => isOnline ? '#10B981' : '#6B7280'};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const ChallengeCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
`;

const ChallengeTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ChallengeDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ChallengeStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ChallengeStat = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const HashtagBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.sapphireBlue + '20'};
  border-radius: 12px;
  padding: 4px 8px;
  align-self: flex-start;
`;

const HashtagText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const VentureCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const VentureTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const VentureDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const VentureStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RevenueText = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ status }) =>
        status === 'active' ? '#10B981' :
            status === 'planning' ? '#F59E0B' :
                '#6B7280'
    };
  border-radius: 8px;
  padding: 4px 8px;
`;

const StatusText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const CollaborationRequestCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ theme }) => theme.colors.sapphireBlue};
`;

const RequestHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RequestTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const RequestType = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  text-transform: uppercase;
`;

const FaithModeBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const FaithModeText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const TabBar = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  background-color: ${({ active, theme }) => active ? theme.colors.sapphireBlue : theme.colors.silverGray + '20'};
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 8px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

export default function CollaborationScreen() {
    const { faithMode } = useFaithMode();
    const [activeTab, setActiveTab] = useState<'network' | 'challenges' | 'ventures' | 'requests'>('network');
    const [creators, setCreators] = useState<Creator[]>(mockCreators);
    const [challenges, setChallenges] = useState<CommunityChallenge[]>(mockChallenges);
    const [jointVentures, setJointVentures] = useState<JointVenture[]>(mockJointVentures);
    const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
    const [showCreateRequest, setShowCreateRequest] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const [loading, setLoading] = useState(false);

    const handleJoinChallenge = (challengeId: string) => {
        setChallenges(prev => prev.map(challenge =>
            challenge.id === challengeId
                ? { ...challenge, participants: challenge.participants + 1 }
                : challenge
        ));
        Alert.alert('Challenge Joined!', 'You\'ve successfully joined this community challenge.');
    };

    const handleCreateCollaboration = (creator: Creator) => {
        setSelectedCreator(creator);
        setShowCreateRequest(true);
    };

    const handleSendRequest = (type: string, title: string, description: string) => {
        if (!selectedCreator) return;

        const newRequest: CollaborationRequest = {
            id: Date.now().toString(),
            fromCreator: creators[0], // Current user
            toCreator: selectedCreator,
            type: type as any,
            title,
            description,
            status: 'pending',
            date: new Date(),
            platform: 'Instagram'
        };

        setCollaborationRequests(prev => [...prev, newRequest]);
        setShowCreateRequest(false);
        setSelectedCreator(null);
        Alert.alert('Request Sent!', 'Your collaboration request has been sent.');
    };

    const handleAcceptRequest = (requestId: string) => {
        setCollaborationRequests(prev => prev.map(request =>
            request.id === requestId
                ? { ...request, status: 'accepted' }
                : request
        ));
        Alert.alert('Request Accepted!', 'You\'ve accepted this collaboration request.');
    };

    const handleDeclineRequest = (requestId: string) => {
        setCollaborationRequests(prev => prev.map(request =>
            request.id === requestId
                ? { ...request, status: 'declined' }
                : request
        ));
        Alert.alert('Request Declined', 'You\'ve declined this collaboration request.');
    };

    const getFaithModeMessage = () => {
        return "Building Kingdom connections through authentic collaboration and faith-based partnerships.";
    };

    const renderNetworkTab = () => (
        <View>
            <Header>Creator Network</Header>
            {creators.map(creator => (
                <CreatorCard key={creator.id}>
                    <CreatorAvatar>
                        <Text style={{ fontSize: 24 }}>{creator.avatar}</Text>
                    </CreatorAvatar>
                    <CreatorInfo>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CreatorName>{creator.name}</CreatorName>
                            <OnlineIndicator isOnline={creator.isOnline} />
                        </View>
                        <CreatorNiche>{creator.niche}</CreatorNiche>
                        <CreatorStats>
                            {creator.followers.toLocaleString()} followers • {creator.engagement}% engagement
                        </CreatorStats>
                        <CreatorStats>{creator.location}</CreatorStats>
                    </CreatorInfo>
                    <Button
                        title="Connect"
                        onPress={() => handleCreateCollaboration(creator)}
                        style={{ marginLeft: 8 }}
                    />
                </CreatorCard>
            ))}
        </View>
    );

    const renderChallengesTab = () => (
        <View>
            <Header>Community Challenges</Header>
            {challenges.map(challenge => (
                <ChallengeCard key={challenge.id}>
                    <ChallengeTitle>{challenge.title}</ChallengeTitle>
                    <ChallengeDescription>{challenge.description}</ChallengeDescription>
                    <ChallengeStats>
                        <ChallengeStat>{challenge.participants}/{challenge.maxParticipants} participants</ChallengeStat>
                        <ChallengeStat>
                            {new Date(challenge.endDate).toLocaleDateString()} deadline
                        </ChallengeStat>
                    </ChallengeStats>
                    <HashtagBadge>
                        <HashtagText>{challenge.hashtag}</HashtagText>
                    </HashtagBadge>
                    {challenge.prize && (
                        <Text style={{ color: '#F59E0B', fontSize: 12, marginTop: 8 }}>
                            🏆 Prize: {challenge.prize}
                        </Text>
                    )}
                    <Button
                        title="Join Challenge"
                        onPress={() => handleJoinChallenge(challenge.id)}
                        style={{ marginTop: 8 }}
                    />
                </ChallengeCard>
            ))}
        </View>
    );

    const renderVenturesTab = () => (
        <View>
            <Header>Joint Ventures</Header>
            {jointVentures.map(venture => (
                <VentureCard key={venture.id}>
                    <VentureTitle>{venture.title}</VentureTitle>
                    <VentureDescription>{venture.description}</VentureDescription>
                    <VentureStats>
                        <RevenueText>${venture.revenue.toLocaleString()}</RevenueText>
                        <StatusBadge status={venture.status}>
                            <StatusText>{venture.status.toUpperCase()}</StatusText>
                        </StatusBadge>
                    </VentureStats>
                    <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
                        {venture.platform} • {venture.creators.map(c => c.name).join(' & ')}
                    </Text>
                </VentureCard>
            ))}
            <Button title="Create New Venture" onPress={() => Alert.alert('Coming Soon', 'Joint venture creation will be available soon!')} />
        </View>
    );

    const renderRequestsTab = () => (
        <View>
            <Header>Collaboration Requests</Header>
            {collaborationRequests.length === 0 ? (
                <Card>
                    <Text style={{ color: '#6B7280', fontSize: 16, textAlign: 'center', padding: 20 }}>
                        No collaboration requests yet. Connect with other creators to start collaborating!
                    </Text>
                </Card>
            ) : (
                collaborationRequests.map(request => (
                    <CollaborationRequestCard key={request.id}>
                        <RequestHeader>
                            <RequestTitle>{request.title}</RequestTitle>
                            <RequestType>{request.type.replace('_', ' ')}</RequestType>
                        </RequestHeader>
                        <Text style={{ color: '#374151', fontSize: 14, marginBottom: 8 }}>
                            {request.description}
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 8 }}>
                            From: {request.fromCreator.name} • {request.date.toLocaleDateString()}
                        </Text>
                        {request.status === 'pending' && (
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    title="Accept"
                                    onPress={() => handleAcceptRequest(request.id)}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                <Button
                                    title="Decline"
                                    onPress={() => handleDeclineRequest(request.id)}
                                    style={{ flex: 1, marginLeft: 8 }}
                                />
                            </View>
                        )}
                        {request.status !== 'pending' && (
                            <StatusBadge status={request.status}>
                                <StatusText>{request.status.toUpperCase()}</StatusText>
                            </StatusBadge>
                        )}
                    </CollaborationRequestCard>
                ))
            )}
        </View>
    );

    return (
        <Container>
            <Header>Collaboration & Community</Header>

            {faithMode && (
                <FaithModeBanner>
                    <Ionicons name="people" size={24} color="#F59E0B" />
                    <FaithModeText>{getFaithModeMessage()}</FaithModeText>
                </FaithModeBanner>
            )}

            <TabBar>
                <TabButton
                    active={activeTab === 'network'}
                    onPress={() => setActiveTab('network')}
                >
                    <TabText active={activeTab === 'network'}>Network</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'challenges'}
                    onPress={() => setActiveTab('challenges')}
                >
                    <TabText active={activeTab === 'challenges'}>Challenges</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'ventures'}
                    onPress={() => setActiveTab('ventures')}
                >
                    <TabText active={activeTab === 'ventures'}>Ventures</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'requests'}
                    onPress={() => setActiveTab('requests')}
                >
                    <TabText active={activeTab === 'requests'}>Requests</TabText>
                </TabButton>
            </TabBar>

            {activeTab === 'network' && renderNetworkTab()}
            {activeTab === 'challenges' && renderChallengesTab()}
            {activeTab === 'ventures' && renderVenturesTab()}
            {activeTab === 'requests' && renderRequestsTab()}

            {/* Create Collaboration Request Modal */}
            <Modal visible={showCreateRequest} animationType="slide" transparent>
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView>
                            <Header>Create Collaboration Request</Header>
                            {selectedCreator && (
                                <Card>
                                    <Text style={{ color: '#374151', fontSize: 16, marginBottom: 8 }}>
                                        Send request to {selectedCreator.name}
                                    </Text>
                                    <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>
                                        {selectedCreator.bio}
                                    </Text>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ color: '#374151', fontSize: 16, marginBottom: 8 }}>Request Type</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {['guest_post', 'joint_venture', 'mentorship'].map(type => (
                                                <Button
                                                    key={type}
                                                    title={type.replace('_', ' ').toUpperCase()}
                                                    variant="primary"
                                                    onPress={() => {
                                                        const title = `Collaboration Request - ${type.replace('_', ' ')}`;
                                                        const description = `I would like to collaborate with you on a ${type.replace('_', ' ')} project.`;
                                                        handleSendRequest(type, title, description);
                                                    }}
                                                    style={{ marginRight: 8, marginBottom: 8 }}
                                                />
                                            ))}
                                        </View>
                                    </View>

                                    <Button title="Cancel" onPress={() => setShowCreateRequest(false)} />
                                </Card>
                            )}
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
} 