<script lang="ts">
	import { Input, Button } from 'flowbite-svelte';
	import { PlusOutline, SearchSolid, ClockSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ChatHistoryItem from './ChatHistoryItem.svelte';

	import {
		conversations,
		conversationsLoading,
		conversationsError,
		loadConversations,
		setActiveConversation
	} from '$lib/stores/conversations';
	import { onMount } from 'svelte';

	let searchTerm = $state('');

	// Reactive filtered conversations converted to chat history format
	let filteredConversations = $derived(
		$conversations
			.filter((conv) => conv.title.toLowerCase().includes(searchTerm.toLowerCase()))
			.map((conv) => ({
				id: conv.id,
				title: conv.title,
				time: new Date(conv.updatedAt).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit'
				}),
				active: false
			}))
			.sort(
				(a, b) =>
					new Date($conversations.find((c) => c.id === b.id)?.updatedAt || 0).getTime() -
					new Date($conversations.find((c) => c.id === a.id)?.updatedAt || 0).getTime()
			)
	);

	onMount(() => {
		// Load conversations if not already loaded
		if ($conversations.length === 0 && !$conversationsLoading) {
			loadConversations();
		}
	});

	async function handleChatItemClick(id: string) {
		await goto(`/analyst/${id}`);
	}

	async function handleNewConversation() {
		// Clear active conversation and navigate to main analyst page
		setActiveConversation(null);
		await goto('/analyst');
	}

	// Check if we're on a conversation page to highlight the active item
	let currentConversationId = $derived($page.params?.conversationId);
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
					disabled={$conversationsLoading}
				/>
				<SearchSolid class="absolute top-3.5 right-4 h-4 w-4 text-sm text-blue-400" />
			</div>
		</div>

		<!-- New Chat Button -->
		<Button
			color="blue"
			class="button-hover mb-6 flex w-full items-center justify-center px-4 py-3 text-sm font-medium"
			aria-label="Start a new conversation"
			onclick={handleNewConversation}
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
			{#if $conversationsLoading}
				<div class="flex items-center justify-center py-4">
					<div class="text-center">
						<div
							class="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"
						></div>
						<p class="text-xs text-slate-400">Loading conversations...</p>
					</div>
				</div>
			{:else if $conversationsError}
				<div class="p-3 text-center">
					<p class="mb-2 text-xs text-red-400">{$conversationsError}</p>
					<button
						onclick={() => loadConversations()}
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						Retry
					</button>
				</div>
			{:else if filteredConversations.length === 0}
				<div class="p-3 text-center">
					<p class="text-xs text-slate-400">
						{searchTerm ? 'No conversations match your search' : 'No conversations yet'}
					</p>
				</div>
			{:else}
				{#each filteredConversations as item (item.id)}
					<ChatHistoryItem
						title={item.title}
						time={item.time}
						active={item.id === currentConversationId}
						onclick={() => handleChatItemClick(item.id)}
					/>
				{/each}
			{/if}
		</div>
	</div>
</div>
