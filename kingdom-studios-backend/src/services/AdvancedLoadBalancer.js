/**
 * Kingdom Studios - Advanced Load Balancer
 * Intelligent load distribution for 10K-100K+ concurrent users
 * Implements health checks, failover, and dynamic scaling
 */

import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '../utils/logger.js';
import { performance } from 'perf_hooks';

class AdvancedLoadBalancer {
    constructor() {
        this.servers = new Map();
        this.healthChecks = new Map();
        this.loadBalancingAlgorithm = 'round-robin';
        this.stickySessions = true;
        this.sessionTimeout = 3600000; // 1 hour
        this.healthCheckInterval = 30000; // 30 seconds
        this.failoverThreshold = 3;
        this.maxConnections = 10000;
        this.connectionTimeout = 30000;
        this.requestTimeout = 60000;
        this.metrics = {
            requests: {
                total: 0,
                active: 0,
                failed: 0,
                averageResponseTime: 0,
                throughput: 0,
            },
            servers: {
                healthy: 0,
                unhealthy: 0,
                total: 0,
            },
            loadDistribution: {
                roundRobin: 0,
                leastConnections: 0,
                weighted: 0,
                ipHash: 0,
            }
        };
        this.currentServerIndex = 0;
        this.serverWeights = new Map();
        this.connectionCounts = new Map();
        this.sessionStore = new Map();
    }

    /**
     * Initialize advanced load balancer
     */
    async initialize() {
        logger.info('🚀 Initializing Advanced Load Balancer...');

        try {
            // Setup server pool
            await this.setupServerPool();

            // Initialize health checks
            await this.setupHealthChecks();

            // Setup load balancing algorithms
            this.setupLoadBalancingAlgorithms();

            // Initialize session management
            await this.setupSessionManagement();

            // Setup failover mechanisms
            this.setupFailoverMechanisms();

            // Initialize monitoring
            await this.setupMonitoring();

            // Setup auto-scaling
            this.setupAutoScaling();

            logger.info('✅ Advanced Load Balancer initialized successfully');
        } catch (error) {
            logger.error('❌ Load balancer initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup server pool with multiple backend servers
     */
    async setupServerPool() {
        try {
            const serverConfigs = [
                {
                    id: 'server-1',
                    host: process.env.BACKEND_SERVER_1 || 'localhost',
                    port: process.env.BACKEND_PORT_1 || 3001,
                    weight: 1,
                    maxConnections: 2500,
                    healthCheckPath: '/health',
                },
                {
                    id: 'server-2',
                    host: process.env.BACKEND_SERVER_2 || 'localhost',
                    port: process.env.BACKEND_PORT_2 || 3002,
                    weight: 1,
                    maxConnections: 2500,
                    healthCheckPath: '/health',
                },
                {
                    id: 'server-3',
                    host: process.env.BACKEND_SERVER_3 || 'localhost',
                    port: process.env.BACKEND_PORT_3 || 3003,
                    weight: 1,
                    maxConnections: 2500,
                    healthCheckPath: '/health',
                },
                {
                    id: 'server-4',
                    host: process.env.BACKEND_SERVER_4 || 'localhost',
                    port: process.env.BACKEND_PORT_4 || 3004,
                    weight: 1,
                    maxConnections: 2500,
                    healthCheckPath: '/health',
                },
            ];

            for (const config of serverConfigs) {
                this.servers.set(config.id, {
                    ...config,
                    status: 'unknown',
                    healthCheckFailures: 0,
                    lastHealthCheck: null,
                    activeConnections: 0,
                    responseTime: 0,
                    uptime: 0,
                });

                this.serverWeights.set(config.id, config.weight);
                this.connectionCounts.set(config.id, 0);
            }

            this.metrics.servers.total = this.servers.size;
            logger.info(`✅ Server pool initialized with ${this.servers.size} servers`);
        } catch (error) {
            logger.error('Server pool setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup health checks for all servers
     */
    async setupHealthChecks() {
        try {
            for (const [serverId, server] of this.servers) {
                this.healthChecks.set(serverId, {
                    interval: this.healthCheckInterval,
                    timeout: 5000,
                    path: server.healthCheckPath,
                    lastCheck: null,
                    consecutiveFailures: 0,
                });

                // Start health check for this server
                this.startHealthCheck(serverId);
            }

            logger.info('✅ Health checks configured for all servers');
        } catch (error) {
            logger.error('Health checks setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup load balancing algorithms
     */
    setupLoadBalancingAlgorithms() {
        try {
            // Round Robin Algorithm
            this.algorithms = {
                'round-robin': () => this.roundRobinAlgorithm(),
                'least-connections': () => this.leastConnectionsAlgorithm(),
                'weighted-round-robin': () => this.weightedRoundRobinAlgorithm(),
                'ip-hash': (clientIP) => this.ipHashAlgorithm(clientIP),
                'response-time': () => this.responseTimeAlgorithm(),
            };

            logger.info('✅ Load balancing algorithms configured');
        } catch (error) {
            logger.error('Load balancing algorithms setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup session management
     */
    async setupSessionManagement() {
        try {
            // Setup session cleanup
            setInterval(() => {
                this.cleanupExpiredSessions();
            }, 60000); // Every minute

            // Setup session monitoring
            setInterval(() => {
                this.monitorSessions();
            }, 300000); // Every 5 minutes

            logger.info('✅ Session management configured');
        } catch (error) {
            logger.error('Session management setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup failover mechanisms
     */
    setupFailoverMechanisms() {
        try {
            // Setup automatic failover
            setInterval(() => {
                this.checkFailoverConditions();
            }, 10000); // Every 10 seconds

            // Setup recovery mechanisms
            setInterval(() => {
                this.attemptServerRecovery();
            }, 30000); // Every 30 seconds

            logger.info('✅ Failover mechanisms configured');
        } catch (error) {
            logger.error('Failover mechanisms setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup monitoring
     */
    async setupMonitoring() {
        try {
            // Monitor load distribution
            setInterval(() => {
                this.monitorLoadDistribution();
            }, 30000); // Every 30 seconds

            // Monitor server performance
            setInterval(() => {
                this.monitorServerPerformance();
            }, 60000); // Every minute

            // Monitor connection counts
            setInterval(() => {
                this.monitorConnections();
            }, 15000); // Every 15 seconds

            logger.info('✅ Monitoring configured');
        } catch (error) {
            logger.error('Monitoring setup failed:', error);
            throw error;
        }
    }

    /**
     * Setup auto-scaling
     */
    setupAutoScaling() {
        try {
            // Monitor load and trigger scaling
            setInterval(() => {
                this.checkAutoScalingTriggers();
            }, 60000); // Every minute

            logger.info('✅ Auto-scaling configured');
        } catch (error) {
            logger.error('Auto-scaling setup failed:', error);
            throw error;
        }
    }

    /**
     * Get next server based on load balancing algorithm
     */
    getNextServer(clientIP = null) {
        try {
            const algorithm = this.algorithms[this.loadBalancingAlgorithm];
            if (!algorithm) {
                throw new Error(`Unknown load balancing algorithm: ${this.loadBalancingAlgorithm}`);
            }

            const serverId = algorithm(clientIP);
            const server = this.servers.get(serverId);

            if (!server || server.status !== 'healthy') {
                // Fallback to round-robin if selected server is unhealthy
                return this.getFallbackServer();
            }

            // Update connection count
            this.connectionCounts.set(serverId, this.connectionCounts.get(serverId) + 1);
            server.activeConnections++;

            // Update metrics
            this.updateMetrics('loadDistribution', { algorithm: this.loadBalancingAlgorithm });

            return server;
        } catch (error) {
            logger.error('Failed to get next server:', error);
            return this.getFallbackServer();
        }
    }

    /**
     * Round Robin Algorithm
     */
    roundRobinAlgorithm() {
        const healthyServers = Array.from(this.servers.entries())
            .filter(([_, server]) => server.status === 'healthy')
            .map(([id, _]) => id);

        if (healthyServers.length === 0) {
            throw new Error('No healthy servers available');
        }

        const serverId = healthyServers[this.currentServerIndex % healthyServers.length];
        this.currentServerIndex = (this.currentServerIndex + 1) % healthyServers.length;

        return serverId;
    }

    /**
     * Least Connections Algorithm
     */
    leastConnectionsAlgorithm() {
        let minConnections = Infinity;
        let selectedServer = null;

        for (const [serverId, server] of this.servers) {
            if (server.status === 'healthy' && server.activeConnections < minConnections) {
                minConnections = server.activeConnections;
                selectedServer = serverId;
            }
        }

        if (!selectedServer) {
            throw new Error('No healthy servers available');
        }

        return selectedServer;
    }

    /**
     * Weighted Round Robin Algorithm
     */
    weightedRoundRobinAlgorithm() {
        const healthyServers = Array.from(this.servers.entries())
            .filter(([_, server]) => server.status === 'healthy');

        if (healthyServers.length === 0) {
            throw new Error('No healthy servers available');
        }

        // Calculate total weight
        const totalWeight = healthyServers.reduce((sum, [id, _]) => {
            return sum + this.serverWeights.get(id);
        }, 0);

        // Select server based on weight
        let random = Math.random() * totalWeight;
        for (const [serverId, _] of healthyServers) {
            random -= this.serverWeights.get(serverId);
            if (random <= 0) {
                return serverId;
            }
        }

        return healthyServers[0][0]; // Fallback
    }

    /**
     * IP Hash Algorithm
     */
    ipHashAlgorithm(clientIP) {
        const healthyServers = Array.from(this.servers.entries())
            .filter(([_, server]) => server.status === 'healthy')
            .map(([id, _]) => id);

        if (healthyServers.length === 0) {
            throw new Error('No healthy servers available');
        }

        // Hash the IP address
        const hash = this.hashString(clientIP || 'unknown');
        const serverIndex = hash % healthyServers.length;

        return healthyServers[serverIndex];
    }

    /**
     * Response Time Algorithm
     */
    responseTimeAlgorithm() {
        let minResponseTime = Infinity;
        let selectedServer = null;

        for (const [serverId, server] of this.servers) {
            if (server.status === 'healthy' && server.responseTime < minResponseTime) {
                minResponseTime = server.responseTime;
                selectedServer = serverId;
            }
        }

        if (!selectedServer) {
            throw new Error('No healthy servers available');
        }

        return selectedServer;
    }

    /**
     * Get fallback server
     */
    getFallbackServer() {
        const healthyServers = Array.from(this.servers.values())
            .filter(server => server.status === 'healthy');

        if (healthyServers.length === 0) {
            throw new Error('No healthy servers available for failover');
        }

        // Return the first healthy server
        return healthyServers[0];
    }

    /**
     * Start health check for a server
     */
    startHealthCheck(serverId) {
        const server = this.servers.get(serverId);
        const healthCheck = this.healthChecks.get(serverId);

        const checkHealth = async () => {
            try {
                const startTime = performance.now();
                const response = await fetch(`http://${server.host}:${server.port}${healthCheck.path}`, {
                    method: 'GET',
                    timeout: healthCheck.timeout,
                });

                const responseTime = performance.now() - startTime;

                if (response.ok) {
                    // Server is healthy
                    server.status = 'healthy';
                    server.healthCheckFailures = 0;
                    server.responseTime = responseTime;
                    server.lastHealthCheck = new Date();
                    healthCheck.consecutiveFailures = 0;
                } else {
                    // Server is unhealthy
                    this.handleServerUnhealthy(serverId);
                }
            } catch (error) {
                // Server is down
                this.handleServerUnhealthy(serverId);
            }
        };

        // Initial health check
        checkHealth();

        // Schedule periodic health checks
        setInterval(checkHealth, healthCheck.interval);
    }

    /**
     * Handle server becoming unhealthy
     */
    handleServerUnhealthy(serverId) {
        const server = this.servers.get(serverId);
        const healthCheck = this.healthChecks.get(serverId);

        healthCheck.consecutiveFailures++;
        server.lastHealthCheck = new Date();

        if (healthCheck.consecutiveFailures >= this.failoverThreshold) {
            server.status = 'unhealthy';
            this.metrics.servers.unhealthy++;
            this.metrics.servers.healthy--;

            logger.warn(`Server ${serverId} marked as unhealthy after ${healthCheck.consecutiveFailures} consecutive failures`);

            // Trigger failover
            this.triggerFailover(serverId);
        }
    }

    /**
     * Trigger failover for a server
     */
    triggerFailover(serverId) {
        try {
            // Redirect existing connections to healthy servers
            const healthyServers = Array.from(this.servers.values())
                .filter(server => server.status === 'healthy' && server.id !== serverId);

            if (healthyServers.length === 0) {
                logger.error('No healthy servers available for failover');
                return;
            }

            // Redistribute load
            this.redistributeLoad(serverId, healthyServers);

            logger.info(`Failover triggered for server ${serverId}`);
        } catch (error) {
            logger.error('Failover failed:', error);
        }
    }

    /**
     * Redistribute load after failover
     */
    redistributeLoad(failedServerId, healthyServers) {
        try {
            // Clear connection count for failed server
            this.connectionCounts.set(failedServerId, 0);

            // Update server weights to distribute load
            const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);

            for (const server of healthyServers) {
                const newWeight = Math.ceil((server.weight / totalWeight) * this.servers.size);
                this.serverWeights.set(server.id, newWeight);
            }

            logger.info(`Load redistributed after failover of server ${failedServerId}`);
        } catch (error) {
            logger.error('Load redistribution failed:', error);
        }
    }

    /**
     * Attempt server recovery
     */
    async attemptServerRecovery() {
        for (const [serverId, server] of this.servers) {
            if (server.status === 'unhealthy') {
                try {
                    const healthCheck = this.healthChecks.get(serverId);
                    const response = await fetch(`http://${server.host}:${server.port}${healthCheck.path}`, {
                        method: 'GET',
                        timeout: 5000,
                    });

                    if (response.ok) {
                        // Server recovered
                        server.status = 'healthy';
                        server.healthCheckFailures = 0;
                        healthCheck.consecutiveFailures = 0;
                        this.metrics.servers.healthy++;
                        this.metrics.servers.unhealthy--;

                        logger.info(`Server ${serverId} recovered and is now healthy`);
                    }
                } catch (error) {
                    // Server still unhealthy
                    logger.debug(`Server ${serverId} still unhealthy`);
                }
            }
        }
    }

    /**
     * Update metrics
     */
    updateMetrics(type, data) {
        switch (type) {
            case 'request':
                this.metrics.requests.total++;
                this.metrics.requests.averageResponseTime =
                    (this.metrics.requests.averageResponseTime + data.duration) / 2;
                if (data.failed) {
                    this.metrics.requests.failed++;
                }
                break;
            case 'loadDistribution':
                this.metrics.loadDistribution[data.algorithm]++;
                break;
        }
    }

    /**
     * Get load balancer metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            servers: {
                ...this.metrics.servers,
                details: Array.from(this.servers.values()).map(server => ({
                    id: server.id,
                    status: server.status,
                    activeConnections: server.activeConnections,
                    responseTime: server.responseTime,
                    uptime: server.uptime,
                    lastHealthCheck: server.lastHealthCheck,
                })),
            },
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Hash string for IP hash algorithm
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Monitor methods
     */
    monitorLoadDistribution() {
        const totalRequests = Object.values(this.metrics.loadDistribution).reduce((sum, count) => sum + count, 0);
        if (totalRequests > 0) {
            logger.info('Load distribution:', {
                roundRobin: `${((this.metrics.loadDistribution.roundRobin / totalRequests) * 100).toFixed(1)}%`,
                leastConnections: `${((this.metrics.loadDistribution.leastConnections / totalRequests) * 100).toFixed(1)}%`,
                weighted: `${((this.metrics.loadDistribution.weighted / totalRequests) * 100).toFixed(1)}%`,
                ipHash: `${((this.metrics.loadDistribution.ipHash / totalRequests) * 100).toFixed(1)}%`,
            });
        }
    }

    monitorServerPerformance() {
        for (const [serverId, server] of this.servers) {
            if (server.status === 'healthy') {
                logger.info(`Server ${serverId} performance:`, {
                    activeConnections: server.activeConnections,
                    responseTime: `${server.responseTime.toFixed(2)}ms`,
                    uptime: server.uptime,
                });
            }
        }
    }

    monitorConnections() {
        const totalConnections = Array.from(this.connectionCounts.values()).reduce((sum, count) => sum + count, 0);
        this.metrics.requests.active = totalConnections;

        if (totalConnections > this.maxConnections * 0.8) {
            logger.warn(`High connection count: ${totalConnections}/${this.maxConnections}`);
        }
    }

    checkAutoScalingTriggers() {
        const totalConnections = Array.from(this.connectionCounts.values()).reduce((sum, count) => sum + count, 0);
        const healthyServers = Array.from(this.servers.values()).filter(server => server.status === 'healthy').length;

        if (totalConnections > this.maxConnections * 0.9 && healthyServers < this.servers.size) {
            logger.info('Auto-scaling trigger: High load detected');
            this.triggerAutoScaling();
        }
    }

    triggerAutoScaling() {
        // Implementation would depend on your cloud provider
        logger.info('Auto-scaling triggered');
    }

    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessionStore) {
            if (now - session.lastAccess > this.sessionTimeout) {
                this.sessionStore.delete(sessionId);
            }
        }
    }

    monitorSessions() {
        logger.info(`Active sessions: ${this.sessionStore.size}`);
    }

    checkFailoverConditions() {
        const healthyServers = Array.from(this.servers.values()).filter(server => server.status === 'healthy').length;
        if (healthyServers === 0) {
            logger.error('CRITICAL: No healthy servers available');
        } else if (healthyServers < this.servers.size / 2) {
            logger.warn(`WARNING: Only ${healthyServers}/${this.servers.size} servers healthy`);
        }
    }
}

export default AdvancedLoadBalancer; 