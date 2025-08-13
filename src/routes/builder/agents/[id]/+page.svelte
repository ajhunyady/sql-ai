<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		const agentId = $page.params.id;
		goto(`/builder/agents/${agentId}/metadata`, { replaceState: true });
	});
</script>

<!-- This page redirects to the metadata tab -->
<div class="flex min-h-screen items-center justify-center">
	<div class="text-slate-400">Redirecting...</div>
</div>
