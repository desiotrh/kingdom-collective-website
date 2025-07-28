import React, { useState } from 'react';
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

    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const responses = [
        "Based on your question, I'd recommend checking our Features page to see how we're different from other platforms. We offer unique tools designed specifically for faith-driven creators.",
        "For technical issues, please email tech@kingdomcollective.pro with specific details about the problem you're experiencing.",
        "Our pricing varies by app and plan. You can find detailed pricing on each individual app page or contact billing@kingdomcollective.pro for specific questions.",
        "Faith Mode and Encouragement Mode are designed to meet you where you are in your spiritual journey. You can switch between them based on your comfort level.",
        "We offer comprehensive support through multiple channels. For immediate assistance, try our FAQ section or email the appropriate department listed above."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setFaqResponse(randomResponse);
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
          </div>
        </section>

        {/* Contact Categories Section */}
        <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Contact <span className="text-blue">Categories</span>
              </h2>
              <p className="text-white text-base font-normal leading-normal max-w-3xl mx-auto">
                Find the right team member to help with your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-blue text-navy px-6 py-3 rounded-full font-bold hover:bg-blue/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              Need More <span className="text-blue">Help</span>?
            </h2>
            <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              We&apos;re committed to providing you with the support you need to succeed.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-white text-xl font-bold mb-3">Documentation</h3>
                <p className="text-white">Comprehensive guides and tutorials for all our tools.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-white text-xl font-bold mb-3">Video Tutorials</h3>
                <p className="text-white">Step-by-step video guides for every feature.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-white text-xl font-bold mb-3">Community</h3>
                <p className="text-white">Connect with other creators in our community.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 