/**
 * Real-time Service for Kingdom Studios
 * WebSocket integration for live updates and notifications
 */

import { Platform } from 'react-native';
import { apiClient } from './apiClient';

// Types
export interface RealTimeEvent {
  type: string;
  data: any;
  timestamp: string;
  userId?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
  timestamp: string;
  read: boolean;
}

export interface ContentProgressEvent {
  contentId: string;
  progress: number;
  stage: 'initializing' | 'processing' | 'refining' | 'completed' | 'error';
  estimatedTimeRemaining?: number;
  error?: string;
}

export interface SystemStatusEvent {
  status: 'online' | 'offline' | 'maintenance' | 'degraded';
  message?: string;
  affectedServices?: string[];
  estimatedResolution?: string;
}

export type EventHandler<T = any> = (data: T) => void;

export class RealTimeService {
  private static instance: RealTimeService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private isConnected = false;
  private isConnecting = false;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  /**
   * Initialize WebSocket connection
   */
  async connect(userId?: string): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.userId = userId || null;

    try {
      const wsUrl = this.getWebSocketUrl();
      console.log('[RealTime] Connecting to:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      // Set connection timeout
      setTimeout(() => {
        if (!this.isConnected && this.isConnecting) {
          this.handleConnectionTimeout();
        }
      }, 10000); // 10 seconds timeout

    } catch (error) {
      console.error('[RealTime] Connection failed:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    console.log('[RealTime] Disconnecting...');
    
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.emit('connectionStatus', { status: 'disconnected' });
  }

  /**
   * Send message through WebSocket
   */
  send(type: string, data: any): void {
    if (!this.isConnected || !this.ws) {
      console.warn('[RealTime] Cannot send message - not connected');
      return;
    }

    const message = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userId: this.userId,
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('[RealTime] Failed to send message:', error);
    }
  }

  /**
   * Subscribe to events
   */
  on<T = any>(eventType: string, handler: EventHandler<T>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * Unsubscribe from events
   */
  off<T = any>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
      }
    }
  }

  /**
   * Emit event to handlers
   */
  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[RealTime] Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Get WebSocket URL
   */
  private getWebSocketUrl(): string {
    const baseUrl = __DEV__ 
      ? 'http://localhost:3000' 
      : 'https://api.kingdomstudios.app';
    
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    const params = new URLSearchParams();
    
    if (this.userId) {
      params.append('userId', this.userId);
    }
    
    if (apiClient.isAuthenticated()) {
      // Note: In production, use token in connection handshake
      params.append('auth', 'true');
    }

    return `${wsUrl}/ws?${params.toString()}`;
  }

  /**
   * Handle WebSocket open
   */
  private handleOpen(): void {
    console.log('[RealTime] Connected successfully');
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    // Start heartbeat
    this.startHeartbeat();

    // Send authentication if needed
    if (apiClient.isAuthenticated()) {
      this.send('auth', { userId: this.userId });
    }

    this.emit('connectionStatus', { status: 'connected' });
  }

  /**
   * Handle WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: RealTimeEvent = JSON.parse(event.data);
      console.log('[RealTime] Received message:', message.type, message.data);

      switch (message.type) {
        case 'notification':
          this.handleNotification(message.data);
          break;
        case 'contentProgress':
          this.handleContentProgress(message.data);
          break;
        case 'systemStatus':
          this.handleSystemStatus(message.data);
          break;
        case 'pong':
          // Heartbeat response
          break;
        default:
          this.emit(message.type, message.data);
          break;
      }

      // Emit raw message for custom handlers
      this.emit('message', message);

    } catch (error) {
      console.error('[RealTime] Failed to parse message:', error);
    }
  }

  /**
   * Handle WebSocket close
   */
  private handleClose(event: CloseEvent): void {
    console.log('[RealTime] Connection closed:', event.code, event.reason);
    this.isConnected = false;
    this.isConnecting = false;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.emit('connectionStatus', { status: 'disconnected', code: event.code, reason: event.reason });

    // Attempt reconnection if not intentional
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket error
   */
  private handleError(event: Event): void {
    console.error('[RealTime] WebSocket error:', event);
    this.emit('connectionStatus', { status: 'error', error: event });
  }

  /**
   * Handle connection timeout
   */
  private handleConnectionTimeout(): void {
    console.warn('[RealTime] Connection timeout');
    this.isConnecting = false;
    if (this.ws) {
      this.ws.close();
    }
    this.scheduleReconnect();
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[RealTime] Max reconnection attempts reached');
      this.emit('connectionStatus', { status: 'failed' });
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Exponential backoff
    this.reconnectAttempts++;

    console.log(`[RealTime] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected && !this.isConnecting) {
        this.connect(this.userId || undefined);
      }
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // 30 seconds
  }

  /**
   * Handle notification events
   */
  private handleNotification(data: NotificationData): void {
    console.log('[RealTime] Notification received:', data);
    this.emit('notification', data);
  }

  /**
   * Handle content progress events
   */
  private handleContentProgress(data: ContentProgressEvent): void {
    console.log('[RealTime] Content progress:', data);
    this.emit('contentProgress', data);
  }

  /**
   * Handle system status events
   */
  private handleSystemStatus(data: SystemStatusEvent): void {
    console.log('[RealTime] System status:', data);
    this.emit('systemStatus', data);
  }

  /**
   * Subscribe to content generation progress
   */
  subscribeToContentProgress(contentId: string, callback: EventHandler<ContentProgressEvent>): void {
    this.on('contentProgress', (data: ContentProgressEvent) => {
      if (data.contentId === contentId) {
        callback(data);
      }
    });

    // Request subscription
    this.send('subscribe', { type: 'contentProgress', contentId });
  }

  /**
   * Unsubscribe from content generation progress
   */
  unsubscribeFromContentProgress(contentId: string): void {
    this.send('unsubscribe', { type: 'contentProgress', contentId });
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(callback: EventHandler<NotificationData>): void {
    this.on('notification', callback);
    this.send('subscribe', { type: 'notifications' });
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): void {
    this.send('markNotificationRead', { notificationId });
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Get active subscriptions count
   */
  getActiveSubscriptions(): number {
    return this.eventHandlers.size;
  }
}

// Export singleton instance
export const realTimeService = RealTimeService.getInstance();
export default realTimeService;
