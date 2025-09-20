import React, { useState } from 'react';
import { Button } from './Button';
import { LawyerRegistrationForm } from './LawyerRegistrationForm';

interface LawyerRegistrationCTAProps {
  variant?: 'button' | 'card' | 'banner';
  className?: string;
}

export const LawyerRegistrationCTA: React.FC<LawyerRegistrationCTAProps> = ({
  variant = 'button',
  className = ''
}) => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Join Kingdom Stand</h2>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="px-4 py-2"
            >
              ✕ Close
            </Button>
          </div>
          <LawyerRegistrationForm
            onSubmit={() => {
              setShowForm(false);
              // Could show success message here
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  switch (variant) {
    case 'button':
      return (
        <Button
          onClick={() => setShowForm(true)}
          className={`bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium ${className}`}
        >
          Join as a Lawyer
        </Button>
      );

    case 'card':
      return (
        <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg ${className}`}>
          <div className="text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-xl font-bold mb-2">Are You a Lawyer?</h3>
            <p className="text-blue-100 mb-4">
              Help families find quality legal assistance in your area. 
              Join our directory and grow your practice.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium"
            >
              Register Now
            </Button>
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600 text-2xl">⚖️</div>
              <div>
                <h4 className="font-medium text-blue-900">Join Our Legal Directory</h4>
                <p className="text-sm text-blue-700">
                  Help families find quality legal assistance. Register your practice today.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Register
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
