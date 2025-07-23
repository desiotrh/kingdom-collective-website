/**
 * Kingdom Studios - Performance Test Scenarios
 * Specific test scenarios for 10K, 50K, 100K simulated users
 * Detailed monitoring and reporting for each scenario
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
import { logger } from './src/utils/logger.js';

class PerformanceTestScenarios {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
        this.scenarios = {
            '10k-users': {
                name: '10,000 Users Test',
                userCount: 10000,
                duration: 300000, // 5 minutes
                rampUpTime: 60000, // 1 minute
                rampDownTime: 60000, // 1 minute
                expectedThroughput: 1000, // requests per second
                expectedLatency: 500, // milliseconds
                maxErrorRate: 2, // percentage
            },
            '50k-users': {
                name: '50,000 Users Test',
                userCount: 50000,
                duration: 600000, // 10 minutes
                rampUpTime: 120000, // 2 minutes
                rampDownTime: 120000, // 2 minutes
                expectedThroughput: 5000, // requests per second
                expectedLatency: 800, // milliseconds
                maxErrorRate: 3, // percentage
            },
            '100k-users': {
                name: '100,000 Users Test',
                userCount: 100000,
                duration: 900000, // 15 minutes
                rampUpTime: 180000, // 3 minutes
                rampDownTime: 180000, // 3 minutes
                expectedThroughput: 10000, // requests per second
                expectedLatency: 1000, // milliseconds
                maxErrorRate: 5, // percentage
            },
        };

        this.appEndpoints = {
            'kingdom-lens': [
                { path: '/lens/photos', weight: 30 },
                { path: '/lens/galleries', weight: 25 },
                { path: '/lens/ai-composition', weight: 20 },
                { path: '/lens/drone-support', weight: 15 },
                { path: '/lens/vr-galleries', weight: 10 },
            ],
            'kingdom-launchpad': [
                { path: '/launchpad/content', weight: 35 },
                { path: '/launchpad/ai-generation', weight: 25 },
                { path: '/launchpad/analytics', weight: 20 },
                { path: '/launchpad/calendar', weight: 20 },
            ],
            'kingdom-clips': [
                { path: '/clips/videos', weight: 30 },
                { path: '/clips/edit', weight: 25 },
                { path: '/clips/rendering', weight: 20 },
                { path: '/clips/ai-enhancement', weight: 25 },
            ],
            'kingdom-circle': [
                { path: '/circle/groups', weight: 30 },
                { path: '/circle/messages', weight: 35 },
                { path: '/circle/events', weight: 20 },
                { path: '/circle/mentorship', weight: 15 },
            ],
            'kingdom-voice': [
                { path: '/voice/audio', weight: 30 },
                { path: '/voice/podcasts', weight: 25 },
                { path: '/voice/ai', weight: 25 },
                { path: '/voice/edit', weight: 20 },
            ],
        };

        this.results = {
            scenarios: {},
            summary: {
                totalScenarios: 0,
                passedScenarios: 0,
                failedScenarios: 0,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                peakThroughput: 0,
                totalErrors: 0,
            },
            alerts: [],
            recommendations: [],
        };
    }

    /**
     * Run all performance test scenarios
     */
    async runAllScenarios() {
        logger.info('🚀 Starting performance test scenarios...');

        try {
            // Pre-test setup
            await this.performPreTestSetup();

            // Run each scenario
            for (const [scenarioId, scenario] of Object.entries(this.scenarios)) {
                await this.runScenario(scenarioId, scenario);
            }

            // Post-test analysis
            await this.performPostTestAnalysis();

            // Generate detailed report
            await this.generateDetailedReport();

            logger.info('✅ All performance test scenarios completed');
        } catch (error) {
            logger.error('❌ Performance test scenarios failed:', error);
            throw error;
        }
    }

    /**
     * Run specific scenario
     */
    async runScenario(scenarioId, scenario) {
        logger.info(`🧪 Running scenario: ${scenario.name} (${scenario.userCount} users)`);

        const scenarioResults = {
            scenarioId,
            scenarioName: scenario.name,
            userCount: scenario.userCount,
            startTime: Date.now(),
            endTime: null,
            phases: {
                rampUp: { startTime: null, endTime: null, metrics: {} },
                steadyState: { startTime: null, endTime: null, metrics: {} },
                rampDown: { startTime: null, endTime: null, metrics: {} },
            },
            requests: [],
            errors: [],
            metrics: {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                p50ResponseTime: 0,
                p95ResponseTime: 0,
                p99ResponseTime: 0,
                throughput: 0,
                errorRate: 0,
                peakConcurrency: 0,
                memoryUsage: 0,
                cpuUsage: 0,
            },
            alerts: [],
            passed: false,
        };

        try {
            // Phase 1: Ramp Up
            await this.runRampUpPhase(scenarioResults, scenario);

            // Phase 2: Steady State
            await this.runSteadyStatePhase(scenarioResults, scenario);

            // Phase 3: Ramp Down
            await this.runRampDownPhase(scenarioResults, scenario);

            // Calculate final metrics
            this.calculateScenarioMetrics(scenarioResults);

            // Evaluate scenario success
            this.evaluateScenarioSuccess(scenarioResults, scenario);

            // Store results
            this.results.scenarios[scenarioId] = scenarioResults;
            this.results.summary.totalScenarios++;

            if (scenarioResults.passed) {
                this.results.summary.passedScenarios++;
                logger.info(`✅ Scenario ${scenario.name} PASSED`);
            } else {
                this.results.summary.failedScenarios++;
                logger.warn(`❌ Scenario ${scenario.name} FAILED`);
            }

        } catch (error) {
            logger.error(`❌ Scenario ${scenario.name} failed:`, error);
            scenarioResults.errors.push(error);
            this.results.summary.failedScenarios++;
        }
    }

    /**
     * Run ramp up phase
     */
    async runRampUpPhase(scenarioResults, scenario) {
        logger.info(`📈 Starting ramp up phase for ${scenario.userCount} users over ${scenario.rampUpTime}ms`);

        scenarioResults.phases.rampUp.startTime = Date.now();

        const interval = 1000; // 1 second intervals
        const steps = scenario.rampUpTime / interval;
        const userIncrement = scenario.userCount / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(userIncrement * i);
            await this.simulateUsers(currentUsers, scenarioResults, 'rampUp');
            await this.sleep(interval);
        }

        scenarioResults.phases.rampUp.endTime = Date.now();
        logger.info(`✅ Ramp up phase completed`);
    }

    /**
     * Run steady state phase
     */
    async runSteadyStatePhase(scenarioResults, scenario) {
        logger.info(`⚡ Starting steady state phase for ${scenario.userCount} users for ${scenario.duration}ms`);

        scenarioResults.phases.steadyState.startTime = Date.now();

        const interval = 1000; // 1 second intervals
        const steps = scenario.duration / interval;

        for (let i = 0; i < steps; i++) {
            await this.simulateUsers(scenario.userCount, scenarioResults, 'steadyState');
            await this.sleep(interval);
        }

        scenarioResults.phases.steadyState.endTime = Date.now();
        logger.info(`✅ Steady state phase completed`);
    }

    /**
     * Run ramp down phase
     */
    async runRampDownPhase(scenarioResults, scenario) {
        logger.info(`📉 Starting ramp down phase for ${scenario.userCount} users over ${scenario.rampDownTime}ms`);

        scenarioResults.phases.rampDown.startTime = Date.now();

        const interval = 1000; // 1 second intervals
        const steps = scenario.rampDownTime / interval;
        const userDecrement = scenario.userCount / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(scenario.userCount - (userDecrement * i));
            await this.simulateUsers(currentUsers, scenarioResults, 'rampDown');
            await this.sleep(interval);
        }

        scenarioResults.phases.rampDown.endTime = Date.now();
        scenarioResults.endTime = Date.now();
        logger.info(`✅ Ramp down phase completed`);
    }

    /**
     * Simulate users for specific phase
     */
    async simulateUsers(userCount, scenarioResults, phase) {
        const promises = [];
        const requestsPerUser = 3; // Each user makes 3 requests per interval

        for (let i = 0; i < userCount; i++) {
            for (let j = 0; j < requestsPerUser; j++) {
                promises.push(this.simulateRequest(i, scenarioResults, phase));
            }
        }

        // Execute requests with controlled concurrency
        const batchSize = 500; // Process 500 requests at a time
        for (let i = 0; i < promises.length; i += batchSize) {
            const batch = promises.slice(i, i + batchSize);
            await Promise.allSettled(batch);
        }
    }

    /**
     * Simulate individual request
     */
    async simulateRequest(userId, scenarioResults, phase) {
        const startTime = performance.now();
        const requestId = `user_${userId}_${Date.now()}_${phase}`;

        try {
            // Randomly select an app and endpoint
            const appIds = Object.keys(this.appEndpoints);
            const selectedApp = appIds[Math.floor(Math.random() * appIds.length)];
            const endpoints = this.appEndpoints[selectedApp];

            // Weighted endpoint selection
            const totalWeight = endpoints.reduce((sum, endpoint) => sum + endpoint.weight, 0);
            let randomWeight = Math.random() * totalWeight;
            let selectedEndpoint = endpoints[0];

            for (const endpoint of endpoints) {
                randomWeight -= endpoint.weight;
                if (randomWeight <= 0) {
                    selectedEndpoint = endpoint;
                    break;
                }
            }

            const response = await axios({
                method: 'GET',
                url: `${this.baseURL}${selectedEndpoint.path}`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId,
                    'X-User-ID': userId.toString(),
                    'X-App-ID': selectedApp,
                    'X-Phase': phase,
                },
                timeout: 30000, // 30 second timeout
            });

            const responseTime = performance.now() - startTime;

            // Record successful request
            this.recordRequest(scenarioResults, {
                requestId,
                userId,
                appId: selectedApp,
                endpoint: selectedEndpoint.path,
                responseTime,
                statusCode: response.status,
                success: true,
                phase,
            });

            return response.data;
        } catch (error) {
            const responseTime = performance.now() - startTime;

            // Record failed request
            this.recordRequest(scenarioResults, {
                requestId,
                userId,
                appId: 'unknown',
                endpoint: error.config?.url || 'unknown',
                responseTime,
                statusCode: error.response?.status || 0,
                success: false,
                error: error.message,
                phase,
            });

            throw error;
        }
    }

    /**
     * Record request metrics
     */
    recordRequest(scenarioResults, requestData) {
        // Update global metrics
        this.results.summary.totalRequests++;

        if (requestData.success) {
            this.results.summary.successfulRequests++;
        } else {
            this.results.summary.failedRequests++;
            this.results.summary.totalErrors++;
        }

        // Update scenario metrics
        scenarioResults.requests.push(requestData);
        scenarioResults.metrics.totalRequests++;

        if (requestData.success) {
            scenarioResults.metrics.successfulRequests++;
        } else {
            scenarioResults.metrics.failedRequests++;
        }

        // Update phase-specific metrics
        const phaseMetrics = scenarioResults.phases[requestData.phase].metrics;
        if (!phaseMetrics.requests) phaseMetrics.requests = [];
        phaseMetrics.requests.push(requestData);

        // Update average response time
        const allResponseTimes = scenarioResults.requests.map(r => r.responseTime);
        scenarioResults.metrics.averageResponseTime =
            allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length;
    }

    /**
     * Calculate scenario metrics
     */
    calculateScenarioMetrics(scenarioResults) {
        const responseTimes = scenarioResults.requests.map(r => r.responseTime);
        const sortedTimes = responseTimes.sort((a, b) => a - b);

        scenarioResults.metrics = {
            ...scenarioResults.metrics,
            p50ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0,
            p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0,
            p99ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0,
            throughput: scenarioResults.requests.length / (scenarioResults.duration / 1000),
            errorRate: (scenarioResults.metrics.failedRequests / scenarioResults.metrics.totalRequests) * 100,
            peakConcurrency: Math.max(...scenarioResults.requests.map(r => r.userId)),
        };

        // Calculate phase-specific metrics
        for (const [phaseName, phase] of Object.entries(scenarioResults.phases)) {
            if (phase.requests && phase.requests.length > 0) {
                const phaseResponseTimes = phase.requests.map(r => r.responseTime);
                const sortedPhaseTimes = phaseResponseTimes.sort((a, b) => a - b);

                phase.metrics = {
                    totalRequests: phase.requests.length,
                    successfulRequests: phase.requests.filter(r => r.success).length,
                    failedRequests: phase.requests.filter(r => !r.success).length,
                    averageResponseTime: phaseResponseTimes.reduce((sum, time) => sum + time, 0) / phaseResponseTimes.length,
                    p95ResponseTime: sortedPhaseTimes[Math.floor(sortedPhaseTimes.length * 0.95)] || 0,
                    throughput: phase.requests.length / ((phase.endTime - phase.startTime) / 1000),
                    errorRate: (phase.requests.filter(r => !r.success).length / phase.requests.length) * 100,
                };
            }
        }

        scenarioResults.duration = scenarioResults.endTime - scenarioResults.startTime;
    }

    /**
     * Evaluate scenario success
     */
    evaluateScenarioSuccess(scenarioResults, scenario) {
        const alerts = [];
        let passed = true;

        // Check throughput
        if (scenarioResults.metrics.throughput < scenario.expectedThroughput * 0.8) {
            alerts.push({
                type: 'low_throughput',
                message: `Throughput ${scenarioResults.metrics.throughput.toFixed(1)} req/s is below 80% of expected ${scenario.expectedThroughput} req/s`,
                severity: 'critical',
            });
            passed = false;
        }

        // Check latency
        if (scenarioResults.metrics.p95 > scenario.expectedLatency) {
            alerts.push({
                type: 'high_latency',
                message: `P95 latency ${scenarioResults.metrics.p95.toFixed(0)}ms exceeds expected ${scenario.expectedLatency}ms`,
                severity: 'warning',
            });
            passed = false;
        }

        // Check error rate
        if (scenarioResults.metrics.errorRate > scenario.maxErrorRate) {
            alerts.push({
                type: 'high_error_rate',
                message: `Error rate ${scenarioResults.metrics.errorRate.toFixed(1)}% exceeds maximum ${scenario.maxErrorRate}%`,
                severity: 'critical',
            });
            passed = false;
        }

        // Check if any phase had issues
        for (const [phaseName, phase] of Object.entries(scenarioResults.phases)) {
            if (phase.metrics && phase.metrics.errorRate > scenario.maxErrorRate * 1.5) {
                alerts.push({
                    type: 'phase_high_error_rate',
                    message: `${phaseName} phase error rate ${phase.metrics.errorRate.toFixed(1)}% is very high`,
                    severity: 'warning',
                });
            }
        }

        scenarioResults.alerts = alerts;
        scenarioResults.passed = passed;

        // Update global summary
        this.results.summary.averageResponseTime =
            (this.results.summary.averageResponseTime + scenarioResults.metrics.averageResponseTime) / 2;

        if (scenarioResults.metrics.throughput > this.results.summary.peakThroughput) {
            this.results.summary.peakThroughput = scenarioResults.metrics.throughput;
        }
    }

    /**
     * Perform pre-test setup
     */
    async performPreTestSetup() {
        logger.info('🔧 Performing pre-test setup...');

        try {
            // Health check
            await this.performHealthCheck();

            // Clear any existing test data
            await this.clearTestData();

            // Warm up the system
            await this.warmUpSystem();

            logger.info('✅ Pre-test setup completed');
        } catch (error) {
            throw new Error(`Pre-test setup failed: ${error.message}`);
        }
    }

    /**
     * Perform health check
     */
    async performHealthCheck() {
        try {
            const response = await axios.get(`${this.baseURL}/health/multi-app`);
            if (response.status !== 200) {
                throw new Error('Health check failed');
            }
            logger.info('✅ Health check passed');
        } catch (error) {
            throw new Error(`Health check failed: ${error.message}`);
        }
    }

    /**
     * Clear test data
     */
    async clearTestData() {
        try {
            await axios.post(`${this.baseURL}/test/clear-data`);
            logger.info('✅ Test data cleared');
        } catch (error) {
            logger.warn('⚠️ Could not clear test data:', error.message);
        }
    }

    /**
     * Warm up system
     */
    async warmUpSystem() {
        logger.info('🔥 Warming up system...');

        // Make a few requests to warm up the system
        const warmUpRequests = [];
        for (let i = 0; i < 100; i++) {
            warmUpRequests.push(this.simulateWarmUpRequest());
        }

        await Promise.allSettled(warmUpRequests);
        logger.info('✅ System warmed up');
    }

    /**
     * Simulate warm up request
     */
    async simulateWarmUpRequest() {
        try {
            const appIds = Object.keys(this.appEndpoints);
            const selectedApp = appIds[Math.floor(Math.random() * appIds.length)];
            const endpoints = this.appEndpoints[selectedApp];
            const selectedEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

            await axios.get(`${this.baseURL}${selectedEndpoint.path}`, {
                headers: {
                    'X-Warm-Up': 'true',
                },
                timeout: 5000,
            });
        } catch (error) {
            // Ignore warm-up errors
        }
    }

    /**
     * Perform post-test analysis
     */
    async performPostTestAnalysis() {
        logger.info('📊 Performing post-test analysis...');

        // Analyze overall performance
        this.analyzeOverallPerformance();

        // Generate recommendations
        this.generateRecommendations();

        // Check for performance regressions
        this.checkPerformanceRegressions();

        logger.info('✅ Post-test analysis completed');
    }

    /**
     * Analyze overall performance
     */
    analyzeOverallPerformance() {
        const totalRequests = this.results.summary.totalRequests;
        const errorRate = (this.results.summary.failedRequests / totalRequests) * 100;

        logger.info('📈 Overall Performance Analysis:');
        logger.info(`  Total Requests: ${totalRequests.toLocaleString()}`);
        logger.info(`  Success Rate: ${((1 - errorRate / 100) * 100).toFixed(2)}%`);
        logger.info(`  Error Rate: ${errorRate.toFixed(2)}%`);
        logger.info(`  Average Response Time: ${this.results.summary.averageResponseTime.toFixed(2)}ms`);
        logger.info(`  Peak Throughput: ${this.results.summary.peakThroughput.toFixed(1)} req/s`);

        // Analyze each scenario
        for (const [scenarioId, scenario] of Object.entries(this.results.scenarios)) {
            logger.info(`\n📊 ${scenario.scenarioName}:`);
            logger.info(`  Status: ${scenario.passed ? 'PASSED' : 'FAILED'}`);
            logger.info(`  Throughput: ${scenario.metrics.throughput.toFixed(1)} req/s`);
            logger.info(`  P95 Latency: ${scenario.metrics.p95ResponseTime.toFixed(0)}ms`);
            logger.info(`  Error Rate: ${scenario.metrics.errorRate.toFixed(2)}%`);

            if (scenario.alerts.length > 0) {
                logger.warn(`  Alerts: ${scenario.alerts.length}`);
                scenario.alerts.forEach(alert => {
                    logger.warn(`    - ${alert.message}`);
                });
            }
        }
    }

    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Analyze error patterns
        const errorRate = (this.results.summary.failedRequests / this.results.summary.totalRequests) * 100;
        if (errorRate > 5) {
            recommendations.push('High error rate detected - investigate error sources and improve error handling');
        }

        // Analyze latency patterns
        const avgLatency = this.results.summary.averageResponseTime;
        if (avgLatency > 1000) {
            recommendations.push('High average latency detected - optimize database queries and caching');
        }

        // Analyze throughput patterns
        if (this.results.summary.peakThroughput < 5000) {
            recommendations.push('Low peak throughput detected - consider horizontal scaling');
        }

        // Analyze scenario-specific issues
        for (const [scenarioId, scenario] of Object.entries(this.results.scenarios)) {
            if (!scenario.passed) {
                recommendations.push(`Scenario ${scenario.scenarioName} failed - review and optimize performance bottlenecks`);
            }
        }

        this.results.recommendations = recommendations;
    }

    /**
     * Check performance regressions
     */
    checkPerformanceRegressions() {
        // Compare with baseline metrics
        const baselineMetrics = {
            '10k-users': { p95: 500, errorRate: 2 },
            '50k-users': { p95: 800, errorRate: 3 },
            '100k-users': { p95: 1000, errorRate: 5 },
        };

        for (const [scenarioId, scenario] of Object.entries(this.results.scenarios)) {
            const baseline = baselineMetrics[scenarioId];
            if (baseline) {
                if (scenario.metrics.p95ResponseTime > baseline.p95 * 1.2) {
                    logger.warn(`⚠️ Performance regression in ${scenario.scenarioName}: P95 increased by ${((scenario.metrics.p95ResponseTime / baseline.p95 - 1) * 100).toFixed(1)}%`);
                }

                if (scenario.metrics.errorRate > baseline.errorRate * 1.5) {
                    logger.warn(`⚠️ Error rate regression in ${scenario.scenarioName}: Error rate increased by ${((scenario.metrics.errorRate / baseline.errorRate - 1) * 100).toFixed(1)}%`);
                }
            }
        }
    }

    /**
     * Generate detailed report
     */
    async generateDetailedReport() {
        logger.info('📋 Generating detailed performance test report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            scenarios: this.results.scenarios,
            alerts: this.results.alerts,
            recommendations: this.results.recommendations,
            metadata: {
                testEnvironment: process.env.NODE_ENV || 'development',
                apiBaseUrl: this.baseURL,
                totalDuration: Object.values(this.results.scenarios).reduce((sum, scenario) => sum + scenario.duration, 0),
                appsTested: Object.keys(this.appEndpoints),
            },
        };

        // Save report to file
        const fs = await import('fs');
        fs.writeFileSync('performance-test-report.json', JSON.stringify(report, null, 2));

        logger.info('✅ Detailed performance test report generated and saved');

        return report;
    }

    /**
     * Utility method to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export the performance test scenarios
export default PerformanceTestScenarios;

// Run performance test scenarios if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const performanceTests = new PerformanceTestScenarios();
    performanceTests.runAllScenarios()
        .then(() => {
            logger.info('🎉 Performance test scenarios completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('💥 Performance test scenarios failed:', error);
            process.exit(1);
        });
} 