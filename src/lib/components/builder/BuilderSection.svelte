<script>
	import BuilderSidebar from './BuilderSidebar.svelte';
	import { USER_NAME } from '$lib/constants';
	import { page } from '$app/state';
	import AgentList from './AgentList.svelte';
	import AgentEditor from './AgentEditor.svelte';
</script>

<div class="flex">
	<BuilderSidebar />
	<main class="ml-72 flex w-full flex-col items-center px-6 py-8">
		{#if page.url.pathname === '/builder'}
			<AgentList />
		{:else if page.url.pathname.startsWith('/builder/agents/')}
			<AgentEditor />
		{:else}
			<div class="flex min-h-[80vh] flex-col items-center justify-center px-6">
				<div class="max-w-4xl text-center">
					<h1 class="gradient-text mb-3 text-3xl font-bold md:text-4xl">Builder Section</h1>
					<p class="mb-8 text-lg text-slate-300">
						Welcome to the Builder section, {USER_NAME}. This is where you'll be able to create and
						manage your agents.
					</p>
					<div class="rounded-lg border border-slate-700 bg-slate-800/50 p-8">
						<p class="mb-4 text-slate-400">
							Select an agent from the sidebar or create a new one to get started.
						</p>
						<p class="text-sm text-slate-500">
							You can configure agents with datastores, LLM providers, and querying guidance.
						</p>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
