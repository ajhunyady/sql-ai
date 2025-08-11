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
      rows="5"
      class="w-full border rounded-xl p-2 pr-16 resize-none
            focus:outline-none
            focus:ring-0 focus:ring-teal-500 focus:ring-offset-0
            focus:border-teal-500
            caret-teal-500"
      placeholder="Ask your question..."
      on:input={resize}
      on:keydown={handleKeydown}
    ></textarea>
    <button
    type="button"
    class="absolute right-2 bottom-2 bg-teal-500 text-white px-3 py-1 mb-2 rounded"
    on:click={send}
  >
    Ask
  </button>
</div>

