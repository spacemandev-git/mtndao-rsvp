<script lang="ts">
    import { onMount } from "svelte";
    import { Html5QrcodeScanner } from "html5-qrcode";
    import toast from "svelte-french-toast";

    let { solanaAddress = $bindable() }: { solanaAddress?: string } = $props();

    let result = $state<string>("");
    let error = $state<string>("");
    let scanner: Html5QrcodeScanner;

    const onScanSuccess = (decodedText: string) => {
        toast.success("Address Scanned");
        result = decodedText;
        solanaAddress = decodedText;
        // Optional: Stop scanning after successful scan
        // scanner.clear();
    };

    const onScanError = (errorMessage: string) => {
        error = `QR Code scan error: ${errorMessage}`;
    };

    onMount(() => {
        scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250,
                aspectRatio: 1.0,
                showTorchButtonIfSupported: false,
            },
            false
        );
        scanner.render(onScanSuccess, onScanError);

        return () => {
            scanner?.clear();
        };
    });
</script>

{#snippet qrScanner()}
    <div id="qr-reader" class="w-full max-w-lg mx-auto"></div>
{/snippet}

<div class="container mx-auto p-4">
    {@render qrScanner()}

    <!-- {#if result} -->
    <!--   <div class="mt-4 p-4 bg-green-100 rounded-lg"> -->
    <!--     <h2 class="font-semibold mb-2">Scanned Result:</h2> -->
    <!--     <p class="break-all">{result}</p> -->
    <!--   </div> -->
    <!-- {/if} -->

    <!-- {#if error} -->
    <!--   <div class="mt-4 p-4 bg-red-100 rounded-lg"> -->
    <!--     <p class="text-red-700">{error}</p> -->
    <!--   </div> -->
    <!-- {/if} -->
</div>

<style>
    :global(#qr-reader) {
        width: 100% !important;
        /* Override the library's default styles */
        border: none !important;
        padding: 0 !important;
    }

    :global(#qr-reader__scan_region) {
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    :global(#qr-reader__dashboard) {
        padding: 1rem !important;
    }
</style>
