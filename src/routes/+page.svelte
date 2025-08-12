<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/analyst', { replaceState: true });
  });
</script>

<!-- This page redirects to /analyst -->
