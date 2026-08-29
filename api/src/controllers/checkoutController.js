const prisma = require("../config/prisma");
const { generateManualCode, generateTicketToken, generateQrCode } = require("../utils/ticketUtils");
const crypto = require("crypto");

// POST /checkout - protegido, role CLIENT
// Simula um pagamento: aprova ou recusa aleatoriamente.
// Se aprovado, gera os Tickets (um por unidade da reserva) com QR code e status VALID.
async function checkout(req, res) {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "reservationId é obrigatório." });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { event: true },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ error: "Essa reserva não pertence a este usuário." });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ error: "Essa reserva já foi processada." });
    }

    // Simulação: 80% de chance de aprovação
    const approved = Math.random() < 0.8;

    if (!approved) {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "REJECTED" },
      });

      await prisma.event.update({
        where: { id: reservation.eventId },
        data: { availableTickets: { increment: reservation.quantity } },
      });

      return res.json({ status: "rejected", message: "Pagamento recusado. Tente novamente." });
    }

    const tickets = [];

    for (let i = 0; i < reservation.quantity; i++) {
      const code = generateManualCode();
      const ticketId = crypto.randomUUID();
      const token = generateTicketToken(ticketId);
      const qrCode = await generateQrCode(token);

      const ticket = await prisma.ticket.create({
        data: {
          id: ticketId,
          reservationId: reservation.id,
          eventId: reservation.eventId,
          userId: reservation.userId,
          code,
          qrCode,
          status: "VALID",
        },
      });

      tickets.push(ticket);
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "APPROVED" },
    });

    return res.json({ status: "approved", tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao processar checkout." });
  }
}

module.exports = { checkout };