<script lang="ts">
	import { Textarea, Button, Label } from 'flowbite-svelte';
	import { PaperPlaneSolid, ImageSolid, MicrophoneSolid, UploadSolid, DatabaseSolid } from 'flowbite-svelte-icons';
</script>

<section class="mb-10 w-full max-w-4xl">
	<div
		class="backdrop-blur-xl bg-slate-950/80 rounded-2xl border border-blue-500/30 p-6 md:p-8 glow-effect"
	>
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center">
					<div class="w-3 h-3 bg-green-500 rounded-full mr-3 pulse-animation"></div>
					<span class="text-sm text-slate-300 font-medium"
						>Connected to: <span class="text-blue-400">All agents</span></span
					>
				</div>
				<Button size="xs" class="text-slate-400 hover:text-blue-400 hover:bg-slate-800/50"
					><DatabaseSolid class="mr-2" />
					Select Source
				</Button>
			</div>
			<Label class="sr-only">Query Input</Label>
			<Textarea
				class="w-full h-28 bg-slate-900/50 border border-blue-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300"
				placeholder="Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'"
			></Textarea>
		</div>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<Button size="lg" class="!p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50">
					<UploadSolid />
				</Button>
			</div>
			<Button
				class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-xl flex items-center font-medium text-white transition-all duration-300 transform hover:scale-105 glow-effect"
			>
				<PaperPlaneSolid class="mr-2" />
				Ask
			</Button>
		</div>
	</div>
</section>