<script>
  let testCases = [];
  let promptInput = '';
  let expected = '';

  function addCase() {
    if (!promptInput) return;
    testCases = [...testCases, { prompt: promptInput, expected, result: '' }];
    promptInput = '';
    expected = '';
  }

  function runAll() {
    testCases = testCases.map(c => ({ ...c, result: 'Pass' }));
  }
</script>

<div class="space-y-4">
  <div>
    <button class="bg-blue-500 text-white px-3 py-1 rounded" on:click={addCase}>
      Add Test Case
    </button>
    <div class="mt-2 space-y-2">
      <input class="border p-2 w-full" placeholder="Prompt" bind:value={promptInput} />
      <input class="border p-2 w-full" placeholder="Expected" bind:value={expected} />
    </div>
  </div>
  <div>
    <button class="bg-green-500 text-white px-3 py-1 rounded" on:click={runAll}>
      Run All
    </button>
  </div>
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b">
        <th class="text-left p-1">Prompt</th>
        <th class="text-left p-1">Expected</th>
        <th class="text-left p-1">Result</th>
      </tr>
    </thead>
    <tbody>
      {#each testCases as c}
        <tr class="border-b">
          <td class="p-1">{c.prompt}</td>
          <td class="p-1">{c.expected}</td>
          <td class="p-1">{c.result}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
