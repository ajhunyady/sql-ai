<script>
  import { Button, Avatar } from 'flowbite-svelte';
</script>

<header class="glass-effect sticky top-0 z-50 border-b border-blue-500/20">
  <div class="w-full px-6 py-4 flex items-center justify-between">
    <div class="flex items-center">
      <div class="text-xl mr-8 flex items-center font-semibold">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3"
        >
          <i class="fa-solid fa-database text-white text-sm"></i>
        </div>
        <span class="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
          >DataQuery AI</span
        >
      </div>
      <div class="hidden md:flex space-x-1 text-sm gradient-border">
        <div class="bg-slate-900 rounded-xl overflow-hidden flex">
          <Button variant="gradient" gradient="blue" class="px-6 py-2 text-white font-medium">Analyst</Button>
          <Button class="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300">Developer</Button>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <Button color="gray" class="p-3 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300" aria-label="Notifications">
        <i class="fa-solid fa-bell"></i>
      </Button>
      <Button color="gray" class="p-3 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300" aria-label="Settings">
        <i class="fa-solid fa-gear"></i>
      </Button>
      <div
        class="flex items-center cursor-pointer hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-300"
      >
        <Avatar src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="User avatar" rounded class="w-8 h-8 border-2 border-blue-500/30" />
        <i class="fa-solid fa-chevron-down ml-2 text-xs text-slate-400"></i>
      </div>
    </div>
  </div>
</header>