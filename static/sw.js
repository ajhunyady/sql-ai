// Enhanced Service Worker - Backend Proxy with IndexedDB Persistence
// This service worker acts as a backend proxy, handling all CRUD operations
// with enhanced error handling, logging, and IndexedDB persistence.

const CACHE_NAME = 'coagent-sql-v2';
const API_BASE = '/api';
const DB_NAME = 'CoAgentDB';
const DB_VERSION = 1;

// Enhanced logging system
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = null, requestId = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      requestId
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to clients for debugging
    this.sendToClients(entry);

    // Console output for development
    console.log(`[SW ${level.toUpperCase()}] ${message}`, data || '');
  }

  info(message, data = null, requestId = null) {
    this.log('info', message, data, requestId);
  }

  warn(message, data = null, requestId = null) {
    this.log('warn', message, data, requestId);
  }

  error(message, data = null, requestId = null) {
    this.log('error', message, data, requestId);
  }

  debug(message, data = null, requestId = null) {
    this.log('debug', message, data, requestId);
  }

  sendToClients(entry) {
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'log',
          data: entry
        });
      });
    });
  }

  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requestCount: 0,
      responseTime: 0,
      errorCount: 0,
      lastUpdated: new Date().toISOString()
    };
    this.requestTimes = new Map();
  }

  startRequest(requestId) {
    this.requestTimes.set(requestId, Date.now());
    this.metrics.requestCount++;
  }

  endRequest(requestId) {
    const startTime = this.requestTimes.get(requestId);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.metrics.responseTime = (this.metrics.responseTime + duration) / 2;
      this.requestTimes.delete(requestId);
    }
  }

  recordError() {
    this.metrics.errorCount++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      lastUpdated: new Date().toISOString()
    };
  }
}

// IndexedDB Database Manager
class DatabaseManager {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        logger.error('Failed to open IndexedDB', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        logger.info('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('agents')) {
          const agentStore = db.createObjectStore('agents', { keyPath: 'id' });
          agentStore.createIndex('createdAt', 'createdAt', { unique: false });
          agentStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          agentStore.createIndex('isActive', 'isActive', { unique: false });
        }

        if (!db.objectStoreNames.contains('llmProviders')) {
          const providerStore = db.createObjectStore('llmProviders', { keyPath: 'id' });
          providerStore.createIndex('createdAt', 'createdAt', { unique: false });
          providerStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          providerStore.createIndex('isActive', 'isActive', { unique: false });
          providerStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('datastores')) {
          const datastoreStore = db.createObjectStore('datastores', { keyPath: 'id' });
          datastoreStore.createIndex('createdAt', 'createdAt', { unique: false });
          datastoreStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          datastoreStore.createIndex('isActive', 'isActive', { unique: false });
          datastoreStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async create(storeName, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, id, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll() {
    await this.init();
    const stores = ['agents', 'llmProviders', 'datastores'];
    for (const storeName of stores) {
      await this.clearStore(storeName);
    }
  }
}

// Initialize services
const logger = new Logger();
const performanceMonitor = new PerformanceMonitor();
const dbManager = new DatabaseManager();

// In-memory data stores (fallback and initial data)
let agents = [];
let llmProviders = [];
let datastores = [];

// Initialize with demo data
function initializeDemoData() {
  agents = [
    {
      id: '1',
      name: 'Sales Assistant',
      description: 'Helps analyze sales data and generate reports',
      createdAt: '2023-01-15T00:00:00.000Z',
      updatedAt: '2023-01-20T00:00:00.000Z',
      llmProviderId: 'openai-1',
      datastoreIds: ['postgres-1'],
      guidance: {
        generalInstructions: 'You are a sales data assistant. Help users analyze sales trends and generate reports.',
        tableSemantics: {
          sales: 'Contains sales transaction data with product, customer, and revenue information',
          products: 'Product catalog with pricing and category information'
        },
        customPrompts: [
          'Generate a monthly sales report',
          'Identify top performing products'
        ]
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Customer Support Bot',
      description: 'Answers customer questions using knowledge base',
      createdAt: '2023-02-10T00:00:00.000Z',
      updatedAt: '2023-02-15T00:00:00.000Z',
      llmProviderId: 'anthropic-1',
      datastoreIds: ['surrealdb-1'],
      guidance: {
        generalInstructions: 'You are a customer support assistant. Answer questions based on the knowledge base.',
        tableSemantics: {
          faq: 'Frequently asked questions and answers',
          tickets: 'Customer support tickets with resolution status'
        },
        customPrompts: [
          'How do I reset my password?',
          'What is your return policy?'
        ]
      },
      isActive: true
    }
  ];

  llmProviders = [
    {
      id: 'openai-1',
      name: 'OpenAI Primary',
      type: 'openai',
      apiKey: 'sk-************',
      modelName: 'gpt-4-turbo',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: 'anthropic-1',
      name: 'Anthropic Claude',
      type: 'anthropic',
      apiKey: 'sk-************',
      modelName: 'claude-3-opus',
      createdAt: '2023-01-05T00:00:00.000Z',
      updatedAt: '2023-01-05T00:00:00.000Z',
      isActive: true
    },
    {
      id: 'ollama-1',
      name: 'Local Ollama',
      type: 'ollama',
      baseUrl: 'http://localhost:11434',
      modelName: 'llama3',
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
      isActive: true
    }
  ];

  datastores = [
    {
      id: 'postgres-1',
      name: 'Production PostgreSQL',
      type: 'postgres',
      connectionString: 'postgresql://user:password@host:5432/database',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: 'surrealdb-1',
      name: 'Analytics SurrealDB',
      type: 'surrealdb',
      connectionString: 'ws://localhost:8000/rpc',
      createdAt: '2023-01-10T00:00:00.000Z',
      updatedAt: '2023-01-10T00:00:00.000Z',
      isActive: true
    }
  ];

  logger.info('Demo data initialized');
}

// Load data from IndexedDB or initialize with demo data
async function loadData() {
  try {
    await dbManager.init();

    // Try to load from IndexedDB
    const storedAgents = await dbManager.getAll('agents');
    const storedProviders = await dbManager.getAll('llmProviders');
    const storedDatastores = await dbManager.getAll('datastores');

    if (storedAgents.length > 0) {
      agents = storedAgents;
      logger.info(`Loaded ${agents.length} agents from IndexedDB`);
    } else {
      initializeDemoData();
      await saveData();
    }

    if (storedProviders.length > 0) {
      llmProviders = storedProviders;
      logger.info(`Loaded ${llmProviders.length} LLM providers from IndexedDB`);
    } else {
      initializeDemoData();
      await saveData();
    }

    if (storedDatastores.length > 0) {
      datastores = storedDatastores;
      logger.info(`Loaded ${datastores.length} datastores from IndexedDB`);
    } else {
      initializeDemoData();
      await saveData();
    }
  } catch (error) {
    logger.error('Failed to load data from IndexedDB, using demo data', error);
    initializeDemoData();
  }
}

// Save data to IndexedDB
async function saveData() {
  try {
    await dbManager.init();

    // Clear existing data
    await dbManager.clearStore('agents');
    await dbManager.clearStore('llmProviders');
    await dbManager.clearStore('datastores');

    // Save current data
    for (const agent of agents) {
      await dbManager.create('agents', agent);
    }

    for (const provider of llmProviders) {
      await dbManager.create('llmProviders', provider);
    }

    for (const datastore of datastores) {
      await dbManager.create('datastores', datastore);
    }

    logger.info('Data saved to IndexedDB');
  } catch (error) {
    logger.error('Failed to save data to IndexedDB', error);
  }
}

// Utility functions
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function createErrorResponse(message, status = 400, requestId = null) {
  logger.error(`API Error: ${message}`, null, requestId);
  performanceMonitor.recordError();
  return createResponse({ error: message }, status);
}

// Request interceptor for logging
function interceptRequest(request, requestId) {
  logger.debug(`Incoming ${request.method} request to ${request.url}`, {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  }, requestId);

  performanceMonitor.startRequest(requestId);
}

// Response interceptor for logging
function interceptResponse(response, requestId) {
  performanceMonitor.endRequest(requestId);

  logger.debug(`Response for request ${requestId}`, {
    status: response.status,
    statusText: response.statusText
  }, requestId);
}

// Enhanced CRUD operations with error handling and logging
async function handleAgents(request, url) {
  const requestId = generateRequestId();
  const method = request.method;
  const pathParts = url.pathname.split('/');
  const agentId = pathParts[3];

  try {
    interceptRequest(request, requestId);

    switch (method) {
      case 'GET':
        if (agentId) {
          const agent = agents.find(a => a.id === agentId);
          if (!agent) {
            const errorResponse = createErrorResponse('Agent not found', 404, requestId);
            interceptResponse(errorResponse, requestId);
            return errorResponse;
          }
          const getResponse = createResponse(agent);
          interceptResponse(getResponse, requestId);
          return getResponse;
        }
        const listResponse = createResponse(agents);
        interceptResponse(listResponse, requestId);
        return listResponse;

      case 'POST':
        const postData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const newAgent = {
          id: generateId(),
          ...postData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        agents.push(newAgent);
        await saveData();

        logger.info('Created new agent', { id: newAgent.id, name: newAgent.name }, requestId);
        const createdResponse = createResponse(newAgent, 201);
        interceptResponse(createdResponse, requestId);
        return createdResponse;

      case 'PUT':
        if (!agentId) {
          const response = createErrorResponse('Agent ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const putData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const index = agents.findIndex(a => a.id === agentId);
        if (index === -1) {
          const response = createErrorResponse('Agent not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const updatedAgent = {
          ...agents[index],
          ...putData,
          id: agentId,
          updatedAt: new Date().toISOString()
        };

        agents[index] = updatedAgent;
        await saveData();

        logger.info('Updated agent', { id: agentId, name: updatedAgent.name }, requestId);
        const updatedResponse = createResponse(updatedAgent);
        interceptResponse(updatedResponse, requestId);
        return updatedResponse;

      case 'DELETE':
        if (!agentId) {
          const response = createErrorResponse('Agent ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deleteIndex = agents.findIndex(a => a.id === agentId);
        if (deleteIndex === -1) {
          const response = createErrorResponse('Agent not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deletedAgent = agents[deleteIndex];
        agents.splice(deleteIndex, 1);
        await saveData();

        logger.info('Deleted agent', { id: agentId, name: deletedAgent.name }, requestId);
        const deletedResponse = createResponse({ success: true });
        interceptResponse(deletedResponse, requestId);
        return deletedResponse;

      case 'PATCH':
        if (!agentId) {
          const response = createErrorResponse('Agent ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        // Check for status endpoint
        if (pathParts[4] === 'status') {
          const patchData = await request.json().catch(error => {
            throw new Error('Invalid JSON in request body');
          });

          const index = agents.findIndex(a => a.id === agentId);
          if (index === -1) {
            const response = createErrorResponse('Agent not found', 404, requestId);
            interceptResponse(response, requestId);
            return response;
          }

          const updatedAgent = {
            ...agents[index],
            isActive: patchData.isActive,
            updatedAt: new Date().toISOString()
          };

          agents[index] = updatedAgent;
          await saveData();

          logger.info('Updated agent status', { id: agentId, isActive: updatedAgent.isActive }, requestId);
          const statusResponse = createResponse(updatedAgent);
          interceptResponse(statusResponse, requestId);
          return statusResponse;
        } else {
          const response = createErrorResponse('Invalid PATCH endpoint', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

      default:
        const methodNotAllowedResponse = createErrorResponse('Method not allowed', 405, requestId);
        interceptResponse(methodNotAllowedResponse, requestId);
        return methodNotAllowedResponse;
    }
  } catch (error) {
    logger.error('Error handling agent request', error, requestId);
    const response = createErrorResponse(`Internal server error: ${error.message}`, 500, requestId);
    interceptResponse(response, requestId);
    return response;
  }
}

async function handleLLMProviders(request, url) {
  const requestId = generateRequestId();
  const method = request.method;
  const pathParts = url.pathname.split('/');
  const providerId = pathParts[3];

  try {
    interceptRequest(request, requestId);

    switch (method) {
      case 'GET':
        if (providerId) {
          const provider = llmProviders.find(p => p.id === providerId);
          if (!provider) {
            const response = createErrorResponse('Provider not found', 404, requestId);
            interceptResponse(response, requestId);
            return response;
          }
          const response = createResponse(provider);
          interceptResponse(response, requestId);
          return response;
        }
        const listProvidersResponse = createResponse(llmProviders);
        interceptResponse(listProvidersResponse, requestId);
        return listProvidersResponse;

      case 'POST':
        const postData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const newProvider = {
          id: generateId(),
          ...postData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        llmProviders.push(newProvider);
        await saveData();

        logger.info('Created new LLM provider', { id: newProvider.id, name: newProvider.name }, requestId);
        const createdProviderResponse = createResponse(newProvider, 201);
        interceptResponse(createdProviderResponse, requestId);
        return createdProviderResponse;

      case 'PUT':
        if (!providerId) {
          const response = createErrorResponse('Provider ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const putData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const index = llmProviders.findIndex(p => p.id === providerId);
        if (index === -1) {
          const response = createErrorResponse('Provider not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const updatedProvider = {
          ...llmProviders[index],
          ...putData,
          id: providerId,
          updatedAt: new Date().toISOString()
        };

        llmProviders[index] = updatedProvider;
        await saveData();

        logger.info('Updated LLM provider', { id: providerId, name: updatedProvider.name }, requestId);
        const updatedProviderResponse = createResponse(updatedProvider);
        interceptResponse(updatedProviderResponse, requestId);
        return updatedProviderResponse;

      case 'DELETE':
        if (!providerId) {
          const response = createErrorResponse('Provider ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deleteIndex = llmProviders.findIndex(p => p.id === providerId);
        if (deleteIndex === -1) {
          const response = createErrorResponse('Provider not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deletedProvider = llmProviders[deleteIndex];
        llmProviders.splice(deleteIndex, 1);
        await saveData();

        logger.info('Deleted LLM provider', { id: providerId, name: deletedProvider.name }, requestId);
        const deletedProviderResponse = createResponse({ success: true });
        interceptResponse(deletedProviderResponse, requestId);
        return deletedProviderResponse;

      default:
        const providerMethodNotAllowedResponse = createErrorResponse('Method not allowed', 405, requestId);
        interceptResponse(providerMethodNotAllowedResponse, requestId);
        return providerMethodNotAllowedResponse;
    }
  } catch (error) {
    logger.error('Error handling LLM provider request', error, requestId);
    const response = createErrorResponse(`Internal server error: ${error.message}`, 500, requestId);
    interceptResponse(response, requestId);
    return response;
  }
}

async function handleDatastores(request, url) {
  const requestId = generateRequestId();
  const method = request.method;
  const pathParts = url.pathname.split('/');
  const datastoreId = pathParts[3];

  try {
    interceptRequest(request, requestId);

    switch (method) {
      case 'GET':
        if (datastoreId) {
          const datastore = datastores.find(d => d.id === datastoreId);
          if (!datastore) {
            const response = createErrorResponse('Datastore not found', 404, requestId);
            interceptResponse(response, requestId);
            return response;
          }
          const response = createResponse(datastore);
          interceptResponse(response, requestId);
          return response;
        }
        const listDatastoresResponse = createResponse(datastores);
        interceptResponse(listDatastoresResponse, requestId);
        return listDatastoresResponse;

      case 'POST':
        const postData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const newDatastore = {
          id: generateId(),
          ...postData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        datastores.push(newDatastore);
        await saveData();

        logger.info('Created new datastore', { id: newDatastore.id, name: newDatastore.name }, requestId);
        const createdDatastoreResponse = createResponse(newDatastore, 201);
        interceptResponse(createdDatastoreResponse, requestId);
        return createdDatastoreResponse;

      case 'PUT':
        if (!datastoreId) {
          const response = createErrorResponse('Datastore ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const putData = await request.json().catch(error => {
          throw new Error('Invalid JSON in request body');
        });

        const index = datastores.findIndex(d => d.id === datastoreId);
        if (index === -1) {
          const response = createErrorResponse('Datastore not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const updatedDatastore = {
          ...datastores[index],
          ...putData,
          id: datastoreId,
          updatedAt: new Date().toISOString()
        };

        datastores[index] = updatedDatastore;
        await saveData();

        logger.info('Updated datastore', { id: datastoreId, name: updatedDatastore.name }, requestId);
        const updatedDatastoreResponse = createResponse(updatedDatastore);
        interceptResponse(updatedDatastoreResponse, requestId);
        return updatedDatastoreResponse;

      case 'DELETE':
        if (!datastoreId) {
          const response = createErrorResponse('Datastore ID required', 400, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deleteIndex = datastores.findIndex(d => d.id === datastoreId);
        if (deleteIndex === -1) {
          const response = createErrorResponse('Datastore not found', 404, requestId);
          interceptResponse(response, requestId);
          return response;
        }

        const deletedDatastore = datastores[deleteIndex];
        datastores.splice(deleteIndex, 1);
        await saveData();

        logger.info('Deleted datastore', { id: datastoreId, name: deletedDatastore.name }, requestId);
        const deletedDatastoreResponse = createResponse({ success: true });
        interceptResponse(deletedDatastoreResponse, requestId);
        return deletedDatastoreResponse;

      default:
        const datastoreMethodNotAllowedResponse = createErrorResponse('Method not allowed', 405, requestId);
        interceptResponse(datastoreMethodNotAllowedResponse, requestId);
        return datastoreMethodNotAllowedResponse;
    }
  } catch (error) {
    logger.error('Error handling datastore request', error, requestId);
    const response = createErrorResponse(`Internal server error: ${error.message}`, 500, requestId);
    interceptResponse(response, requestId);
    return response;
  }
}

// Handle validation endpoints
async function handleValidation(request, url) {
  const requestId = generateRequestId();
  const pathParts = url.pathname.split('/');
  const resource = pathParts[3];
  const id = pathParts[4];

  try {
    interceptRequest(request, requestId);

    if (request.method !== 'POST') {
      const response = createErrorResponse('Method not allowed', 405, requestId);
      interceptResponse(response, requestId);
      return response;
    }

    // Simulate validation (always returns success after a delay)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = createResponse({ valid: true, message: 'Connection successful' });
    interceptResponse(response, requestId);
    return response;
  } catch (error) {
    logger.error('Error handling validation request', error, requestId);
    const response = createErrorResponse(`Internal server error: ${error.message}`, 500, requestId);
    interceptResponse(response, requestId);
    return response;
  }
}

// Handle debug and management endpoints
async function handleManagement(request, url) {
  const requestId = generateRequestId();
  const pathParts = url.pathname.split('/');
  const action = pathParts[3];

  try {
    interceptRequest(request, requestId);

    switch (action) {
      case 'debug-info':
        const debugInfo = {
          serviceWorkerVersion: '2.0.0',
          uptime: Date.now() - startTime,
          memoryUsage: {
            used: performance.memory ? performance.memory.usedJSHeapSize : 0,
            total: performance.memory ? performance.memory.totalJSHeapSize : 0
          },
          activeRequests: Array.from(performanceMonitor.requestTimes.keys()),
          lastErrors: logger.getRecentLogs(10).filter(log => log.level === 'error')
        };
        const debugResponse = createResponse(debugInfo);
        interceptResponse(debugResponse, requestId);
        return debugResponse;

      case 'performance-metrics':
        const metrics = performanceMonitor.getMetrics();
        const metricsResponse = createResponse(metrics);
        interceptResponse(metricsResponse, requestId);
        return metricsResponse;

      case 'clear-data':
        await dbManager.clearAll();
        agents = [];
        llmProviders = [];
        datastores = [];
        initializeDemoData();
        await saveData();

        logger.info('Cleared all data and reset to demo data', null, requestId);
        const clearResponse = createResponse({ success: true });
        interceptResponse(clearResponse, requestId);
        return clearResponse;

      case 'reset':
        await dbManager.clearAll();
        agents = [];
        llmProviders = [];
        datastores = [];
        initializeDemoData();
        await saveData();

        // Clear logs and reset metrics
        logger.logs = [];
        performanceMonitor.metrics = {
          requestCount: 0,
          responseTime: 0,
          errorCount: 0,
          lastUpdated: new Date().toISOString()
        };

        logger.info('Service worker reset to initial state', null, requestId);
        const resetResponse = createResponse({ success: true });
        interceptResponse(resetResponse, requestId);
        return resetResponse;

      default:
        const response = createErrorResponse('Management action not found', 404, requestId);
        interceptResponse(response, requestId);
        return response;
    }
  } catch (error) {
    logger.error('Error handling management request', error, requestId);
    const response = createErrorResponse(`Internal server error: ${error.message}`, 500, requestId);
    interceptResponse(response, requestId);
    return response;
  }
}

// Handle messages from clients
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  const requestId = generateRequestId();

  try {
    logger.debug('Received message from client', { type, payload }, requestId);

    switch (type) {
      case 'get-debug-info':
        handleManagement(new Request('/api/management/debug-info'), new URL('http://localhost/api/management/debug-info'))
          .then(response => response.json())
          .then(data => {
            event.source.postMessage({
              type: 'debug-info',
              success: true,
              data,
              timestamp: Date.now()
            });
          });
        break;

      case 'get-performance-metrics':
        handleManagement(new Request('/api/management/performance-metrics'), new URL('http://localhost/api/management/performance-metrics'))
          .then(response => response.json())
          .then(data => {
            event.source.postMessage({
              type: 'performance-metrics',
              success: true,
              data,
              timestamp: Date.now()
            });
          });
        break;

      case 'clear-data':
        handleManagement(new Request('/api/management/clear-data'), new URL('http://localhost/api/management/clear-data'))
          .then(response => response.json())
          .then(data => {
            event.source.postMessage({
              type: 'clear-data',
              success: true,
              data,
              timestamp: Date.now()
            });
          });
        break;

      case 'reset':
        handleManagement(new Request('/api/management/reset'), new URL('http://localhost/api/management/reset'))
          .then(response => response.json())
          .then(data => {
            event.source.postMessage({
              type: 'reset',
              success: true,
              data,
              timestamp: Date.now()
            });
          });
        break;

      case 'SKIP_WAITING':
        self.skipWaiting();
        logger.info('Service worker skipping waiting phase', null, requestId);
        break;

      default:
        logger.warn('Unknown message type received', { type }, requestId);
    }
  } catch (error) {
    logger.error('Error handling client message', error, requestId);
  }
});

// Main fetch event handler
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle API requests
  if (!url.pathname.startsWith(API_BASE)) {
    return;
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    event.respondWith(createResponse(null, 204));
    return;
  }

  // Route API requests
  if (url.pathname.startsWith('/api/agents')) {
    event.respondWith(handleAgents(request, url));
  } else if (url.pathname.startsWith('/api/llm-providers')) {
    event.respondWith(handleLLMProviders(request, url));
  } else if (url.pathname.startsWith('/api/datastores')) {
    event.respondWith(handleDatastores(request, url));
  } else if (url.pathname.startsWith('/api/validate')) {
    event.respondWith(handleValidation(request, url));
  } else if (url.pathname.startsWith('/api/management')) {
    event.respondWith(handleManagement(request, url));
  } else {
    event.respondWith(createErrorResponse('Endpoint not found', 404));
  }
});

// Service worker installation
self.addEventListener('install', event => {
  logger.info('Installing service worker...');
  self.skipWaiting();
});

// Service worker activation
const startTime = Date.now();
self.addEventListener('activate', event => {
  logger.info('Activating service worker...');

  // Take control of all clients immediately
  event.waitUntil(clients.claim());

  // Initialize data
  event.waitUntil(loadData().catch(error => {
    logger.error('Failed to initialize data during activation', error);
  }));

  logger.info('Service worker activated successfully');
});
