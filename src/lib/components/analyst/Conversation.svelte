<script>
  import UserMessage from './UserMessage.svelte';
  import AIMessage from './AIMessage.svelte';
</script>

<section class="mb-10 w-full max-w-4xl">
  <div class="space-y-8">
    <UserMessage
      message="Show me the top 5 customers by revenue for Q1 2025"
      timestamp="August 11, 2025 • 3:42 PM"
    />
    <AIMessage timestamp="August 11, 2025 • 3:42 PM" />
    <UserMessage message="Show this as a bar chart" timestamp="August 11, 2025 • 3:43 PM" />
  </div>
</section>