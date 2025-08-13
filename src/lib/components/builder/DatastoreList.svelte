<script lang="ts">
	import { Button, Badge } from 'flowbite-svelte';
	import { PlusOutline, SearchSolid, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { getDatastores, deleteDatastore } from '$lib/stores/datastores';

	let datastores = $derived(getDatastores());
	let searchTerm = $state('');

	function navigateToNewDatastore() {
		goto('/builder/datastores/new');
	}

	function navigateToDatastore(id: string) {
		goto(`/builder/datastores/${id}`);
	}

	function handleEdit(event: Event, id: string) {
		event.stopPropagation();
		goto(`/builder/datastores/${id}`);
	}

	function handleDelete(event: Event, id: string) {
		event.stopPropagation();
		if (confirm('Are you sure you want to delete this datastore?')) {
			deleteDatastore(id);
		}
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleKeyPress(event: KeyboardEvent, datastoreId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			navigateToDatastore(datastoreId);
		}
	}

	function getDatastoreTypeColor(type: string): 'blue' | 'purple' | 'gray' {
		switch (type) {
			case 'postgres':
				return 'blue';
			case 'surrealdb':
				return 'purple';
			case 'custom':
				return 'gray';
			default:
				return 'gray';
		}
	}

	function maskConnectionString(connectionString: string): string {
		try {
			const url = new URL(connectionString);
			return `${url.protocol}//${url.hostname}:${url.port || '****'}/****`;
		} catch {
			return '****@****:****/****';
		}
	}
</script>

<div class="mx-auto w-full max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-slate-200">Datastores</h1>
			<p class="mt-2 text-slate-400">Configure and manage your database connections</p>
		</div>
		<Button color="blue" onclick={navigateToNewDatastore}>
			<PlusOutline class="mr-2 h-4 w-4" />
			New Datastore
		</Button>
	</div>

	<div class="mb-6">
		<div class="relative">
			<input
				bind:value={searchTerm}
				type="text"
				placeholder="Search datastores..."
				class="w-full rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3 pl-10 text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
			/>
			<SearchSolid class="absolute top-3.5 left-3 h-4 w-4 text-slate-500" />
		</div>
	</div>

	{#if datastores.length === 0}
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
							d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"
						></path>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11h6m-6 4h6"
						></path>
					</svg>
				</div>
				<h2 class="mb-2 text-xl font-bold text-white">No Datastores Configured</h2>
				<p class="mb-6 text-slate-500">
					Get started by adding your first database connection to enable data access for your
					agents.
				</p>
				<Button color="blue" onclick={navigateToNewDatastore}>
					<PlusOutline class="mr-2 h-4 w-4" />
					Add Your First Datastore
				</Button>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each datastores.filter((datastore) => datastore.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) || datastore.type
						.toLowerCase()
						.includes(searchTerm.toLowerCase())) as datastore (datastore.id)}
				<div
					role="button"
					tabindex="0"
					class="cursor-pointer rounded-lg border border-slate-700/50 bg-slate-800/50 p-6 transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-800/70"
					onclick={() => navigateToDatastore(datastore.id)}
					onkeydown={(e) => handleKeyPress(e, datastore.id)}
					aria-label={`Navigate to datastore ${datastore.name}`}
				>
					<div class="mb-4 flex items-start justify-between">
						<h3 class="text-lg font-bold text-white">{datastore.name}</h3>
						<Badge color={datastore.isActive ? 'green' : 'red'} class="text-xs">
							{datastore.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>

					<div class="mb-4">
						<Badge color={getDatastoreTypeColor(datastore.type)} class="mb-2 text-xs capitalize">
							{datastore.type}
						</Badge>
						<p class="font-mono text-sm text-slate-400">
							{maskConnectionString(datastore.connectionString)}
						</p>
					</div>

					<div class="flex items-end justify-between">
						<div class="text-xs text-slate-500">
							<div>Updated {formatDate(datastore.updatedAt)}</div>
							<div>Created {formatDate(datastore.createdAt)}</div>
						</div>

						<div class="flex gap-2">
							<Button
								size="sm"
								color="blue"
								class="p-2"
								onclick={(e: Event) => handleEdit(e, datastore.id)}
								aria-label={`Edit ${datastore.name}`}
							>
								<EditOutline class="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								color="red"
								class="p-2"
								onclick={(e: Event) => handleDelete(e, datastore.id)}
								aria-label={`Delete ${datastore.name}`}
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
