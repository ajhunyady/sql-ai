<script>
  import { agents, createNewAgent, openAgent } from '../stores.js';

  // Input captured from the ChatEditor component
  let input = '';

  // Placeholder handler for queries submitted via ChatEditor
  function send() {
    if (!input.trim()) return;

    // In a future iteration this could forward the question to a backend
    console.log('Agent development query:', input);

    // Clear the editor after handling the input
    input = '';
  }
</script>

<div class="p-8">
  <h1 class="text-2xl mb-4">Agent Development</h1>
  <button
    class="bg-blue-500 text-white px-4 py-2 rounded mb-8"
    on:click={createNewAgent}
  >
    Create New Agent
  </button>
  <h2 class="text-xl mb-2">Recent Agents</h2>
  <div class="grid grid-cols-2 gap-4">
    {#each $agents as agent}
      <button
        class="border p-4 rounded hover:bg-gray-50 text-left"
        on:click={() => openAgent(agent)}
      >
        <h3 class="font-semibold">{agent.name}</h3>
        <p class="text-sm">{agent.description}</p>
        <p class="text-xs text-gray-500">Status: {agent.status}</p>
      </button>

    {/each}
  </div>
  <div class="p-4 border-t">
    <ChatEditor bind:value={input} on:ask={send} />
  </div>
</div>
