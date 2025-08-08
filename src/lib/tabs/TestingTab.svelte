<script>
  let prompt = '';
  let output = '';
  let logs = [];
  let showLogs = false;
  let compare = false;

  function run() {
    output = `Simulated response for: ${prompt}`;
    logs = [...logs, `Ran at ${new Date().toLocaleTimeString()}`];
  }
</script>

<div class="flex h-full">
  <div class="w-1/2 p-2 flex flex-col">
    <textarea class="border p-2 flex-1" bind:value={prompt}></textarea>
    <button
      class="bg-blue-500 text-white px-4 py-2 mt-2 self-start"
      on:click={run}
    >
      Run
    </button>
    <label class="mt-2 text-sm flex items-center">
      <input type="checkbox" bind:checked={compare} class="mr-2" />Comparison Mode
    </label>
  </div>
  <div class="w-1/2 p-2 flex flex-col">
    <div class="border p-2 flex-1 whitespace-pre-wrap">{output}</div>
    <button class="text-blue-500 text-sm mt-2" on:click={() => (showLogs = !showLogs)}>
      Toggle Logs
    </button>
    {#if showLogs}
      <div class="border mt-2 p-2 flex-1 overflow-auto">
        {#each logs as log}
          <div>{log}</div>
        {/each}
      </div>
    {/if}
  </div>
</div>
