<script>
  import { agents, currentPage } from '../stores.js';
  let messages = [];
  let input = '';

  async function send() {
    if (!input.trim()) return;
    const userMessage = input;
    messages = [...messages, { role: 'user', content: userMessage }];
    input = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, agents: $agents })
      });
      const data = await res.json();
      if (data.reply) {
        messages = [...messages, { role: 'assistant', content: data.reply }];
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="flex flex-col h-screen">
  <header class="p-4 border-b">
    <h1 class="text-2xl">What data question do you have?</h1>
  </header>
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as m}
      <div class="{m.role === 'user' ? 'text-right' : 'text-left'}">
        <div class="inline-block px-3 py-2 rounded {m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
          {m.content}
        </div>
      </div>
    {/each}
  </div>
  <form class="p-4 border-t flex space-x-2" on:submit|preventDefault={send}>
    <input
      class="flex-1 border rounded px-3 py-2"
      bind:value={input}
      placeholder="Type your question..."
    />
    <button class="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
  </form>
  <footer class="p-4 text-sm text-gray-500 flex justify-between">
    <div></div>
    <button class="text-blue-500" on:click={() => currentPage.set('development')}>Development</button>
  </footer>
</div>
