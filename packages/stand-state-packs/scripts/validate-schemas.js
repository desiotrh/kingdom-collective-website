#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// JSON Schema validation
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Define schemas
const FAMILY_LAW_SCHEMA = {
  type: 'object',
  required: ['state', 'county', 'verification', 'mediators', 'parentingClasses', 'galDirectory'],
  properties: {
    state: {
      type: 'string',
      pattern: '^[A-Z]{2}$',
      description: 'Two-letter state code (e.g., CA, NY)'
    },
    county: {
      type: 'string',
      minLength: 1,
      description: 'County name'
    },
    verification: {
      type: 'object',
      required: ['verifiedAt', 'sourceUrl'],
      properties: {
        verifiedAt: {
          oneOf: [
            { type: 'null' },
            { type: 'string', format: 'date-time' }
          ],
          description: 'ISO timestamp when data was verified, or null if not verified'
        },
        sourceUrl: {
          type: 'string',
          format: 'uri',
          description: 'URL to the source of this data'
        }
      }
    },
    mediators: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'contact', 'type', 'onlineAvailability', 'slidingScale', 'courtApproved', 'lastVerified'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              website: { type: 'string', format: 'uri' }
            }
          },
          type: { type: 'string', enum: ['family', 'civil'] },
          onlineAvailability: { type: 'boolean' },
          slidingScale: { type: 'boolean' },
          courtApproved: { type: 'boolean' },
          officialRosterLink: { type: 'string', format: 'uri' },
          lastVerified: { type: 'string', format: 'date-time' }
        }
      }
    },
    parentingClasses: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'provider', 'contact', 'courtApproved', 'lastVerified'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          provider: { type: 'string', minLength: 1 },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              website: { type: 'string', format: 'uri' }
            }
          },
          courtApproved: { type: 'boolean' },
          registrationLink: { type: 'string', format: 'uri' },
          lastVerified: { type: 'string', format: 'date-time' }
        }
      }
    },
    galDirectory: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'contact', 'courtApproved', 'lastVerified'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              website: { type: 'string', format: 'uri' }
            }
          },
          courtApproved: { type: 'boolean' },
          officialRosterLink: { type: 'string', format: 'uri' },
          lastVerified: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
};

const LAWYER_DIRECTORY_SCHEMA = {
  type: 'object',
  required: ['state', 'county', 'verifiedAt', 'sources', 'lawyers'],
  properties: {
    state: {
      type: 'string',
      pattern: '^[A-Z]{2}$',
      description: 'Two-letter state code (e.g., CA, NY)'
    },
    county: {
      type: 'string',
      minLength: 1,
      description: 'County name'
    },
    verifiedAt: {
      oneOf: [
        { type: 'null' },
        { type: 'string', format: 'date-time' }
      ],
      description: 'ISO timestamp when data was verified, or null if not verified'
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'url', 'type'],
        properties: {
          name: { type: 'string', minLength: 1 },
          url: { type: 'string', format: 'uri' },
          type: { type: 'string', enum: ['state_bar', 'legal_aid', 'court_referral', 'other'] },
          lastChecked: { type: 'string', format: 'date-time' }
        }
      }
    },
    lawyers: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'fullName', 'barNumber', 'barState', 'licenseStatus', 'lastVerified'],
        properties: {
          id: { type: 'string', minLength: 1 },
          fullName: { type: 'string', minLength: 1 },
          barNumber: { type: 'string', minLength: 1 },
          barState: { type: 'string', pattern: '^[A-Z]{2}$' },
          licenseStatus: { type: 'string', enum: ['active', 'inactive'] },
          lastVerified: { type: 'string', format: 'date-time' },
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              email: { type: 'string', format: 'email' },
              website: { type: 'string', format: 'uri' },
              address: { type: 'string' }
            }
          },
          practiceAreas: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['family', 'small-claims', 'housing', 'general-civil']
            }
          },
          feeModel: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['hourly', 'flat-fee', 'sliding-scale', 'limited-scope', 'pro-bono']
            }
          },
          languagesSpoken: {
            type: 'array',
            items: { type: 'string' }
          },
          proBonoProgram: { type: 'boolean' },
          modestMeansProgram: { type: 'boolean' },
          onlineConsults: { type: 'boolean' },
          eveningWeekendConsults: { type: 'boolean' },
          thirdPartyRatings: {
            type: 'object',
            properties: {
              google: { type: 'string' },
              avvo: { type: 'string' },
              yelp: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

// Validation functions
function validateFamilyLawData(data, filePath) {
  const validate = ajv.compile(FAMILY_LAW_SCHEMA);
  const valid = validate(data);
  
  if (!valid) {
    console.error(`❌ Validation failed for ${filePath}:`);
    validate.errors.forEach(error => {
      console.error(`  - ${error.instancePath || 'root'}: ${error.message}`);
    });
    return false;
  }
  
  return true;
}

function validateLawyerDirectoryData(data, filePath) {
  const validate = ajv.compile(LAWYER_DIRECTORY_SCHEMA);
  const valid = validate(data);
  
  if (!valid) {
    console.error(`❌ Validation failed for ${filePath}:`);
    validate.errors.forEach(error => {
      console.error(`  - ${error.instancePath || 'root'}: ${error.message}`);
    });
    return false;
  }
  
  return true;
}

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    if (filePath.includes('/family.json')) {
      return validateFamilyLawData(data, filePath);
    } else if (filePath.includes('/lawyers.json')) {
      return validateLawyerDirectoryData(data, filePath);
    } else {
      console.warn(`⚠️  Unknown file type: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error reading/parsing ${filePath}:`, error.message);
    return false;
  }
}

function validateDirectory(dirPath) {
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: []
  };
  
  function processDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.json')) {
        results.total++;
        console.log(`Validating: ${fullPath}`);
        
        if (validateFile(fullPath)) {
          results.valid++;
          console.log(`✅ Valid: ${fullPath}`);
        } else {
          results.invalid++;
          results.errors.push(fullPath);
        }
      }
    }
  }
  
  processDirectory(dirPath);
  return results;
}

// CLI setup
program
  .name('validate-schemas')
  .description('Validate JSON schemas for Kingdom Stand state packs')
  .version('1.0.0');

program
  .command('validate')
  .description('Validate all state pack JSON files')
  .option('-d, --directory <path>', 'Directory to validate', './states')
  .option('-v, --verbose', 'Verbose output')
  .action((options) => {
    const targetDir = path.resolve(options.directory);
    
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Directory not found: ${targetDir}`);
      process.exit(1);
    }
    
    console.log(`🔍 Validating state packs in: ${targetDir}`);
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    const results = validateDirectory(targetDir);
    const endTime = Date.now();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Validation Results:');
    console.log(`  Total files: ${results.total}`);
    console.log(`  Valid: ${results.valid} ✅`);
    console.log(`  Invalid: ${results.invalid} ❌`);
    console.log(`  Duration: ${endTime - startTime}ms`);
    
    if (results.invalid > 0) {
      console.log('\n❌ Invalid files:');
      results.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
      process.exit(1);
    } else {
      console.log('\n🎉 All files are valid!');
    }
  });

program
  .command('validate-file <file>')
  .description('Validate a specific JSON file')
  .action((file) => {
    const filePath = path.resolve(file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    console.log(`🔍 Validating: ${filePath}`);
    
    if (validateFile(filePath)) {
      console.log('✅ File is valid!');
    } else {
      console.log('❌ File is invalid!');
      process.exit(1);
    }
  });

program
  .command('generate-schema')
  .description('Generate JSON schema files')
  .option('-o, --output <path>', 'Output directory', './schemas')
  .action((options) => {
    const outputDir = path.resolve(options.output);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write family law schema
    const familySchemaPath = path.join(outputDir, 'family-law-schema.json');
    fs.writeFileSync(familySchemaPath, JSON.stringify(FAMILY_LAW_SCHEMA, null, 2));
    console.log(`✅ Generated: ${familySchemaPath}`);
    
    // Write lawyer directory schema
    const lawyerSchemaPath = path.join(outputDir, 'lawyer-directory-schema.json');
    fs.writeFileSync(lawyerSchemaPath, JSON.stringify(LAWYER_DIRECTORY_SCHEMA, null, 2));
    console.log(`✅ Generated: ${lawyerSchemaPath}`);
    
    console.log(`\n🎉 Schemas generated in: ${outputDir}`);
  });

// Parse command line arguments
program.parse();

// If no command specified, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
