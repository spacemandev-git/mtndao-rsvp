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
  import { useQueryClient } from "@tanstack/svelte-query";
  import { api } from "$lib/services/apiClient";
  import toast from "svelte-french-toast";
  import IconTrash from "./icons/IconTrash.svelte";

  let {
    event,
    isAttending,
  }: {
    event: EventResponse;
    isAttending: boolean;
  } = $props();

  const mutate = mutations.rsvpEvent();
  const removeMutate = mutations.removeEvent();

  const queryClient = useQueryClient();
  async function createRsvp() {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");

    async function onSuccess(response: { msg: string }) {
      const tx = prepareSignedTransaction(response.msg);
      const result = await signTransaction(tx);

      if (result) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [api.fetch.getMyEvents.key],
          });
        }, 1000);
        toast.loading(
          "Reserved! Wait a few seconds for onchain confirmation (or refresh manually)",
          { duration: 1100 },
        );
      }

      onClose();
    }

    const payload = {
      event: event.publicKey,
      address: $walletStore.walletAddress,
    };

    $mutate.mutate(payload, { onSuccess });
  }

  async function removeEvent() {
    if (!$walletStore.walletAddress)
      return console.error("Wallet not connected");

    async function onSuccess(response: { msg: string }) {
      const tx = prepareSignedTransaction(response.msg);
      const result = await signTransaction(tx);

      if (result) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [api.fetch.getEvents.key],
          });
        }, 1000);
        toast.loading(
          "Reserved! Wait a few seconds for onchain confirmation (or refresh manually)",
          { duration: 1100 },
        );
      }
    }

    const payload = {
      event: event.publicKey,
      admin: $walletStore.walletAddress,
    };

    $removeMutate.mutate(payload, { onSuccess });
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
      <span class="opacity-10 text-gray-500 font-mono"> {uuid} </span>
    </div>
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      {#if isCreator}
        <button
          onclick={onOpen}
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Manage
        </button>
        <button
          class="w-10 bg-gray-200 px-3 rounded hover:bg-red-200"
          onclick={removeEvent}
        >
          <IconTrash />
        </button>
      {:else if isAttending}
        <div class="flex flex-col">
          <p class="mx-auto">RSVP'd!</p>
          <p class="mx-auto text-xs text-center">
            deposited: {parseInt(event.account.deposit, 16) / 1e9} SOL
          </p>
          <p class="mx-auto text-xs text-center">
            Show your wallet address to the host!
          </p>
          {#if event.account.stopped}
            <p class="mx-auto text-xs text-center">Event has ended</p>
          {/if}
        </div>
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
