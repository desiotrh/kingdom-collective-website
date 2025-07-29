import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Contact() {
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqResponse, setFaqResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contactCategories = [
    {
      title: 'General Support',
      description: 'Questions about our platform, features, or general inquiries',
      email: 'support@kingdomcollective.pro',
      icon: '💬'
    },
    {
      title: 'Technical Issues',
      description: 'Bug reports, technical problems, or platform issues',
      email: 'tech@kingdomcollective.pro',
      icon: '🔧'
    },
    {
      title: 'Business & Partnerships',
      description: 'Partnership opportunities, business inquiries, or enterprise solutions',
      email: 'business@kingdomcollective.pro',
      icon: '🤝'
    },
    {
      title: 'Content & Creators',
      description: 'Creator support, content strategy, or platform guidance',
      email: 'creators@kingdomcollective.pro',
      icon: '🎬'
    },
    {
      title: 'Billing & Payments',
      description: 'Payment issues, subscription questions, or billing support',
      email: 'billing@kingdomcollective.pro',
      icon: '💳'
    },
    {
      title: 'Prayer & Spiritual Support',
      description: 'Spiritual guidance, prayer requests, or faith-based questions',
      email: 'prayer@kingdomcollective.pro',
      icon: '🙏'
    }
  ];

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim()) return;

    setIsLoading(true);
    setFaqResponse('');

    // Comprehensive AI knowledge base about all Kingdom apps
    const question = faqQuestion.toLowerCase();
    
    setTimeout(() => {
      let response = '';
      
      // Kingdom Studios
      if (question.includes('kingdom studios') || question.includes('content creation') || question.includes('video editing')) {
        response = "Kingdom Studios is our flagship content creation hub designed for faith-driven visionaries. It includes AI-powered editing tools, creator analytics, community building features, monetization tools, and multi-platform publishing capabilities. Perfect for creators who want to make a lasting impact while growing their digital presence.";
      }
      // Kingdom Clips
      else if (question.includes('kingdom clips') || question.includes('short form') || question.includes('tiktok') || question.includes('reels')) {
        response = "Kingdom Clips is our short-form video creation platform perfect for TikTok, Instagram Reels, and YouTube Shorts. It features video templates, AI script generation, trend analysis, faith-based themes, multi-platform export, and community collaboration tools. Great for creators who want to engage audiences with quick, impactful content.";
      }
      // Kingdom Voice
      else if (question.includes('kingdom voice') || question.includes('podcast') || question.includes('audio') || question.includes('voice')) {
        response = "Kingdom Voice transforms your message into powerful audio content. It includes podcast creation tools, voice recording capabilities, audio editing features, script generation, distribution tools, and analytics dashboard. Perfect for spiritual leaders, podcasters, and content creators who want to amplify their voice.";
      }
      // Kingdom Launchpad
      else if (question.includes('kingdom launchpad') || question.includes('course') || question.includes('digital product') || question.includes('business')) {
        response = "Kingdom Launchpad is your complete business launch platform for digital products and courses. It includes course creation tools, digital product management, payment processing, student management, marketing tools, and analytics & insights. Everything you need to create, sell, and scale your knowledge-based business.";
      }
      // Kingdom Circle
      else if (question.includes('kingdom circle') || question.includes('community') || question.includes('group')) {
        response = "Kingdom Circle is our community building platform designed to create meaningful connections. It features community building tools, event hosting capabilities, group management, prayer requests, resource sharing, and member analytics. Perfect for building and nurturing communities with purpose.";
      }
      // Kingdom Lens
      else if (question.includes('kingdom lens') || question.includes('photo') || question.includes('photography')) {
        response = "Kingdom Lens helps you capture life's beautiful moments with purpose. It includes photo planning tools, editing capabilities, story templates, faith-based themes, social sharing features, and portfolio building. Designed for creatives of faith who want to share their vision through photography.";
      }
      // Faith Mode
      else if (question.includes('faith mode') || question.includes('spiritual') || question.includes('biblical')) {
        response = "Faith Mode is for those who want to build fully surrendered and Spirit-led, with tools that integrate scripture, spiritual growth checkpoints, prophetic creativity, and reminders to walk in step with the Holy Spirit.";
      }
      // Encouragement Mode
      else if (question.includes('encouragement mode') || question.includes('uplifting')) {
        response = "Encouragement Mode offers the same excellence and strategy, but in a tone that's uplifting, empowering, and full of truth — designed for those still exploring or rebuilding their relationship with God.";
      }
      // Pricing
      else if (question.includes('pricing') || question.includes('cost') || question.includes('price')) {
        response = "Our pricing varies by app and plan. Each app has its own pricing tiers designed for different needs. You can find detailed pricing on each individual app page (/kingdom-studios, /kingdom-clips, etc.) or contact billing@kingdomcollective.pro for specific questions about pricing and plans.";
      }
      // Technical Support
      else if (question.includes('technical') || question.includes('bug') || question.includes('problem') || question.includes('issue') || question.includes('error') || question.includes('not working')) {
        response = "For technical issues, please email tech@kingdomcollective.pro with specific details about the problem you're experiencing. Include your app name, device type, browser version, and steps to reproduce the issue. Our technical team will get back to you within 24 hours. For immediate help, try clearing your browser cache, updating your browser, or using a different device.";
      }
      // Login Issues
      else if (question.includes('login') || question.includes('sign in') || question.includes('password') || question.includes('account') || question.includes('access')) {
        response = "Having trouble logging in? Try these steps: 1) Clear your browser cache and cookies, 2) Make sure you're using the correct email address, 3) Use the 'Forgot Password' link if needed, 4) Try a different browser or device. If you're still having issues, email tech@kingdomcollective.pro with your email address and we'll help you regain access to your account.";
      }
      // Troubleshooting
      else if (question.includes('troubleshoot') || question.includes('fix') || question.includes('broken') || question.includes('crash') || question.includes('freeze')) {
        response = "Here are some common troubleshooting steps: 1) Refresh the page, 2) Clear browser cache and cookies, 3) Try a different browser (Chrome, Firefox, Safari), 4) Check your internet connection, 5) Disable browser extensions temporarily, 6) Update your browser to the latest version. If the problem persists, email tech@kingdomcollective.pro with specific details.";
      }
      // General Features
      else if (question.includes('feature') || question.includes('what can') || question.includes('how does')) {
        response = "Each Kingdom app is designed with specific features for different types of creators. Kingdom Studios focuses on content creation and monetization, Kingdom Clips on short-form video, Kingdom Voice on audio content, Kingdom Launchpad on business tools, Kingdom Circle on community building, and Kingdom Lens on photography. All apps work together seamlessly with cross-platform sync and unified analytics.";
      }
      // Integration
      else if (question.includes('integration') || question.includes('work together') || question.includes('sync')) {
        response = "All our apps work together as one unified ecosystem. Content and data sync seamlessly across platforms, you have one unified community across all apps, and centralized analytics track your impact across all platforms from one dashboard. This creates a complete workflow for faith-driven creators.";
      }
      // Default response
      else {
        response = "I'm here to help with any questions about our Kingdom apps! Each app is designed for specific creator needs: Kingdom Studios (content creation), Kingdom Clips (short-form video), Kingdom Voice (audio/podcasts), Kingdom Launchpad (business/courses), Kingdom Circle (community), and Kingdom Lens (photography). What specific app or feature would you like to know more about?";
      }
      
      setFaqResponse(response);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Get in <span className="text-blue">Touch</span>
            </h1>
            <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              We&apos;re here to help you succeed. Choose the right contact method for your needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {contactCategories.map((category, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-6 hover:bg-black/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-3">{category.title}</h3>
                  <p className="text-white leading-relaxed mb-4">{category.description}</p>
                  <a 
                    href={`mailto:${category.email}`}
                    className="text-blue hover:text-blue/80 transition-colors duration-200 font-medium"
                  >
                    {category.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* FAQ AI Bot Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                AI <span className="text-blue">Assistant</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal max-w-3xl mx-auto">
                Get instant answers to common questions with our AI-powered FAQ assistant.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-8">
              <form onSubmit={handleFaqSubmit} className="space-y-6">
                <div>
                  <label htmlFor="faq-question" className="block text-white font-medium mb-2">
                    Ask your question:
                  </label>
                  <textarea
                    id="faq-question"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full p-4 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
                    rows={4}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !faqQuestion.trim()}
                                          className="bg-gray text-white px-6 py-3 rounded-full font-bold hover:bg-blue hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Thinking...' : 'Ask AI Assistant'}
                </button>
              </form>

              {faqResponse && (
                <div className="mt-8 p-6 bg-blue/10 border border-blue/30 rounded-xl">
                  <h3 className="text-blue font-bold mb-3">AI Response:</h3>
                  <p className="text-white leading-relaxed">{faqResponse}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Additional Support Section */}
        <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Ready to <span className="text-blue">Get Started</span>?
            </h2>
            <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Explore our apps and start creating with purpose today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-white text-xl font-bold mb-3">Explore Our Apps</h3>
                <p className="text-white">Discover all the tools in the Kingdom Collective suite.</p>
                <Link href="/apps" className="inline-block mt-4 text-blue hover:text-blue/80 transition-colors duration-200 font-medium">
                  Browse Apps →
                </Link>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-white text-xl font-bold mb-3">Learn Our Vision</h3>
                <p className="text-white">Understand how we&apos;re empowering creators with purpose.</p>
                <Link href="/vision" className="inline-block mt-4 text-blue hover:text-blue/80 transition-colors duration-200 font-medium">
                  Our Vision →
                </Link>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-white text-xl font-bold mb-3">Visit Our Store</h3>
                <p className="text-white">Find courses, templates, and resources to enhance your journey.</p>
                <a href="https://desitotrh.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue hover:text-blue/80 transition-colors duration-200 font-medium">
                  Shop Now →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 