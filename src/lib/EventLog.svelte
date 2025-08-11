<script>
  import { eventLog } from '../stores.js';

  $: entries = [...$eventLog].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
</script>

<div class="p-8 max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">Event Log</h1>
  {#if entries.length === 0}
    <p class="text-gray-500">No events recorded.</p>
  {:else}
    <ul class="space-y-2">
      {#each entries as evt}
        <li class="border rounded p-2">
          <div class="text-sm text-gray-500">{new Date(evt.timestamp).toLocaleString()}</div>
          <div>{evt.action} {evt.agentId}</div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

