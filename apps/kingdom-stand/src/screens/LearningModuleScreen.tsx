// Legal Education Hub - Learning Module Screen
// Interactive learning interface for course modules

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  WebView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'document';
  title: string;
  description: string;
  order: number;
  data: any;
  isCompleted: boolean;
  timeSpent: number;
  bookmarked: boolean;
  notes: string[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number;
  content: ModuleContent[];
  isCompleted: boolean;
  timeSpent: number;
}

interface LearningModuleScreenProps {
  route: {
    params: {
      moduleId: string;
      courseId: string;
    };
  };
  navigation: any;
}

const LearningModuleScreen: React.FC<LearningModuleScreenProps> = ({ route, navigation }) => {
  const { moduleId, courseId } = route.params;
  const [module, setModule] = useState<LearningModule | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  
  const videoRef = useRef<Video>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample module data
  const sampleModule: LearningModule = {
    id: 'module-1',
    title: 'Introduction to Family Law',
    description: 'Understanding the basics of family law and court systems.',
    order: 1,
    estimatedTime: 45,
    content: [
      {
        id: 'content-1',
        type: 'video',
        title: 'What is Family Law?',
        description: 'Overview of family law concepts and terminology.',
        order: 1,
        data: {
          videoUrl: '/education/videos/family-law-intro.mp4',
          thumbnail: '/education/thumbnails/family-law-intro.jpg',
          duration: 900,
          transcript: 'Family law encompasses all legal matters related to family relationships...',
          quality: '720p',
          downloadable: true
        },
        isCompleted: false,
        timeSpent: 0,
        bookmarked: false,
        notes: []
      },
      {
        id: 'content-2',
        type: 'text',
        title: 'Family Law Terminology',
        description: 'Key terms you need to know in family law.',
        order: 2,
        data: {
          content: '# Family Law Terminology\n\n## Essential Terms\n\n### Parties in Family Law Cases\n- **Petitioner**: The person who files a legal action (like divorce)\n- **Respondent**: The person who responds to the legal action\n- **Plaintiff**: Another term for petitioner (used in some states)\n- **Defendant**: Another term for respondent (used in some states)',
          readingTime: 20,
          format: 'markdown',
          images: ['/education/images/family-law-terms-diagram.png'],
          links: []
        },
        isCompleted: false,
        timeSpent: 0,
        bookmarked: false,
        notes: []
      },
      {
        id: 'content-3',
        type: 'interactive',
        title: 'Terminology Matching Game',
        description: 'Test your knowledge of family law terms with this interactive matching game.',
        order: 3,
        data: {
          type: 'matching',
          data: {
            terms: [
              { term: 'Petitioner', definition: 'Person who files a legal action' },
              { term: 'Respondent', definition: 'Person who responds to legal action' },
              { term: 'Jurisdiction', definition: "Court's authority to hear a case" },
              { term: 'Custody', definition: 'Legal responsibility for child care' }
            ]
          },
          instructions: 'Match each term with its correct definition.',
          hints: ['Think about who starts vs. responds to legal actions'],
          feedback: ['Correct! The petitioner initiates the legal action.']
        },
        isCompleted: false,
        timeSpent: 0,
        bookmarked: false,
        notes: []
      }
    ],
    isCompleted: false,
    timeSpent: 0
  };

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = async () => {
    try {
      setLoading(true);
      // In production: await educationService.getModule(moduleId)
      setModule(sampleModule);
      setUserNotes(sampleModule.content[currentContentIndex]?.notes || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const currentContent = module?.content[currentContentIndex];

  const markContentComplete = async (contentId: string, timeSpent: number) => {
    try {
      // In production: await educationService.completeContent(userId, contentId, timeSpent)
      console.log(`Marking content ${contentId} as complete with ${timeSpent} seconds spent`);
    } catch (error) {
      console.error('Failed to mark content complete:', error);
    }
  };

  const toggleBookmark = async (contentId: string) => {
    try {
      // In production: await educationService.bookmarkContent(userId, contentId)
      console.log(`Toggling bookmark for content ${contentId}`);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      // In production: await educationService.addNote(userId, { contentId: currentContent.id, content: newNote, ... })
      setUserNotes([...userNotes, newNote]);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const nextContent = () => {
    if (module && currentContentIndex < module.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setUserNotes(module.content[currentContentIndex + 1]?.notes || []);
    }
  };

  const previousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      setUserNotes(module?.content[currentContentIndex - 1]?.notes || []);
    }
  };

  const VideoPlayer: React.FC<{ content: ModuleContent }> = ({ content }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: content.data.videoUrl }}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="contain"
          onProgress={(data) => setVideoProgress(data.currentTime)}
          onLoad={(data) => setVideoDuration(data.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => {
            markContentComplete(content.id, content.data.duration);
          }}
        />
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{content.title}</Text>
          <Text style={styles.videoDescription}>{content.description}</Text>
        </View>
      </View>
    );
  };

  const TextContent: React.FC<{ content: ModuleContent }> = ({ content }) => {
    return (
      <ScrollView style={styles.textContainer}>
        <View style={styles.textContent}>
          <Text style={styles.textTitle}>{content.title}</Text>
          <Text style={styles.textDescription}>{content.description}</Text>
          
          <View style={styles.markdownContent}>
            <Text style={styles.markdownText}>{content.data.content}</Text>
          </View>
          
          {content.data.images && content.data.images.length > 0 && (
            <View style={styles.imageContainer}>
              {content.data.images.map((imageUrl: string, index: number) => (
                <Image key={index} source={{ uri: imageUrl }} style={styles.contentImage} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const InteractiveContent: React.FC<{ content: ModuleContent }> = ({ content }) => {
    const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<{[key: string]: string}>({});
    
    const handleTermSelect = (term: string) => {
      if (selectedTerms.includes(term)) {
        setSelectedTerms(selectedTerms.filter(t => t !== term));
      } else if (selectedTerms.length < 2) {
        setSelectedTerms([...selectedTerms, term]);
      }
    };

    const checkMatch = () => {
      if (selectedTerms.length === 2) {
        const [term1, term2] = selectedTerms;
        // Simple matching logic - in production this would be more sophisticated
        if (content.data.data.terms.find((t: any) => t.term === term1)?.definition === term2) {
          setMatchedPairs({...matchedPairs, [term1]: term2});
          setSelectedTerms([]);
        }
      }
    };

    return (
      <View style={styles.interactiveContainer}>
        <Text style={styles.interactiveTitle}>{content.title}</Text>
        <Text style={styles.interactiveDescription}>{content.description}</Text>
        
        <View style={styles.matchingGame}>
          <Text style={styles.gameInstructions}>{content.data.instructions}</Text>
          
          <View style={styles.termsContainer}>
            {content.data.data.terms.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.termCard,
                  selectedTerms.includes(item.term) && styles.termCardSelected,
                  matchedPairs[item.term] && styles.termCardMatched
                ]}
                onPress={() => handleTermSelect(item.term)}
              >
                <Text style={styles.termText}>{item.term}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.checkButton} onPress={checkMatch}>
            <Text style={styles.checkButtonText}>Check Match</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ContentRenderer: React.FC<{ content: ModuleContent }> = ({ content }) => {
    switch (content.type) {
      case 'video':
        return <VideoPlayer content={content} />;
      case 'text':
        return <TextContent content={content} />;
      case 'interactive':
        return <InteractiveContent content={content} />;
      default:
        return (
          <View style={styles.unsupportedContent}>
            <Text style={styles.unsupportedText}>Content type not supported yet</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading module...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!module || !currentContent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Module not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{module.title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentContentIndex + 1} of {module.content.length}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => toggleBookmark(currentContent.id)}
        >
          <Ionicons 
            name={currentContent.bookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={currentContent.bookmarked ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <ContentRenderer content={currentContent} />
      </View>

      {/* Notes Panel */}
      {showNotes && (
        <View style={styles.notesPanel}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesTitle}>Your Notes</Text>
            <TouchableOpacity onPress={() => setShowNotes(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.notesList}>
            {userNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.addNoteContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note..."
              value={newNote}
              onChangeText={setNewNote}
              multiline
            />
            <TouchableOpacity style={styles.addNoteButton} onPress={addNote}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity 
          style={styles.notesButton}
          onPress={() => setShowNotes(!showNotes)}
        >
          <Ionicons name="create-outline" size={20} color="#666" />
          <Text style={styles.notesButtonText}>Notes</Text>
        </TouchableOpacity>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, currentContentIndex === 0 && styles.navButtonDisabled]}
            onPress={previousContent}
            disabled={currentContentIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentContentIndex === 0 ? "#ccc" : "#2196F3"} />
            <Text style={[styles.navButtonText, currentContentIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentContentIndex === module.content.length - 1 && styles.navButtonDisabled]}
            onPress={nextContent}
            disabled={currentContentIndex === module.content.length - 1}
          >
            <Text style={[styles.navButtonText, currentContentIndex === module.content.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentContentIndex === module.content.length - 1 ? "#ccc" : "#2196F3"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bookmarkButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
  },
  videoContainer: {
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: width,
    height: width * 0.56, // 16:9 aspect ratio
  },
  videoInfo: {
    padding: 20,
    backgroundColor: '#fff',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContent: {
    padding: 20,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  markdownContent: {
    marginBottom: 20,
  },
  markdownText: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 28,
  },
  imageContainer: {
    marginTop: 20,
  },
  contentImage: {
    width: width - 40,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  interactiveContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  interactiveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  interactiveDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  matchingGame: {
    flex: 1,
  },
  gameInstructions: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
    lineHeight: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  termCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  termCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  termCardMatched: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  termText: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  unsupportedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  unsupportedText: {
    fontSize: 16,
    color: '#666',
  },
  notesPanel: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  notesList: {
    maxHeight: height * 0.3,
    padding: 20,
  },
  noteItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  addNoteContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  noteInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    maxHeight: 80,
  },
  addNoteButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  notesButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  navButtonDisabled: {
    borderColor: '#e9ecef',
  },
  navButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
});

export default LearningModuleScreen;
