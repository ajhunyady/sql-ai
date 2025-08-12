<script lang="ts">
	import { CogSolid, ThumbsUpOutline, ThumbsDownOutline, DatabaseSolid, ShareNodesSolid, DownloadSolid } from 'flowbite-svelte-icons';
	
	let { timestamp } = $props();
</script>

<div class="flex items-start">
  <div
    class="w-10 h-10 rounded-xl mr-4 mt-1 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center avatar-border"
    role="img"
    aria-label="AI Assistant"
  >
    <CogSolid class="w-6 h-6 text-white" />
  </div>
  <div class="flex-1">
    <div class="message-container">
      <p class="mb-6 text-slate-200">Here are the top 5 customers by revenue for Q1 2025:</p>

      <div class="overflow-x-auto mb-6">
        <table
          class="min-w-full bg-slate-900/50 border border-blue-500/30 rounded-xl overflow-hidden"
        >
          <thead>
            <tr class="bg-gradient-to-r from-blue-600/20 to-blue-800/20">
              <th
                class="px-6 py-4 border-b border-blue-500/30 text-left font-semibold text-slate-200"
                >Customer</th
              >
              <th
                class="px-6 py-4 border-b border-blue-500/30 text-right font-semibold text-slate-200"
                >Revenue</th
              >
              <th
                class="px-6 py-4 border-b border-blue-500/30 text-right font-semibold text-slate-200"
                >YoY Change</th
              >
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-blue-500/10 transition-colors duration-300">
              <td class="px-6 py-4 border-b border-slate-700/50 text-slate-200"
                >Acme Corporation</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-slate-200 font-medium"
                >$1,245,000</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-green-400 font-medium"
                >+12.3%</td
              >
            </tr>
            <tr class="hover:bg-blue-500/10 transition-colors duration-300">
              <td class="px-6 py-4 border-b border-slate-700/50 text-slate-200">TechNova Inc.</td>
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-slate-200 font-medium"
                >$982,500</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-green-400 font-medium"
                >+8.7%</td
              >
            </tr>
            <tr class="hover:bg-blue-500/10 transition-colors duration-300">
              <td class="px-6 py-4 border-b border-slate-700/50 text-slate-200"
                >Global Systems</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-slate-200 font-medium"
                >$875,320</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-red-400 font-medium"
                >-2.1%</td
              >
            </tr>
            <tr class="hover:bg-blue-500/10 transition-colors duration-300">
              <td class="px-6 py-4 border-b border-slate-700/50 text-slate-200"
                >Nexus Partners</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-slate-200 font-medium"
                >$743,900</td
              >
              <td class="px-6 py-4 border-b border-slate-700/50 text-right text-green-400 font-medium"
                >+15.8%</td
              >
            </tr>
            <tr class="hover:bg-blue-500/10 transition-colors duration-300">
              <td class="px-6 py-4 text-slate-200">Quantum Enterprises</td>
              <td class="px-6 py-4 text-right text-slate-200 font-medium">$698,450</td>
              <td class="px-6 py-4 text-right text-green-400 font-medium">+5.3%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-900/50 p-5 rounded-xl border border-blue-500/30">
        <div
          class="bg-gradient-to-r from-blue-600/20 to-blue-800/20 text-slate-300 p-3 rounded-lg mb-3 text-sm flex items-center"
        >
          <DatabaseSolid class="w-4 h-4 mr-2 text-slate-400" />
          <span>Generated SQL Query</span>
        </div>
        <pre
          class="text-sm text-slate-300 overflow-x-auto font-mono"
>SELECT c.customer_name AS Customer,
       SUM(s.amount) AS Revenue,
       (SUM(s.amount) - LAG_REVENUE) / LAG_REVENUE * 100 AS YoY_Change
FROM sales s
JOIN customers c ON s.customer_id = c.id
WHERE s.date BETWEEN '2025-01-01' AND '2025-03-31'
GROUP BY c.customer_name
ORDER BY Revenue DESC
LIMIT 5;</pre>
      </div>
    </div>
    <div class="flex items-center mt-3 space-x-6">
      <div class="text-xs text-slate-500">{timestamp}</div>
      <div class="flex space-x-3">
        <button
          class="icon-button hover:text-green-400"
          aria-label="Like this response"
        >
          <ThumbsUpOutline class="w-5 h-5" />
        </button>
        <button
          class="icon-button hover:text-red-400"
          aria-label="Dislike this response"
        >
          <ThumbsDownOutline class="w-5 h-5" />
        </button>
        <button
          class="icon-button"
          aria-label="Share this response"
        >
          <ShareNodesSolid class="w-5 h-5" />
        </button>
        <button
          class="icon-button"
          aria-label="Download response data"
        >
          <DownloadSolid class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</div>