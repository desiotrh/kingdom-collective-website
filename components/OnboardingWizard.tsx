import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

interface AppOption {
  id: string;
  name: string;
  description: string;
  logo: string;
  features: string[];
}

const appOptions: AppOption[] = [
  {
    id: 'kingdom-studios',
    name: 'Kingdom Studios',
    description: 'Content creation hub for faith-driven visionaries',
    logo: '/kingdom-studios-logo.png',
    features: ['Content Creation', 'AI Editing', 'Multi-platform Publishing', 'Analytics']
  },
  {
    id: 'kingdom-clips',
    name: 'Kingdom Clips',
    description: 'AI video editing for Reels, Shorts, and TikTok',
    logo: '/kingdom-clips-logo.png',
    features: ['Video Editing', 'AI Enhancement', 'Social Optimization', 'Trend Analysis']
  },
  {
    id: 'kingdom-voice',
    name: 'Kingdom Voice',
    description: 'Audio & podcast platform for spiritual leaders',
    logo: '/kingdom-voice-logo.png',
    features: ['Podcast Creation', 'Audio Editing', 'Distribution', 'Voice Enhancement']
  },
  {
    id: 'kingdom-launchpad',
    name: 'Kingdom Launchpad',
    description: 'Business platform for digital products and courses',
    logo: '/kingdom-launchpad-logo.png',
    features: ['Course Creation', 'Business Tools', 'Payment Processing', 'Analytics']
  },
  {
    id: 'kingdom-circle',
    name: 'Kingdom Circle',
    description: 'Community building platform for meaningful connections',
    logo: '/kingdom-circle-logo.png',
    features: ['Community Building', 'Event Hosting', 'Member Management', 'Engagement Tools']
  },
  {
    id: 'kingdom-lens',
    name: 'Kingdom Lens',
    description: 'Photography platform for creatives of faith',
    logo: '/kingdom-lens-logo.png',
    features: ['Photo Editing', 'Planning Tools', 'Story Templates', 'Portfolio Building']
  }
];

export default function OnboardingWizard() {
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    faithMode: true,
    notifications: true,
  });

  const handleAppToggle = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(selectedApps, preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-white text-3xl font-bold mb-6">Welcome to Kingdom Collective!</h2>
      <p className="text-white text-lg mb-8">Let&apos;s personalize your experience by selecting the apps that interest you.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appOptions.map((app) => (
          <div
            key={app.id}
            onClick={() => handleAppToggle(app.id)}
            className={`bg-black/20 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedApps.includes(app.id) 
                ? 'border-2 border-blue bg-blue/10' 
                : 'border border-gray/30 hover:border-blue/30'
            }`}
          >
            <div className="flex items-center mb-4">
              <Image
                src={app.logo}
                alt={`${app.name} Logo`}
                width={40}
                height={40}
                className="rounded-lg mr-3"
              />
              <h3 className="text-white font-bold text-lg">{app.name}</h3>
            </div>
            <p className="text-white text-sm mb-4">{app.description}</p>
            <div className="space-y-1">
              {app.features.map((feature, index) => (
                <div key={index} className="text-blue text-xs">• {feature}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <h2 className="text-white text-3xl font-bold mb-6">Explore Your Selected Apps</h2>
      <p className="text-white text-lg mb-8">Here&apos;s what you can do with your chosen apps:</p>
      
      <div className="space-y-6">
        {selectedApps.map(appId => {
          const app = appOptions.find(a => a.id === appId);
          if (!app) return null;
          
          return (
            <div key={appId} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={app.logo}
                  alt={`${app.name} Logo`}
                  width={50}
                  height={50}
                  className="rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-white font-bold text-xl">{app.name}</h3>
                  <p className="text-white text-sm">{app.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {app.features.map((feature, index) => (
                  <div key={index} className="text-blue text-sm">• {feature}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-white text-3xl font-bold mb-6">Choose Your Experience</h2>
      <p className="text-white text-lg mb-8">Select your preferred mode and preferences:</p>
      
      <div className="space-y-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-white font-bold text-xl mb-4">Experience Mode</h3>
          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="faithMode"
                checked={preferences.faithMode}
                onChange={() => setPreferences(prev => ({ ...prev, faithMode: true }))}
                className="mr-3"
              />
              <div>
                <div className="text-white font-semibold">Faith Mode</div>
                <div className="text-white text-sm">For those who want to build fully surrendered and Spirit-led, with tools that integrate scripture, spiritual growth checkpoints, prophetic creativity, and reminders to walk in step with the Holy Spirit.</div>
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="faithMode"
                checked={!preferences.faithMode}
                onChange={() => setPreferences(prev => ({ ...prev, faithMode: false }))}
                className="mr-3"
              />
              <div>
                <div className="text-white font-semibold">Encouragement Mode</div>
                <div className="text-white text-sm">Offers the same excellence and strategy, but in a tone that&apos;s uplifting, empowering, and full of truth — designed for those still exploring or rebuilding their relationship with God.</div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-white font-bold text-xl mb-4">Notifications</h3>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="mr-3"
            />
            <div>
              <div className="text-white font-semibold">Enable Notifications</div>
              <div className="text-white text-sm">Get updates about new features, tips, and community events</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      <h2 className="text-white text-3xl font-bold mb-6">🎉 Welcome to Kingdom Collective!</h2>
      <p className="text-white text-lg mb-8">Your personalized experience is ready. You can always modify your preferences later.</p>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-8">
        <h3 className="text-white font-bold text-xl mb-4">Your Selected Apps:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedApps.map(appId => {
            const app = appOptions.find(a => a.id === appId);
            return (
              <div key={appId} className="flex items-center">
                <Image
                  src={app?.logo || ''}
                  alt={`${app?.name} Logo`}
                  width={30}
                  height={30}
                  className="rounded mr-2"
                />
                <span className="text-white text-sm">{app?.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-white">
        <p className="mb-2">Experience Mode: <span className="text-blue">{preferences.faithMode ? 'Faith Mode' : 'Encouragement Mode'}</span></p>
        <p>Notifications: <span className="text-blue">{preferences.notifications ? 'Enabled' : 'Disabled'}</span></p>
      </div>
    </div>
  );

  const steps = [
    { title: 'Select Apps', content: renderStep1 },
    { title: 'Explore Features', content: renderStep2 },
    { title: 'Set Preferences', content: renderStep3 },
    { title: 'Welcome', content: renderStep4 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
      <div className="bg-navy rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index + 1 <= currentStep 
                    ? 'bg-gray text-white' 
                    : 'bg-gray text-white'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-blue' : 'bg-gray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <h3 className="text-white text-center font-semibold">{steps[currentStep - 1].title}</h3>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {steps[currentStep - 1].content()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-full bg-gray text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray/90 transition-all duration-200"
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === 1 && selectedApps.length === 0}
                            className="px-6 py-3 rounded-full bg-gray text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue hover:text-white transition-all duration-200"
          >
            {currentStep === 4 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 