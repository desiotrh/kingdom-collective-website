import {
  AdminDashboardData,
  SafetyMetrics,
  Flag,
  AdminAction,
  ModerationAlert,
  User,
  ContentItem,
  AdminApiResponse,
  ModerationQueue,
  ContentModerationSettings,
  BulkAction,
  UserManagementFilters,
} from '../types/admin';

// Mock data for development
const mockMetrics: SafetyMetrics = {
  totalUsers: 15247,
  activeUsers: 8932,
  bannedUsers: 34,
  suspendedUsers: 89,
  totalContent: 45821,
  flaggedContent: 127,
  removedContent: 892,
  pendingReviews: 23,
  avgResponseTime: 2.4,
  communityHealthScore: 87,
};

const mockFlags: Flag[] = [
  {
    id: '1',
    reporterId: 'user1',
    reporterName: 'John Doe',
    targetId: 'content1',
    targetType: 'content',
    reason: 'inappropriateContent',
    description: 'Content contains inappropriate language',
    severity: 'medium',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    reporterId: 'user2',
    reporterName: 'Jane Smith',
    targetId: 'user3',
    targetType: 'user',
    reason: 'harassment',
    description: 'User has been sending harassing messages',
    severity: 'high',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '3',
    reporterId: 'user4',
    reporterName: 'Mike Johnson',
    targetId: 'content2',
    targetType: 'content',
    reason: 'spam',
    description: 'Repetitive promotional content',
    severity: 'low',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
];

const mockActions: AdminAction[] = [
  {
    id: '1',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'contentRemoved',
    targetId: 'content3',
    targetType: 'content',
    reason: 'Violated community guidelines',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '2',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'userWarned',
    targetId: 'user5',
    targetType: 'user',
    reason: 'Inappropriate behavior warning',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
];

const mockAlerts: ModerationAlert[] = [
  {
    id: '1',
    type: 'highFlagVolume',
    priority: 'high',
    title: 'High Flag Volume Detected',
    description: 'Unusual spike in content flags in the last hour',
    actionRequired: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
  },
  {
    id: '2',
    type: 'suspiciousActivity',
    priority: 'medium',
    title: 'Suspicious User Activity',
    description: 'Multiple accounts created from same IP',
    targetId: 'ip123',
    actionRequired: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
];

export class AdminService {
  static async getDashboardData(timeRange: '24h' | '7d' | '30d' | '90d'): Promise<AdminDashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Adjust metrics based on time range (mock behavior)
    const adjustedMetrics = { ...mockMetrics };
    if (timeRange === '24h') {
      adjustedMetrics.activeUsers = Math.floor(adjustedMetrics.activeUsers * 0.3);
      adjustedMetrics.pendingReviews = Math.floor(adjustedMetrics.pendingReviews * 0.5);
    }

    const trendsData = {
      userGrowth: this.generateTrendData(timeRange, 'users'),
      contentVolume: this.generateTrendData(timeRange, 'content'),
      flagTrends: this.generateTrendData(timeRange, 'flags'),
      communityHealth: this.generateTrendData(timeRange, 'health'),
    };

    return {
      metrics: adjustedMetrics,
      recentFlags: mockFlags,
      pendingReviews: [], // Would be populated with actual content
      recentActions: mockActions,
      alerts: mockAlerts,
      trendsData,
    };
  }

  static async getFlags(
    status?: string,
    severity?: string,
    page = 1,
    pageSize = 20
  ): Promise<AdminApiResponse<Flag[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredFlags = [...mockFlags];
    
    if (status) {
      filteredFlags = filteredFlags.filter(flag => flag.status === status);
    }
    
    if (severity) {
      filteredFlags = filteredFlags.filter(flag => flag.severity === severity);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFlags = filteredFlags.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedFlags,
      pagination: {
        page,
        pageSize,
        total: filteredFlags.length,
        totalPages: Math.ceil(filteredFlags.length / pageSize),
      },
    };
  }

  static async updateFlag(flagId: string, updates: Partial<Flag>): Promise<AdminApiResponse<Flag>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const flagIndex = mockFlags.findIndex(flag => flag.id === flagId);
    if (flagIndex === -1) {
      return {
        success: false,
        data: {} as Flag,
        message: 'Flag not found',
      };
    }

    mockFlags[flagIndex] = { ...mockFlags[flagIndex], ...updates };

    return {
      success: true,
      data: mockFlags[flagIndex],
      message: 'Flag updated successfully',
    };
  }

  static async getUsers(filters: UserManagementFilters): Promise<AdminApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock users data
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john@example.com',
        displayName: 'John Doe',
        role: 'user',
        isVerified: true,
        accountStatus: 'active',
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(),
        flagCount: 0,
        warningCount: 0,
        subscriptionTier: 'pro',
        faithMode: true,
        encouragementMode: false,
      },
      // Add more mock users as needed
    ];

    return {
      success: true,
      data: mockUsers,
      pagination: {
        page: 1,
        pageSize: 20,
        total: mockUsers.length,
        totalPages: 1,
      },
    };
  }

  static async performBulkAction(action: BulkAction): Promise<AdminApiResponse<string>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate bulk action processing
    console.log(`Performing ${action.type} on ${action.userIds.length} users`);

    return {
      success: true,
      data: `Bulk action ${action.type} completed successfully`,
      message: `${action.type} applied to ${action.userIds.length} users`,
    };
  }

  static async getModerationQueue(): Promise<ModerationQueue> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      pending: [], // Mock pending content
      flagged: [], // Mock flagged content
      escalated: mockFlags.filter(flag => flag.severity === 'high' || flag.severity === 'critical'),
      priority: mockAlerts.filter(alert => alert.priority === 'high' || alert.priority === 'urgent'),
    };
  }

  static async getModerationSettings(): Promise<ContentModerationSettings> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      autoModeration: true,
      contentFilters: {
        profanity: true,
        spam: true,
        harassment: true,
        inappropriateContent: true,
        religionSensitive: true,
      },
      approvalRequired: {
        newUsers: false,
        testimonies: true,
        prayerRequests: false,
        communityPosts: false,
      },
      warningThresholds: {
        flagsBeforeWarning: 3,
        warningsBeforeSuspension: 2,
        suspensionDuration: 7,
      },
    };
  }

  static async updateModerationSettings(
    settings: Partial<ContentModerationSettings>
  ): Promise<AdminApiResponse<ContentModerationSettings>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would update the settings in the database
    console.log('Updating moderation settings:', settings);

    return {
      success: true,
      data: await this.getModerationSettings(),
      message: 'Moderation settings updated successfully',
    };
  }

  static async generateReport(
    type: 'users' | 'content' | 'safety' | 'engagement',
    dateRange: { start: Date; end: Date }
  ): Promise<AdminApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock report generation
    const reportData = {
      type,
      dateRange,
      generatedAt: new Date(),
      summary: {
        totalItems: Math.floor(Math.random() * 1000) + 100,
        flaggedItems: Math.floor(Math.random() * 50) + 5,
        resolvedIssues: Math.floor(Math.random() * 30) + 10,
      },
      details: [], // Would contain detailed report data
    };

    return {
      success: true,
      data: reportData,
      message: 'Report generated successfully',
    };
  }

  private static generateTrendData(
    timeRange: string,
    type: 'users' | 'content' | 'flags' | 'health'
  ) {
    const dataPoints = [];
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value = 0;
      switch (type) {
        case 'users':
          value = Math.floor(Math.random() * 200) + 50;
          break;
        case 'content':
          value = Math.floor(Math.random() * 500) + 100;
          break;
        case 'flags':
          value = Math.floor(Math.random() * 20) + 1;
          break;
        case 'health':
          value = Math.floor(Math.random() * 20) + 80; // Health score 80-100
          break;
      }
      
      dataPoints.push({
        date: date.toISOString().split('T')[0],
        value,
        label: `${type} ${i} days ago`,
      });
    }
    
    return dataPoints;
  }
}


