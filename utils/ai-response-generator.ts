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
    
    // Enhanced greeting responses with biblical wisdom
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('greetings')) {
      return this.generatePageSpecificGreeting(context, currentApp);
    }
    
    // Pricing inquiries with stewardship principles
    if (input.includes('price') || input.includes('cost') || input.includes('pricing') || input.includes('budget')) {
      return this.generatePricingResponse(context, currentApp);
    }
    
    // Feature inquiries with purpose-driven responses
    if (input.includes('feature') || input.includes('what can') || input.includes('how does') || input.includes('capability')) {
      return this.generateFeatureResponse(context, currentApp);
    }
    
    // Demo requests with kingdom purpose
    if (input.includes('demo') || input.includes('show me') || input.includes('example') || input.includes('trial')) {
      return this.generateDemoResponse(context, currentApp);
    }
    
    // App comparisons with wisdom
    if (input.includes('compare') || input.includes('difference') || input.includes('vs') || input.includes('versus')) {
      return this.generateComparisonResponse(context);
    }
    
    // Company information with biblical foundation
    if (input.includes('company') || input.includes('about') || input.includes('who') || input.includes('team')) {
      return this.generateCompanyResponse(context);
    }
    
    // Recommendations with spiritual discernment
    if (input.includes('recommend') || input.includes('suggest') || input.includes('best') || input.includes('which')) {
      return this.generateRecommendationResponse(context);
    }
    
    // Biblical wisdom and spiritual guidance
    if (input.includes('biblical') || input.includes('scripture') || input.includes('god') || input.includes('faith') || 
        input.includes('purpose') || input.includes('meaning') || input.includes('spiritual')) {
      return this.generateBiblicalResponse(context, currentApp);
    }
    
    // Default response with enhanced engagement
    return this.generateDefaultResponse(context, currentApp);
  }

  private generatePageSpecificGreeting(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🔥 Welcome to ${currentApp.name}! As it says in Proverbs 3:6, "In all your ways acknowledge Him, and He will make your paths straight." 

${currentApp.description}

${currentApp.biblicalPrinciples ? `✨ Biblical Foundation: ${currentApp.biblicalPrinciples}` : ''}

How can I help you discover how ${currentApp.name} can serve God's purpose in your life?`;
    }
    
    return `🔥 Greetings! I am your Kingdom Collective assistant, standing firm in biblical truth. 

As we explore our innovative apps together, remember that "Every good and perfect gift is from above" (James 1:17). Technology, when used with wisdom and purpose, can be a powerful tool for God's kingdom.

What would you like to explore today?`;
  }

  private generatePricingResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `💰 **${currentApp.name} Pricing** - Grounded in Stewardship

${currentApp.pricing ? currentApp.pricing : 'Contact us for personalized pricing that aligns with your mission and budget.'}

💡 **Kingdom Perspective**: Remember, "The earth is the Lord's, and everything in it" (Psalm 24:1). We believe in fair, transparent pricing that honors both your budget and God's provision.

Would you like to discuss how ${currentApp.name} can provide value that exceeds its cost?`;
    }
    
    return `💰 **Kingdom Collective Pricing** - Wisdom in Investment

Our pricing reflects our commitment to excellence and biblical stewardship. Each app is designed to provide maximum value while honoring your budget constraints.

💡 **Stewardship Principle**: "The plans of the diligent lead to profit" (Proverbs 21:5). We believe in transparent, fair pricing that honors both your resources and God's provision.

Which app would you like to explore pricing for?`;
  }

  private generateFeatureResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `✨ **${currentApp.name} Features** - Designed with Purpose

${currentApp.features ? currentApp.features.join('\n• ') : 'Advanced features designed for kingdom impact.'}

🔥 **Key Benefits**:
${currentApp.benefits ? currentApp.benefits.join('\n• ') : 'Enhanced productivity, kingdom-focused outcomes, and spiritual growth.'}

💡 **Biblical Wisdom**: "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23). ${currentApp.name} is designed to help you serve with excellence.

Would you like me to show you how these features work in practice?`;
    }
    
    return `✨ **Kingdom Collective Features** - Innovation with Purpose

Our apps are built with cutting-edge technology, designed to serve God's kingdom. Each feature is crafted with intentionality and biblical wisdom.

🔥 **Core Principles**:
• Excellence in everything we do
• Stewardship of God's gifts
• Service to others
• Kingdom impact

💡 **Biblical Foundation**: "For we are God's handiwork, created in Christ Jesus to do good works" (Ephesians 2:10).

Which specific app or feature would you like to explore?`;
  }

  private generateDemoResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🎬 **${currentApp.name} Demo** - See Kingdom Innovation in Action

I'd love to show you how ${currentApp.name} works! Here's what you can expect:

🔥 **Live Demo Features**:
• Real-time functionality
• User experience walkthrough
• Kingdom impact examples
• Biblical integration points

💡 **Next Steps**: 
1. Schedule a personalized demo
2. See it in your specific context
3. Discuss kingdom applications
4. Explore implementation options

Would you like to schedule a demo or see specific features in action?`;
    }
    
    return `🎬 **Kingdom Collective Demos** - Experience Innovation with Purpose

I'd be delighted to show you our apps in action! Each demo is designed to showcase not just functionality, but kingdom impact.

🔥 **Demo Experience**:
• Personalized to your needs
• Real-world applications
• Biblical integration examples
• Kingdom impact stories

💡 **Biblical Wisdom**: "Taste and see that the Lord is good" (Psalm 34:8). Experience how technology can serve God's purpose.

Which app would you like to see demonstrated?`;
  }

  private generateComparisonResponse(context: ResponseContext): string {
    return `⚖️ **App Comparison** - Wisdom in Choice

Each Kingdom Collective app serves a unique purpose in God's kingdom:

🔥 **Kingdom Apps Overview**:
• **Kingdom Circle**: Community building and spiritual growth
• **Kingdom Clips**: Video creation with purpose
• **Kingdom Launchpad**: Business acceleration with kingdom values
• **Kingdom Lens**: AR experiences that point to truth
• **Kingdom Studios**: Creative tools for kingdom impact
• **Kingdom Voice**: Voice technology with spiritual purpose

💡 **Biblical Wisdom**: "In all your ways acknowledge Him, and He will make your paths straight" (Proverbs 3:6).

Which apps would you like to compare, or would you prefer a recommendation based on your goals?`;
  }

  private generateCompanyResponse(context: ResponseContext): string {
    return `🏛️ **Kingdom Collective** - Innovation with Biblical Foundation

We are a team of believers passionate about using technology to serve God's kingdom. Our mission is to create innovative apps that honor God while serving His people.

🔥 **Our Values**:
• Biblical truth as our foundation
• Excellence in everything we do
• Stewardship of God's gifts
• Service to others
• Kingdom impact

💡 **Biblical Foundation**: "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23).

Our team combines technical expertise with spiritual wisdom, creating apps that not only function excellently but also serve God's purpose.

How can I help you learn more about our mission or specific apps?`;
  }

  private generateRecommendationResponse(context: ResponseContext): string {
    const recommendedApps = getRecommendedApps(context.interests);
    
    return `🎯 **Personalized Recommendations** - Wisdom in Choice

Based on your interests and goals, here are my recommendations:

🔥 **Top Recommendations**:
${recommendedApps.map(app => `• **${app.name}**: ${app.description}`).join('\n')}

💡 **Biblical Wisdom**: "The plans of the diligent lead to profit" (Proverbs 21:5). Each recommendation is designed to help you serve God's purpose effectively.

Would you like me to explain why these apps would be perfect for your specific needs?`;
  }

  private generateBiblicalResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `📖 **Biblical Integration** - ${currentApp.name} with Kingdom Purpose

${currentApp.biblicalPrinciples ? currentApp.biblicalPrinciples : `${currentApp.name} is designed with biblical wisdom and kingdom values at its core.`}

🔥 **Scriptural Foundation**:
• "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)
• "The plans of the diligent lead to profit" (Proverbs 21:5)
• "In all your ways acknowledge Him, and He will make your paths straight" (Proverbs 3:6)

💡 **Kingdom Impact**: ${currentApp.name} helps you serve God's purpose while using technology with wisdom and intentionality.

How can I help you understand how ${currentApp.name} aligns with biblical principles?`;
    }
    
    return `📖 **Biblical Wisdom** - Technology with Kingdom Purpose

At Kingdom Collective, we believe technology should serve God's kingdom. Every app is designed with biblical principles and kingdom values.

🔥 **Our Biblical Foundation**:
• "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)
• "The plans of the diligent lead to profit" (Proverbs 21:5)
• "In all your ways acknowledge Him, and He will make your paths straight" (Proverbs 3:6)

💡 **Kingdom Perspective**: Technology, when used with wisdom and purpose, can be a powerful tool for God's kingdom.

How can I help you explore how our apps align with biblical principles?`;
  }

  private generateDefaultResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🤔 **Exploring ${currentApp.name}** - Let me help you discover more!

${currentApp.description}

🔥 **Quick Facts**:
• Purpose: ${currentApp.purpose || 'Kingdom impact and innovation'}
• Key Benefit: ${currentApp.benefits ? currentApp.benefits[0] : 'Enhanced productivity with kingdom values'}
• Biblical Foundation: ${currentApp.biblicalPrinciples ? currentApp.biblicalPrinciples : 'Designed with wisdom and purpose'}

💡 **Next Steps**: Would you like to learn about pricing, features, or see a demo of ${currentApp.name}?`;
    }
    
    return `🤔 **Kingdom Collective Discovery** - Let me guide you!

I'd love to help you explore our innovative apps and discover how technology can serve God's kingdom.

🔥 **Popular Topics**:
• App features and capabilities
• Pricing and stewardship
• Biblical integration
• Demo and examples
• Company mission and values

💡 **Biblical Wisdom**: "Ask and it will be given to you; seek and you will find" (Matthew 7:7).

What would you like to explore today?`;
  }
}

export const aiResponseGenerator = AIResponseGenerator.getInstance(); 