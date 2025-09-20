// Legal Education Hub - Core Types and Interfaces
// Comprehensive type definitions for the Legal Education system

export interface LegalEducationCourse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string; // "2-3 hours"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: CourseCategory;
  stateSpecific: boolean;
  states: string[]; // ['CA', 'TX', 'FL']
  
  // Content
  modules: CourseModule[];
  prerequisites: string[];
  learningObjectives: string[];
  
  // Assessment
  quizzes: Quiz[];
  finalExam?: FinalExam;
  certificate: {
    available: boolean;
    requirements: string[];
    validFor: string; // "1 year"
  };
  
  // Progress Tracking
  progressTracking: {
    bookmarks: boolean;
    notes: boolean;
    timeTracking: boolean;
    completionCertificate: boolean;
  };
  
  // Metadata
  created: string;
  updated: string;
  verifiedBy: string; // Legal expert who verified
  tags: string[];
  thumbnail: string;
  isActive: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number; // in minutes
  
  // Content Types
  content: ModuleContent[];
  
  // Progress
  isCompleted: boolean;
  timeSpent: number; // in minutes
  lastAccessed?: string;
}

export interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'document';
  title: string;
  description: string;
  order: number;
  
  // Content Data
  data: VideoContent | TextContent | InteractiveContent | QuizContent | DocumentContent;
  
  // Progress
  isCompleted: boolean;
  timeSpent: number;
  bookmarked: boolean;
  notes: string[];
}

export interface VideoContent {
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  transcript?: string;
  captions?: string;
  quality: '480p' | '720p' | '1080p';
  downloadable: boolean;
}

export interface TextContent {
  content: string;
  readingTime: number; // in minutes
  format: 'markdown' | 'html';
  images: string[];
  links: ExternalLink[];
}

export interface InteractiveContent {
  type: 'drag-drop' | 'scenario' | 'timeline' | 'form-builder' | 'matching';
  data: any; // Specific to interactive type
  instructions: string;
  hints: string[];
  feedback: string[];
}

export interface QuizContent {
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  attempts: number; // max attempts allowed
  showCorrectAnswers: boolean;
}

export interface DocumentContent {
  documentUrl: string;
  documentType: string;
  downloadUrl?: string;
  previewUrl: string;
  instructions: string;
  template: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  showCorrectAnswers: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'scenario' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FinalExam {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit: number; // in minutes
  attempts: number;
  certificateRequired: boolean;
}

export interface UserProgress {
  userId: string;
  courses: {
    [courseId: string]: CourseProgress;
  };
  
  // Learning Analytics
  analytics: UserAnalytics;
  
  // Achievements
  achievements: Achievement[];
  
  // Learning Preferences
  preferences: LearningPreferences;
}

export interface CourseProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  progress: number; // 0-100%
  timeSpent: number; // in minutes
  lastAccessed: string;
  startedAt?: string;
  completedAt?: string;
  
  // Module Progress
  completedModules: string[];
  moduleProgress: {
    [moduleId: string]: ModuleProgress;
  };
  
  // Assessment Results
  quizScores: { [quizId: string]: QuizResult };
  finalExamScore?: QuizResult;
  
  // Certificates
  certificates: Certificate[];
  
  // Bookmarks and Notes
  bookmarks: string[];
  notes: UserNote[];
}

export interface ModuleProgress {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100%
  timeSpent: number;
  lastAccessed: string;
  completedContent: string[];
  bookmarkedContent: string[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  percentage: number;
  passed: boolean;
  attempts: number;
  timeSpent: number;
  answers: QuizAnswer[];
  completedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface UserAnalytics {
  totalTimeSpent: number;
  averageQuizScore: number;
  learningStreak: number; // days in a row
  preferredLearningTime: string; // time of day
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyProgression: 'appropriate' | 'too_easy' | 'too_hard';
  completionRate: number;
  retentionRate: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'learning' | 'community' | 'expertise' | 'streak';
}

export interface LearningPreferences {
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  colorBlindFriendly: boolean;
  textToSpeech: boolean;
  audioDescriptions: boolean;
  closedCaptions: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  readingLevel: 'basic' | 'intermediate' | 'advanced';
  simplifiedLanguage: boolean;
  visualAids: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  title: string;
  issuedAt: string;
  expiresAt?: string;
  verificationUrl: string;
  digitalBadge: boolean;
  printableCertificate: boolean;
  courtRecognition: boolean;
  continuingEducation: boolean;
}

export interface UserNote {
  id: string;
  contentId: string;
  content: string;
  timestamp: number; // video timestamp or text position
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPrivate: boolean;
}

export interface ExternalLink {
  title: string;
  url: string;
  description: string;
  type: 'resource' | 'reference' | 'form' | 'statute';
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'template' | 'guide' | 'video' | 'podcast' | 'infographic' | 'statute' | 'form';
  category: string;
  stateSpecific: boolean;
  states: string[];
  
  // Content
  content: {
    text?: string;
    videoUrl?: string;
    audioUrl?: string;
    downloadUrl?: string;
    previewUrl?: string;
  };
  
  // Metadata
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: string;
  verifiedBy: string;
  
  // Usage
  downloadCount: number;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export interface CertificationProgram {
  name: string;
  description: string;
  requirements: {
    courses: string[];
    assessments: string[];
    minimumScore: number;
    timeLimit: string;
  };
  
  benefits: {
    courtRecognition: boolean;
    continuingEducation: boolean;
    professionalDevelopment: boolean;
  };
  
  certificate: {
    digitalBadge: boolean;
    printableCertificate: boolean;
    verificationUrl: string;
    expirationDate: string;
  };
}

// Enums
export type CourseCategory = 
  | 'family-law'
  | 'divorce'
  | 'custody'
  | 'support'
  | 'property-division'
  | 'court-procedures'
  | 'legal-research'
  | 'document-preparation'
  | 'mediation'
  | 'advocacy';

export type LearningFormat = 
  | 'video'
  | 'text'
  | 'interactive'
  | 'quiz'
  | 'document'
  | 'podcast'
  | 'webinar';

export type AssessmentType = 
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'scenario'
  | 'essay'
  | 'practical'
  | 'oral';

// Service Interfaces
export interface EducationService {
  getCourses(filters?: CourseFilters): Promise<LegalEducationCourse[]>;
  getCourse(courseId: string): Promise<LegalEducationCourse>;
  getUserProgress(userId: string): Promise<UserProgress>;
  updateProgress(userId: string, courseId: string, progress: Partial<CourseProgress>): Promise<void>;
  completeContent(userId: string, contentId: string, timeSpent: number): Promise<void>;
  bookmarkContent(userId: string, contentId: string): Promise<void>;
  addNote(userId: string, note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserNote>;
  takeQuiz(userId: string, quizId: string, answers: QuizAnswer[]): Promise<QuizResult>;
  getCertificates(userId: string): Promise<Certificate[]>;
  getResources(filters?: ResourceFilters): Promise<ResourceItem[]>;
}

export interface CourseFilters {
  category?: CourseCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  state?: string;
  duration?: 'short' | 'medium' | 'long';
  hasCertificate?: boolean;
  isActive?: boolean;
}

export interface ResourceFilters {
  type?: string;
  category?: string;
  state?: string;
  difficulty?: string;
  tags?: string[];
}

// All types are already exported above with export interface/type declarations
