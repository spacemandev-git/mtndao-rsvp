import axios from "axios";
import type { EventType } from "$lib/types";

const apiClient = axios.create({
  baseURL: "http://localhost:5173/api", // TODO: replace with env. Proxy in VITE
});

// Get all open events
async function getEvents() {
  const res = await apiClient.get(`/events`);
  return res.data;
}

// RSVP to an event as an attendee
async function postRsvpAttendee(params: {
  eventAddress: string;
  address: string;
}) {
  const res = await apiClient.post(`/event/rsvp`, params);
  return res.data;
}

// Create a new event
async function postEvent(params: {
  name: string;
  description: string;
  lamports: number;
  admin: string;
}) {
  const res = await apiClient.post(`/event/create`, params);
  return res.data;
}

// Confirm or burn an attendee's RSVP
async function postConfirmRsvp(params: {
  event: string;
  attendee: string;
  action: "burn" | "confirm";
  admin: string;
}) {
  const res = await apiClient.post(`/event/confirm`, params);
  return res.data;
}

// Remove an event (admin only)
async function postRemoveEvent(params: { event: string; admin: string }) {
  const res = await apiClient.post(`/event/remove`, params);
  return res.data;
}

/**
 * API Functions & Keys for cache management
 * */
export const api = {
  fetch: {
    getEvents: {
      key: "events",
      fn: getEvents,
    },
  },
  post: {
    rsvp: {
      key: "rsvp",
      fn: postRsvpAttendee,
    },
    createEvent: {
      key: "createEvent",
      fn: postEvent,
    },
    confirmRsvp: {
      key: "confirmRsvp",
      fn: postConfirmRsvp,
    },
    removeEvent: {
      key: "removeEvent",
      fn: postRemoveEvent,
    },
  },
};
