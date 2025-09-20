import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface EFilePortal {
  id: string;
  state: string;
  stateName: string;
  portalName: string;
  url: string;
  status: 'active' | 'maintenance' | 'beta' | 'paper-only';
  features: Array<{
    name: string;
    available: boolean;
    description: string;
  }>;
}

interface RegistrationGuide {
  state: string;
  estimatedTime: string;
  cost: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

// Mock data - in production this would come from the e-filing system
const E_FILING_PORTALS: EFilePortal[] = [
  {
    id: 'ca-efile',
    state: 'CA',
    stateName: 'California',
    portalName: 'File & Serve',
    url: 'https://www.fileandserve.com/',
    status: 'active',
    features: [
      { name: 'Statewide E-Filing', available: true, description: 'E-filing available in all CA counties' },
      { name: 'Document Templates', available: true, description: 'Pre-filled forms for common filings' },
      { name: 'Real-Time Status', available: true, description: 'Track document processing in real-time' },
      { name: 'Payment Processing', available: true, description: 'Credit card and e-check payments' }
    ]
  },
  {
    id: 'ny-efile',
    state: 'NY',
    stateName: 'New York',
    portalName: 'NYSCEF',
    url: 'https://iapps.courts.state.ny.us/nyscef/',
    status: 'active',
    features: [
      { name: 'Statewide E-Filing', available: true, description: 'E-filing available in all NY counties' },
      { name: 'Document Management', available: true, description: 'Store and organize case documents' },
      { name: 'Service Tracking', available: true, description: 'Track document service to other parties' }
    ]
  },
  {
    id: 'tx-efile',
    state: 'TX',
    stateName: 'Texas',
    portalName: 'eFileTexas',
    url: 'https://efiletexas.gov/',
    status: 'active',
    features: [
      { name: 'Statewide E-Filing', available: true, description: 'E-filing available in all TX counties' },
      { name: 'Document Templates', available: true, description: 'Pre-filled forms for common filings' },
      { name: 'Real-Time Status', available: true, description: 'Track document processing in real-time' }
    ]
  },
  {
    id: 'fl-efile',
    state: 'FL',
    stateName: 'Florida',
    portalName: 'Florida Courts E-Filing Portal',
    url: 'https://www.myflcourtaccess.com/',
    status: 'active',
    features: [
      { name: 'Statewide E-Filing', available: true, description: 'E-filing available in all FL counties' },
      { name: 'Document Templates', available: true, description: 'Pre-filled forms for common filings' },
      { name: 'Real-Time Status', available: true, description: 'Track document processing in real-time' },
      { name: 'Payment Processing', available: true, description: 'Credit card and e-check payments' }
    ]
  },
  {
    id: 'il-efile',
    state: 'IL',
    stateName: 'Illinois',
    portalName: 'eFileIL',
    url: 'https://www.efile.illinoiscourts.gov/',
    status: 'active',
    features: [
      { name: 'Statewide E-Filing', available: true, description: 'E-filing available in all IL counties' },
      { name: 'Document Templates', available: true, description: 'Pre-filled forms for common filings' },
      { name: 'Real-Time Status', available: true, description: 'Track document processing in real-time' },
      { name: 'Payment Processing', available: true, description: 'Credit card and e-check payments' }
    ]
  }
];

const REGISTRATION_GUIDES: RegistrationGuide[] = [
  {
    state: 'CA',
    estimatedTime: '30-45 minutes',
    cost: 25,
    steps: [
      { title: 'Prepare Required Documents', description: 'Gather ID, email, and payment method' },
      { title: 'Visit File & Serve Website', description: 'Navigate to official registration page' },
      { title: 'Complete Registration Form', description: 'Fill out all required information' },
      { title: 'Verify Your Identity', description: 'Complete identity verification process' },
      { title: 'Pay Registration Fee', description: 'Complete payment for account activation' },
      { title: 'Complete Account Setup', description: 'Finalize your account configuration' }
    ]
  },
  {
    state: 'NY',
    estimatedTime: '2-3 hours (including training)',
    cost: 0,
    steps: [
      { title: 'Prepare Required Documents', description: 'Gather ID and email address' },
      { title: 'Visit NYSCEF Portal', description: 'Navigate to official registration page' },
      { title: 'Complete Registration Form', description: 'Fill out all required information' },
      { title: 'Verify Your Identity', description: 'Complete identity verification process' },
      { title: 'Complete NYSCEF Training', description: 'Complete mandatory e-filing training' }
    ]
  },
  {
    state: 'TX',
    estimatedTime: '20-30 minutes',
    cost: 0,
    steps: [
      { title: 'Prepare Required Documents', description: 'Gather ID and email address' },
      { title: 'Visit eFileTexas Portal', description: 'Navigate to official registration page' },
      { title: 'Complete Registration Form', description: 'Fill out all required information' },
      { title: 'Verify Your Identity', description: 'Complete identity verification process' }
    ]
  },
  {
    state: 'FL',
    estimatedTime: '20-30 minutes',
    cost: 0,
    steps: [
      { title: 'Prepare Required Documents', description: 'Gather ID, email, and payment method' },
      { title: 'Visit Florida Courts Portal', description: 'Navigate to official registration page' },
      { title: 'Complete Registration Form', description: 'Fill out all required information' },
      { title: 'Verify Your Identity', description: 'Complete identity verification process' },
      { title: 'Complete Account Setup', description: 'Finalize your account configuration' }
    ]
  },
  {
    state: 'IL',
    estimatedTime: '15-25 minutes',
    cost: 0,
    steps: [
      { title: 'Prepare Required Documents', description: 'Gather ID and email address' },
      { title: 'Visit eFileIL Portal', description: 'Navigate to official registration page' },
      { title: 'Complete Registration Form', description: 'Fill out all required information' },
      { title: 'Verify Your Identity', description: 'Complete identity verification process' },
      { title: 'Complete Account Setup', description: 'Finalize your account configuration' }
    ]
  }
];

export default function EFilingAssistance() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'portals' | 'guides' | 'assistance'>('overview');

  const selectedPortal = E_FILING_PORTALS.find(p => p.state === selectedState);
  const selectedGuide = REGISTRATION_GUIDES.find(g => g.state === selectedState);

  return (
    <>
      <Head>
        <title>E-Filing Assistance - Kingdom Stand</title>
        <meta name="description" content="Get help with electronic court filing across multiple states. Step-by-step guides, portal information, and filing assistance." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                E-Filing Assistance
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Navigate electronic court filing with confidence. Get step-by-step guidance, 
                portal information, and real-time assistance for your state.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/30 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'portals', label: 'State Portals' },
                { id: 'guides', label: 'Registration Guides' },
                { id: 'assistance', label: 'Filing Assistance' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* What is E-Filing */}
              <section>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    What is E-Filing?
                  </h2>
                  <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                    Electronic filing (e-filing) allows you to submit court documents online instead of 
                    physically going to the courthouse. It&apos;s faster, more convenient, and often required 
                    for modern court proceedings.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Faster Processing</h3>
                    <p className="text-slate-300">
                      Documents are processed immediately and available to the court and other parties 
                      within minutes instead of days.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <div className="text-3xl mb-4">💻</div>
                    <h3 className="text-xl font-semibold text-white mb-3">24/7 Access</h3>
                    <p className="text-slate-300">
                      File documents anytime, anywhere. No need to wait for courthouse hours or 
                      travel to the courthouse.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <div className="text-3xl mb-4">📱</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Real-Time Updates</h3>
                    <p className="text-slate-300">
                      Track the status of your filings in real-time and receive immediate confirmation 
                      of successful submissions.
                    </p>
                  </div>
                </div>
              </section>

              {/* Supported States */}
              <section>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Supported States
                  </h2>
                  <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                    We currently provide comprehensive e-filing assistance for the following states:
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                  {E_FILING_PORTALS.map((portal) => (
                    <div
                      key={portal.id}
                      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 text-center cursor-pointer hover:bg-slate-800/70 transition-colors"
                      onClick={() => setSelectedState(portal.state)}
                    >
                      <div className="text-4xl mb-3">🏛️</div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {portal.stateName}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        {portal.portalName}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        portal.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {portal.status === 'active' ? 'Active' : portal.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Getting Started */}
              <section>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Choose your state above to access detailed registration guides, portal information, 
                    and step-by-step filing assistance.
                  </p>
                  <button
                    onClick={() => setActiveTab('portals')}
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                  >
                    Browse State Portals
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* State Portals Tab */}
          {activeTab === 'portals' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  State E-Filing Portals
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                  Detailed information about each state&apos;s e-filing system, features, and requirements.
                </p>
              </div>

              <div className="space-y-6">
                {E_FILING_PORTALS.map((portal) => (
                  <div
                    key={portal.id}
                    className={`bg-slate-800/50 rounded-lg p-6 border border-slate-700 cursor-pointer transition-all ${
                      selectedState === portal.state 
                        ? 'ring-2 ring-blue-500 bg-slate-800/70' 
                        : 'hover:bg-slate-800/70'
                    }`}
                    onClick={() => setSelectedState(portal.state)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-2xl font-bold text-white">
                            {portal.stateName}
                          </h3>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            portal.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {portal.status === 'active' ? 'Active' : portal.status}
                          </span>
                        </div>
                        
                        <p className="text-lg text-slate-300 mb-4">
                          <strong>Portal:</strong> {portal.portalName}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Available Features:</h4>
                            <ul className="space-y-2">
                              {portal.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-slate-300">
                                  <span className="text-green-400 mr-2">✓</span>
                                  {feature.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-white mb-2">Feature Descriptions:</h4>
                            <ul className="space-y-2">
                              {portal.features.map((feature, index) => (
                                <li key={index} className="text-sm text-slate-400">
                                  {feature.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6">
                        <a
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Visit Portal
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Registration Guides
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                  Step-by-step instructions for setting up e-filing accounts in each supported state.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REGISTRATION_GUIDES.map((guide) => (
                  <div
                    key={guide.state}
                    className={`bg-slate-800/50 rounded-lg p-6 border border-slate-700 cursor-pointer transition-all ${
                      selectedState === guide.state 
                        ? 'ring-2 ring-blue-500 bg-slate-800/70' 
                        : 'hover:bg-slate-800/70'
                    }`}
                    onClick={() => setSelectedState(guide.state)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {guide.state} Registration
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estimated Time:</span>
                          <span className="text-white">{guide.estimatedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cost:</span>
                          <span className="text-white">
                            {guide.cost === 0 ? 'Free' : `$${guide.cost}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Steps:</span>
                          <span className="text-white">{guide.steps.length}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Steps Overview:</h4>
                        <ol className="text-left text-sm text-slate-300 space-y-1">
                          {guide.steps.map((step, index) => (
                            <li key={index} className="flex">
                              <span className="text-blue-400 mr-2">{index + 1}.</span>
                              <span>{step.title}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filing Assistance Tab */}
          {activeTab === 'assistance' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Filing Assistance
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                  Get help with document preparation, validation, and filing requirements for your specific case.
                </p>
              </div>

              {/* State Selection */}
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Select Your State
                </h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {E_FILING_PORTALS.map((portal) => (
                    <button
                      key={portal.id}
                      onClick={() => setSelectedState(portal.state)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedState === portal.state
                          ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🏛️</div>
                      <div className="font-medium">{portal.stateName}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected State Information */}
              {selectedState && selectedPortal && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {selectedPortal.stateName} E-Filing Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Portal Details:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Portal Name:</span>
                            <span className="text-white">{selectedPortal.portalName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              selectedPortal.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedPortal.status === 'active' ? 'Active' : selectedPortal.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Website:</span>
                            <a 
                              href={selectedPortal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Visit Portal
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">Available Features:</h4>
                        <ul className="space-y-2 text-sm">
                          {selectedPortal.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-slate-300">
                              <span className="text-green-400 mr-2">✓</span>
                              {feature.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {selectedGuide && (
                    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Registration Guide
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-2xl mb-2">⏱️</div>
                          <div className="text-sm text-slate-400">Estimated Time</div>
                          <div className="text-lg font-semibold text-white">{selectedGuide.estimatedTime}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">💰</div>
                          <div className="text-sm text-slate-400">Cost</div>
                          <div className="text-lg font-semibold text-white">
                            {selectedGuide.cost === 0 ? 'Free' : `$${selectedGuide.cost}`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">📝</div>
                          <div className="text-sm text-slate-400">Total Steps</div>
                          <div className="text-lg font-semibold text-white">{selectedGuide.steps.length}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {selectedGuide.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                              <p className="text-sm text-slate-300">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Ready to Start Filing?
                    </h3>
                    <p className="text-blue-100 mb-6">
                      Follow the registration guide above to set up your e-filing account, 
                      then use the portal to submit your documents.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={selectedPortal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 border-2 border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
                      >
                        Go to {selectedPortal.portalName}
                      </a>
                      <Link
                        href="/stand"
                        className="inline-flex items-center px-6 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
                      >
                        Back to Kingdom Stand
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


