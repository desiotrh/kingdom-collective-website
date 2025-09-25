import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Knowledge base data structure
interface AppInfo {
  name: string;
  tagline: string;
  description: string;
  pricing: {
    free: number;
    pro: number;
    enterprise: number;
  };
  features: string[];
  benefits: string[];
  useCases: string[];
  targetAudience: string[];
  biblicalPrinciples?: string[];
}

interface KnowledgeBase {
  apps: { [key: string]: AppInfo };
  pricing: any;
  legal: any;
  support: any;
  faqs: any;
}

// Load knowledge base from files
function loadKnowledgeBase(): KnowledgeBase {
  const kbPath = path.join(process.cwd(), 'kb');
  
  const apps: { [key: string]: AppInfo } = {};
  const appFiles = ['studios', 'circle', 'voice', 'lens', 'launchpad', 'clips', 'stand'];
  
  appFiles.forEach(app => {
    try {
      const filePath = path.join(kbPath, 'products', `${app}.md`);
      const content = fs.readFileSync(filePath, 'utf-8');
      apps[app] = parseAppMarkdown(content);
    } catch (error) {
      console.error(`Error loading ${app}:`, error);
    }
  });

  // Load pricing data
  let pricing: any = {};
  try {
    const pricingPath = path.join(kbPath, 'pricing', 'tiers.yml');
    const pricingContent = fs.readFileSync(pricingPath, 'utf-8');
    pricing = yaml.load(pricingContent) || {};
  } catch (error) {
    console.error('Error loading pricing:', error);
  }

  // Load legal documents
  let legal: any = {};
  try {
    const legalPath = path.join(kbPath, 'legal');
    const legalFiles = ['privacy.md', 'terms.md'];
    legalFiles.forEach(file => {
      const filePath = path.join(legalPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      legal[file.replace('.md', '')] = content;
    });
  } catch (error) {
    console.error('Error loading legal docs:', error);
  }

  // Load support info
  let support: any = {};
  try {
    const supportPath = path.join(kbPath, 'operations', 'support.md');
    const content = fs.readFileSync(supportPath, 'utf-8');
    support = { content };
  } catch (error) {
    console.error('Error loading support:', error);
  }

  // Load FAQs
  let faqs: any = {};
  try {
    const faqPath = path.join(kbPath, 'faqs', 'generics.md');
    const content = fs.readFileSync(faqPath, 'utf-8');
    faqs = { content };
  } catch (error) {
    console.error('Error loading FAQs:', error);
  }

  return { apps, pricing, legal, support, faqs };
}

// Parse markdown content to extract app information
function parseAppMarkdown(content: string): AppInfo {
  const lines = content.split('\n');
  let currentSection = '';
  let appInfo: Partial<AppInfo> = {
    features: [],
    benefits: [],
    useCases: [],
    targetAudience: [],
    biblicalPrinciples: []
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('# ')) {
      appInfo.name = line.replace('# ', '');
    } else if (line.startsWith('## Tagline')) {
      currentSection = 'tagline';
    } else if (line.startsWith('## Description')) {
      currentSection = 'description';
    } else if (line.startsWith('## Pricing Tiers')) {
      currentSection = 'pricing';
    } else if (line.startsWith('## Key Features')) {
      currentSection = 'features';
    } else if (line.startsWith('## Benefits')) {
      currentSection = 'benefits';
    } else if (line.startsWith('## Use Cases')) {
      currentSection = 'useCases';
    } else if (line.startsWith('## Target Audience')) {
      currentSection = 'targetAudience';
    } else if (line.startsWith('## Biblical Principles')) {
      currentSection = 'biblicalPrinciples';
    } else if (line.startsWith('### ') && currentSection === 'pricing') {
      // Parse pricing tiers
      if (!appInfo.pricing) appInfo.pricing = { free: 0, pro: 0, enterprise: 0 };
      const tierLine = line.replace('### ', '');
      if (tierLine.includes('Free')) {
        const priceMatch = lines[i + 2]?.match(/\$(\d+)/);
        if (priceMatch) appInfo.pricing.free = parseInt(priceMatch[1]);
      } else if (tierLine.includes('Pro')) {
        const priceMatch = lines[i + 2]?.match(/\$(\d+)/);
        if (priceMatch) appInfo.pricing.pro = parseInt(priceMatch[1]);
      } else if (tierLine.includes('Enterprise')) {
        const priceMatch = lines[i + 2]?.match(/\$(\d+)/);
        if (priceMatch) appInfo.pricing.enterprise = parseInt(priceMatch[1]);
      }
    } else if (line.startsWith('• ') && currentSection) {
      const item = line.replace('• ', '').trim();
      if (currentSection === 'features' && appInfo.features) {
        appInfo.features.push(item);
      } else if (currentSection === 'benefits' && appInfo.benefits) {
        appInfo.benefits.push(item);
      } else if (currentSection === 'useCases' && appInfo.useCases) {
        appInfo.useCases.push(item);
      } else if (currentSection === 'targetAudience' && appInfo.targetAudience) {
        appInfo.targetAudience.push(item);
      } else if (currentSection === 'biblicalPrinciples' && appInfo.biblicalPrinciples) {
        appInfo.biblicalPrinciples.push(item);
      }
    } else if (line && currentSection === 'tagline') {
      appInfo.tagline = line;
    } else if (line && currentSection === 'description') {
      appInfo.description = line;
    }
  }

  return appInfo as AppInfo;
}

// Simple text search function
function searchKnowledgeBase(query: string, kb: KnowledgeBase): any[] {
  const results: any[] = [];
  const queryLower = query.toLowerCase();

  // Search apps
  Object.entries(kb.apps).forEach(([key, app]) => {
    let score = 0;
    const searchText = `${app.name} ${app.tagline} ${app.description} ${app.features.join(' ')} ${app.benefits.join(' ')} ${app.useCases.join(' ')} ${app.targetAudience.join(' ')}`.toLowerCase();
    
    if (searchText.includes(queryLower)) {
      score += 10;
    }
    
    // Check for specific keywords
    if (queryLower.includes(app.name.toLowerCase())) score += 20;
    if (queryLower.includes('price') || queryLower.includes('cost')) score += 5;
    if (queryLower.includes('feature')) score += 5;
    if (queryLower.includes('benefit')) score += 5;
    
    if (score > 0) {
      results.push({ type: 'app', key, app, score });
    }
  });

  // Search pricing
  if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('pricing')) {
    results.push({ type: 'pricing', data: kb.pricing, score: 15 });
  }

  // Search legal
  if (queryLower.includes('refund') || queryLower.includes('policy') || queryLower.includes('terms') || queryLower.includes('privacy')) {
    results.push({ type: 'legal', data: kb.legal, score: 15 });
  }

  // Search support
  if (queryLower.includes('support') || queryLower.includes('contact') || queryLower.includes('help')) {
    results.push({ type: 'support', data: kb.support, score: 15 });
  }

  // Search FAQs
  if (queryLower.includes('faq') || queryLower.includes('question') || queryLower.includes('what is')) {
    results.push({ type: 'faq', data: kb.faqs, score: 10 });
  }

  return results.sort((a, b) => b.score - a.score);
}

// Generate response based on search results
function generateResponse(query: string, results: any[], mode: 'faith' | 'marketplace'): string {
  const queryLower = query.toLowerCase();
  
  // Handle specific question types
  if (queryLower.includes('what apps') || queryLower.includes('what do you offer')) {
    return generateAppsOverview(results, mode);
  }
  
  if (queryLower.includes('price') || queryLower.includes('cost')) {
    return generatePricingResponse(results, mode);
  }
  
  if (queryLower.includes('feature')) {
    return generateFeaturesResponse(results, mode);
  }
  
  if (queryLower.includes('support') || queryLower.includes('contact')) {
    return generateSupportResponse(results, mode);
  }
  
  if (queryLower.includes('refund') || queryLower.includes('policy')) {
    return generateLegalResponse(results, mode);
  }
  
  // Default response
  if (results.length > 0) {
    return generateGeneralResponse(results, mode);
  }
  
  return generateFallbackResponse(mode);
}

function generateAppsOverview(results: any[], mode: 'faith' | 'marketplace'): string {
  const appResults = results.filter(r => r.type === 'app');
  
  if (appResults.length === 0) return generateFallbackResponse(mode);
  
  const intro = mode === 'faith' 
    ? "🔥 **Kingdom Collective Apps** - Innovation with Biblical Purpose\n\nHere's our complete suite of apps designed to serve God's kingdom:\n\n"
    : "**Kingdom Collective Apps** - Innovation with Purpose\n\nHere's our complete suite of apps:\n\n";
  
  const appsList = appResults.map(result => {
    const app = result.app;
    return `**${app.name}** - ${app.tagline}\n• ${app.description}\n• Pricing: $${app.pricing.free} - $${app.pricing.enterprise}/month\n• Key Features: ${app.features.slice(0, 3).join(', ')}`;
  }).join('\n\n');
  
  const outro = mode === 'faith'
    ? "\n\n💡 **Biblical Foundation**: Each app is designed with wisdom and purpose, helping you serve God's kingdom through technology.\n\n**Which app interests you most?** I can dive deeper into any specific app or help you find the perfect solution for your needs."
    : "\n\n**Which app interests you most?** I can provide more details about any specific app or help you find the perfect solution for your needs.";
  
  return intro + appsList + outro;
}

function generatePricingResponse(results: any[], mode: 'faith' | 'marketplace'): string {
  const appResults = results.filter(r => r.type === 'app');
  
  if (appResults.length === 0) return generateFallbackResponse(mode);
  
  const intro = mode === 'faith'
    ? "💰 **Kingdom Collective Pricing** - Wisdom in Investment\n\n"
    : "💰 **Kingdom Collective Pricing**\n\n";
  
  const pricingList = appResults.map(result => {
    const app = result.app;
    return `**${app.name}**: $${app.pricing.free} - $${app.pricing.enterprise}/month`;
  }).join('\n');
  
  const outro = mode === 'faith'
    ? "\n\n💡 **Stewardship Principle**: \"The plans of the diligent lead to profit\" (Proverbs 21:5). We believe in transparent, fair pricing that honors both your resources and God's provision.\n\n**Which app would you like to explore pricing for, or would you prefer to see our bundle options?**"
    : "\n\n**Which app would you like to explore pricing for, or would you prefer to see our bundle options?**";
  
  return intro + pricingList + outro;
}

function generateFeaturesResponse(results: any[], mode: 'faith' | 'marketplace'): string {
  const appResults = results.filter(r => r.type === 'app');
  
  if (appResults.length === 0) return generateFallbackResponse(mode);
  
  const app = appResults[0].app;
  
  const intro = mode === 'faith'
    ? `✨ **${app.name} Features** - Designed with Purpose\n\n`
    : `✨ **${app.name} Features**\n\n`;
  
  const featuresList = app.features.map(feature => `• ${feature}`).join('\n');
  
  const outro = mode === 'faith'
    ? `\n\n💡 **Biblical Wisdom**: "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23). ${app.name} is designed to help you serve with excellence.\n\nWould you like me to show you how these features work in practice, or explore specific use cases for your needs?`
    : `\n\nWould you like me to show you how these features work in practice, or explore specific use cases for your needs?`;
  
  return intro + featuresList + outro;
}

function generateSupportResponse(results: any[], mode: 'faith' | 'marketplace'): string {
  return mode === 'faith'
    ? "🙏 **Kingdom Collective Support**\n\nWe're here to help you succeed with our apps and serve God's kingdom through technology.\n\n**Contact Information:**\n• Email: support@kingdomcollective.com\n• Response Time: 24 hours (Pro), 4 hours (Enterprise)\n• Hours: Monday-Friday, 9 AM - 6 PM EST\n\n**Support Channels:**\n• Email support with detailed issue tracking\n• Knowledge base with comprehensive documentation\n• Community forum for user-to-user support\n• Live chat for Pro and Enterprise customers\n\nHow can we help you today?"
    : "**Kingdom Collective Support**\n\nWe're here to help you succeed with our apps and achieve your business goals.\n\n**Contact Information:**\n• Email: support@kingdomcollective.com\n• Response Time: 24 hours (Pro), 4 hours (Enterprise)\n• Hours: Monday-Friday, 9 AM - 6 PM EST\n\n**Support Channels:**\n• Email support with detailed issue tracking\n• Knowledge base with comprehensive documentation\n• Community forum for user-to-user support\n• Live chat for Pro and Enterprise customers\n\nHow can we help you today?";
}

function generateLegalResponse(results: any[], mode: 'faith' | 'marketplace'): string {
  return mode === 'faith'
    ? "📋 **Kingdom Collective Policies**\n\nWe believe in transparency and integrity in all our business practices.\n\n**Refund Policy:**\n• Refunds available within 30 days of initial purchase\n• Refunds are not available for partial usage periods\n• Refund requests must be submitted through proper channels\n• Approved refunds processed within 10 business days\n\n**Privacy & Terms:**\n• We protect your data with industry-standard security\n• We comply with GDPR, CCPA, and other regulations\n• Your data is never shared without consent\n• You can request data deletion at any time\n\nFor complete details, see our Privacy Policy and Terms of Service."
    : "📋 **Kingdom Collective Policies**\n\nWe maintain transparent and fair policies for all our customers.\n\n**Refund Policy:**\n• Refunds available within 30 days of initial purchase\n• Refunds are not available for partial usage periods\n• Refund requests must be submitted through proper channels\n• Approved refunds processed within 10 business days\n\n**Privacy & Terms:**\n• We protect your data with industry-standard security\n• We comply with GDPR, CCPA, and other regulations\n• Your data is never shared without consent\n• You can request data deletion at any time\n\nFor complete details, see our Privacy Policy and Terms of Service.";
}

function generateGeneralResponse(results: any[], mode: 'faith' | 'marketplace'): string {
  const appResults = results.filter(r => r.type === 'app');
  
  if (appResults.length > 0) {
    const app = appResults[0].app;
    return mode === 'faith'
      ? `🔥 **${app.name}** - ${app.tagline}\n\n${app.description}\n\n**Key Features:**\n${app.features.slice(0, 5).map(f => `• ${f}`).join('\n')}\n\n**Pricing:** $${app.pricing.free} - $${app.pricing.enterprise}/month\n\n💡 **Biblical Foundation**: ${app.biblicalPrinciples?.[0] || 'Designed with wisdom and purpose'}\n\nWould you like to know more about ${app.name} or explore other apps?`
      : `**${app.name}** - ${app.tagline}\n\n${app.description}\n\n**Key Features:**\n${app.features.slice(0, 5).map(f => `• ${f}`).join('\n')}\n\n**Pricing:** $${app.pricing.free} - $${app.pricing.enterprise}/month\n\nWould you like to know more about ${app.name} or explore other apps?`;
  }
  
  return generateFallbackResponse(mode);
}

function generateFallbackResponse(mode: 'faith' | 'marketplace'): string {
  return mode === 'faith'
    ? "🤔 **Kingdom Collective Discovery** - Let me guide you!\n\nI'd love to help you explore our innovative apps and discover how technology can serve God's kingdom.\n\n**Popular Topics:**\n• Complete app suite overview\n• AI bots and automation\n• Pricing and stewardship\n• Biblical integration\n• Demo and examples\n• Company mission and values\n\n**Quick Start Options:**\n• Tell me about all your apps\n• Show me your AI bots\n• What's your pricing like?\n• Tell me about your mission\n• Compare your different apps\n\n💡 **Biblical Wisdom**: \"Ask and it will be given to you; seek and you will find\" (Matthew 7:7).\n\n**What would you like to explore today?**"
    : "**Kingdom Collective Discovery** - Let me guide you!\n\nI'd love to help you explore our innovative apps and discover how they can serve your business needs.\n\n**Popular Topics:**\n• Complete app suite overview\n• AI bots and automation\n• Pricing and packages\n• Features and benefits\n• Demo and examples\n• Company information\n\n**Quick Start Options:**\n• Tell me about all your apps\n• Show me your AI bots\n• What's your pricing like?\n• Tell me about your features\n• Compare your different apps\n\n**What would you like to explore today?**";
}

export { loadKnowledgeBase, searchKnowledgeBase, generateResponse };
