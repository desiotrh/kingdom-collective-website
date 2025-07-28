import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';
import Image from 'next/image';

interface AppData {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showAddApps, setShowAddApps] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const allApps: AppData[] = [
    {
      id: 'kingdom-studios',
      name: 'Kingdom Studios',
      description: 'Content creation hub for faith-driven visionaries',
      logo: '/kingdom-studios-logo.png',
      url: 'https://app.kingdomcollective.pro',
      status: 'active',
      lastUsed: '2 hours ago'
    },
    {
      id: 'kingdom-clips',
      name: 'Kingdom Clips',
      description: 'AI video editing for Reels, Shorts, and TikTok',
      logo: '/kingdom-clips-logo.png',
      url: 'https://clips.kingdomcollective.pro',
      status: 'active',
      lastUsed: '1 day ago'
    },
    {
      id: 'kingdom-voice',
      name: 'Kingdom Voice',
      description: 'Audio & podcast platform for spiritual leaders',
      logo: '/kingdom-voice-logo.png',
      url: 'https://voice.kingdomcollective.pro',
      status: 'inactive'
    },
    {
      id: 'kingdom-launchpad',
      name: 'Kingdom Launchpad',
      description: 'Business platform for digital products and courses',
      logo: '/kingdom-launchpad-logo.png',
      url: 'https://launchpad.kingdomcollective.pro',
      status: 'inactive'
    },
    {
      id: 'kingdom-circle',
      name: 'Kingdom Circle',
      description: 'Community building platform for meaningful connections',
      logo: '/kingdom-circle-logo.png',
      url: 'https://circle.kingdomcollective.pro',
      status: 'inactive'
    },
    {
      id: 'kingdom-lens',
      name: 'Kingdom Lens',
      description: 'Photography platform for creatives of faith',
      logo: '/kingdom-lens-logo.png',
      url: 'https://lens.kingdomcollective.pro',
      status: 'inactive'
    }
  ];

  const userApps = allApps.filter(app => user.selectedApps.includes(app.id));
  const availableApps = allApps.filter(app => !user.selectedApps.includes(app.id));

  const handleLaunchApp = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAddApp = (appId: string) => {
    const updatedApps = [...user.selectedApps, appId];
    // This would typically call an API to update user preferences
    console.log('Adding app:', appId);
  };

  const handleRemoveApp = (appId: string) => {
    const updatedApps = user.selectedApps.filter(id => id !== appId);
    // This would typically call an API to update user preferences
    console.log('Removing app:', appId);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Dashboard Header */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-white text-lg">
                  Access your Kingdom Collective apps and manage your experience.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white text-sm">Experience Mode</p>
                  <p className="text-blue font-semibold">
                    {user.preferences.faithMode ? 'Faith Mode' : 'Encouragement Mode'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray text-white rounded-full text-sm font-bold hover:bg-gray/90 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Active Apps</h3>
                <p className="text-blue text-3xl font-black">{userApps.length}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Connected Accounts</h3>
                <p className="text-blue text-3xl font-black">{user.socialAccounts.length}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Experience</h3>
                <p className="text-blue text-lg font-semibold">
                  {user.preferences.faithMode ? 'Faith Mode' : 'Encouragement Mode'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Apps Section */}
        <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[960px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                  Your Apps
                </h2>
                <p className="text-white text-lg">
                  Quick access to your selected Kingdom Collective apps.
                </p>
              </div>
              <button
                onClick={() => setShowAddApps(!showAddApps)}
                className="px-6 py-3 bg-blue text-navy font-bold rounded-full hover:bg-blue/90 transition-all duration-200"
              >
                {showAddApps ? 'Hide Apps' : 'Add Apps'}
              </button>
            </div>

            {/* User's Selected Apps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userApps.map((app) => (
                <div key={app.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Image
                        src={app.logo}
                        alt={`${app.name} Logo`}
                        width={40}
                        height={40}
                        className="rounded-lg mr-3"
                      />
                      <div>
                        <h3 className="text-white font-bold text-lg">{app.name}</h3>
                        <p className="text-white text-sm">{app.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveApp(app.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {app.lastUsed && (
                    <p className="text-gray-400 text-xs mb-4">Last used: {app.lastUsed}</p>
                  )}
                  
                  <button
                    onClick={() => handleLaunchApp(app.url)}
                    className="w-full py-3 bg-blue text-navy font-bold rounded-xl hover:bg-blue/90 transition-all duration-200"
                  >
                    Launch {app.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Available Apps to Add */}
            {showAddApps && (
              <div>
                <h3 className="text-white text-xl font-bold mb-6">Available Apps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableApps.map((app) => (
                    <div key={app.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <Image
                          src={app.logo}
                          alt={`${app.name} Logo`}
                          width={40}
                          height={40}
                          className="rounded-lg mr-3"
                        />
                        <div>
                          <h3 className="text-white font-bold text-lg">{app.name}</h3>
                          <p className="text-white text-sm">{app.description}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddApp(app.id)}
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-gray/90 transition-all duration-200"
                      >
                        Add {app.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Social Accounts Section */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-8">
              Connected Accounts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.socialAccounts.map((account) => (
                <div key={account.provider} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">
                          {account.provider.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg capitalize">{account.provider}</h3>
                        <p className="text-white text-sm">{account.username}</p>
                      </div>
                    </div>
                    <div className="text-green-400 text-sm">Connected</div>
                  </div>
                </div>
              ))}
              
              {user.socialAccounts.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-white text-lg">No social accounts connected yet.</p>
                  <p className="text-gray-400 text-sm">Connect your social accounts for easy content sharing.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 