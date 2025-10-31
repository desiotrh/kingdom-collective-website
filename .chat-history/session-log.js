#!/usr/bin/env node

/**
 * Chat Session Logger
 * Automatically logs development sessions with timestamps and changes
 * Build with the Holy Spirit
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
const readableDate = now.toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'America/New_York'
});

// Parse command line arguments
const args = process.argv.slice(2);
const sessionDescription = args[0] || 'Development Session';
const changes = args[1] || 'General development work';

// Create session file name
const sessionFileName = `session_${timestamp}.md`;
const sessionFilePath = path.join(__dirname, 'sessions', sessionFileName);

// Session template
const sessionContent = `# Development Session - ${readableDate}

## Session Description
${sessionDescription}

## Changes Made
${changes}

## Files Modified
<!-- List files modified during this session -->
- 

## Key Decisions
<!-- Document any important decisions made -->
- 

## Issues Resolved
<!-- List any bugs fixed or issues resolved -->
- 

## Next Steps
<!-- What needs to be done next -->
- 

## Technical Notes
<!-- Any important technical information -->
- 

---

**Session Start**: ${readableDate}  
**Session End**: <!-- Fill in when session ends -->

---

*Build with the Holy Spirit* 🙏
`;

// Write session file
fs.writeFileSync(sessionFilePath, sessionContent, 'utf8');

console.log(`✅ Session log created: ${sessionFileName}`);
console.log(`📁 Location: ${sessionFilePath}`);

// Update CHANGELOG.md
const changelogPath = path.join(__dirname, 'CHANGELOG.md');
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Find where to insert (after the header, before first session)
const insertMarker = '---\n\n## ';
const insertIndex = changelog.indexOf(insertMarker);

if (insertIndex !== -1) {
  const newEntry = `\n## [Session] ${readableDate}\n\n### Description\n${sessionDescription}\n\n### Changes\n${changes}\n\n---\n`;
  
  // Insert the new entry
  changelog = changelog.slice(0, insertIndex) + '---\n' + newEntry + '\n' + changelog.slice(insertIndex + 6);
  
  fs.writeFileSync(changelogPath, changelog, 'utf8');
  console.log(`📝 CHANGELOG.md updated`);
}

console.log(`\n✨ Session tracking complete!`);

