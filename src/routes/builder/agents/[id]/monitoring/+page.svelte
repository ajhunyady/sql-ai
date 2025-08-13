<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import MonitoringTab from '$lib/components/builder/MonitoringTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="monitoring" onAgentUpdate={updateAgentData}>
	<MonitoringTab bind:agent />
</TabWrapper>
