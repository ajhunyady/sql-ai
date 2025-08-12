<script>
  import { Input, Button } from 'flowbite-svelte';
  import ChatHistoryItem from './ChatHistoryItem.svelte';
</script>

<div class="fixed top-20 left-0 w-72 h-full glass-effect border-r border-dark-blue-500/20">
  <div class="p-6">
    <!-- Search Box -->
    <div class="mb-6">
      <div class="relative">
        <input
          type="text"
          placeholder="Search conversations..."
          class="w-full bg-slate-900/50 border border-dark-blue-500/30 rounded-xl px-4 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-dark-blue-500 focus:ring-2 focus:ring-dark-blue-500/20 transition-all duration-300"
        />
        <i class="fa-solid fa-search absolute right-4 top-3.5 text-dark-blue-400 text-sm"></i>
      </div>
    </div>

    <!-- New Chat Button -->
    <button
      class="w-full bg-gradient-to-r from-dark-blue-600 to-dark-blue-700 hover:from-dark-blue-500 hover:to-dark-blue-600 border border-dark-blue-500/30 rounded-xl px-4 py-3 mb-8 flex items-center justify-center text-sm font-medium text-white glow-effect transition-all duration-300 transform hover:scale-105"
    >
      <i class="fa-solid fa-plus mr-2"></i>
      New Conversation
    </button>

    <!-- Chat History -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-slate-300 mb-4 flex items-center">
        <i class="fa-solid fa-clock-rotate-left mr-2 text-dark-blue-400"></i>
        Recent Chats
      </h3>
    </div>
    <div class="space-y-2 max-h-96 overflow-y-auto">
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
  </div>
</div>