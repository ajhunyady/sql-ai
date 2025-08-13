<script lang="ts">
	import { Button, Input, Select, Label, Card, Alert } from 'flowbite-svelte';
	import { ArrowLeftOutline, CheckOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		getLLMProviderById,
		createLLMProvider,
		updateLLMProvider,
		llmProviders
	} from '$lib/stores/llm-providers';
	import type { LLMProvider, LLMProviderFormData } from '$lib/models/llm-provider';
	import BuilderSidebar from '$lib/components/builder/BuilderSidebar.svelte';
	import {
		providerTypes,
		modelOptions,
		initializeFormState,
		validateForm,
		requiresApiKey,
		requiresBaseUrl,
		prepareFormDataForSubmission,
		updateModelNameOnChange
	} from '$lib/utils/llm-provider-form';

	let providerId = $state(page.params.id);
	let isNew = $state(providerId === 'new');
	let provider = $state<LLMProvider | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	// Form data
	let formData = $state(initializeFormState($llmProviders));

	onMount(async () => {
		if (!isNew && providerId) {
			provider = await getLLMProviderById(providerId);
			if (provider) {
				formData = initializeFormState($llmProviders, provider);
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
			formData = initializeFormState($llmProviders);
		} else if (provider) {
			formData = initializeFormState($llmProviders, provider);
		}
		error = null;
	}

	function validateFormLocal(): string | null {
		return validateForm(formData);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const validationError = validateFormLocal();
		if (validationError) {
			error = validationError;
			return;
		}

		loading = true;
		error = null;

		try {
			const submissionData = prepareFormDataForSubmission(formData);
			
			if (isNew) {
				await createLLMProvider(submissionData);
			} else if (providerId) {
				await updateLLMProvider(providerId, submissionData);
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
		updateModelNameOnChange(formData);
	});
</script>

<svelte:head>
	<title>{isNew ? 'New' : 'Edit'} LLM Provider - Builder</title>
</svelte:head>

<BuilderSidebar />

<div class="ml-72 min-h-screen from-slate-950 via-slate-900 to-slate-950 p-8">
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
		<Card class="border-0 bg-slate-900/50">
			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Provider Name (only for custom providers) -->
				{#if formData.type === 'custom'}
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
				{/if}

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
