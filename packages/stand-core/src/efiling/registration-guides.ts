// E-Filing Registration Guides
// Step-by-step instructions for signing up with state e-filing systems

import { RegistrationGuide, RegistrationStep, RegistrationRequirement, CommonIssue, Contact } from './types';
import { STATE_EFILE_PORTALS } from './portals';

export const REGISTRATION_GUIDES: RegistrationGuide[] = [
  // California Registration Guide
  {
    state: 'CA',
    portal: STATE_EFILE_PORTALS.find(p => p.state === 'CA')!,
    steps: [
      {
        order: 1,
        title: 'Prepare Required Documents',
        description: 'Gather necessary identification and information',
        instructions: [
          'Valid California driver\'s license or passport',
          'Current email address',
          'Credit card or debit card for registration fee',
          'Basic information about your legal case (if applicable)'
        ],
        tips: [
          'Ensure your ID is current and not expired',
          'Use an email address you check regularly',
          'Have payment method ready before starting'
        ],
        warnings: [
          'Do not use a shared email address',
          'Keep your login credentials secure'
        ]
      },
      {
        order: 2,
        title: 'Visit File & Serve Website',
        description: 'Navigate to the official registration page',
        instructions: [
          'Open your web browser',
          'Go to: https://www.fileandserve.com/register',
          'Click "Register" or "Create Account"',
          'Select "Individual" or "Pro Se Litigant"'
        ],
        tips: [
          'Use a modern browser (Chrome, Firefox, Safari, Edge)',
          'Ensure pop-up blockers are disabled',
          'Bookmark the site for future use'
        ],
        warnings: [
          'Only use the official File & Serve website',
          'Avoid third-party registration services'
        ]
      },
      {
        order: 3,
        title: 'Complete Registration Form',
        description: 'Fill out all required information accurately',
        instructions: [
          'Enter your full legal name exactly as it appears on your ID',
          'Provide your current residential address',
          'Enter your phone number and email address',
          'Create a strong password (8+ characters, mix of letters/numbers)',
          'Select security questions and answers'
        ],
        tips: [
          'Use your legal name, not nicknames',
          'Choose a password you can remember but others can\'t guess',
          'Write down your security questions and answers'
        ],
        warnings: [
          'All information must be accurate and current',
          'Keep your password secure and don\'t share it'
        ]
      },
      {
        order: 4,
        title: 'Verify Your Identity',
        description: 'Complete identity verification process',
        instructions: [
          'Upload a clear photo of your government ID',
          'Verify your email address by clicking the confirmation link',
          'Complete any additional verification steps if prompted'
        ],
        tips: [
          'Ensure your ID photo is clear and readable',
          'Check your email spam folder for confirmation',
          'Complete verification within 24 hours'
        ],
        warnings: [
          'Only upload official government identification',
          'Do not share your verification codes with anyone'
        ]
      },
      {
        order: 5,
        title: 'Pay Registration Fee',
        description: 'Complete payment for account activation',
        instructions: [
          'Enter your credit card or debit card information',
          'Verify the $25 registration fee amount',
          'Complete the payment transaction',
          'Wait for payment confirmation'
        ],
        tips: [
          'Use a card with sufficient available credit',
          'Save your payment confirmation email',
          'The fee is a one-time charge'
        ],
        warnings: [
          'Ensure you\'re on a secure payment page',
          'Never share your card information in emails'
        ]
      },
      {
        order: 6,
        title: 'Complete Account Setup',
        description: 'Finalize your account and start using e-filing',
        instructions: [
          'Review your account information for accuracy',
          'Set up any additional security features',
          'Explore the e-filing interface',
          'Review available document types and fees'
        ],
        tips: [
          'Take time to familiarize yourself with the system',
          'Review the help documentation and tutorials',
          'Practice with sample documents if available'
        ],
        warnings: [
          'Don\'t attempt to file real documents until you\'re comfortable',
          'Contact support if you have questions'
        ]
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid California driver\'s license or passport',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'payment',
        name: 'Registration Fee',
        description: 'One-time account setup fee',
        required: true,
        cost: 25,
        processingTime: 'Immediate'
      }
    ],
    commonIssues: [
      {
        problem: 'ID verification fails',
        solution: 'Ensure your ID is current, clear, and matches your registration information exactly',
        prevention: 'Use a high-quality photo and verify all information matches',
        supportContact: {
          name: 'File & Serve Support',
          role: 'Technical Support',
          phone: '(800) 818-5664',
          email: 'support@fileandserve.com',
          hours: 'Monday-Friday 6:00 AM - 6:00 PM PST'
        }
      },
      {
        problem: 'Email verification not received',
        solution: 'Check spam folder, request new verification email, or contact support',
        prevention: 'Use a reliable email provider and check spam settings',
        supportContact: {
          name: 'File & Serve Support',
          role: 'Technical Support',
          phone: '(800) 818-5664',
          email: 'support@fileandserve.com',
          hours: 'Monday-Friday 6:00 AM - 6:00 PM PST'
        }
      },
      {
        problem: 'Payment processing error',
        solution: 'Verify card information, ensure sufficient funds, or try a different payment method',
        prevention: 'Use a card with sufficient available credit and correct billing information',
        supportContact: {
          name: 'File & Serve Billing',
          role: 'Billing Support',
          phone: '(800) 818-5664',
          email: 'billing@fileandserve.com',
          hours: 'Monday-Friday 6:00 AM - 6:00 PM PST'
        }
      }
    ],
    supportContacts: [
      {
        name: 'File & Serve Support',
        role: 'General Technical Support',
        phone: '(800) 818-5664',
        email: 'support@fileandserve.com',
        hours: 'Monday-Friday 6:00 AM - 6:00 PM PST',
        notes: 'Primary support for all technical issues'
      },
      {
        name: 'File & Serve Billing',
        role: 'Payment and Billing Support',
        phone: '(800) 818-5664',
        email: 'billing@fileandserve.com',
        hours: 'Monday-Friday 6:00 AM - 6:00 PM PST',
        notes: 'Help with payment issues and fee questions'
      },
      {
        name: 'California Courts Self-Help',
        role: 'General Court Information',
        phone: '(800) 900-5985',
        email: 'selfhelp@courts.ca.gov',
        hours: 'Monday-Friday 8:00 AM - 5:00 PM PST',
        notes: 'General information about court procedures and forms'
      }
    ],
    estimatedTime: '30-45 minutes',
    cost: 25
  },

  // New York Registration Guide
  {
    state: 'NY',
    portal: STATE_EFILE_PORTALS.find(p => p.state === 'NY')!,
    steps: [
      {
        order: 1,
        title: 'Complete NYSCEF Training',
        description: 'Mandatory training for all e-filing users',
        instructions: [
          'Visit the NYSCEF training website',
          'Complete the mandatory e-filing training course',
          'Pass the training assessment',
          'Receive training completion certificate'
        ],
        tips: [
          'Training takes approximately 1-2 hours',
          'Take notes during training for future reference',
          'Keep your completion certificate'
        ],
        warnings: [
          'Training is mandatory before registration',
          'Cannot proceed without completion certificate'
        ]
      },
      {
        order: 2,
        title: 'Prepare Required Information',
        description: 'Gather necessary documents and information',
        instructions: [
          'Training completion certificate',
          'Valid government identification',
          'Current email address',
          'Basic case information (if applicable)'
        ],
        tips: [
          'Have all documents ready before starting',
          'Ensure email address is current and accessible'
        ],
        warnings: [
          'Incomplete information will delay registration'
        ]
      },
      {
        order: 3,
        title: 'Visit NYSCEF Registration',
        description: 'Navigate to the official registration page',
        instructions: [
          'Open your web browser',
          'Go to: https://iapps.courts.state.ny.us/nyscef/registration',
          'Click "Register" or "Create Account"',
          'Select "Pro Se Litigant"'
        ],
        tips: [
          'Use a modern, secure browser',
          'Bookmark the NYSCEF website'
        ],
        warnings: [
          'Only use the official NYSCEF website',
          'Avoid third-party registration services'
        ]
      },
      {
        order: 4,
        title: 'Complete Registration Form',
        description: 'Fill out all required information accurately',
        instructions: [
          'Enter your full legal name',
          'Provide current contact information',
          'Upload training completion certificate',
          'Create secure login credentials',
          'Set up security questions'
        ],
        tips: [
          'Use your legal name exactly as it appears on official documents',
          'Choose a strong, memorable password'
        ],
        warnings: [
          'All information must be accurate and verifiable',
          'Keep your login credentials secure'
        ]
      },
      {
        order: 5,
        title: 'Verify Account',
        description: 'Complete account verification process',
        instructions: [
          'Verify your email address',
          'Complete any additional verification steps',
          'Wait for account approval',
          'Receive confirmation email'
        ],
        tips: [
          'Check email spam folder for verification messages',
          'Complete verification within 24 hours'
        ],
        warnings: [
          'Account approval may take 2-3 business days',
          'Contact support if verification is delayed'
        ]
      }
    ],
    requirements: [
      {
        type: 'training',
        name: 'NYSCEF Training',
        description: 'Complete mandatory e-filing training course',
        required: true,
        cost: 0,
        processingTime: '1-2 hours'
      },
      {
        type: 'document',
        name: 'Training Certificate',
        description: 'Proof of training completion',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    commonIssues: [
      {
        problem: 'Training completion not recognized',
        solution: 'Ensure training certificate is properly uploaded and training was completed recently',
        prevention: 'Complete training within 30 days of registration',
        supportContact: {
          name: 'NYSCEF Support',
          role: 'Technical Support',
          phone: '(855) 268-7861',
          email: 'nyscef@nycourts.gov',
          hours: 'Monday-Friday 8:30 AM - 4:30 PM EST'
        }
      },
      {
        problem: 'Account approval delayed',
        solution: 'Contact NYSCEF support to check status and expedite if possible',
        prevention: 'Ensure all required information is complete and accurate',
        supportContact: {
          name: 'NYSCEF Support',
          role: 'Technical Support',
          phone: '(855) 268-7861',
          email: 'nyscef@nycourts.gov',
          hours: 'Monday-Friday 8:30 AM - 4:30 PM EST'
        }
      }
    ],
    supportContacts: [
      {
        name: 'NYSCEF Support',
        role: 'General Technical Support',
        phone: '(855) 268-7861',
        email: 'nyscef@nycourts.gov',
        hours: 'Monday-Friday 8:30 AM - 4:30 PM EST',
        notes: 'Primary support for all NYSCEF issues'
      },
      {
        name: 'New York Courts Self-Help',
        role: 'General Court Information',
        phone: '(800) 268-7869',
        email: 'selfhelp@nycourts.gov',
        hours: 'Monday-Friday 8:30 AM - 4:30 PM EST',
        notes: 'General information about court procedures'
      }
    ],
    estimatedTime: '2-3 hours (including training)',
    cost: 0
  },
  // Florida Registration Guide
  {
    state: 'FL',
    portal: STATE_EFILE_PORTALS.find(p => p.state === 'FL')!,
    steps: [
      {
        order: 1,
        title: 'Prepare Required Documents',
        description: 'Gather necessary identification and information',
        instructions: [
          'Valid Florida driver\'s license or ID',
          'Current email address',
          'Credit card or debit card for filing fees',
          'Basic information about your legal case'
        ],
        tips: [
          'Ensure your ID is current and not expired',
          'Use an email address you check regularly',
          'Have payment method ready before starting'
        ],
        warnings: [
          'Do not use a shared email address',
          'Keep your login credentials secure'
        ]
      },
      {
        order: 2,
        title: 'Visit Florida Courts E-Filing Portal',
        description: 'Navigate to the official registration page',
        instructions: [
          'Open your web browser',
          'Go to: https://www.myflcourtaccess.com/register',
          'Click "Register" or "Create Account"',
          'Select "Individual" or "Pro Se Litigant"'
        ],
        tips: [
          'Use a modern browser (Chrome, Firefox, Safari, Edge)',
          'Ensure pop-up blockers are disabled',
          'Bookmark the site for future use'
        ],
        warnings: [
          'Only use the official Florida Courts E-Filing Portal',
          'Avoid third-party registration services'
        ]
      },
      {
        order: 3,
        title: 'Complete Registration Form',
        description: 'Fill out all required information accurately',
        instructions: [
          'Enter your full legal name exactly as it appears on your ID',
          'Provide your current residential address',
          'Enter your phone number and email address',
          'Create a strong password (8+ characters)',
          'Select security questions and answers'
        ],
        tips: [
          'Use your legal name, not nicknames',
          'Choose a password you can remember but others can\'t guess',
          'Write down your security questions and answers'
        ],
        warnings: [
          'All information must be accurate and current',
          'Keep your password secure and don\'t share it'
        ]
      },
      {
        order: 4,
        title: 'Verify Your Identity',
        description: 'Complete identity verification process',
        instructions: [
          'Upload a clear photo of your government ID',
          'Verify your email address by clicking the confirmation link',
          'Complete any additional verification steps if prompted'
        ],
        tips: [
          'Ensure your ID photo is clear and readable',
          'Check your email spam folder for confirmation',
          'Complete verification within 24 hours'
        ],
        warnings: [
          'Only upload official government identification',
          'Do not share your verification codes with anyone'
        ]
      },
      {
        order: 5,
        title: 'Complete Account Setup',
        description: 'Finalize your account configuration',
        instructions: [
          'Set up your profile information',
          'Configure notification preferences',
          'Review and accept terms of service',
          'Complete any additional setup steps'
        ],
        tips: [
          'Enable email notifications for important updates',
          'Review all terms and conditions carefully',
          'Save your login information securely'
        ],
        warnings: [
          'Read all terms before accepting',
          'Keep your account information secure'
        ]
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid Florida driver\'s license or ID',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'payment',
        name: 'Payment Method',
        description: 'Credit card or debit card for filing fees',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    commonIssues: [
      {
        problem: 'ID verification fails',
        solution: 'Ensure ID is current and photo is clear',
        prevention: 'Use high-quality scan or photo of current ID'
      },
      {
        problem: 'Email verification not received',
        solution: 'Check spam folder and request resend',
        prevention: 'Use a reliable email provider'
      },
      {
        problem: 'Payment processing errors',
        solution: 'Try different payment method or contact support',
        prevention: 'Ensure sufficient funds and valid payment method'
      }
    ],
    supportContacts: [
      {
        name: 'Florida Courts E-Filing Support',
        role: 'Technical Support',
        phone: '(850) 414-7722',
        email: 'support@myflcourtaccess.com',
        hours: 'Monday-Friday 8:00 AM - 5:00 PM EST'
      }
    ],
    estimatedTime: '20-30 minutes',
    cost: 0
  },
  // Illinois Registration Guide
  {
    state: 'IL',
    portal: STATE_EFILE_PORTALS.find(p => p.state === 'IL')!,
    steps: [
      {
        order: 1,
        title: 'Prepare Required Documents',
        description: 'Gather necessary identification and information',
        instructions: [
          'Valid Illinois driver\'s license or ID',
          'Current email address',
          'Basic information about your legal case'
        ],
        tips: [
          'Ensure your ID is current and not expired',
          'Use an email address you check regularly'
        ],
        warnings: [
          'Do not use a shared email address',
          'Keep your login credentials secure'
        ]
      },
      {
        order: 2,
        title: 'Visit eFileIL Portal',
        description: 'Navigate to the official registration page',
        instructions: [
          'Open your web browser',
          'Go to: https://www.efile.illinoiscourts.gov/register',
          'Click "Register" or "Create Account"',
          'Select "Individual" or "Pro Se Litigant"'
        ],
        tips: [
          'Use a modern browser (Chrome, Firefox, Safari, Edge)',
          'Ensure pop-up blockers are disabled',
          'Bookmark the site for future use'
        ],
        warnings: [
          'Only use the official eFileIL portal',
          'Avoid third-party registration services'
        ]
      },
      {
        order: 3,
        title: 'Complete Registration Form',
        description: 'Fill out all required information accurately',
        instructions: [
          'Enter your full legal name exactly as it appears on your ID',
          'Provide your current residential address',
          'Enter your phone number and email address',
          'Create a strong password (8+ characters)',
          'Select security questions and answers'
        ],
        tips: [
          'Use your legal name, not nicknames',
          'Choose a password you can remember but others can\'t guess',
          'Write down your security questions and answers'
        ],
        warnings: [
          'All information must be accurate and current',
          'Keep your password secure and don\'t share it'
        ]
      },
      {
        order: 4,
        title: 'Verify Your Identity',
        description: 'Complete identity verification process',
        instructions: [
          'Upload a clear photo of your government ID',
          'Verify your email address by clicking the confirmation link',
          'Complete any additional verification steps if prompted'
        ],
        tips: [
          'Ensure your ID photo is clear and readable',
          'Check your email spam folder for confirmation',
          'Complete verification within 24 hours'
        ],
        warnings: [
          'Only upload official government identification',
          'Do not share your verification codes with anyone'
        ]
      },
      {
        order: 5,
        title: 'Complete Account Setup',
        description: 'Finalize your account configuration',
        instructions: [
          'Set up your profile information',
          'Configure notification preferences',
          'Review and accept terms of service',
          'Complete any additional setup steps'
        ],
        tips: [
          'Enable email notifications for important updates',
          'Review all terms and conditions carefully',
          'Save your login information securely'
        ],
        warnings: [
          'Read all terms before accepting',
          'Keep your account information secure'
        ]
      }
    ],
    requirements: [
      {
        type: 'document',
        name: 'Government ID',
        description: 'Valid Illinois driver\'s license or ID',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      },
      {
        type: 'verification',
        name: 'Email Verification',
        description: 'Valid email address for account activation',
        required: true,
        cost: 0,
        processingTime: 'Immediate'
      }
    ],
    commonIssues: [
      {
        problem: 'ID verification fails',
        solution: 'Ensure ID is current and photo is clear',
        prevention: 'Use high-quality scan or photo of current ID'
      },
      {
        problem: 'Email verification not received',
        solution: 'Check spam folder and request resend',
        prevention: 'Use a reliable email provider'
      },
      {
        problem: 'Account activation delays',
        solution: 'Contact support if activation takes more than 24 hours',
        prevention: 'Complete all verification steps promptly'
      }
    ],
    supportContacts: [
      {
        name: 'eFileIL Support',
        role: 'Technical Support',
        phone: '(217) 782-5180',
        email: 'support@efile.illinoiscourts.gov',
        hours: 'Monday-Friday 8:30 AM - 4:30 PM CST'
      }
    ],
    estimatedTime: '15-25 minutes',
    cost: 0
  }
];

// Helper function to get registration guide by state
export function getRegistrationGuideByState(stateCode: string): RegistrationGuide | undefined {
  return REGISTRATION_GUIDES.find(guide => guide.state === stateCode.toUpperCase());
}

// Helper function to get all available registration guides
export function getAllRegistrationGuides(): RegistrationGuide[] {
  return REGISTRATION_GUIDES;
}

// Helper function to get registration guide by portal ID
export function getRegistrationGuideByPortalId(portalId: string): RegistrationGuide | undefined {
  return REGISTRATION_GUIDES.find(guide => guide.portal.id === portalId);
}
