// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';

let uuidQueue;

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  window.location.hash = '';
  localStorage.clear();
  uuidQueue = ['init-1', 'init-2', 'new-1', 'new-2'];
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => uuidQueue.shift())
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('agent store', () => {
  it('creates unique route-based IDs for new agents', async () => {
    const { createNewAgent, agents } = await import('./stores.js');
    createNewAgent();
    createNewAgent();
    const allAgents = get(agents);
    const newAgents = allAgents.slice(-2);
    const ids = newAgents.map(a => a.id);
    expect(ids[0]).toMatch(/^\/agent\//);
    expect(ids[1]).toMatch(/^\/agent\//);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('updates current agent and view based on hash', async () => {
    const { agents, currentAgent, currentView } = await import('./stores.js');
    const existing = get(agents)[0];

    window.location.hash = existing.id;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(get(currentAgent)).toEqual(existing);
    expect(get(currentView)).toBe('workspace');

    window.location.hash = '/agent/invalid';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentView)).toBe('home');
  });
});

