<script>
  import { ArrowRightAltSolid } from 'flowbite-svelte-icons';
  export let title;
  export let time;
  export let active = false;
</script>

<div class="w-full">
  <div
    class="p-3 chat-hover rounded-xl cursor-pointer"
    class:border-l-2={active}
    class:border-blue-500={active}
    class:bg-blue-500-10={active}
  >
    <p class="text-sm font-medium text-slate-200">{title}</p>
    <p class="text-xs text-slate-400 mt-1 flex items-center">
      <span class:hidden={!active}><ArrowRightAltSolid class="text-green-500 mr-2 pulse-animation" /></span>
      {time}
    </p>
  </div>
</div>