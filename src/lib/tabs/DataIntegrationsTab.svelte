<div class="space-y-8">
  <section>
    <h2 class="font-semibold mb-2">Data Store Connection</h2>
    <div class="space-y-2 max-w-md">
      <div>
        <label for="conn-type" class="block text-sm">Type</label>
        <select id="conn-type" class="border p-2 w-full">
          <option>SurrealDB</option>
          <option>PostgreSQL</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="conn-host" class="block text-sm">Host</label>
          <input id="conn-host" class="border p-2 w-full" />
        </div>
        <div>
          <label for="conn-port" class="block text-sm">Port</label>
          <input id="conn-port" class="border p-2 w-full" />
        </div>
        <div>
          <label for="conn-user" class="block text-sm">Username</label>
          <input id="conn-user" class="border p-2 w-full" />
        </div>
        <div>
          <label for="conn-pass" class="block text-sm">Password</label>
          <input id="conn-pass" type="password" class="border p-2 w-full" />
        </div>
      </div>
      <button class="bg-green-500 text-white px-3 py-1 rounded">Test Connection</button>
    </div>
  </section>

  <section>
    <h2 class="font-semibold mb-2">Tools</h2>
    <button class="bg-blue-500 text-white px-3 py-1 rounded">Add Tool</button>
    <table class="w-full mt-4 text-sm">
      <thead>
        <tr class="border-b">
          <th class="text-left p-1">Name</th>
          <th class="text-left p-1">Type</th>
          <th class="p-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-1">Example Tool</td>
          <td class="p-1">Query</td>
          <td class="p-1 text-center">Edit/Delete</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-2">
      <label for="reuse-tool" class="block text-sm">Reuse from Library</label>
      <select id="reuse-tool" class="border p-2 w-full"><option>None</option></select>
    </div>
  </section>
</div>
