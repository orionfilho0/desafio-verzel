const prisma = require("../config/prisma");

// GET /events - lista pública, com filtro opcional por categoria e busca por título
async function listEvents(req, res) {
  try {
    const { category, search } = req.query;

    const events = await prisma.event.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(search
          ? { title: { contains: search, mode: "insensitive" } }
          : {}),
      },
      orderBy: { eventDate: "asc" },
    });

    return res.json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar eventos." });
  }
}

// GET /events/:id - detalhe público
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    return res.json(event);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar evento." });
  }
}

// POST /events - protegido, role ORGANIZER
async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      category,
      eventDate,
      location,
      capacity,
      price,
      imageUrl,
      tmdbId,
    } = req.body;

    if (!title || !description || !category || !eventDate || !location || !capacity || price == null) {
      return res.status(400).json({ error: "Campos obrigatórios faltando para criar o evento." });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        eventDate: new Date(eventDate),
        location,
        capacity: Number(capacity),
        availableTickets: Number(capacity),
        price: Number(price),
        imageUrl: imageUrl || null,
        tmdbId: tmdbId ? Number(tmdbId) : null,
        organizerId: req.user.id,
      },
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar evento." });
  }
}

// GET /events/mine - protegido, role ORGANIZER
async function listMyEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      where: { organizerId: req.user.id },
      include: {
        _count: { select: { tickets: true } },
      },
      orderBy: { eventDate: "asc" },
    });

    const formatted = events.map((event) => {
      let status = "active";
      if (event.availableTickets <= 0) {
        status = "sold_out";
      } else if (new Date(event.eventDate) < new Date()) {
        status = "finished";
      }

      return {
        id: event.id,
        title: event.title,
        eventDate: event.eventDate,
        location: event.location,
        capacity: event.capacity,
        availableTickets: event.availableTickets,
        soldTickets: event._count.tickets,
        status,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar seus eventos." });
  }
}

module.exports = { listEvents, getEventById, createEvent, listMyEvents };
