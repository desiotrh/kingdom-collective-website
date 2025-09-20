#!/usr/bin/env node
/*
 Seeds skeleton directories and JSON files for ALL US states and counties.
 - Creates: packages/stand-state-packs/states/<state>/<county-slug>/family.json
            packages/stand-state-packs/states/<state>/<county-slug>/lawyers.json
 - Data source: Built-in county data (major counties per state)
 - Usage: node packages/stand-state-packs/scripts/seed-all-states.js [--dry-run] [--limit-states=IA,OK] [--limit-counties=Polk,Oklahoma]
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATES_DIR = path.resolve(ROOT, 'states');

// Major counties per state (representative sample - can be expanded)
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

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { dryRun: false, limitStates: null, limitCounties: null };
  for (const arg of args) {
    if (arg === '--dry-run') out.dryRun = true;
    else if (arg.startsWith('--limit-states=')) out.limitStates = arg.split('=')[1].split(',').map(s => s.trim().toUpperCase());
    else if (arg.startsWith('--limit-counties=')) out.limitCounties = arg.split('=')[1].split(',').map(s => s.trim());
  }
  return out;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function ensureDir(p, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(filePath, obj, dryRun) {
  if (dryRun) return;
  if (fs.existsSync(filePath)) return; // don't overwrite
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
}

function main() {
  const { dryRun, limitStates, limitCounties } = parseArgs();
  console.log(`Generating skeleton files for major counties (built-in data)...`);

  const byState = new Map();
  for (const [state, counties] of Object.entries(STATE_COUNTIES)) {
    if (limitStates && !limitStates.includes(state)) continue;
    const filteredCounties = limitCounties 
      ? counties.filter(c => limitCounties.includes(c))
      : counties;
    if (filteredCounties.length > 0) {
      byState.set(state, new Set(filteredCounties));
    }
  }

  let created = 0;
  for (const [state, countiesSet] of byState.entries()) {
    const counties = Array.from(countiesSet).sort();
    for (const county of counties) {
      const countySlug = slugify(county);
      const baseDir = path.join(STATES_DIR, state.toLowerCase(), countySlug);
      ensureDir(baseDir, dryRun);

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
      writeJson(path.join(baseDir, 'family.json'), family, dryRun);
      writeJson(path.join(baseDir, 'lawyers.json'), lawyers, dryRun);
      created += 2;
    }
  }

  console.log(`${dryRun ? '[DRY RUN] ' : ''}Prepared skeletons for ${byState.size} states, files created (or skipped if exist): ${created}`);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}


