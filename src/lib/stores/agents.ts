import type { Agent, AgentFormData } from '$lib/models/agent';
import { browser } from '$app/environment';

// In a real app, this would be replaced with actual API calls
let agents: Agent[] = [
  {
    id: '1',
    name: 'Sales Assistant',
    description: 'Helps analyze sales data and generate reports',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-20'),
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
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-15'),
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

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getAgents(): Agent[] {
  return agents;
}

export function getAgentById(id: string): Agent | undefined {
  return agents.find(agent => agent.id === id);
}

export function createAgent(data: AgentFormData): Agent {
  const newAgent: Agent = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };
  
  agents = [...agents, newAgent];
  return newAgent;
}

export function updateAgent(id: string, data: AgentFormData): Agent | undefined {
  const index = agents.findIndex(agent => agent.id === id);
  if (index === -1) return undefined;
  
  const updatedAgent: Agent = {
    ...agents[index],
    ...data,
    id: agents[index].id, // Preserve the original ID
    updatedAt: new Date()
  };
  
  agents = [...agents.slice(0, index), updatedAgent, ...agents.slice(index + 1)];
  return updatedAgent;
}

export function deleteAgent(id: string): boolean {
  const initialLength = agents.length;
  agents = agents.filter(agent => agent.id !== id);
  return agents.length !== initialLength;
}