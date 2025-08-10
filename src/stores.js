import { writable, get } from 'svelte/store';

function generateAgentId() {
  const unique =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `/agent/${unique}`;
}

let initialAgents = [
  { id: generateAgentId(), name: 'Agent 1', description: 'Description', status: 'Active' },
  { id: generateAgentId(), name: 'Agent 2', description: 'Description', status: 'Draft' }
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
  const id = generateAgentId();
  const newAgent = { id, name: 'New Agent', description: '', status: 'Draft' };
  agents.update(a => [...a, newAgent]);
  currentAgent.set(newAgent);
  currentView.set('guide');
  if (typeof window !== 'undefined') {
    window.location.hash = id;
  }
}

export function openAgent(agent) {
  currentAgent.set(agent);
  currentView.set('workspace');
  if (typeof window !== 'undefined') {
    window.location.hash = agent.id;
  }
}

export function deleteAgent(agent) {
  agents.update(a => a.filter(x => x.id !== agent.id));
  const curr = get(currentAgent);
  if (curr && curr.id === agent.id) {
    currentAgent.set(null);
    currentView.set('home');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
  }
}
