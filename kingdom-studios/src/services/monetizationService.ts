import { analyticsService } from './analyticsService';
import { authService } from './authService';

export interface BrandSponsorship {
    id: string;
    brandName: string;
    brandLogo: string;
    description: string;
    requirements: string[];
    compensation: {
        type: 'flat_rate' | 'commission' | 'product' | 'hybrid';
        amount: number;
        currency: string;
    };
    category: string[];
    targetAudience: string[];
    status: 'open' | 'in_progress' | 'completed' | 'expired';
    deadline: Date;
    applications: SponsorshipApplication[];
}

export interface SponsorshipApplication {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userFollowers: number;
    userEngagement: number;
    proposal: string;
    portfolio: string[];
    status: 'pending' | 'accepted' | 'rejected';
    submittedAt: Date;
}

export interface MerchandiseLink {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    currency: string;
    platform: 'etsy' | 'tiktok_shop' | 'beacons' | 'custom';
    productUrl: string;
    affiliateCode?: string;
    commission: number;
    category: string;
    tags: string[];
    salesCount: number;
    revenue: number;
}

export interface DonationTool {
    id: string;
    title: string;
    description: string;
    cause: string;
    goal: number;
    raised: number;
    currency: string;
    endDate: Date;
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'yearly';
    donors: Donor[];
    transparency: {
        expenses: number;
        adminFees: number;
        impactReports: string[];
    };
}

export interface Donor {
    userId: string;
    userName: string;
    amount: number;
    isAnonymous: boolean;
    message?: string;
    donatedAt: Date;
}

export interface PremiumTemplate {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    category: 'transition' | 'effect' | 'overlay' | 'audio' | 'preset';
    price: number;
    currency: string;
    previewUrl: string;
    downloadUrl: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    salesCount: number;
    revenue: number;
    licenseType: 'single_use' | 'unlimited' | 'commercial';
    requirements: string[];
}

export interface CreatorMarketplace {
    id: string;
    name: string;
    description: string;
    category: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    creatorFollowers: number;
    price: number;
    currency: string;
    status: 'active' | 'sold' | 'expired';
    createdAt: Date;
    expiresAt: Date;
    views: number;
    inquiries: number;
}

class MonetizationService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    }

    /**
     * Get brand sponsorship opportunities
     */
    async getBrandSponsorships(
        category?: string,
        status?: BrandSponsorship['status']
    ): Promise<BrandSponsorship[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const response = await fetch(`${this.apiBaseUrl}/monetization/sponsorships?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get brand sponsorships');
            }

            const sponsorships = await response.json();

            analyticsService.trackEvent('brand_sponsorships_viewed', {
                userId: user.uid,
                category,
                status,
                sponsorshipCount: sponsorships.length,
            });

            return sponsorships;
        } catch (error) {
            console.error('Brand sponsorships failed:', error);
            return this.generateMockBrandSponsorships();
        }
    }

    /**
     * Generate mock brand sponsorships
     */
    private generateMockBrandSponsorships(): BrandSponsorship[] {
        return [
            {
                id: 'sponsorship_1',
                brandName: 'Faithful Books',
                brandLogo: 'https://example.com/faithful-books-logo.png',
                description: 'Promote our new Christian book collection in your content',
                requirements: [
                    'Include book mention in video',
                    'Show book cover for 3+ seconds',
                    'Use provided hashtags',
                    'Post on Instagram and TikTok',
                ],
                compensation: {
                    type: 'flat_rate',
                    amount: 500,
                    currency: 'USD',
                },
                category: ['books', 'faith', 'education'],
                targetAudience: ['christians', 'readers', 'faith-based'],
                status: 'open',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                applications: [],
            },
            {
                id: 'sponsorship_2',
                brandName: 'Kingdom Wear',
                brandLogo: 'https://example.com/kingdom-wear-logo.png',
                description: 'Feature our faith-inspired clothing line',
                requirements: [
                    'Wear clothing in video',
                    'Mention brand 2+ times',
                    'Include discount code',
                    'Cross-platform posting',
                ],
                compensation: {
                    type: 'commission',
                    amount: 15,
                    currency: 'USD',
                },
                category: ['fashion', 'faith', 'lifestyle'],
                targetAudience: ['christians', 'fashion-conscious', 'faith-based'],
                status: 'open',
                deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
                applications: [],
            },
            {
                id: 'sponsorship_3',
                brandName: 'Blessed Coffee',
                brandLogo: 'https://example.com/blessed-coffee-logo.png',
                description: 'Promote our faith-based coffee brand',
                requirements: [
                    'Show coffee product',
                    'Share personal story',
                    'Use #BlessedCoffee hashtag',
                    'Post on multiple platforms',
                ],
                compensation: {
                    type: 'hybrid',
                    amount: 300,
                    currency: 'USD',
                },
                category: ['food', 'beverage', 'faith'],
                targetAudience: ['coffee-lovers', 'christians', 'lifestyle'],
                status: 'open',
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                applications: [],
            },
        ];
    }

    /**
     * Apply for brand sponsorship
     */
    async applyForSponsorship(
        sponsorshipId: string,
        proposal: string,
        portfolio: string[]
    ): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/monetization/sponsorships/${sponsorshipId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    proposal,
                    portfolio,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to apply for sponsorship');
            }

            analyticsService.trackEvent('sponsorship_application_submitted', {
                userId: user.uid,
                sponsorshipId,
            });
        } catch (error) {
            console.error('Sponsorship application failed:', error);
            throw error;
        }
    }

    /**
     * Get merchandise links
     */
    async getMerchandiseLinks(
        platform?: MerchandiseLink['platform'],
        category?: string
    ): Promise<MerchandiseLink[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (platform) params.append('platform', platform);
            if (category) params.append('category', category);

            const response = await fetch(`${this.apiBaseUrl}/monetization/merchandise?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get merchandise links');
            }

            const merchandise = await response.json();

            analyticsService.trackEvent('merchandise_links_viewed', {
                userId: user.uid,
                platform,
                category,
                merchandiseCount: merchandise.length,
            });

            return merchandise;
        } catch (error) {
            console.error('Merchandise links failed:', error);
            return this.generateMockMerchandiseLinks();
        }
    }

    /**
     * Generate mock merchandise links
     */
    private generateMockMerchandiseLinks(): MerchandiseLink[] {
        return [
            {
                id: 'merch_1',
                title: 'Faith Over Fear T-Shirt',
                description: 'Comfortable cotton t-shirt with inspiring faith message',
                imageUrl: 'https://example.com/faith-tshirt.jpg',
                price: 24.99,
                currency: 'USD',
                platform: 'etsy',
                productUrl: 'https://etsy.com/listing/123456',
                affiliateCode: 'FAITH20',
                commission: 0.15,
                category: 'clothing',
                tags: ['faith', 'inspiration', 'christian'],
                salesCount: 150,
                revenue: 3748.50,
            },
            {
                id: 'merch_2',
                title: 'Blessed Coffee Mug',
                description: 'Ceramic mug with faith-inspired design',
                imageUrl: 'https://example.com/blessed-mug.jpg',
                price: 12.99,
                currency: 'USD',
                platform: 'tiktok_shop',
                productUrl: 'https://tiktok.com/shop/123456',
                commission: 0.10,
                category: 'home',
                tags: ['coffee', 'blessed', 'faith'],
                salesCount: 89,
                revenue: 1156.11,
            },
            {
                id: 'merch_3',
                title: 'Kingdom Studios Hoodie',
                description: 'Premium hoodie with Kingdom Studios branding',
                imageUrl: 'https://example.com/kingdom-hoodie.jpg',
                price: 39.99,
                currency: 'USD',
                platform: 'beacons',
                productUrl: 'https://beacons.ai/kingdomstudios',
                commission: 0.20,
                category: 'clothing',
                tags: ['kingdom', 'studios', 'premium'],
                salesCount: 67,
                revenue: 2679.33,
            },
        ];
    }

    /**
     * Create merchandise link
     */
    async createMerchandiseLink(merchandise: Omit<MerchandiseLink, 'id' | 'salesCount' | 'revenue'>): Promise<MerchandiseLink> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/monetization/merchandise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...merchandise,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create merchandise link');
            }

            const createdMerchandise = await response.json();

            analyticsService.trackEvent('merchandise_link_created', {
                userId: user.uid,
                title: merchandise.title,
                platform: merchandise.platform,
                price: merchandise.price,
            });

            return createdMerchandise;
        } catch (error) {
            console.error('Merchandise link creation failed:', error);
            throw error;
        }
    }

    /**
     * Get donation tools
     */
    async getDonationTools(cause?: string): Promise<DonationTool[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = cause ? `?cause=${encodeURIComponent(cause)}` : '';
            const response = await fetch(`${this.apiBaseUrl}/monetization/donations${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get donation tools');
            }

            const donations = await response.json();

            analyticsService.trackEvent('donation_tools_viewed', {
                userId: user.uid,
                cause,
                donationCount: donations.length,
            });

            return donations;
        } catch (error) {
            console.error('Donation tools failed:', error);
            return this.generateMockDonationTools();
        }
    }

    /**
     * Generate mock donation tools
     */
    private generateMockDonationTools(): DonationTool[] {
        return [
            {
                id: 'donation_1',
                title: 'Mission Trip Fundraiser',
                description: 'Supporting our youth mission trip to serve communities in need',
                cause: 'youth ministry',
                goal: 5000,
                raised: 3200,
                currency: 'USD',
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                isRecurring: false,
                donors: [
                    {
                        userId: 'user_1',
                        userName: 'Anonymous',
                        amount: 100,
                        isAnonymous: true,
                        donatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    },
                    {
                        userId: 'user_2',
                        userName: 'Faithful Supporter',
                        amount: 250,
                        isAnonymous: false,
                        message: 'Praying for your mission!',
                        donatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    },
                ],
                transparency: {
                    expenses: 0,
                    adminFees: 0.05, // 5%
                    impactReports: ['https://example.com/impact-report-1.pdf'],
                },
            },
            {
                id: 'donation_2',
                title: 'Church Building Fund',
                description: 'Help us build a new worship center for our growing congregation',
                cause: 'church building',
                goal: 100000,
                raised: 75000,
                currency: 'USD',
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                isRecurring: true,
                frequency: 'monthly',
                donors: [],
                transparency: {
                    expenses: 5000,
                    adminFees: 0.03, // 3%
                    impactReports: ['https://example.com/building-progress.pdf'],
                },
            },
        ];
    }

    /**
     * Make donation
     */
    async makeDonation(
        donationId: string,
        amount: number,
        message?: string,
        isAnonymous: boolean = false
    ): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/monetization/donations/${donationId}/donate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    amount,
                    message,
                    isAnonymous,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to make donation');
            }

            analyticsService.trackEvent('donation_made', {
                userId: user.uid,
                donationId,
                amount,
                isAnonymous,
            });
        } catch (error) {
            console.error('Donation failed:', error);
            throw error;
        }
    }

    /**
     * Get premium templates
     */
    async getPremiumTemplates(
        category?: PremiumTemplate['category'],
        creatorId?: string
    ): Promise<PremiumTemplate[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (creatorId) params.append('creatorId', creatorId);

            const response = await fetch(`${this.apiBaseUrl}/monetization/premium-templates?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get premium templates');
            }

            const templates = await response.json();

            analyticsService.trackEvent('premium_templates_viewed', {
                userId: user.uid,
                category,
                creatorId,
                templateCount: templates.length,
            });

            return templates;
        } catch (error) {
            console.error('Premium templates failed:', error);
            return this.generateMockPremiumTemplates();
        }
    }

    /**
     * Generate mock premium templates
     */
    private generateMockPremiumTemplates(): PremiumTemplate[] {
        return [
            {
                id: 'template_1',
                title: 'Faith Transition Pack',
                description: '10 beautiful faith-themed transitions for your videos',
                creatorId: 'creator_1',
                creatorName: 'Faithful Creator',
                creatorAvatar: 'https://example.com/creator1.jpg',
                category: 'transition',
                price: 19.99,
                currency: 'USD',
                previewUrl: 'https://example.com/faith-transitions-preview.mp4',
                downloadUrl: 'https://example.com/faith-transitions.zip',
                tags: ['faith', 'transitions', 'worship'],
                rating: 4.8,
                reviewCount: 45,
                salesCount: 120,
                revenue: 2398.80,
                licenseType: 'unlimited',
                requirements: ['Kingdom Clips Pro', 'Video editing software'],
            },
            {
                id: 'template_2',
                title: 'Worship Audio Pack',
                description: '15 royalty-free worship tracks for your content',
                creatorId: 'creator_2',
                creatorName: 'Worship Producer',
                creatorAvatar: 'https://example.com/creator2.jpg',
                category: 'audio',
                price: 29.99,
                currency: 'USD',
                previewUrl: 'https://example.com/worship-audio-preview.mp3',
                downloadUrl: 'https://example.com/worship-audio-pack.zip',
                tags: ['worship', 'audio', 'christian'],
                rating: 4.9,
                reviewCount: 67,
                salesCount: 89,
                revenue: 2669.11,
                licenseType: 'commercial',
                requirements: ['Audio editing software'],
            },
            {
                id: 'template_3',
                title: 'Inspiration Overlays',
                description: '20 motivational text overlays with animations',
                creatorId: 'creator_3',
                creatorName: 'Inspiration Designer',
                creatorAvatar: 'https://example.com/creator3.jpg',
                category: 'overlay',
                price: 14.99,
                currency: 'USD',
                previewUrl: 'https://example.com/inspiration-overlays-preview.mp4',
                downloadUrl: 'https://example.com/inspiration-overlays.zip',
                tags: ['inspiration', 'overlays', 'motivation'],
                rating: 4.7,
                reviewCount: 34,
                salesCount: 156,
                revenue: 2338.44,
                licenseType: 'unlimited',
                requirements: ['Video editing software'],
            },
        ];
    }

    /**
     * Purchase premium template
     */
    async purchaseTemplate(templateId: string): Promise<void> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/monetization/premium-templates/${templateId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to purchase template');
            }

            analyticsService.trackEvent('premium_template_purchased', {
                userId: user.uid,
                templateId,
            });
        } catch (error) {
            console.error('Template purchase failed:', error);
            throw error;
        }
    }

    /**
     * Get creator marketplace listings
     */
    async getCreatorMarketplace(
        category?: string,
        status?: CreatorMarketplace['status']
    ): Promise<CreatorMarketplace[]> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const response = await fetch(`${this.apiBaseUrl}/monetization/marketplace?${params}`, {
                headers: {
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get creator marketplace');
            }

            const marketplace = await response.json();

            analyticsService.trackEvent('creator_marketplace_viewed', {
                userId: user.uid,
                category,
                status,
                listingCount: marketplace.length,
            });

            return marketplace;
        } catch (error) {
            console.error('Creator marketplace failed:', error);
            return this.generateMockCreatorMarketplace();
        }
    }

    /**
     * Generate mock creator marketplace
     */
    private generateMockCreatorMarketplace(): CreatorMarketplace[] {
        return [
            {
                id: 'marketplace_1',
                name: 'Faith-Based Content Strategy',
                description: 'Complete strategy guide for creating engaging faith content',
                category: 'strategy',
                creatorId: 'creator_1',
                creatorName: 'Faith Content Expert',
                creatorAvatar: 'https://example.com/expert1.jpg',
                creatorFollowers: 50000,
                price: 199.99,
                currency: 'USD',
                status: 'active',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                views: 245,
                inquiries: 12,
            },
            {
                id: 'marketplace_2',
                name: 'Worship Video Production',
                description: 'Professional worship video production service',
                category: 'service',
                creatorId: 'creator_2',
                creatorName: 'Worship Producer',
                creatorAvatar: 'https://example.com/producer2.jpg',
                creatorFollowers: 75000,
                price: 500.00,
                currency: 'USD',
                status: 'active',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                views: 189,
                inquiries: 8,
            },
            {
                id: 'marketplace_3',
                name: 'Christian Brand Collaboration',
                description: 'Exclusive collaboration opportunity with Christian brand',
                category: 'collaboration',
                creatorId: 'creator_3',
                creatorName: 'Christian Influencer',
                creatorAvatar: 'https://example.com/influencer3.jpg',
                creatorFollowers: 100000,
                price: 1000.00,
                currency: 'USD',
                status: 'active',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                views: 156,
                inquiries: 5,
            },
        ];
    }

    /**
     * Create marketplace listing
     */
    async createMarketplaceListing(listing: Omit<CreatorMarketplace, 'id' | 'views' | 'inquiries'>): Promise<CreatorMarketplace> {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch(`${this.apiBaseUrl}/monetization/marketplace`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await authService.getToken()}`,
                },
                body: JSON.stringify({
                    ...listing,
                    userId: user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create marketplace listing');
            }

            const createdListing = await response.json();

            analyticsService.trackEvent('marketplace_listing_created', {
                userId: user.uid,
                name: listing.name,
                category: listing.category,
                price: listing.price,
            });

            return createdListing;
        } catch (error) {
            console.error('Marketplace listing creation failed:', error);
            throw error;
        }
    }
}

export const monetizationService = new MonetizationService(); 