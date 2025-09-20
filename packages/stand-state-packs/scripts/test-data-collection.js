#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test data collection system without actually scraping
class TestDataCollector {
  constructor() {
    this.testData = {
      lawyers: [
        {
          name: "John Smith, Esq.",
          practice: "Family Law",
          location: "Los Angeles, CA",
          contact: "(555) 123-4567",
          website: "https://example.com",
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: "Test Data",
          state: "CA"
        },
        {
          name: "Jane Doe, Attorney at Law",
          practice: "Divorce & Custody",
          location: "San Diego, CA",
          contact: "(555) 987-6543",
          website: "https://example.com",
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: "Test Data",
          state: "CA"
        }
      ],
      mediators: [
        {
          name: "Dr. Robert Johnson",
          organization: "Peaceful Resolutions",
          specialties: "Family Mediation, Divorce",
          contact: "(555) 111-2222",
          location: "California",
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: "Test Data",
          state: "CA"
        },
        {
          name: "Sarah Wilson",
          organization: "Harmony Mediation Services",
          specialties: "Parenting Plans, Custody",
          contact: "(555) 333-4444",
          location: "California",
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: "Test Data",
          state: "CA"
        }
      ],
      legalAid: [
        {
          name: "California Legal Aid Foundation",
          services: "Family Law, Housing, Employment",
          contact: "(555) 555-5555",
          website: "https://example.org",
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: "Test Data",
          state: "CA"
        }
      ]
    };
  }

  async populateTestData() {
    console.log('🧪 Running test data population...');
    
    // Test with California counties
    const statePath = path.join(__dirname, '..', 'states', 'ca');
    
    if (!fs.existsSync(statePath)) {
      console.log('❌ California state directory not found');
      return;
    }

    const counties = fs.readdirSync(statePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .slice(0, 3); // Only test first 3 counties
    
    console.log(`📁 Testing with ${counties.length} counties: ${counties.join(', ')}`);
    
    for (const countySlug of counties) {
      const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`  📍 Testing ${countyName}...`);
      
      await this.populateCountyTestData(countySlug, countyName);
    }
    
    console.log('✅ Test data population complete!');
  }

  async populateCountyTestData(countySlug, countyName) {
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
        currentLawyers.lawyers = this.testData.lawyers;
        currentLawyers.verifiedAt = new Date().toISOString();
        currentLawyers.sources = [
          {
            title: 'Test Data Source',
            url: 'https://example.com/test',
            verified: true
          }
        ];
        
        fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
        console.log(`    ✅ Updated lawyers.json with ${this.testData.lawyers.length} test lawyers`);
      }
      
      // Update family.json
      const familyPath = path.join(countyPath, 'family.json');
      if (fs.existsSync(familyPath)) {
        const currentFamily = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        currentFamily.mediators = this.testData.mediators;
        currentFamily.verification.verifiedAt = new Date().toISOString();
        currentFamily.verification.sourceUrl = 'https://example.com/test';
        
        fs.writeFileSync(familyPath, JSON.stringify(currentFamily, null, 2));
        console.log(`    ✅ Updated family.json with ${this.testData.mediators.length} test mediators`);
      }
      
    } catch (error) {
      console.error(`❌ Error populating test data for ${countyName}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  const collector = new TestDataCollector();
  
  try {
    console.log('🧪 Starting test data population...');
    await collector.populateTestData();
    console.log('✅ Test complete! Check the updated files in the states directory.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TestDataCollector };
