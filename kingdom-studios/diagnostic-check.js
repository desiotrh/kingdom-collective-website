#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Kingdom Studios App - Comprehensive Diagnostic Check');
console.log('=====================================================');

const problems = [];

// Check for missing dependencies
function checkDependencies() {
  console.log('\n📦 CHECKING DEPENDENCIES...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check if Jest is configured but not installed
  if (fs.existsSync('jest.config.js') && !packageJson.devDependencies?.jest) {
    problems.push('Jest config exists but Jest is not in devDependencies');
  }
  
  // Check if ESLint is configured
  if (fs.existsSync('eslint.config.js') && !packageJson.devDependencies?.eslint) {
    problems.push('ESLint config exists but ESLint is not in devDependencies');
  }
}

// Check for TypeScript issues
function checkTypeScript() {
  console.log('\n📝 CHECKING TYPESCRIPT...');
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (!tsConfig.compilerOptions?.strict) {
    problems.push('TypeScript strict mode is not enabled');
  }
}

// Check for missing files
function checkMissingFiles() {
  console.log('\n📄 CHECKING FOR MISSING FILES...');
  
  const requiredFiles = [
    'src/types/navigation.ts',
    'src/contexts/AuthContext.tsx',
    'src/config/firebase.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      problems.push(`Missing required file: ${file}`);
    }
  });
}

// Check for import issues
function checkImports() {
  console.log('\n🔗 CHECKING IMPORTS...');
  
  const srcDir = 'src';
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common import issues
        const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
        importLines.forEach((line, index) => {
          // Check for potential issues
          if (line.includes('from "..') && !line.includes('.tsx') && !line.includes('.ts')) {
            const lineNum = content.split('\n').findIndex(l => l === line) + 1;
            problems.push(`Potential import issue in ${filePath}:${lineNum} - ${line.trim()}`);
          }
        });
      }
    });
  }
  
  if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir);
  }
}

// Check app configuration
function checkAppConfig() {
  console.log('\n⚙️ CHECKING APP CONFIGURATION...');
  
  if (!fs.existsSync('app.config.js')) {
    problems.push('Missing app.config.js file');
  }
  
  if (!fs.existsSync('metro.config.js')) {
    problems.push('Missing metro.config.js file');
  }
}

// Run all checks
checkDependencies();
checkTypeScript();
checkMissingFiles();
checkImports();
checkAppConfig();

// Report results
console.log('\n📊 DIAGNOSTIC RESULTS');
console.log('====================');

if (problems.length === 0) {
  console.log('✅ No issues found!');
} else {
  console.log(`❌ Found ${problems.length} issue(s):`);
  problems.forEach((problem, index) => {
    console.log(`${index + 1}. ${problem}`);
  });
}

console.log(`\n📋 Total Issues: ${problems.length}`);
