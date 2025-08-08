import { writable, get } from 'svelte/store';

export const agents = writable([
  { id: 1, name: 'Agent 1', description: 'Description', status: 'Active' },
  { id: 2, name: 'Agent 2', description: 'Description', status: 'Draft' }
]);

export const currentView = writable('home');
export const currentAgent = writable(null);

export function createNewAgent() {
  const id = Date.now();
  const newAgent = { id, name: 'New Agent', description: '', status: 'Draft' };
  agents.update(a => [...a, newAgent]);
  currentAgent.set(newAgent);
  currentView.set('workspace');
}

export function openAgent(agent) {
  currentAgent.set(agent);
  currentView.set('workspace');
}

export function deleteAgent(agent) {
  agents.update(a => a.filter(x => x.id !== agent.id));
  const curr = get(currentAgent);
  if (curr && curr.id === agent.id) {
    currentAgent.set(null);
    currentView.set('home');
  }
}
