// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';

let randQueue;

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  vi.useFakeTimers();
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  randQueue = [1, 2, 3, 4];
  vi.stubGlobal('crypto', {
    getRandomValues: arr => {
      arr.fill(randQueue.shift() ?? 0);
      return arr;
    }
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('agent store', () => {
  it('creates unique IDs for new agents', async () => {
    const { createNewAgent, agents } = await import('./stores.js');
    createNewAgent();
    createNewAgent();
    const allAgents = get(agents);
    const newAgents = allAgents.slice(-2);
    const ids = newAgents.map(a => a.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('updates state based on path', async () => {
    const { agents, currentAgent, currentView, currentPage } = await import('./stores.js');
    const existing = get(agents)[0];

    window.history.pushState({}, '', `/development/agent/${existing.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toEqual(existing);
    expect(get(currentView)).toBe('workspace');
    expect(get(currentPage)).toBe('development');

    window.history.pushState({}, '', '/development/guide');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentView)).toBe('guide');

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentPage)).toBe('home');
    expect(get(currentView)).toBe('home');

    window.history.pushState({}, '', '/development');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(get(currentAgent)).toBeNull();
    expect(get(currentView)).toBe('home');
  });

  it('can create and delete agents', async () => {
    const { createNewAgent, deleteAgent, agents } = await import('./stores.js');
    createNewAgent();
    const newAgent = get(agents).find(a => a.name === 'New Agent');
    expect(newAgent).toBeTruthy();
    deleteAgent(newAgent);
    expect(get(agents).find(a => a.id === newAgent.id)).toBeUndefined();
  });
});

