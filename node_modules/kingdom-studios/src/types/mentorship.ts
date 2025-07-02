// Mentorship System Types for Kingdom Studios

export interface MentorProfile {
  id: string;
  userId: string;
  displayName: string;
  profileImage?: string;
  isActive: boolean;
  categories: MentorshipCategory[];
  bio: string;
  experience: string;
  giftings: string[];
  availability: {
    days: string[];
    timeZone: string;
    preferredTimes: string[];
  };
  rating: number;
  totalMentees: number;
  totalSessions: number;
  specialties: string[];
  testimonials: Testimonial[];
  joinedDate: string;
  lastActive: string;
  faithMode: boolean;
  contactPreference: 'chat' | 'email' | 'video' | 'phone';
}

export interface MentorshipCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  faithBased: boolean;
}

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  category: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  updatedAt: string;
  sessionType: 'one-time' | 'ongoing' | 'course';
  urgency: 'low' | 'medium' | 'high';
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  menteeId: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'chat' | 'video' | 'phone' | 'email';
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  fromUserId: string;
  fromUserName: string;
  rating: number;
  message: string;
  category: string;
  createdAt: string;
  isPublic: boolean;
}

export interface DiscipleshipPathway {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  mentorId?: string;
  lessons: DiscipleshipLesson[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  faithBased: boolean;
  tags: string[];
}

export interface DiscipleshipLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  resources: string[];
  order: number;
  estimatedTime: string;
  completed?: boolean;
}

export interface MenteeProfile {
  id: string;
  userId: string;
  interests: string[];
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferredMentorshipStyle: 'structured' | 'casual' | 'intensive';
  needsAssessment: {
    spiritual: number;
    creative: number;
    business: number;
    technical: number;
    personal: number;
  };
  currentMentors: string[];
  completedPathways: string[];
  joinedDate: string;
  faithMode: boolean;
}

export const MENTORSHIP_CATEGORIES: MentorshipCategory[] = [
  {
    id: 'faith-journey',
    name: 'Faith Journey',
    icon: '🌱',
    description: 'Spiritual growth, prayer, and walking with God',
    faithBased: true,
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    icon: '🎥',
    description: 'Video, writing, and creative content strategies',
    faithBased: false,
  },
  {
    id: 'business-growth',
    name: 'Business Growth',
    icon: '📈',
    description: 'Monetization, scaling, and entrepreneurship',
    faithBased: false,
  },
  {
    id: 'healing-deliverance',
    name: 'Healing & Deliverance',
    icon: '🧠',
    description: 'Inner healing, breaking strongholds, and freedom',
    faithBased: true,
  },
  {
    id: 'bible-basics',
    name: 'Bible Basics',
    icon: '✝️',
    description: 'Scripture study, theology, and biblical foundations',
    faithBased: true,
  },
  {
    id: 'accountability',
    name: 'Accountability',
    icon: '🤝',
    description: 'Consistent growth and staying on track',
    faithBased: true,
  },
  {
    id: 'tech-help',
    name: 'Tech Help',
    icon: '💻',
    description: 'Technical assistance and digital tools',
    faithBased: false,
  },
  {
    id: 'branding',
    name: 'Branding',
    icon: '💡',
    description: 'Brand identity, messaging, and positioning',
    faithBased: false,
  },
];
