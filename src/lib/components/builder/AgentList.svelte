<script lang="ts">
  import { Button, Badge } from 'flowbite-svelte';
  import { PlusOutline, SearchSolid } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { getAgents } from '$lib/stores/agents';
  import type { Agent } from '$lib/models/agent';

  let agents = $state(getAgents());
  let searchTerm = $state('');
  
  function navigateToNewAgent() {
    goto('/builder/agents/new');
  }
  
  function navigateToAgent(id: string) {
    goto(`/builder/agents/${id}`);
  }
  
  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function handleKeyPress(event: KeyboardEvent, agentId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      navigateToAgent(agentId);
    }
  }
  
  $effect(() => {
    agents = getAgents();
  });
</script>

<div class="w-full max-w-6xl mx-auto">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold text-white">Agents</h1>
    <Button color="blue" onclick={navigateToNewAgent}>
      <PlusOutline class="w-4 h-4 mr-2" />
      Create New Agent
    </Button>
  </div>
  
  <div class="mb-6">
    <div class="relative">
      <input
        bind:value={searchTerm}
        type="text"
        placeholder="Search agents..."
        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 pl-10 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <SearchSolid class="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
    </div>
  </div>
  
  {#if agents.length === 0}
    <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="bg-slate-700/50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">No Agents Created</h2>
        <p class="text-slate-500 mb-6">
          Get started by creating your first agent to connect to your data and configure an LLM.
        </p>
        <Button color="blue" onclick={navigateToNewAgent}>
          <PlusOutline class="w-4 h-4 mr-2" />
          Create Your First Agent
        </Button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each agents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) as agent}
        <div 
          role="button"
          tabindex="0"
          class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-800/70"
          onclick={() => navigateToAgent(agent.id)}
          onkeydown={(e) => handleKeyPress(e, agent.id)}
          aria-label={`Navigate to agent ${agent.name}`}
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-bold text-white text-lg">{agent.name}</h3>
            <Badge color={agent.isActive ? 'green' : 'red'} class="text-xs">
              {agent.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <p class="text-slate-400 text-sm mb-4 line-clamp-2">
            {agent.description}
          </p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            {#if agent.llmProviderId}
              <Badge color="blue" class="text-xs">
                LLM Configured
              </Badge>
            {/if}
            {#if agent.datastoreIds.length > 0}
              <Badge color="purple" class="text-xs">
                {agent.datastoreIds.length} Datastore{agent.datastoreIds.length > 1 ? 's' : ''}
              </Badge>
            {/if}
          </div>
          
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span>Updated {formatDate(agent.updatedAt)}</span>
            <span>Created {formatDate(agent.createdAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>