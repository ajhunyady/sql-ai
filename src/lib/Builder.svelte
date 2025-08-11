<script>
  import { agents, createNewAgent, openAgent } from '../stores.js';
  import AgentTile from './AgentTile.svelte';
</script>

<div class="p-8">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-3xl font-semibold text-teal-700">Agent Builder</h1>
    <div class="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search"
        class="border p-1 rounded w-64"
      />
      <button
        class="inline-flex items-center gap-2 rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        on:click={createNewAgent}
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 4.167v11.666M4.167 10h11.666" />
        </svg>
        New Agent
      </button>
    </div>
  </div>
  <div class="py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each $agents as agent}
        <AgentTile {agent} on:click={() => openAgent(agent)} />
      {/each}
    </div>
  </div>
</div>
