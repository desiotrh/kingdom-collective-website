import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDualMode } from '../contexts/DualModeContext';
import { useTierSystem } from '../contexts/TierSystemContext';
import { useNotifications } from '../contexts/NotificationContext';
import tierSystemDemo from '../utils/tierSystemDemo';
import testingService from '../services/testingService';
import backendSyncService from '../services/backendSyncService';

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration?: number;
  details?: any;
}

const TierSystemTestScreen: React.FC = () => {
  const { colors, currentMode } = useDualMode();
  const { currentTier, subscription, isLoading } = useTierSystem();
  const { sendNotification } = useNotifications();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [systemHealth, setSystemHealth] = useState<'unknown' | 'healthy' | 'issues'>('unknown');

  const styles = createStyles(colors);

  useEffect(() => {
    performQuickHealthCheck();
  }, []);

  const performQuickHealthCheck = async () => {
    try {
      const isHealthy = await tierSystemDemo.quickHealthCheck();
      setSystemHealth(isHealthy ? 'healthy' : 'issues');
    } catch (error) {
      setSystemHealth('issues');
    }
  };

  const runFullTestSuite = async () => {
    setIsRunningTests(true);
    try {
      sendNotification({
        type: 'feature_limit_reached',
        title: 'Test Suite Started',
        message: 'Running comprehensive tier system tests...',
      });

      const results = await testingService.runFullTestSuite();
      setTestResults(results);

      const passed = results.filter(r => r.passed).length;
      const total = results.length;

      sendNotification({
        type: passed === total ? 'payment_success' : 'payment_failed',
        title: 'Test Suite Complete',
        message: `${passed}/${total} tests passed`,
      });

      Alert.alert(
        'Test Results',
        `${passed}/${total} tests passed\n\nSee results below for details.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Test Error', error.message);
    } finally {
      setIsRunningTests(false);
    }
  };

  const runCompleteDemo = async () => {
    Alert.alert(
      'Complete Demo',
      'This will run a comprehensive demonstration of all tier system features. Check the console for detailed output.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Run Demo',
          onPress: async () => {
            try {
              await tierSystemDemo.runCompleteDemo();
              await tierSystemDemo.generateDemoReport();
              Alert.alert('Demo Complete', 'Check the console for the full demo report!');
            } catch (error: any) {
              Alert.alert('Demo Error', error.message);
            }
          },
        },
      ]
    );
  };

  const testSpecificFeature = (feature: 'subscription' | 'billing' | 'analytics' | 'admin') => {
    Alert.alert(
      `Test ${feature.charAt(0).toUpperCase() + feature.slice(1)}`,
      `Demonstrate ${feature} features?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Demonstrate',
          onPress: async () => {
            try {
              await tierSystemDemo.demonstrateFeature(feature);
              Alert.alert('Feature Demo', `${feature} features demonstrated! Check console for details.`);
            } catch (error: any) {
              Alert.alert('Demo Error', error.message);
            }
          },
        },
      ]
    );
  };

  const performBackendSync = async () => {
    try {
      sendNotification({
        type: 'feature_limit_reached',
        title: 'Syncing Backend',
        message: 'Synchronizing with backend services...',
      });

      const result = await backendSyncService.performFullSync(true);
      
      if (result.success) {
        sendNotification({
          type: 'payment_success',
          title: 'Sync Complete',
          message: 'Backend synchronization successful',
        });
        Alert.alert('Sync Success', 'Backend synchronization completed successfully!');
      } else {
        sendNotification({
          type: 'payment_failed',
          title: 'Sync Failed',
          message: result.error || 'Synchronization failed',
        });
        Alert.alert('Sync Error', result.error || 'Synchronization failed');
      }
    } catch (error: any) {
      Alert.alert('Sync Error', error.message);
    }
  };

  const getHealthStatusColor = () => {
    switch (systemHealth) {
      case 'healthy': return '#10B981';
      case 'issues': return '#EF4444';
      default: return colors.text;
    }
  };

  const getHealthStatusText = () => {
    switch (systemHealth) {
      case 'healthy': return '✅ System Healthy';
      case 'issues': return '⚠️ Issues Detected';
      default: return '🔍 Checking...';
    }
  };

  const renderTestResult = (result: TestResult, index: number) => (
    <View key={index} style={[styles.testResult, { backgroundColor: result.passed ? '#10B98120' : '#EF444420' }]}>
      <View style={styles.testHeader}>
        <Text style={[styles.testName, { color: colors.text }]}>
          {result.passed ? '✅' : '❌'} {result.testName}
        </Text>
        {result.duration && (
          <Text style={[styles.testDuration, { color: colors.textSecondary }]}>
            {result.duration}ms
          </Text>
        )}
      </View>
      {result.error && (
        <Text style={[styles.testError, { color: '#EF4444' }]}>
          {result.error}
        </Text>
      )}
      {result.details && (
        <Text style={[styles.testDetails, { color: colors.textSecondary }]}>
          {JSON.stringify(result.details, null, 2)}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Tier System Testing
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Comprehensive testing and validation suite
          </Text>
        </View>

        {/* System Status */}
        <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            System Status
          </Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: getHealthStatusColor() }]}>
              {getHealthStatusText()}
            </Text>
            <TouchableOpacity onPress={performQuickHealthCheck} style={styles.refreshButton}>
              <Text style={[styles.refreshText, { color: colors.primary }]}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statusDetails}>
            <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
              Current Tier: {currentTier}
            </Text>
            <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
              Subscription: {subscription?.status || 'None'}
            </Text>
            <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
              Mode: {currentMode === 'faith' ? 'Faith' : 'Encouragement'}
            </Text>
          </View>
        </View>

        {/* Test Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Test Actions
          </Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={runFullTestSuite}
            disabled={isRunningTests}
          >
            {isRunningTests ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Run Full Test Suite</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={runCompleteDemo}
          >
            <Text style={styles.actionButtonText}>Run Complete Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={performBackendSync}
          >
            <Text style={styles.actionButtonText}>Sync Backend</Text>
          </TouchableOpacity>

          <View style={styles.featureRow}>
            <TouchableOpacity
              style={[styles.featureButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => testSpecificFeature('subscription')}
            >
              <Text style={[styles.featureButtonText, { color: colors.text }]}>Subscription</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => testSpecificFeature('billing')}
            >
              <Text style={[styles.featureButtonText, { color: colors.text }]}>Billing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => testSpecificFeature('analytics')}
            >
              <Text style={[styles.featureButtonText, { color: colors.text }]}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => testSpecificFeature('admin')}
            >
              <Text style={[styles.featureButtonText, { color: colors.text }]}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Test Results */}
        {testResults.length > 0 && (
          <View style={[styles.resultsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Test Results ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
            </Text>
            {testResults.map(renderTestResult)}
          </View>
        )}

        {/* Information */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Testing Information
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This screen provides comprehensive testing and validation of the Kingdom Studios tier system.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Run full test suite to validate all components
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Use feature demos to test specific functionality
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Check console output for detailed logs
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Backend sync tests integration with external APIs
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDetails: {
    gap: 5,
  },
  statusDetail: {
    fontSize: 14,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  featureButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  testResult: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  testDuration: {
    fontSize: 12,
  },
  testError: {
    fontSize: 14,
    marginTop: 5,
  },
  testDetails: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default React.memo(TierSystemTestScreen);
