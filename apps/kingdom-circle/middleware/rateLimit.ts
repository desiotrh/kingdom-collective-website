/**
 * Rate Limiting and Anti-Spam Middleware for Kingdom Circle 2.0
 * 
 * This middleware provides:
 * - Rate limiting for DMs for new users
 * - Auto-flagging of spam content
 * - Bot behavior detection
 * - Appeal system for visibility drops
 */

interface RateLimitConfig {
    maxDMsPerHour: number;
    maxPostsPerDay: number;
    maxCommentsPerHour: number;
    maxLikesPerHour: number;
    newUserRestrictions: {
        maxDMsPerHour: number;
        maxPostsPerDay: number;
        accountAgeThreshold: number; // in days
    };
}

interface UserActivity {
    userId: string;
    accountCreated: Date;
    lastActivity: Date;
    dmCount: { [hour: string]: number };
    postCount: { [day: string]: number };
    commentCount: { [hour: string]: number };
    likeCount: { [hour: string]: number };
    flaggedContent: string[];
    shadowbanStatus: 'none' | 'partial' | 'full';
    shadowbanReason?: string;
    appealHistory: Appeal[];
}

interface Appeal {
    id: string;
    timestamp: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    moderatorResponse?: string;
}

interface SpamPattern {
    pattern: string;
    type: 'link' | 'text' | 'behavior';
    severity: 'low' | 'medium' | 'high';
    action: 'flag' | 'moderate' | 'shadowban';
}

class RateLimitMiddleware {
    private config: RateLimitConfig;
    private userActivities: Map<string, UserActivity>;
    private spamPatterns: SpamPattern[];

    constructor() {
        this.config = {
            maxDMsPerHour: 50,
            maxPostsPerDay: 20,
            maxCommentsPerHour: 100,
            maxLikesPerHour: 200,
            newUserRestrictions: {
                maxDMsPerHour: 3,
                maxPostsPerDay: 5,
                accountAgeThreshold: 3, // 3 days
            },
        };

        this.userActivities = new Map();
        this.initializeSpamPatterns();
    }

    private initializeSpamPatterns(): void {
        this.spamPatterns = [
            // Link spam patterns
            {
                pattern: /https?:\/\/[^\s]+/g,
                type: 'link',
                severity: 'medium',
                action: 'flag',
            },
            {
                pattern: /(buy|sell|discount|offer|limited|act now)/gi,
                type: 'text',
                severity: 'medium',
                action: 'flag',
            },
            {
                pattern: /(click here|visit now|sign up|join now)/gi,
                type: 'text',
                severity: 'high',
                action: 'moderate',
            },
            // Repeated content patterns
            {
                pattern: /(.+)\1{3,}/g, // Same text repeated 4+ times
                type: 'text',
                severity: 'high',
                action: 'shadowban',
            },
            // Bot-like behavior patterns
            {
                pattern: /(hello|hi|hey)\s*(everyone|all|guys)/gi,
                type: 'text',
                severity: 'low',
                action: 'flag',
            },
        ];
    }

    /**
     * Check if user can send a DM
     */
    public canSendDM(userId: string): { allowed: boolean; reason?: string; remaining?: number } {
        const activity = this.getUserActivity(userId);
        const isNewUser = this.isNewUser(activity);
        const maxDMs = isNewUser ? this.config.newUserRestrictions.maxDMsPerHour : this.config.maxDMsPerHour;
        
        const currentHour = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
        const dmCount = activity.dmCount[currentHour] || 0;

        if (dmCount >= maxDMs) {
            return {
                allowed: false,
                reason: isNewUser 
                    ? 'New users are limited to 3 DMs per hour. Please wait before sending more messages.'
                    : 'DM rate limit exceeded. Please wait before sending more messages.',
                remaining: 0,
            };
        }

        return {
            allowed: true,
            remaining: maxDMs - dmCount,
        };
    }

    /**
     * Record a DM sent by user
     */
    public recordDM(userId: string): void {
        const activity = this.getUserActivity(userId);
        const currentHour = new Date().toISOString().slice(0, 13);
        
        if (!activity.dmCount[currentHour]) {
            activity.dmCount[currentHour] = 0;
        }
        activity.dmCount[currentHour]++;
        activity.lastActivity = new Date();
        
        this.userActivities.set(userId, activity);
    }

    /**
     * Check if user can create a post
     */
    public canCreatePost(userId: string): { allowed: boolean; reason?: string; remaining?: number } {
        const activity = this.getUserActivity(userId);
        const isNewUser = this.isNewUser(activity);
        const maxPosts = isNewUser ? this.config.newUserRestrictions.maxPostsPerDay : this.config.maxPostsPerDay;
        
        const currentDay = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const postCount = activity.postCount[currentDay] || 0;

        if (postCount >= maxPosts) {
            return {
                allowed: false,
                reason: isNewUser
                    ? 'New users are limited to 5 posts per day. Please wait until tomorrow.'
                    : 'Daily post limit exceeded. Please wait until tomorrow.',
                remaining: 0,
            };
        }

        return {
            allowed: true,
            remaining: maxPosts - postCount,
        };
    }

    /**
     * Record a post created by user
     */
    public recordPost(userId: string): void {
        const activity = this.getUserActivity(userId);
        const currentDay = new Date().toISOString().slice(0, 10);
        
        if (!activity.postCount[currentDay]) {
            activity.postCount[currentDay] = 0;
        }
        activity.postCount[currentDay]++;
        activity.lastActivity = new Date();
        
        this.userActivities.set(userId, activity);
    }

    /**
     * Check content for spam patterns
     */
    public checkContentForSpam(content: string, userId: string): {
        isSpam: boolean;
        severity: 'low' | 'medium' | 'high';
        action: 'flag' | 'moderate' | 'shadowban';
        patterns: string[];
        reason: string;
    } {
        const activity = this.getUserActivity(userId);
        const detectedPatterns: string[] = [];
        let highestSeverity: 'low' | 'medium' | 'high' = 'low';
        let recommendedAction: 'flag' | 'moderate' | 'shadowban' = 'flag';

        for (const pattern of this.spamPatterns) {
            const matches = content.match(pattern.pattern);
            if (matches) {
                detectedPatterns.push(pattern.pattern.toString());
                
                // Update severity and action based on pattern
                if (pattern.severity === 'high' || 
                    (pattern.severity === 'medium' && highestSeverity === 'low')) {
                    highestSeverity = pattern.severity;
                }
                
                if (pattern.action === 'shadowban' || 
                    (pattern.action === 'moderate' && recommendedAction === 'flag')) {
                    recommendedAction = pattern.action;
                }
            }
        }

        // Check for repeated content in user's history
        const repeatedContent = this.checkRepeatedContent(content, activity);
        if (repeatedContent) {
            detectedPatterns.push('repeated_content');
            highestSeverity = 'high';
            recommendedAction = 'shadowban';
        }

        const isSpam = detectedPatterns.length > 0;
        const reason = isSpam 
            ? `Content flagged for: ${detectedPatterns.join(', ')}`
            : '';

        return {
            isSpam,
            severity: highestSeverity,
            action: recommendedAction,
            patterns: detectedPatterns,
            reason,
        };
    }

    /**
     * Check for repeated content in user's history
     */
    private checkRepeatedContent(content: string, activity: UserActivity): boolean {
        // This would check against the user's recent posts/comments
        // For now, we'll implement a simple check
        const recentContent = activity.flaggedContent.slice(-10); // Last 10 flagged items
        const normalizedContent = content.toLowerCase().trim();
        
        return recentContent.some(item => 
            item.toLowerCase().trim() === normalizedContent
        );
    }

    /**
     * Apply shadowban based on spam detection
     */
    public applyShadowban(userId: string, reason: string, severity: 'partial' | 'full'): void {
        const activity = this.getUserActivity(userId);
        activity.shadowbanStatus = severity;
        activity.shadowbanReason = reason;
        activity.lastActivity = new Date();
        
        this.userActivities.set(userId, activity);
    }

    /**
     * Check if user is shadowbanned
     */
    public isShadowbanned(userId: string): {
        shadowbanned: boolean;
        status: 'none' | 'partial' | 'full';
        reason?: string;
    } {
        const activity = this.getUserActivity(userId);
        return {
            shadowbanned: activity.shadowbanStatus !== 'none',
            status: activity.shadowbanStatus,
            reason: activity.shadowbanReason,
        };
    }

    /**
     * Submit an appeal for shadowban
     */
    public submitAppeal(userId: string, reason: string): string {
        const activity = this.getUserActivity(userId);
        const appealId = `appeal_${Date.now()}_${userId}`;
        
        const appeal: Appeal = {
            id: appealId,
            timestamp: new Date(),
            reason,
            status: 'pending',
        };

        activity.appealHistory.push(appeal);
        this.userActivities.set(userId, activity);

        return appealId;
    }

    /**
     * Process an appeal (moderator action)
     */
    public processAppeal(appealId: string, approved: boolean, moderatorResponse?: string): void {
        // Find the appeal and update it
        for (const [userId, activity] of this.userActivities.entries()) {
            const appeal = activity.appealHistory.find(a => a.id === appealId);
            if (appeal) {
                appeal.status = approved ? 'approved' : 'rejected';
                appeal.moderatorResponse = moderatorResponse;

                if (approved) {
                    // Remove shadowban
                    activity.shadowbanStatus = 'none';
                    activity.shadowbanReason = undefined;
                }

                this.userActivities.set(userId, activity);
                break;
            }
        }
    }

    /**
     * Get user activity statistics
     */
    public getUserStats(userId: string): {
        accountAge: number;
        totalPosts: number;
        totalDMs: number;
        shadowbanStatus: 'none' | 'partial' | 'full';
        appealCount: number;
        pendingAppeals: number;
    } {
        const activity = this.getUserActivity(userId);
        const accountAge = Math.floor((Date.now() - activity.accountCreated.getTime()) / (1000 * 60 * 60 * 24));
        
        const totalPosts = Object.values(activity.postCount).reduce((sum, count) => sum + count, 0);
        const totalDMs = Object.values(activity.dmCount).reduce((sum, count) => sum + count, 0);
        const appealCount = activity.appealHistory.length;
        const pendingAppeals = activity.appealHistory.filter(a => a.status === 'pending').length;

        return {
            accountAge,
            totalPosts,
            totalDMs,
            shadowbanStatus: activity.shadowbanStatus,
            appealCount,
            pendingAppeals,
        };
    }

    /**
     * Clean up old activity data
     */
    public cleanupOldData(): void {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        for (const [userId, activity] of this.userActivities.entries()) {
            // Clean up old hourly data
            const oldHours = Object.keys(activity.dmCount).filter(hour => 
                new Date(hour) < oneWeekAgo
            );
            oldHours.forEach(hour => delete activity.dmCount[hour]);

            // Clean up old daily data
            const oldDays = Object.keys(activity.postCount).filter(day => 
                new Date(day) < oneWeekAgo
            );
            oldDays.forEach(day => delete activity.postCount[day]);

            this.userActivities.set(userId, activity);
        }
    }

    /**
     * Get or create user activity record
     */
    private getUserActivity(userId: string): UserActivity {
        if (!this.userActivities.has(userId)) {
            const newActivity: UserActivity = {
                userId,
                accountCreated: new Date(),
                lastActivity: new Date(),
                dmCount: {},
                postCount: {},
                commentCount: {},
                likeCount: {},
                flaggedContent: [],
                shadowbanStatus: 'none',
                appealHistory: [],
            };
            this.userActivities.set(userId, newActivity);
        }
        return this.userActivities.get(userId)!;
    }

    /**
     * Check if user is considered "new"
     */
    private isNewUser(activity: UserActivity): boolean {
        const accountAge = Date.now() - activity.accountCreated.getTime();
        const daysOld = accountAge / (1000 * 60 * 60 * 24);
        return daysOld < this.config.newUserRestrictions.accountAgeThreshold;
    }

    /**
     * Get rate limit configuration
     */
    public getConfig(): RateLimitConfig {
        return { ...this.config };
    }

    /**
     * Update rate limit configuration
     */
    public updateConfig(newConfig: Partial<RateLimitConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export singleton instance
export const rateLimitMiddleware = new RateLimitMiddleware();

// Export types for use in other modules
export type {
    RateLimitConfig,
    UserActivity,
    Appeal,
    SpamPattern,
};
