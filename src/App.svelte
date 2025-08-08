<script>
  import Home from './lib/Home.svelte';
  import AgentWorkspace from './lib/AgentWorkspace.svelte';
  import AgentGuide from './lib/AgentGuide.svelte';
  import { currentView } from './stores.js';
</script>

<div class="flex flex-col h-screen">
  <header class="flex items-center p-4 border-b">
    <div class="font-bold">Agent Builder</div>
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
