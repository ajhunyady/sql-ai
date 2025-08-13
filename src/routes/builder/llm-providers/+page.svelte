<script lang="ts">
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';
	import LLMProviderList from '$lib/components/builder/LLMProviderList.svelte';
</script>

<svelte:head>
	<title>LLM Providers - Builder</title>
</svelte:head>

<BuilderSidebar />

<div class="ml-72 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
	<div class="mx-auto max-w-7xl">
		<LLMProviderList />
	</div>
</div>
