<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/builder', { replaceState: true });
	});
</script>

<!-- This page redirects to /builder -->
