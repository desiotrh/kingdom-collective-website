const fs = require('fs');
const path = require('path');

console.log('🔍 Kingdom Studios - Bundle Size Analyzer');
console.log('==========================================');

// Read package.json to analyze dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

console.log('\n📦 DEPENDENCY ANALYSIS:');
console.log('========================');

// Large/heavy packages that should be optimized
const heavyPackages = [
  'react-native-reanimated',
  'react-native-vector-icons',
  'react-native-maps',
  'react-native-video',
  'react-native-svg',
  'react-native-image-picker',
  'react-native-camera',
  'react-native-webview',
  'lottie-react-native',
  '@react-native-firebase/app',
  '@react-native-firebase/auth',
  '@react-native-firebase/firestore',
  'react-native-gesture-handler',
  'react-native-screens',
  'react-native-safe-area-context',
];

// Packages that can be lazy loaded
const lazyLoadCandidates = [
  'react-native-video',
  'react-native-camera',
  'react-native-image-picker',
  'react-native-maps',
  'lottie-react-native',
  'react-native-svg',
];

// Check for heavy packages
console.log('\n🔴 HEAVY PACKAGES DETECTED:');
const detectedHeavyPackages = [];
Object.keys(dependencies).forEach(pkg => {
  if (heavyPackages.includes(pkg)) {
    detectedHeavyPackages.push(pkg);
    console.log(`   • ${pkg}: ${dependencies[pkg]}`);
  }
});

if (detectedHeavyPackages.length === 0) {
  console.log('   ✅ No heavy packages detected');
}

// Check for lazy load candidates
console.log('\n🟡 LAZY LOADING CANDIDATES:');
const lazyLoadDetected = [];
Object.keys(dependencies).forEach(pkg => {
  if (lazyLoadCandidates.includes(pkg)) {
    lazyLoadDetected.push(pkg);
    console.log(`   • ${pkg}: Consider lazy loading`);
  }
});

if (lazyLoadDetected.length === 0) {
  console.log('   ✅ No lazy loading candidates found');
}

// Check for unused dependencies
console.log('\n🔍 DEPENDENCY OPTIMIZATION:');
console.log('============================');

const srcPath = path.join(__dirname, 'src');
let sourceFiles = [];

function getAllSourceFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        getAllSourceFiles(fullPath);
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        sourceFiles.push(fullPath);
      }
    });
  } catch (error) {
    // Directory might not exist
  }
}

getAllSourceFiles(srcPath);

// Read all source files to check for imports
let allSourceCode = '';
sourceFiles.forEach(file => {
  try {
    allSourceCode += fs.readFileSync(file, 'utf8') + '\n';
  } catch (error) {
    // Skip files that can't be read
  }
});

// Check for potentially unused dependencies
const potentiallyUnused = [];
Object.keys(dependencies).forEach(pkg => {
  // Skip common packages that might not appear in direct imports
  const skipCheck = [
    'react',
    'react-native',
    'expo',
    '@expo/vector-icons',
    'expo-constants',
    'expo-status-bar',
  ];
  
  if (!skipCheck.includes(pkg) && !allSourceCode.includes(pkg)) {
    potentiallyUnused.push(pkg);
  }
});

if (potentiallyUnused.length > 0) {
  console.log('\n🟡 POTENTIALLY UNUSED DEPENDENCIES:');
  potentiallyUnused.forEach(pkg => {
    console.log(`   • ${pkg}: Not found in source code`);
  });
  console.log('\n   Note: These might be used indirectly or in config files');
} else {
  console.log('   ✅ All dependencies appear to be in use');
}

// Bundle size optimization recommendations
console.log('\n🚀 OPTIMIZATION RECOMMENDATIONS:');
console.log('==================================');

console.log('\n1. CODE SPLITTING:');
if (lazyLoadDetected.length > 0) {
  console.log('   • Implement lazy loading for:');
  lazyLoadDetected.forEach(pkg => console.log(`     - ${pkg}`));
} else {
  console.log('   ✅ Consider implementing route-based code splitting');
}

console.log('\n2. TREE SHAKING:');
console.log('   • Use specific imports instead of default imports');
console.log('   • Example: import { Button } from "react-native" instead of importing all');

console.log('\n3. DYNAMIC IMPORTS:');
console.log('   • Use React.lazy() for heavy screens');
console.log('   • Implement progressive loading for features');

console.log('\n4. ASSET OPTIMIZATION:');
console.log('   • Optimize images (WebP format when possible)');
console.log('   • Use vector icons instead of PNG when possible');
console.log('   • Compress and optimize video assets');

console.log('\n5. DEPENDENCY ALTERNATIVES:');
const alternatives = {
  'moment': 'date-fns (smaller bundle size)',
  'lodash': 'lodash-es or individual functions',
  'axios': 'fetch API (native)',
  'react-native-vector-icons': '@expo/vector-icons (if using Expo)',
};

Object.keys(dependencies).forEach(pkg => {
  if (alternatives[pkg]) {
    console.log(`   • Consider replacing ${pkg} with ${alternatives[pkg]}`);
  }
});

// Metro bundler optimization suggestions
console.log('\n6. METRO BUNDLER OPTIMIZATION:');
console.log('   • Enable Hermes JavaScript engine');
console.log('   • Use RAM bundles for Android');
console.log('   • Enable inline requires');
console.log('   • Configure proper asset scaling');

// Performance monitoring
console.log('\n📊 PERFORMANCE MONITORING:');
console.log('============================');
console.log('Set up monitoring for:');
console.log('   • Bundle size tracking');
console.log('   • App startup time');
console.log('   • Memory usage');
console.log('   • Network usage');

// Generate bundle analysis script
const bundleAnalysisScript = `
// Add this to your metro.config.js for bundle analysis
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Enable for better performance
      },
    }),
  },
  resolver: {
    alias: {
      // Add aliases for better tree shaking
    },
  },
};
`;

console.log('\n📝 METRO CONFIG OPTIMIZATION:');
console.log('==============================');
console.log(bundleAnalysisScript);

console.log('\n🎯 NEXT STEPS:');
console.log('===============');
console.log('1. Implement lazy loading for heavy components');
console.log('2. Setup bundle size monitoring');
console.log('3. Optimize assets and images');
console.log('4. Consider dependency alternatives');
console.log('5. Enable Hermes and other performance features');
console.log('6. Regular bundle size audits');

console.log('\n✅ Bundle analysis complete!');
