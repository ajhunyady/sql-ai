<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import TestingTab from '$lib/components/builder/TestingTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="testing" nextTabId="evaluations" onAgentUpdate={updateAgentData}>
	<TestingTab bind:agent />
</TabWrapper>
