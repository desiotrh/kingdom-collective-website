export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: Date;
  lastLoginAt: Date;
  flagCount: number;
  warningCount: number;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise';
  faithMode: boolean;
  encouragementMode: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  status: ContentStatus;
  flagCount: number;
  isApproved: boolean;
  moderatorNotes?: string;
  tags: string[];
  visibility: 'public' | 'private' | 'community';
}

export interface Flag {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: 'user' | 'content' | 'comment';
  reason: FlagReason;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  actionTaken?: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: AdminActionType;
  targetId: string;
  targetType: 'user' | 'content';
  reason: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface SafetyMetrics {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  suspendedUsers: number;
  totalContent: number;
  flaggedContent: number;
  removedContent: number;
  pendingReviews: number;
  avgResponseTime: number; // in hours
  communityHealthScore: number; // 0-100
}

export interface ModerationAlert {
  id: string;
  type: AlertType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  targetId?: string;
  relatedUserId?: string;
  relatedContentId?: string;
  actionRequired: boolean;
  createdAt: Date;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface AdminDashboardData {
  metrics: SafetyMetrics;
  recentFlags: Flag[];
  pendingReviews: ContentItem[];
  recentActions: AdminAction[];
  alerts: ModerationAlert[];
  trendsData: {
    userGrowth: ChartDataPoint[];
    contentVolume: ChartDataPoint[];
    flagTrends: ChartDataPoint[];
    communityHealth: ChartDataPoint[];
  };
}

export interface ContentModerationSettings {
  autoModeration: boolean;
  contentFilters: {
    profanity: boolean;
    spam: boolean;
    harassment: boolean;
    inappropriateContent: boolean;
    religionSensitive: boolean;
  };
  approvalRequired: {
    newUsers: boolean;
    testimonies: boolean;
    prayerRequests: boolean;
    communityPosts: boolean;
  };
  warningThresholds: {
    flagsBeforeWarning: number;
    warningsBeforeSuspension: number;
    suspensionDuration: number; // days
  };
}

export interface UserManagementFilters {
  role?: UserRole;
  status?: AccountStatus;
  subscriptionTier?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  sortBy?: 'name' | 'email' | 'created' | 'lastLogin' | 'flagCount';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkAction {
  type: 'suspend' | 'ban' | 'warn' | 'verify' | 'changeRole';
  userIds: string[];
  reason: string;
  duration?: number; // for suspensions
  newRole?: UserRole; // for role changes
}

// Enums
export type UserRole = 'user' | 'creator' | 'mentor' | 'moderator' | 'admin' | 'superAdmin';

export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pending' | 'deactivated';

export type ContentType = 'testimony' | 'prayer' | 'post' | 'comment' | 'resource' | 'template' | 'product';

export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'flagged' | 'removed';

export type FlagReason = 
  | 'spam'
  | 'harassment'
  | 'inappropriateContent'
  | 'falseInformation'
  | 'copyrightViolation'
  | 'religionInsensitive'
  | 'scamSuspicion'
  | 'other';

export type AdminActionType = 
  | 'userSuspended'
  | 'userBanned'
  | 'userWarned'
  | 'userVerified'
  | 'contentRemoved'
  | 'contentApproved'
  | 'contentFlagged'
  | 'roleChanged'
  | 'accountReinstated';

export type AlertType = 
  | 'highFlagVolume'
  | 'suspiciousActivity'
  | 'systemIssue'
  | 'policyViolation'
  | 'communityThreat'
  | 'technicalAlert'
  | 'contentViolation'
  | 'massReporting'
  | 'systemAlert';

export type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// API Response Types
export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ModerationQueue {
  pending: ContentItem[];
  flagged: ContentItem[];
  escalated: Flag[];
  priority: ModerationAlert[];
}
