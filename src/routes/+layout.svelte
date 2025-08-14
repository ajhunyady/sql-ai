<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/common/Header.svelte';
	import { initializeDatabaseErrorHandling } from '$lib/utils/database-reset';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Initialize database error handling
		initializeDatabaseErrorHandling();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen">
	<Header />
	{@render children?.()}
</div>
