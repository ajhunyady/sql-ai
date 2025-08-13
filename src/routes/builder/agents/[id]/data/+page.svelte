<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import DataIntegrationsTab from '$lib/components/builder/DataIntegrationsTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="data" nextTabId="llm" onAgentUpdate={updateAgentData}>
	<DataIntegrationsTab bind:agent />
</TabWrapper>
