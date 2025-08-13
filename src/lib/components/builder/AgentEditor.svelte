<script lang="ts">
  import { Button, Badge } from 'flowbite-svelte';
  import { 
    ArrowLeftOutline, 
    CheckCircleSolid,
    ExclamationCircleSolid
  } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import type { Agent } from '$lib/models/agent';
  import { getAgentById, createAgent, updateAgent } from '$lib/stores/agents';
  import { getLLMProviderById } from '$lib/stores/llm-providers';
  
  import MetadataTab from './MetadataTab.svelte';
  import DataIntegrationsTab from './DataIntegrationsTab.svelte';
  import LLMConfigurationTab from './LLMConfigurationTab.svelte';
  import QueryingGuidanceTab from './QueryingGuidanceTab.svelte';
  import TestingTab from './TestingTab.svelte';
  import EvaluationsTab from './EvaluationsTab.svelte';
  import MonitoringTab from './MonitoringTab.svelte';

  // Extract agent ID from URL
  let agentId = $derived(page.url.pathname.split('/')[3]);
  let isNewAgent = $derived(agentId === 'new');
  
  // Create a new agent or load existing one
  let agent = $state<Agent | undefined>();
  
  $effect(() => {
    agent = isNewAgent 
      ? {
          id: '',
          name: '',
          description: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          datastoreIds: [],
          guidance: {
            generalInstructions: '',
            tableSemantics: {},
            customPrompts: []
          },
          isActive: true
        }
      : getAgentById(agentId);
  });
  
  let activeTab = $state('metadata');
  let isSaving = $state(false);
  
  // Tab configuration
  const tabs = [
    { id: 'metadata', label: 'Metadata', required: true },
    { id: 'data', label: 'Data & Integrations', required: true },
    { id: 'llm', label: 'LLM Configuration', required: true },
    { id: 'guidance', label: 'Querying Guidance', required: true },
    { id: 'testing', label: 'Testing', required: false },
    { id: 'evaluations', label: 'Evaluations', required: false },
    { id: 'monitoring', label: 'Monitoring', required: false }
  ];
  
  function goBack() {
    goto('/builder');
  }
  
  function saveAgent() {
    if (!agent) return;
    
    isSaving = true;
    
    // In a real app, this would save to the backend
    setTimeout(() => {
      try {
        if (isNewAgent) {
          const newAgent = createAgent({
            name: agent.name,
            description: agent.description,
            datastoreIds: agent.datastoreIds,
            guidance: agent.guidance,
            llmProviderId: agent.llmProviderId
          });
          // Redirect to the new agent's page
          goto(`/builder/agents/${newAgent.id}`);
        } else {
          updateAgent(agentId, {
            name: agent.name,
            description: agent.description,
            datastoreIds: agent.datastoreIds,
            guidance: agent.guidance,
            llmProviderId: agent.llmProviderId
          });
        }
      } catch (error) {
        console.error('Error saving agent:', error);
      } finally {
        isSaving = false;
      }
    }, 1000);
  }
  
  function isTabComplete(tabId: string): boolean {
    if (!agent) return false;
    
    switch (tabId) {
      case 'metadata':
        return !!agent.name && !!agent.description;
      case 'data':
        return agent.datastoreIds.length > 0;
      case 'llm':
        return !!agent.llmProviderId;
      case 'guidance':
        return !!agent.guidance.generalInstructions;
      default:
        return true;
    }
  }
  
  function isAgentComplete(): boolean {
    return tabs.slice(0, 4).every(tab => isTabComplete(tab.id));
  }
  
  function updateAgentData(updates: Partial<Agent>) {
    if (agent) {
      agent = { ...agent, ...updates };
    }
  }
  
  function isActiveTab(tabId: string): boolean {
    return activeTab === tabId;
  }
  
  function getTabClass(tabId: string): string {
    const baseClasses = 'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2';
    const activeClasses = 'text-blue-400 border-blue-500 bg-slate-800/30';
    const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200';
    
    return `${baseClasses} ${isActiveTab(tabId) ? activeClasses : inactiveClasses}`;
  }
</script>

<div class="w-full max-w-6xl mx-auto">
  <div class="flex justify-between items-center mb-8">
    <div class="flex items-center">
      <Button 
        color="none" 
        class="text-slate-400 hover:text-white p-2 mr-2"
        onclick={goBack}
      >
        <ArrowLeftOutline class="w-5 h-5" />
      </Button>
      <h1 class="text-2xl font-bold text-white">
        {isNewAgent ? 'Create New Agent' : agent?.name || 'Agent Editor'}
      </h1>
    </div>
    <div class="flex space-x-3">
      <Button 
        color="blue" 
        disabled={isSaving || !isAgentComplete()}
        onclick={saveAgent}
      >
        {isSaving ? 'Saving...' : 'Save Agent'}
      </Button>
    </div>
  </div>
  
  {#if agent === undefined && !isNewAgent}
    <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
      <ExclamationCircleSolid class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-white mb-2">Agent Not Found</h2>
      <p class="text-slate-300 mb-4">The agent you're looking for doesn't exist or has been deleted.</p>
      <Button onclick={goBack} color="blue">Back to Builder</Button>
    </div>
  {:else}
    <div class="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-slate-700/50">
        <div class="flex overflow-x-auto">
          {#each tabs as tab}
            <button
              class={getTabClass(tab.id)}
              onclick={() => activeTab = tab.id}
            >
              <div class="flex items-center">
                {tab.label}
                {#if tab.required && !isActiveTab(tab.id) && !isTabComplete(tab.id)}
                  <span class="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
                {/if}
                {#if tab.required && !isActiveTab(tab.id) && isTabComplete(tab.id)}
                  <CheckCircleSolid class="ml-2 w-4 h-4 text-green-500" />
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Tab Content -->
      <div class="p-6">
        {#if activeTab === 'metadata'}
          <MetadataTab bind:agent={agent} />
        {:else if activeTab === 'data'}
          <DataIntegrationsTab bind:agent={agent} />
        {:else if activeTab === 'llm'}
          <LLMConfigurationTab bind:agent={agent} />
        {:else if activeTab === 'guidance'}
          <QueryingGuidanceTab bind:agent={agent} />
        {:else if activeTab === 'testing'}
          <TestingTab bind:agent={agent} />
        {:else if activeTab === 'evaluations'}
          <EvaluationsTab bind:agent={agent} />
        {:else if activeTab === 'monitoring'}
          <MonitoringTab bind:agent={agent} />
        {/if}
      </div>
    </div>
  {/if}
</div>