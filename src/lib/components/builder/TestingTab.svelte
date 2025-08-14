<script lang="ts">
	import { Input, Textarea, Button } from 'flowbite-svelte';
	import { ArrowRightOutline, RefreshOutline } from 'flowbite-svelte-icons';
	import type { Agent } from '$lib/models/agent';

	let { agent = $bindable<Agent>() } = $props();

	let testInput = $state('');
	let testOutput = $state('');
	let isTesting = $state(false);
	let testHistory = $state<{ input: string; output: string; timestamp: Date }[]>([]);

	async function runTest() {
		if (!testInput) return;

		isTesting = true;
		testOutput = '';

		// Simulate API call to test the agent
		setTimeout(() => {
			const responses = [
				'Based on the data I analyzed, sales have increased by 15% this quarter compared to the previous one.',
				'I found 3 new customer inquiries that require immediate attention in the support database.',
				'The top performing product category is electronics with $2.3M in revenue.',
				"I've identified a potential data inconsistency in the user records that needs review.",
				'The system is currently operating at 92% efficiency with no critical issues detected.'
			];

			testOutput = responses[Math.floor(Math.random() * responses.length)];
			testHistory = [
				{ input: testInput, output: testOutput, timestamp: new Date() },
				...testHistory
			];
			isTesting = false;
		}, 1500);
	}

	function clearHistory() {
		testHistory = [];
	}
</script>

<div class="space-y-8">
	<h2 class="text-xl font-bold text-white">Testing Playground</h2>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div>
			<h3 class="mb-4 text-lg font-medium text-slate-300">Test Input</h3>
			<div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
				<Textarea
					bind:value={testInput}
					placeholder="Enter a test query for your agent..."
					rows={6}
					class="mb-4 w-full rounded border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-slate-200"
				/>
				<div class="flex justify-end">
					<Button color="blue" onclick={runTest} disabled={isTesting || !testInput}>
						{#if isTesting}
							<RefreshOutline class="mr-2 h-4 w-4 animate-spin" />
							Testing...
						{:else}
							<ArrowRightOutline class="mr-2 h-4 w-4" />
							Run Test
						{/if}
					</Button>
				</div>
			</div>

			<div class="mt-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-medium text-slate-300">Test History</h3>
					{#if testHistory.length > 0}
						<Button color="gray" size="sm" onclick={clearHistory}>Clear History</Button>
					{/if}
				</div>

				{#if testHistory.length === 0}
					<div class="rounded-lg border border-slate-700/30 bg-slate-800/30 p-8 text-center">
						<p class="text-slate-500">No test history yet</p>
						<p class="mt-2 text-sm text-slate-600">Run a test to see results here</p>
					</div>
				{:else}
					<div class="max-h-96 space-y-4 overflow-y-auto">
						{#each testHistory as test, i}
							<div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
								<div class="mb-2 flex items-start justify-between">
									<p class="font-medium text-slate-300">Test #{testHistory.length - i}</p>
									<span class="text-xs text-slate-500">
										{test.timestamp.toLocaleTimeString()}
									</span>
								</div>
								<p class="mb-2 text-sm text-slate-400">Input:</p>
								<p class="mb-3 text-slate-300">{test.input}</p>
								<p class="mb-2 text-sm text-slate-400">Output:</p>
								<p class="text-slate-300">{test.output}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div>
			<h3 class="mb-4 text-lg font-medium text-slate-300">Test Output</h3>
			<div class="h-96 overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
				{#if isTesting}
					<div class="flex h-full flex-col items-center justify-center">
						<RefreshOutline class="mb-4 h-8 w-8 animate-spin text-blue-500" />
						<p class="text-slate-500">Testing agent...</p>
					</div>
				{:else if testOutput}
					<div>
						<p class="mb-2 text-sm text-slate-400">Response:</p>
						<p class="text-slate-300">{testOutput}</p>
					</div>
				{:else}
					<div class="flex h-full flex-col items-center justify-center text-center">
						<div class="mb-4 rounded-full bg-slate-700/50 p-4">
							<ArrowRightOutline class="h-8 w-8 text-slate-500" />
						</div>
						<p class="text-slate-500">Run a test to see the agent's response</p>
						<p class="mt-2 text-sm text-slate-600">
							Enter a query and click "Run Test" to see how your agent responds
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
