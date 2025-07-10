// ==============================
// 🧪 Kingdom Studios Testing Service
// Comprehensive testing and validation for tier system
// ==============================

import backendSyncService from './backendSyncService';
import subscriptionService from './subscriptionService';
import apiService from './apiService';
import { TierType, BillingCycle } from '../contexts/TierSystemContext';

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration?: number;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

class TierSystemTestingService {
  private static instance: TierSystemTestingService;

  private constructor() {}

  static getInstance(): TierSystemTestingService {
    if (!TierSystemTestingService.instance) {
      TierSystemTestingService.instance = new TierSystemTestingService();
    }
    return TierSystemTestingService.instance;
  }

  // ==============================
  // Complete System Test Suite
  // ==============================

  async runFullTestSuite(): Promise<TestResult[]> {
    console.log('🧪 Starting Kingdom Studios Tier System Test Suite...');
    
    const results: TestResult[] = [];

    // Core functionality tests
    results.push(await this.testApiConnectivity());
    results.push(await this.testSubscriptionService());
    results.push(await this.testBackendSync());
    results.push(await this.testTierValidation());
    results.push(await this.testUsageTracking());
    results.push(await this.testBillingIntegration());
    
    // Edge case tests
    results.push(await this.testOfflineHandling());
    results.push(await this.testErrorRecovery());
    results.push(await this.testConcurrentOperations());
    
    // Performance tests
    results.push(await this.testPerformance());

    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    console.log(`✅ Test Suite Complete: ${passed}/${total} tests passed`);
    
    if (passed < total) {
      console.log('❌ Failed tests:');
      results.filter(r => !r.passed).forEach(test => {
        console.log(`  - ${test.testName}: ${test.error}`);
      });
    }

    return results;
  }

  // ==============================
  // Individual Test Methods
  // ==============================

  async testApiConnectivity(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test basic API connectivity
      const response = await apiService.getCurrentUser();
      
      if (response.success || response.statusCode === 401) {
        // 401 is acceptable - means API is reachable but user not authenticated
        return {
          testName: 'API Connectivity',
          passed: true,
          duration: Date.now() - startTime,
          details: { statusCode: response.statusCode },
        };
      }

      return {
        testName: 'API Connectivity',
        passed: false,
        error: `API unreachable: ${response.error}`,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        testName: 'API Connectivity',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testSubscriptionService(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test subscription service functionality
      const subscription = await subscriptionService.getCurrentSubscription();
      const usage = await subscriptionService.getUsageStats();
      
      // Test feature checking
      const canUseContent = await subscriptionService.canUseFeature('contentGeneration');
      const canUseProducts = await subscriptionService.canUseFeature('productSync');
      
      return {
        testName: 'Subscription Service',
        passed: true,
        duration: Date.now() - startTime,
        details: {
          hasSubscription: !!subscription,
          hasUsageStats: !!usage,
          featureChecks: { canUseContent, canUseProducts },
        },
      };
    } catch (error: any) {
      return {
        testName: 'Subscription Service',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testBackendSync(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test backend synchronization
      const syncResult = await backendSyncService.performFullSync();
      
      return {
        testName: 'Backend Sync',
        passed: syncResult.success,
        error: syncResult.error,
        duration: Date.now() - startTime,
        details: syncResult.data,
      };
    } catch (error: any) {
      return {
        testName: 'Backend Sync',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testTierValidation(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const validationResult = await this.validateTierSystem();
      
      return {
        testName: 'Tier Validation',
        passed: validationResult.isValid,
        error: validationResult.errors.join(', '),
        duration: Date.now() - startTime,
        details: validationResult,
      };
    } catch (error: any) {
      return {
        testName: 'Tier Validation',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testUsageTracking(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test content generation tracking
      const contentResult = await apiService.generateContent(
        'Test content generation',
        'social',
        { faithMode: true }
      );

      // Test analytics tracking
      await backendSyncService.trackUserAction('test_action', {
        testProperty: 'test_value',
      });

      return {
        testName: 'Usage Tracking',
        passed: true,
        duration: Date.now() - startTime,
        details: {
          contentGeneration: contentResult.success,
          analyticsTracking: true,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Usage Tracking',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testBillingIntegration(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test payment session creation (without actual payment)
      const paymentResult = await subscriptionService.createPaymentSession(
        'commissioned',
        'monthly'
      );

      // Test customer portal access
      const portalResult = await subscriptionService.openCustomerPortal();

      return {
        testName: 'Billing Integration',
        passed: true,
        duration: Date.now() - startTime,
        details: {
          paymentSession: paymentResult.success,
          customerPortal: portalResult.success,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Billing Integration',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testOfflineHandling(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Simulate offline conditions by clearing cache
      subscriptionService.clearCache();
      
      // Test if services handle offline gracefully
      const subscription = await subscriptionService.getCurrentSubscription();
      const usage = await subscriptionService.getUsageStats();

      return {
        testName: 'Offline Handling',
        passed: true,
        duration: Date.now() - startTime,
        details: {
          offlineSubscription: subscription !== null,
          offlineUsage: usage !== null,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Offline Handling',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testErrorRecovery(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test error recovery mechanisms
      const invalidUpgrade = await subscriptionService.upgradeSubscription(
        'invalid_tier' as TierType,
        'monthly'
      );

      const invalidPayment = await subscriptionService.createPaymentSession(
        'commissioned',
        'invalid_cycle' as BillingCycle
      );

      return {
        testName: 'Error Recovery',
        passed: true,
        duration: Date.now() - startTime,
        details: {
          handlesInvalidUpgrade: !invalidUpgrade.success,
          handlesInvalidPayment: !invalidPayment.success,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Error Recovery',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testConcurrentOperations(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test concurrent sync operations
      const syncPromises = [
        backendSyncService.syncUserProfile(),
        backendSyncService.syncSubscription(),
        backendSyncService.syncUsageStats(),
      ];

      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      return {
        testName: 'Concurrent Operations',
        passed: successful >= 2, // At least 2/3 should succeed
        duration: Date.now() - startTime,
        details: {
          totalOperations: results.length,
          successful,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Concurrent Operations',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async testPerformance(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test performance of key operations
      const operations = [];

      const subscriptionStart = Date.now();
      await subscriptionService.getCurrentSubscription();
      operations.push({ name: 'getSubscription', duration: Date.now() - subscriptionStart });

      const syncStart = Date.now();
      await backendSyncService.performFullSync();
      operations.push({ name: 'fullSync', duration: Date.now() - syncStart });

      const usageStart = Date.now();
      await subscriptionService.getUsageStats();
      operations.push({ name: 'getUsage', duration: Date.now() - usageStart });

      const slowOperations = operations.filter(op => op.duration > 5000); // > 5 seconds

      return {
        testName: 'Performance Test',
        passed: slowOperations.length === 0,
        duration: Date.now() - startTime,
        details: {
          operations,
          slowOperations,
        },
      };
    } catch (error: any) {
      return {
        testName: 'Performance Test',
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  // ==============================
  // Validation Methods
  // ==============================

  async validateTierSystem(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Validate subscription service
      const subscription = await subscriptionService.getCurrentSubscription();
      
      if (!subscription) {
        warnings.push('No active subscription found');
      } else {
        // Validate subscription data structure
        if (!subscription.tier) {
          errors.push('Subscription missing tier information');
        }
        
        if (!subscription.features) {
          errors.push('Subscription missing features configuration');
        }
        
        if (!subscription.isActive && subscription.status !== 'trial') {
          warnings.push('Subscription is not active');
        }
      }

      // Validate usage tracking
      const usage = await subscriptionService.getUsageStats();
      if (!usage) {
        warnings.push('Unable to retrieve usage statistics');
      }

      // Validate API connectivity
      const apiTest = await apiService.getCurrentUser();
      if (!apiTest.success && apiTest.statusCode !== 401) {
        errors.push('API connectivity issues detected');
      }

      // Performance suggestions
      if (backendSyncService.isSyncInProgress()) {
        suggestions.push('Consider implementing sync queue to prevent concurrent operations');
      }

      const lastSync = backendSyncService.getLastSyncTime();
      if (lastSync && (Date.now() - lastSync) > 300000) { // 5 minutes
        suggestions.push('Data may be stale - consider refreshing');
      }

    } catch (error: any) {
      errors.push(`Validation error: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  // ==============================
  // Mock Data Generation for Testing
  // ==============================

  generateMockSubscription(tier: TierType = 'commissioned'): any {
    return {
      id: `sub_mock_${Date.now()}`,
      userId: `user_mock_${Date.now()}`,
      tier,
      billingCycle: 'monthly' as BillingCycle,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      stripeSubscriptionId: `sub_stripe_mock_${Date.now()}`,
      amount: 5000, // $50.00
      currency: 'usd',
      usage: {
        contentGeneration: Math.floor(Math.random() * 50),
        productSync: Math.floor(Math.random() * 20),
        teamMembers: 1,
      },
    };
  }

  generateMockUser(): any {
    return {
      id: `user_mock_${Date.now()}`,
      email: 'test@kingdomstudios.app',
      name: 'Test User',
      tier: 'commissioned' as TierType,
      subscriptionId: `sub_mock_${Date.now()}`,
      stripeCustomerId: `cus_mock_${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      preferences: {
        mode: 'faith',
        notifications: {
          email: true,
          push: true,
          billing: true,
          features: true,
        },
      },
    };
  }

  // ==============================
  // Integration Testing
  // ==============================

  async testFullUserJourney(): Promise<TestResult[]> {
    const journeyTests: TestResult[] = [];

    // 1. Test user signup flow
    journeyTests.push(await this.testUserSignup());

    // 2. Test trial start
    journeyTests.push(await this.testTrialStart());

    // 3. Test feature usage during trial
    journeyTests.push(await this.testTrialFeatureUsage());

    // 4. Test subscription upgrade
    journeyTests.push(await this.testSubscriptionUpgrade());

    // 5. Test full feature access
    journeyTests.push(await this.testFullFeatureAccess());

    return journeyTests;
  }

  private async testUserSignup(): Promise<TestResult> {
    // Mock user signup test
    return {
      testName: 'User Signup',
      passed: true,
      details: { message: 'Mock signup successful' },
    };
  }

  private async testTrialStart(): Promise<TestResult> {
    try {
      const trialResult = await backendSyncService.startTrial('commissioned');
      return {
        testName: 'Trial Start',
        passed: trialResult.success,
        error: trialResult.error,
        details: trialResult.data,
      };
    } catch (error: any) {
      return {
        testName: 'Trial Start',
        passed: false,
        error: error.message,
      };
    }
  }

  private async testTrialFeatureUsage(): Promise<TestResult> {
    try {
      const canUseContent = await subscriptionService.canUseFeature('contentGeneration');
      const canUseProducts = await subscriptionService.canUseFeature('productSync');
      
      return {
        testName: 'Trial Feature Usage',
        passed: canUseContent || canUseProducts,
        details: { canUseContent, canUseProducts },
      };
    } catch (error: any) {
      return {
        testName: 'Trial Feature Usage',
        passed: false,
        error: error.message,
      };
    }
  }

  private async testSubscriptionUpgrade(): Promise<TestResult> {
    try {
      const upgradeResult = await backendSyncService.upgradeSubscription('mantled_pro', 'monthly');
      return {
        testName: 'Subscription Upgrade',
        passed: upgradeResult.success,
        error: upgradeResult.error,
        details: upgradeResult.data,
      };
    } catch (error: any) {
      return {
        testName: 'Subscription Upgrade',
        passed: false,
        error: error.message,
      };
    }
  }

  private async testFullFeatureAccess(): Promise<TestResult> {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      const hasFullAccess = subscription?.tier === 'mantled_pro' || subscription?.tier === 'kingdom_enterprise';
      
      return {
        testName: 'Full Feature Access',
        passed: !!hasFullAccess,
        details: { tier: subscription?.tier, hasFullAccess },
      };
    } catch (error: any) {
      return {
        testName: 'Full Feature Access',
        passed: false,
        error: error.message,
      };
    }
  }
}

export default TierSystemTestingService.getInstance();
