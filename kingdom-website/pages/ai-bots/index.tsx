import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import OptimizedVideoBackground from '../../components/OptimizedVideoBackground';

const chatbots = [
  {
    id: 'sales-assistant',
    name: 'Sales Assistant Bot',
    description: 'Intelligent sales automation with lead qualification and follow-up capabilities',
    features: ['Lead qualification', 'Product recommendations', 'Follow-up automation', 'Biblical communication standards'],
    price: '$299',
    demoUrl: '/ai-bots/sales-assistant',
    category: 'Sales'
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation Bot',
    description: 'Automated lead capture and qualification with CRM integration',
    features: ['Automated lead capture', 'Qualification questions', 'Appointment scheduling', 'CRM integration'],
    price: '$249',
    demoUrl: '/ai-bots/lead-generation',
    category: 'Sales'
  },
  {
    id: 'onboarding',
    name: 'Onboarding Bot',
    description: 'Streamlined user onboarding with personalized guidance and tutorials',
    features: ['New user guidance', 'Feature tutorials', 'FAQ handling', 'Personalized welcome'],
    price: '$199',
    demoUrl: '/ai-bots/onboarding',
    category: 'Customer Success'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Bot',
    description: '24/7 customer support with intelligent ticket routing and resolution',
    features: ['24/7 availability', 'Ticket routing', 'Knowledge base integration', 'Empathetic responses'],
    price: '$349',
    demoUrl: '/ai-bots/customer-support',
    category: 'Support'
  },
  {
    id: 'faith-bot',
    name: 'Faith Bot',
    description: 'Biblical guidance and spiritual encouragement with prayer support',
    features: ['Biblical guidance', 'Prayer requests', 'Scripture recommendations', 'Spiritual growth resources'],
    price: '$179',
    demoUrl: '/ai-bots/faith-bot',
    category: 'Spiritual'
  },
  {
    id: 'course-explainer',
    name: 'Course Explainer Bot',
    description: 'Educational content delivery with interactive learning experiences',
    features: ['Content delivery', 'Interactive learning', 'Progress tracking', 'Adaptive learning'],
    price: '$279',
    demoUrl: '/ai-bots/course-explainer',
    category: 'Education'
  },
  {
    id: 'testimonial',
    name: 'Testimonial Bot',
    description: 'Automated customer feedback collection and testimonial generation',
    features: ['Feedback collection', 'Review generation', 'Success stories', 'Social proof automation'],
    price: '$159',
    demoUrl: '/ai-bots/testimonial',
    category: 'Marketing'
  },
  {
    id: 'job-application',
    name: 'Job Application Bot',
    description: 'Streamlined hiring process with application screening and interview scheduling',
    features: ['Application screening', 'Interview scheduling', 'Candidate communication', 'Hiring automation'],
    price: '$229',
    demoUrl: '/ai-bots/job-application',
    category: 'HR'
  },
  {
    id: 'enhanced-sales',
    name: 'Enhanced Sales Bot',
    description: 'Advanced sales techniques with objection handling and closing strategies',
    features: ['Advanced techniques', 'Objection handling', 'Closing strategies', 'Performance analytics'],
    price: '$399',
    demoUrl: '/ai-bots/enhanced-sales',
    category: 'Sales'
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking Bot',
    description: 'Automated appointment scheduling with calendar integration and reminders',
    features: ['Calendar integration', 'Time zone handling', 'Reminder notifications', 'Payment processing'],
    price: '$199',
    demoUrl: '/ai-bots/appointment-booking',
    category: 'Scheduling'
  },
  {
    id: 'faq-knowledge',
    name: 'FAQ & Knowledge Base Bot',
    description: 'Intelligent FAQ handling with comprehensive knowledge base integration',
    features: ['FAQ automation', 'Knowledge base search', 'Smart responses', 'Learning capabilities'],
    price: '$189',
    demoUrl: '/ai-bots/faq-knowledge',
    category: 'Support'
  },
  {
    id: 'social-media',
    name: 'Social Media Management Bot',
    description: 'Comprehensive social media management with content scheduling and analytics',
    features: ['Content scheduling', 'Hashtag optimization', 'Engagement monitoring', 'Cross-platform posting'],
    price: '$279',
    demoUrl: '/ai-bots/social-media',
    category: 'Marketing'
  }
];

export default function ChatbotsPage() {
  const categories = Array.from(new Set(chatbots.map(bot => bot.category)));

  return (
    <>
      <Head>
        <title>Chatbots - Kingdom Collective</title>
        <meta name="description" content="Professional chatbots trained for your business needs. Transform customer interactions with intelligent automation." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <div className="fixed inset-0 z-0"><OptimizedVideoBackground videoSrc="/assets/Heavenly-BG-video.mp4" fadeHeight={31} fadeColor="#0B0614" opacity={1} playbackRate={1.0} pauseOnScroll={true} scrollThreshold={200} frozen={true} frozenFrame={0.3} /></div>
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="min-h-screen" role="main">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold leading-tight tracking-[-0.033em] text-white mb-6">
                    Professional Chatbots
                  </h1>
                  <p className="text-2xl text-[#FFD700] font-semibold mb-4">
                    Trained for Your Business Success
                  </p>
                  <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                    Transform your customer interactions with intelligent chatbots trained specifically for your industry and business needs.
                  </p>
                </div>
              </div>
            </section>

            {/* Chatbots Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="chatbots-heading">
              <div className="max-w-7xl mx-auto">
                <h2 id="chatbots-heading" className="sr-only">Available Chatbots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {chatbots.map((bot) => (
                    <article key={bot.id} className="card-standard">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">{bot.name}</h3>
                        <p className="text-white/70 text-sm mb-4">{bot.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#FFD700] font-bold text-lg">{bot.price}</span>
                          <span className="text-white/60 text-sm bg-gray/30 px-2 py-1 rounded">{bot.category}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {bot.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-white/70 text-sm flex items-center">
                              <span className="text-[#FFD700] mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link href={bot.demoUrl} className="bg-gradient-to-r from-[#FFD700] to-yellow-400 text-black font-semibold px-6 py-2 rounded-md shadow-md hover:brightness-110 transition w-full text-center" aria-label={`View details for ${bot.name}`}>
                        View Details
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
              <div className="max-w-4xl mx-auto text-center">
                <h2 id="cta-heading" className="text-4xl md:text-6xl font-bold leading-tight tracking-[-0.033em] text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  Choose the perfect chatbot for your needs and start automating your customer interactions today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/ai-bots/pricing" className="bg-gradient-to-r from-[#FFD700] to-yellow-400 text-black font-semibold px-6 py-2 rounded-md shadow-md hover:brightness-110 transition">
                    View Pricing
                  </Link>
                  <Link href="/contact" className="bg-transparent border border-[#FFD700] text-[#FFD700] px-6 py-2 rounded-md font-semibold hover:bg-[#FFD700] hover:text-black transition-all duration-200">
                    Get Custom Quote
                  </Link>
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

