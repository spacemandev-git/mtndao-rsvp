<script lang="ts">
    import type { EventType, EventResponse } from "$lib/types";
    import IconCal from "./icons/IconCal.svelte";
    import IconClock from "./icons/IconClock.svelte";
    import IconPin from "./icons/IconPin.svelte";
    import QrScanner from "./QrScanner.svelte";

    let {
        event,
        onClose,
    }: {
        event: EventResponse;
        onClose(): void;
    } = $props();

    let activeTab = $state<"details" | "scanner">("scanner");

    let solanaAddress = $state("");
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
            <h2 class="text-2xl font-bold mb-4">{event.account.eventName}</h2>

            {@render tabNavigation()}

            <!-- Tab Content -->
            {#if activeTab === "details"}{:else}
                <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
                    <QrScanner bind:solanaAddress />
                    <div>
                        <input
                            class="bg-white p-2 w-full"
                            placeholder="Solana Address"
                            bind:value={solanaAddress}
                        />
                    </div>
                    <div class="flex justify-between gap-2">
                        <button class="bg-green-100 py-2 px-4 rounded w-full">
                            Confirm
                        </button>
                        <button class="bg-red-100 py-2 px-4 rounded w-full">
                            Burn
                        </button>
                    </div>
                </div>
            {/if}
        </div>

        <!-- RSVP Records -->
    </div>
</div>
