<div class="space-y-8 max-w-xl">
  <section>
    <h2 class="font-semibold mb-2">Provider Credentials</h2>
    <button class="bg-blue-500 text-white px-3 py-1 rounded mb-2">Create New</button>
    <div>
      <label for="reuse-cred" class="block text-sm">Reuse Existing</label>
      <select id="reuse-cred" class="border p-2 w-full"><option>Choose...</option></select>
    </div>
    <table class="w-full mt-4 text-sm">
      <thead>
        <tr class="border-b">
          <th class="text-left p-1">Provider</th>
          <th class="text-left p-1">Key</th>
          <th class="p-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-1">OpenAI</td>
          <td class="p-1">••••••</td>
          <td class="p-1 text-center">Edit/Delete</td>
        </tr>
      </tbody>
    </table>
  </section>
  <section>
    <h2 class="font-semibold mb-2">Model Selection</h2>
    <label for="model" class="block text-sm">Models</label>
    <select id="model" class="border p-2 w-full mb-2">
      <option>GPT-4</option>
      <option>Claude</option>
    </select>
    <button class="bg-green-500 text-white px-3 py-1 rounded">Test Integration</button>
  </section>
</div>
