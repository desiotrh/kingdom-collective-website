import 'dotenv/config';

export default {
  expo: {
    name: "Kingdom Studios",
    slug: "kingdom-studios",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    owner: "dtritz9",

    extra: {
      // Google OAuth client IDs
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,

      // Facebook App ID
      facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,

      // Firebase config
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

      // EAS project ID
      eas: {
        projectId: "2eec151d",
      },
    },

    ios: {
      bundleIdentifier: "com.mycompany.kingdomstudios",
      buildNumber: "1.0.0",
      supportsTablet: true,
    },

    android: {
      package: "com.mycompany.kingdomstudios",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    icon: "./assets/icon.png",

    updates: {
      fallbackToCacheTimeout: 0,
    },

    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
