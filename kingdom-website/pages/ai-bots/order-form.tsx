import React, { useState } from 'react';
import Head from 'next/head';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

const bots = [
  { id: 'sales-assistant', name: 'Sales Assistant Bot', price: 299 },
  { id: 'lead-generation', name: 'Lead Generation Bot', price: 249 },
  { id: 'onboarding', name: 'Onboarding Bot', price: 199 },
  { id: 'customer-support', name: 'Customer Support Bot', price: 349 },
  { id: 'faith-bot', name: 'Faith Bot', price: 179 },
  { id: 'course-explainer', name: 'Course Explainer Bot', price: 279 },
  { id: 'testimonial', name: 'Testimonial Bot', price: 159 },
  { id: 'job-application', name: 'Job Application Bot', price: 229 },
  { id: 'enhanced-sales', name: 'Enhanced Sales Bot', price: 399 }
];

const addOns = [
  { id: 'custom-branding', name: 'Custom Branding (colors, logo)', price: 50 },
  { id: 'voicebot-integration', name: 'VoiceBot Integration (Kingdom Voice)', price: 75 },
  { id: 'dual-tone', name: 'Dual Tone Toggle (Faith + Marketplace)', price: 40 },
  { id: 'memory-engine', name: 'Memory Engine / Custom Trained FAQ', price: 125 },
  { id: 'embed-service', name: 'Embed Service (We install it for them)', price: 60 },
  { id: 'analytics', name: 'Basic Analytics (Google Tag/Zapier/etc.)', price: 100 },
  { id: 'legal-compliance', name: 'Legal &amp; Compliance Disclaimers', price: 30 },
  { id: 'stripe-zapier', name: 'Stripe or Zapier Setup (requires API keys)', price: 125 }
];

const bundles = [
  {
    id: 'sales-suite',
    name: 'Sales Suite',
    price: 799,
    bots: ['sales-assistant', 'lead-generation', 'enhanced-sales'],
    savings: 148
  },
  {
    id: 'support-suite',
    name: 'Support Suite',
    price: 549,
    bots: ['customer-support', 'onboarding'],
    savings: 99
  },
  {
    id: 'complete-business',
    name: 'Complete Business Suite',
    price: 1499,
    bots: ['sales-assistant', 'lead-generation', 'customer-support', 'onboarding', 'testimonial'],
    savings: 347
  }
];

export default function OrderForm() {
  const [formData, setFormData] = useState({
    // Client Information
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    companySize: '',
    
    // Bot Selection
    selectedBots: [] as string[],
    selectedAddOns: [] as string[],
    selectedBundle: '',
    
    // Customization
    brandColors: '',
    logoUrl: '',
    customTone: '',
    specificFeatures: '',
    
    // Integration Requirements
    crmSystem: '',
    paymentProcessor: '',
    analyticsTools: '',
    otherIntegrations: '',
    
    // Timeline & Budget
    timeline: '',
    budget: '',
    urgency: '',
    
    // Additional Information
    useCase: '',
    targetAudience: '',
    expectedVolume: '',
    specialRequirements: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleBot = (botId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedBots: prev.selectedBots.includes(botId)
        ? prev.selectedBots.filter(id => id !== botId)
        : [...prev.selectedBots, botId]
    }));
  };

  const toggleAddOn = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addonId)
        ? prev.selectedAddOns.filter(id => id !== addonId)
        : [...prev.selectedAddOns, addonId]
    }));
  };

  const selectBundle = (bundleId: string) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (bundle) {
      setFormData(prev => ({
        ...prev,
        selectedBundle: bundleId,
        selectedBots: bundle.bots
      }));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add bundle price if selected
    if (formData.selectedBundle) {
      const bundle = bundles.find(b => b.id === formData.selectedBundle);
      if (bundle) total += bundle.price;
    } else {
      // Add individual bot prices
      formData.selectedBots.forEach(botId => {
        const bot = bots.find(b => b.id === botId);
        if (bot) total += bot.price;
      });
    }
    
    // Add add-on prices
    formData.selectedAddOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Here you would typically send the data to your backend
    console.log('Order Form Data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      alert('Thank you for your order! We will contact you within 24 hours to discuss your requirements.');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Order Chatbots - Kingdom Collective</title>
        <meta name="description" content="Order your custom chatbot solution. Professional chatbots trained for your business needs." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Order Your Chatbot
                  </h1>
                  <p className="text-2xl text-kingdom-gold font-semibold mb-4">
                    Custom Chatbot Solutions for Your Business
                  </p>
                  <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                    Tell us about your needs and we&apos;ll create the perfect chatbot solution for your business.
                  </p>
                </div>
              </div>
            </section>

            {/* Form Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-medium">Step {currentStep} of 6</span>
                      <span className="text-kingdom-gold font-medium">{Math.round((currentStep / 6) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Form Steps */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Client Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2">Company Name *</label>
                          <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="Your company name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Contact Name *</label>
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="your@email.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Website</label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Industry</label>
                          <select
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select industry</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="consulting">Consulting</option>
                            <option value="technology">Technology</option>
                            <option value="non-profit">Non-Profit</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="btn-kingdom-primary"
                        >
                          Next: Bot Selection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Continue with other steps... */}
                  {/* Step 2: Bot Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Bot Selection</h2>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-kingdom-gold mb-4">Individual Bots</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {bots.map((bot) => (
                            <div
                              key={bot.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                formData.selectedBots.includes(bot.id)
                                  ? 'bg-kingdom-gold/20 border-kingdom-gold'
                                  : 'bg-white/5 border-white/20 hover:bg-white/10'
                              }`}
                              onClick={() => toggleBot(bot.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-white font-medium">{bot.name}</h4>
                                  <p className="text-white/70 text-sm">${bot.price}</p>
                                </div>
                                <div className={`w-5 h-5 rounded border-2 ${
                                  formData.selectedBots.includes(bot.id)
                                    ? 'bg-kingdom-gold border-kingdom-gold'
                                    : 'border-white/30'
                                }`}>
                                  {formData.selectedBots.includes(bot.id) && (
                                    <svg className="w-3 h-3 text-navy" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-kingdom-gold mb-4 mt-8">Bundle Deals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {bundles.map((bundle) => (
                            <div
                              key={bundle.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                formData.selectedBundle === bundle.id
                                  ? 'bg-kingdom-gold/20 border-kingdom-gold'
                                  : 'bg-white/5 border-white/20 hover:bg-white/10'
                              }`}
                              onClick={() => selectBundle(bundle.id)}
                            >
                              <div className="text-center">
                                <h4 className="text-white font-medium">{bundle.name}</h4>
                                <p className="text-kingdom-gold font-bold text-lg">${bundle.price}</p>
                                <p className="text-white/70 text-sm">Save ${bundle.savings}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="btn-kingdom-secondary"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="btn-kingdom-primary"
                        >
                          Next: Add-ons
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Continue with remaining steps... */}
                  {/* For brevity, I'll add the remaining steps structure */}
                  
                  {/* Step 3: Add-ons */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Add-ons &amp; Customization</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addOns.map((addon) => (
                          <div
                            key={addon.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              formData.selectedAddOns.includes(addon.id)
                                ? 'bg-kingdom-gold/20 border-kingdom-gold'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => toggleAddOn(addon.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-white font-medium">{addon.name}</h4>
                                <p className="text-kingdom-gold text-sm">${addon.price}</p>
                              </div>
                              <div className={`w-5 h-5 rounded border-2 ${
                                formData.selectedAddOns.includes(addon.id)
                                  ? 'bg-kingdom-gold border-kingdom-gold'
                                  : 'border-white/30'
                              }`}>
                                {formData.selectedAddOns.includes(addon.id) && (
                                  <svg className="w-3 h-3 text-navy" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="btn-kingdom-secondary"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentStep(4)}
                          className="btn-kingdom-primary"
                        >
                          Next: Customization
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Customization */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Customization</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Brand Colors</label>
                          <input
                            type="text"
                            value={formData.brandColors}
                            onChange={(e) => handleInputChange('brandColors', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="e.g., #FF6B35, #2C3E50"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Logo URL</label>
                          <input
                            type="url"
                            value={formData.logoUrl}
                            onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="https://yourwebsite.com/logo.png"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Custom Tone</label>
                          <textarea
                            value={formData.customTone}
                            onChange={(e) => handleInputChange('customTone', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            rows={3}
                            placeholder="Describe the tone and personality you want for your chatbot..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Specific Features</label>
                          <textarea
                            value={formData.specificFeatures}
                            onChange={(e) => handleInputChange('specificFeatures', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            rows={3}
                            placeholder="Any specific features or functionality you need..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="btn-kingdom-secondary"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentStep(5)}
                          className="btn-kingdom-primary"
                        >
                          Next: Integration
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Integration */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Integration Requirements</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">CRM System</label>
                          <select
                            value={formData.crmSystem}
                            onChange={(e) => handleInputChange('crmSystem', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select CRM</option>
                            <option value="hubspot">HubSpot</option>
                            <option value="salesforce">Salesforce</option>
                            <option value="pipedrive">Pipedrive</option>
                            <option value="zoho">Zoho</option>
                            <option value="none">None</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Payment Processor</label>
                          <select
                            value={formData.paymentProcessor}
                            onChange={(e) => handleInputChange('paymentProcessor', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select payment processor</option>
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                            <option value="square">Square</option>
                            <option value="none">None</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Analytics Tools</label>
                          <input
                            type="text"
                            value={formData.analyticsTools}
                            onChange={(e) => handleInputChange('analyticsTools', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            placeholder="Google Analytics, Facebook Pixel, etc."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Other Integrations</label>
                          <textarea
                            value={formData.otherIntegrations}
                            onChange={(e) => handleInputChange('otherIntegrations', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                            rows={3}
                            placeholder="Any other systems or tools you need to integrate with..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(4)}
                          className="btn-kingdom-secondary"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentStep(6)}
                          className="btn-kingdom-primary"
                        >
                          Next: Final Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Final Details */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Final Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2">Timeline</label>
                          <select
                            value={formData.timeline}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select timeline</option>
                            <option value="asap">ASAP</option>
                            <option value="1-2-weeks">1-2 weeks</option>
                            <option value="2-4-weeks">2-4 weeks</option>
                            <option value="1-2-months">1-2 months</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Budget Range</label>
                          <select
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select budget range</option>
                            <option value="under-500">Under $500</option>
                            <option value="500-1000">$500 - $1,000</option>
                            <option value="1000-2000">$1,000 - $2,000</option>
                            <option value="2000-5000">$2,000 - $5,000</option>
                            <option value="over-5000">Over $5,000</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Urgency Level</label>
                          <select
                            value={formData.urgency}
                            onChange={(e) => handleInputChange('urgency', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select urgency</option>
                            <option value="low">Low - No rush</option>
                            <option value="medium">Medium - Within a month</option>
                            <option value="high">High - Need it soon</option>
                            <option value="urgent">Urgent - ASAP</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Expected Volume</label>
                          <select
                            value={formData.expectedVolume}
                            onChange={(e) => handleInputChange('expectedVolume', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-kingdom-gold"
                          >
                            <option value="">Select expected volume</option>
                            <option value="low">Low - Under 100 conversations/month</option>
                            <option value="medium">Medium - 100-1000 conversations/month</option>
                            <option value="high">High - 1000-10000 conversations/month</option>
                            <option value="enterprise">Enterprise - 10000+ conversations/month</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Use Case</label>
                        <textarea
                          value={formData.useCase}
                          onChange={(e) => handleInputChange('useCase', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          rows={3}
                          placeholder="Describe your primary use case for the chatbot..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Target Audience</label>
                        <textarea
                          value={formData.targetAudience}
                          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          rows={2}
                          placeholder="Who will be interacting with your chatbot?"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Special Requirements</label>
                        <textarea
                          value={formData.specialRequirements}
                          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-kingdom-gold"
                          rows={3}
                          placeholder="Any special requirements, compliance needs, or unique features..."
                        />
                      </div>
                      
                      {/* Order Summary */}
                      <div className="bg-white/5 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                        <div className="space-y-2">
                          {formData.selectedBots.length > 0 && (
                            <div>
                              <h4 className="text-kingdom-gold font-medium">Selected Bots:</h4>
                              <ul className="text-white/80 text-sm ml-4">
                                {formData.selectedBots.map(botId => {
                                  const bot = bots.find(b => b.id === botId);
                                  return <li key={botId}>• {bot?.name} - ${bot?.price}</li>;
                                })}
                              </ul>
                            </div>
                          )}
                          
                          {formData.selectedAddOns.length > 0 && (
                            <div>
                              <h4 className="text-kingdom-gold font-medium">Selected Add-ons:</h4>
                              <ul className="text-white/80 text-sm ml-4">
                                {formData.selectedAddOns.map(addonId => {
                                  const addon = addOns.find(a => a.id === addonId);
                                  return <li key={addonId}>• {addon?.name} - ${addon?.price}</li>;
                                })}
                              </ul>
                            </div>
                          )}
                          
                          <div className="border-t border-white/20 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-medium">Total:</span>
                              <span className="text-kingdom-gold font-bold text-xl">${calculateTotal()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(5)}
                          className="btn-kingdom-secondary"
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="btn-kingdom-primary"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
} 