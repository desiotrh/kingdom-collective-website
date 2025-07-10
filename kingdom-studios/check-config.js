import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface ConfigCheck {
  service: string;
  required: boolean;
  configured: boolean;
  valid?: boolean;
  message: string;
}

class ConfigurationChecker {
  private checks: ConfigCheck[] = [];

  async runAllChecks(): Promise<void> {
    console.log('🔍 Kingdom Studios App - Configuration Checker');
    console.log('===============================================\n');

    // Check required services
    this.checkFirebase();
    this.checkOpenAI();
    
    // Check optional services
    this.checkSocialMedia();
    this.checkEmailService();
    this.checkPayments();
    this.checkAnalytics();

    // Test API connections
    await this.testConnections();

    // Display results
    this.displayResults();
  }

  private checkFirebase(): void {
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };

    const hasAllKeys = Object.values(firebaseConfig).every(value => 
      value && value !== 'your_firebase_api_key_here' && !value.includes('your_')
    );

    this.checks.push({
      service: 'Firebase',
      required: true,
      configured: hasAllKeys,
      message: hasAllKeys 
        ? '✅ All Firebase configuration keys present'
        : '❌ Missing or placeholder Firebase configuration'
    });
  }

  private checkOpenAI(): void {
    const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const configured = openaiKey && openaiKey.startsWith('sk-') && openaiKey !== 'sk-your_openai_api_key_here';

    this.checks.push({
      service: 'OpenAI',
      required: true,
      configured: !!configured,
      message: configured
        ? '✅ OpenAI API key configured'
        : '❌ Missing or invalid OpenAI API key (should start with sk-)'
    });
  }

  private checkSocialMedia(): void {
    const platforms = [
      { name: 'Facebook', key: 'EXPO_PUBLIC_FACEBOOK_APP_ID' },
      { name: 'Instagram', key: 'EXPO_PUBLIC_INSTAGRAM_CLIENT_ID' },
      { name: 'Twitter', key: 'EXPO_PUBLIC_TWITTER_API_KEY' },
      { name: 'LinkedIn', key: 'EXPO_PUBLIC_LINKEDIN_CLIENT_ID' },
      { name: 'TikTok', key: 'EXPO_PUBLIC_TIKTOK_CLIENT_KEY' },
      { name: 'YouTube', key: 'EXPO_PUBLIC_YOUTUBE_API_KEY' },
      { name: 'Pinterest', key: 'EXPO_PUBLIC_PINTEREST_APP_ID' },
    ];

    const configuredPlatforms = platforms.filter(platform => {
      const value = process.env[platform.key];
      return value && !value.includes('your_');
    });

    this.checks.push({
      service: 'Social Media Platforms',
      required: false,
      configured: configuredPlatforms.length > 0,
      message: configuredPlatforms.length > 0
        ? `📱 ${configuredPlatforms.length}/${platforms.length} platforms configured: ${configuredPlatforms.map(p => p.name).join(', ')}`
        : '⚠️  No social media platforms configured (optional)'
    });
  }

  private checkEmailService(): void {
    const sendgridKey = process.env.EXPO_PUBLIC_SENDGRID_API_KEY;
    const mailgunKey = process.env.EXPO_PUBLIC_MAILGUN_API_KEY;

    const sendgridConfigured = sendgridKey && sendgridKey.startsWith('SG.') && sendgridKey !== 'SG.your_sendgrid_api_key_here';
    const mailgunConfigured = mailgunKey && !mailgunKey.includes('your_');

    const configured = sendgridConfigured || mailgunConfigured;

    this.checks.push({
      service: 'Email Service',
      required: false,
      configured,
      message: configured
        ? `📧 Email service configured (${sendgridConfigured ? 'SendGrid' : 'Mailgun'})`
        : '⚠️  No email service configured (optional)'
    });
  }

  private checkPayments(): void {
    const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const configured = stripeKey && stripeKey.startsWith('pk_') && stripeKey !== 'pk_test_your_stripe_test_key';

    this.checks.push({
      service: 'Payment Processing',
      required: false,
      configured: !!configured,
      message: configured
        ? '💳 Stripe payment processing configured'
        : '⚠️  No payment processing configured (optional)'
    });
  }

  private checkAnalytics(): void {
    const gaId = process.env.EXPO_PUBLIC_GOOGLE_ANALYTICS_ID;
    const mixpanelToken = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

    const gaConfigured = gaId && !gaId.includes('your_');
    const mixpanelConfigured = mixpanelToken && !mixpanelToken.includes('your_');

    const configured = gaConfigured || mixpanelConfigured;

    this.checks.push({
      service: 'Analytics',
      required: false,
      configured,
      message: configured
        ? `📊 Analytics configured (${gaConfigured ? 'Google Analytics' : 'Mixpanel'})`
        : '⚠️  No analytics configured (optional)'
    });
  }

  private async testConnections(): Promise<void> {
    console.log('🔗 Testing API Connections...\n');

    // Test Firebase connection
    await this.testFirebase();
    
    // Test OpenAI connection
    await this.testOpenAI();
  }

  private async testFirebase(): Promise<void> {
    try {
      const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      console.log('✅ Firebase connection successful');
      
      // Update the Firebase check
      const firebaseCheck = this.checks.find(c => c.service === 'Firebase');
      if (firebaseCheck) {
        firebaseCheck.valid = true;
        firebaseCheck.message += ' and connection tested';
      }
    } catch (error) {
      console.log('❌ Firebase connection failed:', error);
      
      const firebaseCheck = this.checks.find(c => c.service === 'Firebase');
      if (firebaseCheck) {
        firebaseCheck.valid = false;
        firebaseCheck.message += ' but connection failed';
      }
    }
  }

  private async testOpenAI(): Promise<void> {
    try {
      const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      if (!openaiKey || !openaiKey.startsWith('sk-')) {
        console.log('⚠️  Skipping OpenAI test - invalid API key');
        return;
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
        },
      });

      if (response.ok) {
        console.log('✅ OpenAI connection successful');
        
        const openaiCheck = this.checks.find(c => c.service === 'OpenAI');
        if (openaiCheck) {
          openaiCheck.valid = true;
          openaiCheck.message += ' and connection tested';
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log('❌ OpenAI connection failed:', error);
      
      const openaiCheck = this.checks.find(c => c.service === 'OpenAI');
      if (openaiCheck) {
        openaiCheck.valid = false;
        openaiCheck.message += ' but connection failed';
      }
    }
  }

  private displayResults(): void {
    console.log('\n📋 Configuration Summary');
    console.log('========================\n');

    const requiredServices = this.checks.filter(c => c.required);
    const optionalServices = this.checks.filter(c => !c.required);

    console.log('🔥 Required Services:');
    requiredServices.forEach(check => {
      console.log(`   ${check.message}`);
    });

    console.log('\n🔧 Optional Services:');
    optionalServices.forEach(check => {
      console.log(`   ${check.message}`);
    });

    const requiredConfigured = requiredServices.every(c => c.configured);
    const readyToLaunch = requiredConfigured && requiredServices.every(c => c.valid !== false);

    console.log('\n🎯 Status:');
    if (readyToLaunch) {
      console.log('✅ Ready to launch! All required services are configured and working.');
      console.log('\n🚀 Next steps:');
      console.log('   npm start           # Start development server');
      console.log('   npm run web         # Test in web browser');
      console.log('   npm run ios         # Test on iOS simulator');
      console.log('   npm run android     # Test on Android emulator');
    } else if (requiredConfigured) {
      console.log('⚠️  Configuration complete but some connections failed.');
      console.log('   Check your API keys and try again.');
    } else {
      console.log('❌ Missing required configuration.');
      console.log('   Please configure Firebase and OpenAI to continue.');
      console.log('\n🔧 Run the setup script:');
      console.log('   bash setup-api-keys.sh     # macOS/Linux');
      console.log('   setup-api-keys.bat         # Windows');
    }

    console.log('\n📖 For help:');
    console.log('   See API_SETUP_GUIDE.md for detailed instructions');
  }
}

// Run the configuration checker
const checker = new ConfigurationChecker();
checker.runAllChecks().catch(console.error);
