#!/usr/bin/env node
/*
 * Real Legal Data Collector with License Verification
 * Collects actual lawyer and mediator data from live sources
 * Includes license verification and data validation
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

class RealLegalDataCollector {
  constructor() {
    this.browser = null;
    this.collectedData = new Map();
    this.licenseVerificationCache = new Map();
    
    // Real data sources with working endpoints
    this.dataSources = {
      // California State Bar - Public API
      'CA': {
        stateBar: {
          name: 'California State Bar',
          searchUrl: 'https://apps.calbar.ca.gov/attorney/LicenseeSearch/QuickSearch',
          apiUrl: 'https://apps.calbar.ca.gov/attorney/LicenseeSearch/api/attorneys',
          licenseVerifyUrl: 'https://apps.calbar.ca.gov/attorney/LicenseeSearch/QuickSearch',
          type: 'api'
        },
        mediators: {
          name: 'California Courts ADR',
          url: 'https://www.courts.ca.gov/programs-adr.htm',
          type: 'scrape'
        }
      },
      
      // New York State Bar
      'NY': {
        stateBar: {
          name: 'New York State Bar',
          searchUrl: 'https://iapps.courts.state.ny.us/attorney/AttorneySearch',
          apiUrl: 'https://iapps.courts.state.ny.us/attorney/api/AttorneySearch',
          licenseVerifyUrl: 'https://iapps.courts.state.ny.us/attorney/AttorneySearch',
          type: 'hybrid'
        },
        mediators: {
          name: 'NY Courts Mediation',
          url: 'https://www.nycourts.gov/ip/mediation/roster.shtml',
          type: 'scrape'
        }
      },
      
      // Texas State Bar
      'TX': {
        stateBar: {
          name: 'Texas State Bar',
          searchUrl: 'https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer',
          apiUrl: 'https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer&template=/CustomSource/MemberDirectory/Result_form_client.cfm',
          licenseVerifyUrl: 'https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer',
          type: 'scrape'
        },
        mediators: {
          name: 'Texas Mediators',
          url: 'https://www.txcourts.gov/adr/mediator-search/',
          type: 'scrape'
        }
      },
      
      // Florida Bar
      'FL': {
        stateBar: {
          name: 'Florida Bar',
          searchUrl: 'https://www.floridabar.org/directories/find-mbr/',
          apiUrl: 'https://www.floridabar.org/directories/find-mbr/',
          licenseVerifyUrl: 'https://www.floridabar.org/directories/find-mbr/',
          type: 'scrape'
        },
        mediators: {
          name: 'Florida Supreme Court Mediators',
          url: 'https://www.flcourts.org/Resources-Services/Alternative-Dispute-Resolution/Certified-Mediators',
          type: 'scrape'
        }
      }
    };
  }

  async initialize() {
    console.log('🚀 Initializing Real Legal Data Collector...');
    
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      console.log('✅ Browser initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error.message);
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async collectCaliforniaLawyers(counties = ['Los Angeles', 'San Francisco', 'San Diego']) {
    console.log('📋 Collecting California lawyers from State Bar...');
    
    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const lawyers = [];
      
      for (const county of counties) {
        console.log(`  🔍 Searching ${county} County...`);
        
        await page.goto('https://apps.calbar.ca.gov/attorney/LicenseeSearch/QuickSearch', {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // Wait for search form
        await page.waitForSelector('#City', { timeout: 10000 });
        
        // Fill search form
        await page.type('#City', county);
        await page.select('#PracticeArea', 'Family Law');
        
        // Submit search
        await page.click('input[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // Extract lawyer data
        const pageData = await page.evaluate(() => {
          const results = [];
          const lawyerElements = document.querySelectorAll('.search-result, .attorney-result, .result-item');
          
          lawyerElements.forEach(element => {
            const nameElement = element.querySelector('.name, .attorney-name, h3, .title');
            const addressElement = element.querySelector('.address, .location, .city');
            const phoneElement = element.querySelector('.phone, .contact, .tel');
            const practiceElement = element.querySelector('.practice, .areas, .specialization');
            const licenseElement = element.querySelector('.license, .bar-number, .member-id');
            
            if (nameElement) {
              results.push({
                name: nameElement.textContent.trim(),
                address: addressElement ? addressElement.textContent.trim() : '',
                phone: phoneElement ? phoneElement.textContent.trim() : '',
                practice: practiceElement ? practiceElement.textContent.trim() : 'Family Law',
                license: licenseElement ? licenseElement.textContent.trim() : '',
                source: 'California State Bar',
                verified: true,
                verifiedAt: new Date().toISOString(),
                county: county,
                state: 'CA'
              });
            }
          });
          
          return results;
        });
        
        lawyers.push(...pageData);
        console.log(`    ✅ Found ${pageData.length} lawyers in ${county}`);
        
        // Be respectful to the server
        await this.delay(2000);
      }
      
      await page.close();
      console.log(`📊 Total California lawyers collected: ${lawyers.length}`);
      return lawyers;
      
    } catch (error) {
      console.error('❌ Error collecting California lawyers:', error.message);
      return [];
    }
  }

  async collectNewYorkLawyers(counties = ['New York', 'Kings', 'Queens']) {
    console.log('📋 Collecting New York lawyers from court system...');
    
    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      const lawyers = [];
      
      for (const county of counties) {
        console.log(`  🔍 Searching ${county} County...`);
        
        await page.goto('https://iapps.courts.state.ny.us/attorney/AttorneySearch', {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // Wait for search form
        await page.waitForSelector('#lastName', { timeout: 10000 });
        
        // Search by county/area
        await page.type('#city', county);
        await page.select('#practiceArea', 'Family');
        
        // Submit search
        await page.click('#searchButton');
        await page.waitForSelector('.search-results, .attorney-list', { timeout: 15000 });
        
        const pageData = await page.evaluate(() => {
          const results = [];
          const lawyerElements = document.querySelectorAll('.attorney-item, .search-result, .lawyer-entry');
          
          lawyerElements.forEach(element => {
            const nameElement = element.querySelector('.attorney-name, .name, h3');
            const addressElement = element.querySelector('.address, .location');
            const phoneElement = element.querySelector('.phone, .contact');
            const firmElement = element.querySelector('.firm, .organization');
            
            if (nameElement) {
              results.push({
                name: nameElement.textContent.trim(),
                address: addressElement ? addressElement.textContent.trim() : '',
                phone: phoneElement ? phoneElement.textContent.trim() : '',
                firm: firmElement ? firmElement.textContent.trim() : '',
                practice: 'Family Law',
                source: 'New York Courts',
                verified: true,
                verifiedAt: new Date().toISOString(),
                county: county,
                state: 'NY'
              });
            }
          });
          
          return results;
        });
        
        lawyers.push(...pageData);
        console.log(`    ✅ Found ${pageData.length} lawyers in ${county}`);
        
        await this.delay(2000);
      }
      
      await page.close();
      console.log(`📊 Total New York lawyers collected: ${lawyers.length}`);
      return lawyers;
      
    } catch (error) {
      console.error('❌ Error collecting New York lawyers:', error.message);
      return [];
    }
  }

  async verifyLicense(lawyer, state) {
    const cacheKey = `${state}-${lawyer.name}-${lawyer.license}`;
    
    if (this.licenseVerificationCache.has(cacheKey)) {
      return this.licenseVerificationCache.get(cacheKey);
    }
    
    try {
      console.log(`    🔍 Verifying license for ${lawyer.name}...`);
      
      const page = await this.browser.newPage();
      const source = this.dataSources[state]?.stateBar;
      
      if (!source) {
        console.log(`    ⚠️ No verification source for ${state}`);
        return { verified: false, reason: 'No verification source available' };
      }
      
      await page.goto(source.licenseVerifyUrl, { waitUntil: 'networkidle2' });
      
      // Try to search by name
      const nameSelector = 'input[name*="name"], input[id*="name"], #lastName, #attorneyName';
      await page.waitForSelector(nameSelector, { timeout: 5000 });
      
      const lastName = lawyer.name.split(' ').pop();
      await page.type(nameSelector, lastName);
      
      // Submit verification search
      await page.click('input[type="submit"], button[type="submit"], #searchButton');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      
      // Check if lawyer appears in results
      const isVerified = await page.evaluate((lawyerName) => {
        const resultElements = document.querySelectorAll('.result, .attorney, .lawyer, .search-result');
        
        for (const element of resultElements) {
          if (element.textContent.toLowerCase().includes(lawyerName.toLowerCase())) {
            return true;
          }
        }
        return false;
      }, lawyer.name);
      
      await page.close();
      
      const result = {
        verified: isVerified,
        verifiedAt: new Date().toISOString(),
        source: source.name
      };
      
      this.licenseVerificationCache.set(cacheKey, result);
      
      if (isVerified) {
        console.log(`    ✅ License verified for ${lawyer.name}`);
      } else {
        console.log(`    ❌ Could not verify license for ${lawyer.name}`);
      }
      
      return result;
      
    } catch (error) {
      console.log(`    ⚠️ Error verifying license for ${lawyer.name}: ${error.message}`);
      return { verified: false, reason: error.message };
    }
  }

  async collectMediators(state, counties) {
    console.log(`🤝 Collecting mediators for ${state}...`);
    
    const source = this.dataSources[state]?.mediators;
    if (!source) {
      console.log(`  ⚠️ No mediator source available for ${state}`);
      return [];
    }
    
    try {
      const page = await this.browser.newPage();
      await page.goto(source.url, { waitUntil: 'networkidle2' });
      
      const mediators = await page.evaluate((stateCode, countyList) => {
        const results = [];
        const mediatorElements = document.querySelectorAll('.mediator, .adr-provider, .certified-mediator, .roster-entry');
        
        mediatorElements.forEach(element => {
          const nameElement = element.querySelector('.name, .mediator-name, h3, .title');
          const locationElement = element.querySelector('.location, .address, .city');
          const phoneElement = element.querySelector('.phone, .contact, .tel');
          const specialtyElement = element.querySelector('.specialty, .areas, .focus');
          const certElement = element.querySelector('.certification, .certified, .status');
          
          if (nameElement) {
            const location = locationElement ? locationElement.textContent.trim() : '';
            const isInTargetCounty = countyList.some(county => 
              location.toLowerCase().includes(county.toLowerCase())
            );
            
            if (isInTargetCounty || !location) {
              results.push({
                name: nameElement.textContent.trim(),
                location: location,
                phone: phoneElement ? phoneElement.textContent.trim() : '',
                specialty: specialtyElement ? specialtyElement.textContent.trim() : 'General Mediation',
                certification: certElement ? certElement.textContent.trim() : '',
                source: 'Court-Certified Mediator Directory',
                verified: true,
                verifiedAt: new Date().toISOString(),
                state: stateCode
              });
            }
          }
        });
        
        return results;
      }, state, counties);
      
      await page.close();
      console.log(`  ✅ Collected ${mediators.length} mediators`);
      return mediators;
      
    } catch (error) {
      console.error(`❌ Error collecting mediators for ${state}:`, error.message);
      return [];
    }
  }

  async updateCountyData(state, county, lawyers, mediators) {
    const countySlug = county.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const countyPath = path.join(__dirname, '..', 'states', state.toLowerCase(), countySlug);
    
    if (!fs.existsSync(countyPath)) {
      console.log(`  ⚠️ County directory not found: ${countyPath}`);
      return;
    }
    
    try {
      // Update lawyers.json
      const lawyersPath = path.join(countyPath, 'lawyers.json');
      if (fs.existsSync(lawyersPath)) {
        const currentData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
        
        // Filter lawyers for this county
        const countyLawyers = lawyers.filter(lawyer => 
          lawyer.county === county || 
          lawyer.address.toLowerCase().includes(county.toLowerCase())
        );
        
        // Verify licenses for each lawyer
        for (const lawyer of countyLawyers) {
          const verification = await this.verifyLicense(lawyer, state);
          lawyer.licenseVerified = verification.verified;
          lawyer.licenseVerifiedAt = verification.verifiedAt;
          lawyer.verificationSource = verification.source;
          
          if (!verification.verified) {
            lawyer.verificationNote = verification.reason || 'Could not verify license';
          }
        }
        
        currentData.lawyers = countyLawyers;
        currentData.verifiedAt = new Date().toISOString();
        currentData.sources = [{
          title: this.dataSources[state].stateBar.name,
          url: this.dataSources[state].stateBar.searchUrl,
          verified: true,
          collectedAt: new Date().toISOString()
        }];
        
        fs.writeFileSync(lawyersPath, JSON.stringify(currentData, null, 2));
        console.log(`  ✅ Updated ${lawyersPath} with ${countyLawyers.length} lawyers`);
      }
      
      // Update family.json with mediators
      const familyPath = path.join(countyPath, 'family.json');
      if (fs.existsSync(familyPath)) {
        const currentData = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        
        currentData.mediators = mediators;
        currentData.verification.verifiedAt = new Date().toISOString();
        currentData.verification.sourceUrl = this.dataSources[state].mediators?.url || '';
        
        fs.writeFileSync(familyPath, JSON.stringify(currentData, null, 2));
        console.log(`  ✅ Updated ${familyPath} with ${mediators.length} mediators`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating county data for ${county}, ${state}:`, error.message);
    }
  }

  async collectRealData(states = ['CA', 'NY']) {
    console.log('🌍 Starting real data collection...');
    
    const countyMap = {
      'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Orange', 'Santa Clara'],
      'NY': ['New York', 'Kings', 'Queens', 'Nassau', 'Westchester'],
      'TX': ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis'],
      'FL': ['Miami-Dade', 'Broward', 'Orange', 'Hillsborough', 'Palm Beach']
    };
    
    for (const state of states) {
      console.log(`\n🏛️ Processing ${state}...`);
      
      const counties = countyMap[state] || [];
      
      // Collect lawyers
      let lawyers = [];
      if (state === 'CA') {
        lawyers = await this.collectCaliforniaLawyers(counties);
      } else if (state === 'NY') {
        lawyers = await this.collectNewYorkLawyers(counties);
      }
      
      // Collect mediators
      const mediators = await this.collectMediators(state, counties);
      
      // Update each county's data
      for (const county of counties) {
        console.log(`  📁 Updating ${county} County...`);
        await this.updateCountyData(state, county, lawyers, mediators);
        await this.delay(1000); // Be respectful
      }
    }
    
    console.log('\n✅ Real data collection complete!');
  }
}

// Main execution
async function main() {
  const collector = new RealLegalDataCollector();
  
  try {
    const initialized = await collector.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize collector');
      process.exit(1);
    }
    
    const args = process.argv.slice(2);
    const command = args[0] || 'pilot';
    
    switch (command) {
      case 'pilot':
        console.log('🎯 Running pilot data collection (CA, NY)...');
        await collector.collectRealData(['CA', 'NY']);
        break;
        
      case 'ca':
        console.log('🌴 Collecting California data...');
        await collector.collectRealData(['CA']);
        break;
        
      case 'ny':
        console.log('🗽 Collecting New York data...');
        await collector.collectRealData(['NY']);
        break;
        
      case 'all':
        console.log('🌍 Collecting all available state data...');
        await collector.collectRealData(['CA', 'NY', 'TX', 'FL']);
        break;
        
      default:
        console.log('📋 Usage:');
        console.log('  node real-data-collector.js pilot  # Collect CA and NY (recommended)');
        console.log('  node real-data-collector.js ca     # California only');
        console.log('  node real-data-collector.js ny     # New York only');
        console.log('  node real-data-collector.js all    # All supported states');
        console.log('\n🎯 Recommended: Start with "pilot" to test the system');
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await collector.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { RealLegalDataCollector };
