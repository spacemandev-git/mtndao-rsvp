import { api } from "$lib/services/apiClient";
import { createQuery } from "@tanstack/svelte-query";

const queryGetEvents = () =>
  createQuery({
    queryKey: [api.fetch.getEvents.key],
    queryFn: api.fetch.getEvents.fn,
  });

export const queries = {
  getEvents: queryGetEvents,
};
