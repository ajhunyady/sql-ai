<script>
	import UserMessage from './UserMessage.svelte';
	import AIMessage from './AIMessage.svelte';
	import {
		activeConversation,
		conversationsLoading,
		conversationsError,
		getConversationById
	} from '$lib/stores/conversations';
	import { chatHistory } from '$lib/stores/chatHistory';
	import { onMount } from 'svelte';

	let activeConversationId = $state('');

	// Watch for active chat history item changes
	$effect(() => {
		const activeChatItem = $chatHistory.find((item) => item.active);
		if (activeChatItem && activeChatItem.id !== activeConversationId) {
			activeConversationId = activeChatItem.id;
			getConversationById(activeChatItem.id);
		}
	});

	onMount(() => {
		// Load the first active conversation on mount
		const activeChatItem = $chatHistory.find((item) => item.active);
		if (activeChatItem) {
			activeConversationId = activeChatItem.id;
			getConversationById(activeChatItem.id);
		}
	});
</script>

<section class="mb-10 w-full max-w-4xl">
	{#if $conversationsLoading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"
				></div>
				<p class="text-slate-400">Loading conversation...</p>
			</div>
		</div>
	{:else if $conversationsError}
		<div class="rounded-lg border border-red-700/50 bg-red-900/20 p-6 text-center">
			<p class="mb-2 text-red-200">Error loading conversation</p>
			<p class="text-sm text-red-300">{$conversationsError}</p>
		</div>
	{:else if $activeConversation}
		<div class="space-y-8">
			{#each $activeConversation.messages as message (message.id)}
				{#if message.type === 'user'}
					<UserMessage
						message={message.content}
						timestamp={new Date(message.timestamp).toLocaleDateString('en-US', {
							month: 'long',
							day: 'numeric',
							year: 'numeric'
						}) +
							' • ' +
							new Date(message.timestamp).toLocaleTimeString('en-US', {
								hour: 'numeric',
								minute: '2-digit'
							})}
					/>
				{:else if message.type === 'ai'}
					<AIMessage
						content={message.content}
						tableData={message.tableData}
						sqlQuery={message.sqlQuery}
						timestamp={new Date(message.timestamp).toLocaleDateString('en-US', {
							month: 'long',
							day: 'numeric',
							year: 'numeric'
						}) +
							' • ' +
							new Date(message.timestamp).toLocaleTimeString('en-US', {
								hour: 'numeric',
								minute: '2-digit'
							})}
					/>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-12 text-center">
			<div class="mx-auto max-w-md">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50 p-4"
				>
					<svg class="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path>
					</svg>
				</div>
				<h2 class="mb-2 text-xl font-bold text-white">No Conversation Selected</h2>
				<p class="text-slate-500">Select a conversation from the sidebar to view the messages.</p>
			</div>
		</div>
	{/if}
</section>
