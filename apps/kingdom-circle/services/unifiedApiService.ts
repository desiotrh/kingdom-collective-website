/**
 * ⭕ KINGDOM CIRCLE - UNIFIED API SERVICE
 * Replaces individual API services with the unified API client
 * 
 * This service provides all Kingdom Circle functionality through the unified API:
 * - Community management and networking
 * - Mentorship matching and guidance
 * - Group creation and management
 * - Prayer requests and spiritual support
 * - Accountability check-ins
 * - Faith-based content sharing
 * - Event planning and coordination
 */

import { apiClients } from '@kingdom-collective/api';

// ================================
// ⭕ KINGDOM CIRCLE API SERVICE
// ================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  faithBackground?: string;
  interests: string[];
  skills: string[];
  isMentor: boolean;
  isMentee: boolean;
  isActive: boolean;
  dateJoined: string;
  lastActive: string;
  metadata?: Record<string, any>;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: 'prayer' | 'study' | 'accountability' | 'mentorship' | 'outreach' | 'worship';
  privacy: 'public' | 'private' | 'invite-only';
  maxMembers?: number;
  currentMembers: number;
  ownerId: string;
  moderators: string[];
  members: string[];
  tags: string[];
  imageUrl?: string;
  isActive: boolean;
  dateCreated: string;
  lastActivity: string;
}

export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  category: 'personal' | 'family' | 'community' | 'global' | 'ministry';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  isAnonymous: boolean;
  isAnswered: boolean;
  answeredDate?: string;
  answer?: string;
  prayerCount: number;
  prayedBy: string[];
  tags: string[];
  dateCreated: string;
  lastUpdated: string;
}

export interface MentorshipRelationship {
  id: string;
  mentorId: string;
  menteeId: string;
  mentorName: string;
  menteeName: string;
  status: 'pending' | 'active' | 'paused' | 'completed';
  goals: string[];
  focusAreas: string[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  nextMeeting?: string;
  notes: string[];
  progress: number; // 0-100
  dateStarted: string;
  lastMeeting: string;
}

export interface AccountabilityCheckin {
  id: string;
  userId: string;
  userName: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  title: string;
  description: string;
  goals: string[];
  progress: number; // 0-100
  challenges: string[];
  victories: string[];
  prayerRequests: string[];
  nextSteps: string[];
  isCompleted: boolean;
  completedDate?: string;
  supporters: string[];
  comments: AccountabilityComment[];
  dateCreated: string;
  dueDate: string;
}

export interface AccountabilityComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isEncouragement: boolean;
  dateCreated: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  type: 'meeting' | 'prayer' | 'study' | 'outreach' | 'worship' | 'social';
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  currentAttendees: number;
  attendees: string[];
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: string;
  isActive: boolean;
  dateCreated: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string;
  groupId?: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  isRead: boolean;
  readDate?: string;
  isEncouragement: boolean;
  dateCreated: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'prayer' | 'mentorship' | 'group' | 'event' | 'message' | 'accountability';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readDate?: string;
  actionUrl?: string;
  dateCreated: string;
}

export class KingdomCircleApiService {
  private static instance: KingdomCircleApiService;
  private api = apiClients.circle;

  private constructor() {}

  static getInstance(): KingdomCircleApiService {
    if (!KingdomCircleApiService.instance) {
      KingdomCircleApiService.instance = new KingdomCircleApiService();
    }
    return KingdomCircleApiService.instance;
  }

  // ================================
  // 👥 USER MANAGEMENT
  // ================================

  /**
   * Get user profile
   */
  async getUserProfile(userId?: string): Promise<User> {
    const response = await this.api.getUserProfile(userId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get user profile');
    }

    return response.data;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: Partial<User>): Promise<User> {
    const response = await this.api.updateUserProfile(updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update user profile');
    }

    return response.data;
  }

  /**
   * Search users
   */
  async searchUsers(
    query: string,
    filters?: {
      skills?: string[];
      interests?: string[];
      location?: string;
      isMentor?: boolean;
      isMentee?: boolean;
    },
    page: number = 1,
    limit: number = 20
  ): Promise<{
    users: User[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.searchUsers(query, filters, page, limit);

    if (!response.success) {
      throw new Error(response.error || 'Failed to search users');
    }

    return response.data;
  }

  /**
   * Get recommended connections
   */
  async getRecommendedConnections(): Promise<User[]> {
    const response = await this.api.getRecommendedConnections();

    if (!response.success) {
      throw new Error(response.error || 'Failed to get recommended connections');
    }

    return response.data;
  }

  // ================================
  // ⭕ GROUP MANAGEMENT
  // ================================

  /**
   * Create group
   */
  async createGroup(group: Omit<Group, 'id' | 'currentMembers' | 'dateCreated' | 'lastActivity'>): Promise<{ id: string }> {
    const response = await this.api.createGroup(group);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create group');
    }

    return response.data;
  }

  /**
   * Get groups
   */
  async getGroups(
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      privacy?: string;
      search?: string;
      isActive?: boolean;
    }
  ): Promise<{
    groups: Group[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getGroups(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get groups');
    }

    return response.data;
  }

  /**
   * Get group by ID
   */
  async getGroup(groupId: string): Promise<Group> {
    const response = await this.api.getGroup(groupId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get group');
    }

    return response.data;
  }

  /**
   * Update group
   */
  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
    const response = await this.api.updateGroup(groupId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update group');
    }

    return response.data;
  }

  /**
   * Join group
   */
  async joinGroup(groupId: string): Promise<void> {
    const response = await this.api.joinGroup(groupId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to join group');
    }
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<void> {
    const response = await this.api.leaveGroup(groupId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to leave group');
    }
  }

  /**
   * Invite to group
   */
  async inviteToGroup(groupId: string, userIds: string[]): Promise<{
    invited: number;
    alreadyMembers: number;
    errors: number;
  }> {
    const response = await this.api.inviteToGroup(groupId, userIds);

    if (!response.success) {
      throw new Error(response.error || 'Failed to invite to group');
    }

    return response.data;
  }

  // ================================
  // 🙏 PRAYER REQUESTS
  // ================================

  /**
   * Create prayer request
   */
  async createPrayerRequest(request: Omit<PrayerRequest, 'id' | 'prayerCount' | 'prayedBy' | 'dateCreated' | 'lastUpdated'>): Promise<{ id: string }> {
    const response = await this.api.createPrayerRequest(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create prayer request');
    }

    return response.data;
  }

  /**
   * Get prayer requests
   */
  async getPrayerRequests(
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      urgency?: string;
      isAnswered?: boolean;
      search?: string;
    }
  ): Promise<{
    requests: PrayerRequest[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getPrayerRequests(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get prayer requests');
    }

    return response.data;
  }

  /**
   * Get prayer request by ID
   */
  async getPrayerRequest(requestId: string): Promise<PrayerRequest> {
    const response = await this.api.getPrayerRequest(requestId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get prayer request');
    }

    return response.data;
  }

  /**
   * Mark prayer as prayed
   */
  async markPrayerAsPrayed(requestId: string): Promise<void> {
    const response = await this.api.markPrayerAsPrayed(requestId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to mark prayer as prayed');
    }
  }

  /**
   * Answer prayer request
   */
  async answerPrayerRequest(requestId: string, answer: string): Promise<void> {
    const response = await this.api.answerPrayerRequest(requestId, answer);

    if (!response.success) {
      throw new Error(response.error || 'Failed to answer prayer request');
    }
  }

  // ================================
  // 👨‍🏫 MENTORSHIP
  // ================================

  /**
   * Find mentors
   */
  async findMentors(
    focusAreas: string[],
    location?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    mentors: User[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.findMentors(focusAreas, location, page, limit);

    if (!response.success) {
      throw new Error(response.error || 'Failed to find mentors');
    }

    return response.data;
  }

  /**
   * Request mentorship
   */
  async requestMentorship(
    mentorId: string,
    goals: string[],
    focusAreas: string[],
    meetingFrequency: string
  ): Promise<{ relationshipId: string }> {
    const response = await this.api.requestMentorship(mentorId, goals, focusAreas, meetingFrequency);

    if (!response.success) {
      throw new Error(response.error || 'Failed to request mentorship');
    }

    return response.data;
  }

  /**
   * Get mentorship relationships
   */
  async getMentorshipRelationships(
    type: 'mentor' | 'mentee' | 'all' = 'all'
  ): Promise<MentorshipRelationship[]> {
    const response = await this.api.getMentorshipRelationships(type);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get mentorship relationships');
    }

    return response.data;
  }

  /**
   * Update mentorship relationship
   */
  async updateMentorshipRelationship(
    relationshipId: string,
    updates: Partial<MentorshipRelationship>
  ): Promise<MentorshipRelationship> {
    const response = await this.api.updateMentorshipRelationship(relationshipId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update mentorship relationship');
    }

    return response.data;
  }

  /**
   * Schedule mentorship meeting
   */
  async scheduleMentorshipMeeting(
    relationshipId: string,
    meetingDate: string,
    notes?: string
  ): Promise<{ meetingId: string }> {
    const response = await this.api.scheduleMentorshipMeeting(relationshipId, meetingDate, notes);

    if (!response.success) {
      throw new Error(response.error || 'Failed to schedule mentorship meeting');
    }

    return response.data;
  }

  // ================================
  // ✅ ACCOUNTABILITY
  // ================================

  /**
   * Create accountability check-in
   */
  async createAccountabilityCheckin(
    checkin: Omit<AccountabilityCheckin, 'id' | 'supporters' | 'comments' | 'dateCreated'>
  ): Promise<{ id: string }> {
    const response = await this.api.createAccountabilityCheckin(checkin);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create accountability check-in');
    }

    return response.data;
  }

  /**
   * Get accountability check-ins
   */
  async getAccountabilityCheckins(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      isCompleted?: boolean;
      userId?: string;
    }
  ): Promise<{
    checkins: AccountabilityCheckin[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getAccountabilityCheckins(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get accountability check-ins');
    }

    return response.data;
  }

  /**
   * Update accountability check-in
   */
  async updateAccountabilityCheckin(
    checkinId: string,
    updates: Partial<AccountabilityCheckin>
  ): Promise<AccountabilityCheckin> {
    const response = await this.api.updateAccountabilityCheckin(checkinId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update accountability check-in');
    }

    return response.data;
  }

  /**
   * Support accountability check-in
   */
  async supportAccountabilityCheckin(checkinId: string): Promise<void> {
    const response = await this.api.supportAccountabilityCheckin(checkinId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to support accountability check-in');
    }
  }

  /**
   * Add accountability comment
   */
  async addAccountabilityComment(
    checkinId: string,
    content: string,
    isEncouragement: boolean = true
  ): Promise<{ commentId: string }> {
    const response = await this.api.addAccountabilityComment(checkinId, content, isEncouragement);

    if (!response.success) {
      throw new Error(response.error || 'Failed to add accountability comment');
    }

    return response.data;
  }

  // ================================
  // 📅 EVENTS
  // ================================

  /**
   * Create event
   */
  async createEvent(event: Omit<Event, 'id' | 'currentAttendees' | 'attendees' | 'dateCreated'>): Promise<{ id: string }> {
    const response = await this.api.createEvent(event);

    if (!response.success) {
      throw new Error(response.error || 'Failed to create event');
    }

    return response.data;
  }

  /**
   * Get events
   */
  async getEvents(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      dateRange?: { start: string; end: string };
      location?: string;
      isVirtual?: boolean;
    }
  ): Promise<{
    events: Event[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getEvents(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get events');
    }

    return response.data;
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId: string): Promise<Event> {
    const response = await this.api.getEvent(eventId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get event');
    }

    return response.data;
  }

  /**
   * RSVP to event
   */
  async rsvpToEvent(eventId: string, attending: boolean): Promise<void> {
    const response = await this.api.rsvpToEvent(eventId, attending);

    if (!response.success) {
      throw new Error(response.error || 'Failed to RSVP to event');
    }
  }

  /**
   * Update event
   */
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const response = await this.api.updateEvent(eventId, updates);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update event');
    }

    return response.data;
  }

  // ================================
  // 💬 MESSAGING
  // ================================

  /**
   * Send message
   */
  async sendMessage(
    recipientId: string,
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ): Promise<{ messageId: string }> {
    const response = await this.api.sendMessage(recipientId, content, type, mediaUrl);

    if (!response.success) {
      throw new Error(response.error || 'Failed to send message');
    }

    return response.data;
  }

  /**
   * Send group message
   */
  async sendGroupMessage(
    groupId: string,
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ): Promise<{ messageId: string }> {
    const response = await this.api.sendGroupMessage(groupId, content, type, mediaUrl);

    if (!response.success) {
      throw new Error(response.error || 'Failed to send group message');
    }

    return response.data;
  }

  /**
   * Get messages
   */
  async getMessages(
    userId?: string,
    groupId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: Message[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getMessages(userId, groupId, page, limit);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get messages');
    }

    return response.data;
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    const response = await this.api.markMessageAsRead(messageId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to mark message as read');
    }
  }

  // ================================
  // 🔔 NOTIFICATIONS
  // ================================

  /**
   * Get notifications
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      isRead?: boolean;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    pages: number;
  }> {
    const response = await this.api.getNotifications(page, limit, filters);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get notifications');
    }

    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await this.api.markNotificationAsRead(notificationId);

    if (!response.success) {
      throw new Error(response.error || 'Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    const response = await this.api.markAllNotificationsAsRead();

    if (!response.success) {
      throw new Error(response.error || 'Failed to mark all notifications as read');
    }
  }

  // ================================
  // 🛠️ UTILITY METHODS
  // ================================

  /**
   * Clear cache
   */
  clearCache(): void {
    this.api.clearCache();
  }

  /**
   * Get API statistics
   */
  async getApiStats(): Promise<any> {
    const response = await this.api.getApiStats();

    if (!response.success) {
      throw new Error(response.error || 'Failed to get API stats');
    }

    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteUser(): Promise<{ success: boolean; message: string }> {
    const response = await this.api.deleteUser();

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user account');
    }

    return response.data;
  }
}

// Export singleton instance
export const kingdomCircleApi = KingdomCircleApiService.getInstance(); 