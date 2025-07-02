import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useKingdomColors } from '../hooks/useKingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isPremium: boolean;
  size: string;
  tags: string[];
  faithMode?: {
    name: string;
    tags: string[];
  };
}

interface DesignCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  faithModeName?: string;
  faithModeDescription?: string;
}

const CanvaDesignToolScreen: React.FC = () => {
  const { currentMode } = useDualMode();
  const colors = useKingdomColors();
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);

  const designCategories: DesignCategory[] = [
    {
      id: 'all',
      name: 'All Designs',
      icon: '🎨',
      color: colors.accent,
      description: 'Browse all available templates',
      faithModeName: 'All Blessings',
      faithModeDescription: 'Browse all God-inspired templates',
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: '📱',
      color: '#3B82F6',
      description: 'Posts, stories, and covers',
      faithModeName: 'Ministry Posts',
      faithModeDescription: 'Share His love on social media',
    },
    {
      id: 'print',
      name: 'Print on Demand',
      icon: '🖨️',
      color: '#8B5CF6',
      description: 'T-shirts, mugs, and more',
      faithModeName: 'Kingdom Merch',
      faithModeDescription: 'Wearable faith and inspirational items',
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: '📢',
      color: '#10B981',
      description: 'Flyers, banners, and ads',
      faithModeName: 'Outreach Materials',
      faithModeDescription: 'Spread the Gospel through design',
    },
    {
      id: 'business',
      name: 'Business',
      icon: '💼',
      color: '#F59E0B',
      description: 'Cards, logos, and branding',
      faithModeName: 'Ministry Business',
      faithModeDescription: 'Professional faith-based branding',
    },
    {
      id: 'events',
      name: 'Events',
      icon: '🎉',
      color: '#EF4444',
      description: 'Invitations and programs',
      faithModeName: 'Church Events',
      faithModeDescription: 'Worship services and gatherings',
    },
  ];

  const designTemplates: DesignTemplate[] = currentMode === 'faith' ? [
    {
      id: '1',
      name: 'Scripture Quote Post',
      category: 'social',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      isPremium: false,
      size: '1080x1080',
      tags: ['scripture', 'quote', 'instagram', 'square'],
      faithMode: {
        name: 'Daily Bread Scripture',
        tags: ['daily-bread', 'word-of-god', 'inspiration', 'bible-verse'],
      },
    },
    {
      id: '2',
      name: 'Faith T-Shirt Design',
      category: 'print',
      imageUrl: 'https://picsum.photos/400/500?random=2',
      isPremium: true,
      size: '4500x5400',
      tags: ['t-shirt', 'apparel', 'faith', 'christian'],
      faithMode: {
        name: 'Kingdom Warrior Tee',
        tags: ['kingdom-warrior', 'armor-of-god', 'christian-apparel', 'faith-wear'],
      },
    },
    {
      id: '3',
      name: 'Church Event Flyer',
      category: 'events',
      imageUrl: 'https://picsum.photos/400/600?random=3',
      isPremium: false,
      size: '8.5x11',
      tags: ['flyer', 'church', 'event', 'invitation'],
      faithMode: {
        name: 'Worship Gathering Invite',
        tags: ['worship', 'gathering', 'fellowship', 'church-family'],
      },
    },
    {
      id: '4',
      name: 'Ministry Business Card',
      category: 'business',
      imageUrl: 'https://picsum.photos/400/240?random=4',
      isPremium: true,
      size: '3.5x2',
      tags: ['business-card', 'ministry', 'contact', 'professional'],
      faithMode: {
        name: 'Kingdom Business Card',
        tags: ['kingdom-business', 'ministry-card', 'faith-professional', 'witness-tool'],
      },
    },
    {
      id: '5',
      name: 'Prayer Request Card',
      category: 'marketing',
      imageUrl: 'https://picsum.photos/400/300?random=5',
      isPremium: false,
      size: '5x3',
      tags: ['prayer', 'card', 'request', 'ministry'],
      faithMode: {
        name: 'Sacred Prayer Card',
        tags: ['sacred-prayer', 'intercession', 'prayer-ministry', 'spiritual-support'],
      },
    },
    {
      id: '6',
      name: 'Worship Song Lyrics',
      category: 'social',
      imageUrl: 'https://picsum.photos/400/700?random=6',
      isPremium: false,
      size: '1080x1920',
      tags: ['lyrics', 'worship', 'song', 'story'],
      faithMode: {
        name: 'Heavenly Worship Lyrics',
        tags: ['heavenly-worship', 'praise-lyrics', 'worship-story', 'song-ministry'],
      },
    },
  ] : [
    {
      id: '1',
      name: 'Motivational Quote Post',
      category: 'social',
      imageUrl: 'https://picsum.photos/400/400?random=7',
      isPremium: false,
      size: '1080x1080',
      tags: ['motivation', 'quote', 'instagram', 'inspiration'],
    },
    {
      id: '2',
      name: 'Success T-Shirt Design',
      category: 'print',
      imageUrl: 'https://picsum.photos/400/500?random=8',
      isPremium: true,
      size: '4500x5400',
      tags: ['t-shirt', 'success', 'motivation', 'apparel'],
    },
    {
      id: '3',
      name: 'Business Event Flyer',
      category: 'events',
      imageUrl: 'https://picsum.photos/400/600?random=9',
      isPremium: false,
      size: '8.5x11',
      tags: ['flyer', 'business', 'event', 'networking'],
    },
    {
      id: '4',
      name: 'Professional Business Card',
      category: 'business',
      imageUrl: 'https://picsum.photos/400/240?random=10',
      isPremium: true,
      size: '3.5x2',
      tags: ['business-card', 'professional', 'entrepreneur', 'contact'],
    },
    {
      id: '5',
      name: 'Goal Achievement Banner',
      category: 'marketing',
      imageUrl: 'https://picsum.photos/400/300?random=11',
      isPremium: false,
      size: '1920x1080',
      tags: ['banner', 'goals', 'achievement', 'success'],
    },
    {
      id: '6',
      name: 'Empowerment Story Post',
      category: 'social',
      imageUrl: 'https://picsum.photos/400/700?random=12',
      isPremium: false,
      size: '1080x1920',
      tags: ['empowerment', 'story', 'inspiration', 'growth'],
    },
  ];

  const getCurrentPrompt = () => {
    const faithPrompts = [
      "🎨 Create designs that glorify God and inspire others",
      "✨ Let your creativity be a testament to His love",
      "💝 Design with purpose, create with faith",
      "🌟 Build visual testimonies of His goodness",
    ];
    
    const encouragementPrompts = [
      "🚀 Design your way to success and inspiration",
      "💫 Create visuals that empower and motivate",
      "✨ Transform your ideas into stunning designs",
      "🌟 Build your brand with professional designs",
    ];
    
    const prompts = currentMode === 'faith' ? faithPrompts : encouragementPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const filteredTemplates = designTemplates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const openTemplate = (template: DesignTemplate) => {
    if (template.isPremium) {
      Alert.alert(
        'Premium Template',
        'This template requires a premium subscription to customize.',
        [
          { text: 'Preview Only', onPress: () => previewTemplate(template) },
          { text: 'Upgrade Now', onPress: () => navigation.navigate('Pricing' as never) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      editTemplate(template);
    }
  };

  const previewTemplate = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const editTemplate = (template: DesignTemplate) => {
    Alert.alert(
      'Design Editor',
      'Advanced design editor coming soon! For now, this template will be added to your library.',
      [
        { text: 'Add to Library', onPress: () => addToLibrary(template) },
        { text: 'OK' },
      ]
    );
  };

  const addToLibrary = (template: DesignTemplate) => {
    Alert.alert('Success', 'Template added to your design library!');
  };

  const createBlankDesign = (category: DesignCategory) => {
    Alert.alert(
      'Create Blank Design',
      `Create a new ${category.name.toLowerCase()} design from scratch?`,
      [
        { text: 'Yes, Create', onPress: () => startBlankDesign(category) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const startBlankDesign = (category: DesignCategory) => {
    Alert.alert(
      'Design Editor Loading',
      'The advanced design editor is coming soon! It will include:\n\n• Drag & drop elements\n• Custom text and fonts\n• Photo backgrounds\n• Brand color palettes\n• Export in multiple formats'
    );
  };

  const renderCategoryCard = (category: DesignCategory) => {
    const isSelected = selectedCategory === category.id;
    const displayName = currentMode === 'faith' && category.faithModeName ? category.faithModeName : category.name;
    const displayDesc = currentMode === 'faith' && category.faithModeDescription ? category.faithModeDescription : category.description;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryCard,
          {
            backgroundColor: isSelected ? category.color : colors.surface,
            borderColor: category.color,
          },
        ]}
        onPress={() => setSelectedCategory(category.id)}
        onLongPress={() => createBlankDesign(category)}
        activeOpacity={0.8}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text
          style={[
            styles.categoryName,
            { color: isSelected ? '#fff' : colors.text },
          ]}
        >
          {displayName}
        </Text>
        <Text
          style={[
            styles.categoryDescription,
            { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary },
          ]}
        >
          {displayDesc}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTemplateCard = ({ item }: { item: DesignTemplate }) => {
    const displayData = currentMode === 'faith' && item.faithMode ? item.faithMode : item;
    
    return (
      <TouchableOpacity
        style={styles.templateCard}
        onPress={() => openTemplate(item)}
        activeOpacity={0.9}
      >
        <View style={styles.templateImageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.templateImage} />
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>👑</Text>
            </View>
          )}
          <View style={styles.templateOverlay}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => previewTemplate(item)}
            >
              <Ionicons name="eye" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.templateContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.templateName, { color: colors.text }]} numberOfLines={2}>
            {displayData.name}
          </Text>
          <Text style={[styles.templateSize, { color: colors.textSecondary }]}>
            {item.size}
          </Text>
          
          <View style={styles.templateTags}>
            {(displayData.tags || item.tags).slice(0, 2).map((tag) => (
              <View key={tag} style={[styles.templateTag, { backgroundColor: colors.background }]}>
                <Text style={[styles.templateTagText, { color: colors.accent }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentMode === 'faith' ? 'Divine Design Studio' : 'Design Studio'}
        </Text>
        <TouchableOpacity>
          <Ionicons name="folder" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getCurrentPrompt()}
        </Text>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.accent }]}
            onPress={() => startBlankDesign(designCategories[1])}
          >
            <LinearGradient
              colors={[colors.accent, colors.accent + 'CC']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.quickActionText}>Create Blank</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('VisualDiscovery' as never)}
          >
            <Ionicons name="search" size={20} color={colors.text} />
            <Text style={[styles.quickActionSecondaryText, { color: colors.text }]}>
              Browse Inspiration
            </Text>
          </TouchableOpacity>
        </View>

        {/* Design Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Design Categories
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {currentMode === 'faith' 
              ? "Choose a category to create Kingdom-inspired designs"
              : "Choose a category to start your design journey"
            }
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {designCategories.map(renderCategoryCard)}
          </ScrollView>
        </View>

        {/* Templates Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory === 'all' 
                ? (currentMode === 'faith' ? 'All Divine Templates' : 'All Templates')
                : `${designCategories.find(c => c.id === selectedCategory)?.name} Templates`
              }
            </Text>
            <Text style={[styles.templateCount, { color: colors.textSecondary }]}>
              {filteredTemplates.length} templates
            </Text>
          </View>

          <FlatList
            data={filteredTemplates}
            renderItem={renderTemplateCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.templatesGrid}
            columnWrapperStyle={styles.templatesRow}
          />
        </View>

        {/* Features Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            🎨 Coming Soon: Advanced Design Editor
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Drag & drop design elements{'\n'}
            • Custom fonts and text styling{'\n'}
            • Photo backgrounds and overlays{'\n'}
            • Brand color palette integration{'\n'}
            • Export in multiple formats (PNG, PDF, SVG){'\n'}
            • Collaborative editing features
          </Text>
        </View>
      </ScrollView>

      {/* Template Preview Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        {selectedTemplate && (
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Template Preview
              </Text>
              <TouchableOpacity onPress={() => addToLibrary(selectedTemplate)}>
                <Ionicons name="bookmark-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedTemplate.imageUrl }} style={styles.modalImage} />
              
              <View style={styles.modalDetails}>
                <Text style={[styles.modalTemplateName, { color: colors.text }]}>
                  {currentMode === 'faith' && selectedTemplate.faithMode 
                    ? selectedTemplate.faithMode.name 
                    : selectedTemplate.name}
                </Text>
                
                <Text style={[styles.modalTemplateSize, { color: colors.textSecondary }]}>
                  Size: {selectedTemplate.size}
                </Text>

                <View style={styles.modalTagsContainer}>
                  {(currentMode === 'faith' && selectedTemplate.faithMode 
                    ? selectedTemplate.faithMode.tags 
                    : selectedTemplate.tags
                  ).map((tag) => (
                    <View key={tag} style={[styles.modalTag, { backgroundColor: colors.background }]}>
                      <Text style={[styles.modalTagText, { color: colors.accent }]}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.surface }]}
                onPress={() => addToLibrary(selectedTemplate)}
              >
                <Ionicons name="bookmark" size={20} color={colors.text} />
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.editButton]}
                onPress={() => {
                  setShowTemplateModal(false);
                  openTemplate(selectedTemplate);
                }}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accent + 'CC']}
                  style={styles.editButtonGradient}
                >
                  <Ionicons name="create" size={20} color="#fff" />
                  <Text style={styles.editButtonText}>
                    {selectedTemplate.isPremium ? 'Get Premium' : 'Edit Template'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quickActionSecondaryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  templateCount: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  categoriesContainer: {
    paddingRight: 20,
    gap: 12,
  },
  categoryCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  templatesGrid: {
    paddingBottom: 20,
  },
  templatesRow: {
    justifyContent: 'space-between',
  },
  templateCard: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  templateImageContainer: {
    position: 'relative',
  },
  templateImage: {
    width: '100%',
    height: cardWidth * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    fontSize: 12,
  },
  templateOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  previewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateContent: {
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateSize: {
    fontSize: 12,
    marginBottom: 8,
  },
  templateTags: {
    flexDirection: 'row',
    gap: 4,
  },
  templateTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  templateTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalDetails: {
    padding: 20,
  },
  modalTemplateName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalTemplateSize: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    overflow: 'hidden',
  },
  editButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CanvaDesignToolScreen;
