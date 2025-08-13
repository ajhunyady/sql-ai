<script lang="ts">
	import { Button, Badge } from 'flowbite-svelte';
	import { PlusOutline, TrashBinOutline, CheckCircleSolid } from 'flowbite-svelte-icons';
	import type { Agent } from '$lib/models/agent';
	import type { Datastore, DatastoreType } from '$lib/models/datastore';
	import {
		datastores,
		validateDatastore,
		createDatastore,
		updateDatastore,
		deleteDatastore
	} from '$lib/stores/datastores';

	let { agent = $bindable<Agent>() } = $props();

	let showAddForm = $state(false);
	let editingDatastoreId = $state<string | null>(null);
	let newConnection = $state({
		name: '',
		type: 'postgres' as DatastoreType,
		connectionString: ''
	});
	let validationStatus = $state<Record<string, { validating: boolean; valid: boolean }>>({});

	function toggleDatastore(datastoreId: string) {
		if (agent.datastoreIds.includes(datastoreId)) {
			agent.datastoreIds = agent.datastoreIds.filter((id: string) => id !== datastoreId);
		} else {
			agent.datastoreIds = [...agent.datastoreIds, datastoreId];
		}
	}

	function removeDatastore(datastoreId: string) {
		agent.datastoreIds = agent.datastoreIds.filter((id: string) => id !== datastoreId);
	}

	function startEditing(datastoreId: string) {
		const datastore = $datastores.find((ds: Datastore) => ds.id === datastoreId);
		if (datastore) {
			newConnection = {
				name: datastore.name,
				type: datastore.type,
				connectionString: datastore.connectionString
			};
			editingDatastoreId = datastoreId;
			showAddForm = true;
		}
	}

	function saveDatastore() {
		if (editingDatastoreId) {
			// Update existing datastore
			updateDatastore(editingDatastoreId, {
				name: newConnection.name,
				type: newConnection.type,
				connectionString: newConnection.connectionString
			});
		} else {
			// Create new datastore
			createDatastore({
				name: newConnection.name,
				type: newConnection.type,
				connectionString: newConnection.connectionString
			});
		}

		// Reset form
		resetForm();
	}

	function deleteDatastoreById(datastoreId: string) {
		deleteDatastore(datastoreId);
	}

	function resetForm() {
		showAddForm = false;
		editingDatastoreId = null;
		newConnection = {
			name: '',
			type: 'postgres',
			connectionString: ''
		};
	}

	async function validateConnection(datastore: Datastore) {
		validationStatus[datastore.id] = { validating: true, valid: false };

		try {
			const isValid = await validateDatastore(datastore);
			validationStatus[datastore.id] = { validating: false, valid: isValid.valid };
		} catch (error) {
			validationStatus[datastore.id] = { validating: false, valid: false };
		}
	}

	function isConnected(datastoreId: string): boolean {
		return agent.datastoreIds.includes(datastoreId);
	}
</script>

<div>
	<h2 class="mb-6 text-xl font-bold text-white">Data & Integrations</h2>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-medium text-slate-300">Available Datastores</h3>
				<Button
					color="blue"
					size="sm"
					onclick={() => {
						resetForm();
						showAddForm = true;
					}}
				>
					<PlusOutline class="mr-1 h-4 w-4" />
					Add New
				</Button>
			</div>

			{#if showAddForm}
				<div class="mb-6 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
					<h4 class="text-md mb-3 font-medium text-slate-300">
						{editingDatastoreId ? 'Edit Datastore' : 'Add New Datastore'}
					</h4>
					<div class="space-y-4">
						<div>
							<label for="datastore-name" class="mb-1 block text-sm text-slate-400">Name</label>
							<input
								id="datastore-name"
								bind:value={newConnection.name}
								type="text"
								placeholder="My Database"
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							/>
						</div>
						<div>
							<label for="datastore-type" class="mb-1 block text-sm text-slate-400">Type</label>
							<select
								id="datastore-type"
								bind:value={newConnection.type}
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							>
								<option value="postgres">PostgreSQL</option>
								<option value="surrealdb">SurrealDB</option>
								<option value="custom">Custom</option>
							</select>
						</div>
						<div>
							<label for="connection-string" class="mb-1 block text-sm text-slate-400"
								>Connection String</label
							>
							<input
								id="connection-string"
								bind:value={newConnection.connectionString}
								type="text"
								placeholder="postgresql://user:pass@host:port/db"
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							/>
						</div>
						<div class="flex space-x-2">
							<Button color="blue" size="sm" onclick={saveDatastore}>
								{editingDatastoreId ? 'Update' : 'Add'} Connection
							</Button>
							<Button color="gray" size="sm" onclick={resetForm}>Cancel</Button>
						</div>
					</div>
				</div>
			{/if}

			<div class="space-y-3">
				{#each $datastores as datastore}
					<div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
						<div class="flex items-start justify-between">
							<div>
								<div class="flex items-center">
									<h4 class="font-medium text-slate-200">{datastore.name}</h4>
									{#if isConnected(datastore.id)}
										<Badge color="green" class="ml-2 text-xs">Connected</Badge>
									{/if}
								</div>
								<p class="mt-1 text-sm text-slate-500">
									{datastore.type} • {datastore.connectionString}
								</p>
							</div>
							<div class="flex space-x-2">
								<Button color="gray" size="sm" onclick={() => startEditing(datastore.id)}>
									Edit
								</Button>
								<Button
									color={isConnected(datastore.id) ? 'red' : 'blue'}
									size="sm"
									onclick={() => toggleDatastore(datastore.id)}
								>
									{isConnected(datastore.id) ? 'Disconnect' : 'Connect'}
								</Button>
								<Button
									color="gray"
									size="sm"
									onclick={() => validateConnection(datastore)}
									disabled={validationStatus[datastore.id]?.validating}
								>
									{#if validationStatus[datastore.id]?.validating}
										Validating...
									{:else if validationStatus[datastore.id]?.valid}
										<CheckCircleSolid class="h-4 w-4 text-green-500" />
									{:else}
										Validate
									{/if}
								</Button>
								<Button color="gray" size="sm" onclick={() => deleteDatastoreById(datastore.id)}>
									<TrashBinOutline class="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="mb-4 text-lg font-medium text-slate-300">Connected Datastores</h3>

			{#if agent.datastoreIds.length === 0}
				<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-8 text-center">
					<p class="text-slate-500">No datastores connected yet</p>
					<p class="mt-2 text-sm text-slate-600">
						Connect to at least one datastore to enable this agent
					</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each $datastores.filter( (ds: Datastore) => agent.datastoreIds.includes(ds.id) ) as datastore}
						<div
							class="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
						>
							<div>
								<h4 class="font-medium text-slate-200">{datastore.name}</h4>
								<p class="text-sm text-slate-500">{datastore.type}</p>
							</div>
							<Button color="gray" size="sm" onclick={() => removeDatastore(datastore.id)}>
								<TrashBinOutline class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-8">
				<h3 class="mb-4 text-lg font-medium text-slate-300">Tools & Custom Integrations</h3>
				<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-6 text-center">
					<p class="mb-3 text-slate-500">Add custom tools and integrations</p>
					<Button color="blue" size="sm">
						<PlusOutline class="mr-1 h-4 w-4" />
						Add Custom Tool
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
