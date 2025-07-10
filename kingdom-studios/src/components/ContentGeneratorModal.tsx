import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Product } from '../contexts/ProductContext';
import { useFaithMode } from '../contexts/FaithModeContext';

interface ContentOption {
  id: number;
  caption: string;
  hashtags: string[];
  scripture?: string;
}

interface ContentGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onSelectContent: (caption: string, hashtags: string[]) => void;
}

const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({
  visible,
  onClose,
  product,
  onSelectContent,
}) => {
  const [contentOptions, setContentOptions] = useState<ContentOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { faithMode } = useFaithMode();

  // Generate AI-powered content based on product data
  const generateContent = (): ContentOption[] => {
    if (!product) return [];

    // Faith-based messages and encouragement
    const faithMessages = [
      "🙌 Just launched:",
      "✨ New arrival:",
      "🔥 Walking by faith:",
      "💎 God's creativity through:",
      "⭐ Fresh drop:",
      "✝️ Blessed to share:",
      "🚀 Kingdom business:",
      "💡 Let your light shine with:",
    ];

    const faithEncouragements = [
      "— wear your testimony boldly",
      "— let faith guide your style", 
      "— made for kingdom builders",
      "— designed with God's love",
      "— crafted for believers",
      "— perfect for faithful hearts",
      "— built for His glory",
      "— inspired by His word",
    ];

    // Encouragement-based messages (less churchy but still positive)
    const encouragementMessages = [
      "🌟 Just launched:",
      "✨ New arrival:",
      "🔥 Fresh and inspiring:",
      "💎 Quality meets purpose:",
      "⭐ Fresh drop:",
      "💪 Excited to share:",
      "🚀 Purpose-driven business:",
      "💡 Shine bright with:",
    ];

    const encouragementPhrases = [
      "— wear your purpose boldly",
      "— let inspiration guide your style",
      "— made for changemakers",
      "— designed with care and purpose",
      "— crafted for those who inspire",
      "— perfect for purposeful hearts",
      "— built for your journey",
      "— inspired by your dreams",
    ];

    const callToActions = [
      "Order yours today! 🛍️",
      "Available now! ✨",
      "Get yours while supplies last! �",
      "Perfect gift for someone special! 🎁",
      "Spread the word! 📢",
      "Share the love! ❤️",
      "Tag a friend! 👥",
      "Limited time offer! ⏰",
    ];

    const scriptures = [
      "\"Let your light shine before others.\" - Matthew 5:16",
      "\"Faith over fear, always.\" - Joshua 1:9",
      "\"I can do all things through Christ.\" - Philippians 4:13",
      "\"Be strong and courageous.\" - Joshua 1:9",
      "\"Trust in the Lord with all your heart.\" - Proverbs 3:5",
      "\"God's love never fails.\" - 1 Corinthians 13:8",
    ];

    const inspirationalQuotes = [
      "\"Believe in yourself and your dreams.\"",
      "\"Every step forward is progress.\"",
      "\"Your potential is limitless.\"",
      "\"Stay true to your vision.\"",
      "\"Consistency breeds success.\"",
      "\"Purpose fuels passion.\"",
    ];

    // Choose content based on faith mode
    const messages = faithMode ? faithMessages : encouragementMessages;
    const encouragements = faithMode ? faithEncouragements : encouragementPhrases;
    const quotes = faithMode ? scriptures : inspirationalQuotes;

    const baseHashtags = faithMode 
      ? ['faith', 'blessed', 'kingdombusiness', 'christian', 'believer']
      : ['inspiration', 'purpose', 'motivation', 'entrepreneur', 'positive'];
    
    const productHashtags = product.tags.map(tag => tag.toLowerCase().replace(/\s+/g, ''));
    const platformHashtag = product.platform.toLowerCase();

    return [
      {
        id: 1,
        caption: `${messages[0]} ${product.title} ${encouragements[0]}. ${faithMode ? '✝️' : '✨'}\n\nOnly $${product.price.toFixed(2)} ${callToActions[0]}`,
        hashtags: [...baseHashtags, ...productHashtags.slice(0, 2), platformHashtag, 'handmade', 'giftidea'],
        scripture: faithMode ? quotes[0] : quotes[0],
      },
      {
        id: 2,
        caption: `${messages[2]} ${product.title} ${encouragements[2]}. ${faithMode ? '🙏' : '💪'}\n\n${quotes[1]}\n\n$${product.price.toFixed(2)} ${callToActions[1]}`,
        hashtags: [...baseHashtags, ...productHashtags.slice(0, 3), platformHashtag, faithMode ? 'testimony' : 'inspiration'],
        scripture: faithMode ? quotes[1] : quotes[1],
      },
      {
        id: 3,
        caption: `${messages[6]} ${product.title} ${encouragements[6]}! ${faithMode ? '👑' : '🌟'}\n\n${faithMode ? 'Building His kingdom one product at a time.' : 'Building a purpose-driven business one product at a time.'} $${product.price.toFixed(2)} ${callToActions[2]}`,
        hashtags: [...baseHashtags, ...productHashtags.slice(0, 2), platformHashtag, faithMode ? 'ministry' : 'purpose', 'purpose'],
        scripture: faithMode ? quotes[2] : quotes[2],
      },
    ];
  };

  // Generate content when modal opens
  useEffect(() => {
    if (visible && product) {
      setIsGenerating(true);
      // Simulate AI generation delay
      setTimeout(() => {
        const options = generateContent();
        setContentOptions(options);
        setIsGenerating(false);
      }, 1500);
    }
  }, [visible, product]);

  const handleSelectContent = (option: ContentOption) => {
    const hashtagString = option.hashtags.map(tag => `#${tag}`).join(' ');
    const fullCaption = option.scripture 
      ? `${option.caption}\n\n${option.scripture}\n\n${hashtagString}`
      : `${option.caption}\n\n${hashtagString}`;
    
    onSelectContent(fullCaption, option.hashtags);
    onClose();
  };

  const renderContentOption = (option: ContentOption) => (
    <View key={option.id} style={styles.contentCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Option {option.id}</Text>
        {option.scripture && (
          <View style={styles.scriptureBadge}>
            <Text style={styles.scriptureBadgeText}>
              {faithMode ? '✝️ Scripture' : '💫 Quote'}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.captionText}>{option.caption}</Text>
      
      {option.scripture && (
        <View style={styles.scriptureContainer}>
          <Text style={styles.scriptureText}>{option.scripture}</Text>
        </View>
      )}
      
      <View style={styles.hashtagContainer}>
        {option.hashtags.map((hashtag, index) => (
          <View key={index} style={styles.hashtagChip}>
            <Text style={styles.hashtagText}>#{hashtag}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.useButton}
        onPress={() => handleSelectContent(option)}
        activeOpacity={0.8}
      >
        <Text style={styles.useButtonText}>✅ Use This</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingIcon}>✨</Text>
      <Text style={styles.loadingTitle}>AI is crafting your content...</Text>
      <Text style={styles.loadingSubtitle}>
        {faithMode ? 'Praying over every word 🙏' : 'Creating something inspiring ✨'}
      </Text>
      <View style={styles.loadingDots}>
        <Text style={styles.loadingDot}>●</Text>
        <Text style={styles.loadingDot}>●</Text>
        <Text style={styles.loadingDot}>●</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Content Generator</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Faith/Encouragement Message */}
        <View style={styles.faithMessage}>
          <Text style={styles.faithText}>
            {faithMode 
              ? "In everything you do, let God's love shine through. ✨"
              : "Create content that inspires and makes a difference. ✨"
            }
          </Text>
        </View>

        {/* Product Info */}
        {product && (
          <View style={styles.productInfo}>
            <Text style={styles.productInfoText}>
              Creating content for: <Text style={styles.productName}>{product.title}</Text>
            </Text>
          </View>
        )}

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {isGenerating ? (
            renderLoadingState()
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.sectionTitle}>
                {faithMode 
                  ? 'Choose Your Faith-Inspired Content'
                  : 'Choose Your Inspiring Content'
                }
              </Text>
              {contentOptions.map(renderContentOption)}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={() => {
              setIsGenerating(true);
              setTimeout(() => {
                const options = generateContent();
                setContentOptions(options);
                setIsGenerating(false);
              }, 1000);
            }}
            activeOpacity={0.8}
            disabled={isGenerating}
          >
            <Text style={styles.regenerateButtonText}>
              {isGenerating ? '🔄 Generating...' : '🔄 Generate New Options'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  faithMessage: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  faithText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  productInfo: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  productInfoText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  productName: {
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
  },
  scriptureBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scriptureBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  captionText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 12,
  },
  scriptureContainer: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f97316',
  },
  scriptureText: {
    fontSize: 14,
    color: '#f97316',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 6,
  },
  hashtagChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hashtagText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
  useButton: {
    backgroundColor: '#f97316',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    fontSize: 20,
    color: '#f97316',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  regenerateButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d1d5db',
  },
});

export default React.memo(ContentGeneratorModal);
