#!/usr/bin/env node

/**
 * Automatic Session Logger Hook
 * This script can be called automatically at the end of each session
 * Build with the Holy Spirit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

console.log('🔍 Analyzing recent changes...\n');

// Get git changes (if in a git repo)
let filesChanged = [];
let gitStatus = '';

try {
  // Get modified files from git
  gitStatus = execSync('git status --short', { encoding: 'utf8' });
  
  if (gitStatus) {
    filesChanged = gitStatus
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.trim().split(/\s+/);
        return `- \`${parts[1]}\` (${getStatusDescription(parts[0])})`;
      });
  }
} catch (error) {
  console.log('ℹ️  Not a git repository or no git changes detected');
}

// Get recent git commits from today
let recentCommits = [];
try {
  const today = new Date().toISOString().split('T')[0];
  const commits = execSync(`git log --since="${today}" --pretty=format:"%h - %s"`, { encoding: 'utf8' });
  
  if (commits) {
    recentCommits = commits.split('\n').filter(line => line.trim());
  }
} catch (error) {
  // No commits today
}

// Create session file
const sessionFileName = `session_${timestamp}.md`;
const sessionFilePath = path.join(__dirname, 'sessions', sessionFileName);

const filesSection = filesChanged.length > 0 
  ? filesChanged.join('\n')
  : '- No tracked file changes';

const commitsSection = recentCommits.length > 0
  ? recentCommits.map(c => `- ${c}`).join('\n')
  : '- No commits in this session';

const sessionContent = `# Development Session - ${readableDate}

## Session Summary
<!-- Add your session summary here -->

---

## Files Changed
${filesSection}

## Git Commits
${commitsSection}

## Changes Made
<!-- Detail the changes made during this session -->
- 

## Key Decisions
<!-- Document any important decisions made -->
- 

## Issues Resolved
<!-- List any bugs fixed or issues resolved -->
- 

## Testing Performed
<!-- Document any testing done -->
- 

## Next Steps
<!-- What needs to be done next -->
- 

## Technical Notes
<!-- Any important technical information -->
- 

---

**Session Start**: ${readableDate}  
**Session End**: ${readableDate}

---

*Build with the Holy Spirit* 🙏
`;

// Write session file
fs.writeFileSync(sessionFilePath, sessionContent, 'utf8');

console.log(`✅ Session log created: ${sessionFileName}`);
console.log(`📁 Location: ${sessionFilePath}`);
console.log(`\n📝 Please edit the session file to add your summary and details.`);
console.log(`\n✨ Session tracking complete!\n`);

function getStatusDescription(status) {
  const statusMap = {
    'M': 'Modified',
    'A': 'Added',
    'D': 'Deleted',
    'R': 'Renamed',
    'C': 'Copied',
    '??': 'Untracked'
  };
  return statusMap[status] || status;
}

