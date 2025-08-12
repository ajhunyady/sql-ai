<script lang="ts">
	import { Button, GradientButton, Avatar } from 'flowbite-svelte';
	import { CogSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
	import logo from '$lib/assets/coagent.png';
	import { AVATAR_URL, APP_NAME } from '$lib/constants';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// Determine active section based on current route
	$: activeSection = page.url.pathname === '/analyst' ? 'analyst' : 
	                   page.url.pathname === '/builder' ? 'builder' : 
	                   'analyst';

	function navigateToSection(section: string) {
		goto(`/${section}`);
	}
</script>

<header class="backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50 border-b border-blue-500/20">
	<div class="w-full px-6 py-4 flex items-center justify-between">
		<div class="flex items-center">
			<div class="text-xl mr-8 flex items-center font-semibold">
				<img src={logo} alt="Coagent Logo" class="w-8 h-8 mr-3" />
				<span class="gradient-text">{APP_NAME}</span>
			</div>
			<div class="hidden md:flex space-x-1 text-sm">
				<div class="bg-slate-900 rounded-xl overflow-hidden flex">
					<Button
						color={activeSection === 'analyst' ? 'blue' : 'none'}
						class="px-6 py-2 {activeSection === 'analyst' ? '' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-all duration-300"
						onclick={() => navigateToSection('analyst')}
						>Analyst</Button
					>
					<Button
						color={activeSection === 'builder' ? 'blue' : 'none'}
						class="px-6 py-2 {activeSection === 'builder' ? '' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-all duration-300"
						onclick={() => navigateToSection('builder')}
						>Builder</Button
					>
				</div>
			</div>
		</div>
		<div class="flex items-center space-x-3">
			<Button
				class="!p-2 icon-button hover:bg-slate-800/50 rounded-lg"
				aria-label="Open settings menu"
			>
				<CogSolid />
			</Button>
			<div
				class="flex items-center cursor-pointer hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-300"
			>
				<Avatar
					src={AVATAR_URL}
					alt="User profile picture"
					class="w-8 h-8 avatar-border"
				/>
				<ChevronDownOutline class="ml-2 text-xs text-slate-400" />
			</div>
		</div>
	</div>
</header>