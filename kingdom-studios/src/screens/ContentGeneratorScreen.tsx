import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../utils/navigationUtils';
import { useFaithMode } from '../contexts/FaithModeContext';
import { useAuth } from '../contexts/AuthContext';
import { KingdomColors, KingdomShadows } from '../constants/KingdomColors';
import KingdomLogo from '../components/KingdomLogo';

const { width } = Dimensions.get('window');

// Type definitions
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface GeneratedContent {
  post: string;
  caption: string;
  reelIdea: string;
}

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  gradient: string[];
}

interface RecentContent {
  id: string;
  title: string;
  type: 'post' | 'story' | 'reel' | 'product';
  thumbnail: string;
  created: string;
  status: 'draft' | 'published' | 'scheduled';
}

interface CreationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Faith Over Fear T-Shirt',
    price: '$29.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Faith+Tee',
  },
  {
    id: '2',
    title: 'Kingdom Crown Cap',
    price: '$24.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Crown+Cap',
  },
  {
    id: '3',
    title: 'Blessed Hoodie',
    price: '$49.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Blessed+Hoodie',
  },
  {
    id: '4',
    title: 'Scripture Phone Case',
    price: '$19.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Phone+Case',
  },
  {
    id: '5',
    title: 'Cross Necklace',
    price: '$39.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Cross+Necklace',
  },
  {
    id: '6',
    title: 'Prayer Journal',
    price: '$15.99',
    image: 'https://via.placeholder.com/200x200/333333/ffffff?text=Prayer+Journal',
  },
];

const mockResponses: { [key: string]: GeneratedContent } = {
  '1': {
    post: '🔥 God is your provider — walk in faith, not fear. This Faith Over Fear tee reminds you daily that His love conquers all! 💪✨ #FaithOverFear #KingdomStudio',
    caption: 'Stepping out in faith today! 🙏 This tee is more than fashion - it\'s a declaration. Who else is choosing faith over fear? 💫 #FaithWalk #BlessedLife',
    reelIdea: 'Show someone putting on the shirt in slow-mo with worship music, then cut to them confidently walking through their day with Bible verses overlaying the scenes.',
  },
  '2': {
    post: '👑 Wear your crown with purpose! This Kingdom Crown Cap represents the royal identity we have in Christ. You are chosen, beloved, and called to greatness! ✨ #KingdomCrown #RoyalIdentity',
    caption: 'Walking in my royal identity today! 👑 This cap reminds me I\'m a daughter/son of the King. How are you showing up as royalty today? 💎 #CrownedByGod',
    reelIdea: 'Transition reel: Start with messy hair, put on the crown cap, then show confident poses with text overlay "Remember who you are in Christ" with uplifting music.',
  },
  '3': {
    post: '🙌 Blessed and grateful! This cozy hoodie wraps you in comfort while declaring God\'s goodness over your life. Perfect for those cool worship nights! 🔥 #Blessed #WorshipWear',
    caption: 'Cozy vibes with eternal truth! 🤗 This hoodie is my go-to for morning prayers and evening gratitude. What are you blessed by today? ✨ #BlessedLife #Grateful',
    reelIdea: 'Cozy morning routine reel: Wake up, put on the hoodie, make coffee, read Bible, with peaceful acoustic music and gratitude text overlays.',
  },
  '4': {
    post: '📱 Let your phone case preach! Every notification becomes a reminder of God\'s promises. Scripture at your fingertips, faith in your pocket! 🙏 #ScriptureDaily #FaithTech',
    caption: 'My phone case is my daily devotional! 📖 Every time I check my phone, I see God\'s truth. What scripture speaks to your heart today? 💕 #WordOfGod',
    reelIdea: 'Day-in-the-life reel showing the phone case in different scenarios: texting friends encouragement, taking photos of nature, reading Bible app, with scripture verses appearing on screen.',
  },
  '5': {
    post: '✝️ Wearing His love close to my heart! This cross necklace isn\'t just jewelry - it\'s a symbol of the greatest love story ever told. Carry His presence with you always! 💕 #CrossNecklace #LoveOfChrist',
    caption: 'His love is my accessory! ✝️ This necklace reminds me daily of the cross and His sacrifice. What reminds you of God\'s love throughout your day? 🤍 #CloseToMyHeart',
    reelIdea: 'Getting ready reel: Put on the necklace as the final touch, then show close-ups of the cross catching light throughout the day with worship music and love-themed Bible verses.',
  },
  '6': {
    post: '📖 Document your journey with God! This prayer journal is where miracles meet the page. Watch how your faith grows as you write your story with Him! ✨ #PrayerJournal #FaithJourney',
    caption: 'My prayer journal is my treasure! 📝 Every page tells of God\'s faithfulness. What prayer has He answered for you lately? Share below! 🙏 #AnsweredPrayers',
    reelIdea: 'Journal flip-through reel: Show pages with handwritten prayers, highlighted answered prayers, dried flowers, with soft piano music and text showing "God\'s faithfulness through the pages".',
  },
};

const ContentGeneratorScreen = () => {
  const navigation = useAppNavigation();
  const { faithMode } = useFaithMode();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleGenerateContent = (type: 'post' | 'caption' | 'reelIdea') => {
    if (!selectedProduct) return;
    
    const content = mockResponses[selectedProduct.id];
    setGeneratedContent(content[type]);
    setContentType(type);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    setGeneratedContent('');
    setContentType('');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderGenerationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedProduct && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {!generatedContent ? (
                <View style={styles.optionsContainer}>
                  <Text style={styles.optionsTitle}>Generate Content:</Text>
                  
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleGenerateContent('post')}
                  >
                    <Text style={styles.optionText}>📝 Generate Post</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleGenerateContent('caption')}
                  >
                    <Text style={styles.optionText}>💬 Generate Caption</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleGenerateContent('reelIdea')}
                  >
                    <Text style={styles.optionText}>🎬 Generate Reel Idea</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <Text style={styles.contentTypeTitle}>
                    {contentType === 'post' && '📝 Generated Post'}
                    {contentType === 'caption' && '💬 Generated Caption'}
                    {contentType === 'reelIdea' && '🎬 Generated Reel Idea'}
                  </Text>
                  <ScrollView style={styles.contentScrollView}>
                    <Text style={styles.generatedText}>{generatedContent}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.backToOptionsButton}
                    onPress={() => setGeneratedContent('')}
                  >
                    <Text style={styles.backToOptionsText}>← Back to Options</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Content Generator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select a Product</Text>
        <Text style={styles.sectionSubtitle}>
          {faithMode 
            ? "Tap any product to generate faith-inspired content ideas"
            : "Tap any product to generate inspiring content ideas"
          }
        </Text>

        <View style={styles.productsGrid}>
          {mockProducts.map(renderProductCard)}
        </View>
      </ScrollView>

      {renderGenerationModal()}
    </SafeAreaView>
  );
};

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
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  productsGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  productCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#333333',
  },
  productInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#cccccc',
    fontWeight: 'bold',
  },
  optionsContainer: {
    padding: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#222222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  contentTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  generatedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'left',
  },
  backToOptionsButton: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  backToOptionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ContentGeneratorScreen;
