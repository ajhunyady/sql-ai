<script>
  import { Button } from 'flowbite-svelte';
  export let title;
  export let time;
  export let active = false;
</script>

<div class="w-full" class:border-l-2={active} class:border-blue-500={active} class:bg-blue-500-10={active}>
  <Button class="w-full p-3 chat-hover rounded-xl" color={active ? "blue" : "gray"}>
    <div class="text-left">
      <p class="text-sm font-medium text-slate-200">{title}</p>
      <p class="text-xs text-slate-400 mt-1 flex items-center">
        <i
          class="fa-solid fa-circle text-green-500 text-xs mr-2 pulse-animation"
          class:hidden={!active}
        ></i>
        {time}
      </p>
    </div>
  </Button>
</div>