/**
 * Kingdom Studios AI Marketing Assistant Screen
 * Intelligent assistant with biblical wisdom, hashtag optimization, and personalized marketing guidance
 * Features: FAQ support, learning user preferences, viral hashtag suggestions, seasonal content ideas
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { KingdomColors } from '../constants/KingdomColors';
import { 
  AppMode, 
  getModeConfig,
} from '../types/spiritual';
import {
  AIConversation,
  AIMessage,
  AIResponse,
  AISuggestion,
  HashtagSuggestion,
  ContentIdea,
  BibleVerse,
  ConversationCategory,
} from '../types/aiAssistant';

const { width, height } = Dimensions.get('window');

interface AIAssistantScreenProps {
  mode?: AppMode;
  onModeSwitch?: (mode: AppMode) => void;
}

const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  mode = 'faith',
  onModeSwitch
}) => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const modeConfig = getModeConfig(mode);

  useEffect(() => {
    initializeAssistant();
    setupQuickActions();
  }, [mode]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeAssistant = () => {
    // Initialize with welcome message
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      role: 'assistant',
      content: mode === 'faith' 
        ? `Hello, beloved! I'm your Kingdom Studios AI assistant. I'm here to help you grow your digital ministry with biblical wisdom and strategic marketing insights. How can I bless your efforts today? 🙏`
        : `Hi there! I'm your Kingdom Studios AI assistant, ready to supercharge your digital marketing success! I'll help you create viral content, optimize hashtags, and grow your influence. What can we achieve together today? 🚀`,
      timestamp: new Date().toISOString(),
      metadata: {
        mood: mode === 'faith' ? 'inspirational' : 'encouraging',
        confidence: 1.0,
      }
    };
    setMessages([welcomeMessage]);
  };

  const setupQuickActions = () => {
    const actions = mode === 'faith' 
      ? [
          "Help me create faith-based content",
          "Suggest hashtags for my ministry post",
          "Give me a Bible verse for encouragement",
          "Help me plan seasonal Christian content",
          "Optimize my spiritual product marketing",
          "Repurpose my old content into new formats",
          "Suggest best posting times for my audience",
          "Create product concepts for my ministry"
        ]
      : [
          "Generate viral hashtags for my niche",
          "Create content ideas for this season",
          "Help me brainstorm a new product",
          "Optimize my posting strategy",
          "Analyze my content performance",
          "Repurpose this content for multiple platforms",
          "When should I post for maximum engagement?",
          "Turn my long content into bite-sized posts"
        ];
    setQuickActions(actions);
  };

  const sendMessage = async (text: string, isQuickAction = false) => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(text);
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: aiResponse.confidence,
          mood: mode === 'faith' ? 'inspirational' : 'encouraging',
          sourceBibleVerse: aiResponse.bibleVerse?.reference,
        },
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (userInput: string): Promise<AIResponse> => {
    // Simulate AI processing - in real app, this would call your AI service
    const input = userInput.toLowerCase();
    
    if (input.includes('hashtag')) {
      return generateHashtagResponse(userInput);
    } else if (input.includes('repurpose') || input.includes('reformat') || input.includes('multiple platforms')) {
      return generateRepurposeResponse(userInput);
    } else if (input.includes('posting time') || input.includes('best time') || input.includes('when should i post')) {
      return generateSchedulingResponse(userInput);
    } else if (input.includes('product concept') || input.includes('revamp product') || input.includes('create product')) {
      return generateAdvancedProductResponse(userInput);
    } else if (input.includes('content') || input.includes('post')) {
      return generateContentResponse(userInput);
    } else if (input.includes('product') || input.includes('brainstorm')) {
      return generateProductResponse(userInput);
    } else if (input.includes('bible') || input.includes('verse') || input.includes('scripture')) {
      return generateBibleResponse(userInput);
    } else if (input.includes('strategy') || input.includes('plan')) {
      return generateStrategyResponse(userInput);
    } else {
      return generateGeneralResponse(userInput);
    }
  };

  const generateHashtagResponse = (input: string): AIResponse => {
    const hashtags: HashtagSuggestion[] = mode === 'faith' ? [
      { hashtag: '#FaithOverFear', platform: 'instagram', category: 'faith', trendingScore: 95, userAffinityScore: 0.9, expectedEngagement: 850, reasoning: 'Highly engaging faith-based hashtag with strong community' },
      { hashtag: '#BlessedBusiness', platform: 'instagram', category: 'faith', trendingScore: 88, userAffinityScore: 0.85, expectedEngagement: 720, reasoning: 'Perfect for Christian entrepreneurs' },
      { hashtag: '#KingdomEntrepreneur', platform: 'linkedin', category: 'faith', trendingScore: 82, userAffinityScore: 0.9, expectedEngagement: 650, reasoning: 'Growing trend in faith-based business community' },
      { hashtag: '#GodsGoodness', platform: 'instagram', category: 'faith', trendingScore: 90, userAffinityScore: 0.88, expectedEngagement: 780, reasoning: 'Universally uplifting and shareable' },
      { hashtag: '#PurposeDriven', platform: 'linkedin', category: 'motivational', trendingScore: 85, userAffinityScore: 0.82, expectedEngagement: 690, reasoning: 'Appeals to both faith and business audiences' },
    ] : [
      { hashtag: '#EntrepreneurLife', platform: 'instagram', category: 'trending', trendingScore: 92, userAffinityScore: 0.88, expectedEngagement: 920, reasoning: 'Consistently high-performing business hashtag' },
      { hashtag: '#SuccessMindset', platform: 'instagram', category: 'motivational', trendingScore: 89, userAffinityScore: 0.9, expectedEngagement: 850, reasoning: 'Perfect for motivational content' },
      { hashtag: '#HustleAndHeart', platform: 'tiktok', category: 'trending', trendingScore: 95, userAffinityScore: 0.85, expectedEngagement: 1200, reasoning: 'Viral on TikTok, great for inspiration content' },
      { hashtag: '#DigitalMarketing', platform: 'linkedin', category: 'niche', trendingScore: 88, userAffinityScore: 0.92, expectedEngagement: 780, reasoning: 'Essential for your industry, high professional engagement' },
      { hashtag: '#WomenInBusiness', platform: 'instagram', category: 'community', trendingScore: 87, userAffinityScore: 0.9, expectedEngagement: 800, reasoning: 'Strong community engagement and support' },
    ];

    const suggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'hashtag',
        content: 'Use a mix of trending and niche hashtags for maximum reach',
        confidence: 0.95,
        reasoning: 'Balances discoverability with targeted audience engagement'
      },
      {
        id: '2',
        type: 'engagement_tip',
        content: 'Post when your audience is most active (based on your analytics)',
        confidence: 0.9,
        reasoning: 'Timing significantly impacts hashtag performance'
      }
    ];

    const bibleVerse = mode === 'faith' ? {
      verse: "She is clothed with strength and dignity; she can laugh at the days to come.",
      reference: "Proverbs 31:25",
      application: "God has equipped you with everything you need to succeed in your calling.",
      mood: 'strength' as const
    } : undefined;

    return {
      message: mode === 'faith' 
        ? `Here are some powerful hashtags that align with your faith-based content! These are performing exceptionally well in the Christian community right now. Remember, God honors faithful stewardship of the platforms He's given us! 🙏✨`
        : `Here are some high-performing hashtags that will boost your content visibility! These are trending in your niche and have great engagement potential. Let's get your content seen by the right people! 🚀`,
      suggestions,
      bibleVerse,
      hashtags,
      confidence: 0.92,
      reasoning: 'Generated based on current trending data and user content history'
    };
  };

  const generateContentResponse = (input: string): AIResponse => {
    const contentIdeas: ContentIdea[] = mode === 'faith' ? [
      {
        title: "Faith Over Fear Friday",
        description: "Share a personal testimony about overcoming fear through faith",
        contentType: 'post',
        platform: ['instagram', 'facebook'],
        difficulty: 'easy',
        expectedEngagement: 850,
        hashtags: ['#FaithOverFear', '#TestimonyTuesday', '#GodsGoodness'],
        bibleConnection: 'Joshua 1:9 - Be strong and courageous!',
        seasonalRelevance: 'Perfect for new year motivation'
      },
      {
        title: "Behind the Business: God's Leading",
        description: "Show how God led you to start your business",
        contentType: 'story',
        platform: ['instagram', 'facebook'],
        difficulty: 'medium',
        expectedEngagement: 920,
        hashtags: ['#BlessedBusiness', '#KingdomEntrepreneur', '#GodsLeading'],
        bibleConnection: 'Proverbs 16:9 - We make plans, but God directs our steps'
      }
    ] : [
      {
        title: "Success Story Spotlight",
        description: "Share a client transformation or personal win",
        contentType: 'carousel',
        platform: ['instagram', 'linkedin'],
        difficulty: 'medium',
        expectedEngagement: 1100,
        hashtags: ['#SuccessStory', '#ClientWin', '#Transformation'],
        seasonalRelevance: 'Great for Monday motivation'
      },
      {
        title: "Behind the Scenes: My Process",
        description: "Show your work process or daily routine",
        contentType: 'reel',
        platform: ['instagram', 'tiktok'],
        difficulty: 'easy',
        expectedEngagement: 1350,
        hashtags: ['#BehindTheScenes', '#MyProcess', '#EntrepreneurLife']
      }
    ];

    return {
      message: mode === 'faith'
        ? `I've got some amazing content ideas that will bless your audience and grow your ministry! These are designed to encourage others while showcasing God's goodness in your life and business. 🌟`
        : `Here are some content ideas that are proven to boost engagement! These concepts are tailored to your audience and designed to showcase your expertise while building authentic connections. 💡`,
      suggestions: [],
      contentIdeas,
      confidence: 0.88,
      reasoning: 'Based on successful content patterns in your niche and current trends'
    };
  };

  const generateBibleResponse = (input: string): AIResponse => {
    const verses: BibleVerse[] = [
      {
        verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        reference: "Jeremiah 29:11",
        application: "God has a beautiful plan for your business and ministry. Trust His timing and direction.",
        mood: 'guidance'
      },
      {
        verse: "She considers a field and buys it; out of her earnings she plants a vineyard.",
        reference: "Proverbs 31:16",
        application: "God celebrates wise business decisions and fruitful investments of our time and talents.",
        mood: 'wisdom'
      },
      {
        verse: "In all your ways acknowledge him, and he will make your paths straight.",
        reference: "Proverbs 3:6",
        application: "Include God in your business decisions and marketing strategies. He will guide your success.",
        mood: 'guidance'
      }
    ];

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    return {
      message: `Here's a word of encouragement from Scripture! Let this truth guide your heart and your business decisions today. God is with you in every step of your journey! 💕🙏`,
      suggestions: [],
      bibleVerse: randomVerse,
      confidence: 1.0,
      reasoning: 'Biblical encouragement tailored to entrepreneurial journey'
    };
  };

  const generateProductResponse = (input: string): AIResponse => {
    const message = mode === 'faith'
      ? `I'd love to help you create products that honor God and serve others! Based on your audience and expertise, here are some ideas that could really bless people while growing your ministry impact. 🌱`
      : `Let's brainstorm some profitable products! Based on market trends and your expertise, here are some concepts that could really resonate with your audience and generate great revenue. 💰`;

    return {
      message,
      suggestions: [
        {
          id: '1',
          type: 'product_concept',
          content: mode === 'faith' ? 'Faith-Based Business Planning Guide' : 'Digital Marketing Masterclass',
          confidence: 0.9,
          reasoning: 'High demand in your target market'
        }
      ],
      confidence: 0.85,
      reasoning: 'Product suggestions based on audience needs and market gaps'
    };
  };

  const generateRepurposeResponse = (input: string): AIResponse => {
    const repurposeIdeas = mode === 'faith' ? [
      {
        title: "Long-form Blog → Short Devotionals",
        description: "Break your blog post into 7 daily devotionals for social media",
        platforms: ['Instagram', 'Facebook', 'LinkedIn'],
        format: "Square graphics with scripture + short reflection",
        estimatedReach: "3x original post engagement"
      },
      {
        title: "Sermon → Bite-sized Wisdom",
        description: "Turn key sermon points into inspirational quote cards",
        platforms: ['Instagram Stories', 'Pinterest', 'TikTok'],
        format: "Animated text overlays with worship music",
        estimatedReach: "5x wider audience reach"
      },
      {
        title: "Testimony → Multiple Formats",
        description: "Transform personal story into carousel, reel, and blog post",
        platforms: ['Instagram', 'YouTube Shorts', 'Blog'],
        format: "Visual storytelling with before/after elements",
        estimatedReach: "4x engagement across platforms"
      }
    ] : [
      {
        title: "YouTube Video → Social Snippets",
        description: "Extract 5-7 key moments into short vertical videos",
        platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
        format: "15-30 second clips with captions and hooks",
        estimatedReach: "10x more views than original"
      },
      {
        title: "Podcast → Quote Graphics",
        description: "Turn best quotes into shareable visual content",
        platforms: ['Instagram', 'LinkedIn', 'Pinterest'],
        format: "Branded quote cards with audiogram previews",
        estimatedReach: "8x more social shares"
      },
      {
        title: "Long Caption → Thread Series",
        description: "Break detailed posts into Twitter/LinkedIn thread",
        platforms: ['Twitter', 'LinkedIn', 'Threads'],
        format: "Numbered thread with key takeaways",
        estimatedReach: "6x better engagement rate"
      }
    ];

    return {
      message: mode === 'faith'
        ? `Great question! Let's multiply your Kingdom impact by repurposing your content! Here are strategic ways to transform one piece of content into multiple blessings for your audience. God loves it when we're good stewards of the content He's given us! 🌱✨`
        : `Smart thinking! Content repurposing is the secret to scaling your reach without burning out. Here are proven strategies to turn one piece of content into multiple viral hits across platforms! 🚀`,
      suggestions: [
        {
          id: '1',
          type: 'repurpose_strategy',
          content: 'Start with your best-performing content for maximum impact',
          confidence: 0.95,
          reasoning: 'Proven content has higher repurpose success rate'
        },
        {
          id: '2',
          type: 'batch_creation',
          content: 'Create 2-3 repurposed pieces at once to maintain consistency',
          confidence: 0.9,
          reasoning: 'Batching saves time and ensures cohesive messaging'
        }
      ],
      repurposeIdeas,
      confidence: 0.93,
      reasoning: 'Repurposing strategies based on platform-specific best practices'
    };
  };

  const generateSchedulingResponse = (input: string): AIResponse => {
    const schedulingInsights = {
      Instagram: {
        bestTimes: ['9-11 AM', '2-3 PM', '7-9 PM'],
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        reasoning: 'Peak engagement when your faith-based audience is most active'
      },
      Facebook: {
        bestTimes: ['9 AM', '1-3 PM', '7-9 PM'],
        bestDays: ['Wednesday', 'Thursday', 'Friday'],
        reasoning: 'Family-oriented audience active during these windows'
      },
      LinkedIn: {
        bestTimes: ['8-10 AM', '12-2 PM', '5-6 PM'],
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        reasoning: 'Professional audience checks during work breaks'
      },
      TikTok: {
        bestTimes: ['6-10 AM', '7-9 PM'],
        bestDays: ['Tuesday', 'Thursday', 'Sunday'],
        reasoning: 'Young audience active during commute and evening'
      }
    };

    const personalizedTips = mode === 'faith' ? [
      "🙏 Sunday evening posts perform well for weekly reflection content",
      "✨ Wednesday 'Wisdom Wednesday' posts get great engagement",
      "💝 Friday inspiration posts help people end their week strong",
      "🌅 Early morning posts catch people during prayer/devotion time"
    ] : [
      "🚀 Monday motivation posts capitalize on fresh week energy",
      "💡 Tuesday tips posts perform exceptionally well",
      "📈 Thursday success stories get maximum shares",
      "🎯 Friday wrap-up posts prepare audience for weekend action"
    ];

    return {
      message: mode === 'faith'
        ? `Perfect timing question! Based on your audience analytics and faith-based content patterns, here are the optimal posting times to maximize your Kingdom impact! Remember, consistency matters more than perfection. 🕐💫`
        : `Timing is everything in digital marketing! Based on your audience behavior and industry data, here are the sweet spots for maximum engagement and reach. Let's optimize your posting schedule! ⏰🎯`,
      suggestions: [
        {
          id: '1',
          type: 'scheduling_tip',
          content: 'Test these times for 2 weeks and adjust based on your specific audience',
          confidence: 0.9,
          reasoning: 'Audience behavior can vary by niche and location'
        },
        {
          id: '2',
          type: 'consistency_tip',
          content: 'Consistent posting times help train your audience when to expect content',
          confidence: 0.95,
          reasoning: 'Algorithmic boost from predictable engagement patterns'
        }
      ],
      schedulingInsights,
      personalizedTips,
      confidence: 0.91,
      reasoning: 'AI analysis of audience behavior patterns and engagement data'
    };
  };

  const generateAdvancedProductResponse = (input: string): AIResponse => {
    const productConcepts = mode === 'faith' ? [
      {
        type: 'Digital Course',
        title: 'Biblical Business Foundations',
        description: 'Help Christian entrepreneurs align their business with Kingdom principles',
        priceRange: '$197-$497',
        targetAudience: 'Christian female entrepreneurs, ages 25-45',
        uniqueValue: 'Combines business strategy with biblical wisdom',
        marketDemand: 'High - growing Christian entrepreneur market',
        developmentTime: '4-6 weeks',
        marketingAngle: 'Build a business that honors God and blesses others'
      },
      {
        type: 'Membership Community',
        title: 'Kingdom Creators Collective',
        description: 'Monthly support and training for faith-based content creators',
        priceRange: '$47-$97/month',
        targetAudience: 'Christian content creators and digital marketers',
        uniqueValue: 'Faith-integrated marketing strategies with community support',
        marketDemand: 'Very High - underserved niche',
        developmentTime: '2-3 weeks',
        marketingAngle: 'Create content that shares Jesus while building your business'
      },
      {
        type: 'Devotional Journal',
        title: 'Entrepreneur\'s Prayer Journal',
        description: 'Daily devotions and business planning for Christian business owners',
        priceRange: '$29-$67',
        targetAudience: 'Christian entrepreneurs and business owners',
        uniqueValue: 'Spiritual growth combined with business planning',
        marketDemand: 'Medium-High - growing devotional market',
        developmentTime: '3-4 weeks',
        marketingAngle: 'Start each business day with God\'s wisdom and direction'
      }
    ] : [
      {
        type: 'Digital Course',
        title: 'Viral Content Mastery',
        description: 'Complete system for creating content that goes viral consistently',
        priceRange: '$297-$697',
        targetAudience: 'Content creators, entrepreneurs, influencers',
        uniqueValue: 'Data-driven viral content formulas with templates',
        marketDemand: 'Very High - evergreen need',
        developmentTime: '4-6 weeks',
        marketingAngle: 'Turn your content into a viral sensation and grow your following'
      },
      {
        type: 'Done-With-You Program',
        title: 'Authority Brand Builder',
        description: '90-day program to establish yourself as the go-to expert in your niche',
        priceRange: '$1,997-$4,997',
        targetAudience: 'Service providers, coaches, consultants',
        uniqueValue: 'Personalized strategy with weekly coaching calls',
        marketDemand: 'High - personal branding is crucial',
        developmentTime: '2-3 weeks',
        marketingAngle: 'Become the undisputed authority in your industry'
      },
      {
        type: 'Software Tool',
        title: 'Content Repurpose Pro',
        description: 'AI-powered tool that transforms long content into multiple short pieces',
        priceRange: '$29-$99/month',
        targetAudience: 'Content creators, marketing agencies, businesses',
        uniqueValue: 'Automated content multiplication with AI optimization',
        marketDemand: 'Very High - massive time-saver',
        developmentTime: '8-12 weeks',
        marketingAngle: 'Create 10x more content in half the time'
      }
    ];

    return {
      message: mode === 'faith'
        ? `I'm excited to help you create products that honor God and transform lives! Based on market trends and your calling, here are some powerful product concepts that could really bless your audience while growing your ministry impact. Let's build something beautiful together! 🌟💝`
        : `Let's brainstorm some game-changing products! Based on current market demands and your expertise, here are some high-potential product concepts that could generate serious revenue while positioning you as the go-to expert. Ready to build your empire? 👑💰`,
      suggestions: [
        {
          id: '1',
          type: 'validation_tip',
          content: 'Survey your audience to validate demand before full development',
          confidence: 0.95,
          reasoning: 'Market validation reduces product failure risk by 70%'
        },
        {
          id: '2',
          type: 'mvp_strategy',
          content: 'Start with a simplified version to test market response',
          confidence: 0.9,
          reasoning: 'MVP approach allows faster market entry and iteration'
        },
        {
          id: '3',
          type: 'pricing_strategy',
          content: 'Price based on transformation value, not production cost',
          confidence: 0.92,
          reasoning: 'Value-based pricing maximizes revenue potential'
        }
      ],
      productConcepts,
      confidence: 0.94,
      reasoning: 'Product concepts based on market analysis, audience needs, and profit potential'
    };
  };

  const generateStrategyResponse = (input: string): AIResponse => {
    return {
      message: mode === 'faith'
        ? `Let's create a strategy that honors God and serves your audience well! I'll help you plan content that shares His love while growing your influence for the Kingdom. 👑`
        : `Time to level up your strategy! Let's create a plan that maximizes your reach, engagement, and conversions. I'm here to help you dominate your niche! 📈`,
      suggestions: [
        {
          id: '1',
          type: 'platform_strategy',
          content: 'Focus on 2-3 platforms for consistent growth rather than spreading thin',
          confidence: 0.92,
          reasoning: 'Quality over quantity approach yields better results'
        }
      ],
      confidence: 0.9,
      reasoning: 'Strategic guidance based on proven marketing principles'
    };
  };

  const generateGeneralResponse = (input: string): AIResponse => {
    return {
      message: mode === 'faith'
        ? `I'm here to help with all your marketing questions and to encourage you in your journey! Whether you need content ideas, hashtag suggestions, or just some biblical wisdom for your business, I've got you covered. What would be most helpful right now? 💕`
        : `I'm your digital marketing best friend, ready to help you succeed! From viral content ideas to conversion optimization, I've got strategies that work. What's your biggest challenge right now? Let's tackle it together! 🎯`,
      suggestions: [],
      confidence: 0.8,
      reasoning: 'General helpful response encouraging further engagement'
    };
  };

  const renderMessage = ({ item }: { item: AIMessage }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      {item.role === 'assistant' && (
        <View style={[styles.assistantAvatar, { backgroundColor: modeConfig.branding.primaryColor }]}>
          <Ionicons name="sparkles" size={16} color="white" />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.role === 'user' 
          ? { backgroundColor: modeConfig.branding.primaryColor }
          : { backgroundColor: 'white' }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.role === 'user' ? 'white' : KingdomColors.text.inverse }
        ]}>
          {item.content}
        </Text>
        
        {item.metadata?.sourceBibleVerse && (
          <View style={styles.bibleVerseContainer}>
            <Ionicons name="book" size={14} color={KingdomColors.gold.bright} />
            <Text style={styles.bibleVerseText}>{item.metadata.sourceBibleVerse}</Text>
          </View>
        )}
        
        {item.suggestions && item.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {item.suggestions.map((suggestion, index) => (
              <TouchableOpacity key={index} style={styles.suggestionChip}>
                <Ionicons 
                  name={getSuggestionIcon(suggestion.type)} 
                  size={12} 
                  color={modeConfig.branding.primaryColor} 
                />
                <Text style={[styles.suggestionText, { color: modeConfig.branding.primaryColor }]}>
                  {suggestion.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'hashtag': return 'pricetag';
      case 'content_idea': return 'bulb';
      case 'product_concept': return 'cube';
      case 'engagement_tip': return 'people';
      default: return 'information-circle';
    }
  };

  const renderQuickAction = (action: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionButton, { borderColor: modeConfig.branding.primaryColor }]}
      onPress={() => sendMessage(action, true)}
    >
      <Text style={[styles.quickActionText, { color: modeConfig.branding.primaryColor }]}>
        {action}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[modeConfig.branding.primaryColor, modeConfig.branding.secondaryColor]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {mode === 'faith' ? 'Your ministry marketing guide' : 'Your digital marketing bestie'}
              </Text>
            </View>
          </View>
          {onModeSwitch && (
            <TouchableOpacity
              style={styles.modeSwitchButton}
              onPress={() => onModeSwitch(mode === 'faith' ? 'encouragement' : 'faith')}
            >
              <Ionicons 
                name={mode === 'faith' ? 'sunny' : 'moon'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={[styles.assistantAvatar, { backgroundColor: modeConfig.branding.primaryColor }]}>
              <Ionicons name="sparkles" size={16} color="white" />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>AI is thinking...</Text>
              <View style={styles.typingDots}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </View>

      {messages.length === 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsContainer}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickActions.map(renderQuickAction)}
        </ScrollView>
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder={mode === 'faith' ? "Ask me anything about faith-based marketing..." : "Ask me anything about digital marketing..."}
            placeholderTextColor={KingdomColors.gray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? modeConfig.branding.primaryColor : KingdomColors.gray }
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.background.primary,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  modeSwitchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  bibleVerseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
  },
  bibleVerseText: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontStyle: 'italic',
    marginLeft: 5,
  },
  suggestionsContainer: {
    marginTop: 10,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 27, 105, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: KingdomColors.gray,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  typingBubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingText: {
    fontSize: 14,
    color: KingdomColors.gray,
    marginBottom: 5,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KingdomColors.gray,
  },
  quickActionsContainer: {
    maxHeight: 60,
  },
  quickActionsContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickActionButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: KingdomColors.lightGray,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: KingdomColors.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: KingdomColors.text.inverse,
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(AIAssistantScreen);
