<script lang="ts">
  let {
    onClose = () => {},
  }: {
    onClose?(): void;
  } = $props();

  let newEventName = $state("");

  function createEvent() {
    // Handle event creation logic here
    onClose();
  }
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
    <h2 class="text-xl font-bold mb-4">Create New Event</h2>
    <input
      type="text"
      bind:value={newEventName}
      placeholder="Event Name"
      class="w-full p-2 border border-gray-300 rounded-md mb-4"
    />
    <div
      class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2"
    >
      <button
        onclick={onClose}
        class="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto"
      >
        Cancel
      </button>
      <button
        onclick={createEvent}
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
      >
        Create
      </button>
    </div>
  </div>
</div>
