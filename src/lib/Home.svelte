<script>
  import ChatEditor from './ChatEditor.svelte';
  import { currentView, setPath } from '../stores.js';

  let input = '';
  let messages = [];

  async function send() {
    if (!input.trim()) return;
    const question = input;
    messages = [...messages, { role: 'user', content: question }];
    input = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      messages = [...messages, { role: 'assistant', content: data.answer || 'No response' }];
    } catch (e) {
      messages = [...messages, { role: 'assistant', content: 'Error contacting server' }];
    }
  }
</script>

<div class="flex flex-col h-full max-w-2xl mx-auto w-full">
  <h1 class="text-2xl p-8 text-center">What is your data question?</h1>
  <div class="flex-1 overflow-y-auto px-4 py-1 space-y-4">
    {#each messages as msg}
      <div class={msg.role === 'user' ? 'text-right' : ''}>
        <div
          class="inline-block px-4 py-2 rounded"
          class:bg-blue-100={msg.role === 'user'}
          class:bg-gray-200={msg.role !== 'user'}
        >
          {msg.content}
        </div>
      </div>
    {/each}
  </div>
  <div class="p-1">
    <ChatEditor bind:value={input} on:ask={send} />
  </div>
  <div class="p-4 text-center text-sm text-gray-600">
    Add your own data integrations in the
    <button
      class="text-blue-500"
      on:click={() => {
        currentView.set('builder');
        setPath('/builder');
      }}
    >
      Builder
    </button>
    section.
  </div>
</div>
