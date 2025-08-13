export type LLMProviderType = 'openai' | 'anthropic' | 'xai' | 'ollama' | 'custom';

export interface LLMProvider {
	id: string;
	name: string;
	type: LLMProviderType;
	apiKey?: string;
	baseUrl?: string;
	modelName: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export interface LLMProviderFormData {
	name: string;
	type: LLMProviderType;
	apiKey?: string;
	baseUrl?: string;
	modelName: string;
}
