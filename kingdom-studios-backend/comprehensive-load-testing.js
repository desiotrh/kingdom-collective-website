/**
 * Kingdom Studios - Comprehensive Load Testing
 * Simulates 70-80% of each app's capacity and tests 10K, 50K, 100K users
 * Tests all five apps with app-specific scenarios
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
import { logger } from './src/utils/logger.js';

class ComprehensiveLoadTesting {
    constructor() {
        this.apps = {
            'kingdom-lens': {
                name: 'Kingdom Lens',
                maxUsers: 50000,
                testScenarios: [7000, 35000, 50000], // 70%, 70%, 100% of capacity
                endpoints: [
                    '/lens/photos',
                    '/lens/galleries',
                    '/lens/ai-composition',
                    '/lens/drone-support',
                    '/lens/vr-galleries'
                ],
                resourceIntensive: true,
                expectedLatency: 500,
            },
            'kingdom-launchpad': {
                name: 'Kingdom Launchpad',
                maxUsers: 100000,
                testScenarios: [14000, 70000, 100000], // 70%, 70%, 100% of capacity
                endpoints: [
                    '/launchpad/content',
                    '/launchpad/ai-generation',
                    '/launchpad/analytics',
                    '/launchpad/calendar'
                ],
                resourceIntensive: false,
                expectedLatency: 300,
            },
            'kingdom-clips': {
                name: 'Kingdom Clips',
                maxUsers: 30000,
                testScenarios: [4200, 21000, 30000], // 70%, 70%, 100% of capacity
                endpoints: [
                    '/clips/videos',
                    '/clips/edit',
                    '/clips/rendering',
                    '/clips/ai-enhancement'
                ],
                resourceIntensive: true,
                expectedLatency: 1000,
            },
            'kingdom-circle': {
                name: 'Kingdom Circle',
                maxUsers: 75000,
                testScenarios: [10500, 52500, 75000], // 70%, 70%, 100% of capacity
                endpoints: [
                    '/circle/groups',
                    '/circle/messages',
                    '/circle/events',
                    '/circle/mentorship'
                ],
                resourceIntensive: false,
                expectedLatency: 200,
            },
            'kingdom-voice': {
                name: 'Kingdom Voice',
                maxUsers: 25000,
                testScenarios: [3500, 17500, 25000], // 70%, 70%, 100% of capacity
                endpoints: [
                    '/voice/audio',
                    '/voice/podcasts',
                    '/voice/ai',
                    '/voice/edit'
                ],
                resourceIntensive: true,
                expectedLatency: 800,
            }
        };

        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
        this.results = {
            summary: {
                totalTests: 0,
                successfulTests: 0,
                failedTests: 0,
                averageResponseTime: 0,
                peakConcurrency: 0,
            },
            apps: {},
            scenarios: {},
            alerts: [],
        };
    }

    /**
     * Run comprehensive load testing for all apps
     */
    async runComprehensiveLoadTesting() {
        logger.info('🚀 Starting comprehensive load testing for all Kingdom Studios apps...');

        try {
            // Pre-test health check
            await this.performHealthCheck();

            // Test each app with different scenarios
            for (const [appId, appConfig] of Object.entries(this.apps)) {
                logger.info(`📊 Testing ${appConfig.name}...`);

                for (const userCount of appConfig.testScenarios) {
                    await this.testAppScenario(appId, appConfig, userCount);
                }
            }

            // Run cross-app scenarios
            await this.runCrossAppScenarios();

            // Run performance regression tests
            await this.runPerformanceRegressionTests();

            // Generate comprehensive report
            await this.generateComprehensiveReport();

            logger.info('✅ Comprehensive load testing completed successfully');
        } catch (error) {
            logger.error('❌ Comprehensive load testing failed:', error);
            throw error;
        }
    }

    /**
     * Test specific app scenario
     */
    async testAppScenario(appId, appConfig, userCount) {
        const scenarioName = `${appId}-${userCount}-users`;
        logger.info(`🧪 Testing ${appConfig.name} with ${userCount} users (${(userCount / appConfig.maxUsers * 100).toFixed(1)}% capacity)`);

        const scenarioResults = {
            appId,
            appName: appConfig.name,
            userCount,
            capacityPercentage: (userCount / appConfig.maxUsers) * 100,
            startTime: Date.now(),
            endTime: null,
            requests: [],
            errors: [],
            metrics: {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                p95ResponseTime: 0,
                p99ResponseTime: 0,
                throughput: 0,
                errorRate: 0,
                latencyExceeded: 0,
                memoryUsage: 0,
                cpuUsage: 0,
            }
        };

        try {
            // Ramp up users
            await this.rampUpUsers(appId, userCount, 60000); // 1 minute ramp up

            // Steady state testing
            await this.steadyStateTesting(appId, appConfig, userCount, 300000); // 5 minutes

            // Ramp down users
            await this.rampDownUsers(appId, userCount, 60000); // 1 minute ramp down

            // Calculate metrics
            this.calculateScenarioMetrics(scenarioResults);

            // Store results
            this.results.apps[appId] = this.results.apps[appId] || {};
            this.results.apps[appId][scenarioName] = scenarioResults;

            // Check for alerts
            this.checkScenarioAlerts(scenarioResults, appConfig);

            logger.info(`✅ ${appConfig.name} ${userCount} users test completed`);
        } catch (error) {
            logger.error(`❌ ${appConfig.name} ${userCount} users test failed:`, error);
            scenarioResults.errors.push(error);
        }
    }

    /**
     * Ramp up users for specific app
     */
    async rampUpUsers(appId, targetUsers, duration) {
        logger.info(`📈 Ramping up ${targetUsers} users for ${appId} over ${duration}ms`);

        const interval = 1000; // 1 second intervals
        const steps = duration / interval;
        const userIncrement = targetUsers / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(userIncrement * i);
            await this.simulateAppUsers(appId, currentUsers);
            await this.sleep(interval);
        }
    }

    /**
     * Steady state testing
     */
    async steadyStateTesting(appId, appConfig, userCount, duration) {
        logger.info(`⚡ Steady state testing ${userCount} users for ${appConfig.name} for ${duration}ms`);

        const startTime = Date.now();
        const interval = 1000; // 1 second intervals

        while (Date.now() - startTime < duration) {
            await this.simulateAppUsers(appId, userCount);
            await this.sleep(interval);
        }
    }

    /**
     * Ramp down users for specific app
     */
    async rampDownUsers(appId, targetUsers, duration) {
        logger.info(`📉 Ramping down ${targetUsers} users for ${appId} over ${duration}ms`);

        const interval = 1000; // 1 second intervals
        const steps = duration / interval;
        const userDecrement = targetUsers / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(targetUsers - (userDecrement * i));
            await this.simulateAppUsers(appId, currentUsers);
            await this.sleep(interval);
        }
    }

    /**
     * Simulate users for specific app
     */
    async simulateAppUsers(appId, userCount) {
        const appConfig = this.apps[appId];
        const promises = [];
        const requestsPerUser = 5; // Each user makes 5 requests

        for (let i = 0; i < userCount; i++) {
            for (let j = 0; j < requestsPerUser; j++) {
                promises.push(this.simulateAppRequest(appId, i));
            }
        }

        // Execute requests with controlled concurrency
        const batchSize = 1000; // Process 1000 requests at a time
        for (let i = 0; i < promises.length; i += batchSize) {
            const batch = promises.slice(i, i + batchSize);
            await Promise.allSettled(batch);
        }
    }

    /**
     * Simulate app-specific request
     */
    async simulateAppRequest(appId, userId) {
        const appConfig = this.apps[appId];
        const startTime = performance.now();
        const requestId = `${appId}_user_${userId}_${Date.now()}`;

        try {
            // Randomly select an endpoint for this app
            const endpoint = appConfig.endpoints[Math.floor(Math.random() * appConfig.endpoints.length)];

            const response = await axios({
                method: 'GET',
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId,
                    'X-User-ID': userId.toString(),
                    'X-App-ID': appId,
                },
                timeout: 30000, // 30 second timeout
            });

            const responseTime = performance.now() - startTime;

            // Record successful request
            this.recordAppRequest(appId, {
                requestId,
                userId,
                endpoint,
                responseTime,
                statusCode: response.status,
                success: true,
                appId,
            });

            return response.data;
        } catch (error) {
            const responseTime = performance.now() - startTime;

            // Record failed request
            this.recordAppRequest(appId, {
                requestId,
                userId,
                endpoint: error.config?.url || 'unknown',
                responseTime,
                statusCode: error.response?.status || 0,
                success: false,
                error: error.message,
                appId,
            });

            throw error;
        }
    }

    /**
     * Record app-specific request
     */
    recordAppRequest(appId, requestData) {
        // Update global metrics
        this.results.summary.totalRequests++;

        if (requestData.success) {
            this.results.summary.successfulRequests++;
        } else {
            this.results.summary.failedRequests++;
        }

        // Find the current scenario and update it
        for (const [appKey, appResults] of Object.entries(this.results.apps)) {
            if (appKey === appId) {
                for (const [scenarioKey, scenario] of Object.entries(appResults)) {
                    if (scenario.startTime && !scenario.endTime) {
                        scenario.requests.push(requestData);
                        scenario.metrics.totalRequests++;

                        if (requestData.success) {
                            scenario.metrics.successfulRequests++;
                        } else {
                            scenario.metrics.failedRequests++;
                        }

                        // Update average response time
                        scenario.metrics.averageResponseTime =
                            (scenario.metrics.averageResponseTime + requestData.responseTime) / 2;

                        break;
                    }
                }
            }
        }
    }

    /**
     * Run cross-app scenarios
     */
    async runCrossAppScenarios() {
        logger.info('🔄 Running cross-app scenarios...');

        const crossAppScenarios = [
            {
                name: 'Unified Authentication',
                apps: ['kingdom-lens', 'kingdom-launchpad', 'kingdom-circle'],
                userCount: 10000,
                duration: 120000, // 2 minutes
            },
            {
                name: 'Shared Storage',
                apps: ['kingdom-lens', 'kingdom-clips', 'kingdom-voice'],
                userCount: 5000,
                duration: 120000, // 2 minutes
            },
            {
                name: 'Cross-App Messaging',
                apps: ['kingdom-circle', 'kingdom-launchpad'],
                userCount: 8000,
                duration: 120000, // 2 minutes
            },
        ];

        for (const scenario of crossAppScenarios) {
            await this.runCrossAppScenario(scenario);
        }
    }

    /**
     * Run specific cross-app scenario
     */
    async runCrossAppScenario(scenario) {
        logger.info(`🔄 Running cross-app scenario: ${scenario.name}`);

        const startTime = Date.now();
        const promises = [];

        // Simulate users across multiple apps
        for (const appId of scenario.apps) {
            const usersPerApp = Math.floor(scenario.userCount / scenario.apps.length);
            for (let i = 0; i < usersPerApp; i++) {
                promises.push(this.simulateCrossAppRequest(appId, i, scenario.name));
            }
        }

        // Execute cross-app requests
        await Promise.allSettled(promises);

        const duration = Date.now() - startTime;
        logger.info(`✅ Cross-app scenario ${scenario.name} completed in ${duration}ms`);
    }

    /**
     * Simulate cross-app request
     */
    async simulateCrossAppRequest(appId, userId, scenarioName) {
        const startTime = performance.now();

        try {
            // Simulate cross-app authentication
            const authResponse = await axios.post(`${this.baseURL}/auth/unified-login`, {
                email: `user_${userId}@example.com`,
                password: 'testpassword123',
                appId: appId,
            });

            // Simulate cross-app feature usage
            const featureResponse = await axios.post(`${this.baseURL}/messaging/cross-app`, {
                fromApp: appId,
                toApp: 'kingdom-circle',
                message: `Test message from ${appId} user ${userId}`,
                userId: userId,
            });

            const responseTime = performance.now() - startTime;

            // Record cross-app metrics
            this.results.summary.crossAppFeatures = (this.results.summary.crossAppFeatures || 0) + 1;

            return { success: true, responseTime };
        } catch (error) {
            logger.error(`Cross-app request failed for ${appId}:`, error);
            throw error;
        }
    }

    /**
     * Run performance regression tests
     */
    async runPerformanceRegressionTests() {
        logger.info('📈 Running performance regression tests...');

        const baselineMetrics = {
            'kingdom-lens': { p95: 500, p99: 1000, errorRate: 0.01 },
            'kingdom-launchpad': { p95: 300, p99: 800, errorRate: 0.01 },
            'kingdom-clips': { p95: 1000, p99: 3000, errorRate: 0.02 },
            'kingdom-circle': { p95: 200, p99: 500, errorRate: 0.01 },
            'kingdom-voice': { p95: 800, p99: 2000, errorRate: 0.02 },
        };

        for (const [appId, appConfig] of Object.entries(this.apps)) {
            const baseline = baselineMetrics[appId];
            const currentMetrics = this.getCurrentAppMetrics(appId);

            // Check for performance regressions
            const regressions = [];

            if (currentMetrics.p95 > baseline.p95 * 1.2) {
                regressions.push(`P95 response time increased by ${((currentMetrics.p95 / baseline.p95 - 1) * 100).toFixed(1)}%`);
            }

            if (currentMetrics.p99 > baseline.p99 * 1.3) {
                regressions.push(`P99 response time increased by ${((currentMetrics.p99 / baseline.p99 - 1) * 100).toFixed(1)}%`);
            }

            if (currentMetrics.errorRate > baseline.errorRate * 2) {
                regressions.push(`Error rate increased by ${((currentMetrics.errorRate / baseline.errorRate - 1) * 100).toFixed(1)}%`);
            }

            if (regressions.length > 0) {
                logger.warn(`⚠️ Performance regressions detected for ${appConfig.name}:`);
                regressions.forEach(regression => logger.warn(`  - ${regression}`));
            } else {
                logger.info(`✅ No performance regressions detected for ${appConfig.name}`);
            }
        }
    }

    /**
     * Calculate scenario metrics
     */
    calculateScenarioMetrics(scenarioResults) {
        const responseTimes = scenarioResults.requests.map(r => r.responseTime);
        const sortedTimes = responseTimes.sort((a, b) => a - b);

        scenarioResults.metrics = {
            totalRequests: scenarioResults.requests.length,
            successfulRequests: scenarioResults.requests.filter(r => r.success).length,
            failedRequests: scenarioResults.requests.filter(r => !r.success).length,
            averageResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
            p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
            p99ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.99)],
            throughput: scenarioResults.requests.length / (scenarioResults.duration / 1000),
            errorRate: (scenarioResults.requests.filter(r => !r.success).length / scenarioResults.requests.length) * 100,
            latencyExceeded: responseTimes.filter(time => time > this.apps[scenarioResults.appId].expectedLatency).length,
        };

        scenarioResults.endTime = Date.now();
        scenarioResults.duration = scenarioResults.endTime - scenarioResults.startTime;
    }

    /**
     * Check scenario alerts
     */
    checkScenarioAlerts(scenarioResults, appConfig) {
        const alerts = [];

        // Check error rate
        if (scenarioResults.metrics.errorRate > 5) {
            alerts.push({
                type: 'high_error_rate',
                message: `Error rate ${scenarioResults.metrics.errorRate.toFixed(1)}% exceeds 5% threshold`,
                severity: 'critical',
            });
        }

        // Check latency
        if (scenarioResults.metrics.p95 > appConfig.expectedLatency) {
            alerts.push({
                type: 'high_latency',
                message: `P95 latency ${scenarioResults.metrics.p95.toFixed(0)}ms exceeds ${appConfig.expectedLatency}ms threshold`,
                severity: 'warning',
            });
        }

        // Check throughput
        if (scenarioResults.metrics.throughput < 100) {
            alerts.push({
                type: 'low_throughput',
                message: `Throughput ${scenarioResults.metrics.throughput.toFixed(1)} req/s is below 100 req/s threshold`,
                severity: 'warning',
            });
        }

        if (alerts.length > 0) {
            this.results.alerts.push({
                appId: scenarioResults.appId,
                scenario: `${scenarioResults.userCount}-users`,
                alerts: alerts,
            });
        }
    }

    /**
     * Get current app metrics
     */
    getCurrentAppMetrics(appId) {
        const appResults = this.results.apps[appId];
        if (!appResults) return { p95: 0, p99: 0, errorRate: 0 };

        const allRequests = [];
        for (const scenario of Object.values(appResults)) {
            allRequests.push(...scenario.requests);
        }

        const responseTimes = allRequests.map(r => r.responseTime);
        const sortedTimes = responseTimes.sort((a, b) => a - b);

        return {
            p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0,
            p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0,
            errorRate: (allRequests.filter(r => !r.success).length / allRequests.length) * 100,
        };
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
     * Generate comprehensive report
     */
    async generateComprehensiveReport() {
        logger.info('📊 Generating comprehensive load testing report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            apps: this.results.apps,
            alerts: this.results.alerts,
            recommendations: this.generateRecommendations(),
            capacityAnalysis: this.analyzeCapacity(),
        };

        // Log report summary
        logger.info('📈 Comprehensive Load Test Report Summary:');
        logger.info(`  Total Tests: ${report.summary.totalTests}`);
        logger.info(`  Successful: ${report.summary.successfulRequests}`);
        logger.info(`  Failed: ${report.summary.failedRequests}`);
        logger.info(`  Error Rate: ${((report.summary.failedRequests / report.summary.totalRequests) * 100).toFixed(2)}%`);
        logger.info(`  Average Response Time: ${report.summary.averageResponseTime.toFixed(2)}ms`);
        logger.info(`  Cross-App Features: ${report.summary.crossAppFeatures || 0}`);

        // Save report to file
        const fs = await import('fs');
        fs.writeFileSync('comprehensive-load-test-report.json', JSON.stringify(report, null, 2));

        logger.info('✅ Comprehensive load test report generated and saved');

        return report;
    }

    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Analyze each app's performance
        for (const [appId, appResults] of Object.entries(this.results.apps)) {
            const appConfig = this.apps[appId];

            for (const [scenarioKey, scenario] of Object.entries(appResults)) {
                if (scenario.metrics.errorRate > 5) {
                    recommendations.push(`High error rate in ${appConfig.name} (${scenario.metrics.errorRate.toFixed(1)}%) - investigate error sources`);
                }

                if (scenario.metrics.p95 > appConfig.expectedLatency) {
                    recommendations.push(`High latency in ${appConfig.name} (P95: ${scenario.metrics.p95.toFixed(0)}ms) - optimize performance`);
                }

                if (scenario.metrics.throughput < 100) {
                    recommendations.push(`Low throughput in ${appConfig.name} (${scenario.metrics.throughput.toFixed(1)} req/s) - consider scaling`);
                }
            }
        }

        return recommendations;
    }

    /**
     * Analyze capacity
     */
    analyzeCapacity() {
        const analysis = {};

        for (const [appId, appConfig] of Object.entries(this.apps)) {
            const appResults = this.results.apps[appId];
            if (!appResults) continue;

            analysis[appId] = {
                maxCapacity: appConfig.maxUsers,
                testedScenarios: Object.keys(appResults),
                performanceAtCapacity: {},
            };

            for (const [scenarioKey, scenario] of Object.entries(appResults)) {
                const capacityPercentage = scenario.capacityPercentage;
                analysis[appId].performanceAtCapacity[capacityPercentage] = {
                    errorRate: scenario.metrics.errorRate,
                    p95Latency: scenario.metrics.p95,
                    throughput: scenario.metrics.throughput,
                };
            }
        }

        return analysis;
    }

    /**
     * Utility method to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export the comprehensive load testing suite
export default ComprehensiveLoadTesting;

// Run comprehensive load testing if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const loadTesting = new ComprehensiveLoadTesting();
    loadTesting.runComprehensiveLoadTesting()
        .then(() => {
            logger.info('🎉 Comprehensive load testing completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('💥 Comprehensive load testing failed:', error);
            process.exit(1);
        });
} 