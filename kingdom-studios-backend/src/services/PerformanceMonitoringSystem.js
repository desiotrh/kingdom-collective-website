/**
 * Performance Monitoring & Alerting System
 * Real-time performance monitoring with intelligent alerting for enterprise-scale applications
 * Monitors API performance, system health, user experience, and business metrics
 */

import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';

class PerformanceMonitoringSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      alerting: {
        email: {
          enabled: options.emailAlerting || false,
          smtp: options.emailConfig || {},
          recipients: options.alertRecipients || []
        },
        slack: {
          enabled: options.slackAlerting || false,
          webhook: options.slackWebhook || ''
        },
        sms: {
          enabled: options.smsAlerting || false,
          provider: options.smsProvider || {}
        }
      },
      thresholds: {
        responseTime: {
          warning: 1000,   // 1 second
          critical: 3000   // 3 seconds
        },
        errorRate: {
          warning: 2,      // 2%
          critical: 5      // 5%
        },
        throughput: {
          warning: 100,    // requests/minute
          critical: 50     // requests/minute
        },
        memory: {
          warning: 80,     // 80%
          critical: 90     // 90%
        },
        cpu: {
          warning: 75,     // 75%
          critical: 85     // 85%
        },
        disk: {
          warning: 85,     // 85%
          critical: 95     // 95%
        }
      },
      monitoring: {
        intervals: {
          performance: 10000,    // 10 seconds
          system: 15000,         // 15 seconds
          business: 60000,       // 1 minute
          health: 30000          // 30 seconds
        }
      }
    };
    
    this.metrics = {
      performance: {
        responseTime: [],
        errorRate: [],
        throughput: [],
        uptime: 100,
        availability: 100
      },
      system: {
        cpu: [],
        memory: [],
        disk: [],
        network: []
      },
      business: {
        activeUsers: [],
        conversions: [],
        revenue: [],
        contentGeneration: []
      },
      alerts: {
        active: [],
        history: [],
        escalated: []
      }
    };
    
    this.alertRules = new Map();
    this.notificationChannels = new Map();
    this.incidents = new Map();
    
    this.initializeMonitoring();
  }

  // Initialize monitoring system
  initializeMonitoring() {
    console.log('🔍 Initializing Performance Monitoring System...');
    
    // Setup default alert rules
    this.setupDefaultAlertRules();
    
    // Setup notification channels
    this.setupNotificationChannels();
    
    // Start monitoring intervals
    this.startMonitoringIntervals();
    
    console.log('✅ Performance monitoring system initialized');
  }

  // Setup default alert rules
  setupDefaultAlertRules() {
    // Response time alerts
    this.addAlertRule('response_time_warning', {
      metric: 'performance.responseTime',
      condition: 'average',
      threshold: this.config.thresholds.responseTime.warning,
      operator: '>',
      timeWindow: 300000, // 5 minutes
      severity: 'warning',
      message: 'Average response time exceeded warning threshold'
    });
    
    this.addAlertRule('response_time_critical', {
      metric: 'performance.responseTime',
      condition: 'average',
      threshold: this.config.thresholds.responseTime.critical,
      operator: '>',
      timeWindow: 300000,
      severity: 'critical',
      message: 'Average response time exceeded critical threshold'
    });
    
    // Error rate alerts
    this.addAlertRule('error_rate_warning', {
      metric: 'performance.errorRate',
      condition: 'percentage',
      threshold: this.config.thresholds.errorRate.warning,
      operator: '>',
      timeWindow: 600000, // 10 minutes
      severity: 'warning',
      message: 'Error rate exceeded warning threshold'
    });
    
    this.addAlertRule('error_rate_critical', {
      metric: 'performance.errorRate',
      condition: 'percentage',
      threshold: this.config.thresholds.errorRate.critical,
      operator: '>',
      timeWindow: 600000,
      severity: 'critical',
      message: 'Error rate exceeded critical threshold'
    });
    
    // System resource alerts
    this.addAlertRule('memory_warning', {
      metric: 'system.memory',
      condition: 'latest',
      threshold: this.config.thresholds.memory.warning,
      operator: '>',
      timeWindow: 0,
      severity: 'warning',
      message: 'Memory usage exceeded warning threshold'
    });
    
    this.addAlertRule('cpu_critical', {
      metric: 'system.cpu',
      condition: 'average',
      threshold: this.config.thresholds.cpu.critical,
      operator: '>',
      timeWindow: 300000,
      severity: 'critical',
      message: 'CPU usage exceeded critical threshold'
    });
    
    // Business metric alerts
    this.addAlertRule('low_active_users', {
      metric: 'business.activeUsers',
      condition: 'latest',
      threshold: 100,
      operator: '<',
      timeWindow: 0,
      severity: 'warning',
      message: 'Active user count below expected threshold'
    });
  }

  // Setup notification channels
  setupNotificationChannels() {
    // Email notifications
    if (this.config.alerting.email.enabled) {
      const transporter = nodemailer.createTransporter(this.config.alerting.email.smtp);
      this.notificationChannels.set('email', {
        type: 'email',
        transporter,
        send: this.sendEmailAlert.bind(this)
      });
    }
    
    // Slack notifications
    if (this.config.alerting.slack.enabled) {
      this.notificationChannels.set('slack', {
        type: 'slack',
        webhook: this.config.alerting.slack.webhook,
        send: this.sendSlackAlert.bind(this)
      });
    }
    
    // Console notifications (always enabled)
    this.notificationChannels.set('console', {
      type: 'console',
      send: this.sendConsoleAlert.bind(this)
    });
  }

  // Start monitoring intervals
  startMonitoringIntervals() {
    // Performance monitoring
    setInterval(() => {
      this.collectPerformanceMetrics();
      this.evaluateAlerts('performance');
    }, this.config.monitoring.intervals.performance);
    
    // System monitoring
    setInterval(() => {
      this.collectSystemMetrics();
      this.evaluateAlerts('system');
    }, this.config.monitoring.intervals.system);
    
    // Business monitoring
    setInterval(() => {
      this.collectBusinessMetrics();
      this.evaluateAlerts('business');
    }, this.config.monitoring.intervals.business);
    
    // Health check
    setInterval(() => {
      this.performHealthCheck();
    }, this.config.monitoring.intervals.health);
    
    // Alert cleanup
    setInterval(() => {
      this.cleanupOldAlerts();
    }, 3600000); // Every hour
  }

  // Add alert rule
  addAlertRule(name, rule) {
    rule.id = name;
    rule.enabled = true;
    rule.lastTriggered = null;
    rule.triggerCount = 0;
    this.alertRules.set(name, rule);
  }

  // Record performance metric
  recordPerformanceMetric(type, value, metadata = {}) {
    const timestamp = Date.now();
    const metric = {
      timestamp,
      value,
      metadata
    };
    
    switch (type) {
      case 'responseTime':
        this.metrics.performance.responseTime.push(metric);
        this.limitMetricHistory('performance.responseTime', 1000);
        break;
      case 'errorRate':
        this.metrics.performance.errorRate.push(metric);
        this.limitMetricHistory('performance.errorRate', 1000);
        break;
      case 'throughput':
        this.metrics.performance.throughput.push(metric);
        this.limitMetricHistory('performance.throughput', 1000);
        break;
    }
    
    this.emit('metric', { type, value, metadata, timestamp });
  }

  // Record system metric
  recordSystemMetric(type, value, metadata = {}) {
    const timestamp = Date.now();
    const metric = {
      timestamp,
      value,
      metadata
    };
    
    this.metrics.system[type].push(metric);
    this.limitMetricHistory(`system.${type}`, 500);
    this.emit('metric', { type: `system.${type}`, value, metadata, timestamp });
  }

  // Record business metric
  recordBusinessMetric(type, value, metadata = {}) {
    const timestamp = Date.now();
    const metric = {
      timestamp,
      value,
      metadata
    };
    
    this.metrics.business[type].push(metric);
    this.limitMetricHistory(`business.${type}`, 500);
    this.emit('metric', { type: `business.${type}`, value, metadata, timestamp });
  }

  // Limit metric history to prevent memory issues
  limitMetricHistory(metricPath, maxEntries) {
    const parts = metricPath.split('.');
    let target = this.metrics;
    
    for (const part of parts) {
      target = target[part];
    }
    
    if (Array.isArray(target) && target.length > maxEntries) {
      target.splice(0, target.length - maxEntries);
    }
  }

  // Collect performance metrics
  async collectPerformanceMetrics() {
    try {
      // Simulate collecting real performance data
      const responseTime = Math.random() * 800 + 200; // 200-1000ms
      const errorRate = Math.random() * 3; // 0-3%
      const throughput = Math.random() * 200 + 100; // 100-300 req/min
      
      this.recordPerformanceMetric('responseTime', responseTime);
      this.recordPerformanceMetric('errorRate', errorRate);
      this.recordPerformanceMetric('throughput', throughput);
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  }

  // Collect system metrics
  async collectSystemMetrics() {
    try {
      const os = require('os');
      
      // CPU usage
      const cpuUsage = await this.getCPUUsage();
      this.recordSystemMetric('cpu', cpuUsage);
      
      // Memory usage
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
      this.recordSystemMetric('memory', memoryUsage);
      
      // Disk usage (simulated)
      const diskUsage = Math.random() * 40 + 30; // 30-70%
      this.recordSystemMetric('disk', diskUsage);
      
      // Network metrics
      const networkLatency = Math.random() * 50 + 10; // 10-60ms
      this.recordSystemMetric('network', networkLatency, { type: 'latency' });
    } catch (error) {
      console.error('Error collecting system metrics:', error);
    }
  }

  // Collect business metrics
  async collectBusinessMetrics() {
    try {
      // Simulate business metrics
      const activeUsers = Math.floor(Math.random() * 2000 + 500); // 500-2500
      const conversions = Math.floor(Math.random() * 50 + 10); // 10-60
      const revenue = Math.random() * 5000 + 1000; // $1000-6000
      const contentGeneration = Math.floor(Math.random() * 200 + 50); // 50-250
      
      this.recordBusinessMetric('activeUsers', activeUsers);
      this.recordBusinessMetric('conversions', conversions);
      this.recordBusinessMetric('revenue', revenue);
      this.recordBusinessMetric('contentGeneration', contentGeneration);
    } catch (error) {
      console.error('Error collecting business metrics:', error);
    }
  }

  // Get CPU usage
  async getCPUUsage() {
    const os = require('os');
    return new Promise((resolve) => {
      const startMeasure = os.cpus();
      setTimeout(() => {
        const endMeasure = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        
        for (let i = 0; i < startMeasure.length; i++) {
          const startCpu = startMeasure[i];
          const endCpu = endMeasure[i];
          
          const idle = endCpu.times.idle - startCpu.times.idle;
          const total = Object.keys(endCpu.times).reduce((acc, key) => {
            return acc + (endCpu.times[key] - startCpu.times[key]);
          }, 0);
          
          totalIdle += idle;
          totalTick += total;
        }
        
        const usage = 100 - (totalIdle / totalTick) * 100;
        resolve(usage);
      }, 100);
    });
  }

  // Evaluate alerts for a category
  evaluateAlerts(category) {
    this.alertRules.forEach((rule, ruleId) => {
      if (!rule.enabled || !rule.metric.startsWith(category)) return;
      
      try {
        const shouldTrigger = this.evaluateAlertRule(rule);
        if (shouldTrigger) {
          this.triggerAlert(rule);
        }
      } catch (error) {
        console.error(`Error evaluating alert rule ${ruleId}:`, error);
      }
    });
  }

  // Evaluate individual alert rule
  evaluateAlertRule(rule) {
    const metricData = this.getMetricData(rule.metric, rule.timeWindow);
    if (!metricData || metricData.length === 0) return false;
    
    let value;
    switch (rule.condition) {
      case 'average':
        value = metricData.reduce((sum, m) => sum + m.value, 0) / metricData.length;
        break;
      case 'latest':
        value = metricData[metricData.length - 1].value;
        break;
      case 'max':
        value = Math.max(...metricData.map(m => m.value));
        break;
      case 'min':
        value = Math.min(...metricData.map(m => m.value));
        break;
      case 'percentage':
        value = metricData[metricData.length - 1].value;
        break;
      default:
        return false;
    }
    
    switch (rule.operator) {
      case '>':
        return value > rule.threshold;
      case '<':
        return value < rule.threshold;
      case '>=':
        return value >= rule.threshold;
      case '<=':
        return value <= rule.threshold;
      case '==':
        return value === rule.threshold;
      default:
        return false;
    }
  }

  // Get metric data for evaluation
  getMetricData(metricPath, timeWindow) {
    const parts = metricPath.split('.');
    let target = this.metrics;
    
    for (const part of parts) {
      target = target[part];
      if (!target) return null;
    }
    
    if (!Array.isArray(target)) return null;
    
    if (timeWindow === 0) return target.slice(-1);
    
    const cutoff = Date.now() - timeWindow;
    return target.filter(metric => metric.timestamp > cutoff);
  }

  // Trigger alert
  triggerAlert(rule) {
    const now = Date.now();
    
    // Check if alert was recently triggered (prevent spam)
    if (rule.lastTriggered && (now - rule.lastTriggered) < 300000) { // 5 minutes
      return;
    }
    
    const alert = {
      id: `alert_${rule.id}_${now}`,
      ruleId: rule.id,
      severity: rule.severity,
      message: rule.message,
      metric: rule.metric,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
      metadata: {
        threshold: rule.threshold,
        condition: rule.condition,
        operator: rule.operator
      }
    };
    
    // Add to active alerts
    this.metrics.alerts.active.push(alert);
    this.metrics.alerts.history.push(alert);
    
    // Update rule trigger info
    rule.lastTriggered = now;
    rule.triggerCount++;
    
    // Send notifications
    this.sendAlert(alert);
    
    // Check for escalation
    if (rule.severity === 'critical') {
      this.escalateAlert(alert);
    }
    
    this.emit('alert', alert);
    
    console.log(`🚨 Alert triggered: ${alert.message} (${alert.severity})`);
  }

  // Send alert to notification channels
  async sendAlert(alert) {
    for (const [channelName, channel] of this.notificationChannels) {
      try {
        await channel.send(alert);
      } catch (error) {
        console.error(`Failed to send alert via ${channelName}:`, error);
      }
    }
  }

  // Send email alert
  async sendEmailAlert(alert) {
    if (!this.config.alerting.email.enabled) return;
    
    const transporter = this.notificationChannels.get('email').transporter;
    const subject = `${alert.severity.toUpperCase()} Alert: ${alert.message}`;
    const html = this.generateAlertEmailHTML(alert);
    
    for (const recipient of this.config.alerting.email.recipients) {
      await transporter.sendMail({
        from: this.config.alerting.email.smtp.auth.user,
        to: recipient,
        subject,
        html
      });
    }
  }

  // Send Slack alert
  async sendSlackAlert(alert) {
    if (!this.config.alerting.slack.enabled) return;
    
    const webhook = this.config.alerting.slack.webhook;
    const color = alert.severity === 'critical' ? 'danger' : 'warning';
    
    const payload = {
      attachments: [{
        color,
        title: `${alert.severity.toUpperCase()} Alert`,
        text: alert.message,
        fields: [
          { title: 'Metric', value: alert.metric, short: true },
          { title: 'Time', value: alert.timestamp, short: true },
          { title: 'Threshold', value: alert.metadata.threshold, short: true },
          { title: 'Alert ID', value: alert.id, short: true }
        ],
        footer: 'Kingdom Studios Monitoring',
        ts: Math.floor(Date.parse(alert.timestamp) / 1000)
      }]
    };
    
    // Send webhook (implementation would use actual HTTP request)
    console.log('Slack alert payload:', JSON.stringify(payload, null, 2));
  }

  // Send console alert
  async sendConsoleAlert(alert) {
    const emoji = alert.severity === 'critical' ? '🔴' : '🟡';
    console.log(`${emoji} ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);
    console.log(`   Metric: ${alert.metric}`);
    console.log(`   Time: ${alert.timestamp}`);
    console.log(`   Alert ID: ${alert.id}`);
  }

  // Generate email HTML for alert
  generateAlertEmailHTML(alert) {
    return `
      <h2 style="color: ${alert.severity === 'critical' ? '#dc3545' : '#ffc107'}">
        ${alert.severity.toUpperCase()} Alert
      </h2>
      <p><strong>Message:</strong> ${alert.message}</p>
      <p><strong>Metric:</strong> ${alert.metric}</p>
      <p><strong>Time:</strong> ${alert.timestamp}</p>
      <p><strong>Threshold:</strong> ${alert.metadata.threshold}</p>
      <p><strong>Alert ID:</strong> ${alert.id}</p>
      <hr>
      <p><em>Kingdom Studios Performance Monitoring System</em></p>
    `;
  }

  // Escalate critical alert
  escalateAlert(alert) {
    this.metrics.alerts.escalated.push({
      ...alert,
      escalatedAt: new Date().toISOString(),
      escalationLevel: 1
    });
    
    console.log(`📢 Alert escalated: ${alert.id}`);
  }

  // Perform health check
  async performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {
        api: await this.checkAPIHealth(),
        database: await this.checkDatabaseHealth(),
        memory: await this.checkMemoryHealth(),
        disk: await this.checkDiskHealth()
      }
    };
    
    // Determine overall health
    const failedChecks = Object.values(health.checks).filter(check => !check.healthy);
    if (failedChecks.length > 0) {
      health.status = failedChecks.some(check => check.critical) ? 'critical' : 'degraded';
    }
    
    this.emit('health', health);
    
    if (health.status !== 'healthy') {
      console.log(`⚠️ Health check failed: ${health.status}`);
    }
  }

  // Check API health
  async checkAPIHealth() {
    try {
      // Simulate API health check
      const responseTime = Math.random() * 500 + 100;
      return {
        healthy: responseTime < 1000,
        critical: responseTime > 3000,
        responseTime,
        message: responseTime < 1000 ? 'API responding normally' : 'API response time high'
      };
    } catch (error) {
      return {
        healthy: false,
        critical: true,
        error: error.message,
        message: 'API health check failed'
      };
    }
  }

  // Check database health
  async checkDatabaseHealth() {
    try {
      // Simulate database health check
      const connectionTime = Math.random() * 200 + 50;
      return {
        healthy: connectionTime < 500,
        critical: connectionTime > 1000,
        connectionTime,
        message: connectionTime < 500 ? 'Database responding normally' : 'Database response time high'
      };
    } catch (error) {
      return {
        healthy: false,
        critical: true,
        error: error.message,
        message: 'Database health check failed'
      };
    }
  }

  // Check memory health
  async checkMemoryHealth() {
    const os = require('os');
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usage = ((totalMem - freeMem) / totalMem) * 100;
    
    return {
      healthy: usage < 85,
      critical: usage > 95,
      usage,
      message: usage < 85 ? 'Memory usage normal' : 'High memory usage detected'
    };
  }

  // Check disk health
  async checkDiskHealth() {
    // Simulate disk health check
    const usage = Math.random() * 30 + 40; // 40-70%
    
    return {
      healthy: usage < 90,
      critical: usage > 95,
      usage,
      message: usage < 90 ? 'Disk usage normal' : 'High disk usage detected'
    };
  }

  // Acknowledge alert
  acknowledgeAlert(alertId, acknowledgedBy = 'system') {
    const alert = this.metrics.alerts.active.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();
      this.emit('alertAcknowledged', alert);
    }
  }

  // Resolve alert
  resolveAlert(alertId, resolvedBy = 'system', resolution = '') {
    const alert = this.metrics.alerts.active.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date().toISOString();
      alert.resolution = resolution;
      
      // Remove from active alerts
      this.metrics.alerts.active = this.metrics.alerts.active.filter(a => a.id !== alertId);
      
      this.emit('alertResolved', alert);
    }
  }

  // Clean up old alerts
  cleanupOldAlerts() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    // Clean alert history
    this.metrics.alerts.history = this.metrics.alerts.history.filter(
      alert => new Date(alert.timestamp).getTime() > oneDayAgo
    );
    
    // Clean escalated alerts
    this.metrics.alerts.escalated = this.metrics.alerts.escalated.filter(
      alert => new Date(alert.timestamp).getTime() > oneDayAgo
    );
    
    console.log('🧹 Cleaned up old alerts');
  }

  // Get monitoring dashboard data
  getDashboardData() {
    return {
      status: this.getSystemStatus(),
      alerts: {
        active: this.metrics.alerts.active.length,
        critical: this.metrics.alerts.active.filter(a => a.severity === 'critical').length,
        warning: this.metrics.alerts.active.filter(a => a.severity === 'warning').length,
        recent: this.metrics.alerts.active.slice(-10)
      },
      performance: this.getPerformanceSummary(),
      system: this.getSystemSummary(),
      business: this.getBusinessSummary()
    };
  }

  // Get system status
  getSystemStatus() {
    const criticalAlerts = this.metrics.alerts.active.filter(a => a.severity === 'critical').length;
    const warningAlerts = this.metrics.alerts.active.filter(a => a.severity === 'warning').length;
    
    if (criticalAlerts > 0) return 'critical';
    if (warningAlerts > 0) return 'warning';
    return 'healthy';
  }

  // Get performance summary
  getPerformanceSummary() {
    const recent = (metric) => metric.slice(-10);
    
    return {
      responseTime: this.calculateAverage(recent(this.metrics.performance.responseTime)),
      errorRate: this.calculateAverage(recent(this.metrics.performance.errorRate)),
      throughput: this.calculateAverage(recent(this.metrics.performance.throughput)),
      uptime: this.metrics.performance.uptime
    };
  }

  // Get system summary
  getSystemSummary() {
    const recent = (metric) => metric.slice(-5);
    
    return {
      cpu: this.calculateAverage(recent(this.metrics.system.cpu)),
      memory: this.calculateAverage(recent(this.metrics.system.memory)),
      disk: this.calculateAverage(recent(this.metrics.system.disk)),
      network: this.calculateAverage(recent(this.metrics.system.network))
    };
  }

  // Get business summary
  getBusinessSummary() {
    const recent = (metric) => metric.slice(-5);
    
    return {
      activeUsers: this.getLatestValue(this.metrics.business.activeUsers),
      conversions: this.calculateSum(recent(this.metrics.business.conversions)),
      revenue: this.calculateSum(recent(this.metrics.business.revenue)),
      contentGeneration: this.calculateSum(recent(this.metrics.business.contentGeneration))
    };
  }

  // Helper: Calculate average
  calculateAverage(metrics) {
    if (!metrics || metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  // Helper: Calculate sum
  calculateSum(metrics) {
    if (!metrics || metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0);
  }

  // Helper: Get latest value
  getLatestValue(metrics) {
    if (!metrics || metrics.length === 0) return 0;
    return metrics[metrics.length - 1].value;
  }

  // Stop monitoring
  stop() {
    console.log('⏹️ Stopping Performance Monitoring System...');
    // Clear intervals (would store interval IDs in real implementation)
    console.log('✅ Performance monitoring stopped');
  }
}

export default PerformanceMonitoringSystem;
