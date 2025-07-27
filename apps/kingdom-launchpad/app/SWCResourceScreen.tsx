import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    Share,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface IncomeStream {
    id: number;
    title: string;
    description: string;
    icon: string;
    earnings?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Affiliate' | 'Digital' | 'Content' | 'Services' | 'Other';
}

const SWCResourceScreen: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedStream, setExpandedStream] = useState<number | null>(null);

    const incomeStreams: IncomeStream[] = [
        {
            id: 1,
            title: 'Affiliate Sales (Main Income Source)',
            description: 'Sell the SWC 2.0 course using your unique affiliate link. You get 90% of the course price ($596) minus a 5% processing fee, leaving you with $506.60 per sale.',
            icon: 'link',
            earnings: '$506.60 per sale',
            difficulty: 'Easy',
            category: 'Affiliate'
        },
        {
            id: 2,
            title: 'Sell SWC at Full Price Using Your Own Checkout',
            description: 'Sell directly using your own payment processor (Stripe, Klarna, Affirm, Afterpay). You must pay a 15% fee per sale back to SWC for your customer to access the course.',
            icon: 'card',
            earnings: 'Full sale amount upfront',
            difficulty: 'Medium',
            category: 'Affiliate'
        },
        {
            id: 3,
            title: 'Selling Digital Products',
            description: 'Create and sell ebooks, templates, guides, or planners related to marketing, mindset, UGC, etc. Use your store (Stan or Beacons) to host your products.',
            icon: 'document-text',
            earnings: 'Varies by product',
            difficulty: 'Medium',
            category: 'Digital'
        },
        {
            id: 4,
            title: 'Collecting Emails via Freebies',
            description: 'Give a freebie (guide, checklist, quiz, template) in exchange for someone\'s email. Grow your email list so you can follow up and make more sales.',
            icon: 'mail',
            earnings: 'Email list growth',
            difficulty: 'Easy',
            category: 'Digital'
        },
        {
            id: 5,
            title: 'UGC (User-Generated Content)',
            description: 'Brands pay you to create content (videos, reviews) without needing a following. Inside SWC: You\'ll learn how to pitch brands and create UGC offers.',
            icon: 'videocam',
            earnings: '$50-$500 per post',
            difficulty: 'Medium',
            category: 'Content'
        },
        {
            id: 6,
            title: 'TikTok Shop Selling',
            description: 'SWC teaches how to set up your TikTok shop and sell products that go viral. You earn commission from products you list or create your own listings.',
            icon: 'bag',
            earnings: 'Commission based',
            difficulty: 'Medium',
            category: 'Content'
        },
        {
            id: 7,
            title: 'Amazon Reviews (Earn Gift Cards or Cash)',
            description: 'Companies send you products to review and compensate you. Learn inside SWC: How to apply for programs, get free products, and use reviews to grow.',
            icon: 'star',
            earnings: 'Free products + compensation',
            difficulty: 'Easy',
            category: 'Services'
        },
        {
            id: 8,
            title: 'Website Flipping',
            description: 'Buy or build a basic website, grow its traffic, and resell it for profit. Skill you\'ll gain: Basic design, niche research, and monetization strategies.',
            icon: 'globe',
            earnings: '$500-$5000 per site',
            difficulty: 'Hard',
            category: 'Services'
        },
        {
            id: 9,
            title: 'Monetize a Podcast',
            description: 'Build an audience and monetize through sponsorships, affiliate links, and selling your own products. SWC Tip: Repurpose live videos into podcast content.',
            icon: 'mic',
            earnings: '$100-$1000 per episode',
            difficulty: 'Medium',
            category: 'Content'
        },
        {
            id: 10,
            title: 'Faceless Theme Pages (Instagram or TikTok)',
            description: 'Create a niche page (ex: motivation, business tips, moms, fashion hacks). Monetize with affiliate links, SWC course, and paid shoutouts.',
            icon: 'phone-portrait',
            earnings: '$100-$1000 per month',
            difficulty: 'Medium',
            category: 'Content'
        },
        {
            id: 11,
            title: 'Print on Demand (POD)',
            description: 'Sell custom T-shirts, mugs, or journals through print-on-demand platforms (like Printify). No inventory needed. Use SWC to promote via short-form video.',
            icon: 'shirt',
            earnings: '$5-$25 per item',
            difficulty: 'Easy',
            category: 'Digital'
        },
        {
            id: 12,
            title: 'Airbnb (Hosting or Arbitrage)',
            description: 'Inside SWC: Learn how to rent out properties short-term OR manage others\' properties. Monetize through Airbnb listings and booking direct from your own site.',
            icon: 'home',
            earnings: '$100-$500 per night',
            difficulty: 'Hard',
            category: 'Services'
        },
        {
            id: 13,
            title: 'Credit Mastery',
            description: 'Learn to fix credit and monetize your knowledge by helping others or packaging it into a guide. You can also partner with credit services as an affiliate.',
            icon: 'card-outline',
            earnings: '$100-$500 per consultation',
            difficulty: 'Medium',
            category: 'Services'
        },
        {
            id: 14,
            title: 'Write for Money (Freelance/Copywriting)',
            description: 'Offer writing services like sales copy, email writing, blog content, etc. Sell packages on your Stan or Beacons store.',
            icon: 'create',
            earnings: '$50-$500 per project',
            difficulty: 'Medium',
            category: 'Services'
        },
        {
            id: 15,
            title: 'Network Marketing',
            description: 'Leverage your audience to sell affiliate offers, bonus bundles, or mentorships. Use email, DMs, or TikTok to grow your network.',
            icon: 'people',
            earnings: 'Commission based',
            difficulty: 'Medium',
            category: 'Other'
        }
    ];

    const categories = ['All', 'Affiliate', 'Digital', 'Content', 'Services', 'Other'];

    const affiliateLinks = {
        stanStore: 'https://www.stan.store/?ref=Ladystephcreates',
        beacons: 'https://desitotrh.com/shop/27e5eb37-0898-4f6c-b575-7e59d8e44439?t=1753514852034', // direct product link
        beaconsSignup: 'https://beacons.ai/signup?c=desitotrh',
        affiliateForm: 'https://form.jotform.com/250154173460045'
    };

    const openLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'Could not open link');
        }
    };

    const shareLink = async (url: string, title: string) => {
        try {
            await Share.share({
                message: `Check out ${title}: ${url}`,
                url: url
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share link');
        }
    };

    const filteredStreams = selectedCategory === 'All'
        ? incomeStreams
        : incomeStreams.filter(stream => stream.category === selectedCategory);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return '#4CAF50';
            case 'Medium': return '#FF9800';
            case 'Hard': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Affiliate': return '#2196F3';
            case 'Digital': return '#9C27B0';
            case 'Content': return '#FF5722';
            case 'Services': return '#607D8B';
            case 'Other': return '#795548';
            default: return '#9E9E9E';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🌟 SWC 2.0 Resource Hub</Text>
                <Text style={styles.headerSubtitle}>24 Streams of Income - Your Complete Guide</Text>
            </LinearGradient>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>24</Text>
                    <Text style={styles.statLabel}>Income Streams</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>$506.60</Text>
                    <Text style={styles.statLabel}>Per Affiliate Sale</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>90%</Text>
                    <Text style={styles.statLabel}>Commission Rate</Text>
                </View>
            </View>

            {/* Affiliate Links Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔑 Get Your Affiliate Links</Text>
                <Text style={styles.sectionDescription}>
                    Start earning $506.60 per sale with these affiliate platforms
                </Text>

                <View style={styles.linkCards}>
                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => openLink(affiliateLinks.stanStore)}
                    >
                        <Ionicons name="link" size={24} color="#2196F3" />
                        <Text style={styles.linkTitle}>Stan Store</Text>
                        <Text style={styles.linkDescription}>7-day payout</Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => shareLink(affiliateLinks.stanStore, 'Stan Store Affiliate')}
                        >
                            <Ionicons name="share-outline" size={16} color="#2196F3" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => openLink(affiliateLinks.beacons)}
                    >
                        <Ionicons name="globe" size={24} color="#9C27B0" />
                        <Text style={styles.linkTitle}>Beacons (Direct Course Link)</Text>
                        <Text style={styles.linkDescription}>3-7 day payout</Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => shareLink(affiliateLinks.beacons, 'Beacons Direct Course Link')}
                        >
                            <Ionicons name="share-outline" size={16} color="#9C27B0" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => openLink(affiliateLinks.beaconsSignup)}
                    >
                        <Ionicons name="gift" size={24} color="#4CAF50" />
                        <Text style={styles.linkTitle}>Beacons Signup</Text>
                        <Text style={styles.linkDescription}>$20 off bonus</Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => shareLink(affiliateLinks.beaconsSignup, 'Beacons Signup with $20 Off')}
                        >
                            <Ionicons name="share-outline" size={16} color="#4CAF50" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => openLink(affiliateLinks.affiliateForm)}
                    >
                        <Ionicons name="document-text" size={24} color="#FF9800" />
                        <Text style={styles.linkTitle}>Request Link</Text>
                        <Text style={styles.linkDescription}>Get custom affiliate link</Text>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => shareLink(affiliateLinks.affiliateForm, 'Request SWC Affiliate Link')}
                        >
                            <Ionicons name="share-outline" size={16} color="#FF9800" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category Filter */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Income Stream Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                selectedCategory === category && styles.categoryButtonTextActive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Income Streams */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💸 24 Streams of Income</Text>
                <Text style={styles.sectionDescription}>
                    Pick 1-2 to start and build confidence first. Clarity comes from messy action!
                </Text>

                {filteredStreams.map((stream) => (
                    <TouchableOpacity
                        key={stream.id}
                        style={styles.streamCard}
                        onPress={() => setExpandedStream(expandedStream === stream.id ? null : stream.id)}
                    >
                        <View style={styles.streamHeader}>
                            <View style={styles.streamIconContainer}>
                                <Ionicons name={stream.icon as any} size={24} color="#fff" />
                            </View>
                            <View style={styles.streamInfo}>
                                <Text style={styles.streamTitle}>{stream.title}</Text>
                                <View style={styles.streamMeta}>
                                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(stream.difficulty) }]}>
                                        <Text style={styles.difficultyText}>{stream.difficulty}</Text>
                                    </View>
                                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(stream.category) }]}>
                                        <Text style={styles.categoryText}>{stream.category}</Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons
                                name={expandedStream === stream.id ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#666"
                            />
                        </View>

                        {expandedStream === stream.id && (
                            <View style={styles.streamDetails}>
                                <Text style={styles.streamDescription}>{stream.description}</Text>
                                {stream.earnings && (
                                    <View style={styles.earningsContainer}>
                                        <Ionicons name="cash" size={16} color="#4CAF50" />
                                        <Text style={styles.earningsText}>{stream.earnings}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* How to Buy Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💥 How to Buy SWC 2.0</Text>
                <Text style={styles.sectionDescription}>
                    Step-by-step guide with $20 off Beacons bonus
                </Text>

                <View style={styles.stepCards}>
                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Sign up for Beacons and Get $20 Off</Text>
                            <Text style={styles.stepDescription}>
                                You'll need a Beacons account (which you'll want anyway to start making money too!). Plus, I've got a $20 off referral bonus for you!
                            </Text>
                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={() => openLink(affiliateLinks.beaconsSignup)}
                            >
                                <Text style={styles.stepButtonText}>Sign up for Beacons ($20 off)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Go to the Course Page to Purchase SWC 2.0</Text>
                            <Text style={styles.stepDescription}>
                                Once you're signed up for Beacons, it's time to grab the course and get started! This is where you buy the full SWC 2.0 program.
                            </Text>
                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={() => openLink(affiliateLinks.beacons)}
                            >
                                <Text style={styles.stepButtonText}>Buy the SWC 2.0 Course (Beacons Direct Link)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Choose Your Payment Option</Text>
                            <Text style={styles.stepDescription}>
                                You'll be shown different payment options: Pay in full, Pay in 4 (with PayPal or virtual card), or use debit/credit card. You can use PayPal Pay in 4, or any virtual cards like Klarna, Zip, Affirm, or Sezzle.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Complete Checkout</Text>
                            <Text style={styles.stepDescription}>
                                Double-check your email address is correct, the name on the card matches, and you're using the right payment method. Then click "Pay" or "Confirm" — and you're in!
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>5</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Check Your Email for Access</Text>
                            <Text style={styles.stepDescription}>
                                After purchase, you'll receive a confirmation email, a login email with your access to SWC 2.0 dashboard, and instructions to join the community + get started immediately.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.helpSection}>
                    <Text style={styles.helpTitle}>💡 NEED HELP?</Text>
                    <Text style={styles.helpDescription}>
                        If you have ANY issues during checkout or want help choosing the best payment plan, just email me at swc@kingdomcollective.pro and I will help you!
                    </Text>
                </View>
            </View>

            {/* What to Do After Buying */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎉 YOU DID IT!! What to Do After Buying SWC 2.0</Text>
                <Text style={styles.sectionDescription}>
                    Step-by-step guide so you don't feel confused or stuck. You are not alone in this!
                </Text>

                <View style={styles.stepCards}>
                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Check Your Email for Access</Text>
                            <Text style={styles.stepDescription}>
                                Right after your purchase, you should receive a confirmation email (receipt of your payment) and a second email with your course login link and password. If you used Beacons, check your Beacons dashboard for any extra messages too.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Log into the SWC 2.0 Course Dashboard</Text>
                            <Text style={styles.stepDescription}>
                                Click the login link from the email. Enter your email and password (from the confirmation email). You'll now be inside the full SWC 2.0 course library. Bookmark the login page so it's easy to return to.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Follow the "Start Here" Module First</Text>
                            <Text style={styles.stepDescription}>
                                Inside the course, go to "Start Here" module, watch the welcome video, and complete your orientation steps so you don't feel lost. You'll learn where everything is, what to focus on first, and how to set up your affiliate links.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Join the Private Community</Text>
                            <Text style={styles.stepDescription}>
                                Inside the course, there will be a module or button that says "Join the Private Community". Tap that and join the Facebook/Telegram/Community group. This is where you'll ask questions, celebrate wins, get updates, and get support from others just like you.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>5</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Set Up Your Affiliate Link (If You're Selling SWC)</Text>
                            <Text style={styles.stepDescription}>
                                If your goal is to make money reselling the course, you need your personal referral link. Go to the form to request it. You'll get a custom affiliate link (Beacons or Stan Store) to use when promoting the course. Every time someone buys through YOUR link, you earn $506.60 profit per sale.
                            </Text>
                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={() => openLink(affiliateLinks.affiliateForm)}
                            >
                                <Text style={styles.stepButtonText}>Request Affiliate Link</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>6</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Set Up Your Digital Store (Beacons or Stan Store)</Text>
                            <Text style={styles.stepDescription}>
                                If you're ready to sell, you'll need a store to place your links, freebies, and products. Choose Beacons (beginner-friendly, includes email capture) or Stan Store (has more integrations + pro version with emails).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>7</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Watch the Monetization + TikTok Training ASAP</Text>
                            <Text style={styles.stepDescription}>
                                You'll find UGC training, Amazon review method, TikTok monetization tips, and digital product creation. Pick ONE path to start — no need to try everything at once!
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>8</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Set a 5-Day Action Plan</Text>
                            <Text style={styles.stepDescription}>
                                Day 1: Finish "Start Here" module + join community{'\n'}
                                Day 2: Set up your store and add your affiliate link{'\n'}
                                Day 3: Create or download a freebie to grow your email list{'\n'}
                                Day 4: Post your first TikTok or IG Reel{'\n'}
                                Day 5: Follow up with leads, celebrate your progress
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.encouragementSection}>
                    <Text style={styles.encouragementTitle}>💬 BONUS: Save This Message or Screenshot It!</Text>
                    <Text style={styles.encouragementText}>
                        When you feel overwhelmed, remember: "Clarity comes from action — not overthinking. Just take the next step, even if it's messy."
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    linkCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    linkCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        position: 'relative',
    },
    linkTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    linkDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    shareButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
    },
    categoryScroll: {
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    categoryButtonActive: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#666',
    },
    categoryButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    streamCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    streamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streamIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    streamInfo: {
        flex: 1,
    },
    streamTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    streamMeta: {
        flexDirection: 'row',
        gap: 8,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    difficultyText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    categoryText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    streamDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    streamDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    earningsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    earningsText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    stepCards: {
        gap: 16,
    },
    stepCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    stepButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    stepButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    helpSection: {
        backgroundColor: '#fff3cd',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ffeaa7',
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    helpDescription: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
    },
    encouragementSection: {
        backgroundColor: '#d4edda',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#c3e6cb',
    },
    encouragementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#155724',
        marginBottom: 8,
    },
    encouragementText: {
        fontSize: 14,
        color: '#155724',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});

export default SWCResourceScreen; 