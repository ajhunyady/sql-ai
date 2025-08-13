<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/builder/agents', { replaceState: true });
	});
</script>

<!-- This page redirects to the agents page -->
