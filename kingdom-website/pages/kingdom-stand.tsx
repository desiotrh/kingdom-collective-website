import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';

export default function KingdomStand() {
  const pillars = [
    { title: 'Core Self-Representation Tools', icon: '🧰', items: ['AI form-filling assistant', 'Deadline calculator', 'Court-ready binder'] },
    { title: 'System Navigation', icon: '🏛️', items: ['State judiciary links', 'Clerk directories', 'Fee waiver helper'] },
    { title: 'Accessibility & Inclusion', icon: '♿', items: ['Read-aloud mode', 'Voice-to-text', 'Multilingual (Spanish first)'] },
    { title: 'Budget-Friendly Legal Help', icon: '🤝', items: ['Legal aid directory', 'Modest-means listings', 'Limited-scope marketplace'] },
    { title: 'Safeguards', icon: '🛡️', items: ['“Legal info, not advice”', 'Red-flag alerts', 'Verified sources'] },
    { title: 'AI Guidance Layer', icon: '✨', items: ['Document finder', 'Plain-language explanations', 'Deadline alerts'] }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />

        <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
          <div className="max-w-[960px] mx-auto text-center">
            <div className="mb-8">
              <Image
                src="/kingdom-stand-logo.png"
                alt="Kingdom Stand Logo"
                width={120}
                height={120}
                className="h-24 sm:h-30 w-auto rounded-xl mx-auto mb-6"
                priority
              />
            </div>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
              Kingdom Stand
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-2">
              Prepared to stand — rooted in truth and honesty
            </p>
            <p className="text-white/80 text-sm max-w-3xl mx-auto mb-8">
              Kingdom Stand provides legal information, not legal advice. We are not your attorney. For legal advice tailored to your situation, consult a licensed attorney.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://stand.kingdomcollective.pro', '_blank')}
                className="bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200"
              >
                Launch Kingdom Stand
              </button>
              <Link href="#pillars" className="bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section id="pillars" className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-6">
                Core Feature Pillars
              </h2>
              <p className="text-white text-sm sm:text-base font-normal leading-normal max-w-3xl mx-auto">
                Built to equip individuals facing court without an attorney, with guardrails to keep information clear, verified, and responsible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {pillars.map((pillar, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray/30 rounded-xl p-6 hover:bg-black/30 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-3">{pillar.title}</h3>
                  <ul className="text-white/90 text-sm sm:text-base space-y-2">
                    {pillar.items.map((item, i) => (
                      <li key={i} className="flex items-start"><span className="text-kingdom-gold mr-2">•</span>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}


