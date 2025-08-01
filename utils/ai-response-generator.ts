import { kingdomCollective, getAppByPage, getRecommendedApps } from './kingdom-knowledge';
import { conversationManager, ConversationMemory } from './conversation-memory';

export interface ResponseContext {
  currentPage: string;
  userPersona: string;
  budgetRange: string;
  interests: string[];
  mentionedApps: string[];
  conversationHistory: any[];
  topics: string[];
  goals: string[];
  recentMessages: string[];
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
        conversationHistory: [],
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
      currentPage: memory.currentPage,
      userPersona: memory.userPersona,
      budgetRange: memory.budgetRange,
      interests: memory.userInterests,
      mentionedApps: memory.mentionedApps,
      conversationHistory: memory.conversationHistory,
      topics: memory.conversationTopics,
      goals: memory.userGoals,
      recentMessages
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

    // Detect app interests and add to conversation topics
    kingdomCollective.apps.forEach(app => {
      if (input.includes(app.name.toLowerCase()) || input.includes(app.id.replace('-', ' '))) {
        conversationManager.addMentionedApp(sessionId, app.id);
        conversationManager.addConversationTopic(sessionId, app.name);
      }
    });

    // Detect general interests with biblical alignment
    const interests = ['productivity', 'community', 'video', 'ar', 'business', 'creativity', 'voice', 'faith', 'purpose', 'stewardship'];
    interests.forEach(interest => {
      if (input.includes(interest)) {
        conversationManager.addUserInterest(sessionId, interest);
        conversationManager.addConversationTopic(sessionId, interest);
      }
    });

    // Detect user goals
    if (input.includes('goal') || input.includes('achieve') || input.includes('want to') || input.includes('need to')) {
      const goals = ['grow business', 'build community', 'create content', 'improve productivity', 'serve others'];
      goals.forEach(goal => {
        if (input.includes(goal.replace(' ', ''))) {
          conversationManager.addUserGoal(sessionId, goal);
        }
      });
    }

    // Detect conversation topics
    const topics = ['pricing', 'features', 'demo', 'comparison', 'biblical', 'ai bots', 'automation'];
    topics.forEach(topic => {
      if (input.includes(topic)) {
        conversationManager.addConversationTopic(sessionId, topic);
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
    
    // Comprehensive app overview requests
    if (input.includes('apps') || input.includes('applications') || input.includes('products') || 
        input.includes('show me') || input.includes('tell me about') || input.includes('what do you have')) {
      return this.generateComprehensiveAppOverview(context);
    }
    
    // AI bots inquiries
    if (input.includes('ai bot') || input.includes('bot') || input.includes('automation') || 
        input.includes('sales bot') || input.includes('lead gen') || input.includes('onboarding')) {
      return this.generateAIBotsResponse(context);
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
    if (input.includes('company') || input.includes('about') || input.includes('who') || input.includes('team') ||
        input.includes('mission') || input.includes('values')) {
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

  private generateComprehensiveAppOverview(context: ResponseContext): string {
    const apps = kingdomCollective.apps;
    const currentApp = getAppByPage(context.currentPage);
    
    let response = `🔥 **Kingdom Collective Apps** - Innovation with Biblical Purpose

Here's our complete suite of apps designed to serve God's kingdom:

${apps.map(app => `**${app.name}** - ${app.tagline}
• ${app.description}
• Pricing: ${app.pricing.basic} - ${app.pricing.enterprise}
• Key Features: ${app.features.slice(0, 3).join(', ')}`).join('\n\n')}

💡 **Biblical Foundation**: Each app is designed with wisdom and purpose, helping you serve God's kingdom through technology.

**Which app interests you most?** I can dive deeper into any specific app or help you find the perfect solution for your needs.`;
    
    if (currentApp) {
      response += `\n\n🎯 **Currently viewing**: ${currentApp.name} - ${currentApp.description}`;
    }
    
    return response;
  }

  private generateAIBotsResponse(context: ResponseContext): string {
    return `🤖 **Kingdom AI Bots** - Intelligent Automation with Purpose

Our AI bots are designed to serve your business needs while maintaining biblical integrity:

**🔥 Sales Assistant Bot**
• Lead qualification and nurturing
• Product recommendations
• Follow-up automation
• Biblical communication standards

**🎯 Lead Generation Bot**
• Automated lead capture
• Qualification questions
• Appointment scheduling
• Integration with CRM systems

**📚 Onboarding Bot**
• New user guidance
• Feature tutorials
• FAQ handling
• Personalized welcome experience

**💬 Customer Support Bot**
• 24/7 support availability
• Ticket routing and escalation
• Knowledge base integration
• Empathetic, helpful responses

**📖 Faith Bot**
• Biblical guidance and encouragement
• Prayer request handling
• Scripture recommendations
• Spiritual growth resources

**🎬 Course Explainer Bot**
• Educational content delivery
• Interactive learning experiences
• Progress tracking
• Adaptive learning paths

**📝 Testimonial Bot**
• Customer feedback collection
• Review generation
• Success story capture
• Social proof automation

**💼 Job Application Bot**
• Application screening
• Interview scheduling
• Candidate communication
• Hiring process automation

**🎨 Enhanced Sales Bot**
• Advanced sales techniques
• Objection handling
• Closing strategies
• Performance analytics

💡 **Biblical Integration**: All our bots are programmed with wholesome communication standards and ethical business practices.

**Which bot would you like to learn more about?** I can provide detailed information about features, pricing, and implementation.`;
  }

  private generatePageSpecificGreeting(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🔥 Welcome to ${currentApp.name}! As it says in Proverbs 3:6, "In all your ways acknowledge Him, and He will make your paths straight." 

${currentApp.description}

${currentApp.biblicalPrinciples ? `✨ Biblical Foundation: ${currentApp.biblicalPrinciples.join(', ')}` : ''}

**Quick Facts:**
• Pricing: ${currentApp.pricing.basic} - ${currentApp.pricing.enterprise}
• Key Features: ${currentApp.features.slice(0, 3).join(', ')}
• Target Audience: ${currentApp.targetAudience.slice(0, 2).join(', ')}

How can I help you discover how ${currentApp.name} can serve God's purpose in your life?`;
    }
    
    return `🔥 Greetings! I am your Kingdom Collective assistant, standing firm in biblical truth. 

As we explore our innovative apps together, remember that "Every good and perfect gift is from above" (James 1:17). Technology, when used with wisdom and purpose, can be a powerful tool for God's kingdom.

**What would you like to explore today?**
• Our complete app suite
• AI bots and automation
• Pricing and packages
• Company mission and values
• Biblical integration`;
  }

  private generatePricingResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `💰 **${currentApp.name} Pricing** - Grounded in Stewardship

**Pricing Tiers:**
• Basic: ${currentApp.pricing.basic}
• Premium: ${currentApp.pricing.premium}
• Enterprise: ${currentApp.pricing.enterprise}

💡 **Kingdom Perspective**: Remember, "The earth is the Lord's, and everything in it" (Psalm 24:1). We believe in fair, transparent pricing that honors both your budget and God's provision.

**Value Proposition:**
${currentApp.benefits.slice(0, 3).map(benefit => `• ${benefit}`).join('\n')}

Would you like to discuss how ${currentApp.name} can provide value that exceeds its cost, or explore our bundle pricing for multiple apps?`;
    }
    
    return `💰 **Kingdom Collective Pricing** - Wisdom in Investment

**Individual App Pricing:**
${kingdomCollective.apps.map(app => `• ${app.name}: ${app.pricing.basic} - ${app.pricing.enterprise}`).join('\n')}

**Bundle Options:**
• All Apps Bundle: ${kingdomCollective.pricing.bundle}
• Enterprise Solutions: ${kingdomCollective.pricing.enterprise}

💡 **Stewardship Principle**: "The plans of the diligent lead to profit" (Proverbs 21:5). We believe in transparent, fair pricing that honors both your resources and God's provision.

**Which app would you like to explore pricing for, or would you prefer to see our bundle options?**`;
  }

  private generateFeatureResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `✨ **${currentApp.name} Features** - Designed with Purpose

**Core Features:**
${currentApp.features.map(feature => `• ${feature}`).join('\n')}

**Key Benefits:**
${currentApp.benefits.map(benefit => `• ${benefit}`).join('\n')}

**Use Cases:**
${currentApp.useCases.map(useCase => `• ${useCase}`).join('\n')}

💡 **Biblical Wisdom**: "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23). ${currentApp.name} is designed to help you serve with excellence.

Would you like me to show you how these features work in practice, or explore specific use cases for your needs?`;
    }
    
    return `✨ **Kingdom Collective Features** - Innovation with Purpose

Our apps are built with cutting-edge technology, designed to serve God's kingdom. Each feature is crafted with intentionality and biblical wisdom.

**🔥 Core Principles:**
• Excellence in everything we do
• Stewardship of God's gifts
• Service to others
• Kingdom impact

**🎯 App-Specific Features:**
${kingdomCollective.apps.map(app => `• **${app.name}**: ${app.features.slice(0, 2).join(', ')}`).join('\n')}

💡 **Biblical Foundation**: "For we are God's handiwork, created in Christ Jesus to do good works" (Ephesians 2:10).

**Which specific app or feature would you like to explore in detail?**`;
  }

  private generateDemoResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🎬 **${currentApp.name} Demo** - See Kingdom Innovation in Action

I'd love to show you how ${currentApp.name} works! Here's what you can expect:

🔥 **Live Demo Features:**
• Real-time functionality walkthrough
• User experience demonstration
• Kingdom impact examples
• Biblical integration points
• Custom use case scenarios

**Demo Highlights:**
${currentApp.features.slice(0, 4).map(feature => `• ${feature}`).join('\n')}

💡 **Next Steps**: 
1. Schedule a personalized demo
2. See it in your specific context
3. Discuss kingdom applications
4. Explore implementation options

Would you like to schedule a demo or see specific features in action?`;
    }
    
    return `🎬 **Kingdom Collective Demos** - Experience Innovation with Purpose

I'd be delighted to show you our apps in action! Each demo is designed to showcase not just functionality, but kingdom impact.

**🔥 Demo Experience:**
• Personalized to your needs
• Real-world applications
• Biblical integration examples
• Kingdom impact stories
• Custom use case scenarios

**Available Demos:**
${kingdomCollective.apps.map(app => `• **${app.name}**: ${app.description.slice(0, 100)}...`).join('\n')}

💡 **Biblical Wisdom**: "Taste and see that the Lord is good" (Psalm 34:8). Experience how technology can serve God's purpose.

**Which app would you like to see demonstrated, or would you prefer a comprehensive overview?**`;
  }

  private generateComparisonResponse(context: ResponseContext): string {
    return `⚖️ **App Comparison** - Wisdom in Choice

Each Kingdom Collective app serves a unique purpose in God's kingdom:

**🔥 Kingdom Apps Overview:**

**🎯 Kingdom Circle** - Community & Collaboration
• Focus: Building authentic communities
• Best for: Teams, organizations, online communities
• Pricing: ${kingdomCollective.apps[1].pricing.basic} - ${kingdomCollective.apps[1].pricing.enterprise}

**🎬 Kingdom Clips** - Video Creation
• Focus: Professional video content creation
• Best for: Content creators, marketers, educators
• Pricing: ${kingdomCollective.apps[3].pricing.basic} - ${kingdomCollective.apps[3].pricing.enterprise}

**🚀 Kingdom Launchpad** - Business Acceleration
• Focus: Entrepreneurship and business growth
• Best for: Entrepreneurs, startups, business owners
• Pricing: ${kingdomCollective.apps[4].pricing.basic} - ${kingdomCollective.apps[4].pricing.enterprise}

**👁️ Kingdom Lens** - Augmented Reality
• Focus: AR experiences and visualization
• Best for: Retail, education, architecture, entertainment
• Pricing: ${kingdomCollective.apps[2].pricing.basic} - ${kingdomCollective.apps[2].pricing.enterprise}

**🎨 Kingdom Studios** - Creative Excellence
• Focus: Professional design and creative tools
• Best for: Creative professionals, agencies, designers
• Pricing: ${kingdomCollective.apps[5].pricing.basic} - ${kingdomCollective.apps[5].pricing.enterprise}

**🎤 Kingdom Voice** - Voice Technology
• Focus: Voice recognition and AI communication
• Best for: Professionals, accessibility, customer service
• Pricing: ${kingdomCollective.apps[0].pricing.basic} - ${kingdomCollective.apps[0].pricing.enterprise}

💡 **Biblical Wisdom**: "In all your ways acknowledge Him, and He will make your paths straight" (Proverbs 3:6).

**Which apps would you like to compare in detail, or would you prefer a recommendation based on your goals?**`;
  }

  private generateCompanyResponse(context: ResponseContext): string {
    return `🏛️ **Kingdom Collective** - Innovation with Biblical Foundation

We are a team of believers passionate about using technology to serve God's kingdom. Our mission is to create innovative apps that honor God while serving His people.

**🔥 Our Mission:**
${kingdomCollective.mission}

**🎯 Our Vision:**
${kingdomCollective.vision}

**✨ Our Values:**
${kingdomCollective.values.map(value => `• ${value}`).join('\n')}

**📖 Biblical Foundation:**
${kingdomCollective.biblicalFoundation.map(principle => `• ${principle}`).join('\n')}

**🌟 Success Stories:**
${kingdomCollective.successStories.slice(0, 3).map(story => `• ${story}`).join('\n')}

**💬 Testimonials:**
${kingdomCollective.testimonials.slice(0, 3).map(testimonial => `• "${testimonial}"`).join('\n')}

Our team combines technical expertise with spiritual wisdom, creating apps that not only function excellently but also serve God's purpose.

**How can I help you learn more about our mission, specific apps, or how we can serve your needs?**`;
  }

  private generateRecommendationResponse(context: ResponseContext): string {
    const recommendedApps = getRecommendedApps(context.interests);
    const allApps = kingdomCollective.apps;
    
    let response = `🎯 **Personalized Recommendations** - Wisdom in Choice

Based on your interests and goals, here are my recommendations:

**🔥 Top Recommendations:**
${recommendedApps.length > 0 ? recommendedApps.map(app => `• **${app.name}**: ${app.description}`).join('\n') : 'Let me recommend based on common needs:'}

**🎯 For Community Building:**
• **Kingdom Circle**: ${allApps[1].description}

**🎬 For Content Creation:**
• **Kingdom Clips**: ${allApps[3].description}

**🚀 For Business Growth:**
• **Kingdom Launchpad**: ${allApps[4].description}

**👁️ For Innovation:**
• **Kingdom Lens**: ${allApps[2].description}

**🎨 For Creative Excellence:**
• **Kingdom Studios**: ${allApps[5].description}

**🎤 For Voice Technology:**
• **Kingdom Voice**: ${allApps[0].description}

💡 **Biblical Wisdom**: "The plans of the diligent lead to profit" (Proverbs 21:5). Each recommendation is designed to help you serve God's purpose effectively.

**Would you like me to explain why these apps would be perfect for your specific needs, or explore pricing options?**`;
    
    return response;
  }

  private generateBiblicalResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `📖 **Biblical Integration** - ${currentApp.name} with Kingdom Purpose

${currentApp.biblicalPrinciples ? currentApp.biblicalPrinciples.join('\n') : `${currentApp.name} is designed with biblical wisdom and kingdom values at its core.`}

**🔥 Scriptural Foundation:**
• "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)
• "The plans of the diligent lead to profit" (Proverbs 21:5)
• "In all your ways acknowledge Him, and He will make your paths straight" (Proverbs 3:6)

**💡 Kingdom Impact**: ${currentApp.name} helps you serve God's purpose while using technology with wisdom and intentionality.

**Key Biblical Principles Applied:**
${currentApp.biblicalPrinciples ? currentApp.biblicalPrinciples.map(principle => `• ${principle}`).join('\n') : '• Excellence in all things\n• Stewardship of resources\n• Service to others'}

How can I help you understand how ${currentApp.name} aligns with biblical principles?`;
    }
    
    return `📖 **Biblical Wisdom** - Technology with Kingdom Purpose

At Kingdom Collective, we believe technology should serve God's kingdom. Every app is designed with biblical principles and kingdom values.

**🔥 Our Biblical Foundation:**
${kingdomCollective.biblicalFoundation.map(principle => `• ${principle}`).join('\n')}

**💡 Kingdom Perspective**: Technology, when used with wisdom and purpose, can be a powerful tool for God's kingdom.

**📖 Biblical Integration Across All Apps:**
${kingdomCollective.apps.map(app => `• **${app.name}**: ${app.biblicalPrinciples ? app.biblicalPrinciples[0] : 'Designed with wisdom and purpose'}`).join('\n')}

**How can I help you explore how our apps align with biblical principles, or discuss specific spiritual applications?**`;
  }

  private generateDefaultResponse(context: ResponseContext, currentApp: any): string {
    if (currentApp) {
      return `🤔 **Exploring ${currentApp.name}** - Let me help you discover more!

${currentApp.description}

**🔥 Quick Facts:**
• Purpose: ${currentApp.purpose || 'Kingdom impact and innovation'}
• Pricing: ${currentApp.pricing.basic} - ${currentApp.pricing.enterprise}
• Key Features: ${currentApp.features.slice(0, 3).join(', ')}
• Target Audience: ${currentApp.targetAudience.slice(0, 2).join(', ')}

**💡 Next Steps**: Would you like to learn about:
• Detailed features and capabilities
• Pricing and stewardship options
• Demo and examples
• Biblical integration
• Comparison with other apps

**Or would you like to explore our complete app suite?**`;
    }
    
    return `🤔 **Kingdom Collective Discovery** - Let me guide you!

I'd love to help you explore our innovative apps and discover how technology can serve God's kingdom.

**🔥 Popular Topics:**
• Complete app suite overview
• AI bots and automation
• Pricing and stewardship
• Biblical integration
• Demo and examples
• Company mission and values

**🎯 Quick Start Options:**
• Tell me about all your apps
• Show me your AI bots
• What's your pricing like?
• Tell me about your mission
• Compare your different apps

💡 **Biblical Wisdom**: "Ask and it will be given to you; seek and you will find" (Matthew 7:7).

**What would you like to explore today?**`;
  }
}

export const aiResponseGenerator = AIResponseGenerator.getInstance(); 