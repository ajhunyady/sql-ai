<script>
  import { currentView, currentAgent } from '../stores.js';
  import { get } from 'svelte/store';
  import MetadataTab from './tabs/MetadataTab.svelte';
  import DataIntegrationsTab from './tabs/DataIntegrationsTab.svelte';
  import LLMConfigTab from './tabs/LLMConfigTab.svelte';
  import QueryingGuidanceTab from './tabs/QueryingGuidanceTab.svelte';
  import TestingTab from './tabs/TestingTab.svelte';
  import EvaluationsTab from './tabs/EvaluationsTab.svelte';
  import MonitoringTab from './tabs/MonitoringTab.svelte';
  import SettingsTab from './tabs/SettingsTab.svelte';

  let step = 0;
  const steps = [
    { title: 'Metadata', component: MetadataTab },
    { title: 'Data Integrations', component: DataIntegrationsTab },
    { title: 'LLM Config', component: LLMConfigTab },
    { title: 'Querying Guidance', component: QueryingGuidanceTab },
    { title: 'Testing', component: TestingTab },
    { title: 'Evaluations', component: EvaluationsTab },
    { title: 'Monitoring', component: MonitoringTab },
    { title: 'Settings', component: SettingsTab }
  ];

  function next() {
    if (step < steps.length - 1) step++;
  }

  function prev() {
    if (step > 0) step--;
  }

  function finish() {
    if (get(currentAgent)) {
      currentView.set('workspace');
    } else {
      currentView.set('home');
    }
  }
</script>

<div class="p-8 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">Create Agent</h1>
  <div class="text-sm text-gray-500 mb-2">Step {step + 1} of {steps.length}</div>
  <div class="mb-6">
    <h2 class="text-xl font-semibold mb-4">{steps[step].title}</h2>
    <svelte:component this={steps[step].component} />
  </div>
  <div class="flex justify-between">
    <button on:click={prev} disabled={step === 0} class="bg-gray-200 px-4 py-2 rounded disabled:opacity-50">Back</button>
    {#if step < steps.length - 1}
      <button on:click={next} class="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
    {:else}
      <button on:click={finish} class="bg-green-500 text-white px-4 py-2 rounded">Finish</button>
    {/if}
  </div>
</div>

