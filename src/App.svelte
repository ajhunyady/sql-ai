<script>
  import ChatHome from './lib/ChatHome.svelte';
  import Development from './lib/Development.svelte';
  import { currentPage } from './stores.js';
</script>

{#if $currentPage === 'home'}
  <ChatHome />
{:else}
  <Development />
{/if}
