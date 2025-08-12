<script lang="ts">
	import { Button, GradientButton, Avatar } from 'flowbite-svelte';
	import { CogSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
	import logo from '$lib/assets/coagent.png';
</script>

<header class="backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50 border-b border-blue-500/20">
	<div class="w-full px-6 py-4 flex items-center justify-between">
		<div class="flex items-center">
			<div class="text-xl mr-8 flex items-center font-semibold">
				<img src={logo} alt="Coagent Logo" class="w-8 h-8 mr-3" />
				<span class="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">CoAgent</span>
			</div>
			<div class="hidden md:flex space-x-1 text-sm">
				<div class="bg-slate-900 rounded-xl overflow-hidden flex">
					<Button color="blue" class="px-6 py-2"
						>Analyst</Button
					>
					<Button
						class="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
						>Developer</Button
					>
				</div>
			</div>
		</div>
		<div class="flex items-center space-x-3">
			<Button
				class="!p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
				aria-label="Settings"
			>
				<CogSolid />
			</Button>
			<div
				class="flex items-center cursor-pointer hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-300"
			>
				<Avatar
					src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
					alt="User avatar"
					class="w-8 h-8 border-2 border-blue-500/30"
				/>
				<ChevronDownOutline class="ml-2 text-xs text-slate-400" />
			</div>
		</div>
	</div>
</header>