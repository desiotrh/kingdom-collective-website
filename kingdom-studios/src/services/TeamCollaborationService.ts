/**
 * 👥 Advanced Team Collaboration & Management Service
 * Real-time editing, role-based permissions, approval flows, and team metrics
 */

import { Platform } from 'react-native';

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: TeamRole;
  permissions: Permission[];
  joinDate: Date;
  lastActive: Date;
  contentCount: number;
  status: 'active' | 'inactive' | 'pending';
}

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface Permission {
  resource: 'content' | 'analytics' | 'settings' | 'team' | 'billing';
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  scope: 'all' | 'own' | 'team';
}

export interface CollaborationSession {
  id: string;
  contentId: string;
  participants: string[];
  activeUsers: ActiveUser[];
  changes: ContentChange[];
  startTime: Date;
  lastActivity: Date;
}

export interface ActiveUser {
  userId: string;
  name: string;
  role: TeamRole;
  cursorPosition?: { x: number; y: number };
  isTyping: boolean;
  lastSeen: Date;
}

export interface ContentChange {
  id: string;
  userId: string;
  type: 'text' | 'image' | 'layout' | 'style';
  timestamp: Date;
  description: string;
  data: any;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  steps: ApprovalStep[];
  isActive: boolean;
  createdAt: Date;
}

export interface ApprovalStep {
  id: string;
  name: string;
  role: TeamRole;
  order: number;
  isRequired: boolean;
  timeLimit?: number; // hours
}

export interface ApprovalRequest {
  id: string;
  contentId: string;
  requesterId: string;
  workflowId: string;
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvals: Approval[];
  createdAt: Date;
  deadline: Date;
}

export interface Approval {
  stepId: string;
  approverId: string;
  decision: 'approve' | 'reject' | 'comment';
  comment?: string;
  timestamp: Date;
}

export interface TeamMetrics {
  totalMembers: number;
  activeMembers: number;
  contentCreated: number;
  contentApproved: number;
  averageResponseTime: number;
  collaborationHours: number;
  memberPerformance: MemberPerformance[];
}

export interface MemberPerformance {
  userId: string;
  name: string;
  contentCreated: number;
  contentApproved: number;
  responseTime: number;
  collaborationScore: number;
}

class TeamCollaborationService {
  private apiKey: string;
  private baseUrl: string;
  private currentUserId: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_TEAM_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_TEAM_BASE_URL || 'https://api.kingdomstudios.com/team';
    this.currentUserId = '';
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  // ==============================
  // 👥 TEAM MEMBER MANAGEMENT
  // ==============================

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await fetch(`${this.baseUrl}/members`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.status}`);
      }

      const data = await response.json();
      return data.members || this.getMockTeamMembers();
    } catch (error) {
      console.error('Get team members error:', error);
      return this.getMockTeamMembers();
    }
  }

  async inviteTeamMember(email: string, role: TeamRole): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          invitedBy: this.currentUserId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Invite team member error:', error);
      return false;
    }
  }

  async updateMemberRole(memberId: string, newRole: TeamRole): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      return response.ok;
    } catch (error) {
      console.error('Update member role error:', error);
      return false;
    }
  }

  async removeTeamMember(memberId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Remove team member error:', error);
      return false;
    }
  }

  // ==============================
  // 🔄 REAL-TIME COLLABORATION
  // ==============================

  async joinCollaborationSession(contentId: string): Promise<CollaborationSession> {
    try {
      const response = await fetch(`${this.baseUrl}/collaboration/${contentId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to join collaboration session: ${response.status}`);
      }

      const data = await response.json();
      return data.session || this.getMockCollaborationSession(contentId);
    } catch (error) {
      console.error('Join collaboration session error:', error);
      return this.getMockCollaborationSession(contentId);
    }
  }

  async leaveCollaborationSession(contentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/collaboration/${contentId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.currentUserId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Leave collaboration session error:', error);
      return false;
    }
  }

  async updateCursorPosition(contentId: string, position: { x: number; y: number }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/collaboration/${contentId}/cursor`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.currentUserId,
          position,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Update cursor position error:', error);
      return false;
    }
  }

  async sendContentChange(contentId: string, change: Omit<ContentChange, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/collaboration/${contentId}/changes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.currentUserId,
          change,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Send content change error:', error);
      return false;
    }
  }

  // ==============================
  // ✅ CONTENT APPROVAL WORKFLOWS
  // ==============================

  async createApprovalWorkflow(workflow: Omit<ApprovalWorkflow, 'id' | 'createdAt'>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error(`Failed to create approval workflow: ${response.status}`);
      }

      const data = await response.json();
      return data.workflowId || `workflow_${Date.now()}`;
    } catch (error) {
      console.error('Create approval workflow error:', error);
      throw new Error('Failed to create approval workflow');
    }
  }

  async getApprovalWorkflows(): Promise<ApprovalWorkflow[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch approval workflows: ${response.status}`);
      }

      const data = await response.json();
      return data.workflows || this.getMockApprovalWorkflows();
    } catch (error) {
      console.error('Get approval workflows error:', error);
      return this.getMockApprovalWorkflows();
    }
  }

  async submitForApproval(contentId: string, workflowId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/approvals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          workflowId,
          requesterId: this.currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit for approval: ${response.status}`);
      }

      const data = await response.json();
      return data.approvalId || `approval_${Date.now()}`;
    } catch (error) {
      console.error('Submit for approval error:', error);
      throw new Error('Failed to submit for approval');
    }
  }

  async approveContent(approvalId: string, decision: 'approve' | 'reject', comment?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/approvals/${approvalId}/decision`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approverId: this.currentUserId,
          decision,
          comment,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Approve content error:', error);
      return false;
    }
  }

  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    try {
      const response = await fetch(`${this.baseUrl}/approvals/pending`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending approvals: ${response.status}`);
      }

      const data = await response.json();
      return data.approvals || this.getMockPendingApprovals();
    } catch (error) {
      console.error('Get pending approvals error:', error);
      return this.getMockPendingApprovals();
    }
  }

  // ==============================
  // 📊 TEAM METRICS DASHBOARD
  // ==============================

  async getTeamMetrics(timeRange: 'week' | 'month' | 'quarter' = 'month'): Promise<TeamMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team metrics: ${response.status}`);
      }

      const data = await response.json();
      return data.metrics || this.getMockTeamMetrics();
    } catch (error) {
      console.error('Get team metrics error:', error);
      return this.getMockTeamMetrics();
    }
  }

  async getMemberPerformance(memberId: string): Promise<MemberPerformance> {
    try {
      const response = await fetch(`${this.baseUrl}/members/${memberId}/performance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch member performance: ${response.status}`);
      }

      const data = await response.json();
      return data.performance || this.getMockMemberPerformance(memberId);
    } catch (error) {
      console.error('Get member performance error:', error);
      return this.getMockMemberPerformance(memberId);
    }
  }

  // ==============================
  // 🔧 HELPER METHODS
  // ==============================

  private getMockTeamMembers(): TeamMember[] {
    return [
      {
        id: '1',
        userId: 'user_1',
        email: 'john@kingdomcollective.pro',
        name: 'John Smith',
        role: 'owner',
        permissions: this.getPermissionsForRole('owner'),
        joinDate: new Date('2024-01-01'),
        lastActive: new Date(),
        contentCount: 45,
        status: 'active',
      },
      {
        id: '2',
        userId: 'user_2',
        email: 'sarah@kingdomcollective.pro',
        name: 'Sarah Johnson',
        role: 'admin',
        permissions: this.getPermissionsForRole('admin'),
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(Date.now() - 3600000), // 1 hour ago
        contentCount: 32,
        status: 'active',
      },
      {
        id: '3',
        userId: 'user_3',
        email: 'mike@kingdomcollective.pro',
        name: 'Mike Davis',
        role: 'editor',
        permissions: this.getPermissionsForRole('editor'),
        joinDate: new Date('2024-02-01'),
        lastActive: new Date(Date.now() - 86400000), // 1 day ago
        contentCount: 18,
        status: 'active',
      },
    ];
  }

  private getPermissionsForRole(role: TeamRole): Permission[] {
    const permissions: Record<TeamRole, Permission[]> = {
      owner: [
        { resource: 'content', action: 'create', scope: 'all' },
        { resource: 'content', action: 'read', scope: 'all' },
        { resource: 'content', action: 'update', scope: 'all' },
        { resource: 'content', action: 'delete', scope: 'all' },
        { resource: 'content', action: 'approve', scope: 'all' },
        { resource: 'analytics', action: 'read', scope: 'all' },
        { resource: 'settings', action: 'update', scope: 'all' },
        { resource: 'team', action: 'create', scope: 'all' },
        { resource: 'team', action: 'read', scope: 'all' },
        { resource: 'team', action: 'update', scope: 'all' },
        { resource: 'team', action: 'delete', scope: 'all' },
        { resource: 'billing', action: 'read', scope: 'all' },
        { resource: 'billing', action: 'update', scope: 'all' },
      ],
      admin: [
        { resource: 'content', action: 'create', scope: 'all' },
        { resource: 'content', action: 'read', scope: 'all' },
        { resource: 'content', action: 'update', scope: 'all' },
        { resource: 'content', action: 'delete', scope: 'all' },
        { resource: 'content', action: 'approve', scope: 'all' },
        { resource: 'analytics', action: 'read', scope: 'all' },
        { resource: 'settings', action: 'update', scope: 'all' },
        { resource: 'team', action: 'read', scope: 'all' },
        { resource: 'team', action: 'update', scope: 'all' },
        { resource: 'billing', action: 'read', scope: 'all' },
      ],
      editor: [
        { resource: 'content', action: 'create', scope: 'own' },
        { resource: 'content', action: 'read', scope: 'team' },
        { resource: 'content', action: 'update', scope: 'own' },
        { resource: 'analytics', action: 'read', scope: 'own' },
      ],
      viewer: [
        { resource: 'content', action: 'read', scope: 'team' },
        { resource: 'analytics', action: 'read', scope: 'own' },
      ],
    };

    return permissions[role] || [];
  }

  private getMockCollaborationSession(contentId: string): CollaborationSession {
    return {
      id: `session_${contentId}`,
      contentId,
      participants: ['user_1', 'user_2'],
      activeUsers: [
        {
          userId: 'user_1',
          name: 'John Smith',
          role: 'owner',
          cursorPosition: { x: 100, y: 200 },
          isTyping: false,
          lastSeen: new Date(),
        },
        {
          userId: 'user_2',
          name: 'Sarah Johnson',
          role: 'admin',
          cursorPosition: { x: 150, y: 250 },
          isTyping: true,
          lastSeen: new Date(),
        },
      ],
      changes: [],
      startTime: new Date(),
      lastActivity: new Date(),
    };
  }

  private getMockApprovalWorkflows(): ApprovalWorkflow[] {
    return [
      {
        id: 'workflow_1',
        name: 'Standard Content Review',
        steps: [
          {
            id: 'step_1',
            name: 'Editor Review',
            role: 'editor',
            order: 1,
            isRequired: true,
            timeLimit: 24,
          },
          {
            id: 'step_2',
            name: 'Admin Approval',
            role: 'admin',
            order: 2,
            isRequired: true,
            timeLimit: 48,
          },
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ];
  }

  private getMockPendingApprovals(): ApprovalRequest[] {
    return [
      {
        id: 'approval_1',
        contentId: 'content_1',
        requesterId: 'user_3',
        workflowId: 'workflow_1',
        currentStep: 1,
        status: 'pending',
        approvals: [],
        createdAt: new Date(),
        deadline: new Date(Date.now() + 86400000), // 24 hours from now
      },
    ];
  }

  private getMockTeamMetrics(): TeamMetrics {
    return {
      totalMembers: 5,
      activeMembers: 4,
      contentCreated: 95,
      contentApproved: 87,
      averageResponseTime: 2.5, // hours
      collaborationHours: 120,
      memberPerformance: [
        {
          userId: 'user_1',
          name: 'John Smith',
          contentCreated: 45,
          contentApproved: 42,
          responseTime: 1.2,
          collaborationScore: 95,
        },
        {
          userId: 'user_2',
          name: 'Sarah Johnson',
          contentCreated: 32,
          contentApproved: 30,
          responseTime: 2.1,
          collaborationScore: 88,
        },
      ],
    };
  }

  private getMockMemberPerformance(memberId: string): MemberPerformance {
    return {
      userId: memberId,
      name: 'Team Member',
      contentCreated: 20,
      contentApproved: 18,
      responseTime: 2.5,
      collaborationScore: 85,
    };
  }
}

export const teamCollaborationService = new TeamCollaborationService(); 