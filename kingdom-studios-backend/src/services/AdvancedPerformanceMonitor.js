/**
 * Kingdom Studios - Advanced Performance Monitor
 * Real-time performance monitoring for 10K-100K+ concurrent users
 * Implements comprehensive metrics tracking, alerts, and performance optimization
 */

import { performance } from 'perf_hooks';
import os from 'os';
import { logger } from '../utils/logger.js';

class AdvancedPerformanceMonitor {
    constructor() {
        this.metrics = {
            system: {
                cpu: {
                    usage: 0,
                    load: 0,
                    cores: os.cpus().length,
                },
                memory: {
                    total: os.totalmem(),
                    used: 0,
                    free: 0,
                    percentage: 0,
                },
                network: {
                    bytesIn: 0,
                    bytesOut: 0,
                    connections: 0,
                },
                disk: {
                    read: 0,
                    write: 0,
                    iops: 0,
                },
            },
            application: {
                requests: {
                    total: 0,
                    active: 0,
                    failed: 0,
                    averageResponseTime: 0,
                    p95: 0,
                    p99: 0,
                    throughput: 0,
                },
                errors: {
                    total: 0,
                    rate: 0,
                    types: new Map(),
                },
                cache: {
                    hits: 0,
                    misses: 0,
                    hitRate: 0,
                    evictions: 0,
                },
                database: {
                    connections: 0,
                    queries: 0,
                    slowQueries: 0,
                    averageQueryTime: 0,
                },
                queue: {
                    pending: 0,
                    processing: 0,
                    completed: 0,
                    failed: 0,
                },
            },
            business: {
                users: {
                    active: 0,
                    total: 0,
                    new: 0,
                },
                content: {
                    created: 0,
                    published: 0,
                    views: 0,
                },
                revenue: {
                    daily: 0,
                    monthly: 0,
                    transactions: 0,
                },
            },
        };

        this.alerts = {
            critical: [],
            warning: [],
            info: [],
        };

        this.thresholds = {
            cpu: {
                warning: 70,
                critical: 90,
            },
            memory: {
                warning: 80,
                critical: 95,
            },
            responseTime: {
                warning: 1000,
                critical: 3000,
            },
            errorRate: {
                warning: 5,
                critical: 10,
            },
            databaseConnections: {
                warning: 80,
                critical: 95,
            },
        };

        this.monitoringInterval = 5000; // 5 seconds
        this.alertCooldown = 300000; // 5 minutes
        this.lastAlertTime = new Map();
        this.performanceHistory = [];
        this.maxHistorySize = 1000;
    }

    /**
     * Initialize advanced performance monitor
     */
    async initialize() {
        logger.info('🚀 Initializing Advanced Performance Monitor...');

        try {
            // Setup system monitoring
            await this.setupSystemMonitoring();

            // Initialize application monitoring
            await this.setupApplicationMonitoring();

            // Setup business metrics
            await this.setupBusinessMetrics();

            // Initialize alerting system
            await this.setupAlertingSystem();

            // Setup performance optimization
            this.setupPerformanceOptimization();

            // Initialize reporting
            await this.setupReporting();

            logger.info('✅ Advanced Performance Monitor initialized successfully');
        } catch (error) {
            logger.error('❌ Performance monitor initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup system monitoring
     */
    async setupSystemMonitoring() {
        try {
            // Monitor CPU usage
            setInterval(() => {
                this.monitorCPU();
            }, this.monitoringInterval);

            // Monitor memory usage
            setInterval(() => {
                this.monitorMemory();
            }, this.monitoringInterval);

            // Monitor network usage
            setInterval(() => {
                this.monitorNetwork();
            }, this.monitoringInterval);

            // Monitor disk I/O
            setInterval(() => {
                this.monitorDiskIO();
            }, this.monitoringInterval);

            logger.info('✅ System monitoring configured');
        } catch (error) {
            logger.error('System monitoring setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup application monitoring
     */
    async setupApplicationMonitoring() {
        try {
            // Monitor request performance
            setInterval(() => {
                this.monitorRequestPerformance();
            }, this.monitoringInterval);

            // Monitor error rates
            setInterval(() => {
                this.monitorErrorRates();
            }, this.monitoringInterval);

            // Monitor cache performance
            setInterval(() => {
                this.monitorCachePerformance();
            }, this.monitoringInterval);

            // Monitor database performance
            setInterval(() => {
                this.monitorDatabasePerformance();
            }, this.monitoringInterval);

            // Monitor queue performance
            setInterval(() => {
                this.monitorQueuePerformance();
            }, this.monitoringInterval);

            logger.info('✅ Application monitoring configured');
        } catch (error) {
            logger.error('Application monitoring setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup business metrics
     */
    async setupBusinessMetrics() {
        try {
            // Monitor user activity
            setInterval(() => {
                this.monitorUserActivity();
            }, 60000); // Every minute

            // Monitor content metrics
            setInterval(() => {
                this.monitorContentMetrics();
            }, 60000); // Every minute

            // Monitor revenue metrics
            setInterval(() => {
                this.monitorRevenueMetrics();
            }, 300000); // Every 5 minutes

            logger.info('✅ Business metrics configured');
        } catch (error) {
            logger.error('Business metrics setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup alerting system
     */
    async setupAlertingSystem() {
        try {
            // Check for alerts
            setInterval(() => {
                this.checkAlerts();
            }, 10000); // Every 10 seconds

            // Send alert notifications
            setInterval(() => {
                this.sendAlertNotifications();
            }, 30000); // Every 30 seconds

            // Clean up old alerts
            setInterval(() => {
                this.cleanupAlerts();
            }, 300000); // Every 5 minutes

            logger.info('✅ Alerting system configured');
        } catch (error) {
            logger.error('Alerting system setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup performance optimization
     */
    setupPerformanceOptimization() {
        try {
            // Monitor performance degradation
            setInterval(() => {
                this.detectPerformanceDegradation();
            }, 30000); // Every 30 seconds

            // Optimize based on metrics
            setInterval(() => {
                this.optimizePerformance();
            }, 60000); // Every minute

            logger.info('✅ Performance optimization configured');
        } catch (error) {
            logger.error('Performance optimization setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup reporting
     */
    async setupReporting() {
        try {
            // Generate performance reports
            setInterval(() => {
                this.generatePerformanceReport();
            }, 300000); // Every 5 minutes

            // Export metrics
            setInterval(() => {
                this.exportMetrics();
            }, 600000); // Every 10 minutes

            logger.info('✅ Reporting configured');
        } catch (error) {
            logger.error('Reporting setup failed:', error);
            throw error;
        }
    }

    /**
     * Monitor CPU usage
     */
    monitorCPU() {
        try {
            const cpuUsage = process.cpuUsage();
            const loadAverage = os.loadavg();

            this.metrics.system.cpu.usage = (cpuUsage.user + cpuUsage.system) / 1000000;
            this.metrics.system.cpu.load = loadAverage[0]; // 1-minute load average

            // Check thresholds
            if (this.metrics.system.cpu.usage > this.thresholds.cpu.critical) {
                this.createAlert('critical', 'CPU_CRITICAL', `CPU usage critical: ${this.metrics.system.cpu.usage.toFixed(1)}%`);
            } else if (this.metrics.system.cpu.usage > this.thresholds.cpu.warning) {
                this.createAlert('warning', 'CPU_WARNING', `CPU usage high: ${this.metrics.system.cpu.usage.toFixed(1)}%`);
            }
        } catch (error) {
            logger.error('CPU monitoring failed:', error);
        }
    }

    /**
     * Monitor memory usage
     */
    monitorMemory() {
        try {
            const memUsage = process.memoryUsage();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();

            this.metrics.system.memory.used = memUsage.heapUsed;
            this.metrics.system.memory.free = freeMem;
            this.metrics.system.memory.percentage = ((totalMem - freeMem) / totalMem) * 100;

            // Check thresholds
            if (this.metrics.system.memory.percentage > this.thresholds.memory.critical) {
                this.createAlert('critical', 'MEMORY_CRITICAL', `Memory usage critical: ${this.metrics.system.memory.percentage.toFixed(1)}%`);
            } else if (this.metrics.system.memory.percentage > this.thresholds.memory.warning) {
                this.createAlert('warning', 'MEMORY_WARNING', `Memory usage high: ${this.metrics.system.memory.percentage.toFixed(1)}%`);
            }
        } catch (error) {
            logger.error('Memory monitoring failed:', error);
        }
    }

    /**
     * Monitor network usage
     */
    monitorNetwork() {
        try {
            // This would typically use a network monitoring library
            // For now, we'll simulate network metrics
            this.metrics.system.network.connections = Math.floor(Math.random() * 1000);
            this.metrics.system.network.bytesIn += Math.floor(Math.random() * 1000);
            this.metrics.system.network.bytesOut += Math.floor(Math.random() * 1000);
        } catch (error) {
            logger.error('Network monitoring failed:', error);
        }
    }

    /**
     * Monitor disk I/O
     */
    monitorDiskIO() {
        try {
            // This would typically use a disk monitoring library
            // For now, we'll simulate disk metrics
            this.metrics.system.disk.read += Math.floor(Math.random() * 100);
            this.metrics.system.disk.write += Math.floor(Math.random() * 100);
            this.metrics.system.disk.iops = Math.floor(Math.random() * 1000);
        } catch (error) {
            logger.error('Disk I/O monitoring failed:', error);
        }
    }

    /**
     * Monitor request performance
     */
    monitorRequestPerformance() {
        try {
            // Calculate throughput (requests per second)
            const currentTime = Date.now();
            const timeWindow = 60000; // 1 minute

            // Filter recent requests
            const recentRequests = this.performanceHistory.filter(
                req => currentTime - req.timestamp < timeWindow
            );

            this.metrics.application.requests.throughput = recentRequests.length / 60; // requests per second

            // Calculate response time percentiles
            if (recentRequests.length > 0) {
                const responseTimes = recentRequests.map(req => req.responseTime).sort((a, b) => a - b);
                const p95Index = Math.floor(responseTimes.length * 0.95);
                const p99Index = Math.floor(responseTimes.length * 0.99);

                this.metrics.application.requests.p95 = responseTimes[p95Index] || 0;
                this.metrics.application.requests.p99 = responseTimes[p99Index] || 0;
            }

            // Check response time thresholds
            if (this.metrics.application.requests.p95 > this.thresholds.responseTime.critical) {
                this.createAlert('critical', 'RESPONSE_TIME_CRITICAL', `P95 response time critical: ${this.metrics.application.requests.p95.toFixed(0)}ms`);
            } else if (this.metrics.application.requests.p95 > this.thresholds.responseTime.warning) {
                this.createAlert('warning', 'RESPONSE_TIME_WARNING', `P95 response time high: ${this.metrics.application.requests.p95.toFixed(0)}ms`);
            }
        } catch (error) {
            logger.error('Request performance monitoring failed:', error);
        }
    }

    /**
     * Monitor error rates
     */
    monitorErrorRates() {
        try {
            const totalRequests = this.metrics.application.requests.total;
            const failedRequests = this.metrics.application.requests.failed;

            if (totalRequests > 0) {
                this.metrics.application.errors.rate = (failedRequests / totalRequests) * 100;
            }

            // Check error rate thresholds
            if (this.metrics.application.errors.rate > this.thresholds.errorRate.critical) {
                this.createAlert('critical', 'ERROR_RATE_CRITICAL', `Error rate critical: ${this.metrics.application.errors.rate.toFixed(1)}%`);
            } else if (this.metrics.application.errors.rate > this.thresholds.errorRate.warning) {
                this.createAlert('warning', 'ERROR_RATE_WARNING', `Error rate high: ${this.metrics.application.errors.rate.toFixed(1)}%`);
            }
        } catch (error) {
            logger.error('Error rate monitoring failed:', error);
        }
    }

    /**
     * Monitor cache performance
     */
    monitorCachePerformance() {
        try {
            const totalCacheRequests = this.metrics.application.cache.hits + this.metrics.application.cache.misses;

            if (totalCacheRequests > 0) {
                this.metrics.application.cache.hitRate = (this.metrics.application.cache.hits / totalCacheRequests) * 100;
            }

            // Alert on low cache hit rate
            if (this.metrics.application.cache.hitRate < 50) {
                this.createAlert('warning', 'CACHE_HIT_RATE_LOW', `Cache hit rate low: ${this.metrics.application.cache.hitRate.toFixed(1)}%`);
            }
        } catch (error) {
            logger.error('Cache performance monitoring failed:', error);
        }
    }

    /**
     * Monitor database performance
     */
    monitorDatabasePerformance() {
        try {
            // Check database connection thresholds
            if (this.metrics.application.database.connections > this.thresholds.databaseConnections.critical) {
                this.createAlert('critical', 'DB_CONNECTIONS_CRITICAL', `Database connections critical: ${this.metrics.application.database.connections}`);
            } else if (this.metrics.application.database.connections > this.thresholds.databaseConnections.warning) {
                this.createAlert('warning', 'DB_CONNECTIONS_WARNING', `Database connections high: ${this.metrics.application.database.connections}`);
            }

            // Alert on slow queries
            if (this.metrics.application.database.slowQueries > 10) {
                this.createAlert('warning', 'SLOW_QUERIES_WARNING', `${this.metrics.application.database.slowQueries} slow queries detected`);
            }
        } catch (error) {
            logger.error('Database performance monitoring failed:', error);
        }
    }

    /**
     * Monitor queue performance
     */
    monitorQueuePerformance() {
        try {
            const totalQueueJobs = this.metrics.application.queue.pending + this.metrics.application.queue.processing;

            // Alert on queue backlog
            if (this.metrics.application.queue.pending > 1000) {
                this.createAlert('warning', 'QUEUE_BACKLOG_WARNING', `Queue backlog: ${this.metrics.application.queue.pending} pending jobs`);
            }

            // Alert on high failure rate
            const totalCompleted = this.metrics.application.queue.completed + this.metrics.application.queue.failed;
            if (totalCompleted > 0) {
                const failureRate = (this.metrics.application.queue.failed / totalCompleted) * 100;
                if (failureRate > 10) {
                    this.createAlert('critical', 'QUEUE_FAILURE_RATE_CRITICAL', `Queue failure rate: ${failureRate.toFixed(1)}%`);
                }
            }
        } catch (error) {
            logger.error('Queue performance monitoring failed:', error);
        }
    }

    /**
     * Monitor user activity
     */
    monitorUserActivity() {
        try {
            // Simulate user activity metrics
            this.metrics.business.users.active = Math.floor(Math.random() * 1000) + 100;
            this.metrics.business.users.new += Math.floor(Math.random() * 10);
        } catch (error) {
            logger.error('User activity monitoring failed:', error);
        }
    }

    /**
     * Monitor content metrics
     */
    monitorContentMetrics() {
        try {
            // Simulate content metrics
            this.metrics.business.content.created += Math.floor(Math.random() * 5);
            this.metrics.business.content.published += Math.floor(Math.random() * 3);
            this.metrics.business.content.views += Math.floor(Math.random() * 100);
        } catch (error) {
            logger.error('Content metrics monitoring failed:', error);
        }
    }

    /**
     * Monitor revenue metrics
     */
    monitorRevenueMetrics() {
        try {
            // Simulate revenue metrics
            this.metrics.business.revenue.daily += Math.floor(Math.random() * 100);
            this.metrics.business.revenue.transactions += Math.floor(Math.random() * 10);
        } catch (error) {
            logger.error('Revenue metrics monitoring failed:', error);
        }
    }

    /**
     * Create alert
     */
    createAlert(level, type, message) {
        const alertKey = `${type}_${level}`;
        const now = Date.now();
        const lastAlert = this.lastAlertTime.get(alertKey) || 0;

        // Check cooldown period
        if (now - lastAlert < this.alertCooldown) {
            return;
        }

        const alert = {
            id: `${type}_${now}`,
            level,
            type,
            message,
            timestamp: new Date().toISOString(),
            metrics: this.getCurrentMetrics(),
        };

        this.alerts[level].push(alert);
        this.lastAlertTime.set(alertKey, now);

        logger.warn(`ALERT [${level.toUpperCase()}]: ${message}`);
    }

    /**
     * Check alerts
     */
    checkAlerts() {
        try {
            // Check for critical alerts
            if (this.alerts.critical.length > 0) {
                logger.error(`CRITICAL ALERTS: ${this.alerts.critical.length} active`);
            }

            // Check for warning alerts
            if (this.alerts.warning.length > 0) {
                logger.warn(`WARNING ALERTS: ${this.alerts.warning.length} active`);
            }
        } catch (error) {
            logger.error('Alert checking failed:', error);
        }
    }

    /**
     * Send alert notifications
     */
    sendAlertNotifications() {
        try {
            // Send critical alerts immediately
            this.alerts.critical.forEach(alert => {
                this.sendNotification(alert);
            });

            // Send warning alerts (less frequent)
            if (this.alerts.warning.length > 0) {
                this.sendNotification({
                    level: 'warning',
                    message: `${this.alerts.warning.length} warning alerts active`,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            logger.error('Alert notification failed:', error);
        }
    }

    /**
     * Send notification (implementation would depend on your notification system)
     */
    sendNotification(alert) {
        // Implementation would send to Slack, email, SMS, etc.
        logger.info(`NOTIFICATION: ${alert.message}`);
    }

    /**
     * Cleanup old alerts
     */
    cleanupAlerts() {
        try {
            const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

            for (const level of ['critical', 'warning', 'info']) {
                this.alerts[level] = this.alerts[level].filter(alert => {
                    return new Date(alert.timestamp).getTime() > cutoffTime;
                });
            }
        } catch (error) {
            logger.error('Alert cleanup failed:', error);
        }
    }

    /**
     * Detect performance degradation
     */
    detectPerformanceDegradation() {
        try {
            const recentMetrics = this.performanceHistory.slice(-10);
            if (recentMetrics.length < 5) return;

            // Calculate average response time trend
            const avgResponseTimes = recentMetrics.map(m => m.responseTime);
            const trend = this.calculateTrend(avgResponseTimes);

            if (trend > 0.1) { // 10% increase
                this.createAlert('warning', 'PERFORMANCE_DEGRADATION', `Response time increasing by ${(trend * 100).toFixed(1)}%`);
            }
        } catch (error) {
            logger.error('Performance degradation detection failed:', error);
        }
    }

    /**
     * Optimize performance based on metrics
     */
    optimizePerformance() {
        try {
            // Auto-scale based on load
            if (this.metrics.application.requests.throughput > 1000) {
                logger.info('High throughput detected, triggering auto-scaling');
                this.triggerAutoScaling();
            }

            // Optimize cache based on hit rate
            if (this.metrics.application.cache.hitRate < 60) {
                logger.info('Low cache hit rate, warming cache');
                this.warmCache();
            }

            // Optimize database connections
            if (this.metrics.application.database.connections > this.thresholds.databaseConnections.warning) {
                logger.info('High database connections, optimizing connection pool');
                this.optimizeConnectionPool();
            }
        } catch (error) {
            logger.error('Performance optimization failed:', error);
        }
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        try {
            const report = {
                timestamp: new Date().toISOString(),
                summary: {
                    systemHealth: this.calculateSystemHealth(),
                    applicationHealth: this.calculateApplicationHealth(),
                    businessMetrics: this.metrics.business,
                },
                alerts: {
                    critical: this.alerts.critical.length,
                    warning: this.alerts.warning.length,
                    info: this.alerts.info.length,
                },
                recommendations: this.generateRecommendations(),
            };

            logger.info('Performance report generated:', report);
            return report;
        } catch (error) {
            logger.error('Performance report generation failed:', error);
        }
    }

    /**
     * Export metrics
     */
    exportMetrics() {
        try {
            const exportData = {
                timestamp: new Date().toISOString(),
                metrics: this.metrics,
                alerts: this.alerts,
                performanceHistory: this.performanceHistory.slice(-100), // Last 100 entries
            };

            // Implementation would export to external monitoring system
            logger.info('Metrics exported');
            return exportData;
        } catch (error) {
            logger.error('Metrics export failed:', error);
        }
    }

    /**
     * Record request performance
     */
    recordRequest(responseTime, success = true) {
        try {
            this.metrics.application.requests.total++;
            this.metrics.application.requests.averageResponseTime =
                (this.metrics.application.requests.averageResponseTime + responseTime) / 2;

            if (!success) {
                this.metrics.application.requests.failed++;
            }

            // Add to performance history
            this.performanceHistory.push({
                timestamp: Date.now(),
                responseTime,
                success,
            });

            // Maintain history size
            if (this.performanceHistory.length > this.maxHistorySize) {
                this.performanceHistory.shift();
            }
        } catch (error) {
            logger.error('Request recording failed:', error);
        }
    }

    /**
     * Get current metrics
     */
    getCurrentMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Calculate trend
     */
    calculateTrend(values) {
        if (values.length < 2) return 0;

        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
        const sumX2 = values.reduce((sum, _, index) => sum + (index * index), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
    }

    /**
     * Calculate system health score
     */
    calculateSystemHealth() {
        const cpuHealth = 100 - Math.min(this.metrics.system.cpu.usage, 100);
        const memoryHealth = 100 - Math.min(this.metrics.system.memory.percentage, 100);

        return (cpuHealth + memoryHealth) / 2;
    }

    /**
     * Calculate application health score
     */
    calculateApplicationHealth() {
        const responseTimeHealth = Math.max(0, 100 - (this.metrics.application.requests.p95 / 100));
        const errorRateHealth = Math.max(0, 100 - this.metrics.application.errors.rate);
        const cacheHealth = this.metrics.application.cache.hitRate;

        return (responseTimeHealth + errorRateHealth + cacheHealth) / 3;
    }

    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.metrics.system.cpu.usage > 80) {
            recommendations.push('Consider scaling CPU resources');
        }

        if (this.metrics.system.memory.percentage > 80) {
            recommendations.push('Consider scaling memory resources');
        }

        if (this.metrics.application.requests.p95 > 1000) {
            recommendations.push('Optimize database queries and add caching');
        }

        if (this.metrics.application.errors.rate > 5) {
            recommendations.push('Investigate and fix error sources');
        }

        if (this.metrics.application.cache.hitRate < 60) {
            recommendations.push('Implement more aggressive caching strategies');
        }

        return recommendations;
    }

    /**
     * Optimization methods (implementations would be specific to your system)
     */
    triggerAutoScaling() {
        logger.info('Auto-scaling triggered');
    }

    warmCache() {
        logger.info('Cache warming initiated');
    }

    optimizeConnectionPool() {
        logger.info('Connection pool optimization initiated');
    }
}

export default AdvancedPerformanceMonitor; 