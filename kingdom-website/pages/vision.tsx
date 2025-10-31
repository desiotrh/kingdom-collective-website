import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedVideoBackground from '../components/OptimizedVideoBackground';

export default function Vision() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <OptimizedVideoBackground 
          videoSrc="/assets/Heavenly-BG-video.mp4"
          fadeHeight={31}
          fadeColor="#0B0614"
          opacity={1}
          frozen={true}
          frozenFrame={0.3}
        />
      </div>
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
              Our Vision
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Kingdom Collective was birthed out of a mandate — not a marketing plan.
            </p>
          </div>
        </section>

        {/* Origin Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Born from a Blueprint of Heaven
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8 text-white leading-relaxed text-base sm:text-lg">
              <p>
                Kingdom Collective was founded by Desirea Tritz, after being given a divine blueprint by the Holy Spirit — a call to build technology that reflects God&apos;s excellence and truth.
              </p>
              
              <p>
                We create with conviction, steward innovation with integrity, and deliver professional solutions that bring Kingdom values into the digital world. We believe creativity is worship, and excellence is ministry. Every project is a collaboration between vision, technology, and faith.
              </p>
              
              <p>
                Whether you&apos;re launching a ministry, building a business, or creating content that matters — we&apos;re here to help you build it with excellence and purpose. Our standard is not competition — it&apos;s obedience and excellence in the Spirit.
              </p>
            </div>
          </div>
        </section>

        {/* Dual Mode Section - For Kingdom Apps */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Our Kingdom Apps: Built to Include
              </h2>
              <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                In our Kingdom Apps suite, we recognize that not everyone is already walking with Jesus — and that&apos;s okay. That&apos;s why we built a dual-mode experience that serves both the called and the curious.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Faith Mode */}
              <div className="card-standard p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="icon-standard">🙏</div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Faith Mode</h3>
                </div>
                <p className="text-white leading-relaxed text-sm sm:text-base md:text-lg">
                  For those who want to build fully surrendered and Spirit-led, with tools that integrate scripture, spiritual growth checkpoints, prophetic creativity, and reminders to walk in step with the Holy Spirit.
                </p>
                <div className="mt-6">
                  <h4 className="text-kingdom-gold font-bold mb-3">Features Include:</h4>
                  <ul className="text-white space-y-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Scripture integration
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Spiritual growth checkpoints
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Prophetic creativity tools
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Holy Spirit reminders
                    </li>
                  </ul>
                </div>
              </div>

              {/* Encouragement Mode */}
              <div className="card-standard p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="icon-standard">✨</div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">Encouragement Mode</h3>
                </div>
                <p className="text-white leading-relaxed text-sm sm:text-base md:text-lg">
                  Offers the same excellence and strategy, but in a tone that&apos;s uplifting, empowering, and full of truth — designed for those still exploring or rebuilding their relationship with God.
                </p>
                <div className="mt-6">
                  <h4 className="text-kingdom-gold font-bold mb-3">Features Include:</h4>
                  <ul className="text-white space-y-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Uplifting content suggestions
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Empowering messaging
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Truth-based guidance
                    </li>
                    <li className="flex items-center">
                      <span className="text-kingdom-gold mr-2">•</span>
                      Safe exploration space
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Created for You
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8 text-white leading-relaxed text-base sm:text-lg">
              <p>
                We built this to include, not exclude. To awaken purpose, not just performance. Whether you&apos;re a bold Kingdom warrior or just now discovering that there&apos;s more to life than what culture has sold you — this space was created with you in mind.
              </p>
              
              <p>
                We exist to make room for the called, the curious, the creative, and the surrendered — to create with purpose, share with authority, and build what truly matters.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="icon-small">🎯</div>
                  <h3 className="text-white font-bold text-sm sm:text-base">The Called</h3>
                </div>
                <div className="text-center">
                  <div className="icon-small">🤔</div>
                  <h3 className="text-white font-bold text-sm sm:text-base">The Curious</h3>
                </div>
                <div className="text-center">
                  <div className="icon-small">🎨</div>
                  <h3 className="text-white font-bold text-sm sm:text-base">The Creative</h3>
                </div>
                <div className="text-center">
                  <div className="icon-small">🙏</div>
                  <h3 className="text-white font-bold text-sm sm:text-base">The Surrendered</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Start creating with purpose, sharing with authority, and building what truly matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                Start a Project
              </Link>
              <Link href="/apps" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300">
                Explore Our Apps
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 