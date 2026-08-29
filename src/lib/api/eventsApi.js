import httpClient from "./httpClient";

export async function getEvents({ category, search } = {}) {
  const { data } = await httpClient.get("/events", {
    params: { ...(category ? { category } : {}), ...(search ? { search } : {}) },
  });
  return data;
}

export async function getEventById(id) {
  const { data } = await httpClient.get(`/events/${id}`);
  return data;
}

export async function getMyEvents() {
  const { data } = await httpClient.get("/events/mine");
  return data;
}

export async function createEvent(payload) {
  const { data } = await httpClient.post("/events", payload);
  return data;
}
