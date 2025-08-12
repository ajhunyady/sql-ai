<script lang="ts">
	import { Textarea, Button, Label } from 'flowbite-svelte';
	import { PaperPlaneSolid, ImageSolid, MicrophoneSolid, UploadSolid, DatabaseSolid } from 'flowbite-svelte-icons';
</script>

<section class="mb-10 w-full max-w-4xl">
	<div class="glass-panel-lg p-6 md:p-8 glow-effect">
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center">
					<div class="w-3 h-3 bg-green-500 rounded-full mr-3 pulse-animation"></div>
					<span class="text-sm text-slate-300 font-medium"
						>Connected to: <span class="text-blue-400" aria-label="All agents are connected">All agents</span></span
					>
				</div>
				<Button size="xs" class="icon-button hover:bg-slate-800/50" aria-label="Select data source"
					><DatabaseSolid class="mr-2" />
					Select Source
				</Button>
			</div>
			<Label for="query-input" class="sr-only">Query Input</Label>
			<Textarea
				id="query-input"
				class="w-full h-28 bg-slate-900/50 border border-blue-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300"
				placeholder="Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'"
				aria-describedby="query-help"
			></Textarea>
			<div id="query-help" class="sr-only">Enter your natural language query about your data and get instant insights</div>
		</div>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<Button size="lg" class="!p-2 icon-button hover:bg-slate-800/50" aria-label="Upload file">
					<UploadSolid />
				</Button>
			</div>
			<Button
				class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-xl flex items-center font-medium text-white button-hover glow-effect"
				aria-label="Submit query"
			>
				<PaperPlaneSolid class="mr-2" />
				Ask
			</Button>
		</div>
	</div>
</section>