<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ArrowLeftOutline, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Agent } from '$lib/models/agent';
	import { updateAgentStatus } from '$lib/stores/agents';
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';

	let { data, children } = $props();

	// Extract agent ID from URL
	let agentId = $derived($page.params.id || '');
	let isNewAgent = $derived(agentId === 'new');

	// Agent data from load function
	let agent = $state<Agent>(data.agent);
	let isUpdatingStatus = $state(false);

	// Current tab derived from URL
	let currentTab = $derived(() => {
		const pathSegments = $page.url.pathname.split('/');
		const tabSegment = pathSegments[pathSegments.length - 1];
		return tabSegment === agentId ? 'metadata' : tabSegment;
	});

	// Tab configuration
	const tabs = [
		{ id: 'metadata', label: 'Metadata', required: true },
		{ id: 'data', label: 'Data & Integrations', required: true },
		{ id: 'llm', label: 'LLM Configuration', required: true },
		{ id: 'guidance', label: 'Querying Guidance', required: true },
		{ id: 'testing', label: 'Testing', required: false },
		{ id: 'evaluations', label: 'Evaluations', required: false },
		{ id: 'monitoring', label: 'Monitoring', required: false }
	];

	function goBack() {
		goto('/builder');
	}

	async function toggleAgentStatus() {
		if (!agent || isNewAgent || isUpdatingStatus) return;

		isUpdatingStatus = true;
		try {
			const updatedAgent = await updateAgentStatus(agent.id, !agent.isActive);
			if (updatedAgent) {
				agent = updatedAgent;
			}
		} catch (error) {
			console.error('Error updating agent status:', error);
		} finally {
			isUpdatingStatus = false;
		}
	}

	function isTabComplete(tabId: string): boolean {
		if (!agent) return false;

		switch (tabId) {
			case 'metadata':
				return !!agent.name && !!agent.description;
			case 'data':
				return agent.datastoreIds.length > 0;
			case 'llm':
				return !!agent.llmProviderId;
			case 'guidance':
				return !!agent.guidance.generalInstructions;
			default:
				return true;
		}
	}

	function navigateToTab(tabId: string) {
		const basePath = `/builder/agents/${agentId}`;
		const targetPath = tabId === 'metadata' ? basePath : `${basePath}/${tabId}`;
		goto(targetPath);
	}

	function isActiveTab(tabId: string): boolean {
		return currentTab() === tabId;
	}

	function getTabClass(tabId: string): string {
		const baseClasses =
			'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2';
		const activeClasses = 'text-blue-400 border-blue-500 bg-slate-800/30';
		const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200';

		return `${baseClasses} ${isActiveTab(tabId) ? activeClasses : inactiveClasses}`;
	}
</script>

<div class="flex">
	<BuilderSidebar />
	<main class="ml-72 flex w-full flex-col items-center px-6 py-8">
		<div class="mx-auto w-full max-w-6xl">
			<div class="mb-8 flex items-center justify-between">
				<div class="flex items-center">
					<Button color="gray" class="mr-2 p-2 text-slate-400 hover:text-white" onclick={goBack}>
						<ArrowLeftOutline class="h-5 w-5" />
					</Button>
					<h1 class="text-2xl font-bold text-white">
						{isNewAgent ? 'Create New Agent' : agent?.name || 'Agent Editor'}
					</h1>
				</div>
				{#if !isNewAgent && agent}
					<div class="flex items-center space-x-3">
						<span class="text-sm text-slate-400">Active</span>
						<button
							class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {agent.isActive
								? 'bg-green-600'
								: 'bg-gray-200'} {isUpdatingStatus
								? 'cursor-not-allowed opacity-50'
								: 'cursor-pointer'}"
							disabled={isUpdatingStatus}
							onclick={toggleAgentStatus}
							aria-label={agent.isActive ? 'Deactivate agent' : 'Activate agent'}
						>
							<span
								class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {agent.isActive
									? 'translate-x-6'
									: 'translate-x-1'}"
							></span>
						</button>
					</div>
				{/if}
			</div>

			{#if agent}
				<div class="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50">
					<!-- Tab Navigation -->
					<div class="border-b border-slate-700/50">
						<div class="flex overflow-x-auto">
							{#each tabs as tab (tab.id)}
								<button class={getTabClass(tab.id)} onclick={() => navigateToTab(tab.id)}>
									<div class="flex items-center">
										{tab.label}
										{#if tab.required && !isActiveTab(tab.id) && !isTabComplete(tab.id)}
											<span class="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
										{/if}
										{#if tab.required && !isActiveTab(tab.id) && isTabComplete(tab.id)}
											<CheckCircleSolid class="ml-2 h-4 w-4 text-green-500" />
										{/if}
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- Tab Content -->
					<div class="p-6">
						{@render children?.()}
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>
