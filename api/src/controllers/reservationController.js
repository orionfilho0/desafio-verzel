const prisma = require("../config/prisma");

// POST /reservations - protegido, role CLIENT
async function createReservation(req, res) {
  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: "eventId e quantity (maior que zero) são obrigatórios." });
    }

    const qty = Number(quantity);

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    const total = event.price * qty;

    const reservation = await prisma.$transaction(async (tx) => {
      const updateResult = await tx.event.updateMany({
        where: {
          id: eventId,
          availableTickets: { gte: qty },
        },
        data: {
          availableTickets: { decrement: qty },
        },
      });

      if (updateResult.count === 0) {
        throw new Error("SOLD_OUT");
      }

      return tx.reservation.create({
        data: {
          eventId,
          userId: req.user.id,
          quantity: qty,
          total,
          status: "PENDING",
        },
      });
    });

    return res.status(201).json(reservation);
  } catch (err) {
    if (err.message === "SOLD_OUT") {
      return res.status(409).json({ error: "Não há ingressos suficientes disponíveis para esse evento." });
    }
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar reserva." });
  }
}

module.exports = { createReservation };