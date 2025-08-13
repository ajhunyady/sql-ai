<script lang="ts">
	import { Button, GradientButton, Avatar } from 'flowbite-svelte';
	import { CogSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
	import logo from '$lib/assets/coagent.png';
	import { AVATAR_URL, APP_NAME } from '$lib/constants';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// Determine active section based on current route
	$: activeSection =
		page.url.pathname === '/analyst'
			? 'analyst'
			: page.url.pathname === '/builder'
				? 'builder'
				: page.url.pathname === '/demo'
					? 'demo'
					: 'analyst';

	function navigateToSection(section: string) {
		goto(`/${section}`);
	}
</script>

<header class="sticky top-0 z-50 border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
	<div class="flex w-full items-center justify-between px-6 py-4">
		<div class="flex items-center">
			<div class="mr-8 flex items-center text-xl font-semibold">
				<img src={logo} alt="Coagent Logo" class="mr-3 h-8 w-8" />
				<span class="gradient-text">{APP_NAME}</span>
			</div>
			<div class="hidden space-x-1 text-sm md:flex">
				<div class="flex overflow-hidden rounded-xl bg-slate-900">
					<Button
						color={activeSection === 'analyst' ? 'blue' : 'gray'}
						class="px-6 py-2 {activeSection === 'analyst'
							? ''
							: 'text-slate-400 hover:bg-slate-800 hover:text-white'} transition-all duration-300"
						onclick={() => navigateToSection('analyst')}>Analyst</Button
					>
					<Button
						color={activeSection === 'builder' ? 'blue' : 'gray'}
						class="px-6 py-2 {activeSection === 'builder'
							? ''
							: 'text-slate-400 hover:bg-slate-800 hover:text-white'} transition-all duration-300"
						onclick={() => navigateToSection('builder')}>Builder</Button
					>
					<Button
						color={activeSection === 'demo' ? 'blue' : 'gray'}
						class="px-6 py-2 {activeSection === 'demo'
							? ''
							: 'text-slate-400 hover:bg-slate-800 hover:text-white'} transition-all duration-300"
						onclick={() => navigateToSection('demo')}>Demo</Button
					>
				</div>
			</div>
		</div>
		<div class="flex items-center space-x-3">
			<Button
				class="icon-button rounded-lg !p-2 hover:bg-slate-800/50"
				aria-label="Open settings menu"
			>
				<CogSolid />
			</Button>
			<div
				class="flex cursor-pointer items-center rounded-lg p-2 transition-all duration-300 hover:bg-slate-800/50"
			>
				<Avatar src={AVATAR_URL} alt="User profile picture" class="avatar-border h-8 w-8" />
				<ChevronDownOutline class="ml-2 text-xs text-slate-400" />
			</div>
		</div>
	</div>
</header>
