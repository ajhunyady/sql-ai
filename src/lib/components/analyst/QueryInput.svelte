<script lang="ts">
	import { Button, Label } from 'flowbite-svelte';
	import { RocketSolid, UploadSolid, DatabaseSolid } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		createConversation,
		updateConversation,
		activeConversation,
		getConversationById
	} from '$lib/stores/conversations';

	import type { Message } from '$lib/models/conversation';

	let queryText = $state('');
	let isSubmitting = $state(false);

	// Check if we're on a conversation page
	let isOnConversationPage = $derived(
		$page.url.pathname.startsWith('/analyst/') && $page.params?.conversationId
	);

	async function handleSubmit() {
		if (!queryText.trim() || isSubmitting) return;

		isSubmitting = true;
		const userMessageContent = queryText.trim();
		queryText = ''; // Clear immediately to prevent duplicate submissions

		try {
			let conversation = $activeConversation;

			// Generate unique IDs with proper timing
			const baseTimestamp = Date.now();
			const userMessage: Message = {
				id: `msg-${baseTimestamp}-user-${Math.random().toString(36).substr(2, 9)}`,
				type: 'user',
				content: userMessageContent,
				timestamp: new Date().toISOString()
			};

			if (!conversation || !isOnConversationPage) {
				// Create new conversation with user message
				const conversationTitle =
					userMessageContent.length > 50
						? userMessageContent.substring(0, 47) + '...'
						: userMessageContent;

				conversation = await createConversation({
					title: conversationTitle,
					messages: [userMessage]
				});

				if (conversation) {
					// Navigate to the new conversation page
					await goto(`/analyst/${conversation.id}`);
				}
			} else {
				// Add message to existing conversation
				const updatedMessages = [...conversation.messages, userMessage];
				await updateConversation(conversation.id, {
					title: conversation.title,
					messages: updatedMessages
				});
			}

			// Create AI response with unique timestamp
			const aiMessage: Message = {
				id: `msg-${baseTimestamp + 1}-ai-${Math.random().toString(36).substr(2, 9)}`,
				type: 'ai',
				content: `I understand you're asking: "${userMessageContent}". Let me analyze this query and provide insights from your data.`,
				timestamp: new Date(Date.now() + 1).toISOString(),
				tableData: [
					{ metric: 'Total Records', value: '1,234' },
					{ metric: 'Data Sources', value: '3' },
					{ metric: 'Last Updated', value: 'Today' }
				],
				sqlQuery: `-- Generated SQL for: ${userMessageContent}
SELECT * FROM your_table
WHERE relevant_column LIKE '%${userMessageContent.split(' ')[0]}%'
LIMIT 100;`
			};

			// Add AI response to conversation (get fresh state to avoid conflicts)
			if (conversation) {
				const latestConversation = await getConversationById(conversation.id);
				if (latestConversation) {
					const finalMessages = [...latestConversation.messages, aiMessage];
					await updateConversation(conversation.id, {
						title: conversation.title,
						messages: finalMessages
					});
				}
			}
		} catch (error) {
			console.error('Error submitting query:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<section class={isOnConversationPage ? 'w-full' : 'mb-10 w-full max-w-4xl'}>
	<div
		class={isOnConversationPage
			? 'glass-panel glow-effect p-4'
			: 'glass-panel-lg glow-effect p-6 md:p-8'}
	>
		<div class={isOnConversationPage ? 'mb-4' : 'mb-6'}>
			{#if !isOnConversationPage}
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center">
						<div class="pulse-animation mr-3 h-3 w-3 rounded-full bg-green-500"></div>
						<span class="text-sm font-medium text-slate-300"
							>Connected to: <span class="text-blue-400" aria-label="All agents are connected"
								>All agents</span
							></span
						>
					</div>
					<Button
						size="xs"
						class="icon-button hover:bg-slate-800/50"
						aria-label="Select data source"
						><DatabaseSolid class="mr-2" />
						Select Source
					</Button>
				</div>
			{/if}
			<Label for="query-input" class="sr-only">Query Input</Label>
			<textarea
				id="query-input"
				bind:value={queryText}
				onkeydown={handleKeyDown}
				disabled={isSubmitting}
				class="{isOnConversationPage
					? 'h-20'
					: 'h-28'} w-full resize-none rounded-xl border border-blue-500/30 bg-slate-900/50 p-4 text-slate-200 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50"
				placeholder={isOnConversationPage
					? 'Continue the conversation...'
					: "Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'"}
				aria-describedby="query-help"
			></textarea>
			<div id="query-help" class="sr-only">
				Enter your natural language query about your data and get instant insights
			</div>
		</div>
		<div class="flex items-center justify-between">
			{#if !isOnConversationPage}
				<div class="flex items-center space-x-3">
					<Button size="lg" class="icon-button !p-2 hover:bg-slate-800/50" aria-label="Upload file">
						<UploadSolid />
					</Button>
				</div>
			{:else}
				<div></div>
			{/if}
			<Button
				onclick={handleSubmit}
				disabled={!queryText.trim() || isSubmitting}
				class="button-hover glow-effect flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 {isOnConversationPage
					? 'px-4 py-2'
					: 'px-6 py-3'} font-medium text-white hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Submit query"
			>
				{#if isSubmitting}
					<div
						class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Processing...
				{:else}
					<RocketSolid class="mr-2" />
					Ask
				{/if}
			</Button>
		</div>
	</div>
</section>
