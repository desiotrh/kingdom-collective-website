# Email Configuration for Kingdom Studios App

## Email Setup Instructions

### Primary Support Email

- **Primary Email**: support@kingdomstudiosapp.com

### Email Setup

#### Option 1: Using Email Provider Dashboard

1. Log into your domain provider (e.g., GoDaddy, Namecheap, Google Workspace)
2. Navigate to Email settings
3. Create email address: support@kingdomstudiosapp.com
4. Configure email mailbox or set up with your preferred email client

#### Option 2: Using cPanel (if available)

1. Log into cPanel for kingdomstudiosapp.com
2. Go to "Email Accounts"
3. Click "Create"
4. Enter: support@kingdomstudiosapp.com
5. Set password and configure mailbox

#### Option 3: Using Google Workspace

1. Go to Google Admin Console
2. Navigate to Users
3. Add user: support@kingdomstudiosapp.com
4. Configure as shared mailbox or assign to team member

### Developer API Requirements

For social media API applications, you'll need these URLs:

#### Required Legal Pages

- **Terms of Service**: https://kingdomstudiosapp.com/terms
- **Privacy Policy**: https://kingdomstudiosapp.com/privacy
- **Support Contact**: support@kingdomstudiosapp.com

#### Social Media API Applications

**YouTube API (Google Developer Console)**

- Authorized redirect URIs:
  - https://kingdomstudiosapp.com/auth/youtube/callback
  - exp://127.0.0.1:19000/--/auth/youtube/callback (for development)
- Terms of Service URL: https://kingdomstudiosapp.com/terms
- Privacy Policy URL: https://kingdomstudiosapp.com/privacy

**Facebook/Meta API**

- App Domains: kingdomstudiosapp.com
- Privacy Policy URL: https://kingdomstudiosapp.com/privacy
- Terms of Service URL: https://kingdomstudiosapp.com/terms
- Contact Email: support@kingdomstudiosapp.com

**Twitter/X API**

- Website URL: https://kingdomstudiosapp.com
- Terms of Service: https://kingdomstudiosapp.com/terms
- Privacy Policy: https://kingdomstudiosapp.com/privacy

**LinkedIn API**

- Redirect URLs: https://kingdomstudiosapp.com/auth/linkedin/callback
- Privacy Policy URL: https://kingdomstudiosapp.com/privacy
- Terms of Use URL: https://kingdomstudiosapp.com/terms

**TikTok API**

- Privacy Policy: https://kingdomstudiosapp.com/privacy
- Terms of Service: https://kingdomstudiosapp.com/terms
- Contact Information: support@kingdomstudiosapp.com

**Instagram Basic Display API**

- Valid OAuth Redirect URIs: https://kingdomstudiosapp.com/auth/instagram/callback
- Privacy Policy URL: https://kingdomstudiosapp.com/privacy
- Terms of Service URL: https://kingdomstudiosapp.com/terms

### Email Templates

#### Auto-Reply Template for support@kingdomstudiosapp.com

```
Subject: Thank you for contacting Kingdom Studios Support

Hello,

Thank you for reaching out to Kingdom Studios support. We've received your message and will respond within 24 hours.

For faster assistance, please visit our help documentation at:
https://kingdomstudiosapp.com/help

If you need immediate assistance, you can also check our FAQ at:
https://kingdomstudiosapp.com/faq

Best regards,
Kingdom Studios Support Team
support@kingdomstudiosapp.com
```

### DNS Configuration

Add these DNS records to your domain:

```
Type: MX
Name: @
Value: [Your email provider's MX record]
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:[your-provider] ~all

Type: CNAME
Name: autoconfig
Value: [your-provider-autoconfig]
```

### Testing Email Setup

After setup, test the email:

1. Send test email to: support@kingdomstudiosapp.com
2. Check that email is received in the configured mailbox
3. Verify auto-reply works (if configured)
4. Test from different email providers (Gmail, Outlook, Yahoo)

### Security Considerations

- Enable DKIM signing for better deliverability
- Set up DMARC policy for email authentication
- Use SPF records to prevent spoofing
- Consider using a dedicated email service (Google Workspace, Microsoft 365)

### For App Store Submissions

Both Apple App Store and Google Play Store require:

- Working support email: support@kingdomstudiosapp.com
- Accessible Terms of Service: https://kingdomstudiosapp.com/terms
- Accessible Privacy Policy: https://kingdomstudiosapp.com/privacy

These URLs must be publicly accessible and return proper content (not 404 errors).

### Notes

- Email configuration updated throughout the app codebase
- Legal pages are now implemented in the app
- URLs are configured for web deployment
- All email references now point to support@kingdomstudiosapp.com
