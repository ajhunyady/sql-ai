<script lang="ts">
	import { Button, Badge } from 'flowbite-svelte';
	import {
		ArrowLeftOutline,
		CheckCircleSolid,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { Agent } from '$lib/models/agent';
	import { getAgentById, createAgent, updateAgent } from '$lib/stores/agents';
	import { getLLMProviderById } from '$lib/stores/llm-providers';

	import MetadataTab from './MetadataTab.svelte';
	import DataIntegrationsTab from './DataIntegrationsTab.svelte';
	import LLMConfigurationTab from './LLMConfigurationTab.svelte';
	import QueryingGuidanceTab from './QueryingGuidanceTab.svelte';
	import TestingTab from './TestingTab.svelte';
	import EvaluationsTab from './EvaluationsTab.svelte';
	import MonitoringTab from './MonitoringTab.svelte';

	// Extract agent ID from URL
	let agentId = $derived(page.url.pathname.split('/')[3]);
	let isNewAgent = $derived(agentId === 'new');

	// Create a new agent or load existing one
	let agent = $state<Agent | undefined>();

	$effect(() => {
		if (isNewAgent) {
			agent = {
				id: '',
				name: '',
				description: '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				datastoreIds: [],
				guidance: {
					generalInstructions: '',
					tableSemantics: {},
					customPrompts: []
				},
				isActive: true
			};
		} else {
			getAgentById(agentId).then((loadedAgent) => {
				agent = loadedAgent || undefined;
			});
		}
	});

	let activeTab = $state('metadata');
	let isSaving = $state(false);

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

	async function saveAgent() {
		if (!agent) return;

		isSaving = true;

		try {
			if (isNewAgent) {
				const newAgent = await createAgent({
					name: agent.name,
					description: agent.description,
					llmProviderId: agent.llmProviderId,
					datastoreIds: agent.datastoreIds,
					guidance: agent.guidance
				});
				// Redirect to the new agent's page
				if (newAgent) {
					goto(`/builder/agents/${newAgent.id}`);
				}
			} else {
				await updateAgent(agentId, {
					name: agent.name,
					description: agent.description,
					llmProviderId: agent.llmProviderId,
					datastoreIds: agent.datastoreIds,
					guidance: agent.guidance
				});
			}
		} catch (error) {
			console.error('Error saving agent:', error);
		} finally {
			isSaving = false;
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

	function isAgentComplete(): boolean {
		return tabs.slice(0, 4).every((tab) => isTabComplete(tab.id));
	}

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}

	function isActiveTab(tabId: string): boolean {
		return activeTab === tabId;
	}

	function getTabClass(tabId: string): string {
		const baseClasses =
			'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2';
		const activeClasses = 'text-blue-400 border-blue-500 bg-slate-800/30';
		const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200';

		return `${baseClasses} ${isActiveTab(tabId) ? activeClasses : inactiveClasses}`;
	}
</script>

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
		<div class="flex space-x-3">
			<Button color="blue" disabled={isSaving || !isAgentComplete()} onclick={saveAgent}>
				{isSaving ? 'Saving...' : 'Save Agent'}
			</Button>
		</div>
	</div>

	{#if agent === undefined && !isNewAgent}
		<div class="rounded-lg border border-red-500/30 bg-red-500/20 p-6 text-center">
			<ExclamationCircleSolid class="mx-auto mb-4 h-12 w-12 text-red-500" />
			<h2 class="mb-2 text-xl font-bold text-white">Agent Not Found</h2>
			<p class="mb-4 text-slate-300">
				The agent you're looking for doesn't exist or has been deleted.
			</p>
			<Button onclick={goBack} color="blue">Back to Builder</Button>
		</div>
	{:else}
		<div class="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50">
			<!-- Tab Navigation -->
			<div class="border-b border-slate-700/50">
				<div class="flex overflow-x-auto">
					{#each tabs as tab}
						<button class={getTabClass(tab.id)} onclick={() => (activeTab = tab.id)}>
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
				{#if activeTab === 'metadata'}
					<MetadataTab bind:agent />
				{:else if activeTab === 'data'}
					<DataIntegrationsTab bind:agent />
				{:else if activeTab === 'llm'}
					<LLMConfigurationTab bind:agent />
				{:else if activeTab === 'guidance'}
					<QueryingGuidanceTab bind:agent />
				{:else if activeTab === 'testing'}
					<TestingTab bind:agent />
				{:else if activeTab === 'evaluations'}
					<EvaluationsTab bind:agent />
				{:else if activeTab === 'monitoring'}
					<MonitoringTab bind:agent />
				{/if}
			</div>
		</div>
	{/if}
</div>
