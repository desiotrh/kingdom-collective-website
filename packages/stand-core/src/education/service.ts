// Legal Education Hub - Core Service Implementation
// Main service for managing courses, progress, and learning analytics

import { 
  LegalEducationCourse,
  CourseModule,
  ModuleContent,
  UserProgress,
  CourseProgress,
  Quiz,
  QuizResult,
  Certificate,
  UserNote,
  ResourceItem,
  EducationService,
  CourseFilters,
  ResourceFilters,
  QuizAnswer,
  CourseCategory,
  LearningFormat
} from './types.js';

export class KingdomStandEducationService implements EducationService {
  private courses: Map<string, LegalEducationCourse> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private resources: Map<string, ResourceItem> = new Map();

  constructor() {
    // Initialize sample data asynchronously
    this.initializeSampleData().catch(console.error);
  }

  // Course Management
  async getCourses(filters?: CourseFilters): Promise<LegalEducationCourse[]> {
    let courses = Array.from(this.courses.values());

    if (filters) {
      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category);
      }
      if (filters.difficulty) {
        courses = courses.filter(course => course.difficulty === filters.difficulty);
      }
      if (filters.state) {
        courses = courses.filter(course => 
          !course.stateSpecific || course.states.includes(filters.state!)
        );
      }
      if (filters.hasCertificate !== undefined) {
        courses = courses.filter(course => course.certificate.available === filters.hasCertificate);
      }
      if (filters.isActive !== undefined) {
        courses = courses.filter(course => course.isActive === filters.isActive);
      }
    }

    return courses.sort((a, b) => a.title.localeCompare(b.title));
  }

  async getCourse(courseId: string): Promise<LegalEducationCourse> {
    const course = this.courses.get(courseId);
    if (!course) {
      throw new Error(`Course not found: ${courseId}`);
    }
    return course;
  }

  // Progress Tracking
  async getUserProgress(userId: string): Promise<UserProgress> {
    let progress = this.userProgress.get(userId);
    
    if (!progress) {
      progress = this.createInitialProgress(userId);
      this.userProgress.set(userId, progress);
    }

    return progress;
  }

  async updateProgress(userId: string, courseId: string, progressUpdate: Partial<CourseProgress>): Promise<void> {
    const userProgress = await this.getUserProgress(userId);
    
    if (!userProgress.courses[courseId]) {
      throw new Error('Course progress not found');
    }

    const courseProgress = userProgress.courses[courseId];
    Object.assign(courseProgress, progressUpdate);

    // Update analytics
    this.updateUserAnalytics(userProgress);

    this.userProgress.set(userId, userProgress);
  }

  async completeContent(userId: string, contentId: string, timeSpent: number): Promise<void> {
    const userProgress = await this.getUserProgress(userId);
    
    // Find the content and mark it as completed
    for (const courseId in userProgress.courses) {
      const courseProgress = userProgress.courses[courseId];
      
      for (const moduleId in courseProgress.moduleProgress) {
        const moduleProgress = courseProgress.moduleProgress[moduleId];
        
        if (moduleProgress.completedContent.includes(contentId)) {
          continue; // Already completed
        }

        // Check if this content belongs to this module
        const course = await this.getCourse(courseId);
        const module = course.modules.find(m => m.id === moduleId);
        
        if (module) {
          const content = module.content.find(c => c.id === contentId);
          if (content) {
            moduleProgress.completedContent.push(contentId);
            moduleProgress.timeSpent += timeSpent;
            
            // Update module progress percentage
            const totalContent = module.content.length;
            const completedContent = moduleProgress.completedContent.length;
            moduleProgress.progress = Math.round((completedContent / totalContent) * 100);
            
            // Update module status
            if (moduleProgress.progress === 100) {
              moduleProgress.status = 'completed';
              courseProgress.completedModules.push(moduleId);
            } else if (moduleProgress.progress > 0) {
              moduleProgress.status = 'in_progress';
            }
            
            // Update course progress
            const totalModules = course.modules.length;
            const completedModules = courseProgress.completedModules.length;
            courseProgress.progress = Math.round((completedModules / totalModules) * 100);
            
            // Update course status
            if (courseProgress.progress === 100) {
              courseProgress.status = 'completed';
              courseProgress.completedAt = new Date().toISOString();
            } else if (courseProgress.progress > 0) {
              courseProgress.status = 'in_progress';
            }
            
            break;
          }
        }
      }
    }

    this.userProgress.set(userId, userProgress);
  }

  async bookmarkContent(userId: string, contentId: string): Promise<void> {
    const userProgress = await this.getUserProgress(userId);
    
    // Find the course containing this content and add bookmark
    for (const courseId in userProgress.courses) {
      const courseProgress = userProgress.courses[courseId];
      
      if (!courseProgress.bookmarks.includes(contentId)) {
        courseProgress.bookmarks.push(contentId);
      }
    }

    this.userProgress.set(userId, userProgress);
  }

  async addNote(userId: string, note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserNote> {
    const userProgress = await this.getUserProgress(userId);
    
    const newNote: UserNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Find the course and add the note
    for (const courseId in userProgress.courses) {
      const courseProgress = userProgress.courses[courseId];
      courseProgress.notes.push(newNote);
    }

    this.userProgress.set(userId, userProgress);
    return newNote;
  }

  // Assessment Management
  async takeQuiz(userId: string, quizId: string, answers: QuizAnswer[]): Promise<QuizResult> {
    const userProgress = await this.getUserProgress(userId);
    
    // Find the quiz
    let quiz: Quiz | null = null;
    let courseId: string | null = null;
    
    for (const [id, course] of this.courses) {
      const foundQuiz = course.quizzes.find(q => q.id === quizId);
      if (foundQuiz) {
        quiz = foundQuiz;
        courseId = id;
        break;
      }
    }

    if (!quiz || !courseId) {
      throw new Error(`Quiz not found: ${quizId}`);
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    
    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question && this.isAnswerCorrect(question, answer.answer)) {
        correctAnswers++;
      }
    }

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScore;

    const result: QuizResult = {
      quizId,
      score: correctAnswers,
      percentage,
      passed,
      attempts: (userProgress.courses[courseId].quizScores[quizId]?.attempts || 0) + 1,
      timeSpent: answers.reduce((total, answer) => total + answer.timeSpent, 0),
      answers,
      completedAt: new Date().toISOString()
    };

    // Update user progress
    userProgress.courses[courseId].quizScores[quizId] = result;
    this.userProgress.set(userId, userProgress);

    return result;
  }

  async getCertificates(userId: string): Promise<Certificate[]> {
    const userProgress = await this.getUserProgress(userId);
    const certificates: Certificate[] = [];

    for (const courseId in userProgress.courses) {
      const courseProgress = userProgress.courses[courseId];
      certificates.push(...courseProgress.certificates);
    }

    return certificates;
  }

  // Resource Management
  async getResources(filters?: ResourceFilters): Promise<ResourceItem[]> {
    let resources = Array.from(this.resources.values());

    if (filters) {
      if (filters.type) {
        resources = resources.filter(resource => resource.type === filters.type);
      }
      if (filters.category) {
        resources = resources.filter(resource => resource.category === filters.category);
      }
      if (filters.state) {
        resources = resources.filter(resource => 
          !resource.stateSpecific || resource.states.includes(filters.state!)
        );
      }
      if (filters.difficulty) {
        resources = resources.filter(resource => resource.difficulty === filters.difficulty);
      }
      if (filters.tags && filters.tags.length > 0) {
        resources = resources.filter(resource => 
          filters.tags!.some(tag => resource.tags.includes(tag))
        );
      }
    }

    return resources.sort((a, b) => b.rating - a.rating);
  }

  // Private Helper Methods
  private createInitialProgress(userId: string): UserProgress {
    return {
      userId,
      courses: {},
      analytics: {
        totalTimeSpent: 0,
        averageQuizScore: 0,
        learningStreak: 0,
        preferredLearningTime: 'morning',
        learningStyle: 'mixed',
        difficultyProgression: 'appropriate',
        completionRate: 0,
        retentionRate: 0
      },
      achievements: [],
      preferences: {
        textSize: 'medium',
        highContrast: false,
        colorBlindFriendly: false,
        textToSpeech: false,
        audioDescriptions: false,
        closedCaptions: false,
        keyboardNavigation: false,
        voiceControl: false,
        readingLevel: 'intermediate',
        simplifiedLanguage: false,
        visualAids: true
      }
    };
  }

  private updateUserAnalytics(userProgress: UserProgress): void {
    const courses = Object.values(userProgress.courses);
    
    // Calculate total time spent
    userProgress.analytics.totalTimeSpent = courses.reduce((total, course) => 
      total + course.timeSpent, 0
    );

    // Calculate average quiz score
    const quizScores = courses.flatMap(course => 
      Object.values(course.quizScores).map(result => result.percentage)
    );
    
    if (quizScores.length > 0) {
      userProgress.analytics.averageQuizScore = 
        quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length;
    }

    // Calculate completion rate
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.status === 'completed').length;
    userProgress.analytics.completionRate = totalCourses > 0 ? 
      Math.round((completedCourses / totalCourses) * 100) : 0;
  }

  private isAnswerCorrect(question: any, answer: string): boolean {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(answer);
    }
    return question.correctAnswer === answer;
  }

  // Sample Data Initialization
  private async initializeSampleData(): Promise<void> {
    await this.createSampleCourses();
    this.createSampleResources();
  }

  private async createSampleCourses(): Promise<void> {
    // Family Law Basics Course
    const familyLawCourse: LegalEducationCourse = {
      id: 'family-law-basics',
      title: 'Family Law Fundamentals',
      description: 'Learn the essential concepts of family law including divorce, custody, and support.',
      shortDescription: 'Essential family law concepts for self-represented litigants.',
      duration: '3-4 hours',
      difficulty: 'beginner',
      category: 'family-law',
      stateSpecific: false,
      states: [],
      
      modules: [
        {
          id: 'module-1',
          title: 'Introduction to Family Law',
          description: 'Understanding the basics of family law and court systems.',
          order: 1,
          estimatedTime: 30,
          content: [
            {
              id: 'content-1-1',
              type: 'video',
              title: 'What is Family Law?',
              description: 'Overview of family law concepts and terminology.',
              order: 1,
              data: {
                videoUrl: 'https://example.com/videos/family-law-intro.mp4',
                thumbnail: 'https://example.com/thumbnails/family-law-intro.jpg',
                duration: 600,
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
              id: 'content-1-2',
              type: 'text',
              title: 'Family Law Terminology',
              description: 'Key terms you need to know in family law.',
              order: 2,
              data: {
                content: '# Family Law Terminology\n\n## Key Terms\n\n- **Petitioner**: The person who files a legal action...',
                readingTime: 15,
                format: 'markdown',
                images: [],
                links: []
              },
              isCompleted: false,
              timeSpent: 0,
              bookmarked: false,
              notes: []
            }
          ],
          isCompleted: false,
          timeSpent: 0
        }
      ],
      
      prerequisites: [],
      learningObjectives: [
        'Understand basic family law concepts',
        'Learn key legal terminology',
        'Identify different types of family law cases'
      ],
      
      quizzes: [
        {
          id: 'quiz-1',
          title: 'Family Law Basics Quiz',
          description: 'Test your understanding of family law fundamentals.',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the legal term for the person who files a divorce petition?',
              options: ['Respondent', 'Petitioner', 'Defendant', 'Plaintiff'],
              correctAnswer: 'Petitioner',
              explanation: 'The petitioner is the person who initiates the divorce proceeding.',
              points: 10,
              difficulty: 'easy'
            }
          ],
          passingScore: 70,
          attempts: 3,
          showCorrectAnswers: true,
          feedback: 'Great job! You understand the basics of family law terminology.'
        }
      ],
      
      certificate: {
        available: true,
        requirements: ['Complete all modules', 'Pass final quiz with 70% or higher'],
        validFor: '1 year'
      },
      
      progressTracking: {
        bookmarks: true,
        notes: true,
        timeTracking: true,
        completionCertificate: true
      },
      
      created: '2025-01-01T00:00:00Z',
      updated: '2025-01-01T00:00:00Z',
      verifiedBy: 'Licensed Family Law Attorney',
      tags: ['family-law', 'basics', 'divorce', 'custody'],
      thumbnail: 'https://example.com/thumbnails/family-law-course.jpg',
      isActive: true
    };

    this.courses.set(familyLawCourse.id, familyLawCourse);
    
    // Add the comprehensive courses from sample-courses
    const { SAMPLE_COURSES } = await import('./sample-courses.js');
    SAMPLE_COURSES.forEach(course => {
      this.courses.set(course.id, course);
    });
  }

  private createSampleResources(): void {
    const sampleResource: ResourceItem = {
      id: 'resource-1',
      title: 'Divorce Petition Template - California',
      type: 'template',
      category: 'divorce',
      stateSpecific: true,
      states: ['CA'],
      
      content: {
        downloadUrl: 'https://example.com/templates/ca-divorce-petition.pdf',
        previewUrl: 'https://example.com/previews/ca-divorce-petition.jpg'
      },
      
      tags: ['divorce', 'california', 'template', 'petition'],
      difficulty: 'beginner',
      lastUpdated: '2025-01-01T00:00:00Z',
      verifiedBy: 'California State Bar',
      downloadCount: 1250,
      rating: 4.8,
      reviews: []
    };

    this.resources.set(sampleResource.id, sampleResource);
  }
}

// Export the service
export default KingdomStandEducationService;
