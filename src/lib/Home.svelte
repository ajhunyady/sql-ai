<script>
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

<div class="flex flex-col h-full">
  <h1 class="text-2xl p-8 text-center">What data question do you have?</h1>
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
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
  <form class="p-4 border-t flex" on:submit|preventDefault={send}>
    <input
      class="flex-1 border rounded p-2 mr-2"
      bind:value={input}
      placeholder="Ask your question..."
    />
    <button class="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
  </form>
</div>

<style>
  form button:disabled { opacity: 0.5; }
</style>
