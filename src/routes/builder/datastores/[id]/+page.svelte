<script lang="ts">
	import { Button, Input, Select, Label, Card, Alert, Textarea } from 'flowbite-svelte';
	import { ArrowLeftOutline, CheckOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getDatastoreById, createDatastore, updateDatastore } from '$lib/stores/datastores';
	import type { Datastore, DatastoreFormData, DatastoreType } from '$lib/models/datastore';
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';

	let datastoreId = $state(page.params.id);
	let isNew = $state(datastoreId === 'new');
	let datastore = $state<Datastore | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	// Form data
	let formData = $state<DatastoreFormData>({
		name: '',
		type: 'postgres',
		connectionString: ''
	});

	const datastoreTypes: { value: DatastoreType; name: string }[] = [
		{ value: 'postgres', name: 'PostgreSQL' },
		{ value: 'surrealdb', name: 'SurrealDB' },
		{ value: 'custom', name: 'Custom' }
	];

	const connectionExamples = {
		postgres: 'postgresql://username:password@hostname:5432/database_name',
		surrealdb: 'surreal://username:password@hostname:8000/namespace/database',
		custom: 'your-custom-connection-string'
	};

	onMount(() => {
		if (!isNew) {
			datastore = getDatastoreById(datastoreId);
			if (datastore) {
				formData = {
					name: datastore.name,
					type: datastore.type,
					connectionString: datastore.connectionString
				};
			} else {
				error = 'Datastore not found';
			}
		}
	});

	function goBack() {
		goto('/builder/datastores');
	}

	function resetForm() {
		if (isNew) {
			formData = {
				name: '',
				type: 'postgres',
				connectionString: ''
			};
		} else if (datastore) {
			formData = {
				name: datastore.name,
				type: datastore.type,
				connectionString: datastore.connectionString
			};
		}
		error = null;
	}

	function validateForm(): string | null {
		if (!formData.name.trim()) {
			return 'Datastore name is required';
		}
		if (!formData.connectionString.trim()) {
			return 'Connection string is required';
		}

		// Basic validation for connection string format
		if (formData.type === 'postgres' && !formData.connectionString.startsWith('postgresql://')) {
			return 'PostgreSQL connection string should start with "postgresql://"';
		}
		if (formData.type === 'surrealdb' && !formData.connectionString.startsWith('surreal://')) {
			return 'SurrealDB connection string should start with "surreal://"';
		}

		return null;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const validationError = validateForm();
		if (validationError) {
			error = validationError;
			return;
		}

		loading = true;
		error = null;

		try {
			if (isNew) {
				createDatastore(formData);
			} else {
				updateDatastore(datastoreId, formData);
			}
			success = true;
			setTimeout(() => {
				goto('/builder/datastores');
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	function handleTestConnection() {
		// In a real app, this would test the actual connection
		alert('Connection test functionality would be implemented here');
	}

	function getConnectionExample(type: DatastoreType): string {
		return connectionExamples[type] || '';
	}
</script>

<svelte:head>
	<title>{isNew ? 'New' : 'Edit'} Datastore - Builder</title>
</svelte:head>

<BuilderSidebar />

<div class="ml-72 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<Button
				color="gray"
				class="mb-4 flex items-center"
				onclick={goBack}
				aria-label="Go back to datastores"
			>
				<ArrowLeftOutline class="mr-2 h-4 w-4" />
				Back to Datastores
			</Button>
			<h1 class="text-3xl font-bold text-slate-200">
				{isNew ? 'New Datastore' : `Edit ${datastore?.name || 'Datastore'}`}
			</h1>
			<p class="mt-2 text-slate-400">
				{isNew ? 'Configure a new database connection' : 'Update datastore configuration'}
			</p>
		</div>

		<!-- Success Message -->
		{#if success}
			<Alert color="green" class="mb-6">
				<CheckOutline slot="icon" class="h-4 w-4" />
				Datastore {isNew ? 'created' : 'updated'} successfully! Redirecting...
			</Alert>
		{/if}

		<!-- Error Message -->
		{#if error}
			<Alert color="red" class="mb-6">
				<ExclamationCircleSolid slot="icon" class="h-4 w-4" />
				{error}
			</Alert>
		{/if}

		<!-- Form -->
		<Card class="border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Datastore Name -->
				<div>
					<Label for="name" class="mb-2 text-slate-300">Datastore Name *</Label>
					<Input
						id="name"
						type="text"
						bind:value={formData.name}
						placeholder="Enter datastore name..."
						required
						class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<!-- Datastore Type -->
				<div>
					<Label for="type" class="mb-2 text-slate-300">Datastore Type *</Label>
					<Select
						id="type"
						bind:value={formData.type}
						items={datastoreTypes}
						class="border-slate-600 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<!-- Connection String -->
				<div>
					<Label for="connectionString" class="mb-2 text-slate-300">Connection String *</Label>
					<Textarea
						id="connectionString"
						bind:value={formData.connectionString}
						placeholder={getConnectionExample(formData.type)}
						required
						rows={3}
						class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
					/>
					<p class="mt-1 text-xs text-slate-500">
						Example: {getConnectionExample(formData.type)}
					</p>
				</div>

				<!-- Connection Test -->
				<div class="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-medium text-slate-300">Test Connection</h3>
							<p class="text-sm text-slate-500">Verify that the connection string is valid</p>
						</div>
						<Button
							type="button"
							color="gray"
							onclick={handleTestConnection}
							disabled={!formData.connectionString.trim() || loading}
						>
							Test Connection
						</Button>
					</div>
				</div>

				<!-- Form Actions -->
				<div class="flex items-center justify-between border-t border-slate-700 pt-6">
					<Button type="button" color="gray" onclick={resetForm} disabled={loading}>Reset</Button>
					<div class="flex gap-3">
						<Button type="button" color="gray" onclick={goBack} disabled={loading}>Cancel</Button>
						<Button type="submit" color="blue" disabled={loading} class="min-w-[120px]">
							{#if loading}
								<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
										fill="none"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								{isNew ? 'Creating...' : 'Updating...'}
							{:else}
								{isNew ? 'Create Datastore' : 'Update Datastore'}
							{/if}
						</Button>
					</div>
				</div>
			</form>
		</Card>
	</div>
</div>
