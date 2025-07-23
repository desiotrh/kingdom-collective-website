/**
 * Kingdom Studios - Load Testing Scripts
 * Comprehensive load testing for 10K-100K+ concurrent users
 * Tests various scenarios and validates scalability
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
import { logger } from './src/utils/logger.js';

class LoadTestingSuite {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
        this.results = {
            scenarios: new Map(),
            summary: {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                p95ResponseTime: 0,
                p99ResponseTime: 0,
                throughput: 0,
                errorRate: 0,
            },
            metrics: {
                responseTimes: [],
                errors: [],
                concurrentUsers: 0,
                peakConcurrency: 0,
            }
        };
        this.activeConnections = 0;
        this.maxConcurrentUsers = 100000;
        this.testDuration = 300000; // 5 minutes
        this.rampUpTime = 60000; // 1 minute
        this.steadyStateTime = 180000; // 3 minutes
        this.rampDownTime = 60000; // 1 minute
    }

    /**
     * Run comprehensive load testing suite
     */
    async runLoadTestingSuite() {
        logger.info('🚀 Starting comprehensive load testing suite...');

        try {
            // Pre-test health check
            await this.performHealthCheck();

            // Run different load testing scenarios
            await this.runScenario('Low Load', 100, 1000);
            await this.runScenario('Medium Load', 1000, 10000);
            await this.runScenario('High Load', 10000, 50000);
            await this.runScenario('Peak Load', 50000, 100000);
            await this.runScenario('Stress Test', 100000, 150000);

            // Run specific feature tests
            await this.runFeatureTests();

            // Run performance regression tests
            await this.runPerformanceRegressionTests();

            // Generate comprehensive report
            await this.generateLoadTestReport();

            logger.info('✅ Load testing suite completed successfully');
        } catch (error) {
            logger.error('❌ Load testing suite failed:', error);
            throw error;
        }
    }

    /**
     * Run a specific load testing scenario
     */
    async runScenario(name, minUsers, maxUsers) {
        logger.info(`📊 Running scenario: ${name} (${minUsers}-${maxUsers} users)`);

        const scenarioResults = {
            name,
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
                concurrentUsers: 0,
                peakConcurrency: 0,
            }
        };

        try {
            // Ramp up phase
            await this.rampUpUsers(minUsers, maxUsers, this.rampUpTime);

            // Steady state phase
            await this.steadyStateLoad(maxUsers, this.steadyStateTime);

            // Ramp down phase
            await this.rampDownUsers(maxUsers, minUsers, this.rampDownTime);

            // Calculate scenario metrics
            this.calculateScenarioMetrics(scenarioResults);

            // Store results
            this.results.scenarios.set(name, scenarioResults);

            logger.info(`✅ Scenario ${name} completed`);
        } catch (error) {
            logger.error(`❌ Scenario ${name} failed:`, error);
            scenarioResults.errors.push(error);
        }
    }

    /**
     * Ramp up users gradually
     */
    async rampUpUsers(startUsers, endUsers, duration) {
        logger.info(`📈 Ramping up users from ${startUsers} to ${endUsers} over ${duration}ms`);

        const interval = 1000; // 1 second intervals
        const steps = duration / interval;
        const userIncrement = (endUsers - startUsers) / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(startUsers + (userIncrement * i));
            await this.simulateConcurrentUsers(currentUsers);
            await this.sleep(interval);
        }
    }

    /**
     * Maintain steady state load
     */
    async steadyStateLoad(targetUsers, duration) {
        logger.info(`⚡ Maintaining steady state load of ${targetUsers} users for ${duration}ms`);

        const startTime = Date.now();
        const interval = 1000; // 1 second intervals

        while (Date.now() - startTime < duration) {
            await this.simulateConcurrentUsers(targetUsers);
            await this.sleep(interval);
        }
    }

    /**
     * Ramp down users gradually
     */
    async rampDownUsers(startUsers, endUsers, duration) {
        logger.info(`📉 Ramping down users from ${startUsers} to ${endUsers} over ${duration}ms`);

        const interval = 1000; // 1 second intervals
        const steps = duration / interval;
        const userDecrement = (startUsers - endUsers) / steps;

        for (let i = 0; i < steps; i++) {
            const currentUsers = Math.floor(startUsers - (userDecrement * i));
            await this.simulateConcurrentUsers(currentUsers);
            await this.sleep(interval);
        }
    }

    /**
     * Simulate concurrent users
     */
    async simulateConcurrentUsers(userCount) {
        const promises = [];
        const requestsPerUser = 10; // Each user makes 10 requests

        for (let i = 0; i < userCount; i++) {
            for (let j = 0; j < requestsPerUser; j++) {
                promises.push(this.simulateUserRequest(i));
            }
        }

        // Execute requests with controlled concurrency
        const batchSize = 1000; // Process 1000 requests at a time
        for (let i = 0; i < promises.length; i += batchSize) {
            const batch = promises.slice(i, i + batchSize);
            await Promise.allSettled(batch);

            // Update active connections
            this.activeConnections = Math.min(batch.length, this.maxConcurrentUsers);
            this.results.metrics.peakConcurrency = Math.max(
                this.results.metrics.peakConcurrency,
                this.activeConnections
            );
        }
    }

    /**
     * Simulate a single user request
     */
    async simulateUserRequest(userId) {
        const startTime = performance.now();
        const requestId = `user_${userId}_${Date.now()}`;

        try {
            // Randomly select an endpoint to test
            const endpoints = [
                { path: '/api/v1/health', method: 'GET' },
                { path: '/api/v1/users/profile', method: 'GET' },
                { path: '/api/v1/content', method: 'GET' },
                { path: '/api/v1/analytics/overview', method: 'GET' },
                { path: '/api/v1/products', method: 'GET' },
                { path: '/api/v1/content/generate', method: 'POST', data: { prompt: 'Test content' } },
                { path: '/api/v1/analytics/track', method: 'POST', data: { event: 'test_event' } },
            ];

            const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

            const response = await axios({
                method: endpoint.method,
                url: `${this.baseURL}${endpoint.path}`,
                data: endpoint.data,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId,
                    'X-User-ID': userId.toString(),
                },
                timeout: 30000, // 30 second timeout
            });

            const responseTime = performance.now() - startTime;

            // Record successful request
            this.recordRequest({
                requestId,
                userId,
                endpoint: endpoint.path,
                method: endpoint.method,
                responseTime,
                statusCode: response.status,
                success: true,
            });

            return response.data;
        } catch (error) {
            const responseTime = performance.now() - startTime;

            // Record failed request
            this.recordRequest({
                requestId,
                userId,
                endpoint: error.config?.url || 'unknown',
                method: error.config?.method || 'unknown',
                responseTime,
                statusCode: error.response?.status || 0,
                success: false,
                error: error.message,
            });

            throw error;
        }
    }

    /**
     * Record request metrics
     */
    recordRequest(requestData) {
        this.results.summary.totalRequests++;

        if (requestData.success) {
            this.results.summary.successfulRequests++;
        } else {
            this.results.summary.failedRequests++;
            this.results.metrics.errors.push(requestData);
        }

        this.results.metrics.responseTimes.push(requestData.responseTime);

        // Update average response time
        this.results.summary.averageResponseTime =
            (this.results.summary.averageResponseTime + requestData.responseTime) / 2;
    }

    /**
     * Run feature-specific tests
     */
    async runFeatureTests() {
        logger.info('🔧 Running feature-specific tests...');

        const featureTests = [
            { name: 'Authentication Flow', test: this.testAuthenticationFlow },
            { name: 'Content Generation', test: this.testContentGeneration },
            { name: 'Analytics Processing', test: this.testAnalyticsProcessing },
            { name: 'Database Operations', test: this.testDatabaseOperations },
            { name: 'Cache Performance', test: this.testCachePerformance },
            { name: 'File Upload', test: this.testFileUpload },
            { name: 'Real-time Features', test: this.testRealTimeFeatures },
        ];

        for (const featureTest of featureTests) {
            try {
                logger.info(`Testing feature: ${featureTest.name}`);
                await featureTest.test();
                logger.info(`✅ ${featureTest.name} test completed`);
            } catch (error) {
                logger.error(`❌ ${featureTest.name} test failed:`, error);
            }
        }
    }

    /**
     * Test authentication flow under load
     */
    async testAuthenticationFlow() {
        const concurrentLogins = 1000;
        const promises = [];

        for (let i = 0; i < concurrentLogins; i++) {
            promises.push(
                axios.post(`${this.baseURL}/api/v1/auth/login`, {
                    email: `testuser${i}@example.com`,
                    password: 'testpassword123',
                }).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Authentication test: ${successful}/${concurrentLogins} successful logins`);
    }

    /**
     * Test content generation under load
     */
    async testContentGeneration() {
        const concurrentGenerations = 500;
        const promises = [];

        for (let i = 0; i < concurrentGenerations; i++) {
            promises.push(
                axios.post(`${this.baseURL}/api/v1/content/generate`, {
                    prompt: `Test content generation ${i}`,
                    type: 'social_media',
                    platform: 'instagram',
                }).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Content generation test: ${successful}/${concurrentGenerations} successful generations`);
    }

    /**
     * Test analytics processing under load
     */
    async testAnalyticsProcessing() {
        const concurrentEvents = 2000;
        const promises = [];

        for (let i = 0; i < concurrentEvents; i++) {
            promises.push(
                axios.post(`${this.baseURL}/api/v1/analytics/track`, {
                    event: 'page_view',
                    userId: `user_${i}`,
                    properties: {
                        page: '/dashboard',
                        timestamp: Date.now(),
                    },
                }).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Analytics processing test: ${successful}/${concurrentEvents} successful events`);
    }

    /**
     * Test database operations under load
     */
    async testDatabaseOperations() {
        const concurrentQueries = 1000;
        const promises = [];

        for (let i = 0; i < concurrentQueries; i++) {
            promises.push(
                axios.get(`${this.baseURL}/api/v1/users/profile`).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Database operations test: ${successful}/${concurrentQueries} successful queries`);
    }

    /**
     * Test cache performance under load
     */
    async testCachePerformance() {
        const cacheTests = 500;
        const promises = [];

        for (let i = 0; i < cacheTests; i++) {
            promises.push(
                axios.get(`${this.baseURL}/api/v1/content/templates`).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Cache performance test: ${successful}/${cacheTests} successful cache hits`);
    }

    /**
     * Test file upload under load
     */
    async testFileUpload() {
        const uploadTests = 100;
        const promises = [];

        for (let i = 0; i < uploadTests; i++) {
            const formData = new FormData();
            formData.append('file', Buffer.from('test file content'), 'test.txt');

            promises.push(
                axios.post(`${this.baseURL}/api/v1/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`File upload test: ${successful}/${uploadTests} successful uploads`);
    }

    /**
     * Test real-time features under load
     */
    async testRealTimeFeatures() {
        const realTimeTests = 200;
        const promises = [];

        for (let i = 0; i < realTimeTests; i++) {
            promises.push(
                axios.post(`${this.baseURL}/api/v1/notifications/send`, {
                    userId: `user_${i}`,
                    message: 'Test notification',
                    type: 'info',
                }).catch(error => ({ error }))
            );
        }

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;

        logger.info(`Real-time features test: ${successful}/${realTimeTests} successful notifications`);
    }

    /**
     * Run performance regression tests
     */
    async runPerformanceRegressionTests() {
        logger.info('📈 Running performance regression tests...');

        const baselineMetrics = {
            averageResponseTime: 200, // 200ms baseline
            p95ResponseTime: 500, // 500ms baseline
            errorRate: 1, // 1% baseline
            throughput: 1000, // 1000 requests/second baseline
        };

        const currentMetrics = this.calculateCurrentMetrics();

        // Check for performance regressions
        const regressions = [];

        if (currentMetrics.averageResponseTime > baselineMetrics.averageResponseTime * 1.5) {
            regressions.push(`Average response time increased by ${((currentMetrics.averageResponseTime / baselineMetrics.averageResponseTime - 1) * 100).toFixed(1)}%`);
        }

        if (currentMetrics.p95ResponseTime > baselineMetrics.p95ResponseTime * 1.3) {
            regressions.push(`P95 response time increased by ${((currentMetrics.p95ResponseTime / baselineMetrics.p95ResponseTime - 1) * 100).toFixed(1)}%`);
        }

        if (currentMetrics.errorRate > baselineMetrics.errorRate * 2) {
            regressions.push(`Error rate increased by ${((currentMetrics.errorRate / baselineMetrics.errorRate - 1) * 100).toFixed(1)}%`);
        }

        if (currentMetrics.throughput < baselineMetrics.throughput * 0.8) {
            regressions.push(`Throughput decreased by ${((1 - currentMetrics.throughput / baselineMetrics.throughput) * 100).toFixed(1)}%`);
        }

        if (regressions.length > 0) {
            logger.warn('⚠️ Performance regressions detected:');
            regressions.forEach(regression => logger.warn(`  - ${regression}`));
        } else {
            logger.info('✅ No performance regressions detected');
        }
    }

    /**
     * Calculate current metrics
     */
    calculateCurrentMetrics() {
        const responseTimes = this.results.metrics.responseTimes;
        const sortedTimes = responseTimes.sort((a, b) => a - b);

        return {
            averageResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
            p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
            p99ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.99)],
            errorRate: (this.results.summary.failedRequests / this.results.summary.totalRequests) * 100,
            throughput: this.results.summary.totalRequests / (this.testDuration / 1000),
        };
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
            throughput: scenarioResults.requests.length / (this.testDuration / 1000),
            errorRate: (scenarioResults.requests.filter(r => !r.success).length / scenarioResults.requests.length) * 100,
        };

        scenarioResults.endTime = Date.now();
    }

    /**
     * Perform health check before testing
     */
    async performHealthCheck() {
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            if (response.status !== 200) {
                throw new Error('Health check failed');
            }
            logger.info('✅ Health check passed');
        } catch (error) {
            throw new Error(`Health check failed: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive load test report
     */
    async generateLoadTestReport() {
        logger.info('📊 Generating load test report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            scenarios: Array.from(this.results.scenarios.entries()).map(([name, scenario]) => ({
                name,
                duration: scenario.endTime - scenario.startTime,
                metrics: scenario.metrics,
                errors: scenario.errors.length,
            })),
            recommendations: this.generateRecommendations(),
            systemMetrics: {
                peakConcurrency: this.results.metrics.peakConcurrency,
                totalRequests: this.results.summary.totalRequests,
                errorRate: this.results.summary.errorRate,
                averageResponseTime: this.results.summary.averageResponseTime,
            },
        };

        // Log report summary
        logger.info('📈 Load Test Report Summary:');
        logger.info(`  Total Requests: ${report.summary.totalRequests}`);
        logger.info(`  Successful: ${report.summary.successfulRequests}`);
        logger.info(`  Failed: ${report.summary.failedRequests}`);
        logger.info(`  Error Rate: ${report.summary.errorRate.toFixed(2)}%`);
        logger.info(`  Average Response Time: ${report.summary.averageResponseTime.toFixed(2)}ms`);
        logger.info(`  Peak Concurrency: ${report.systemMetrics.peakConcurrency}`);

        // Save report to file
        const fs = await import('fs');
        fs.writeFileSync('load-test-report.json', JSON.stringify(report, null, 2));

        logger.info('✅ Load test report generated and saved to load-test-report.json');

        return report;
    }

    /**
     * Generate recommendations based on test results
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.results.summary.errorRate > 5) {
            recommendations.push('High error rate detected - investigate and fix error sources');
        }

        if (this.results.summary.averageResponseTime > 1000) {
            recommendations.push('High response time detected - optimize database queries and add caching');
        }

        if (this.results.metrics.peakConcurrency < 10000) {
            recommendations.push('System may not handle 10K+ concurrent users - consider horizontal scaling');
        }

        if (this.results.summary.throughput < 1000) {
            recommendations.push('Low throughput detected - optimize application performance');
        }

        return recommendations;
    }

    /**
     * Utility method to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export the load testing suite
export default LoadTestingSuite;

// Run load testing if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const loadTestingSuite = new LoadTestingSuite();
    loadTestingSuite.runLoadTestingSuite()
        .then(() => {
            logger.info('🎉 Load testing completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('💥 Load testing failed:', error);
            process.exit(1);
        });
} 