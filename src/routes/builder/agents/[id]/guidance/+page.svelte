<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import QueryingGuidanceTab from '$lib/components/builder/QueryingGuidanceTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="guidance" nextTabId="testing" onAgentUpdate={updateAgentData}>
	<QueryingGuidanceTab bind:agent />
</TabWrapper>
