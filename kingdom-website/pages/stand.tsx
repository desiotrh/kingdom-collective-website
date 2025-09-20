import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function KingdomStandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/images/kingdom-stand-logo.png"
              alt="Kingdom Stand Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Kingdom Stand
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Prepared to stand — rooted in truth and honesty
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://apps.apple.com/app/kingdom-stand/id1234567890"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-gold-400 hover:bg-gold-500 transition-colors"
            >
              Download for iOS
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=pro.kingdomcollective.stand"
              className="inline-flex items-center justify-center px-8 py-3 border border-gold-400 text-base font-medium rounded-md text-gold-400 hover:bg-gold-400 hover:text-slate-900 transition-colors"
            >
              Download for Android
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Comprehensive Legal Support Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📄"
              title="Document Converter"
              description="Convert, merge, and format legal documents with court-ready presets and OCR capabilities."
            />
            <FeatureCard
              icon="⏰"
              title="Case Timeline"
              description="Track deadlines, hearings, and important dates with encrypted local storage and calendar export."
            />
            <FeatureCard
              icon="👥"
              title="Family Law Hub"
              description="Access mediators, parenting classes, and Guardian ad Litem directories by state and county."
            />
            <FeatureCard
              icon="⚖️"
              title="Lawyer Directory"
              description="Find qualified attorneys with verified credentials, practice areas, and fee structures."
            />
            <FeatureCard
              icon="💬"
              title="Community Support"
              description="Connect with others navigating similar legal challenges through moderated forums and resources."
            />
            <FeatureCard
              icon="🧘"
              title="Grounding Exercises"
              description="Access calming techniques and faith-based support for managing legal stress and anxiety."
            />
            <FeatureCard
              icon="📱"
              title="E-Filing Assistance"
              description="Get step-by-step guidance for electronic court filing across multiple states with portal information and registration guides."
            />
            <FeatureCard
              icon="🎓"
              title="Legal Education Hub"
              description="Comprehensive learning system with interactive courses, progress tracking, and certification programs for family law education."
            />
            <FeatureCard
              icon="📊"
              title="Trial Strategy Builder"
              description="Organize your case strategy with timeline management, evidence tracking, and preparation checklists for court proceedings."
            />
          </div>
        </div>
      </section>

      {/* E-Filing Assistance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              E-Filing Made Simple
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Navigate electronic court filing with confidence. Get step-by-step guidance, 
              portal information, and real-time assistance for your state.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-white mb-3">State-by-State Support</h3>
              <p className="text-blue-200">
                Comprehensive coverage for California, New York, Texas, Florida, and Illinois with 
                detailed portal information and requirements.
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-3">Registration Guides</h3>
              <p className="text-blue-200">
                Step-by-step instructions for setting up e-filing accounts, including time estimates, 
                costs, and required documents.
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Assistance</h3>
              <p className="text-blue-200">
                Get help with document preparation, validation, and filing requirements 
                for your specific case type.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/efiling-assistance"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-400 text-lg font-medium rounded-md text-gold-400 hover:bg-gold-400 hover:text-slate-900 transition-colors"
            >
              Get E-Filing Help
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Education Hub Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Legal Education Hub
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Master family law concepts with our comprehensive learning system. Interactive courses, 
              progress tracking, and expert-verified content to empower your legal journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Courses</h3>
              <p className="text-blue-200 mb-4">
                Learn family law fundamentals with video lessons, interactive exercises, and practical scenarios.
              </p>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Family Law Fundamentals</li>
                <li>• California Family Law</li>
                <li>• Document Preparation</li>
                <li>• Court Procedures</li>
              </ul>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-3">Progress Tracking</h3>
              <p className="text-blue-200 mb-4">
                Monitor your learning journey with detailed analytics and achievement tracking.
              </p>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Course completion rates</li>
                <li>• Learning streaks</li>
                <li>• Quiz performance</li>
                <li>• Time spent learning</li>
              </ul>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Certification</h3>
              <p className="text-blue-200 mb-4">
                Earn certificates upon completion with expert-verified content and assessments.
              </p>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Completion certificates</li>
                <li>• Digital badges</li>
                <li>• Verification URLs</li>
                <li>• Professional recognition</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/legal-education"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-400 text-lg font-medium rounded-md text-gold-400 hover:bg-gold-400 hover:text-slate-900 transition-colors"
            >
              Explore Legal Education Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-6">
              ⚠️ Important Legal Disclaimer
            </h2>
            
            <div className="space-y-4 text-red-100">
              <p>
                <strong>Kingdom Stand provides legal information, not legal advice.</strong> We are not your attorney, 
                and no attorney-client relationship is created by using this application.
              </p>
              
              <p>
                The information provided is for educational purposes only and should not be considered as legal advice 
                for your specific situation. Laws vary by jurisdiction and change over time.
              </p>
              
              <p>
                <strong>Always consult with a qualified attorney</strong> for legal advice specific to your case. 
                This application is designed to help you prepare and organize information, but cannot replace 
                professional legal counsel.
              </p>
              
              <p>
                By using this application, you acknowledge that you understand these limitations and agree to 
                seek professional legal advice when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQItem
              question="What is Kingdom Stand?"
              answer="Kingdom Stand is a comprehensive legal support application designed to help individuals navigate legal challenges with faith-based guidance and practical tools."
            />
            <FAQItem
              question="Is this app free to use?"
              answer="Kingdom Stand offers both free and premium features. Basic document tools and resources are free, while advanced features require a subscription."
            />
            <FAQItem
              question="Can this app replace a lawyer?"
              answer="No. Kingdom Stand provides legal information and tools to help you prepare, but it cannot replace professional legal advice. Always consult with a qualified attorney for legal matters."
            />
            <FAQItem
              question="What types of legal matters does this app cover?"
              answer="The app covers family law, civil matters, document preparation, and general legal resources. It's designed to help with common legal situations, not complex or specialized cases."
            />
            <FAQItem
              question="How do you ensure the legal information is accurate?"
              answer="We work with legal professionals to verify information and regularly update content. However, laws change frequently, so always verify current information with official sources."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. We use industry-standard encryption and local storage to protect your sensitive information. Your data never leaves your device unless you choose to share it."
            />
          </div>
        </div>
      </section>

      {/* Lawyer Registration CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 shadow-lg">
            <div className="text-6xl mb-6">⚖️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Are You a Legal Professional?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Help families find quality legal assistance in your area. Join our trusted directory 
              and connect with clients who need your expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lawyer-registration"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
              >
                Join Our Directory
              </Link>
              <Link
                href="/lawyer-registration#benefits"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
            
            <p className="text-sm text-blue-200 mt-6">
              Free to join • Verified listings • 24-48 hour approval
            </p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Stand Strong?
          </h2>
          
          <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
            Download Kingdom Stand today and access the tools you need to navigate legal challenges with confidence and faith.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://apps.apple.com/app/kingdom-stand/id1234567890"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-slate-900 bg-gold-400 hover:bg-gold-500 transition-colors"
            >
              Download for iOS
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=pro.kingdomcollective.stand"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold-400 text-lg font-medium rounded-md text-gold-400 hover:bg-gold-400 hover:text-slate-900 transition-colors"
            >
              Download for Android
            </Link>
          </div>
          
          <p className="text-sm text-blue-300 mt-8">
            Available on iOS 13+ and Android 8+
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string; }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 hover:border-gold-400/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-blue-200">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string; }) {
  return (
    <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
      <h3 className="text-lg font-semibold text-white mb-3">{question}</h3>
      <p className="text-blue-200">{answer}</p>
    </div>
  );
}
