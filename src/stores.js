import { writable, get } from 'svelte/store';

function generateId(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

let initialAgents = [
  { id: generateId(), name: 'Agent 1', description: 'Description', status: 'Active' },
  { id: generateId(), name: 'Agent 2', description: 'Description', status: 'Draft' }
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

export const currentPage = writable('home'); // 'home' or 'development'
export const currentView = writable('home'); // views within development
export const currentAgent = writable(null);

export function createNewAgent() {
  const id = generateId();
  const newAgent = { id, name: 'New Agent', description: '', status: 'Draft' };
  agents.update(a => [...a, newAgent]);
  currentAgent.set(newAgent);
  currentPage.set('development');
  currentView.set('guide');
}

export function openAgent(agent) {
  currentAgent.set(agent);
  currentPage.set('development');
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

function pathFromState(page, view, agent) {
  if (page === 'development') {
    if (view === 'guide') return '/development/guide';
    if (view === 'workspace' && agent) return `/development/agent/${agent.id}`;
    return '/development';
  }
  return '/';
}

if (typeof window !== 'undefined') {
  const parsePath = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'development') {
      currentPage.set('development');
      if (parts[1] === 'agent' && parts[2]) {
        const agent = get(agents).find(a => a.id === parts[2]);
        if (agent) {
          currentAgent.set(agent);
          currentView.set('workspace');
          return;
        }
      } else if (parts[1] === 'guide') {
        currentAgent.set(null);
        currentView.set('guide');
        return;
      }
      currentAgent.set(null);
      currentView.set('home');
      return;
    }
    currentPage.set('home');
    currentAgent.set(null);
    currentView.set('home');
  };

  let suppress = true;
  parsePath();
  suppress = false;

  const sync = () => {
    if (suppress) return;
    const page = get(currentPage);
    const view = get(currentView);
    const agent = get(currentAgent);
    const path = pathFromState(page, view, agent);
    if (window.location.pathname !== path) {
      history.pushState({}, '', path);
    }
  };

  currentPage.subscribe(sync);
  currentView.subscribe(sync);
  currentAgent.subscribe(sync);

  window.addEventListener('popstate', () => {
    suppress = true;
    parsePath();
    suppress = false;
  });
}
