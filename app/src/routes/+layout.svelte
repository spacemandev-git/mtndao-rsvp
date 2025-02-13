<script lang="ts">
  import "../app.css";
  let { children } = $props();

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
