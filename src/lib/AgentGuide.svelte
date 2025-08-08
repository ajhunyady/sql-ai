<script>
  import { currentView, currentAgent } from '../stores.js';
  import { get } from 'svelte/store';
  let step = 0;
  const steps = [
    {
      title: 'Metadata',
      description: 'Provide the agent name, a short description, and select the dataset type that the agent will work with.'
    },
    {
      title: 'Data Integrations',
      description: 'Configure the data store connection (e.g., type, host, port, credentials). Add or reuse tools to allow the agent to interact with the data.'
    },
    {
      title: 'LLM Config',
      description: 'Manage provider credentials and choose the large language model your agent will use. You can create new credentials or reuse existing ones.'
    },
    {
      title: 'Querying Guidance',
      description: 'Assemble guidance modules such as rules, examples, and constraints. The modules are compiled into a system prompt that steers the agent\'s behavior.'
    },
    {
      title: 'Testing',
      description: 'Send prompts to the agent and review the simulated responses. Toggle comparison mode and inspect execution logs.'
    },
    {
      title: 'Evaluations',
      description: 'Create test cases with prompts and expected outputs. Run all test cases to see pass or fail results.'
    },
    {
      title: 'Monitoring',
      description: 'Review dashboard placeholders for usage and error charts, alerts, and a log table. Refresh logs as needed.'
    },
    {
      title: 'Settings',
      description: 'Access agent settings, including the ability to delete the agent.'
    }
  ];
  function next() { if (step < steps.length - 1) step++; }
  function prev() { if (step > 0) step--; }
  function finish() {
    if (get(currentAgent)) {
      currentView.set('workspace');
    } else {
      currentView.set('home');
    }
  }
</script>

<div class="p-8 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">Agent Creation Guide</h1>
  <div class="text-sm text-gray-500 mb-2">Step {step + 1} of {steps.length}</div>
  <div class="mb-6">
    <h2 class="text-xl font-semibold">{steps[step].title}</h2>
    <p class="mt-2">{steps[step].description}</p>
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

