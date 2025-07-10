import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KingdomColors } from '../constants/KingdomColors';
import { useAuth } from '../contexts/AuthContext';
import { AppMode } from '../types/spiritual';
import { MentorProfile } from '../types/mentorship';

interface MatchingQuestion {
  id: string;
  question: string;
  faithQuestion?: string;
  encouragementQuestion?: string;
  type: 'multiple_choice' | 'scale' | 'tags' | 'priority_ranking';
  options?: string[];
  faithOptions?: string[];
  encouragementOptions?: string[];
  category: 'interests' | 'business_focus' | 'ministry_focus' | 'learning_style' | 'goals' | 'experience_level';
  tags?: string[];
}

interface MentorMatch {
  mentor: MentorProfile;
  matchScore: number;
  matchReasons: string[];
  sharedInterests: string[];
  complementarySkills: string[];
}

interface MatchingResult {
  topMatches: MentorMatch[];
  userProfile: UserMatchingProfile;
  recommendations: string[];
}

interface UserMatchingProfile {
  interests: string[];
  businessFocus: string[];
  ministryFocus: string[];
  goals: string[];
  experienceLevel: string;
  learningStyle: string;
  mentorshipType: string;
}

interface UserAnswer {
  questionId: string;
  answer: string | number | string[];
  category: string;
}

const MentorMatchingQuizScreen: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AppMode>('faith');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [matchingResults, setMatchingResults] = useState<MatchingResult | null>(null);
  const [questions, setQuestions] = useState<MatchingQuestion[]>([]);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    loadMatchingQuestions();
  }, [mode]);

  useEffect(() => {
    if (isQuizStarted && questions.length > 0) {
      const progressValue = (currentQuestionIndex + 1) / questions.length;
      Animated.timing(progress, {
        toValue: progressValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, isQuizStarted, questions.length]);

  const loadMatchingQuestions = () => {
    const mockQuestions: MatchingQuestion[] = [
      {
        id: '1',
        question: mode === 'faith' ? 'What areas of ministry or business are you most passionate about?' : 'What business or leadership areas interest you most?',
        faithQuestion: 'What areas of ministry or business are you most passionate about?',
        encouragementQuestion: 'What business or leadership areas interest you most?',
        type: 'multiple_choice',
        options: mode === 'faith' 
          ? ['Digital evangelism & outreach', 'Biblical teaching & discipleship', 'Business as ministry', 'Creative worship & arts', 'Servant leadership', 'Community building', 'Social justice & missions']
          : ['Digital marketing & growth', 'Leadership development', 'Entrepreneurship', 'Creative direction', 'Strategic planning', 'Team building', 'Innovation & transformation'],
        faithOptions: ['Digital evangelism & outreach', 'Biblical teaching & discipleship', 'Business as ministry', 'Creative worship & arts', 'Servant leadership', 'Community building', 'Social justice & missions'],
        encouragementOptions: ['Digital marketing & growth', 'Leadership development', 'Entrepreneurship', 'Creative direction', 'Strategic planning', 'Team building', 'Innovation & transformation'],
        category: mode === 'faith' ? 'ministry_focus' : 'business_focus'
      },
      {
        id: '2',
        question: mode === 'faith' ? 'What type of Christian mentorship are you seeking?' : 'What type of leadership mentorship are you seeking?',
        faithQuestion: 'What type of Christian mentorship are you seeking?',
        encouragementQuestion: 'What type of leadership mentorship are you seeking?',
        type: 'multiple_choice',
        options: mode === 'faith'
          ? ['Spiritual formation & prayer life', 'Ministry skill development', 'Faith-based business guidance', 'Biblical life coaching', 'Mission work preparation', 'Leadership in the church']
          : ['Personal leadership growth', 'Business skill development', 'Career advancement guidance', 'Life coaching & strategy', 'Innovation mentorship', 'Executive development'],
        faithOptions: ['Spiritual formation & prayer life', 'Ministry skill development', 'Faith-based business guidance', 'Biblical life coaching', 'Mission work preparation', 'Leadership in the church'],
        encouragementOptions: ['Personal leadership growth', 'Business skill development', 'Career advancement guidance', 'Life coaching & strategy', 'Innovation mentorship', 'Executive development'],
        category: 'goals'
      },
      {
        id: '3',
        question: 'What is your current experience level?',
        type: 'multiple_choice',
        options: ['Just starting out (0-1 years)', 'Some experience (2-3 years)', 'Intermediate (4-6 years)', 'Advanced (7+ years)', 'Expert/Leader (10+ years)'],
        category: 'experience_level'
      },
      {
        id: '4',
        question: 'How do you prefer to learn and grow?',
        type: 'multiple_choice',
        options: ['One-on-one personal mentoring', 'Small group learning', 'Structured courses/programs', 'Real-time project collaboration', 'Regular check-ins & accountability', 'Informal conversations & networking'],
        category: 'learning_style'
      }
    ];

    setQuestions(mockQuestions);
  };

  const startQuiz = () => {
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsQuizCompleted(false);
  };

  const selectAnswer = (answer: string | number | string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      category: currentQuestion.category
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...updatedAnswers, newAnswer]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeQuiz = () => {
    const results = findMentorMatches();
    setMatchingResults(results);
    setIsQuizCompleted(true);
  };

  const findMentorMatches = (): MatchingResult => {
    // Create user profile from answers
    const userProfile: UserMatchingProfile = {
      interests: [],
      businessFocus: [],
      ministryFocus: [],
      goals: [],
      experienceLevel: '',
      learningStyle: '',
      mentorshipType: ''
    };

    answers.forEach(answer => {
      switch (answer.category) {
        case 'ministry_focus':
        case 'business_focus':
          if (typeof answer.answer === 'string') {
            if (answer.category === 'ministry_focus') {
              userProfile.ministryFocus.push(answer.answer);
            } else {
              userProfile.businessFocus.push(answer.answer);
            }
          }
          break;
        case 'goals':
          if (typeof answer.answer === 'string') {
            userProfile.goals.push(answer.answer);
          }
          break;
        case 'experience_level':
          if (typeof answer.answer === 'string') {
            userProfile.experienceLevel = answer.answer;
          }
          break;
        case 'learning_style':
          if (typeof answer.answer === 'string') {
            userProfile.learningStyle = answer.answer;
          }
          break;
      }
    });

    // Mock mentor data with matching logic
    const mockMentors: MentorProfile[] = [
      {
        id: '1',
        userId: 'mentor1',
        displayName: mode === 'faith' ? 'Pastor Sarah Johnson' : 'Sarah Johnson',
        profileImage: 'https://example.com/mentor1.jpg',
        isActive: true,
        categories: [],
        bio: mode === 'faith' 
          ? 'Passionate about digital evangelism and faith-based business. 15+ years in ministry and business leadership.'
          : 'Digital marketing expert and business strategist. 15+ years helping leaders scale their impact.',
        experience: '15+ years',
        giftings: mode === 'faith' 
          ? ['Digital evangelism', 'Business as ministry', 'Leadership'] 
          : ['Digital marketing', 'Business strategy', 'Leadership'],
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          timeZone: 'PST',
          preferredTimes: ['9am-12pm', '2pm-5pm']
        },
        rating: 4.9,
        totalMentees: 50,
        totalSessions: 200,
        specialties: mode === 'faith' 
          ? ['Digital evangelism', 'Faith-based entrepreneurship', 'Ministry leadership', 'Biblical business principles']
          : ['Digital marketing', 'Business growth', 'Leadership development', 'Strategic planning'],
        testimonials: [],
        joinedDate: '2022-01-15',
        lastActive: '2024-01-15',
        faithMode: mode === 'faith',
        contactPreference: 'video'
      },
      {
        id: '2',
        userId: 'mentor2',
        displayName: mode === 'faith' ? 'Dr. Michael Chen' : 'Michael Chen',
        profileImage: 'https://example.com/mentor2.jpg',
        isActive: true,
        categories: [],
        bio: mode === 'faith' 
          ? 'Bible teacher and discipleship specialist. Passionate about developing emerging leaders in the faith.'
          : 'Executive coach and leadership development expert. Specializes in developing high-potential leaders.',
        experience: '20+ years',
        giftings: mode === 'faith' 
          ? ['Biblical teaching', 'Discipleship', 'Leadership development'] 
          : ['Executive coaching', 'Leadership', 'Strategic thinking'],
        availability: {
          days: ['Tuesday', 'Thursday', 'Saturday'],
          timeZone: 'EST',
          preferredTimes: ['10am-1pm', '3pm-6pm']
        },
        rating: 4.8,
        totalMentees: 75,
        totalSessions: 350,
        specialties: mode === 'faith' 
          ? ['Biblical teaching', 'Discipleship', 'Church leadership', 'Spiritual formation']
          : ['Executive coaching', 'Leadership assessment', 'Team development', 'Strategic planning'],
        testimonials: [],
        joinedDate: '2021-08-20',
        lastActive: '2024-01-14',
        faithMode: mode === 'faith',
        contactPreference: 'chat'
      }
    ];

    // Calculate matches based on user profile
    const matches: MentorMatch[] = mockMentors.map(mentor => {
      let score = 0;
      const reasons: string[] = [];
      const sharedInterests: string[] = [];
      const complementarySkills: string[] = [];

      // Match specialties with user goals and interests
      mentor.specialties.forEach(specialty => {
        const focusAreas = mode === 'faith' ? userProfile.ministryFocus : userProfile.businessFocus;
        if (focusAreas.some(area => specialty.toLowerCase().includes(area.toLowerCase().split(' ')[0]))) {
          score += 30;
          reasons.push(`Expertise in ${specialty}`);
          sharedInterests.push(specialty);
        }
      });

      // Match experience level
      if (userProfile.experienceLevel.includes('starting') && mentor.experience.includes('15+')) {
        score += 20;
        reasons.push('Perfect for beginners with extensive experience');
      }

      // Learning style match
      if (userProfile.learningStyle.includes('One-on-one') && mentor.contactPreference === 'video') {
        score += 15;
        reasons.push('Prefers one-on-one mentoring');
      }

      // Base compatibility score
      score += 25;

      return {
        mentor,
        matchScore: Math.min(score, 95),
        matchReasons: reasons,
        sharedInterests,
        complementarySkills: mentor.specialties.slice(0, 2)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return {
      topMatches: matches,
      userProfile,
      recommendations: [
        mode === 'faith' 
          ? 'Start with spiritual formation and prayer life mentorship'
          : 'Begin with foundational leadership principles',
        mode === 'faith'
          ? 'Consider joining a discipleship group for community learning'
          : 'Look for mentors with complementary business skills',
        'Schedule regular check-ins to maintain momentum'
      ]
    };
  };

  const restartQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setMatchingResults(null);
  };

  const getCurrentAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return answers.find(a => a.questionId === currentQuestion.id)?.answer;
  };

  const connectWithMentor = (mentorId: string) => {
    // TODO: Navigate to mentor profile or request mentorship
    console.log('Connecting with mentor:', mentorId);
  };

  const renderModeToggle = () => (
    <View style={styles.modeToggle}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'faith' && styles.activeModeButton]}
        onPress={() => setMode('faith')}
      >
        <Ionicons 
          name="heart" 
          size={16} 
          color={mode === 'faith' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'faith' && styles.activeModeText]}>
          Faith Mode
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'encouragement' && styles.activeModeButton]}
        onPress={() => setMode('encouragement')}
      >
        <Ionicons 
          name="flash" 
          size={16} 
          color={mode === 'encouragement' ? KingdomColors.white : KingdomColors.gold.bright} 
        />
        <Text style={[styles.modeButtonText, mode === 'encouragement' && styles.activeModeText]}>
          Encouragement Mode
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderWelcomeScreen = () => (
    <ScrollView style={styles.content}>
      <View style={styles.welcomeContainer}>
        <Ionicons name="people" size={64} color={KingdomColors.gold.bright} />
        <Text style={styles.welcomeTitle}>
          {mode === 'faith' ? 'Find Your Perfect Mentor' : 'Discover Your Ideal Mentor'}
        </Text>
        <Text style={styles.welcomeDescription}>
          {mode === 'faith' 
            ? 'Connect with experienced mentors who share your faith and can guide you in ministry, business, and spiritual growth. God uses people to shape people.'
            : 'Connect with experienced mentors who can accelerate your leadership journey and help you achieve your professional and personal goals.'
          }
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <LinearGradient
            colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Find My Mentors</Text>
            <Ionicons name="arrow-forward" size={20} color={KingdomColors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = getCurrentAnswer();

    return (
      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>

          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  currentAnswer === option && styles.selectedOption,
                ]}
                onPress={() => selectAnswer(option)}
              >
                <Text style={[
                  styles.optionText,
                  currentAnswer === option && styles.selectedOptionText,
                ]}>
                  {option}
                </Text>
                {currentAnswer === option && (
                  <Ionicons name="checkmark-circle" size={20} color={KingdomColors.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.navigationButtons}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity style={styles.prevButton} onPress={prevQuestion}>
                <Ionicons name="arrow-back" size={20} color={KingdomColors.gold.bright} />
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            {currentAnswer && (
              <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                <LinearGradient
                  colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex === questions.length - 1 ? 'Find Mentors' : 'Next'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={KingdomColors.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderMentorCard = ({ item }: { item: MentorMatch }) => (
    <View style={styles.mentorCard}>
      <View style={styles.mentorHeader}>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{item.mentor.displayName}</Text>
          <Text style={styles.mentorExperience}>{item.mentor.experience}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={KingdomColors.gold.bright} />
            <Text style={styles.rating}>{item.mentor.rating}</Text>
            <Text style={styles.menteeCount}>• {item.mentor.totalMentees} mentees</Text>
          </View>
        </View>
        <View style={styles.matchScore}>
          <Text style={styles.matchPercentage}>{item.matchScore}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>

      <Text style={styles.mentorBio}>{item.mentor.bio}</Text>

      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesLabel}>Specialties:</Text>
        <View style={styles.specialtiesTags}>
          {item.mentor.specialties.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.matchReasonsContainer}>
        <Text style={styles.matchReasonsLabel}>Why this is a great match:</Text>
        {item.matchReasons.slice(0, 2).map((reason, index) => (
          <View key={index} style={styles.matchReason}>
            <Ionicons name="checkmark-circle" size={16} color={KingdomColors.accent.success} />
            <Text style={styles.matchReasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.connectButton}
        onPress={() => connectWithMentor(item.mentor.id)}
      >
        <LinearGradient
          colors={[KingdomColors.gold.bright, KingdomColors.gold.warm]}
          style={styles.connectButtonGradient}
        >
          <Text style={styles.connectButtonText}>Request Mentorship</Text>
          <Ionicons name="arrow-forward" size={18} color={KingdomColors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderResults = () => (
    <ScrollView style={styles.content}>
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Ionicons name="people" size={48} color={KingdomColors.gold.bright} />
          <Text style={styles.resultsTitle}>Your Mentor Matches</Text>
          <Text style={styles.resultsDescription}>
            {mode === 'faith' 
              ? 'Based on your responses, we\'ve found mentors who can guide your spiritual and professional journey.'
              : 'Based on your responses, we\'ve found mentors who can accelerate your leadership and career growth.'
            }
          </Text>
        </View>

        <FlatList
          data={matchingResults?.topMatches || []}
          renderItem={renderMentorCard}
          keyExtractor={(item) => item.mentor.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />

        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Recommendations for You:</Text>
          {matchingResults?.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendation}>
              <Ionicons name="bulb" size={16} color={KingdomColors.gold.bright} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.retakeButton} onPress={restartQuiz}>
          <Text style={styles.retakeButtonText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KingdomColors.primary.royalPurple, KingdomColors.primary.deepNavy]}
        style={styles.header}
      >
        <Text style={styles.title}>
          {mode === 'faith' ? 'Find Your Mentor' : 'Mentor Matching'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'faith' 
            ? 'Connect with mentors who share your faith and values' 
            : 'Connect with mentors who can accelerate your growth'
          }
        </Text>
        {!isQuizStarted && !isQuizCompleted && renderModeToggle()}
      </LinearGradient>

      {!isQuizStarted && !isQuizCompleted && renderWelcomeScreen()}
      {isQuizStarted && !isQuizCompleted && renderQuestion()}
      {isQuizCompleted && renderResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KingdomColors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KingdomColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: KingdomColors.text.secondary,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: KingdomColors.gold.bright,
  },
  modeButtonText: {
    color: KingdomColors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeModeText: {
    color: KingdomColors.white,
  },
  content: {
    flex: 1,
  },
  welcomeContainer: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  questionContainer: {
    padding: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: KingdomColors.silver.light,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: KingdomColors.gold.bright,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: KingdomColors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: KingdomColors.silver.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedOption: {
    borderColor: KingdomColors.gold.bright,
    backgroundColor: KingdomColors.gold.bright,
  },
  optionText: {
    fontSize: 16,
    color: KingdomColors.text.inverse,
    flex: 1,
    marginRight: 12,
  },
  selectedOptionText: {
    color: KingdomColors.white,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  prevButtonText: {
    color: KingdomColors.gold.bright,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    color: KingdomColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  resultsContainer: {
    padding: 24,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  resultsDescription: {
    fontSize: 16,
    color: KingdomColors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  mentorCard: {
    backgroundColor: KingdomColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 4,
  },
  mentorExperience: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginLeft: 4,
  },
  menteeCount: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 4,
  },
  matchScore: {
    alignItems: 'center',
    backgroundColor: KingdomColors.accent.success + '20',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  matchPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: KingdomColors.accent.success,
  },
  matchLabel: {
    fontSize: 12,
    color: KingdomColors.accent.success,
    fontWeight: '600',
  },
  mentorBio: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtiesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
  },
  specialtiesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: KingdomColors.gold.bright + '20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
  matchReasonsContainer: {
    marginBottom: 20,
  },
  matchReasonsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: KingdomColors.text.inverse,
    marginBottom: 8,
  },
  matchReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  matchReasonText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 8,
    flex: 1,
  },
  connectButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  connectButtonText: {
    color: KingdomColors.white,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  recommendationsContainer: {
    backgroundColor: KingdomColors.silver.platinum,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: KingdomColors.text.inverse,
    marginBottom: 12,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: KingdomColors.text.muted,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  retakeButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retakeButtonText: {
    fontSize: 16,
    color: KingdomColors.gold.bright,
    fontWeight: '600',
  },
});

export default React.memo(MentorMatchingQuizScreen);
