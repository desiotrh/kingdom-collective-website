import express from 'express';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Validation schema for lawyer registration
const LawyerRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  practice: z.string().min(2, 'Practice area must be specified'),
  location: z.string().min(2, 'Location must be specified'),
  contact: z.string().min(10, 'Contact information must be provided'),
  website: z.string().url().optional().or(z.literal('')),
  state: z.string().length(2, 'State must be 2 characters'),
  county: z.string().min(2, 'County must be specified'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number must be provided'),
  specialties: z.array(z.string()).optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  barNumber: z.string().optional(),
  languages: z.array(z.string()).optional(),
  acceptsNewClients: z.boolean().optional(),
  consultationFee: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
  officeHours: z.string().optional(),
  emergencyContact: z.boolean().optional()
});

// Lawyer registration endpoint
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const validatedData = LawyerRegistrationSchema.parse(req.body);
    
    // Create lawyer object
    const lawyer = {
      ...validatedData,
      id: generateId(),
      verified: false, // Requires manual verification
      verifiedAt: null,
      submittedAt: new Date().toISOString(),
      source: 'Self-Registration',
      status: 'pending', // pending, approved, rejected
      notes: ''
    };

    // Save to pending registrations
    await savePendingRegistration(lawyer);
    
    // Send confirmation email (implement email service)
    // await sendConfirmationEmail(lawyer.email, lawyer.name);
    
    res.json({
      success: true,
      message: 'Registration submitted successfully! We will review and verify your information within 24-48 hours.',
      registrationId: lawyer.id,
      lawyer: {
        name: lawyer.name,
        practice: lawyer.practice,
        location: lawyer.location,
        status: lawyer.status
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Lawyer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Get pending registrations (admin only)
router.get('/pending', async (req, res) => {
  try {
    // TODO: Add admin authentication
    const pendingRegistrations = await getPendingRegistrations();
    
    res.json({
      success: true,
      registrations: pendingRegistrations
    });

  } catch (error) {
    console.error('Error fetching pending registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending registrations'
    });
  }
});

// Approve/reject registration (admin only)
router.post('/:registrationId/review', async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { action, notes } = req.body; // action: 'approve' | 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    // TODO: Add admin authentication
    
    if (action === 'approve') {
      await approveRegistration(registrationId, notes);
    } else {
      await rejectRegistration(registrationId, notes);
    }

    res.json({
      success: true,
      message: `Registration ${action}ed successfully`
    });

  } catch (error) {
    console.error('Error reviewing registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review registration'
    });
  }
});

// Helper functions
function generateId(): string {
  return `lawyer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function savePendingRegistration(lawyer: any): Promise<void> {
  const pendingDir = path.join(__dirname, '..', '..', 'data', 'pending-registrations');
  
  if (!fs.existsSync(pendingDir)) {
    fs.mkdirSync(pendingDir, { recursive: true });
  }

  const filePath = path.join(pendingDir, `${lawyer.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(lawyer, null, 2));
}

async function getPendingRegistrations(): Promise<any[]> {
  const pendingDir = path.join(__dirname, '..', '..', 'data', 'pending-registrations');
  
  if (!fs.existsSync(pendingDir)) {
    return [];
  }

  const files = fs.readdirSync(pendingDir);
  const registrations = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(pendingDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      registrations.push(JSON.parse(content));
    }
  }

  return registrations.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

async function approveRegistration(registrationId: string, notes: string): Promise<void> {
  const pendingDir = path.join(__dirname, '..', '..', 'data', 'pending-registrations');
  const filePath = path.join(pendingDir, `${registrationId}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error('Registration not found');
  }

  const registration = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Update status
  registration.status = 'approved';
  registration.verified = true;
  registration.verifiedAt = new Date().toISOString();
  registration.notes = notes;
  registration.reviewedBy = 'admin'; // TODO: Get actual admin user

  // Save approved registration
  const approvedDir = path.join(__dirname, '..', '..', 'data', 'approved-registrations');
  if (!fs.existsSync(approvedDir)) {
    fs.mkdirSync(approvedDir, { recursive: true });
  }

  const approvedPath = path.join(approvedDir, `${registrationId}.json`);
  fs.writeFileSync(approvedPath, JSON.stringify(registration, null, 2));

  // Remove from pending
  fs.unlinkSync(filePath);

  // TODO: Add to main county data
  await addToCountyData(registration);
}

async function rejectRegistration(registrationId: string, notes: string): Promise<void> {
  const pendingDir = path.join(__dirname, '..', '..', 'data', 'pending-registrations');
  const filePath = path.join(pendingDir, `${registrationId}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error('Registration not found');
  }

  const registration = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Update status
  registration.status = 'rejected';
  registration.notes = notes;
  registration.reviewedBy = 'admin'; // TODO: Get actual admin user
  registration.reviewedAt = new Date().toISOString();

  // Save rejected registration
  const rejectedDir = path.join(__dirname, '..', '..', 'data', 'rejected-registrations');
  if (!fs.existsSync(rejectedDir)) {
    fs.mkdirSync(rejectedDir, { recursive: true });
  }

  const rejectedPath = path.join(rejectedDir, `${registrationId}.json`);
  fs.writeFileSync(rejectedPath, JSON.stringify(registration, null, 2));

  // Remove from pending
  fs.unlinkSync(filePath);
}

async function addToCountyData(lawyer: any): Promise<void> {
  // Add lawyer to the appropriate county file
  const statePath = path.join(__dirname, '..', '..', '..', 'stand-state-packs', 'states', lawyer.state.toLowerCase());
  const countyPath = path.join(statePath, lawyer.county.toLowerCase().replace(/\s+/g, '-'));
  
  if (!fs.existsSync(countyPath)) {
    console.warn(`County path not found: ${countyPath}`);
    return;
  }

  const lawyersPath = path.join(countyPath, 'lawyers.json');
  if (fs.existsSync(lawyersPath)) {
    const currentLawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
    
    // Add new lawyer
    const newLawyer = {
      name: lawyer.name,
      practice: lawyer.practice,
      location: lawyer.location,
      contact: lawyer.phone,
      website: lawyer.website || '',
      verified: true,
      verifiedAt: lawyer.verifiedAt,
      source: 'Self-Registration',
      state: lawyer.state,
      email: lawyer.email,
      specialties: lawyer.specialties || [],
      yearsOfExperience: lawyer.yearsOfExperience,
      barNumber: lawyer.barNumber,
      languages: lawyer.languages || [],
      acceptsNewClients: lawyer.acceptsNewClients,
      consultationFee: lawyer.consultationFee,
      officeHours: lawyer.officeHours
    };

    currentLawyers.lawyers.push(newLawyer);
    currentLawyers.verifiedAt = new Date().toISOString();
    
    // Update sources
    if (!currentLawyers.sources) {
      currentLawyers.sources = [];
    }
    
    const sourceExists = currentLawyers.sources.find((s: any) => s.title === 'Self-Registration');
    if (!sourceExists) {
      currentLawyers.sources.push({
        title: 'Self-Registration',
        url: 'lawyer-registration',
        verified: true
      });
    }

    fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
    console.log(`✅ Added lawyer ${lawyer.name} to ${lawyer.county}, ${lawyer.state}`);
  }
}

export default router;
