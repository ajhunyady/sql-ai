<script>
	import { ArrowRightAltSolid } from 'flowbite-svelte-icons';
	let { title, time, active = false, onclick } = $props();
</script>

<div class="w-full" role="listitem">
	<button
		class="chat-hover w-full cursor-pointer rounded-xl p-3 text-left"
		class:border-l-2={active}
		class:border-blue-500={active}
		class:bg-blue-500-10={active}
		aria-pressed={active}
		aria-label="Open conversation: {title}"
		{onclick}
	>
		<p class="text-sm font-medium text-slate-200">{title}</p>
		<p class="mt-1 flex items-center text-xs text-slate-300">
			<span class:hidden={!active} aria-hidden="true"
				><ArrowRightAltSolid class="pulse-animation mr-2 text-green-500" /></span
			>
			<time>{time}</time>
		</p>
	</button>
</div>
