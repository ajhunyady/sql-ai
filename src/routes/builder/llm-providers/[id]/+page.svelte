<script lang="ts">
	import { Button, Input, Select, Label, Card, Alert } from 'flowbite-svelte';
	import { ArrowLeftOutline, CheckOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		getLLMProviderById,
		createLLMProvider,
		updateLLMProvider
	} from '$lib/stores/llm-providers';
	import type { LLMProvider, LLMProviderFormData, LLMProviderType } from '$lib/models/llm-provider';
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';

	let providerId = $state(page.params.id);
	let isNew = $state(providerId === 'new');
	let provider = $state<LLMProvider | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	// Form data
	let formData = $state<LLMProviderFormData>({
		name: '',
		type: 'openai',
		apiKey: '',
		baseUrl: '',
		modelName: ''
	});

	const providerTypes: { value: LLMProviderType; name: string }[] = [
		{ value: 'openai', name: 'OpenAI' },
		{ value: 'anthropic', name: 'Anthropic' },
		{ value: 'xai', name: 'xAI' },
		{ value: 'ollama', name: 'Ollama' },
		{ value: 'custom', name: 'Custom' }
	];

	const modelOptions = {
		openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'],
		anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-5-sonnet'],
		xai: ['grok-beta'],
		ollama: ['llama3', 'llama3:8b', 'llama3:70b', 'mistral', 'codellama'],
		custom: []
	};

	onMount(async () => {
		if (!isNew && providerId) {
			provider = await getLLMProviderById(providerId);
			if (provider) {
				formData = {
					name: provider.name,
					type: provider.type,
					modelName: provider.modelName,
					apiKey: provider.apiKey || '',
					baseUrl: provider.baseUrl || ''
				};
			} else {
				error = 'Provider not found';
			}
		}
	});

	function goBack() {
		goto('/builder/llm-providers');
	}

	function resetForm() {
		if (isNew) {
			formData = {
				name: '',
				type: 'openai',
				apiKey: '',
				baseUrl: '',
				modelName: ''
			};
		} else if (provider) {
			formData = {
				name: provider.name,
				type: provider.type,
				apiKey: provider.apiKey || '',
				baseUrl: provider.baseUrl || '',
				modelName: provider.modelName
			};
		}
		error = null;
	}

	function validateForm(): string | null {
		if (!formData.name.trim()) {
			return 'Provider name is required';
		}
		if (!formData.modelName.trim()) {
			return 'Model name is required';
		}
		if (formData.type !== 'ollama' && !formData.apiKey?.trim()) {
			return 'API key is required for this provider type';
		}
		if (formData.type === 'ollama' && !formData.baseUrl?.trim()) {
			return 'Base URL is required for Ollama';
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
				await createLLMProvider(formData);
			} else if (providerId) {
				await updateLLMProvider(providerId, formData);
			}
			success = true;
			setTimeout(() => {
				goto('/builder/llm-providers');
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	// Update model suggestions when provider type changes
	$effect(() => {
		if (formData.type === 'openai' && modelOptions.openai.length > 0) {
			if (!formData.modelName || !modelOptions.openai.includes(formData.modelName)) {
				formData.modelName = modelOptions.openai[0];
			}
		} else if (formData.type === 'anthropic' && modelOptions.anthropic.length > 0) {
			if (!formData.modelName || !modelOptions.anthropic.includes(formData.modelName)) {
				formData.modelName = modelOptions.anthropic[0];
			}
		} else if (formData.type === 'xai' && modelOptions.xai.length > 0) {
			if (!formData.modelName || !modelOptions.xai.includes(formData.modelName)) {
				formData.modelName = modelOptions.xai[0];
			}
		} else if (formData.type === 'ollama' && modelOptions.ollama.length > 0) {
			if (!formData.modelName || !modelOptions.ollama.includes(formData.modelName)) {
				formData.modelName = modelOptions.ollama[0];
			}
		}
	});

	function requiresApiKey(type: LLMProviderType): boolean {
		return type !== 'ollama';
	}

	function requiresBaseUrl(type: LLMProviderType): boolean {
		return type === 'ollama' || type === 'custom';
	}
</script>

<svelte:head>
	<title>{isNew ? 'New' : 'Edit'} LLM Provider - Builder</title>
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
				aria-label="Go back to LLM providers"
			>
				<ArrowLeftOutline class="mr-2 h-4 w-4" />
				Back to LLM Providers
			</Button>
			<h1 class="text-3xl font-bold text-slate-200">
				{isNew ? 'New LLM Provider' : `Edit ${provider?.name || 'Provider'}`}
			</h1>
			<p class="mt-2 text-slate-400">
				{isNew ? 'Configure a new language model provider' : 'Update provider configuration'}
			</p>
		</div>

		<!-- Success Message -->
		{#if success}
			<Alert color="green" class="mb-6">
				Provider {isNew ? 'created' : 'updated'} successfully! Redirecting...
			</Alert>
		{/if}

		{#if error}
			<Alert color="red" class="mb-6">
				{error}
			</Alert>
		{/if}

		<!-- Form -->
		<Card class="border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Provider Name -->
				<div>
					<Label for="name" class="mb-2 text-slate-300">Provider Name *</Label>
					<Input
						id="name"
						type="text"
						bind:value={formData.name}
						placeholder="Enter provider name..."
						required
						class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<!-- Provider Type -->
				<div>
					<Label for="type" class="mb-2 text-slate-300">Provider Type *</Label>
					<Select
						id="type"
						bind:value={formData.type}
						items={providerTypes}
						class="border-slate-600 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<!-- API Key (conditional) -->
				{#if requiresApiKey(formData.type)}
					<div>
						<Label for="apiKey" class="mb-2 text-slate-300">API Key *</Label>
						<Input
							id="apiKey"
							type="password"
							bind:value={formData.apiKey}
							placeholder="Enter API key..."
							required
							class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
						/>
						<p class="mt-1 text-xs text-slate-500">
							Keep your API key secure and never share it publicly.
						</p>
					</div>
				{/if}

				<!-- Base URL (conditional) -->
				{#if requiresBaseUrl(formData.type)}
					<div>
						<Label for="baseUrl" class="mb-2 text-slate-300">
							Base URL {formData.type === 'ollama' ? '*' : '(Optional)'}
						</Label>
						<Input
							id="baseUrl"
							type="url"
							bind:value={formData.baseUrl}
							placeholder={formData.type === 'ollama'
								? 'http://localhost:11434'
								: 'https://api.example.com'}
							required={formData.type === 'ollama'}
							class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
				{/if}

				<!-- Model Name -->
				<div>
					<Label for="modelName" class="mb-2 text-slate-300">Model Name *</Label>
					{#if modelOptions[formData.type].length > 0}
						<Select
							id="modelName"
							bind:value={formData.modelName}
							items={modelOptions[formData.type].map((model) => ({ value: model, name: model }))}
							class="border-slate-600 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
						/>
					{:else}
						<Input
							id="modelName"
							type="text"
							bind:value={formData.modelName}
							placeholder="Enter model name..."
							required
							class="border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
						/>
					{/if}
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
								{isNew ? 'Create Provider' : 'Update Provider'}
							{/if}
						</Button>
					</div>
				</div>
			</form>
		</Card>
	</div>
</div>
