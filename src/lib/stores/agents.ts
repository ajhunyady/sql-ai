import { writable } from 'svelte/store';
import type { Agent, AgentFormData } from '$lib/models/agent';
import { agentApi } from '$lib/services/api';

// Create writable stores for agents data and loading state
export const agents = writable<Agent[]>([]);
export const agentsLoading = writable<boolean>(false);
export const agentsError = writable<string | null>(null);

// Load all agents from the service worker
export async function loadAgents(): Promise<void> {
	agentsLoading.set(true);
	agentsError.set(null);

	try {
		const data = await agentApi.getAll();
		agents.set(data);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load agents';
		agentsError.set(message);
		console.error('Error loading agents:', error);
	} finally {
		agentsLoading.set(false);
	}
}

// Get a single agent by ID
export async function getAgentById(id: string): Promise<Agent | null> {
	try {
		return await agentApi.getById(id);
	} catch (error) {
		console.error('Error getting agent:', error);
		return null;
	}
}

// Create a new agent
export async function createAgent(data: AgentFormData): Promise<Agent | null> {
	agentsError.set(null);

	try {
		const newAgent = await agentApi.create(data);

		// Update the local store
		agents.update((currentAgents) => [...currentAgents, newAgent]);

		return newAgent;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to create agent';
		agentsError.set(message);
		console.error('Error creating agent:', error);
		return null;
	}
}

// Update an existing agent
export async function updateAgent(id: string, data: AgentFormData): Promise<Agent | null> {
	agentsError.set(null);

	try {
		const updatedAgent = await agentApi.update(id, data);

		// Update the local store
		agents.update((currentAgents) =>
			currentAgents.map((agent) => (agent.id === id ? updatedAgent : agent))
		);

		return updatedAgent;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update agent';
		agentsError.set(message);
		console.error('Error updating agent:', error);
		return null;
	}
}

// Delete an agent
export async function deleteAgent(id: string): Promise<boolean> {
	agentsError.set(null);

	try {
		await agentApi.delete(id);

		// Update the local store
		agents.update((currentAgents) => currentAgents.filter((agent) => agent.id !== id));

		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to delete agent';
		agentsError.set(message);
		console.error('Error deleting agent:', error);
		return false;
	}
}

// Update agent status (active/inactive)
export async function updateAgentStatus(id: string, isActive: boolean): Promise<Agent | null> {
	agentsError.set(null);

	try {
		const updatedAgent = await agentApi.updateStatus(id, isActive);

		// Update the local store
		agents.update((currentAgents) =>
			currentAgents.map((agent) => (agent.id === id ? updatedAgent : agent))
		);

		return updatedAgent;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update agent status';
		agentsError.set(message);
		console.error('Error updating agent status:', error);
		return null;
	}
}

// Initialize the store by loading agents
if (typeof window !== 'undefined') {
	loadAgents();
}
