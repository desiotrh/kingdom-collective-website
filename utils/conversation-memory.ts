export interface ConversationMemory {
  userId: string;
  sessionId: string;
  currentPage: string;
  userInterests: string[];
  mentionedApps: string[];
  pricingInquiries: boolean;
  demoRequests: boolean;
  leadQualified: boolean;
  conversationHistory: Message[];
  lastInteraction: Date;
  userPersona: 'technical' | 'business' | 'creative' | 'spiritual' | 'general';
  budgetRange: 'low' | 'medium' | 'high' | 'enterprise' | 'unknown';
  conversationTopics: string[];
  followUpQuestions: string[];
  userGoals: string[];
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  context?: {
    page?: string;
    intent?: string;
    entities?: string[];
    topics?: string[];
  };
}

export class ConversationManager {
  private static instance: ConversationManager;
  private memories: Map<string, ConversationMemory> = new Map();

  static getInstance(): ConversationManager {
    if (!ConversationManager.instance) {
      ConversationManager.instance = new ConversationManager();
    }
    return ConversationManager.instance;
  }

  createMemory(userId: string, sessionId: string, currentPage: string): ConversationMemory {
    const memory: ConversationMemory = {
      userId,
      sessionId,
      currentPage,
      userInterests: [],
      mentionedApps: [],
      pricingInquiries: false,
      demoRequests: false,
      leadQualified: false,
      conversationHistory: [],
      lastInteraction: new Date(),
      userPersona: 'general',
      budgetRange: 'unknown',
      conversationTopics: [],
      followUpQuestions: [],
      userGoals: []
    };

    this.memories.set(sessionId, memory);
    this.saveToLocalStorage(sessionId, memory);
    return memory;
  }

  getMemory(sessionId: string): ConversationMemory | null {
    let memory = this.memories.get(sessionId);
    
    if (!memory) {
      memory = this.loadFromLocalStorage(sessionId);
      if (memory) {
        this.memories.set(sessionId, memory);
      }
    }
    
    return memory || null;
  }

  updateMemory(sessionId: string, updates: Partial<ConversationMemory>): void {
    const memory = this.getMemory(sessionId);
    if (memory) {
      Object.assign(memory, updates);
      memory.lastInteraction = new Date();
      this.saveToLocalStorage(sessionId, memory);
    }
  }

  addMessage(sessionId: string, message: Message): void {
    const memory = this.getMemory(sessionId);
    if (memory) {
      memory.conversationHistory.push(message);
      memory.lastInteraction = new Date();
      
      // Keep only last 20 messages to prevent memory bloat
      if (memory.conversationHistory.length > 20) {
        memory.conversationHistory = memory.conversationHistory.slice(-20);
      }
      
      this.saveToLocalStorage(sessionId, memory);
    }
  }

  addConversationTopic(sessionId: string, topic: string): void {
    const memory = this.getMemory(sessionId);
    if (memory && !memory.conversationTopics.includes(topic)) {
      memory.conversationTopics.push(topic);
      this.updateMemory(sessionId, { conversationTopics: memory.conversationTopics });
    }
  }

  addFollowUpQuestion(sessionId: string, question: string): void {
    const memory = this.getMemory(sessionId);
    if (memory && !memory.followUpQuestions.includes(question)) {
      memory.followUpQuestions.push(question);
      this.updateMemory(sessionId, { followUpQuestions: memory.followUpQuestions });
    }
  }

  addUserGoal(sessionId: string, goal: string): void {
    const memory = this.getMemory(sessionId);
    if (memory && !memory.userGoals.includes(goal)) {
      memory.userGoals.push(goal);
      this.updateMemory(sessionId, { userGoals: memory.userGoals });
    }
  }

  updateUserPersona(sessionId: string, persona: ConversationMemory['userPersona']): void {
    this.updateMemory(sessionId, { userPersona: persona });
  }

  updateBudgetRange(sessionId: string, budget: ConversationMemory['budgetRange']): void {
    this.updateMemory(sessionId, { budgetRange: budget });
  }

  addUserInterest(sessionId: string, interest: string): void {
    const memory = this.getMemory(sessionId);
    if (memory && !memory.userInterests.includes(interest)) {
      memory.userInterests.push(interest);
      this.updateMemory(sessionId, { userInterests: memory.userInterests });
    }
  }

  addMentionedApp(sessionId: string, appId: string): void {
    const memory = this.getMemory(sessionId);
    if (memory && !memory.mentionedApps.includes(appId)) {
      memory.mentionedApps.push(appId);
      this.updateMemory(sessionId, { mentionedApps: memory.mentionedApps });
    }
  }

  updateCurrentPage(sessionId: string, page: string): void {
    this.updateMemory(sessionId, { currentPage: page });
  }

  qualifyLead(sessionId: string): void {
    this.updateMemory(sessionId, { leadQualified: true });
  }

  getConversationContext(sessionId: string): {
    userPersona: string;
    budgetRange: string;
    interests: string[];
    mentionedApps: string[];
    currentPage: string;
    topics: string[];
    goals: string[];
    recentMessages: string[];
  } {
    const memory = this.getMemory(sessionId);
    if (!memory) {
      return {
        userPersona: 'general',
        budgetRange: 'unknown',
        interests: [],
        mentionedApps: [],
        currentPage: '/',
        topics: [],
        goals: [],
        recentMessages: []
      };
    }

    // Get last 5 messages for context
    const recentMessages = memory.conversationHistory
      .slice(-5)
      .map(msg => msg.text);

    return {
      userPersona: memory.userPersona,
      budgetRange: memory.budgetRange,
      interests: memory.userInterests,
      mentionedApps: memory.mentionedApps,
      currentPage: memory.currentPage,
      topics: memory.conversationTopics,
      goals: memory.userGoals,
      recentMessages
    };
  }

  getConversationSummary(sessionId: string): {
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    topicsDiscussed: string[];
    appsMentioned: string[];
    userInterests: string[];
    conversationDuration: number;
  } {
    const memory = this.getMemory(sessionId);
    if (!memory) {
      return {
        totalMessages: 0,
        userMessages: 0,
        botMessages: 0,
        topicsDiscussed: [],
        appsMentioned: [],
        userInterests: [],
        conversationDuration: 0
      };
    }

    const userMessages = memory.conversationHistory.filter(msg => msg.isUser).length;
    const botMessages = memory.conversationHistory.filter(msg => !msg.isUser).length;
    const conversationDuration = memory.conversationHistory.length > 0 
      ? new Date().getTime() - memory.conversationHistory[0].timestamp.getTime()
      : 0;

    return {
      totalMessages: memory.conversationHistory.length,
      userMessages,
      botMessages,
      topicsDiscussed: memory.conversationTopics,
      appsMentioned: memory.mentionedApps,
      userInterests: memory.userInterests,
      conversationDuration
    };
  }

  private saveToLocalStorage(sessionId: string, memory: ConversationMemory): void {
    try {
      localStorage.setItem(`kingdom-conversation-${sessionId}`, JSON.stringify(memory));
    } catch (error) {
      console.warn('Failed to save conversation to localStorage:', error);
    }
  }

  private loadFromLocalStorage(sessionId: string): ConversationMemory | null {
    try {
      const stored = localStorage.getItem(`kingdom-conversation-${sessionId}`);
      if (stored) {
        const memory = JSON.parse(stored);
        memory.lastInteraction = new Date(memory.lastInteraction);
        memory.conversationHistory = memory.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        return memory;
      }
    } catch (error) {
      console.warn('Failed to load conversation from localStorage:', error);
    }
    return null;
  }

  clearMemory(sessionId: string): void {
    this.memories.delete(sessionId);
    try {
      localStorage.removeItem(`kingdom-conversation-${sessionId}`);
    } catch (error) {
      console.warn('Failed to clear conversation from localStorage:', error);
    }
  }
}

export const conversationManager = ConversationManager.getInstance(); 