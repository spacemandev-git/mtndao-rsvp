<script lang="ts">
  import ModalManageEvent from "./ModalManageEvent.svelte";
  import type { EventResponse } from "$lib/types";
  import { walletStore } from "$lib/wallet/walletStore.svelte";
  import { mutations } from "$lib/services/apiQueries";
  import { uuidToEmojis } from "$lib/utils";
  import {
    prepareSignedTransaction,
    signTransaction,
  } from "$lib/wallet/helpers/sign-transaction";

  let {
    event,
  }: {
    event: EventResponse;
  } = $props();

  const mutate = mutations.rsvpEvent();

  async function createRsvp() {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");

    async function onSuccess(response: { msg: string }) {
      const tx = prepareSignedTransaction(response.msg);
      await signTransaction(tx);
      onClose();
    }

    const payload = {
      event: event.publicKey,
      address: $walletStore.walletAddress,
    };

    $mutate.mutate(payload, { onSuccess });
  }

  // async function signTransaction() {
  //   const connection = new Connection(
  //     "https://nerissa-3i7at8-fast-mainnet.helius-rpc.com/",
  //   );

  //   if (!tx) return console.error("No transaction provided");

  //   const wallet = window.solana;
  //   if (!wallet) return console.error("Wallet not connected");

  //   try {
  //     console.log("Transaction before signing:", tx);

  //     // Request signature from the wallet
  //     const signedTx = await (wallet as any).signTransaction(tx);
  //     console.log("Signed transaction:", signedTx);

  //     // Send the transaction
  //     const txId = await connection.sendRawTransaction(signedTx.serialize());
  //     console.log("Transaction ID:", txId);

  //     return txId;
  //   } catch (err) {
  //     console.error("Transaction signing error:", err);
  //   }
  // }

  const isCreator = $derived(
    $walletStore.walletAddress === event.account.admin,
  );

  let isOpen = $state(false);
  function onOpen() {
    isOpen = true;
  }
  function onClose() {
    isOpen = false;
  }

  const eventName = $derived(event.account.eventName.split("--")[0]);
  const emojis = $derived(uuidToEmojis(event.account.eventName.split("--")[1]));
</script>

{#if isOpen}
  <ModalManageEvent {event} {onClose} />
{/if}

<div
  class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
>
  <div class="p-4 sm:p-6">
    <h2 class="text-xl font-semibold mb-2">
      {eventName}
    </h2>
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      {#if isCreator}
        <button
          onclick={onOpen}
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Manage
        </button>
      {:else}
        <button
          onclick={createRsvp}
          class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          RSVP
        </button>
      {/if}
    </div>
  </div>
</div>
