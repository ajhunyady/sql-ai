// API Service Module
// This module handles all communication with the service worker backend proxy

import type { Agent, AgentFormData } from '$lib/models/agent';
import type { LLMProvider, LLMProviderFormData } from '$lib/models/llm-provider';
import type { Datastore, DatastoreFormData } from '$lib/models/datastore';

const API_BASE = '/api';

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE}${endpoint}`;

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		...options
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Network error' }));
		throw new Error(error.error || `HTTP ${response.status}`);
	}

	return response.json();
}

// Agent API functions
export const agentApi = {
	getAll: (): Promise<Agent[]> => apiRequest('/agents'),

	getById: (id: string): Promise<Agent> => apiRequest(`/agents/${id}`),

	create: (data: AgentFormData): Promise<Agent> =>
		apiRequest('/agents', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	update: (id: string, data: AgentFormData): Promise<Agent> =>
		apiRequest(`/agents/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}),

	delete: (id: string): Promise<{ success: boolean }> =>
		apiRequest(`/agents/${id}`, {
			method: 'DELETE'
		}),

	updateStatus: (id: string, isActive: boolean): Promise<Agent> =>
		apiRequest(`/agents/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ isActive })
		})
};

// LLM Provider API functions
export const llmProviderApi = {
	getAll: (): Promise<LLMProvider[]> => apiRequest('/llm-providers'),

	getById: (id: string): Promise<LLMProvider> => apiRequest(`/llm-providers/${id}`),

	create: (data: LLMProviderFormData): Promise<LLMProvider> =>
		apiRequest('/llm-providers', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	update: (id: string, data: LLMProviderFormData): Promise<LLMProvider> =>
		apiRequest(`/llm-providers/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}),

	delete: (id: string): Promise<{ success: boolean }> =>
		apiRequest(`/llm-providers/${id}`, {
			method: 'DELETE'
		}),

	validate: (provider: LLMProvider): Promise<{ valid: boolean; message: string }> =>
		apiRequest(`/validate/llm-provider/${provider.id}`, {
			method: 'POST',
			body: JSON.stringify(provider)
		})
};

// Datastore API functions
export const datastoreApi = {
	getAll: (): Promise<Datastore[]> => apiRequest('/datastores'),

	getById: (id: string): Promise<Datastore> => apiRequest(`/datastores/${id}`),

	create: (data: DatastoreFormData): Promise<Datastore> =>
		apiRequest('/datastores', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	update: (id: string, data: DatastoreFormData): Promise<Datastore> =>
		apiRequest(`/datastores/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}),

	delete: (id: string): Promise<{ success: boolean }> =>
		apiRequest(`/datastores/${id}`, {
			method: 'DELETE'
		}),

	validate: (datastore: Datastore): Promise<{ valid: boolean; message: string }> =>
		apiRequest(`/validate/datastore/${datastore.id}`, {
			method: 'POST',
			body: JSON.stringify(datastore)
		})
};

// Service Worker registration and management
export const serviceWorkerApi = {
	register: async (): Promise<ServiceWorkerRegistration | null> => {
		if ('serviceWorker' in navigator) {
			try {
				const registration = await navigator.serviceWorker.register('/sw.js');
				console.log('[SW] Service worker registered:', registration);

				// Handle updates
				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener('statechange', () => {
							if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
								console.log('[SW] New service worker available');
								// Optionally notify user about update
							}
						});
					}
				});

				return registration;
			} catch (error) {
				console.error('[SW] Service worker registration failed:', error);
				return null;
			}
		}
		return null;
	},

	unregister: async (): Promise<boolean> => {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				return registration.unregister();
			}
		}
		return false;
	},

	isSupported: (): boolean => 'serviceWorker' in navigator,

	getStatus: async (): Promise<string> => {
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
};

// Initialize service worker on module load
if (typeof window !== 'undefined') {
	serviceWorkerApi.register();
}
