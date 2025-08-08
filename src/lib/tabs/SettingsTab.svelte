<script>
  import { currentAgent, deleteAgent } from '../../stores.js';
</script>

<div class="space-y-4">
  <h2 class="text-lg font-semibold">Settings</h2>
  <button
    class="bg-red-500 text-white px-4 py-2 rounded"
    on:click={() => deleteAgent($currentAgent)}
  >
    Delete Agent
  </button>
</div>
