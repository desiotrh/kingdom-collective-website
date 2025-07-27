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
interface AutomationWorkflow {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused' | 'draft';
    triggers: string[];
    actions: string[];
    platforms: string[];
    frequency: string;
    lastRun: Date;
    nextRun: Date;
    successRate: number;
    totalRuns: number;
}

interface AISchedule {
    id: string;
    title: string;
    contentType: string;
    platform: string;
    scheduledDate: Date;
    aiOptimized: boolean;
    performance: number;
    status: 'scheduled' | 'published' | 'failed';
    engagement: number;
    reach: number;
}

interface CrossPlatformCampaign {
    id: string;
    name: string;
    platforms: string[];
    content: string;
    scheduledDate: Date;
    status: 'draft' | 'scheduled' | 'active' | 'completed';
    performance: {
        totalReach: number;
        totalEngagement: number;
        totalConversions: number;
    };
}

interface Integration {
    id: string;
    name: string;
    platform: string;
    status: 'connected' | 'disconnected' | 'error';
    lastSync: Date;
    dataPoints: number;
    syncFrequency: string;
}

// Mock Data
const mockWorkflows: AutomationWorkflow[] = [
    {
        id: '1',
        name: 'Daily Faith Content',
        description: 'Automatically posts daily devotionals and faith-based content',
        status: 'active',
        triggers: ['Daily at 9 AM', 'New content available'],
        actions: ['Generate content', 'Post to Instagram', 'Post to TikTok', 'Send email'],
        platforms: ['Instagram', 'TikTok', 'Email'],
        frequency: 'Daily',
        lastRun: new Date(Date.now() - 86400000),
        nextRun: new Date(Date.now() + 3600000),
        successRate: 94,
        totalRuns: 28
    },
    {
        id: '2',
        name: 'Engagement Response',
        description: 'Automatically responds to comments and messages',
        status: 'active',
        triggers: ['New comment', 'New message', 'Mention'],
        actions: ['Analyze sentiment', 'Generate response', 'Send reply'],
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        frequency: 'Real-time',
        lastRun: new Date(Date.now() - 300000),
        nextRun: new Date(Date.now() + 60000),
        successRate: 87,
        totalRuns: 156
    },
    {
        id: '3',
        name: 'Weekly Analytics Report',
        description: 'Generates and sends weekly performance reports',
        status: 'active',
        triggers: ['Weekly on Sunday'],
        actions: ['Collect analytics', 'Generate report', 'Send email', 'Update dashboard'],
        platforms: ['Email', 'Dashboard'],
        frequency: 'Weekly',
        lastRun: new Date(Date.now() - 604800000),
        nextRun: new Date(Date.now() + 259200000),
        successRate: 100,
        totalRuns: 12
    },
    {
        id: '4',
        name: 'Product Launch Sequence',
        description: 'Automated product launch campaign across all platforms',
        status: 'draft',
        triggers: ['Product launch date'],
        actions: ['Create posts', 'Schedule content', 'Send emails', 'Track conversions'],
        platforms: ['Instagram', 'TikTok', 'Email', 'Website'],
        frequency: 'One-time',
        lastRun: new Date(),
        nextRun: new Date(),
        successRate: 0,
        totalRuns: 0
    }
];

const mockAISchedules: AISchedule[] = [
    {
        id: '1',
        title: 'Morning Devotional',
        contentType: 'Video',
        platform: 'Instagram',
        scheduledDate: new Date(Date.now() + 3600000),
        aiOptimized: true,
        performance: 92,
        status: 'scheduled',
        engagement: 0,
        reach: 0
    },
    {
        id: '2',
        title: 'Business Tip with Faith',
        contentType: 'Carousel',
        platform: 'LinkedIn',
        scheduledDate: new Date(Date.now() + 7200000),
        aiOptimized: true,
        performance: 88,
        status: 'scheduled',
        engagement: 0,
        reach: 0
    },
    {
        id: '3',
        title: 'Behind the Scenes',
        contentType: 'Reel',
        platform: 'TikTok',
        scheduledDate: new Date(Date.now() + 10800000),
        aiOptimized: true,
        performance: 95,
        status: 'scheduled',
        engagement: 0,
        reach: 0
    }
];

const mockCampaigns: CrossPlatformCampaign[] = [
    {
        id: '1',
        name: 'Faith in Business Series',
        platforms: ['Instagram', 'LinkedIn', 'TikTok'],
        content: 'Sharing how faith guides business decisions',
        scheduledDate: new Date(Date.now() + 86400000),
        status: 'scheduled',
        performance: {
            totalReach: 0,
            totalEngagement: 0,
            totalConversions: 0
        }
    },
    {
        id: '2',
        name: 'Daily Encouragement',
        platforms: ['Instagram', 'TikTok', 'Email'],
        content: 'Daily faith-based encouragement and motivation',
        scheduledDate: new Date(Date.now() + 172800000),
        status: 'active',
        performance: {
            totalReach: 15420,
            totalEngagement: 1234,
            totalConversions: 89
        }
    }
];

const mockIntegrations: Integration[] = [
    {
        id: '1',
        name: 'Instagram Business',
        platform: 'Instagram',
        status: 'connected',
        lastSync: new Date(Date.now() - 300000),
        dataPoints: 1250,
        syncFrequency: 'Real-time'
    },
    {
        id: '2',
        name: 'TikTok Creator',
        platform: 'TikTok',
        status: 'connected',
        lastSync: new Date(Date.now() - 600000),
        dataPoints: 890,
        syncFrequency: 'Every 5 minutes'
    },
    {
        id: '3',
        name: 'LinkedIn Company',
        platform: 'LinkedIn',
        status: 'connected',
        lastSync: new Date(Date.now() - 900000),
        dataPoints: 567,
        syncFrequency: 'Every 10 minutes'
    },
    {
        id: '4',
        name: 'YouTube Studio',
        platform: 'YouTube',
        status: 'error',
        lastSync: new Date(Date.now() - 86400000),
        dataPoints: 0,
        syncFrequency: 'Daily'
    }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const WorkflowCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
`;

const WorkflowHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const WorkflowName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ status }) =>
        status === 'active' ? '#10B98120' :
            status === 'paused' ? '#F59E0B20' :
                '#6B728020'
    };
  padding: 4px 8px;
  border-radius: 12px;
`;

const StatusText = styled.Text<{ status: string }>`
  color: ${({ status }) =>
        status === 'active' ? '#10B981' :
            status === 'paused' ? '#F59E0B' :
                '#6B7280'
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const ScheduleCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const ScheduleInfo = styled.View`
  flex: 1;
`;

const ScheduleTitle = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const ScheduleDetails = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const CampaignCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const CampaignHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CampaignName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const IntegrationCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const IntegrationInfo = styled.View`
  flex: 1;
`;

const IntegrationName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const IntegrationStatus = styled.View<{ status: string }>`
  background-color: ${({ status }) =>
        status === 'connected' ? '#10B98120' :
            status === 'disconnected' ? '#6B728020' :
                '#EF444420'
    };
  padding: 4px 8px;
  border-radius: 12px;
`;

const IntegrationStatusText = styled.Text<{ status: string }>`
  color: ${({ status }) =>
        status === 'connected' ? '#10B981' :
            status === 'disconnected' ? '#6B7280' :
                '#EF4444'
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const TabContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active, theme }) =>
        active ? theme.colors.gold : theme.colors.silverGray + '20'
    };
  padding: 12px 20px;
  border-radius: 8px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) =>
        active ? theme.colors.sapphireBlue : theme.colors.silverGray
    };
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
`;

export default function EnterpriseAutomationScreen() {
    const { faithMode } = useFaithMode();
    const [activeTab, setActiveTab] = useState('workflows');
    const [loading, setLoading] = useState(false);
    const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);

    const tabs = [
        { id: 'workflows', label: 'Workflows' },
        { id: 'schedules', label: 'AI Schedules' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'integrations', label: 'Integrations' }
    ];

    const handleWorkflowPress = (workflow: AutomationWorkflow) => {
        setSelectedWorkflow(workflow);
        setShowWorkflowDetails(true);
    };

    const toggleWorkflowStatus = (workflowId: string) => {
        Alert.alert(
            'Toggle Workflow',
            'Would you like to pause or activate this workflow?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Pause', onPress: () => Alert.alert('Workflow Paused', 'Workflow has been paused.') },
                { text: 'Activate', onPress: () => Alert.alert('Workflow Activated', 'Workflow has been activated.') }
            ]
        );
    };

    const createNewWorkflow = () => {
        Alert.alert(
            'New Workflow',
            'Create a new automation workflow?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create', onPress: () => Alert.alert('Workflow Creator', 'Workflow creation interface coming soon!') }
            ]
        );
    };

    const getFaithModeMessage = () => {
        const messages = [
            "Automation frees you to focus on Kingdom impact.",
            "Let technology handle the routine, you handle the relationships.",
            "Your automated systems serve your mission, not the other way around.",
            "Efficiency in service of excellence for God's glory."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const renderWorkflows = () => (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{
                    color: '#1E293B',
                    fontFamily: 'System',
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>
                    Automation Workflows
                </Text>
                <TouchableOpacity onPress={createNewWorkflow}>
                    <Ionicons name="add-circle" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            {mockWorkflows.map(workflow => (
                <WorkflowCard key={workflow.id}>
                    <WorkflowHeader>
                        <WorkflowName>{workflow.name}</WorkflowName>
                        <StatusBadge status={workflow.status}>
                            <StatusText status={workflow.status}>
                                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                            </StatusText>
                        </StatusBadge>
                    </WorkflowHeader>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 14,
                        marginBottom: 12
                    }}>
                        {workflow.description}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 8
                    }}>
                        Platforms: {workflow.platforms.join(', ')}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 8
                    }}>
                        Success Rate: {workflow.successRate}% • Runs: {workflow.totalRuns}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 12
                    }}>
                        Next Run: {workflow.nextRun.toLocaleString()}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => handleWorkflowPress(workflow)}>
                            <Text style={{ color: '#3B82F6', fontFamily: 'System', fontSize: 14 }}>
                                View Details
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleWorkflowStatus(workflow.id)}>
                            <Text style={{ color: '#10B981', fontFamily: 'System', fontSize: 14 }}>
                                {workflow.status === 'active' ? 'Pause' : 'Activate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </WorkflowCard>
            ))}
        </View>
    );

    const renderSchedules = () => (
        <View>
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 16
            }}>
                AI-Powered Schedules
            </Text>

            {mockAISchedules.map(schedule => (
                <ScheduleCard key={schedule.id}>
                    <ScheduleInfo>
                        <ScheduleTitle>{schedule.title}</ScheduleTitle>
                        <ScheduleDetails>
                            {schedule.contentType} • {schedule.platform} • {schedule.scheduledDate.toLocaleString()}
                        </ScheduleDetails>
                        <ScheduleDetails>
                            AI Optimized: {schedule.aiOptimized ? 'Yes' : 'No'} • Performance: {schedule.performance}%
                        </ScheduleDetails>
                    </ScheduleInfo>
                    <TouchableOpacity>
                        <Ionicons name="chevron-forward" size={20} color="#64748B" />
                    </TouchableOpacity>
                </ScheduleCard>
            ))}
        </View>
    );

    const renderCampaigns = () => (
        <View>
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 16
            }}>
                Cross-Platform Campaigns
            </Text>

            {mockCampaigns.map(campaign => (
                <CampaignCard key={campaign.id}>
                    <CampaignHeader>
                        <CampaignName>{campaign.name}</CampaignName>
                        <StatusBadge status={campaign.status}>
                            <StatusText status={campaign.status}>
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </StatusText>
                        </StatusBadge>
                    </CampaignHeader>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 14,
                        marginBottom: 8
                    }}>
                        {campaign.content}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 8
                    }}>
                        Platforms: {campaign.platforms.join(', ')}
                    </Text>
                    <Text style={{
                        color: '#64748B',
                        fontFamily: 'System',
                        fontSize: 12,
                        marginBottom: 8
                    }}>
                        Scheduled: {campaign.scheduledDate.toLocaleDateString()}
                    </Text>
                    {campaign.status === 'active' && (
                        <Text style={{
                            color: '#64748B',
                            fontFamily: 'System',
                            fontSize: 12
                        }}>
                            Performance: {campaign.performance.totalReach.toLocaleString()} reach, {campaign.performance.totalEngagement} engagement
                        </Text>
                    )}
                </CampaignCard>
            ))}
        </View>
    );

    const renderIntegrations = () => (
        <View>
            <Text style={{
                color: '#1E293B',
                fontFamily: 'System',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 16
            }}>
                Platform Integrations
            </Text>

            {mockIntegrations.map(integration => (
                <IntegrationCard key={integration.id}>
                    <IntegrationInfo>
                        <IntegrationName>{integration.name}</IntegrationName>
                        <Text style={{
                            color: '#64748B',
                            fontFamily: 'System',
                            fontSize: 12,
                            marginBottom: 4
                        }}>
                            {integration.platform} • {integration.dataPoints} data points
                        </Text>
                        <Text style={{
                            color: '#64748B',
                            fontFamily: 'System',
                            fontSize: 12
                        }}>
                            Last sync: {integration.lastSync.toLocaleString()}
                        </Text>
                    </IntegrationInfo>
                    <IntegrationStatus status={integration.status}>
                        <IntegrationStatusText status={integration.status}>
                            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                        </IntegrationStatusText>
                    </IntegrationStatus>
                </IntegrationCard>
            ))}
        </View>
    );

    return (
        <Container>
            <Header>Enterprise Automation</Header>

            {faithMode && (
                <Card style={{ marginBottom: 16, backgroundColor: '#FEF3C7' }}>
                    <Text style={{
                        color: '#92400E',
                        fontFamily: 'System',
                        fontSize: 16,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        {getFaithModeMessage()}
                    </Text>
                </Card>
            )}

            <TabContainer>
                {tabs.map(tab => (
                    <TabButton
                        key={tab.id}
                        active={activeTab === tab.id}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <TabText active={activeTab === tab.id}>
                            {tab.label}
                        </TabText>
                    </TabButton>
                ))}
            </TabContainer>

            {activeTab === 'workflows' && renderWorkflows()}
            {activeTab === 'schedules' && renderSchedules()}
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'integrations' && renderIntegrations()}

            {/* Workflow Details Modal */}
            <Modal
                visible={showWorkflowDetails}
                animationType="slide"
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <Card style={{ width: '100%', maxHeight: '80%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{
                                color: '#1E293B',
                                fontFamily: 'System',
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>
                                {selectedWorkflow?.name}
                            </Text>
                            <TouchableOpacity onPress={() => setShowWorkflowDetails(false)}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {selectedWorkflow && (
                            <ScrollView>
                                <Text style={{
                                    color: '#1E293B',
                                    fontFamily: 'System',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: 8
                                }}>
                                    Triggers
                                </Text>
                                {selectedWorkflow.triggers.map((trigger, index) => (
                                    <Text key={index} style={{ color: '#64748B', fontFamily: 'System', fontSize: 14, marginBottom: 4 }}>
                                        • {trigger}
                                    </Text>
                                ))}

                                <Text style={{
                                    color: '#1E293B',
                                    fontFamily: 'System',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginTop: 16,
                                    marginBottom: 8
                                }}>
                                    Actions
                                </Text>
                                {selectedWorkflow.actions.map((action, index) => (
                                    <Text key={index} style={{ color: '#64748B', fontFamily: 'System', fontSize: 14, marginBottom: 4 }}>
                                        • {action}
                                    </Text>
                                ))}

                                <Button
                                    title="Edit Workflow"
                                    onPress={() => {
                                        Alert.alert('Edit', 'Workflow editor coming soon!');
                                        setShowWorkflowDetails(false);
                                    }}
                                />
                            </ScrollView>
                        )}
                    </Card>
                </View>
            </Modal>
        </Container>
    );
} 