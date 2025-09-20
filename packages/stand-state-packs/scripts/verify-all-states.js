#!/usr/bin/env node
/*
 * All States License Verification System
 * Comprehensive verification and quality reporting for all 50 states + DC
 */

const fs = require('fs');
const path = require('path');
const { LicenseVerificationService } = require('./license-verification');

class AllStatesVerificationSystem extends LicenseVerificationService {
  constructor() {
    super();
    this.allStates = [
      'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 
      'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 
      'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 
      'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
      'WV', 'WI', 'WY'
    ];
  }

  async verifyAllStates() {
    console.log('🇺🇸 VERIFYING ALL STATES LICENSE DATA...');
    console.log(`📋 Processing ${this.allStates.length} states/territories\n`);

    const verificationSummary = {
      startTime: new Date(),
      totalStates: this.allStates.length,
      processedStates: 0,
      totalLawyers: 0,
      verifiedLawyers: 0,
      activeLawyers: 0,
      errors: [],
      stateResults: []
    };

    for (const stateCode of this.allStates) {
      console.log(`🏛️ Verifying ${stateCode}...`);
      
      try {
        // Run verification for this state
        await this.verifyState(stateCode);
        
        // Generate report for this state
        const report = await this.generateVerificationReport(stateCode);
        
        // Add to summary
        verificationSummary.processedStates++;
        verificationSummary.totalLawyers += report.summary.totalLawyers;
        verificationSummary.verifiedLawyers += report.summary.verifiedLawyers;
        verificationSummary.activeLawyers += report.summary.activeLawyers;
        
        verificationSummary.stateResults.push({
          state: stateCode,
          totalLawyers: report.summary.totalLawyers,
          verifiedLawyers: report.summary.verifiedLawyers,
          verificationRate: report.summary.verificationRate,
          activeLawyers: report.summary.activeLawyers,
          counties: report.counties.length
        });
        
        console.log(`  ✅ ${stateCode}: ${report.summary.verifiedLawyers}/${report.summary.totalLawyers} verified (${report.summary.verificationRate}%)`);
        
      } catch (error) {
        console.log(`  ❌ ${stateCode}: Error - ${error.message}`);
        verificationSummary.errors.push({
          state: stateCode,
          error: error.message
        });
      }
      
      // Brief pause between states
      await this.delay(1000);
    }

    verificationSummary.endTime = new Date();
    verificationSummary.processingTime = verificationSummary.endTime - verificationSummary.startTime;
    verificationSummary.overallVerificationRate = verificationSummary.totalLawyers > 0 
      ? Math.round((verificationSummary.verifiedLawyers / verificationSummary.totalLawyers) * 100)
      : 0;

    // Save comprehensive verification summary
    await this.saveVerificationSummary(verificationSummary);
    
    return verificationSummary;
  }

  async saveVerificationSummary(summary) {
    const summaryPath = path.join(__dirname, '..', 'reports', 'all-states-verification-summary.json');
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(summaryPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    // Display final results
    console.log('\n🇺🇸 ALL STATES VERIFICATION COMPLETE!');
    console.log('=' .repeat(70));
    console.log(`📊 Final Statistics:`);
    console.log(`   States Processed: ${summary.processedStates}/${summary.totalStates}`);
    console.log(`   Total Lawyers: ${summary.totalLawyers}`);
    console.log(`   Verified Lawyers: ${summary.verifiedLawyers} (${summary.overallVerificationRate}%)`);
    console.log(`   Active Lawyers: ${summary.activeLawyers}`);
    console.log(`   Processing Time: ${Math.round(summary.processingTime / 1000 / 60)} minutes`);
    console.log(`   Errors: ${summary.errors.length}`);

    if (summary.errors.length > 0) {
      console.log(`\n❌ States with Errors:`);
      summary.errors.forEach(error => {
        console.log(`   ${error.state}: ${error.error}`);
      });
    }

    // Top performing states
    const topStates = summary.stateResults
      .filter(s => s.totalLawyers > 0)
      .sort((a, b) => b.verificationRate - a.verificationRate)
      .slice(0, 10);

    console.log(`\n🏆 Top 10 States by Verification Rate:`);
    topStates.forEach((state, index) => {
      console.log(`   ${index + 1}. ${state.state}: ${state.verificationRate}% (${state.verifiedLawyers}/${state.totalLawyers})`);
    });

    console.log(`\n📋 Summary saved: ${summaryPath}`);
  }

  async generateNationalQualityReport() {
    console.log('\n📊 Generating National Data Quality Report...');
    
    const qualityReportPath = path.join(__dirname, '..', 'reports', 'national-quality-report.json');
    
    const qualityReport = {
      generatedAt: new Date().toISOString(),
      scope: 'All 50 States + DC',
      totalStates: this.allStates.length,
      dataQuality: {
        overall: 'Unknown',
        score: 0,
        factors: []
      },
      coverage: {
        statesWithData: 0,
        totalCounties: 0,
        averageLawyersPerState: 0,
        averageMediatorsPerState: 0
      },
      verification: {
        totalLawyers: 0,
        verifiedLawyers: 0,
        verificationRate: 0,
        activeLawyers: 0
      },
      diversity: {
        languageSupport: {},
        specializations: {},
        experienceDistribution: {
          '0-5 years': 0,
          '6-10 years': 0,
          '11-15 years': 0,
          '16-20 years': 0,
          '20+ years': 0
        }
      },
      recommendations: []
    };

    let totalLawyers = 0;
    let totalMediators = 0;
    let totalCounties = 0;
    let statesWithData = 0;

    // Analyze each state
    for (const stateCode of this.allStates) {
      const statePath = path.join(__dirname, '..', 'states', stateCode.toLowerCase());
      
      if (!fs.existsSync(statePath)) continue;

      const counties = fs.readdirSync(statePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      let stateLawyers = 0;
      let stateMediators = 0;
      let hasData = false;

      for (const county of counties) {
        const lawyersPath = path.join(statePath, county, 'lawyers.json');
        const familyPath = path.join(statePath, county, 'family.json');

        if (fs.existsSync(lawyersPath)) {
          const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
          if (lawyersData.lawyers && lawyersData.lawyers.length > 0) {
            stateLawyers += lawyersData.lawyers.length;
            hasData = true;

            // Analyze lawyer data
            lawyersData.lawyers.forEach(lawyer => {
              totalLawyers++;
              
              if (lawyer.verified) qualityReport.verification.verifiedLawyers++;
              if (lawyer.isActive) qualityReport.verification.activeLawyers++;

              // Language analysis
              if (lawyer.languages && Array.isArray(lawyer.languages)) {
                lawyer.languages.forEach(lang => {
                  qualityReport.diversity.languageSupport[lang] = 
                    (qualityReport.diversity.languageSupport[lang] || 0) + 1;
                });
              }

              // Specialization analysis
              if (lawyer.practice) {
                const practices = lawyer.practice.split(', ');
                practices.forEach(practice => {
                  qualityReport.diversity.specializations[practice] = 
                    (qualityReport.diversity.specializations[practice] || 0) + 1;
                });
              }

              // Experience analysis
              if (lawyer.experience) {
                const years = parseInt(lawyer.experience.match(/\d+/)?.[0] || '0');
                if (years <= 5) qualityReport.diversity.experienceDistribution['0-5 years']++;
                else if (years <= 10) qualityReport.diversity.experienceDistribution['6-10 years']++;
                else if (years <= 15) qualityReport.diversity.experienceDistribution['11-15 years']++;
                else if (years <= 20) qualityReport.diversity.experienceDistribution['16-20 years']++;
                else qualityReport.diversity.experienceDistribution['20+ years']++;
              }
            });
          }
        }

        if (fs.existsSync(familyPath)) {
          const familyData = JSON.parse(fs.readFileSync(familyPath, 'utf8'));
          if (familyData.mediators && familyData.mediators.length > 0) {
            stateMediators += familyData.mediators.length;
            hasData = true;
          }
        }
      }

      if (hasData) {
        statesWithData++;
        totalCounties += counties.length;
        totalMediators += stateMediators;
      }
    }

    // Calculate metrics
    qualityReport.coverage.statesWithData = statesWithData;
    qualityReport.coverage.totalCounties = totalCounties;
    qualityReport.coverage.averageLawyersPerState = statesWithData > 0 ? Math.round(totalLawyers / statesWithData) : 0;
    qualityReport.coverage.averageMediatorsPerState = statesWithData > 0 ? Math.round(totalMediators / statesWithData) : 0;

    qualityReport.verification.totalLawyers = totalLawyers;
    qualityReport.verification.verificationRate = totalLawyers > 0 
      ? Math.round((qualityReport.verification.verifiedLawyers / totalLawyers) * 100) : 0;

    // Calculate quality score
    let qualityScore = 0;
    const factors = [];

    // Factor 1: Coverage (40 points max)
    const coverageRate = (statesWithData / this.allStates.length) * 100;
    if (coverageRate >= 90) {
      qualityScore += 40;
      factors.push('Excellent state coverage (≥90%)');
    } else if (coverageRate >= 75) {
      qualityScore += 30;
      factors.push('Good state coverage (75-89%)');
    } else if (coverageRate >= 50) {
      qualityScore += 20;
      factors.push('Moderate state coverage (50-74%)');
    } else {
      qualityScore += 10;
      factors.push('Limited state coverage (<50%)');
    }

    // Factor 2: Verification Rate (30 points max)
    const verificationRate = qualityReport.verification.verificationRate;
    if (verificationRate >= 95) {
      qualityScore += 30;
      factors.push('Excellent verification rate (≥95%)');
    } else if (verificationRate >= 85) {
      qualityScore += 25;
      factors.push('Very good verification rate (85-94%)');
    } else if (verificationRate >= 70) {
      qualityScore += 20;
      factors.push('Good verification rate (70-84%)');
    } else {
      qualityScore += 10;
      factors.push('Needs improvement in verification (<70%)');
    }

    // Factor 3: Data Volume (20 points max)
    if (totalLawyers >= 200) {
      qualityScore += 20;
      factors.push('Comprehensive lawyer database (≥200 lawyers)');
    } else if (totalLawyers >= 100) {
      qualityScore += 15;
      factors.push('Substantial lawyer database (100-199 lawyers)');
    } else if (totalLawyers >= 50) {
      qualityScore += 10;
      factors.push('Moderate lawyer database (50-99 lawyers)');
    } else {
      qualityScore += 5;
      factors.push('Small lawyer database (<50 lawyers)');
    }

    // Factor 4: Diversity (10 points max)
    const languageCount = Object.keys(qualityReport.diversity.languageSupport).length;
    const specializationCount = Object.keys(qualityReport.diversity.specializations).length;
    
    if (languageCount >= 5 && specializationCount >= 10) {
      qualityScore += 10;
      factors.push('Excellent diversity in languages and specializations');
    } else if (languageCount >= 3 && specializationCount >= 7) {
      qualityScore += 7;
      factors.push('Good diversity in languages and specializations');
    } else {
      qualityScore += 3;
      factors.push('Limited diversity in languages and specializations');
    }

    qualityReport.dataQuality.score = qualityScore;
    qualityReport.dataQuality.factors = factors;

    // Determine overall quality
    if (qualityScore >= 85) {
      qualityReport.dataQuality.overall = 'Excellent';
    } else if (qualityScore >= 70) {
      qualityReport.dataQuality.overall = 'Good';
    } else if (qualityScore >= 50) {
      qualityReport.dataQuality.overall = 'Fair';
    } else {
      qualityReport.dataQuality.overall = 'Poor';
    }

    // Generate recommendations
    if (coverageRate < 90) {
      qualityReport.recommendations.push(`Expand data collection to remaining ${this.allStates.length - statesWithData} states`);
    }
    
    if (verificationRate < 85) {
      qualityReport.recommendations.push('Improve license verification processes');
    }
    
    if (totalLawyers < 200) {
      qualityReport.recommendations.push('Increase lawyer data collection efforts');
    }
    
    if (languageCount < 5) {
      qualityReport.recommendations.push('Expand multilingual lawyer representation');
    }
    
    if (qualityReport.recommendations.length === 0) {
      qualityReport.recommendations.push('Excellent data quality - maintain current standards and regular updates');
    }

    // Save report
    fs.writeFileSync(qualityReportPath, JSON.stringify(qualityReport, null, 2));

    // Display results
    console.log('\n📊 NATIONAL DATA QUALITY REPORT');
    console.log('=' .repeat(60));
    console.log(`🎯 Overall Quality: ${qualityReport.dataQuality.overall} (${qualityReport.dataQuality.score}/100)`);
    console.log(`📍 Coverage: ${statesWithData}/${this.allStates.length} states (${Math.round(coverageRate)}%)`);
    console.log(`⚖️ Total Lawyers: ${totalLawyers}`);
    console.log(`✅ Verification Rate: ${qualityReport.verification.verificationRate}%`);
    console.log(`🌍 Counties Covered: ${totalCounties}`);
    console.log(`👥 Total Mediators: ${totalMediators}`);

    console.log(`\n🗣️ Language Support (Top 5):`);
    Object.entries(qualityReport.diversity.languageSupport)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([lang, count]) => {
        console.log(`   ${lang}: ${count} lawyers`);
      });

    console.log(`\n⚖️ Top Specializations (Top 5):`);
    Object.entries(qualityReport.diversity.specializations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([spec, count]) => {
        console.log(`   ${spec}: ${count} lawyers`);
      });

    console.log(`\n📈 Experience Distribution:`);
    Object.entries(qualityReport.diversity.experienceDistribution).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} lawyers`);
    });

    console.log(`\n💡 Recommendations:`);
    qualityReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log(`\n📋 Report saved: ${qualityReportPath}`);
    
    return qualityReport;
  }
}

// Main execution
async function main() {
  const verifier = new AllStatesVerificationSystem();
  
  try {
    const initialized = await verifier.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize verification system');
      process.exit(1);
    }
    
    const args = process.argv.slice(2);
    const command = args[0] || 'all';
    
    switch (command) {
      case 'all':
      case 'verify-all':
        console.log('🇺🇸 Running complete verification for all states...');
        await verifier.verifyAllStates();
        await verifier.generateNationalQualityReport();
        break;
        
      case 'verify-only':
        console.log('🔍 Running verification only (no quality report)...');
        await verifier.verifyAllStates();
        break;
        
      case 'quality-only':
        console.log('📊 Generating quality report only...');
        await verifier.generateNationalQualityReport();
        break;
        
      default:
        console.log('📋 All States Verification System Usage:');
        console.log('  node verify-all-states.js all          # Verify all states + generate quality report');
        console.log('  node verify-all-states.js verify-only  # Verification only');
        console.log('  node verify-all-states.js quality-only # Quality report only');
        console.log('\n🇺🇸 This system verifies and analyzes data quality across all 50 states + DC');
        break;
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await verifier.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { AllStatesVerificationSystem };
