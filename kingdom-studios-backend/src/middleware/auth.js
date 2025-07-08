import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

/**
 * Middleware to authenticate JWT tokens
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'development_jwt_secret_key_for_testing_only_change_in_production_kingdom_studios_2024', (err, user) => {
    if (err) {
      logger.warn('Invalid access token', {
        error: err.message,
        token: token.substring(0, 20) + '...'
      });
      
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'AUTH_TOKEN_INVALID'
      });
    }

    req.user = user;
    next();
  });
}

/**
 * Middleware to authenticate API keys
 */
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      code: 'API_KEY_MISSING'
    });
  }

  // Check against configured API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || ['development-key'];
  
  if (!validApiKeys.includes(apiKey)) {
    logger.warn('Invalid API key used', {
      apiKey: apiKey.substring(0, 8) + '...',
      ip: req.ip
    });
    
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
      code: 'API_KEY_INVALID'
    });
  }

  next();
}

/**
 * Optional authentication - adds user info if token present but doesn't require it
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'development-secret', (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  
  next();
}

/**
 * Admin role middleware
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      code: 'AUTH_ADMIN_REQUIRED'
    });
  }
  
  next();
}

/**
 * Premium subscription middleware
 */
export function requirePremium(req, res, next) {
  if (!req.user || !req.user.subscription || req.user.subscription.plan === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required',
      code: 'AUTH_PREMIUM_REQUIRED'
    });
  }
  
  // Check if subscription is active
  if (req.user.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Active subscription required',
      code: 'AUTH_SUBSCRIPTION_INACTIVE'
    });
  }
  
  next();
}
