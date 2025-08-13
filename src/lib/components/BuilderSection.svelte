<script>
  import BuilderSidebar from './BuilderSidebar.svelte';
  import { USER_NAME } from '$lib/constants';
  import { page } from '$app/state';
  import AgentList from './builder/AgentList.svelte';
  import AgentEditor from './builder/AgentEditor.svelte';
</script>

<div class="flex">
  <BuilderSidebar />
  <main class="ml-72 px-6 py-8 flex flex-col items-center w-full">
    {#if page.url.pathname === '/builder'}
      <AgentList />
    {:else if page.url.pathname.startsWith('/builder/agents/')}
      <AgentEditor />
    {:else}
      <div class="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div class="text-center max-w-4xl">
          <h1 class="text-3xl md:text-4xl mb-3 font-bold gradient-text">
            Builder Section
          </h1>
          <p class="text-slate-300 text-lg mb-8">
            Welcome to the Builder section, {USER_NAME}. This is where you'll be able to create and manage your agents.
          </p>
          <div class="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
            <p class="text-slate-400 mb-4">
              Select an agent from the sidebar or create a new one to get started.
            </p>
            <p class="text-slate-500 text-sm">
              You can configure agents with datastores, LLM providers, and querying guidance.
            </p>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>