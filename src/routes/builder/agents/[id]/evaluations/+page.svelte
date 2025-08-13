<script lang="ts">
	import TabWrapper from '$lib/components/builder/TabWrapper.svelte';
	import EvaluationsTab from '$lib/components/builder/EvaluationsTab.svelte';
	import type { Agent } from '$lib/models/agent';

	let { data } = $props();
	let agent = $state(data.agent);

	function updateAgentData(updates: Partial<Agent>) {
		if (agent) {
			agent = { ...agent, ...updates };
		}
	}
</script>

<TabWrapper {agent} tabId="evaluations" nextTabId="monitoring" onAgentUpdate={updateAgentData}>
	<EvaluationsTab bind:agent />
</TabWrapper>
