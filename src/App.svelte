<script>
  import Home from './lib/Home.svelte';
  import AgentWorkspace from './lib/AgentWorkspace.svelte';
  import AgentGuide from './lib/AgentGuide.svelte';
  import { agents, currentView, createNewAgent, openAgent } from './stores.js';
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
          <li class="flex items-center">
            <button
              class="text-left flex-1 p-1 rounded hover:bg-gray-200"
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
      <img src="/vite.svg" alt="CoAgent logo" class="h-6 w-6 mr-2" />
      <div class="font-bold">CoAgent</div>
      <input type="text" placeholder="Search" class="border p-1 rounded flex-1 mx-4" />
      <div class="rounded-full bg-gray-300 w-8 h-8"></div>
    </header>
    <main class="flex-1 overflow-y-auto">
      {#if $currentView === 'home'}
        <Home />
      {:else if $currentView === 'guide'}
        <AgentGuide />
      {:else}
        <AgentWorkspace />
      {/if}
    </main>
    <footer class="p-4 border-t text-sm text-gray-500 flex justify-between">
      <div>Version 0.1</div>
      <button class="text-blue-500" on:click={() => currentView.set('guide')}>Help</button>
    </footer>
  </div>
</div>
