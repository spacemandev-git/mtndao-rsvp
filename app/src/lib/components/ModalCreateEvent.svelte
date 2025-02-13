<script lang="ts">
    import type { EventType } from "$lib/types";
    import {
        Connection,
        PublicKey,
        Transaction,
        VersionedMessage,
        VersionedTransaction,
        sendAndConfirmTransaction,
    } from "@solana/web3.js";
    import { Buffer } from "buffer";
    let {
        onClose = () => {},
    }: {
        onClose?(): void;
    } = $props();
    import { mutations } from "$lib/services/apiQueries";
    import { walletStore } from "$lib/wallet/walletStore.svelte";

    let price = $state(1);
    let tx: VersionedTransaction | undefined = $state(undefined);

    let newEvent = $state<{
        name: string;
        description: string;
        lamports: number;
        admin: string;
    }>({
        name: "",
        description: "",
        lamports: 1 * 1e7,
        admin: $walletStore.walletAddress ?? "",
    });

    const mutate = mutations.createEvent();

    async function createEvent() {
        if (!$walletStore.walletAddress)
            return console.error("Wallet not connected");
        $mutate.mutate({
            ...newEvent,
            lamports: (price * 1e7).toString(),
        });

        const response = $mutate.data;

        console.log({ response });

        const deserializedMsg = VersionedMessage.deserialize(
            Uint8Array.from(Buffer.from(response.msg, "base64"))
        );

        tx = new VersionedTransaction(deserializedMsg);

        // onClose();
    }

    async function signTransaction() {
        const connection = new Connection(
            "https://nerissa-3i7at8-fast-mainnet.helius-rpc.com/"
        );

        if (!tx) return console.error("No transaction provided");

        const wallet = window.solana;
        if (!wallet) return console.error("Wallet not connected");

        try {
            console.log("Transaction before signing:", tx);

            // Request signature from the wallet
            const signedTx = await (wallet as any).signTransaction(tx);
            console.log("Signed transaction:", signedTx);

            // Send the transaction
            const txId = await connection.sendRawTransaction(
                signedTx.serialize()
            );
            console.log("Transaction ID:", txId);

            return txId;
        } catch (err) {
            console.error("Transaction signing error:", err);
        }
    }
</script>

<div
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
    <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-bold mb-4">Create New Event</h2>

        <form class="space-y-4" onsubmit={createEvent}>
            <!-- Title -->
            <div>
                <label
                    for="title"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    bind:value={newEvent.name}
                    placeholder="Event Title"
                    required
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <!-- Description -->
            <div>
                <label
                    for="description"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    bind:value={newEvent.description}
                    placeholder="Event Description"
                    required
                    rows="3"
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>

            <div>
                <label
                    for="title"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Deposit Cost
                </label>
                <input
                    id="title"
                    type="number"
                    bind:value={price}
                    placeholder="Event Title"
                    required
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <!-- Date -->
            <!-- <div> -->
            <!--   <label for="date" class="block text-sm font-medium text-gray-700 mb-1"> -->
            <!--     Date -->
            <!--   </label> -->
            <!--   <input -->
            <!--     id="date" -->
            <!--     type="date" -->
            <!--     bind:value={newEvent.date} -->
            <!--     required -->
            <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
            <!--   /> -->
            <!-- </div> -->

            <!-- Time -->
            <!-- <div> -->
            <!--   <label for="time" class="block text-sm font-medium text-gray-700 mb-1"> -->
            <!--     Time -->
            <!--   </label> -->
            <!--   <input -->
            <!--     id="time" -->
            <!--     type="time" -->
            <!--     bind:value={newEvent.time} -->
            <!--     required -->
            <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
            <!--   /> -->
            <!-- </div> -->

            <!-- Location -->
            <!-- <div> -->
            <!--   <label -->
            <!--     for="location" -->
            <!--     class="block text-sm font-medium text-gray-700 mb-1" -->
            <!--   > -->
            <!--     Location -->
            <!--   </label> -->
            <!--   <input -->
            <!--     id="location" -->
            <!--     type="text" -->
            <!--     bind:value={newEvent.location} -->
            <!--     placeholder="Event Location" -->
            <!--     required -->
            <!--     class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" -->
            <!--   /> -->
            <!-- </div> -->

            <!-- Buttons -->
            <div
                class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4"
            >
                <button
                    type="button"
                    onclick={onClose}
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                    Cancel
                </button>
                {#if tx === undefined}
                    <button
                        type="submit"
                        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
                    >
                        prepare
                    </button>
                {:else}
                    <button
                        onclick={() => signTransaction()}
                        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
                    >
                        sign
                    </button>
                {/if}
            </div>
        </form>
    </div>
</div>
