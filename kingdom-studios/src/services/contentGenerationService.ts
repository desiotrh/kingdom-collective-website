import apiService from './apiService';

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'social' | 'email' | 'blog' | 'product';
  template: string;
  variables: string[];
  faithMode?: boolean;
}

export interface GeneratedContent {
  content: string;
  hashtags?: string[];
  title?: string;
  description?: string;
  callToAction?: string;
}

class ContentGenerationService {
  private static instance: ContentGenerationService;

  private constructor() {}

  static getInstance(): ContentGenerationService {
    if (!ContentGenerationService.instance) {
      ContentGenerationService.instance = new ContentGenerationService();
    }
    return ContentGenerationService.instance;
  }

  // Content templates for different platforms and purposes
  private templates: ContentTemplate[] = [
    {
      id: 'instagram_inspiration',
      name: 'Instagram Inspiration',
      type: 'social',
      template: `🌟 {MAIN_MESSAGE} ✨

{CONTENT_BODY}

{CALL_TO_ACTION}

{HASHTAGS}`,
      variables: ['MAIN_MESSAGE', 'CONTENT_BODY', 'CALL_TO_ACTION'],
    },
    {
      id: 'product_announcement',
      name: 'Product Announcement',
      type: 'social',
      template: `🎉 New Product Alert! 🎉

{PRODUCT_NAME} is here! 

{PRODUCT_DESCRIPTION}

✅ {BENEFIT_1}
✅ {BENEFIT_2} 
✅ {BENEFIT_3}

{CALL_TO_ACTION}

{HASHTAGS}`,
      variables: ['PRODUCT_NAME', 'PRODUCT_DESCRIPTION', 'BENEFIT_1', 'BENEFIT_2', 'BENEFIT_3', 'CALL_TO_ACTION'],
    },
    {
      id: 'email_welcome',
      name: 'Welcome Email',
      type: 'email',
      template: `Subject: Welcome to the {COMMUNITY_NAME} family! 🙏

Hi {FIRST_NAME}!

{WELCOME_MESSAGE}

Here's what you can expect:
• {EXPECTATION_1}
• {EXPECTATION_2}
• {EXPECTATION_3}

{NEXT_STEPS}

Blessings,
{SENDER_NAME}`,
      variables: ['COMMUNITY_NAME', 'FIRST_NAME', 'WELCOME_MESSAGE', 'EXPECTATION_1', 'EXPECTATION_2', 'EXPECTATION_3', 'NEXT_STEPS', 'SENDER_NAME'],
    },
  ];

  // Faith-specific content variations
  private faithModeEnhancements = {
    openings: [
      "God has placed this on my heart to share...",
      "I'm believing God will use this message...",
      "The Lord has been teaching me...",
      "Walking in faith means...",
      "His word says...",
    ],
    closings: [
      "Trusting God's plan! 🙏",
      "Walking by faith, not by sight ✨",
      "God's got this! 💪",
      "Blessed and grateful 🙌",
      "For His glory! ✨",
    ],
    hashtags: [
      "#faith", "#blessed", "#godsgrace", "#kingdom", "#purpose", 
      "#christiancreator", "#faithjourney", "#godsplan", "#blessed", 
      "#trustgod", "#walkbyfaith", "#christianentrepreneur"
    ],
  };

  // Generate content based on prompt and type
  async generateContent(
    prompt: string, 
    contentType: 'social' | 'email' | 'hashtags' | 'seo' | 'product',
    options: {
      platform?: string;
      faithMode?: boolean;
      template?: string;
      tone?: 'professional' | 'casual' | 'inspirational';
    } = {}
  ): Promise<GeneratedContent> {
    try {
      // Map product type to social for API call
      const apiContentType = contentType === 'product' ? 'social' : contentType;
      let generatedText = await apiService.generateContent(prompt, apiContentType);
      
      // Enhance with faith mode if enabled
      if (options.faithMode) {
        generatedText = this.addFaithModeEnhancements(generatedText, contentType);
      }

      // Apply platform-specific formatting
      if (options.platform) {
        generatedText = this.formatForPlatform(generatedText, options.platform);
      }

      // Generate accompanying elements
      const result: GeneratedContent = {
        content: generatedText,
      };

      if (contentType === 'social') {
        result.hashtags = this.generateHashtags(prompt, options.faithMode);
        result.callToAction = this.generateCallToAction(options.faithMode);
      }

      if (contentType === 'email') {
        result.title = this.generateEmailSubject(prompt, options.faithMode);
      }

      if (contentType === 'product') {
        result.title = this.generateProductTitle(prompt);
        result.description = this.generateProductDescription(prompt, options.faithMode);
      }

      return result;
    } catch (error) {
      console.error('Content generation error:', error);
      throw new Error('Failed to generate content');
    }
  }

  // Add faith-specific language and scripture references
  private addFaithModeEnhancements(content: string, contentType: string): string {
    const { openings, closings, hashtags } = this.faithModeEnhancements;
    
    let enhanced = content;

    // Add faith-based opening for longer content
    if (contentType === 'email' || content.length > 200) {
      const randomOpening = openings[Math.floor(Math.random() * openings.length)];
      enhanced = `${randomOpening}\n\n${enhanced}`;
    }

    // Add faith-based closing
    const randomClosing = closings[Math.floor(Math.random() * closings.length)];
    enhanced = `${enhanced}\n\n${randomClosing}`;

    // Add scripture reference occasionally
    if (Math.random() > 0.7) {
      const scriptures = [
        '"For I know the plans I have for you," declares the Lord. - Jeremiah 29:11',
        '"She is clothed with strength and dignity." - Proverbs 31:25',
        '"I can do all things through Christ who strengthens me." - Philippians 4:13',
        '"Trust in the Lord with all your heart." - Proverbs 3:5',
      ];
      const randomScripture = scriptures[Math.floor(Math.random() * scriptures.length)];
      enhanced = `${enhanced}\n\n📖 ${randomScripture}`;
    }

    return enhanced;
  }

  // Format content for specific social media platforms
  private formatForPlatform(content: string, platform: string): string {
    switch (platform.toLowerCase()) {
      case 'instagram':
        // Add Instagram-specific emojis and formatting
        return content.replace(/\n\n/g, '\n\n• ').replace(/^/, '✨ ');
      
      case 'twitter':
        // Ensure content fits Twitter character limit
        return content.length > 280 ? content.substring(0, 277) + '...' : content;
      
      case 'facebook':
        // Facebook prefers longer, more detailed content
        return content;
      
      case 'linkedin':
        // Professional tone for LinkedIn
        return content.replace(/✨|🙏|💪/g, '').trim();
      
      default:
        return content;
    }
  }

  // Generate relevant hashtags
  private generateHashtags(prompt: string, faithMode?: boolean): string[] {
    const baseHashtags = [
      '#create', '#inspire', '#community', '#entrepreneur', 
      '#creative', '#business', '#content', '#digital', '#growth'
    ];

    const faithHashtags = this.faithModeEnhancements.hashtags;

    // Combine base hashtags with faith hashtags if faith mode is enabled
    const relevantHashtags = faithMode 
      ? [...baseHashtags.slice(0, 5), ...faithHashtags.slice(0, 10)]
      : baseHashtags;

    // Add prompt-specific hashtags
    const promptWords = prompt.toLowerCase().split(' ');
    const promptHashtags = promptWords
      .filter(word => word.length > 4)
      .slice(0, 3)
      .map(word => `#${word}`);

    return [...relevantHashtags, ...promptHashtags].slice(0, 15);
  }

  // Generate call-to-action
  private generateCallToAction(faithMode?: boolean): string {
    const faithCTAs = [
      "Share if this blessed you! 🙏",
      "Tag someone who needs to see this! ✨",
      "Let's build His kingdom together! 💪",
      "Drop a 🙌 if you're walking in faith!",
    ];

    const generalCTAs = [
      "Double tap if you agree! ❤️",
      "Share your thoughts in the comments!",
      "Tag someone who inspires you! ✨",
      "Save this for later! 📌",
    ];

    const ctas = faithMode ? faithCTAs : generalCTAs;
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  // Generate email subject lines
  private generateEmailSubject(prompt: string, faithMode?: boolean): string {
    const faithSubjects = [
      "God's message for you today 🙏",
      "Walking in purpose together ✨",
      "His plan is perfect 💜",
      "Faith over fear, always 💪",
    ];

    const generalSubjects = [
      "Something special for you ✨",
      "Your weekly dose of inspiration",
      "Let's create something amazing",
      "Ready to level up? 🚀",
    ];

    const subjects = faithMode ? faithSubjects : generalSubjects;
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  // Generate product titles
  private generateProductTitle(prompt: string): string {
    const titleFormats = [
      "{PROMPT} - Premium Collection",
      "Inspirational {PROMPT} Design",
      "{PROMPT} - Faith-Based Creation",
      "Custom {PROMPT} - Digital Art",
    ];

    const format = titleFormats[Math.floor(Math.random() * titleFormats.length)];
    return format.replace('{PROMPT}', prompt);
  }

  // Generate product descriptions
  private generateProductDescription(prompt: string, faithMode?: boolean): string {
    const baseDescription = `Beautiful ${prompt} design perfect for expressing your unique style and message.`;
    
    if (faithMode) {
      return `${baseDescription} Created to inspire faith and encourage others in their spiritual journey. Share your testimony and God's love through meaningful design.`;
    }
    
    return `${baseDescription} High-quality design that speaks to your audience and reflects your personal brand.`;
  }

  // Get available templates
  getTemplates(type?: 'social' | 'email' | 'blog' | 'product'): ContentTemplate[] {
    return type ? this.templates.filter(t => t.type === type) : this.templates;
  }

  // Apply template to content
  applyTemplate(templateId: string, variables: Record<string, string>): string {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let content = template.template;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }
}

export default ContentGenerationService.getInstance();
