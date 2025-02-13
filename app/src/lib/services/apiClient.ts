import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5173/api", // TODO: replace with env. Proxy in VITE
});

async function getEvents() {
  const res = await apiClient.get(`/events`);
  return res.data;
}

// Rsvp to an event as an attendee
async function postRsvpAttendee() {
  const res = await apiClient.get(`/events`);
  return res.data;
}

// Only visible to creator of event
async function getAttendees() {}

// anyone can create an event
async function postEvent() {}

// CONFIRM or BURN an attendee
async function postConfirmRsvp() {}

async function postRemoveEvent() {}

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
  post: {},
};
