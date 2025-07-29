import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Terms() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Terms of Service
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-relaxed px-4">
              Last Updated: July 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <div className="text-white space-y-8">
                
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    By accessing and using any services, products, mobile applications, platforms, or features provided by Kingdom Collective, including Kingdom Studios, Kingdom Clips, Kingdom Voice, Kingdom Circle, Kingdom Launchpad, and Kingdom Lens (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Services.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">2. Description of Services</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Kingdom Collective provides a suite of web and mobile applications designed to empower creators, entrepreneurs, and community builders through faith-integrated and encouragement-based technology. Our Services include, but are not limited to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4">
                    <li>AI-generated content, captions, reels, and design tools</li>
                    <li>Community-building features, mentorship tools, and sponsorship systems</li>
                    <li>Content planning, product sync, and digital storefront integrations</li>
                    <li>Voice and video content creation with AI-enhanced features</li>
                    <li>Photography planning, file delivery, and media storage</li>
                    <li>Cross-platform analytics, performance tracking, and marketing tools</li>
                    <li>A dual-mode interface: Faith Mode and Encouragement Mode</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                    You are responsible for how you use each tool, and for ensuring your use complies with local laws and our Acceptable Use Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">3. User Accounts</h2>
                  
                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">3.1 Registration</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You must create an account to access certain features. You agree to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Keep your login credentials secure</li>
                    <li>Notify us immediately of any unauthorized access or suspected breach</li>
                  </ul>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">3.2 Account Types</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We offer various access tiers (Seed, Growth, Pro, Mantled Pro, Kingdom Enterprise), each with specific feature sets and usage limits. Additional terms may apply to sponsored, team, or mentorship accounts.
                  </p>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">3.3 Age Restriction</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You must be at least 16 years old to use our Services. Use by minors must be with parental or legal guardian supervision.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">4. Acceptable Use Policy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You agree not to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Upload, share, or promote illegal, violent, hateful, or sexually explicit content</li>
                    <li>Violate intellectual property rights</li>
                    <li>Abuse AI tools for spam, automation, deception, or plagiarism</li>
                    <li>Impersonate others or misrepresent affiliations</li>
                    <li>Exploit community features to harass or solicit users</li>
                    <li>Use Faith Mode to simulate religious experiences for deceptive or commercial gain</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We reserve the right to remove content or suspend accounts that violate this policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">5. Content & Intellectual Property</h2>
                  
                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">5.1 Your Content</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You retain ownership of content you create or upload. By using our Services, you grant us a limited, non-exclusive license to host, store, and process your content for the purposes of:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Display within your account</li>
                    <li>AI training (where applicable and anonymized)</li>
                    <li>Backup, security, or compliance</li>
                    <li>Improving Service features</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You are responsible for ensuring you have legal rights to any media, text, or files you upload.
                  </p>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">5.2 AI-Generated Content</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Content generated using our tools (e.g., captions, reels, AI voices, thumbnails) may be used for personal or commercial purposes unless your tier explicitly limits such use.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Kingdom Collective does not guarantee the originality, accuracy, or legal clearance of AI-generated content. You assume all responsibility for its use, distribution, or resale.
                  </p>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">5.3 Our IP</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    All platform UI/UX, source code, design systems, brand names, logos, and content templates are the property of Kingdom Collective and protected under copyright and trademark law. Unauthorized use is prohibited.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">6. Privacy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We collect and process user data in accordance with our Privacy Policy. This includes:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Analytics and usage data</li>
                    <li>Uploaded media and project history</li>
                    <li>Subscription and billing details</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We never sell your personal data and use secure industry-standard practices to protect it.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">7. Payments</h2>
                  
                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">7.1 Billing</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Certain features are only available through paid plans. You agree to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Pay all applicable fees in a timely manner</li>
                    <li>Maintain accurate billing information</li>
                    <li>Authorize automatic recurring charges</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Failure to pay may result in suspension or downgrade of your plan.
                  </p>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">7.2 Refunds</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    All sales are final unless otherwise required by law. No refunds are issued for partial usage, plan downgrades, or expired trials.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">8. AI, Voice, and Media Usage</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You agree not to use our AI tools for:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Generating harmful, illegal, or exploitative content</li>
                    <li>Cloning or simulating voices without legal consent</li>
                    <li>Misrepresenting AI-generated media as factual or divine</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Kingdom Collective disclaims all liability for misuse of AI-generated content, including voice, reels, or written outputs.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">9. Community & Mentorship</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Kingdom Circle provides tools for connecting with mentors, prayer partners, and sponsors. By participating, you agree to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Maintain confidentiality and respect</li>
                    <li>Not use community features to solicit, harass, or exploit</li>
                    <li>Report abuse or inappropriate content</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We reserve the right to remove or restrict access to community features at our sole discretion.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">10. Storage & Integration</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Kingdom Lens, Launchpad, and Studios may connect with third-party services (e.g., Etsy, TikTok, Google, Printify). We are not responsible for outages, policy changes, or errors resulting from external platforms.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                    Storage provided in-app is subject to tier limits and is not intended for permanent archival.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">11. Disclaimers</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    All Services are provided "as is." We make no warranties regarding:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Fitness for a particular purpose</li>
                    <li>Accuracy of AI-generated output</li>
                    <li>Compatibility with your device or third-party platforms</li>
                    <li>Continuous or error-free service</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Faith Mode is offered as a tool for spiritual alignment but is not a substitute for personal discernment, leadership, or pastoral guidance.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">12. Limitation of Liability</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    To the maximum extent permitted by law, Kingdom Collective shall not be liable for any indirect, incidental, consequential, or punitive damages, including:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Loss of income, content, or business opportunity</li>
                    <li>Inaccurate analytics or AI misjudgments</li>
                    <li>Downtime or third-party API failures</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Your sole remedy for dissatisfaction is to stop using the Services.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">13. Indemnification</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You agree to defend, indemnify, and hold harmless Kingdom Collective, its team, and affiliates from any claims, liabilities, losses, or expenses arising out of your:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mt-4">
                    <li>Content or app usage</li>
                    <li>Violation of these Terms</li>
                    <li>Misuse of our AI tools or spiritual content features</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">14. Termination</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We reserve the right to suspend or terminate your account if you:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Violate these Terms</li>
                    <li>Exceed usage limits without upgrading</li>
                    <li>Attempt to hack, clone, or reverse engineer our Services</li>
                    <li>Abuse, threaten, or harass other users or team members</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Termination includes loss of access to stored content, AI history, and community features.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">15. Governing Law</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    These Terms are governed by the laws of the State of Oklahoma, United States. Disputes may be resolved in small claims court or arbitration within Oklahoma County, unless otherwise required by law.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">16. Changes to Terms</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We may update these Terms at any time. You will be notified of material changes via email or in-app notice. Continued use of the Services after changes constitutes acceptance of the revised Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">17. Contact</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Questions? Contact us at:
                  </p>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-2">
                    <p>Email: <a href="mailto:legal@kingdomcollective.pro" className="text-blue hover:text-blue-300 transition-colors duration-200">legal@kingdomcollective.pro</a></p>
                    <p>Website: <a href="https://kingdomcollective.pro" className="text-blue hover:text-blue-300 transition-colors duration-200">https://kingdomcollective.pro</a></p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 