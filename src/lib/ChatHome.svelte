<script>
  import ChatEditor from './ChatEditor.svelte';
  import { agents } from '../stores.js';
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

<div class="flex flex-col h-full">
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as m}
      <div class="{m.role === 'user' ? 'text-right' : 'text-left'}">
        <div class="inline-block px-3 py-2 rounded {m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
          {m.content}
        </div>
      </div>
    {/each}
  </div>
  <div class="p-4 border-t">
    <ChatEditor bind:value={input} on:ask={send} />
  </div>
</div>
