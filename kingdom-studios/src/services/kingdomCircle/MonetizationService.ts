import { Platform } from 'react-native';

export interface CreatorDashboard {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    creatorType: 'mentor' | 'leader' | 'teacher' | 'counselor' | 'worship-leader';
    bio: string;
    expertise: string[];
    experience: number; // years
    rating: number;
    totalStudents: number;
    totalEarnings: number;
    monthlyEarnings: number;
    isActive: boolean;
    isVerified: boolean;
    faithMode: boolean;
    services: CreatorService[];
    availability: CreatorAvailability[];
    testimonials: CreatorTestimonial[];
    certifications: string[];
    languages: string[];
}

export interface CreatorService {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    type: 'one-on-one' | 'group-session' | 'course' | 'workshop' | 'consultation';
    price: number;
    currency: string;
    duration: number; // minutes
    maxParticipants?: number;
    isActive: boolean;
    category: string;
    tags: string[];
    faithMode: boolean;
    requirements?: string[];
    materials?: string[];
}

export interface CreatorAvailability {
    id: string;
    creatorId: string;
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    timeSlots: TimeSlot[];
    timezone: string;
}

export interface TimeSlot {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    isAvailable: boolean;
}

export interface CreatorTestimonial {
    id: string;
    creatorId: string;
    studentId: string;
    studentName: string;
    studentAvatar?: string;
    rating: number;
    review: string;
    date: Date;
    isVerified: boolean;
    faithMode: boolean;
}

export interface AffiliateShare {
    id: string;
    userId: string;
    userName: string;
    shareType: 'event' | 'group' | 'content' | 'service';
    targetId: string;
    targetTitle: string;
    targetDescription: string;
    shareUrl: string;
    shareCode: string;
    commission: number; // percentage
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    isActive: boolean;
    createdAt: Date;
    expiresAt?: Date;
    faithMode: boolean;
}

export interface PremiumGroup {
    id: string;
    groupId: string;
    groupName: string;
    groupDescription: string;
    tier: 'basic' | 'premium' | 'elite' | 'platinum';
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    features: PremiumFeature[];
    maxMembers: number;
    currentMembers: number;
    isActive: boolean;
    stripeProductId?: string;
    stripePriceId?: string;
    faithMode: boolean;
    createdAt: Date;
    trialDays: number;
}

export interface PremiumFeature {
    id: string;
    name: string;
    description: string;
    type: 'access' | 'content' | 'support' | 'exclusive';
    isIncluded: boolean;
    faithMode: boolean;
}

export interface DonationButton {
    id: string;
    userId: string;
    userName: string;
    cause: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    currency: string;
    isActive: boolean;
    isPublic: boolean;
    faithMode: boolean;
    donations: Donation[];
    createdAt: Date;
    endDate?: Date;
    stripeAccountId?: string;
}

export interface Donation {
    id: string;
    donationButtonId: string;
    donorId?: string;
    donorName: string;
    donorEmail?: string;
    amount: number;
    currency: string;
    message?: string;
    isAnonymous: boolean;
    isPublic: boolean;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripePaymentIntentId?: string;
    createdAt: Date;
    faithMode: boolean;
}

export interface PaymentTransaction {
    id: string;
    userId: string;
    type: 'purchase' | 'donation' | 'subscription' | 'refund';
    amount: number;
    currency: string;
    description: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripePaymentIntentId?: string;
    metadata: any;
    createdAt: Date;
    completedAt?: Date;
    faithMode: boolean;
}

export interface RevenueAnalytics {
    userId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    topRevenueSources: RevenueSource[];
    growthRate: number;
    faithModeRevenue: number;
    faithModePercentage: number;
}

export interface RevenueSource {
    source: string;
    amount: number;
    percentage: number;
    transactionCount: number;
}

class MonetizationService {
    private creatorDashboards: CreatorDashboard[] = [];
    private affiliateShares: AffiliateShare[] = [];
    private premiumGroups: PremiumGroup[] = [];
    private donationButtons: DonationButton[] = [];
    private paymentTransactions: PaymentTransaction[] = [];

    // Create creator dashboard
    async createCreatorDashboard(dashboard: Omit<CreatorDashboard, 'id' | 'totalEarnings' | 'monthlyEarnings' | 'isVerified'>): Promise<CreatorDashboard> {
        const newDashboard: CreatorDashboard = {
            id: `creator_${Date.now()}`,
            ...dashboard,
            totalEarnings: 0,
            monthlyEarnings: 0,
            isVerified: false,
        };

        this.creatorDashboards.push(newDashboard);
        return newDashboard;
    }

    // Add creator service
    async addCreatorService(service: Omit<CreatorService, 'id'>): Promise<CreatorService> {
        const newService: CreatorService = {
            id: `service_${Date.now()}`,
            ...service,
        };

        const creator = this.creatorDashboards.find(c => c.id === service.creatorId);
        if (creator) {
            creator.services.push(newService);
        }

        return newService;
    }

    // Get creator dashboard
    async getCreatorDashboard(creatorId: string): Promise<CreatorDashboard | null> {
        return this.creatorDashboards.find(c => c.id === creatorId) || null;
    }

    // Get available creators
    async getAvailableCreators(filters?: {
        type?: string;
        expertise?: string[];
        faithMode?: boolean;
        maxPrice?: number;
        availability?: string;
    }): Promise<CreatorDashboard[]> {
        let filtered = this.creatorDashboards.filter(c => c.isActive);

        if (filters?.type) {
            filtered = filtered.filter(c => c.creatorType === filters.type);
        }

        if (filters?.expertise && filters.expertise.length > 0) {
            filtered = filtered.filter(c =>
                filters.expertise!.some(exp => c.expertise.includes(exp))
            );
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(c => c.faithMode === filters.faithMode);
        }

        if (filters?.maxPrice) {
            filtered = filtered.filter(c =>
                c.services.some(s => s.price <= filters.maxPrice!)
            );
        }

        return filtered.sort((a, b) => b.rating - a.rating);
    }

    // Create affiliate share link
    async createAffiliateShare(share: Omit<AffiliateShare, 'id' | 'totalClicks' | 'totalConversions' | 'totalEarnings' | 'createdAt'>): Promise<AffiliateShare> {
        const newShare: AffiliateShare = {
            id: `affiliate_${Date.now()}`,
            ...share,
            totalClicks: 0,
            totalConversions: 0,
            totalEarnings: 0,
            createdAt: new Date(),
        };

        this.affiliateShares.push(newShare);
        return newShare;
    }

    // Track affiliate click
    async trackAffiliateClick(shareId: string): Promise<void> {
        const share = this.affiliateShares.find(s => s.id === shareId);
        if (share) {
            share.totalClicks++;
        }
    }

    // Track affiliate conversion
    async trackAffiliateConversion(shareId: string, amount: number): Promise<void> {
        const share = this.affiliateShares.find(s => s.id === shareId);
        if (share) {
            share.totalConversions++;
            share.totalEarnings += (amount * share.commission / 100);
        }
    }

    // Get user's affiliate shares
    async getUserAffiliateShares(userId: string): Promise<AffiliateShare[]> {
        return this.affiliateShares
            .filter(s => s.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Create premium group
    async createPremiumGroup(group: Omit<PremiumGroup, 'id' | 'currentMembers' | 'createdAt'>): Promise<PremiumGroup> {
        const newGroup: PremiumGroup = {
            id: `premium_${Date.now()}`,
            ...group,
            currentMembers: 0,
            createdAt: new Date(),
        };

        this.premiumGroups.push(newGroup);
        return newGroup;
    }

    // Subscribe to premium group
    async subscribeToPremiumGroup(groupId: string, userId: string, paymentData: any): Promise<PaymentTransaction> {
        const group = this.premiumGroups.find(g => g.id === groupId);
        if (!group) throw new Error('Premium group not found');

        if (group.currentMembers >= group.maxMembers) {
            throw new Error('Group is full');
        }

        const transaction: PaymentTransaction = {
            id: `transaction_${Date.now()}`,
            userId,
            type: 'subscription',
            amount: group.price,
            currency: group.currency,
            description: `Premium group subscription: ${group.groupName}`,
            status: 'completed',
            metadata: {
                groupId,
                groupName: group.groupName,
                tier: group.tier,
                billingCycle: group.billingCycle,
            },
            createdAt: new Date(),
            completedAt: new Date(),
            faithMode: group.faithMode,
        };

        this.paymentTransactions.push(transaction);
        group.currentMembers++;

        return transaction;
    }

    // Get premium groups
    async getPremiumGroups(filters?: {
        tier?: string;
        faithMode?: boolean;
        maxPrice?: number;
        isActive?: boolean;
    }): Promise<PremiumGroup[]> {
        let filtered = this.premiumGroups;

        if (filters?.tier) {
            filtered = filtered.filter(g => g.tier === filters.tier);
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(g => g.faithMode === filters.faithMode);
        }

        if (filters?.maxPrice) {
            filtered = filtered.filter(g => g.price <= filters.maxPrice!);
        }

        if (filters?.isActive !== undefined) {
            filtered = filtered.filter(g => g.isActive === filters.isActive);
        }

        return filtered.sort((a, b) => a.price - b.price);
    }

    // Create donation button
    async createDonationButton(donation: Omit<DonationButton, 'id' | 'currentAmount' | 'donations' | 'createdAt'>): Promise<DonationButton> {
        const newDonation: DonationButton = {
            id: `donation_${Date.now()}`,
            ...donation,
            currentAmount: 0,
            donations: [],
            createdAt: new Date(),
        };

        this.donationButtons.push(newDonation);
        return newDonation;
    }

    // Make donation
    async makeDonation(donation: Omit<Donation, 'id' | 'status' | 'createdAt'>): Promise<Donation> {
        const donationButton = this.donationButtons.find(d => d.id === donation.donationButtonId);
        if (!donationButton) throw new Error('Donation button not found');

        const newDonation: Donation = {
            id: `donation_${Date.now()}`,
            ...donation,
            status: 'completed',
            createdAt: new Date(),
        };

        donationButton.donations.push(newDonation);
        donationButton.currentAmount += donation.amount;

        // Create payment transaction
        const transaction: PaymentTransaction = {
            id: `transaction_${Date.now()}`,
            userId: donation.donorId || 'anonymous',
            type: 'donation',
            amount: donation.amount,
            currency: donation.currency,
            description: `Donation to ${donationButton.cause}`,
            status: 'completed',
            metadata: {
                donationButtonId: donation.donationButtonId,
                cause: donationButton.cause,
                message: donation.message,
            },
            createdAt: new Date(),
            completedAt: new Date(),
            faithMode: donation.faithMode,
        };

        this.paymentTransactions.push(transaction);

        return newDonation;
    }

    // Get donation buttons
    async getDonationButtons(filters?: {
        userId?: string;
        faithMode?: boolean;
        isActive?: boolean;
        isPublic?: boolean;
    }): Promise<DonationButton[]> {
        let filtered = this.donationButtons;

        if (filters?.userId) {
            filtered = filtered.filter(d => d.userId === filters.userId);
        }

        if (filters?.faithMode !== undefined) {
            filtered = filtered.filter(d => d.faithMode === filters.faithMode);
        }

        if (filters?.isActive !== undefined) {
            filtered = filtered.filter(d => d.isActive === filters.isActive);
        }

        if (filters?.isPublic !== undefined) {
            filtered = filtered.filter(d => d.isPublic === filters.isPublic);
        }

        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Get revenue analytics
    async getRevenueAnalytics(userId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<RevenueAnalytics> {
        const userTransactions = this.paymentTransactions.filter(t => t.userId === userId && t.status === 'completed');

        const totalRevenue = userTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalTransactions = userTransactions.length;
        const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        // Calculate revenue sources
        const sourceMap = new Map<string, { amount: number; count: number }>();
        userTransactions.forEach(t => {
            const source = t.type;
            const existing = sourceMap.get(source) || { amount: 0, count: 0 };
            existing.amount += t.amount;
            existing.count++;
            sourceMap.set(source, existing);
        });

        const topRevenueSources: RevenueSource[] = Array.from(sourceMap.entries())
            .map(([source, data]) => ({
                source,
                amount: data.amount,
                percentage: (data.amount / totalRevenue) * 100,
                transactionCount: data.count,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const faithModeRevenue = userTransactions.filter(t => t.faithMode).reduce((sum, t) => sum + t.amount, 0);
        const faithModePercentage = totalRevenue > 0 ? (faithModeRevenue / totalRevenue) * 100 : 0;

        return {
            userId,
            period,
            totalRevenue,
            totalTransactions,
            averageTransactionValue,
            topRevenueSources,
            growthRate: 0, // Would calculate based on historical data
            faithModeRevenue,
            faithModePercentage,
        };
    }

    // Get payment transactions
    async getPaymentTransactions(userId: string): Promise<PaymentTransaction[]> {
        return this.paymentTransactions
            .filter(t => t.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Update creator earnings
    async updateCreatorEarnings(creatorId: string, amount: number): Promise<void> {
        const creator = this.creatorDashboards.find(c => c.id === creatorId);
        if (creator) {
            creator.totalEarnings += amount;
            creator.monthlyEarnings += amount;
        }
    }

    // Mock data for testing
    getMockCreatorDashboards(): CreatorDashboard[] {
        return [
            {
                id: 'creator_1',
                userId: 'user_1',
                userName: 'Pastor Sarah Johnson',
                creatorType: 'mentor',
                bio: 'Experienced pastor with 15+ years in ministry leadership and spiritual counseling',
                expertise: ['spiritual-counseling', 'prayer', 'bible-study', 'leadership'],
                experience: 15,
                rating: 4.8,
                totalStudents: 45,
                totalEarnings: 2500,
                monthlyEarnings: 300,
                isActive: true,
                isVerified: true,
                faithMode: true,
                services: [
                    {
                        id: 'service_1',
                        creatorId: 'creator_1',
                        title: 'Spiritual Counseling Session',
                        description: 'One-on-one spiritual counseling and prayer ministry',
                        type: 'one-on-one',
                        price: 75,
                        currency: 'USD',
                        duration: 60,
                        isActive: true,
                        category: 'counseling',
                        tags: ['spiritual-counseling', 'prayer', 'ministry'],
                        faithMode: true,
                    },
                ],
                availability: [],
                testimonials: [],
                certifications: ['M.Div', 'Pastoral Counseling'],
                languages: ['English'],
            },
        ];
    }

    getMockPremiumGroups(): PremiumGroup[] {
        return [
            {
                id: 'premium_1',
                groupId: 'group_1',
                groupName: 'Elite Prayer Warriors',
                groupDescription: 'Exclusive group for advanced prayer and spiritual warfare',
                tier: 'elite',
                price: 29.99,
                currency: 'USD',
                billingCycle: 'monthly',
                features: [
                    {
                        id: 'feature_1',
                        name: 'Exclusive Content',
                        description: 'Access to premium spiritual content',
                        type: 'content',
                        isIncluded: true,
                        faithMode: true,
                    },
                    {
                        id: 'feature_2',
                        name: '1-on-1 Mentoring',
                        description: 'Monthly one-on-one mentoring sessions',
                        type: 'support',
                        isIncluded: true,
                        faithMode: true,
                    },
                ],
                maxMembers: 50,
                currentMembers: 12,
                isActive: true,
                faithMode: true,
                createdAt: new Date(),
                trialDays: 7,
            },
        ];
    }

    getMockDonationButtons(): DonationButton[] {
        return [
            {
                id: 'donation_1',
                userId: 'user_1',
                userName: 'Pastor Sarah',
                cause: 'Mission Trip to Africa',
                description: 'Supporting our mission trip to provide spiritual and physical aid',
                goalAmount: 5000,
                currentAmount: 1250,
                currency: 'USD',
                isActive: true,
                isPublic: true,
                faithMode: true,
                donations: [],
                createdAt: new Date(),
            },
        ];
    }
}

export const monetizationService = new MonetizationService(); 