<script>
  export let agent;
</script>

<button class="border p-4 rounded hover:bg-gray-50 text-left w-full">
  <h3 class="font-semibold">{agent.name}</h3>
  <p class="text-sm">{agent.description}</p>
  <p class="text-xs text-gray-500">Status: {agent.status}</p>
</button>

