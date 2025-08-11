<script>
  import ChatHome from './lib/ChatHome.svelte';
  import Development from './lib/Development.svelte';
  import { currentPage, currentView, currentAgent } from './stores.js';
</script>

<div class="flex flex-col h-screen">
  <header class="border-b">
    <div class="flex items-center p-4 w-full max-w-screen-2xl mx-auto">
      <button
        type="button"
        on:click={() => {
          currentPage.set('home');
          currentAgent.set(null);
          currentView.set('home');
        }}
      >
        <img src="/coagent-logo.svg" alt="CoAgent" class="h-8" />
      </button>
      <h1 class="ml-2 text-xl font-semibold">CoAgent</h1>
      <button
        class="ml-4 text-sm text-gray-600"
        on:click={() => {
          currentPage.set('development');
          currentAgent.set(null);
          currentView.set('home');
        }}
      >
        Development
      </button>
      <div class="rounded-full bg-gray-300 w-8 h-8 ml-auto"></div>
    </div>
  </header>
  <main class="flex-1 overflow-y-auto">
    <div class="w-full h-full max-w-screen-2xl mx-auto">
      {#if $currentPage === 'home'}
        <ChatHome />
      {:else}
        <Development />
      {/if}
    </div>
  </main>
  <footer class="p-4 border-t">
    <div class="p-4 text-sm text-gray-500 flex justify-between items-center w-full max-w-screen-2xl mx-auto">
      <div>Version 0.1</div>
      <div></div>
    </div>
  </footer>
</div>

