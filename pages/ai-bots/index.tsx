import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

const aiBots = [
  {
    id: 'sales-assistant',
    name: 'Sales Assistant Bot',
    emoji: '💼',
    description: 'Intelligent sales automation with lead qualification and follow-up capabilities',
    features: ['Lead qualification', 'Product recommendations', 'Follow-up automation', 'Biblical communication standards'],
    price: '$299',
    demoUrl: '/ai-bots/sales-assistant',
    category: 'Sales'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation Bot',
    emoji: '🎯',
    description: 'Automated lead capture and qualification with CRM integration',
    features: ['Automated lead capture', 'Qualification questions', 'Appointment scheduling', 'CRM integration'],
    price: '$249',
    demoUrl: '/ai-bots/lead-generation',
    category: 'Sales'
  },
  {
    id: 'onboarding',
    name: 'Onboarding Bot',
    emoji: '📚',
    description: 'Streamlined user onboarding with personalized guidance and tutorials',
    features: ['New user guidance', 'Feature tutorials', 'FAQ handling', 'Personalized welcome'],
    price: '$199',
    demoUrl: '/ai-bots/onboarding',
    category: 'Customer Success'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Bot',
    emoji: '💬',
    description: '24/7 customer support with intelligent ticket routing and resolution',
    features: ['24/7 availability', 'Ticket routing', 'Knowledge base integration', 'Empathetic responses'],
    price: '$349',
    demoUrl: '/ai-bots/customer-support',
    category: 'Support'
  },
  {
    id: 'faith-bot',
    name: 'Faith Bot',
    emoji: '🙏',
    description: 'Biblical guidance and spiritual encouragement with prayer support',
    features: ['Biblical guidance', 'Prayer requests', 'Scripture recommendations', 'Spiritual growth resources'],
    price: '$179',
    demoUrl: '/ai-bots/faith-bot',
    category: 'Spiritual'
  },
  {
    id: 'course-explainer',
    name: 'Course Explainer Bot',
    emoji: '🎓',
    description: 'Educational content delivery with interactive learning experiences',
    features: ['Content delivery', 'Interactive learning', 'Progress tracking', 'Adaptive learning'],
    price: '$279',
    demoUrl: '/ai-bots/course-explainer',
    category: 'Education'
  },
  {
    id: 'testimonial',
    name: 'Testimonial Bot',
    emoji: '📝',
    description: 'Automated customer feedback collection and testimonial generation',
    features: ['Feedback collection', 'Review generation', 'Success stories', 'Social proof automation'],
    price: '$159',
    demoUrl: '/ai-bots/testimonial',
    category: 'Marketing'
  },
  {
    id: 'job-application',
    name: 'Job Application Bot',
    emoji: '💼',
    description: 'Streamlined hiring process with application screening and interview scheduling',
    features: ['Application screening', 'Interview scheduling', 'Candidate communication', 'Hiring automation'],
    price: '$229',
    demoUrl: '/ai-bots/job-application',
    category: 'HR'
  },
  {
    id: 'enhanced-sales',
    name: 'Enhanced Sales Bot',
    emoji: '🚀',
    description: 'Advanced sales techniques with objection handling and closing strategies',
    features: ['Advanced techniques', 'Objection handling', 'Closing strategies', 'Performance analytics'],
    price: '$399',
    demoUrl: '/ai-bots/enhanced-sales',
    category: 'Sales'
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking Bot',
    emoji: '📅',
    description: 'Automated appointment scheduling with calendar integration and payment processing',
    features: ['Calendar integration', 'Time zone handling', 'Reminder notifications', 'Payment processing'],
    price: '$189',
    demoUrl: '/ai-bots/appointment-booking',
    category: 'Service'
  },
  {
    id: 'faq-knowledge',
    name: 'FAQ & Knowledge Base Bot',
    emoji: '❓',
    description: 'Intelligent FAQ handling with context-aware responses and search capabilities',
    features: ['Intelligent search', 'Context-aware responses', 'Article suggestions', 'Multi-language support'],
    price: '$159',
    demoUrl: '/ai-bots/faq-knowledge',
    category: 'Support'
  },
  {
    id: 'event-management',
    name: 'Event Management Bot',
    emoji: '🎪',
    description: 'Complete event management with registration, ticketing, and attendee coordination',
    features: ['Registration handling', 'Ticket sales', 'Attendee management', 'Schedule coordination'],
    price: '$229',
    demoUrl: '/ai-bots/event-management',
    category: 'Events'
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management Bot',
    emoji: '📦',
    description: 'Comprehensive inventory tracking with stock alerts and demand forecasting',
    features: ['Stock tracking', 'Reorder notifications', 'Supplier communication', 'Demand forecasting'],
    price: '$269',
    demoUrl: '/ai-bots/inventory-management',
    category: 'Retail'
  },
  {
    id: 'social-media',
    name: 'Social Media Management Bot',
    emoji: '📱',
    description: 'Automated social media management with content scheduling and engagement tracking',
    features: ['Content scheduling', 'Hashtag optimization', 'Engagement monitoring', 'Cross-platform posting'],
    price: '$199',
    demoUrl: '/ai-bots/social-media',
    category: 'Marketing'
  }
];

const addOns = [
  { name: 'Custom Branding (colors, logo)', price: '$50', emoji: '🔧' },
  { name: 'VoiceBot Integration (Kingdom Voice)', price: '$75', emoji: '🎤' },
  { name: 'Dual Tone Toggle (Faith + Marketplace)', price: '$40', emoji: '💬' },
  { name: 'Memory Engine / Custom Trained FAQ', price: '$125', emoji: '🧠' },
  { name: 'Embed Service (We install it for them)', price: '$60', emoji: '🌐' },
  { name: 'Basic Analytics (Google Tag/Zapier/etc.)', price: '$100', emoji: '📈' },
  { name: 'Legal & Compliance Disclaimers', price: '$30', emoji: '🧾' },
  { name: 'Stripe or Zapier Setup (requires API keys)', price: '$125', emoji: '⚙️' }
];

export default function AIBotsPage() {
  return (
    <>
      <Head>
        <title>AI Bots - Kingdom Collective</title>
        <meta name="description" content="Intelligent AI bots for businesses and individuals. Sales, support, education, and more with biblical integrity." />
      </Head>
      
      <Navigation />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🤖 AI Bots with <span className="text-kingdom-gold">Kingdom Purpose</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Intelligent automation that serves your business needs while maintaining biblical integrity. 
              Each bot is designed with wisdom and purpose to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-bots/pricing" className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200">
                View Pricing & Add-ons
              </Link>
              <Link href="#demo" className="bg-white/10 text-white px-8 py-3 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                Try Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Bot Categories */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Bot Category</h2>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {['Sales', 'Support', 'Education', 'Spiritual', 'Marketing', 'HR', 'Service', 'Events', 'Retail'].map((category) => (
                <div key={category} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                  <h3 className="text-xl font-bold text-white mb-2">{category}</h3>
                                     <p className="text-white/70 text-sm">
                     {category === 'Sales' && 'Lead generation, qualification, and closing'}
                     {category === 'Support' && 'Customer service and technical support'}
                     {category === 'Education' && 'Learning and training automation'}
                     {category === 'Spiritual' && 'Biblical guidance and faith support'}
                     {category === 'Marketing' && 'Content creation and testimonial collection'}
                     {category === 'HR' && 'Hiring and employee management'}
                     {category === 'Service' && 'Appointment booking and service management'}
                     {category === 'Events' && 'Event planning and management'}
                     {category === 'Retail' && 'Inventory and retail management'}
                   </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Bots Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">All AI Bots</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiBots.map((bot) => (
                <div key={bot.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200 group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{bot.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                      <span className="text-kingdom-gold text-sm font-medium">{bot.category}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4 text-sm">{bot.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {bot.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                          <span className="text-kingdom-gold">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-kingdom-gold">{bot.price}</span>
                    <div className="flex gap-2">
                      <Link href={bot.demoUrl} className="bg-kingdom-gold/20 text-kingdom-gold px-4 py-2 rounded-lg text-sm font-medium hover:bg-kingdom-gold/30 transition-all duration-200">
                        Demo
                      </Link>
                      <Link href={`/ai-bots/${bot.id}`} className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-all duration-200">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Delivery Methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/30">
                <h3 className="text-xl font-bold text-white mb-2">One-Time Purchase</h3>
                <p className="text-white/80 text-sm mb-4">Own your bot outright</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$299-$1,499</div>
                <div className="text-kingdom-gold text-xs font-medium">No monthly fees</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">Self-Service Platform</h3>
                <p className="text-white/80 text-sm mb-4">Monthly access</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$49-$199/month</div>
                <div className="text-kingdom-gold text-xs font-medium">Regular updates</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">Managed Service</h3>
                <p className="text-white/80 text-sm mb-4">Full-service</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">One-time + monthly</div>
                <div className="text-kingdom-gold text-xs font-medium">Hands-off management</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">White-Label</h3>
                <p className="text-white/80 text-sm mb-4">Resell under your brand</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$299-$999/month</div>
                <div className="text-kingdom-gold text-xs font-medium">For agencies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Customization Add-ons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{addon.emoji}</span>
                    <span className="text-kingdom-gold font-bold">{addon.price}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{addon.name}</h3>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/ai-bots/pricing" className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200">
                View Complete Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-kingdom-dark">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Bot</h3>
                <p className="text-white/70">Select from our range of specialized AI bots designed for different business needs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-kingdom-dark">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customize & Configure</h3>
                <p className="text-white/70">Add custom branding, integrations, and features to match your specific requirements</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-kingdom-dark">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Deploy & Scale</h3>
                <p className="text-white/70">We handle the installation and setup, then you can scale as your business grows</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of businesses using Kingdom AI Bots to automate, scale, and serve with excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-bots/pricing" className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200">
                Get Started Today
              </Link>
              <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                Schedule Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 