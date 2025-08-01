import React, { useState } from 'react';
import Head from 'next/head';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

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
  { id: 'legal-compliance', name: 'Legal & Compliance Disclaimers', price: 30 },
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
        <title>AI Bot Order Form - Kingdom Collective</title>
        <meta name="description" content="Order your custom AI bot with comprehensive setup and customization options." />
      </Head>
      
      <Navigation />
      
      <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🤖 Order Your AI Bot
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Let&apos;s build the perfect AI bot for your business. Fill out this form and we&apos;ll create a customized solution just for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Step 1: Client Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Industry</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="education">Education</option>
                      <option value="financial">Financial Services</option>
                      <option value="consulting">Consulting</option>
                      <option value="church">Church/Ministry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200"
                  >
                    Next: Bot Selection
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Bot Selection */}
            {currentStep === 2 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Step 2: Bot Selection</h2>
                
                {/* Bundle Options */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Bundle Options (Save Money!)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
                          formData.selectedBundle === bundle.id
                            ? 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border-kingdom-gold/50'
                            : 'bg-white/5 border-white/10 hover:border-kingdom-gold/50'
                        }`}
                        onClick={() => selectBundle(bundle.id)}
                      >
                        <h4 className="text-white font-bold mb-2">{bundle.name}</h4>
                        <div className="text-2xl font-bold text-kingdom-gold mb-2">${bundle.price}</div>
                        <div className="text-kingdom-gold/80 text-sm mb-3">Save ${bundle.savings}</div>
                        <ul className="text-white/70 text-sm space-y-1">
                          {bundle.bots.map((botId) => {
                            const bot = bots.find(b => b.id === botId);
                            return (
                              <li key={botId} className="flex items-center gap-2">
                                <span>{bot?.name}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Bot Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Or Select Individual Bots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bots.map((bot) => (
                      <div
                        key={bot.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                          formData.selectedBots.includes(bot.id)
                            ? 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border-kingdom-gold/50'
                            : 'bg-white/5 border-white/10 hover:border-kingdom-gold/50'
                        }`}
                        onClick={() => toggleBot(bot.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{bot.name}</span>
                          </div>
                          <span className="text-kingdom-gold font-bold">${bot.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Customization Add-ons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.map((addon) => (
                      <div
                        key={addon.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                          formData.selectedAddOns.includes(addon.id)
                            ? 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border-kingdom-gold/50'
                            : 'bg-white/5 border-white/10 hover:border-kingdom-gold/50'
                        }`}
                        onClick={() => toggleAddOn(addon.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{addon.name}</span>
                          <span className="text-kingdom-gold font-bold">${addon.price}</span>
                        </div>
                        <div className="text-white/80 text-sm">{addon.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-kingdom-gold/10 to-kingdom-orange/10 rounded-lg p-6 border border-kingdom-gold/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-kingdom-gold font-bold text-2xl">${calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200"
                  >
                    Next: Customization
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Customization */}
            {currentStep === 3 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Step 3: Customization</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Brand Colors (hex codes)</label>
                    <input
                      type="text"
                      placeholder="#FF6B35, #144E9C"
                      value={formData.brandColors}
                      onChange={(e) => handleInputChange('brandColors', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Logo URL</label>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com/logo.png"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Communication Tone</label>
                    <select
                      value={formData.customTone}
                      onChange={(e) => handleInputChange('customTone', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Tone</option>
                      <option value="professional">Professional & Formal</option>
                      <option value="friendly">Friendly & Casual</option>
                      <option value="faith-based">Faith-based & Inspirational</option>
                      <option value="technical">Technical & Detailed</option>
                      <option value="conversational">Conversational & Natural</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Specific Features Needed</label>
                    <textarea
                      placeholder="Describe any specific features or functionality you need..."
                      value={formData.specificFeatures}
                      onChange={(e) => handleInputChange('specificFeatures', e.target.value)}
                      rows={3}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200"
                  >
                    Next: Integration & Timeline
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Integration & Timeline */}
            {currentStep === 4 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Step 4: Integration & Timeline</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">CRM System</label>
                    <select
                      value={formData.crmSystem}
                      onChange={(e) => handleInputChange('crmSystem', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select CRM</option>
                      <option value="salesforce">Salesforce</option>
                      <option value="hubspot">HubSpot</option>
                      <option value="pipedrive">Pipedrive</option>
                      <option value="zoho">Zoho</option>
                      <option value="none">None</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Payment Processor</label>
                    <select
                      value={formData.paymentProcessor}
                      onChange={(e) => handleInputChange('paymentProcessor', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Processor</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                      <option value="none">None</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Analytics Tools</label>
                    <input
                      type="text"
                      placeholder="Google Analytics, Mixpanel, etc."
                      value={formData.analyticsTools}
                      onChange={(e) => handleInputChange('analyticsTools', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Other Integrations</label>
                    <input
                      type="text"
                      placeholder="Zapier, Slack, etc."
                      value={formData.otherIntegrations}
                      onChange={(e) => handleInputChange('otherIntegrations', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Timeline</option>
                      <option value="urgent">Urgent (1-2 weeks)</option>
                      <option value="standard">Standard (3-4 weeks)</option>
                      <option value="flexible">Flexible (1-2 months)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Budget Range</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Budget</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2000">$1,000 - $2,000</option>
                      <option value="2000+">$2,000+</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200"
                  >
                    Next: Additional Information
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Additional Information */}
            {currentStep === 5 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Step 5: Additional Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Primary Use Case</label>
                    <textarea
                      placeholder="Describe how you plan to use the AI bot..."
                      value={formData.useCase}
                      onChange={(e) => handleInputChange('useCase', e.target.value)}
                      rows={3}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Target Audience</label>
                    <textarea
                      placeholder="Describe your target audience..."
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      rows={3}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Expected Volume</label>
                    <select
                      value={formData.expectedVolume}
                      onChange={(e) => handleInputChange('expectedVolume', e.target.value)}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    >
                      <option value="">Select Volume</option>
                      <option value="low">Low (1-50 interactions/day)</option>
                      <option value="medium">Medium (50-200 interactions/day)</option>
                      <option value="high">High (200+ interactions/day)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Special Requirements</label>
                    <textarea
                      placeholder="Any special requirements, compliance needs, or additional information..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      rows={4}
                      className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-kingdom-gold focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 