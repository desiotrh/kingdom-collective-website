import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';
import OnboardingWizard from '../components/OnboardingWizard';
import Image from 'next/image';

export default function Signup() {
  const { user, login, socialLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      if (user && !user.isOnboarded) {
        setShowOnboarding(true);
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await socialLogin(provider);
      if (user && !user.isOnboarded) {
        setShowOnboarding(true);
      }
    } catch (err) {
      setError(`${provider} signup failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (showOnboarding) {
    return <OnboardingWizard />;
  }

  if (isAuthenticated && user?.isOnboarded) {
    // Redirect to dashboard
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
      <BackgroundVideo />
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Navigation />
        
        {/* Signup Section */}
        <section className="px-40 py-20 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/kingdom-collective-logo.png"
                  alt="Kingdom Collective Logo"
                  width={80}
                  height={80}
                  className="rounded-xl"
                  priority
                />
              </div>
              <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-4">
                Join Kingdom Collective
              </h1>
              <p className="text-white text-lg">
                Start your journey with our suite of faith-driven apps
              </p>
            </div>

            {/* Email Signup Form */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 mb-6">
              <form onSubmit={handleEmailSignup} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-white font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 bg-black/30 border border-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue/50 transition-colors duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-blue text-navy font-bold rounded-xl hover:bg-blue/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray/30"></div>
              <span className="px-4 text-white text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gray/30"></div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleSocialSignup('google')}
                disabled={isLoading}
                className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialSignup('facebook')}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button
                onClick={() => handleSocialSignup('apple')}
                disabled={isLoading}
                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-white">
                Already have an account?{' '}
                <Link href="/login" className="text-blue hover:text-blue/80 transition-colors duration-200 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
} 