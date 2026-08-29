const express = require("express");
const { createReservation } = require("../controllers/reservationController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const router = express.Router();

router.post("/", authMiddleware, requireRole("CLIENT"), createReservation);

module.exports = router;
