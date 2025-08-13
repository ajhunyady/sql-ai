// Service Worker Types
// This file defines TypeScript types for service worker communication and data structures

export interface ServiceWorkerMessage {
  type: string;
  payload?: any;
  timestamp?: number;
}

export interface ServiceWorkerResponse {
  type?: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: number;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Agent types
export interface Agent extends BaseEntity {
  name: string;
  description: string;
  llmProviderId?: string;
  datastoreIds: string[];
  guidance: {
    generalInstructions: string;
    tableSemantics: Record<string, string>;
    customPrompts: string[];
  };
}

export interface AgentFormData {
  name: string;
  description: string;
  llmProviderId?: string;
  datastoreIds: string[];
  guidance: {
    generalInstructions: string;
    tableSemantics: Record<string, string>;
    customPrompts: string[];
  };
}

// LLM Provider types
export interface LLMProvider extends BaseEntity {
  name: string;
  type: 'openai' | 'anthropic' | 'ollama' | 'custom';
  apiKey?: string;
  baseUrl?: string;
  modelName: string;
}

export interface LLMProviderFormData {
  name: string;
  type: 'openai' | 'anthropic' | 'ollama' | 'custom';
  apiKey?: string;
  baseUrl?: string;
  modelName: string;
}

// Datastore types
export interface Datastore extends BaseEntity {
  name: string;
  type: 'postgres' | 'surrealdb' | 'mysql' | 'mongodb';
  connectionString: string;
}

export interface DatastoreFormData {
  name: string;
  type: 'postgres' | 'surrealdb' | 'mysql' | 'mongodb';
  connectionString: string;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  message: string;
}

// Service Worker status types
export type ServiceWorkerStatus =
  | 'not-supported'
  | 'not-registered'
  | 'installing'
  | 'waiting'
  | 'active'
  | 'error'
  | 'checking'
  | 'unknown';

// Performance metrics
export interface PerformanceMetrics {
  requestCount: number;
  responseTime: number;
  cacheHits: number;
  cacheMisses: number;
  errorCount: number;
  lastUpdated: string;
}

// Log entry types
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  requestId?: string;
}

// Debug information
export interface DebugInfo {
  serviceWorkerVersion: string;
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
  };
  activeRequests: string[];
  lastErrors: LogEntry[];
}

// IndexedDB schema types
export interface IndexedDBSchema {
  name: string;
  version: number;
  stores: {
    [key: string]: {
      keyPath: string;
      indexes: Array<{
        name: string;
        keyPath: string;
        options?: IDBIndexParameters;
      }>;
    };
  };
}

// API request/response types
export interface APIRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp: number;
  id: string;
}

export interface APIResponse {
  status: number;
  headers?: Record<string, string>;
  body?: any;
  timestamp: number;
  requestId: string;
  duration: number;
}