<script>
  import Home from './lib/Home.svelte';
  import AgentWorkspace from './lib/AgentWorkspace.svelte';
  import { agents, currentView, currentAgent, createNewAgent, openAgent } from './stores.js';
</script>

<div class="flex h-screen">
  <aside class="w-64 bg-gray-100 p-4 space-y-4">
    <button class="bg-blue-500 text-white w-full py-2 rounded" on:click={createNewAgent}>
      Create New Agent
    </button>
    <div>
      <h2 class="font-semibold mb-2">Agents</h2>
      <ul class="space-y-1">
        {#each $agents as agent}
          <li>
            <button
              class="text-left w-full p-1 rounded hover:bg-gray-200"
              on:click={() => openAgent(agent)}
            >
              {agent.name}
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <div>
      <h2 class="font-semibold mb-2">Reusable Library</h2>
      <div class="text-sm text-gray-500">Configs, Credentials, Tools</div>
    </div>
  </aside>
  <div class="flex-1 flex flex-col">
    <header class="flex items-center p-4 border-b">
      <div class="font-bold">Agent Builder</div>
      <input type="text" placeholder="Search" class="border p-1 rounded flex-1 mx-4" />
      <div class="rounded-full bg-gray-300 w-8 h-8"></div>
    </header>
    <main class="flex-1 overflow-y-auto">
      {#if $currentView === 'home'}
        <Home />
      {:else}
        <AgentWorkspace />
      {/if}
    </main>
    <footer class="p-4 border-t text-sm text-gray-500 flex justify-between">
      <div>Version 0.1</div>
      <a href="/" class="text-blue-500">Help</a>
    </footer>
  </div>
</div>
