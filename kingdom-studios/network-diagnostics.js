#!/usr/bin/env node

/**
 * Kingdom Studios App - Network & Connection Diagnostic Tool
 * Checks for firewall issues, port conflicts, and network connectivity
 */

const net = require('net');
const dns = require('dns');
const { spawn, exec } = require('child_process');
const os = require('os');

class NetworkDiagnostics {
  constructor() {
    this.results = {
      firewall: [],
      ports: [],
      network: [],
      processes: [],
      recommendations: [],
    };
  }

  async runCompleteDiagnostics() {
    console.log('🔍 KINGDOM STUDIOS APP - NETWORK & CONNECTION DIAGNOSTICS');
    console.log('=' .repeat(70));
    console.log('🎯 Goal: Identify and resolve connectivity issues\n');

    try {
      // 1. Check system information
      await this.checkSystemInfo();

      // 2. Check port availability
      await this.checkPortAvailability();

      // 3. Check running processes
      await this.checkRunningProcesses();

      // 4. Test local connectivity
      await this.testLocalConnectivity();

      // 5. Check firewall settings
      await this.checkFirewallSettings();

      // 6. Test network connectivity
      await this.testNetworkConnectivity();

      // 7. Check DNS resolution
      await this.checkDNSResolution();

      // Generate recommendations
      this.generateRecommendations();

    } catch (error) {
      console.error('❌ Diagnostics failed:', error);
    }
  }

  async checkSystemInfo() {
    console.log('💻 System Information...');
    
    const platform = os.platform();
    const release = os.release();
    const arch = os.arch();
    const networkInterfaces = os.networkInterfaces();

    console.log(`  OS: ${platform} ${release} (${arch})`);
    console.log(`  Node.js: ${process.version}`);
    
    // Check network interfaces
    console.log('\n🌐 Network Interfaces:');
    Object.keys(networkInterfaces).forEach(iface => {
      const addresses = networkInterfaces[iface];
      addresses.forEach(addr => {
        if (!addr.internal && addr.family === 'IPv4') {
          console.log(`  ✅ ${iface}: ${addr.address}`);
        }
      });
    });

    this.results.network.push({
      name: 'System Info',
      status: 'checked',
      details: { platform, release, arch }
    });
  }

  async checkPortAvailability() {
    console.log('\n🔌 Checking Port Availability...');
    
    const portsToCheck = [
      { port: 3001, name: 'Backend API Server' },
      { port: 8081, name: 'Expo Metro Bundler' },
      { port: 19000, name: 'Expo Dev Server' },
      { port: 19001, name: 'Expo Dev Server (additional)' },
      { port: 19002, name: 'Expo Dev Tools' },
      { port: 27017, name: 'MongoDB Local' },
      { port: 5432, name: 'PostgreSQL' },
    ];

    for (const portInfo of portsToCheck) {
      try {
        const isAvailable = await this.checkPort(portInfo.port);
        if (isAvailable) {
          console.log(`  ✅ Port ${portInfo.port} (${portInfo.name}): Available`);
          this.results.ports.push({
            port: portInfo.port,
            name: portInfo.name,
            status: 'available'
          });
        } else {
          console.log(`  ⚠️ Port ${portInfo.port} (${portInfo.name}): In Use`);
          this.results.ports.push({
            port: portInfo.port,
            name: portInfo.name,
            status: 'in_use'
          });
        }
      } catch (error) {
        console.log(`  ❌ Port ${portInfo.port} (${portInfo.name}): Error - ${error.message}`);
        this.results.ports.push({
          port: portInfo.port,
          name: portInfo.name,
          status: 'error',
          error: error.message
        });
      }
    }
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.close(() => {
          resolve(true); // Port is available
        });
      });

      server.on('error', () => {
        resolve(false); // Port is in use
      });
    });
  }

  async checkRunningProcesses() {
    console.log('\n🔄 Checking Running Processes...');
    
    try {
      const command = process.platform === 'win32' 
        ? 'netstat -ano | findstr ":3001"'
        : 'lsof -i :3001';
      
      const result = await this.executeCommand(command);
      
      if (result.trim()) {
        console.log('  🟡 Processes using port 3001:');
        console.log(`  ${result}`);
        this.results.processes.push({
          port: 3001,
          status: 'in_use',
          details: result
        });
      } else {
        console.log('  ✅ No processes found using port 3001');
        this.results.processes.push({
          port: 3001,
          status: 'free'
        });
      }
    } catch (error) {
      console.log(`  ⚠️ Could not check processes: ${error.message}`);
      this.results.processes.push({
        port: 3001,
        status: 'error',
        error: error.message
      });
    }

    // Check for Node.js processes
    try {
      const nodeCommand = process.platform === 'win32'
        ? 'tasklist | findstr "node.exe"'
        : 'ps aux | grep node';
      
      const nodeProcesses = await this.executeCommand(nodeCommand);
      if (nodeProcesses.trim()) {
        console.log('  🟢 Node.js processes running:');
        const lines = nodeProcesses.split('\n').slice(0, 3); // Show first 3 lines
        lines.forEach(line => {
          if (line.trim()) {
            console.log(`    ${line.trim()}`);
          }
        });
      }
    } catch (error) {
      console.log('  ⚠️ Could not check Node.js processes');
    }
  }

  async testLocalConnectivity() {
    console.log('\n🔗 Testing Local Connectivity...');
    
    const testUrls = [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:8081',
      'http://127.0.0.1:8081',
    ];

    for (const url of testUrls) {
      try {
        const result = await this.testConnection(url);
        console.log(`  ${result.success ? '✅' : '❌'} ${url}: ${result.message}`);
        this.results.network.push({
          url,
          status: result.success ? 'connected' : 'failed',
          message: result.message
        });
      } catch (error) {
        console.log(`  ❌ ${url}: ${error.message}`);
        this.results.network.push({
          url,
          status: 'error',
          error: error.message
        });
      }
    }
  }

  async testConnection(url) {
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const client = net.createConnection({
        host: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        timeout: 5000
      });

      client.on('connect', () => {
        client.end();
        resolve({ success: true, message: 'Connection successful' });
      });

      client.on('error', (error) => {
        resolve({ success: false, message: error.message });
      });

      client.on('timeout', () => {
        client.destroy();
        resolve({ success: false, message: 'Connection timeout' });
      });
    });
  }

  async checkFirewallSettings() {
    console.log('\n🔥 Checking Firewall Settings...');
    
    const platform = process.platform;
    
    if (platform === 'win32') {
      await this.checkWindowsFirewall();
    } else if (platform === 'darwin') {
      await this.checkMacFirewall();
    } else {
      await this.checkLinuxFirewall();
    }
  }

  async checkWindowsFirewall() {
    try {
      console.log('  🔍 Checking Windows Firewall...');
      
      // Check Windows Firewall status
      const firewallStatus = await this.executeCommand('netsh advfirewall show allprofiles state');
      console.log('  📊 Firewall Status:');
      console.log(`    ${firewallStatus.split('\n')[0]}`);
      
      // Check for Node.js rules
      const nodeRules = await this.executeCommand('netsh advfirewall firewall show rule name=all | findstr "Node"');
      if (nodeRules.trim()) {
        console.log('  ✅ Node.js firewall rules found');
      } else {
        console.log('  ⚠️ No Node.js firewall rules found');
        this.results.firewall.push({
          issue: 'No Node.js firewall rules',
          recommendation: 'Add Windows Firewall exception for Node.js'
        });
      }

    } catch (error) {
      console.log(`  ⚠️ Could not check Windows Firewall: ${error.message}`);
      this.results.firewall.push({
        issue: 'Cannot check firewall',
        error: error.message
      });
    }
  }

  async checkMacFirewall() {
    try {
      console.log('  🔍 Checking macOS Firewall...');
      
      const firewallStatus = await this.executeCommand('sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate');
      console.log(`  📊 ${firewallStatus}`);
      
      if (firewallStatus.includes('enabled')) {
        console.log('  ⚠️ macOS Firewall is enabled - may block connections');
        this.results.firewall.push({
          issue: 'macOS Firewall enabled',
          recommendation: 'Add Node.js to firewall exceptions'
        });
      } else {
        console.log('  ✅ macOS Firewall is disabled');
      }

    } catch (error) {
      console.log(`  ⚠️ Could not check macOS Firewall: ${error.message}`);
    }
  }

  async checkLinuxFirewall() {
    try {
      console.log('  🔍 Checking Linux Firewall...');
      
      // Check ufw status
      const ufwStatus = await this.executeCommand('ufw status');
      console.log(`  📊 UFW Status: ${ufwStatus}`);
      
      // Check iptables
      const iptablesStatus = await this.executeCommand('iptables -L -n');
      if (iptablesStatus.includes('REJECT') || iptablesStatus.includes('DROP')) {
        console.log('  ⚠️ iptables rules may block connections');
        this.results.firewall.push({
          issue: 'iptables rules detected',
          recommendation: 'Check iptables rules for port 3001'
        });
      }

    } catch (error) {
      console.log(`  ⚠️ Could not check Linux Firewall: ${error.message}`);
    }
  }

  async testNetworkConnectivity() {
    console.log('\n🌐 Testing Network Connectivity...');
    
    const testHosts = [
      'google.com',
      'github.com',
      'npmjs.org',
      'expo.dev',
    ];

    for (const host of testHosts) {
      try {
        const result = await this.pingHost(host);
        console.log(`  ${result.success ? '✅' : '❌'} ${host}: ${result.message}`);
      } catch (error) {
        console.log(`  ❌ ${host}: ${error.message}`);
      }
    }
  }

  async pingHost(host) {
    return new Promise((resolve) => {
      const pingCommand = process.platform === 'win32' 
        ? `ping -n 1 ${host}`
        : `ping -c 1 ${host}`;
      
      exec(pingCommand, (error, stdout) => {
        if (error) {
          resolve({ success: false, message: 'Unreachable' });
        } else {
          const success = stdout.includes('TTL') || stdout.includes('time=');
          resolve({ 
            success, 
            message: success ? 'Reachable' : 'No response' 
          });
        }
      });
    });
  }

  async checkDNSResolution() {
    console.log('\n🔍 Testing DNS Resolution...');
    
    const testDomains = [
      'localhost',
      'google.com',
      'github.com',
    ];

    for (const domain of testDomains) {
      try {
        const addresses = await this.resolveDNS(domain);
        console.log(\`  ✅ \${domain}: \${addresses.join(', ')}\`);
      } catch (error) {
        console.log(\`  ❌ \${domain}: \${error.message}\`);
      }
    }
  }

  async resolveDNS(domain) {
    return new Promise((resolve, reject) => {
      dns.resolve4(domain, (error, addresses) => {
        if (error) {
          reject(error);
        } else {
          resolve(addresses);
        }
      });
    });
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout + stderr);
        }
      });
    });
  }

  generateRecommendations() {
    console.log('\n' + '='.repeat(70));
    console.log('🔧 NETWORK DIAGNOSTIC RECOMMENDATIONS');
    console.log('='.repeat(70));

    // Analyze results and generate recommendations
    const inUsePorts = this.results.ports.filter(p => p.status === 'in_use');
    const networkIssues = this.results.network.filter(n => n.status === 'failed');
    const firewallIssues = this.results.firewall;

    console.log('\n📊 DIAGNOSTIC SUMMARY:');
    console.log(\`   Ports checked: \${this.results.ports.length}\`);
    console.log(\`   Ports in use: \${inUsePorts.length}\`);
    console.log(\`   Network issues: \${networkIssues.length}\`);
    console.log(\`   Firewall issues: \${firewallIssues.length}\`);

    if (inUsePorts.length > 0) {
      console.log('\n🔌 PORT CONFLICTS DETECTED:');
      inUsePorts.forEach(port => {
        console.log(\`   ⚠️ Port \${port.port} (\${port.name}) is in use\`);
        
        if (port.port === 3001) {
          console.log('   🔧 SOLUTION: Kill existing process or use different port');
          console.log('   💡 Windows: taskkill /F /PID <PID>');
          console.log('   💡 Mac/Linux: kill -9 <PID>');
        }
      });
    }

    if (networkIssues.length > 0) {
      console.log('\n🌐 NETWORK CONNECTIVITY ISSUES:');
      networkIssues.forEach(issue => {
        console.log(\`   ❌ \${issue.url}: \${issue.message}\`);
      });
      
      console.log('\n   🔧 SOLUTIONS:');
      console.log('   1. Check if backend server is running');
      console.log('   2. Verify correct port numbers');
      console.log('   3. Check antivirus/security software');
      console.log('   4. Try different localhost address (127.0.0.1 vs localhost)');
    }

    if (firewallIssues.length > 0) {
      console.log('\n🔥 FIREWALL CONFIGURATION NEEDED:');
      firewallIssues.forEach(issue => {
        console.log(\`   ⚠️ \${issue.issue}\`);
        if (issue.recommendation) {
          console.log(\`   💡 \${issue.recommendation}\`);
        }
      });

      console.log('\n   🔧 FIREWALL SOLUTIONS:');
      console.log('   Windows: Add Node.js to Windows Defender exceptions');
      console.log('   macOS: System Preferences > Security > Firewall');
      console.log('   Linux: sudo ufw allow 3001');
    }

    console.log('\n🚀 QUICK FIXES TO TRY:');
    console.log('   1. Restart your development environment');
    console.log('   2. Run as administrator/sudo (temporarily)');
    console.log('   3. Disable antivirus temporarily for testing');
    console.log('   4. Use different port (3002, 3003, etc.)');
    console.log('   5. Check browser/system proxy settings');

    console.log('\n💡 DEVELOPMENT ENVIRONMENT SETUP:');
    console.log('   • Start backend: cd kingdom-studios-backend && npm start');
    console.log('   • Start frontend: cd kingdom-studios && npx expo start');
    console.log('   • Check backend health: curl http://localhost:3001/health');

    if (inUsePorts.length === 0 && networkIssues.length === 0 && firewallIssues.length === 0) {
      console.log('\n🎉 ✅ NO CONNECTIVITY ISSUES DETECTED!');
      console.log('   Your network configuration appears to be working correctly.');
      console.log('   If you\'re still experiencing issues, check:');
      console.log('   • Backend server status');
      console.log('   • Application logs');
      console.log('   • Environment variables');
    }

    console.log('\n🔍 Network diagnostics complete!');
  }
}

// Run diagnostics
if (require.main === module) {
  const diagnostics = new NetworkDiagnostics();
  diagnostics.runCompleteDiagnostics().catch(console.error);
}

module.exports = NetworkDiagnostics;
