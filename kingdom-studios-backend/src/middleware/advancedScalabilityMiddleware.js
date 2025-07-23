/**
 * Kingdom Studios - Advanced Scalability Middleware
 * Middleware for request optimization, caching, and performance monitoring
 * Designed for 10K-100K+ concurrent users
 */

import { performance } from 'perf_hooks';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

class AdvancedScalabilityMiddleware {
    constructor() {
        this.requestCache = new Map();
        this.rateLimiters = new Map();
        this.circuitBreakers = new Map();
        this.metrics = {
            requests: {
                total: 0,
                cached: 0,
                rateLimited: 0,
                circuitBreakerOpen: 0,
                averageResponseTime: 0,
            },
            cache: {
                hits: 0,
                misses: 0,
                evictions: 0,
            },
            errors: {
                total: 0,
                byType: new Map(),
            }
        };
        this.maxCacheSize = 10000;
        this.cacheTTL = 300000; // 5 minutes
        this.rateLimitWindow = 60000; // 1 minute
        this.circuitBreakerThreshold = 5;
        this.circuitBreakerTimeout = 30000; // 30 seconds
    }

    /**
     * Request optimization middleware
     */
    requestOptimization() {
        return async (req, res, next) => {
            const startTime = performance.now();
            const requestId = this.generateRequestId(req);

            try {
                // Add request ID to context
                req.requestId = requestId;
                req.startTime = startTime;

                // Check rate limiting
                if (this.isRateLimited(req)) {
                    this.metrics.requests.rateLimited++;
                    return res.status(429).json({
                        error: 'Too many requests',
                        retryAfter: this.getRetryAfter(req),
                    });
                }

                // Check circuit breaker
                if (this.isCircuitBreakerOpen(req)) {
                    this.metrics.requests.circuitBreakerOpen++;
                    return res.status(503).json({
                        error: 'Service temporarily unavailable',
                        retryAfter: this.circuitBreakerTimeout / 1000,
                    });
                }

                // Check cache for GET requests
                if (req.method === 'GET' && this.shouldCache(req)) {
                    const cachedResponse = await this.getCachedResponse(req);
                    if (cachedResponse) {
                        this.metrics.requests.cached++;
                        this.metrics.cache.hits++;
                        return res.json(cachedResponse);
                    }
                }

                // Add response monitoring
                const originalSend = res.send;
                res.send = function (data) {
                    const responseTime = performance.now() - startTime;
                    this.updateMetrics('request', { responseTime, success: res.statusCode < 400 });

                    // Cache successful GET responses
                    if (req.method === 'GET' && res.statusCode === 200 && this.shouldCache(req)) {
                        this.cacheResponse(req, data);
                    }

                    return originalSend.call(this, data);
                }.bind(this);

                // Continue to next middleware
                next();
            } catch (error) {
                this.handleRequestError(req, error);
                next(error);
            }
        };
    }

    /**
     * Advanced caching middleware
     */
    advancedCaching() {
        return async (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }

            const cacheKey = this.generateCacheKey(req);
            const cachedData = this.requestCache.get(cacheKey);

            if (cachedData && !this.isCacheExpired(cachedData)) {
                this.metrics.cache.hits++;
                return res.json(cachedData.data);
            }

            this.metrics.cache.misses++;

            // Store original send method
            const originalSend = res.send;

            // Override send method to cache response
            res.send = function (data) {
                if (res.statusCode === 200 && this.shouldCacheResponse(req, data)) {
                    this.cacheResponse(req, data);
                }
                return originalSend.call(this, data);
            }.bind(this);

            next();
        };
    }

    /**
     * Rate limiting middleware
     */
    rateLimiting() {
        return (req, res, next) => {
            const clientId = this.getClientId(req);
            const endpoint = req.path;
            const key = `${clientId}:${endpoint}`;

            if (!this.rateLimiters.has(key)) {
                this.rateLimiters.set(key, {
                    requests: 0,
                    windowStart: Date.now(),
                    limit: this.getRateLimit(req),
                });
            }

            const limiter = this.rateLimiters.get(key);
            const now = Date.now();

            // Reset window if expired
            if (now - limiter.windowStart > this.rateLimitWindow) {
                limiter.requests = 0;
                limiter.windowStart = now;
            }

            // Check if limit exceeded
            if (limiter.requests >= limiter.limit) {
                this.metrics.requests.rateLimited++;
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil((limiter.windowStart + this.rateLimitWindow - now) / 1000),
                });
            }

            // Increment request count
            limiter.requests++;

            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', limiter.limit);
            res.setHeader('X-RateLimit-Remaining', limiter.limit - limiter.requests);
            res.setHeader('X-RateLimit-Reset', Math.ceil((limiter.windowStart + this.rateLimitWindow) / 1000));

            next();
        };
    }

    /**
     * Circuit breaker middleware
     */
    circuitBreaker() {
        return (req, res, next) => {
            const endpoint = req.path;

            if (!this.circuitBreakers.has(endpoint)) {
                this.circuitBreakers.set(endpoint, {
                    failures: 0,
                    lastFailureTime: null,
                    state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
                });
            }

            const breaker = this.circuitBreakers.get(endpoint);

            // Check if circuit breaker is open
            if (breaker.state === 'OPEN') {
                const timeSinceLastFailure = Date.now() - breaker.lastFailureTime;
                if (timeSinceLastFailure > this.circuitBreakerTimeout) {
                    breaker.state = 'HALF_OPEN';
                } else {
                    this.metrics.requests.circuitBreakerOpen++;
                    return res.status(503).json({
                        error: 'Circuit breaker open',
                        retryAfter: Math.ceil((this.circuitBreakerTimeout - timeSinceLastFailure) / 1000),
                    });
                }
            }

            // Add error handling to track failures
            const originalSend = res.send;
            res.send = function (data) {
                if (res.statusCode >= 500) {
                    this.handleCircuitBreakerFailure(endpoint);
                } else if (res.statusCode < 400) {
                    this.handleCircuitBreakerSuccess(endpoint);
                }
                return originalSend.call(this, data);
            }.bind(this);

            next();
        };
    }

    /**
     * Performance monitoring middleware
     */
    performanceMonitoring() {
        return (req, res, next) => {
            const startTime = performance.now();

            // Add performance headers
            res.setHeader('X-Response-Time', '0ms');

            // Override send to calculate response time
            const originalSend = res.send;
            res.send = function (data) {
                const responseTime = performance.now() - startTime;
                res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);

                // Update metrics
                this.updateMetrics('request', { responseTime, success: res.statusCode < 400 });

                return originalSend.call(this, data);
            }.bind(this);

            next();
        };
    }

    /**
     * Request deduplication middleware
     */
    requestDeduplication() {
        return async (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }

            const requestKey = this.generateRequestKey(req);
            const existingRequest = this.activeRequests.get(requestKey);

            if (existingRequest) {
                // Wait for existing request to complete
                try {
                    const result = await existingRequest;
                    return res.json(result);
                } catch (error) {
                    // Continue with new request if existing failed
                }
            }

            // Create new request promise
            const requestPromise = new Promise((resolve, reject) => {
                const originalSend = res.send;
                res.send = function (data) {
                    resolve(data);
                    return originalSend.call(this, data);
                };
            });

            this.activeRequests.set(requestKey, requestPromise);

            // Clean up after request completes
            requestPromise.finally(() => {
                this.activeRequests.delete(requestKey);
            });

            next();
        };
    }

    /**
     * Error handling middleware
     */
    errorHandling() {
        return (err, req, res, next) => {
            this.handleRequestError(req, err);

            // Log error with context
            logger.error('Request error:', {
                requestId: req.requestId,
                method: req.method,
                path: req.path,
                error: err.message,
                stack: err.stack,
            });

            // Send appropriate error response
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: err.message,
                });
            }

            if (err.name === 'UnauthorizedError') {
                return res.status(401).json({
                    error: 'Unauthorized',
                });
            }

            // Default error response
            res.status(500).json({
                error: 'Internal server error',
                requestId: req.requestId,
            });
        };
    }

    /**
     * Helper methods
     */
    generateRequestId(req) {
        return crypto.randomBytes(16).toString('hex');
    }

    generateCacheKey(req) {
        const key = `${req.method}:${req.path}:${JSON.stringify(req.query)}:${req.headers['authorization'] || ''}`;
        return crypto.createHash('md5').update(key).digest('hex');
    }

    generateRequestKey(req) {
        return `${req.method}:${req.path}:${JSON.stringify(req.body)}`;
    }

    getClientId(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            'unknown';
    }

    getRateLimit(req) {
        // Different limits for different endpoints
        const limits = {
            '/api/auth': 5, // 5 requests per minute for auth
            '/api/content': 100, // 100 requests per minute for content
            '/api/analytics': 50, // 50 requests per minute for analytics
            default: 1000, // 1000 requests per minute default
        };

        return limits[req.path] || limits.default;
    }

    shouldCache(req) {
        // Don't cache auth endpoints or requests with no-cache header
        if (req.path.startsWith('/api/auth') ||
            req.headers['cache-control']?.includes('no-cache')) {
            return false;
        }
        return true;
    }

    shouldCacheResponse(req, data) {
        // Only cache JSON responses
        if (typeof data !== 'string') {
            return false;
        }

        try {
            JSON.parse(data);
            return true;
        } catch {
            return false;
        }
    }

    async getCachedResponse(req) {
        const cacheKey = this.generateCacheKey(req);
        const cachedData = this.requestCache.get(cacheKey);

        if (cachedData && !this.isCacheExpired(cachedData)) {
            return cachedData.data;
        }

        return null;
    }

    cacheResponse(req, data) {
        const cacheKey = this.generateCacheKey(req);

        // Clean up cache if it's too large
        if (this.requestCache.size >= this.maxCacheSize) {
            this.evictOldestCacheEntry();
        }

        this.requestCache.set(cacheKey, {
            data: typeof data === 'string' ? JSON.parse(data) : data,
            timestamp: Date.now(),
            ttl: this.cacheTTL,
        });
    }

    isCacheExpired(cachedData) {
        return Date.now() - cachedData.timestamp > cachedData.ttl;
    }

    evictOldestCacheEntry() {
        let oldestKey = null;
        let oldestTime = Date.now();

        for (const [key, value] of this.requestCache) {
            if (value.timestamp < oldestTime) {
                oldestTime = value.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.requestCache.delete(oldestKey);
            this.metrics.cache.evictions++;
        }
    }

    isRateLimited(req) {
        const clientId = this.getClientId(req);
        const endpoint = req.path;
        const key = `${clientId}:${endpoint}`;

        const limiter = this.rateLimiters.get(key);
        if (!limiter) return false;

        const now = Date.now();
        if (now - limiter.windowStart > this.rateLimitWindow) {
            limiter.requests = 0;
            limiter.windowStart = now;
        }

        return limiter.requests >= limiter.limit;
    }

    getRetryAfter(req) {
        const clientId = this.getClientId(req);
        const endpoint = req.path;
        const key = `${clientId}:${endpoint}`;

        const limiter = this.rateLimiters.get(key);
        if (!limiter) return 60;

        return Math.ceil((limiter.windowStart + this.rateLimitWindow - Date.now()) / 1000);
    }

    isCircuitBreakerOpen(req) {
        const endpoint = req.path;
        const breaker = this.circuitBreakers.get(endpoint);

        if (!breaker) return false;

        if (breaker.state === 'OPEN') {
            const timeSinceLastFailure = Date.now() - breaker.lastFailureTime;
            if (timeSinceLastFailure > this.circuitBreakerTimeout) {
                breaker.state = 'HALF_OPEN';
                return false;
            }
            return true;
        }

        return false;
    }

    handleCircuitBreakerFailure(endpoint) {
        const breaker = this.circuitBreakers.get(endpoint);
        breaker.failures++;
        breaker.lastFailureTime = Date.now();

        if (breaker.failures >= this.circuitBreakerThreshold) {
            breaker.state = 'OPEN';
        }
    }

    handleCircuitBreakerSuccess(endpoint) {
        const breaker = this.circuitBreakers.get(endpoint);
        breaker.failures = 0;
        breaker.state = 'CLOSED';
    }

    handleRequestError(req, error) {
        this.metrics.errors.total++;

        const errorType = error.name || 'Unknown';
        const currentCount = this.metrics.errors.byType.get(errorType) || 0;
        this.metrics.errors.byType.set(errorType, currentCount + 1);
    }

    updateMetrics(type, data) {
        switch (type) {
            case 'request':
                this.metrics.requests.total++;
                this.metrics.requests.averageResponseTime =
                    (this.metrics.requests.averageResponseTime + data.responseTime) / 2;
                break;
        }
    }

    /**
     * Get middleware metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            cache: {
                ...this.metrics.cache,
                size: this.requestCache.size,
                hitRate: this.metrics.cache.hits / (this.metrics.cache.hits + this.metrics.cache.misses),
            },
            rateLimiters: this.rateLimiters.size,
            circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([endpoint, breaker]) => ({
                endpoint,
                state: breaker.state,
                failures: breaker.failures,
            })),
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Cleanup expired data
     */
    cleanup() {
        // Clean up expired cache entries
        for (const [key, value] of this.requestCache) {
            if (this.isCacheExpired(value)) {
                this.requestCache.delete(key);
                this.metrics.cache.evictions++;
            }
        }

        // Clean up expired rate limiters
        const now = Date.now();
        for (const [key, limiter] of this.rateLimiters) {
            if (now - limiter.windowStart > this.rateLimitWindow * 2) {
                this.rateLimiters.delete(key);
            }
        }
    }
}

// Create singleton instance
const advancedScalabilityMiddleware = new AdvancedScalabilityMiddleware();

// Setup cleanup interval
setInterval(() => {
    advancedScalabilityMiddleware.cleanup();
}, 60000); // Every minute

export default advancedScalabilityMiddleware; 