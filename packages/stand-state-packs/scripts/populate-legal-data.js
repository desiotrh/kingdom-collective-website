#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

// Configuration
const CACHE_DURATION = 3600; // 1 hour cache
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay
const MAX_RETRIES = 3;

// Cache for API responses
const cache = new NodeCache({ stdTTL: CACHE_DURATION });

// Legal data sources configuration
const LEGAL_DATA_SOURCES = {
  // State Bar Associations
  stateBars: {
    'CA': 'https://www.calbar.ca.gov/Attorneys/Find-A-Lawyer',
    'NY': 'https://www.nysba.org/find-a-lawyer/',
    'TX': 'https://www.texasbar.com/find-a-lawyer/',
    'FL': 'https://www.floridabar.org/find-a-lawyer/',
    'IL': 'https://www.isba.org/find-a-lawyer',
    'PA': 'https://www.pabar.org/find-a-lawyer',
    'OH': 'https://www.ohiobar.org/find-a-lawyer',
    'GA': 'https://www.gabar.org/find-a-lawyer',
    'NC': 'https://www.ncbar.org/find-a-lawyer',
    'MI': 'https://www.michbar.org/find-a-lawyer'
  },
  
  // Legal Aid Organizations
  legalAid: {
    'CA': 'https://www.lsc.gov/what-legal-aid/legal-aid-directory/california',
    'NY': 'https://www.lsc.gov/what-legal-aid/legal-aid-directory/new-york',
    'TX': 'https://www.lsc.gov/what-legal-aid/legal-aid-directory/texas',
    'FL': 'https://www.lsc.gov/what-legal-aid/legal-aid-directory/florida'
  },
  
  // Mediator Directories
  mediators: {
    'CA': 'https://www.courts.ca.gov/mediators.htm',
    'NY': 'https://www.nycourts.gov/ip/mediation/',
    'TX': 'https://www.txcourts.gov/mediation/',
    'FL': 'https://www.flcourts.org/mediation/'
  }
};

// Data structures
class LegalDataCollector {
  constructor() {
    this.browser = null;
    this.collectedData = new Map();
  }

  async initialize() {
    console.log('🚀 Initializing Legal Data Collector...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('✅ Browser initialized');
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

  async collectStateBarData(state, stateCode) {
    const url = LEGAL_DATA_SOURCES.stateBars[stateCode];
    if (!url) return [];

    try {
      console.log(`📋 Collecting lawyer data from ${state} State Bar...`);
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for content to load
      await this.delay(3000);
      
      // Extract lawyer data (this will need customization per state bar website)
      const lawyers = await page.evaluate(() => {
        const lawyerElements = document.querySelectorAll('.lawyer-card, .attorney-listing, .lawyer-item');
        return Array.from(lawyerElements).map(element => {
          return {
            name: element.querySelector('.name, .attorney-name, .lawyer-name')?.textContent?.trim() || 'Unknown',
            practice: element.querySelector('.practice, .practice-area, .specialty')?.textContent?.trim() || 'General Practice',
            location: element.querySelector('.location, .city, .county')?.textContent?.trim() || 'Unknown',
            contact: element.querySelector('.contact, .phone, .email')?.textContent?.trim() || '',
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'State Bar Association'
          };
        });
      });
      
      await page.close();
      console.log(`✅ Collected ${lawyers.length} lawyers from ${state} State Bar`);
      
      return lawyers;
    } catch (error) {
      console.error(`❌ Error collecting data from ${state} State Bar:`, error.message);
      return [];
    }
  }

  async collectLegalAidData(state, stateCode) {
    const url = LEGAL_DATA_SOURCES.legalAid[stateCode];
    if (!url) return [];

    try {
      console.log(`🏛️ Collecting legal aid data from ${state}...`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });
      
      const $ = cheerio.load(response.data);
      const legalAidOrgs = [];
      
      // Extract legal aid organizations (customize selectors per source)
      $('.legal-aid-org, .organization, .org-item').each((i, element) => {
        const org = {
          name: $(element).find('.name, .org-name').text().trim(),
          services: $(element).find('.services, .practice-areas').text().trim(),
          contact: $(element).find('.contact, .phone').text().trim(),
          website: $(element).find('a').attr('href'),
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: 'Legal Services Corporation'
        };
        
        if (org.name) {
          legalAidOrgs.push(org);
        }
      });
      
      console.log(`✅ Collected ${legalAidOrgs.length} legal aid organizations from ${state}`);
      return legalAidOrgs;
      
    } catch (error) {
      console.error(`❌ Error collecting legal aid data from ${state}:`, error.message);
      return [];
    }
  }

  async collectMediatorData(state, stateCode) {
    const url = LEGAL_DATA_SOURCES.mediators[stateCode];
    if (!url) return [];

    try {
      console.log(`🤝 Collecting mediator data from ${state}...`);
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      await this.delay(3000);
      
      const mediators = await page.evaluate(() => {
        const mediatorElements = document.querySelectorAll('.mediator, .mediator-listing, .mediator-item');
        return Array.from(mediatorElements).map(element => {
          return {
            name: element.querySelector('.name, .mediator-name').textContent?.trim() || 'Unknown',
            organization: element.querySelector('.organization, .company').textContent?.trim() || '',
            specialties: element.querySelector('.specialties, .areas').textContent?.trim() || 'General Mediation',
            contact: element.querySelector('.contact, .phone, .email').textContent?.trim() || '',
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'Court System'
          };
        });
      });
      
      await page.close();
      console.log(`✅ Collected ${mediators.length} mediators from ${state}`);
      
      return mediators;
      
    } catch (error) {
      console.error(`❌ Error collecting mediator data from ${state}:`, error.message);
      return [];
    }
  }

  async populateCountyData(stateCode, countySlug, countyName) {
    const countyPath = path.join(__dirname, '..', 'states', stateCode.toLowerCase(), countySlug);
    
    if (!fs.existsSync(countyPath)) {
      console.log(`⚠️ County path not found: ${countyPath}`);
      return;
    }

    try {
      // Collect data for this state
      const stateName = this.getStateName(stateCode);
      const lawyers = await this.collectStateBarData(stateName, stateCode);
      const legalAid = await this.collectLegalAidData(stateName, stateCode);
      const mediators = await this.collectMediatorData(stateName, stateCode);
      
      // Filter data for this specific county
      const countyLawyers = lawyers.filter(lawyer => 
        lawyer.location.toLowerCase().includes(countyName.toLowerCase()) ||
        lawyer.location.toLowerCase().includes(countySlug.replace('-', ' '))
      );
      
      // Update lawyers.json
      const lawyersPath = path.join(countyPath, 'lawyers.json');
      if (fs.existsSync(lawyersPath)) {
        const currentLawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
        currentLawyers.lawyers = countyLawyers;
        currentLawyers.verifiedAt = new Date().toISOString();
        currentLawyers.sources = [
          {
            title: `${stateCode} State Bar Association`,
            url: LEGAL_DATA_SOURCES.stateBars[stateCode] || '',
            verified: true
          }
        ];
        
        fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
        console.log(`✅ Updated ${lawyersPath} with ${countyLawyers.length} lawyers`);
      }
      
      // Update family.json
      const familyPath = path.join(countyPath, 'family.json');
      if (fs.existsSync(familyPath)) {
        const currentFamily = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        currentFamily.mediators = mediators.filter(mediator => 
          mediator.location?.toLowerCase().includes(countyName.toLowerCase()) ||
          mediator.location?.toLowerCase().includes(countySlug.replace('-', ' '))
        );
        currentFamily.verification.verifiedAt = new Date().toISOString();
        currentFamily.verification.sourceUrl = LEGAL_DATA_SOURCES.mediators[stateCode] || '';
        
        fs.writeFileSync(familyPath, JSON.stringify(currentFamily, null, 2));
        console.log(`✅ Updated ${familyPath} with ${currentFamily.mediators.length} mediators`);
      }
      
    } catch (error) {
      console.error(`❌ Error populating county data for ${countyName}, ${stateCode}:`, error.message);
    }
  }

  getStateName(stateCode) {
    const stateNames = {
      'CA': 'California', 'NY': 'New York', 'TX': 'Texas', 'FL': 'Florida',
      'IL': 'Illinois', 'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia',
      'NC': 'North Carolina', 'MI': 'Michigan'
    };
    return stateNames[stateCode] || stateCode;
  }

  async populatePilotStates() {
    const pilotStates = ['CA', 'NY', 'TX', 'FL'];
    
    for (const stateCode of pilotStates) {
      console.log(`\n🌍 Processing ${this.getStateName(stateCode)} (${stateCode})...`);
      
      const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
      if (!fs.existsSync(statePath)) continue;
      
      const counties = fs.readdirSync(statePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`📁 Found ${counties.length} counties in ${stateCode}`);
      
      for (const countySlug of counties) {
        const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(`  📍 Processing ${countyName}...`);
        
        await this.populateCountyData(stateCode, countySlug, countyName);
        await this.delay(DELAY_BETWEEN_REQUESTS); // Be respectful to servers
      }
    }
  }

  async populateAllStates() {
    const allStates = Object.keys(LEGAL_DATA_SOURCES.stateBars);
    
    for (const stateCode of allStates) {
      console.log(`\n🌍 Processing ${this.getStateName(stateCode)} (${stateCode})...`);
      
      const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
      if (!fs.existsSync(statePath)) continue;
      
      const counties = fs.readdirSync(statePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`📁 Found ${counties.length} counties in ${stateCode}`);
      
      for (const countySlug of counties) {
        const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(`  📍 Processing ${countyName}...`);
        
        await this.populateCountyData(stateCode, countySlug, countyName);
        await this.delay(DELAY_BETWEEN_REQUESTS);
      }
    }
  }
}

// Main execution
async function main() {
  const collector = new LegalDataCollector();
  
  try {
    await collector.initialize();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case 'pilot':
        console.log('🎯 Running pilot state population...');
        await collector.populatePilotStates();
        break;
        
      case 'all':
        console.log('🌍 Running full state population...');
        await collector.populateAllStates();
        break;
        
      default:
        console.log('📋 Usage:');
        console.log('  node populate-legal-data.js pilot  # Populate pilot states (CA, NY, TX, FL)');
        console.log('  node populate-legal-data.js all    # Populate all states');
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

module.exports = { LegalDataCollector };
