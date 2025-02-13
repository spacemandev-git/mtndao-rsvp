import { api } from "$lib/services/apiClient";
import { createMutation, createQuery } from "@tanstack/svelte-query";

const queryGetEvents = () =>
  createQuery({
    queryKey: [api.fetch.getEvents.key],
    queryFn: api.fetch.getEvents.fn,
  });

const mutationCreateEvent = () =>
  createMutation({
    mutationKey: [api.post.createEvent.key],
    mutationFn: api.post.createEvent.fn,
  });

export const queries = {
  getEvents: queryGetEvents,
};

export const mutations = {
  createEvent: mutationCreateEvent,
};
