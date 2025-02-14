<script lang="ts">
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  let { children } = $props();

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <Toaster />
  {@render children()}
</QueryClientProvider>
