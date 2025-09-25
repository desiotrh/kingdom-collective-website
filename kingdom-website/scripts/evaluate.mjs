#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Golden questions for evaluation
const goldenQuestions = [
  {
    id: 'pricing-studios',
    question: 'What are the pricing options for Kingdom Studios?',
    expectedAnswer: 'Kingdom Studios offers three pricing tiers: Free ($0/month), Pro ($29/month), and Enterprise ($199/month)',
    category: 'pricing',
    app: 'studios'
  },
  {
    id: 'features-circle',
    question: 'What features does Kingdom Circle offer?',
    expectedAnswer: 'Kingdom Circle offers discussion forums, member directory, event management, file sharing, and analytics',
    category: 'features',
    app: 'circle'
  },
  {
    id: 'apps-overview',
    question: 'What apps does Kingdom Collective offer?',
    expectedAnswer: 'Kingdom Collective offers 7 apps: Kingdom Studios, Kingdom Circle, Kingdom Voice, Kingdom Lens, Kingdom Launchpad, Kingdom Clips, and Kingdom Stand',
    category: 'overview',
    app: 'all'
  },
  {
    id: 'ai-bots',
    question: 'Tell me about your AI bots',
    expectedAnswer: 'We offer specialized AI bots including Sales Assistant Bot, Lead Generation Bot, Customer Support Bot, Onboarding Bot, Appointment Booking Bot, and FAQ & Knowledge Base Bot',
    category: 'ai-bots',
    app: 'all'
  },
  {
    id: 'refund-policy',
    question: 'What is your refund policy?',
    expectedAnswer: 'We offer refunds within 30 days of initial purchase for unused subscription periods',
    category: 'legal',
    app: 'all'
  },
  {
    id: 'faith-mode',
    question: 'What is Faith Mode?',
    expectedAnswer: 'Faith Mode is a feature that provides faith-based content, biblical principles, and kingdom-focused tools',
    category: 'features',
    app: 'all'
  },
  {
    id: 'support-contact',
    question: 'How can I contact support?',
    expectedAnswer: 'You can contact support at support@kingdomcollective.com with response times of 24 hours for Pro and 4 hours for Enterprise',
    category: 'support',
    app: 'all'
  },
  {
    id: 'voice-features',
    question: 'What can Kingdom Voice do?',
    expectedAnswer: 'Kingdom Voice offers voice recognition, text-to-speech, natural language processing, and voice analytics',
    category: 'features',
    app: 'voice'
  },
  {
    id: 'lens-ar',
    question: 'What is Kingdom Lens used for?',
    expectedAnswer: 'Kingdom Lens is an augmented reality platform for creating immersive experiences, product visualization, and interactive content',
    category: 'features',
    app: 'lens'
  },
  {
    id: 'launchpad-business',
    question: 'How can Kingdom Launchpad help my business?',
    expectedAnswer: 'Kingdom Launchpad provides business planning tools, mentorship, funding resources, and networking opportunities for entrepreneurs',
    category: 'features',
    app: 'launchpad'
  }
];

// Evaluation metrics
class EvaluationMetrics {
  constructor() {
    this.results = [];
  }

  // Calculate exactness score (0-1)
  calculateExactness(actual, expected) {
    const actualLower = actual.toLowerCase();
    const expectedLower = expected.toLowerCase();
    
    // Simple word overlap scoring
    const actualWords = new Set(actualLower.split(/\s+/));
    const expectedWords = new Set(expectedLower.split(/\s+/));
    
    const intersection = new Set([...actualWords].filter(x => expectedWords.has(x)));
    const union = new Set([...actualWords, ...expectedWords]);
    
    return intersection.size / union.size;
  }

  // Check if sources are provided
  hasSources(sources) {
    return sources && sources.length > 0;
  }

  // Check tone consistency
  checkTone(actual, mode) {
    if (mode === 'faith') {
      return actual.includes('kingdom') || actual.includes('biblical') || actual.includes('God');
    } else {
      return !actual.includes('kingdom') && !actual.includes('biblical') && !actual.includes('God');
    }
  }

  // Check actionability
  isActionable(actual) {
    const actionWords = ['contact', 'email', 'call', 'visit', 'try', 'start', 'begin', 'schedule', 'demo'];
    return actionWords.some(word => actual.toLowerCase().includes(word));
  }

  // Evaluate a single response
  evaluateResponse(question, actual, expected, sources, mode) {
    const exactness = this.calculateExactness(actual, expected);
    const hasSources = this.hasSources(sources);
    const toneMatch = this.checkTone(actual, mode);
    const actionable = this.isActionable(actual);

    return {
      question,
      actual,
      expected,
      exactness,
      hasSources,
      toneMatch,
      actionable,
      overallScore: (exactness + (hasSources ? 0.2 : 0) + (toneMatch ? 0.2 : 0) + (actionable ? 0.1 : 0)) / 1.5
    };
  }

  // Add result
  addResult(result) {
    this.results.push(result);
  }

  // Generate report
  generateReport() {
    const totalQuestions = this.results.length;
    const avgExactness = this.results.reduce((sum, r) => sum + r.exactness, 0) / totalQuestions;
    const avgOverall = this.results.reduce((sum, r) => sum + r.overallScore, 0) / totalQuestions;
    const sourcesProvided = this.results.filter(r => r.hasSources).length;
    const toneMatches = this.results.filter(r => r.toneMatch).length;
    const actionableResponses = this.results.filter(r => r.actionable).length;

    return {
      summary: {
        totalQuestions,
        avgExactness: Math.round(avgExactness * 100) / 100,
        avgOverallScore: Math.round(avgOverall * 100) / 100,
        sourcesProvided: Math.round((sourcesProvided / totalQuestions) * 100),
        toneMatches: Math.round((toneMatches / totalQuestions) * 100),
        actionableResponses: Math.round((actionableResponses / totalQuestions) * 100)
      },
      results: this.results
    };
  }
}

// Test the chatbot
async function testChatbot(question, mode = 'marketplace') {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        mode,
        sessionId: `test_${Date.now()}`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.message,
      sources: data.sources
    };
  } catch (error) {
    console.error('Error testing chatbot:', error);
    return {
      message: 'Error: ' + error.message,
      sources: []
    };
  }
}

// Run evaluation
async function runEvaluation() {
  console.log('Starting chatbot evaluation...');
  
  const metrics = new EvaluationMetrics();
  
  for (const question of goldenQuestions) {
    console.log(`Testing: ${question.question}`);
    
    // Test in both modes
    const marketplaceResponse = await testChatbot(question.question, 'marketplace');
    const faithResponse = await testChatbot(question.question, 'faith');
    
    // Evaluate marketplace mode
    const marketplaceResult = metrics.evaluateResponse(
      question.question,
      marketplaceResponse.message,
      question.expectedAnswer,
      marketplaceResponse.sources,
      'marketplace'
    );
    metrics.addResult(marketplaceResult);
    
    // Evaluate faith mode
    const faithResult = metrics.evaluateResponse(
      question.question,
      faithResponse.message,
      question.expectedAnswer,
      faithResponse.sources,
      'faith'
    );
    metrics.addResult(faithResult);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate and save report
  const report = metrics.generateReport();
  const reportPath = path.join(__dirname, '../evaluation-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n=== EVALUATION REPORT ===');
  console.log(`Total Questions: ${report.summary.totalQuestions}`);
  console.log(`Average Exactness: ${report.summary.avgExactness}`);
  console.log(`Average Overall Score: ${report.summary.avgOverallScore}`);
  console.log(`Sources Provided: ${report.summary.sourcesProvided}%`);
  console.log(`Tone Matches: ${report.summary.toneMatches}%`);
  console.log(`Actionable Responses: ${report.summary.actionableResponses}%`);
  
  // Check for failures
  const failures = report.results.filter(r => r.overallScore < 0.7);
  if (failures.length > 0) {
    console.log(`\n⚠️  ${failures.length} responses scored below 70%:`);
    failures.forEach(failure => {
      console.log(`- ${failure.question}: ${Math.round(failure.overallScore * 100)}%`);
    });
  }
  
  console.log(`\nFull report saved to: ${reportPath}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEvaluation().catch(console.error);
}

export { runEvaluation, goldenQuestions, EvaluationMetrics };
