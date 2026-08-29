const express = require("express");
const {
  listEvents,
  getEventById,
  createEvent,
  listMyEvents,
} = require("../controllers/eventController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const router = express.Router();

// Rotas públicas
router.get("/", listEvents);

// Rota do organizador (precisa vir antes de "/:id" para não conflitar)
router.get("/mine", authMiddleware, requireRole("ORGANIZER"), listMyEvents);

router.get("/:id", getEventById);

// Rota protegida do organizador
router.post("/", authMiddleware, requireRole("ORGANIZER"), createEvent);

module.exports = router;
