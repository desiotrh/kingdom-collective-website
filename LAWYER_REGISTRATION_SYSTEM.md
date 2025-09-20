# 🏛️ Lawyer Registration System

## Overview

The Lawyer Registration System allows legal professionals to self-register with Kingdom Stand, creating a sustainable and scalable way to populate our legal directory with real, verified information.

## 🚀 Features

### For Lawyers

- **Self-Registration Form**: Comprehensive form for practice details
- **Practice Areas**: Multiple specialty selections
- **Location-Based**: State and county-specific listings
- **Verification Process**: 24-48 hour review and approval
- **Free to Join**: No cost for directory inclusion

### For Administrators

- **Review Dashboard**: Approve/reject registrations
- **Data Management**: Organize by status and location
- **Verification Tools**: Ensure data quality and accuracy
- **Export Capabilities**: Access registration data

## 📁 System Architecture

### Backend API (`packages/api/src/routes/lawyer-registration.ts`)

- **POST** `/api/v1/lawyer-registration/register` - Submit new registration
- **GET** `/api/v1/lawyer-registration/pending` - Get pending registrations
- **POST** `/api/v1/lawyer-registration/:id/review` - Approve/reject registration

### Frontend Components (`packages/ui/src/components/`)

- **`LawyerRegistrationForm`** - Main registration form
- **`LawyerRegistrationAdmin`** - Admin review dashboard
- **`LawyerRegistrationCTA`** - Call-to-action buttons

### Website Pages

- **`/lawyer-registration`** - Dedicated registration page
- **`/admin/lawyer-registrations`** - Admin management page
- **`/stand`** - Kingdom Stand page with CTA integration

## 🔄 Registration Flow

### 1. Lawyer Submits Registration

```
Lawyer fills form → Data validation → Save to pending → Send confirmation
```

### 2. Admin Review Process

```
Admin reviews → Approve/Reject → Add to county data → Update status
```

### 3. Data Integration

```
Approved lawyer → Added to county JSON → Available in app → Listed in directory
```

## 📋 Required Information

### Basic Details

- Full Name
- Practice Area
- Office Location
- Phone Number
- Email Address
- Website (optional)

### Location & Licensing

- State (2-letter code)
- County
- Bar Number (optional)
- Years of Experience

### Specialties & Services

- Practice Areas (multiple selection)
- Consultation Fee
- Office Hours
- Payment Methods
- Accepting New Clients
- Emergency Contact Availability

## 🛡️ Data Validation

### Input Validation

- **Required Fields**: Name, practice, location, phone, state, county, email
- **Format Validation**: Email format, phone length, state format
- **Content Validation**: Practice area selection, location details

### Business Rules

- **Unique Identification**: Generated registration ID
- **Verification Status**: Pending → Approved/Rejected
- **Data Integrity**: Automatic county file updates

## 🔐 Security & Privacy

### Data Protection

- **Input Sanitization**: XSS prevention
- **Validation**: Server-side verification
- **Access Control**: Admin-only review endpoints

### Privacy Compliance

- **Data Retention**: Organized by status
- **User Consent**: Terms acceptance
- **Contact Information**: Professional use only

## 📊 Data Storage

### File Structure

```
packages/api/data/
├── pending-registrations/
│   ├── lawyer_[timestamp]_[id].json
│   └── ...
├── approved-registrations/
│   ├── lawyer_[timestamp]_[id].json
│   └── ...
└── rejected-registrations/
    ├── lawyer_[timestamp]_[id].json
    └── ...
```

### County Integration

```
packages/stand-state-packs/states/[state]/[county]/
├── lawyers.json
│   ├── lawyers: [approved lawyer data]
│   ├── verifiedAt: timestamp
│   └── sources: [registration source]
```

## 🎯 Usage Examples

### Adding CTA to Existing Pages

```tsx
import { LawyerRegistrationCTA } from '@kingdom-studios/ui/components/LawyerRegistrationCTA';

// Simple button
<LawyerRegistrationCTA variant="button" />

// Prominent card
<LawyerRegistrationCTA variant="card" />

// Banner style
<LawyerRegistrationCTA variant="banner" />
```

### Admin Review Process

```tsx
import { LawyerRegistrationAdmin } from "@kingdom-studios/ui/components/LawyerRegistrationAdmin";

// Full admin dashboard
<LawyerRegistrationAdmin />;
```

## 🚀 Deployment

### Backend Setup

1. **Install Dependencies**: `npm install` in `packages/api`
2. **Route Registration**: Add to main Express app
3. **Data Directories**: Ensure write permissions

### Frontend Integration

1. **Component Import**: Add to UI package exports
2. **Page Creation**: Create registration and admin pages
3. **Navigation**: Add links to main site navigation

### Environment Variables

```env
# Optional: Email service for confirmations
EMAIL_SERVICE_API_KEY=your_key_here
EMAIL_FROM=noreply@kingdomcollective.com
```

## 📈 Growth Strategy

### Immediate (Week 1)

- Launch registration system
- Add CTAs to existing pages
- Manual outreach to local lawyers

### Short-term (Month 1)

- Partner with local bar associations
- Legal aid organization collaboration
- Social media promotion

### Long-term (Quarter 1)

- Community contribution system
- Data quality improvements
- Advanced search and filtering

## 🔧 Customization

### Adding New Fields

1. **Update Schema**: Modify validation in API route
2. **Form Component**: Add input fields to registration form
3. **Admin Display**: Show new fields in review dashboard
4. **Data Storage**: Include in county JSON structure

### Practice Area Expansion

```typescript
const PRACTICE_AREAS = [
  // Existing areas...
  "New Practice Area",
  "Another Specialty",
];
```

### Location Support

```typescript
const US_STATES = [
  // Add new states or territories
  { value: "DC", label: "District of Columbia" },
];
```

## 🐛 Troubleshooting

### Common Issues

- **Form Submission Fails**: Check API endpoint and validation
- **Admin Access Issues**: Verify route permissions
- **Data Not Saving**: Check file permissions and paths
- **County Not Found**: Ensure state/county directory exists

### Debug Commands

```bash
# Check pending registrations
curl /api/v1/lawyer-registration/pending

# View data directories
ls -la packages/api/data/

# Test county file updates
ls -la packages/stand-state-packs/states/ca/los-angeles/
```

## 📚 Additional Resources

### Related Documentation

- [Kingdom Stand App Overview](../apps/kingdom-stand/README.md)
- [State Packs Documentation](../packages/stand-state-packs/README.md)
- [API Documentation](../packages/api/README.md)

### Legal Considerations

- **Terms of Service**: Include in registration form
- **Privacy Policy**: Data handling and retention
- **Professional Standards**: Verify credentials and compliance
- **Liability Protection**: Clear disclaimers and limitations

## 🤝 Contributing

### Development Workflow

1. **Feature Branch**: Create from main
2. **Component Development**: Build and test UI components
3. **API Integration**: Connect frontend to backend
4. **Testing**: Validate form submission and admin review
5. **Documentation**: Update this README

### Testing Checklist

- [ ] Registration form validation
- [ ] Admin review process
- [ ] County data integration
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Kingdom Collective Development Team
