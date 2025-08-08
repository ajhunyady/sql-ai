<script>
  import { currentAgent, agents } from '../../stores.js';
  import { get } from 'svelte/store';

  function update() {
    const updated = get(agents).map(a => a.id === $currentAgent.id ? $currentAgent : a);
    agents.set(updated);
  }
</script>

<div class="space-y-4 max-w-xl">
  <div>
    <label for="agent-name" class="block text-sm font-medium">Name</label>
    <input id="agent-name" class="border p-2 w-full" bind:value={$currentAgent.name} on:input={update} />
  </div>
  <div>
    <label for="agent-description" class="block text-sm font-medium">Description</label>
    <textarea id="agent-description" class="border p-2 w-full" rows="3" bind:value={$currentAgent.description} on:input={update}></textarea>
  </div>
  <div>
    <label for="dataset-type" class="block text-sm font-medium">Dataset Type</label>
    <select id="dataset-type" class="border p-2 w-full" bind:value={$currentAgent.dataset} on:change={update}>
      <option value="">Select dataset</option>
      <option value="SurrealDB">SurrealDB</option>
      <option value="PostgreSQL">PostgreSQL</option>
    </select>
  </div>
  <button class="bg-blue-500 text-white px-4 py-2 rounded" disabled>Save Changes</button>
</div>
