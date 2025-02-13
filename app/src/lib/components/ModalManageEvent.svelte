<script lang="ts">
  import type { EventType } from "$lib/types";
  import { truncateAddress } from "$lib/utils";

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

  function handleBurnToken(address: string) {
    // TODO: Implement burn token functionality
    console.log(`Burning token for address: ${address}`);
  }
</script>

<div
  class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-y-auto">
    <button
      class="absolute right-3 top-3 font-mono bg-gray-100 p-2 rounded-full min-w-10 hover:bg-gray-200"
      on:click={onClose}
    >
      x
    </button>

    <!-- Event Summary -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">{event.title}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
        <div class="flex items-center">
          <svg
            class="w-5 h-5 mr-2 flex-shrink-0"
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
          <span>{event.date}</span>
        </div>
        <div class="flex items-center">
          <svg
            class="w-5 h-5 mr-2 flex-shrink-0"
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
          <span>{event.time}</span>
        </div>
        <div class="flex items-center sm:col-span-2">
          <svg
            class="w-5 h-5 mr-2 flex-shrink-0"
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
          <span class="break-words">{event.location}</span>
        </div>
      </div>
      <p class="mt-4 text-gray-700">{event.description}</p>
    </div>

    <!-- RSVP Records -->
    <div>
      <h3 class="text-xl font-semibold mb-4">RSVP Records</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each rsvpRecords as record}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm">{record.name}</td>
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
                    on:click={() => handleBurnToken(record.address)}
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
    </div>
  </div>
</div>
