import type { LLMProvider, LLMProviderFormData, LLMProviderType } from '$lib/models/llm-provider';

// In a real app, this would be replaced with actual API calls
let llmProviders: LLMProvider[] = [
  {
    id: 'openai-1',
    name: 'OpenAI Primary',
    type: 'openai',
    apiKey: 'sk-************',
    modelName: 'gpt-4-turbo',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    isActive: true
  },
  {
    id: 'anthropic-1',
    name: 'Anthropic Claude',
    type: 'anthropic',
    apiKey: 'sk-************',
    modelName: 'claude-3-opus',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
    isActive: true
  },
  {
    id: 'ollama-1',
    name: 'Local Ollama',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    modelName: 'llama3',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
    isActive: true
  }
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getLLMProviders(): LLMProvider[] {
  return llmProviders;
}

export function getLLMProviderById(id: string): LLMProvider | undefined {
  return llmProviders.find(provider => provider.id === id);
}

export function createLLMProvider(data: LLMProviderFormData): LLMProvider {
  const newProvider: LLMProvider = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };
  
  llmProviders = [...llmProviders, newProvider];
  return newProvider;
}

export function updateLLMProvider(id: string, data: LLMProviderFormData): LLMProvider | undefined {
  const index = llmProviders.findIndex(provider => provider.id === id);
  if (index === -1) return undefined;
  
  const updatedProvider: LLMProvider = {
    ...llmProviders[index],
    ...data,
    id: llmProviders[index].id, // Preserve the original ID
    updatedAt: new Date()
  };
  
  llmProviders = [...llmProviders.slice(0, index), updatedProvider, ...llmProviders.slice(index + 1)];
  return updatedProvider;
}

export function deleteLLMProvider(id: string): boolean {
  const initialLength = llmProviders.length;
  llmProviders = llmProviders.filter(provider => provider.id !== id);
  return llmProviders.length !== initialLength;
}

export function validateLLMProvider(provider: LLMProvider): Promise<boolean> {
  // In a real app, this would make an API call to test the connection
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate validation (always succeeds in this example)
      resolve(true);
    }, 1000);
  });
}