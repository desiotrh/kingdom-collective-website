// Kingdom Collective Commitlint Configuration
// Enforces Conventional Commits standard

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Type enum - allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',      // New feature
        'fix',       // Bug fix
        'docs',      // Documentation changes
        'style',     // Code style changes (formatting, etc.)
        'refactor',  // Code refactoring
        'perf',      // Performance improvements
        'test',      // Adding or updating tests
        'build',     // Build system or dependency changes
        'ci',        // CI/CD changes
        'chore',     // Maintenance tasks
        'revert',    // Revert a previous commit
        'security',  // Security fixes
        'a11y',      // Accessibility improvements
      ],
    ],
    
    // Subject case - allow sentence-case, start-case, pascal-case, upper-case, lower-case
    'subject-case': [0],
    
    // Subject max length
    'subject-max-length': [2, 'always', 100],
    
    // Subject empty
    'subject-empty': [2, 'never'],
    
    // Type case - must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    
    // Type empty
    'type-empty': [2, 'never'],
    
    // Scope case - if provided, must be lowercase
    'scope-case': [2, 'always', 'lower-case'],
    
    // Body leading blank - require blank line between subject and body
    'body-leading-blank': [2, 'always'],
    
    // Footer leading blank - require blank line between body and footer
    'footer-leading-blank': [2, 'always'],
  },
  
  // Custom prompts for interactive commits
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you're committing",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Code style changes (formatting, missing semi-colons, etc.)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'Code refactoring (neither fixes a bug nor adds a feature)',
            title: 'Code Refactoring',
            emoji: '♻️',
          },
          perf: {
            description: 'Performance improvements',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Adding or updating tests',
            title: 'Tests',
            emoji: '🧪',
          },
          build: {
            description: 'Build system or dependency changes',
            title: 'Builds',
            emoji: '🏗️',
          },
          ci: {
            description: 'CI/CD changes',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: 'Maintenance tasks',
            title: 'Chores',
            emoji: '🔧',
          },
          revert: {
            description: 'Revert a previous commit',
            title: 'Reverts',
            emoji: '⏪',
          },
          security: {
            description: 'Security fixes',
            title: 'Security',
            emoji: '🔒',
          },
          a11y: {
            description: 'Accessibility improvements',
            title: 'Accessibility',
            emoji: '♿',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component, file, or package name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #456")',
      },
    },
  },
};

