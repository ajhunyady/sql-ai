<script lang="ts">
	import { Button, Badge, Spinner } from 'flowbite-svelte';
	import {
		PlusOutline,
		SearchSolid,
		EditOutline,
		TrashBinOutline,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import {
		llmProviders,
		llmProvidersLoading,
		llmProvidersError,
		loadLLMProviders,
		deleteLLMProvider
	} from '$lib/stores/llm-providers';
	import { onMount } from 'svelte';

	let searchTerm = $state('');

	// Reactive filtered providers
	let filteredProviders = $derived(
		$llmProviders.filter(
			(provider) =>
				provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				provider.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
				provider.modelName.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	onMount(() => {
		// Load providers if not already loaded
		if ($llmProviders.length === 0 && !$llmProvidersLoading) {
			loadLLMProviders();
		}
	});

	function navigateToNewProvider() {
		goto('/builder/llm-providers/new');
	}

	function navigateToProvider(id: string) {
		goto(`/builder/llm-providers/${id}`);
	}

	async function handleEdit(event: Event, id: string) {
		event.stopPropagation();
		goto(`/builder/llm-providers/${id}`);
	}

	async function handleDelete(event: Event, id: string) {
		event.stopPropagation();
		if (confirm('Are you sure you want to delete this LLM provider?')) {
			await deleteLLMProvider(id);
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleKeyPress(event: KeyboardEvent, providerId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			navigateToProvider(providerId);
		}
	}

	function getProviderTypeColor(type: string): 'green' | 'purple' | 'blue' | 'orange' | 'gray' {
		switch (type) {
			case 'openai':
				return 'green';
			case 'anthropic':
				return 'purple';
			case 'xai':
				return 'blue';
			case 'ollama':
				return 'orange';
			default:
				return 'gray';
		}
	}

	function maskApiKey(apiKey?: string): string {
		if (!apiKey) return 'Not set';
		return apiKey.substring(0, 8) + '************';
	}

	function retryLoad() {
		loadLLMProviders();
	}
</script>

<div class="mx-auto w-full max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-200">LLM Providers</h1>
			<p class="mt-2 text-slate-400">Configure and manage your language model providers</p>
		</div>
		<Button color="blue" onclick={navigateToNewProvider}>
			<PlusOutline class="mr-2 h-4 w-4" />
			New Provider
		</Button>
	</div>

	<!-- Error state -->
	{#if $llmProvidersError}
		<div class="mb-6 rounded-lg border border-red-700/50 bg-red-900/20 p-4">
			<div class="flex items-center">
				<ExclamationCircleSolid class="mr-3 h-5 w-5 text-red-400" />
				<div class="flex-1">
					<h3 class="font-medium text-red-200">Error loading LLM providers</h3>
					<p class="text-sm text-red-300">{$llmProvidersError}</p>
				</div>
				<Button color="red" size="sm" onclick={retryLoad}>Retry</Button>
			</div>
		</div>
	{/if}

	<!-- Search bar -->
	<div class="mb-6">
		<div class="relative">
			<input
				bind:value={searchTerm}
				type="text"
				placeholder="Search providers..."
				class="w-full rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3 pl-10 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
				disabled={$llmProvidersLoading}
			/>
			<SearchSolid class="absolute top-3.5 left-3 h-4 w-4 text-slate-500" />
		</div>
	</div>

	<!-- Loading state -->
	{#if $llmProvidersLoading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<Spinner size="8" class="mb-4" />
				<p class="text-slate-400">Loading LLM providers...</p>
			</div>
		</div>
	{:else if $llmProviders.length === 0}
		<!-- Empty state -->
		<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-12 text-center">
			<div class="mx-auto max-w-md">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50 p-4"
				>
					<svg class="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						></path>
					</svg>
				</div>
				<h2 class="mb-2 text-xl font-bold text-white">No LLM Providers Configured</h2>
				<p class="mb-6 text-slate-500">
					Get started by adding your first language model provider to power your AI agents.
				</p>
				<Button color="blue" onclick={navigateToNewProvider}>
					<PlusOutline class="mr-2 h-4 w-4" />
					Add Your First Provider
				</Button>
			</div>
		</div>
	{:else if filteredProviders.length === 0}
		<!-- No search results -->
		<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-12 text-center">
			<div class="mx-auto max-w-md">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50 p-4"
				>
					<SearchSolid class="h-8 w-8 text-slate-500" />
				</div>
				<h2 class="mb-2 text-xl font-bold text-white">No Providers Found</h2>
				<p class="mb-6 text-slate-500">
					No providers match your search criteria. Try adjusting your search terms.
				</p>
				<Button color="blue" onclick={() => (searchTerm = '')}>Clear Search</Button>
			</div>
		</div>
	{:else}
		<!-- Providers grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredProviders as provider (provider.id)}
				<div
					role="button"
					tabindex="0"
					class="cursor-pointer rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-800/70"
					onclick={() => navigateToProvider(provider.id)}
					onkeydown={(e) => handleKeyPress(e, provider.id)}
					aria-label={`Navigate to provider ${provider.name}`}
				>
					<div class="mb-4 flex items-start justify-between">
						<h3 class="text-lg font-bold text-white">{provider.name}</h3>
						<Badge color={provider.isActive ? 'green' : 'red'} class="text-xs">
							{provider.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>

					<div class="mb-4">
						<div class="mb-2 flex gap-2">
							<Badge color={getProviderTypeColor(provider.type)} class="text-xs capitalize">
								{provider.type}
							</Badge>
							<Badge color="gray" class="text-xs">
								{provider.modelName}
							</Badge>
						</div>
						<p class="font-mono text-sm text-slate-400">
							API Key: {maskApiKey(provider.apiKey)}
						</p>
						{#if provider.baseUrl}
							<p class="mt-1 font-mono text-sm text-slate-400">
								Base URL: {provider.baseUrl}
							</p>
						{/if}
					</div>

					<div class="flex items-end justify-between">
						<div class="text-xs text-slate-500">
							<div>Updated {formatDate(provider.updatedAt)}</div>
							<div>Created {formatDate(provider.createdAt)}</div>
						</div>

						<div class="flex gap-2">
							<Button
								size="sm"
								color="blue"
								class="p-2"
								onclick={(e: Event) => handleEdit(e, provider.id)}
								aria-label={`Edit ${provider.name}`}
							>
								<EditOutline class="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								color="red"
								class="p-2"
								onclick={(e: Event) => handleDelete(e, provider.id)}
								aria-label={`Delete ${provider.name}`}
							>
								<TrashBinOutline class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
