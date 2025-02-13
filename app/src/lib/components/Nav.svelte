<script lang="ts">
  import { walletStore } from "$lib/wallet/walletStore.svelte";
  import {
    connectWallet,
    disconnectWallet,
  } from "$lib/wallet/helpers/connect-wallet";
  let {
    onOpen,
  }: {
    onOpen?(): void;
  } = $props();

  function truncateAddress(address: string) {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
</script>

<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4">
    <div
      class="flex flex-col sm:flex-row justify-between items-center py-4 sm:h-16 space-y-4 sm:space-y-0"
    >
      <div class="text-xl font-bold">RSVP dApp</div>
      <div
        class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
      >
        <button
          onclick={onOpen}
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto"
        >
          Create Event
        </button>
        <button
          onclick={async () => {
            if (!$walletStore.walletAddress) await connectWallet();
            else await disconnectWallet();
          }}
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
        >
          {$walletStore.walletAddress
            ? truncateAddress($walletStore.walletAddress)
            : "Connect Wallet"}
        </button>
      </div>
    </div>
  </div>
</nav>
