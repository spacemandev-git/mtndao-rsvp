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

  let activeTab = $state<'details' | 'scanner'>('details');

  function handleBurnToken(address: string) {
    // TODO: Implement burn token functionality
    console.log(`Burning token for address: ${address}`);
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

    <!-- Event Summary -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{event.title}</h2>
      
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-4">
        <div class="flex space-x-4">
          <button
            class={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onclick={() => activeTab = 'details'}
          >
            Event Details
          </button>
          <button
            class={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'scanner'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onclick={() => activeTab = 'scanner'}
          >
            QR Scanner
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      {#if activeTab === 'details'}
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
      {:else}
        <div class="bg-gray-50 rounded-lg p-4">
          <QrScanner />
        </div>
      {/if}
    </div>

    <!-- RSVP Records -->
    <div>
      <h3 class="text-xl font-semibold mb-4">RSVP Records</h3>
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Name</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Address</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Status</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Actions</th
              >
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each rsvpRecords as record}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm"
                  >{record.name}</td
                >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {truncateAddress(record.address)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      record.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onclick={() => handleBurnToken(record.address)}
                    class="text-red-600 hover:text-red-900 font-medium"
                  >
                    Burn Token
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="grid gap-4 sm:hidden">
        {#each rsvpRecords as record}
          <div class="bg-white rounded-lg shadow p-4 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">{record.name}</h4>
                <p class="text-sm font-mono text-gray-600 mt-1">
                  {truncateAddress(record.address)}
                </p>
              </div>
              <span
                class={`px-2 py-1 text-xs font-semibold rounded-full
                ${
                  record.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {record.status}
              </span>
            </div>
            <div class="pt-2 border-t border-gray-100">
              <button
                onclick={() => handleBurnToken(record.address)}
                class="w-full text-center py-2 text-red-600 hover:text-red-900 font-medium text-sm"
              >
                Burn Token
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
