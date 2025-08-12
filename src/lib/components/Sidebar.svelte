<script lang="ts">
	import { Input, Button } from 'flowbite-svelte';
	import { PlusOutline, SearchSolid, ClockSolid } from 'flowbite-svelte-icons';
	import ChatHistoryItem from './ChatHistoryItem.svelte';
</script>

<nav
	class="fixed top-20 left-0 w-72 h-full backdrop-blur-xl bg-slate-950/80 border-r border-blue-500/20"
	aria-label="Chat navigation"
>
	<div class="p-6">
		<!-- Search Box -->
		<div class="mb-6">
			<div class="relative">
				<Input
					type="text"
					placeholder="Search conversations..."
					class="w-full bg-slate-900/50 border border-blue-500/30 rounded-xl px-4 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
				/>
				<SearchSolid
					class="absolute right-4 top-3.5 text-blue-400 text-sm w-4 h-4"
				/>
			</div>
		</div>

		<!-- New Chat Button -->
		<Button
			color="blue"
			class="w-full px-4 py-3 mb-8 flex items-center justify-center text-sm font-medium button-hover"
			aria-label="Start a new conversation"
		>
			<PlusOutline class="mr-2" />
			New Conversation
		</Button>

		<!-- Chat History -->
		<div class="mb-4">
			<h3 class="text-lg font-semibold text-slate-300 mb-4 flex items-center">
				<ClockSolid class="mr-2 text-blue-400" />
				Recent Chats
			</h3>
		</div>
		<div class="space-y-2 max-h-96 overflow-y-auto" role="list" aria-label="Recent conversations">
			<ChatHistoryItem
				title="Top 5 customers by revenue"
				time="Today, 3:42 PM"
				active="{true}"
			/>
			<ChatHistoryItem title="Monthly sales trend analysis" time="Today, 2:15 PM" />
			<ChatHistoryItem title="Product performance metrics" time="Yesterday, 11:30 AM" />
			<ChatHistoryItem title="Regional sales comparison" time="Aug 10, 2025" />
			<ChatHistoryItem title="Customer retention analysis" time="Aug 10, 2025" />
			<ChatHistoryItem title="Quarterly revenue breakdown" time="Aug 9, 2025" />
			<ChatHistoryItem title="Market share insights" time="Aug 8, 2025" />
			<ChatHistoryItem title="Inventory turnover rates" time="Aug 7, 2025" />
		</div>
	</nav>
</div>