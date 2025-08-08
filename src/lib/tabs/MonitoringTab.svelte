<script>
  let logs = [
    { time: '10:00', event: 'Query', details: 'Fetched data' },
    { time: '10:05', event: 'Error', details: 'Timeout' }
  ];
</script>

<div class="space-y-4">
  <section>
    <h2 class="font-semibold mb-2">Dashboard</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="border p-4">Usage Chart Placeholder</div>
      <div class="border p-4">Errors Chart Placeholder</div>
    </div>
    <div class="mt-4">
      <h3 class="font-semibold mb-2">Alerts</h3>
      <ul class="list-disc pl-4 text-sm">
        <li>High Latency</li>
      </ul>
    </div>
  </section>
  <section>
    <h2 class="font-semibold mb-2">Logs</h2>
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="p-1 text-left">Timestamp</th>
          <th class="p-1 text-left">Event</th>
          <th class="p-1 text-left">Details</th>
        </tr>
      </thead>
      <tbody>
        {#each logs as l}
          <tr class="border-b">
            <td class="p-1">{l.time}</td>
            <td class="p-1">{l.event}</td>
            <td class="p-1">{l.details}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <button class="mt-2 bg-gray-200 px-2 py-1 rounded">Refresh</button>
  </section>
</div>
