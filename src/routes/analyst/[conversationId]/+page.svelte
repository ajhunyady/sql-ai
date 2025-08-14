<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/analyst/Sidebar.svelte';
	import UserMessage from '$lib/components/analyst/UserMessage.svelte';
	import AIMessage from '$lib/components/analyst/AIMessage.svelte';
	import QueryInput from '$lib/components/analyst/QueryInput.svelte';
	import {
		activeConversation,
		conversationsLoading,
		conversationsError,
		getConversationById
	} from '$lib/stores/conversations';

	let conversationId = $derived($page.params.conversationId);

	onMount(async () => {
		if (conversationId) {
			const conversation = await getConversationById(conversationId);
			if (!conversation) {
				// Redirect to analyst page if conversation not found
				goto('/analyst');
			}
		}
	});

	// Watch for conversation ID changes in URL
	$effect(() => {
		if (conversationId) {
			getConversationById(conversationId);
		}
	});
</script>

<svelte:head>
	<title>Conversation - CoAgent SQL</title>
</svelte:head>

<div class="flex min-h-screen">
	<Sidebar />
	<main class="ml-72 flex w-full flex-col">
		<div class="flex-1 px-6 py-8">
			<div class="mx-auto w-full max-w-4xl">
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
						<!-- Conversation Header -->
						<div class="border-b border-slate-700/30 pb-6">
							<h1 class="text-2xl font-bold text-white">{$activeConversation.title}</h1>
							<p class="mt-2 text-sm text-slate-400">
								Created {new Date($activeConversation.createdAt).toLocaleDateString('en-US', {
									month: 'long',
									day: 'numeric',
									year: 'numeric'
								})}
							</p>
						</div>

						<!-- Messages -->
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
								<svg
									class="h-8 w-8 text-slate-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									></path>
								</svg>
							</div>
							<h2 class="mb-2 text-xl font-bold text-white">Conversation Not Found</h2>
							<p class="text-slate-500">This conversation doesn't exist or has been deleted.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Chat Input at Bottom -->
		<div class="border-t border-slate-700/30 bg-slate-900/50 px-6 py-4">
			<div class="mx-auto w-full max-w-4xl">
				<QueryInput />
			</div>
		</div>
	</main>
</div>
