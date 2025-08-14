<script>
	import {
		CogSolid,
		ThumbsUpOutline,
		ThumbsDownOutline,
		DatabaseSolid,
		ShareNodesSolid,
		DownloadSolid
	} from 'flowbite-svelte-icons';

	let { timestamp, content, tableData, sqlQuery } = $props();
</script>

<div class="flex items-start">
	<div
		class="avatar-border mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800"
		role="img"
		aria-label="AI Assistant"
	>
		<CogSolid class="h-6 w-6 text-white" />
	</div>
	<div class="flex-1">
		<div class="message-container">
			{#if content}
				<p class="mb-6 text-slate-200">{content}</p>
			{/if}

			{#if tableData && tableData.length > 0}
				<div class="mb-6 overflow-x-auto">
					<table
						class="min-w-full overflow-hidden rounded-xl border border-blue-500/30 bg-slate-900/50"
					>
						<thead>
							<tr class="bg-gradient-to-r from-blue-600/20 to-blue-800/20">
								{#each Object.keys(tableData[0]) as header, headerIndex (headerIndex)}
									<th
										class="border-b border-blue-500/30 px-6 py-4 text-left font-semibold text-slate-200"
									>
										{header.charAt(0).toUpperCase() + header.slice(1)}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each tableData as row, index (index)}
								<tr class="transition-colors duration-300 hover:bg-blue-500/10">
									{#each Object.values(row) as value, colIndex (colIndex)}
										<td
											class="px-6 py-4 text-slate-200 {index < tableData.length - 1
												? 'border-b border-slate-700/50'
												: ''} {colIndex > 0 ? 'font-medium' : ''} {typeof value === 'string' &&
											value.includes('+')
												? 'text-green-400'
												: ''} {typeof value === 'string' &&
											value.includes('-') &&
											!value.includes('+')
												? 'text-red-400'
												: ''}"
										>
											{value}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			{#if sqlQuery}
				<div class="rounded-xl border border-blue-500/30 bg-slate-900/50 p-5">
					<div
						class="mb-3 flex items-center rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-800/20 p-3 text-sm text-slate-300"
					>
						<DatabaseSolid class="mr-2 h-4 w-4 text-slate-400" />
						<span>Generated SQL Query</span>
					</div>
					<pre class="overflow-x-auto font-mono text-sm text-slate-300">{sqlQuery}</pre>
				</div>
			{/if}
		</div>
		<div class="mt-3 flex items-center space-x-6">
			<div class="text-xs text-slate-500">{timestamp}</div>
			<div class="flex space-x-3">
				<button class="icon-button hover:text-green-400" aria-label="Like this response">
					<ThumbsUpOutline class="h-5 w-5" />
				</button>
				<button class="icon-button hover:text-red-400" aria-label="Dislike this response">
					<ThumbsDownOutline class="h-5 w-5" />
				</button>
				<button class="icon-button" aria-label="Share this response">
					<ShareNodesSolid class="h-5 w-5" />
				</button>
				<button class="icon-button" aria-label="Download response data">
					<DownloadSolid class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</div>
