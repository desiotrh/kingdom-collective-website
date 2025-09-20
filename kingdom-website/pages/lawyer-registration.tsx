import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LawyerRegistrationPage() {
  return (
    <>
      <Head>
        <title>Join Kingdom Stand as a Lawyer | Kingdom Collective</title>
        <meta 
          name="description" 
          content="Join our legal directory and help families find quality legal assistance. Register your practice with Kingdom Stand today." 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Kingdom Collective
              </Link>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/stand" className="text-gray-600 hover:text-gray-900">
                  Kingdom Stand
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="text-6xl mb-6">⚖️</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Kingdom Stand as a Legal Professional
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Help families navigate complex legal challenges by joining our trusted directory. 
                Connect with clients who need your expertise in family law, mediation, and legal guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#registration-form" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg"
                >
                  Register Your Practice
                </a>
                <a 
                  href="#benefits" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-lg"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Join Kingdom Stand?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Be part of a platform that prioritizes family well-being and connects 
                people with qualified legal professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Targeted Client Base
                </h3>
                <p className="text-gray-600">
                  Connect with families specifically seeking legal assistance in your practice areas.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trusted Platform
                </h3>
                <p className="text-gray-600">
                  Families trust Kingdom Stand to find qualified, verified legal professionals.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mobile-First Access
                </h3>
                <p className="text-gray-600">
                  Clients can find you on-the-go through our mobile app and website.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to join our legal directory
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
                <p className="text-gray-600">
                  Complete the registration form with your practice details
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-gray-600">
                  Our team reviews and verifies your information
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval</h3>
                <p className="text-gray-600">
                  Get approved and added to our directory within 24-48 hours
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600">
                  Start receiving inquiries from families in need
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div id="registration-form" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Join?
              </h2>
              <p className="text-xl text-gray-600">
                Complete the form below to register your practice
              </p>
            </div>

            <LawyerRegistrationFormComponent />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a fee to join?
                </h3>
                <p className="text-gray-600">
                  No, joining our directory is completely free. We believe in making legal 
                  assistance accessible to families.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does approval take?
                </h3>
                <p className="text-gray-600">
                  We typically review and approve registrations within 24-48 hours during 
                  business days.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What information is required?
                </h3>
                <p className="text-gray-600">
                  We require basic contact information, practice areas, location, and 
                  verification of your legal credentials.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I update my information later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can update your practice information at any time through 
                  our admin portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Kingdom Collective</h3>
                <p className="text-gray-400">
                  Empowering families with faith-based solutions and legal guidance.
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li><Link href="/stand" className="hover:text-white">Kingdom Stand</Link></li>
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">
                  Questions about joining?<br />
                  <a href="mailto:legal@kingdomcollective.com" className="hover:text-white">
                    legal@kingdomcollective.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Kingdom Collective. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function LawyerRegistrationFormComponent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    firm: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    practiceAreas: [],
    barNumber: '',
    barState: '',
    yearsExperience: '',
    bio: '',
    website: '',
    consultationFee: '',
    acceptsProBono: false,
    languages: [],
    availability: '',
    emergencyContact: '',
    emergencyPhone: '',
    referralSource: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'acceptsProBono') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'practiceAreas') {
      const value = (e.target as HTMLSelectElement).value;
      setFormData(prev => ({
        ...prev,
        practiceAreas: prev.practiceAreas.includes(value)
          ? prev.practiceAreas.filter(area => area !== value)
          : [...prev.practiceAreas, value]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const practiceAreas = [
    'Family Law',
    'Divorce',
    'Child Custody',
    'Child Support',
    'Spousal Support',
    'Adoption',
    'Domestic Violence',
    'Mediation',
    'Estate Planning',
    'Civil Litigation',
    'Criminal Defense',
    'Personal Injury',
    'Business Law',
    'Immigration',
    'Other'
  ];

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">Registration Submitted!</h3>
        <p className="text-green-700 mb-6">
          Thank you for your interest in joining Kingdom Stand. We&apos;ll review your information 
          and get back to you within 24-48 hours.
        </p>
        <Link 
          href="/stand" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Learn More About Kingdom Stand
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Firm Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Firm Information</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="firm" className="block text-sm font-medium text-gray-700 mb-2">
                Firm Name
              </label>
              <input
                type="text"
                id="firm"
                name="firm"
                value={formData.firm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Practice Areas *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {practiceAreas.map((area) => (
              <label key={area} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="practiceAreas"
                  value={area}
                  checked={formData.practiceAreas.includes(area)}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Legal Credentials */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Credentials *</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="barNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Bar Number *
              </label>
              <input
                type="text"
                id="barNumber"
                name="barNumber"
                required
                value={formData.barNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="barState" className="block text-sm font-medium text-gray-700 mb-2">
                Bar State *
              </label>
              <select
                id="barState"
                name="barState"
                required
                value={formData.barState}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
              </select>
            </div>
            <div>
              <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <select
                id="yearsExperience"
                name="yearsExperience"
                required
                value={formData.yearsExperience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Years</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your legal background and expertise..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee
                </label>
                <input
                  type="text"
                  id="consultationFee"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $150/hour, Free, $200 flat fee"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="acceptsProBono"
                name="acceptsProBono"
                checked={formData.acceptsProBono}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="acceptsProBono" className="text-sm text-gray-700">
                I accept pro bono cases when appropriate
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">
              There was an error submitting your registration. Please try again.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
