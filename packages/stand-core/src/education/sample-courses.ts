// Legal Education Hub - Sample Course Data
// Comprehensive family law courses for all major states

import { LegalEducationCourse, CourseCategory } from './types.js';

export const SAMPLE_COURSES: LegalEducationCourse[] = [
  // Family Law Fundamentals (Universal)
  {
    id: 'family-law-fundamentals',
    title: 'Family Law Fundamentals',
    description: 'Master the essential concepts of family law including divorce, custody, support, and property division. Perfect for beginners starting their legal journey.',
    shortDescription: 'Essential family law concepts for self-represented litigants.',
    duration: '4-5 hours',
    difficulty: 'beginner',
    category: 'family-law' as CourseCategory,
    stateSpecific: false,
    states: [],
    
    modules: [
      {
        id: 'module-fundamentals-1',
        title: 'Introduction to Family Law',
        description: 'Understanding the basics of family law and court systems.',
        order: 1,
        estimatedTime: 45,
        content: [
          {
            id: 'content-fund-1-1',
            type: 'video',
            title: 'What is Family Law?',
            description: 'Overview of family law concepts and terminology.',
            order: 1,
            data: {
              videoUrl: '/education/videos/family-law-intro.mp4',
              thumbnail: '/education/thumbnails/family-law-intro.jpg',
              duration: 900, // 15 minutes
              transcript: 'Family law encompasses all legal matters related to family relationships, including marriage, divorce, child custody, and support. Understanding these concepts is crucial for anyone representing themselves in court.',
              quality: '720p',
              downloadable: true
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          },
          {
            id: 'content-fund-1-2',
            type: 'text',
            title: 'Family Law Terminology',
            description: 'Key terms you need to know in family law.',
            order: 2,
            data: {
              content: `# Family Law Terminology

## Essential Terms

### Parties in Family Law Cases
- **Petitioner**: The person who files a legal action (like divorce)
- **Respondent**: The person who responds to the legal action
- **Plaintiff**: Another term for petitioner (used in some states)
- **Defendant**: Another term for respondent (used in some states)

### Key Legal Concepts
- **Jurisdiction**: The court's authority to hear your case
- **Residency**: The legal requirement to live in a state before filing
- **Service**: The legal process of delivering court papers to the other party
- **Discovery**: The process of gathering information and evidence

### Child-Related Terms
- **Custody**: Legal responsibility for a child's care and decision-making
- **Visitation**: The right to spend time with a child
- **Child Support**: Financial support paid for a child's care
- **Best Interests**: The legal standard used to make decisions about children

### Property Terms
- **Marital Property**: Property acquired during marriage
- **Separate Property**: Property owned before marriage or acquired by gift/inheritance
- **Equitable Distribution**: Fair division of marital property
- **Community Property**: Property jointly owned by spouses (in community property states)`,
              readingTime: 20,
              format: 'markdown',
              images: ['/education/images/family-law-terms-diagram.png'],
              links: [
                {
                  title: 'State-Specific Terminology Guide',
                  url: '/resources/terminology-guides',
                  description: 'Detailed terminology guides for each state',
                  type: 'reference'
                }
              ]
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          },
          {
            id: 'content-fund-1-3',
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
              hints: ['Think about who starts vs. responds to legal actions', 'Consider what gives a court power to make decisions'],
              feedback: ['Correct! The petitioner initiates the legal action.', 'Right! Jurisdiction is about the court\'s authority.']
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          }
        ],
        isCompleted: false,
        timeSpent: 0
      },
      {
        id: 'module-fundamentals-2',
        title: 'Understanding Divorce',
        description: 'Learn about different types of divorce and the divorce process.',
        order: 2,
        estimatedTime: 60,
        content: [
          {
            id: 'content-fund-2-1',
            type: 'video',
            title: 'Types of Divorce',
            description: 'Understanding contested vs. uncontested divorce.',
            order: 1,
            data: {
              videoUrl: '/education/videos/types-of-divorce.mp4',
              thumbnail: '/education/thumbnails/types-of-divorce.jpg',
              duration: 1200, // 20 minutes
              transcript: 'There are two main types of divorce: uncontested and contested. Understanding the difference is crucial for planning your case strategy.',
              quality: '720p',
              downloadable: true
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          },
          {
            id: 'content-fund-2-2',
            type: 'interactive',
            title: 'Divorce Process Timeline',
            description: 'Interactive timeline showing the typical divorce process.',
            order: 2,
            data: {
              type: 'timeline',
              data: {
                steps: [
                  { step: 1, title: 'File Petition', description: 'Submit divorce petition to court', duration: '1-3 days' },
                  { step: 2, title: 'Serve Respondent', description: 'Legally deliver papers to spouse', duration: '1-30 days' },
                  { step: 3, title: 'Response Period', description: 'Spouse has time to respond', duration: '20-30 days' },
                  { step: 4, title: 'Discovery', description: 'Exchange information and documents', duration: '2-6 months' },
                  { step: 5, title: 'Negotiation', description: 'Try to reach settlement agreement', duration: '1-3 months' },
                  { step: 6, title: 'Trial', description: 'Court hearing if no settlement', duration: '1-3 days' }
                ]
              },
              instructions: 'Arrange the divorce process steps in the correct order.',
              hints: ['Legal action must be filed first', 'Service must happen before response period', 'Discovery comes before negotiation'],
              feedback: ['Perfect! You understand the divorce process flow.']
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
      'Understand basic family law concepts and terminology',
      'Identify different types of divorce and their implications',
      'Learn the typical divorce process timeline',
      'Recognize key legal terms used in family court'
    ],
    
    quizzes: [
      {
        id: 'quiz-fundamentals-1',
        title: 'Family Law Basics Quiz',
        description: 'Test your understanding of family law fundamentals.',
        questions: [
          {
            id: 'q-fund-1',
            type: 'multiple-choice',
            question: 'What is the legal term for the person who files a divorce petition?',
            options: ['Respondent', 'Petitioner', 'Defendant', 'Plaintiff'],
            correctAnswer: 'Petitioner',
            explanation: 'The petitioner is the person who initiates the divorce proceeding by filing the petition.',
            points: 10,
            difficulty: 'easy'
          },
          {
            id: 'q-fund-2',
            type: 'true-false',
            question: 'Jurisdiction refers to the court\'s authority to hear and decide a case.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Correct! Jurisdiction is the legal authority of a court to hear and decide a case.',
            points: 10,
            difficulty: 'easy'
          },
          {
            id: 'q-fund-3',
            type: 'scenario',
            question: 'Sarah wants to file for divorce in California but her husband lives in Texas. Can she file in California?',
            options: [
              'Yes, she can always file where she lives',
              'No, she must file where her husband lives',
              'It depends on how long she has lived in California',
              'She can file in either state'
            ],
            correctAnswer: 'It depends on how long she has lived in California',
            explanation: 'Most states require residency for a certain period (usually 6 months to 1 year) before you can file for divorce there.',
            points: 15,
            difficulty: 'medium'
          }
        ],
        passingScore: 70,
        attempts: 3,
        showCorrectAnswers: true,
        feedback: 'Excellent work! You have a solid understanding of family law fundamentals.'
      }
    ],
    
    certificate: {
      available: true,
      requirements: ['Complete all modules', 'Pass quiz with 70% or higher'],
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
    tags: ['family-law', 'basics', 'divorce', 'terminology'],
    thumbnail: '/education/thumbnails/family-law-fundamentals.jpg',
    isActive: true
  },

  // California-Specific Family Law Course
  {
    id: 'california-family-law',
    title: 'California Family Law: Complete Guide',
    description: 'Comprehensive guide to family law in California, covering divorce, custody, support, and property division under California law.',
    shortDescription: 'Complete family law guide for California residents.',
    duration: '6-8 hours',
    difficulty: 'intermediate',
    category: 'family-law' as CourseCategory,
    stateSpecific: true,
    states: ['CA'],
    
    modules: [
      {
        id: 'module-ca-1',
        title: 'California Divorce Process',
        description: 'Step-by-step guide to filing for divorce in California.',
        order: 1,
        estimatedTime: 90,
        content: [
          {
            id: 'content-ca-1-1',
            type: 'video',
            title: 'California Divorce Requirements',
            description: 'Learn the residency and filing requirements for California divorce.',
            order: 1,
            data: {
              videoUrl: '/education/videos/ca-divorce-requirements.mp4',
              thumbnail: '/education/thumbnails/ca-divorce-requirements.jpg',
              duration: 1800, // 30 minutes
              transcript: 'California has specific requirements for filing divorce, including residency requirements and waiting periods.',
              quality: '720p',
              downloadable: true
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          },
          {
            id: 'content-ca-1-2',
            type: 'document',
            title: 'California Divorce Forms',
            description: 'Complete guide to California divorce forms and filing procedures.',
            order: 2,
            data: {
              documentUrl: '/education/documents/ca-divorce-forms-guide.pdf',
              documentType: 'PDF Guide',
              downloadUrl: '/education/downloads/ca-divorce-forms-guide.pdf',
              previewUrl: '/education/previews/ca-divorce-forms-guide.jpg',
              instructions: 'This guide covers all required forms for filing divorce in California, including the FL-100 petition, FL-110 response, and supporting documents.',
              template: false
            },
            isCompleted: false,
            timeSpent: 0,
            bookmarked: false,
            notes: []
          }
        ],
        isCompleted: false,
        timeSpent: 0
      },
      {
        id: 'module-ca-2',
        title: 'California Child Custody Laws',
        description: 'Understanding custody laws and the best interests standard in California.',
        order: 2,
        estimatedTime: 75,
        content: [
          {
            id: 'content-ca-2-1',
            type: 'text',
            title: 'California Custody Laws',
            description: 'Detailed explanation of California custody laws and factors.',
            order: 1,
            data: {
              content: `# California Child Custody Laws

## Types of Custody in California

### Legal Custody
Legal custody refers to the right and responsibility to make important decisions about your child's life, including:
- Education and schooling
- Healthcare and medical decisions
- Religious upbringing
- Extracurricular activities

### Physical Custody
Physical custody refers to where the child lives and the right to have the child in your care.

## Custody Arrangements

### Joint Legal Custody
Both parents share decision-making authority, even if the child lives primarily with one parent.

### Sole Legal Custody
One parent has the exclusive right to make major decisions for the child.

### Joint Physical Custody
The child spends significant time with both parents, though not necessarily equal time.

### Sole Physical Custody
The child lives primarily with one parent, with the other parent having visitation rights.

## Best Interests Factors

California courts consider the following factors when determining custody:

1. **Child's Health, Safety, and Welfare**: The court's primary concern
2. **History of Abuse**: Any history of domestic violence or child abuse
3. **Substance Abuse**: Any history of alcohol or drug abuse
4. **Mental and Physical Health**: Of both parents and the child
5. **Child's Wishes**: If the child is mature enough to express preferences
6. **Parental Cooperation**: Ability of parents to work together
7. **Stability**: Continuity and stability of the child's environment
8. **Parent-Child Relationship**: The nature and quality of each parent's relationship with the child`,
              readingTime: 25,
              format: 'markdown',
              images: ['/education/images/ca-custody-factors-diagram.png'],
              links: [
                {
                  title: 'California Family Code Section 3011',
                  url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=3011',
                  description: 'Official California law on child custody factors',
                  type: 'statute'
                }
              ]
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
    
    prerequisites: ['family-law-fundamentals'],
    learningObjectives: [
      'Understand California-specific divorce requirements and procedures',
      'Learn California child custody laws and best interests factors',
      'Master California child support calculation guidelines',
      'Understand California community property laws'
    ],
    
    quizzes: [
      {
        id: 'quiz-ca-1',
        title: 'California Family Law Quiz',
        description: 'Test your knowledge of California family law.',
        questions: [
          {
            id: 'q-ca-1',
            type: 'multiple-choice',
            question: 'How long must you live in California before you can file for divorce?',
            options: ['3 months', '6 months', '1 year', '2 years'],
            correctAnswer: '6 months',
            explanation: 'California requires you to live in the state for at least 6 months before filing for divorce.',
            points: 15,
            difficulty: 'medium'
          },
          {
            id: 'q-ca-2',
            type: 'scenario',
            question: 'In California, what is the primary factor courts consider when determining child custody?',
            options: [
              'The child\'s preference',
              'The parent\'s financial situation',
              'The child\'s health, safety, and welfare',
              'The parent\'s work schedule'
            ],
            correctAnswer: 'The child\'s health, safety, and welfare',
            explanation: 'California courts prioritize the child\'s health, safety, and welfare above all other factors.',
            points: 20,
            difficulty: 'medium'
          }
        ],
        passingScore: 75,
        attempts: 3,
        showCorrectAnswers: true,
        feedback: 'Great job! You understand California family law principles.'
      }
    ],
    
    certificate: {
      available: true,
      requirements: ['Complete all modules', 'Pass quiz with 75% or higher', 'Complete practical exercises'],
      validFor: '2 years'
    },
    
    progressTracking: {
      bookmarks: true,
      notes: true,
      timeTracking: true,
      completionCertificate: true
    },
    
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
    verifiedBy: 'California Licensed Family Law Attorney',
    tags: ['california', 'family-law', 'divorce', 'custody', 'support'],
    thumbnail: '/education/thumbnails/california-family-law.jpg',
    isActive: true
  },

  // Document Preparation Course
  {
    id: 'document-preparation',
    title: 'Legal Document Preparation',
    description: 'Learn how to prepare, complete, and file legal documents correctly. Includes templates, examples, and step-by-step guidance.',
    shortDescription: 'Master legal document preparation and filing.',
    duration: '5-6 hours',
    difficulty: 'intermediate',
    category: 'document-preparation' as CourseCategory,
    stateSpecific: false,
    states: [],
    
    modules: [
      {
        id: 'module-doc-1',
        title: 'Understanding Legal Documents',
        description: 'Learn the different types of legal documents and their purposes.',
        order: 1,
        estimatedTime: 45,
        content: [
          {
            id: 'content-doc-1-1',
            type: 'video',
            title: 'Types of Legal Documents',
            description: 'Overview of different legal documents used in family law cases.',
            order: 1,
            data: {
              videoUrl: '/education/videos/legal-document-types.mp4',
              thumbnail: '/education/thumbnails/legal-document-types.jpg',
              duration: 1200, // 20 minutes
              transcript: 'Legal documents serve different purposes in family law cases. Understanding their roles helps you prepare them correctly.',
              quality: '720p',
              downloadable: true
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
    
    prerequisites: ['family-law-fundamentals'],
    learningObjectives: [
      'Identify different types of legal documents and their purposes',
      'Learn proper formatting and completion techniques',
      'Understand filing requirements and procedures',
      'Master document organization and management'
    ],
    
    quizzes: [
      {
        id: 'quiz-doc-1',
        title: 'Document Preparation Quiz',
        description: 'Test your understanding of legal document preparation.',
        questions: [
          {
            id: 'q-doc-1',
            type: 'multiple-choice',
            question: 'What is the primary purpose of a divorce petition?',
            options: [
              'To request child support',
              'To initiate divorce proceedings',
              'To request spousal support',
              'To divide property'
            ],
            correctAnswer: 'To initiate divorce proceedings',
            explanation: 'A divorce petition is the initial document that starts the divorce process.',
            points: 15,
            difficulty: 'easy'
          }
        ],
        passingScore: 70,
        attempts: 3,
        showCorrectAnswers: true,
        feedback: 'Excellent! You understand the basics of legal document preparation.'
      }
    ],
    
    certificate: {
      available: true,
      requirements: ['Complete all modules', 'Pass quiz with 70% or higher', 'Complete document exercises'],
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
    verifiedBy: 'Licensed Legal Document Preparer',
    tags: ['documents', 'forms', 'filing', 'preparation'],
    thumbnail: '/education/thumbnails/document-preparation.jpg',
    isActive: true
  }
];

export default SAMPLE_COURSES;
