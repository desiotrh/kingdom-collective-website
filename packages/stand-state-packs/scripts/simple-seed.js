#!/usr/bin/env node
/*
 * Simple seeding script without dependencies on npm workspace or external APIs
 * Run directly: node packages/stand-state-packs/scripts/simple-seed.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATES_DIR = path.resolve(ROOT, 'states');

// Major counties per state
const STATE_COUNTIES = {
  'AL': ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Tuscaloosa'],
  'AK': ['Anchorage', 'Fairbanks North Star', 'Matanuska-Susitna', 'Kenai Peninsula'],
  'AZ': ['Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Mohave'],
  'AR': ['Pulaski', 'Washington', 'Benton', 'Faulkner', 'Saline'],
  'CA': ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino', 'Santa Clara', 'Alameda', 'Sacramento', 'Contra Costa', 'Fresno'],
  'CO': ['Denver', 'El Paso', 'Arapahoe', 'Jefferson', 'Adams'],
  'CT': ['Fairfield', 'Hartford', 'New Haven', 'New London', 'Litchfield'],
  'DE': ['New Castle', 'Kent', 'Sussex'],
  'FL': ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Pinellas', 'Duval', 'Lee', 'Polk', 'Volusia'],
  'GA': ['Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton'],
  'HI': ['Honolulu', 'Hawaii', 'Maui', 'Kauai'],
  'ID': ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Bannock'],
  'IL': ['Cook', 'DuPage', 'Lake', 'Will', 'Kane'],
  'IN': ['Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph'],
  'IA': ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk'],
  'KS': ['Johnson', 'Sedgwick', 'Shawnee', 'Wyandotte', 'Douglas'],
  'KY': ['Jefferson', 'Fayette', 'Kenton', 'Boone', 'Warren'],
  'LA': ['Orleans', 'Jefferson', 'East Baton Rouge', 'Caddo', 'Lafayette'],
  'ME': ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin'],
  'MD': ['Montgomery', 'Prince Georges', 'Baltimore', 'Anne Arundel', 'Howard'],
  'MA': ['Middlesex', 'Worcester', 'Essex', 'Suffolk', 'Norfolk'],
  'MI': ['Wayne', 'Oakland', 'Macomb', 'Kent', 'Genesee'],
  'MN': ['Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington'],
  'MS': ['Hinds', 'Harrison', 'DeSoto', 'Jackson', 'Madison'],
  'MO': ['St. Louis', 'Jackson', 'St. Charles', 'Jefferson', 'Clay'],
  'MT': ['Yellowstone', 'Missoula', 'Gallatin', 'Flathead', 'Cascade'],
  'NE': ['Douglas', 'Lancaster', 'Sarpy', 'Hall', 'Buffalo'],
  'NV': ['Clark', 'Washoe', 'Carson City', 'Lyon', 'Elko'],
  'NH': ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Cheshire'],
  'NJ': ['Bergen', 'Middlesex', 'Essex', 'Hudson', 'Monmouth'],
  'NM': ['Bernalillo', 'Dona Ana', 'Santa Fe', 'Sandoval', 'San Juan'],
  'NY': ['Kings', 'Queens', 'New York', 'Suffolk', 'Bronx', 'Nassau', 'Westchester', 'Monroe', 'Erie', 'Richmond'],
  'NC': ['Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Cumberland'],
  'ND': ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Morton'],
  'OH': ['Cuyahoga', 'Hamilton', 'Franklin', 'Montgomery', 'Summit'],
  'OK': ['Oklahoma', 'Tulsa', 'Cleveland', 'Comanche', 'Canadian'],
  'OR': ['Multnomah', 'Washington', 'Clackamas', 'Lane', 'Marion'],
  'PA': ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Chester'],
  'RI': ['Providence', 'Kent', 'Washington', 'Newport', 'Bristol'],
  'SC': ['Greenville', 'Richland', 'Charleston', 'Lexington', 'Horry'],
  'SD': ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Codington'],
  'TN': ['Shelby', 'Davidson', 'Knox', 'Hamilton', 'Rutherford'],
  'TX': ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Hidalgo', 'El Paso', 'Fort Bend', 'Montgomery'],
  'UT': ['Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington'],
  'VT': ['Chittenden', 'Rutland', 'Washington', 'Windsor', 'Franklin'],
  'VA': ['Fairfax', 'Virginia Beach', 'Prince William', 'Chesterfield', 'Henrico'],
  'WA': ['King', 'Pierce', 'Snohomish', 'Spokane', 'Clark'],
  'WV': ['Kanawha', 'Berkeley', 'Jefferson', 'Monongalia', 'Cabell'],
  'WI': ['Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine'],
  'WY': ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Fremont'],
  'DC': ['District of Columbia']
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function ensureDir(p) {
  try {
    fs.mkdirSync(p, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }
}

function writeJson(filePath, obj) {
  if (fs.existsSync(filePath)) {
    console.log(`  Skipping ${filePath} (already exists)`);
    return false; // didn't create
  }
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  console.log(`  Created ${filePath}`);
  return true; // created
}

function main() {
  console.log('Generating skeleton files for all states and major counties...');
  console.log(`Target directory: ${STATES_DIR}`);
  
  let created = 0;
  let skipped = 0;
  
  for (const [state, counties] of Object.entries(STATE_COUNTIES)) {
    console.log(`\nProcessing ${state}...`);
    
    for (const county of counties) {
      const countySlug = slugify(county);
      const baseDir = path.join(STATES_DIR, state.toLowerCase(), countySlug);
      ensureDir(baseDir);

      const family = {
        state,
        county,
        verification: { verifiedAt: null, sourceUrl: '' },
        mediators: [],
        parentingClasses: [],
        galDirectory: []
      };
      
      const lawyers = {
        state,
        county,
        verifiedAt: null,
        sources: [],
        lawyers: []
      };
      
      if (writeJson(path.join(baseDir, 'family.json'), family)) created++;
      else skipped++;
      
      if (writeJson(path.join(baseDir, 'lawyers.json'), lawyers)) created++;
      else skipped++;
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`📁 States processed: ${Object.keys(STATE_COUNTIES).length}`);
  console.log(`📄 Files created: ${created}`);
  console.log(`⏭️  Files skipped (already exist): ${skipped}`);
  console.log(`📊 Total counties: ${Object.values(STATE_COUNTIES).flat().length}`);
}

try {
  main();
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
