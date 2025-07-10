// Kingdom Studios - Security Audit
const fs = require('fs');
const path = require('path');

console.log('🔒 Kingdom Studios - Security Audit');
console.log('===================================\n');

// Check for security vulnerabilities in environment files
console.log('🔐 ENVIRONMENT SECURITY:');
console.log('========================');

const securityChecks = [];

// Check .env files
const envFiles = ['.env.local', '.env.production', '.env.staging'];
envFiles.forEach(envFile => {
    if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        
        // Check for exposed secrets
        const exposedSecrets = [];
        if (content.includes('secret') && !content.includes('your_') && !content.includes('dev_placeholder')) {
            exposedSecrets.push('API secrets detected');
        }
        
        if (content.includes('private_key')) {
            exposedSecrets.push('Private keys detected');
        }
        
        if (exposedSecrets.length > 0) {
            console.log(`⚠️  ${envFile}: ${exposedSecrets.join(', ')}`);
            securityChecks.push(`Review ${envFile} for exposed secrets`);
        } else {
            console.log(`✅ ${envFile}: No obvious security issues`);
        }
    }
});

// Check .gitignore
if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const requiredIgnores = ['.env.local', '.env.production', 'node_modules', '*.keystore', '*.p12'];
    
    const missingIgnores = requiredIgnores.filter(item => !gitignore.includes(item));
    
    if (missingIgnores.length > 0) {
        console.log(`⚠️  .gitignore missing: ${missingIgnores.join(', ')}`);
        securityChecks.push('Update .gitignore to exclude sensitive files');
    } else {
        console.log('✅ .gitignore: Properly configured');
    }
}

console.log('\n🛡️ API SECURITY ANALYSIS:');
console.log('==========================');

// Analyze API key exposure
if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    
    const apiKeys = lines.filter(line => 
        line.includes('API_KEY') || 
        line.includes('SECRET') || 
        line.includes('TOKEN')
    );
    
    console.log(`📊 API Keys/Secrets found: ${apiKeys.length}`);
    
    // Check for proper EXPO_PUBLIC_ prefix
    const publicKeys = apiKeys.filter(line => line.startsWith('EXPO_PUBLIC_'));
    const privateKeys = apiKeys.filter(line => !line.startsWith('EXPO_PUBLIC_') && !line.startsWith('#'));
    
    if (privateKeys.length > 0) {
        console.log(`⚠️  Private keys without EXPO_PUBLIC_ prefix: ${privateKeys.length}`);
        console.log('   These should be handled server-side for security');
        securityChecks.push('Move private API keys to server-side');
    }
    
    console.log(`✅ Public API keys (client-safe): ${publicKeys.length}`);
}

console.log('\n🔍 CODE SECURITY SCAN:');
console.log('=======================');

// Scan for common security issues
const securityPatterns = [
    { pattern: /eval\s*\(/, issue: 'eval() usage - potential XSS risk' },
    { pattern: /innerHTML\s*=/, issue: 'innerHTML usage - potential XSS risk' },
    { pattern: /dangerouslySetInnerHTML/, issue: 'dangerouslySetInnerHTML usage - review needed' },
    { pattern: /http:\/\/(?!localhost)/, issue: 'HTTP URLs in production code' },
    { pattern: /console\.log\s*\([^)]*password/, issue: 'Password logging detected' },
    { pattern: /console\.log\s*\([^)]*token/, issue: 'Token logging detected' },
];

let codeIssues = [];

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        securityPatterns.forEach(({ pattern, issue }) => {
            if (pattern.test(content)) {
                codeIssues.push(`${filePath}: ${issue}`);
            }
        });
    } catch (error) {
        // Skip files that can't be read
    }
}

function scanDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                scanDirectory(filePath);
            } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                scanFile(filePath);
            }
        });
    } catch (error) {
        // Skip directories that can't be read
    }
}

if (fs.existsSync('src')) {
    scanDirectory('src');
}

if (codeIssues.length > 0) {
    console.log('⚠️  Security issues found:');
    codeIssues.forEach(issue => console.log(`   - ${issue}`));
    securityChecks.push('Review and fix code security issues');
} else {
    console.log('✅ No obvious security issues in code');
}

console.log('\n🔒 SECURITY RECOMMENDATIONS:');
console.log('=============================');

const recommendations = [
    {
        category: '🔐 Authentication & Authorization',
        items: [
            'Implement proper JWT token validation',
            'Use secure session management',
            'Implement role-based access control (RBAC)',
            'Add two-factor authentication (2FA)',
            'Implement account lockout after failed attempts',
            'Use secure password requirements'
        ]
    },
    {
        category: '🌐 Network Security',
        items: [
            'Use HTTPS for all API calls',
            'Implement certificate pinning',
            'Add request/response encryption',
            'Implement proper CORS policies',
            'Use secure API rate limiting',
            'Add request signing/verification'
        ]
    },
    {
        category: '💾 Data Protection',
        items: [
            'Encrypt sensitive data at rest',
            'Use secure key storage (Keychain/Keystore)',
            'Implement data anonymization',
            'Add secure data backup procedures',
            'Use proper data deletion methods',
            'Implement data access logging'
        ]
    },
    {
        category: '📱 Mobile-Specific Security',
        items: [
            'Implement app transport security',
            'Add root/jailbreak detection',
            'Use code obfuscation for sensitive logic',
            'Implement anti-tampering measures',
            'Add screenshot prevention for sensitive screens',
            'Use secure communication channels'
        ]
    },
    {
        category: '🔍 Monitoring & Compliance',
        items: [
            'Implement security event logging',
            'Add anomaly detection',
            'Regular security audits',
            'GDPR/CCPA compliance verification',
            'Penetration testing',
            'Vulnerability scanning'
        ]
    }
];

recommendations.forEach(section => {
    console.log(`\n${section.category}:`);
    section.items.forEach(item => {
        console.log(`   • ${item}`);
    });
});

console.log('\n🚨 IMMEDIATE ACTIONS NEEDED:');
console.log('============================');

if (securityChecks.length > 0) {
    securityChecks.forEach((check, index) => {
        console.log(`${index + 1}. ${check}`);
    });
} else {
    console.log('✅ No immediate security actions required');
}

console.log('\n📋 SECURITY CHECKLIST:');
console.log('======================');
console.log('□ All API keys properly secured');
console.log('□ HTTPS enforced for all communications');
console.log('□ User input validation implemented');
console.log('□ Authentication flows tested');
console.log('□ Authorization controls verified');
console.log('□ Sensitive data encryption enabled');
console.log('□ Security headers configured');
console.log('□ Error handling doesn\'t expose sensitive info');
console.log('□ Regular security updates scheduled');
console.log('□ Incident response plan documented');

console.log('');
