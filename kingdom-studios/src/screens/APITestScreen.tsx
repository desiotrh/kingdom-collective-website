import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { AuthAPI, ContentAPI, SystemAPI, AnalyticsAPI } from '../services/backendAPI';
import { Environment } from '../config/environment';
import { AnalyticsTracking } from '../services/analyticsTracking';

export default function APITestScreen() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('test@kingdom.com');
  const [password, setPassword] = useState('password123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Track screen view
    AnalyticsTracking.trackScreenView('API_Test');
    
    // Check if backend is running
    runTest('Backend Health Check', () => SystemAPI.healthCheck());
  }, []);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      const testResult = {
        name: testName,
        status: 'success',
        duration: `${duration}ms`,
        result: JSON.stringify(result, null, 2),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      // Track successful test
      await AnalyticsTracking.trackUserAction('api_test_success', {
        test_name: testName,
        duration_ms: duration
      });
      
    } catch (error) {
      const testResult = {
        name: testName,
        status: 'error',
        result: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      // Track failed test
      await AnalyticsTracking.trackError(`API test failed: ${testName}`, {
        test_name: testName,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testHealthCheck = () => runTest('Health Check', async () => {
    const response = await SystemAPI.healthCheck();
    return response;
  });

  const testRegister = () => runTest('User Registration', async () => {
    const testEmail = `test${Date.now()}@kingdom.com`;
    const response = await AuthAPI.register(testEmail, password, 'Test', 'User', true);
    if (response.success) {
      setIsLoggedIn(true);
    }
    return response;
  });

  const testLogin = () => runTest('User Login', async () => {
    const response = await AuthAPI.login(email, password);
    if (response.success) {
      setIsLoggedIn(true);
    }
    return response;
  });

  const testGetProfile = () => runTest('Get User Profile', async () => {
    const response = await AuthAPI.getProfile();
    return response;
  });

  const testContentGeneration = () => runTest('Content Generation', async () => {
    const response = await ContentAPI.generateContent({
      type: 'text',
      prompt: 'Create a test message for API testing - Kingdom entrepreneurship inspiration',
      faithMode: true,
      platform: 'instagram',
      settings: {}
    });
    return response;
  });

  const testContentHistory = () => runTest('Content History', async () => {
    const response = await ContentAPI.getContentHistory(5, 0);
    return response;
  });

  const testAnalyticsEvent = () => runTest('Analytics Event', async () => {
    const response = await AnalyticsAPI.trackEvent({
      name: 'api_test_event',
      properties: {
        test_source: 'api_test_screen',
        timestamp: Date.now(),
        user_action: 'test_analytics'
      }
    });
    return response;
  });
      platform: 'test'
    });
    return response;
  });

  const clearResults = () => {
    setTestResults([]);
    AnalyticsTracking.trackUserAction('api_test_clear_results');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Kingdom Studios API Test</Text>
      
      <View style={styles.configSection}>
        <Text style={styles.sectionTitle}>Backend Status</Text>
        <Text style={styles.configText}>
          API Base URL: {Environment.get().API_BASE_URL || 'http://localhost:3000/api/v1'}
        </Text>
        <Text style={styles.configText}>
          Debug Mode: {Environment.isDebugEnabled() ? 'ON' : 'OFF'}
        </Text>
        <Text style={styles.configText}>
          Auth Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
        </Text>
      </View>

      {/* Authentication Section */}
      <View style={styles.authSection}>
        <Text style={styles.sectionTitle}>🔐 Authentication Test</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={testRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={testLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Text style={styles.sectionTitle}>🧪 API Endpoint Tests</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={testHealthCheck}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🏥 Health Check</Text>
        </TouchableOpacity>

        {isLoggedIn && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testGetProfile}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>👤 Get Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testContentGeneration}
          disabled={isLoggedIn ? isLoading : true}
        >
          <Text style={styles.buttonText}>🤖 Generate Content {!isLoggedIn ? '(Login Required)' : ''}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testContentHistory}
          disabled={isLoggedIn ? isLoading : true}
        >
          <Text style={styles.buttonText}>📚 Content History {!isLoggedIn ? '(Login Required)' : ''}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testAnalyticsEvent}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>📊 Analytics Event</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🗑️ Clear Results</Text>
        </TouchableOpacity>
      </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>⏳ Running test...</Text>
        </View>
      )}

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results ({testResults.length})</Text>
        {testResults.map((result, index) => (
          <View key={index} style={[
            styles.resultCard,
            result.status === 'success' ? styles.successCard : styles.errorCard
          ]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultStatus}>
                {result.status === 'success' ? '✅' : '❌'} {result.status}
              </Text>
              <Text style={styles.resultTime}>{result.timestamp}</Text>
            </View>
            {result.duration && (
              <Text style={styles.resultDuration}>Duration: {result.duration}</Text>
            )}
            <ScrollView style={styles.resultContent} horizontal>
              <Text style={styles.resultText}>{result.result}</Text>
            </ScrollView>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  configSection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  configText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  resultCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
  },
  successCard: {
    backgroundColor: '#1B5E20',
    borderColor: '#4CAF50',
  },
  errorCard: {
    backgroundColor: '#B71C1C',
    borderColor: '#F44336',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultName: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
  },
  resultStatus: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultTime: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 10,
  },
  resultDuration: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 10,
  },
  resultContent: {
    maxHeight: 200,
  },
  resultText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  authSection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
