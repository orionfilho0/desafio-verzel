import httpClient from "./httpClient";

export async function validateTicket({ code, eventId }) {
  const { data } = await httpClient.post("/gate/validate", { code, ...(eventId ? { eventId } : {}) });
  return data;
}
