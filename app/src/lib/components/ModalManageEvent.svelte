<script lang="ts">
  import type { EventType } from "$lib/types";

  let {
    event,
    onClose,
  }: {
    event: EventType;
    onClose(): void;
  } = $props();
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 relative">
    <button
      class="absolute right-3 top-3 font-mono bg-gray-100 p-2 rounded-full min-w-10"
      onclick={onClose}
    >
      x
    </button>
    <!-- CONTENT -->
  </div>
</div>
