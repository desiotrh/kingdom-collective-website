import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';
import Image from 'next/image';
import Link from 'next/link';

interface AppData {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
}

interface AIBotData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'maintenance' | 'inactive';
  purchaseDate: string;
  nextBilling?: string;
  maintenanceScheduled?: string;
  lastUsed?: string;
  url?: string;
}

interface OrderData {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: 'completed' | 'pending' | 'refunded';
  invoiceUrl?: string;
}

interface NotificationData {
  id: string;
  type: 'maintenance' | 'update' | 'billing' | 'security';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface Bot {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  features: string[];
}

const availableBots: Bot[] = [
  {
    id: 'sales-assistant',
    name: 'Sales Assistant Bot',
    price: 299,
    category: 'Sales',
    description: 'Intelligent sales automation with lead qualification and follow-up capabilities',
    features: ['Lead qualification', 'Product recommendations', 'Follow-up automation', 'Biblical communication standards']
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking Bot',
    price: 199,
    category: 'Scheduling',
    description: 'Automated appointment scheduling with calendar integration and reminders',
    features: ['Calendar integration', 'Time zone handling', 'Reminder notifications', 'Payment processing']
  },
  {
    id: 'faq-knowledge',
    name: 'FAQ & Knowledge Base Bot',
    price: 179,
    category: 'Support',
    description: 'Intelligent search and context-aware responses for customer support',
    features: ['Intelligent search', 'Context-aware responses', 'Article suggestions', 'Multi-language support']
  }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'apps' | 'ai-bots' | 'orders' | 'notifications'>('apps');
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

  // Mock AI Bot data - in real app, this would come from API
  const userAIBots: AIBotData[] = [
    {
      id: 'sales-assistant',
      name: 'Sales Assistant Bot',
      description: 'Lead generation and qualification automation',
      status: 'active',
      purchaseDate: '2024-01-15',
      lastUsed: '3 hours ago',
      url: '/ai-bots/sales-assistant'
    },
    {
      id: 'appointment-booking',
      name: 'Appointment Booking Bot',
      description: 'Automated appointment scheduling',
      status: 'maintenance',
      purchaseDate: '2024-01-20',
      maintenanceScheduled: '2024-02-01 02:00 UTC',
      lastUsed: '1 day ago',
      url: '/ai-bots/appointment-booking'
    },
    {
      id: 'faq-knowledge',
      name: 'FAQ & Knowledge Base Bot',
      description: 'Intelligent FAQ handling',
      status: 'active',
      purchaseDate: '2024-01-25',
      lastUsed: '5 hours ago',
      url: '/ai-bots/faq-knowledge'
    }
  ];

  // Mock order history
  const orderHistory: OrderData[] = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: ['Sales Assistant Bot', 'Custom Branding', 'VoiceBot Integration'],
      total: 324,
      status: 'completed',
      invoiceUrl: '#'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      items: ['Appointment Booking Bot', 'Stripe Setup'],
      total: 314,
      status: 'completed',
      invoiceUrl: '#'
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      items: ['FAQ & Knowledge Base Bot'],
      total: 159,
      status: 'completed',
      invoiceUrl: '#'
    }
  ];

  // Mock notifications
  const notifications: NotificationData[] = [
    {
      id: '1',
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'Appointment Booking Bot will be offline for 2 hours on Feb 1st, 2:00 AM UTC for updates.',
      date: '2024-01-30',
      read: false
    },
    {
      id: '2',
      type: 'update',
      title: 'New Feature Available',
      message: 'Sales Assistant Bot now supports multi-language responses. Update available.',
      date: '2024-01-29',
      read: true
    },
    {
      id: '3',
      type: 'billing',
      title: 'Payment Successful',
      message: 'Your monthly subscription payment of $49 has been processed successfully.',
      date: '2024-01-28',
      read: true
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'maintenance': return 'text-yellow-400';
      case 'inactive': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Dashboard Header */}
        <section className="px-40 py-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-white text-lg">
                  Manage your Kingdom Collective apps and AI bots.
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Active Apps</h3>
                <p className="text-blue text-3xl font-black">{userApps.length}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">AI Bots</h3>
                <p className="text-blue text-3xl font-black">{userAIBots.length}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Orders</h3>
                <p className="text-blue text-3xl font-black">{orderHistory.length}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Notifications</h3>
                <p className="text-blue text-3xl font-black">{notifications.filter(n => !n.read).length}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-2 mb-8">
              <button
                onClick={() => setActiveTab('apps')}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === 'apps' 
                    ? 'bg-blue text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Apps
              </button>
              <button
                onClick={() => setActiveTab('ai-bots')}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === 'ai-bots' 
                    ? 'bg-blue text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                AI Bots
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === 'orders' 
                    ? 'bg-blue text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-blue text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Notifications
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-40 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto">
            
            {/* Apps Tab */}
            {activeTab === 'apps' && (
              <div>
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
                    className="px-6 py-3 bg-gray text-white font-bold rounded-full hover:bg-blue hover:text-white transition-all duration-200"
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
                        className="w-full py-3 bg-gray text-white font-bold rounded-xl hover:bg-blue hover:text-white transition-all duration-200"
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
            )}

            {/* AI Bots Tab */}
            {activeTab === 'ai-bots' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                      Your AI Bots
                    </h2>
                    <p className="text-white text-lg">
                      Manage your purchased AI bots and monitor their performance.
                    </p>
                  </div>
                  <Link
                    href="/ai-bots"
                    className="px-6 py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full hover:scale-105 transition-all duration-200"
                  >
                    Buy More Bots
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAIBots.map((bot) => (
                    <div key={bot.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                              <span className="text-kingdom-gold text-sm font-medium">{bot.category}</span>
                            </div>
                            <p className="text-white text-sm">{bot.description}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(bot.status)}`}>
                          {bot.status}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-400 text-xs">Purchased: {bot.purchaseDate}</p>
                        {bot.lastUsed && (
                          <p className="text-gray-400 text-xs">Last used: {bot.lastUsed}</p>
                        )}
                        {bot.maintenanceScheduled && (
                          <p className="text-yellow-400 text-xs">Maintenance: {bot.maintenanceScheduled}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={bot.url || '#'}
                          className="flex-1 py-3 bg-gray text-white font-bold rounded-xl hover:bg-blue hover:text-white transition-all duration-200 text-center"
                        >
                          Manage Bot
                        </Link>
                        <button className="px-3 py-3 bg-black/30 text-white rounded-xl hover:bg-black/50 transition-all duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                      Order History
                    </h2>
                    <p className="text-white text-lg">
                      View your purchase history and download invoices.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{order.id}</h3>
                          <p className="text-gray-400 text-sm">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-kingdom-gold font-bold text-xl">${order.total}</p>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-white text-sm font-semibold mb-2">Items:</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-gray-400 text-sm">• {item}</p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {order.invoiceUrl && (
                          <button className="px-4 py-2 bg-gray text-white rounded-lg hover:bg-gray/90 transition-all duration-200 text-sm">
                            Download Invoice
                          </button>
                        )}
                        <button className="px-4 py-2 bg-black/30 text-white rounded-lg hover:bg-black/50 transition-all duration-200 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                      Notifications
                    </h2>
                    <p className="text-white text-lg">
                      Stay updated on your bots, maintenance, and account activity.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`bg-black/20 backdrop-blur-sm rounded-xl p-6 ${
                      !notification.read ? 'border-l-4 border-blue' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              notification.type === 'maintenance' ? 'bg-yellow-400' :
                              notification.type === 'update' ? 'bg-blue' :
                              notification.type === 'billing' ? 'bg-green-400' :
                              'bg-red-400'
                            }`}></div>
                            <h3 className="text-white font-bold text-lg">{notification.title}</h3>
                            {!notification.read && (
                              <div className="ml-2 w-2 h-2 bg-blue rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                          <p className="text-gray-500 text-xs">{notification.date}</p>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 