const prisma = require("../config/prisma");

// GET /tickets/me - protegido, ingressos do usuário logado
async function listMyTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(tickets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar seus ingressos." });
  }
}

// GET /tickets/:id - PÚBLICO (acessado via link compartilhado, sem autenticação)
async function getTicketById(req, res) {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ingresso não encontrado." });
    }

    return res.json(ticket);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar ingresso." });
  }
}

module.exports = { listMyTickets, getTicketById };
