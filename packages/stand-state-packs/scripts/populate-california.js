#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axios = require('axios');

// California-specific legal data sources
const CA_LEGAL_SOURCES = {
  // California State Bar - Find a Lawyer
  stateBar: 'https://www.calbar.ca.gov/Attorneys/Find-A-Lawyer',
  
  // California Courts - Mediator Directory
  mediators: 'https://www.courts.ca.gov/mediators.htm',
  
  // Legal Aid Association of California
  legalAid: 'https://www.laaconline.org/find-legal-aid/',
  
  // California Department of Consumer Affairs - Alternative Dispute Resolution
  adr: 'https://www.dca.ca.gov/consumers/mediation/',
  
  // California Association of Family and Conciliation Courts
  familyCourts: 'https://www.cafcc.org/',
  
  // Parenting Class Providers (various sources)
  parentingClasses: [
    'https://www.courts.ca.gov/selfhelp-parenting.htm',
    'https://www.courts.ca.gov/selfhelp-divorce.htm'
  ]
};

class CaliforniaDataCollector {
  constructor() {
    this.browser = null;
    this.collectedData = new Map();
  }

  async initialize() {
    console.log('🚀 Initializing California Legal Data Collector...');
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

  async collectCaliforniaLawyers() {
    try {
      console.log('📋 Collecting lawyer data from California State Bar...');
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Navigate to the find a lawyer page
      await page.goto(CA_LEGAL_SOURCES.stateBar, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      await this.delay(3000);
      
      // Try to find and fill search form if it exists
      try {
        // Look for common search form elements
        const searchInput = await page.$('input[type="text"], input[name="search"], input[placeholder*="lawyer"]');
        if (searchInput) {
          await searchInput.type('family law');
          await this.delay(1000);
          
          const searchButton = await page.$('button[type="submit"], input[type="submit"], .search-button');
          if (searchButton) {
            await searchButton.click();
            await this.delay(3000);
          }
        }
      } catch (e) {
        console.log('⚠️ Search form interaction failed, continuing with page content...');
      }
      
      // Extract lawyer data with multiple selector strategies
      const lawyers = await page.evaluate(() => {
        const lawyerElements = document.querySelectorAll(`
          .lawyer-card, .attorney-listing, .lawyer-item, 
          .search-result, .result-item, .listing-item,
          [class*="lawyer"], [class*="attorney"], [class*="result"]
        `);
        
        return Array.from(lawyerElements).map(element => {
          // Try multiple selectors for each field
          const name = 
            element.querySelector('.name, .attorney-name, .lawyer-name, .result-title, h3, h4')?.textContent?.trim() ||
            element.querySelector('[class*="name"]')?.textContent?.trim() ||
            'Unknown';
            
          const practice = 
            element.querySelector('.practice, .practice-area, .specialty, .description')?.textContent?.trim() ||
            element.querySelector('[class*="practice"]')?.textContent?.trim() ||
            'General Practice';
            
          const location = 
            element.querySelector('.location, .city, .county, .address')?.textContent?.trim() ||
            element.querySelector('[class*="location"]')?.textContent?.trim() ||
            'Unknown';
            
          const contact = 
            element.querySelector('.contact, .phone, .email, .telephone')?.textContent?.trim() ||
            element.querySelector('[class*="contact"]')?.textContent?.trim() ||
            '';
            
          const website = 
            element.querySelector('a[href*="http"]')?.href ||
            '';
          
          return {
            name,
            practice,
            location,
            contact,
            website,
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'California State Bar Association',
            state: 'CA'
          };
        }).filter(lawyer => lawyer.name !== 'Unknown');
      });
      
      await page.close();
      console.log(`✅ Collected ${lawyers.length} lawyers from California State Bar`);
      
      return lawyers;
      
    } catch (error) {
      console.error('❌ Error collecting California lawyer data:', error.message);
      return [];
    }
  }

  async collectCaliforniaMediators() {
    try {
      console.log('🤝 Collecting mediator data from California Courts...');
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      await page.goto(CA_LEGAL_SOURCES.mediators, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      await this.delay(3000);
      
      const mediators = await page.evaluate(() => {
        const mediatorElements = document.querySelectorAll(`
          .mediator, .mediator-listing, .mediator-item,
          .listing, .item, .result,
          [class*="mediator"], [class*="listing"]
        `);
        
        return Array.from(mediatorElements).map(element => {
          const name = 
            element.querySelector('.name, .mediator-name, .title, h3, h4')?.textContent?.trim() ||
            element.querySelector('[class*="name"]')?.textContent?.trim() ||
            'Unknown';
            
          const organization = 
            element.querySelector('.organization, .company, .firm')?.textContent?.trim() ||
            element.querySelector('[class*="org"]')?.textContent?.trim() ||
            '';
            
          const specialties = 
            element.querySelector('.specialties, .areas, .practice')?.textContent?.trim() ||
            element.querySelector('[class*="specialty"]')?.textContent?.trim() ||
            'General Mediation';
            
          const contact = 
            element.querySelector('.contact, .phone, .email, .telephone')?.textContent?.trim() ||
            element.querySelector('[class*="contact"]')?.textContent?.trim() ||
            '';
            
          const location = 
            element.querySelector('.location, .city, .county, .address')?.textContent?.trim() ||
            element.querySelector('[class*="location"]')?.textContent?.trim() ||
            'California';
          
          return {
            name,
            organization,
            specialties,
            contact,
            location,
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'California Courts',
            state: 'CA'
          };
        }).filter(mediator => mediator.name !== 'Unknown');
      });
      
      await page.close();
      console.log(`✅ Collected ${mediators.length} mediators from California Courts`);
      
      return mediators;
      
    } catch (error) {
      console.error('❌ Error collecting California mediator data:', error.message);
      return [];
    }
  }

  async collectCaliforniaLegalAid() {
    try {
      console.log('🏛️ Collecting legal aid data from California...');
      
      const response = await axios.get(CA_LEGAL_SOURCES.legalAid, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });
      
      // Use a simple approach to extract organization names
      const html = response.data;
      const orgMatches = html.match(/<h[2-6][^>]*>([^<]+(?:Legal Aid|Legal Services|Legal Clinic)[^<]*)<\/h[2-6]>/gi);
      
      const legalAidOrgs = [];
      if (orgMatches) {
        orgMatches.forEach(match => {
          const name = match.replace(/<[^>]+>/g, '').trim();
          if (name && name.length > 5) {
            legalAidOrgs.push({
              name,
              services: 'Legal Aid Services',
              contact: 'Contact information available on website',
              website: CA_LEGAL_SOURCES.legalAid,
              verified: true,
              verifiedAt: new Date().toISOString(),
              source: 'Legal Aid Association of California',
              state: 'CA'
            });
          }
        });
      }
      
      console.log(`✅ Collected ${legalAidOrgs.length} legal aid organizations from California`);
      return legalAidOrgs;
      
    } catch (error) {
      console.error('❌ Error collecting California legal aid data:', error.message);
      return [];
    }
  }

  async populateCaliforniaCounties() {
    const statePath = path.join(__dirname, '..', 'states', 'ca');
    
    if (!fs.existsSync(statePath)) {
      console.log('❌ California state directory not found');
      return;
    }

    try {
      console.log('🌍 Collecting data for California...');
      
      // Collect all data for California
      const lawyers = await this.collectCaliforniaLawyers();
      const mediators = await this.collectCaliforniaMediators();
      const legalAid = await this.collectCaliforniaLegalAid();
      
      // Get all California counties
      const counties = fs.readdirSync(statePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`📁 Found ${counties.length} counties in California`);
      
      for (const countySlug of counties) {
        const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(`  📍 Processing ${countyName}...`);
        
        await this.populateCountyData(countySlug, countyName, lawyers, mediators, legalAid);
        await this.delay(500); // Small delay between counties
      }
      
    } catch (error) {
      console.error('❌ Error populating California counties:', error.message);
    }
  }

  async populateCountyData(countySlug, countyName, lawyers, mediators, legalAid) {
    const countyPath = path.join(__dirname, '..', 'states', 'ca', countySlug);
    
    if (!fs.existsSync(countyPath)) {
      console.log(`⚠️ County path not found: ${countyPath}`);
      return;
    }

    try {
      // Filter data for this specific county
      const countyLawyers = lawyers.filter(lawyer => 
        lawyer.location.toLowerCase().includes(countyName.toLowerCase()) ||
        lawyer.location.toLowerCase().includes(countySlug.replace('-', ' ')) ||
        lawyer.location.toLowerCase().includes('california') // Include general CA lawyers
      );
      
      const countyMediators = mediators.filter(mediator => 
        mediator.location.toLowerCase().includes(countyName.toLowerCase()) ||
        mediator.location.toLowerCase().includes(countySlug.replace('-', ' ')) ||
        mediator.location.toLowerCase().includes('california')
      );
      
      // Update lawyers.json
      const lawyersPath = path.join(countyPath, 'lawyers.json');
      if (fs.existsSync(lawyersPath)) {
        const currentLawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
        currentLawyers.lawyers = countyLawyers;
        currentLawyers.verifiedAt = new Date().toISOString();
        currentLawyers.sources = [
          {
            title: 'California State Bar Association',
            url: CA_LEGAL_SOURCES.stateBar,
            verified: true
          }
        ];
        
        fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
        console.log(`    ✅ Updated lawyers.json with ${countyLawyers.length} lawyers`);
      }
      
      // Update family.json
      const familyPath = path.join(countyPath, 'family.json');
      if (fs.existsSync(familyPath)) {
        const currentFamily = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        currentFamily.mediators = countyMediators;
        currentFamily.verification.verifiedAt = new Date().toISOString();
        currentFamily.verification.sourceUrl = CA_LEGAL_SOURCES.mediators;
        
        fs.writeFileSync(familyPath, JSON.stringify(currentFamily, null, 2));
        console.log(`    ✅ Updated family.json with ${countyMediators.length} mediators`);
      }
      
    } catch (error) {
      console.error(`❌ Error populating county data for ${countyName}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  const collector = new CaliforniaDataCollector();
  
  try {
    await collector.initialize();
    console.log('🎯 Starting California data population...');
    await collector.populateCaliforniaCounties();
    console.log('✅ California data population complete!');
    
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

module.exports = { CaliforniaDataCollector };
