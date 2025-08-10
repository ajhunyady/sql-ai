<script>
  import Home from './lib/Home.svelte';
  import AgentWorkspace from './lib/AgentWorkspace.svelte';
  import AgentGuide from './lib/AgentGuide.svelte';
  import { currentView } from './stores.js';
</script>

<div class="flex flex-col h-screen">
  <header class="flex items-center p-4 border-b">
    <button
      type="button"
      on:click={() => {
        currentView.set('home');
        if (typeof window !== 'undefined') {
          window.location.hash = '';
        }
      }}
    >
      <img src="/coagent-logo.svg" alt="CoAgent" class="h-8" />
    </button>
    <div class="rounded-full bg-gray-300 w-8 h-8 ml-auto"></div>
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
