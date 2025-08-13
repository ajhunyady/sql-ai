<script lang="ts">
  import { Input, Textarea, Button } from 'flowbite-svelte';
  import { ArrowRightOutline, RefreshOutline } from 'flowbite-svelte-icons';
  import type { Agent } from '$lib/models/agent';

  let { agent = $bindable<Agent>() } = $props();
  
  let testInput = $state('');
  let testOutput = $state('');
  let isTesting = $state(false);
  let testHistory = $state<{input: string, output: string, timestamp: Date}[]>([]);
  
  async function runTest() {
    if (!testInput) return;
    
    isTesting = true;
    testOutput = '';
    
    // Simulate API call to test the agent
    setTimeout(() => {
      const responses = [
        "Based on the data I analyzed, sales have increased by 15% this quarter compared to the previous one.",
        "I found 3 new customer inquiries that require immediate attention in the support database.",
        "The top performing product category is electronics with $2.3M in revenue.",
        "I've identified a potential data inconsistency in the user records that needs review.",
        "The system is currently operating at 92% efficiency with no critical issues detected."
      ];
      
      testOutput = responses[Math.floor(Math.random() * responses.length)];
      testHistory = [
        { input: testInput, output: testOutput, timestamp: new Date() },
        ...testHistory
      ];
      isTesting = false;
    }, 1500);
  }
  
  function clearHistory() {
    testHistory = [];
  }
</script>

<div class="space-y-8">
  <h2 class="text-xl font-bold text-white">Testing Playground</h2>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">Test Input</h3>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
        <Textarea
          bind:value={testInput}
          placeholder="Enter a test query for your agent..."
          rows={6}
          class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200 mb-4"
        />
        <div class="flex justify-end">
          <Button 
            color="blue" 
            onclick={runTest}
            disabled={isTesting || !testInput}
          >
            {#if isTesting}
              <RefreshOutline class="w-4 h-4 mr-2 animate-spin" />
              Testing...
            {:else}
              <ArrowRightOutline class="w-4 h-4 mr-2" />
              Run Test
            {/if}
          </Button>
        </div>
      </div>
      
      <div class="mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-slate-300">Test History</h3>
          {#if testHistory.length > 0}
            <Button
              color="gray"
              size="sm"
              onclick={clearHistory}
            >
              Clear History
            </Button>
          {/if}
        </div>
        
        {#if testHistory.length === 0}
          <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 text-center">
            <p class="text-slate-500">No test history yet</p>
            <p class="text-sm text-slate-600 mt-2">
              Run a test to see results here
            </p>
          </div>
        {:else}
          <div class="space-y-4 max-h-96 overflow-y-auto">
            {#each testHistory as test, i}
              <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <p class="text-slate-300 font-medium">Test #{testHistory.length - i}</p>
                  <span class="text-xs text-slate-500">
                    {test.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p class="text-slate-400 text-sm mb-2">Input:</p>
                <p class="text-slate-300 mb-3">{test.input}</p>
                <p class="text-slate-400 text-sm mb-2">Output:</p>
                <p class="text-slate-300">{test.output}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">Test Output</h3>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 h-96 overflow-y-auto">
        {#if isTesting}
          <div class="flex flex-col items-center justify-center h-full">
            <RefreshOutline class="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p class="text-slate-500">Testing agent...</p>
          </div>
        {:else if testOutput}
          <div>
            <p class="text-slate-400 text-sm mb-2">Response:</p>
            <p class="text-slate-300">{testOutput}</p>
          </div>
        {:else}
          <div class="flex flex-col items-center justify-center h-full text-center">
            <div class="bg-slate-700/50 rounded-full p-4 mb-4">
              <ArrowRightOutline class="w-8 h-8 text-slate-500" />
            </div>
            <p class="text-slate-500">Run a test to see the agent's response</p>
            <p class="text-sm text-slate-600 mt-2">
              Enter a query and click "Run Test" to see how your agent responds
            </p>
          </div>
        {/if}
      </div>
      
      <div class="mt-6">
        <h3 class="text-lg font-medium text-slate-300 mb-4">Performance Metrics</h3>
        <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-400">1.2s</p>
              <p class="text-sm text-slate-500">Avg. Response</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-400">98%</p>
              <p class="text-sm text-slate-500">Accuracy</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-purple-400">24</p>
              <p class="text-sm text-slate-500">Tests Run</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>