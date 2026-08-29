import httpClient from "./httpClient";

export async function checkoutReservation(reservationId) {
  const { data } = await httpClient.post("/checkout", { reservationId });
  return data;
}
