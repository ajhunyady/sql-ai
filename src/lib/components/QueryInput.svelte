<script>
  import { Textarea, Button } from 'flowbite-svelte';
</script>

<section class="mb-10 w-full max-w-4xl">
  <div class="glass-effect rounded-2xl border border-blue-500/30 p-6 md:p-8 glow-effect">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-3 pulse-animation"></div>
          <span class="text-sm text-slate-300 font-medium"
            >Connected to: <span class="text-blue-400">SalesDB</span></span
          >
        </div>
        <Button class="text-sm text-slate-400 hover:text-blue-400 flex items-center transition-colors duration-300">
          <i class="fa-solid fa-database mr-2"></i>
          Change Source
        </Button>
      </div>
      <Textarea rows="4" class="w-full bg-slate-900/50 border border-blue-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300" placeholder="Ask a question about your data, e.g., 'Show me total sales by region for the last quarter'" />
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <Button class="p-3 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300" aria-label="Upload file">
          <i class="fa-solid fa-upload"></i>
        </Button>
      </div>
      <Button class="px-6 py-3 rounded-xl flex items-center font-medium text-white transition-all duration-300 transform hover:scale-105 glow-effect">
        <i class="fa-solid fa-paper-plane mr-2"></i>
        Ask Question
      </Button>
    </div>
  </div>
</section>