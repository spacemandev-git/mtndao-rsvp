<script lang="ts">
  import EventCard from "$lib/components/EventCard.svelte";
  import ModalCreateEvent from "$lib/components/ModalCreateEvent.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import type { EventType } from "$lib/types";
  import {
    checkWallet,
    connectWallet,
  } from "$lib/wallet/helpers/connect-wallet";
  import { onMount } from "svelte";
  import { queries } from "$lib/services/apiQueries";

  let showCreateModal = $state(false);

  const query = queries.getEvents();

  onMount(async () => {
    await checkWallet();
    const localStorageAddress = localStorage.getItem("rsvp-walletaddress");
    if (!localStorageAddress) return;
    if (window.solana) connectWallet();
  });
</script>

<!-- Create Event Modal -->
{#if showCreateModal}
  <ModalCreateEvent onClose={() => (showCreateModal = false)} />
{/if}

<div class="min-h-screen bg-gray-100">
  <Nav
    onOpen={() => {
      showCreateModal = true;
    }}
  />

  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">Upcoming Events</h1>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#if $query.isLoading}
        <p>Loading...</p>
      {:else if $query.isError}
        <p>Error: {$query.error.message}</p>
      {:else if $query.isSuccess}
        {#each $query.data as events}
          {#each events as event (event.id)}
            <EventCard {event} />
          {/each}
        {/each}
      {/if}
    </div>
  </div>
</div>
