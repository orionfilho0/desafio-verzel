const prisma = require("../config/prisma");
const { verifyTicketToken } = require("../utils/ticketUtils");

// POST /gate/validate - protegido, role GATE
// Aceita { code } que pode ser o valor lido do QR (token JWT assinado) OU o código
// curto digitado manualmente, e opcionalmente { eventId }.
async function validateTicket(req, res) {
  try {
    const { code, eventId } = req.body;

    if (!code) {
      return res.status(400).json({ error: "code é obrigatório." });
    }

    const ticketIdFromToken = verifyTicketToken(code);

    const ticket = ticketIdFromToken
      ? await prisma.ticket.findUnique({ where: { id: ticketIdFromToken }, include: { event: true } })
      : await prisma.ticket.findUnique({ where: { code }, include: { event: true } });

    if (!ticket) {
      return res.json({ status: "invalid", message: "Ingresso não encontrado ou QR inválido." });
    }

    if (eventId && ticket.eventId !== eventId) {
      return res.json({ status: "wrong_event", message: "Este ingresso é de outro evento." });
    }

    if (ticket.status === "USED") {
      return res.json({ status: "already_used", message: "Este ingresso já foi utilizado." });
    }

    if (ticket.status === "EXPIRED") {
      return res.json({ status: "invalid", message: "Este ingresso está expirado." });
    }

    const updateResult = await prisma.ticket.updateMany({
      where: { id: ticket.id, status: "VALID" },
      data: { status: "USED" },
    });

    if (updateResult.count === 0) {
      return res.json({ status: "already_used", message: "Este ingresso já foi utilizado." });
    }

    return res.json({
      status: "valid",
      message: "Ingresso válido. Entrada liberada.",
      ticket: { id: ticket.id, event: ticket.event.title },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao validar ingresso." });
  }
}

module.exports = { validateTicket };