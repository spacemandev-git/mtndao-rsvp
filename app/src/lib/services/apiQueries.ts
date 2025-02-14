import { api } from "$lib/services/apiClient";
import {
  createMutation,
  createQuery,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/svelte-query";

// Queries
const queryGetEvents = () =>
  createQuery({
    queryKey: [api.fetch.getEvents.key],
    queryFn: api.fetch.getEvents.fn,
  });

const queryGetMyEvents = (address?: string | null) =>
  createQuery({
    queryKey: [api.fetch.getMyEvents.key],
    queryFn: () => api.fetch.getMyEvents.fn(address as string),
    enabled: !!address && address !== null,
  });

// Mutations
const mutationCreateEvent = () =>
  createMutation({
    mutationKey: [api.post.createEvent.key],
    mutationFn: api.post.createEvent.fn,
  });

const mutationRsvpEvent = () =>
  createMutation({
    mutationKey: [api.post.rsvp.key],
    mutationFn: api.post.rsvp.fn,
  });

const mutationConfirmRsvp = () =>
  createMutation({
    mutationKey: [api.post.confirmRsvp.key],
    mutationFn: api.post.confirmRsvp.fn,
  });

const mutationRemoveEvent = () =>
  createMutation({
    mutationKey: [api.post.removeEvent.key],
    mutationFn: api.post.removeEvent.fn,
  });

export const queries = {
  getEvents: queryGetEvents,
  getMyEvents: queryGetMyEvents,
};

export const mutations = {
  createEvent: mutationCreateEvent,
  rsvpEvent: mutationRsvpEvent,
  confirmRsvp: mutationConfirmRsvp,
  removeEvent: mutationRemoveEvent,
};
