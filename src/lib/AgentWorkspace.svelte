<script>
  import { currentAgent } from '../stores.js';
  import MetadataTab from './tabs/MetadataTab.svelte';
  import DataIntegrationsTab from './tabs/DataIntegrationsTab.svelte';
  import LLMConfigTab from './tabs/LLMConfigTab.svelte';
  import QueryingGuidanceTab from './tabs/QueryingGuidanceTab.svelte';
  import TestingTab from './tabs/TestingTab.svelte';
  import EvaluationsTab from './tabs/EvaluationsTab.svelte';
  import MonitoringTab from './tabs/MonitoringTab.svelte';

  let activeTab = 'Metadata';

  const tabs = [
    { name: 'Metadata', component: MetadataTab, required: false },
    { name: 'Data Integrations', component: DataIntegrationsTab, required: false },
    { name: 'LLM Config', component: LLMConfigTab, required: true },
    { name: 'Querying Guidance', component: QueryingGuidanceTab, required: false },
    { name: 'Testing', component: TestingTab, required: false },
    { name: 'Evaluations', component: EvaluationsTab, required: false },
    { name: 'Monitoring', component: MonitoringTab, required: false }
  ];
</script>

{#if $currentAgent}
  <div class="flex flex-col h-full">
    <header class="flex justify-between items-center p-4 border-b">
      <div class="font-semibold text-lg">Agent Name: {$currentAgent.name}</div>
      <div class="flex items-center space-x-4">
        <button class="bg-green-500 text-white px-3 py-1 rounded">Deploy</button>
        <span class="text-sm text-gray-500">Saved</span>
      </div>
    </header>
    <nav class="border-b">
      <ul class="flex space-x-4 px-4">
        {#each tabs as t}
          <li>
            <button
              class="py-2 {activeTab === t.name ? 'border-b-2 border-blue-500' : ''}"
              on:click={() => (activeTab = t.name)}
            >
              {t.name}{t.required ? '*' : ''}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4">
        {#if activeTab === 'Metadata'}
          <MetadataTab />
        {:else if activeTab === 'Data Integrations'}
          <DataIntegrationsTab />
        {:else if activeTab === 'LLM Config'}
          <LLMConfigTab />
        {:else if activeTab === 'Querying Guidance'}
          <QueryingGuidanceTab />
        {:else if activeTab === 'Testing'}
          <TestingTab />
        {:else if activeTab === 'Evaluations'}
          <EvaluationsTab />
        {:else if activeTab === 'Monitoring'}
          <MonitoringTab />
        {/if}
      </div>
      <aside class="w-64 border-l p-4 hidden md:block">
        <h3 class="font-semibold mb-2">Version History</h3>
        <ul class="text-sm space-y-1 mb-4">
          <li>Initial draft</li>
          <li>Updated config</li>
        </ul>
        <h3 class="font-semibold mb-2">Quick Links</h3>
        <ul class="text-sm space-y-1">
          {#each tabs as t}
            <li>
              <button class="text-blue-500" on:click={() => (activeTab = t.name)}>
                {t.name}
              </button>
            </li>
          {/each}
        </ul>
      </aside>
    </div>
  </div>
{:else}
  <p class="p-4">No agent selected.</p>
{/if}
