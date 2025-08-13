<script>
	import AgentEditor from '$lib/components/builder/AgentEditor.svelte';
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';
</script>

<div class="flex">
	<BuilderSidebar />
	<main class="ml-72 flex w-full flex-col items-center px-6 py-8">
		<AgentEditor />
	</main>
</div>
