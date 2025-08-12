<script>
  export let message;
  export let timestamp;
</script>

<div class="flex items-start">
  <div class="w-10 h-10 rounded-xl overflow-hidden mr-4 mt-1 border-2 border-dark-blue-500/30">
    <img
      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
      alt="User avatar"
    />
  </div>
  <div class="flex-1">
    <div class="glass-effect rounded-xl p-5 border border-dark-blue-500/30">
      <p class="text-slate-200">{message}</p>
    </div>
    <div class="text-xs text-slate-500 mt-2">{timestamp}</div>
  </div>
</div>