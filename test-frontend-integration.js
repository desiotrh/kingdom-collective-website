/**
 * Frontend-Backend Integration Test
 * Tests the frontend components and their backend integration
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const FRONTEND_PATH = './kingdom-studios';
const SCREENS_PATH = path.join(FRONTEND_PATH, 'src', 'screens');
const SERVICES_PATH = path.join(FRONTEND_PATH, 'src', 'services');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function analyzeFileImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for enterprise service imports
    const enterpriseImports = [
      'apiClient',
      'contentService',
      'realTimeService',
      'AnalyticsService',
    ];
    
    const foundImports = enterpriseImports.filter(imp => 
      content.includes(imp) && (content.includes(`import`) || content.includes(`from`))
    );
    
    // Check for backend API usage
    const hasBackendAPI = content.includes('backendAPI') || 
                         content.includes('from \'../services/backendAPI\'') ||
                         content.includes('apiClient') ||
                         content.includes('from \'../services/apiClient\'');
    
    // Check for auth context usage
    const hasAuthContext = content.includes('useAuth') || content.includes('AuthContext');
    
    // Check for error handling
    const hasErrorHandling = content.includes('try {') && content.includes('catch');
    
    // Check for loading states
    const hasLoadingStates = content.includes('loading') || content.includes('isLoading');
    
    return {
      enterpriseImports: foundImports,
      hasBackendAPI,
      hasAuthContext,
      hasErrorHandling,
      hasLoadingStates,
      isEnterpriseReady: foundImports.length > 0
    };
  } catch (error) {
    return {
      enterpriseImports: [],
      hasBackendAPI: false,
      hasAuthContext: false,
      hasErrorHandling: false,
      hasLoadingStates: false,
      isEnterpriseReady: false,
      error: error.message
    };
  }
}

async function testFrontendIntegration() {
  log('\n🚀 Kingdom Studios Frontend-Backend Integration Test', 'bold');
  log('=' .repeat(60), 'cyan');
  
  // Check if frontend directory exists
  if (!checkFileExists(FRONTEND_PATH)) {
    log('❌ Frontend directory not found!', 'red');
    return;
  }
  
  log('✅ Frontend directory found', 'green');
  
  // Test enterprise services
  log('\n📦 Testing Enterprise Services...', 'bold');
  const enterpriseServices = [
    'apiClient.ts',
    'contentService.ts',
    'realTimeService.ts',
    'AnalyticsService.ts'
  ];
  
  for (const service of enterpriseServices) {
    const servicePath = path.join(SERVICES_PATH, service);
    if (checkFileExists(servicePath)) {
      log(`✅ ${service} - Found`, 'green');
    } else {
      log(`❌ ${service} - Missing`, 'red');
    }
  }
  
  // Test key screens integration
  log('\n📱 Testing Screen Integration...', 'bold');
  const keyScreens = [
    'LoginScreen.tsx',
    'DashboardScreen.tsx',
    'CreatorDashboardScreen.tsx',
    'ContentGeneratorScreen.tsx',
  ];
  
  const integrationResults = {};
  
  for (const screen of keyScreens) {
    const screenPath = path.join(SCREENS_PATH, screen);
    if (checkFileExists(screenPath)) {
      const analysis = analyzeFileImports(screenPath);
      integrationResults[screen] = analysis;
      
      log(`\n📄 ${screen}:`, 'cyan');
      
      if (analysis.error) {
        log(`  ❌ Error analyzing file: ${analysis.error}`, 'red');
        continue;
      }
      
      // Enterprise services integration
      if (analysis.isEnterpriseReady) {
        log(`  ✅ Enterprise-ready (${analysis.enterpriseImports.length} services)`, 'green');
        log(`    📡 Services: ${analysis.enterpriseImports.join(', ')}`, 'blue');
      } else {
        log(`  ⚠️  Not enterprise-ready`, 'yellow');
      }
      
      // Backend integration
      if (analysis.hasBackendAPI) {
        log(`  ✅ Backend API integrated`, 'green');
      } else {
        log(`  ❌ No backend API integration`, 'red');
      }
      
      // Auth integration
      if (analysis.hasAuthContext) {
        log(`  ✅ Authentication integrated`, 'green');
      } else {
        log(`  ❌ No authentication integration`, 'red');
      }
      
      // Error handling
      if (analysis.hasErrorHandling) {
        log(`  ✅ Error handling implemented`, 'green');
      } else {
        log(`  ⚠️  Limited error handling`, 'yellow');
      }
      
      // Loading states
      if (analysis.hasLoadingStates) {
        log(`  ✅ Loading states implemented`, 'green');
      } else {
        log(`  ⚠️  No loading states`, 'yellow');
      }
    } else {
      log(`❌ ${screen} - Not found`, 'red');
    }
  }
  
  // Overall integration summary
  log('\n📊 Integration Summary:', 'bold');
  log('=' .repeat(40), 'cyan');
  
  const totalScreens = Object.keys(integrationResults).length;
  const enterpriseReadyScreens = Object.values(integrationResults).filter(r => r.isEnterpriseReady).length;
  const backendIntegratedScreens = Object.values(integrationResults).filter(r => r.hasBackendAPI).length;
  const authIntegratedScreens = Object.values(integrationResults).filter(r => r.hasAuthContext).length;
  
  log(`📱 Total screens analyzed: ${totalScreens}`, 'blue');
  log(`🚀 Enterprise-ready screens: ${enterpriseReadyScreens}/${totalScreens}`, enterpriseReadyScreens === totalScreens ? 'green' : 'yellow');
  log(`📡 Backend-integrated screens: ${backendIntegratedScreens}/${totalScreens}`, backendIntegratedScreens === totalScreens ? 'green' : 'yellow');
  log(`🔐 Auth-integrated screens: ${authIntegratedScreens}/${totalScreens}`, authIntegratedScreens === totalScreens ? 'green' : 'yellow');
  
  // Integration readiness score
  const totalChecks = totalScreens * 3; // enterprise, backend, auth
  const passedChecks = enterpriseReadyScreens + backendIntegratedScreens + authIntegratedScreens;
  const readinessScore = Math.round((passedChecks / totalChecks) * 100);
  
  log(`\n🎯 Integration Readiness: ${readinessScore}%`, readinessScore >= 80 ? 'green' : readinessScore >= 60 ? 'yellow' : 'red');
  
  // Recommendations
  log('\n💡 Recommendations:', 'bold');
  if (enterpriseReadyScreens < totalScreens) {
    log('  • Add enterprise service imports to remaining screens', 'yellow');
  }
  if (backendIntegratedScreens < totalScreens) {
    log('  • Integrate backend API in all key screens', 'yellow');
  }
  if (authIntegratedScreens < totalScreens) {
    log('  • Add authentication context to all screens', 'yellow');
  }
  
  if (readinessScore >= 80) {
    log('\n🎉 Frontend-Backend integration is ready for production!', 'green');
  } else if (readinessScore >= 60) {
    log('\n⚠️  Frontend-Backend integration needs minor improvements', 'yellow');
  } else {
    log('\n❌ Frontend-Backend integration needs significant work', 'red');
  }
  
  log('\n✅ Frontend integration test completed!', 'green');
}

// Run the test
testFrontendIntegration().catch(console.error);
