import { writable } from 'svelte/store';
import type { LLMProvider, LLMProviderFormData } from '$lib/models/llm-provider';
import { llmProviderApi } from '$lib/services/api';

// Create writable stores for LLM providers data and loading state
export const llmProviders = writable<LLMProvider[]>([]);
export const llmProvidersLoading = writable<boolean>(false);
export const llmProvidersError = writable<string | null>(null);

// Load all LLM providers from the service worker
export async function loadLLMProviders(): Promise<void> {
	llmProvidersLoading.set(true);
	llmProvidersError.set(null);

	try {
		const data = await llmProviderApi.getAll();
		llmProviders.set(data);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load LLM providers';
		llmProvidersError.set(message);
		console.error('Error loading LLM providers:', error);
	} finally {
		llmProvidersLoading.set(false);
	}
}

// Get a single LLM provider by ID
export async function getLLMProviderById(id: string): Promise<LLMProvider | null> {
	try {
		return await llmProviderApi.getById(id);
	} catch (error) {
		console.error('Error getting LLM provider:', error);
		return null;
	}
}

// Create a new LLM provider
export async function createLLMProvider(data: LLMProviderFormData): Promise<LLMProvider | null> {
	llmProvidersError.set(null);

	try {
		const newProvider = await llmProviderApi.create(data);

		// Update the local store
		llmProviders.update((currentProviders) => [...currentProviders, newProvider]);

		return newProvider;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create LLM provider';
		llmProvidersError.set(message);
		console.error('Error creating LLM provider:', error);
		return null;
	}
}

// Update an existing LLM provider
export async function updateLLMProvider(
	id: string,
	data: LLMProviderFormData
): Promise<LLMProvider | null> {
	llmProvidersError.set(null);

	try {
		const updatedProvider = await llmProviderApi.update(id, data);

		// Update the local store
		llmProviders.update((currentProviders) =>
			currentProviders.map((provider) => (provider.id === id ? updatedProvider : provider))
		);

		return updatedProvider;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update LLM provider';
		llmProvidersError.set(message);
		console.error('Error updating LLM provider:', error);
		return null;
	}
}

// Delete an LLM provider
export async function deleteLLMProvider(id: string): Promise<boolean> {
	llmProvidersError.set(null);

	try {
		await llmProviderApi.delete(id);

		// Update the local store
		llmProviders.update((currentProviders) =>
			currentProviders.filter((provider) => provider.id !== id)
		);

		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete LLM provider';
		llmProvidersError.set(message);
		console.error('Error deleting LLM provider:', error);
		return false;
	}
}

// Validate an LLM provider
export async function validateLLMProvider(
	provider: LLMProvider
): Promise<{ valid: boolean; message: string }> {
	try {
		return await llmProviderApi.validate(provider);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to validate LLM provider';
		console.error('Error validating LLM provider:', error);
		return { valid: false, message };
	}
}

// Initialize the store by loading LLM providers
if (typeof window !== 'undefined') {
	loadLLMProviders();
}
