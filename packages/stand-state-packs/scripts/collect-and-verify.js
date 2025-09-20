#!/usr/bin/env node
/*
 * Complete Legal Data Collection and Verification System
 * Orchestrates data collection from live sources and license verification
 * Provides comprehensive, verified legal professional data
 */

const fs = require('fs');
const path = require('path');
const { RealLegalDataCollector } = require('./real-data-collector');
const { LicenseVerificationService } = require('./license-verification');

class ComprehensiveDataSystem {
  constructor() {
    this.collector = new RealLegalDataCollector();
    this.verifier = new LicenseVerificationService();
    this.results = {
      collected: 0,
      verified: 0,
      errors: [],
      startTime: null,
      endTime: null
    };
  }

  async initialize() {
    console.log('🚀 Initializing Comprehensive Legal Data System...');
    
    try {
      this.results.startTime = new Date();
      
      const collectorInit = await this.collector.initialize();
      const verifierInit = await this.verifier.initialize();
      
      if (!collectorInit || !verifierInit) {
        throw new Error('Failed to initialize one or more services');
      }
      
      console.log('✅ All services initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }

  async close() {
    await this.collector.close();
    await this.verifier.close();
    this.results.endTime = new Date();
  }

  async collectAndVerifyState(stateCode, options = {}) {
    console.log(`\n🏛️ Processing ${stateCode} with full collection and verification...`);
    
    const {
      skipCollection = false,
      skipVerification = false,
      generateReport = true
    } = options;

    try {
      // Step 1: Collect fresh data (unless skipped)
      if (!skipCollection) {
        console.log(`📊 Step 1: Collecting fresh data for ${stateCode}...`);
        await this.collector.collectRealData([stateCode]);
        console.log(`✅ Data collection complete for ${stateCode}`);
      } else {
        console.log(`⏭️ Skipping data collection for ${stateCode}`);
      }

      // Step 2: Verify all lawyers (unless skipped)
      if (!skipVerification) {
        console.log(`🔍 Step 2: Verifying lawyer licenses for ${stateCode}...`);
        await this.verifier.verifyState(stateCode);
        console.log(`✅ License verification complete for ${stateCode}`);
      } else {
        console.log(`⏭️ Skipping license verification for ${stateCode}`);
      }

      // Step 3: Generate comprehensive report
      if (generateReport) {
        console.log(`📋 Step 3: Generating comprehensive report for ${stateCode}...`);
        const report = await this.verifier.generateVerificationReport(stateCode);
        await this.generateDataQualityReport(stateCode, report);
        console.log(`✅ Reports generated for ${stateCode}`);
      }

      console.log(`🎉 ${stateCode} processing complete!`);

    } catch (error) {
      console.error(`❌ Error processing ${stateCode}:`, error.message);
      this.results.errors.push({
        state: stateCode,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async generateDataQualityReport(stateCode, verificationReport) {
    console.log(`📊 Generating data quality report for ${stateCode}...`);
    
    const reportPath = path.join(__dirname, '..', 'reports', `${stateCode.toLowerCase()}-data-quality.json`);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const qualityReport = {
      state: stateCode,
      generatedAt: new Date().toISOString(),
      dataQuality: {
        overall: 'Unknown',
        score: 0,
        factors: []
      },
      coverage: {
        countiesWithData: 0,
        totalCounties: 0,
        coveragePercentage: 0
      },
      verification: {
        totalLawyers: verificationReport.summary.totalLawyers,
        verifiedLawyers: verificationReport.summary.verifiedLawyers,
        verificationRate: verificationReport.summary.verificationRate,
        activeLawyers: verificationReport.summary.activeLawyers
      },
      dataFreshness: {
        lastCollected: null,
        lastVerified: null,
        staleSources: []
      },
      recommendations: []
    };

    // Analyze data quality
    let qualityScore = 0;
    const factors = [];

    // Factor 1: Verification rate
    const verificationRate = verificationReport.summary.verificationRate;
    if (verificationRate >= 80) {
      qualityScore += 30;
      factors.push('High verification rate (≥80%)');
    } else if (verificationRate >= 60) {
      qualityScore += 20;
      factors.push('Moderate verification rate (60-79%)');
    } else {
      qualityScore += 10;
      factors.push('Low verification rate (<60%)');
      qualityReport.recommendations.push('Improve license verification process');
    }

    // Factor 2: Data coverage
    const countiesWithData = verificationReport.counties.filter(c => c.totalLawyers > 0).length;
    const totalCounties = verificationReport.counties.length;
    const coveragePercentage = totalCounties > 0 ? Math.round((countiesWithData / totalCounties) * 100) : 0;
    
    qualityReport.coverage.countiesWithData = countiesWithData;
    qualityReport.coverage.totalCounties = totalCounties;
    qualityReport.coverage.coveragePercentage = coveragePercentage;

    if (coveragePercentage >= 80) {
      qualityScore += 25;
      factors.push('Excellent county coverage (≥80%)');
    } else if (coveragePercentage >= 60) {
      qualityScore += 15;
      factors.push('Good county coverage (60-79%)');
    } else {
      qualityScore += 5;
      factors.push('Limited county coverage (<60%)');
      qualityReport.recommendations.push('Expand data collection to more counties');
    }

    // Factor 3: Data volume
    const totalLawyers = verificationReport.summary.totalLawyers;
    if (totalLawyers >= 100) {
      qualityScore += 25;
      factors.push('Substantial lawyer database (≥100 lawyers)');
    } else if (totalLawyers >= 50) {
      qualityScore += 15;
      factors.push('Moderate lawyer database (50-99 lawyers)');
    } else if (totalLawyers >= 10) {
      qualityScore += 10;
      factors.push('Small lawyer database (10-49 lawyers)');
    } else {
      qualityScore += 5;
      factors.push('Very limited lawyer database (<10 lawyers)');
      qualityReport.recommendations.push('Increase data collection efforts');
    }

    // Factor 4: Active lawyers percentage
    const activeLawyers = verificationReport.summary.activeLawyers;
    const activeRate = totalLawyers > 0 ? Math.round((activeLawyers / totalLawyers) * 100) : 0;
    
    if (activeRate >= 90) {
      qualityScore += 20;
      factors.push('High active lawyer rate (≥90%)');
    } else if (activeRate >= 75) {
      qualityScore += 15;
      factors.push('Good active lawyer rate (75-89%)');
    } else {
      qualityScore += 5;
      factors.push('Low active lawyer rate (<75%)');
      qualityReport.recommendations.push('Review and update inactive lawyer records');
    }

    // Determine overall quality
    qualityReport.dataQuality.score = qualityScore;
    qualityReport.dataQuality.factors = factors;

    if (qualityScore >= 85) {
      qualityReport.dataQuality.overall = 'Excellent';
    } else if (qualityScore >= 70) {
      qualityReport.dataQuality.overall = 'Good';
    } else if (qualityScore >= 50) {
      qualityReport.dataQuality.overall = 'Fair';
    } else {
      qualityReport.dataQuality.overall = 'Poor';
      qualityReport.recommendations.push('Major improvements needed in data collection and verification');
    }

    // Analyze data freshness
    const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
    if (fs.existsSync(statePath)) {
      const counties = fs.readdirSync(statePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      let newestCollection = null;
      let newestVerification = null;
      const staleThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

      counties.forEach(county => {
        const lawyersPath = path.join(statePath, county, 'lawyers.json');
        if (fs.existsSync(lawyersPath)) {
          const data = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
          
          if (data.verifiedAt) {
            const verifiedDate = new Date(data.verifiedAt);
            if (!newestCollection || verifiedDate > newestCollection) {
              newestCollection = verifiedDate;
            }
          }
          
          if (data.lastVerified) {
            const lastVerified = new Date(data.lastVerified);
            if (!newestVerification || lastVerified > newestVerification) {
              newestVerification = lastVerified;
            }
          }

          // Check for stale sources
          if (data.verifiedAt) {
            const age = Date.now() - new Date(data.verifiedAt).getTime();
            if (age > staleThreshold) {
              qualityReport.dataFreshness.staleSources.push({
                county: county,
                lastUpdated: data.verifiedAt,
                ageInDays: Math.floor(age / (24 * 60 * 60 * 1000))
              });
            }
          }
        }
      });

      qualityReport.dataFreshness.lastCollected = newestCollection ? newestCollection.toISOString() : null;
      qualityReport.dataFreshness.lastVerified = newestVerification ? newestVerification.toISOString() : null;

      if (qualityReport.dataFreshness.staleSources.length > 0) {
        qualityReport.recommendations.push('Update stale data sources (>30 days old)');
      }
    }

    // Add general recommendations
    if (qualityReport.recommendations.length === 0) {
      qualityReport.recommendations.push('Data quality is good - continue regular updates');
    }

    // Save quality report
    fs.writeFileSync(reportPath, JSON.stringify(qualityReport, null, 2));
    
    console.log(`📋 Data Quality Report for ${stateCode}:`);
    console.log(`   Overall Quality: ${qualityReport.dataQuality.overall} (${qualityReport.dataQuality.score}/100)`);
    console.log(`   County Coverage: ${qualityReport.coverage.coveragePercentage}% (${countiesWithData}/${totalCounties})`);
    console.log(`   Verification Rate: ${qualityReport.verification.verificationRate}%`);
    console.log(`   Active Lawyers: ${activeLawyers}/${totalLawyers}`);
    console.log(`   Stale Sources: ${qualityReport.dataFreshness.staleSources.length}`);
    console.log(`   Report saved: ${reportPath}`);

    return qualityReport;
  }

  async runComprehensiveUpdate(states = ['CA', 'NY']) {
    console.log('🌍 Running comprehensive legal data update...');
    console.log(`📋 States to process: ${states.join(', ')}`);
    
    for (const state of states) {
      await this.collectAndVerifyState(state, {
        skipCollection: false,
        skipVerification: false,
        generateReport: true
      });
      
      // Brief pause between states
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Generate final summary
    await this.generateFinalSummary(states);
  }

  async generateFinalSummary(states) {
    console.log('\n📊 Generating final summary...');
    
    const summaryPath = path.join(__dirname, '..', 'reports', 'comprehensive-summary.json');
    
    const summary = {
      generatedAt: new Date().toISOString(),
      processedStates: states,
      processingTime: this.results.endTime - this.results.startTime,
      totalStats: {
        lawyers: 0,
        verifiedLawyers: 0,
        activeLawyers: 0,
        counties: 0,
        states: states.length
      },
      stateBreakdown: [],
      errors: this.results.errors,
      recommendations: []
    };

    // Collect stats from each state
    for (const state of states) {
      const verificationReportPath = path.join(__dirname, '..', 'reports', `${state.toLowerCase()}-verification-report.json`);
      const qualityReportPath = path.join(__dirname, '..', 'reports', `${state.toLowerCase()}-data-quality.json`);

      if (fs.existsSync(verificationReportPath) && fs.existsSync(qualityReportPath)) {
        const verificationReport = JSON.parse(fs.readFileSync(verificationReportPath, 'utf8'));
        const qualityReport = JSON.parse(fs.readFileSync(qualityReportPath, 'utf8'));

        const stateStats = {
          state: state,
          lawyers: verificationReport.summary.totalLawyers,
          verifiedLawyers: verificationReport.summary.verifiedLawyers,
          activeLawyers: verificationReport.summary.activeLawyers,
          counties: verificationReport.counties.length,
          qualityScore: qualityReport.dataQuality.score,
          qualityRating: qualityReport.dataQuality.overall
        };

        summary.stateBreakdown.push(stateStats);

        // Add to totals
        summary.totalStats.lawyers += stateStats.lawyers;
        summary.totalStats.verifiedLawyers += stateStats.verifiedLawyers;
        summary.totalStats.activeLawyers += stateStats.activeLawyers;
        summary.totalStats.counties += stateStats.counties;
      }
    }

    // Generate overall recommendations
    const overallVerificationRate = summary.totalStats.lawyers > 0 
      ? Math.round((summary.totalStats.verifiedLawyers / summary.totalStats.lawyers) * 100)
      : 0;

    if (overallVerificationRate < 70) {
      summary.recommendations.push('Focus on improving license verification processes across all states');
    }

    if (summary.totalStats.lawyers < 500) {
      summary.recommendations.push('Expand data collection to increase lawyer database size');
    }

    if (summary.errors.length > 0) {
      summary.recommendations.push('Address collection and verification errors to improve data quality');
    }

    if (summary.recommendations.length === 0) {
      summary.recommendations.push('System is performing well - maintain regular update schedule');
    }

    // Save summary
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    // Display results
    console.log('\n🎉 Comprehensive Legal Data Update Complete!');
    console.log('=' .repeat(60));
    console.log(`📊 Total Statistics:`);
    console.log(`   States Processed: ${summary.totalStats.states}`);
    console.log(`   Counties Covered: ${summary.totalStats.counties}`);
    console.log(`   Total Lawyers: ${summary.totalStats.lawyers}`);
    console.log(`   Verified Lawyers: ${summary.totalStats.verifiedLawyers} (${overallVerificationRate}%)`);
    console.log(`   Active Lawyers: ${summary.totalStats.activeLawyers}`);
    console.log(`   Processing Time: ${Math.round(summary.processingTime / 1000 / 60)} minutes`);
    console.log(`   Errors: ${summary.errors.length}`);
    console.log(`\n📋 Summary saved: ${summaryPath}`);

    return summary;
  }
}

// Main execution
async function main() {
  const system = new ComprehensiveDataSystem();
  
  try {
    const initialized = await system.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize comprehensive system');
      process.exit(1);
    }
    
    const args = process.argv.slice(2);
    const command = args[0] || 'pilot';
    
    switch (command) {
      case 'pilot':
        console.log('🎯 Running pilot comprehensive update (CA, NY)...');
        await system.runComprehensiveUpdate(['CA', 'NY']);
        break;
        
      case 'ca':
        console.log('🌴 Running California comprehensive update...');
        await system.runComprehensiveUpdate(['CA']);
        break;
        
      case 'ny':
        console.log('🗽 Running New York comprehensive update...');
        await system.runComprehensiveUpdate(['NY']);
        break;
        
      case 'all':
        console.log('🌍 Running full comprehensive update...');
        await system.runComprehensiveUpdate(['CA', 'NY', 'TX', 'FL']);
        break;
        
      case 'verify-only':
        const state = args[1];
        if (!state) {
          console.log('❌ Please specify a state: node collect-and-verify.js verify-only CA');
          process.exit(1);
        }
        console.log(`🔍 Running verification-only for ${state}...`);
        await system.collectAndVerifyState(state.toUpperCase(), {
          skipCollection: true,
          skipVerification: false,
          generateReport: true
        });
        break;
        
      default:
        console.log('📋 Comprehensive Legal Data System Usage:');
        console.log('  node collect-and-verify.js pilot        # Collect and verify CA, NY (recommended)');
        console.log('  node collect-and-verify.js ca           # California only');
        console.log('  node collect-and-verify.js ny           # New York only');
        console.log('  node collect-and-verify.js all          # All supported states');
        console.log('  node collect-and-verify.js verify-only CA # Verify existing data only');
        console.log('\n🎯 This system collects fresh data AND verifies all lawyer licenses');
        console.log('🔍 Recommended: Start with "pilot" to test the complete system');
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await system.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { ComprehensiveDataSystem };
