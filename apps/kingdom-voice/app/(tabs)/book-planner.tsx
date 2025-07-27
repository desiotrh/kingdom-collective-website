import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  FlatList,
  Animated,
  PanGestureHandler,
  State
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFaithMode } from '@/contexts/FaithModeContext';

interface Chapter {
  id: string;
  title: string;
  notes: string;
  linkedEntry?: string;
  linkedDream?: string;
  order: number;
}

interface BookPlan {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  faithMode: boolean;
  date: string;
}

const kingdomSuggestions = [
  'Start with testimony.',
  'What Scripture shaped this message?',
  'Include a chapter on God\'s faithfulness.',
  'Share how prayer guided your journey.',
  'End with hope and encouragement.',
  'Include moments of divine intervention.',
  'What did God teach you through this?',
  'How can this help others?',
];

export default function BookPlannerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isFaithMode, isEncouragementMode, FaithModeOverlay, EncouragementOverlay } = useFaithMode();
  
  const [bookPlans, setBookPlans] = useState<BookPlan[]>([]);
  const [currentBook, setCurrentBook] = useState<BookPlan | null>(null);
  const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false);
  const [isAddChapterModalVisible, setIsAddChapterModalVisible] = useState(false);
  const [isBookDetailModalVisible, setIsBookDetailModalVisible] = useState(false);
  
  const [newBook, setNewBook] = useState<Partial<BookPlan>>({
    title: '',
    description: '',
    chapters: [],
    faithMode: isFaithMode,
  });

  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({
    title: '',
    notes: '',
    linkedEntry: '',
    linkedDream: '',
  });

  // Load book plans on mount
  useEffect(() => {
    loadBookPlans();
  }, []);

  const loadBookPlans = async () => {
    try {
      const plansData = await AsyncStorage.getItem('book_plans');
      if (plansData) {
        setBookPlans(JSON.parse(plansData));
      }
    } catch (error) {
      console.error('Error loading book plans:', error);
    }
  };

  const saveBookPlan = async () => {
    if (!newBook.title || !newBook.description) {
      Alert.alert('Missing Information', 'Please enter a title and description for your book.');
      return;
    }

    try {
      const bookPlan: BookPlan = {
        id: Date.now().toString(),
        title: newBook.title,
        description: newBook.description,
        chapters: newBook.chapters || [],
        faithMode: isFaithMode,
        date: new Date().toISOString(),
      };

      const updatedPlans = [bookPlan, ...bookPlans];
      await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
      setBookPlans(updatedPlans);
      
      // Reset form
      setNewBook({
        title: '',
        description: '',
        chapters: [],
        faithMode: isFaithMode,
      });
      
      setIsAddBookModalVisible(false);
      Alert.alert('Book Plan Saved', 'Your book plan has been created successfully!');
    } catch (error) {
      console.error('Error saving book plan:', error);
      Alert.alert('Error', 'Failed to save book plan. Please try again.');
    }
  };

  const addChapter = async () => {
    if (!newChapter.title) {
      Alert.alert('Missing Information', 'Please enter a chapter title.');
      return;
    }

    if (!currentBook) return;

    try {
      const chapter: Chapter = {
        id: Date.now().toString(),
        title: newChapter.title,
        notes: newChapter.notes || '',
        linkedEntry: newChapter.linkedEntry,
        linkedDream: newChapter.linkedDream,
        order: currentBook.chapters.length,
      };

      const updatedBook = {
        ...currentBook,
        chapters: [...currentBook.chapters, chapter],
      };

      const updatedPlans = bookPlans.map(plan => 
        plan.id === currentBook.id ? updatedBook : plan
      );

      await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
      setBookPlans(updatedPlans);
      setCurrentBook(updatedBook);
      
      // Reset form
      setNewChapter({
        title: '',
        notes: '',
        linkedEntry: '',
        linkedDream: '',
      });
      
      setIsAddChapterModalVisible(false);
      Alert.alert('Chapter Added', 'Chapter has been added to your book plan!');
    } catch (error) {
      console.error('Error adding chapter:', error);
      Alert.alert('Error', 'Failed to add chapter. Please try again.');
    }
  };

  const reorderChapters = async (fromIndex: number, toIndex: number) => {
    if (!currentBook) return;

    try {
      const updatedChapters = [...currentBook.chapters];
      const [movedChapter] = updatedChapters.splice(fromIndex, 1);
      updatedChapters.splice(toIndex, 0, movedChapter);

      // Update order numbers
      const reorderedChapters = updatedChapters.map((chapter, index) => ({
        ...chapter,
        order: index,
      }));

      const updatedBook = {
        ...currentBook,
        chapters: reorderedChapters,
      };

      const updatedPlans = bookPlans.map(plan => 
        plan.id === currentBook.id ? updatedBook : plan
      );

      await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
      setBookPlans(updatedPlans);
      setCurrentBook(updatedBook);
    } catch (error) {
      console.error('Error reordering chapters:', error);
      Alert.alert('Error', 'Failed to reorder chapters. Please try again.');
    }
  };

  const deleteChapter = async (chapterId: string) => {
    if (!currentBook) return;

    Alert.alert(
      'Delete Chapter',
      'Are you sure you want to delete this chapter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedChapters = currentBook.chapters
                .filter(chapter => chapter.id !== chapterId)
                .map((chapter, index) => ({
                  ...chapter,
                  order: index,
                }));

              const updatedBook = {
                ...currentBook,
                chapters: updatedChapters,
              };

              const updatedPlans = bookPlans.map(plan => 
                plan.id === currentBook.id ? updatedBook : plan
              );

              await AsyncStorage.setItem('book_plans', JSON.stringify(updatedPlans));
              setBookPlans(updatedPlans);
              setCurrentBook(updatedBook);
            } catch (error) {
              console.error('Error deleting chapter:', error);
              Alert.alert('Error', 'Failed to delete chapter. Please try again.');
            }
          },
        },
      ]
    );
  };

  const openBookDetail = (book: BookPlan) => {
    setCurrentBook(book);
    setIsBookDetailModalVisible(true);
  };

  const renderBookCard = (book: BookPlan) => (
    <TouchableOpacity
      key={book.id}
      style={[styles.bookCard, { 
        backgroundColor: colors.cream,
        borderColor: book.faithMode ? colors.softGold : colors.skyBlue
      }]}
      onPress={() => openBookDetail(book)}
    >
      <View style={styles.bookCardHeader}>
        <Text style={[styles.bookTitle, { color: colors.charcoalInk }]}>
          {book.title}
        </Text>
        <Text style={[styles.bookDate, { color: colors.charcoalInk }]}>
          {new Date(book.date).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={[styles.bookDescription, { color: colors.charcoalInk }]}>
        {book.description}
      </Text>

      <View style={styles.bookStats}>
        <Text style={[styles.bookStatsText, { color: colors.charcoalInk }]}>
          📚 {book.chapters.length} chapters
        </Text>
        {book.faithMode && (
          <View style={[styles.faithBadge, { backgroundColor: colors.softGold }]}>
            <Text style={[styles.faithBadgeText, { color: colors.cream }]}>
              ✝️ Kingdom
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderChapterItem = ({ item, index }: { item: Chapter; index: number }) => (
    <View style={[styles.chapterItem, { backgroundColor: colors.cream }]}>
      <View style={styles.chapterHeader}>
        <Text style={[styles.chapterNumber, { color: colors.charcoalInk }]}>
          Chapter {index + 1}
        </Text>
        <TouchableOpacity
          onPress={() => deleteChapter(item.id)}
          style={styles.deleteButton}
        >
          <Text style={[styles.deleteButtonText, { color: colors.charcoalInk }]}>×</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.chapterTitle, { color: colors.charcoalInk }]}>
        {item.title}
      </Text>
      
      {item.notes && (
        <Text style={[styles.chapterNotes, { color: colors.charcoalInk }]}>
          {item.notes}
        </Text>
      )}

      {(item.linkedEntry || item.linkedDream) && (
        <View style={styles.chapterLinks}>
          {item.linkedEntry && (
            <Text style={[styles.chapterLink, { color: colors.softGold }]}>
              📖 Linked to Journal Entry
            </Text>
          )}
          {item.linkedDream && (
            <Text style={[styles.chapterLink, { color: colors.skyBlue }]}>
              🌙 Linked to Dream
            </Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isFaithMode ? '✝️ Book Planner' : 'Book Planner'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.charcoalInk }]}>
            Plan and structure your book
          </Text>
        </View>

        {/* Add Book Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.softGold }]}
          onPress={() => setIsAddBookModalVisible(true)}
        >
          <Text style={[styles.addButtonText, { color: colors.cream }]}>
            📚 Create New Book Plan
          </Text>
        </TouchableOpacity>

        {/* Book Plans List */}
        <View style={styles.booksSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Book Plans
          </Text>
          
          {bookPlans.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.cream }]}>
              <Text style={[styles.emptyStateIcon, { color: colors.charcoalInk }]}>
                📚
              </Text>
              <Text style={[styles.emptyStateTitle, { color: colors.charcoalInk }]}>
                No Book Plans Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.charcoalInk }]}>
                Start planning your book to see it here
              </Text>
            </View>
          ) : (
            bookPlans.map(renderBookCard)
          )}
        </View>

        {/* Encouragement Message */}
        {isEncouragementMode && (
          <View style={[styles.encouragementCard, { backgroundColor: colors.warmBeige }]}>
            <Text style={[styles.encouragementTitle, { color: colors.charcoalInk }]}>
              💝 Your life is a story worth sharing.
            </Text>
            <Text style={[styles.encouragementText, { color: colors.charcoalInk }]}>
              Every experience, every lesson, every moment of growth is part of your unique story. 
              Don't be afraid to share it with the world.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Book Modal */}
      <Modal
        visible={isAddBookModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddBookModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create New Book Plan
            </Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="Book title..."
              value={newBook.title}
              onChangeText={(text) => setNewBook({...newBook, title: text})}
            />
            
            <TextInput
              style={[styles.modalTextArea, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="2-3 sentence description..."
              value={newBook.description}
              onChangeText={(text) => setNewBook({...newBook, description: text})}
              multiline
              textAlignVertical="top"
            />

            {isFaithMode && (
              <View style={[styles.kingdomSuggestions, { backgroundColor: colors.skyBlue }]}>
                <Text style={[styles.suggestionsTitle, { color: colors.charcoalInk }]}>
                  ✝️ Kingdom Suggestions
                </Text>
                <ScrollView style={styles.suggestionsList}>
                  {kingdomSuggestions.map((suggestion, index) => (
                    <Text key={index} style={[styles.suggestionText, { color: colors.charcoalInk }]}>
                      • {suggestion}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                onPress={() => setIsAddBookModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.softGold }]}
                onPress={saveBookPlan}
              >
                <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                  Create Book
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Chapter Modal */}
      <Modal
        visible={isAddChapterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddChapterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Chapter to "{currentBook?.title}"
            </Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="Chapter title..."
              value={newChapter.title}
              onChangeText={(text) => setNewChapter({...newChapter, title: text})}
            />
            
            <TextInput
              style={[styles.modalTextArea, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="Notes or summary (optional)..."
              value={newChapter.notes}
              onChangeText={(text) => setNewChapter({...newChapter, notes: text})}
              multiline
              textAlignVertical="top"
            />

            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="Link to journal entry (optional)..."
              value={newChapter.linkedEntry}
              onChangeText={(text) => setNewChapter({...newChapter, linkedEntry: text})}
            />

            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.cream,
                color: colors.charcoalInk,
                borderColor: colors.softGold
              }]}
              placeholder="Link to dream (optional)..."
              value={newChapter.linkedDream}
              onChangeText={(text) => setNewChapter({...newChapter, linkedDream: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                onPress={() => setIsAddChapterModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.softGold }]}
                onPress={addChapter}
              >
                <Text style={[styles.modalButtonText, { color: colors.cream }]}>
                  Add Chapter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Book Detail Modal */}
      <Modal
        visible={isBookDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsBookDetailModalVisible(false)}
      >
        {currentBook && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentBook.title}
              </Text>
              
              <Text style={[styles.bookDetailDescription, { color: colors.charcoalInk }]}>
                {currentBook.description}
              </Text>

              <View style={styles.chaptersHeader}>
                <Text style={[styles.chaptersTitle, { color: colors.text }]}>
                  Chapters ({currentBook.chapters.length})
                </Text>
                <TouchableOpacity
                  style={[styles.addChapterButton, { backgroundColor: colors.softGold }]}
                  onPress={() => setIsAddChapterModalVisible(true)}
                >
                  <Text style={[styles.addChapterButtonText, { color: colors.cream }]}>
                    + Add Chapter
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.chaptersList}>
                {currentBook.chapters.length === 0 ? (
                  <Text style={[styles.noChaptersText, { color: colors.charcoalInk }]}>
                    No chapters yet. Add your first chapter to get started!
                  </Text>
                ) : (
                  currentBook.chapters.map((chapter, index) => 
                    renderChapterItem({ item: chapter, index })
                  )
                )}
              </ScrollView>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: colors.skyBlue }]}
                  onPress={() => setIsBookDetailModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                    Close
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: colors.mutedGreen }]}
                  onPress={() => {
                    // TODO: Export functionality
                    Alert.alert('Export', 'Export functionality coming soon!');
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: colors.charcoalInk }]}>
                    Export
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Faith Mode Overlay */}
      {FaithModeOverlay}
      {EncouragementOverlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
    fontFamily: 'Raleway',
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  booksSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Playfair Display',
    textDecorationLine: 'underline',
  },
  bookCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bookCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  bookDate: {
    fontSize: 12,
    opacity: 0.7,
    fontFamily: 'Raleway',
  },
  bookDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    fontFamily: 'Raleway',
    marginBottom: 12,
  },
  bookStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookStatsText: {
    fontSize: 12,
    fontFamily: 'Raleway',
  },
  faithBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  faithBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'Raleway',
  },
  encouragementCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  encouragementText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: 'Raleway',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Playfair Display',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Raleway',
  },
  modalTextArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 80,
    fontFamily: 'Raleway',
    textAlignVertical: 'top',
  },
  kingdomSuggestions: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  suggestionsList: {
    maxHeight: 120,
  },
  suggestionText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Raleway',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  bookDetailDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Raleway',
  },
  chaptersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chaptersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  addChapterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addChapterButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  chaptersList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  noChaptersText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Raleway',
  },
  chapterItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Playfair Display',
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  chapterNotes: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
    fontFamily: 'Raleway',
    marginBottom: 8,
  },
  chapterLinks: {
    flexDirection: 'row',
    gap: 8,
  },
  chapterLink: {
    fontSize: 12,
    fontFamily: 'Raleway',
  },
}); 