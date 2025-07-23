import { Platform } from 'react-native';

export interface GroupResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'image' | 'presentation' | 'devotional' | 'template';
    fileUrl?: string;
    content?: string;
    thumbnailUrl?: string;
    groupId: string;
    uploadedBy: string;
    uploaderName: string;
    uploaderAvatar?: string;
    uploadDate: Date;
    lastModified: Date;
    fileSize?: number;
    duration?: number; // for audio/video
    tags: string[];
    categories: string[];
    isPublic: boolean;
    isApproved: boolean;
    downloadCount: number;
    viewCount: number;
    faithMode: boolean;
    scriptureReferences?: ScriptureReference[];
    spiritualChallenges?: SpiritualChallenge[];
}

export interface ScriptureReference {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    relevance: string;
}

export interface SpiritualChallenge {
    id: string;
    title: string;
    description: string;
    duration: number; // days
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'prayer' | 'fasting' | 'study' | 'service' | 'worship';
    faithMode: true;
}

export interface ResourceComment {
    id: string;
    resourceId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    comment: string;
    timestamp: Date;
    isEdited: boolean;
    editDate?: Date;
    likes: number;
    replies: ResourceReply[];
    faithMode: boolean;
}

export interface ResourceReply {
    id: string;
    commentId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    reply: string;
    timestamp: Date;
    faithMode: boolean;
}

export interface ResourceBookmark {
    id: string;
    userId: string;
    resourceId: string;
    bookmarkDate: Date;
    notes?: string;
    tags: string[];
    faithMode: boolean;
}

export interface ResourceDiscussion {
    id: string;
    resourceId: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt: Date;
    participants: string[];
    messages: DiscussionMessage[];
    isActive: boolean;
    faithMode: boolean;
}

export interface DiscussionMessage {
    id: string;
    discussionId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    timestamp: Date;
    messageType: 'comment' | 'question' | 'insight' | 'prayer';
    faithMode: boolean;
}

export interface ResourceAnalytics {
    resourceId: string;
    totalViews: number;
    totalDownloads: number;
    uniqueViewers: number;
    averageViewTime: number;
    completionRate: number;
    engagementScore: number;
    faithModeUsage: number;
}

export interface ResourceTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    templateData: any;
    createdBy: string;
    isPublic: boolean;
    usageCount: number;
    faithMode: boolean;
}

class GroupLibraryService {
    private resources: GroupResource[] = [];
    private comments: ResourceComment[] = [];
    private bookmarks: ResourceBookmark[] = [];
    private discussions: ResourceDiscussion[] = [];
    private analytics: Map<string, ResourceAnalytics> = new Map();
    private templates: ResourceTemplate[] = [];

    // Upload resource
    async uploadResource(resourceData: Omit<GroupResource, 'id' | 'uploadDate' | 'lastModified' | 'downloadCount' | 'viewCount' | 'isApproved'>): Promise<GroupResource> {
        const newResource: GroupResource = {
            id: `resource_${Date.now()}`,
            ...resourceData,
            uploadDate: new Date(),
            lastModified: new Date(),
            downloadCount: 0,
            viewCount: 0,
            isApproved: true, // Auto-approve for now, could be moderated
        };

        this.resources.push(newResource);

        // Initialize analytics
        this.analytics.set(newResource.id, {
            resourceId: newResource.id,
            totalViews: 0,
            totalDownloads: 0,
            uniqueViewers: 0,
            averageViewTime: 0,
            completionRate: 0,
            engagementScore: 0,
            faithModeUsage: 0,
        });

        return newResource;
    }

    // Get resources for group
    async getGroupResources(groupId: string, filters?: {
        type?: string;
        category?: string;
        faithMode?: boolean;
        isPublic?: boolean;
        uploadedBy?: string;
        tags?: string[];
    }): Promise<GroupResource[]> {
        let filtered = this.resources.filter(r => r.groupId === groupId);

        if (filters?.type) {
            filtered = filtered.filter(r => r.type === filters.type);
        }

        if (filters?.category) {
            filtered = filtered.filter(r => r.categories.includes(filters.category!));
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(r => r.faithMode === filters.faithMode);
        }

        if (filters?.isPublic !== undefined) {
            filtered = filtered.filter(r => r.isPublic === filters.isPublic);
        }

        if (filters?.uploadedBy) {
            filtered = filtered.filter(r => r.uploadedBy === filters.uploadedBy);
        }

        if (filters?.tags && filters.tags.length > 0) {
            filtered = filtered.filter(r =>
                filters.tags!.some(tag => r.tags.includes(tag))
            );
        }

        return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    // Get resource details
    async getResourceDetails(resourceId: string): Promise<{
        resource: GroupResource;
        comments: ResourceComment[];
        bookmarks: number;
        isBookmarked: boolean;
        analytics: ResourceAnalytics;
    }> {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) throw new Error('Resource not found');

        const comments = this.comments.filter(c => c.resourceId === resourceId);
        const bookmarks = this.bookmarks.filter(b => b.resourceId === resourceId).length;
        const analytics = this.analytics.get(resourceId) || {
            resourceId,
            totalViews: 0,
            totalDownloads: 0,
            uniqueViewers: 0,
            averageViewTime: 0,
            completionRate: 0,
            engagementScore: 0,
            faithModeUsage: 0,
        };

        return {
            resource,
            comments,
            bookmarks,
            isBookmarked: false, // Would be determined by current user
            analytics,
        };
    }

    // Add comment to resource
    async addResourceComment(comment: Omit<ResourceComment, 'id' | 'timestamp' | 'likes' | 'replies'>): Promise<ResourceComment> {
        const newComment: ResourceComment = {
            id: `comment_${Date.now()}`,
            ...comment,
            timestamp: new Date(),
            likes: 0,
            replies: [],
        };

        this.comments.push(newComment);
        return newComment;
    }

    // Reply to comment
    async replyToComment(reply: Omit<ResourceReply, 'id' | 'timestamp'>): Promise<ResourceReply> {
        const comment = this.comments.find(c => c.id === reply.commentId);
        if (!comment) throw new Error('Comment not found');

        const newReply: ResourceReply = {
            id: `reply_${Date.now()}`,
            ...reply,
            timestamp: new Date(),
        };

        comment.replies.push(newReply);
        return newReply;
    }

    // Bookmark resource
    async bookmarkResource(bookmark: Omit<ResourceBookmark, 'id' | 'bookmarkDate'>): Promise<ResourceBookmark> {
        const newBookmark: ResourceBookmark = {
            id: `bookmark_${Date.now()}`,
            ...bookmark,
            bookmarkDate: new Date(),
        };

        this.bookmarks.push(newBookmark);
        return newBookmark;
    }

    // Remove bookmark
    async removeBookmark(userId: string, resourceId: string): Promise<boolean> {
        const bookmarkIndex = this.bookmarks.findIndex(b =>
            b.userId === userId && b.resourceId === resourceId
        );

        if (bookmarkIndex === -1) return false;

        this.bookmarks.splice(bookmarkIndex, 1);
        return true;
    }

    // Get user bookmarks
    async getUserBookmarks(userId: string, faithMode?: boolean): Promise<ResourceBookmark[]> {
        let filtered = this.bookmarks.filter(b => b.userId === userId);

        if (faithMode !== undefined) {
            filtered = filtered.filter(b => b.faithMode === faithMode);
        }

        return filtered.sort((a, b) => b.bookmarkDate.getTime() - a.bookmarkDate.getTime());
    }

    // Create discussion thread
    async createDiscussion(discussion: Omit<ResourceDiscussion, 'id' | 'createdAt' | 'participants' | 'messages' | 'isActive'>): Promise<ResourceDiscussion> {
        const newDiscussion: ResourceDiscussion = {
            id: `discussion_${Date.now()}`,
            ...discussion,
            createdAt: new Date(),
            participants: [discussion.createdBy],
            messages: [],
            isActive: true,
        };

        this.discussions.push(newDiscussion);
        return newDiscussion;
    }

    // Add message to discussion
    async addDiscussionMessage(message: Omit<DiscussionMessage, 'id' | 'timestamp'>): Promise<DiscussionMessage> {
        const discussion = this.discussions.find(d => d.id === message.discussionId);
        if (!discussion) throw new Error('Discussion not found');

        const newMessage: DiscussionMessage = {
            id: `msg_${Date.now()}`,
            ...message,
            timestamp: new Date(),
        };

        discussion.messages.push(newMessage);

        // Add user to participants if not already there
        if (!discussion.participants.includes(message.userId)) {
            discussion.participants.push(message.userId);
        }

        return newMessage;
    }

    // Get discussions for resource
    async getResourceDiscussions(resourceId: string): Promise<ResourceDiscussion[]> {
        return this.discussions.filter(d => d.resourceId === resourceId && d.isActive);
    }

    // Add scripture reference
    async addScriptureReference(resourceId: string, reference: ScriptureReference): Promise<void> {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) throw new Error('Resource not found');

        if (!resource.scriptureReferences) {
            resource.scriptureReferences = [];
        }

        resource.scriptureReferences.push(reference);
        resource.lastModified = new Date();
    }

    // Add spiritual challenge
    async addSpiritualChallenge(resourceId: string, challenge: SpiritualChallenge): Promise<void> {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) throw new Error('Resource not found');

        if (!resource.spiritualChallenges) {
            resource.spiritualChallenges = [];
        }

        resource.spiritualChallenges.push(challenge);
        resource.lastModified = new Date();
    }

    // Track resource view
    async trackResourceView(resourceId: string, userId?: string): Promise<void> {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;

        resource.viewCount++;
        resource.lastModified = new Date();

        const analytics = this.analytics.get(resourceId);
        if (analytics) {
            analytics.totalViews++;
            if (userId) {
                analytics.uniqueViewers++;
            }
            if (resource.faithMode) {
                analytics.faithModeUsage++;
            }
        }
    }

    // Track resource download
    async trackResourceDownload(resourceId: string): Promise<void> {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;

        resource.downloadCount++;
        resource.lastModified = new Date();

        const analytics = this.analytics.get(resourceId);
        if (analytics) {
            analytics.totalDownloads++;
        }
    }

    // Search resources
    async searchResources(groupId: string, query: string, filters?: {
        type?: string;
        faithMode?: boolean;
        tags?: string[];
    }): Promise<GroupResource[]> {
        let filtered = this.resources.filter(r => r.groupId === groupId);

        // Text search
        const searchTerms = query.toLowerCase().split(' ');
        filtered = filtered.filter(r =>
            searchTerms.some(term =>
                r.title.toLowerCase().includes(term) ||
                r.description.toLowerCase().includes(term) ||
                r.tags.some(tag => tag.toLowerCase().includes(term)) ||
                r.categories.some(cat => cat.toLowerCase().includes(term))
            )
        );

        // Apply filters
        if (filters?.type) {
            filtered = filtered.filter(r => r.type === filters.type);
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(r => r.faithMode === filters.faithMode);
        }

        if (filters?.tags && filters.tags.length > 0) {
            filtered = filtered.filter(r =>
                filters.tags!.some(tag => r.tags.includes(tag))
            );
        }

        return filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    // Get resource templates
    async getResourceTemplates(category?: string, faithMode?: boolean): Promise<ResourceTemplate[]> {
        let filtered = this.templates.filter(t => t.isPublic);

        if (category) {
            filtered = filtered.filter(t => t.category === category);
        }

        if (faithMode !== undefined) {
            filtered = filtered.filter(t => t.faithMode === faithMode);
        }

        return filtered.sort((a, b) => b.usageCount - a.usageCount);
    }

    // Create resource template
    async createResourceTemplate(template: Omit<ResourceTemplate, 'id' | 'usageCount'>): Promise<ResourceTemplate> {
        const newTemplate: ResourceTemplate = {
            id: `template_${Date.now()}`,
            ...template,
            usageCount: 0,
        };

        this.templates.push(newTemplate);
        return newTemplate;
    }

    // Get resource analytics
    async getResourceAnalytics(resourceId: string): Promise<ResourceAnalytics> {
        return this.analytics.get(resourceId) || {
            resourceId,
            totalViews: 0,
            totalDownloads: 0,
            uniqueViewers: 0,
            averageViewTime: 0,
            completionRate: 0,
            engagementScore: 0,
            faithModeUsage: 0,
        };
    }

    // Get group library analytics
    async getGroupLibraryAnalytics(groupId: string): Promise<{
        totalResources: number;
        totalViews: number;
        totalDownloads: number;
        faithModeResources: number;
        topResources: GroupResource[];
        recentActivity: any[];
    }> {
        const groupResources = this.resources.filter(r => r.groupId === groupId);
        const totalResources = groupResources.length;
        const totalViews = groupResources.reduce((sum, r) => sum + r.viewCount, 0);
        const totalDownloads = groupResources.reduce((sum, r) => sum + r.downloadCount, 0);
        const faithModeResources = groupResources.filter(r => r.faithMode).length;

        const topResources = groupResources
            .sort((a, b) => (b.viewCount + b.downloadCount) - (a.viewCount + a.downloadCount))
            .slice(0, 5);

        const recentActivity = [
            ...groupResources.map(r => ({ type: 'upload', resource: r, date: r.uploadDate })),
            ...this.comments.filter(c => groupResources.some(r => r.id === c.resourceId))
                .map(c => ({ type: 'comment', comment: c, date: c.timestamp })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10);

        return {
            totalResources,
            totalViews,
            totalDownloads,
            faithModeResources,
            topResources,
            recentActivity,
        };
    }

    // Mock data for testing
    getMockResources(): GroupResource[] {
        return [
            {
                id: 'resource_1',
                title: 'Daily Devotional Template',
                description: 'A comprehensive template for creating daily devotionals',
                type: 'template',
                content: 'Template content here...',
                groupId: 'group_1',
                uploadedBy: 'user_1',
                uploaderName: 'Pastor Sarah',
                uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                tags: ['devotional', 'template', 'daily'],
                categories: ['templates', 'devotionals'],
                isPublic: true,
                isApproved: true,
                downloadCount: 15,
                viewCount: 45,
                faithMode: true,
                scriptureReferences: [
                    {
                        book: 'Psalm',
                        chapter: 119,
                        verse: 105,
                        text: 'Your word is a lamp to my feet and a light to my path.',
                        relevance: 'Guidance for daily living',
                    }
                ],
                spiritualChallenges: [
                    {
                        id: 'challenge_1',
                        title: '30-Day Prayer Challenge',
                        description: 'Commit to 30 days of consistent prayer',
                        duration: 30,
                        difficulty: 'intermediate',
                        category: 'prayer',
                        faithMode: true,
                    }
                ],
            },
            {
                id: 'resource_2',
                title: 'Worship Song Collection',
                description: 'Collection of contemporary worship songs for group worship',
                type: 'audio',
                fileUrl: 'https://example.com/worship-songs.mp3',
                duration: 3600, // 1 hour
                groupId: 'group_1',
                uploadedBy: 'user_2',
                uploaderName: 'Worship Team',
                uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                tags: ['worship', 'music', 'songs'],
                categories: ['audio', 'worship'],
                isPublic: true,
                isApproved: true,
                downloadCount: 8,
                viewCount: 23,
                faithMode: true,
            },
        ];
    }
}

export const groupLibraryService = new GroupLibraryService(); 