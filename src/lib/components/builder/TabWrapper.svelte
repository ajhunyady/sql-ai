<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { Agent } from '$lib/models/agent';
	import { createAgent, updateAgent } from '$lib/stores/agents';

	interface Props {
		agent: Agent;
		tabId: string;
		nextTabId?: string;
		onAgentUpdate?: (updates: Partial<Agent>) => void;
	}

	let { agent, tabId, nextTabId, onAgentUpdate }: Props = $props();

	let isSaving = $state(false);

	// Extract agent ID from URL
	let agentId = $derived($page.params.id || '');
	let isNewAgent = $derived(agentId === 'new');

	// Tab configuration for navigation
	const tabs = [
		{ id: 'metadata', label: 'Metadata' },
		{ id: 'data', label: 'Data & Integrations' },
		{ id: 'llm', label: 'LLM Configuration' },
		{ id: 'guidance', label: 'Querying Guidance' },
		{ id: 'testing', label: 'Testing' },
		{ id: 'evaluations', label: 'Evaluations' },
		{ id: 'monitoring', label: 'Monitoring' }
	];

	function getNextTabId(): string | null {
		if (nextTabId) return nextTabId;

		const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
		if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
			return tabs[currentIndex + 1].id;
		}
		return null;
	}

	async function saveAgent(continueToNext = false) {
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

				if (newAgent) {
					// Update the agent data with the new ID
					if (onAgentUpdate) {
						onAgentUpdate({ id: newAgent.id });
					}

					// Navigate to the new agent's current tab or next tab
					const targetTab = continueToNext ? getNextTabId() : tabId;
					const basePath = `/builder/agents/${newAgent.id}`;
					const targetPath = targetTab === 'metadata' ? basePath : `${basePath}/${targetTab}`;
					goto(targetPath);
				}
			} else {
				await updateAgent(agentId, {
					name: agent.name,
					description: agent.description,
					llmProviderId: agent.llmProviderId,
					datastoreIds: agent.datastoreIds,
					guidance: agent.guidance
				});

				// Invalidate all data to refresh the layout with updated agent
				await invalidateAll();

				if (continueToNext) {
					const nextTab = getNextTabId();
					if (nextTab) {
						const basePath = `/builder/agents/${agentId}`;
						const targetPath = nextTab === 'metadata' ? basePath : `${basePath}/${nextTab}`;
						goto(targetPath);
					}
				}
			}
		} catch (error) {
			console.error('Error saving agent:', error);
		} finally {
			isSaving = false;
		}
	}

	function isTabComplete(): boolean {
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

	function canSave(): boolean {
		return isTabComplete() && !isSaving;
	}

	function canContinue(): boolean {
		return canSave() && !!getNextTabId();
	}
</script>

<div class="space-y-6">
	<!-- Tab content slot -->
	<slot />

	<!-- Action buttons -->
	<div class="flex justify-between border-t border-slate-700/50 pt-6">
		<div></div>
		<div class="flex space-x-3">
			<Button color="gray" disabled={!canSave()} onclick={() => saveAgent(false)}>
				{isSaving ? 'Saving...' : 'Save'}
			</Button>
			{#if getNextTabId()}
				<Button color="blue" disabled={!canContinue()} onclick={() => saveAgent(true)}>
					{isSaving ? 'Saving...' : 'Save & Continue'}
				</Button>
			{/if}
		</div>
	</div>
</div>
