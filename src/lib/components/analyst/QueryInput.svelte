<script lang="ts">
	import { Button, Label } from 'flowbite-svelte';
	import { RocketSolid, UploadSolid, DatabaseSolid } from 'flowbite-svelte-icons';
	import {
		createConversation,
		updateConversation,
		activeConversation
	} from '$lib/stores/conversations';
	import { createChatHistoryItem, setActiveChatHistoryItem } from '$lib/stores/chatHistory';
	import type { Message } from '$lib/models/conversation';

	let queryText = '';
	let isSubmitting = false;

	async function handleSubmit() {
		if (!queryText.trim() || isSubmitting) return;

		isSubmitting = true;
		const userMessage: Message = {
			id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			type: 'user',
			content: queryText.trim(),
			timestamp: new Date().toISOString()
		};

		try {
			let conversation = $activeConversation;

			if (!conversation) {
				// Create new conversation
				const conversationTitle =
					queryText.length > 50 ? queryText.substring(0, 47) + '...' : queryText;

				conversation = await createConversation({
					title: conversationTitle,
					messages: [userMessage]
				});

				if (conversation) {
					// Create chat history item and set it as active
					await createChatHistoryItem({
						title: conversationTitle,
						time: new Date().toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: '2-digit'
						})
					});
					await setActiveChatHistoryItem(conversation.id);
				}
			} else {
				// Add message to existing conversation
				const updatedMessages = [...conversation.messages, userMessage];
				await updateConversation(conversation.id, {
					title: conversation.title,
					messages: updatedMessages
				});
			}

			// Create AI response (mock for now)
			const aiMessage: Message = {
				id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				type: 'ai',
				content: `I understand you're asking: "${queryText}". Let me analyze this query and provide insights from your data.`,
				timestamp: new Date().toISOString(),
				tableData: [
					{ metric: 'Total Records', value: '1,234' },
					{ metric: 'Data Sources', value: '3' },
					{ metric: 'Last Updated', value: 'Today' }
				],
				sqlQuery: `-- Generated SQL for: ${queryText}
SELECT * FROM your_table
WHERE relevant_column LIKE '%${queryText.split(' ')[0]}%'
LIMIT 100;`
			};

			// Add AI response to conversation
			if (conversation) {
				const finalMessages = [...conversation.messages, userMessage, aiMessage];
				await updateConversation(conversation.id, {
					title: conversation.title,
					messages: finalMessages
				});
			}

			// Clear the input
			queryText = '';
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

<section class="mb-10 w-full max-w-4xl">
	<div class="glass-panel-lg glow-effect p-6 md:p-8">
		<div class="mb-6">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center">
					<div class="pulse-animation mr-3 h-3 w-3 rounded-full bg-green-500"></div>
					<span class="text-sm font-medium text-slate-300"
						>Connected to: <span class="text-blue-400" aria-label="All agents are connected"
							>All agents</span
						></span
					>
				</div>
				<Button size="xs" class="icon-button hover:bg-slate-800/50" aria-label="Select data source"
					><DatabaseSolid class="mr-2" />
					Select Source
				</Button>
			</div>
			<Label for="query-input" class="sr-only">Query Input</Label>
			<textarea
				id="query-input"
				bind:value={queryText}
				on:keydown={handleKeyDown}
				disabled={isSubmitting}
				class="h-28 w-full resize-none rounded-xl border border-blue-500/30 bg-slate-900/50 p-4 text-slate-200 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50"
				placeholder="Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'"
				aria-describedby="query-help"
			></textarea>
			<div id="query-help" class="sr-only">
				Enter your natural language query about your data and get instant insights
			</div>
		</div>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<Button size="lg" class="icon-button !p-2 hover:bg-slate-800/50" aria-label="Upload file">
					<UploadSolid />
				</Button>
			</div>
			<Button
				onclick={handleSubmit}
				disabled={!queryText.trim() || isSubmitting}
				class="button-hover glow-effect flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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
