import type { LLMProvider, LLMProviderType, LLMProviderFormData } from '$lib/models/llm-provider';

export interface LLMProviderFormState {
	name: string;
	type: LLMProviderType;
	apiKey: string;
	baseUrl: string;
	modelName: string;
}

export const providerTypes: { value: LLMProviderType; name: string }[] = [
	{ value: 'openai', name: 'OpenAI' },
	{ value: 'anthropic', name: 'Anthropic' },
	{ value: 'xai', name: 'xAI' },
	{ value: 'ollama', name: 'Ollama' },
	{ value: 'custom', name: 'Custom' }
];

export const modelOptions = {
	openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'],
	anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-5-sonnet'],
	xai: ['grok-beta'],
	ollama: ['llama3', 'llama3:8b', 'llama3:70b', 'mistral', 'codellama'],
	custom: []
};

// Helper function to check if a provider type already exists
export function providerTypeExists(providers: LLMProvider[] | undefined | null, type: LLMProviderType): boolean {
	if (type === 'custom') return false; // Allow multiple custom providers
	if (!providers || !Array.isArray(providers)) return false;
	return providers.some(provider => provider.type === type);
}

// Helper function to get available provider types
export function getAvailableProviderTypes(providers: LLMProvider[] | undefined | null): LLMProviderType[] {
	const allTypes: LLMProviderType[] = ['openai', 'anthropic', 'xai', 'ollama', 'custom'];
	if (!providers || !Array.isArray(providers)) return allTypes;
	return allTypes.filter(type => !providerTypeExists(providers, type) || type === 'custom');
}

// Helper function to check if all non-custom provider types are already created
export function allNonCustomProvidersExist(providers: LLMProvider[] | undefined | null): boolean {
	const nonCustomTypes: LLMProviderType[] = ['openai', 'anthropic', 'xai', 'ollama'];
	if (!providers || !Array.isArray(providers)) return false;
	return nonCustomTypes.every(type => providerTypeExists(providers, type));
}

// Helper function to generate provider name based on type
export function generateProviderName(type: LLMProviderType, customName?: string): string {
	if (type === 'custom') {
		return customName || '';
	}
	return type.charAt(0).toUpperCase() + type.slice(1);
}

// Helper function to check if API key is required
export function requiresApiKey(type: LLMProviderType): boolean {
	return type !== 'ollama';
}

// Helper function to check if base URL is required
export function requiresBaseUrl(type: LLMProviderType): boolean {
	return type === 'ollama' || type === 'custom';
}

// Helper function to validate form
export function validateForm(formData: LLMProviderFormState): string | null {
	if (formData.type === 'custom' && !formData.name.trim()) {
		return 'Provider name is required for custom providers';
	}
	if (!formData.modelName.trim()) {
		return 'Model name is required';
	}
	if (requiresApiKey(formData.type) && !formData.apiKey?.trim()) {
		return 'API key is required for this provider type';
	}
	if (requiresBaseUrl(formData.type) && !formData.baseUrl?.trim()) {
		return 'Base URL is required for this provider type';
	}
	return null;
}

// Helper function to update model name when provider type changes
export function updateModelNameOnChange(formData: LLMProviderFormState): void {
	if (formData.type === 'openai' && modelOptions.openai.length > 0) {
		if (!formData.modelName || !modelOptions.openai.includes(formData.modelName)) {
			formData.modelName = modelOptions.openai[0];
		}
	} else if (formData.type === 'anthropic' && modelOptions.anthropic.length > 0) {
		if (!formData.modelName || !modelOptions.anthropic.includes(formData.modelName)) {
			formData.modelName = modelOptions.anthropic[0];
		}
	} else if (formData.type === 'xai' && modelOptions.xai.length > 0) {
		if (!formData.modelName || !modelOptions.xai.includes(formData.modelName)) {
			formData.modelName = modelOptions.xai[0];
		}
	} else if (formData.type === 'ollama' && modelOptions.ollama.length > 0) {
		if (!formData.modelName || !modelOptions.ollama.includes(formData.modelName)) {
			formData.modelName = modelOptions.ollama[0];
		}
	}
}

// Helper function to prepare form data for submission
export function prepareFormDataForSubmission(formData: LLMProviderFormState): LLMProviderFormData {
	return {
		name: generateProviderName(formData.type, formData.name),
		type: formData.type,
		apiKey: formData.apiKey,
		baseUrl: formData.baseUrl,
		modelName: formData.modelName
	};
}

// Helper function to initialize form state
export function initializeFormState(
	providers: LLMProvider[] | undefined | null,
	existingProvider?: LLMProvider | null
): LLMProviderFormState {
	if (existingProvider) {
		return {
			name: existingProvider.type === 'custom' ? existingProvider.name : '',
			type: existingProvider.type,
			apiKey: existingProvider.apiKey || '',
			baseUrl: existingProvider.baseUrl || '',
			modelName: existingProvider.modelName
		};
	}

	// Set the first available provider type as default
	const availableTypes = getAvailableProviderTypes(providers);
	const defaultType = availableTypes.length > 0 ? availableTypes[0] : 'custom';

	return {
		name: '',
		type: defaultType,
		apiKey: '',
		baseUrl: '',
		modelName: ''
	};
}