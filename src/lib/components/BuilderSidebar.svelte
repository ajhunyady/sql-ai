<script lang="ts">
  import { Input, Button } from 'flowbite-svelte';
  import { PlusOutline, SearchSolid, FolderSolid, CogSolid } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { getAgents } from '$lib/stores/agents';

  let agents = $state(getAgents());
  let searchTerm = $state('');

  $effect(() => {
    agents = getAgents();
  });

  function navigateToAgent(id: string) {
    goto(`/builder/agents/${id}`);
  }

  function navigateToNewAgent() {
    goto(`/builder/agents/new`);
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function isActiveAgent(agentId: string): boolean {
    return page.url.pathname === `/builder/agents/${agentId}`;
  }
  
  function handleKeyPress(event: KeyboardEvent, agentId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      navigateToAgent(agentId);
    }
  }
</script>

<div
  class="fixed top-20 left-0 w-72 h-full backdrop-blur-xl bg-slate-950/80 border-r border-blue-500/20 overflow-y-auto"
  aria-label="Builder navigation"
>
  <div class="p-6">
    <!-- Search Box -->
    <div class="mb-6">
      <div class="relative">
        <Input
          type="text"
          placeholder="Search agents..."
          bind:value={searchTerm}
          class="w-full bg-slate-900/50 border border-blue-500/30 rounded-xl px-4 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        />
        <SearchSolid
          class="absolute right-4 top-3.5 text-blue-400 text-sm w-4 h-4"
        />
      </div>
    </div>

    <!-- New Agent Button -->
    <Button
      color="blue"
      class="w-full px-4 py-3 mb-8 flex items-center justify-center text-sm font-medium button-hover"
      aria-label="Create a new agent"
      onclick={navigateToNewAgent}
    >
      <PlusOutline class="mr-2" />
      New Agent
    </Button>

    <!-- Agent List -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-300 mb-4 flex items-center">
        <FolderSolid class="mr-2 text-blue-400" />
        Agents
      </h3>
    </div>
    <div class="space-y-2 max-h-96 overflow-y-auto" role="list" aria-label="Agent list">
      {#each agents.filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase())) as agent}
        <div 
          role="button"
          tabindex="0"
          class="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-800/50 border border-slate-700/50 {isActiveAgent(agent.id) ? 'ring-2 ring-blue-500/30' : ''}"
          onclick={() => navigateToAgent(agent.id)}
          onkeydown={(e) => handleKeyPress(e, agent.id)}
          aria-label={`Navigate to agent ${agent.name}`}
        >
          <div class="flex justify-between items-start">
            <h4 class="font-medium text-slate-200 truncate">{agent.name}</h4>
            <span class="text-xs text-slate-500">{formatDate(agent.updatedAt)}</span>
          </div>
          <p class="text-sm text-slate-400 truncate mt-1">{agent.description}</p>
          <div class="flex items-center mt-2 text-xs">
            <CogSolid class="mr-1 text-slate-500" />
            <span class="text-slate-500">
              {#if agent.llmProviderId}
                Configured
              {:else}
                Not configured
              {/if}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>