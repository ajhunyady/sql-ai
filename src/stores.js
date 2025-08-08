import { writable, get } from 'svelte/store';

let initialAgents = [
  { id: 1, name: 'Agent 1', description: 'Description', status: 'Active' },
  { id: 2, name: 'Agent 2', description: 'Description', status: 'Draft' }
];

if (typeof localStorage !== 'undefined') {
  const stored = localStorage.getItem('agents');
  if (stored) {
    initialAgents = JSON.parse(stored);
  }
}

export const agents = writable(initialAgents);

if (typeof localStorage !== 'undefined') {
  agents.subscribe(value => {
    localStorage.setItem('agents', JSON.stringify(value));
  });
}

export const currentView = writable('home');
export const currentAgent = writable(null);

export function createNewAgent() {
  const id = Date.now();
  const newAgent = { id, name: 'New Agent', description: '', status: 'Draft' };
  agents.update(a => [...a, newAgent]);
  currentAgent.set(newAgent);
  currentView.set('guide');
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
