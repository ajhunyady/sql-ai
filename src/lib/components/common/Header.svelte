<script lang="ts">
	import { Button, ButtonGroup, Avatar, Toast } from 'flowbite-svelte';
	import {
		CogSolid,
		ChevronDownOutline,
		CheeseSolid,
		CaretLeftSolid,
		CheckCircleSolid,
		ExclamationCircleSolid,
		DatabaseSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/coagent.png';
	import { AVATAR_URL, APP_NAME } from '$lib/constants';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { resetAllDatabases } from '$lib/utils/database-reset';

	// Determine active section based on current route
	$: activeSection = $page.url.pathname.startsWith('/analyst')
		? 'analyst'
		: $page.url.pathname.startsWith('/builder')
			? 'builder'
			: 'analyst';

	// Toast state
	let showToast = false;
	let toastMessage = '';
	let toastType: 'success' | 'error' = 'success';

	function navigateToSection(section: string) {
		goto(`/${section}`);
	}

	function showToastMessage(message: string, type: 'success' | 'error') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 3000);
	}

	async function loadSampleData() {
		try {
			// Send message to service worker to load sample data
			if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller.postMessage({
					type: 'LOAD_SAMPLE_DATA'
				});
			} else {
				showToastMessage('Service worker not available', 'error');
			}
		} catch (error) {
			console.error('Failed to load sample data:', error);
			showToastMessage('Failed to load sample data', 'error');
		}
	}

	async function clearData() {
		try {
			// Send message to service worker to clear data
			if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller.postMessage({
					type: 'CLEAR_DATA'
				});
			} else {
				showToastMessage('Service worker not available', 'error');
			}
		} catch (error) {
			console.error('Failed to clear data:', error);
			showToastMessage('Failed to clear data', 'error');
		}
	}

	async function resetDatabase() {
		if (confirm('This will reset all data and reload the page. Continue?')) {
			try {
				const result = await resetAllDatabases();
				if (!result.success) {
					showToastMessage(`Database reset failed: ${result.error || result.message}`, 'error');
				}
			} catch (error) {
				console.error('Failed to reset database:', error);
				showToastMessage('Failed to reset database', 'error');
			}
		}
	}

	onMount(() => {
		// Listen for service worker messages
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', (event) => {
				const { type, success, error } = event.data;

				switch (type) {
					case 'sample-data-loaded':
						if (success) {
							showToastMessage('Sample data loaded successfully', 'success');
						} else {
							showToastMessage(`Failed to load sample data: ${error}`, 'error');
						}
						break;
					case 'data-cleared':
						if (success) {
							showToastMessage('Data cleared successfully', 'success');
						} else {
							showToastMessage(`Failed to clear data: ${error}`, 'error');
						}
						break;
				}
			});
		}
	});
</script>

<header class="sticky top-0 z-50 border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
	<div class="flex w-full items-center justify-between px-6 py-4">
		<div class="flex items-center">
			<div class="mr-8 flex items-center text-xl font-semibold">
				<img src={logo} alt="Coagent Logo" class="mr-3 h-8 w-8" />
				<span class="gradient-text">{APP_NAME}</span>
			</div>
			<div
				class="hidden [&:not(:first-child)]:rounded-s-none [&:not(:last-child)]:rounded-e-none [&:not(:last-child)]:border-e-0"
			></div>
			<div class="hidden text-sm md:flex">
				<ButtonGroup>
					<Button
						color={activeSection === 'analyst' ? 'blue' : 'gray'}
						onclick={() => navigateToSection('analyst')}>Analyst</Button
					>
					<Button
						color={activeSection === 'builder' ? 'blue' : 'gray'}
						onclick={() => navigateToSection('builder')}>Builder</Button
					>
				</ButtonGroup>
			</div>
		</div>
		<div class="flex items-center space-x-3">
			<Button
				class="icon-button rounded-lg !p-2 hover:bg-slate-800/50"
				aria-label="Load sample data"
				onclick={loadSampleData}
			>
				<CheeseSolid />
			</Button>
			<Button
				class="icon-button rounded-lg !p-2 hover:bg-slate-800/50"
				aria-label="Clear data"
				onclick={clearData}
			>
				<CaretLeftSolid />
			</Button>
			<Button
				class="icon-button rounded-lg !p-2 hover:bg-slate-800/50"
				aria-label="Reset database"
				onclick={resetDatabase}
			>
				<DatabaseSolid />
			</Button>
			<Button
				class="icon-button rounded-lg !p-2 hover:bg-slate-800/50"
				aria-label="Open settings menu"
			>
				<CogSolid />
			</Button>
			<div
				class="flex cursor-pointer items-center rounded-lg p-2 transition-all duration-300 hover:bg-slate-800/50"
			>
				<Avatar src={AVATAR_URL} alt="User profile picture" class="avatar-border h-8 w-8" />
				<ChevronDownOutline class="ml-2 text-xs text-slate-400" />
			</div>
		</div>
	</div>
</header>

{#if showToast}
	<div class="fixed top-20 right-6 z-50">
		<Toast
			color={toastType === 'success' ? 'green' : 'red'}
			dismissable
			onclose={() => (showToast = false)}
		>
			<div class="flex items-center">
				{#if toastType === 'success'}
					<CheckCircleSolid class="mr-2 h-5 w-5" />
				{:else}
					<ExclamationCircleSolid class="mr-2 h-5 w-5" />
				{/if}
				{toastMessage}
			</div>
		</Toast>
	</div>
{/if}
