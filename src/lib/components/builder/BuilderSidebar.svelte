<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { FolderSolid, CogSolid, DatabaseSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function navigateTo(path: string) {
		goto(path);
	}

	function isActive(path: string): boolean {
		return page.url.pathname.startsWith(path);
	}

	function handleKeyPress(event: KeyboardEvent, path: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			navigateTo(path);
		}
	}
</script>

<div
	class="fixed top-20 left-0 h-full w-72 overflow-y-auto border-r border-blue-500/20 bg-slate-950/80 backdrop-blur-xl"
	aria-label="Builder navigation"
>
	<div class="p-6">
		<!-- Navigation Title -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-slate-200">Builder</h2>
			<p class="mt-1 text-sm text-slate-400">Manage your AI agents and resources</p>
		</div>

		<!-- Navigation Links -->
		<nav class="space-y-2" aria-label="Main navigation">
			<!-- Agents -->
			<div
				role="button"
				tabindex="0"
				class="cursor-pointer rounded-lg border border-slate-700/50 p-4 transition-all duration-300 hover:bg-slate-800/50 {isActive(
					'/builder/agents'
				)
					? 'border-blue-500/50 bg-blue-900/30 ring-2 ring-blue-500/30'
					: ''}"
				onclick={() => navigateTo('/builder/agents')}
				onkeydown={(e) => handleKeyPress(e, '/builder/agents')}
				aria-label="Navigate to Agents"
			>
				<div class="flex items-center">
					<FolderSolid class="mr-3 h-5 w-5 text-blue-400" />
					<div>
						<h3 class="font-medium text-slate-200">Agents</h3>
						<p class="text-sm text-slate-400">Manage AI agents and configurations</p>
					</div>
				</div>
			</div>

			<!-- LLM Providers -->
			<div
				role="button"
				tabindex="0"
				class="cursor-pointer rounded-lg border border-slate-700/50 p-4 transition-all duration-300 hover:bg-slate-800/50 {isActive(
					'/builder/llm-providers'
				)
					? 'border-blue-500/50 bg-blue-900/30 ring-2 ring-blue-500/30'
					: ''}"
				onclick={() => navigateTo('/builder/llm-providers')}
				onkeydown={(e) => handleKeyPress(e, '/builder/llm-providers')}
				aria-label="Navigate to LLM Providers"
			>
				<div class="flex items-center">
					<CogSolid class="mr-3 h-5 w-5 text-green-400" />
					<div>
						<h3 class="font-medium text-slate-200">LLM Providers</h3>
						<p class="text-sm text-slate-400">Configure language model providers</p>
					</div>
				</div>
			</div>

			<!-- Datastores -->
			<div
				role="button"
				tabindex="0"
				class="cursor-pointer rounded-lg border border-slate-700/50 p-4 transition-all duration-300 hover:bg-slate-800/50 {isActive(
					'/builder/datastores'
				)
					? 'border-blue-500/50 bg-blue-900/30 ring-2 ring-blue-500/30'
					: ''}"
				onclick={() => navigateTo('/builder/datastores')}
				onkeydown={(e) => handleKeyPress(e, '/builder/datastores')}
				aria-label="Navigate to Datastores"
			>
				<div class="flex items-center">
					<DatabaseSolid class="mr-3 h-5 w-5 text-purple-400" />
					<div>
						<h3 class="font-medium text-slate-200">Datastores</h3>
						<p class="text-sm text-slate-400">Manage database connections</p>
					</div>
				</div>
			</div>
		</nav>
	</div>
</div>
