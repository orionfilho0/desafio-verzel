const express = require("express");
const { listMyTickets, getTicketById } = require("../controllers/ticketController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Rota protegida (precisa vir antes de "/:id")
router.get("/me", authMiddleware, listMyTickets);

// Rota pública - acessada pelo link compartilhado, sem autenticação
router.get("/:id", getTicketById);

module.exports = router;
