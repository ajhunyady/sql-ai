<script lang="ts">
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';
	import DatastoreList from '$lib/components/builder/DatastoreList.svelte';
</script>

<svelte:head>
	<title>Datastores - Builder</title>
</svelte:head>

<BuilderSidebar />

<div class="ml-72 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
	<div class="mx-auto max-w-7xl">
		<DatastoreList />
	</div>
</div>
