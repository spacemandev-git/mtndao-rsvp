<script lang="ts">
  import IconPin from "./icons/IconPin.svelte";
  import IconClock from "./icons/IconClock.svelte";
  import IconCal from "./icons/IconCal.svelte";

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
  const isCreator = true;
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
        <IconCal />
        {event.date}
      </p>
      <p class="flex items-center mb-1">
        <IconClock />
        {event.time}
      </p>
      <p class="flex items-center">
        <IconPin />
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
