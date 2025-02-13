<script lang="ts">
  import EventCard from "$lib/components/EventCard.svelte";
  import ModalCreateEvent from "$lib/components/ModalCreateEvent.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import {
    checkWallet,
    connectWallet,
  } from "$lib/wallet/helpers/connect-wallet";
  import { onMount } from "svelte";

  let showCreateModal = $state(false);
  let newEventName = $state("");
  let events = $state([
    {
      id: "1",
      title: "Community Meetup",
      date: "2025-03-01",
      time: "18:00",
      location: "Downtown Hub",
      description: "Join us for our monthly community gathering!",
    },
    {
      id: "2",
      title: "Tech Workshop",
      date: "2025-03-15",
      time: "14:00",
      location: "Innovation Center",
      description: "Learn about the latest in web development",
    },
    {
      id: "3",
      title: "Networking Night",
      date: "2025-03-30",
      time: "19:00",
      location: "Skyline Lounge",
      description: "Connect with professionals in your industry",
    },
  ]);

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
      {#each events as event (event.id)}
        <EventCard {event} />
      {/each}
    </div>
  </div>
</div>
