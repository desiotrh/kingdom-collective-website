import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';

interface LawyerRegistrationFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  practice: string;
  location: string;
  contact: string;
  website: string;
  state: string;
  county: string;
  email: string;
  phone: string;
  specialties: string[];
  yearsOfExperience: number;
  barNumber: string;
  languages: string[];
  acceptsNewClients: boolean;
  consultationFee: string;
  paymentMethods: string[];
  officeHours: string;
  emergencyContact: boolean;
}

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

const PRACTICE_AREAS = [
  'Family Law',
  'Divorce',
  'Child Custody',
  'Child Support',
  'Adoption',
  'Domestic Violence',
  'Estate Planning',
  'Wills & Trusts',
  'Probate',
  'Real Estate',
  'Criminal Defense',
  'Personal Injury',
  'Employment Law',
  'Immigration',
  'Bankruptcy',
  'Business Law',
  'Tax Law',
  'Mediation',
  'Arbitration',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'Check',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Payment Plans',
  'Sliding Scale',
  'Pro Bono',
  'Legal Aid',
  'Insurance'
];

export const LawyerRegistrationForm: React.FC<LawyerRegistrationFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    practice: '',
    location: '',
    contact: '',
    website: '',
    state: '',
    county: '',
    email: '',
    phone: '',
    specialties: [],
    yearsOfExperience: 0,
    barNumber: '',
    languages: [],
    acceptsNewClients: true,
    consultationFee: '',
    paymentMethods: [],
    officeHours: '',
    emergencyContact: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.practice.trim()) newErrors.practice = 'Practice area is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.county.trim()) newErrors.county = 'County is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/v1/lawyer-registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        onSubmit?.(result);
      } else {
        setErrors({ submit: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Registration Submitted Successfully!
          </h2>
          <p className="text-green-700 mb-4">
            Thank you for registering with Kingdom Stand. We will review and verify your 
            information within 24-48 hours. You will receive an email confirmation shortly.
          </p>
          <p className="text-sm text-green-600">
            Registration ID: {formData.name.replace(/\s+/g, '-').toLowerCase()}-{Date.now()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Join Kingdom Stand as a Legal Professional
        </h1>
        <p className="text-gray-600">
          Help families find quality legal assistance in your area. Complete the form below 
          to be listed in our directory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              placeholder="John Smith, Esq."
              required
            />
            <Input
              label="Primary Practice Area"
              value={formData.practice}
              onChange={(value) => handleInputChange('practice', value)}
              error={errors.practice}
              placeholder="Family Law"
              required
            />
            <Input
              label="Office Location"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors.location}
              placeholder="Los Angeles, CA"
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="(213) 555-0123"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="john.smith@lawfirm.com"
              required
            />
            <Input
              label="Website (Optional)"
              value={formData.website}
              onChange={(value) => handleInputChange('website', value)}
              placeholder="https://www.lawfirm.com"
            />
          </div>
        </div>

        {/* Location & Licensing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Licensing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="State"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
              options={US_STATES}
              error={errors.state}
              required
            />
            <Input
              label="County"
              value={formData.county}
              onChange={(value) => handleInputChange('county', value)}
              error={errors.county}
              placeholder="Los Angeles"
              required
            />
            <Input
              label="Bar Number (Optional)"
              value={formData.barNumber}
              onChange={(value) => handleInputChange('barNumber', value)}
              placeholder="123456"
            />
                           <Input
                 label="Years of Experience"
                 type="number"
                 value={formData.yearsOfExperience}
                 onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                 placeholder="5"
                 min="0"
                 max="50"
               />
          </div>
        </div>

        {/* Specialties & Services */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties & Services</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Areas & Specialties
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRACTICE_AREAS.map(area => (
                                   <Checkbox
                   key={area}
                   label={area}
                   checked={formData.specialties.includes(area)}
                   onChange={(e) => handleArrayChange('specialties', area, e.target.checked)}
                 />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Consultation Fee (Optional)"
                value={formData.consultationFee}
                onChange={(value) => handleInputChange('consultationFee', value)}
                placeholder="Free, $100, Sliding Scale"
              />
              <Input
                label="Office Hours (Optional)"
                value={formData.officeHours}
                onChange={(value) => handleInputChange('officeHours', value)}
                placeholder="Mon-Fri 9AM-5PM"
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Accepting New Clients"
                checked={formData.acceptsNewClients}
                onChange={(checked) => handleInputChange('acceptsNewClients', checked)}
              />
              <Checkbox
                label="Available for Emergency Contact"
                checked={formData.emergencyContact}
                onChange={(checked) => handleInputChange('emergencyContact', checked)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Methods Accepted
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(method => (
                                     <Checkbox
                     key={method}
                     label={method}
                     checked={formData.paymentMethods.includes(method)}
                     onChange={(e) => handleArrayChange('paymentMethods', method, e.target.checked)}
                   />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="text-center space-y-4">
          {errors.submit && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-8 py-3"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            By submitting this form, you agree to our terms of service and privacy policy. 
            Your information will be reviewed before being added to our directory.
          </p>
        </div>
      </form>
    </div>
  );
};
