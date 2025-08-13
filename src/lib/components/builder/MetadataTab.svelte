<script lang="ts">
  import { Input, Textarea } from 'flowbite-svelte';
  import type { Agent } from '$lib/models/agent';

  let { agent = $bindable<Agent>() } = $props();
</script>

<div class="max-w-2xl">
  <h2 class="text-xl font-bold text-white mb-6">Agent Metadata</h2>
  
  <div class="space-y-6">
    <div>
      <label for="agent-name" class="block text-sm font-medium text-slate-300 mb-2">
        Agent Name
      </label>
      <Input
        id="agent-name"
        bind:value={agent.name}
        placeholder="Enter a name for your agent"
        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <p class="mt-2 text-sm text-slate-500">
        Give your agent a descriptive name that reflects its purpose
      </p>
    </div>
    
    <div>
      <label for="agent-description" class="block text-sm font-medium text-slate-300 mb-2">
        Description
      </label>
      <Textarea
        id="agent-description"
        bind:value={agent.description}
        placeholder="Describe what this agent does..."
        rows={4}
        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <p class="mt-2 text-sm text-slate-500">
        Provide a detailed description of the agent's purpose and capabilities
      </p>
    </div>
    
    <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
      <h3 class="font-medium text-slate-300 mb-2">Agent Information</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-slate-500">Created</p>
          <p class="text-slate-300">{new Date(agent.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p class="text-slate-500">Last Updated</p>
          <p class="text-slate-300">{new Date(agent.updatedAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p class="text-slate-500">Status</p>
          <p class="text-slate-300">
            <span class="inline-flex items-center">
              <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {agent.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>