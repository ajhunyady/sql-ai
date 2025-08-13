<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import MetadataTab from '$lib/components/builder/MetadataTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="metadata" nextTabId="data" onAgentUpdate={updateAgentData}>
	<MetadataTab bind:agent />
</TabWrapper>
