import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function SpiritualDisclaimer() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
              Spiritual & AI Disclaimer
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal leading-relaxed px-4">
              Last Updated: December 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <div className="text-white space-y-8">
                
                <div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Kingdom Collective and its apps (including Kingdom Studios, Kingdom Clips, Kingdom Voice, Kingdom Circle, Kingdom Launchpad, and Kingdom Lens) include features designed to support creative, business, and personal growth journeys — many of which integrate faith-based or spiritually inspired tools.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                    We offer a dual-mode experience to honor where each user is on their journey:
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="bg-black/20 border border-gray/30 rounded-xl p-6">
                      <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">✨ Faith Mode</h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        For those who want to build fully surrendered and Spirit-led, with tools that integrate scripture, spiritual growth checkpoints, prophetic creativity, and reminders to walk in step with the Holy Spirit.
                      </p>
                    </div>
                    <div className="bg-black/20 border border-gray/30 rounded-xl p-6">
                      <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">🌱 Encouragement Mode</h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        Offers the same excellence and strategy, but in a tone that&apos;s uplifting, empowering, and full of truth — designed for those still exploring or rebuilding their relationship with God.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">1. Not a Substitute for the Word of God</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Spiritual tools on our platform — including journal prompts, prayers, declarations, and encouragements — are intended to support your growth and creative process. These tools are not a replacement for the Bible, the Holy Spirit, prayer, or biblical counsel.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                    Generated or suggested content should be tested, discerned, and never treated as infallible truth. The Holy Spirit remains the ultimate guide for all faith-led creation and decisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">2. AI-Generated Prophetic or Encouraging Content</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Faith Mode may use AI to co-create devotionals, captions, encouragements, or prophetic-style language based on your input. Encouragement Mode may generate truth-filled, motivational content designed to inspire without religious language.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    All output is created through AI modeling and is not authored by God or delivered as prophecy.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    We do not guarantee theological accuracy or spiritual authority. Always seek discernment.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">3. AI Limitations and Risks</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Our platform uses AI technology to generate content such as:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Written prompts, captions, and affirmations</li>
                    <li>Audio and voice clips (via ElevenLabs or similar)</li>
                    <li>Visual thumbnails and brand designs</li>
                    <li>Marketing copy and business guidance</li>
                    <li>Devotional and journaling tools</li>
                  </ul>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    AI outputs are based on user input and predictive modeling — not divine revelation. Misuse, misrepresentation, or overreliance on these tools is not advised.
                  </p>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">4. Use with Discernment</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    We strongly encourage users to:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Submit everything to prayer and spiritual leadership</li>
                    <li>Avoid treating AI-generated output as prophetic fact</li>
                    <li>Never simulate or impersonate the voice of God using digital tools</li>
                    <li>Discern the fruit of all content you create, share, or consume</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Kingdom Collective is not responsible for how you use, interpret, or act on any spiritual or AI-generated content.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    You agree not to hold us liable for:
                  </p>
                  <ul className="text-gray-300 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Emotional or spiritual harm</li>
                    <li>Doctrinal disagreements</li>
                    <li>Business or personal decisions made based on AI output</li>
                    <li>Claims that content produced was prophetic, divine, or absolute truth</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">6. Feedback and Support</h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    If you have concerns about the spiritual direction of content or want to suggest improvements to Faith Mode or Encouragement Mode, please contact our team at:
                  </p>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-2">
                    <p>📩 <a href="mailto:support@kingdomcollective.pro" className="text-blue hover:text-blue-300 transition-colors duration-200">support@kingdomcollective.pro</a></p>
                    <p>🌐 <a href="https://kingdomcollective.pro" className="text-blue hover:text-blue-300 transition-colors duration-200">https://kingdomcollective.pro</a></p>
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