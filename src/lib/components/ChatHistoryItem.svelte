<script>
  import { ArrowRightAltSolid } from 'flowbite-svelte-icons';
  let { title, time, active = false } = $props();
</script>

<div class="w-full" role="listitem">
  <button
    class="w-full p-3 chat-hover rounded-xl cursor-pointer text-left"
    class:border-l-2={active}
    class:border-blue-500={active}
    class:bg-blue-500-10={active}
    aria-pressed={active}
    aria-label="Open conversation: {title}"
  >
    <p class="text-sm font-medium text-slate-200">{title}</p>
    <p class="text-xs text-slate-300 mt-1 flex items-center">
      <span class:hidden={!active} aria-hidden="true"><ArrowRightAltSolid class="text-green-500 mr-2 pulse-animation" /></span>
      <time>{time}</time>
    </p>
  </button>
</div>