<script lang="ts">
  import { Input, Textarea, Button } from 'flowbite-svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import type { Agent } from '$lib/models/agent';

  let { agent = $bindable<Agent>() } = $props();
  
  let newTable = $state('');
  let newSemantics = $state('');
  let newPrompt = $state('');
  
  function addTableSemantics() {
    if (newTable && newSemantics) {
      agent.guidance.tableSemantics = {
        ...agent.guidance.tableSemantics,
        [newTable]: newSemantics
      };
      newTable = '';
      newSemantics = '';
    }
  }
  
  function removeTableSemantics(tableName: string) {
    const { [tableName]: _, ...rest } = agent.guidance.tableSemantics;
    agent.guidance.tableSemantics = rest;
  }
  
  function addCustomPrompt() {
    if (newPrompt) {
      agent.guidance.customPrompts = [...agent.guidance.customPrompts, newPrompt];
      newPrompt = '';
    }
  }
  
  function removeCustomPrompt(index: number) {
    agent.guidance.customPrompts = agent.guidance.customPrompts.filter((_: string, i: number) => i !== index);
  }
</script>

<div class="space-y-8">
  <h2 class="text-xl font-bold text-white">Querying Guidance</h2>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">General Instructions</h3>
      <Textarea
        id="general-instructions"
        bind:value={agent.guidance.generalInstructions}
        placeholder="Provide general instructions for the agent..."
        rows={8}
        class="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <p class="mt-2 text-sm text-slate-500">
        General instructions that guide the agent's behavior and responses
      </p>
    </div>
    
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">System Prompt Preview</h3>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 h-64 overflow-y-auto">
        <pre class="text-slate-300 text-sm whitespace-pre-wrap">
{`You are an AI assistant with the following instructions:

${agent.guidance.generalInstructions || "[No general instructions provided]"}

Table Semantics:
${Object.entries(agent.guidance.tableSemantics).map(([table, semantics]) => `- ${table}: ${semantics}`).join('\n') || "[No table semantics defined]"}

Custom Prompts:
${agent.guidance.customPrompts.map((prompt: string) => `- ${prompt}`).join('\n') || "[No custom prompts defined]"}`}
        </pre>
      </div>
      <p class="mt-2 text-sm text-slate-500">
        This is how your guidance will be incorporated into the system prompt
      </p>
    </div>
  </div>
  
  <div class="border-t border-slate-700/50 pt-8">
    <h3 class="text-lg font-medium text-slate-300 mb-4">Table Semantics</h3>
    <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="table-name" class="block text-sm text-slate-400 mb-1">Table Name</label>
          <Input
            id="table-name"
            bind:value={newTable}
            placeholder="e.g., users, orders"
            class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200"
          />
        </div>
        <div>
          <label for="table-semantics" class="block text-sm text-slate-400 mb-1">Semantics</label>
          <Input
            id="table-semantics"
            bind:value={newSemantics}
            placeholder="Description of table purpose"
            class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200"
          />
        </div>
      </div>
      <Button 
        color="blue" 
        size="sm"
        onclick={addTableSemantics}
        disabled={!newTable || !newSemantics}
      >
        <PlusOutline class="w-4 h-4 mr-1" />
        Add Table Semantics
      </Button>
    </div>
    
    {#if Object.keys(agent.guidance.tableSemantics).length > 0}
      <div class="mt-4 space-y-3">
        {#each Object.entries(agent.guidance.tableSemantics) as [tableName, semantics]}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h4 class="font-medium text-slate-200">{tableName}</h4>
              <p class="text-sm text-slate-500">{semantics}</p>
            </div>
            <Button
              color="gray"
              size="sm"
              onclick={() => removeTableSemantics(tableName)}
            >
              <TrashBinOutline class="w-4 h-4" />
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <div class="border-t border-slate-700/50 pt-8">
    <h3 class="text-lg font-medium text-slate-300 mb-4">Custom Prompts</h3>
    <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
      <div class="mb-4">
        <label for="custom-prompt" class="block text-sm text-slate-400 mb-1">Prompt</label>
        <Textarea
          id="custom-prompt"
          bind:value={newPrompt}
          placeholder="Add a custom prompt for this agent"
          rows={2}
          class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200"
        />
      </div>
      <Button 
        color="blue" 
        size="sm"
        onclick={addCustomPrompt}
        disabled={!newPrompt}
      >
        <PlusOutline class="w-4 h-4 mr-1" />
        Add Custom Prompt
      </Button>
    </div>
    
    {#if agent.guidance.customPrompts.length > 0}
      <div class="mt-4 space-y-3">
        {#each agent.guidance.customPrompts as prompt, i}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 flex justify-between items-center">
            <p class="text-slate-300">{prompt}</p>
            <Button
              color="gray"
              size="sm"
              onclick={() => removeCustomPrompt(i)}
            >
              <TrashBinOutline class="w-4 h-4" />
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>