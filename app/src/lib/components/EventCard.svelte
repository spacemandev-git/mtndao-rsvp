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
    isAttending,
  }: {
    event: EventResponse;
    isAttending: boolean;
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

  const [name, uuid] = $derived(event.account.eventName.split("--"));
  const eventName = $derived(name);
  const emojis = $derived(uuidToEmojis(uuid)); // show unique record identity
</script>

{#if isOpen}
  <ModalManageEvent {event} {onClose} />
{/if}

<!-- TODO: make card diff color if attending -->
<div
  class={`${isAttending ? "bg-green-100" : "bg-white"} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between">
      <h2 class="text-xl font-semibold mb-2">
        {eventName}
      </h2>
      {#await emojis then emojiCode}
        <span class="opacity-20"> {emojiCode} </span>
      {/await}
    </div>
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      {#if isCreator}
        <button
          onclick={onOpen}
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Manage
        </button>
      {:else if isAttending}
        <p class="mx-auto">Reserved!</p>
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
