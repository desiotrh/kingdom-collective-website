import { Platform } from 'react-native';

export interface GroupResource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'devotional' | 'template' | 'scripture';
    url: string;
    fileSize?: number;
    duration?: number; // for video/audio
    uploadedBy: string;
    uploadedAt: Date;
    groupId: string;
    tags: string[];
    faithMode: boolean;
    spiritualTags: string[];
    isPublic: boolean;
    downloads: number;
    likes: number;
    comments: ResourceComment[];
    bookmarks: string[]; // user IDs who bookmarked
    scriptureReferences: ScriptureReference[];
    challenges: SpiritualChallenge[];
}

export interface ResourceComment {
    id: string;
    resourceId: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: Date;
    likes: number;
    replies: ResourceComment[];
    faithMode: boolean;
}

export interface ScriptureReference {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
}

export interface SpiritualChallenge {
    id: string;
    title: string;
    description: string;
    duration: number; // days
    type: 'prayer' | 'fasting' | 'study' | 'service' | 'worship';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    rewards: string[];
    participants: string[];
    startDate: Date;
    endDate: Date;
}

export interface ResourceCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    faithMode: boolean;
    parentCategory?: string;
}

export interface UserLibrary {
    userId: string;
    bookmarkedResources: string[];
    downloadedResources: string[];
    createdResources: string[];
    completedChallenges: string[];
    preferences: {
        faithMode: boolean;
        favoriteCategories: string[];
        notificationSettings: {
            newResources: boolean;
            challengeUpdates: boolean;
            scriptureReminders: boolean;
        };
    };
}

export class GroupLibraryService {
    private static instance: GroupLibraryService;
    private resources: Map<string, GroupResource> = new Map();
    private comments: Map<string, ResourceComment[]> = new Map();
    private categories: Map<string, ResourceCategory> = new Map();
    private userLibraries: Map<string, UserLibrary> = new Map();
    private challenges: Map<string, SpiritualChallenge> = new Map();

    static getInstance(): GroupLibraryService {
        if (!GroupLibraryService.instance) {
            GroupLibraryService.instance = new GroupLibraryService();
        }
        return GroupLibraryService.instance;
    }

    // Upload resource to group library
    async uploadResource(resourceData: Partial<GroupResource>): Promise<GroupResource> {
        const resource: GroupResource = {
            id: `resource_${Date.now()}`,
            title: resourceData.title || 'Untitled Resource',
            description: resourceData.description || '',
            type: resourceData.type || 'document',
            url: resourceData.url || '',
            fileSize: resourceData.fileSize,
            duration: resourceData.duration,
            uploadedBy: resourceData.uploadedBy || '',
            uploadedAt: new Date(),
            groupId: resourceData.groupId || '',
            tags: resourceData.tags || [],
            faithMode: resourceData.faithMode || false,
            spiritualTags: resourceData.spiritualTags || [],
            isPublic: resourceData.isPublic || false,
            downloads: 0,
            likes: 0,
            comments: [],
            bookmarks: [],
            scriptureReferences: resourceData.scriptureReferences || [],
            challenges: resourceData.challenges || [],
        };

        this.resources.set(resource.id, resource);
        this.comments.set(resource.id, []);

        // Update user library
        await this.updateUserLibrary(resource.uploadedBy, 'createdResources', resource.id);

        // Send notifications to group members
        await this.notifyGroupMembers(resource);

        return resource;
    }

    // Get resources by group
    async getGroupResources(groupId: string, filters?: {
        type?: string;
        faithMode?: boolean;
        uploadedBy?: string;
        tags?: string[];
    }): Promise<GroupResource[]> {
        let resources = Array.from(this.resources.values()).filter(r => r.groupId === groupId);

        if (filters) {
            if (filters.type) {
                resources = resources.filter(r => r.type === filters.type);
            }
            if (filters.faithMode !== undefined) {
                resources = resources.filter(r => r.faithMode === filters.faithMode);
            }
            if (filters.uploadedBy) {
                resources = resources.filter(r => r.uploadedBy === filters.uploadedBy);
            }
            if (filters.tags && filters.tags.length > 0) {
                resources = resources.filter(r =>
                    filters.tags!.some(tag => r.tags.includes(tag) || r.spiritualTags.includes(tag))
                );
            }
        }

        return resources.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    }

    // Get resource details
    async getResourceDetails(resourceId: string): Promise<GroupResource | null> {
        return this.resources.get(resourceId) || null;
    }

    // Download resource
    async downloadResource(resourceId: string, userId: string): Promise<void> {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        resource.downloads += 1;
        await this.updateUserLibrary(userId, 'downloadedResources', resourceId);
    }

    // Like/unlike resource
    async toggleResourceLike(resourceId: string, userId: string): Promise<void> {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        // Toggle like logic here
        resource.likes += 1; // Simplified for demo
    }

    // Bookmark/unbookmark resource
    async toggleResourceBookmark(resourceId: string, userId: string): Promise<void> {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        const isBookmarked = resource.bookmarks.includes(userId);
        if (isBookmarked) {
            resource.bookmarks = resource.bookmarks.filter(id => id !== userId);
            await this.updateUserLibrary(userId, 'bookmarkedResources', resourceId, true);
        } else {
            resource.bookmarks.push(userId);
            await this.updateUserLibrary(userId, 'bookmarkedResources', resourceId);
        }
    }

    // Add comment to resource
    async addResourceComment(resourceId: string, commentData: Partial<ResourceComment>): Promise<ResourceComment> {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        const comment: ResourceComment = {
            id: `comment_${Date.now()}`,
            resourceId,
            userId: commentData.userId || '',
            userName: commentData.userName || 'Anonymous',
            content: commentData.content || '',
            timestamp: new Date(),
            likes: 0,
            replies: [],
            faithMode: commentData.faithMode || false,
        };

        const resourceComments = this.comments.get(resourceId) || [];
        resourceComments.push(comment);
        this.comments.set(resourceId, resourceComments);

        resource.comments.push(comment);

        return comment;
    }

    // Reply to comment
    async replyToComment(commentId: string, replyData: Partial<ResourceComment>): Promise<ResourceComment> {
        const allComments = Array.from(this.comments.values()).flat();
        const parentComment = allComments.find(c => c.id === commentId);

        if (!parentComment) {
            throw new Error('Comment not found');
        }

        const reply: ResourceComment = {
            id: `reply_${Date.now()}`,
            resourceId: parentComment.resourceId,
            userId: replyData.userId || '',
            userName: replyData.userName || 'Anonymous',
            content: replyData.content || '',
            timestamp: new Date(),
            likes: 0,
            replies: [],
            faithMode: replyData.faithMode || false,
        };

        parentComment.replies.push(reply);

        return reply;
    }

    // Get resource comments
    async getResourceComments(resourceId: string): Promise<ResourceComment[]> {
        return this.comments.get(resourceId) || [];
    }

    // Add scripture reference to resource
    async addScriptureReference(resourceId: string, scriptureData: Partial<ScriptureReference>): Promise<ScriptureReference> {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        const scripture: ScriptureReference = {
            book: scriptureData.book || '',
            chapter: scriptureData.chapter || 1,
            verse: scriptureData.verse || 1,
            text: scriptureData.text || '',
            translation: scriptureData.translation || 'NIV',
        };

        resource.scriptureReferences.push(scripture);
        return scripture;
    }

    // Create spiritual challenge
    async createSpiritualChallenge(challengeData: Partial<SpiritualChallenge>): Promise<SpiritualChallenge> {
        const challenge: SpiritualChallenge = {
            id: `challenge_${Date.now()}`,
            title: challengeData.title || 'Spiritual Challenge',
            description: challengeData.description || '',
            duration: challengeData.duration || 7,
            type: challengeData.type || 'prayer',
            difficulty: challengeData.difficulty || 'beginner',
            rewards: challengeData.rewards || [],
            participants: challengeData.participants || [],
            startDate: challengeData.startDate || new Date(),
            endDate: challengeData.endDate || new Date(Date.now() + (challengeData.duration || 7) * 86400000),
        };

        this.challenges.set(challenge.id, challenge);

        // Add to resources if associated
        if (challengeData.resourceId) {
            const resource = this.resources.get(challengeData.resourceId);
            if (resource) {
                resource.challenges.push(challenge);
            }
        }

        return challenge;
    }

    // Join spiritual challenge
    async joinSpiritualChallenge(challengeId: string, userId: string): Promise<void> {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }

        if (!challenge.participants.includes(userId)) {
            challenge.participants.push(userId);
        }
    }

    // Complete spiritual challenge
    async completeSpiritualChallenge(challengeId: string, userId: string): Promise<void> {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }

        await this.updateUserLibrary(userId, 'completedChallenges', challengeId);
    }

    // Get user library
    async getUserLibrary(userId: string): Promise<UserLibrary> {
        let userLibrary = this.userLibraries.get(userId);

        if (!userLibrary) {
            userLibrary = {
                userId,
                bookmarkedResources: [],
                downloadedResources: [],
                createdResources: [],
                completedChallenges: [],
                preferences: {
                    faithMode: false,
                    favoriteCategories: [],
                    notificationSettings: {
                        newResources: true,
                        challengeUpdates: true,
                        scriptureReminders: true,
                    },
                },
            };
            this.userLibraries.set(userId, userLibrary);
        }

        return userLibrary;
    }

    // Update user library preferences
    async updateUserLibraryPreferences(userId: string, preferences: Partial<UserLibrary['preferences']>): Promise<void> {
        const userLibrary = await this.getUserLibrary(userId);
        Object.assign(userLibrary.preferences, preferences);
    }

    // Get bookmarked resources
    async getBookmarkedResources(userId: string): Promise<GroupResource[]> {
        const userLibrary = await this.getUserLibrary(userId);
        return userLibrary.bookmarkedResources
            .map(id => this.resources.get(id))
            .filter(Boolean) as GroupResource[];
    }

    // Search resources
    async searchResources(query: string, filters?: {
        groupId?: string;
        type?: string;
        faithMode?: boolean;
        tags?: string[];
    }): Promise<GroupResource[]> {
        let resources = Array.from(this.resources.values());

        // Apply filters
        if (filters) {
            if (filters.groupId) {
                resources = resources.filter(r => r.groupId === filters.groupId);
            }
            if (filters.type) {
                resources = resources.filter(r => r.type === filters.type);
            }
            if (filters.faithMode !== undefined) {
                resources = resources.filter(r => r.faithMode === filters.faithMode);
            }
            if (filters.tags && filters.tags.length > 0) {
                resources = resources.filter(r =>
                    filters.tags!.some(tag => r.tags.includes(tag) || r.spiritualTags.includes(tag))
                );
            }
        }

        // Search in title, description, and tags
        const searchTerms = query.toLowerCase().split(' ');
        return resources.filter(resource => {
            const searchableText = [
                resource.title,
                resource.description,
                ...resource.tags,
                ...resource.spiritualTags,
            ].join(' ').toLowerCase();

            return searchTerms.every(term => searchableText.includes(term));
        });
    }

    // Get resource categories
    async getResourceCategories(): Promise<ResourceCategory[]> {
        return Array.from(this.categories.values());
    }

    // Get faith mode statistics
    async getFaithModeStats(groupId?: string): Promise<any> {
        let resources = Array.from(this.resources.values());

        if (groupId) {
            resources = resources.filter(r => r.groupId === groupId);
        }

        const faithResources = resources.filter(r => r.faithMode);
        const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
        const faithDownloads = faithResources.reduce((sum, r) => sum + r.downloads, 0);

        return {
            totalResources: resources.length,
            faithResources: faithResources.length,
            totalDownloads,
            faithDownloads,
            popularTags: this.getPopularTags(resources),
            scriptureReferences: this.getScriptureStats(resources),
        };
    }

    // Private methods
    private async updateUserLibrary(userId: string, field: keyof UserLibrary, value: string, remove: boolean = false): Promise<void> {
        const userLibrary = await this.getUserLibrary(userId);

        if (remove) {
            userLibrary[field] = (userLibrary[field] as string[]).filter(id => id !== value);
        } else {
            if (!(userLibrary[field] as string[]).includes(value)) {
                (userLibrary[field] as string[]).push(value);
            }
        }
    }

    private async notifyGroupMembers(resource: GroupResource): Promise<void> {
        console.log(`Notifying group members about new resource: ${resource.title}`);
    }

    private getPopularTags(resources: GroupResource[]): any {
        const tagCounts: any = {};

        resources.forEach(resource => {
            [...resource.tags, ...resource.spiritualTags].forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));
    }

    private getScriptureStats(resources: GroupResource[]): any {
        const scriptureCounts: any = {};

        resources.forEach(resource => {
            resource.scriptureReferences.forEach(ref => {
                const key = `${ref.book} ${ref.chapter}:${ref.verse}`;
                scriptureCounts[key] = (scriptureCounts[key] || 0) + 1;
            });
        });

        return Object.entries(scriptureCounts)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([reference, count]) => ({ reference, count }));
    }

    // Initialize categories
    initializeCategories(): void {
        const categories: ResourceCategory[] = [
            {
                id: 'devotionals',
                name: 'Devotionals',
                description: 'Daily devotionals and spiritual readings',
                icon: '📖',
                faithMode: true,
            },
            {
                id: 'sermons',
                name: 'Sermons',
                description: 'Preached messages and teachings',
                icon: '🎤',
                faithMode: true,
            },
            {
                id: 'worship',
                name: 'Worship',
                description: 'Worship music and lyrics',
                icon: '🎵',
                faithMode: true,
            },
            {
                id: 'prayer',
                name: 'Prayer',
                description: 'Prayer guides and resources',
                icon: '🙏',
                faithMode: true,
            },
            {
                id: 'study',
                name: 'Bible Study',
                description: 'Bible study materials and guides',
                icon: '📚',
                faithMode: true,
            },
            {
                id: 'templates',
                name: 'Templates',
                description: 'Reusable templates and forms',
                icon: '📋',
                faithMode: false,
            },
            {
                id: 'documents',
                name: 'Documents',
                description: 'General documents and files',
                icon: '📄',
                faithMode: false,
            },
        ];

        categories.forEach(category => {
            this.categories.set(category.id, category);
        });
    }

    // Mock data for development
    getMockResources(): GroupResource[] {
        return [
            {
                id: 'resource_1',
                title: 'Daily Prayer Guide',
                description: 'A comprehensive guide for daily prayer and spiritual discipline',
                type: 'devotional',
                url: 'https://example.com/prayer-guide.pdf',
                fileSize: 2048576, // 2MB
                uploadedBy: 'user_1',
                uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
                groupId: 'group_1',
                tags: ['prayer', 'daily', 'spiritual-discipline'],
                faithMode: true,
                spiritualTags: ['prayer', 'devotion', 'spiritual-growth'],
                isPublic: true,
                downloads: 45,
                likes: 12,
                comments: [],
                bookmarks: ['user_2', 'user_3'],
                scriptureReferences: [
                    {
                        book: 'Matthew',
                        chapter: 6,
                        verse: 9,
                        text: 'Our Father in heaven, hallowed be your name...',
                        translation: 'NIV',
                    },
                ],
                challenges: [],
            },
            {
                id: 'resource_2',
                title: 'Worship Song Collection',
                description: 'Collection of contemporary worship songs with lyrics and chords',
                type: 'audio',
                url: 'https://example.com/worship-songs.zip',
                fileSize: 15728640, // 15MB
                duration: 3600, // 1 hour
                uploadedBy: 'user_2',
                uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
                groupId: 'group_1',
                tags: ['worship', 'music', 'lyrics'],
                faithMode: true,
                spiritualTags: ['worship', 'praise', 'music'],
                isPublic: true,
                downloads: 23,
                likes: 8,
                comments: [],
                bookmarks: ['user_1'],
                scriptureReferences: [
                    {
                        book: 'Psalms',
                        chapter: 100,
                        verse: 1,
                        text: 'Shout for joy to the Lord, all the earth.',
                        translation: 'NIV',
                    },
                ],
                challenges: [],
            },
            {
                id: 'resource_3',
                title: 'Bible Study Template',
                description: 'Template for organizing and leading Bible study groups',
                type: 'template',
                url: 'https://example.com/bible-study-template.docx',
                fileSize: 512000, // 500KB
                uploadedBy: 'user_3',
                uploadedAt: new Date(Date.now() - 259200000), // 3 days ago
                groupId: 'group_2',
                tags: ['template', 'bible-study', 'organization'],
                faithMode: false,
                spiritualTags: [],
                isPublic: true,
                downloads: 67,
                likes: 15,
                comments: [],
                bookmarks: ['user_1', 'user_2', 'user_4'],
                scriptureReferences: [],
                challenges: [],
            },
        ];
    }

    getMockChallenges(): SpiritualChallenge[] {
        return [
            {
                id: 'challenge_1',
                title: '7-Day Prayer Challenge',
                description: 'Commit to praying for 30 minutes each day for a week',
                duration: 7,
                type: 'prayer',
                difficulty: 'beginner',
                rewards: ['Spiritual growth', 'Closer relationship with God', 'Peace of mind'],
                participants: ['user_1', 'user_2', 'user_3'],
                startDate: new Date(),
                endDate: new Date(Date.now() + 604800000), // 7 days
            },
            {
                id: 'challenge_2',
                title: '21-Day Scripture Memorization',
                description: 'Memorize one Bible verse each day for three weeks',
                duration: 21,
                type: 'study',
                difficulty: 'intermediate',
                rewards: ['Biblical knowledge', 'Mental discipline', 'Spiritual wisdom'],
                participants: ['user_1', 'user_4'],
                startDate: new Date(),
                endDate: new Date(Date.now() + 1814400000), // 21 days
            },
        ];
    }
}

export const groupLibraryService = GroupLibraryService.getInstance(); 