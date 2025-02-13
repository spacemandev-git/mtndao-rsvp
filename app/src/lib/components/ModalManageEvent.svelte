<script lang="ts">
  import type { EventType } from "$lib/types";
  import { truncateAddress } from "$lib/utils";
  import IconCal from "./icons/IconCal.svelte";
  import IconClock from "./icons/IconClock.svelte";
  import IconPin from "./icons/IconPin.svelte";
  import QrScanner from "./QrScanner.svelte";

  let {
    event,
    onClose,
  }: {
    event: EventType;
    onClose(): void;
  } = $props();

  // Mock RSVP data - replace with actual data from your backend
  let rsvpRecords = $state([
    {
      name: "Alice Johnson",
      address: "7KqpRwzkkeP4gJ4s4qDWvxSxv8gGzYLTBkRFqE5X5Ymm",
      status: "confirmed",
    },
    {
      name: "Bob Smith",
      address: "BzWpkrCbAzJM1kJH9YG8Pq7GYpJGLxUSJ4kX7Jd6oL2K",
      status: "unconfirmed",
    },
    {
      name: "Charlie Brown",
      address: "5tgHyL3FVvyZdQkPjVYRX9Q7YZZ7XfGzN8v2EchoZj1M",
      status: "confirmed",
    },
  ]);

  let activeTab = $state<"details" | "scanner">("scanner");

  function handleBurnToken(address: string) {
    // TODO: Implement burn token functionality
    console.log(`Burning token for address: ${address}`);
  }
</script>

{#snippet tabNavigation()}
  <div class="border-b border-gray-200 mb-4">
    <div class="flex space-x-4">
      <button
        class={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
          activeTab === "scanner"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
        onclick={() => (activeTab = "scanner")}
      >
        QR Scanner
      </button>
      <button
        class={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
          activeTab === "details"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
        onclick={() => (activeTab = "details")}
      >
        Event Details
      </button>
    </div>
  </div>
{/snippet}

{#snippet eventDescription()}
  <div class="space-y-3">
    <div class="flex items-center">
      <IconCal />
      <span>{event.date}</span>
    </div>
    <div class="flex items-center">
      <IconClock />
      <span>{event.time}</span>
    </div>
    <div class="flex items-center">
      <IconPin />
      <span class="break-words">{event.location}</span>
    </div>
    <p class="mt-4 text-gray-700">{event.description}</p>
  </div>
{/snippet}

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

    <!-- Event Summary -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{event.title}</h2>

      {@render tabNavigation()}

      <!-- Tab Content -->
      {#if activeTab === "details"}
        {@render eventDescription()}
      {:else}
        <div class="bg-gray-50 rounded-lg p-4">
          <QrScanner />
        </div>
      {/if}
    </div>

    <!-- RSVP Records -->
  </div>
</div>
