import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface LawyerRegistration {
  id: string;
  name: string;
  practice: string;
  location: string;
  email: string;
  phone: string;
  state: string;
  county: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export const LawyerRegistrationAdmin: React.FC = () => {
  const [registrations, setRegistrations] = useState<LawyerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<LawyerRegistration | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      const response = await fetch('/api/v1/lawyer-registration/pending');
      const result = await response.json();
      
      if (result.success) {
        setRegistrations(result.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedRegistration) return;

    setProcessing(true);
    
    try {
      const response = await fetch(`/api/v1/lawyer-registration/${selectedRegistration.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes: reviewNotes
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove from list and refresh
        setRegistrations(prev => prev.filter(r => r.id !== selectedRegistration.id));
        setSelectedRegistration(null);
        setReviewNotes('');
        
        // Show success message
        alert(`Registration ${action}ed successfully!`);
      } else {
        alert(`Failed to ${action} registration: ${result.message}`);
      }
    } catch (error) {
      alert(`Error processing request: ${error}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading registrations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lawyer Registration Admin
        </h1>
        <p className="text-gray-600">
          Review and approve lawyer registrations for Kingdom Stand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Registrations ({registrations.length})
              </h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {registrations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No pending registrations
                </div>
              ) : (
                registrations.map(registration => (
                  <div
                    key={registration.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedRegistration?.id === registration.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedRegistration(registration)}
                  >
                    <div className="font-medium text-gray-900">{registration.name}</div>
                    <div className="text-sm text-gray-600">{registration.practice}</div>
                    <div className="text-sm text-gray-500">{registration.location}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Submitted: {formatDate(registration.submittedAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Registration Details & Review */}
        <div className="lg:col-span-2">
          {selectedRegistration ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Review Registration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Practice Area</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.practice}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.location}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/County</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.state} / {selectedRegistration.county}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.email}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 text-gray-900">{selectedRegistration.phone}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <div className="mt-1 text-gray-900">{formatDate(selectedRegistration.submittedAt)}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add notes about this registration..."
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleReview('approve')}
                    disabled={processing}
                    className="px-6 py-2 bg-green-600 text-white hover:bg-green-700"
                  >
                    {processing ? 'Processing...' : 'Approve'}
                  </Button>
                  
                  <Button
                    onClick={() => handleReview('reject')}
                    disabled={processing}
                    className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {processing ? 'Processing...' : 'Reject'}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setSelectedRegistration(null);
                      setReviewNotes('');
                    }}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select a registration to review
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <Button
            onClick={fetchPendingRegistrations}
            variant="outline"
            className="px-4 py-2"
          >
            Refresh List
          </Button>
          
          <Button
            onClick={() => window.open('/api/v1/lawyer-registration/pending', '_blank')}
            variant="outline"
            className="px-4 py-2"
          >
            View Raw Data
          </Button>
        </div>
      </div>
    </div>
  );
};
