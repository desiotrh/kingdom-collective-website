import { kingdomCollective, getAppByPage, getRecommendedApps } from './kingdom-knowledge';
import { conversationManager, ConversationMemory } from './conversation-memory';

export interface ResponseContext {
  currentPage: string;
  userPersona: string;
  budgetRange: string;
  interests: string[];
  mentionedApps: string[];
  conversationHistory: any[];
}

export class AIResponseGenerator {
  private static instance: AIResponseGenerator;

  static getInstance(): AIResponseGenerator {
    if (!AIResponseGenerator.instance) {
      AIResponseGenerator.instance = new AIResponseGenerator();
    }
    return AIResponseGenerator.instance;
  }

  generateResponse(
    userInput: string,
    sessionId: string,
    currentPage: string = '/'
  ): string {
    const memory = conversationManager.getMemory(sessionId);
    const context = this.buildContext(memory, currentPage);
    
    // Update current page in memory
    conversationManager.updateCurrentPage(sessionId, currentPage);
    
    // Analyze user input and update memory
    this.analyzeUserInput(userInput, sessionId, context);
    
    // Generate contextual response with biblical foundation
    return this.generateContextualResponse(userInput, context);
  }

  private buildContext(memory: ConversationMemory | null, currentPage: string): ResponseContext {
    if (!memory) {
      return {
        currentPage,
        userPersona: 'general',
        budgetRange: 'unknown',
        interests: [],
        mentionedApps: [],
        conversationHistory: []
      };
    }

    return {
      currentPage: memory.currentPage,
      userPersona: memory.userPersona,
      budgetRange: memory.budgetRange,
      interests: memory.userInterests,
      mentionedApps: memory.mentionedApps,
      conversationHistory: memory.conversationHistory
    };
  }

  private analyzeUserInput(userInput: string, sessionId: string, context: ResponseContext): void {
    const input = userInput.toLowerCase();
    
    // Detect user persona with biblical wisdom
    if (input.includes('technical') || input.includes('api') || input.includes('integration')) {
      conversationManager.updateUserPersona(sessionId, 'technical');
    } else if (input.includes('business') || input.includes('roi') || input.includes('revenue')) {
      conversationManager.updateUserPersona(sessionId, 'business');
    } else if (input.includes('creative') || input.includes('design') || input.includes('visual')) {
      conversationManager.updateUserPersona(sessionId, 'creative');
    } else if (input.includes('spiritual') || input.includes('purpose') || input.includes('meaning') || 
               input.includes('god') || input.includes('biblical') || input.includes('faith')) {
      conversationManager.updateUserPersona(sessionId, 'spiritual');
    }

    // Detect budget range with stewardship principles
    if (input.includes('budget') || input.includes('cost') || input.includes('price')) {
      if (input.includes('low') || input.includes('cheap') || input.includes('affordable')) {
        conversationManager.updateBudgetRange(sessionId, 'low');
      } else if (input.includes('enterprise') || input.includes('large') || input.includes('corporate')) {
        conversationManager.updateBudgetRange(sessionId, 'enterprise');
      } else if (input.includes('premium') || input.includes('high-end')) {
        conversationManager.updateBudgetRange(sessionId, 'high');
      } else {
        conversationManager.updateBudgetRange(sessionId, 'medium');
      }
    }

    // Detect app interests
    kingdomCollective.apps.forEach(app => {
      if (input.includes(app.name.toLowerCase()) || input.includes(app.id.replace('-', ' '))) {
        conversationManager.addMentionedApp(sessionId, app.id);
      }
    });

    // Detect general interests with biblical alignment
    const interests = ['productivity', 'community', 'video', 'ar', 'business', 'creativity', 'voice', 'faith', 'purpose', 'stewardship'];
    interests.forEach(interest => {
      if (input.includes(interest)) {
        conversationManager.addUserInterest(sessionId, interest);
      }
    });
  }

  private generateContextualResponse(userInput: string, context: ResponseContext): string {
    const input = userInput.toLowerCase();
    const currentApp = getAppByPage(context.currentPage);
    
    // Page-specific greetings with biblical foundation
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return this.generatePageSpecificGreeting(context, currentApp);
    }

    // Pricing inquiries with stewardship principles
    if (input.includes('pricing') || input.includes('cost') || input.includes('price') || input.includes('how much')) {
      return this.generatePricingResponse(context, currentApp);
    }

    // Feature inquiries with purpose-driven approach
    if (input.includes('feature') || input.includes('what') || input.includes('include') || input.includes('do')) {
      return this.generateFeatureResponse(context, currentApp);
    }

    // Demo requests with integrity
    if (input.includes('demo') || input.includes('show') || input.includes('example') || input.includes('see')) {
      return this.generateDemoResponse(context, currentApp);
    }

    // App comparisons with unity principles
    if (input.includes('compare') || input.includes('difference') || input.includes('vs')) {
      return this.generateComparisonResponse(context);
    }

    // General questions about Kingdom Collective with biblical foundation
    if (input.includes('kingdom') || input.includes('company') || input.includes('about')) {
      return this.generateCompanyResponse(context);
    }

    // Recommendation requests with wisdom
    if (input.includes('recommend') || input.includes('suggest') || input.includes('which')) {
      return this.generateRecommendationResponse(context);
    }

    // Biblical or spiritual questions
    if (input.includes('biblical') || input.includes('spiritual') || input.includes('faith') || 
        input.includes('god') || input.includes('christian') || input.includes('purpose')) {
      return this.generateBiblicalResponse(context, currentApp);
    }

    // Default response with biblical wisdom
    return this.generateDefaultResponse(context, currentApp);
  }

  private generatePageSpecificGreeting(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `Welcome to ${currentApp.name}! 🔥 I'm your Kingdom Collective assistant, grounded in biblical truth and committed to helping you discover how ${currentApp.name} can transform your ${currentApp.targetAudience[0]?.toLowerCase() || 'work'} while honoring God. What would you like to know about ${currentApp.name}?`;
    }
    
    return "Hello! I'm your Kingdom Collective assistant. 🔥 I'm here to help you discover our innovative apps that combine cutting-edge technology with timeless biblical wisdom. We believe in doing everything for God's glory while serving others. What can I help you with today?";
  }

  private generatePricingResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `Great question! ${currentApp.name} offers flexible pricing designed with stewardship in mind:\n\n• Basic: ${currentApp.pricing.basic}\n• Premium: ${currentApp.pricing.premium}\n• Enterprise: ${currentApp.pricing.enterprise}\n\nWe believe in fair pricing that reflects the value we provide while being good stewards of your resources. We also offer bundle pricing if you're interested in multiple Kingdom apps. What's your budget range?`;
    }

    return `Kingdom Collective offers flexible pricing across all our apps, designed with biblical stewardship principles:\n\n• Individual apps: ${kingdomCollective.pricing.individual}\n• Complete bundle: ${kingdomCollective.pricing.bundle}\n• Enterprise solutions: ${kingdomCollective.pricing.enterprise}\n\nWe believe in providing excellent value while being good stewards of your resources. Which specific app are you interested in, or would you like to hear about our bundle pricing?`;
  }

  private generateFeatureResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      const features = currentApp.features.slice(0, 4).join(', ');
      return `${currentApp.name} delivers powerful features including ${features}. Our platform is designed to ${currentApp.benefits[0]?.toLowerCase()} while maintaining biblical integrity. Every feature is built with purpose and excellence in mind. Would you like me to show you a demo or explain any specific feature in detail?`;
    }

    return `Each Kingdom app is packed with innovative features designed with biblical wisdom! For example:\n\n• Kingdom Voice: AI-powered voice recognition with wholesome communication standards\n• Kingdom Circle: Community building tools that foster authentic relationships\n• Kingdom Lens: AR visualization that helps you see beauty in God's creation\n• Kingdom Clips: AI-powered video editing that promotes uplifting content\n• Kingdom Launchpad: Business planning with ethical practices guidance\n• Kingdom Studios: Professional design tools for creative excellence\n\nWhich app's features interest you most?`;
  }

  private generateDemoResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `Absolutely! I'd love to show you ${currentApp.name} in action. We have live demos available that showcase ${currentApp.useCases[0]?.toLowerCase()} while demonstrating our commitment to biblical principles. Would you like me to schedule a personalized demo, or would you prefer to see some case studies first?`;
    }

    return `I'd be happy to show you demos of any Kingdom app! We have interactive demos, case studies, and success stories that demonstrate real-world impact while honoring God. Each demo showcases how our technology serves a higher purpose. Which app would you like to see in action first?`;
  }

  private generateComparisonResponse(context: ResponseContext): string {
    const mentionedApps = context.mentionedApps;
    if (mentionedApps.length >= 2) {
      const app1 = kingdomCollective.apps.find(app => app.id === mentionedApps[0]);
      const app2 = kingdomCollective.apps.find(app => app.id === mentionedApps[1]);
      
      if (app1 && app2) {
        return `Great question! ${app1.name} focuses on ${app1.description.toLowerCase()}, while ${app2.name} specializes in ${app2.description.toLowerCase()}. Both integrate seamlessly within our ecosystem, reflecting the biblical principle of unity in diversity. Would you like to see how they work together?`;
      }
    }

    return `Each Kingdom app is designed for specific use cases, but they all work together seamlessly, reflecting the biblical principle of unity in the body of Christ. For example, you could use Kingdom Voice for hands-free control while creating content with Kingdom Clips, then share it through Kingdom Circle. Which apps are you comparing?`;
  }

  private generateCompanyResponse(context: ResponseContext): string {
    return `Kingdom Collective is on a mission to ${kingdomCollective.mission.toLowerCase()}. We believe in ${kingdomCollective.values[0]?.toLowerCase()} and creating technology that serves a higher purpose. Our biblical foundation guides everything we do - from ${kingdomCollective.biblicalFoundation[0]?.toLowerCase()} to ${kingdomCollective.biblicalFoundation[1]?.toLowerCase()}. Our ecosystem of 6 innovative apps helps individuals and businesses achieve their highest potential while honoring God. What aspect of our company would you like to learn more about?`;
  }

  private generateRecommendationResponse(context: ResponseContext): string {
    const recommendations = getRecommendedApps(context.interests);
    
    if (recommendations.length > 0) {
      const app = recommendations[0];
      return `Based on your interests, I'd highly recommend ${app.name}! It's perfect for ${app.useCases[0]?.toLowerCase()} and can help you ${app.benefits[0]?.toLowerCase()} while maintaining biblical principles. ${app.biblicalPrinciples[0]?.toLowerCase()}. Would you like to learn more about ${app.name}?`;
    }

    return `I'd love to recommend the perfect Kingdom app for your needs! Could you tell me a bit more about what you're looking to achieve? For example, are you focused on productivity, community building, content creation, business growth, or spiritual development? We believe every tool should serve God's purposes.`;
  }

  private generateBiblicalResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `I'm glad you asked about the biblical foundation of ${currentApp.name}! ${currentApp.biblicalPrinciples[0]?.toLowerCase()}. Our app is designed to help you ${currentApp.benefits[0]?.toLowerCase()} while honoring God. We believe technology should serve God's purposes and help us fulfill our calling. Would you like to know more about how ${currentApp.name} aligns with biblical principles?`;
    }

    return `I'm excited to share our biblical foundation! Kingdom Collective is built on timeless biblical wisdom. ${kingdomCollective.biblicalFoundation[0]?.toLowerCase()}. We believe in ${kingdomCollective.biblicalFoundation[1]?.toLowerCase()}. Every app we create is designed to help you serve God and others while achieving excellence. What specific aspect of our biblical approach interests you?`;
  }

  private generateDefaultResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `That's a great question about ${currentApp.name}! ${currentApp.description} It's designed to help you ${currentApp.benefits[0]?.toLowerCase()} while maintaining biblical integrity. We believe in doing everything for God's glory. Would you like to know more about pricing, features, or see a demo?`;
    }

    return `I'm here to help you discover the perfect Kingdom app for your needs! Each of our 6 apps is designed to solve specific challenges while working together as a complete ecosystem. We believe in combining innovation with biblical wisdom to serve God's purposes. What are you looking to accomplish?`;
  }
}

export const aiResponseGenerator = AIResponseGenerator.getInstance(); 