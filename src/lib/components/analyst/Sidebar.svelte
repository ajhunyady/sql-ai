<script lang="ts">
	import { Input, Button } from 'flowbite-svelte';
	import { PlusOutline, SearchSolid, ClockSolid } from 'flowbite-svelte-icons';
	import ChatHistoryItem from './ChatHistoryItem.svelte';
	import {
		chatHistory,
		chatHistoryLoading,
		chatHistoryError,
		loadChatHistory,
		setActiveChatHistoryItem
	} from '$lib/stores/chatHistory';
	import { onMount } from 'svelte';

	let searchTerm = $state('');

	// Reactive filtered chat history
	let filteredChatHistory = $derived(
		$chatHistory.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	onMount(() => {
		// Load chat history if not already loaded
		if ($chatHistory.length === 0 && !$chatHistoryLoading) {
			loadChatHistory();
		}
	});

	async function handleChatItemClick(id: string) {
		await setActiveChatHistoryItem(id);
	}
</script>

<div
	class="fixed top-20 left-0 h-full w-72 border-r border-blue-500/20 bg-slate-950/80 backdrop-blur-xl"
	aria-label="Chat navigation"
>
	<div class="p-6">
		<!-- Search Box -->
		<div class="mb-6">
			<div class="relative">
				<Input
					bind:value={searchTerm}
					type="text"
					placeholder="Search conversations..."
					class="w-full rounded-xl border border-blue-500/30 bg-slate-900/50 px-4 py-3 pr-10 text-sm text-slate-200 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
					disabled={$chatHistoryLoading}
				/>
				<SearchSolid class="absolute top-3.5 right-4 h-4 w-4 text-sm text-blue-400" />
			</div>
		</div>

		<!-- New Chat Button -->
		<Button
			color="blue"
			class="button-hover mb-8 flex w-full items-center justify-center px-4 py-3 text-sm font-medium"
			aria-label="Start a new conversation"
		>
			<PlusOutline class="mr-2" />
			New Conversation
		</Button>

		<!-- Chat History -->
		<div class="mb-4">
			<h3 class="mb-4 flex items-center text-lg font-semibold text-slate-300">
				<ClockSolid class="mr-2 text-blue-400" />
				Recent Chats
			</h3>
		</div>
		<div class="max-h-96 space-y-2 overflow-y-auto" role="list" aria-label="Recent conversations">
			{#if $chatHistoryLoading}
				<div class="flex items-center justify-center py-4">
					<div class="text-center">
						<div
							class="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"
						></div>
						<p class="text-xs text-slate-400">Loading conversations...</p>
					</div>
				</div>
			{:else if $chatHistoryError}
				<div class="p-3 text-center">
					<p class="mb-2 text-xs text-red-400">{$chatHistoryError}</p>
					<button
						onclick={() => loadChatHistory()}
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						Retry
					</button>
				</div>
			{:else if filteredChatHistory.length === 0}
				<div class="p-3 text-center">
					<p class="text-xs text-slate-400">
						{searchTerm ? 'No conversations match your search' : 'No conversations yet'}
					</p>
				</div>
			{:else}
				{#each filteredChatHistory as item (item.id)}
					<ChatHistoryItem
						title={item.title}
						time={item.time}
						active={item.active}
						onclick={() => handleChatItemClick(item.id)}
					/>
				{/each}
			{/if}
		</div>
	</div>
</div>
