import httpClient from "./httpClient";
import { getStoredUser } from "./authApi";

function normalizeTicket(ticket) {
  return {
    ...ticket,
    status: String(ticket.status || "").toLowerCase(),
    holderName: getStoredUser()?.name || "Titular do ingresso",
  };
}

export async function getMyTickets() {
  const { data } = await httpClient.get("/tickets/me");
  return data.map(normalizeTicket);
}

export async function getTicketById(id) {
  const { data } = await httpClient.get(`/tickets/${id}`);
  return normalizeTicket(data);
}
