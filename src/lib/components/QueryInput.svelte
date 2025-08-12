<script>
  import { Textarea, Button } from 'flowbite-svelte';
</script>

<section class="mb-10 w-full max-w-4xl">
  <div class="glass-effect rounded-2xl border border-dark-blue-500/30 p-6 md:p-8 glow-effect">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-3 pulse-animation"></div>
          <span class="text-sm text-slate-300 font-medium"
            >Connected to: <span class="text-dark-blue-400">SalesDB</span></span
          >
        </div>
        <button
          class="text-sm text-slate-400 hover:text-dark-blue-400 flex items-center transition-colors duration-300"
        >
          <i class="fa-solid fa-database mr-2"></i>
          Change Source
        </button>
      </div>
      <textarea
        class="w-full h-28 bg-slate-900/50 border border-dark-blue-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-dark-blue-500 focus:ring-2 focus:ring-dark-blue-500/20 resize-none transition-all duration-300"
        placeholder="Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'"
      ></textarea>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          class="p-3 text-slate-400 hover:text-dark-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
        >
          <i class="fa-solid fa-microphone"></i>
        </button>
        <button
          class="p-3 text-slate-400 hover:text-dark-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
        >
          <i class="fa-solid fa-upload"></i>
        </button>
        <button
          class="p-3 text-slate-400 hover:text-dark-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
        >
          <i class="fa-solid fa-image"></i>
        </button>
      </div>
      <button
        class="bg-gradient-to-r from-dark-blue-600 to-dark-blue-700 hover:from-dark-blue-500 hover:to-dark-blue-600 px-6 py-3 rounded-xl flex items-center font-medium text-white transition-all duration-300 transform hover:scale-105 glow-effect"
      >
        <i class="fa-solid fa-paper-plane mr-2"></i>
        Ask Question
      </button>
    </div>
  </div>
</section>