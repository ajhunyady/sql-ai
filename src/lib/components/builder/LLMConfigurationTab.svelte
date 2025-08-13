<script lang="ts">
	import { Button, Select } from 'flowbite-svelte';
	import { PlusOutline, CheckCircleSolid, TrashBinOutline } from 'flowbite-svelte-icons';
	import type { Agent } from '$lib/models/agent';
	import type { LLMProvider, LLMProviderType } from '$lib/models/llm-provider';
	import {
		llmProviders,
		validateLLMProvider,
		createLLMProvider,
		updateLLMProvider,
		deleteLLMProvider
	} from '$lib/stores/llm-providers';

	let { agent = $bindable<Agent>() } = $props();
	let showAddForm = $state(false);
	let editingProviderId = $state<string | null>(null);
	let newProvider = $state({
		name: '',
		type: 'openai' as LLMProviderType,
		apiKey: '',
		baseUrl: '',
		modelName: ''
	});
	let validationStatus = $state<Record<string, { validating: boolean; valid: boolean }>>({});

	function selectProvider(providerId: string) {
		agent.llmProviderId = providerId;
	}

	function removeProvider(providerId: string) {
		if (agent.llmProviderId === providerId) {
			agent.llmProviderId = undefined;
		}
	}

	function startEditing(providerId: string) {
		const provider = $llmProviders.find((p: LLMProvider) => p.id === providerId);
		if (provider) {
			newProvider = {
				name: provider.name,
				type: provider.type,
				apiKey: provider.apiKey || '',
				baseUrl: provider.baseUrl || '',
				modelName: provider.modelName
			};
			editingProviderId = providerId;
			showAddForm = true;
		}
	}

	function saveProvider() {
		if (editingProviderId) {
			// Update existing provider
			updateLLMProvider(editingProviderId, {
				name: newProvider.name,
				type: newProvider.type,
				apiKey: newProvider.apiKey,
				baseUrl: newProvider.baseUrl,
				modelName: newProvider.modelName
			});
		} else {
			// Create new provider
			createLLMProvider({
				name: newProvider.name,
				type: newProvider.type,
				apiKey: newProvider.apiKey,
				baseUrl: newProvider.baseUrl,
				modelName: newProvider.modelName
			});
		}

		// Reset form
		resetForm();
	}

	function deleteProviderById(providerId: string) {
		deleteLLMProvider(providerId);
	}

	function resetForm() {
		showAddForm = false;
		editingProviderId = null;
		newProvider = {
			name: '',
			type: 'openai' as LLMProviderType,
			apiKey: '',
			baseUrl: '',
			modelName: ''
		};
	}

	async function validateProvider(provider: LLMProvider) {
		validationStatus[provider.id] = { validating: true, valid: false };

		try {
			const isValid = await validateLLMProvider(provider);
			validationStatus[provider.id] = { validating: false, valid: isValid.valid };
		} catch (error) {
			validationStatus[provider.id] = { validating: false, valid: false };
		}
	}

	function getProviderById(id: string): LLMProvider | undefined {
		return $llmProviders.find((provider: LLMProvider) => provider.id === id);
	}
</script>

<div>
	<h2 class="mb-6 text-xl font-bold text-white">LLM Configuration</h2>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-medium text-slate-300">Available LLM Providers</h3>
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
						{editingProviderId ? 'Edit Provider' : 'Add New Provider'}
					</h4>
					<div class="space-y-4">
						<div>
							<label for="provider-name" class="mb-1 block text-sm text-slate-400">Name</label>
							<input
								id="provider-name"
								bind:value={newProvider.name}
								type="text"
								placeholder="My LLM Provider"
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							/>
						</div>
						<div>
							<label for="provider-type" class="mb-1 block text-sm text-slate-400">Type</label>
							<select
								id="provider-type"
								bind:value={newProvider.type}
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							>
								<option value="openai">OpenAI</option>
								<option value="anthropic">Anthropic</option>
								<option value="xai">xAI</option>
								<option value="ollama">Ollama</option>
								<option value="custom">Custom</option>
							</select>
						</div>
						<div>
							<label for="model-name" class="mb-1 block text-sm text-slate-400">Model Name</label>
							<input
								id="model-name"
								bind:value={newProvider.modelName}
								type="text"
								placeholder="gpt-4-turbo"
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							/>
						</div>
						<div>
							<label for="api-key" class="mb-1 block text-sm text-slate-400">
								{newProvider.type === 'ollama' ? 'Base URL' : 'API Key'}
							</label>
							{#if newProvider.type === 'ollama'}
								<input
									id="api-key"
									bind:value={newProvider.baseUrl}
									type="text"
									placeholder="http://localhost:11434"
									class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
								/>
							{:else}
								<input
									id="api-key"
									bind:value={newProvider.apiKey}
									type="text"
									placeholder="sk-..."
									class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
								/>
							{/if}
						</div>
						<div class="flex space-x-2">
							<Button color="blue" size="sm" onclick={saveProvider}>
								{editingProviderId ? 'Update' : 'Add'} Provider
							</Button>
							<Button color="gray" size="sm" onclick={resetForm}>Cancel</Button>
						</div>
					</div>
				</div>
			{/if}

			<div class="space-y-3">
				{#each $llmProviders as provider}
					<div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
						<div class="flex items-start justify-between">
							<div>
								<div class="flex items-center">
									<h4 class="font-medium text-slate-200">{provider.name}</h4>
									{#if agent.llmProviderId === provider.id}
										<span class="ml-2 inline-flex items-center text-xs text-green-500">
											<CheckCircleSolid class="mr-1 h-4 w-4" />
											Selected
										</span>
									{/if}
								</div>
								<p class="mt-1 text-sm text-slate-500">
									{provider.type} • {provider.modelName}
								</p>
							</div>
							<div class="flex space-x-2">
								<Button color="gray" size="sm" onclick={() => startEditing(provider.id)}>
									Edit
								</Button>
								<Button
									color={agent.llmProviderId === provider.id ? 'red' : 'blue'}
									size="sm"
									onclick={() => selectProvider(provider.id)}
								>
									{agent.llmProviderId === provider.id ? 'Deselect' : 'Select'}
								</Button>
								<Button
									color="gray"
									size="sm"
									onclick={() => validateProvider(provider)}
									disabled={validationStatus[provider.id]?.validating}
								>
									{#if validationStatus[provider.id]?.validating}
										Validating...
									{:else if validationStatus[provider.id]?.valid}
										<CheckCircleSolid class="h-4 w-4 text-green-500" />
									{:else}
										Validate
									{/if}
								</Button>
								<Button color="gray" size="sm" onclick={() => deleteProviderById(provider.id)}>
									<TrashBinOutline class="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="mb-4 text-lg font-medium text-slate-300">Selected Provider</h3>

			{#if !agent.llmProviderId}
				<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-8 text-center">
					<p class="text-slate-500">No provider selected</p>
					<p class="mt-2 text-sm text-slate-600">Select an LLM provider to enable this agent</p>
				</div>
			{:else if getProviderById(agent.llmProviderId)}
				{@const selectedProvider = getProviderById(agent.llmProviderId)}
				{#if selectedProvider}
					<div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
						<div class="mb-4 flex items-start justify-between">
							<h4 class="text-lg font-medium text-slate-200">{selectedProvider.name}</h4>
							<Button color="gray" size="sm" onclick={() => (agent.llmProviderId = undefined)}>
								Remove
							</Button>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-slate-500">Type</p>
								<p class="text-slate-300">{selectedProvider.type}</p>
							</div>
							<div>
								<p class="text-sm text-slate-500">Model</p>
								<p class="text-slate-300">{selectedProvider.modelName}</p>
							</div>
							<div>
								<p class="text-sm text-slate-500">Status</p>
								<p class="text-slate-300">
									<span class="inline-flex items-center">
										<span class="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
										Active
									</span>
								</p>
							</div>
							<div>
								<p class="text-sm text-slate-500">Last Updated</p>
								<p class="text-slate-300">
									{new Date(selectedProvider.updatedAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>
				{/if}
			{/if}

			<div class="mt-8">
				<h3 class="mb-4 text-lg font-medium text-slate-300">Model Settings</h3>
				<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-6">
					<div class="space-y-4">
						<div>
							<label for="temperature" class="mb-1 block text-sm text-slate-400">Temperature</label>
							<input
								id="temperature"
								type="range"
								min="0"
								max="1"
								step="0.1"
								value="0.7"
								class="w-full"
							/>
							<div class="flex justify-between text-xs text-slate-500">
								<span>Precise</span>
								<span>Balanced</span>
								<span>Creative</span>
							</div>
						</div>
						<div>
							<label for="max-tokens" class="mb-1 block text-sm text-slate-400">Max Tokens</label>
							<input
								id="max-tokens"
								type="number"
								value="2048"
								class="w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
