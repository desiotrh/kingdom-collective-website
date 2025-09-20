#!/usr/bin/env node
/*
 * License Verification Service
 * Cross-references lawyer data with multiple verification sources
 * Ensures all lawyers are properly licensed and in good standing
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');

class LicenseVerificationService {
  constructor() {
    this.browser = null;
    this.verificationResults = new Map();
    
    // Official license verification sources
    this.verificationSources = {
      'CA': {
        name: 'California State Bar',
        url: 'https://apps.calbar.ca.gov/attorney/LicenseeSearch/QuickSearch',
        searchFields: {
          lastName: '#LastName',
          firstName: '#FirstName',
          barNumber: '#BarNumber'
        },
        resultSelectors: {
          name: '.attorney-name, .name',
          status: '.status, .standing',
          license: '.bar-number, .license',
          admitted: '.admitted, .admission-date'
        }
      },
      
      'NY': {
        name: 'New York Courts Attorney Registration',
        url: 'https://iapps.courts.state.ny.us/attorney/AttorneySearch',
        searchFields: {
          lastName: '#lastName',
          firstName: '#firstName',
          registrationNumber: '#registrationNumber'
        },
        resultSelectors: {
          name: '.attorney-name',
          status: '.registration-status',
          registration: '.registration-number',
          admitted: '.admission-date'
        }
      },
      
      'TX': {
        name: 'Texas State Bar',
        url: 'https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer',
        searchFields: {
          lastName: 'input[name="LastName"]',
          firstName: 'input[name="FirstName"]',
          barNumber: 'input[name="BarCardNumber"]'
        },
        resultSelectors: {
          name: '.attorney-name',
          status: '.bar-status',
          barNumber: '.bar-number',
          admitted: '.admission-date'
        }
      },
      
      'FL': {
        name: 'Florida Bar',
        url: 'https://www.floridabar.org/directories/find-mbr/',
        searchFields: {
          lastName: 'input[name="lastName"]',
          firstName: 'input[name="firstName"]',
          barNumber: 'input[name="barNumber"]'
        },
        resultSelectors: {
          name: '.member-name',
          status: '.member-status',
          barNumber: '.bar-number',
          admitted: '.admission-date'
        }
      }
    };
  }

  async initialize() {
    console.log('🔍 Initializing License Verification Service...');
    
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
      
      console.log('✅ Verification service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize verification service:', error.message);
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Verification service closed');
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  parseName(fullName) {
    // Extract first and last names from full name
    const nameParts = fullName.replace(/,?\s*(Esq\.?|Attorney|Lawyer|J\.?D\.?)$/i, '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[nameParts.length - 1] || '';
    
    return { firstName, lastName };
  }

  async verifyLawyer(lawyer, state) {
    const source = this.verificationSources[state];
    if (!source) {
      return {
        verified: false,
        reason: `No verification source available for ${state}`,
        source: 'Unknown'
      };
    }

    const cacheKey = `${state}-${lawyer.name}`;
    if (this.verificationResults.has(cacheKey)) {
      return this.verificationResults.get(cacheKey);
    }

    try {
      console.log(`  🔍 Verifying ${lawyer.name} in ${state}...`);
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Navigate to verification site
      await page.goto(source.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Parse lawyer name
      const { firstName, lastName } = this.parseName(lawyer.name);
      
      // Fill search form
      await page.waitForSelector(source.searchFields.lastName, { timeout: 10000 });
      
      if (source.searchFields.lastName) {
        await page.type(source.searchFields.lastName, lastName);
      }
      
      if (source.searchFields.firstName && firstName) {
        await page.type(source.searchFields.firstName, firstName);
      }

      // Submit search
      await page.click('input[type="submit"], button[type="submit"], .search-button, #searchButton');
      
      // Wait for results
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 15000 
      });

      // Extract verification data
      const verificationData = await page.evaluate((selectors, lawyerName) => {
        const results = [];
        
        // Look for result containers
        const resultContainers = document.querySelectorAll(
          '.search-result, .attorney-result, .member-result, .lawyer-item, .result-item, tr'
        );

        resultContainers.forEach(container => {
          const nameElement = container.querySelector(selectors.name + ', .name, h3, .title, td:first-child');
          const statusElement = container.querySelector(selectors.status + ', .status, .standing');
          const licenseElement = container.querySelector(selectors.license + ', .license, .number');
          const admittedElement = container.querySelector(selectors.admitted + ', .date, .year');

          if (nameElement) {
            const foundName = nameElement.textContent.trim();
            const status = statusElement ? statusElement.textContent.trim() : '';
            const license = licenseElement ? licenseElement.textContent.trim() : '';
            const admitted = admittedElement ? admittedElement.textContent.trim() : '';

            // Check if this result matches our lawyer
            const nameMatch = foundName.toLowerCase().includes(lawyerName.toLowerCase()) ||
                            lawyerName.toLowerCase().includes(foundName.toLowerCase());

            if (nameMatch) {
              results.push({
                foundName,
                status,
                license,
                admitted,
                isActive: status.toLowerCase().includes('active') || 
                         status.toLowerCase().includes('good') ||
                         status.toLowerCase().includes('current') ||
                         !status.toLowerCase().includes('inactive')
              });
            }
          }
        });

        return results;
      }, source.resultSelectors, lawyer.name);

      await page.close();

      // Analyze verification results
      let result;
      if (verificationData.length > 0) {
        const match = verificationData[0]; // Take best match
        result = {
          verified: true,
          isActive: match.isActive,
          status: match.status,
          license: match.license,
          admitted: match.admitted,
          foundName: match.foundName,
          verifiedAt: new Date().toISOString(),
          source: source.name
        };
        
        console.log(`    ✅ Verified: ${match.foundName} - ${match.status}`);
      } else {
        result = {
          verified: false,
          reason: 'No matching records found',
          verifiedAt: new Date().toISOString(),
          source: source.name
        };
        
        console.log(`    ❌ Not found: ${lawyer.name}`);
      }

      // Cache the result
      this.verificationResults.set(cacheKey, result);
      
      // Be respectful to servers
      await this.delay(2000);
      
      return result;

    } catch (error) {
      console.log(`    ⚠️ Error verifying ${lawyer.name}: ${error.message}`);
      
      const result = {
        verified: false,
        reason: `Verification error: ${error.message}`,
        verifiedAt: new Date().toISOString(),
        source: source.name
      };
      
      this.verificationResults.set(cacheKey, result);
      return result;
    }
  }

  async verifyAllLawyers(stateCode, countySlug) {
    console.log(`🔍 Verifying all lawyers in ${stateCode}/${countySlug}...`);
    
    const lawyersPath = path.join(__dirname, '..', 'states', stateCode.toLowerCase(), countySlug, 'lawyers.json');
    
    if (!fs.existsSync(lawyersPath)) {
      console.log(`  ❌ Lawyers file not found: ${lawyersPath}`);
      return;
    }

    try {
      const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
      
      if (!lawyersData.lawyers || lawyersData.lawyers.length === 0) {
        console.log(`  ⚠️ No lawyers found in ${countySlug}`);
        return;
      }

      console.log(`  📋 Found ${lawyersData.lawyers.length} lawyers to verify`);
      
      // Verify each lawyer
      for (let i = 0; i < lawyersData.lawyers.length; i++) {
        const lawyer = lawyersData.lawyers[i];
        console.log(`  ${i + 1}/${lawyersData.lawyers.length} Verifying ${lawyer.name}...`);
        
        const verification = await this.verifyLawyer(lawyer, stateCode);
        
        // Update lawyer record with verification data
        lawyer.licenseVerification = verification;
        lawyer.verified = verification.verified;
        lawyer.verifiedAt = verification.verifiedAt;
        
        if (verification.verified) {
          lawyer.licenseStatus = verification.status;
          lawyer.licenseNumber = verification.license;
          lawyer.admissionDate = verification.admitted;
          lawyer.isActive = verification.isActive;
        }
      }

      // Update verification metadata
      lawyersData.lastVerified = new Date().toISOString();
      lawyersData.verificationSource = this.verificationSources[stateCode].name;
      
      // Save updated data
      fs.writeFileSync(lawyersPath, JSON.stringify(lawyersData, null, 2));
      
      const verifiedCount = lawyersData.lawyers.filter(l => l.verified).length;
      console.log(`  ✅ Verification complete: ${verifiedCount}/${lawyersData.lawyers.length} lawyers verified`);

    } catch (error) {
      console.error(`❌ Error verifying lawyers in ${countySlug}:`, error.message);
    }
  }

  async verifyState(stateCode) {
    console.log(`🏛️ Verifying all lawyers in ${stateCode}...`);
    
    const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
    
    if (!fs.existsSync(statePath)) {
      console.log(`  ❌ State directory not found: ${statePath}`);
      return;
    }

    const counties = fs.readdirSync(statePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`  📁 Found ${counties.length} counties in ${stateCode}`);

    for (const county of counties) {
      await this.verifyAllLawyers(stateCode, county);
      await this.delay(1000); // Be respectful between counties
    }
  }

  async generateVerificationReport(stateCode) {
    console.log(`📊 Generating verification report for ${stateCode}...`);
    
    const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
    const reportPath = path.join(__dirname, '..', 'reports', `${stateCode.toLowerCase()}-verification-report.json`);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const report = {
      state: stateCode,
      generatedAt: new Date().toISOString(),
      counties: [],
      summary: {
        totalLawyers: 0,
        verifiedLawyers: 0,
        activeLawyers: 0,
        unverifiedLawyers: 0,
        verificationRate: 0
      }
    };

    if (!fs.existsSync(statePath)) {
      console.log(`  ❌ State directory not found: ${statePath}`);
      return report;
    }

    const counties = fs.readdirSync(statePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const county of counties) {
      const lawyersPath = path.join(statePath, county, 'lawyers.json');
      
      if (fs.existsSync(lawyersPath)) {
        const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
        
        const countyReport = {
          county: lawyersData.county || county,
          totalLawyers: lawyersData.lawyers ? lawyersData.lawyers.length : 0,
          verifiedLawyers: 0,
          activeLawyers: 0,
          unverifiedLawyers: 0,
          lastVerified: lawyersData.lastVerified || null,
          lawyers: []
        };

        if (lawyersData.lawyers) {
          lawyersData.lawyers.forEach(lawyer => {
            const isVerified = lawyer.verified === true;
            const isActive = lawyer.isActive === true;
            
            if (isVerified) countyReport.verifiedLawyers++;
            if (isActive) countyReport.activeLawyers++;
            if (!isVerified) countyReport.unverifiedLawyers++;

            countyReport.lawyers.push({
              name: lawyer.name,
              verified: isVerified,
              active: isActive,
              status: lawyer.licenseStatus || 'Unknown',
              license: lawyer.licenseNumber || 'Unknown',
              verifiedAt: lawyer.verifiedAt || null
            });
          });
        }

        countyReport.verificationRate = countyReport.totalLawyers > 0 
          ? Math.round((countyReport.verifiedLawyers / countyReport.totalLawyers) * 100)
          : 0;

        report.counties.push(countyReport);
        
        // Update summary
        report.summary.totalLawyers += countyReport.totalLawyers;
        report.summary.verifiedLawyers += countyReport.verifiedLawyers;
        report.summary.activeLawyers += countyReport.activeLawyers;
        report.summary.unverifiedLawyers += countyReport.unverifiedLawyers;
      }
    }

    // Calculate overall verification rate
    report.summary.verificationRate = report.summary.totalLawyers > 0
      ? Math.round((report.summary.verifiedLawyers / report.summary.totalLawyers) * 100)
      : 0;

    // Save report
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Verification Report for ${stateCode}:`);
    console.log(`   Total Lawyers: ${report.summary.totalLawyers}`);
    console.log(`   Verified: ${report.summary.verifiedLawyers} (${report.summary.verificationRate}%)`);
    console.log(`   Active: ${report.summary.activeLawyers}`);
    console.log(`   Unverified: ${report.summary.unverifiedLawyers}`);
    console.log(`   Report saved: ${reportPath}`);

    return report;
  }
}

// Main execution
async function main() {
  const verifier = new LicenseVerificationService();
  
  try {
    const initialized = await verifier.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize verifier');
      process.exit(1);
    }
    
    const args = process.argv.slice(2);
    const command = args[0];
    const state = args[1];
    
    switch (command) {
      case 'verify':
        if (!state) {
          console.log('❌ Please specify a state: node license-verification.js verify CA');
          process.exit(1);
        }
        await verifier.verifyState(state.toUpperCase());
        await verifier.generateVerificationReport(state.toUpperCase());
        break;
        
      case 'report':
        if (!state) {
          console.log('❌ Please specify a state: node license-verification.js report CA');
          process.exit(1);
        }
        await verifier.generateVerificationReport(state.toUpperCase());
        break;
        
      case 'all':
        const states = ['CA', 'NY', 'TX', 'FL'];
        for (const stateCode of states) {
          await verifier.verifyState(stateCode);
          await verifier.generateVerificationReport(stateCode);
        }
        break;
        
      default:
        console.log('📋 License Verification Service Usage:');
        console.log('  node license-verification.js verify CA    # Verify all lawyers in California');
        console.log('  node license-verification.js report CA    # Generate verification report');
        console.log('  node license-verification.js all          # Verify all supported states');
        console.log('\n🔍 This tool verifies lawyer licenses against official state bar records');
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await verifier.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { LicenseVerificationService };
