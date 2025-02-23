<script lang="ts">
  import type { EventResponse } from "$lib/types";
  import QrScanner from "./QrScanner.svelte";
  import { mutations } from "$lib/services/apiQueries";
  import { walletStore } from "$lib/wallet/walletStore.svelte";
  import {
    prepareSignedTransaction,
    signTransaction,
  } from "$lib/wallet/helpers/sign-transaction";

  let {
    event,
    onClose,
  }: {
    event: EventResponse;
    onClose(): void;
  } = $props();

  let solanaAddress = $state("");

  const mutate = mutations.confirmRsvp();

  async function confirmRsvp(action: "burn" | "confirm") {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");

    async function onSuccess(response: { msg: string }) {
      const tx = prepareSignedTransaction(response.msg);
      await signTransaction(tx);
      onClose();
    }

    const payload = {
      event: event.publicKey,
      attendee: solanaAddress,
      burn: action === "burn",
      admin: $walletStore.walletAddress,
    };

    $mutate.mutate(payload, { onSuccess });
  }
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <div
    class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-y-auto"
  >
    <button
      class="absolute right-3 top-3 font-mono bg-gray-100 p-2 rounded-full min-w-10 hover:bg-gray-200"
      onclick={onClose}
    >
      x
    </button>

    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{event.account.eventName}</h2>
      <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
        <QrScanner bind:solanaAddress />
        <div>
          <input
            class="bg-white p-2 w-full"
            placeholder="Solana Address"
            bind:value={solanaAddress}
          />
        </div>
        <div class="flex justify-between gap-2">
          <button
            class="bg-green-100 py-2 px-4 rounded w-full"
            onclick={() => confirmRsvp("confirm")}
          >
            Confirm (refund deposit)
          </button>
          <button
            class="bg-red-100 py-2 px-4 rounded w-full"
            onclick={() => confirmRsvp("burn")}
          >
            ...or Burn Address (claim deposit)
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
