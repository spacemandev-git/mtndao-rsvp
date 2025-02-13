<script lang="ts">
  import type { EventType } from "$lib/types";

  let {
    onClose = () => {},
  }: {
    onClose?(): void;
  } = $props();
  import { mutations } from "$lib/services/apiQueries";
  import { walletStore } from "$lib/wallet/walletStore.svelte";

  let price = $state(0);

  let newEvent = $state<{
    name: string;
    description: string;
    lamports: number;
    admin: string;
  }>({
    name: "",
    description: "",
    lamports: 0,
    admin: $walletStore.walletAddress ?? "",
  });

  const mutate = mutations.createEvent();

  function createEvent() {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");
    // Handle event creation logic here
    console.log("Creating event:", newEvent);
    const response = $mutate.mutate({ ...newEvent, lamports: price * 1e8 });
    console.log({ response });
    onClose();
  }
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
    <h2 class="text-xl font-bold mb-4">Create New Event</h2>

    <form class="space-y-4" onsubmit={createEvent}>
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          bind:value={newEvent.name}
          placeholder="Event Title"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          bind:value={newEvent.description}
          placeholder="Event Description"
          required
          rows="3"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Deposit Cost
        </label>
        <input
          id="title"
          type="number"
          bind:value={price}
          placeholder="Event Title"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Date -->
      <!-- <div> -->
      <!--   <label for="date" class="block text-sm font-medium text-gray-700 mb-1"> -->
      <!--     Date -->
      <!--   </label> -->
      <!--   <input -->
      <!--     id="date" -->
      <!--     type="date" -->
      <!--     bind:value={newEvent.date} -->
      <!--     required -->
      <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
      <!--   /> -->
      <!-- </div> -->

      <!-- Time -->
      <!-- <div> -->
      <!--   <label for="time" class="block text-sm font-medium text-gray-700 mb-1"> -->
      <!--     Time -->
      <!--   </label> -->
      <!--   <input -->
      <!--     id="time" -->
      <!--     type="time" -->
      <!--     bind:value={newEvent.time} -->
      <!--     required -->
      <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
      <!--   /> -->
      <!-- </div> -->

      <!-- Location -->
      <!-- <div> -->
      <!--   <label -->
      <!--     for="location" -->
      <!--     class="block text-sm font-medium text-gray-700 mb-1" -->
      <!--   > -->
      <!--     Location -->
      <!--   </label> -->
      <!--   <input -->
      <!--     id="location" -->
      <!--     type="text" -->
      <!--     bind:value={newEvent.location} -->
      <!--     placeholder="Event Location" -->
      <!--     required -->
      <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
      <!--   /> -->
      <!-- </div> -->

      <!-- Buttons -->
      <div
        class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4"
      >
        <button
          type="button"
          onclick={onClose}
          class="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</div>
