import httpClient from "./httpClient";

export async function createReservation({ eventId, quantity }) {
  const { data } = await httpClient.post("/reservations", { eventId, quantity });
  return data;
}
