# Facebook Integration Setup Guide

## Overview

This guide covers the complete setup of Facebook integration for the Kingdom Studios app, including OAuth login, data deletion callbacks, and compliance requirements.

## Prerequisites

- Facebook Developer Account
- Facebook App created in the Facebook Developer Console
- Domain verification completed
- Privacy Policy and Terms of Service URLs ready

## Step 1: Facebook App Configuration

### 1.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Select "Consumer" as the app type
4. Fill in your app details:
   - **App Name**: Kingdom Studios
   - **Contact Email**: support@kingdomcollective.pro
   - **App Purpose**: Select appropriate categories

### 1.2 Add Facebook Login Product

1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Select "Web" platform (for the website integration)

### 1.3 Configure App Settings

Go to **Settings → Basic** and configure:

```
App Domains: kingdomstudiosapp.com
Privacy Policy URL: https://kingdomstudiosapp.com/privacy
Terms of Service URL: https://kingdomstudiosapp.com/terms
```

### 1.4 Configure Facebook Login Settings

Go to **Facebook Login → Settings** and add:

**Valid OAuth Redirect URIs:**

```
https://kingdomstudiosapp.com/auth/facebook/callback
https://kingdom-collective-website.vercel.app/auth/facebook/callback
```

**Data Deletion Request URL:**

```
https://kingdomstudiosapp.com/api/v1/facebook/data-deletion
```

**Deauthorize Callback URL:**

```
https://kingdomstudiosapp.com/api/v1/facebook/deauthorize
```

## Step 2: Environment Variables

### 2.1 Backend Environment (.env)

Add these variables to your backend `.env` file:

```env
# Facebook Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
BASE_URL=https://kingdomstudiosapp.com
```

### 2.2 Mobile App Environment (.env.local)

Add this variable to your mobile app `.env.local` file:

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
```

## Step 3: Backend Implementation

### 3.1 Facebook Routes

The backend includes these Facebook-specific endpoints:

- `POST /api/v1/facebook/data-deletion` - Handles data deletion requests
- `GET /api/v1/facebook/deletion-status` - Check deletion status
- `POST /api/v1/facebook/deauthorize` - Handles app deauthorization

### 3.2 Data Deletion Implementation

The data deletion callback:

1. Receives signed requests from Facebook
2. Verifies the request signature
3. Extracts the user ID
4. Deletes all associated user data
5. Returns a confirmation code and status URL

### 3.3 Required Backend Dependencies

Ensure these are installed:

```bash
npm install crypto express
```

## Step 4: Mobile App Implementation

### 4.1 Auth Utilities

The mobile app uses `expo-facebook` for authentication:

```typescript
import * as Facebook from "expo-facebook";
import * as SecureStore from "expo-secure-store";
```

### 4.2 Secure Token Storage

Access tokens are stored securely using `expo-secure-store`:

```typescript
await SecureStore.setItemAsync("facebook_access_token", accessToken);
```

### 4.3 Permission Handling

The app requests only basic permissions that don't require App Review:

```typescript
const permissions = ["public_profile", "email"];
```

## Step 5: Website Implementation

### 5.1 Deletion Status Page

A dedicated page for users to check deletion status:

- URL: `https://kingdomstudiosapp.com/deletion-status`
- Shows confirmation codes and deletion details
- Provides clear information about what was deleted

### 5.2 Privacy Policy Updates

Ensure your privacy policy includes:

1. **Data Collection**: What Facebook data you collect
2. **Data Usage**: How you use the data
3. **Data Deletion**: How users can request deletion
4. **Contact Information**: How to reach you about data requests

## Step 6: Testing

### 6.1 Test Facebook Login

1. Test login flow in development
2. Verify token storage
3. Test logout functionality
4. Check permission handling

### 6.2 Test Data Deletion

1. Log into your app with Facebook
2. Go to Facebook Settings → Apps and Websites
3. Remove your app
4. Check that the deletion callback is triggered
5. Verify the status page works

### 6.3 Test Deauthorization

1. Test the deauthorization callback
2. Verify access tokens are revoked
3. Check user status updates

## Step 7: App Review (If Needed)

### 7.1 When App Review is Required

App Review is required if you request permissions beyond:

- `public_profile`
- `email`

### 7.2 App Review Process

1. **Prepare Documentation**:
   - Detailed app description
   - Screenshots/videos of Facebook integration
   - Privacy policy
   - Terms of service

2. **Submit for Review**:
   - Go to App Review in Facebook Developer Console
   - Submit required permissions
   - Provide detailed explanations

3. **Testing Phase**:
   - Facebook will test your app
   - Ensure all functionality works
   - Respond to any questions

## Step 8: Production Deployment

### 8.1 Update App Settings

Before going live:

1. **App Status**: Change from "Development" to "Live"
2. **Privacy Policy**: Ensure it's publicly accessible
3. **Terms of Service**: Ensure it's publicly accessible
4. **Contact Information**: Verify all contact details

### 8.2 Monitor and Maintain

1. **Monitor Logs**: Check for any errors in Facebook callbacks
2. **Update Permissions**: Add new permissions as needed
3. **Compliance**: Stay updated with Facebook's platform policies

## Troubleshooting

### Common Issues

1. **"Invalid OAuth Redirect URI"**
   - Verify all redirect URIs are exactly correct
   - Check for trailing slashes
   - Ensure HTTPS is used

2. **"App Not Configured for Facebook Login"**
   - Ensure Facebook Login product is added
   - Check app settings configuration
   - Verify app is in "Live" mode

3. **"Data Deletion Callback Failed"**
   - Check server logs for errors
   - Verify app secret is correct
   - Ensure endpoint is publicly accessible

4. **"Permission Denied"**
   - Check if permissions require App Review
   - Verify permission names are correct
   - Ensure app is properly configured

### Debug Tools

1. **Facebook Graph API Explorer**: Test API calls
2. **Facebook Login Debugger**: Debug login issues
3. **App Dashboard**: Monitor app performance and errors

## Security Best Practices

1. **Never expose app secrets** in client-side code
2. **Always verify signed requests** from Facebook
3. **Use HTTPS** for all endpoints
4. **Implement proper error handling**
5. **Log security events** for monitoring
6. **Regularly rotate app secrets**

## Compliance Requirements

1. **GDPR Compliance**: Implement data deletion requests
2. **CCPA Compliance**: Provide data access and deletion
3. **Facebook Platform Terms**: Follow all platform policies
4. **Privacy Laws**: Comply with local privacy regulations

## Support Resources

- [Facebook Developers Documentation](https://developers.facebook.com/docs/)
- [Facebook Platform Policies](https://developers.facebook.com/policy/)
- [Facebook App Review Guidelines](https://developers.facebook.com/docs/app-review/)
- [Facebook Login Best Practices](https://developers.facebook.com/docs/facebook-login/best-practices/)

## Contact Information

For technical support with Facebook integration:

- **Email**: support@kingdomcollective.pro
- **Documentation**: This guide and inline code comments
- **Issues**: Check server logs and Facebook Developer Console








