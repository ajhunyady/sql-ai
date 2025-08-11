<script>
  import Home from './lib/Home.svelte';
  import Development from './lib/Development.svelte';
  import AgentWorkspace from './lib/AgentWorkspace.svelte';
  import AgentGuide from './lib/AgentGuide.svelte';
  import EventLog from './lib/EventLog.svelte';
  import { currentView, currentAgent, setPath } from './stores.js';
</script>

<div class="flex flex-col h-screen">
  <header class="border-b">
    <div class="flex items-center p-4 w-full max-w-screen-2xl mx-auto">
      <button
        type="button"
        on:click={() => {
          currentView.set('home');
          currentAgent.set(null);
          setPath('/');
        }}
      >
        <img src="/coagent-logo.svg" alt="CoAgent" class="h-8" />
      </button>
       <h1 class="ml-2 text-xl font-semibold">CoAgent</h1>
      <button
        class="ml-4 text-sm text-gray-600"
        on:click={() => {
          currentView.set('development');
          currentAgent.set(null);
          setPath('/development');
        }}
      >
        Development
      </button>
      <div class="rounded-full bg-gray-300 w-8 h-8 ml-auto"></div>
    </div>
  </header>
  <main class="flex-1 overflow-y-auto">
    <div class="w-full max-w-screen-2xl mx-auto">
      {#if $currentView === 'home'}
        <Home />
      {:else if $currentView === 'development'}
        <Development />
      {:else if $currentView === 'guide'}
        <AgentGuide />
      {:else if $currentView === 'log'}
        <EventLog />
      {:else}
        <AgentWorkspace />
      {/if}
    </div>
  </main>
  <footer class="p-4 border-t">
    <div class="p-4 text-sm text-gray-500 flex justify-between items-center w-full max-w-screen-2xl mx-auto">
      <div>Version 0.1</div>
      <div class="flex gap-2">
        <button class="text-blue-500" on:click={() => currentView.set('log')}>Log</button>
      </div>
    </div>
  </footer>
</div>
