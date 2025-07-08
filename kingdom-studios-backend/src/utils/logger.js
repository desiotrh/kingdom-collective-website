/**
 * Centralized logging utility
 */

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    if (this.isDevelopment) {
      // Pretty print for development
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
      if (Object.keys(meta).length > 0) {
        console.log('Meta:', JSON.stringify(meta, null, 2));
      }
    } else {
      // JSON format for production
      console.log(JSON.stringify(logEntry));
    }
  }

  info(message, meta = {}) {
    this.formatMessage('info', message, meta);
  }

  error(message, meta = {}) {
    this.formatMessage('error', message, meta);
  }

  warn(message, meta = {}) {
    this.formatMessage('warn', message, meta);
  }

  debug(message, meta = {}) {
    if (this.logLevel === 'debug' || this.isDevelopment) {
      this.formatMessage('debug', message, meta);
    }
  }
}

export const logger = new Logger();
