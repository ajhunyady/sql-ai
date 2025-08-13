<script lang="ts">
  import { Button, Badge } from 'flowbite-svelte';
  import { 
    PlayOutline, 
    PlusOutline, 
    ChartOutline,
    TextSizeOutline
  } from 'flowbite-svelte-icons';
  import type { Agent } from '$lib/models/agent';

  let { agent = $bindable<Agent>() } = $props();
  
  let evaluations = $state([
    {
      id: '1',
      name: 'Sales Data Accuracy',
      status: 'completed',
      lastRun: new Date('2023-05-15'),
      accuracy: 92,
      totalTests: 50
    },
    {
      id: '2',
      name: 'Customer Support Responses',
      status: 'running',
      lastRun: new Date(),
      accuracy: 0,
      totalTests: 25
    },
    {
      id: '3',
      name: 'Product Recommendation Quality',
      status: 'scheduled',
      lastRun: null,
      accuracy: 0,
      totalTests: 100
    }
  ]);
  
  let testCases = $state([
    {
      id: '1',
      input: 'What were our top 5 best selling products last quarter?',
      expected: 'Electronics, Home Goods, Clothing, Books, Sports Equipment',
      category: 'Sales'
    },
    {
      id: '2',
      input: 'How many support tickets were opened yesterday?',
      expected: '127 tickets',
      category: 'Support'
    },
    {
      id: '3',
      input: 'Which customer segment has the highest lifetime value?',
      expected: 'Enterprise clients with $25,000+ annual revenue',
      category: 'Analytics'
    }
  ]);
  
  let showNewEvalForm = $state(false);
  let newEvalName = $state('');
  let selectedTestSuite = $state('Default Test Suite');
  
  function runEvaluation(evalId: string) {
    // Simulate running an evaluation
    const evalIndex = evaluations.findIndex(e => e.id === evalId);
    if (evalIndex !== -1) {
      evaluations[evalIndex].status = 'running';
      setTimeout(() => {
        evaluations[evalIndex].status = 'completed';
        evaluations[evalIndex].lastRun = new Date();
        evaluations[evalIndex].accuracy = Math.floor(Math.random() * 30) + 70; // Random accuracy between 70-100
      }, 2000);
    }
  }
  
  function addNewEvaluation() {
    if (newEvalName) {
      evaluations = [
        ...evaluations,
        {
          id: `eval-${Date.now()}`,
          name: newEvalName,
          status: 'scheduled',
          lastRun: null,
          accuracy: 0,
          totalTests: 0
        }
      ];
      newEvalName = '';
      showNewEvalForm = false;
    }
  }
  
  function deleteEvaluation(evalId: string) {
    evaluations = evaluations.filter(e => e.id !== evalId);
  }
</script>

<div class="space-y-8">
  <h2 class="text-xl font-bold text-white">Evaluations</h2>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-slate-300">Evaluation Suites</h3>
        <Button 
          color="blue" 
          size="sm"
          onclick={() => showNewEvalForm = !showNewEvalForm}
        >
          <PlusOutline class="w-4 h-4 mr-1" />
          Add New
        </Button>
      </div>
      
      {#if showNewEvalForm}
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-6">
          <h4 class="text-md font-medium text-slate-300 mb-3">Create New Evaluation</h4>
          <div class="space-y-4">
            <div>
              <label for="eval-name" class="block text-sm text-slate-400 mb-1">Evaluation Name</label>
              <input
                id="eval-name"
                bind:value={newEvalName}
                type="text"
                placeholder="My Evaluation Suite"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label for="test-suite" class="block text-sm text-slate-400 mb-1">Test Suite</label>
              <select
                id="test-suite"
                bind:value={selectedTestSuite}
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded px-3 py-2 text-slate-200"
              >
                <option>Default Test Suite</option>
                <option>Custom Test Suite 1</option>
                <option>Custom Test Suite 2</option>
              </select>
            </div>
            <div class="flex space-x-2">
              <Button color="blue" size="sm" onclick={addNewEvaluation}>
                Create Evaluation
              </Button>
              <Button color="none" size="sm" onclick={() => showNewEvalForm = false}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      {/if}
      
      <div class="space-y-4">
        {#each evaluations as evaluation}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-medium text-slate-200">{evaluation.name}</h4>
              <div class="flex space-x-2">
                <Button 
                  color="none" 
                  size="sm"
                  onclick={() => runEvaluation(evaluation.id)}
                  disabled={evaluation.status === 'running'}
                >
                  {#if evaluation.status === 'running'}
                    <span class="flex items-center">
                      <span class="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                      Running
                    </span>
                  {:else}
                    <PlayOutline class="w-4 h-4" />
                  {/if}
                </Button>
                <Button 
                  color="none" 
                  size="sm"
                  onclick={() => deleteEvaluation(evaluation.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            
            <div class="flex items-center mb-3">
              <Badge 
                color={
                  evaluation.status === 'completed' ? 'green' : 
                  evaluation.status === 'running' ? 'blue' : 
                  'yellow'
                } 
                class="text-xs"
              >
                {evaluation.status}
              </Badge>
              {#if evaluation.lastRun}
                <span class="text-xs text-slate-500 ml-3">
                  Last run: {evaluation.lastRun.toLocaleDateString()}
                </span>
              {/if}
            </div>
            
            {#if evaluation.status === 'completed'}
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-slate-500">Accuracy</p>
                  <p class="text-lg font-bold text-green-400">{evaluation.accuracy}%</p>
                </div>
                <div>
                  <p class="text-sm text-slate-500">Tests</p>
                  <p class="text-lg font-bold text-slate-300">{evaluation.totalTests}</p>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">Test Cases</h3>
      
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-slate-300">Default Test Suite</h4>
          <Badge color="blue" class="text-xs">3 cases</Badge>
        </div>
        
        <div class="space-y-3">
          {#each testCases as testCase}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div class="flex justify-between items-start mb-2">
                <h5 class="font-medium text-slate-200 text-sm">{testCase.category}</h5>
                <Badge color="purple" class="text-xs">{testCase.id}</Badge>
              </div>
              <p class="text-slate-400 text-xs mb-2">Input:</p>
              <p class="text-slate-300 text-sm mb-2">{testCase.input}</p>
              <p class="text-slate-400 text-xs mb-1">Expected:</p>
              <p class="text-slate-300 text-sm">{testCase.expected}</p>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
        <h4 class="font-medium text-slate-300 mb-4">Evaluation Results</h4>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-400">Overall Accuracy</span>
              <span class="text-slate-300">87%</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 87%"></div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-400">24</p>
              <p class="text-sm text-slate-500">Tests Run</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-400">21</p>
              <p class="text-sm text-slate-500">Passed</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-red-400">3</p>
              <p class="text-sm text-slate-500">Failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>