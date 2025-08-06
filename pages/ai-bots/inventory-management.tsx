import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import BackgroundVideo from '../../components/BackgroundVideo';

interface Message {
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function InventoryManagementBot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'features' | 'pricing'>('overview');
  const [demoMessage, setDemoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'bot',
      message: "👋 Hi! I'm your Kingdom Inventory Management Assistant. I can help you track stock levels, forecast demand, and automate reorders. What would you like to know about your inventory today?",
      timestamp: new Date()
    }
  ]);

  // Live analytics for demo
  const [totalProducts, setTotalProducts] = useState(156);
  const [lowStockItems, setLowStockItems] = useState(8);
  const [outOfStockItems, setOutOfStockItems] = useState(3);
  const [totalValue, setTotalValue] = useState(45230);
  const [stockLevels, setStockLevels] = useState([
    { name: 'Product A', current: 45, min: 20, max: 100, status: 'Good' },
    { name: 'Product B', current: 12, min: 15, max: 50, status: 'Low' },
    { name: 'Product C', current: 3, min: 10, max: 30, status: 'Critical' },
    { name: 'Product D', current: 0, min: 5, max: 25, status: 'Out of Stock' },
    { name: 'Product E', current: 78, min: 25, max: 150, status: 'Good' }
  ]);

  const quickActions = [
    "Check stock levels",
    "Generate reorder report",
    "Forecast demand",
    "Update inventory",
    "Set up alerts",
    "View analytics"
  ];

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoMessage.trim()) return;
    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage: Message = {
      type: 'user',
      message: demoMessage,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);

    // Simulate sophisticated AI response with Kingdom branding
    setTimeout(() => {
      const responses = [
        {
          message: "I'll check your current inventory status. I can see you have 156 products with 8 items running low and 3 out of stock. Product C is critically low with only 3 units remaining. Would you like me to generate a reorder report?",
          products: 0,
          lowStock: 1,
          outOfStock: 0,
          value: 500
        },
        {
          message: "Based on your sales data, I recommend ordering 50 units of Product A, 25 units of Product B, and 20 units of Product C. This will cost approximately $2,450 and bring your stock levels to optimal ranges. Should I place the order?",
          products: 0,
          lowStock: -2,
          outOfStock: -1,
          value: 2450
        },
        {
          message: "I've analyzed your inventory patterns and found that Product A sells 15 units per week on average. With your current stock of 45 units, you have about 3 weeks of inventory remaining. I recommend placing an order within the next week.",
          products: 0,
          lowStock: 0,
          outOfStock: 0,
          value: 0
        },
        {
          message: "I'll update your inventory levels and set up automated alerts for when items reach minimum stock levels. I can also integrate with your suppliers for seamless reordering. What's your preferred reorder threshold?",
          products: 2,
          lowStock: 1,
          outOfStock: 0,
          value: 800
        },
        {
          message: "I'll generate comprehensive inventory analytics including turnover rates, demand forecasting, and cost optimization recommendations. I can also set up seasonal planning for upcoming demand fluctuations. What time period should I analyze?",
          products: 0,
          lowStock: 0,
          outOfStock: 0,
          value: 0
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse.message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setTotalProducts(prev => prev + selectedResponse.products);
      setLowStockItems(prev => prev + selectedResponse.lowStock);
      setOutOfStockItems(prev => prev + selectedResponse.outOfStock);
      setTotalValue(prev => prev + selectedResponse.value);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setDemoMessage(action);
    // Auto-submit the quick action
    const userMessage: Message = {
      type: 'user',
      message: action,
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "I'll check your current stock levels across all products. I can see you have 156 total products with 8 items running low and 3 out of stock. Would you like detailed analytics for specific categories?",
        "I'll generate a comprehensive reorder report based on your current stock levels and sales forecasts. I can also include supplier recommendations and cost optimization suggestions. What's your preferred order timeline?",
        "I'll analyze your historical sales data to forecast future demand. I can also account for seasonal trends and market fluctuations. What time period should I focus on for the forecast?",
        "I'll update your inventory levels and sync with your POS system. I can also set up automated stock adjustments and reconciliation. What specific items need updating?",
        "I'll configure automated alerts for low stock levels, out-of-stock items, and unusual demand patterns. I can also set up custom notification rules. What alert thresholds do you prefer?",
        "I'll generate detailed inventory analytics including turnover rates, profit margins, and demand patterns. I can also create custom reports for different time periods. What metrics are most important to you?"
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        type: 'bot',
        message: selectedResponse,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Inventory Management Bot - Kingdom Collective</title>
        <meta name="description" content="Comprehensive inventory tracking with stock alerts and demand forecasting. Perfect for retail, e-commerce, and manufacturing businesses." />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">📦</span>
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Inventory Management Bot
                </h1>
                <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto">
                  Optimize your inventory with intelligent tracking, demand forecasting, 
                  and automated reorder notifications.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started - $269
                </Link>
                <button
                  onClick={() => setActiveTab('demo')}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Try Demo
                </button>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'overview' 
                      ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'demo' 
                      ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Live Demo
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'features' 
                      ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'pricing' 
                      ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Pricing
                </button>
              </div>
            </div>
          </section>

          {/* Tab Content */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-16">
                  {/* What it does */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">What It Does</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="card-standard">
                        <h3 className="text-white text-2xl font-bold mb-4">🎯 Perfect For</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Retail stores and boutiques
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            E-commerce and online shops
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Warehouses and distribution centers
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Manufacturing and production
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Food service and restaurants
                          </li>
                        </ul>
                      </div>
                      
                      <div className="card-standard">
                        <h3 className="text-white text-2xl font-bold mb-4">⚡ Key Benefits</h3>
                        <ul className="space-y-3 text-white/80">
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Real-time stock tracking
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Automated reorder notifications
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Demand forecasting
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Supplier communication
                          </li>
                          <li className="flex items-center">
                            <span className="text-kingdom-gold mr-3">•</span>
                            Analytics and reporting
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How it works */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">1</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Stock Monitoring</h3>
                        <p className="text-white/80">
                          Continuously tracks inventory levels across all locations and channels.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">2</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Intelligent Analysis</h3>
                        <p className="text-white/80">
                          Analyzes sales patterns, seasonal trends, and predicts future demand.
                        </p>
                      </div>
                      
                      <div className="card-standard text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">3</span>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Automated Actions</h3>
                        <p className="text-white/80">
                          Sends alerts, generates orders, and communicates with suppliers automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Seamless Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Shopify', icon: '🛒' },
                        { name: 'WooCommerce', icon: '📦' },
                        { name: 'QuickBooks', icon: '📊' },
                        { name: 'Xero', icon: '💰' },
                        { name: 'Square', icon: '💳' },
                        { name: 'Stripe', icon: '💳' },
                        { name: 'Slack', icon: '💬' },
                        { name: 'Email', icon: '📧' }
                      ].map((platform) => (
                        <div key={platform.name} className="card-standard text-center">
                          <div className="text-3xl mb-3">{platform.icon}</div>
                          <h3 className="text-white font-bold">{platform.name}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Tab */}
              {activeTab === 'demo' && (
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Live Inventory Management Demo</h2>
                  <p className="text-white/80 text-center mb-12">
                    Experience the Kingdom Inventory Management Bot in action with real-time stock tracking and demand forecasting.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2 card-standard">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mr-3">
                          <span className="text-kingdom-dark text-lg">👑</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold">Kingdom Inventory Assistant</h3>
                          <p className="text-white/60 text-sm">Powered by Kingdom AI</p>
                        </div>
                      </div>
                      
                      {/* Conversation History */}
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {conversationHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black' : 'bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 text-white border border-kingdom-gold/30'}`}>
                              <div className="p-3 rounded-lg">
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-60 mt-1">
                                  {msg.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-kingdom-gold/20 to-kingdom-orange/20 border border-kingdom-gold/30 rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-kingdom-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="mb-4">
                        <p className="text-white/80 text-sm mb-2">Quick Actions:</p>
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(action)}
                              className="px-3 py-1 bg-white/10 text-white text-xs rounded-full hover:bg-white/20 transition-all duration-200"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Message Input */}
                      <form onSubmit={handleDemoSubmit} className="space-y-4">
                        <textarea
                          value={demoMessage}
                          onChange={(e) => setDemoMessage(e.target.value)}
                          placeholder="Ask about stock levels, reorder suggestions, demand forecasting..."
                          className="textarea-standard w-full"
                          rows={3}
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !demoMessage.trim()}
                          className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Processing...' : 'Send Message'}
                        </button>
                      </form>
                    </div>
                    
                    {/* Live Analytics Dashboard */}
                    <div className="space-y-6">
                      {/* Inventory Analytics */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📊 Live Inventory Analytics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Products:</span>
                            <span className="text-kingdom-gold font-bold">{totalProducts}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Low Stock Items:</span>
                            <span className="text-kingdom-gold font-bold">{lowStockItems}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Out of Stock:</span>
                            <span className="text-kingdom-gold font-bold">{outOfStockItems}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Value:</span>
                            <span className="text-kingdom-gold font-bold">${totalValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stock Levels */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">📦 Stock Levels</h3>
                        <div className="space-y-3">
                          {stockLevels.map((product, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-white font-semibold text-sm">{product.name}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  product.status === 'Good' ? 'bg-green-500/20 text-green-400' :
                                  product.status === 'Low' ? 'bg-yellow-500/20 text-yellow-400' :
                                  product.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {product.status}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-white/60">
                                <span>Current: {product.current}</span>
                                <span>Min: {product.min}</span>
                                <span>Max: {product.max}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Real-time Features */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">⚡ Real-time Features</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Stock tracking
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Reorder automation
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Demand forecasting
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Supplier management
                          </div>
                          <div className="flex items-center text-white/80">
                            <span className="text-kingdom-gold mr-2">•</span>
                            Cost optimization
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-16">
                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        {
                          title: 'Stock Tracking',
                          description: 'Real-time monitoring of inventory levels across all locations',
                          icon: '📊'
                        },
                        {
                          title: 'Reorder Notifications',
                          description: 'Automated alerts when items reach minimum stock levels',
                          icon: '🔔'
                        },
                        {
                          title: 'Supplier Communication',
                          description: 'Direct integration with suppliers for automated ordering',
                          icon: '🤝'
                        },
                        {
                          title: 'Demand Forecasting',
                          description: 'AI-powered predictions based on historical sales data',
                          icon: '🔮'
                        },
                        {
                          title: 'Barcode Scanning',
                          description: 'Mobile app integration for quick inventory updates',
                          icon: '📱'
                        },
                        {
                          title: 'Analytics Reporting',
                          description: 'Comprehensive reports on stock turnover and performance',
                          icon: '📈'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="card-standard">
                          <div className="flex items-start space-x-4">
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                              <h3 className="text-white text-xl font-bold mb-2">{feature.title}</h3>
                              <p className="text-white/80">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-white text-4xl font-black mb-8">Advanced Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        {
                          title: 'Multi-location Support',
                          description: 'Manage inventory across multiple warehouses and stores',
                          icon: '🏢'
                        },
                        {
                          title: 'Seasonal Planning',
                          description: 'Intelligent planning for seasonal demand fluctuations',
                          icon: '🌤️'
                        },
                        {
                          title: 'Cost Optimization',
                          description: 'Suggest optimal order quantities to minimize costs',
                          icon: '💰'
                        },
                        {
                          title: 'Custom Alerts',
                          description: 'Personalized notifications based on your business rules',
                          icon: '⚙️'
                        }
                      ].map((feature) => (
                        <div key={feature.title} className="card-standard">
                          <div className="flex items-start space-x-4">
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                              <h3 className="text-white text-xl font-bold mb-2">{feature.title}</h3>
                              <p className="text-white/80">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-white text-4xl font-black mb-8 text-center">Pricing Options</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic */}
                    <div className="card-standard border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Basic</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$269</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic stock tracking
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Low stock alerts
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Basic reporting
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Email notifications
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black font-bold rounded-xl hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>

                    {/* Professional */}
                    <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-8 border border-kingdom-gold/30 relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </span>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-4">Professional</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$369</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Basic
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Demand forecasting
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Supplier integration
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced analytics
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Multi-location support
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-xl hover:scale-105 transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>

                    {/* Enterprise */}
                    <div className="card-standard border border-white/10">
                      <h3 className="text-white text-2xl font-bold mb-4">Enterprise</h3>
                      <div className="text-kingdom-gold text-4xl font-black mb-6">$569</div>
                      <ul className="space-y-3 text-white/80 mb-8">
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Everything in Professional
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Custom integrations
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Priority support
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          Advanced forecasting
                        </li>
                        <li className="flex items-center">
                          <span className="text-kingdom-gold mr-3">✓</span>
                          White-label options
                        </li>
                      </ul>
                      <Link
                        href="/ai-bots/pricing"
                        className="w-full py-3 bg-gradient-to-r from-kingdom-gold to-kingdom-gold-soft text-black font-bold rounded-xl hover:from-kingdom-gold-soft hover:to-kingdom-gold-matte transition-all duration-200 text-center block"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-12 sm:py-16 md:py-20 bg-black/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-white text-4xl font-black mb-6">
                Ready to Optimize Your Inventory?
              </h2>
              <p className="text-white/80 text-xl mb-8">
                Join thousands of businesses saving time and money with our 
                intelligent inventory management bot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ai-bots/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark font-bold rounded-full text-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </section>

          {/* GitHub Repository Link */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">📦 Source Code</h3>
                <p className="text-gray-300 mb-4">Get the complete source code for this bot</p>
              </div>
              <a 
                href="https://github.com/desiotrh/inventory-bot.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
} 