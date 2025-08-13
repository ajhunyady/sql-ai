<script lang="ts">
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { CheckCircleOutline, ExclamationCircleSolid, ClockOutline } from 'flowbite-svelte-icons';
	import { serviceWorkerApi } from '$lib/services/api';
	import { agents, agentsLoading } from '$lib/stores/agents';
	import { llmProviders, llmProvidersLoading } from '$lib/stores/llm-providers';
	import { datastores, datastoresLoading } from '$lib/stores/datastores';
	import { onMount } from 'svelte';

	let swStatus = $state('checking');
	let swRegistration: ServiceWorkerRegistration | null = null;
	let isOnline = $state(true);

	onMount(() => {
		checkServiceWorkerStatus();

		// Monitor online status
		isOnline = navigator.onLine;
		window.addEventListener('online', () => (isOnline = true));
		window.addEventListener('offline', () => (isOnline = false));

		// Check status periodically
		const interval = setInterval(checkServiceWorkerStatus, 5000);
		return () => clearInterval(interval);
	});

	async function checkServiceWorkerStatus() {
		if (!serviceWorkerApi.isSupported()) {
			swStatus = 'not-supported';
			return;
		}

		try {
			swStatus = await serviceWorkerApi.getStatus();
			if (swStatus === 'not-registered') {
				swRegistration = await serviceWorkerApi.register();
				swStatus = await serviceWorkerApi.getStatus();
			}
		} catch (error) {
			console.error('Error checking service worker status:', error);
			swStatus = 'error';
		}
	}

	function getStatusInfo(status: string) {
		switch (status) {
			case 'active':
				return {
					color: 'green' as const,
					icon: CheckCircleOutline,
					label: 'Active',
					description: 'Service worker is running and handling requests'
				};
			case 'installing':
				return {
					color: 'yellow' as const,
					icon: ClockOutline,
					label: 'Installing',
					description: 'Service worker is being installed'
				};
			case 'waiting':
				return {
					color: 'blue' as const,
					icon: ClockOutline,
					label: 'Waiting',
					description: 'New service worker is waiting to activate'
				};
			case 'not-supported':
				return {
					color: 'red' as const,
					icon: ExclamationCircleSolid,
					label: 'Not Supported',
					description: 'Service workers are not supported in this browser'
				};
			case 'not-registered':
				return {
					color: 'yellow' as const,
					icon: ExclamationCircleSolid,
					label: 'Not Registered',
					description: 'Service worker is not registered'
				};
			case 'error':
				return {
					color: 'red' as const,
					icon: ExclamationCircleSolid,
					label: 'Error',
					description: 'Error occurred while checking service worker'
				};
			default:
				return {
					color: 'gray' as const,
					icon: ClockOutline,
					label: 'Checking',
					description: 'Checking service worker status...'
				};
		}
	}

	async function forceUpdate() {
		try {
			await serviceWorkerApi.unregister();
			swRegistration = await serviceWorkerApi.register();
			await checkServiceWorkerStatus();
		} catch (error) {
			console.error('Error forcing update:', error);
		}
	}

	let statusInfo = $derived(getStatusInfo(swStatus));
	let totalItems = $derived($agents.length + $llmProviders.length + $datastores.length);
	let isLoading = $derived($agentsLoading || $llmProvidersLoading || $datastoresLoading);
</script>

<Card class="mb-6">
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white">Service Worker Backend Status</h3>
			<Button size="sm" color="blue" onclick={checkServiceWorkerStatus}>Refresh</Button>
		</div>

		<!-- Service Worker Status -->
		<div class="flex items-center space-x-3">
			{#if statusInfo.icon === CheckCircleOutline}
				<CheckCircleOutline class="h-5 w-5 text-{statusInfo.color}-400" />
			{:else if statusInfo.icon === ClockOutline}
				<ClockOutline class="h-5 w-5 text-{statusInfo.color}-400" />
			{:else}
				<ExclamationCircleSolid class="h-5 w-5 text-{statusInfo.color}-400" />
			{/if}
			<div class="flex-1">
				<div class="flex items-center space-x-2">
					<span class="font-medium text-white">Service Worker:</span>
					<Badge color={statusInfo.color} class="text-xs">{statusInfo.label}</Badge>
				</div>
				<p class="text-sm text-slate-400">{statusInfo.description}</p>
			</div>
		</div>

		<!-- Network Status -->
		<div class="flex items-center space-x-3">
			{#if isOnline}
				<CheckCircleOutline class="h-5 w-5 text-green-400" />
			{:else}
				<ExclamationCircleSolid class="h-5 w-5 text-red-400" />
			{/if}
			<div class="flex-1">
				<div class="flex items-center space-x-2">
					<span class="font-medium text-white">Network:</span>
					<Badge color={isOnline ? 'green' : 'red'} class="text-xs">
						{isOnline ? 'Online' : 'Offline'}
					</Badge>
				</div>
				<p class="text-sm text-slate-400">
					{isOnline ? 'Connected to network' : 'No network connection'}
				</p>
			</div>
		</div>

		<!-- Data Status -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-slate-800/50 p-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-slate-300">Agents</span>
					{#if $agentsLoading}
						<div class="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
					{:else}
						<Badge color="blue" class="text-xs">{$agents.length}</Badge>
					{/if}
				</div>
			</div>

			<div class="rounded-lg bg-slate-800/50 p-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-slate-300">LLM Providers</span>
					{#if $llmProvidersLoading}
						<div class="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
					{:else}
						<Badge color="purple" class="text-xs">{$llmProviders.length}</Badge>
					{/if}
				</div>
			</div>

			<div class="rounded-lg bg-slate-800/50 p-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-slate-300">Datastores</span>
					{#if $datastoresLoading}
						<div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
					{:else}
						<Badge color="green" class="text-xs">{$datastores.length}</Badge>
					{/if}
				</div>
			</div>
		</div>

		<!-- Summary -->
		<div class="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
			<div class="text-center">
				<p class="text-sm text-slate-300">
					{#if isLoading}
						<span class="animate-pulse">Loading data from service worker...</span>
					{:else if swStatus === 'active'}
						<span class="text-green-400">✓</span> Service worker is handling all API requests •
						<span class="font-semibold">{totalItems}</span> total items loaded
					{:else}
						<span class="text-yellow-400">⚠</span> Service worker not fully active • Some features may
						not work properly
					{/if}
				</p>
			</div>
		</div>

		<!-- Actions -->
		{#if swStatus !== 'active' && swStatus !== 'checking'}
			<div class="flex justify-center">
				<Button color="yellow" onclick={forceUpdate}>Force Service Worker Update</Button>
			</div>
		{/if}
	</div>
</Card>
