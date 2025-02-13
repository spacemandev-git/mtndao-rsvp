<script lang="ts">
    import IconPin from "./icons/IconPin.svelte";
    import IconClock from "./icons/IconClock.svelte";
    import IconCal from "./icons/IconCal.svelte";
    import ModalManageEvent from "./ModalManageEvent.svelte";
    import type { EventType, EventResponse } from "$lib/types";

    let {
        event,
    }: {
        event: EventResponse;
    } = $props();

    function handleRSVP(eventId: string, action: "rsvp" | "confirm") {}
    const isCreator = false;

    let isOpen = $state(false);
    function onOpen() {
        isOpen = true;
    }
    function onClose() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <ModalManageEvent {event} {onClose} />
{/if}

<div
    class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
>
    <div class="p-4 sm:p-6">
        <h2 class="text-xl font-semibold mb-2">
            {event.account.eventName}
        </h2>
        <div
            class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
        >
            {#if isCreator}
                <button
                    onclick={onOpen}
                    class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                    Manage
                </button>
            {:else}
                <button
                    onclick={() => handleRSVP(event.publicKey, "rsvp")}
                    class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    RSVP
                </button>
            {/if}
        </div>
    </div>
</div>
