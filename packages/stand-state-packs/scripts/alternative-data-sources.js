#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Alternative data sources that don't require scraping
const ALTERNATIVE_DATA_SOURCES = {
  // Public Legal APIs
  publicAPIs: {
    // ABA Lawyer Directory (if available)
    aba: 'https://www.americanbar.org/groups/legal_services/flh-home/',
    
    // Legal Services Corporation - Public Data
    lsc: 'https://www.lsc.gov/what-legal-aid/legal-aid-directory',
    
    // State Bar Public Directories (downloadable)
    stateBars: {
      'CA': 'https://www.calbar.ca.gov/Attorneys/Find-A-Lawyer',
      'NY': 'https://www.nysba.org/find-a-lawyer/',
      'TX': 'https://www.texasbar.com/find-a-lawyer/',
      'FL': 'https://www.floridabar.org/find-a-lawyer/'
    }
  },
  
  // Downloadable Legal Directories
  downloadableSources: {
    // Martindale-Hubbell (if we can get access)
    martindale: 'https://www.martindale.com/',
    
    // Avvo (if we can get access)
    avvo: 'https://www.avvo.com/',
    
    // State-specific downloadable directories
    stateDirectories: {
      'CA': 'https://www.calbar.ca.gov/Attorneys/Find-A-Lawyer',
      'NY': 'https://www.nysba.org/find-a-lawyer/',
      'TX': 'https://www.texasbar.com/find-a-lawyer/'
    }
  },
  
  // Legal Aid Directories
  legalAidSources: {
    // National Legal Aid Directory
    national: 'https://www.lsc.gov/what-legal-aid/legal-aid-directory',
    
    // State-specific legal aid
    stateAid: {
      'CA': 'https://www.laaconline.org/',
      'NY': 'https://www.legalaidnyc.org/',
      'TX': 'https://www.texaslawhelp.org/',
      'FL': 'https://www.floridalegal.org/'
    }
  }
};

class AlternativeDataCollector {
  constructor() {
    this.collectedData = new Map();
  }

  async checkDataSourceAvailability() {
    console.log('🔍 Checking alternative data source availability...');
    
    const results = {
      publicAPIs: {},
      downloadableSources: {},
      legalAidSources: {}
    };

    // Test public API endpoints
    for (const [name, url] of Object.entries(ALTERNATIVE_DATA_SOURCES.publicAPIs)) {
      try {
        console.log(`📡 Testing ${name}: ${url}`);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        results.publicAPIs[name] = {
          available: true,
          status: response.status,
          contentType: response.headers['content-type'],
          size: response.data.length
        };
        
        console.log(`✅ ${name}: Available (${response.status})`);
      } catch (error) {
        results.publicAPIs[name] = {
          available: false,
          error: error.message,
          status: error.response?.status
        };
        console.log(`❌ ${name}: Not available (${error.message})`);
      }
    }

    // Test legal aid sources
    for (const [state, url] of Object.entries(ALTERNATIVE_DATA_SOURCES.legalAidSources.stateAid)) {
      try {
        console.log(`🏛️ Testing ${state} Legal Aid: ${url}`);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        results.legalAidSources[state] = {
          available: true,
          status: response.status,
          contentType: response.headers['content-type']
        };
        
        console.log(`✅ ${state} Legal Aid: Available (${response.status})`);
      } catch (error) {
        results.legalAidSources[state] = {
          available: false,
          error: error.message,
          status: error.response?.status
        };
        console.log(`❌ ${state} Legal Aid: Not available (${error.message})`);
      }
    }

    return results;
  }

  async generateSampleData() {
    console.log('📝 Generating sample legal data for testing...');
    
    const sampleLawyers = [
      {
        name: "Sarah Johnson, Esq.",
        practice: "Family Law, Divorce, Custody",
        location: "Los Angeles, CA",
        contact: "(213) 555-0123",
        website: "https://www.sarahjohnsonlaw.com",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      },
      {
        name: "Michael Chen, Attorney at Law",
        practice: "Family Law, Mediation",
        location: "San Francisco, CA",
        contact: "(415) 555-0456",
        website: "https://www.chenlawgroup.com",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      },
      {
        name: "Dr. Emily Rodriguez",
        practice: "Family Mediation, Parenting Plans",
        location: "San Diego, CA",
        contact: "(619) 555-0789",
        website: "https://www.rodriguezmediation.com",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      }
    ];

    const sampleMediators = [
      {
        name: "Dr. Robert Wilson",
        organization: "Peaceful Resolutions",
        specialties: "Family Mediation, Divorce, Custody",
        contact: "(310) 555-0321",
        location: "Los Angeles, CA",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      },
      {
        name: "Lisa Thompson",
        organization: "Harmony Mediation Services",
        specialties: "Parenting Plans, Co-Parenting",
        contact: "(408) 555-0654",
        location: "San Jose, CA",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      }
    ];

    const sampleLegalAid = [
      {
        name: "California Legal Aid Foundation",
        services: "Family Law, Housing, Employment, Immigration",
        contact: "(800) 555-0123",
        website: "https://www.californialegalaid.org",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      },
      {
        name: "Los Angeles Legal Services",
        services: "Family Law, Domestic Violence, Child Support",
        contact: "(213) 555-0456",
        website: "https://www.lalegalservices.org",
        verified: true,
        verifiedAt: new Date().toISOString(),
        source: "Sample Data - Replace with Real Source",
        state: "CA"
      }
    ];

    return { sampleLawyers, sampleMediators, sampleLegalAid };
  }

  async populateWithSampleData() {
    console.log('🚀 Populating counties with sample data...');
    
    const { sampleLawyers, sampleMediators, sampleLegalAid } = await this.generateSampleData();
    
    // Start with California
    const statePath = path.join(__dirname, '..', 'states', 'ca');
    
    if (!fs.existsSync(statePath)) {
      console.log('❌ California state directory not found');
      return;
    }

    const counties = fs.readdirSync(statePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`📁 Found ${counties.length} counties in California`);
    
    for (const countySlug of counties) {
      const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`  📍 Processing ${countyName}...`);
      
      await this.populateCountyWithSampleData(countySlug, countyName, sampleLawyers, sampleMediators, sampleLegalAid);
    }
    
    console.log('✅ Sample data population complete!');
  }

  async populateCountyWithSampleData(countySlug, countyName, lawyers, mediators, legalAid) {
    const countyPath = path.join(__dirname, '..', 'states', 'ca', countySlug);
    
    if (!fs.existsSync(countyPath)) {
      console.log(`⚠️ County path not found: ${countyPath}`);
      return;
    }

    try {
      // Update lawyers.json
      const lawyersPath = path.join(countyPath, 'lawyers.json');
      if (fs.existsSync(lawyersPath)) {
        const currentLawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
        currentLawyers.lawyers = lawyers;
        currentLawyers.verifiedAt = new Date().toISOString();
        currentLawyers.sources = [
          {
            title: 'Sample Data - Replace with Real Source',
            url: 'https://example.com/sample-data',
            verified: false,
            note: 'This is sample data for testing. Replace with real verified data.'
          }
        ];
        
        fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
        console.log(`    ✅ Updated lawyers.json with ${lawyers.length} sample lawyers`);
      }
      
      // Update family.json
      const familyPath = path.join(countyPath, 'family.json');
      if (fs.existsSync(familyPath)) {
        const currentFamily = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        currentFamily.mediators = mediators;
        currentFamily.verification.verifiedAt = new Date().toISOString();
        currentFamily.verification.sourceUrl = 'https://example.com/sample-data';
        
        fs.writeFileSync(familyPath, JSON.stringify(currentFamily, null, 2));
        console.log(`    ✅ Updated family.json with ${mediators.length} sample mediators`);
      }
      
    } catch (error) {
      console.error(`❌ Error populating sample data for ${countyName}:`, error.message);
    }
  }

  async generateDataCollectionPlan() {
    console.log('\n📋 Generating Data Collection Action Plan...');
    
    const plan = {
      immediate: [
        "1. Use sample data for development and testing",
        "2. Research current legal directory APIs",
        "3. Contact state bar associations for data access",
        "4. Explore legal aid organization partnerships"
      ],
      shortTerm: [
        "1. Implement data import from CSV/Excel files",
        "2. Create admin interface for manual data entry",
        "3. Set up community contribution system",
        "4. Partner with legal organizations for data sharing"
      ],
      longTerm: [
        "1. Develop automated data collection from APIs",
        "2. Implement data validation and quality checks",
        "3. Set up regular data updates and maintenance",
        "4. Create data partnership agreements"
      ]
    };

    console.log('\n🎯 IMMEDIATE ACTIONS:');
    plan.immediate.forEach(action => console.log(`   ${action}`));
    
    console.log('\n📅 SHORT TERM (1-2 weeks):');
    plan.shortTerm.forEach(action => console.log(`   ${action}`));
    
    console.log('\n🚀 LONG TERM (1-2 months):');
    plan.longTerm.forEach(action => console.log(`   ${action}`));

    return plan;
  }
}

// Main execution
async function main() {
  const collector = new AlternativeDataCollector();
  
  try {
    console.log('🚀 Alternative Data Collection System');
    console.log('=====================================\n');
    
    // Check what data sources are available
    const availability = await collector.checkDataSourceAvailability();
    
    // Generate sample data for immediate use
    await collector.populateWithSampleData();
    
    // Generate action plan
    await collector.generateDataCollectionPlan();
    
    console.log('\n✅ Alternative data collection complete!');
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Use the sample data for development');
    console.log('2. Research real data sources');
    console.log('3. Implement data import tools');
    console.log('4. Set up partnerships with legal organizations');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { AlternativeDataCollector };
