// Service Worker Utilities
// This module provides utilities for communicating with the service worker and managing its state

import type { 
  ServiceWorkerMessage, 
  ServiceWorkerResponse, 
  ServiceWorkerStatus,
  DebugInfo,
  LogEntry,
  PerformanceMetrics
} from '$lib/types/service-worker';

export class ServiceWorkerUtils {
  private static instance: ServiceWorkerUtils;
  private registration: ServiceWorkerRegistration | null = null;
  private messageHandlers: Map<string, (response: ServiceWorkerResponse) => void> = new Map();
  private logListeners: Set<(log: LogEntry) => void> = new Set();
  private debugInfoListeners: Set<(info: DebugInfo) => void> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): ServiceWorkerUtils {
    if (!ServiceWorkerUtils.instance) {
      ServiceWorkerUtils.instance = new ServiceWorkerUtils();
    }
    return ServiceWorkerUtils.instance;
  }

  private async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));
        
        console.log('[SW Utils] Service worker utilities initialized');
      } catch (error) {
        console.error('[SW Utils] Failed to initialize service worker utilities:', error);
      }
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data as ServiceWorkerResponse;
    
    // Handle log messages
    if (message.type === 'log' && message.data) {
      this.logListeners.forEach(listener => listener(message.data));
      return;
    }

    // Handle debug info updates
    if (message.type === 'debug-info' && message.data) {
      this.debugInfoListeners.forEach(listener => listener(message.data));
      return;
    }

    // Handle response messages
    if (message.type && this.messageHandlers.has(message.type)) {
      const handler = this.messageHandlers.get(message.type)!;
      handler(message);
      this.messageHandlers.delete(message.type);
    }
  }

  async sendMessage(type: string, payload?: any): Promise<ServiceWorkerResponse> {
    return new Promise((resolve) => {
      const messageId = `${type}-${Date.now()}-${Math.random()}`;
      
      // Set up response handler
      this.messageHandlers.set(messageId, (response: ServiceWorkerResponse) => {
        resolve(response);
      });

      // Send message to service worker
      if (this.registration?.active) {
        this.registration.active.postMessage({
          type: messageId,
          payload,
          timestamp: Date.now()
        } as ServiceWorkerMessage);
      } else {
        resolve({
          success: false,
          error: 'Service worker not active'
        });
      }
    });
  }

  // Get service worker status
  async getStatus(): Promise<ServiceWorkerStatus> {
    if (!('serviceWorker' in navigator)) {
      return 'not-supported';
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return 'not-registered';
    }

    if (registration.active) {
      return 'active';
    } else if (registration.installing) {
      return 'installing';
    } else if (registration.waiting) {
      return 'waiting';
    }

    return 'unknown';
  }

  // Get debug information from service worker
  async getDebugInfo(): Promise<DebugInfo | null> {
    try {
      const response = await this.sendMessage('get-debug-info');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('[SW Utils] Failed to get debug info:', error);
      return null;
    }
  }

  // Get performance metrics from service worker
  async getPerformanceMetrics(): Promise<PerformanceMetrics | null> {
    try {
      const response = await this.sendMessage('get-performance-metrics');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('[SW Utils] Failed to get performance metrics:', error);
      return null;
    }
  }

  // Clear service worker data
  async clearData(): Promise<boolean> {
    try {
      const response = await this.sendMessage('clear-data');
      return response.success;
    } catch (error) {
      console.error('[SW Utils] Failed to clear service worker data:', error);
      return false;
    }
  }

  // Reset service worker to initial state
  async reset(): Promise<boolean> {
    try {
      const response = await this.sendMessage('reset');
      return response.success;
    } catch (error) {
      console.error('[SW Utils] Failed to reset service worker:', error);
      return false;
    }
  }

  // Register log listener
  onLog(listener: (log: LogEntry) => void): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  // Register debug info listener
  onDebugInfo(listener: (info: DebugInfo) => void): () => void {
    this.debugInfoListeners.add(listener);
    return () => this.debugInfoListeners.delete(listener);
  }

  // Check if service worker is supported
  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  // Get service worker registration
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Force service worker update
  async forceUpdate(): Promise<boolean> {
    try {
      if (this.registration) {
        await this.registration.update();
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SW Utils] Failed to force service worker update:', error);
      return false;
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    try {
      if (this.registration) {
        return await this.registration.unregister();
      }
      return false;
    } catch (error) {
      console.error('[SW Utils] Failed to unregister service worker:', error);
      return false;
    }
  }
}

// Export singleton instance
export const swUtils = ServiceWorkerUtils.getInstance();

// Export convenience functions
export const getSWStatus = () => swUtils.getStatus();
export const getSWDebugInfo = () => swUtils.getDebugInfo();
export const getSWPerformanceMetrics = () => swUtils.getPerformanceMetrics();
export const clearSWData = () => swUtils.clearData();
export const resetSW = () => swUtils.reset();
export const forceSWUpdate = () => swUtils.forceUpdate();
export const unregisterSW = () => swUtils.unregister();