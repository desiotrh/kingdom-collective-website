// Kingdom Collective Lint-Staged Configuration
// Runs linters on git staged files

module.exports = {
  // TypeScript/JavaScript files
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '**/*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '**/*.md': [
    'prettier --write',
  ],
  
  // CSS/SCSS files
  '**/*.{css,scss}': [
    'prettier --write',
  ],
  
  // YAML files
  '**/*.{yml,yaml}': [
    'prettier --write',
  ],
};

