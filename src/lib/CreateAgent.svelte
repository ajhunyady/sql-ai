<script>
  import { currentAgent, currentView, setPath, openAgent, createNewAgent } from '../stores.js';
  import MetadataTab from './tabs/MetadataTab.svelte';
  import DataIntegrationsTab from './tabs/DataIntegrationsTab.svelte';
  import LLMConfigTab from './tabs/LLMConfigTab.svelte';
  import { onMount } from 'svelte';

  function cancel() {
    currentAgent.set(null);
    currentView.set('builder');
    setPath('/builder');
  }

  function save() {
    if ($currentAgent) {
      openAgent($currentAgent);
    }
  }

  onMount(() => {
    if (!$currentAgent) {
      createNewAgent();
    }
  });
</script>

<div class="p-8 max-w-4xl mx-auto space-y-8">
  <h1 class="text-2xl font-bold">Create Agent</h1>

  <section>
    <h2 class="text-xl font-semibold mb-2">Metadata</h2>
    <MetadataTab />
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-2">Data Integrations</h2>
    <DataIntegrationsTab />
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-2">LLM Config</h2>
    <LLMConfigTab />
  </section>

  <div class="flex justify-end gap-2">
    <button class="bg-gray-200 px-4 py-2 rounded" on:click={cancel}>Cancel</button>
    <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={save}>Save Agent</button>
  </div>
</div>

