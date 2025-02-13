<script lang="ts">
  let {
    event,
  }: {
    event: {
      id: string; // onchain address
      title: string;
      date: string;
      time: string;
      location: string;
      description: string;
    };
  } = $props();

  function handleRSVP(eventId: string, action: "rsvp" | "confirm") {}
</script>

<div
  class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
>
  <div class="p-4 sm:p-6">
    <h2 class="text-xl font-semibold mb-2">
      {event.title}
    </h2>
    <div class="text-gray-600 mb-4 text-sm sm:text-base">
      <p class="flex items-center mb-1">
        <svg
          class="w-4 h-4 mr-2 flex-shrink-0"
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
          class="w-4 h-4 mr-2 flex-shrink-0"
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
          class="w-4 h-4 mr-2 flex-shrink-0"
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
      </p>
    </div>
    <p class="text-gray-700 mb-4 text-sm sm:text-base">
      {event.description}
    </p>
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        onclick={() => handleRSVP(event.id, "rsvp")}
        class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        RSVP
      </button>
      <button
        onclick={() => handleRSVP(event.id, "confirm")}
        class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
      >
        Confirm RSVP
      </button>
    </div>
  </div>
</div>
