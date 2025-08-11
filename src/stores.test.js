// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';

let uuidQueue;

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  uuidQueue = ['init-1', 'init-2', 'new-1', 'new-2'];
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => uuidQueue.shift())
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('agent store', () => {
  it('creates unique route-based IDs for new agents', async () => {
    const { createNewAgent, agents } = await import('./stores.js');
    createNewAgent();
    vi.advanceTimersByTime(1000);
    createNewAgent();
    const allAgents = get(agents);
    const newAgents = allAgents.slice(0, 2);
    const ids = newAgents.map(a => a.id);
    expect(ids[0]).toMatch(/^\/agent\//);
    expect(ids[1]).toMatch(/^\/agent\//);
    expect(ids[0]).not.toBe(ids[1]);
    expect(new Date(newAgents[0].createdAt).getTime()).toBeGreaterThan(
      new Date(newAgents[1].createdAt).getTime()
    );
  });

  it('updates current agent and view based on path', async () => {
    const { agents, currentAgent, currentView } = await import('./stores.js');
    const existing = get(agents)[0];

    window.history.pushState({}, '', existing.id);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toEqual(existing);
    expect(get(currentView)).toBe('workspace');

    window.history.pushState({}, '', '/agent/invalid');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentView)).toBe('home');

    window.history.pushState({}, '', '/builder');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentView)).toBe('builder');
  });

  it('logs create and delete events', async () => {
    const { createNewAgent, deleteAgent, eventLog, agents } = await import('./stores.js');
    createNewAgent();
    const newAgent = get(agents).find(a => a.name === 'New Agent');
    deleteAgent(newAgent);
    const log = get(eventLog);
    expect(log[1]).toMatchObject({ action: 'created', agentId: newAgent.id });
    expect(log[0]).toMatchObject({ action: 'deleted', agentId: newAgent.id });
  });
});

