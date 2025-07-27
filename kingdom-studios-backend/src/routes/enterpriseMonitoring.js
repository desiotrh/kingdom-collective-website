/**
 * Enterprise Monitoring Routes
 * API endpoints for accessing monitoring data, analytics, and system health
 */

import express from 'express';
import WebSocket from 'ws';
import EnterpriseMonitoringDashboard from '../services/EnterpriseMonitoringDashboard.js';
import AdvancedAnalyticsEngine from '../services/AdvancedAnalyticsEngine.js';
import PerformanceMonitoringSystem from '../services/PerformanceMonitoringSystem.js';

const router = express.Router();

// Initialize monitoring services
const monitoringDashboard = new EnterpriseMonitoringDashboard();
const analyticsEngine = new AdvancedAnalyticsEngine();
const performanceMonitoring = new PerformanceMonitoringSystem({
  emailAlerting: false, // Enable in production
  slackAlerting: false, // Enable in production
  alertRecipients: ['admin@kingdomcollective.pro']
});

// Middleware for monitoring authentication
const authenticateMonitoring = (req, res, next) => {
  // In production, implement proper authentication
  const apiKey = req.headers['x-monitoring-key'];
  if (!apiKey || apiKey !== process.env.MONITORING_API_KEY) {
    // For development, allow access
    // return res.status(401).json({ error: 'Unauthorized monitoring access' });
  }
  next();
};

// Real-time monitoring dashboard endpoint
router.get('/dashboard', authenticateMonitoring, (req, res) => {
  try {
    const dashboardData = {
      monitoring: monitoringDashboard.getDashboardData(),
      analytics: analyticsEngine.getDashboardData(),
      performance: performanceMonitoring.getDashboardData(),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard data'
    });
  }
});

// System health endpoint
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: monitoringDashboard.getHealthSummary(),
      performance: performanceMonitoring.getSystemStatus(),
      version: process.env.npm_package_version || '1.0.0'
    };

    // Determine overall health status
    if (health.system.status === 'critical' || health.performance === 'critical') {
      health.status = 'critical';
    } else if (health.system.status === 'warning' || health.performance === 'warning') {
      health.status = 'warning';
    }

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Error getting health data:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      status: 'critical'
    });
  }
});

// Performance metrics endpoint
router.get('/metrics/performance', authenticateMonitoring, (req, res) => {
  try {
    const timeRange = req.query.timeRange || '1h';
    const metrics = performanceMonitoring.getDashboardData();

    res.json({
      success: true,
      data: {
        ...metrics.performance,
        timeRange,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve performance metrics'
    });
  }
});

// Analytics data endpoint
router.get('/analytics', authenticateMonitoring, (req, res) => {
  try {
    const timeRange = req.query.timeRange || '24h';
    const analyticsData = analyticsEngine.exportData(timeRange);

    res.json({
      success: true,
      data: {
        ...analyticsData,
        timeRange,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting analytics data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics data'
    });
  }
});

// Track custom event endpoint
router.post('/track', (req, res) => {
  try {
    const { userId, event, properties } = req.body;

    if (!userId || !event) {
      return res.status(400).json({
        success: false,
        error: 'userId and event are required'
      });
    }

    // Track with analytics engine
    analyticsEngine.trackEvent(userId, event, properties);

    // Record performance metrics if applicable
    if (properties.responseTime) {
      performanceMonitoring.recordPerformanceMetric('responseTime', properties.responseTime, {
        endpoint: properties.endpoint,
        userId
      });
    }

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
});

// Alerts endpoint
router.get('/alerts', authenticateMonitoring, (req, res) => {
  try {
    const { status = 'active', severity } = req.query;
    const monitoringData = monitoringDashboard.getDashboardData();
    const performanceData = performanceMonitoring.getDashboardData();

    let alerts = [...monitoringData.alerts, ...performanceData.alerts.recent];

    // Filter by status
    if (status === 'active') {
      alerts = alerts.filter(alert => !alert.resolved);
    } else if (status === 'resolved') {
      alerts = alerts.filter(alert => alert.resolved);
    }

    // Filter by severity
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }

    res.json({
      success: true,
      data: {
        alerts,
        summary: {
          total: alerts.length,
          critical: alerts.filter(a => a.severity === 'critical').length,
          warning: alerts.filter(a => a.severity === 'warning').length,
          acknowledged: alerts.filter(a => a.acknowledged).length
        }
      }
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve alerts'
    });
  }
});

// Acknowledge alert endpoint
router.post('/alerts/:alertId/acknowledge', authenticateMonitoring, (req, res) => {
  try {
    const { alertId } = req.params;
    const { acknowledgedBy = 'api' } = req.body;

    // Acknowledge in both monitoring systems
    monitoringDashboard.acknowledgeAlert(alertId, acknowledgedBy);
    performanceMonitoring.acknowledgeAlert(alertId, acknowledgedBy);

    res.json({
      success: true,
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to acknowledge alert'
    });
  }
});

// Resolve alert endpoint
router.post('/alerts/:alertId/resolve', authenticateMonitoring, (req, res) => {
  try {
    const { alertId } = req.params;
    const { resolvedBy = 'api', resolution = '' } = req.body;

    // Resolve in both monitoring systems
    monitoringDashboard.resolveAlert(alertId, resolvedBy, resolution);
    performanceMonitoring.resolveAlert(alertId, resolvedBy, resolution);

    res.json({
      success: true,
      message: 'Alert resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve alert'
    });
  }
});

// User analytics endpoint
router.get('/analytics/users', authenticateMonitoring, (req, res) => {
  try {
    const analyticsData = analyticsEngine.getDashboardData();

    res.json({
      success: true,
      data: {
        realtime: analyticsData.realtime,
        insights: analyticsData.insights.userInsights,
        summary: analyticsData.summary
      }
    });
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user analytics'
    });
  }
});

// Content analytics endpoint
router.get('/analytics/content', authenticateMonitoring, (req, res) => {
  try {
    const analyticsData = analyticsEngine.getDashboardData();

    res.json({
      success: true,
      data: {
        insights: analyticsData.insights.contentInsights,
        performance: analyticsData.insights.performanceInsights
      }
    });
  } catch (error) {
    console.error('Error getting content analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content analytics'
    });
  }
});

// Business intelligence endpoint
router.get('/analytics/business', authenticateMonitoring, (req, res) => {
  try {
    const analyticsData = analyticsEngine.getDashboardData();

    res.json({
      success: true,
      data: {
        insights: analyticsData.insights.businessInsights,
        predictions: analyticsData.insights.predictions
      }
    });
  } catch (error) {
    console.error('Error getting business analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve business analytics'
    });
  }
});

// System metrics endpoint
router.get('/metrics/system', authenticateMonitoring, (req, res) => {
  try {
    const monitoringData = monitoringDashboard.getDashboardData();

    res.json({
      success: true,
      data: {
        system: monitoringData.system,
        performance: monitoringData.performance,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system metrics'
    });
  }
});

// Export data endpoint for reporting
router.get('/export', authenticateMonitoring, (req, res) => {
  try {
    const { format = 'json', timeRange = '24h' } = req.query;

    const exportData = {
      monitoring: monitoringDashboard.getDashboardData(),
      analytics: analyticsEngine.exportData(timeRange),
      performance: performanceMonitoring.getDashboardData(),
      exportedAt: new Date().toISOString(),
      timeRange
    };

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csv = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=monitoring-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export monitoring data'
    });
  }
});

// WebSocket endpoint for real-time monitoring
router.ws = (server) => {
  const wss = new WebSocket.Server({ server, path: '/api/monitoring/realtime' });

  wss.on('connection', (ws, req) => {
    console.log('📡 New monitoring WebSocket connection');

    // Add client to monitoring dashboard
    monitoringDashboard.addClient(ws);

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to Kingdom Studios monitoring',
      timestamp: new Date().toISOString()
    }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('Received monitoring message:', message);

        // Handle different message types
        switch (message.type) {
          case 'subscribe':
            // Subscribe to specific monitoring channels
            break;
          case 'unsubscribe':
            // Unsubscribe from channels
            break;
          default:
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('📡 Monitoring WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('Monitoring WebSocket error:', error);
    });
  });

  return wss;
};

// Helper function to convert data to CSV
function convertToCSV(data) {
  // Simplified CSV conversion
  const headers = ['timestamp', 'metric', 'value', 'category'];
  const rows = [headers.join(',')];

  // Add monitoring data
  if (data.monitoring.performanceHistory) {
    data.monitoring.performanceHistory.forEach(entry => {
      rows.push([
        entry.timestamp,
        'response_time',
        entry.responseTime,
        'performance'
      ].join(','));
    });
  }

  return rows.join('\n');
}

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Monitoring API error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal monitoring system error'
  });
});

export {
  router,
  monitoringDashboard,
  analyticsEngine,
  performanceMonitoring
};
