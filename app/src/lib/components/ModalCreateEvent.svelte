<script lang="ts">
  import { VersionedTransaction } from "@solana/web3.js";
  import { mutations } from "$lib/services/apiQueries";
  import { walletStore } from "$lib/wallet/walletStore.svelte";
  import {
    prepareSignedTransaction,
    signTransaction,
  } from "$lib/wallet/helpers/sign-transaction";

  let {
    onClose = () => {},
  }: {
    onClose?(): void;
  } = $props();

  let price = $state(0.01);
  let tx: VersionedTransaction | undefined = $state(undefined);

  let newEvent = $state<{
    name: string;
    description: string;
    lamports: number;
    admin: string;
  }>({
    name: "",
    description: "",
    lamports: 1 * 1e8,
    admin: $walletStore.walletAddress ?? "",
  });

  const mutate = mutations.createEvent();

  async function createEvent() {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");

    async function onSuccess(response: { event: string; msg: string }) {
      tx = prepareSignedTransaction(response.msg);
      await signTransaction(tx);
      onClose();
    }

    const payload = { ...newEvent, lamports: (price * 1e8).toString() };
    $mutate.mutate(payload, { onSuccess });
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

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Deposit Cost
        </label>
        <input
          id="title"
          type="number"
          step="any"
          bind:value={price}
          placeholder="Event Title"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

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
          submit
        </button>
      </div>
    </form>
  </div>
</div>
