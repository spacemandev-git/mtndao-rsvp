<script lang="ts">
  import {
    checkWallet,
    connectWallet,
    disconnectWallet,
  } from "$lib/wallet/helpers/connect-wallet";
  import { walletStore } from "$lib/wallet/walletStore.svelte";
  import { onMount } from "svelte";

  let showCreateModal = false;
  let newEventName = "";
  let events = [
    {
      id: 1,
      title: "Community Meetup",
      date: "2025-03-01",
      time: "18:00",
      location: "Downtown Hub",
      description: "Join us for our monthly community gathering!",
    },
    {
      id: 2,
      title: "Tech Workshop",
      date: "2025-03-15",
      time: "14:00",
      location: "Innovation Center",
      description: "Learn about the latest in web development",
    },
    {
      id: 3,
      title: "Networking Night",
      date: "2025-03-30",
      time: "19:00",
      location: "Skyline Lounge",
      description: "Connect with professionals in your industry",
    },
  ];

  function handleRSVP(eventId: number, response: string) {
    // TODO: Implement RSVP functionality
    console.log(`RSVP ${response} for event ${eventId}`);
  }

  function createEvent() {
    if (!newEventName.trim()) return;

    const newEvent = {
      id: events.length + 1,
      title: newEventName,
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      location: "TBD",
      description: "New event",
    };

    events = [...events, newEvent];
    newEventName = "";
    showCreateModal = false;
  }

  onMount(async () => {
    await checkWallet();
    const localStorageAddress = localStorage.getItem("rsvp-walletaddress");
    if (!localStorageAddress) return;
    if (window.solana) connectWallet();
  });
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Navigation Bar -->
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="text-xl font-bold">RSVP dApp</div>
        <div class="flex items-center space-x-4">
          <button
            on:click={() => (showCreateModal = true)}
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Create Event
          </button>
          <button
            on:click={async () => {
              if (!$walletStore.walletAddress) await connectWallet();
              else await disconnectWallet();
            }}
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            {$walletStore.walletAddress
              ? $walletStore.walletAddress
              : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Create Event Modal -->
  {#if showCreateModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Create New Event</h2>
        <input
          type="text"
          bind:value={newEventName}
          placeholder="Event Name"
          class="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div class="flex justify-end space-x-2">
          <button
            on:click={() => (showCreateModal = false)}
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            on:click={createEvent}
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">Upcoming Events</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each events as event (event.id)}
        <div
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">
              {event.title}
            </h2>
            <div class="text-gray-600 mb-4">
              <p class="flex items-center mb-1">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {event.date}
              </p>
              <p class="flex items-center mb-1">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {event.time}
              </p>
              <p class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.location}
              </p>
            </div>
            <p class="text-gray-700 mb-4">{event.description}</p>
            <div class="flex space-x-2">
              <button
                on:click={() => handleRSVP(event.id, "rsvp")}
                class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                RSVP
              </button>
              <button
                on:click={() => handleRSVP(event.id, "confirm")}
                class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Confirm RSVP
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
