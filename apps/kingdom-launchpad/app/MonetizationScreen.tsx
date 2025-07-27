import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { Button } from '../../../packages/ui/Button';
import { Card } from '../../../packages/ui/Card';
import { Header } from '../../../packages/ui/Header';
import { useFaithMode } from '../../../packages/hooks/useFaithMode';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Types
interface AffiliateLink {
    id: string;
    name: string;
    url: string;
    product: string;
    commission: number;
    clicks: number;
    conversions: number;
    revenue: number;
    platform: string;
    status: 'active' | 'paused' | 'expired';
    createdAt: Date;
}

interface ProductLink {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    affiliateUrl: string;
    sales: number;
    revenue: number;
    platform: string;
    category: 'faith' | 'business' | 'personal' | 'course';
}

interface Sponsorship {
    id: string;
    brand: string;
    product: string;
    dealValue: number;
    duration: string;
    status: 'pending' | 'active' | 'completed' | 'declined';
    startDate: Date;
    endDate?: Date;
    requirements: string[];
    deliverables: string[];
    performance: {
        views: number;
        clicks: number;
        conversions: number;
        revenue: number;
    };
}

interface RevenueAttribution {
    postId: string;
    postTitle: string;
    platform: string;
    date: Date;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
}

interface TierFeature {
    id: string;
    name: string;
    description: string;
    tier: 'free' | 'pro' | 'enterprise';
    isUnlocked: boolean;
    price?: number;
}

// Mock data
const mockAffiliateLinks: AffiliateLink[] = [
    {
        id: '1',
        name: 'Kingdom Business Course',
        url: 'https://affiliate.link/kingdom-course',
        product: 'Online Course',
        commission: 25,
        clicks: 156,
        conversions: 12,
        revenue: 300,
        platform: 'Instagram',
        status: 'active',
        createdAt: new Date('2024-01-01')
    },
    {
        id: '2',
        name: 'Faith Journal',
        url: 'https://affiliate.link/faith-journal',
        product: 'Physical Product',
        commission: 15,
        clicks: 89,
        conversions: 8,
        revenue: 120,
        platform: 'TikTok',
        status: 'active',
        createdAt: new Date('2024-01-05')
    },
    {
        id: '3',
        name: 'Prayer App',
        url: 'https://affiliate.link/prayer-app',
        product: 'Mobile App',
        commission: 30,
        clicks: 234,
        conversions: 18,
        revenue: 540,
        platform: 'Facebook',
        status: 'active',
        createdAt: new Date('2024-01-10')
    }
];

const mockProductLinks: ProductLink[] = [
    {
        id: '1',
        name: 'Kingdom Mindset Course',
        description: 'Transform your business with faith-based principles',
        price: 97,
        imageUrl: '📚',
        affiliateUrl: 'https://yourstore.com/kingdom-mindset',
        sales: 45,
        revenue: 4365,
        platform: 'Instagram',
        category: 'course'
    },
    {
        id: '2',
        name: 'Faith & Business Planner',
        description: 'Daily planner integrating faith and business goals',
        price: 29,
        imageUrl: '📅',
        affiliateUrl: 'https://yourstore.com/faith-planner',
        sales: 123,
        revenue: 3567,
        platform: 'TikTok',
        category: 'business'
    },
    {
        id: '3',
        name: 'Prayer Warrior Journal',
        description: 'Guided journal for deepening your prayer life',
        price: 19,
        imageUrl: '📖',
        affiliateUrl: 'https://yourstore.com/prayer-journal',
        sales: 89,
        revenue: 1691,
        platform: 'Facebook',
        category: 'faith'
    }
];

const mockSponsorships: Sponsorship[] = [
    {
        id: '1',
        brand: 'Kingdom Books',
        product: 'Christian Business Books',
        dealValue: 2500,
        duration: '3 months',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-04-01'),
        requirements: ['2 posts per week', 'Include affiliate link', 'Share testimonial'],
        deliverables: ['Instagram posts', 'TikTok videos', 'Email promotion'],
        performance: {
            views: 45000,
            clicks: 890,
            conversions: 67,
            revenue: 1675
        }
    },
    {
        id: '2',
        brand: 'Faith Tech',
        product: 'Christian Apps',
        dealValue: 1500,
        duration: '1 month',
        status: 'pending',
        startDate: new Date('2024-02-01'),
        requirements: ['1 post per week', 'App review video'],
        deliverables: ['Instagram post', 'YouTube video'],
        performance: {
            views: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
        }
    }
];

const mockRevenueAttribution: RevenueAttribution[] = [
    {
        postId: '1',
        postTitle: 'Faith in Business Story',
        platform: 'Instagram',
        date: new Date('2024-01-15'),
        views: 15420,
        clicks: 234,
        conversions: 18,
        revenue: 450,
        roi: 2.4
    },
    {
        postId: '2',
        postTitle: 'Kingdom Mindset Tips',
        platform: 'TikTok',
        date: new Date('2024-01-12'),
        views: 12850,
        clicks: 189,
        conversions: 15,
        revenue: 375,
        roi: 2.8
    },
    {
        postId: '3',
        postTitle: 'Prayer in the Workplace',
        platform: 'Facebook',
        date: new Date('2024-01-10'),
        views: 9870,
        clicks: 145,
        conversions: 12,
        revenue: 300,
        roi: 2.1
    }
];

const mockTierFeatures: TierFeature[] = [
    {
        id: '1',
        name: 'Basic Analytics',
        description: 'View basic engagement metrics',
        tier: 'free',
        isUnlocked: true
    },
    {
        id: '2',
        name: 'Advanced Analytics',
        description: 'Detailed ROI tracking and revenue attribution',
        tier: 'pro',
        isUnlocked: false,
        price: 29
    },
    {
        id: '3',
        name: 'AI Content Assistant',
        description: 'AI-powered content generation and optimization',
        tier: 'pro',
        isUnlocked: false,
        price: 29
    },
    {
        id: '4',
        name: 'Unlimited Affiliate Links',
        description: 'Track unlimited affiliate links and products',
        tier: 'enterprise',
        isUnlocked: false,
        price: 99
    },
    {
        id: '5',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        tier: 'enterprise',
        isUnlocked: false,
        price: 99
    }
];

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cloudWhite};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const RevenueCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RevenueValue = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RevenueLabel = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const RevenueRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RevenueItem = styled.View`
  flex: 1;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.silverGray + '20'};
  border-radius: 8px;
  margin: 0 ${({ theme }) => theme.spacing.sm}px;
`;

const LinkCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const LinkHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const LinkName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const LinkStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const LinkStat = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
`;

const ProductCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
`;

const ProductImage = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gold + '20'};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ProductInfo = styled.View`
  flex: 1;
`;

const ProductName = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const ProductDescription = styled.Text`
  color: ${({ theme }) => theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  margin-bottom: 4px;
`;

const ProductPrice = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

const SponsorshipCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SponsorshipHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SponsorshipBrand = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const SponsorshipValue = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ status }) =>
        status === 'active' ? '#10B981' :
            status === 'pending' ? '#F59E0B' :
                status === 'completed' ? '#3B82F6' :
                    '#EF4444'
    };
  border-radius: 8px;
  padding: 4px 8px;
`;

const StatusText = styled.Text`
  color: white;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: bold;
`;

const TierCard = styled(Card) <{ isUnlocked: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ isUnlocked }) => isUnlocked ? 1 : 0.6};
`;

const TierHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TierName = styled.Text<{ isUnlocked: boolean }>`
  color: ${({ isUnlocked, theme }) => isUnlocked ? theme.colors.sapphireBlue : theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 16px;
  font-weight: bold;
`;

const TierPrice = styled.Text`
  color: ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

const TierDescription = styled.Text<{ isUnlocked: boolean }>`
  color: ${({ isUnlocked, theme }) => isUnlocked ? theme.colors.sapphireBlue : theme.colors.silverGray};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

const FaithModeBanner = styled.View`
  background-color: ${({ theme }) => theme.colors.gold + '30'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const FaithModeText = styled.Text`
  color: ${({ theme }) => theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const TabBar = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  background-color: ${({ active, theme }) => active ? theme.colors.sapphireBlue : theme.colors.silverGray + '20'};
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 8px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.cloudWhite : theme.colors.sapphireBlue};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: bold;
`;

export default function MonetizationScreen() {
    const { faithMode } = useFaithMode();
    const [activeTab, setActiveTab] = useState<'overview' | 'affiliates' | 'products' | 'sponsorships' | 'tiers'>('overview');
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(mockAffiliateLinks);
    const [productLinks, setProductLinks] = useState<ProductLink[]>(mockProductLinks);
    const [sponsorships, setSponsorships] = useState<Sponsorship[]>(mockSponsorships);
    const [revenueAttribution, setRevenueAttribution] = useState<RevenueAttribution[]>(mockRevenueAttribution);
    const [tierFeatures, setTierFeatures] = useState<TierFeature[]>(mockTierFeatures);
    const [showCreateLink, setShowCreateLink] = useState(false);
    const [showCreateProduct, setShowCreateProduct] = useState(false);

    const getTotalRevenue = () => {
        const affiliateRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0);
        const productRevenue = productLinks.reduce((sum, product) => sum + product.revenue, 0);
        const sponsorshipRevenue = sponsorships.reduce((sum, sponsorship) => sum + sponsorship.performance.revenue, 0);
        return affiliateRevenue + productRevenue + sponsorshipRevenue;
    };

    const getRevenueData = () => {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [1200, 1800, 2400, 2100, 2800, 3200]
                }
            ]
        };
    };

    const getROIData = () => {
        return {
            labels: revenueAttribution.map(item => item.postTitle.substring(0, 10) + '...'),
            datasets: [
                {
                    data: revenueAttribution.map(item => item.roi)
                }
            ]
        };
    };

    const handleCreateAffiliateLink = () => {
        Alert.alert('Create Affiliate Link', 'Affiliate link creation will be available soon!');
    };

    const handleCreateProduct = () => {
        Alert.alert('Create Product', 'Product creation will be available soon!');
    };

    const handleUpgradeTier = (feature: TierFeature) => {
        Alert.alert(
            'Upgrade Required',
            `Upgrade to ${feature.tier} tier for $${feature.price}/month to unlock "${feature.name}"`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Upgrade', onPress: () => Alert.alert('Upgrade', 'Upgrade process will be implemented soon!') }
            ]
        );
    };

    const getFaithModeMessage = () => {
        return "Your Kingdom business is prospering! Remember to steward your resources wisely and bless others with your success.";
    };

    const renderOverviewTab = () => (
        <View>
            <Header>Revenue Overview</Header>

            <RevenueCard>
                <RevenueValue>${getTotalRevenue().toLocaleString()}</RevenueValue>
                <RevenueLabel>Total Revenue (This Month)</RevenueLabel>
            </RevenueCard>

            <RevenueRow>
                <RevenueItem>
                    <RevenueValue>${affiliateLinks.reduce((sum, link) => sum + link.revenue, 0).toLocaleString()}</RevenueValue>
                    <RevenueLabel>Affiliate Revenue</RevenueLabel>
                </RevenueItem>
                <RevenueItem>
                    <RevenueValue>${productLinks.reduce((sum, product) => sum + product.revenue, 0).toLocaleString()}</RevenueValue>
                    <RevenueLabel>Product Sales</RevenueLabel>
                </RevenueItem>
                <RevenueItem>
                    <RevenueValue>${sponsorships.reduce((sum, sponsorship) => sum + sponsorship.performance.revenue, 0).toLocaleString()}</RevenueValue>
                    <RevenueLabel>Sponsorships</RevenueLabel>
                </RevenueItem>
            </RevenueRow>

            <RevenueCard>
                <Header>Revenue Growth</Header>
                <LineChart
                    data={getRevenueData()}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </RevenueCard>

            <RevenueCard>
                <Header>Content ROI Performance</Header>
                <BarChart
                    data={getROIData()}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </RevenueCard>
        </View>
    );

    const renderAffiliatesTab = () => (
        <View>
            <Header>Affiliate Links</Header>
            <Button title="Create New Link" onPress={handleCreateAffiliateLink} style={{ marginBottom: 16 }} />

            {affiliateLinks.map(link => (
                <LinkCard key={link.id}>
                    <LinkHeader>
                        <LinkName>{link.name}</LinkName>
                        <StatusBadge status={link.status}>
                            <StatusText>{link.status.toUpperCase()}</StatusText>
                        </StatusBadge>
                    </LinkHeader>
                    <LinkStats>
                        <LinkStat>{link.clicks} clicks</LinkStat>
                        <LinkStat>{link.conversions} conversions</LinkStat>
                        <LinkStat>${link.revenue} revenue</LinkStat>
                        <LinkStat>{link.platform}</LinkStat>
                    </LinkStats>
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>
                        Commission: {link.commission}% • Created: {link.createdAt.toLocaleDateString()}
                    </Text>
                </LinkCard>
            ))}
        </View>
    );

    const renderProductsTab = () => (
        <View>
            <Header>Product Links</Header>
            <Button title="Add New Product" onPress={handleCreateProduct} style={{ marginBottom: 16 }} />

            {productLinks.map(product => (
                <ProductCard key={product.id}>
                    <ProductImage>
                        <Text style={{ fontSize: 24 }}>{product.imageUrl}</Text>
                    </ProductImage>
                    <ProductInfo>
                        <ProductName>{product.name}</ProductName>
                        <ProductDescription>{product.description}</ProductDescription>
                        <ProductPrice>${product.price}</ProductPrice>
                    </ProductInfo>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>
                            {product.sales} sales
                        </Text>
                        <Text style={{ color: '#F59E0B', fontSize: 14, fontWeight: 'bold' }}>
                            ${product.revenue}
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {product.platform}
                        </Text>
                    </View>
                </ProductCard>
            ))}
        </View>
    );

    const renderSponsorshipsTab = () => (
        <View>
            <Header>Sponsorships</Header>

            {sponsorships.map(sponsorship => (
                <SponsorshipCard key={sponsorship.id}>
                    <SponsorshipHeader>
                        <SponsorshipBrand>{sponsorship.brand}</SponsorshipBrand>
                        <SponsorshipValue>${sponsorship.dealValue}</SponsorshipValue>
                    </SponsorshipHeader>

                    <Text style={{ color: '#374151', fontSize: 14, marginBottom: 8 }}>
                        {sponsorship.product} • {sponsorship.duration}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <StatusBadge status={sponsorship.status}>
                            <StatusText>{sponsorship.status.toUpperCase()}</StatusText>
                        </StatusBadge>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {sponsorship.startDate.toLocaleDateString()} - {sponsorship.endDate?.toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {sponsorship.performance.views.toLocaleString()} views
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {sponsorship.performance.conversions} conversions
                        </Text>
                        <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: 'bold' }}>
                            ${sponsorship.performance.revenue}
                        </Text>
                    </View>
                </SponsorshipCard>
            ))}
        </View>
    );

    const renderTiersTab = () => (
        <View>
            <Header>Subscription Tiers</Header>

            {tierFeatures.map(feature => (
                <TierCard key={feature.id} isUnlocked={feature.isUnlocked}>
                    <TierHeader>
                        <TierName isUnlocked={feature.isUnlocked}>{feature.name}</TierName>
                        {!feature.isUnlocked && feature.price && (
                            <TierPrice>${feature.price}/month</TierPrice>
                        )}
                    </TierHeader>
                    <TierDescription isUnlocked={feature.isUnlocked}>
                        {feature.description}
                    </TierDescription>
                    {!feature.isUnlocked && (
                        <Button
                            title="Upgrade to Unlock"
                            onPress={() => handleUpgradeTier(feature)}
                            style={{ marginTop: 8 }}
                        />
                    )}
                </TierCard>
            ))}
        </View>
    );

    return (
        <Container>
            <Header>Monetization Dashboard</Header>

            {faithMode && (
                <FaithModeBanner>
                    <Ionicons name="trending-up" size={24} color="#F59E0B" />
                    <FaithModeText>{getFaithModeMessage()}</FaithModeText>
                </FaithModeBanner>
            )}

            <TabBar>
                <TabButton
                    active={activeTab === 'overview'}
                    onPress={() => setActiveTab('overview')}
                >
                    <TabText active={activeTab === 'overview'}>Overview</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'affiliates'}
                    onPress={() => setActiveTab('affiliates')}
                >
                    <TabText active={activeTab === 'affiliates'}>Affiliates</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'products'}
                    onPress={() => setActiveTab('products')}
                >
                    <TabText active={activeTab === 'products'}>Products</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'sponsorships'}
                    onPress={() => setActiveTab('sponsorships')}
                >
                    <TabText active={activeTab === 'sponsorships'}>Sponsorships</TabText>
                </TabButton>
                <TabButton
                    active={activeTab === 'tiers'}
                    onPress={() => setActiveTab('tiers')}
                >
                    <TabText active={activeTab === 'tiers'}>Tiers</TabText>
                </TabButton>
            </TabBar>

            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'affiliates' && renderAffiliatesTab()}
            {activeTab === 'products' && renderProductsTab()}
            {activeTab === 'sponsorships' && renderSponsorshipsTab()}
            {activeTab === 'tiers' && renderTiersTab()}
        </Container>
    );
} 