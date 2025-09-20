#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Data Import System - Multiple input methods
class DataImportSystem {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async close() {
    this.rl.close();
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async generateCSVTemplate() {
    console.log('📋 Generating CSV templates for data import...');
    
    const templates = {
      lawyers: `name,practice,location,contact,website,state,county
"John Smith, Esq.","Family Law","Los Angeles, CA","(213) 555-0123","https://example.com","CA","Los Angeles"
"Jane Doe, Attorney","Divorce & Custody","San Diego, CA","(619) 555-0456","https://example.com","CA","San Diego"`,
      
      mediators: `name,organization,specialties,contact,location,state,county
"Dr. Robert Wilson","Peaceful Resolutions","Family Mediation","(310) 555-0321","Los Angeles, CA","CA","Los Angeles"
"Sarah Thompson","Harmony Mediation","Parenting Plans","(408) 555-0654","San Jose, CA","CA","Santa Clara"`,
      
      legalAid: `name,services,contact,website,state,county
"California Legal Aid","Family Law, Housing","(800) 555-0123","https://example.org","CA","Los Angeles"
"LA Legal Services","Domestic Violence","(213) 555-0456","https://example.org","CA","Los Angeles"`
    };

    // Create templates directory
    const templatesDir = path.join(__dirname, '..', 'templates');
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    // Write template files
    for (const [type, content] of Object.entries(templates)) {
      const filePath = path.join(templatesDir, `${type}-template.csv`);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created ${type}-template.csv`);
    }

    console.log('\n📁 CSV templates created in packages/stand-state-packs/templates/');
    console.log('💡 Instructions:');
    console.log('1. Fill in the CSV files with real data');
    console.log('2. Use the import commands to load the data');
    console.log('3. Data will be automatically distributed to counties');
  }

  async importFromCSV(csvPath, dataType) {
    console.log(`📥 Importing ${dataType} from CSV: ${csvPath}`);
    
    if (!fs.existsSync(csvPath)) {
      console.log(`❌ CSV file not found: ${csvPath}`);
      return;
    }

    try {
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
        const item = {};
        
        headers.forEach((header, index) => {
          item[header] = values[index] || '';
        });
        
        // Add metadata
        item.verified = true;
        item.verifiedAt = new Date().toISOString();
        item.source = 'CSV Import';
        
        data.push(item);
      }
      
      console.log(`✅ Imported ${data.length} ${dataType} records`);
      return data;
      
    } catch (error) {
      console.error(`❌ Error importing CSV:`, error.message);
      return [];
    }
  }

  async distributeDataToCounties(data, dataType, stateCode) {
    console.log(`🌍 Distributing ${dataType} data to ${stateCode} counties...`);
    
    const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
    if (!fs.existsSync(statePath)) {
      console.log(`❌ State directory not found: ${statePath}`);
      return;
    }

    const counties = fs.readdirSync(statePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`📁 Found ${counties.length} counties in ${stateCode}`);
    
    for (const countySlug of counties) {
      const countyName = countySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`  📍 Processing ${countyName}...`);
      
      await this.updateCountyFile(countySlug, countyName, data, dataType, stateCode);
    }
  }

  async updateCountyFile(countySlug, countyName, data, dataType, stateCode) {
    const countyPath = path.join(__dirname, '..', 'states', stateCode.toLowerCase(), countySlug);
    
    if (!fs.existsSync(countyPath)) {
      console.log(`⚠️ County path not found: ${countyPath}`);
      return;
    }

    try {
      if (dataType === 'lawyers') {
        const lawyersPath = path.join(countyPath, 'lawyers.json');
        if (fs.existsSync(lawyersPath)) {
          const currentLawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
          
          // Filter data for this county
          const countyData = data.filter(item => 
            item.county && item.county.toLowerCase().includes(countyName.toLowerCase())
          );
          
          currentLawyers.lawyers = countyData;
          currentLawyers.verifiedAt = new Date().toISOString();
          currentLawyers.sources = [
            {
              title: 'CSV Import',
              url: 'csv-import',
              verified: true
            }
          ];
          
          fs.writeFileSync(lawyersPath, JSON.stringify(currentLawyers, null, 2));
          console.log(`    ✅ Updated lawyers.json with ${countyData.length} lawyers`);
        }
      } else if (dataType === 'mediators') {
        const familyPath = path.join(countyPath, 'family.json');
        if (fs.existsSync(familyPath)) {
          const currentFamily = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
          
          // Filter data for this county
          const countyData = data.filter(item => 
            item.county && item.county.toLowerCase().includes(countyName.toLowerCase())
          );
          
          currentFamily.mediators = countyData;
          currentFamily.verification.verifiedAt = new Date().toISOString();
          currentFamily.verification.sourceUrl = 'csv-import';
          
          fs.writeFileSync(familyPath, JSON.stringify(currentFamily, null, 2));
          console.log(`    ✅ Updated family.json with ${countyData.length} mediators`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error updating county file for ${countyName}:`, error.message);
    }
  }

  async interactiveDataEntry() {
    console.log('⌨️ Interactive Data Entry Mode');
    console.log('==============================\n');
    
    const dataType = await this.question('What type of data? (lawyers/mediators/legal-aid): ');
    const stateCode = await this.question('State code (e.g., CA, NY, TX): ').toUpperCase();
    
    console.log(`\n📝 Enter ${dataType} data for ${stateCode}. Type 'done' when finished.\n`);
    
    const data = [];
    let count = 1;
    
    while (true) {
      console.log(`\n--- Entry ${count} ---`);
      
      if (dataType === 'lawyers') {
        const name = await this.question('Name: ');
        if (name.toLowerCase() === 'done') break;
        
        const practice = await this.question('Practice areas: ');
        const location = await this.question('Location: ');
        const contact = await this.question('Contact: ');
        const website = await this.question('Website (optional): ');
        const county = await this.question('County: ');
        
        data.push({
          name,
          practice,
          location,
          contact,
          website,
          state: stateCode,
          county,
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: 'Interactive Entry'
        });
        
      } else if (dataType === 'mediators') {
        const name = await this.question('Name: ');
        if (name.toLowerCase() === 'done') break;
        
        const organization = await this.question('Organization: ');
        const specialties = await this.question('Specialties: ');
        const contact = await this.question('Contact: ');
        const location = await this.question('Location: ');
        const county = await this.question('County: ');
        
        data.push({
          name,
          organization,
          specialties,
          contact,
          location,
          state: stateCode,
          county,
          verified: true,
          verifiedAt: new Date().toISOString(),
          source: 'Interactive Entry'
        });
      }
      
      count++;
    }
    
    if (data.length > 0) {
      console.log(`\n✅ Collected ${data.length} entries`);
      
      const distribute = await this.question('Distribute to counties? (y/n): ');
      if (distribute.toLowerCase() === 'y') {
        await this.distributeDataToCounties(data, dataType, stateCode);
      }
    }
    
    return data;
  }

  async bulkDataEntry() {
    console.log('📊 Bulk Data Entry Mode');
    console.log('========================\n');
    
    const stateCode = await this.question('State code (e.g., CA, NY, TX): ').toUpperCase();
    const dataType = await this.question('Data type (lawyers/mediators): ');
    
    console.log(`\n📝 Enter ${dataType} data for ${stateCode}.`);
    console.log('Format: name|practice|location|contact|county');
    console.log('Example: John Smith|Family Law|Los Angeles|(213) 555-0123|Los Angeles');
    console.log('Type "done" when finished.\n');
    
    const data = [];
    let count = 1;
    
    while (true) {
      const input = await this.question(`Entry ${count}: `);
      if (input.toLowerCase() === 'done') break;
      
      const parts = input.split('|');
      if (parts.length >= 4) {
        if (dataType === 'lawyers') {
          data.push({
            name: parts[0].trim(),
            practice: parts[1].trim(),
            location: parts[2].trim(),
            contact: parts[3].trim(),
            county: parts[4]?.trim() || '',
            state: stateCode,
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'Bulk Entry'
          });
        } else if (dataType === 'mediators') {
          data.push({
            name: parts[0].trim(),
            organization: parts[1].trim(),
            specialties: parts[2].trim(),
            contact: parts[3].trim(),
            location: parts[2].trim(),
            county: parts[4]?.trim() || '',
            state: stateCode,
            verified: true,
            verifiedAt: new Date().toISOString(),
            source: 'Bulk Entry'
          });
        }
        count++;
      } else {
        console.log('❌ Invalid format. Use: name|practice|location|contact|county');
      }
    }
    
    if (data.length > 0) {
      console.log(`\n✅ Collected ${data.length} entries`);
      await this.distributeDataToCounties(data, dataType, stateCode);
    }
    
    return data;
  }

  async showMenu() {
    console.log('\n🚀 Data Import System');
    console.log('=====================\n');
    
    console.log('1. Generate CSV templates');
    console.log('2. Import from CSV file');
    console.log('3. Interactive data entry');
    console.log('4. Bulk data entry');
    console.log('5. Exit');
    
    const choice = await this.question('\nSelect option (1-5): ');
    
    switch (choice) {
      case '1':
        await this.generateCSVTemplate();
        break;
        
      case '2':
        const csvPath = await this.question('CSV file path: ');
        const dataType = await this.question('Data type (lawyers/mediators): ');
        const stateCode = await this.question('State code: ').toUpperCase();
        
        const data = await this.importFromCSV(csvPath, dataType);
        if (data.length > 0) {
          await this.distributeDataToCounties(data, dataType, stateCode);
        }
        break;
        
      case '3':
        await this.interactiveDataEntry();
        break;
        
      case '4':
        await this.bulkDataEntry();
        break;
        
      case '5':
        console.log('👋 Goodbye!');
        return;
        
      default:
        console.log('❌ Invalid option');
    }
    
    // Show menu again
    await this.showMenu();
  }
}

// Main execution
async function main() {
  const importSystem = new DataImportSystem();
  
  try {
    console.log('🚀 Data Import System for Kingdom Stand');
    console.log('========================================\n');
    
    await importSystem.showMenu();
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await importSystem.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DataImportSystem };
