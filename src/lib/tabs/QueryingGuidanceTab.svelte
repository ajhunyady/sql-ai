<script>
  let modules = [];
  const available = ['Rules', 'Examples', 'Constraints'];

  function addModule(name) {
    modules = [...modules, { name, content: '' }];
  }
  function removeModule(i) {
    modules = modules.filter((_, idx) => idx !== i);
  }
  $: compiled = modules.map(m => `### ${m.name}\n${m.content}`).join('\n\n');
</script>

<div class="flex space-x-4">
  <div class="w-1/2">
    <h2 class="font-semibold mb-2">Modules</h2>
    <div class="flex space-x-2 mb-4">
      {#each available as a}
        <button class="bg-gray-200 px-2 py-1 rounded" on:click={() => addModule(a)}>{a}</button>
      {/each}
    </div>
    <ul>
      {#each modules as m, i}
        <li class="border p-2 mb-2">
          <div class="flex justify-between">
            <span>{m.name}</span>
            <button class="text-red-500 text-sm" on:click={() => removeModule(i)}>Delete</button>
          </div>
          <textarea class="border p-2 w-full mt-2" rows="2" bind:value={m.content}></textarea>
        </li>
      {/each}
    </ul>
  </div>
  <div class="w-1/2">
    <h2 class="font-semibold mb-2">Compiled System Prompt</h2>
    <textarea class="border p-2 w-full h-full" readonly bind:value={compiled}></textarea>
  </div>
</div>
