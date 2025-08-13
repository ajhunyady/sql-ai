<script>
  import { AVATAR_URL } from '$lib/constants';
  let { message, timestamp } = $props();
</script>

<div class="flex items-start">
  <div class="w-10 h-10 rounded-xl overflow-hidden mr-4 mt-1 avatar-border">
    <img
      src={AVATAR_URL}
      alt="User avatar"
      class="w-full h-full object-cover"
    />
  </div>
  <div class="flex-1">
    <div class="message-container">
      <p class="text-slate-200">{message}</p>
    </div>
    <div class="text-xs text-slate-500 mt-2">{timestamp}</div>
  </div>
</div>