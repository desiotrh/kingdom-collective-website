import { useState, useEffect, useCallback } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: Date;
  isOnline: boolean;
  permissions: TeamPermissions;
  invitedAt: Date;
  joinedAt?: Date;
}

export interface TeamPermissions {
  canCreateContent: boolean;
  canPublishPosts: boolean;
  canManageEmail: boolean;
  canViewAnalytics: boolean;
  canManageFiles: boolean;
  canInviteMembers: boolean;
  canManageBilling: boolean;
  canDeleteContent: boolean;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: TeamMember['role'];
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
}

export interface TeamProject {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  members: string[]; // Array of team member IDs
  status: 'active' | 'archived' | 'draft';
  lastUpdated: Date;
  contentCount: number;
}

export interface TeamActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UseTeamCollaborationReturn {
  // Team Members
  teamMembers: TeamMember[];
  currentUser: TeamMember | null;
  
  // Invitations
  pendingInvitations: TeamInvitation[];
  
  // Projects
  projects: TeamProject[];
  
  // Activity
  recentActivity: TeamActivity[];
  
  // Loading States
  isLoading: boolean;
  isInviting: boolean;
  isUpdatingMember: boolean;
  
  // Error States
  error: string | null;
  
  // Team Management
  inviteMember: (email: string, role: TeamMember['role']) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: TeamMember['role']) => Promise<void>;
  updateMemberPermissions: (memberId: string, permissions: Partial<TeamPermissions>) => Promise<void>;
  
  // Invitations
  resendInvitation: (invitationId: string) => Promise<void>;
  revokeInvitation: (invitationId: string) => Promise<void>;
  
  // Projects
  createProject: (name: string, description: string, memberIds: string[]) => Promise<TeamProject>;
  updateProject: (projectId: string, updates: Partial<TeamProject>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addMemberToProject: (projectId: string, memberId: string) => Promise<void>;
  removeMemberFromProject: (projectId: string, memberId: string) => Promise<void>;
  
  // Activity Tracking
  logActivity: (action: string, target: string, metadata?: Record<string, any>) => Promise<void>;
  
  // Utilities
  getPermissionsForRole: (role: TeamMember['role']) => TeamPermissions;
  canUserPerformAction: (userId: string, action: string) => boolean;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useTeamCollaboration = (): UseTeamCollaborationReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [projects, setProjects] = useState<TeamProject[]>([]);
  const [recentActivity, setRecentActivity] = useState<TeamActivity[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default permissions for each role
  const getPermissionsForRole = useCallback((role: TeamMember['role']): TeamPermissions => {
    switch (role) {
      case 'owner':
        return {
          canCreateContent: true,
          canPublishPosts: true,
          canManageEmail: true,
          canViewAnalytics: true,
          canManageFiles: true,
          canInviteMembers: true,
          canManageBilling: true,
          canDeleteContent: true
        };
      case 'admin':
        return {
          canCreateContent: true,
          canPublishPosts: true,
          canManageEmail: true,
          canViewAnalytics: true,
          canManageFiles: true,
          canInviteMembers: true,
          canManageBilling: false,
          canDeleteContent: true
        };
      case 'editor':
        return {
          canCreateContent: true,
          canPublishPosts: true,
          canManageEmail: false,
          canViewAnalytics: true,
          canManageFiles: true,
          canInviteMembers: false,
          canManageBilling: false,
          canDeleteContent: false
        };
      case 'viewer':
        return {
          canCreateContent: false,
          canPublishPosts: false,
          canManageEmail: false,
          canViewAnalytics: true,
          canManageFiles: false,
          canInviteMembers: false,
          canManageBilling: false,
          canDeleteContent: false
        };
      default:
        return {
          canCreateContent: false,
          canPublishPosts: false,
          canManageEmail: false,
          canViewAnalytics: false,
          canManageFiles: false,
          canInviteMembers: false,
          canManageBilling: false,
          canDeleteContent: false
        };
    }
  }, []);

  // Generate mock data
  const generateMockData = useCallback(() => {
    const mockMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@kingdomstudios.com',
        role: 'owner',
        lastActive: new Date(),
        isOnline: true,
        permissions: getPermissionsForRole('owner'),
        invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@kingdomstudios.com',
        role: 'admin',
        lastActive: new Date(Date.now() - 15 * 60 * 1000),
        isOnline: false,
        permissions: getPermissionsForRole('admin'),
        invitedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@kingdomstudios.com',
        role: 'editor',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOnline: false,
        permissions: getPermissionsForRole('editor'),
        invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockInvitations: TeamInvitation[] = [
      {
        id: '1',
        email: 'newmember@example.com',
        role: 'editor',
        invitedBy: '1',
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];

    const mockProjects: TeamProject[] = [
      {
        id: '1',
        name: 'Sunday Sermon Series',
        description: 'Content creation for our weekly sermon series',
        createdBy: '1',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        members: ['1', '2', '3'],
        status: 'active',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        contentCount: 24
      },
      {
        id: '2',
        name: 'Easter Campaign',
        description: 'Special Easter content across all platforms',
        createdBy: '2',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        members: ['1', '2'],
        status: 'archived',
        lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        contentCount: 18
      }
    ];

    const mockActivity: TeamActivity[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Sarah Johnson',
        action: 'published social media post',
        target: 'Instagram - Daily Devotional',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { platform: 'instagram', contentType: 'image' }
      },
      {
        id: '2',
        userId: '3',
        userName: 'Michael Chen',
        action: 'created content',
        target: 'Faith over Fear - Blog Post',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { contentType: 'blog', wordCount: 1200 }
      },
      {
        id: '3',
        userId: '1',
        userName: 'John Smith',
        action: 'invited team member',
        target: 'newmember@example.com',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        metadata: { role: 'editor' }
      }
    ];

    return {
      members: mockMembers,
      invitations: mockInvitations,
      projects: mockProjects,
      activity: mockActivity
    };
  }, [getPermissionsForRole]);

  // Load team data
  const loadTeamData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData();
      
      setTeamMembers(mockData.members);
      setCurrentUser(mockData.members[0]); // Assume first member is current user
      setPendingInvitations(mockData.invitations);
      setProjects(mockData.projects);
      setRecentActivity(mockData.activity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load team data';
      setError(errorMessage);
      console.error('Error loading team data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [generateMockData]);

  // Invite team member
  const inviteMember = useCallback(async (email: string, role: TeamMember['role']) => {
    setIsInviting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInvitation: TeamInvitation = {
        id: `inv_${Date.now()}`,
        email,
        role,
        invitedBy: currentUser?.id || '1',
        invitedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'pending'
      };
      
      setPendingInvitations(prev => [...prev, newInvitation]);
      
      // Log activity
      await logActivity('invited team member', email, { role });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite member';
      setError(errorMessage);
      console.error('Error inviting member:', err);
    } finally {
      setIsInviting(false);
    }
  }, [currentUser]);

  // Remove team member
  const removeMember = useCallback(async (memberId: string) => {
    setIsUpdatingMember(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const memberToRemove = teamMembers.find(m => m.id === memberId);
      
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      
      if (memberToRemove) {
        await logActivity('removed team member', memberToRemove.name);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      console.error('Error removing member:', err);
    } finally {
      setIsUpdatingMember(false);
    }
  }, [teamMembers]);

  // Update member role
  const updateMemberRole = useCallback(async (memberId: string, role: TeamMember['role']) => {
    setIsUpdatingMember(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { 
                ...member, 
                role, 
                permissions: getPermissionsForRole(role) 
              }
            : member
        )
      );
      
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        await logActivity('updated member role', member.name, { newRole: role });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member role';
      setError(errorMessage);
      console.error('Error updating member role:', err);
    } finally {
      setIsUpdatingMember(false);
    }
  }, [teamMembers, getPermissionsForRole]);

  // Update member permissions
  const updateMemberPermissions = useCallback(async (
    memberId: string, 
    permissions: Partial<TeamPermissions>
  ) => {
    setIsUpdatingMember(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { 
                ...member, 
                permissions: { ...member.permissions, ...permissions }
              }
            : member
        )
      );
      
      const member = teamMembers.find(m => m.id === memberId);
      if (member) {
        await logActivity('updated member permissions', member.name);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update permissions';
      setError(errorMessage);
      console.error('Error updating permissions:', err);
    } finally {
      setIsUpdatingMember(false);
    }
  }, [teamMembers]);

  // Resend invitation
  const resendInvitation = useCallback(async (invitationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPendingInvitations(prev => 
        prev.map(invitation => 
          invitation.id === invitationId 
            ? { 
                ...invitation, 
                invitedAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              }
            : invitation
        )
      );
    } catch (err) {
      console.error('Error resending invitation:', err);
      setError('Failed to resend invitation');
    }
  }, []);

  // Revoke invitation
  const revokeInvitation = useCallback(async (invitationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPendingInvitations(prev => 
        prev.filter(invitation => invitation.id !== invitationId)
      );
    } catch (err) {
      console.error('Error revoking invitation:', err);
      setError('Failed to revoke invitation');
    }
  }, []);

  // Create project
  const createProject = useCallback(async (
    name: string, 
    description: string, 
    memberIds: string[]
  ): Promise<TeamProject> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject: TeamProject = {
        id: `proj_${Date.now()}`,
        name,
        description,
        createdBy: currentUser?.id || '1',
        createdAt: new Date(),
        members: memberIds,
        status: 'active',
        lastUpdated: new Date(),
        contentCount: 0
      };
      
      setProjects(prev => [...prev, newProject]);
      
      await logActivity('created project', name);
      
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      throw err;
    }
  }, [currentUser]);

  // Update project
  const updateProject = useCallback(async (
    projectId: string, 
    updates: Partial<TeamProject>
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                ...updates, 
                lastUpdated: new Date() 
              }
            : project
        )
      );
      
      const project = projects.find(p => p.id === projectId);
      if (project) {
        await logActivity('updated project', project.name);
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
    }
  }, [projects]);

  // Delete project
  const deleteProject = useCallback(async (projectId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const project = projects.find(p => p.id === projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (project) {
        await logActivity('deleted project', project.name);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  }, [projects]);

  // Add member to project
  const addMemberToProject = useCallback(async (projectId: string, memberId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                members: [...project.members, memberId],
                lastUpdated: new Date() 
              }
            : project
        )
      );
    } catch (err) {
      console.error('Error adding member to project:', err);
      setError('Failed to add member to project');
    }
  }, []);

  // Remove member from project
  const removeMemberFromProject = useCallback(async (projectId: string, memberId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                members: project.members.filter(id => id !== memberId),
                lastUpdated: new Date() 
              }
            : project
        )
      );
    } catch (err) {
      console.error('Error removing member from project:', err);
      setError('Failed to remove member from project');
    }
  }, []);

  // Log activity
  const logActivity = useCallback(async (
    action: string, 
    target: string, 
    metadata?: Record<string, any>
  ) => {
    try {
      const newActivity: TeamActivity = {
        id: `activity_${Date.now()}`,
        userId: currentUser?.id || '1',
        userName: currentUser?.name || 'Unknown',
        action,
        target,
        timestamp: new Date(),
        metadata
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }, [currentUser]);

  // Check user permissions
  const canUserPerformAction = useCallback((userId: string, action: string): boolean => {
    const user = teamMembers.find(m => m.id === userId);
    if (!user) return false;
    
    const permissionMap: Record<string, keyof TeamPermissions> = {
      'create_content': 'canCreateContent',
      'publish_posts': 'canPublishPosts',
      'manage_email': 'canManageEmail',
      'view_analytics': 'canViewAnalytics',
      'manage_files': 'canManageFiles',
      'invite_members': 'canInviteMembers',
      'manage_billing': 'canManageBilling',
      'delete_content': 'canDeleteContent'
    };
    
    const permissionKey = permissionMap[action];
    return permissionKey ? user.permissions[permissionKey] : false;
  }, [teamMembers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadTeamData();
  }, [loadTeamData]);

  // Load initial data
  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  return {
    // Team Members
    teamMembers,
    currentUser,
    
    // Invitations
    pendingInvitations,
    
    // Projects
    projects,
    
    // Activity
    recentActivity,
    
    // Loading States
    isLoading,
    isInviting,
    isUpdatingMember,
    
    // Error States
    error,
    
    // Team Management
    inviteMember,
    removeMember,
    updateMemberRole,
    updateMemberPermissions,
    
    // Invitations
    resendInvitation,
    revokeInvitation,
    
    // Projects
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    removeMemberFromProject,
    
    // Activity Tracking
    logActivity,
    
    // Utilities
    getPermissionsForRole,
    canUserPerformAction,
    clearError,
    refreshData
  };
};
