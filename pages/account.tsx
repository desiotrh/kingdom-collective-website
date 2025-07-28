import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';
import Image from 'next/image';

export default function Account() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleConnectSocial = async (provider: string) => {
    setIsLoading(true);
    // Simulate social connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'apps', name: 'Apps', icon: '📱' },
    { id: 'social', name: 'Social Accounts', icon: '🔗' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Profile Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue rounded-full flex items-center justify-center">
              {user.avatar ? (
                <Image src={user.avatar} alt="Profile" width={80} height={80} className="rounded-full" />
              ) : (
                <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">{user.name}</h4>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Display Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full p-3 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full p-3 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue text-navy font-bold rounded-xl hover:bg-blue/90 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAppsTab = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Your Selected Apps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.selectedApps.map(appId => (
            <div key={appId} className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue rounded-lg mr-3"></div>
                <div>
                  <h4 className="text-white font-semibold capitalize">{appId.replace('-', ' ')}</h4>
                  <p className="text-gray-400 text-sm">Active</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Connected Social Accounts</h3>
        <div className="space-y-4">
          {user.socialAccounts.map(account => (
            <div key={account.provider} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{account.provider.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold capitalize">{account.provider}</h4>
                  <p className="text-gray-400 text-sm">{account.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-sm">Connected</span>
                <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-t border-gray/30 pt-4">
            <h4 className="text-white font-semibold mb-4">Connect More Accounts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['google', 'facebook', 'apple', 'linkedin', 'tiktok'].map(provider => {
                const isConnected = user.socialAccounts.some(acc => acc.provider === provider);
                return (
                  <button
                    key={provider}
                    onClick={() => handleConnectSocial(provider)}
                    disabled={isConnected || isLoading}
                    className="flex items-center justify-center p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-all duration-200 disabled:opacity-50"
                  >
                    <span className="text-white font-semibold capitalize">{provider}</span>
                    {isConnected && <span className="text-green-400 ml-2">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Experience Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="experienceMode"
                checked={user.preferences.faithMode}
                className="mr-3"
              />
              <div>
                <div className="text-white font-semibold">Faith Mode</div>
                <div className="text-gray-400 text-sm">Biblical integration and spiritual growth tools</div>
              </div>
            </label>
          </div>
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="experienceMode"
                checked={!user.preferences.faithMode}
                className="mr-3"
              />
              <div>
                <div className="text-white font-semibold">Encouragement Mode</div>
                <div className="text-gray-400 text-sm">Uplifting and empowering content</div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.preferences.notifications}
              className="mr-3"
            />
            <div>
              <div className="text-white font-semibold">Email Notifications</div>
              <div className="text-gray-400 text-sm">Receive updates about new features and tips</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Subscription Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
            <div>
              <h4 className="text-white font-semibold">Free Plan</h4>
              <p className="text-gray-400 text-sm">Basic access to all apps</p>
            </div>
            <span className="text-green-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">Payment Methods</h3>
        <p className="text-gray-400">No payment methods added yet.</p>
        <button className="mt-4 px-6 py-3 bg-blue text-navy font-bold rounded-xl hover:bg-blue/90 transition-all duration-200">
          Add Payment Method
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'apps':
        return renderAppsTab();
      case 'social':
        return renderSocialTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Account Header */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-4">
              Account Settings
            </h1>
            <p className="text-white text-lg">
              Manage your profile, preferences, and connected accounts.
            </p>
          </div>
        </section>

        {/* Account Content */}
        <section className="px-40 py-20">
          <div className="max-w-[960px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                  <nav className="space-y-2">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue text-navy font-semibold'
                            : 'text-white hover:bg-black/30'
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 