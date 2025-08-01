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
  // Enhanced tracking fields
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  engagementLevel: 'high' | 'medium' | 'low';
  userJourney: string[];
  painPoints: string[];
  decisionStage: 'awareness' | 'consideration' | 'evaluation' | 'decision' | 'unknown';
  preferredCommunicationStyle: 'detailed' | 'concise' | 'visual' | 'technical' | 'spiritual';
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
      userGoals: [],
      sentiment: 'unknown',
      engagementLevel: 'medium',
      userJourney: [],
      painPoints: [],
      decisionStage: 'unknown',
      preferredCommunicationStyle: 'detailed'
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
      
      // Analyze message for enhanced tracking
      this.analyzeMessageForInsights(sessionId, message);
      
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

  private analyzeMessageForInsights(sessionId: string, message: Message): void {
    const memory = this.getMemory(sessionId);
    if (!memory) return;

    const text = message.text.toLowerCase();
    
    // Sentiment analysis
    const positiveWords = ['great', 'amazing', 'love', 'excellent', 'perfect', 'wonderful', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'disappointing', 'frustrated'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      memory.sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      memory.sentiment = 'negative';
    } else {
      memory.sentiment = 'neutral';
    }
    
    // Engagement level analysis
    const messageLength = message.text.length;
    const hasQuestions = text.includes('?') || text.includes('how') || text.includes('what') || text.includes('why');
    const hasSpecificRequests = text.includes('show me') || text.includes('tell me') || text.includes('explain');
    
    if (messageLength > 100 || hasQuestions || hasSpecificRequests) {
      memory.engagementLevel = 'high';
    } else if (messageLength > 50) {
      memory.engagementLevel = 'medium';
    } else {
      memory.engagementLevel = 'low';
    }
    
    // Decision stage analysis
    if (text.includes('price') || text.includes('cost') || text.includes('pricing')) {
      memory.decisionStage = 'evaluation';
    } else if (text.includes('compare') || text.includes('difference') || text.includes('vs')) {
      memory.decisionStage = 'consideration';
    } else if (text.includes('demo') || text.includes('trial') || text.includes('test')) {
      memory.decisionStage = 'decision';
    } else if (text.includes('what') || text.includes('tell me') || text.includes('show me')) {
      memory.decisionStage = 'awareness';
    }
    
    // Communication style preference
    if (text.includes('technical') || text.includes('api') || text.includes('integration')) {
      memory.preferredCommunicationStyle = 'technical';
    } else if (text.includes('biblical') || text.includes('spiritual') || text.includes('faith')) {
      memory.preferredCommunicationStyle = 'spiritual';
    } else if (text.includes('detailed') || text.includes('explain') || text.includes('more')) {
      memory.preferredCommunicationStyle = 'detailed';
    } else if (text.includes('quick') || text.includes('summary') || text.includes('brief')) {
      memory.preferredCommunicationStyle = 'concise';
    }
    
    // Pain points detection
    const painPointKeywords = ['problem', 'issue', 'challenge', 'difficult', 'struggle', 'need help'];
    painPointKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        const context = text.substring(text.indexOf(keyword) - 20, text.indexOf(keyword) + 20);
        if (!memory.painPoints.includes(context.trim())) {
          memory.painPoints.push(context.trim());
        }
      }
    });
    
    // User journey tracking
    if (text.includes('first time') || text.includes('new') || text.includes('discover')) {
      memory.userJourney.push('discovery');
    } else if (text.includes('learn') || text.includes('understand') || text.includes('explore')) {
      memory.userJourney.push('learning');
    } else if (text.includes('compare') || text.includes('evaluate') || text.includes('consider')) {
      memory.userJourney.push('evaluation');
    } else if (text.includes('buy') || text.includes('purchase') || text.includes('sign up')) {
      memory.userJourney.push('purchase');
    }
  }
}

export const conversationManager = ConversationManager.getInstance(); 