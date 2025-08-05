import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function Privacy() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Privacy Policy
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
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Kingdom Collective (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our services—including our website, mobile applications, and associated tools across our platform.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                    This policy applies to all apps under Kingdom Collective, including Kingdom Studios, Kingdom Clips, Kingdom Voice, Kingdom Circle, Kingdom Launchpad, and Kingdom Lens.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">2.1 Personal Information (Provided by You)</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We may collect personal data when you:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Create an account</li>
                    <li>Use AI tools or generate content</li>
                    <li>Submit forms, messages, or emails</li>
                    <li>Participate in community features</li>
                    <li>Purchase subscriptions or digital products</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    This may include:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Name, email, profile image, and contact info</li>
                    <li>Account login credentials and preferences</li>
                    <li>Payment/billing details (via Stripe or integrated partners)</li>
                    <li>Uploaded files, messages, or generated content</li>
                    <li>Communications and feedback you send us</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Note: If you use Faith Mode, you may also share sensitive faith-based content (e.g., declarations, journal entries, testimonies). We treat this content respectfully, but it is not stored with additional religious protections under law unless required.
                  </p>

                  <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 mt-6">2.2 Automatically Collected Information</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    When you use our services, we may automatically collect:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Device and browser type</li>
                    <li>IP address and location (if permission granted)</li>
                    <li>Time spent on features or pages</li>
                    <li>Scrolls, clicks, video plays, and form submissions</li>
                    <li>AI tool usage (e.g. number of generations, templates used)</li>
                    <li>Diagnostic, crash, and error data</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We may use cookies, pixels, or similar technologies to gather usage insights and improve your experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We use collected information to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Provide, operate, and improve our Services</li>
                    <li>Personalize your experience based on your mode (Faith or Encouragement)</li>
                    <li>Process payments and manage billing</li>
                    <li>Send transactional and promotional emails</li>
                    <li>Provide customer and technical support</li>
                    <li>Offer relevant suggestions (e.g. AI prompts, content tools)</li>
                    <li>Monitor service performance and prevent fraud</li>
                    <li>Comply with legal requirements</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We may also use aggregated or anonymized data to understand platform trends and enhance future features.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We do not sell your personal information. We may share it in these limited scenarios:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>With your explicit consent (e.g., collaborations, testimonials)</li>
                    <li>With third-party service providers that power our platform (e.g., Stripe, Vercel, OpenAI, ElevenLabs, Mixpanel)</li>
                    <li>To comply with laws, regulations, subpoenas, or government requests</li>
                    <li>To protect the rights, safety, or property of Kingdom Collective or its users</li>
                    <li>In the event of a merger, acquisition, or restructuring</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Each vendor we use is required to uphold strict data confidentiality practices.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">5. AI and Voice Features</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    When using our AI, avatar, or voice tools:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Input data (text, images, audio) may be temporarily processed to deliver results</li>
                    <li>AI-generated content is not considered private unless stored by you</li>
                    <li>For voice cloning or digital twin features, we require explicit consent</li>
                    <li>We do not store or resell voice models without your authorization</li>
                    <li>AI usage is monitored for abuse or harmful output</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We are not responsible for how you share or interpret AI-generated media. Please use all prophetic or spiritual outputs with discernment.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">6. Data Security</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We use encryption, access controls, and modern hosting security (e.g., Vercel, secure cloud databases) to protect your information. However, no system can be guaranteed 100% secure.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You are responsible for keeping your account credentials confidential.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">7. Data Retention</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We retain your information as long as:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>You have an active account</li>
                    <li>It&apos;s needed to provide services or meet legal requirements</li>
                    <li>You haven&apos;t requested deletion (see Section 8)</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Inactive accounts or data may be purged periodically for storage efficiency.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">8. Your Rights and Choices</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Depending on your location, you may have the right to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Access, update, or correct your personal info</li>
                    <li>Request deletion of your account and associated data</li>
                    <li>Opt out of marketing communications at any time</li>
                    <li>Request a copy of your data in portable format</li>
                    <li>Adjust your Faith Mode or Encouragement Mode preferences</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    To exercise any of these rights, email us at: <a href="mailto:privacy@kingdomcollective.pro" className="text-kingdom-gold hover:text-kingdom-gold-soft transition-colors duration-200">privacy@kingdomcollective.pro</a>
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">9. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We use cookies and third-party scripts (e.g., Google Analytics, Mixpanel) for:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Site performance monitoring</li>
                    <li>A/B testing and product optimization</li>
                    <li>Feature usage tracking</li>
                    <li>Visitor traffic analysis</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    You can manage cookie settings via your browser or device.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">10. Third-Party Services</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Our platform may include links or integrations with third-party sites (e.g., Etsy, TikTok Shop, Printify). Their privacy practices are beyond our control. We recommend reviewing their terms before submitting any data.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">11. Children&apos;s Privacy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Our Services are not intended for children under 13 years of age (or 16 where required by law). We do not knowingly collect personal data from children. If you believe your child has shared data with us, contact us to request deletion.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">12. Changes to This Policy</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We may update this Privacy Policy to reflect service changes or legal updates. We will notify users of material changes by:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Posting updates on this page</li>
                    <li>Updating the &ldquo;Last Updated&rdquo; date</li>
                    <li>Notifying via email or in-app message (if appropriate)</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Your continued use of our Services means you accept the revised policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">13. Contact Us</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Questions or requests related to your privacy? Reach out to:
                  </p>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-2">
                    <p>Email: <a href="mailto:privacy@kingdomcollective.pro" className="text-kingdom-gold hover:text-kingdom-gold-soft transition-colors duration-200">privacy@kingdomcollective.pro</a></p>
                    <p>Mailing Address: Kingdom Collective</p>
                    <p>Website: <a href="https://kingdomcollective.pro" className="text-kingdom-gold hover:text-kingdom-gold-soft transition-colors duration-200">https://kingdomcollective.pro</a></p>
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