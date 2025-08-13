<script lang="ts">
  import { Button, Badge } from 'flowbite-svelte';
  import { 
    ChartOutline, 
    ExclamationCircleOutline,
    InfoCircleOutline
  } from 'flowbite-svelte-icons';
  import type { Agent } from '$lib/models/agent';

  let { agent = $bindable<Agent>() } = $props();
  
  // Mock data for monitoring
  let metrics = $state({
    requests: 1243,
    errors: 12,
    avgResponseTime: 245,
    uptime: 99.8
  });
  
  let alerts = $state([
    {
      id: '1',
      type: 'warning',
      message: 'High response time detected',
      timestamp: new Date(Date.now() - 3600000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'New agent deployed',
      timestamp: new Date(Date.now() - 86400000),
      resolved: true
    }
  ]);
  
  let logs = $state([
    {
      id: '1',
      level: 'info',
      message: 'Agent started processing request',
      timestamp: new Date(Date.now() - 10000)
    },
    {
      id: '2',
      level: 'debug',
      message: 'Connected to datastore successfully',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      level: 'warning',
      message: 'Slow response from LLM provider',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
</script>

<div class="space-y-8">
  <h2 class="text-xl font-bold text-white">Monitoring</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div class="flex items-center">
        <div class="bg-blue-500/20 p-3 rounded-lg">
          <ChartOutline class="w-6 h-6 text-blue-400" />
        </div>
        <div class="ml-4">
          <p class="text-slate-500 text-sm">Requests</p>
          <p class="text-2xl font-bold text-white">{metrics.requests}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div class="flex items-center">
        <div class="bg-green-500/20 p-3 rounded-lg">
          <ChartOutline class="w-6 h-6 text-green-400" />
        </div>
        <div class="ml-4">
          <p class="text-slate-500 text-sm">Avg. Response</p>
          <p class="text-2xl font-bold text-white">{metrics.avgResponseTime}ms</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div class="flex items-center">
        <div class="bg-yellow-500/20 p-3 rounded-lg">
          <ExclamationCircleOutline class="w-6 h-6 text-yellow-400" />
        </div>
        <div class="ml-4">
          <p class="text-slate-500 text-sm">Errors</p>
          <p class="text-2xl font-bold text-white">{metrics.errors}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div class="flex items-center">
        <div class="bg-purple-500/20 p-3 rounded-lg">
          <ChartOutline class="w-6 h-6 text-purple-400" />
        </div>
        <div class="ml-4">
          <p class="text-slate-500 text-sm">Uptime</p>
          <p class="text-2xl font-bold text-white">{metrics.uptime}%</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">Recent Alerts</h3>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
        {#if alerts.length === 0}
          <div class="p-8 text-center">
            <p class="text-slate-500">No alerts at this time</p>
          </div>
        {:else}
          <div class="divide-y divide-slate-700/50">
            {#each alerts as alert}
              <div class="p-4 flex items-start">
                {#if alert.type === 'warning'}
                  <ExclamationCircleOutline class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                {:else}
                  <InfoCircleOutline class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                {/if}
                <div class="ml-3 flex-1">
                  <div class="flex justify-between">
                    <p class="text-slate-300">{alert.message}</p>
                    {#if !alert.resolved}
                      <Badge color="yellow" class="text-xs">Active</Badge>
                    {/if}
                  </div>
                  <p class="text-slate-500 text-sm mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-medium text-slate-300 mb-4">Activity Logs</h3>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
        {#if logs.length === 0}
          <div class="p-8 text-center">
            <p class="text-slate-500">No recent activity</p>
          </div>
        {:else}
          <div class="divide-y divide-slate-700/50 max-h-96 overflow-y-auto">
            {#each logs as log}
              <div class="p-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    {#if log.level === 'error'}
                      <div class="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
                    {:else if log.level === 'warning'}
                      <div class="w-3 h-3 rounded-full bg-yellow-500 mt-1.5"></div>
                    {:else if log.level === 'info'}
                      <div class="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                    {:else}
                      <div class="w-3 h-3 rounded-full bg-gray-500 mt-1.5"></div>
                    {/if}
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-slate-300 text-sm">{log.message}</p>
                    <p class="text-slate-500 text-xs mt-1">
                      {log.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
    <h3 class="text-lg font-medium text-slate-300 mb-4">Performance Chart</h3>
    <div class="h-64 flex items-center justify-center">
      <div class="text-center">
        <div class="bg-slate-700/50 rounded-full p-4 inline-block mb-4">
          <ChartOutline class="w-12 h-12 text-slate-500" />
        </div>
        <p class="text-slate-500">Performance chart visualization would appear here</p>
        <p class="text-sm text-slate-600 mt-2">In a real implementation, this would show response times, error rates, and other metrics over time</p>
      </div>
    </div>
  </div>
</div>