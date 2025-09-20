# Android Facebook Setup Guide for Expo/React Native

## Overview

This guide covers the Android-specific setup for Facebook integration in your Expo/React Native app. Since you're using Expo, the native Android SDK integration is handled automatically by the `expo-facebook` plugin.

## Step 1: Facebook App Configuration

### 1.1 Add Android Platform

1. Go to your [Facebook App Dashboard](https://developers.facebook.com/apps/)
2. Select your app
3. Click **"Add Platform"** → **"Android"**
4. Fill in the Android configuration:

```
Package Name: com.kingdomstudios.app
Class Name: com.kingdomstudios.app.MainActivity
```

### 1.2 Generate Key Hashes

You need to generate key hashes for your Android app. Here are the methods:

#### Method 1: Using Expo Development Build (Recommended)

1. **Install EAS CLI globally:**

   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo:**

   ```bash
   eas login
   ```

3. **Generate development build:**

   ```bash
   eas build --platform android --profile development
   ```

4. **Get the key hash from the build logs** or use the debug key hash for development.

#### Method 2: Manual Key Hash Generation

For development, you can use the default debug key hash:

1. **Find your debug keystore location:**
   - Windows: `%USERPROFILE%\.android\debug.keystore`
   - macOS/Linux: `~/.android/debug.keystore`

2. **Generate debug key hash:**

   ```bash
   keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
   ```

3. **For Windows (PowerShell):**
   ```powershell
   keytool -exportcert -alias androiddebugkey -keystore "$env:USERPROFILE\.android\debug.keystore" | openssl sha1 -binary | openssl base64
   ```

#### Method 3: Using Expo's Key Hash Generator

1. **Install the key hash generator:**

   ```bash
   npx expo install expo-dev-client
   ```

2. **Run the app in development:**

   ```bash
   npx expo start --dev-client
   ```

3. **Check the logs for the key hash** when the app starts.

### 1.3 Add Key Hashes to Facebook App

1. In your Facebook App Dashboard → Android Settings
2. Add the generated key hashes to the **"Key Hashes"** field
3. For development, add the debug key hash
4. For production, you'll need the release key hash from your EAS build

## Step 2: Update App Configuration

### 2.1 Update app.config.js

Ensure your `app.config.js` has the correct Android configuration:

```javascript
export default {
  expo: {
    name: "Kingdom Studios",
    slug: "kingdom-studios",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kingdomstudios.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.kingdomstudios.app",
      permissions: ["INTERNET"],
    },
    plugins: ["expo-facebook"],
    extra: {
      facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
    },
  },
};
```

### 2.2 Environment Variables

Ensure your `.env.local` file has:

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
```

## Step 3: Testing Facebook Login

### 3.1 Development Testing

1. **Start your development server:**

   ```bash
   npx expo start --dev-client
   ```

2. **Test Facebook login** in your app
3. **Check the logs** for any authentication errors
4. **Verify token storage** using the auth utilities we created

### 3.2 Common Development Issues

1. **"Invalid key hash" error:**
   - Ensure the debug key hash is added to Facebook App settings
   - Regenerate the key hash if needed

2. **"App not configured for Facebook Login":**
   - Check that Facebook Login product is added to your app
   - Verify the package name matches exactly

3. **"Invalid OAuth redirect URI":**
   - This is mainly for web, but ensure your app settings are correct

## Step 4: Production Build

### 4.1 Generate Production Key Hash

1. **Create a production build:**

   ```bash
   eas build --platform android --profile production
   ```

2. **Get the production key hash** from the build logs
3. **Add it to Facebook App settings** in the Key Hashes field

### 4.2 Update Facebook App Settings

1. **Change app status to "Live"** in Facebook App Dashboard
2. **Add production key hash** to Android settings
3. **Test with production build**

## Step 5: Troubleshooting

### Common Android-Specific Issues

1. **Key Hash Mismatch:**

   ```
   Error: Invalid key hash. The key hash [hash] does not match any stored key hashes.
   ```

   - Solution: Add the correct key hash to Facebook App settings

2. **Package Name Mismatch:**

   ```
   Error: Invalid package name. The package name [name] does not match the configured package name.
   ```

   - Solution: Ensure package name in app.config.js matches Facebook App settings

3. **Facebook App Not Found:**

   ```
   Error: Facebook app not found. Please check your app ID.
   ```

   - Solution: Verify EXPO_PUBLIC_FACEBOOK_APP_ID is correct

### Debug Steps

1. **Check Facebook App Dashboard:**
   - Verify Android platform is added
   - Confirm package name and key hashes
   - Ensure app is in "Live" mode for production

2. **Check App Configuration:**
   - Verify app.config.js settings
   - Confirm environment variables
   - Check expo-facebook plugin is installed

3. **Check Build Configuration:**
   - Ensure EAS build is configured correctly
   - Verify key hashes in build logs
   - Check for any build errors

## Step 6: Security Considerations

### Android-Specific Security

1. **Key Store Security:**
   - Keep your production keystore secure
   - Don't commit keystore files to version control
   - Use EAS to manage production credentials

2. **Package Name Security:**
   - Use a unique package name
   - Don't use generic names like "com.example.app"
   - Consider using your domain in reverse (e.g., com.kingdomstudios.app)

3. **Permission Management:**
   - Only request necessary permissions
   - Document why each permission is needed
   - Follow Android best practices

## Step 7: Testing Checklist

### Development Testing

- [ ] Facebook login works in development build
- [ ] Access tokens are stored securely
- [ ] User data is retrieved correctly
- [ ] Logout functionality works
- [ ] Error handling works for declined permissions

### Production Testing

- [ ] Facebook login works in production build
- [ ] Production key hash is added to Facebook App
- [ ] App is in "Live" mode in Facebook Dashboard
- [ ] All Facebook callbacks work (data deletion, deauthorization)
- [ ] Performance is acceptable

## Support Resources

- [Expo Facebook Plugin Documentation](https://docs.expo.dev/versions/latest/sdk/facebook/)
- [Facebook Android SDK Documentation](https://developers.facebook.com/docs/android/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Development Client](https://docs.expo.dev/develop/development-builds/introduction/)

## Next Steps

After completing the Android setup:

1. **Test thoroughly** in both development and production
2. **Monitor logs** for any authentication issues
3. **Update your privacy policy** to include Android-specific information
4. **Prepare for app store submission** with Facebook integration
5. **Set up monitoring** for Facebook authentication metrics








