<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let value = '';
  const dispatch = createEventDispatcher();
  let textarea;

  function send() {
    if (!value.trim()) return;
    dispatch('ask');
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function resize() {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  onMount(resize);
</script>

<div class="relative w-full">
  <textarea
    bind:this={textarea}
    bind:value
    rows="4"
    class="w-full border rounded p-2 pr-16 resize-none"
    placeholder="Ask your question..."
    on:input={resize}
    on:keydown={handleKeydown}
  />
  <button
    type="button"
    class="absolute right-2 bottom-2 bg-blue-500 text-white px-3 py-1 rounded"
    on:click={send}
  >
    Ask
  </button>
</div>

