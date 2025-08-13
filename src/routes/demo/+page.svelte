<script lang="ts">
	import { Button, Card, Badge, Input, Textarea, Alert } from 'flowbite-svelte';
	import { PlusOutline, TrashBinOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import { ServiceWorkerStatus } from '$lib/components/common';
	import {
		agents,
		agentsLoading,
		agentsError,
		createAgent,
		deleteAgent,
		loadAgents
	} from '$lib/stores/agents';
	import {
		llmProviders,
		llmProvidersLoading,
		llmProvidersError,
		createLLMProvider,
		deleteLLMProvider,
		loadLLMProviders
	} from '$lib/stores/llm-providers';
	import {
		datastores,
		datastoresLoading,
		datastoresError,
		createDatastore,
		deleteDatastore,
		loadDatastores
	} from '$lib/stores/datastores';
	import type { AgentFormData } from '$lib/models/agent';
	import type { LLMProviderFormData } from '$lib/models/llm-provider';
	import type { DatastoreFormData } from '$lib/models/datastore';

	// Form states
	let showAgentForm = $state(false);
	let showProviderForm = $state(false);
	let showDatastoreForm = $state(false);

	// Form data
	let agentForm: AgentFormData = $state({
		name: '',
		description: '',
		datastoreIds: [],
		guidance: {
			generalInstructions: '',
			tableSemantics: {},
			customPrompts: []
		}
	});

	let providerForm: LLMProviderFormData = $state({
		name: '',
		type: 'openai',
		modelName: '',
		apiKey: ''
	});

	let datastoreForm: DatastoreFormData = $state({
		name: '',
		type: 'postgres',
		connectionString: ''
	});

	// Reset forms
	function resetAgentForm() {
		agentForm = {
			name: '',
			description: '',
			datastoreIds: [],
			guidance: {
				generalInstructions: '',
				tableSemantics: {},
				customPrompts: []
			}
		};
		showAgentForm = false;
	}

	function resetProviderForm() {
		providerForm = {
			name: '',
			type: 'openai',
			modelName: '',
			apiKey: ''
		};
		showProviderForm = false;
	}

	function resetDatastoreForm() {
		datastoreForm = {
			name: '',
			type: 'postgres',
			connectionString: ''
		};
		showDatastoreForm = false;
	}

	// Handle form submissions
	async function handleCreateAgent() {
		if (!agentForm.name || !agentForm.description) return;

		const result = await createAgent(agentForm);
		if (result) {
			resetAgentForm();
		}
	}

	async function handleCreateProvider() {
		if (!providerForm.name || !providerForm.modelName) return;

		const result = await createLLMProvider(providerForm);
		if (result) {
			resetProviderForm();
		}
	}

	async function handleCreateDatastore() {
		if (!datastoreForm.name || !datastoreForm.connectionString) return;

		const result = await createDatastore(datastoreForm);
		if (result) {
			resetDatastoreForm();
		}
	}

	// Handle deletions
	async function handleDeleteAgent(id: string) {
		if (confirm('Are you sure you want to delete this agent?')) {
			await deleteAgent(id);
		}
	}

	async function handleDeleteProvider(id: string) {
		if (confirm('Are you sure you want to delete this LLM provider?')) {
			await deleteLLMProvider(id);
		}
	}

	async function handleDeleteDatastore(id: string) {
		if (confirm('Are you sure you want to delete this datastore?')) {
			await deleteDatastore(id);
		}
	}

	// Refresh all data
	async function refreshAllData() {
		await Promise.all([loadAgents(), loadLLMProviders(), loadDatastores()]);
	}
</script>

<svelte:head>
	<title>Service Worker Demo - CoAgent SQL</title>
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold text-white">Service Worker Backend Demo</h1>
		<p class="text-lg text-slate-400">
			This page demonstrates the service worker acting as a backend proxy with in-memory data
			storage. All CRUD operations are handled by the service worker without any external API calls.
		</p>
	</div>

	<!-- Service Worker Status -->
	<ServiceWorkerStatus />

	<!-- Refresh All Data Button -->
	<div class="mb-6 flex justify-center">
		<Button color="blue" onclick={refreshAllData}>
			<RefreshOutline class="mr-2 h-4 w-4" />
			Refresh All Data
		</Button>
	</div>

	<!-- Error Alerts -->
	{#if $agentsError}
		<Alert color="red" class="mb-4">
			<strong>Agents Error:</strong>
			{$agentsError}
		</Alert>
	{/if}
	{#if $llmProvidersError}
		<Alert color="red" class="mb-4">
			<strong>LLM Providers Error:</strong>
			{$llmProvidersError}
		</Alert>
	{/if}
	{#if $datastoresError}
		<Alert color="red" class="mb-4">
			<strong>Datastores Error:</strong>
			{$datastoresError}
		</Alert>
	{/if}

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Agents Section -->
		<Card>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-white">Agents ({$agents.length})</h2>
				<Button size="sm" color="blue" onclick={() => (showAgentForm = !showAgentForm)}>
					<PlusOutline class="mr-1 h-3 w-3" />
					Add
				</Button>
			</div>

			{#if showAgentForm}
				<div class="mb-4 space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
					<Input
						bind:value={agentForm.name}
						placeholder="Agent name"
						class="bg-slate-700 text-white"
					/>
					<Textarea
						bind:value={agentForm.description}
						placeholder="Agent description"
						class="bg-slate-700 text-white"
						rows={2}
					/>
					<Input
						bind:value={agentForm.guidance.generalInstructions}
						placeholder="General instructions"
						class="bg-slate-700 text-white"
					/>
					<div class="flex gap-2">
						<Button size="sm" color="green" onclick={handleCreateAgent}>Create</Button>
						<Button size="sm" color="gray" onclick={resetAgentForm}>Cancel</Button>
					</div>
				</div>
			{/if}

			<div class="space-y-2">
				{#if $agentsLoading}
					<div class="text-center text-slate-400">Loading agents...</div>
				{:else if $agents.length === 0}
					<div class="text-center text-slate-500">No agents created yet</div>
				{:else}
					{#each $agents as agent (agent.id)}
						<div class="flex items-center justify-between rounded bg-slate-800/50 p-3">
							<div class="flex-1">
								<div class="font-medium text-white">{agent.name}</div>
								<div class="text-sm text-slate-400">{agent.description}</div>
								<Badge color={agent.isActive ? 'green' : 'gray'} class="mt-1 text-xs">
									{agent.isActive ? 'Active' : 'Inactive'}
								</Badge>
							</div>
							<Button
								size="sm"
								color="red"
								class="ml-2 p-1"
								onclick={() => handleDeleteAgent(agent.id)}
							>
								<TrashBinOutline class="h-3 w-3" />
							</Button>
						</div>
					{/each}
				{/if}
			</div>
		</Card>

		<!-- LLM Providers Section -->
		<Card>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-white">LLM Providers ({$llmProviders.length})</h2>
				<Button size="sm" color="purple" onclick={() => (showProviderForm = !showProviderForm)}>
					<PlusOutline class="mr-1 h-3 w-3" />
					Add
				</Button>
			</div>

			{#if showProviderForm}
				<div class="mb-4 space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
					<Input
						bind:value={providerForm.name}
						placeholder="Provider name"
						class="bg-slate-700 text-white"
					/>
					<select
						bind:value={providerForm.type}
						class="rounded border border-slate-600 bg-slate-700 p-2 text-white"
					>
						<option value="openai">OpenAI</option>
						<option value="anthropic">Anthropic</option>
						<option value="xai">xAI</option>
						<option value="ollama">Ollama</option>
						<option value="custom">Custom</option>
					</select>
					<Input
						bind:value={providerForm.modelName}
						placeholder="Model name"
						class="bg-slate-700 text-white"
					/>
					<Input
						bind:value={providerForm.apiKey}
						placeholder="API Key (optional)"
						type="password"
						class="bg-slate-700 text-white"
					/>
					<div class="flex gap-2">
						<Button size="sm" color="green" onclick={handleCreateProvider}>Create</Button>
						<Button size="sm" color="gray" onclick={resetProviderForm}>Cancel</Button>
					</div>
				</div>
			{/if}

			<div class="space-y-2">
				{#if $llmProvidersLoading}
					<div class="text-center text-slate-400">Loading providers...</div>
				{:else if $llmProviders.length === 0}
					<div class="text-center text-slate-500">No providers created yet</div>
				{:else}
					{#each $llmProviders as provider (provider.id)}
						<div class="flex items-center justify-between rounded bg-slate-800/50 p-3">
							<div class="flex-1">
								<div class="font-medium text-white">{provider.name}</div>
								<div class="text-sm text-slate-400">
									{provider.type} • {provider.modelName}
								</div>
								<Badge color={provider.isActive ? 'green' : 'gray'} class="mt-1 text-xs">
									{provider.isActive ? 'Active' : 'Inactive'}
								</Badge>
							</div>
							<Button
								size="sm"
								color="red"
								class="ml-2 p-1"
								onclick={() => handleDeleteProvider(provider.id)}
							>
								<TrashBinOutline class="h-3 w-3" />
							</Button>
						</div>
					{/each}
				{/if}
			</div>
		</Card>

		<!-- Datastores Section -->
		<Card>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold text-white">Datastores ({$datastores.length})</h2>
				<Button size="sm" color="green" onclick={() => (showDatastoreForm = !showDatastoreForm)}>
					<PlusOutline class="mr-1 h-3 w-3" />
					Add
				</Button>
			</div>

			{#if showDatastoreForm}
				<div class="mb-4 space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
					<Input
						bind:value={datastoreForm.name}
						placeholder="Datastore name"
						class="bg-slate-700 text-white"
					/>
					<select
						bind:value={datastoreForm.type}
						class="rounded border border-slate-600 bg-slate-700 p-2 text-white"
					>
						<option value="postgres">PostgreSQL</option>
						<option value="surrealdb">SurrealDB</option>
						<option value="custom">Custom</option>
					</select>
					<Input
						bind:value={datastoreForm.connectionString}
						placeholder="Connection string"
						class="bg-slate-700 text-white"
					/>
					<div class="flex gap-2">
						<Button size="sm" color="green" onclick={handleCreateDatastore}>Create</Button>
						<Button size="sm" color="gray" onclick={resetDatastoreForm}>Cancel</Button>
					</div>
				</div>
			{/if}

			<div class="space-y-2">
				{#if $datastoresLoading}
					<div class="text-center text-slate-400">Loading datastores...</div>
				{:else if $datastores.length === 0}
					<div class="text-center text-slate-500">No datastores created yet</div>
				{:else}
					{#each $datastores as datastore (datastore.id)}
						<div class="flex items-center justify-between rounded bg-slate-800/50 p-3">
							<div class="flex-1">
								<div class="font-medium text-white">{datastore.name}</div>
								<div class="text-sm text-slate-400">{datastore.type}</div>
								<Badge color={datastore.isActive ? 'green' : 'gray'} class="mt-1 text-xs">
									{datastore.isActive ? 'Active' : 'Inactive'}
								</Badge>
							</div>
							<Button
								size="sm"
								color="red"
								class="ml-2 p-1"
								onclick={() => handleDeleteDatastore(datastore.id)}
							>
								<TrashBinOutline class="h-3 w-3" />
							</Button>
						</div>
					{/each}
				{/if}
			</div>
		</Card>
	</div>

	<!-- Instructions -->
	<Card class="mt-8">
		<h3 class="mb-4 text-lg font-semibold text-white">How it works</h3>
		<div class="space-y-3 text-slate-300">
			<p>
				<strong>1. Service Worker Registration:</strong> The service worker is automatically registered
				when the page loads and intercepts all API requests to `/api/*`.
			</p>
			<p>
				<strong>2. In-Memory Storage:</strong> All data (agents, LLM providers, datastores) is stored
				in memory within the service worker. This data persists as long as the service worker is active.
			</p>
			<p>
				<strong>3. CRUD Operations:</strong> Create, read, update, and delete operations are handled
				entirely by the service worker without any external API calls.
			</p>
			<p>
				<strong>4. Store Integration:</strong> Svelte stores automatically sync with the service worker
				data, providing reactive updates to the UI.
			</p>
			<p>
				<strong>5. Future Enhancement:</strong> The service worker can later be modified to proxy requests
				to a real REST API backend while maintaining the same interface.
			</p>
		</div>
	</Card>
</div>
