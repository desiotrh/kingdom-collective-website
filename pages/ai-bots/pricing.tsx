import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StripeCheckout from '../../components/StripeCheckout';

const botPricing = [
  {
    id: 'sales-assistant',
    name: 'Sales Assistant Bot',
    emoji: '💼',
    price: 299,
    description: 'Intelligent sales automation with lead qualification and follow-up capabilities',
    features: [
      'Lead qualification and scoring',
      'Product recommendations',
      'Follow-up automation',
      'Biblical communication standards',
      'CRM integration',
      'Performance analytics',
      'Custom sales scripts',
      'Email and SMS automation'
    ],
    category: 'Sales'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation Bot',
    emoji: '🎯',
    price: 249,
    description: 'Automated lead capture and qualification with CRM integration',
    features: [
      'Automated lead capture',
      'Qualification questions',
      'Appointment scheduling',
      'CRM integration',
      'Lead scoring',
      'Follow-up sequences',
      'Multi-channel capture',
      'Analytics dashboard'
    ],
    category: 'Sales'
  },
  {
    id: 'onboarding',
    name: 'Onboarding Bot',
    emoji: '📚',
    price: 199,
    description: 'Streamlined user onboarding with personalized guidance and tutorials',
    features: [
      'New user guidance',
      'Feature tutorials',
      'FAQ handling',
      'Personalized welcome',
      'Progress tracking',
      'Interactive walkthroughs',
      'Resource library',
      'Success metrics'
    ],
    category: 'Customer Success'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Bot',
    emoji: '💬',
    price: 349,
    description: '24/7 customer support with intelligent ticket routing and resolution',
    features: [
      '24/7 availability',
      'Ticket routing',
      'Knowledge base integration',
      'Empathetic responses',
      'Escalation handling',
      'Multi-language support',
      'Voice integration',
      'Customer satisfaction tracking'
    ],
    category: 'Support'
  },
  {
    id: 'faith-bot',
    name: 'Faith Bot',
    emoji: '🙏',
    price: 179,
    description: 'Biblical guidance and spiritual encouragement with prayer support',
    features: [
      'Biblical guidance',
      'Prayer requests',
      'Scripture recommendations',
      'Spiritual growth resources',
      'Daily devotionals',
      'Community prayer wall',
      'Faith-based counseling',
      'Biblical wisdom database'
    ],
    category: 'Spiritual'
  },
  {
    id: 'course-explainer',
    name: 'Course Explainer Bot',
    emoji: '🎓',
    price: 279,
    description: 'Educational content delivery with interactive learning experiences',
    features: [
      'Content delivery',
      'Interactive learning',
      'Progress tracking',
      'Adaptive learning',
      'Quiz and assessment',
      'Video integration',
      'Discussion forums',
      'Completion certificates'
    ],
    category: 'Education'
  },
  {
    id: 'testimonial',
    name: 'Testimonial Bot',
    emoji: '📝',
    price: 159,
    description: 'Automated customer feedback collection and testimonial generation',
    features: [
      'Feedback collection',
      'Review generation',
      'Success stories',
      'Social proof automation',
      'Rating systems',
      'Video testimonials',
      'Review management',
      'Reputation monitoring'
    ],
    category: 'Marketing'
  },
  {
    id: 'job-application',
    name: 'Job Application Bot',
    emoji: '💼',
    price: 229,
    description: 'Streamlined hiring process with application screening and interview scheduling',
    features: [
      'Application screening',
      'Interview scheduling',
      'Candidate communication',
      'Hiring automation',
      'Resume parsing',
      'Skill assessment',
      'Background checks',
      'Onboarding integration'
    ],
    category: 'HR'
  },
  {
    id: 'enhanced-sales',
    name: 'Enhanced Sales Bot',
    emoji: '🚀',
    price: 399,
    description: 'Advanced sales techniques with objection handling and closing strategies',
    features: [
      'Advanced techniques',
      'Objection handling',
      'Closing strategies',
      'Performance analytics',
      'AI-powered insights',
      'Sales coaching',
      'Pipeline management',
      'Revenue forecasting'
    ],
    category: 'Sales'
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking Bot',
    emoji: '📅',
    price: 189,
    description: 'Automated appointment scheduling with calendar integration and payment processing',
    features: [
      'Calendar integration',
      'Time zone handling',
      'Reminder notifications',
      'Rescheduling capabilities',
      'Payment processing',
      'Video call integration',
      'Service customization',
      'Booking analytics'
    ],
    category: 'Service'
  },
  {
    id: 'faq-knowledge',
    name: 'FAQ & Knowledge Base Bot',
    emoji: '❓',
    price: 159,
    description: 'Intelligent FAQ handling with context-aware responses and search capabilities',
    features: [
      'Intelligent search',
      'Context-aware responses',
      'Article suggestions',
      'Feedback collection',
      'Analytics tracking',
      'Multi-language support',
      'Knowledge base integration',
      'Self-learning capabilities'
    ],
    category: 'Support'
  },
  {
    id: 'event-management',
    name: 'Event Management Bot',
    emoji: '🎪',
    price: 229,
    description: 'Complete event management with registration, ticketing, and attendee coordination',
    features: [
      'Registration handling',
      'Ticket sales',
      'Attendee management',
      'Schedule coordination',
      'Networking facilitation',
      'Post-event surveys',
      'Payment processing',
      'Event analytics'
    ],
    category: 'Events'
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management Bot',
    emoji: '📦',
    price: 269,
    description: 'Comprehensive inventory tracking with stock alerts and demand forecasting',
    features: [
      'Stock tracking',
      'Reorder notifications',
      'Supplier communication',
      'Demand forecasting',
      'Barcode scanning',
      'Analytics reporting',
      'Multi-location support',
      'Automated ordering'
    ],
    category: 'Retail'
  },
  {
    id: 'social-media',
    name: 'Social Media Management Bot',
    emoji: '📱',
    price: 199,
    description: 'Automated social media management with content scheduling and engagement tracking',
    features: [
      'Content scheduling',
      'Hashtag optimization',
      'Engagement monitoring',
      'Trend analysis',
      'Cross-platform posting',
      'Performance metrics',
      'Content creation',
      'Audience insights'
    ],
    category: 'Marketing'
  }
];

const addOns = [
  {
    name: 'Custom Branding (colors, logo)',
    price: 50,
    emoji: '🔧',
    description: 'Customize colors, logos, and branding to match your company identity'
  },
  {
    name: 'VoiceBot Integration (Kingdom Voice)',
    price: 75,
    emoji: '🎤',
    description: 'Add voice capabilities using Kingdom Voice technology'
  },
  {
    name: 'Dual Tone Toggle (Faith + Marketplace)',
    price: 40,
    emoji: '💬',
    description: 'Switch between faith-based and marketplace communication styles'
  },
  {
    name: 'Memory Engine / Custom Trained FAQ',
    price: 125,
    emoji: '🧠',
    description: 'Custom training on your specific FAQ and knowledge base'
  },
  {
    name: 'Embed Service (We install it for them)',
    price: 60,
    emoji: '🌐',
    description: 'We handle the complete installation and setup process'
  },
  {
    name: 'Basic Analytics (Google Tag/Zapier/etc.)',
    price: 100,
    emoji: '📈',
    description: 'Integration with Google Analytics, Zapier, and other analytics tools'
  },
  {
    name: 'Legal & Compliance Disclaimers',
    price: 30,
    emoji: '🧾',
    description: 'Industry-specific legal disclaimers and compliance documentation'
  },
  {
    name: 'Stripe or Zapier Setup (requires API keys)',
    price: 125,
    emoji: '⚙️',
    description: 'Complete payment processing and automation setup'
  }
];

const bundles = [
  {
    name: 'Sales Suite',
    price: 799,
    description: 'Complete sales automation package',
    bots: ['sales-assistant', 'lead-generation', 'enhanced-sales'],
    savings: 148
  },
  {
    name: 'Support Suite',
    price: 549,
    description: 'Full customer support automation',
    bots: ['customer-support', 'onboarding'],
    savings: 99
  },
  {
    name: 'Complete Business Suite',
    price: 1499,
    description: 'Everything you need for business automation',
    bots: ['sales-assistant', 'lead-generation', 'customer-support', 'onboarding', 'testimonial'],
    savings: 347
  }
];

export default function AIBotsPricingPage() {
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const toggleBot = (botId: string) => {
    setSelectedBots(prev => 
      prev.includes(botId) 
        ? prev.filter(id => id !== botId)
        : [...prev, botId]
    );
  };

  const toggleAddOn = (addonName: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonName) 
        ? prev.filter(name => name !== addonName)
        : [...prev, addonName]
    );
  };

  const calculateTotal = () => {
    const botTotal = selectedBots.reduce((total, botId) => {
      const bot = botPricing.find(b => b.id === botId);
      return total + (bot?.price || 0);
    }, 0);

    const addonTotal = selectedAddOns.reduce((total, addonName) => {
      const addon = addOns.find(a => a.name === addonName);
      return total + (addon?.price || 0);
    }, 0);

    return botTotal + addonTotal;
  };

  return (
    <>
      <Head>
        <title>AI Bots Pricing - Kingdom Collective</title>
        <meta name="description" content="Transparent pricing for Kingdom AI Bots with customization add-ons. Choose the perfect automation solution for your business." />
      </Head>
      
      <Navigation />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              💰 <span className="text-kingdom-gold">Transparent Pricing</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Choose the perfect AI bot for your business needs. All pricing includes setup, 
              training, and ongoing support with biblical integrity.
            </p>
          </div>
        </section>

        {/* Delivery Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Delivery Methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/30">
                <h3 className="text-xl font-bold text-white mb-2">One-Time Purchase</h3>
                <p className="text-white/80 text-sm mb-4">Own your bot outright with no monthly fees</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$299-$1,499</div>
                <ul className="text-white/70 text-sm space-y-1 mb-4">
                  <li>• Bot setup & configuration</li>
                  <li>• Basic training included</li>
                  <li>• 30 days support</li>
                  <li>• Documentation</li>
                  <li>• No monthly fees</li>
                </ul>
                <div className="text-kingdom-gold text-xs font-medium">Perfect for small businesses & startups</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">Self-Service Platform</h3>
                <p className="text-white/80 text-sm mb-4">Monthly access to our platform</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$49-$199/month</div>
                <ul className="text-white/70 text-sm space-y-1 mb-4">
                  <li>• Platform access</li>
                  <li>• Regular updates</li>
                  <li>• Community support</li>
                  <li>• Basic analytics</li>
                </ul>
                <div className="text-kingdom-gold text-xs font-medium">For ongoing access & updates</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">Managed Service</h3>
                <p className="text-white/80 text-sm mb-4">Full-service with ongoing maintenance</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">One-time + monthly</div>
                <ul className="text-white/70 text-sm space-y-1 mb-4">
                  <li>• Complete setup</li>
                  <li>• Ongoing optimization</li>
                  <li>• Priority support</li>
                  <li>• Performance monitoring</li>
                </ul>
                <div className="text-kingdom-gold text-xs font-medium">For hands-off management</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">White-Label Solution</h3>
                <p className="text-white/80 text-sm mb-4">Resell under your own brand</p>
                <div className="text-2xl font-bold text-kingdom-gold mb-2">$299-$999/month</div>
                <ul className="text-white/70 text-sm space-y-1 mb-4">
                  <li>• Custom branding</li>
                  <li>• Multi-tenant setup</li>
                  <li>• Revenue sharing</li>
                  <li>• Agency support</li>
                </ul>
                <div className="text-kingdom-gold text-xs font-medium">For agencies & resellers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bundle Deals */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Bundle Deals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bundles.map((bundle) => (
                <div key={bundle.name} className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30">
                  <h3 className="text-2xl font-bold text-white mb-2">{bundle.name}</h3>
                  <p className="text-white/80 mb-4">{bundle.description}</p>
                  <div className="text-3xl font-bold text-kingdom-gold mb-2">${bundle.price}</div>
                  <div className="text-kingdom-gold/80 text-sm mb-4">Save ${bundle.savings}</div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Included Bots:</h4>
                    <ul className="space-y-1">
                      {bundle.bots.map((botId) => {
                        const bot = botPricing.find(b => b.id === botId);
                        return (
                          <li key={botId} className="text-white/70 text-sm flex items-center gap-2">
                            <span className="text-kingdom-gold">•</span>
                            {bot?.emoji} {bot?.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <Link href="/contact" className="w-full bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-bold text-center block hover:scale-105 transition-all duration-200">
                    Get Bundle
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Individual Bot Pricing */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Individual Bot Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {botPricing.map((bot) => (
                <div key={bot.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{bot.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                      <span className="text-kingdom-gold text-sm font-medium">{bot.category}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4 text-sm">{bot.description}</p>
                  
                  <div className="text-3xl font-bold text-kingdom-gold mb-4">${bot.price}</div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {bot.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                          <span className="text-kingdom-gold">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBot(bot.id)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                        selectedBots.includes(bot.id)
                          ? 'bg-kingdom-gold text-kingdom-dark'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {selectedBots.includes(bot.id) ? 'Selected' : 'Select'}
                    </button>
                    <Link href={`/ai-bots/${bot.id}`} className="bg-kingdom-gold/20 text-kingdom-gold px-4 py-2 rounded-lg text-sm font-medium hover:bg-kingdom-gold/30 transition-all duration-200">
                      Demo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Customization Add-ons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon) => (
                <div key={addon.name} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-kingdom-gold/50 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{addon.emoji}</span>
                    <span className="text-kingdom-gold font-bold">${addon.price}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{addon.name}</h3>
                  <p className="text-white/70 text-xs mb-3">{addon.description}</p>
                  <button
                    onClick={() => toggleAddOn(addon.name)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                      selectedAddOns.includes(addon.name)
                        ? 'bg-kingdom-gold text-kingdom-dark'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {selectedAddOns.includes(addon.name) ? 'Selected' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Summary */}
        {(selectedBots.length > 0 || selectedAddOns.length > 0) && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Your Order Summary</h2>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                {selectedBots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Selected Bots:</h3>
                    <div className="space-y-2">
                      {selectedBots.map((botId) => {
                        const bot = botPricing.find(b => b.id === botId);
                        return (
                          <div key={botId} className="flex justify-between items-center">
                            <span className="text-white">{bot?.emoji} {bot?.name}</span>
                            <span className="text-kingdom-gold font-bold">${bot?.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {selectedAddOns.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Selected Add-ons:</h3>
                    <div className="space-y-2">
                      {selectedAddOns.map((addonName) => {
                        const addon = addOns.find(a => a.name === addonName);
                        return (
                          <div key={addonName} className="flex justify-between items-center">
                            <span className="text-white">{addon?.emoji} {addon?.name}</span>
                            <span className="text-kingdom-gold font-bold">${addon?.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-kingdom-gold font-bold text-2xl">${calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-6 py-3 rounded-lg font-bold text-center hover:scale-105 transition-all duration-200"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBots([]);
                      setSelectedAddOns([]);
                    }}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">What's included in the bot price?</h3>
                <p className="text-white/70">Each bot includes setup, training, basic customization, and 30 days of support. Additional customization and integrations are available as add-ons.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">How long does setup take?</h3>
                <p className="text-white/70">Standard setup takes 3-5 business days. Custom integrations and branding may take 1-2 weeks depending on complexity.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Do you offer ongoing support?</h3>
                <p className="text-white/70">Yes! We offer 30 days of included support, with ongoing support packages available for continued assistance and updates.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Can I customize the bot's personality?</h3>
                <p className="text-white/70">Absolutely! We can customize the tone, personality, and communication style to match your brand and target audience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Contact us to discuss your specific needs and get a personalized quote for your AI bot solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200">
                Get Custom Quote
              </Link>
              <Link href="/ai-bots" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                View All Bots
              </Link>
            </div>
          </div>
        </section>

        {/* Stripe Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full">
              <StripeCheckout
                selectedBots={selectedBots}
                selectedAddOns={selectedAddOns}
                totalAmount={calculateTotal()}
                onSuccess={() => {
                  setShowCheckout(false);
                  setSelectedBots([]);
                  setSelectedAddOns([]);
                }}
                onCancel={() => setShowCheckout(false)}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
} 