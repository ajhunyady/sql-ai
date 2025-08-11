import { writable, get } from 'svelte/store';

function sortAgents(list) {
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function generateAgentId() {
  const unique =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `/agent/${unique}`;
}

let initialAgents = [
  {
    id: generateAgentId(),
    name: 'Agent 1',
    description: 'Description',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: generateAgentId(),
    name: 'Agent 2',
    description: 'Description',
    status: 'Draft',
    createdAt: new Date().toISOString()
  }
];

if (typeof localStorage !== 'undefined') {
  const stored = localStorage.getItem('agents');
  if (stored) {
    initialAgents = JSON.parse(stored).map(a => ({
      ...a,
      createdAt: a.createdAt || new Date().toISOString()
    }));
  }
}

initialAgents = sortAgents(initialAgents);

export const agents = writable(initialAgents);

if (typeof localStorage !== 'undefined') {
  agents.subscribe(value => {
    localStorage.setItem('agents', JSON.stringify(value));
  });
}

let initialLog = [];
if (typeof localStorage !== 'undefined') {
  const storedLog = localStorage.getItem('eventLog');
  if (storedLog) {
    initialLog = JSON.parse(storedLog);
  }
}

export const eventLog = writable(initialLog);

if (typeof localStorage !== 'undefined') {
  eventLog.subscribe(value => {
    localStorage.setItem('eventLog', JSON.stringify(value));
  });
}

function logEvent(action, agent) {
  eventLog.update(log => [
    { action, agentId: agent.id, timestamp: new Date().toISOString() },
    ...log
  ]);
}

export const currentView = writable('home');
export const currentAgent = writable(null);

export function setPath(path) {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
  }
}

export function createNewAgent() {
  const id = generateAgentId();
  const newAgent = {
    id,
    name: 'New Agent',
    description: '',
    status: 'Draft',
    createdAt: new Date().toISOString()
  };
  agents.update(a => sortAgents([...a, newAgent]));
  logEvent('created', newAgent);
  currentAgent.set(newAgent);
  currentView.set('guide');
  setPath(id);
}

export function openAgent(agent) {
  currentAgent.set(agent);
  currentView.set('workspace');
  setPath(agent.id);
}

export function deleteAgent(agent) {
  agents.update(a => sortAgents(a.filter(x => x.id !== agent.id)));
  logEvent('deleted', agent);
  const curr = get(currentAgent);
  if (curr && curr.id === agent.id) {
    currentAgent.set(null);
    currentView.set('builder');
    setPath('/builder');
  }
}

function handleRoute() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (path === '/builder') {
    currentAgent.set(null);
    currentView.set('builder');
    return;
  }
  const agent = get(agents).find(a => a.id === path);
  if (agent) {
    currentAgent.set(agent);
    if (get(currentView) !== 'guide') {
      currentView.set('workspace');
    }
  } else {
    currentAgent.set(null);
    currentView.set('home');
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', handleRoute);
  handleRoute();
}
