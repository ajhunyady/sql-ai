<script>
	import Sidebar from '$lib/components/analyst/Sidebar.svelte';
	import WelcomeSection from '$lib/components/common/WelcomeSection.svelte';
	import QueryInput from '$lib/components/analyst/QueryInput.svelte';
</script>

<svelte:head>
	<title>Data Analyst - CoAgent SQL</title>
</svelte:head>

<div class="flex">
	<Sidebar />
	<main class="ml-72 flex w-full flex-col items-center px-6 py-8">
		<WelcomeSection />
		<QueryInput />
	</main>
</div>
