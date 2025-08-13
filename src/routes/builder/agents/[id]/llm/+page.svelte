<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import LLMConfigurationTab from '$lib/components/builder/LLMConfigurationTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="llm" nextTabId="guidance" onAgentUpdate={updateAgentData}>
	<LLMConfigurationTab bind:agent />
</TabWrapper>
